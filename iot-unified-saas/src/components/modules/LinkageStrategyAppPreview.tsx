import type { ReactNode } from 'react';
import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  ArrowLeft,
  ChevronDown,
  Clock,
  GripVertical,
  Moon,
  Power,
  Save,
  Sun,
  Thermometer,
  Trash2,
  Zap,
} from 'lucide-react';
import type { StrategySectionModule, StrategySectionKind } from '../../platform/types';
import type { ControlStrategyParamKey } from '../../data/app-alignment';
import {
  demoCurrentReading,
  linkageDemoSetpoints,
  linkageLabels,
  linkageStrategyUiCopy,
} from '../../data/app-alignment';

function formatControlValue(value: number, unit: string) {
  const decimals = unit === '%' || unit === 'PPM' ? 0 : unit === 'kPa' || unit === 'm' ? 2 : 2;
  return value.toFixed(decimals).replace(/\.?0+$/, '');
}

function SortablePreviewSection({
  id,
  children,
}: {
  id: StrategySectionKind;
  children: ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.88 : 1,
    zIndex: isDragging ? 2 : 0,
  };
  return (
    <div ref={setNodeRef} style={style} className="relative">
      <button
        type="button"
        className="absolute top-3 left-3 z-10 flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200/90 bg-white/95 shadow-sm text-gray-400 hover:text-gray-700 cursor-grab active:cursor-grabbing touch-none"
        aria-label="拖拽调整模块顺序"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <div className="pl-9">{children}</div>
    </div>
  );
}

function usePreviewSensors() {
  return useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
}

/** 与 APP LinkageStrategy 同结构、静态示意；`draftSections` 控制显隐与顺序；传入 `onReorderDraftSections` 时预览区可拖拽排序 */
export function LinkageStrategyAppPreview({
  paramKey,
  draftSections,
  onReorderDraftSections,
  studioStretch = false,
}: {
  paramKey: ControlStrategyParamKey;
  draftSections: StrategySectionModule[];
  onReorderDraftSections?: (next: StrategySectionModule[]) => void;
  /** 与场景工作室实时预览一致：纵向撑满父列、宽度占满、内部滚动 */
  studioStretch?: boolean;
}) {
  const meta = linkageLabels[paramKey];
  const ui = linkageStrategyUiCopy[paramKey];
  const sp = linkageDemoSetpoints[paramKey];
  const unit = meta.unit;
  const currentValue = demoCurrentReading(paramKey);

  const lowerLimit = sp.target - sp.lowerOffset;
  const upperLimit = sp.target + sp.upperOffset;
  const hysteresis = Math.max(0, sp.hysteresis);
  const highSideClearBelow = upperLimit - hysteresis;
  const lowSideClearAbove = lowerLimit + hysteresis;
  const highActionLabel = meta.upLabel;
  const lowActionLabel = meta.downLabel;

  const enabled = new Set(draftSections.map(s => s.kind));
  const showFeedback = enabled.has('feedback-sensor') && paramKey !== 'vpd';
  const showVpdHintInsideTarget =
    paramKey === 'vpd' && enabled.has('vpd-computed-hint');
  const feedbackDemo: Record<string, { name: string; model: string; id: string }> = {
    temperature: { name: '温湿度CO₂光照-1', model: 'BLS-5A', id: '25' },
    humidity: { name: '温湿度CO₂光照-1', model: 'BLS-5A', id: '25' },
    co2: { name: '温湿度CO₂光照-1', model: 'BLS-5A', id: '25' },
    light: { name: '温湿度CO₂光照-1', model: 'BLS-5A', id: '25' },
    soilHumidity: { name: '基质温湿度-1', model: 'BLS-SH', id: '31' },
    waterLevel: { name: '液位传感器', model: 'BLS-LV', id: '35' },
  };
  const fb = feedbackDemo[paramKey] ?? feedbackDemo.temperature!;
  const hasExecution = enabled.has('execution-linkage');
  const showExplainStandalone = enabled.has('linkage-explain') && !hasExecution;
  const includeExplainInExecution = enabled.has('linkage-explain') && hasExecution;

  const dayNightSplit =
    paramKey !== 'co2' &&
    paramKey !== 'light' &&
    paramKey !== 'soilHumidity' &&
    paramKey !== 'waterLevel';

  const sensors = usePreviewSensors();

  function ActionExplainBlock() {
    const hasAnyBoundDevice = true;
    return (
      <div className="bg-gray-50 rounded-xl p-3 text-[12px] text-gray-600 space-y-3">
        {hasAnyBoundDevice ? (
          <>
            <div>
              <div className="text-[11px] text-gray-500 mb-1.5">何时动作</div>
              <ul className="list-disc pl-4 space-y-1 leading-relaxed">
                <li>
                  测量值<strong className="text-gray-800">高于上界</strong>：只使用<strong className="text-gray-800">上方</strong>
                  色块内已添加的设备。
                </li>
                <li>
                  测量值<strong className="text-gray-800">低于下界</strong>：只使用<strong className="text-gray-800">下方</strong>
                  色块内已添加的设备。
                </li>
                <li>两类情况不会同时生效；每行设备单独选择「开启」或「关闭」。</li>
              </ul>
            </div>
            <div>
              <div className="text-[11px] text-gray-500 mb-1.5">何时停</div>
              <ul className="list-disc pl-4 space-y-1 leading-relaxed">
                <li>
                  测量值须先回到<strong className="text-gray-800">控制区间</strong>（上、下界之间）。
                </li>
                <li>
                  此后继续变化，直至达到该色块内<strong className="text-gray-800">结束动作</strong>所示数值（回差已体现在该数中），该块内设备才停止。
                </li>
              </ul>
            </div>
          </>
        ) : (
          <p>执行说明：{ui.deviceHint}</p>
        )}
      </div>
    );
  }

  function renderSection(kind: StrategySectionKind): ReactNode {
    switch (kind) {
      case 'live-value':
        if (!enabled.has('live-value')) return null;
        return (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="text-[12px] text-gray-400 mb-1">当前实时值</div>
            <div className="text-[28px] text-emerald-600">
              {currentValue}
              <span className="text-[14px] ml-1">{unit}</span>
            </div>
          </div>
        );

      case 'schedule-day-night':
        if (!enabled.has('schedule-day-night')) return null;
        return (
          <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-500" />
                <span className="text-[13px]">时段控制模式</span>
              </div>
              <span
                className={`px-3 py-1.5 rounded-full text-[12px] ${
                  dayNightSplit ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {dayNightSplit ? '已开启' : '已关闭'}
              </span>
            </div>
            {dayNightSplit && (
              <div className="flex bg-gray-100 rounded-xl p-1">
                <div className="flex-1 py-2 rounded-lg text-[13px] flex items-center justify-center gap-1.5 bg-white text-amber-600 shadow-sm">
                  <Sun className="w-4 h-4" /> 白天
                </div>
                <div className="flex-1 py-2 rounded-lg text-[13px] flex items-center justify-center gap-1.5 text-gray-500">
                  <Moon className="w-4 h-4" /> 夜间
                </div>
              </div>
            )}
          </div>
        );

      case 'target-range':
        if (!enabled.has('target-range')) return null;
        return (
          <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-500" />
              <span className="text-[13px]">
                {dayNightSplit ? '白天' : ''}
                {ui.rangeTitle}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <div>
                <label className="text-[11px] text-gray-400 block mb-1">{ui.targetLabel}</label>
                <div className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-[13px] text-center border border-gray-100 tabular-nums">
                  {formatControlValue(sp.target, unit)}
                </div>
              </div>
              <div>
                <label className="text-[11px] text-gray-400 block mb-1">{ui.upperOffsetLabel}</label>
                <div className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-[13px] text-center border border-gray-100 tabular-nums">
                  {formatControlValue(sp.upperOffset, unit)}
                </div>
              </div>
              <div>
                <label className="text-[11px] text-gray-400 block mb-1">{ui.lowerOffsetLabel}</label>
                <div className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-[13px] text-center border border-gray-100 tabular-nums">
                  {formatControlValue(sp.lowerOffset, unit)}
                </div>
              </div>
              <div>
                <label className="text-[11px] text-gray-400 block mb-1">回差</label>
                <div className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-[13px] text-center border border-gray-100 tabular-nums">
                  {formatControlValue(sp.hysteresis, unit)}
                </div>
                <p className="text-[10px] text-gray-400 mt-1 leading-snug">与当前参数同单位，上下两侧共用同一回差。</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-3 text-[12px] text-gray-600">
              控制区间：
              <span className="text-emerald-600 mx-1">
                {formatControlValue(lowerLimit, unit)} ~ {formatControlValue(upperLimit, unit)}
                {unit}
              </span>
            </div>

            <div className="bg-emerald-50 rounded-xl p-3 text-[12px] text-emerald-700 space-y-1.5">
              <div>
                触发条件：
                <span className="mx-1">
                  高于 {formatControlValue(upperLimit, unit)}
                  {unit}
                </span>
                执行{highActionLabel}；
                <span className="mx-1">
                  低于 {formatControlValue(lowerLimit, unit)}
                  {unit}
                </span>
                执行{lowActionLabel}。
              </div>
              {hysteresis > 0 ? (
                <div className="text-emerald-800/90">
                  回差 {formatControlValue(hysteresis, unit)}
                  {unit}：上侧在测量值降至
                  <span className="mx-0.5">
                    {formatControlValue(highSideClearBelow, unit)}
                    {unit}
                  </span>
                  以下后结束动作；下侧在升至
                  <span className="mx-0.5">
                    {formatControlValue(lowSideClearAbove, unit)}
                    {unit}
                  </span>
                  以上后结束动作。
                </div>
              ) : (
                <div className="text-emerald-800/80">
                  回差为 0 时，结束动作与触发使用同一阈值，环境小幅波动时设备可能频繁切换，可适当加大回差。
                </div>
              )}
            </div>

            {showVpdHintInsideTarget && (
              <div className="bg-purple-50 rounded-xl p-3 text-[12px] text-purple-700">
                VPD 由系统根据已配置的温湿度数据计算，无需在此单独指定探头；目标、回差与本页绑定设备照常生效。
              </div>
            )}
          </div>
        );

      case 'vpd-computed-hint':
        if (paramKey !== 'vpd' || enabled.has('target-range')) return null;
        if (!enabled.has('vpd-computed-hint')) return null;
        return (
          <div className="bg-purple-50 rounded-xl p-3 text-[12px] text-purple-700">
            VPD 由系统根据已配置的温湿度数据计算，无需在此单独指定探头；目标、回差与本页绑定设备照常生效。
          </div>
        );

      case 'feedback-sensor':
        if (!showFeedback) return null;
        return (
          <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-emerald-500" />
              <span className="text-[13px]">{ui.feedbackTitle}</span>
            </div>
            <div className="text-[11px] text-gray-400">{ui.feedbackHint}</div>
            <div className="relative">
              <div className="w-full bg-gray-50 rounded-xl px-3 py-3 text-[14px] border border-gray-100">
                {fb.name} · ID:{fb.id} · 当前 {currentValue}
                {unit}
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <div className="bg-emerald-50 rounded-xl p-3">
              <div className="text-[12px] text-emerald-700">{fb.name}</div>
              <div className="text-[11px] text-emerald-600 mt-0.5">
                型号 {fb.model} · 当前反馈值 {currentValue}
                {unit}
              </div>
            </div>
          </div>
        );

      case 'execution-linkage':
        if (!hasExecution) return null;
        return (
          <div className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Power className="w-4 h-4 text-emerald-500" />
              <div>
                <span className="text-[13px]">{ui.deviceTitle}</span>
                <p className="text-[10px] text-gray-400 mt-0.5">上越限与下越限可分别绑定设备，并为每个端口选择开启或关闭。</p>
              </div>
            </div>

            <div className="space-y-2 rounded-xl border border-amber-100 bg-amber-50/40 p-3">
              <div>
                <div className="text-[12px] text-amber-900 font-medium">
                  高于 {formatControlValue(upperLimit, unit)}
                  {unit}
                  <span className="text-amber-700 font-normal"> · {highActionLabel}</span>
                </div>
                {hysteresis > 0 && (
                  <div className="text-[10px] text-amber-800/85 mt-1">
                    结束动作：测量值 ≤ {formatControlValue(highSideClearBelow, unit)}
                    {unit}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <div className="w-full bg-white rounded-xl px-3 py-2.5 text-[13px] border border-amber-100/80 text-gray-500">
                    循环风扇-1 · BCB-16-DCF · #4
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <div className="px-3 rounded-xl bg-amber-600 text-white text-[12px] whitespace-nowrap flex items-center">
                  添加
                </div>
              </div>
              <div className="bg-white rounded-xl p-2.5 flex items-center gap-2 border border-amber-100/60">
                <span className="text-[14px]">♻️</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] truncate">循环风扇-1</div>
                  <div className="text-[10px] text-gray-400">循环风扇</div>
                </div>
                <div className="flex rounded-lg overflow-hidden border border-gray-200 shrink-0">
                  <span className="px-2 py-1 text-[10px] bg-emerald-600 text-white">开启</span>
                  <span className="px-2 py-1 text-[10px] bg-white text-gray-500">关闭</span>
                </div>
                <Trash2 className="w-3.5 h-3.5 text-gray-300 shrink-0" />
              </div>
            </div>

            <div className="space-y-2 rounded-xl border border-cyan-100 bg-cyan-50/40 p-3">
              <div>
                <div className="text-[12px] text-cyan-900 font-medium">
                  低于 {formatControlValue(lowerLimit, unit)}
                  {unit}
                  <span className="text-cyan-800 font-normal"> · {lowActionLabel}</span>
                </div>
                {hysteresis > 0 && (
                  <div className="text-[10px] text-cyan-800/85 mt-1">
                    结束动作：测量值 ≥ {formatControlValue(lowSideClearAbove, unit)}
                    {unit}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <div className="w-full bg-white rounded-xl px-3 py-2.5 text-[13px] border border-cyan-100/80 text-gray-400">
                    选择设备
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <div className="px-3 rounded-xl bg-cyan-600 text-white text-[12px] whitespace-nowrap flex items-center opacity-80">
                  添加
                </div>
              </div>
              <div className="bg-white/70 rounded-lg py-3 text-center text-[11px] text-gray-400">
                本侧尚无设备，{ui.deviceHint}
              </div>
            </div>

            {includeExplainInExecution ? <ActionExplainBlock /> : null}
          </div>
        );

      case 'linkage-explain':
        if (!showExplainStandalone) return null;
        return (
          <div className="bg-gray-50 rounded-xl p-3 text-[12px] text-gray-600 space-y-3">
            <p>执行说明：{ui.deviceHint}</p>
          </div>
        );

      default:
        return null;
    }
  }

  const onDragEnd = (event: DragEndEvent) => {
    if (!onReorderDraftSections) return;
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldI = draftSections.findIndex(s => s.kind === active.id);
    const newI = draftSections.findIndex(s => s.kind === over.id);
    if (oldI < 0 || newI < 0) return;
    onReorderDraftSections(arrayMove(draftSections, oldI, newI));
  };

  const sectionBlocks = draftSections.map(sec => {
    const el = renderSection(sec.kind);
    const mergedExplain = sec.kind === 'linkage-explain' && hasExecution;
    const body =
      el ??
      (mergedExplain ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white/80 px-3 py-2.5 text-[11px] text-gray-400">
          {sec.label} · 已并入上方「设备联动」内的执行说明
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white/80 px-3 py-2.5 text-[11px] text-gray-400">
          {sec.label} · 当前参数或布局下不单独展示
        </div>
      ));
    return { sec, body };
  });

  const scrollBody = (
    <>
      <div className="flex items-center gap-3 mb-1 px-1">
        <button type="button" className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200/80">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <div className="flex-1 text-left">
          <h3 className="text-[16px] text-gray-900 leading-snug">{meta.label}</h3>
          <p className="text-[11px] text-gray-400">{meta.description}</p>
        </div>
      </div>

      {draftSections.length === 0 ? (
        <div className="text-center text-[13px] text-gray-400 py-12">已在左侧关闭全部模块</div>
      ) : onReorderDraftSections ? (
        <SortableContext items={draftSections.map(s => s.kind)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {sectionBlocks.map(({ sec, body }) => (
              <SortablePreviewSection key={sec.kind} id={sec.kind}>
                {body}
              </SortablePreviewSection>
            ))}
          </div>
        </SortableContext>
      ) : (
        <div className="space-y-4">
          {sectionBlocks.map(({ sec, body }) => (
            <div key={sec.kind}>{body}</div>
          ))}
        </div>
      )}

      <div className="pt-2">
        <button
          type="button"
          className="w-full py-3 rounded-xl bg-emerald-600 text-white text-[14px] flex items-center justify-center gap-2 shadow-sm"
        >
          <Save className="w-4 h-4" /> 保存策略
        </button>
      </div>
    </>
  );

  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-[#f3f4f6] overflow-hidden flex flex-col min-h-0 ${
        studioStretch ? 'flex-1 h-full w-full' : ''
      }`}
    >
      <div className="shrink-0 text-center text-[10px] text-gray-400 py-1.5 border-b border-gray-200 bg-white">
        {onReorderDraftSections
          ? '与 APP 同款的 LinkageStrategy 排版（示意数据）· 左侧与预览均可拖拽排序'
          : '与 APP 同款的 LinkageStrategy 排版（示意数据）'}
      </div>
      <div
        className={`p-3 pb-6 space-y-4 overflow-y-auto flex-1 min-h-0 ${
          studioStretch
            ? 'w-full'
            : 'max-w-[420px] mx-auto max-h-[min(78vh,720px)]'
        }`}
      >
        {onReorderDraftSections ? (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            {scrollBody}
          </DndContext>
        ) : (
          scrollBody
        )}
      </div>
    </div>
  );
}
