import { useState } from 'react';
import {
  ArrowLeft, Hash, ScanLine, Camera, CheckCircle, Wifi,
  Power, Zap, AlertCircle, Loader2
} from 'lucide-react';

type AddMode = 'serial' | 'scan';
type AddStep = 'input' | 'searching' | 'found' | 'success';

const mockFoundDevice = {
  serial: 'BCB-16-20260315A',
  name: 'BCB-16-DCF',
  type: '干接点' as const,
  model: 'BCB-16',
  firmware: 'v2.3.0',
  ports: 12,
};

export function AddDevice({ onBack }: { onBack: () => void }) {
  const [mode, setMode] = useState<AddMode>('serial');
  const [serial, setSerial] = useState('');
  const [step, setStep] = useState<AddStep>('input');
  const [deviceName, setDeviceName] = useState('');

  const handleSearch = () => {
    if (!serial.trim()) return;
    setStep('searching');
    setTimeout(() => {
      setStep('found');
      setDeviceName(mockFoundDevice.name);
    }, 1500);
  };

  const handleAdd = () => {
    setStep('success');
  };

  if (step === 'success') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4 animate-[fadeIn_0.3s_ease]">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-[18px] text-gray-800">设备添加成功</h3>
            <p className="text-[13px] text-gray-400 mt-1">{deviceName} 已添加到项目</p>
          </div>
          <button
            onClick={onBack}
            className="mt-4 px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-[14px]"
          >
            返回设备列表
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 -mx-4 -mt-4 px-4 py-3 bg-white shadow-sm">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-[17px] flex-1">添加设备</h1>
      </div>

      {/* Mode switch */}
      <div className="bg-gray-100 rounded-xl p-1 flex">
        <button
          onClick={() => { setMode('serial'); setStep('input'); }}
          className={`flex-1 py-2.5 rounded-lg text-[13px] flex items-center justify-center gap-1.5 transition-all ${
            mode === 'serial' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500'
          }`}
        >
          <Hash className="w-4 h-4" /> 序列号添加
        </button>
        <button
          onClick={() => { setMode('scan'); setStep('input'); }}
          className={`flex-1 py-2.5 rounded-lg text-[13px] flex items-center justify-center gap-1.5 transition-all ${
            mode === 'scan' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500'
          }`}
        >
          <ScanLine className="w-4 h-4" /> 扫码添加
        </button>
      </div>

      {mode === 'serial' && step === 'input' && (
        <div className="space-y-4 animate-[fadeIn_0.2s_ease]">
          <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
            <label className="text-[13px] text-gray-500 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-emerald-500" /> 设备序列号
            </label>
            <input
              type="text"
              placeholder="请输入设备背面的序列号"
              value={serial}
              onChange={e => setSerial(e.target.value)}
              className="w-full bg-gray-50 rounded-xl px-3.5 py-2.5 text-[14px] outline-none border border-gray-100 focus:border-emerald-400 transition-colors"
            />
            <p className="text-[11px] text-gray-400">序列号位于设备背面标签上，格式如 BCB-16-20260315A</p>
          </div>

          {/* Quick tips */}
          <div className="bg-blue-50 rounded-2xl p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
              <div className="text-[12px] text-blue-700 space-y-1">
                <p>添加前请确认：</p>
                <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-blue-600">
                  <li>设备已通电并处于就绪状态</li>
                  <li>设备与当前网络在同一局域网</li>
                  <li>设备尚未被其他项目绑定</li>
                </ul>
              </div>
            </div>
          </div>

          <button
            onClick={handleSearch}
            disabled={!serial.trim()}
            className={`w-full py-3 rounded-xl text-[14px] text-white transition-all ${
              serial.trim() ? 'bg-emerald-600 active:bg-emerald-700' : 'bg-gray-300'
            }`}
          >
            搜索设备
          </button>
        </div>
      )}

      {mode === 'scan' && step === 'input' && (
        <div className="space-y-4 animate-[fadeIn_0.2s_ease]">
          {/* Scan area */}
          <div className="bg-gray-900 rounded-2xl overflow-hidden aspect-square flex flex-col items-center justify-center relative">
            {/* Simulated scan frame */}
            <div className="w-48 h-48 border-2 border-white/30 rounded-2xl relative">
              <div className="absolute top-0 left-0 w-6 h-6 border-t-3 border-l-3 border-emerald-400 rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-3 border-r-3 border-emerald-400 rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-3 border-l-3 border-emerald-400 rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-3 border-r-3 border-emerald-400 rounded-br-lg" />
              {/* Scan line animation */}
              <div className="absolute left-2 right-2 h-0.5 bg-emerald-400 top-1/2 animate-pulse" />
            </div>
            <p className="text-white/60 text-[13px] mt-4">将二维码对准框内</p>
            <p className="text-white/40 text-[11px] mt-1">支持设备标签上的二维码</p>
          </div>

          {/* Or enter manually */}
          <button
            onClick={() => { setMode('serial'); }}
            className="w-full text-center text-[13px] text-emerald-600 py-2"
          >
            手动输入序列号
          </button>

          {/* Demo: simulate scan found */}
          <button
            onClick={() => {
              setSerial('BCB-16-20260315A');
              setStep('searching');
              setTimeout(() => {
                setStep('found');
                setDeviceName(mockFoundDevice.name);
              }, 1500);
            }}
            className="w-full py-3 rounded-xl text-[14px] bg-gray-100 text-gray-600"
          >
            模拟扫码成功
          </button>
        </div>
      )}

      {step === 'searching' && (
        <div className="flex flex-col items-center justify-center py-16 animate-[fadeIn_0.2s_ease]">
          <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
          <p className="text-[14px] text-gray-500 mt-4">正在搜索设备...</p>
          <p className="text-[12px] text-gray-400 mt-1">{serial}</p>
        </div>
      )}

      {step === 'found' && (
        <div className="space-y-4 animate-[fadeIn_0.2s_ease]">
          {/* Found device card */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                {mockFoundDevice.type === '干接点' ? (
                  <Power className="w-6 h-6 text-emerald-600" />
                ) : (
                  <Zap className="w-6 h-6 text-purple-600" />
                )}
              </div>
              <div className="flex-1">
                <div className="text-[15px]">{mockFoundDevice.name}</div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-500 mt-0.5">
                  <Wifi className="w-3 h-3" /> 设备已就绪
                </div>
              </div>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded-full text-[11px]">
                已发现
              </span>
            </div>

            <div className="space-y-2 bg-gray-50 rounded-xl p-3">
              <div className="flex justify-between text-[12px]">
                <span className="text-gray-400">序列号</span>
                <span className="text-gray-700">{mockFoundDevice.serial}</span>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="text-gray-400">型号</span>
                <span className="text-gray-700">{mockFoundDevice.model}</span>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="text-gray-400">类型</span>
                <span className="text-gray-700">{mockFoundDevice.type}</span>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="text-gray-400">固件版本</span>
                <span className="text-gray-700">{mockFoundDevice.firmware}</span>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="text-gray-400">端口数量</span>
                <span className="text-gray-700">{mockFoundDevice.ports}</span>
              </div>
            </div>
          </div>

          {/* Device name */}
          <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
            <label className="text-[13px] text-gray-500">设备名称</label>
            <input
              type="text"
              value={deviceName}
              onChange={e => setDeviceName(e.target.value)}
              className="w-full bg-gray-50 rounded-xl px-3.5 py-2.5 text-[14px] outline-none border border-gray-100 focus:border-emerald-400"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => { setStep('input'); setSerial(''); }}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-[14px] text-gray-600"
            >
              重新搜索
            </button>
            <button
              onClick={handleAdd}
              className="flex-1 py-3 rounded-xl bg-emerald-600 text-white text-[14px] active:bg-emerald-700"
            >
              添加设备
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
