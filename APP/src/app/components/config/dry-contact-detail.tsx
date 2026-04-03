import { ArrowLeft, Wifi, WifiOff, Settings, Zap, X, ChevronDown } from 'lucide-react';
import { Switch } from '../ui/switch';
import { useState } from 'react';
import type { Device, DryContactPort, DryContactDeviceType } from '../../data/mock-data';
import { devices, dryContactDeviceTypes } from '../../data/mock-data';

export function DryContactDetail({ device, onBack }: { device: Device; onBack: () => void }) {
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
  const [showTypeCategory, setShowTypeCategory] = useState<string | null>(null);

  const meters = devices.filter(d => d.type === 'meter');

  // Group device types by category
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
    setShowTypeCategory(null);
  };

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

  const configuredCount = ports.filter(p => p.configured).length;

  const getDeviceTypeInfo = (dt: DryContactDeviceType | string) => {
    return dryContactDeviceTypes.find(d => d.key === dt);
  };

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
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px]">
                      {port.configured ? port.name : <span className="text-gray-400">未配置</span>}
                    </div>
                    <div className="text-[11px] text-gray-400 flex items-center gap-1">
                      端口 {port.id}
                      {port.configured && dtInfo && <> · {dtInfo.label}</>}
                      {port.meterId && (
                        <span className="text-purple-500 flex items-center gap-0.5 ml-1">
                          <Zap className="w-2.5 h-2.5" />
                          {devices.find(d => d.id === port.meterId)?.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <button onClick={() => startEdit(port)} className="w-8 h-8 flex items-center justify-center text-gray-400">
                    <Settings className="w-4 h-4" />
                  </button>
                  {port.configured && (
                    <Switch checked={port.status} onCheckedChange={v => togglePort(port.id, v)} disabled={!device.online} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Modal */}
      {editingPort !== null && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center">
          <div className="bg-white rounded-t-3xl w-full max-w-lg p-5 pb-8 space-y-4 animate-[slideUp_0.2s_ease-out] max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h4 className="text-[15px]">配置端口 {editingPort}</h4>
              <button onClick={cancelEdit} className="w-8 h-8 flex items-center justify-center">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

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
              {/* Selected type display */}
              {editDeviceType && (
                <div className="bg-emerald-50 rounded-xl p-2.5 mb-2 flex items-center gap-2">
                  <span className="text-[16px]">{getDeviceTypeInfo(editDeviceType)?.icon}</span>
                  <span className="text-[13px] text-emerald-700">{getDeviceTypeInfo(editDeviceType)?.label}</span>
                  <button onClick={() => setEditDeviceType('')} className="ml-auto">
                    <X className="w-3.5 h-3.5 text-emerald-400" />
                  </button>
                </div>
              )}
              {/* Categories */}
              <div className="space-y-1">
                {typesByCategory.map(({ category, types }) => (
                  <div key={category}>
                    <button
                      onClick={() => setShowTypeCategory(showTypeCategory === category ? null : category)}
                      className="w-full flex items-center justify-between px-2 py-1.5 text-[12px] text-gray-500 bg-gray-50 rounded-lg"
                    >
                      <span>{category}</span>
                      <ChevronDown className={`w-3 h-3 transition-transform ${showTypeCategory === category ? 'rotate-180' : ''}`} />
                    </button>
                    {showTypeCategory === category && (
                      <div className="flex flex-wrap gap-1.5 mt-1.5 mb-1">
                        {types.map(t => (
                          <button
                            key={t.key}
                            onClick={() => {
                              setEditDeviceType(t.key as DryContactDeviceType);
                              if (!editName) setEditName(t.label);
                              setShowTypeCategory(null);
                            }}
                            className={`px-2.5 py-1.5 rounded-lg text-[12px] flex items-center gap-1 ${
                              editDeviceType === t.key
                                ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            <span className="text-[14px]">{t.icon}</span> {t.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
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

            <div className="flex gap-3 pt-2">
              {editName.trim() !== '' && (
                <button
                  onClick={() => {
                    setEditName('');
                    setEditDeviceType('');
                    setEditMeter('');
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
        </div>
      )}
    </div>
  );
}
