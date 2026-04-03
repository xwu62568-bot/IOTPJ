import { useState } from 'react';
import {
  AlertTriangle, ArrowLeft, Check, ChevronDown, ChevronUp, Clock, Database,
  Link2, Moon, Plus, Power, Settings, Shield, Sun, Trash2, Zap,
} from 'lucide-react';
import { Switch } from '../ui/switch';
import {
  controlStrategies, devices, dryContactDeviceTypes, realtimeDisplayBindings, sensors,
  type ControlStrategyDefinition, type DryContactPort, type SensorAggregationMode, type SensorData,
  type StrategyAction, type StrategyPeriodConfig, type StrategyStageDefinition,
} from '../../data/mock-data';

interface Props {
  paramKey: string;
  paramLabel: string;
  currentValue: string;
  unit: string;
  onBack: () => void;
}

function cloneStrategy(strategy: ControlStrategyDefinition) {
  return JSON.parse(JSON.stringify(strategy)) as ControlStrategyDefinition;
}

function getAllPorts(): { deviceId: string; deviceName: string; port: DryContactPort }[] {
  const result: { deviceId: string; deviceName: string; port: DryContactPort }[] = [];
  devices.forEach(dev => {
    if (dev.type === 'dry-contact' && dev.ports) {
      dev.ports.filter(port => port.configured).forEach(port => {
        result.push({ deviceId: dev.id, deviceName: dev.name, port });
      });
    }
  });
  return result;
}

function resolveMetric(sensor: SensorData, paramKey: string) {
  return sensor.metrics.find(metric => metric.paramKey === paramKey);
}

function sensorLabel(sensorId: string) {
  return sensors.find(sensor => sensor.id === sensorId)?.name || sensorId;
}

function deviceTypeLabel(deviceType: string) {
  return dryContactDeviceTypes.find(item => item.key === deviceType)?.label || deviceType;
}

function deviceTypeIcon(deviceType: string) {
  return dryContactDeviceTypes.find(item => item.key === deviceType)?.icon || '⚙️';
}

const aggregationOptions: { key: SensorAggregationMode; label: string }[] = [
  { key: 'single', label: '单点' },
  { key: 'avg', label: '平均值' },
  { key: 'max', label: '最大值' },
  { key: 'min', label: '最小值' },
];

export function LinkageStrategy({ paramKey, paramLabel, currentValue, unit, onBack }: Props) {
  const strategyTemplate = controlStrategies.find(strategy => strategy.paramKey === paramKey);
  const displayBinding = realtimeDisplayBindings.find(binding => binding.paramKey === paramKey);
  const allPorts = getAllPorts();

  const [showAddDevice, setShowAddDevice] = useState<string | null>(null);
  const [expandedStageId, setExpandedStageId] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<'day' | 'night'>('day');
  const [strategy, setStrategy] = useState<ControlStrategyDefinition | null>(
    strategyTemplate ? cloneStrategy(strategyTemplate) : null
  );

  if (!strategy) {
    return (
      <div className="space-y-4 -m-4 p-4">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={onBack} className="w-8 h-8 flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h3 className="text-[16px]">{paramLabel} 策略设置</h3>
        </div>
        <div className="text-center py-12">
          <Settings className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-[14px] text-gray-400">该参数暂不支持联动策略</p>
          <p className="text-[12px] text-gray-300 mt-1">仅展示实时数据</p>
        </div>
      </div>
    );
  }

  const availableSensors = sensors.filter(sensor => resolveMetric(sensor, paramKey));
  const periodKey: 'day' | 'night' = strategy.dayNightSplit ? activeMode : 'day';
  const currentPeriod = strategy[periodKey];

  const setCurrentPeriod = (updater: (period: StrategyPeriodConfig) => StrategyPeriodConfig) => {
    setStrategy(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [periodKey]: updater(prev[periodKey]),
      };
    });
  };

  const updateSetpoint = (field: keyof StrategyPeriodConfig['setpoint'], value: string) => {
    const numeric = Number(value);
    setCurrentPeriod(period => ({
      ...period,
      setpoint: {
        ...period.setpoint,
        [field]: Number.isNaN(numeric) ? 0 : numeric,
      },
    }));
  };

  const updateStage = (stageId: string, updater: (stage: StrategyStageDefinition) => StrategyStageDefinition) => {
    setCurrentPeriod(period => ({
      ...period,
      stages: period.stages.map(stage => (stage.id === stageId ? updater(stage) : stage)),
    }));
  };

  const toggleSourceSensor = (sensorId: string) => {
    setStrategy(prev => {
      if (!prev) return prev;
      const exists = prev.sourceBinding.sensorIds.includes(sensorId);
      const nextSensorIds = exists
        ? prev.sourceBinding.sensorIds.filter(id => id !== sensorId)
        : [...prev.sourceBinding.sensorIds, sensorId];

      if (nextSensorIds.length === 0) return prev;

      const nextPrimary = nextSensorIds.includes(prev.sourceBinding.primarySensorId || '')
        ? prev.sourceBinding.primarySensorId
        : nextSensorIds[0];

      return {
        ...prev,
        sourceBinding: {
          ...prev.sourceBinding,
          sensorIds: nextSensorIds,
          primarySensorId: nextPrimary,
        },
      };
    });
  };

  const addStage = () => {
    const baseValue = currentPeriod.setpoint.target + currentPeriod.setpoint.upperOffset;
    const newStage: StrategyStageDefinition = {
      id: `${periodKey}-stage-${Date.now()}`,
      name: `自定义阶段 ${currentPeriod.stages.length + 1}`,
      triggerWhen: 'above',
      triggerValue: baseValue,
      recoverValue: baseValue - currentPeriod.setpoint.hysteresis,
      delaySeconds: currentPeriod.setpoint.delaySeconds,
      parallel: true,
      enabled: true,
      actions: [],
    };

    setCurrentPeriod(period => ({
      ...period,
      stages: [...period.stages, newStage],
    }));
    setExpandedStageId(newStage.id);
  };

  const removeStage = (stageId: string) => {
    setCurrentPeriod(period => ({
      ...period,
      stages: period.stages.filter(stage => stage.id !== stageId),
    }));
    setShowAddDevice(null);
    setExpandedStageId(prev => (prev === stageId ? null : prev));
  };

  const addActionToStage = (stageId: string, deviceId: string, port: DryContactPort) => {
    updateStage(stageId, stage => {
      if (stage.actions.some(action => action.deviceId === deviceId && action.portId === port.id)) {
        return stage;
      }

      const action: StrategyAction = {
        id: `${stageId}-${deviceId}-${port.id}`,
        deviceId,
        portId: port.id,
        portName: port.name,
        deviceType: port.deviceType || port.type,
        action: 'on',
        order: stage.actions.length + 1,
      };

      return {
        ...stage,
        actions: [...stage.actions, action],
      };
    });
    setShowAddDevice(null);
  };

  const updateAction = (stageId: string, actionId: string, updater: (action: StrategyAction) => StrategyAction) => {
    updateStage(stageId, stage => ({
      ...stage,
      actions: stage.actions.map(action => (action.id === actionId ? updater(action) : action)),
    }));
  };

  const removeAction = (stageId: string, actionId: string) => {
    updateStage(stageId, stage => ({
      ...stage,
      actions: stage.actions
        .filter(action => action.id !== actionId)
        .map((action, index) => ({ ...action, order: index + 1 })),
    }));
  };

  const sourceSummary = strategy.sourceBinding.aggregation === 'single'
    ? `单点采集 · 主传感器 ${sensorLabel(strategy.sourceBinding.primarySensorId || strategy.sourceBinding.sensorIds[0])}`
    : `${aggregationOptions.find(option => option.key === strategy.sourceBinding.aggregation)?.label || strategy.sourceBinding.aggregation} · ${strategy.sourceBinding.sensorIds.length} 个传感器`;

  return (
    <div className="space-y-4 -m-4 p-4 pb-24">
      <div className="flex items-center gap-3 mb-2">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h3 className="text-[16px]">{strategy.name}</h3>
          <p className="text-[11px] text-gray-400">{strategy.description}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="text-[12px] text-gray-400">当前值</div>
            <div className="text-[28px] text-emerald-600">
              {currentValue}<span className="text-[14px] ml-1">{unit}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-gray-400 mb-1">优先级</div>
            <div className="text-[18px] text-gray-700">P{strategy.priority}</div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[12px] text-gray-500">联动总开关</div>
            <div className="text-[11px] text-gray-400 mt-0.5">控制策略与设备动作独立于实时显示</div>
          </div>
          <Switch
            checked={strategy.enabled}
            onCheckedChange={checked => setStrategy(prev => prev ? { ...prev, enabled: checked } : prev)}
          />
        </div>
        {!strategy.enabled && (
          <div className="bg-amber-50 rounded-xl p-3 flex items-start gap-2 mt-3">
            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
            <span className="text-[12px] text-amber-700">策略关闭后仍保留实时显示，但不再触发联动动作。</span>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-500" />
          <span className="text-[13px]">数据源拆分</span>
        </div>

        <div className="bg-gray-50 rounded-xl p-3">
          <div className="text-[11px] text-gray-400 mb-1">实时卡片显示数据源</div>
          <div className="text-[13px] text-gray-700">{displayBinding?.label || `${paramLabel} 实时显示`}</div>
          <div className="text-[11px] text-gray-400 mt-1">
            {displayBinding
              ? `${aggregationOptions.find(option => option.key === displayBinding.aggregation)?.label || displayBinding.aggregation} · ${displayBinding.sensorIds.map(sensorLabel).join(' / ')}`
              : '未配置显示绑定'}
          </div>
        </div>

        <div className="bg-emerald-50 rounded-xl p-3">
          <div className="text-[11px] text-emerald-600 mb-1">策略触发数据源</div>
          <div className="text-[13px] text-emerald-700">{sourceSummary}</div>
          <div className="text-[11px] text-emerald-600/80 mt-1">
            {strategy.sourceBinding.excludeOffline ? '自动排除离线传感器' : '离线传感器仍参与计算'}
          </div>
        </div>

        <div className="flex gap-2">
          {aggregationOptions.map(option => (
            <button
              key={option.key}
              onClick={() => setStrategy(prev => prev ? {
                ...prev,
                sourceBinding: { ...prev.sourceBinding, aggregation: option.key },
              } : prev)}
              className={`flex-1 rounded-lg py-2 text-[12px] ${
                strategy.sourceBinding.aggregation === option.key
                  ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {availableSensors.map(sensor => {
            const selected = strategy.sourceBinding.sensorIds.includes(sensor.id);
            const primary = strategy.sourceBinding.primarySensorId === sensor.id;
            const metric = resolveMetric(sensor, paramKey);

            return (
              <button
                key={sensor.id}
                onClick={() => toggleSourceSensor(sensor.id)}
                className={`w-full text-left rounded-xl p-3 border-2 transition-all ${
                  selected ? 'border-emerald-400 bg-emerald-50' : 'border-transparent bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <div className="text-[13px]">{sensor.name}</div>
                    <div className="text-[11px] text-gray-400">
                      ID:{sensor.id} · {sensor.model} · 当前 {metric?.value ?? '--'}{metric?.unit || ''}
                    </div>
                  </div>
                  {primary && (
                    <span className="text-[10px] bg-white text-emerald-600 px-2 py-0.5 rounded-full">主数据源</span>
                  )}
                  {!sensor.online && (
                    <span className="text-[10px] bg-white text-gray-400 px-2 py-0.5 rounded-full">离线</span>
                  )}
                  {selected && <Check className="w-4 h-4 text-emerald-500" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-[13px]">日夜分段控制</span>
          </div>
          <Switch
            checked={strategy.dayNightSplit}
            onCheckedChange={checked => setStrategy(prev => prev ? { ...prev, dayNightSplit: checked } : prev)}
          />
        </div>
        <p className="text-[11px] text-gray-400">建议气候类参数采用日夜双参数，灌溉和补液可保持全时段。</p>
        {strategy.dayNightSplit && (
          <div className="flex bg-gray-100 rounded-xl p-1 mt-3">
            <button
              onClick={() => setActiveMode('day')}
              className={`flex-1 py-2 rounded-lg text-[13px] flex items-center justify-center gap-1.5 transition-all ${
                activeMode === 'day' ? 'bg-white shadow-sm text-amber-600' : 'text-gray-500'
              }`}
            >
              <Sun className="w-4 h-4" /> 白天
            </button>
            <button
              onClick={() => setActiveMode('night')}
              className={`flex-1 py-2 rounded-lg text-[13px] flex items-center justify-center gap-1.5 transition-all ${
                activeMode === 'night' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500'
              }`}
            >
              <Moon className="w-4 h-4" /> 夜间
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-emerald-500" />
          <span className="text-[13px]">{currentPeriod.label}目标区间</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-[11px] text-gray-400 block mb-1">目标值</label>
            <input
              value={currentPeriod.setpoint.target}
              onChange={event => updateSetpoint('target', event.target.value)}
              className="w-full bg-gray-50 rounded-xl px-3 py-2 text-[13px] text-center outline-none border border-gray-100 focus:border-emerald-400"
            />
          </div>
          <div>
            <label className="text-[11px] text-gray-400 block mb-1">上偏差</label>
            <input
              value={currentPeriod.setpoint.upperOffset}
              onChange={event => updateSetpoint('upperOffset', event.target.value)}
              className="w-full bg-gray-50 rounded-xl px-3 py-2 text-[13px] text-center outline-none border border-gray-100 focus:border-emerald-400"
            />
          </div>
          <div>
            <label className="text-[11px] text-gray-400 block mb-1">下偏差</label>
            <input
              value={currentPeriod.setpoint.lowerOffset}
              onChange={event => updateSetpoint('lowerOffset', event.target.value)}
              className="w-full bg-gray-50 rounded-xl px-3 py-2 text-[13px] text-center outline-none border border-gray-100 focus:border-emerald-400"
            />
          </div>
          <div>
            <label className="text-[11px] text-gray-400 block mb-1">回差</label>
            <input
              value={currentPeriod.setpoint.hysteresis}
              onChange={event => updateSetpoint('hysteresis', event.target.value)}
              className="w-full bg-gray-50 rounded-xl px-3 py-2 text-[13px] text-center outline-none border border-gray-100 focus:border-emerald-400"
            />
          </div>
          <div>
            <label className="text-[11px] text-gray-400 block mb-1">延时</label>
            <input
              value={currentPeriod.setpoint.delaySeconds}
              onChange={event => updateSetpoint('delaySeconds', event.target.value)}
              className="w-full bg-gray-50 rounded-xl px-3 py-2 text-[13px] text-center outline-none border border-gray-100 focus:border-emerald-400"
            />
          </div>
          <div className="bg-emerald-50 rounded-xl px-3 py-2 flex flex-col justify-center">
            <span className="text-[10px] text-emerald-600">控制区间</span>
            <span className="text-[13px] text-emerald-700">
              {(currentPeriod.setpoint.target - currentPeriod.setpoint.lowerOffset).toFixed(unit === '%' ? 0 : 2).replace(/\.?0+$/, '')}
              {' '}~{' '}
              {(currentPeriod.setpoint.target + currentPeriod.setpoint.upperOffset).toFixed(unit === '%' ? 0 : 2).replace(/\.?0+$/, '')}
              {unit}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-[13px] text-gray-600">{currentPeriod.label}控制阶段</span>
          <span className="text-[11px] text-gray-400">{currentPeriod.stages.length} 个阶段</span>
        </div>

        {currentPeriod.stages.map(stage => {
          const expanded = expandedStageId === stage.id;
          return (
            <div
              key={stage.id}
              className={`bg-white rounded-2xl shadow-sm overflow-hidden border-l-4 ${
                stage.enabled ? 'border-emerald-500' : 'border-gray-300'
              }`}
            >
              <button
                onClick={() => setExpandedStageId(prev => prev === stage.id ? null : stage.id)}
                className="w-full px-4 py-3 flex items-center gap-3"
              >
                <Power className="w-4 h-4 text-gray-300 shrink-0" />
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px]">{stage.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      stage.triggerWhen === 'above' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {stage.triggerWhen === 'above' ? '高于' : '低于'} {stage.triggerValue}{unit}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-400 mt-0.5">
                    恢复 {stage.recoverValue}{unit} · 动作 {stage.actions.length} 个 · 延时 {stage.delaySeconds}s
                  </div>
                </div>
                <Switch
                  checked={stage.enabled}
                  onCheckedChange={checked => updateStage(stage.id, current => ({ ...current, enabled: checked }))}
                />
                {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </button>

              {expanded && (
                <div className="px-4 pb-4 space-y-3 animate-[fadeIn_0.2s_ease]">
                  <div className="h-px bg-gray-100" />

                  <div>
                    <label className="text-[11px] text-gray-400 block mb-1">阶段名称</label>
                    <input
                      value={stage.name}
                      onChange={event => updateStage(stage.id, current => ({ ...current, name: event.target.value }))}
                      className="w-full bg-gray-50 rounded-xl px-3 py-2 text-[13px] outline-none border border-gray-100 focus:border-emerald-400"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => updateStage(stage.id, current => ({ ...current, triggerWhen: 'above' }))}
                      className={`flex-1 rounded-lg py-2 text-[12px] ${
                        stage.triggerWhen === 'above'
                          ? 'bg-red-100 text-red-600 ring-1 ring-red-200'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      高于阈值触发
                    </button>
                    <button
                      onClick={() => updateStage(stage.id, current => ({ ...current, triggerWhen: 'below' }))}
                      className={`flex-1 rounded-lg py-2 text-[12px] ${
                        stage.triggerWhen === 'below'
                          ? 'bg-blue-100 text-blue-600 ring-1 ring-blue-200'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      低于阈值触发
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[11px] text-gray-400 block mb-1">触发值</label>
                      <input
                        value={stage.triggerValue}
                        onChange={event => updateStage(stage.id, current => ({
                          ...current,
                          triggerValue: Number(event.target.value) || 0,
                        }))}
                        className="w-full bg-gray-50 rounded-xl px-3 py-2 text-[13px] text-center outline-none border border-gray-100 focus:border-emerald-400"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-gray-400 block mb-1">恢复值</label>
                      <input
                        value={stage.recoverValue}
                        onChange={event => updateStage(stage.id, current => ({
                          ...current,
                          recoverValue: Number(event.target.value) || 0,
                        }))}
                        className="w-full bg-gray-50 rounded-xl px-3 py-2 text-[13px] text-center outline-none border border-gray-100 focus:border-emerald-400"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-gray-400 block mb-1">延时</label>
                      <input
                        value={stage.delaySeconds}
                        onChange={event => updateStage(stage.id, current => ({
                          ...current,
                          delaySeconds: Number(event.target.value) || 0,
                        }))}
                        className="w-full bg-gray-50 rounded-xl px-3 py-2 text-[13px] text-center outline-none border border-gray-100 focus:border-emerald-400"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2">
                    <div>
                      <div className="text-[12px] text-gray-600">允许与上一阶段并行</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">例如温度二级降温可叠加一级风机</div>
                    </div>
                    <Switch
                      checked={stage.parallel}
                      onCheckedChange={checked => updateStage(stage.id, current => ({ ...current, parallel: checked }))}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[12px] text-gray-500 flex items-center gap-1">
                        <Link2 className="w-3.5 h-3.5" /> 阶段动作
                      </span>
                      <button
                        onClick={() => setShowAddDevice(prev => prev === stage.id ? null : stage.id)}
                        className="text-[11px] text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> 添加端口
                      </button>
                    </div>

                    {stage.actions.length === 0 ? (
                      <div className="bg-gray-50 rounded-xl p-4 text-center">
                        <Power className="w-6 h-6 text-gray-200 mx-auto mb-1" />
                        <p className="text-[12px] text-gray-400">暂无动作</p>
                        <p className="text-[10px] text-gray-300">为本阶段添加需要联动的端口设备</p>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        {stage.actions.map(action => (
                          <div key={action.id} className="bg-gray-50 rounded-xl p-3">
                            <div className="flex items-center gap-2">
                              <span className="text-[14px]">{deviceTypeIcon(action.deviceType)}</span>
                              <div className="flex-1 min-w-0">
                                <div className="text-[12px] truncate">{action.portName}</div>
                                <div className="text-[10px] text-gray-400">{deviceTypeLabel(action.deviceType)}</div>
                              </div>
                              <button
                                onClick={() => updateAction(stage.id, action.id, current => ({
                                  ...current,
                                  action: current.action === 'on' ? 'off' : 'on',
                                }))}
                                className={`px-2 py-0.5 rounded-full text-[10px] ${
                                  action.action === 'on'
                                    ? 'bg-emerald-100 text-emerald-600'
                                    : 'bg-red-100 text-red-600'
                                }`}
                              >
                                {action.action === 'on' ? '开启' : '关闭'}
                              </button>
                              <button onClick={() => removeAction(stage.id, action.id)} className="w-6 h-6 flex items-center justify-center">
                                <Trash2 className="w-3.5 h-3.5 text-gray-300" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {showAddDevice === stage.id && (
                      <div className="mt-2 bg-gray-50 rounded-xl p-3 space-y-1">
                        {allPorts.map(({ deviceId, deviceName, port }) => {
                          const added = stage.actions.some(action => action.deviceId === deviceId && action.portId === port.id);
                          return (
                            <button
                              key={`${deviceId}-${port.id}`}
                              onClick={() => !added && addActionToStage(stage.id, deviceId, port)}
                              disabled={added}
                              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left ${
                                added ? 'bg-emerald-50 opacity-60' : 'bg-white hover:bg-emerald-50'
                              }`}
                            >
                              <span className="text-[14px]">{deviceTypeIcon(port.deviceType || '')}</span>
                              <div className="flex-1 min-w-0">
                                <div className="text-[12px] truncate">{port.name}</div>
                                <div className="text-[10px] text-gray-400">
                                  {deviceName} · 端口 #{port.id} · {deviceTypeLabel(port.deviceType || port.type)}
                                </div>
                              </div>
                              {added && <Check className="w-4 h-4 text-emerald-500" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => removeStage(stage.id)}
                    className="w-full text-[12px] text-red-400 py-2 flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> 删除此阶段
                  </button>
                </div>
              )}
            </div>
          );
        })}

        <button
          onClick={addStage}
          className="w-full border-2 border-dashed border-gray-200 rounded-2xl py-4 flex items-center justify-center gap-2 text-[13px] text-gray-400"
        >
          <Plus className="w-4 h-4" /> 添加控制阶段
        </button>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-4 h-4 text-amber-500" />
          <span className="text-[13px]">互锁与保护</span>
        </div>
        <div className="space-y-2">
          {strategy.interlocks.map(interlock => (
            <div key={interlock.id} className="bg-amber-50 rounded-xl p-3">
              <div className="text-[12px] text-amber-700">{interlock.label}</div>
              <div className="text-[11px] text-amber-600 mt-0.5">{interlock.description}</div>
            </div>
          ))}
          {strategy.interlocks.length === 0 && (
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <Settings className="w-6 h-6 text-gray-200 mx-auto mb-1" />
              <p className="text-[12px] text-gray-400">暂无互锁规则</p>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
        <div className="max-w-md mx-auto">
          <button
            onClick={onBack}
            className="w-full py-3 rounded-xl bg-emerald-600 text-white text-[14px] active:bg-emerald-700"
          >
            保存策略
          </button>
        </div>
      </div>
    </div>
  );
}
