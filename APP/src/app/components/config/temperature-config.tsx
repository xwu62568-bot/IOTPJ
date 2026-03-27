import { useState } from 'react';
import { ArrowLeft, Sun, Moon } from 'lucide-react';
import { Switch } from '../ui/switch';

export function TemperatureConfig({ onBack }: { onBack: () => void }) {
  const [dayCool, setDayCool] = useState('28');
  const [dayHeat, setDayHeat] = useState('18');
  const [nightCool, setNightCool] = useState('22');
  const [nightHeat, setNightHeat] = useState('15');
  const [dehumLink, setDehumLink] = useState(true);
  const [hysteresis, setHysteresis] = useState('2');

  return (
    <div className="space-y-4 -m-4 p-4">
      <div className="flex items-center gap-3 mb-2">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h3 className="text-[16px]">温度设置</h3>
      </div>

      {/* Day */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Sun className="w-4 h-4 text-amber-500" />
          <span className="text-[13px]">白天</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-gray-400 block mb-1">制冷温度 (℃)</label>
            <input value={dayCool} onChange={e => setDayCool(e.target.value)} className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-[14px]" />
          </div>
          <div>
            <label className="text-[11px] text-gray-400 block mb-1">加热温度 (℃)</label>
            <input value={dayHeat} onChange={e => setDayHeat(e.target.value)} className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-[14px]" />
          </div>
        </div>
      </div>

      {/* Night */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Moon className="w-4 h-4 text-indigo-500" />
          <span className="text-[13px]">夜晚</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-gray-400 block mb-1">制冷温度 (℃)</label>
            <input value={nightCool} onChange={e => setNightCool(e.target.value)} className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-[14px]" />
          </div>
          <div>
            <label className="text-[11px] text-gray-400 block mb-1">加热温度 (℃)</label>
            <input value={nightHeat} onChange={e => setNightHeat(e.target.value)} className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-[14px]" />
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[13px]">制冷和除湿关联</span>
          <Switch checked={dehumLink} onCheckedChange={setDehumLink} />
        </div>
        <div>
          <label className="text-[11px] text-gray-400 block mb-1">温度回差 (℃)</label>
          <input value={hysteresis} onChange={e => setHysteresis(e.target.value)} className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-[14px]" />
        </div>
      </div>

      <button className="w-full bg-emerald-600 text-white rounded-xl py-3 text-[14px]" onClick={onBack}>
        保存
      </button>
    </div>
  );
}
