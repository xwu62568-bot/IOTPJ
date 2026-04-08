import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ChevronDown, Clock, Moon, Power, Save, Sun, Thermometer, Trash2, Zap } from 'lucide-react';
import {
  controlStrategies, devices, dryContactDeviceTypes, sensors, linkageTemplates,
  type ControlStrategyDefinition, type DryContactPort, type SensorData, type StrategyPeriodConfig,
  type StrategyStageDefinition,
} from '../../data/mock-data';

interface Props {
  paramKey: string;
  paramLabel: string;
  currentValue: string;
  unit: string;
  preferredSensorId?: string | null;
  onBack: () => void;
}

type IoAction = 'on' | 'off';

interface SelectedDeviceAction {
  id: string;
  deviceId: string;
  portId: number;
  portName: string;
  deviceType: string;
  /** 该侧越限时对接点执行开启(on)还是关闭(off) */
  ioAction: IoAction;
}

interface StrategyUiCopy {
  rangeTitle: string;
  targetLabel: string;
  upperOffsetLabel: string;
  lowerOffsetLabel: string;
  feedbackTitle: string;
  feedbackHint: string;
  deviceTitle: string;
  deviceEmptyText: string;
  deviceHint: string;
}

const strategyUiCopy: Record<string, StrategyUiCopy> = {
  temperature: {
    rangeTitle: '温控目标区间',
    targetLabel: '目标温度',
    upperOffsetLabel: '上偏移',
    lowerOffsetLabel: '下偏移',
    feedbackTitle: '温度反馈传感器',
    feedbackHint: '选择参与本策略反馈控制的温度测点。',
    deviceTitle: '温控执行设备',
    deviceEmptyText: '还没有配置温控执行设备',
    deviceHint: '请绑定风机、开窗、湿帘或其他温控执行设备。',
  },
  humidity: {
    rangeTitle: '湿度目标区间',
    targetLabel: '目标湿度',
    upperOffsetLabel: '上偏移',
    lowerOffsetLabel: '下偏移',
    feedbackTitle: '湿度反馈传感器',
    feedbackHint: '选择参与本策略反馈控制的湿度测点。',
    deviceTitle: '湿度执行设备',
    deviceEmptyText: '还没有配置湿度执行设备',
    deviceHint: '请绑定加湿器、除湿机或通风设备。',
  },
  co2: {
    rangeTitle: '浓度目标区间',
    targetLabel: '目标浓度',
    upperOffsetLabel: '上偏移',
    lowerOffsetLabel: '下偏移',
    feedbackTitle: '浓度反馈传感器',
    feedbackHint: '选择用于 CO₂ 补气与排气控制的浓度测点。',
    deviceTitle: '补气/排气设备',
    deviceEmptyText: '还没有配置 CO₂ 执行设备',
    deviceHint: '请绑定 CO₂ 电磁阀、新风或排气设备。',
  },
  light: {
    rangeTitle: '光照目标区间',
    targetLabel: '目标光照',
    upperOffsetLabel: '上偏移',
    lowerOffsetLabel: '下偏移',
    feedbackTitle: '光照反馈传感器',
    feedbackHint: '选择用于补光与遮阳控制的光照测点。',
    deviceTitle: '补光/遮阳设备',
    deviceEmptyText: '还没有配置补光或遮阳设备',
    deviceHint: '请绑定补光灯或遮阳执行设备。',
  },
  vpd: {
    rangeTitle: 'VPD 目标区间',
    targetLabel: '目标 VPD',
    upperOffsetLabel: '上偏移',
    lowerOffsetLabel: '下偏移',
    feedbackTitle: '',
    feedbackHint: '',
    deviceTitle: 'VPD 调节设备',
    deviceEmptyText: '还没有配置 VPD 调节设备',
    deviceHint: '请绑定加湿、除湿、湿帘或通风设备。',
  },
  soilHumidity: {
    rangeTitle: '灌溉控制区间',
    targetLabel: '目标含水率',
    upperOffsetLabel: '上偏移',
    lowerOffsetLabel: '下偏移',
    feedbackTitle: '基质反馈传感器',
    feedbackHint: '选择用于灌溉控制的基质湿度测点。',
    deviceTitle: '灌溉执行设备',
    deviceEmptyText: '还没有配置灌溉执行设备',
    deviceHint: '请绑定灌溉泵、电磁阀等灌溉设备。',
  },
  waterLevel: {
    rangeTitle: '液位控制区间',
    targetLabel: '目标液位',
    upperOffsetLabel: '上偏移',
    lowerOffsetLabel: '下偏移',
    feedbackTitle: '液位反馈传感器',
    feedbackHint: '选择用于补液控制的液位测点。',
    deviceTitle: '补液执行设备',
    deviceEmptyText: '还没有配置补液执行设备',
    deviceHint: '请绑定补水阀、配肥泵等补液设备。',
  },
};

function resolveMetric(sensor: SensorData, paramKey: string) {
  return sensor.metrics.find(metric => metric.paramKey === paramKey);
}

function getConfiguredPorts(): { deviceId: string; deviceName: string; port: DryContactPort }[] {
  const ports: { deviceId: string; deviceName: string; port: DryContactPort }[] = [];

  devices.forEach(device => {
    if (device.type === 'dry-contact' && device.ports) {
      device.ports
        .filter(port => port.configured)
        .forEach(port => {
          ports.push({ deviceId: device.id, deviceName: device.name, port });
        });
    }
  });

  return ports;
}

function deviceTypeLabel(deviceType: string) {
  return dryContactDeviceTypes.find(item => item.key === deviceType)?.label || deviceType;
}

function deviceTypeIcon(deviceType: string) {
  return dryContactDeviceTypes.find(item => item.key === deviceType)?.icon || '⚙️';
}

function formatControlValue(value: number, unit: string) {
  return value.toFixed(unit === '%' ? 0 : 2).replace(/\.?0+$/, '');
}

function actionsFromStages(stages: StrategyStageDefinition[] | undefined, when: 'above' | 'below'): SelectedDeviceAction[] {
  const out: SelectedDeviceAction[] = [];
  const seen = new Set<string>();
  for (const stage of stages || []) {
    if (stage.triggerWhen !== when) continue;
    for (const action of stage.actions) {
      const key = `${action.deviceId}-${action.portId}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({
        id: action.id,
        deviceId: action.deviceId,
        portId: action.portId,
        portName: action.portName,
        deviceType: action.deviceType,
        ioAction: action.action === 'off' ? 'off' : 'on',
      });
    }
  }
  return out;
}

function pickFeedbackSensorId(
  paramKey: string,
  strategy: ControlStrategyDefinition | undefined,
  preferredSensorId: string | null | undefined,
): string {
  const candidates = sensors.filter(sensor => resolveMetric(sensor, paramKey));
  const pick = (id: string | null | undefined) =>
    id && candidates.some(s => s.id === id) ? id : null;
  return (
    pick(preferredSensorId) ??
    pick(strategy?.sourceBinding.primarySensorId) ??
    candidates[0]?.id ??
    ''
  );
}

export function LinkageStrategy({ paramKey, paramLabel, currentValue, unit, preferredSensorId = null, onBack }: Props) {
  const strategy = controlStrategies.find(item => item.paramKey === paramKey) as ControlStrategyDefinition | undefined;
  const linkageMeta = linkageTemplates[paramKey];
  const uiCopy = strategyUiCopy[paramKey] || {
    rangeTitle: '控制目标区间',
    targetLabel: '目标值',
    upperOffsetLabel: '上偏移',
    lowerOffsetLabel: '下偏移',
    feedbackTitle: '控制反馈传感器',
    feedbackHint: '选择用于反馈控制的传感器。',
    deviceTitle: '执行设备',
    deviceEmptyText: '还没有配置执行设备',
    deviceHint: '请至少选择一个执行设备。',
  };
  const candidateSensors = sensors.filter(sensor => resolveMetric(sensor, paramKey));
  const candidatePorts = useMemo(() => getConfiguredPorts(), []);
  const initialDayNightSplit = strategy?.dayNightSplit ?? false;

  const initialSensorId = pickFeedbackSensorId(paramKey, strategy, preferredSensorId);

  const [selectedSensorId, setSelectedSensorId] = useState(initialSensorId);
  const [selectedPortKeyAbove, setSelectedPortKeyAbove] = useState('');
  const [selectedPortKeyBelow, setSelectedPortKeyBelow] = useState('');
  const [dayAboveDevices, setDayAboveDevices] = useState<SelectedDeviceAction[]>(() =>
    actionsFromStages(strategy?.day.stages, 'above'));
  const [dayBelowDevices, setDayBelowDevices] = useState<SelectedDeviceAction[]>(() =>
    actionsFromStages(strategy?.day.stages, 'below'));
  const [nightAboveDevices, setNightAboveDevices] = useState<SelectedDeviceAction[]>(() =>
    actionsFromStages(strategy?.night.stages, 'above'));
  const [nightBelowDevices, setNightBelowDevices] = useState<SelectedDeviceAction[]>(() =>
    actionsFromStages(strategy?.night.stages, 'below'));
  const [dayNightSplit, setDayNightSplit] = useState(initialDayNightSplit);
  const [activePeriod, setActivePeriod] = useState<'day' | 'night'>('day');
  const [dayPeriod, setDayPeriod] = useState<StrategyPeriodConfig>(strategy?.day || {
    label: '白天',
    setpoint: { target: Number(currentValue) || 0, upperOffset: 0, lowerOffset: 0, hysteresis: 0, delaySeconds: 0 },
    stages: [],
  });
  const [nightPeriod, setNightPeriod] = useState<StrategyPeriodConfig>(strategy?.night || {
    label: '夜间',
    setpoint: { target: Number(currentValue) || 0, upperOffset: 0, lowerOffset: 0, hysteresis: 0, delaySeconds: 0 },
    stages: [],
  });

  const safeSensorValue = candidateSensors.some(s => s.id === selectedSensorId)
    ? selectedSensorId
    : pickFeedbackSensorId(paramKey, strategy, preferredSensorId);

  useEffect(() => {
    if (safeSensorValue !== selectedSensorId) setSelectedSensorId(safeSensorValue);
  }, [safeSensorValue, selectedSensorId]);

  const selectedSensor = candidateSensors.find(sensor => sensor.id === safeSensorValue);
  const selectedSensorMetric = selectedSensor ? resolveMetric(selectedSensor, paramKey) : null;
  const currentPeriod = activePeriod === 'day' ? dayPeriod : nightPeriod;
  const isEditingDay = !dayNightSplit || activePeriod === 'day';
  const aboveDevices = isEditingDay ? dayAboveDevices : nightAboveDevices;
  const belowDevices = isEditingDay ? dayBelowDevices : nightBelowDevices;
  const lowerLimit = currentPeriod.setpoint.target - currentPeriod.setpoint.lowerOffset;
  const upperLimit = currentPeriod.setpoint.target + currentPeriod.setpoint.upperOffset;
  const hysteresis = Math.max(0, Number(currentPeriod.setpoint.hysteresis) || 0);
  const highSideClearBelow = upperLimit - hysteresis;
  const lowSideClearAbove = lowerLimit + hysteresis;
  const highActionLabel = linkageMeta?.upLabel || '降调节';
  const lowActionLabel = linkageMeta?.downLabel || '升调节';
  const hasDirectFeedbackSensor = candidateSensors.length > 0;
  const showFeedbackModule = paramKey !== 'vpd' && hasDirectFeedbackSensor;
  const hasAnyBoundDevice = aboveDevices.length > 0 || belowDevices.length > 0;

  const updateAboveDevices = (updater: (devices: SelectedDeviceAction[]) => SelectedDeviceAction[]) => {
    if (isEditingDay) setDayAboveDevices(updater);
    else setNightAboveDevices(updater);
  };
  const updateBelowDevices = (updater: (devices: SelectedDeviceAction[]) => SelectedDeviceAction[]) => {
    if (isEditingDay) setDayBelowDevices(updater);
    else setNightBelowDevices(updater);
  };

  const updateCurrentPeriod = (updater: (period: StrategyPeriodConfig) => StrategyPeriodConfig) => {
    if (activePeriod === 'day') {
      setDayPeriod(prev => updater(prev));
      return;
    }

    setNightPeriod(prev => updater(prev));
  };

  const updateSetpoint = (
    field: keyof StrategyPeriodConfig['setpoint'],
    value: string,
  ) => {
    const numeric = Number(value);
    updateCurrentPeriod(period => ({
      ...period,
      setpoint: {
        ...period.setpoint,
        [field]: Number.isNaN(numeric) ? 0 : numeric,
      },
    }));
  };

  const addDevice = (portKey: string, side: 'above' | 'below') => {
    const [deviceId, rawPortId] = portKey.split(':');
    const portId = Number(rawPortId);
    const matched = candidatePorts.find(item => item.deviceId === deviceId && item.port.id === portId);
    if (!matched) return;

    const list = side === 'above' ? aboveDevices : belowDevices;
    const exists = list.some(item => item.deviceId === deviceId && item.portId === portId);
    if (exists) return;

    const row: SelectedDeviceAction = {
      id: `${deviceId}-${portId}-${side}-${Date.now()}`,
      deviceId,
      portId,
      portName: matched.port.name,
      deviceType: matched.port.deviceType || matched.port.type,
      ioAction: 'on',
    };
    if (side === 'above') {
      updateAboveDevices(prev => [...prev, row]);
      setSelectedPortKeyAbove('');
    } else {
      updateBelowDevices(prev => [...prev, row]);
      setSelectedPortKeyBelow('');
    }
  };

  const removeDevice = (id: string, side: 'above' | 'below') => {
    if (side === 'above') updateAboveDevices(prev => prev.filter(item => item.id !== id));
    else updateBelowDevices(prev => prev.filter(item => item.id !== id));
  };

  const setDeviceIoAction = (id: string, side: 'above' | 'below', ioAction: IoAction) => {
    const patch = (prev: SelectedDeviceAction[]) =>
      prev.map(item => (item.id === id ? { ...item, ioAction } : item));
    if (side === 'above') updateAboveDevices(patch);
    else updateBelowDevices(patch);
  };

  return (
    <div className="space-y-4 -m-4 p-4 pb-24">
      <div className="flex items-center gap-3 mb-2">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h3 className="text-[16px]">{linkageMeta?.label || `${paramLabel} 联动策略`}</h3>
          <p className="text-[11px] text-gray-400">{linkageMeta?.description || '控制目标、数据来源与执行设备配置'}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="text-[12px] text-gray-400 mb-1">当前实时值</div>
        <div className="text-[28px] text-emerald-600">
          {currentValue}<span className="text-[14px] ml-1">{unit}</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-500" />
          <span className="text-[13px]">时段控制模式</span>
        </div>
          <button
            onClick={() => setDayNightSplit(prev => !prev)}
            className={`px-3 py-1.5 rounded-full text-[12px] ${
              dayNightSplit ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {dayNightSplit ? '已开启' : '已关闭'}
          </button>
        </div>

        {dayNightSplit && (
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setActivePeriod('day')}
              className={`flex-1 py-2 rounded-lg text-[13px] flex items-center justify-center gap-1.5 ${
                activePeriod === 'day' ? 'bg-white text-amber-600 shadow-sm' : 'text-gray-500'
              }`}
            >
              <Sun className="w-4 h-4" /> 白天
            </button>
            <button
              onClick={() => setActivePeriod('night')}
              className={`flex-1 py-2 rounded-lg text-[13px] flex items-center justify-center gap-1.5 ${
                activePeriod === 'night' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'
              }`}
            >
              <Moon className="w-4 h-4" /> 夜间
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-emerald-500" />
          <span className="text-[13px]">{dayNightSplit ? (activePeriod === 'day' ? '白天' : '夜间') : ''}{uiCopy.rangeTitle}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <div>
            <label className="text-[11px] text-gray-400 block mb-1">{uiCopy.targetLabel}</label>
            <input
              value={currentPeriod.setpoint.target}
              onChange={event => updateSetpoint('target', event.target.value)}
              className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-[13px] text-center outline-none border border-gray-100"
            />
          </div>
          <div>
            <label className="text-[11px] text-gray-400 block mb-1">{uiCopy.upperOffsetLabel}</label>
            <input
              value={currentPeriod.setpoint.upperOffset}
              onChange={event => updateSetpoint('upperOffset', event.target.value)}
              className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-[13px] text-center outline-none border border-gray-100"
            />
          </div>
          <div>
            <label className="text-[11px] text-gray-400 block mb-1">{uiCopy.lowerOffsetLabel}</label>
            <input
              value={currentPeriod.setpoint.lowerOffset}
              onChange={event => updateSetpoint('lowerOffset', event.target.value)}
              className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-[13px] text-center outline-none border border-gray-100"
            />
          </div>
          <div>
            <label className="text-[11px] text-gray-400 block mb-1">回差</label>
            <input
              value={currentPeriod.setpoint.hysteresis}
              onChange={event => updateSetpoint('hysteresis', event.target.value)}
              className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-[13px] text-center outline-none border border-gray-100"
            />
            <p className="text-[10px] text-gray-400 mt-1 leading-snug">与当前参数同单位，上下两侧共用同一回差。</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-3 text-[12px] text-gray-600">
          控制区间：
          <span className="text-emerald-600 mx-1">
            {formatControlValue(lowerLimit, unit)}
            {' '}~{' '}
            {formatControlValue(upperLimit, unit)}
            {unit}
          </span>
        </div>

        <div className="bg-emerald-50 rounded-xl p-3 text-[12px] text-emerald-700 space-y-1.5">
          <div>
            触发条件：
            <span className="mx-1">高于 {formatControlValue(upperLimit, unit)}{unit}</span>
            执行{highActionLabel}；
            <span className="mx-1">低于 {formatControlValue(lowerLimit, unit)}{unit}</span>
            执行{lowActionLabel}。
          </div>
          {hysteresis > 0 ? (
            <div className="text-emerald-800/90">
              回差 {formatControlValue(hysteresis, unit)}
              {unit}：上侧在测量值降至
              <span className="mx-0.5">{formatControlValue(highSideClearBelow, unit)}{unit}</span>
              以下后结束动作；下侧在升至
              <span className="mx-0.5">{formatControlValue(lowSideClearAbove, unit)}{unit}</span>
              以上后结束动作。
            </div>
          ) : (
            <div className="text-emerald-800/80">
              回差为 0 时，结束动作与触发使用同一阈值，环境小幅波动时设备可能频繁切换，可适当加大回差。
            </div>
          )}
        </div>

        {paramKey === 'vpd' && (
          <div className="bg-purple-50 rounded-xl p-3 text-[12px] text-purple-700">
            VPD 由系统根据已配置的温湿度数据计算，无需在此单独指定探头；目标、回差与本页绑定设备照常生效。
          </div>
        )}
      </div>

      {showFeedbackModule && (
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-emerald-500" />
            <span className="text-[13px]">{uiCopy.feedbackTitle}</span>
          </div>

          <div className="text-[11px] text-gray-400">{uiCopy.feedbackHint}</div>

          <div className="relative">
            <select
              id={`linkage-feedback-sensor-${paramKey}`}
              name={`linkage-feedback-sensor-${paramKey}`}
              autoComplete="off"
              key={`linkage-sensor-select-${paramKey}`}
              value={safeSensorValue}
              onChange={event => setSelectedSensorId(event.target.value)}
              className="w-full appearance-none bg-gray-50 rounded-xl px-3 py-3 text-[14px] outline-none border border-gray-100"
            >
              {candidateSensors.map(sensor => {
                const metric = resolveMetric(sensor, paramKey);
                return (
                  <option key={sensor.id} value={sensor.id}>
                    {sensor.name} · ID:{sensor.id} · 当前 {metric?.value ?? '--'}{metric?.unit || ''}
                  </option>
                );
              })}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {selectedSensor && (
            <div className="bg-emerald-50 rounded-xl p-3">
              <div className="text-[12px] text-emerald-700">{selectedSensor.name}</div>
              <div className="text-[11px] text-emerald-600 mt-0.5">
                型号 {selectedSensor.model} · 当前反馈值 {selectedSensorMetric?.value ?? '--'}{selectedSensorMetric?.unit || ''}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Power className="w-4 h-4 text-emerald-500" />
          <div>
            <span className="text-[13px]">{uiCopy.deviceTitle}</span>
            <p className="text-[10px] text-gray-400 mt-0.5">
              上越限与下越限可分别绑定设备，并为每个端口选择开启或关闭。
            </p>
          </div>
        </div>

        {/* 高于上界 → 降调节等 */}
        <div className="space-y-2 rounded-xl border border-amber-100 bg-amber-50/40 p-3">
          <div>
            <div className="text-[12px] text-amber-900 font-medium">
              高于 {formatControlValue(upperLimit, unit)}{unit}
              <span className="text-amber-700 font-normal"> · {highActionLabel}</span>
            </div>
            {hysteresis > 0 && (
              <div className="text-[10px] text-amber-800/85 mt-1">
                结束动作：测量值 ≤ {formatControlValue(highSideClearBelow, unit)}{unit}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <select
                value={selectedPortKeyAbove}
                onChange={event => setSelectedPortKeyAbove(event.target.value)}
                className="w-full appearance-none bg-white rounded-xl px-3 py-2.5 text-[13px] outline-none border border-amber-100/80"
              >
                <option value="">选择设备</option>
                {candidatePorts.map(item => (
                  <option key={`a-${item.deviceId}:${item.port.id}`} value={`${item.deviceId}:${item.port.id}`}>
                    {item.port.name} · {item.deviceName} · #{item.port.id}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <button
              type="button"
              onClick={() => selectedPortKeyAbove && addDevice(selectedPortKeyAbove, 'above')}
              className="px-3 rounded-xl bg-amber-600 text-white text-[12px] whitespace-nowrap"
            >
              添加
            </button>
          </div>
          {aboveDevices.length === 0 ? (
            <div className="bg-white/70 rounded-lg py-3 text-center text-[11px] text-gray-400">
              本侧尚无设备，{uiCopy.deviceHint}
            </div>
          ) : (
            <div className="space-y-2">
              {aboveDevices.map(device => (
                <div key={device.id} className="bg-white rounded-xl p-2.5 flex items-center gap-2 border border-amber-100/60">
                  <span className="text-[14px]">{deviceTypeIcon(device.deviceType)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] truncate">{device.portName}</div>
                    <div className="text-[10px] text-gray-400">{deviceTypeLabel(device.deviceType)}</div>
                  </div>
                  <div className="flex rounded-lg overflow-hidden border border-gray-200 shrink-0">
                    <button
                      type="button"
                      onClick={() => setDeviceIoAction(device.id, 'above', 'on')}
                      className={`px-2 py-1 text-[10px] ${
                        device.ioAction === 'on' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-500'
                      }`}
                    >
                      开启
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeviceIoAction(device.id, 'above', 'off')}
                      className={`px-2 py-1 text-[10px] ${
                        device.ioAction === 'off' ? 'bg-slate-600 text-white' : 'bg-white text-gray-500'
                      }`}
                    >
                      关闭
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeDevice(device.id, 'above')}
                    className="w-7 h-7 flex items-center justify-center shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-gray-300" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 低于下界 → 升调节等 */}
        <div className="space-y-2 rounded-xl border border-cyan-100 bg-cyan-50/40 p-3">
          <div>
            <div className="text-[12px] text-cyan-900 font-medium">
              低于 {formatControlValue(lowerLimit, unit)}{unit}
              <span className="text-cyan-800 font-normal"> · {lowActionLabel}</span>
            </div>
            {hysteresis > 0 && (
              <div className="text-[10px] text-cyan-800/85 mt-1">
                结束动作：测量值 ≥ {formatControlValue(lowSideClearAbove, unit)}{unit}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <select
                value={selectedPortKeyBelow}
                onChange={event => setSelectedPortKeyBelow(event.target.value)}
                className="w-full appearance-none bg-white rounded-xl px-3 py-2.5 text-[13px] outline-none border border-cyan-100/80"
              >
                <option value="">选择设备</option>
                {candidatePorts.map(item => (
                  <option key={`b-${item.deviceId}:${item.port.id}`} value={`${item.deviceId}:${item.port.id}`}>
                    {item.port.name} · {item.deviceName} · #{item.port.id}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <button
              type="button"
              onClick={() => selectedPortKeyBelow && addDevice(selectedPortKeyBelow, 'below')}
              className="px-3 rounded-xl bg-cyan-600 text-white text-[12px] whitespace-nowrap"
            >
              添加
            </button>
          </div>
          {belowDevices.length === 0 ? (
            <div className="bg-white/70 rounded-lg py-3 text-center text-[11px] text-gray-400">
              本侧尚无设备，{uiCopy.deviceHint}
            </div>
          ) : (
            <div className="space-y-2">
              {belowDevices.map(device => (
                <div key={device.id} className="bg-white rounded-xl p-2.5 flex items-center gap-2 border border-cyan-100/60">
                  <span className="text-[14px]">{deviceTypeIcon(device.deviceType)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] truncate">{device.portName}</div>
                    <div className="text-[10px] text-gray-400">{deviceTypeLabel(device.deviceType)}</div>
                  </div>
                  <div className="flex rounded-lg overflow-hidden border border-gray-200 shrink-0">
                    <button
                      type="button"
                      onClick={() => setDeviceIoAction(device.id, 'below', 'on')}
                      className={`px-2 py-1 text-[10px] ${
                        device.ioAction === 'on' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-500'
                      }`}
                    >
                      开启
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeviceIoAction(device.id, 'below', 'off')}
                      className={`px-2 py-1 text-[10px] ${
                        device.ioAction === 'off' ? 'bg-slate-600 text-white' : 'bg-white text-gray-500'
                      }`}
                    >
                      关闭
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeDevice(device.id, 'below')}
                    className="w-7 h-7 flex items-center justify-center shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-gray-300" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gray-50 rounded-xl p-3 text-[12px] text-gray-600 space-y-3">
          {hasAnyBoundDevice ? (
            <>
              <div>
                <div className="text-[11px] text-gray-500 mb-1.5">何时动作</div>
                <ul className="list-disc pl-4 space-y-1 leading-relaxed">
                  <li>
                    测量值<strong className="text-gray-800">高于上界</strong>：只使用<strong className="text-gray-800">上方</strong>色块内已添加的设备。
                  </li>
                  <li>
                    测量值<strong className="text-gray-800">低于下界</strong>：只使用<strong className="text-gray-800">下方</strong>色块内已添加的设备。
                  </li>
                  <li>两类情况不会同时生效；每行设备单独选择「开启」或「关闭」。</li>
                </ul>
              </div>
              <div>
                <div className="text-[11px] text-gray-500 mb-1.5">何时停</div>
                <ul className="list-disc pl-4 space-y-1 leading-relaxed">
                  <li>测量值须先回到<strong className="text-gray-800">控制区间</strong>（上、下界之间）。</li>
                  <li>
                    此后继续变化，直至达到该色块内<strong className="text-gray-800">结束动作</strong>所示数值（回差已体现在该数中），该块内设备才停止。
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <p>执行说明：{uiCopy.deviceHint}</p>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
        <div className="max-w-md mx-auto">
          <button
            onClick={onBack}
            className="w-full py-3 rounded-xl bg-emerald-600 text-white text-[14px] flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" /> 保存策略
          </button>
        </div>
      </div>
    </div>
  );
}
