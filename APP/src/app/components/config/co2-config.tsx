import { useState } from 'react';
import { ArrowLeft, Sun, Moon } from 'lucide-react';
import { Switch } from '../ui/switch';

export function Co2Config({ onBack }: { onBack: () => void }) {
  const [dayTarget, setDayTarget] = useState('800');
  const [nightTarget, setNightTarget] = useState('400');
  const [fuzzy, setFuzzy] = useState(false);
  const [coolLink, setCoolLink] = useState(true);
  const [dehumLink, setDehumLink] = useState(false);
  const [correction, setCorrection] = useState('0');
  const [hysteresis, setHysteresis] = useState('50');

  return (
    <div className="space-y-4 -m-4 p-4">
      <div className="flex items-center gap-3 mb-2">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h3 className="text-[16px]">CO₂ 设置</h3>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Sun className="w-4 h-4 text-amber-500" />
          <span className="text-[13px]">白天目标</span>
        </div>
        <div className="mb-3">
          <label className="text-[11px] text-gray-400 block mb-1">补充CO₂目标值 (PPM)</label>
          <input value={dayTarget} onChange={e => setDayTarget(e.target.value)} className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-[14px]" />
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[13px]">模糊控制（适用减压阀）</span>
            <Switch checked={fuzzy} onCheckedChange={setFuzzy} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[13px]">CO₂和制冷关联</span>
            <Switch checked={coolLink} onCheckedChange={setCoolLink} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[13px]">CO₂和除湿关联</span>
            <Switch checked={dehumLink} onCheckedChange={setDehumLink} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Moon className="w-4 h-4 text-indigo-500" />
          <span className="text-[13px]">夜晚目标</span>
        </div>
        <div>
          <label className="text-[11px] text-gray-400 block mb-1">减少CO₂目标值 (PPM)</label>
          <input value={nightTarget} onChange={e => setNightTarget(e.target.value)} className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-[14px]" />
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
        <div>
          <label className="text-[11px] text-gray-400 block mb-1">CO₂手动修正 (PPM)</label>
          <input value={correction} onChange={e => setCorrection(e.target.value)} className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-[14px]" />
        </div>
        <div>
          <label className="text-[11px] text-gray-400 block mb-1">CO₂回差 (PPM)</label>
          <input value={hysteresis} onChange={e => setHysteresis(e.target.value)} className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-[14px]" />
        </div>
      </div>

      <button className="w-full bg-emerald-600 text-white rounded-xl py-3 text-[14px]" onClick={onBack}>
        保存
      </button>
    </div>
  );
}
