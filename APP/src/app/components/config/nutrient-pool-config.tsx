import { useState } from 'react';
import { ArrowLeft, Plus, ChevronRight, Shield } from 'lucide-react';
import { Switch } from '../ui/switch';

export function NutrientPoolConfig({ onBack }: { onBack: () => void }) {
  const [mode, setMode] = useState<'pump-valve' | 'valve-only'>('pump-valve');
  const [ecMonitor, setEcMonitor] = useState(false);
  const [phMonitor, setPhMonitor] = useState(false);
  const [waterMonitor, setWaterMonitor] = useState(false);
  const [substrateMonitor, setSubstrateMonitor] = useState(true);

  return (
    <div className="space-y-4 -m-4 p-4">
      <div className="flex items-center gap-3 mb-2">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h3 className="text-[16px]">营养池系统配置</h3>
      </div>

      {/* Mode */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <span className="text-[12px] text-gray-400 block mb-2">控制模式</span>
        <div className="flex bg-gray-100 rounded-xl p-0.5">
          <button onClick={() => setMode('pump-valve')} className={`flex-1 py-2 rounded-lg text-[12px] ${mode === 'pump-valve' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500'}`}>泵+阀</button>
          <button onClick={() => setMode('valve-only')} className={`flex-1 py-2 rounded-lg text-[12px] ${mode === 'valve-only' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500'}`}>仅阀（配恒压泵）</button>
        </div>
      </div>

      {/* Devices */}
      <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[13px]">泵+阀设备</span>
          <button className="text-[12px] text-emerald-600 flex items-center gap-0.5"><Plus className="w-3.5 h-3.5" /> 添加</button>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 flex items-center justify-between">
          <span className="text-[13px]">BCB-12-DCF</span>
          <ChevronRight className="w-4 h-4 text-gray-300" />
        </div>
      </div>

      {/* Sensors */}
      <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
        <span className="text-[13px]">传感器绑定</span>
        <div>
          <span className="text-[11px] text-gray-400">营养池</span>
          <div className="bg-gray-50 rounded-xl p-3 mt-1 flex items-center justify-between">
            <div>
              <span className="text-[12px]">水位传感器</span>
              <span className="text-[11px] text-gray-400 ml-2">0.17m · ID:228</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </div>
          <button className="mt-1.5 text-[12px] text-emerald-600 flex items-center gap-0.5"><Plus className="w-3.5 h-3.5" /> 新增传感器</button>
        </div>
        <div>
          <span className="text-[11px] text-gray-400">管道</span>
          <button className="mt-1 text-[12px] text-emerald-600 flex items-center gap-0.5"><Plus className="w-3.5 h-3.5" /> 新增传感器</button>
        </div>
      </div>

      {/* Auto refill */}
      <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
        <span className="text-[13px]">自动补水</span>
        <div className="text-[11px] text-gray-400">设备: BCB-12-DCF</div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-gray-400 block mb-1">补水水位 (m)</label>
            <input defaultValue="0.10" className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-[14px]" />
          </div>
          <div>
            <label className="text-[11px] text-gray-400 block mb-1">目标水位 (m)</label>
            <input defaultValue="0.20" className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-[14px]" />
          </div>
        </div>
      </div>

      {/* Fertilizer & Stirring */}
      <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
        <button className="w-full flex items-center justify-between">
          <span className="text-[13px]">配肥机</span>
          <ChevronRight className="w-4 h-4 text-gray-300" />
        </button>
        <button className="w-full flex items-center justify-between border-t border-gray-50 pt-3">
          <span className="text-[13px]">搅拌设备</span>
          <ChevronRight className="w-4 h-4 text-gray-300" />
        </button>
      </div>

      {/* Safety */}
      <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-red-500" />
          <span className="text-[13px]">安全保护策略</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-gray-400 block mb-1">EC 高保护</label>
            <input defaultValue="3.0" className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-[14px]" />
          </div>
          <div>
            <label className="text-[11px] text-gray-400 block mb-1">pH 低保护</label>
            <input defaultValue="4.5" className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-[14px]" />
          </div>
          <div>
            <label className="text-[11px] text-gray-400 block mb-1">pH 高保护</label>
            <input defaultValue="7.5" className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-[14px]" />
          </div>
          <div>
            <label className="text-[11px] text-gray-400 block mb-1">基质湿度高保护 (%)</label>
            <input defaultValue="85" className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-[14px]" />
          </div>
        </div>
      </div>

      {/* Monitor only */}
      <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
        <span className="text-[13px]">仅监视模式</span>
        <div className="space-y-3">
          {[
            { label: 'EC仅监视', checked: ecMonitor, set: setEcMonitor },
            { label: 'pH仅监视', checked: phMonitor, set: setPhMonitor },
            { label: '水位仅监视', checked: waterMonitor, set: setWaterMonitor },
            { label: '基质湿度仅监视', checked: substrateMonitor, set: setSubstrateMonitor },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between">
              <span className="text-[13px]">{item.label}</span>
              <Switch checked={item.checked} onCheckedChange={item.set} />
            </div>
          ))}
        </div>
      </div>

      <button className="w-full bg-emerald-600 text-white rounded-xl py-3 text-[14px]" onClick={onBack}>
        保存
      </button>
    </div>
  );
}
