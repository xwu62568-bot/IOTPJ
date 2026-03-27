import { useState } from 'react';
import { BarChart3, Volume2, VolumeX, MapPin, ArrowLeft, Wifi, WifiOff, RefreshCw, Settings, Edit, Sliders } from 'lucide-react';
import { sensors } from '../../data/mock-data';
import type { SensorData } from '../../data/mock-data';

const mockHistory = [
  { time: '12:00', temp: 16.2, hum: 63.5, co2: 580 },
  { time: '12:30', temp: 16.5, hum: 63.0, co2: 595 },
  { time: '13:00', temp: 16.8, hum: 62.5, co2: 610 },
  { time: '13:30', temp: 17.0, hum: 62.0, co2: 620 },
  { time: '14:00', temp: 16.9, hum: 62.0, co2: 615 },
  { time: '14:30', temp: 16.9, hum: 62.0, co2: 620 },
];

function SensorDetail({ sensor, onBack }: { sensor: SensorData; onBack: () => void }) {
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(sensor.name);
  const [calibration, setCalibration] = useState({ temp: '0', hum: '0', co2: '0' });

  const maxCo2 = Math.max(...mockHistory.map(h => h.co2));
  const minCo2 = Math.min(...mockHistory.map(h => h.co2));

  return (
    <div className="space-y-4 -m-4 p-4">
      <div className="flex items-center gap-3 mb-2">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h3 className="text-[16px]">传感器详情</h3>
      </div>

      {/* Info card */}
      <div className="bg-white rounded-2xl p-4 shadow-sm space-y-2">
        <div className="flex justify-between text-[13px]">
          <span className="text-gray-400">名称</span>
          {editingName ? (
            <div className="flex items-center gap-1">
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                className="bg-gray-50 rounded-lg px-2 py-0.5 text-[13px] w-32"
                autoFocus
              />
              <button onClick={() => setEditingName(false)} className="text-emerald-600 text-[12px]">确定</button>
            </div>
          ) : (
            <button onClick={() => setEditingName(true)} className="flex items-center gap-1">
              <span>{name}</span>
              <Edit className="w-3 h-3 text-gray-400" />
            </button>
          )}
        </div>
        <div className="flex justify-between text-[13px]">
          <span className="text-gray-400">型号</span><span>{sensor.model}</span>
        </div>
        <div className="flex justify-between text-[13px]">
          <span className="text-gray-400">ID</span><span>{sensor.id}</span>
        </div>
        <div className="flex justify-between text-[13px]">
          <span className="text-gray-400">状态</span>
          <span className="flex items-center gap-1">
            {sensor.online ? <><Wifi className="w-3 h-3 text-emerald-500" /> 在线</> : <><WifiOff className="w-3 h-3 text-gray-400" /> 离线</>}
          </span>
        </div>
        <div className="flex justify-between text-[13px]">
          <span className="text-gray-400">最近更新</span><span>{sensor.lastUpdate}</span>
        </div>
      </div>

      {/* Current readings */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <span className="text-[12px] text-gray-400 block mb-2">当前读数</span>
        <div className="grid grid-cols-2 gap-2">
          {sensor.metrics.map(m => (
            <div key={m.label} className="bg-gray-50 rounded-xl p-3 text-center">
              <div className="text-[10px] text-gray-400">{m.label}</div>
              <div className={`text-[20px] ${m.value === '--' ? 'text-gray-300' : 'text-gray-700'}`}>
                {m.value}<span className="text-[10px] ml-0.5">{m.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mini trend chart (bar-based) */}
      {sensor.online && sensor.metrics.length > 1 && (
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] text-gray-400">CO₂ 趋势 (近3h)</span>
            <button className="flex items-center gap-1 text-[11px] text-blue-500 bg-blue-50 px-2 py-1 rounded-full">
              <BarChart3 className="w-3 h-3" /> 查看更多
            </button>
          </div>
          <div className="flex items-end gap-1.5 h-20">
            {mockHistory.map((d, i) => {
              const h = ((d.co2 - minCo2 + 20) / (maxCo2 - minCo2 + 40)) * 100;
              const isLast = i === mockHistory.length - 1;
              return (
                <div key={d.time} className="flex-1 flex flex-col items-center gap-0.5">
                  {isLast && <span className="text-[8px] text-emerald-600">{d.co2}</span>}
                  <div
                    className={`w-full rounded-sm ${isLast ? 'bg-emerald-500' : 'bg-emerald-200'}`}
                    style={{ height: `${h}%` }}
                  />
                  <span className="text-[8px] text-gray-400">{d.time.split(':')[0]}:{d.time.split(':')[1]}</span>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3">
            {mockHistory.length > 0 && (
              <>
                <div className="bg-red-50 rounded-lg p-1.5 text-center">
                  <div className="text-[9px] text-gray-400">温度趋势</div>
                  <div className="text-[13px] text-red-600">
                    {mockHistory[mockHistory.length - 1].temp}℃
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-1.5 text-center">
                  <div className="text-[9px] text-gray-400">湿度趋势</div>
                  <div className="text-[13px] text-blue-600">
                    {mockHistory[mockHistory.length - 1].hum}%
                  </div>
                </div>
                <div className="bg-amber-50 rounded-lg p-1.5 text-center">
                  <div className="text-[9px] text-gray-400">CO₂趋势</div>
                  <div className="text-[13px] text-amber-600">
                    {mockHistory[mockHistory.length - 1].co2}PPM
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Calibration */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Sliders className="w-4 h-4 text-emerald-500" />
          <span className="text-[13px]">校准偏移</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-[11px] text-gray-400 block mb-1">温度 (℃)</label>
            <input
              value={calibration.temp}
              onChange={e => setCalibration(prev => ({ ...prev, temp: e.target.value }))}
              className="w-full bg-gray-50 rounded-xl px-3 py-2 text-[14px] text-center"
            />
          </div>
          <div>
            <label className="text-[11px] text-gray-400 block mb-1">湿度 (%)</label>
            <input
              value={calibration.hum}
              onChange={e => setCalibration(prev => ({ ...prev, hum: e.target.value }))}
              className="w-full bg-gray-50 rounded-xl px-3 py-2 text-[14px] text-center"
            />
          </div>
          <div>
            <label className="text-[11px] text-gray-400 block mb-1">CO₂ (PPM)</label>
            <input
              value={calibration.co2}
              onChange={e => setCalibration(prev => ({ ...prev, co2: e.target.value }))}
              className="w-full bg-gray-50 rounded-xl px-3 py-2 text-[14px] text-center"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button className="flex-1 border border-gray-200 text-gray-500 rounded-xl py-3 text-[14px] flex items-center justify-center gap-1">
          <RefreshCw className="w-4 h-4" /> 重启传感器
        </button>
        <button className="flex-1 bg-emerald-600 text-white rounded-xl py-3 text-[14px]" onClick={onBack}>
          保存
        </button>
      </div>
    </div>
  );
}

export function SensorsTab({ onSubPageChange }: { onSubPageChange?: (inSub: boolean) => void }) {
  const [sourceMode, setSourceMode] = useState<'avg' | 'specific'>('avg');
  const [selectedSensor, setSelectedSensor] = useState<string | null>(null);

  const goToDetail = (id: string) => {
    setSelectedSensor(id);
    onSubPageChange?.(true);
  };
  const goBack = () => {
    setSelectedSensor(null);
    onSubPageChange?.(false);
  };

  const sensor = sensors.find(s => s.id === selectedSensor);
  if (sensor) return <SensorDetail sensor={sensor} onBack={goBack} />;

  const onlineCount = sensors.filter(s => s.online).length;

  return (
    <div className="space-y-3">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white rounded-xl p-2.5 shadow-sm text-center">
          <div className="text-[16px] text-gray-800">{sensors.length}</div>
          <div className="text-[10px] text-gray-400">总数</div>
        </div>
        <div className="bg-white rounded-xl p-2.5 shadow-sm text-center">
          <div className="text-[16px] text-emerald-600">{onlineCount}</div>
          <div className="text-[10px] text-gray-400">在线</div>
        </div>
        <div className="bg-white rounded-xl p-2.5 shadow-sm text-center">
          <div className="text-[16px] text-gray-400">{sensors.length - onlineCount}</div>
          <div className="text-[10px] text-gray-400">离线</div>
        </div>
      </div>

      {/* Data source toggle */}
      <div className="bg-white rounded-2xl p-3 shadow-sm">
        <span className="text-[11px] text-gray-400 block mb-2">首页传感数据来源</span>
        <div className="flex bg-gray-100 rounded-xl p-0.5">
          <button
            onClick={() => setSourceMode('avg')}
            className={`flex-1 py-2 rounded-lg text-[12px] transition-colors ${
              sourceMode === 'avg' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500'
            }`}
          >
            平均值
          </button>
          <button
            onClick={() => setSourceMode('specific')}
            className={`flex-1 py-2 rounded-lg text-[12px] transition-colors ${
              sourceMode === 'specific' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500'
            }`}
          >
            指定传感器
          </button>
        </div>
      </div>

      {/* Sensor cards */}
      {sensors.map(sensor => (
        <button
          key={sensor.id}
          onClick={() => goToDetail(sensor.id)}
          className={`w-full text-left rounded-2xl p-4 shadow-sm ${
            sensor.online ? 'bg-white border-l-4 border-blue-500' : 'bg-gray-50 border-l-4 border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-[14px]">{sensor.name}</h4>
                <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">ID:{sensor.id}</span>
              </div>
              <span className="text-[11px] text-gray-400">{sensor.model} · {sensor.lastUpdate}</span>
            </div>
            <div className="flex gap-1.5">
              {sensor.online ? (
                <span className="text-[10px] text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <Wifi className="w-2.5 h-2.5" /> 在线
                </span>
              ) : (
                <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <WifiOff className="w-2.5 h-2.5" /> 离线
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {sensor.metrics.map(m => (
              <div key={m.label} className="bg-gray-50 rounded-lg p-2">
                <div className="text-[10px] text-gray-400">{m.label}</div>
                <div className={`text-[16px] ${m.value === '--' ? 'text-gray-300' : 'text-gray-700'}`}>
                  {m.value}<span className="text-[10px] ml-0.5">{m.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </button>
      ))}
    </div>
  );
}
