import { useState } from 'react';
import { ArrowLeft, Sun, Moon, Droplets, Wind, SlidersHorizontal } from 'lucide-react';
import { Switch } from '../ui/switch';

export function HumidityConfig({ onBack }: { onBack: () => void }) {
  const [dayDehumStart, setDayDehumStart] = useState('75');
  const [dayDehumStop, setDayDehumStop] = useState('65');
  const [dayHumStart, setDayHumStart] = useState('40');
  const [dayHumStop, setDayHumStop] = useState('50');

  const [nightDehumStart, setNightDehumStart] = useState('70');
  const [nightDehumStop, setNightDehumStop] = useState('60');
  const [nightHumStart, setNightHumStart] = useState('45');
  const [nightHumStop, setNightHumStop] = useState('55');

  const [humidifyEnabled, setHumidifyEnabled] = useState(true);
  const [humidifyDevice, setHumidifyDevice] = useState('加湿器 A');
  const [humidifyMinRun, setHumidifyMinRun] = useState('30');

  const [dehumidifyEnabled, setDehumidifyEnabled] = useState(true);
  const [dehumidifyDevice, setDehumidifyDevice] = useState('风机 + 湿帘');
  const [dehumidifyMinRun, setDehumidifyMinRun] = useState('60');
  const [dehumCoolLink, setDehumCoolLink] = useState(true);

  const [hysteresis, setHysteresis] = useState('3');
  const [responseDelay, setResponseDelay] = useState('30');

  return (
    <div className="space-y-4 -m-4 p-4">
      <div className="flex items-center gap-3 mb-2">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h3 className="text-[16px]">湿度设置</h3>
      </div>

      {/* Day Humidity Strategy */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Sun className="w-4 h-4 text-amber-500" />
          <span className="text-[13px]">白天湿度策略</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-gray-400 block mb-1">除湿启动 (%RH)</label>
            <input value={dayDehumStart} onChange={e => setDayDehumStart(e.target.value)} className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-[14px]" />
          </div>
          <div>
            <label className="text-[11px] text-gray-400 block mb-1">除湿停止 (%RH)</label>
            <input value={dayDehumStop} onChange={e => setDayDehumStop(e.target.value)} className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-[14px]" />
          </div>
          <div>
            <label className="text-[11px] text-gray-400 block mb-1">加湿启动 (%RH)</label>
            <input value={dayHumStart} onChange={e => setDayHumStart(e.target.value)} className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-[14px]" />
          </div>
          <div>
            <label className="text-[11px] text-gray-400 block mb-1">加湿停止 (%RH)</label>
            <input value={dayHumStop} onChange={e => setDayHumStop(e.target.value)} className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-[14px]" />
          </div>
        </div>
      </div>

      {/* Night Humidity Strategy */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Moon className="w-4 h-4 text-indigo-500" />
          <span className="text-[13px]">夜晚湿度策略</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-gray-400 block mb-1">除湿启动 (%RH)</label>
            <input value={nightDehumStart} onChange={e => setNightDehumStart(e.target.value)} className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-[14px]" />
          </div>
          <div>
            <label className="text-[11px] text-gray-400 block mb-1">除湿停止 (%RH)</label>
            <input value={nightDehumStop} onChange={e => setNightDehumStop(e.target.value)} className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-[14px]" />
          </div>
          <div>
            <label className="text-[11px] text-gray-400 block mb-1">加湿启动 (%RH)</label>
            <input value={nightHumStart} onChange={e => setNightHumStart(e.target.value)} className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-[14px]" />
          </div>
          <div>
            <label className="text-[11px] text-gray-400 block mb-1">加湿停止 (%RH)</label>
            <input value={nightHumStop} onChange={e => setNightHumStop(e.target.value)} className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-[14px]" />
          </div>
        </div>
      </div>

      {/* Humidify Control */}
      <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-blue-500" />
            <span className="text-[13px]">加湿控制</span>
          </div>
          <Switch checked={humidifyEnabled} onCheckedChange={setHumidifyEnabled} />
        </div>
        {humidifyEnabled && (
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-[11px] text-gray-400 block mb-1">加湿设备</label>
              <input value={humidifyDevice} onChange={e => setHumidifyDevice(e.target.value)} className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-[14px]" />
            </div>
            <div>
              <label className="text-[11px] text-gray-400 block mb-1">最小运行时间 (秒)</label>
              <input value={humidifyMinRun} onChange={e => setHumidifyMinRun(e.target.value)} className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-[14px]" />
            </div>
          </div>
        )}
      </div>

      {/* Dehumidify Control */}
      <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-teal-500" />
            <span className="text-[13px]">除湿控制</span>
          </div>
          <Switch checked={dehumidifyEnabled} onCheckedChange={setDehumidifyEnabled} />
        </div>
        {dehumidifyEnabled && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-[11px] text-gray-400 block mb-1">除湿设备</label>
                <input value={dehumidifyDevice} onChange={e => setDehumidifyDevice(e.target.value)} className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-[14px]" />
              </div>
              <div>
                <label className="text-[11px] text-gray-400 block mb-1">最小运行时间 (秒)</label>
                <input value={dehumidifyMinRun} onChange={e => setDehumidifyMinRun(e.target.value)} className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-[14px]" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px]">除湿与制冷关联</span>
              <Switch checked={dehumCoolLink} onCheckedChange={setDehumCoolLink} />
            </div>
          </div>
        )}
      </div>

      {/* Hysteresis Control */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <SlidersHorizontal className="w-4 h-4 text-emerald-500" />
          <span className="text-[13px]">湿度回差控制</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-gray-400 block mb-1">回差值 (%RH)</label>
            <input value={hysteresis} onChange={e => setHysteresis(e.target.value)} className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-[14px]" />
          </div>
          <div>
            <label className="text-[11px] text-gray-400 block mb-1">响应延迟 (秒)</label>
            <input value={responseDelay} onChange={e => setResponseDelay(e.target.value)} className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-[14px]" />
          </div>
        </div>
      </div>

      <button className="w-full bg-emerald-600 text-white rounded-xl py-3 text-[14px]" onClick={onBack}>
        保存
      </button>
    </div>
  );
}