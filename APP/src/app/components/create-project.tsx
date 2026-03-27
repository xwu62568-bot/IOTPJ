import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowLeft, Leaf, MapPin, ChevronDown, Plus, Calendar,
  CheckCircle
} from 'lucide-react';
import { zones } from '../data/mock-data';

interface FormData {
  name: string;
  zoneId: string;
  cropType: string;
  area: string;
  description: string;
  startDate: string;
}

const cropOptions = [
  { label: '番茄', icon: '🍅' },
  { label: '草莓', icon: '🍓' },
  { label: '黄瓜', icon: '🥒' },
  { label: '辣椒', icon: '🌶️' },
  { label: '生菜', icon: '🥬' },
  { label: '西瓜', icon: '🍉' },
  { label: '茄子', icon: '🍆' },
  { label: '其他', icon: '🌱' },
];

export function CreateProject() {
  const navigate = useNavigate();
  const [showCropPicker, setShowCropPicker] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [form, setForm] = useState<FormData>({
    name: '',
    zoneId: '',
    cropType: '',
    area: '',
    description: '',
    startDate: '2026-03-20',
  });

  const update = (key: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const canSubmit = form.name.trim() && form.zoneId && form.cropType;

  const handleSubmit = () => {
    setShowSuccess(true);
    setTimeout(() => navigate('/'), 1500);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4 animate-[fadeIn_0.3s_ease]">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-[18px] text-gray-800">项目创建成功</h3>
            <p className="text-[13px] text-gray-400 mt-1">{form.name} 已添加到 {zones.find(z => z.id === form.zoneId)?.name}</p>
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
          <h1 className="text-[17px] flex-1">创建项目</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-28 space-y-4">
        {/* Project name */}
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
          <label className="text-[13px] text-gray-500 flex items-center gap-1.5">
            <Leaf className="w-3.5 h-3.5 text-emerald-500" /> 项目名称 <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            placeholder="例如：A3号温室-西红柿"
            value={form.name}
            onChange={e => update('name', e.target.value)}
            className="w-full bg-gray-50 rounded-xl px-3.5 py-2.5 text-[14px] outline-none border border-gray-100 focus:border-emerald-400 transition-colors"
          />
        </div>

        {/* Zone selection */}
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[13px] text-gray-500 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-500" /> 所属区域 <span className="text-red-400">*</span>
            </label>
            <button
              onClick={() => navigate('/create-zone')}
              className="flex items-center gap-1 text-[12px] text-emerald-600"
            >
              <Plus className="w-3.5 h-3.5" /> 创建区域
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {zones.map(zone => (
              <button
                key={zone.id}
                onClick={() => update('zoneId', zone.id)}
                className={`rounded-xl p-3 text-center border-2 transition-all ${
                  form.zoneId === zone.id
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-100 bg-gray-50'
                }`}
              >
                <div className="w-6 h-6 rounded-full mx-auto mb-1.5" style={{ backgroundColor: zone.color + '20', border: `2px solid ${zone.color}` }} />
                <div className="text-[13px]">{zone.name}</div>
                <div className="text-[10px] text-gray-400">{zone.projectCount} 个项目</div>
              </button>
            ))}
          </div>
        </div>

        {/* Crop type */}
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
          <label className="text-[13px] text-gray-500 flex items-center gap-1.5">
            <Leaf className="w-3.5 h-3.5 text-green-500" /> 作物类型 <span className="text-red-400">*</span>
          </label>
          <button
            onClick={() => setShowCropPicker(!showCropPicker)}
            className="w-full flex items-center justify-between bg-gray-50 rounded-xl px-3.5 py-2.5 border border-gray-100"
          >
            <span className={`text-[14px] ${form.cropType ? 'text-gray-800' : 'text-gray-400'}`}>
              {form.cropType ? `${cropOptions.find(c => c.label === form.cropType)?.icon} ${form.cropType}` : '请选择作物'}
            </span>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showCropPicker ? 'rotate-180' : ''}`} />
          </button>
          {showCropPicker && (
            <div className="grid grid-cols-4 gap-2">
              {cropOptions.map(crop => (
                <button
                  key={crop.label}
                  onClick={() => { update('cropType', crop.label); setShowCropPicker(false); }}
                  className={`rounded-xl p-2.5 text-center border-2 transition-all ${
                    form.cropType === crop.label
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-100 bg-gray-50'
                  }`}
                >
                  <div className="text-[20px]">{crop.icon}</div>
                  <div className="text-[11px] mt-1">{crop.label}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Area & Date & Description */}
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] text-gray-400 mb-1 block">面积 (㎡)</label>
              <input
                type="number"
                placeholder="例如 500"
                value={form.area}
                onChange={e => update('area', e.target.value)}
                className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-[14px] outline-none border border-gray-100 focus:border-emerald-400"
              />
            </div>
            <div>
              <label className="text-[12px] text-gray-400 mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> 开始日期</label>
              <input
                type="date"
                value={form.startDate}
                onChange={e => update('startDate', e.target.value)}
                className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-[14px] outline-none border border-gray-100 focus:border-emerald-400"
              />
            </div>
          </div>
          <div>
            <label className="text-[12px] text-gray-400 mb-1 block">备注描述</label>
            <textarea
              placeholder="项目描述（选填）"
              value={form.description}
              onChange={e => update('description', e.target.value)}
              rows={2}
              className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-[14px] outline-none border border-gray-100 focus:border-emerald-400 resize-none"
            />
          </div>
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
          创建项目
        </button>
      </div>
    </div>
  );
}
