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
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import type { StrategyPageSchema, StrategySectionModule } from '../../platform/types';
import type { ScenePackage } from '../../scenes/types';
import { hasControlStrategy } from '../../data/app-alignment';
import { LinkageStrategyAppPreview } from './LinkageStrategyAppPreview';

function SortableStrategyRow({
  section,
  onToggle,
}: {
  section: StrategySectionModule;
  onToggle: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.kind,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.88 : 1,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50/40 px-3 py-2 text-[13px]"
    >
      <button
        type="button"
        className="mt-0.5 p-0.5 rounded text-slate-400 hover:text-slate-600 hover:bg-white/80 cursor-grab active:cursor-grabbing touch-none shrink-0"
        aria-label="拖拽排序"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <label className="flex items-start gap-2 flex-1 cursor-pointer min-w-0">
        <input
          type="checkbox"
          className="mt-0.5 rounded border-slate-300 text-emerald-600 shrink-0"
          checked
          onChange={onToggle}
        />
        <span className="min-w-0">
          <span className="font-medium text-slate-800 block">{section.label}</span>
          <span className="text-[11px] text-slate-500">{section.description}</span>
        </span>
      </label>
    </li>
  );
}

export function StrategyConfigurator({
  scene,
  policies,
  selectedPolicyId,
  onSelectPolicy,
  draftSections,
  onToggleSection,
  onReorderDraftSections,
  embedded = false,
  embeddedWide = false,
  linkageContextHint,
  policyChoice = 'dropdown',
}: {
  scene: ScenePackage;
  policies: StrategyPageSchema[];
  selectedPolicyId: string;
  onSelectPolicy: (id: string) => void;
  draftSections: StrategySectionModule[];
  onToggleSection: (kind: StrategySectionModule['kind']) => void;
  /** 拖拽调整后的启用模块顺序（仅含已勾选模块） */
  onReorderDraftSections: (next: StrategySectionModule[]) => void;
  embedded?: boolean;
  embeddedWide?: boolean;
  /** 与实时页卡片关联说明（SceneStudio 传入） */
  linkageContextHint?: string;
  /** previewOnly：不展示下拉，由左侧实时预览 / 顶部联动条切换 policy */
  policyChoice?: 'dropdown' | 'previewOnly';
}) {
  const selected = useMemo(
    () => policies.find(p => p.id === selectedPolicyId) ?? policies[0],
    [policies, selectedPolicyId],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const enabledKinds = useMemo(() => new Set(draftSections.map(s => s.kind)), [draftSections]);

  const availableOnly = useMemo(
    () => selected?.sections.filter(s => !enabledKinds.has(s.kind)) ?? [],
    [selected?.sections, enabledKinds],
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldI = draftSections.findIndex(s => s.kind === active.id);
    const newI = draftSections.findIndex(s => s.kind === over.id);
    if (oldI < 0 || newI < 0) return;
    onReorderDraftSections(arrayMove(draftSections, oldI, newI));
  };

  const outerCls =
    embedded && embeddedWide
      ? 'p-6 pt-4 w-full min-w-0 flex-1 min-h-0 h-full flex flex-col'
      : embedded
        ? 'p-6 pt-4 max-w-[1200px] mx-auto'
        : 'p-6 max-w-[1200px] mx-auto';

  if (!policies.length) {
    return (
      <div
        className={
          embedded && embeddedWide ? 'p-6 pt-4 w-full min-w-0 max-w-3xl' : `${embedded ? 'p-6 pt-4' : 'p-6'} max-w-3xl mx-auto`
        }
      >
        {!embedded && <h1 className="text-xl font-semibold text-slate-900">策略配置</h1>}
        <p className={`text-sm text-slate-600 ${embedded ? '' : 'mt-2'}`}>
          场景「{scene.name}」暂无策略页模板。
        </p>
      </div>
    );
  }

  const paramKey = selected?.policyKey;
  const canPreviewLinkage = paramKey && hasControlStrategy(paramKey);

  return (
    <div className={outerCls}>
      {!embedded && (
        <header className="mb-6">
          <h1 className="text-xl font-semibold text-slate-900">策略配置</h1>
          <p className="mt-1 text-sm text-slate-600">
            已启用模块在<strong>左侧清单</strong>与<strong>右侧预览</strong>均可拖拽排序（预览区捏住模块左上角 ⋮⋮）；下方「可选模块」勾选即加入。
          </p>
        </header>
      )}
      {embedded && (
        <div className={embeddedWide ? 'shrink-0 mb-4 space-y-3' : undefined}>
          {linkageContextHint ? (
            <p
              className={`text-[13px] text-emerald-900 leading-snug bg-emerald-50/90 border border-emerald-100 rounded-xl px-3 py-2.5 ${
                embeddedWide ? '' : 'mb-3'
              }`}
            >
              {linkageContextHint}
            </p>
          ) : null}
          <p className={`text-sm text-slate-600 ${embeddedWide ? '' : 'mb-5'}`}>
            已启用模块在<strong>左侧清单</strong>与<strong>右侧预览</strong>均可拖拽排序（预览区捏住模块左上角 ⋮⋮）；下方「可选模块」勾选即加入。
          </p>
        </div>
      )}

      {embeddedWide ? (
        <div className="flex flex-1 min-h-0 w-full min-w-0 flex-col gap-6 lg:flex-row lg:items-stretch">
          <div className="flex min-h-0 min-w-0 flex-col gap-4 lg:flex-1 lg:basis-0 lg:overflow-hidden">
            <div className="shrink-0 rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-[var(--shadow-card)] ring-1 ring-white/60 backdrop-blur-sm">
              {policyChoice === 'previewOnly' ? (
                <>
                  <div className="text-[11px] font-medium text-slate-500">当前联动策略</div>
                  <p className="mt-1 text-[15px] font-semibold text-slate-900">{selected?.title}</p>
                  <p className="mt-2 text-[11px] text-slate-500 leading-snug">
                    在<strong>左侧实时页预览</strong>中点击带联动箭头的卡片，或使用顶部「联动对象」切换；此处不提供下拉换页，贴近
                    APP 从卡片进入二级页。
                  </p>
                  <p className="mt-2 text-[10px] text-slate-400 font-mono tabular-nums">
                    mock-data · controlStrategies · {selected?.policyKey}
                  </p>
                </>
              ) : (
                <>
                  <label className="text-[11px] font-medium text-slate-500">联动策略（paramKey）</label>
                  <select
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-900"
                    value={selected?.id}
                    onChange={e => onSelectPolicy(e.target.value)}
                  >
                    {policies.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                  <p className="mt-2 text-[11px] text-slate-500 leading-snug">
                    对应 mock-data · controlStrategies · {selected?.policyKey}
                  </p>
                </>
              )}
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
              <div className="rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-[var(--shadow-card)] ring-1 ring-white/60 backdrop-blur-sm space-y-3">
                <div className="text-[12px] font-semibold text-slate-700">已启用模块（拖拽排序）</div>
                {draftSections.length === 0 ? (
                  <p className="text-[12px] text-slate-500 py-2">暂无，请在下方的「可选模块」中勾选添加。</p>
                ) : (
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={draftSections.map(s => s.kind)} strategy={verticalListSortingStrategy}>
                      <ul className="space-y-2">
                        {draftSections.map(sec => (
                          <SortableStrategyRow
                            key={sec.kind}
                            section={sec}
                            onToggle={() => onToggleSection(sec.kind)}
                          />
                        ))}
                      </ul>
                    </SortableContext>
                  </DndContext>
                )}
              </div>

              {availableOnly.length > 0 && (
                <div className="rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-[var(--shadow-card)] ring-1 ring-white/60 backdrop-blur-sm">
                  <div className="text-[12px] font-semibold text-slate-700 mb-2">可选模块</div>
                  <ul className="space-y-2">
                    {availableOnly.map(sec => (
                      <li
                        key={sec.kind}
                        className="flex items-start gap-2 rounded-xl border border-slate-100 bg-slate-50/30 px-3 py-2 text-[13px]"
                      >
                        <label className="flex items-start gap-2 flex-1 cursor-pointer">
                          <input
                            type="checkbox"
                            className="mt-0.5 rounded border-slate-300 text-emerald-600"
                            checked={false}
                            onChange={() => onToggleSection(sec.kind)}
                          />
                          <span>
                            <span className="font-medium text-slate-800 block">{sec.label}</span>
                            <span className="text-[11px] text-slate-500">{sec.description}</span>
                          </span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="flex min-h-0 min-w-0 flex-col lg:flex-1 lg:basis-0">
            {canPreviewLinkage ? (
              <LinkageStrategyAppPreview
                paramKey={paramKey}
                draftSections={draftSections}
                onReorderDraftSections={onReorderDraftSections}
                studioStretch
              />
            ) : (
              <div className="flex min-h-0 flex-1 flex-col">
                <div className="flex min-h-[12rem] flex-1 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
                  当前策略无 Linkage 预览
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-[var(--shadow-card)] ring-1 ring-white/60 backdrop-blur-sm">
              {policyChoice === 'previewOnly' ? (
                <>
                  <div className="text-[11px] font-medium text-slate-500">当前联动策略</div>
                  <p className="mt-1 text-[15px] font-semibold text-slate-900">{selected?.title}</p>
                  <p className="mt-2 text-[11px] text-slate-500 leading-snug">
                    在<strong>左侧实时页预览</strong>中点击带联动箭头的卡片，或使用顶部「联动对象」切换；此处不提供下拉换页，贴近
                    APP 从卡片进入二级页。
                  </p>
                  <p className="mt-2 text-[10px] text-slate-400 font-mono tabular-nums">
                    mock-data · controlStrategies · {selected?.policyKey}
                  </p>
                </>
              ) : (
                <>
                  <label className="text-[11px] font-medium text-slate-500">联动策略（paramKey）</label>
                  <select
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-900"
                    value={selected?.id}
                    onChange={e => onSelectPolicy(e.target.value)}
                  >
                    {policies.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                  <p className="mt-2 text-[11px] text-slate-500 leading-snug">
                    对应 mock-data · controlStrategies · {selected?.policyKey}
                  </p>
                </>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-[var(--shadow-card)] ring-1 ring-white/60 backdrop-blur-sm space-y-3">
              <div className="text-[12px] font-semibold text-slate-700">已启用模块（拖拽排序）</div>
              {draftSections.length === 0 ? (
                <p className="text-[12px] text-slate-500 py-2">暂无，请在下方的「可选模块」中勾选添加。</p>
              ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={draftSections.map(s => s.kind)} strategy={verticalListSortingStrategy}>
                    <ul className="space-y-2">
                      {draftSections.map(sec => (
                        <SortableStrategyRow
                          key={sec.kind}
                          section={sec}
                          onToggle={() => onToggleSection(sec.kind)}
                        />
                      ))}
                    </ul>
                  </SortableContext>
                </DndContext>
              )}
            </div>

            {availableOnly.length > 0 && (
              <div className="rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-[var(--shadow-card)] ring-1 ring-white/60 backdrop-blur-sm">
                <div className="text-[12px] font-semibold text-slate-700 mb-2">可选模块</div>
                <ul className="space-y-2">
                  {availableOnly.map(sec => (
                    <li
                      key={sec.kind}
                      className="flex items-start gap-2 rounded-xl border border-slate-100 bg-slate-50/30 px-3 py-2 text-[13px]"
                    >
                      <label className="flex items-start gap-2 flex-1 cursor-pointer">
                        <input
                          type="checkbox"
                          className="mt-0.5 rounded border-slate-300 text-emerald-600"
                          checked={false}
                          onChange={() => onToggleSection(sec.kind)}
                        />
                        <span>
                          <span className="font-medium text-slate-800 block">{sec.label}</span>
                          <span className="text-[11px] text-slate-500">{sec.description}</span>
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="lg:col-span-7">
            {canPreviewLinkage ? (
              <LinkageStrategyAppPreview
                paramKey={paramKey}
                draftSections={draftSections}
                onReorderDraftSections={onReorderDraftSections}
              />
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
                当前策略无 Linkage 预览
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
