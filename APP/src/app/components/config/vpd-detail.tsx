import { ArrowLeft, BarChart3 } from 'lucide-react';
import { realtimeData } from '../../data/mock-data';

const vpdRanges = [
  { label: '生长期', range: '0.80 ~ 0.95', color: 'bg-emerald-500' },
  { label: '开花期', range: '0.96 ~ 1.15', color: 'bg-blue-500' },
  { label: '应激', range: '1.16 ~ 1.35', color: 'bg-amber-500' },
  { label: '亚最适', range: '< 0.80', color: 'bg-red-500' },
];

export function VpdDetail({ onBack }: { onBack: () => void }) {
  const vpd = realtimeData.vpd;
  const temp = realtimeData.temperature;
  const hum = realtimeData.humidity;

  // Calculate gauge angle (0.4-1.4 range mapped to 0-180)
  const gaugePercent = Math.min(Math.max((vpd.value - 0.4) / 1.0, 0), 1);

  return (
    <div className="space-y-4 -m-4 p-4">
      <div className="flex items-center gap-3 mb-2">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h3 className="text-[16px]">VPD 详情</h3>
      </div>

      {/* Gauge */}
      <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col items-center">
        <div className="relative w-48 h-24 mb-4">
          {/* Arc background */}
          <svg viewBox="0 0 200 100" className="w-full h-full">
            <path d="M 10 100 A 90 90 0 0 1 190 100" fill="none" stroke="#E5E7EB" strokeWidth="12" strokeLinecap="round" />
            {/* Colored segments */}
            <path d="M 10 100 A 90 90 0 0 1 55 25" fill="none" stroke="#EF4444" strokeWidth="12" strokeLinecap="round" />
            <path d="M 55 25 A 90 90 0 0 1 100 10" fill="none" stroke="#10B981" strokeWidth="12" strokeLinecap="round" />
            <path d="M 100 10 A 90 90 0 0 1 145 25" fill="none" stroke="#3B82F6" strokeWidth="12" strokeLinecap="round" />
            <path d="M 145 25 A 90 90 0 0 1 175 60" fill="none" stroke="#F59E0B" strokeWidth="12" strokeLinecap="round" />
            <path d="M 175 60 A 90 90 0 0 1 190 100" fill="none" stroke="#EF4444" strokeWidth="12" strokeLinecap="round" />
            {/* Needle */}
            <line
              x1="100" y1="100"
              x2={100 + 70 * Math.cos(Math.PI * (1 - gaugePercent))}
              y2={100 - 70 * Math.sin(Math.PI * (1 - gaugePercent))}
              stroke="#1F2937" strokeWidth="2" strokeLinecap="round"
            />
            <circle cx="100" cy="100" r="4" fill="#1F2937" />
          </svg>
        </div>
        <div className="text-[32px] text-gray-800">{vpd.value}<span className="text-[16px] ml-1">kPa</span></div>
        <button className="mt-3 flex items-center gap-1 text-[12px] text-blue-500 bg-blue-50 px-3 py-1.5 rounded-full">
          <BarChart3 className="w-3.5 h-3.5" /> VPD 图表
        </button>
      </div>

      {/* Ranges */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <span className="text-[12px] text-gray-400 block mb-3">推荐区间</span>
        <div className="space-y-2.5">
          {vpdRanges.map(r => (
            <div key={r.label} className="flex items-center gap-3">
              <span className={`w-3 h-3 rounded-full ${r.color}`} />
              <span className="text-[13px] flex-1">{r.label}</span>
              <span className="text-[12px] text-gray-500">{r.range} kPa</span>
            </div>
          ))}
        </div>
      </div>

      {/* Related params */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <span className="text-[12px] text-gray-400 block mb-3">关联参数</span>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-red-50 rounded-xl p-3 text-center">
            <div className="text-[11px] text-gray-400">温度</div>
            <div className="text-[20px] text-red-600">{temp.value}<span className="text-[12px]">℃</span></div>
          </div>
          <div className="bg-blue-50 rounded-xl p-3 text-center">
            <div className="text-[11px] text-gray-400">湿度</div>
            <div className="text-[20px] text-blue-600">{hum.value}<span className="text-[12px]">%</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
