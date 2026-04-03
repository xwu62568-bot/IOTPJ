import { useState } from 'react';
import {
  ArrowLeft, Plus, Trash2, ChevronDown, ChevronUp, Power, Clock,
  Sun, Moon, Zap, AlertTriangle, Link2, Settings, ToggleLeft, Check,
  GripVertical
} from 'lucide-react';
import { Switch } from '../ui/switch';
import {
  devices, dryContactDeviceTypes, linkageTemplates,
} from '../../data/mock-data';
import type { DryContactPort } from '../../data/mock-data';

interface LinkedDevice {
  id: string;
  deviceId: string;
  portId: number;
  portName: string;
  deviceType: string;
  action: 'on' | 'off';
}

interface Stage {
  id: string;
  name: string;
  triggerValue: string;
  hysteresis: string;
  delay: string;
  devices: LinkedDevice[];
  enabled: boolean;
  expanded: boolean;
}

interface Props {
  paramKey: string;
  paramLabel: string;
  currentValue: string;
  unit: string;
  onBack: () => void;
}

// Get all configured ports from all dry-contact devices
function getAllPorts(): { deviceId: string; deviceName: string; port: DryContactPort }[] {
  const result: { deviceId: string; deviceName: string; port: DryContactPort }[] = [];
  devices.forEach(dev => {
    if (dev.type === 'dry-contact' && dev.ports) {
      dev.ports.filter(p => p.configured).forEach(port => {
        result.push({ deviceId: dev.id, deviceName: dev.name, port });
      });
    }
  });
  return result;
}

export function LinkageStrategy({ paramKey, paramLabel, currentValue, unit, onBack }: Props) {
  const template = linkageTemplates[paramKey];
  const allPorts = getAllPorts();

  const [enabled, setEnabled] = useState(true);
  const [dayNightSplit, setDayNightSplit] = useState(true);
  const [activeMode, setActiveMode] = useState<'day' | 'night'>('day');
  const [showAddDevice, setShowAddDevice] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);

  // Initialize stages from template
  const [dayStages, setDayStages] = useState<Stage[]>(() => {
    if (!template) return [];
    return template.suggestedStages.map((s, i) => ({
      id: `day-${i}`,
      name: s.name,
      triggerValue: String(s.triggerOffset > 0 ? 28 + s.triggerOffset : 28 + s.triggerOffset),
      hysteresis: paramKey === 'vpd' ? '0.1' : paramKey === 'waterLevel' ? '0.05' : '2',
      delay: '30',
      devices: [],
      enabled: true,
      expanded: i === 0,
    }));
  });

  const [nightStages, setNightStages] = useState<Stage[]>(() => {
    if (!template) return [];
    return template.suggestedStages.slice(0, 2).map((s, i) => ({
      id: `night-${i}`,
      name: s.name + ' (夜)',
      triggerValue: String(s.triggerOffset > 0 ? 22 + s.triggerOffset : 22 + s.triggerOffset),
      hysteresis: paramKey === 'vpd' ? '0.1' : paramKey === 'waterLevel' ? '0.05' : '2',
      delay: '60',
      devices: [],
      enabled: true,
      expanded: false,
    }));
  });

  const stages = activeMode === 'day' ? dayStages : nightStages;
  const setStages = activeMode === 'day' ? setDayStages : setNightStages;

  const toggleStageExpand = (id: string) => {
    setStages(prev => prev.map(s => s.id === id ? { ...s, expanded: !s.expanded } : s));
  };

  const updateStage = (id: string, field: string, value: string | boolean) => {
    setStages(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const addDeviceToStage = (stageId: string, deviceId: string, port: DryContactPort) => {
    setStages(prev => prev.map(s => {
      if (s.id !== stageId) return s;
      const exists = s.devices.some(d => d.deviceId === deviceId && d.portId === port.id);
      if (exists) return s;
      return {
        ...s,
        devices: [...s.devices, {
          id: `${deviceId}-${port.id}`,
          deviceId,
          portId: port.id,
          portName: port.name,
          deviceType: port.deviceType || port.type,
          action: 'on' as const,
        }]
      };
    }));
    setShowAddDevice(null);
  };

  const removeDeviceFromStage = (stageId: string, linkedId: string) => {
    setStages(prev => prev.map(s => {
      if (s.id !== stageId) return s;
      return { ...s, devices: s.devices.filter(d => d.id !== linkedId) };
    }));
  };

  const toggleDeviceAction = (stageId: string, linkedId: string) => {
    setStages(prev => prev.map(s => {
      if (s.id !== stageId) return s;
      return {
        ...s,
        devices: s.devices.map(d =>
          d.id === linkedId ? { ...d, action: d.action === 'on' ? 'off' as const : 'on' as const } : d
        )
      };
    }));
  };

  const addNewStage = () => {
    const newId = `${activeMode}-${Date.now()}`;
    setStages(prev => [...prev, {
      id: newId,
      name: `自定义阶段 ${prev.length + 1}`,
      triggerValue: '',
      hysteresis: '2',
      delay: '30',
      devices: [],
      enabled: true,
      expanded: true,
    }]);
  };

  const removeStage = (id: string) => {
    setStages(prev => prev.filter(s => s.id !== id));
  };

  const applyTemplate = (stageId: string, suggestedDeviceTypes: string[]) => {
    const matched: LinkedDevice[] = [];
    suggestedDeviceTypes.forEach(dt => {
      const found = allPorts.find(p => p.port.deviceType === dt && !matched.some(m => m.deviceId === p.deviceId && m.portId === p.port.id));
      if (found) {
        matched.push({
          id: `${found.deviceId}-${found.port.id}`,
          deviceId: found.deviceId,
          portId: found.port.id,
          portName: found.port.name,
          deviceType: found.port.deviceType || found.port.type,
          action: 'on',
        });
      }
    });
    if (matched.length > 0) {
      setStages(prev => prev.map(s => s.id === stageId ? { ...s, devices: [...s.devices, ...matched] } : s));
    }
  };

  const deviceTypeLabel = (dt: string) => {
    return dryContactDeviceTypes.find(d => d.key === dt)?.label || dt;
  };

  const deviceTypeIcon = (dt: string) => {
    return dryContactDeviceTypes.find(d => d.key === dt)?.icon || '⚙️';
  };

  if (!template) {
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
          <p className="text-[12px] text-gray-300 mt-1">仅展示传感器数据</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 -m-4 p-4 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h3 className="text-[16px]">{template.label}</h3>
          <p className="text-[11px] text-gray-400">{template.description}</p>
        </div>
      </div>

      {/* Current value + master switch */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[12px] text-gray-400">当前值</span>
            <div className="text-[28px] text-emerald-600">
              {currentValue}<span className="text-[14px] ml-1">{unit}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-gray-500">联动总开关</span>
              <Switch checked={enabled} onCheckedChange={setEnabled} />
            </div>
          </div>
        </div>

        {!enabled && (
          <div className="bg-amber-50 rounded-xl p-3 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
            <span className="text-[12px] text-amber-700">联动已关闭，传感器仅采集数据不触发设备控制</span>
          </div>
        )}
      </div>

      {/* Day/Night split toggle */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-[13px]">日夜分段控制</span>
          </div>
          <Switch checked={dayNightSplit} onCheckedChange={setDayNightSplit} />
        </div>
        <p className="text-[11px] text-gray-400">开启后可分别设置白天和夜间的联动策略</p>

        {dayNightSplit && (
          <div className="flex bg-gray-100 rounded-xl p-1 mt-3">
            <button
              onClick={() => setActiveMode('day')}
              className={`flex-1 py-2 rounded-lg text-[13px] flex items-center justify-center gap-1.5 transition-all ${
                activeMode === 'day' ? 'bg-white shadow-sm text-amber-600' : 'text-gray-500'
              }`}
            >
              <Sun className="w-4 h-4" /> 白天 06:00-18:00
            </button>
            <button
              onClick={() => setActiveMode('night')}
              className={`flex-1 py-2 rounded-lg text-[13px] flex items-center justify-center gap-1.5 transition-all ${
                activeMode === 'night' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500'
              }`}
            >
              <Moon className="w-4 h-4" /> 夜间 18:00-06:00
            </button>
          </div>
        )}
      </div>

      {/* Stages */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-[13px] text-gray-600">
            {activeMode === 'day' ? '☀️ 白天' : '🌙 夜间'}控制阶段
          </span>
          <span className="text-[11px] text-gray-400">{stages.length} 个阶段</span>
        </div>

        {stages.map((stage, idx) => (
          <div
            key={stage.id}
            className={`bg-white rounded-2xl shadow-sm overflow-hidden border-l-4 ${
              stage.enabled ? 'border-emerald-500' : 'border-gray-300'
            }`}
          >
            {/* Stage header */}
            <button
              onClick={() => toggleStageExpand(stage.id)}
              className="w-full px-4 py-3 flex items-center gap-3"
            >
              <GripVertical className="w-4 h-4 text-gray-300 shrink-0" />
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-[13px]">{stage.name}</span>
                  {stage.triggerValue && (
                    <span className="bg-emerald-100 text-emerald-600 text-[10px] px-1.5 py-0.5 rounded-full">
                      {stage.triggerValue}{unit}
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-gray-400 mt-0.5">
                  {stage.devices.length} 个设备 · 回差 {stage.hysteresis}{unit} · 延迟 {stage.delay}s
                </div>
              </div>
              <Switch
                checked={stage.enabled}
                onCheckedChange={v => { updateStage(stage.id, 'enabled', v); }}
              />
              {stage.expanded ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>

            {/* Expanded content */}
            {stage.expanded && (
              <div className="px-4 pb-4 space-y-3 animate-[fadeIn_0.2s_ease]">
                <div className="h-px bg-gray-100" />

                {/* Stage name edit */}
                <div>
                  <label className="text-[11px] text-gray-400 block mb-1">阶段名称</label>
                  <input
                    value={stage.name}
                    onChange={e => updateStage(stage.id, 'name', e.target.value)}
                    className="w-full bg-gray-50 rounded-xl px-3 py-2 text-[13px] outline-none border border-gray-100 focus:border-emerald-400"
                  />
                </div>

                {/* Trigger params */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[11px] text-gray-400 block mb-1">触发值 ({unit})</label>
                    <input
                      value={stage.triggerValue}
                      onChange={e => updateStage(stage.id, 'triggerValue', e.target.value)}
                      className="w-full bg-gray-50 rounded-xl px-3 py-2 text-[13px] text-center outline-none border border-gray-100 focus:border-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-400 block mb-1">回差 ({unit})</label>
                    <input
                      value={stage.hysteresis}
                      onChange={e => updateStage(stage.id, 'hysteresis', e.target.value)}
                      className="w-full bg-gray-50 rounded-xl px-3 py-2 text-[13px] text-center outline-none border border-gray-100 focus:border-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-400 block mb-1">延迟 (秒)</label>
                    <input
                      value={stage.delay}
                      onChange={e => updateStage(stage.id, 'delay', e.target.value)}
                      className="w-full bg-gray-50 rounded-xl px-3 py-2 text-[13px] text-center outline-none border border-gray-100 focus:border-emerald-400"
                    />
                  </div>
                </div>

                {/* Linked devices */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[12px] text-gray-500 flex items-center gap-1">
                      <Link2 className="w-3.5 h-3.5" /> 联动设备
                    </span>
                    <div className="flex gap-2">
                      {/* Apply template button */}
                      {template.suggestedStages[idx] && stage.devices.length === 0 && (
                        <button
                          onClick={() => applyTemplate(stage.id, template.suggestedStages[idx].devices)}
                          className="text-[11px] text-blue-500 bg-blue-50 px-2 py-1 rounded-full flex items-center gap-1"
                        >
                          <Zap className="w-3 h-3" /> 一键匹配
                        </button>
                      )}
                      <button
                        onClick={() => setShowAddDevice(showAddDevice === stage.id ? null : stage.id)}
                        className="text-[11px] text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> 添加
                      </button>
                    </div>
                  </div>

                  {/* Device list */}
                  {stage.devices.length === 0 ? (
                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                      <Power className="w-6 h-6 text-gray-200 mx-auto mb-1" />
                      <p className="text-[12px] text-gray-400">暂无联动设备</p>
                      <p className="text-[10px] text-gray-300">点击上方添加或一键匹配</p>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {stage.devices.map(d => (
                        <div
                          key={d.id}
                          className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2"
                        >
                          <span className="text-[14px]">{deviceTypeIcon(d.deviceType)}</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-[12px] truncate">{d.portName}</div>
                            <div className="text-[10px] text-gray-400">{deviceTypeLabel(d.deviceType)}</div>
                          </div>
                          <button
                            onClick={() => toggleDeviceAction(stage.id, d.id)}
                            className={`px-2 py-0.5 rounded-full text-[10px] ${
                              d.action === 'on'
                                ? 'bg-emerald-100 text-emerald-600'
                                : 'bg-red-100 text-red-600'
                            }`}
                          >
                            {d.action === 'on' ? '开启' : '关闭'}
                          </button>
                          <button
                            onClick={() => removeDeviceFromStage(stage.id, d.id)}
                            className="w-6 h-6 flex items-center justify-center"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-gray-300" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add device picker */}
                  {showAddDevice === stage.id && (
                    <div className="mt-2 bg-gray-50 rounded-xl p-3 space-y-2 animate-[fadeIn_0.2s_ease]">
                      <div className="text-[11px] text-gray-500 mb-1">选择要联动的干接点端口：</div>
                      <div className="max-h-48 overflow-y-auto space-y-1">
                        {allPorts.map(({ deviceId, deviceName, port }) => {
                          const isAlreadyAdded = stage.devices.some(d => d.deviceId === deviceId && d.portId === port.id);
                          return (
                            <button
                              key={`${deviceId}-${port.id}`}
                              onClick={() => !isAlreadyAdded && addDeviceToStage(stage.id, deviceId, port)}
                              disabled={isAlreadyAdded}
                              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all ${
                                isAlreadyAdded ? 'bg-emerald-50 opacity-60' : 'bg-white hover:bg-emerald-50'
                              }`}
                            >
                              <span className="text-[14px]">{deviceTypeIcon(port.deviceType || '')}</span>
                              <div className="flex-1 min-w-0">
                                <div className="text-[12px] truncate">{port.name}</div>
                                <div className="text-[10px] text-gray-400">
                                  {deviceName} · 端口#{port.id} · {deviceTypeLabel(port.deviceType || port.type)}
                                </div>
                              </div>
                              {isAlreadyAdded && <Check className="w-4 h-4 text-emerald-500" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Delete stage */}
                <button
                  onClick={() => removeStage(stage.id)}
                  className="w-full text-[12px] text-red-400 py-2 flex items-center justify-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> 删除此阶段
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Add stage */}
        <button
          onClick={addNewStage}
          className="w-full border-2 border-dashed border-gray-200 rounded-2xl py-4 flex items-center justify-center gap-2 text-[13px] text-gray-400"
        >
          <Plus className="w-4 h-4" /> 添加控制阶段
        </button>
      </div>

      {/* Bottom save */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
        <button
          onClick={onBack}
          className="w-full py-3 rounded-xl bg-emerald-600 text-white text-[14px] active:bg-emerald-700"
        >
          保存策略
        </button>
      </div>
    </div>
  );
}
