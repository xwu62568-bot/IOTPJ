import { useMemo } from 'react';
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
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Activity,
  Beaker,
  ChevronRight,
  Droplets,
  Gauge,
  GripVertical,
  Link2,
  Sun,
  Thermometer,
  TrendingDown,
  TrendingUp,
  Wind,
  Waves,
  Zap,
  Eye,
} from 'lucide-react';
import type { CardInstance, CardType } from '../../platform/types';
import type { ScenePackage } from '../../scenes/types';
import { cardAccent, calcVPDLeafAir, demoTelemetry } from '../../data/greenhouse-demo';
import { hasControlStrategy } from '../../data/app-alignment';

const iconMap: Record<string, typeof Thermometer> = {
  thermometer: Thermometer,
  droplets: Droplets,
  wind: Wind,
  sun: Sun,
  gauge: Gauge,
  zap: Zap,
  waves: Waves,
  flask: Beaker,
};

function cardDefMap(scene: ScenePackage) {
  return Object.fromEntries(scene.cardPalette.map(c => [c.type, c])) as Record<CardType, (typeof scene.cardPalette)[0] | undefined>;
}

function SortableCardRow({
  card,
  def,
  nestLabel,
  onToggle,
  linkedFocusParamKey,
  onFocusLinkage,
}: {
  card: CardInstance;
  def: (ReturnType<typeof cardDefMap>)[CardType];
  nestLabel: string | null;
  onToggle: (id: string) => void;
  /** 与策略页 policyKey 对应，高亮当前联动编辑对象 */
  linkedFocusParamKey?: string | null;
  onFocusLinkage?: (paramKey: CardType) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.88 : 1,
    zIndex: isDragging ? 1 : 0,
  };

  const canLinkageUi = !!(def?.hasLinkageStrategy && hasControlStrategy(card.type));
  const isLinkageFocused =
    !!linkedFocusParamKey && linkedFocusParamKey === card.type && card.enabled;

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-[13px] ${
        card.enabled ? 'border-slate-200 bg-slate-50/50' : 'border-dashed border-slate-200 opacity-60'
      } ${isLinkageFocused ? 'ring-2 ring-emerald-400/70 bg-emerald-50/40 border-emerald-200' : ''}`}
    >
      <button
        type="button"
        className="p-0.5 rounded text-slate-400 hover:text-slate-600 hover:bg-white cursor-grab active:cursor-grabbing touch-none shrink-0"
        aria-label="拖拽排序"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <label className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer">
        <input
          type="checkbox"
          checked={card.enabled}
          onChange={() => onToggle(card.id)}
          className="rounded border-slate-300 text-emerald-600"
        />
        <span className="min-w-0">
          <span className="font-medium text-slate-800 truncate block">
            {def?.title ?? card.type}
            {nestLabel && <span className="text-slate-400 font-normal text-[11px]"> · {nestLabel}</span>}
          </span>
          {def && (
            <span className="text-[10px] text-slate-400">
              {def.hasLinkageStrategy ? '→ LinkageStrategy' : def.hasLinkage ? '联动 UI、无策略数据' : '展示'}
            </span>
          )}
        </span>
      </label>
      {canLinkageUi && card.enabled && onFocusLinkage ? (
        <button
          type="button"
          className="shrink-0 rounded-lg px-2 py-1 text-[10px] font-semibold text-emerald-700 bg-emerald-100/80 hover:bg-emerald-100 border border-emerald-200/80"
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            onFocusLinkage(card.type);
          }}
        >
          联动策略
        </button>
      ) : null}
    </li>
  );
}

function SortableCardBucket({
  cards,
  defs,
  nestLabel,
  onToggle,
  onReorderIds,
  linkedFocusParamKey,
  onFocusLinkage,
}: {
  cards: CardInstance[];
  defs: ReturnType<typeof cardDefMap>;
  nestLabel: string | null;
  onToggle: (id: string) => void;
  onReorderIds: (orderedIds: string[]) => void;
  linkedFocusParamKey?: string | null;
  onFocusLinkage?: (paramKey: CardType) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const sorted = useMemo(() => [...cards].sort((a, b) => a.order - b.order), [cards]);

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldI = sorted.findIndex(c => c.id === active.id);
    const newI = sorted.findIndex(c => c.id === over.id);
    if (oldI < 0 || newI < 0) return;
    onReorderIds(arrayMove(sorted, oldI, newI).map(c => c.id));
  };

  if (sorted.length === 0) return null;

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={sorted.map(c => c.id)} strategy={verticalListSortingStrategy}>
        <ul className="space-y-2">
          {sorted.map(c => (
            <SortableCardRow
              key={c.id}
              card={c}
              def={defs[c.type]}
              nestLabel={nestLabel}
              onToggle={onToggle}
              linkedFocusParamKey={linkedFocusParamKey}
              onFocusLinkage={onFocusLinkage}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}

function ClimateCard({
  type,
  title,
  unit,
  icon,
  colorClass,
  bgClass,
  hasLink,
}: {
  type: CardType;
  title: string;
  unit: string;
  icon: string;
  colorClass: string;
  bgClass: string;
  hasLink: boolean;
}) {
  const { bar } = cardAccent(type);
  let value: string;
  let sub: string | null = null;
  if (type === 'vpd') {
    const t = parseFloat(demoTelemetry.temperature.value);
    const h = parseFloat(demoTelemetry.humidity.value);
    const v = calcVPDLeafAir(t, h);
    value = v.leaf;
    sub = `空气 ${v.air} ${unit}`;
  } else {
    const row = demoTelemetry[type];
    value = row?.value ?? '--';
  }

  const IconComp = iconMap[icon] || Gauge;

  return (
    <div
      className={`rounded-2xl p-4 text-left relative overflow-hidden shadow-sm border border-slate-100 ${
        hasLink ? 'bg-white' : 'bg-white'
      }`}
    >
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${bar}`} />
      <div className="flex items-center justify-between mb-1.5 pl-1">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${hasLink ? bgClass : 'bg-gray-50'}`}>
          <IconComp className={`${hasLink ? 'w-6 h-6' : 'w-5 h-5'} ${colorClass}`} />
        </div>
        {hasLink && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px]">
            <Link2 className="w-3 h-3" />
            <ChevronRight className="w-3 h-3" />
          </div>
        )}
      </div>
      <div className="text-[11px] text-slate-400 pl-1">{title}</div>
      <div className="text-[22px] mt-0.5 text-slate-800 pl-1">
        {value}
        <span className="text-[12px] ml-0.5 text-slate-500">{unit}</span>
      </div>
      {sub && (
        <div className="text-[11px] text-slate-400 mt-0.5 pl-1">
          {sub}
        </div>
      )}
    </div>
  );
}

function RootzoneChip({
  type,
  title,
  unit,
  icon,
  colorClass,
  bgClass,
  hasLink,
}: {
  type: CardType;
  title: string;
  unit: string;
  icon: string;
  colorClass: string;
  bgClass: string;
  hasLink: boolean;
}) {
  const row = demoTelemetry[type];
  const value = row?.value ?? '--';
  const IconComp = iconMap[icon] || Gauge;
  return (
    <div className={`${bgClass} rounded-xl p-3 text-center relative border border-white/50`}>
      {hasLink && (
        <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 px-1.5 py-1 rounded-full bg-white/90 text-emerald-600 shadow-sm">
          <Link2 className="w-2.5 h-2.5" />
          <ChevronRight className="w-2.5 h-2.5" />
        </div>
      )}
      <div className="flex justify-center mb-1">
        <IconComp className={`w-4 h-4 ${colorClass}`} />
      </div>
      <div className="text-[10px] text-slate-500">{title}</div>
      <div className={`text-[18px] ${colorClass}`}>
        {value}
        <span className="text-[9px] ml-0.5">{unit}</span>
      </div>
    </div>
  );
}

function SortableClimatePreviewCard({
  card,
  def,
  hasLink,
  linkedFocusParamKey,
  onPreviewSelectLinkage,
}: {
  card: CardInstance;
  def: NonNullable<ReturnType<typeof cardDefMap>[CardType]>;
  hasLink: boolean;
  linkedFocusParamKey?: string | null;
  onPreviewSelectLinkage?: (paramKey: CardType) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.82 : 1,
    zIndex: isDragging ? 2 : 0,
  };
  const canOpenLinkage = def.hasLinkageStrategy && hasControlStrategy(card.type);
  const previewSelectable = !!(canOpenLinkage && onPreviewSelectLinkage);
  const isLinkageFocus = !!linkedFocusParamKey && linkedFocusParamKey === card.type;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative rounded-2xl ${isLinkageFocus ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-slate-100' : ''}`}
    >
      <button
        type="button"
        className="absolute top-2 left-2 z-10 flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200/80 bg-white/95 shadow-sm text-slate-400 hover:text-slate-700 cursor-grab active:cursor-grabbing touch-none"
        aria-label="拖拽调整顺序"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <div
        role={previewSelectable ? 'button' : undefined}
        tabIndex={previewSelectable ? 0 : undefined}
        aria-label={previewSelectable ? `打开「${def.title}」联动策略配置` : undefined}
        onKeyDown={e => {
          if (!previewSelectable || !onPreviewSelectLinkage) return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onPreviewSelectLinkage(card.type);
          }
        }}
        onClick={e => {
          if (!previewSelectable || !onPreviewSelectLinkage) return;
          e.preventDefault();
          onPreviewSelectLinkage(card.type);
        }}
        className={`rounded-2xl ${previewSelectable ? 'cursor-pointer hover:brightness-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2' : ''}`}
      >
        <ClimateCard
          type={card.type}
          title={def.title}
          unit={def.unit}
          icon={def.icon}
          colorClass={def.colorClass}
          bgClass={def.bgClass}
          hasLink={hasLink}
        />
      </div>
    </div>
  );
}

function SortableRootzonePreviewChip({
  card,
  def,
  hasLink,
  linkedFocusParamKey,
  onPreviewSelectLinkage,
}: {
  card: CardInstance;
  def: NonNullable<ReturnType<typeof cardDefMap>[CardType]>;
  hasLink: boolean;
  linkedFocusParamKey?: string | null;
  onPreviewSelectLinkage?: (paramKey: CardType) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.82 : 1,
    zIndex: isDragging ? 2 : 0,
  };
  const canOpenLinkage = def.hasLinkageStrategy && hasControlStrategy(card.type);
  const previewSelectable = !!(canOpenLinkage && onPreviewSelectLinkage);
  const isLinkageFocus = !!linkedFocusParamKey && linkedFocusParamKey === card.type;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative rounded-xl ${isLinkageFocus ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-white' : ''}`}
    >
      <button
        type="button"
        className="absolute top-1 left-1 z-10 flex h-6 w-6 items-center justify-center rounded-md border border-white/80 bg-white/95 shadow-sm text-slate-400 hover:text-slate-600 cursor-grab active:cursor-grabbing touch-none"
        aria-label="拖拽调整顺序"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-3.5 w-3.5" />
      </button>
      <div
        role={previewSelectable ? 'button' : undefined}
        tabIndex={previewSelectable ? 0 : undefined}
        aria-label={previewSelectable ? `打开「${def.title}」联动策略配置` : undefined}
        onKeyDown={e => {
          if (!previewSelectable || !onPreviewSelectLinkage) return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onPreviewSelectLinkage(card.type);
          }
        }}
        onClick={e => {
          if (!previewSelectable || !onPreviewSelectLinkage) return;
          e.preventDefault();
          onPreviewSelectLinkage(card.type);
        }}
        className={`rounded-xl ${previewSelectable ? 'cursor-pointer hover:brightness-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-1' : ''}`}
      >
        <RootzoneChip
          type={card.type}
          title={def.title}
          unit={def.unit}
          icon={def.icon}
          colorClass={def.colorClass}
          bgClass={def.bgClass}
          hasLink={hasLink}
        />
      </div>
    </div>
  );
}

function usePreviewSensors() {
  return useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
}

function PreviewClimateDrag({
  cards,
  defs,
  onReorderIds,
  linkedFocusParamKey,
  onPreviewSelectLinkage,
}: {
  cards: CardInstance[];
  defs: ReturnType<typeof cardDefMap>;
  onReorderIds: (orderedIds: string[]) => void;
  linkedFocusParamKey?: string | null;
  onPreviewSelectLinkage?: (paramKey: CardType) => void;
}) {
  const sensors = usePreviewSensors();
  const sorted = useMemo(() => [...cards].sort((a, b) => a.order - b.order), [cards]);

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldI = sorted.findIndex(c => c.id === active.id);
    const newI = sorted.findIndex(c => c.id === over.id);
    if (oldI < 0 || newI < 0) return;
    onReorderIds(arrayMove(sorted, oldI, newI).map(c => c.id));
  };

  if (sorted.length === 0) return null;

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={sorted.map(c => c.id)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-2 gap-3 w-full">
          {sorted.map(c => {
            const def = defs[c.type];
            if (!def) return null;
            const hasLink = def.hasLinkage && (def.hasLinkageStrategy ? hasControlStrategy(c.type) : false);
            return (
              <SortableClimatePreviewCard
                key={c.id}
                card={c}
                def={def}
                hasLink={hasLink}
                linkedFocusParamKey={linkedFocusParamKey}
                onPreviewSelectLinkage={onPreviewSelectLinkage}
              />
            );
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function PreviewRootzoneDrag({
  cards,
  defs,
  onReorderIds,
  linkedFocusParamKey,
  onPreviewSelectLinkage,
}: {
  cards: CardInstance[];
  defs: ReturnType<typeof cardDefMap>;
  onReorderIds: (orderedIds: string[]) => void;
  linkedFocusParamKey?: string | null;
  onPreviewSelectLinkage?: (paramKey: CardType) => void;
}) {
  const sensors = usePreviewSensors();
  const sorted = useMemo(() => [...cards].sort((a, b) => a.order - b.order), [cards]);

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldI = sorted.findIndex(c => c.id === active.id);
    const newI = sorted.findIndex(c => c.id === over.id);
    if (oldI < 0 || newI < 0) return;
    onReorderIds(arrayMove(sorted, oldI, newI).map(c => c.id));
  };

  if (sorted.length === 0) return null;

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={sorted.map(c => c.id)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-2 gap-2 w-full">
          {sorted.map(c => {
            const def = defs[c.type];
            if (!def) return null;
            const hasLink = def.hasLinkage && (def.hasLinkageStrategy ? hasControlStrategy(c.type) : false);
            return (
              <SortableRootzonePreviewChip
                key={c.id}
                card={c}
                def={def}
                hasLink={hasLink}
                linkedFocusParamKey={linkedFocusParamKey}
                onPreviewSelectLinkage={onPreviewSelectLinkage}
              />
            );
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function EnergyPreview() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-purple-50 rounded-lg p-2 text-center">
          <div className="text-[10px] text-slate-500">总功率</div>
          <div className="text-[16px] text-purple-600">
            8.24<span className="text-[9px]"> kW</span>
          </div>
        </div>
        <div className="bg-sky-50 rounded-lg p-2 text-center">
          <div className="text-[10px] text-slate-500">今日用电</div>
          <div className="text-[16px] text-sky-600">
            96.5<span className="text-[9px]"> kWh</span>
          </div>
        </div>
        <div className="bg-orange-50 rounded-lg p-2 text-center">
          <div className="text-[10px] text-slate-500">本月用电</div>
          <div className="text-[16px] text-orange-600">
            2,840<span className="text-[9px]"> kWh</span>
          </div>
        </div>
      </div>
      <div className="bg-slate-50 rounded-xl p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-purple-500" />
            <span className="text-[12px]">DTSD-3P</span>
          </div>
          <span className="text-[10px] text-emerald-600 flex items-center gap-0.5">
            <Activity className="w-2.5 h-2.5" /> 正常
          </span>
        </div>
        <div className="grid grid-cols-4 gap-1.5 text-center text-[11px]">
          <div>
            <div className="text-[9px] text-slate-400">电压</div>
            <div className="text-sky-600">220.4V</div>
          </div>
          <div>
            <div className="text-[9px] text-slate-400">电流</div>
            <div className="text-emerald-600">12.5A</div>
          </div>
          <div>
            <div className="text-[9px] text-slate-400">功率</div>
            <div className="text-purple-600">8.24kW</div>
          </div>
          <div>
            <div className="text-[9px] text-slate-400">功率因数</div>
            <div className="text-slate-600">0.97</div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-3 px-1 text-[11px]">
        <span className="flex items-center gap-1 text-emerald-600">
          <TrendingDown className="w-3 h-3" /> 较昨日 -5.2%
        </span>
        <span className="flex items-center gap-1 text-orange-500">
          <TrendingUp className="w-3 h-3" /> 较上月 +3.8%
        </span>
        <span className="text-slate-400">累计 12,456 kWh</span>
      </div>
    </div>
  );
}

export function PageConfigurator({
  scene,
  draftCards,
  onReorderCardsInBucket,
  onToggle,
  embedded = false,
  embeddedWide = false,
  linkedFocusParamKey,
  onFocusLinkage,
}: {
  scene: ScenePackage;
  draftCards: CardInstance[];
  /** 同一分组（及根区子区）内拖拽完成后的 id 顺序 */
  onReorderCardsInBucket: (
    layoutGroup: string,
    rootNest: 'medium' | 'solution' | undefined,
    orderedIds: string[],
  ) => void;
  onToggle: (id: string) => void;
  /** 为 true 时不渲染顶层标题区（由外层 SceneStudio 提供） */
  embedded?: boolean;
  /** 双栏布局占满列宽，不限制 max-w-6xl */
  embeddedWide?: boolean;
  linkedFocusParamKey?: string | null;
  onFocusLinkage?: (paramKey: CardType) => void;
}) {
  const defs = useMemo(() => cardDefMap(scene), [scene]);

  const outerCls =
    embedded && embeddedWide
      ? 'p-6 pt-4 w-full min-w-0 h-full min-h-0 flex flex-col flex-1'
      : embedded
        ? 'p-6 pt-4 max-w-6xl mx-auto'
        : 'p-6 max-w-6xl mx-auto';

  if (scene.cardPalette.length === 0) {
    return (
      <div className={embedded && embeddedWide ? 'p-6 pt-4 w-full min-w-0 max-w-3xl' : `${embedded ? 'p-6 pt-4' : 'p-6'} max-w-3xl mx-auto`}>
        {!embedded && <h1 className="text-xl font-semibold text-slate-900">页面配置</h1>}
        <p className={`text-sm text-slate-600 ${embedded ? '' : 'mt-2'}`}>
          场景「{scene.name}」尚未挂载页面物料。上线该场景时在此定义默认实时页分组与卡片，并与物模型点位绑定。
        </p>
      </div>
    );
  }

  const groups = [...scene.defaultPage.groups].sort((a, b) => a.order - b.order);

  return (
    <div className={outerCls}>
      {!embedded && (
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">页面配置</h1>
            <p className="mt-1 text-sm text-slate-600">
              左侧清单与<strong>右侧预览</strong>均可拖拽排序（预览区捏住卡片左上角 ⋮⋮）；同一分组内顺序互通。
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <Eye className="h-3.5 w-3.5" />
            {scene.name}
          </div>
        </header>
      )}
      {embedded && (
        <p className={`mb-5 text-sm text-slate-600 ${embeddedWide ? 'shrink-0' : ''}`}>
          {onFocusLinkage ? (
            <>
              带 <span className="text-emerald-700 font-medium">联动策略</span> 的卡片与右侧二级页共用同一{' '}
              <code className="text-[11px] bg-slate-100 px-1 rounded">policyKey</code>；点按钮或顶部芯片切换对象。
            </>
          ) : null}
          {onFocusLinkage ? ' ' : null}
          左侧清单与<strong>右侧预览</strong>均可拖拽排序（预览区捏住卡片左上角 ⋮⋮）；同一分组内顺序互通。
        </p>
      )}

      <div
        className={`min-w-0 grid gap-6 lg:grid-cols-2 ${embeddedWide ? 'flex-1 min-h-0' : ''}`}
      >
        <div className="space-y-6 min-h-0 flex flex-col min-w-0">
          <div className="rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-[var(--shadow-card)] ring-1 ring-white/60 backdrop-blur-sm">
            <div className="text-[12px] font-semibold text-slate-700 mb-3">卡片清单（组内拖拽排序）</div>
            <div className="space-y-5">
              {groups.map(grp => {
                const inGroup = draftCards.filter(c => c.layoutGroup === grp.key);
                if (grp.key === 'rootzone') {
                  const medium = inGroup.filter(c => c.rootNest === 'medium');
                  const solution = inGroup.filter(c => c.rootNest === 'solution');
                  return (
                    <div key={grp.key}>
                      <div className="text-[11px] uppercase tracking-wide text-slate-400 mb-2">{grp.label}</div>
                      <div className="text-[10px] text-slate-400 mb-1.5 px-0.5">根区基质</div>
                      <div className="mb-3">
                        <SortableCardBucket
                          cards={medium}
                          defs={defs}
                          nestLabel="根区基质"
                          onToggle={onToggle}
                          onReorderIds={ids => onReorderCardsInBucket('rootzone', 'medium', ids)}
                          linkedFocusParamKey={linkedFocusParamKey}
                          onFocusLinkage={onFocusLinkage}
                        />
                      </div>
                      <div className="text-[10px] text-slate-400 mb-1.5 px-0.5">营养液回路</div>
                      <SortableCardBucket
                        cards={solution}
                        defs={defs}
                        nestLabel="营养液回路"
                        onToggle={onToggle}
                        onReorderIds={ids => onReorderCardsInBucket('rootzone', 'solution', ids)}
                        linkedFocusParamKey={linkedFocusParamKey}
                        onFocusLinkage={onFocusLinkage}
                      />
                    </div>
                  );
                }
                const bucket = inGroup;
                return (
                  <div key={grp.key}>
                    <div className="text-[11px] uppercase tracking-wide text-slate-400 mb-2">{grp.label}</div>
                    <SortableCardBucket
                      cards={bucket}
                      defs={defs}
                      nestLabel={null}
                      onToggle={onToggle}
                      onReorderIds={ids => onReorderCardsInBucket(grp.key, undefined, ids)}
                      linkedFocusParamKey={linkedFocusParamKey}
                      onFocusLinkage={onFocusLinkage}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="min-w-0 w-full flex flex-col min-h-0">
          <div
            className={`rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-[var(--shadow-card)] ring-1 ring-white/60 backdrop-blur-sm w-full min-w-0 flex flex-col ${
              embeddedWide ? 'flex-1 min-h-0' : 'sticky top-4'
            }`}
          >
            <div className="text-[12px] font-semibold text-slate-700 mb-1">实时页预览（可拖拽卡片排序）</div>
            <p className="text-[10px] text-slate-400 mb-2">
              {onFocusLinkage
                ? '带联动角标的卡片可点击，右侧切换到对应二级策略；排序仍捏 ⋮⋮ 拖动。'
                : '环境气候 / 根区两栏：拖动卡片角标 ⋮⋮'}
            </p>
            <div
              className={`rounded-xl bg-slate-100/80 p-3 space-y-4 overflow-y-auto w-full min-w-0 flex-1 min-h-0 ${
                embeddedWide ? '' : 'max-h-[720px]'
              }`}
            >
              {groups.map(grp => {
                const inGroup = draftCards.filter(c => c.layoutGroup === grp.key && c.enabled);
                if (inGroup.length === 0) return null;

                if (grp.key === 'climate') {
                  const cards = inGroup;
                  return (
                    <div key={grp.key}>
                      <div className="flex items-center gap-1.5 mb-2 px-0.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[11px] text-slate-500">{grp.label}</span>
                      </div>
                      <PreviewClimateDrag
                        cards={cards}
                        defs={defs}
                        onReorderIds={ids => onReorderCardsInBucket('climate', undefined, ids)}
                        linkedFocusParamKey={linkedFocusParamKey}
                        onPreviewSelectLinkage={onFocusLinkage}
                      />
                    </div>
                  );
                }

                if (grp.key === 'rootzone') {
                  const medium = inGroup.filter(c => c.rootNest === 'medium').sort((a, b) => a.order - b.order);
                  const solution = inGroup.filter(c => c.rootNest === 'solution').sort((a, b) => a.order - b.order);
                  if (medium.length === 0 && solution.length === 0) return null;
                  return (
                    <div key={grp.key}>
                      <div className="flex items-center gap-1.5 mb-2 px-0.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
                        <span className="text-[11px] text-slate-500">{grp.label}</span>
                      </div>
                      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                        {medium.length > 0 && (
                          <div className={solution.length > 0 ? 'mb-4' : ''}>
                            <div className="text-[11px] text-slate-400 mb-2 px-0.5">根区基质</div>
                            <PreviewRootzoneDrag
                              cards={medium}
                              defs={defs}
                              onReorderIds={ids => onReorderCardsInBucket('rootzone', 'medium', ids)}
                              linkedFocusParamKey={linkedFocusParamKey}
                              onPreviewSelectLinkage={onFocusLinkage}
                            />
                          </div>
                        )}
                        {solution.length > 0 && (
                          <div>
                            <div className="text-[11px] text-slate-400 mb-2 px-0.5">营养液回路</div>
                            <PreviewRootzoneDrag
                              cards={solution}
                              defs={defs}
                              onReorderIds={ids => onReorderCardsInBucket('rootzone', 'solution', ids)}
                              linkedFocusParamKey={linkedFocusParamKey}
                              onPreviewSelectLinkage={onFocusLinkage}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }

                if (grp.key === 'energy') {
                  return (
                    <div key={grp.key}>
                      <div className="flex items-center gap-1.5 mb-2 px-0.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                        <span className="text-[11px] text-slate-500">{grp.label}</span>
                      </div>
                      <EnergyPreview />
                    </div>
                  );
                }

                const cards = [...inGroup].sort((a, b) => a.order - b.order);
                return (
                  <div key={grp.key}>
                    <div className="flex items-center gap-1.5 mb-2 px-0.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                      <span className="text-[11px] text-slate-500">{grp.label}</span>
                    </div>
                    <PreviewClimateDrag
                      cards={cards}
                      defs={defs}
                      onReorderIds={ids => onReorderCardsInBucket(grp.key, undefined, ids)}
                      linkedFocusParamKey={linkedFocusParamKey}
                      onPreviewSelectLinkage={onFocusLinkage}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
