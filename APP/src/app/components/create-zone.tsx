import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowLeft, MapPin, Palette, FileText, CheckCircle, Navigation
} from 'lucide-react';

const colorOptions = [
  { label: '蓝色', value: '#3B82F6' },
  { label: '绿色', value: '#10B981' },
  { label: '琥珀色', value: '#F59E0B' },
  { label: '红色', value: '#EF4444' },
  { label: '紫色', value: '#8B5CF6' },
  { label: '粉色', value: '#EC4899' },
  { label: '青色', value: '#06B6D4' },
  { label: '橙色', value: '#F97316' },
];

export function CreateZone() {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [form, setForm] = useState({
    name: '',
    color: '#10B981',
    address: '',
    description: '',
  });

  const update = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const canSubmit = form.name.trim().length > 0;

  const handleSubmit = () => {
    setShowSuccess(true);
    setTimeout(() => navigate('/zones'), 1500);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4 animate-[fadeIn_0.3s_ease]">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-[18px] text-gray-800">区域创建成功</h3>
            <p className="text-[13px] text-gray-400 mt-1">
              <span className="inline-block w-2.5 h-2.5 rounded-full mr-1 align-middle" style={{ backgroundColor: form.color }} />
              {form.name} 已添加
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-[17px] flex-1">创建区域</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-28 space-y-4">
        {/* Preview */}
        <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col items-center gap-3">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-[24px]"
            style={{ backgroundColor: form.color }}
          >
            {form.name ? form.name[0] : '?'}
          </div>
          <span className="text-[15px] text-gray-700">{form.name || '新区域'}</span>
        </div>

        {/* Zone name */}
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
          <label className="text-[13px] text-gray-500 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-500" /> 区域名称 <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            placeholder="例如：北区、实验温室区"
            value={form.name}
            onChange={e => update('name', e.target.value)}
            className="w-full bg-gray-50 rounded-xl px-3.5 py-2.5 text-[14px] outline-none border border-gray-100 focus:border-emerald-400 transition-colors"
          />
        </div>

        {/* Color */}
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
          <label className="text-[13px] text-gray-500 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-purple-500" /> 标识颜色
          </label>
          <div className="grid grid-cols-4 gap-3">
            {colorOptions.map(c => (
              <button
                key={c.value}
                onClick={() => update('color', c.value)}
                className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border-2 transition-all ${
                  form.color === c.value ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 bg-gray-50'
                }`}
              >
                <div className="w-7 h-7 rounded-full" style={{ backgroundColor: c.value }} />
                <span className="text-[10px] text-gray-500">{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
          <label className="text-[13px] text-gray-500 flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-blue-500" /> 地理位置
          </label>
          <input
            type="text"
            placeholder="例如：基地东侧 A 排（选填）"
            value={form.address}
            onChange={e => update('address', e.target.value)}
            className="w-full bg-gray-50 rounded-xl px-3.5 py-2.5 text-[14px] outline-none border border-gray-100 focus:border-emerald-400 transition-colors"
          />
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
          <label className="text-[13px] text-gray-500 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-amber-500" /> 备注描述
          </label>
          <textarea
            placeholder="区域描述或备注信息（选填）"
            value={form.description}
            onChange={e => update('description', e.target.value)}
            rows={3}
            className="w-full bg-gray-50 rounded-xl px-3.5 py-2.5 text-[14px] outline-none border border-gray-100 focus:border-emerald-400 resize-none transition-colors"
          />
        </div>
      </div>

      {/* Bottom action */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`w-full py-3 rounded-xl text-[14px] text-white transition-all ${
            canSubmit ? 'bg-emerald-600 active:bg-emerald-700' : 'bg-gray-300'
          }`}
        >
          创建区域
        </button>
      </div>
    </div>
  );
}
