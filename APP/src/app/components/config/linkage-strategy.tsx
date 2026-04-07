import { useMemo, useState } from 'react';
import { ArrowLeft, ChevronDown, Clock, Moon, Power, Save, Sun, Thermometer, Trash2, Zap } from 'lucide-react';
import {
  controlStrategies, devices, dryContactDeviceTypes, sensors, linkageTemplates,
  type ControlStrategyDefinition, type DryContactPort, type SensorData, type StrategyPeriodConfig,
} from '../../data/mock-data';

interface Props {
  paramKey: string;
  paramLabel: string;
  currentValue: string;
  unit: string;
  onBack: () => void;
}

interface SelectedDeviceAction {
  id: string;
  deviceId: string;
  portId: number;
  portName: string;
  deviceType: string;
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
    upperOffsetLabel: '高温裕量',
    lowerOffsetLabel: '低温裕量',
    feedbackTitle: '温度反馈传感器',
    feedbackHint: '选择参与本策略反馈控制的温度测点。',
    deviceTitle: '温控执行设备',
    deviceEmptyText: '还没有配置温控执行设备',
    deviceHint: '请绑定风机、开窗、湿帘或其他温控执行设备。',
  },
  humidity: {
    rangeTitle: '湿度目标区间',
    targetLabel: '目标湿度',
    upperOffsetLabel: '高湿裕量',
    lowerOffsetLabel: '低湿裕量',
    feedbackTitle: '湿度反馈传感器',
    feedbackHint: '选择参与本策略反馈控制的湿度测点。',
    deviceTitle: '湿度执行设备',
    deviceEmptyText: '还没有配置湿度执行设备',
    deviceHint: '请绑定加湿器、除湿机或通风设备。',
  },
  co2: {
    rangeTitle: '浓度目标区间',
    targetLabel: '目标浓度',
    upperOffsetLabel: '高浓裕量',
    lowerOffsetLabel: '低浓裕量',
    feedbackTitle: '浓度反馈传感器',
    feedbackHint: '选择用于 CO₂ 补气与排气控制的浓度测点。',
    deviceTitle: '补气/排气设备',
    deviceEmptyText: '还没有配置 CO₂ 执行设备',
    deviceHint: '请绑定 CO₂ 电磁阀、新风或排气设备。',
  },
  light: {
    rangeTitle: '光照目标区间',
    targetLabel: '目标光照',
    upperOffsetLabel: '高照裕量',
    lowerOffsetLabel: '低照裕量',
    feedbackTitle: '光照反馈传感器',
    feedbackHint: '选择用于补光与遮阳控制的光照测点。',
    deviceTitle: '补光/遮阳设备',
    deviceEmptyText: '还没有配置补光或遮阳设备',
    deviceHint: '请绑定补光灯或遮阳执行设备。',
  },
  vpd: {
    rangeTitle: 'VPD 目标区间',
    targetLabel: '目标 VPD',
    upperOffsetLabel: '高 VPD 裕量',
    lowerOffsetLabel: '低 VPD 裕量',
    feedbackTitle: '',
    feedbackHint: '',
    deviceTitle: 'VPD 调节设备',
    deviceEmptyText: '还没有配置 VPD 调节设备',
    deviceHint: '请绑定加湿、除湿、湿帘或通风设备。',
  },
  soilHumidity: {
    rangeTitle: '灌溉控制区间',
    targetLabel: '目标含水率',
    upperOffsetLabel: '停灌裕量',
    lowerOffsetLabel: '启灌裕量',
    feedbackTitle: '基质反馈传感器',
    feedbackHint: '选择用于灌溉控制的基质湿度测点。',
    deviceTitle: '灌溉执行设备',
    deviceEmptyText: '还没有配置灌溉执行设备',
    deviceHint: '请绑定灌溉泵、电磁阀等灌溉设备。',
  },
  waterLevel: {
    rangeTitle: '液位控制区间',
    targetLabel: '目标液位',
    upperOffsetLabel: '高液位裕量',
    lowerOffsetLabel: '低液位裕量',
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

export function LinkageStrategy({ paramKey, paramLabel, currentValue, unit, onBack }: Props) {
  const strategy = controlStrategies.find(item => item.paramKey === paramKey) as ControlStrategyDefinition | undefined;
  const linkageMeta = linkageTemplates[paramKey];
  const uiCopy = strategyUiCopy[paramKey] || {
    rangeTitle: '控制目标区间',
    targetLabel: '目标值',
    upperOffsetLabel: '上偏差',
    lowerOffsetLabel: '下偏差',
    feedbackTitle: '控制反馈传感器',
    feedbackHint: '选择用于反馈控制的传感器。',
    deviceTitle: '执行设备',
    deviceEmptyText: '还没有配置执行设备',
    deviceHint: '请至少选择一个执行设备。',
  };
  const candidateSensors = sensors.filter(sensor => resolveMetric(sensor, paramKey));
  const candidatePorts = useMemo(() => getConfiguredPorts(), []);
  const initialDayNightSplit = strategy?.dayNightSplit ?? false;

  const initialSensorId = strategy?.sourceBinding.primarySensorId || candidateSensors[0]?.id || '';
  const mapActions = (actions: ControlStrategyDefinition['day']['stages'][number]['actions'] = []) => actions.map(action => ({
    id: action.id,
    deviceId: action.deviceId,
    portId: action.portId,
    portName: action.portName,
    deviceType: action.deviceType,
  }));

  const [selectedSensorId, setSelectedSensorId] = useState(initialSensorId);
  const [selectedPortKey, setSelectedPortKey] = useState('');
  const [dayDevices, setDayDevices] = useState<SelectedDeviceAction[]>(mapActions(strategy?.day.stages[0]?.actions));
  const [nightDevices, setNightDevices] = useState<SelectedDeviceAction[]>(mapActions(strategy?.night.stages[0]?.actions));
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

  const selectedSensor = candidateSensors.find(sensor => sensor.id === selectedSensorId);
  const selectedSensorMetric = selectedSensor ? resolveMetric(selectedSensor, paramKey) : null;
  const currentPeriod = activePeriod === 'day' ? dayPeriod : nightPeriod;
  const selectedDevices = activePeriod === 'day' || !dayNightSplit ? dayDevices : nightDevices;
  const lowerLimit = currentPeriod.setpoint.target - currentPeriod.setpoint.lowerOffset;
  const upperLimit = currentPeriod.setpoint.target + currentPeriod.setpoint.upperOffset;
  const highActionLabel = linkageMeta?.upLabel || '降调节';
  const lowActionLabel = linkageMeta?.downLabel || '升调节';
  const hasDirectFeedbackSensor = candidateSensors.length > 0;
  const showFeedbackModule = paramKey !== 'vpd' && hasDirectFeedbackSensor;

  const updateSelectedDevices = (updater: (devices: SelectedDeviceAction[]) => SelectedDeviceAction[]) => {
    if (activePeriod === 'day' || !dayNightSplit) {
      setDayDevices(prev => updater(prev));
      return;
    }
    setNightDevices(prev => updater(prev));
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

  const addDevice = (portKey: string) => {
    const [deviceId, rawPortId] = portKey.split(':');
    const portId = Number(rawPortId);
    const matched = candidatePorts.find(item => item.deviceId === deviceId && item.port.id === portId);
    if (!matched) return;

    const exists = selectedDevices.some(item => item.deviceId === deviceId && item.portId === portId);
    if (exists) return;

    updateSelectedDevices(prev => [
      ...prev,
      {
        id: `${deviceId}-${portId}`,
        deviceId,
        portId,
        portName: matched.port.name,
        deviceType: matched.port.deviceType || matched.port.type,
      },
    ]);
    setSelectedPortKey('');
  };

  const removeDevice = (id: string) => {
    updateSelectedDevices(prev => prev.filter(item => item.id !== id));
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

        <div className="grid grid-cols-3 gap-2">
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

        <div className="bg-emerald-50 rounded-xl p-3 text-[12px] text-emerald-700">
          控制逻辑：
          <span className="mx-1">高于 {formatControlValue(upperLimit, unit)}{unit}</span>
          时触发{highActionLabel}，
          <span className="mx-1">低于 {formatControlValue(lowerLimit, unit)}{unit}</span>
          时触发{lowActionLabel}。
        </div>

        {paramKey === 'vpd' && (
          <div className="bg-purple-50 rounded-xl p-3 text-[12px] text-purple-700">
            计算说明：
            <span className="mx-1">VPD 由温度与湿度共同计算得出，当前页面不单独选择传感器测点。</span>
            系统将按已配置的温湿度来源进行协同调节。
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
              value={selectedSensorId}
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

      <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Power className="w-4 h-4 text-emerald-500" />
          <span className="text-[13px]">{uiCopy.deviceTitle}</span>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <select
              value={selectedPortKey}
              onChange={event => setSelectedPortKey(event.target.value)}
              className="w-full appearance-none bg-gray-50 rounded-xl px-3 py-3 text-[14px] outline-none border border-gray-100"
            >
              <option value="">请选择设备</option>
              {candidatePorts.map(item => (
                <option key={`${item.deviceId}:${item.port.id}`} value={`${item.deviceId}:${item.port.id}`}>
                  {item.port.name} · {item.deviceName} · 端口#{item.port.id}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <button
            onClick={() => selectedPortKey && addDevice(selectedPortKey)}
            className="px-4 rounded-xl bg-emerald-600 text-white text-[13px]"
          >
            添加
          </button>
        </div>

        {selectedDevices.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-4 text-center text-[12px] text-gray-400">
            {uiCopy.deviceEmptyText}
          </div>
        ) : (
          <div className="space-y-2">
            {selectedDevices.map(device => (
              <div key={device.id} className="bg-gray-50 rounded-xl p-3 flex items-center gap-2">
                <span className="text-[14px]">{deviceTypeIcon(device.deviceType)}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] truncate">{device.portName}</div>
                  <div className="text-[10px] text-gray-400">{deviceTypeLabel(device.deviceType)}</div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-600">
                  已绑定
                </span>
                <button onClick={() => removeDevice(device.id)} className="w-6 h-6 flex items-center justify-center">
                  <Trash2 className="w-3.5 h-3.5 text-gray-300" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="bg-gray-50 rounded-xl p-3 text-[12px] text-gray-600">
          执行说明：
          {selectedDevices.length > 0
            ? ` 当控制值超出目标区间时，系统将自动调度当前时段已绑定设备。`
            : ` ${uiCopy.deviceHint}`}
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
