import { ArrowLeft, Wifi, Power } from 'lucide-react';
import type { Device } from '../../data/mock-data';
import { devices } from '../../data/mock-data';

const voltageParams = [
  { label: 'A相电压', value: '220.3V' },
  { label: 'B相电压', value: '221.1V' },
  { label: 'C相电压', value: '219.8V' },
  { label: '线电压平均', value: '220.4V' },
  { label: 'AB线电压', value: '381.2V' },
  { label: 'BC线电压', value: '382.0V' },
  { label: 'CA线电压', value: '380.5V' },
  { label: '线平均电压', value: '381.2V' },
];

const currentParams = [
  { label: 'A相电流', value: '12.5A' },
  { label: 'B相电流', value: '11.8A' },
  { label: 'C相电流', value: '13.2A' },
  { label: '平均电流', value: '12.5A' },
];

const powerParams = [
  { label: '总有功功率', value: '8.24 kW' },
  { label: '总无功功率', value: '1.52 kVar' },
  { label: '总视在功率', value: '8.38 kVA' },
];

const energyParams = [
  { label: '正向有功总电能', value: '12,456 kWh' },
  { label: '反向有功总电能', value: '0 kWh' },
  { label: '正向无功总电能', value: '2,345 kVarh' },
  { label: '反向无功总电能', value: '0 kVarh' },
];

const pfParams = [
  { label: 'A相功率因数', value: '0.98' },
  { label: 'B相功率因数', value: '0.97' },
  { label: 'C相功率因数', value: '0.96' },
  { label: '总功率因数', value: '0.97' },
];

const deviceStatus = [
  { label: '设备温度', value: '35.2℃' },
  { label: '设备湿度', value: '42%' },
  { label: '设备工作时间', value: '2,456h' },
  { label: '电池电压', value: '3.6V' },
  { label: '信号强度', value: '-68dBm' },
];

export function MeterDetail({ device, onBack }: { device: Device; onBack: () => void }) {
  // Find associated dry-contact devices
  const associatedDevs = (device.associatedDevices || [])
    .map(id => devices.find(d => d.id === id))
    .filter(Boolean) as Device[];

  return (
    <div className="space-y-4 -m-4 p-4">
      <div className="flex items-center gap-3 mb-2">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h3 className="text-[16px]">电表设备详情</h3>
      </div>

      {/* Overview */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[15px]">{device.name}</span>
          <span className="flex items-center gap-1 text-[11px] text-emerald-500"><Wifi className="w-3 h-3" /> 在线</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-blue-50 rounded-xl p-2 text-center">
            <div className="text-[10px] text-gray-400">电压</div>
            <div className="text-[16px] text-blue-600">{device.voltage || '220.4V'}</div>
          </div>
          <div className="bg-emerald-50 rounded-xl p-2 text-center">
            <div className="text-[10px] text-gray-400">电流</div>
            <div className="text-[16px] text-emerald-600">{device.current || '12.5A'}</div>
          </div>
          <div className="bg-purple-50 rounded-xl p-2 text-center">
            <div className="text-[10px] text-gray-400">功率</div>
            <div className="text-[16px] text-purple-600">{device.power || '8.24kW'}</div>
          </div>
        </div>
      </div>

      {/* Associated Devices */}
      {associatedDevs.length > 0 && (
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <span className="text-[12px] text-gray-400 block mb-2">关联设备 ({associatedDevs.length})</span>
          <div className="space-y-2">
            {associatedDevs.map(dev => {
              const configuredPorts = dev.ports?.filter(p => p.configured) || [];
              const linkedPorts = dev.ports?.filter(p => p.meterId === device.id) || [];
              return (
                <div key={dev.id} className="bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Power className="w-4 h-4 text-emerald-500" />
                    <span className="text-[13px]">{dev.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${dev.online ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-200 text-gray-500'}`}>
                      {dev.online ? '在线' : '离线'}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-400 mb-2">
                    {configuredPorts.length} 端口已配置 · {linkedPorts.length} 端口关联此电表
                  </div>
                  {linkedPorts.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {linkedPorts.map(port => (
                        <span key={port.id} className="bg-purple-50 text-purple-600 px-2 py-0.5 rounded-lg text-[11px]">
                          #{port.id} {port.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sections */}
      {[
        { title: '电压参数', items: voltageParams, bgColor: 'bg-blue-50' },
        { title: '电流参数', items: currentParams, bgColor: 'bg-emerald-50' },
        { title: '功率参数', items: powerParams, bgColor: 'bg-amber-50' },
        { title: '电能参数', items: energyParams, bgColor: 'bg-orange-50' },
        { title: '功率因数', items: pfParams, bgColor: 'bg-purple-50' },
        { title: '设备状态', items: deviceStatus, bgColor: 'bg-gray-50' },
      ].map(section => (
        <div key={section.title} className="bg-white rounded-2xl p-4 shadow-sm">
          <span className="text-[12px] text-gray-400 block mb-2">{section.title}</span>
          <div className="space-y-1.5">
            {section.items.map(item => (
              <div key={item.label} className={`flex justify-between items-center ${section.bgColor} rounded-lg px-3 py-2`}>
                <span className="text-[12px] text-gray-500">{item.label}</span>
                <span className="text-[13px]">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
