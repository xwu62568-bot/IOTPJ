import { ArrowLeft, Wifi, WifiOff, Zap, Clock, Plus, Trash2, ChevronRight } from 'lucide-react';
import { Switch } from '../ui/switch';
import { useEffect, useState } from 'react';
import type { Device, DryContactPort, DryContactDeviceType } from '../../data/mock-data';
import { devices, dryContactDeviceTypes } from '../../data/mock-data';

const weekDayOptions = [
  { key: 'mon', label: '周一' },
  { key: 'tue', label: '周二' },
  { key: 'wed', label: '周三' },
  { key: 'thu', label: '周四' },
  { key: 'fri', label: '周五' },
  { key: 'sat', label: '周六' },
  { key: 'sun', label: '周日' },
] as const;

interface PortTimerStrategy {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  enabled: boolean;
  weekdays: string[];
}

export function DryContactDetail({
  device,
  onBack,
  initialEditingPort,
}: {
  device: Device;
  onBack: () => void;
  initialEditingPort?: number | null;
}) {
  const totalPorts = device.totalPorts || 12;
  const [ports, setPorts] = useState<DryContactPort[]>(
    device.ports || Array.from({ length: totalPorts }, (_, i) => ({
      id: i + 1, name: '', type: '', deviceType: '' as DryContactDeviceType, status: false, configured: false,
    }))
  );
  const [editingPort, setEditingPort] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editDeviceType, setEditDeviceType] = useState<DryContactDeviceType | ''>('');
  const [editMeter, setEditMeter] = useState('');
  const [portTimers, setPortTimers] = useState<Record<number, PortTimerStrategy[]>>({
    1: [{ id: 'port-1-timer-1', name: '白天运行', startTime: '08:00', endTime: '18:00', enabled: true, weekdays: ['mon', 'tue', 'wed', 'thu', 'fri'] }],
    3: [{ id: 'port-3-timer-1', name: '灌溉窗口', startTime: '09:00', endTime: '09:15', enabled: true, weekdays: ['mon', 'wed', 'fri'] }],
  });

  const meters = devices.filter(d => d.type === 'meter');

  const categories = Array.from(new Set(dryContactDeviceTypes.map(d => d.category)));
  const typesByCategory = categories.map(cat => ({
    category: cat,
    types: dryContactDeviceTypes.filter(d => d.category === cat),
  }));

  const startEdit = (port: DryContactPort) => {
    setEditingPort(port.id);
    setEditName(port.name);
    setEditDeviceType(port.deviceType || '');
    setEditMeter(port.meterId || '');
  };

  useEffect(() => {
    if (initialEditingPort === null || initialEditingPort === undefined) return;
    const port = ports.find(item => item.id === initialEditingPort);
    if (port) {
      startEdit(port);
    }
  }, [initialEditingPort]);

  const saveEdit = () => {
    if (editingPort === null) return;
    const dtInfo = dryContactDeviceTypes.find(d => d.key === editDeviceType);
    setPorts(prev => prev.map(p =>
      p.id === editingPort
        ? {
            ...p,
            name: editName,
            type: dtInfo?.label || editDeviceType || '',
            deviceType: editDeviceType as DryContactDeviceType,
            configured: editName.trim() !== '',
            meterId: editMeter || undefined,
          }
        : p
    ));
    setEditingPort(null);
  };

  const cancelEdit = () => setEditingPort(null);

  const togglePort = (id: number, value: boolean) => {
    setPorts(prev => prev.map(p => p.id === id ? { ...p, status: value } : p));
  };

  const getEditingTimers = () => {
    if (editingPort === null) return [];
    return portTimers[editingPort] || [];
  };

  const addTimer = () => {
    if (editingPort === null) return;
    const nextIndex = getEditingTimers().length + 1;
    const nextTimer: PortTimerStrategy = {
      id: `port-${editingPort}-timer-${Date.now()}`,
      name: `定时策略 ${nextIndex}`,
      startTime: '08:00',
      endTime: '18:00',
      enabled: true,
      weekdays: ['mon', 'tue', 'wed', 'thu', 'fri'],
    };
    setPortTimers(prev => ({
      ...prev,
      [editingPort]: [...(prev[editingPort] || []), nextTimer],
    }));
  };

  const updateTimer = (timerId: string, field: keyof PortTimerStrategy, value: string | boolean) => {
    if (editingPort === null) return;
    setPortTimers(prev => ({
      ...prev,
      [editingPort]: (prev[editingPort] || []).map(timer => (
        timer.id === timerId ? { ...timer, [field]: value } : timer
      )),
    }));
  };

  const removeTimer = (timerId: string) => {
    if (editingPort === null) return;
    setPortTimers(prev => ({
      ...prev,
      [editingPort]: (prev[editingPort] || []).filter(timer => timer.id !== timerId),
    }));
  };

  const toggleTimerWeekday = (timerId: string, dayKey: string) => {
    if (editingPort === null) return;
    setPortTimers(prev => ({
      ...prev,
      [editingPort]: (prev[editingPort] || []).map(timer => {
        if (timer.id !== timerId) return timer;
        const exists = timer.weekdays.includes(dayKey);
        return {
          ...timer,
          weekdays: exists
            ? timer.weekdays.filter(day => day !== dayKey)
            : [...timer.weekdays, dayKey],
        };
      }),
    }));
  };

  const configuredCount = ports.filter(p => p.configured).length;

  const getDeviceTypeInfo = (dt: DryContactDeviceType | string) => {
    return dryContactDeviceTypes.find(d => d.key === dt);
  };

  const editingPortData = editingPort === null ? null : ports.find(port => port.id === editingPort);
  const isDirectPortEntry = initialEditingPort !== null && initialEditingPort !== undefined;

  if (editingPort !== null && editingPortData) {
    return (
      <div className="space-y-4 -m-4 p-4 pb-24">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={isDirectPortEntry ? onBack : cancelEdit} className="w-8 h-8 flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h3 className="text-[16px] truncate">端口 {editingPort}</h3>
            <p className="text-[11px] text-gray-400 truncate">{device.name} · 端口设备配置</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-2">
          <div className="flex justify-between text-[13px]">
            <span className="text-gray-400">端口编号</span>
            <span>#{editingPortData.id}</span>
          </div>
          <div className="flex justify-between text-[13px]">
            <span className="text-gray-400">当前状态</span>
            <span className={editingPortData.status ? 'text-emerald-600' : 'text-gray-400'}>
              {editingPortData.status ? '运行中' : '已关闭'}
            </span>
          </div>
          <div className="flex justify-between text-[13px]">
            <span className="text-gray-400">已配策略</span>
            <span>{getEditingTimers().length} 条定时策略</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
          <div>
            <label className="text-[12px] text-gray-400 block mb-1">端口名称</label>
            <input
              value={editName}
              onChange={e => setEditName(e.target.value)}
              placeholder="例如：补光灯-1"
              className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-[14px] outline-none border border-gray-100 focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="text-[12px] text-gray-400 block mb-1.5">设备类型</label>
            <select
              value={editDeviceType}
              onChange={e => {
                const value = e.target.value as DryContactDeviceType | '';
                setEditDeviceType(value);
                if (!editName && value) {
                  setEditName(getDeviceTypeInfo(value)?.label || '');
                }
              }}
              className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-[14px] appearance-none outline-none border border-gray-100"
            >
              <option value="">请选择设备类型</option>
              {typesByCategory.map(({ category, types }) => (
                <optgroup key={category} label={category}>
                  {types.map(type => (
                    <option key={type.key} value={type.key}>
                      {type.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[12px] text-gray-400 block mb-1">关联电表</label>
            <select
              value={editMeter}
              onChange={e => setEditMeter(e.target.value)}
              className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-[14px] appearance-none outline-none border border-gray-100"
            >
              <option value="">不关联</option>
              {meters.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-500" />
              <span className="text-[13px]">定时策略</span>
            </div>
            <button
              onClick={addTimer}
              className="px-2.5 py-1 rounded-lg bg-white text-[12px] text-emerald-600 border border-emerald-100 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              新增
            </button>
          </div>

          {getEditingTimers().length === 0 ? (
            <div className="bg-white rounded-xl p-3 text-[12px] text-gray-400 text-center">
              当前端口还没有配置定时策略
            </div>
          ) : (
            <div className="space-y-2">
              {getEditingTimers().map((timer, index) => (
                <div key={timer.id} className="bg-white rounded-xl p-3 space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      value={timer.name}
                      onChange={e => updateTimer(timer.id, 'name', e.target.value)}
                      className="flex-1 bg-gray-50 rounded-lg px-3 py-2 text-[13px] outline-none border border-gray-100"
                    />
                    <Switch
                      checked={timer.enabled}
                      onCheckedChange={value => updateTimer(timer.id, 'enabled', value)}
                    />
                    <button
                      onClick={() => removeTimer(timer.id)}
                      className="w-8 h-8 flex items-center justify-center text-gray-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-gray-400 block mb-1">开始时间</label>
                      <input
                        type="time"
                        value={timer.startTime}
                        onChange={e => updateTimer(timer.id, 'startTime', e.target.value)}
                        className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-[13px] outline-none border border-gray-100"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-gray-400 block mb-1">结束时间</label>
                      <input
                        type="time"
                        value={timer.endTime}
                        onChange={e => updateTimer(timer.id, 'endTime', e.target.value)}
                        className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-[13px] outline-none border border-gray-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-gray-400 block mb-1.5">生效星期</label>
                    <div className="flex flex-wrap gap-1.5">
                      {weekDayOptions.map(day => (
                        <button
                          key={day.key}
                          onClick={() => toggleTimerWeekday(timer.id, day.key)}
                          className={`px-2.5 py-1.5 rounded-lg text-[12px] ${
                            timer.weekdays.includes(day.key)
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {day.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="text-[11px] text-gray-400">
                    策略 {index + 1}：在所选星期的设定时间窗内允许该端口自动执行。
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          {editName.trim() !== '' && (
            <button
              onClick={() => {
                setEditName('');
                setEditDeviceType('');
                setEditMeter('');
                setPortTimers(prev => {
                  const next = { ...prev };
                  delete next[editingPort];
                  return next;
                });
                setPorts(prev => prev.map(p =>
                  p.id === editingPort
                    ? { ...p, name: '', type: '', deviceType: '' as DryContactDeviceType, configured: false, status: false, meterId: undefined }
                    : p
                ));
                setEditingPort(null);
              }}
              className="flex-1 border border-red-200 text-red-500 rounded-xl py-3 text-[14px]"
            >
              清除配置
            </button>
          )}
          <button onClick={saveEdit} className="flex-1 bg-emerald-600 text-white rounded-xl py-3 text-[14px]">
            保存
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 -m-4 p-4">
      <div className="flex items-center gap-3 mb-2">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h3 className="text-[16px]">干接点设备</h3>
      </div>

      {/* Info */}
      <div className="bg-white rounded-2xl p-4 shadow-sm space-y-2">
        <div className="flex justify-between text-[13px]">
          <span className="text-gray-400">设备名称</span><span>{device.name}</span>
        </div>
        <div className="flex justify-between text-[13px]">
          <span className="text-gray-400">设备编号</span><span>{device.id}</span>
        </div>
        <div className="flex justify-between text-[13px]">
          <span className="text-gray-400">在线状态</span>
          <span className="flex items-center gap-1">
            {device.online ? <><Wifi className="w-3 h-3 text-emerald-500" /> 在线</> : <><WifiOff className="w-3 h-3 text-gray-400" /> 离线</>}
          </span>
        </div>
        <div className="flex justify-between text-[13px]">
          <span className="text-gray-400">端口总数</span><span>{totalPorts}</span>
        </div>
        <div className="flex justify-between text-[13px]">
          <span className="text-gray-400">最近通信</span><span>{device.lastReport}</span>
        </div>
        {device.meterId && (
          <div className="flex justify-between text-[13px]">
            <span className="text-gray-400">关联电表</span>
            <span className="flex items-center gap-1 text-purple-600">
              <Zap className="w-3 h-3" />
              {devices.find(d => d.id === device.meterId)?.name || device.meterId}
            </span>
          </div>
        )}
        <div className="flex justify-between text-[13px]">
          <span className="text-gray-400">端口配置</span>
          <span>{configuredCount} / {ports.length} 已配置</span>
        </div>
      </div>

      {/* All Ports */}
      <div>
        <span className="text-[12px] text-gray-400 ml-1 mb-2 block">全部端口 (1~{ports.length})</span>
        <div className="space-y-2">
          {ports.map(port => {
            const dtInfo = getDeviceTypeInfo(port.deviceType || '');
            return (
              <div key={port.id} className={`bg-white rounded-2xl shadow-sm overflow-hidden ${!port.configured ? 'opacity-60' : ''}`}>
                <div className="flex items-center gap-3 p-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[16px] ${
                    !port.configured ? 'bg-gray-100 text-gray-400 text-[11px]' : 'bg-emerald-50'
                  }`}>
                    {port.configured ? (dtInfo?.icon || '⚙️') : port.id}
                  </div>
                  <button onClick={() => startEdit(port)} className="flex-1 min-w-0 text-left">
                    <div className="text-[13px]">
                      {port.configured ? port.name : <span className="text-gray-400">未配置</span>}
                    </div>
                    <div className="text-[11px] text-gray-400 flex items-center gap-1 flex-wrap">
                      端口 {port.id}
                      {port.configured && dtInfo && <> · {dtInfo.label}</>}
                      {port.meterId && (
                        <span className="text-purple-500 flex items-center gap-0.5 ml-1">
                          <Zap className="w-2.5 h-2.5" />
                          {devices.find(d => d.id === port.meterId)?.name}
                        </span>
                      )}
                      {Boolean(portTimers[port.id]?.length) && (
                        <span className="text-amber-500 flex items-center gap-0.5 ml-1">
                          <Clock className="w-2.5 h-2.5" />
                          {portTimers[port.id].length} 条定时
                        </span>
                      )}
                    </div>
                  </button>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                  {port.configured && (
                    <Switch checked={port.status} onCheckedChange={v => togglePort(port.id, v)} disabled={!device.online} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
