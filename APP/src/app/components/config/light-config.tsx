import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Slider } from '../ui/slider';

export function LightConfig({ onBack }: { onBack: () => void }) {
  const [channel, setChannel] = useState(0);
  const [planMode, setPlanMode] = useState<'timer' | 'cycle'>('timer');
  const [lightMode, setLightMode] = useState<'dimming' | 'constant'>('dimming');
  const [brightness, setBrightness] = useState([80]);
  const [targetPpfd, setTargetPpfd] = useState('1200');
  const [startTime, setStartTime] = useState('06:00');
  const [onDuration, setOnDuration] = useState('16');
  const [offDuration, setOffDuration] = useState('8');
  const [dimTemp, setDimTemp] = useState('35');
  const [offTemp, setOffTemp] = useState('38');
  const [sunrise, setSunrise] = useState('30');

  return (
    <div className="space-y-4 -m-4 p-4">
      <div className="flex items-center gap-3 mb-2">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h3 className="text-[16px]">灯光控制</h3>
      </div>

      {/* Channel selector */}
      <div className="flex bg-white rounded-xl p-0.5 shadow-sm">
        {['通道1', '通道2'].map((ch, i) => (
          <button
            key={i}
            onClick={() => setChannel(i)}
            className={`flex-1 py-2 rounded-lg text-[12px] transition-colors ${
              channel === i ? 'bg-emerald-600 text-white' : 'text-gray-500'
            }`}
          >
            {ch}
          </button>
        ))}
      </div>

      {/* Light type */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <label className="text-[11px] text-gray-400 block mb-1">灯光类型</label>
        <select className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-[14px] border-none">
          <option>LED</option>
          <option>HPS</option>
          <option>CMH</option>
        </select>
      </div>

      {/* Plan mode */}
      <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex bg-gray-100 rounded-xl p-0.5">
          <button onClick={() => setPlanMode('timer')} className={`flex-1 py-2 rounded-lg text-[12px] ${planMode === 'timer' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500'}`}>定时计划</button>
          <button onClick={() => setPlanMode('cycle')} className={`flex-1 py-2 rounded-lg text-[12px] ${planMode === 'cycle' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500'}`}>循环</button>
        </div>
        <div>
          <label className="text-[11px] text-gray-400 block mb-1">首次启动时间</label>
          <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-[14px]" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-gray-400 block mb-1">开启时长 (h)</label>
            <input value={onDuration} onChange={e => setOnDuration(e.target.value)} className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-[14px]" />
          </div>
          <div>
            <label className="text-[11px] text-gray-400 block mb-1">关闭时长 (h)</label>
            <input value={offDuration} onChange={e => setOffDuration(e.target.value)} className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-[14px]" />
          </div>
        </div>
      </div>

      {/* Light mode */}
      <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex bg-gray-100 rounded-xl p-0.5">
          <button onClick={() => setLightMode('dimming')} className={`flex-1 py-2 rounded-lg text-[12px] ${lightMode === 'dimming' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500'}`}>调光</button>
          <button onClick={() => setLightMode('constant')} className={`flex-1 py-2 rounded-lg text-[12px] ${lightMode === 'constant' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500'}`}>恒光</button>
        </div>
        {lightMode === 'dimming' ? (
          <div>
            <div className="flex justify-between text-[12px] mb-2">
              <span className="text-gray-400">亮度</span>
              <span className="text-emerald-600">{brightness[0]}%</span>
            </div>
            <Slider value={brightness} onValueChange={setBrightness} max={100} step={1} />
          </div>
        ) : (
          <div>
            <label className="text-[11px] text-gray-400 block mb-1">目标 PPFD</label>
            <input value={targetPpfd} onChange={e => setTargetPpfd(e.target.value)} className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-[14px]" />
          </div>
        )}
      </div>

      {/* Temperature protection */}
      <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
        <span className="text-[12px] text-gray-400">温度保护</span>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-gray-400 block mb-1">调光阈值 (℃)</label>
            <input value={dimTemp} onChange={e => setDimTemp(e.target.value)} className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-[14px]" />
          </div>
          <div>
            <label className="text-[11px] text-gray-400 block mb-1">关闭阈值 (℃)</label>
            <input value={offTemp} onChange={e => setOffTemp(e.target.value)} className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-[14px]" />
          </div>
        </div>
        <div>
          <label className="text-[11px] text-gray-400 block mb-1">模拟日升日落 (分钟)</label>
          <input value={sunrise} onChange={e => setSunrise(e.target.value)} className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-[14px]" />
        </div>
      </div>

      <button className="w-full bg-emerald-600 text-white rounded-xl py-3 text-[14px]" onClick={onBack}>
        保存
      </button>
    </div>
  );
}
