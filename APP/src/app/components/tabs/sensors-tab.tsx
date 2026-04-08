import { useMemo, useState } from 'react';
import {
  ArrowLeft, Wifi, WifiOff, RefreshCw, Edit, Sliders, Plus,
  Hash, ScanLine, ChevronDown, ChevronRight, Check, Loader2,
  CheckCircle, Eye, EyeOff, Radio, BarChart3, AlertCircle
} from 'lucide-react';
import { sensors, sensorTypeOptions, realtimeDisplayBindings } from '../../data/mock-data';
import type { SensorData, SensorPackageType, SensorTypeOption } from '../../data/mock-data';

const mockHistory = [
  { time: '12:00', temp: 16.2, hum: 63.5, co2: 580 },
  { time: '12:30', temp: 16.5, hum: 63.0, co2: 595 },
  { time: '13:00', temp: 16.8, hum: 62.5, co2: 610 },
  { time: '13:30', temp: 17.0, hum: 62.0, co2: 620 },
  { time: '14:00', temp: 16.9, hum: 62.0, co2: 615 },
  { time: '14:30', temp: 16.9, hum: 62.0, co2: 620 },
];

/* ===== Sensor Detail ===== */
function SensorDetail({
  sensor,
  showsOnRealtimeCard,
  onBack,
}: {
  sensor: SensorData;
  showsOnRealtimeCard: boolean;
  onBack: () => void;
}) {
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(sensor.name);
  const [calibration, setCalibration] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    sensor.metrics.forEach(m => { init[m.paramKey] = '0'; });
    return init;
  });

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
              <input value={name} onChange={e => setName(e.target.value)} className="bg-gray-50 rounded-lg px-2 py-0.5 text-[13px] w-32" autoFocus />
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
          <span className="text-gray-400">类型</span>
          <span>{sensorTypeOptions.find(t => t.key === sensor.sensorType)?.label || sensor.sensorType}</span>
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
          <span className="text-gray-400">实时页数据源</span>
          <span className="flex items-center gap-1">
            {showsOnRealtimeCard ? (
              <><Eye className="w-3 h-3 text-emerald-500" /> 作主数据源</>
            ) : (
              <><EyeOff className="w-3 h-3 text-gray-400" /> 未作主数据源</>
            )}
          </span>
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

      {/* Mini chart */}
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
                  <div className={`w-full rounded-sm ${isLast ? 'bg-emerald-500' : 'bg-emerald-200'}`} style={{ height: `${h}%` }} />
                  <span className="text-[8px] text-gray-400">{d.time}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Calibration */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Sliders className="w-4 h-4 text-emerald-500" />
          <span className="text-[13px]">校准偏移</span>
        </div>
        <div className={`grid gap-2 ${sensor.metrics.length > 2 ? 'grid-cols-3' : `grid-cols-${sensor.metrics.length}`}`}>
          {sensor.metrics.map(m => (
            <div key={m.paramKey}>
              <label className="text-[11px] text-gray-400 block mb-1">{m.label} ({m.unit})</label>
              <input
                value={calibration[m.paramKey] || '0'}
                onChange={e => setCalibration(prev => ({ ...prev, [m.paramKey]: e.target.value }))}
                className="w-full bg-gray-50 rounded-xl px-3 py-2 text-[14px] text-center"
              />
            </div>
          ))}
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

/* ===== Add Sensor Flow ===== */
type AddStep = 'type' | 'serial' | 'searching' | 'found' | 'success';

function AddSensorFlow({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState<AddStep>('type');
  const [selectedType, setSelectedType] = useState<SensorTypeOption | null>(null);
  const [serial, setSerial] = useState('');
  const [sensorName, setSensorName] = useState('');
  const [addMode, setAddMode] = useState<'serial' | 'scan'>('serial');
  const [showCombo, setShowCombo] = useState(true);
  const [showSingle, setShowSingle] = useState(true);

  const comboTypes = sensorTypeOptions.filter(t => t.category === 'combo');
  const singleTypes = sensorTypeOptions.filter(t => t.category === 'single');

  const handleSearch = () => {
    if (!serial.trim()) return;
    setStep('searching');
    setTimeout(() => {
      setSensorName(selectedType ? `${selectedType.label}-${Math.floor(Math.random() * 99)}` : '新传感器');
      setStep('found');
    }, 1500);
  };

  if (step === 'success') {
    return (
      <div className="min-h-[50vh] flex items-center justify-center -m-4 p-4">
        <div className="text-center space-y-4 animate-[fadeIn_0.3s_ease]">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-[18px] text-gray-800">传感器添加成功</h3>
            <p className="text-[13px] text-gray-400 mt-1">{sensorName} 已上线</p>
            <p className="text-[11px] text-gray-300 mt-0.5">参数卡片已自动显示在实时页</p>
          </div>
          <button onClick={onBack} className="mt-4 px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-[14px]">
            返回传感器列表
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 -m-4 p-4">
      <div className="flex items-center gap-3 mb-2">
        <button
          onClick={() => {
            if (step === 'serial' || step === 'found') setStep('type');
            else onBack();
          }}
          className="w-8 h-8 flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h3 className="text-[16px]">添加传感器</h3>
        <span className="text-[12px] text-gray-400 ml-auto">
          {step === 'type' ? '1/2 选择类型' : '2/2 输入序列号'}
        </span>
      </div>

      {/* Step 1: Select sensor type */}
      {step === 'type' && (
        <div className="space-y-3 animate-[fadeIn_0.2s_ease]">
          {/* Combo sensors */}
          <button
            onClick={() => setShowCombo(!showCombo)}
            className="w-full flex items-center justify-between px-1"
          >
            <span className="text-[13px] text-gray-600 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-emerald-500" /> 组合传感器
            </span>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showCombo ? 'rotate-180' : ''}`} />
          </button>
          {showCombo && (
            <div className="space-y-2">
              {comboTypes.map(t => (
                <button
                  key={t.key}
                  onClick={() => { setSelectedType(t); setStep('serial'); }}
                  className={`w-full bg-white rounded-2xl p-4 shadow-sm text-left flex items-center gap-3 border-2 transition-all ${
                    selectedType?.key === t.key ? 'border-emerald-500 bg-emerald-50' : 'border-transparent'
                  }`}
                >
                  <span className="text-[24px]">{t.icon}</span>
                  <div className="flex-1">
                    <div className="text-[14px]">{t.label}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">{t.description}</div>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {t.metrics.map(m => (
                        <span key={m} className="bg-emerald-50 text-emerald-600 text-[9px] px-1.5 py-0.5 rounded-full">{m}</span>
                      ))}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </button>
              ))}
            </div>
          )}

          {/* Single sensors */}
          <button
            onClick={() => setShowSingle(!showSingle)}
            className="w-full flex items-center justify-between px-1 mt-2"
          >
            <span className="text-[13px] text-gray-600 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-blue-500" /> 单项传感器
            </span>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showSingle ? 'rotate-180' : ''}`} />
          </button>
          {showSingle && (
            <div className="grid grid-cols-2 gap-2">
              {singleTypes.map(t => (
                <button
                  key={t.key}
                  onClick={() => { setSelectedType(t); setStep('serial'); }}
                  className="bg-white rounded-xl p-3 shadow-sm text-left"
                >
                  <span className="text-[20px]">{t.icon}</span>
                  <div className="text-[13px] mt-1">{t.label}</div>
                  <div className="text-[10px] text-gray-400">{t.description}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 2: Serial or Scan */}
      {(step === 'serial' || step === 'searching' || step === 'found') && selectedType && (
        <div className="space-y-4 animate-[fadeIn_0.2s_ease]">
          {/* Selected type banner */}
          <div className="bg-emerald-50 rounded-xl p-3 flex items-center gap-3">
            <span className="text-[24px]">{selectedType.icon}</span>
            <div>
              <div className="text-[13px] text-emerald-700">{selectedType.label}</div>
              <div className="text-[11px] text-emerald-500">{selectedType.description}</div>
            </div>
            <button onClick={() => setStep('type')} className="ml-auto text-[11px] text-emerald-600 bg-white px-2 py-1 rounded-lg">
              更换
            </button>
          </div>

          {step === 'serial' && (
            <>
              {/* Mode switch */}
              <div className="bg-gray-100 rounded-xl p-1 flex">
                <button
                  onClick={() => setAddMode('serial')}
                  className={`flex-1 py-2 rounded-lg text-[13px] flex items-center justify-center gap-1.5 transition-all ${
                    addMode === 'serial' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500'
                  }`}
                >
                  <Hash className="w-4 h-4" /> 序列号
                </button>
                <button
                  onClick={() => setAddMode('scan')}
                  className={`flex-1 py-2 rounded-lg text-[13px] flex items-center justify-center gap-1.5 transition-all ${
                    addMode === 'scan' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500'
                  }`}
                >
                  <ScanLine className="w-4 h-4" /> 扫码
                </button>
              </div>

              {addMode === 'serial' ? (
                <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
                  <label className="text-[13px] text-gray-500 flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5 text-emerald-500" /> 传感器序列号
                  </label>
                  <input
                    type="text"
                    placeholder="请输入传感器序列号"
                    value={serial}
                    onChange={e => setSerial(e.target.value)}
                    className="w-full bg-gray-50 rounded-xl px-3.5 py-2.5 text-[14px] outline-none border border-gray-100 focus:border-emerald-400"
                  />
                  <p className="text-[11px] text-gray-400">序列号位于传感器标签上</p>
                </div>
              ) : (
                <div className="bg-gray-900 rounded-2xl overflow-hidden aspect-[4/3] flex flex-col items-center justify-center">
                  <div className="w-40 h-40 border-2 border-white/30 rounded-2xl relative">
                    <div className="absolute top-0 left-0 w-5 h-5 border-t-3 border-l-3 border-emerald-400 rounded-tl-lg" />
                    <div className="absolute top-0 right-0 w-5 h-5 border-t-3 border-r-3 border-emerald-400 rounded-tr-lg" />
                    <div className="absolute bottom-0 left-0 w-5 h-5 border-b-3 border-l-3 border-emerald-400 rounded-bl-lg" />
                    <div className="absolute bottom-0 right-0 w-5 h-5 border-b-3 border-r-3 border-emerald-400 rounded-br-lg" />
                    <div className="absolute left-2 right-2 h-0.5 bg-emerald-400 top-1/2 animate-pulse" />
                  </div>
                  <p className="text-white/60 text-[13px] mt-3">将二维码对准框内</p>
                </div>
              )}

              <div className="flex gap-3">
                {addMode === 'scan' && (
                  <button
                    onClick={() => { setSerial('BLS-5A-20260315'); handleSearch(); }}
                    className="flex-1 py-3 rounded-xl bg-gray-100 text-[14px] text-gray-600"
                  >
                    模拟扫码
                  </button>
                )}
                <button
                  onClick={handleSearch}
                  disabled={addMode === 'serial' && !serial.trim()}
                  className={`flex-1 py-3 rounded-xl text-[14px] text-white transition-all ${
                    (addMode === 'serial' && !serial.trim()) ? 'bg-gray-300' : 'bg-emerald-600 active:bg-emerald-700'
                  }`}
                >
                  搜索传感器
                </button>
              </div>
            </>
          )}

          {step === 'searching' && (
            <div className="flex flex-col items-center py-16">
              <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
              <p className="text-[14px] text-gray-500 mt-4">正在搜索传感器...</p>
            </div>
          )}

          {step === 'found' && (
            <div className="space-y-4 animate-[fadeIn_0.2s_ease]">
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-[24px]">
                    {selectedType.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-[15px]">{sensorName}</div>
                    <div className="flex items-center gap-1 text-[11px] text-emerald-500 mt-0.5">
                      <Wifi className="w-3 h-3" /> 传感器已就绪
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded-full text-[11px]">已发现</span>
                </div>
                <div className="space-y-2 bg-gray-50 rounded-xl p-3">
                  <div className="flex justify-between text-[12px]">
                    <span className="text-gray-400">序列号</span><span>{serial}</span>
                  </div>
                  <div className="flex justify-between text-[12px]">
                    <span className="text-gray-400">类型</span><span>{selectedType.label}</span>
                  </div>
                  <div className="flex justify-between text-[12px]">
                    <span className="text-gray-400">参数</span>
                    <span>{selectedType.metrics.join(', ')}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
                <label className="text-[13px] text-gray-500">传感器名称</label>
                <input
                  value={sensorName}
                  onChange={e => setSensorName(e.target.value)}
                  className="w-full bg-gray-50 rounded-xl px-3.5 py-2.5 text-[14px] outline-none border border-gray-100 focus:border-emerald-400"
                />
              </div>

              <div className="bg-blue-50 rounded-xl p-3 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                <span className="text-[11px] text-blue-700">添加后传感器参数卡片将自动显示在实时页面</span>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep('serial')} className="flex-1 py-3 rounded-xl border border-gray-200 text-[14px] text-gray-600">
                  重新搜索
                </button>
                <button
                  onClick={() => setStep('success')}
                  className="flex-1 py-3 rounded-xl bg-emerald-600 text-white text-[14px] active:bg-emerald-700"
                >
                  确认添加
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ===== Display Preference：与实时页 realtimeDisplayBindings 同一套主探头 ===== */
function DisplayPreference({
  onBack,
  displayPrimaryByParamKey,
  onSetDisplayPrimary,
}: {
  onBack: () => void;
  displayPrimaryByParamKey: Record<string, string>;
  onSetDisplayPrimary: (paramKey: string, sensorId: string) => void;
}) {
  const sections = useMemo(
    () =>
      realtimeDisplayBindings
        .map(binding => {
          const list = binding.sensorIds
            .map(id => sensors.find(s => s.id === id))
            .filter((s): s is SensorData =>
              Boolean(s?.metrics.some(m => m.paramKey === binding.paramKey)),
            );
          if (list.length < 2) return null;
          const paramLabel =
            list[0].metrics.find(m => m.paramKey === binding.paramKey)?.label || binding.paramKey;
          return { binding, paramLabel, sensors: list };
        })
        .filter((x): x is NonNullable<typeof x> => x != null),
    [],
  );

  return (
    <div className="space-y-4 -m-4 p-4">
      <div className="flex items-center gap-3 mb-2">
        <button type="button" onClick={onBack} className="w-8 h-8 flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h3 className="text-[16px]">数据源选择</h3>
      </div>

      <div className="bg-blue-50 rounded-xl p-3 flex items-start gap-2">
        <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
        <span className="text-[11px] text-blue-700">
          以下与「实时」页卡片一致：每个参数仅选一个主探头；若该探头离线或无有效读数，实时页会按绑定自动择优。
        </span>
      </div>

      {sections.length === 0 ? (
        <div className="text-center py-12">
          <Check className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-[14px] text-gray-400">暂无多探头可选参数</p>
        </div>
      ) : (
        sections.map(({ binding, paramLabel, sensors: list }) => {
          const primaryId =
            displayPrimaryByParamKey[binding.paramKey] ||
            binding.primarySensorId ||
            list[0]?.id ||
            '';
          return (
            <div key={binding.id} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="text-[13px] text-gray-700 mb-1">{paramLabel}</div>
              <div className="text-[11px] text-gray-400 mb-3">{binding.label}</div>
              <div className="space-y-2">
                {list.map(s => {
                  const selected = s.id === primaryId;
                  return (
                    <button
                      type="button"
                      key={s.id}
                      onClick={() => onSetDisplayPrimary(binding.paramKey, s.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                        selected
                          ? 'bg-emerald-50 border-2 border-emerald-400'
                          : 'bg-gray-50 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex-1 text-left">
                        <div className="text-[13px]">{s.name}</div>
                        <div className="text-[11px] text-gray-400">{s.model} · ID:{s.id}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!s.online && (
                          <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                            离线
                          </span>
                        )}
                        {selected ? (
                          <Eye className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-gray-300" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })
      )}

      <button type="button" onClick={onBack} className="w-full bg-emerald-600 text-white rounded-xl py-3 text-[14px]">
        完成
      </button>
    </div>
  );
}

/* ===== Main Sensors Tab ===== */
export function SensorsTab({
  onSubPageChange,
  displayPrimaryByParamKey,
  onSetDisplayPrimary,
}: {
  onSubPageChange?: (inSub: boolean) => void;
  displayPrimaryByParamKey: Record<string, string>;
  onSetDisplayPrimary: (paramKey: string, sensorId: string) => void;
}) {
  const [selectedSensor, setSelectedSensor] = useState<string | null>(null);
  const [showAddFlow, setShowAddFlow] = useState(false);
  const [showDisplayPref, setShowDisplayPref] = useState(false);

  const sensorShowsOnRealtimeCard = (s: SensorData) =>
    s.metrics.some(m => displayPrimaryByParamKey[m.paramKey] === s.id);

  const goToDetail = (id: string) => {
    setSelectedSensor(id);
    onSubPageChange?.(true);
  };
  const goBack = () => {
    setSelectedSensor(null);
    setShowAddFlow(false);
    setShowDisplayPref(false);
    onSubPageChange?.(false);
  };

  const sensor = sensors.find(s => s.id === selectedSensor);
  if (sensor) {
    return (
      <SensorDetail
        sensor={sensor}
        showsOnRealtimeCard={sensorShowsOnRealtimeCard(sensor)}
        onBack={goBack}
      />
    );
  }
  if (showAddFlow) return <AddSensorFlow onBack={goBack} />;
  if (showDisplayPref) {
    return (
      <DisplayPreference
        onBack={goBack}
        displayPrimaryByParamKey={displayPrimaryByParamKey}
        onSetDisplayPrimary={onSetDisplayPrimary}
      />
    );
  }

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

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => { setShowAddFlow(true); onSubPageChange?.(true); }}
          className="flex-1 bg-emerald-600 text-white rounded-xl py-2.5 text-[13px] flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> 添加传感器
        </button>
        <button
          onClick={() => { setShowDisplayPref(true); onSubPageChange?.(true); }}
          className="flex-1 bg-white text-gray-600 rounded-xl py-2.5 text-[13px] flex items-center justify-center gap-1.5 shadow-sm"
        >
          <Eye className="w-4 h-4" /> 数据源选择
        </button>
      </div>

      {/* Sensor cards */}
      {sensors.map(sensor => {
        const typeInfo = sensorTypeOptions.find(t => t.key === sensor.sensorType);
        return (
          <button
            key={sensor.id}
            onClick={() => goToDetail(sensor.id)}
            className={`w-full text-left rounded-2xl p-4 shadow-sm ${
              sensor.online ? 'bg-white' : 'bg-gray-50'
            } border-l-4 ${sensor.online ? 'border-emerald-500' : 'border-gray-300'}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[18px]">{typeInfo?.icon || '📡'}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-[14px]">{sensor.name}</h4>
                    {sensorShowsOnRealtimeCard(sensor) && (
                      <Eye className="w-3 h-3 text-emerald-400" />
                    )}
                  </div>
                  <span className="text-[11px] text-gray-400">{typeInfo?.label} · {sensor.model} · {sensor.lastUpdate}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
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

            <div className={`grid gap-2 ${sensor.metrics.length <= 2 ? 'grid-cols-2' : sensor.metrics.length <= 3 ? 'grid-cols-3' : 'grid-cols-3'}`}>
              {sensor.metrics.map(m => (
                <div key={m.label} className="bg-gray-50 rounded-lg p-2">
                  <div className="text-[10px] text-gray-400">{m.label}</div>
                  <div className={`text-[15px] ${m.value === '--' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {m.value}<span className="text-[9px] ml-0.5">{m.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </button>
        );
      })}
    </div>
  );
}
