import { useState } from 'react';
import { Wifi, WifiOff, Power, Zap, ChevronRight } from 'lucide-react';
import { devices, dryContactDeviceTypes } from '../../data/mock-data';
import { DryContactDetail } from '../config/dry-contact-detail';
import { MeterDetail } from '../config/meter-detail';
import { Switch } from '../ui/switch';

export function DevicesTab({ onSubPageChange }: { onSubPageChange?: (inSub: boolean) => void }) {
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [selectedPort, setSelectedPort] = useState<number | null>(null);
  const [portStates, setPortStates] = useState<Record<string, Record<number, boolean>>>(() => {
    const init: Record<string, Record<number, boolean>> = {};
    devices.forEach(dev => {
      if (dev.ports) {
        init[dev.id] = {};
        dev.ports.forEach(p => { init[dev.id][p.id] = p.status; });
      }
    });
    return init;
  });

  const goToDetail = (id: string, portId?: number) => {
    setSelectedDevice(id);
    setSelectedPort(portId ?? null);
    onSubPageChange?.(true);
  };
  const goBack = () => {
    setSelectedDevice(null);
    setSelectedPort(null);
    onSubPageChange?.(false);
  };

  const device = devices.find(d => d.id === selectedDevice);
  if (device && device.type === 'dry-contact') {
    return <DryContactDetail device={device} onBack={goBack} initialEditingPort={selectedPort} />;
  }
  if (device && device.type === 'meter') return <MeterDetail device={device} onBack={goBack} />;

  const togglePort = (deviceId: string, portId: number, value: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    setPortStates(prev => ({
      ...prev,
      [deviceId]: { ...prev[deviceId], [portId]: value }
    }));
  };

  return (
    <div className="space-y-3">
      {devices.map(dev => {
        if (dev.type === 'dry-contact') {
          const configuredPorts = dev.ports?.filter(p => p.configured) || [];
          return (
            <div
              key={dev.id}
              className="bg-white rounded-2xl shadow-sm overflow-hidden"
            >
              {/* Header - clickable to detail */}
              <button
                onClick={() => goToDetail(dev.id)}
                className="w-full px-4 pt-4 pb-2 text-left"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Power className="w-5 h-5 text-emerald-500" />
                    <h4 className="text-[14px]">{dev.name}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    {dev.online ? (
                      <span className="flex items-center gap-1 text-[11px] text-emerald-500">
                        <Wifi className="w-3 h-3" /> 在线
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] text-gray-400">
                        <WifiOff className="w-3 h-3" /> 离线
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </div>
                </div>
                <div className="text-[11px] text-gray-400">
                  干接点 · {configuredPorts.length}/{dev.totalPorts || 12} 端口已配置 · {dev.lastReport}
                </div>
              </button>

              {/* Configured ports with toggle */}
              {configuredPorts.length > 0 && (
                <div className="px-4 pb-4 pt-1">
                  <div className="space-y-1.5">
                    {configuredPorts.map(port => {
                      const isOn = portStates[dev.id]?.[port.id] ?? port.status;
                      return (
                        <div
                          key={port.id}
                          className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2 gap-2"
                        >
                          <button
                            onClick={() => goToDetail(dev.id, port.id)}
                            className="flex items-center gap-2 flex-1 min-w-0 text-left"
                          >
                            <span className="w-6 h-6 rounded-lg flex items-center justify-center text-[12px] shrink-0">
                              {dryContactDeviceTypes.find(d => d.key === port.deviceType)?.icon || '⚙️'}
                            </span>
                            <span className="text-[12px] truncate">{port.name}</span>
                            <span className="text-[10px] text-gray-400 shrink-0">#{port.id}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                          </button>
                          <div onClick={e => e.stopPropagation()} className="shrink-0">
                            <Switch
                              checked={isOn}
                              onCheckedChange={v => {
                                setPortStates(prev => ({
                                  ...prev,
                                  [dev.id]: { ...prev[dev.id], [port.id]: v }
                                }));
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        }

        // Meter card
        return (
          <button
            key={dev.id}
            onClick={() => goToDetail(dev.id)}
            className="w-full bg-white rounded-2xl p-4 text-left shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-500" />
                <h4 className="text-[14px]">{dev.name}</h4>
              </div>
              <div className="flex items-center gap-2">
                {dev.online ? (
                  <span className="flex items-center gap-1 text-[11px] text-emerald-500">
                    <Wifi className="w-3 h-3" /> 在线
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] text-gray-400">
                    <WifiOff className="w-3 h-3" /> 离线
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </div>
            </div>

            <div className="text-[11px] text-gray-400 mb-3">
              电表 · 关联 {dev.associatedDevices?.length || 0} 台设备 · {dev.lastReport}
            </div>

            {/* Summary data grid */}
            <div className="grid grid-cols-3 gap-2 mb-2">
              <div className="bg-blue-50 rounded-lg p-2 text-center">
                <div className="text-[10px] text-gray-400">电压</div>
                <div className="text-[14px] text-blue-600">{dev.voltage || '--'}</div>
              </div>
              <div className="bg-emerald-50 rounded-lg p-2 text-center">
                <div className="text-[10px] text-gray-400">电流</div>
                <div className="text-[14px] text-emerald-600">{dev.current || '--'}</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-2 text-center">
                <div className="text-[10px] text-gray-400">功率</div>
                <div className="text-[14px] text-purple-600">{dev.power || '--'}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-orange-50 rounded-lg p-2 text-center">
                <div className="text-[10px] text-gray-400">累计电能</div>
                <div className="text-[13px] text-orange-600">{dev.energy || '--'}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <div className="text-[10px] text-gray-400">功率因数</div>
                <div className="text-[13px] text-gray-600">{dev.powerFactor || '--'}</div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
