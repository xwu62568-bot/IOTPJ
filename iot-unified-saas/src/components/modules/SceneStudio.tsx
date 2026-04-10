import { useCallback, useEffect, useMemo, useState } from 'react';
import { Eye, Link2 } from 'lucide-react';
import type { CardInstance, CardType, StrategyPageSchema, StrategySectionModule } from '../../platform/types';
import type { ScenePackage } from '../../scenes/types';
import { hasControlStrategy } from '../../data/app-alignment';
import { PageConfigurator } from './PageConfigurator';
import { StrategyConfigurator } from './StrategyConfigurator';

function cardDefRecord(scene: ScenePackage) {
  return Object.fromEntries(scene.cardPalette.map(c => [c.type, c])) as Record<
    CardType,
    (typeof scene.cardPalette)[0] | undefined
  >;
}

export function SceneStudio({
  scene,
  draftCards,
  onReorderCardsInBucket,
  onToggleCard,
  policies,
  selectedPolicyId,
  onSelectPolicy,
  draftSections,
  onToggleSection,
  onReorderDraftSections,
}: {
  scene: ScenePackage;
  draftCards: CardInstance[];
  onReorderCardsInBucket: (
    layoutGroup: string,
    rootNest: 'medium' | 'solution' | undefined,
    orderedIds: string[],
  ) => void;
  onToggleCard: (id: string) => void;
  policies: StrategyPageSchema[];
  selectedPolicyId: string;
  onSelectPolicy: (id: string) => void;
  draftSections: StrategySectionModule[];
  onToggleSection: (kind: StrategySectionModule['kind']) => void;
  onReorderDraftSections: (next: StrategySectionModule[]) => void;
}) {
  const defs = useMemo(() => cardDefRecord(scene), [scene]);

  /** 当前实时页已启用、且与 Linkage 策略页 1:1 的指标（policyKey === card.type） */
  const linkageOptions = useMemo(() => {
    const out: CardInstance[] = [];
    const seen = new Set<CardType>();
    const sorted = [...draftCards].sort((a, b) => a.order - b.order);
    for (const c of sorted) {
      const d = defs[c.type];
      if (!c.enabled || !d?.hasLinkageStrategy || !hasControlStrategy(c.type)) continue;
      if (seen.has(c.type)) continue;
      seen.add(c.type);
      out.push(c);
    }
    return out;
  }, [draftCards, defs]);

  const [focusParamKey, setFocusParamKey] = useState<string | null>(null);

  useEffect(() => {
    setFocusParamKey(null);
  }, [scene.key]);

  useEffect(() => {
    if (linkageOptions.length === 0) {
      setFocusParamKey(null);
      return;
    }
    setFocusParamKey(prev => {
      const valid = prev != null && linkageOptions.some(c => c.type === prev);
      if (valid) return prev;
      return linkageOptions[0]!.type;
    });
  }, [scene.key, linkageOptions]);

  useEffect(() => {
    if (!focusParamKey) return;
    const p = policies.find(x => x.policyKey === focusParamKey);
    if (p && p.id !== selectedPolicyId) onSelectPolicy(p.id);
  }, [focusParamKey, policies, selectedPolicyId, onSelectPolicy]);

  const handleSelectPolicy = useCallback(
    (id: string) => {
      onSelectPolicy(id);
      const p = policies.find(x => x.id === id);
      if (p && hasControlStrategy(p.policyKey)) setFocusParamKey(p.policyKey);
    },
    [onSelectPolicy, policies],
  );

  const focusTitle = focusParamKey ? defs[focusParamKey as CardType]?.title ?? focusParamKey : null;

  const linkageHint =
    focusTitle &&
    `与实时页「${focusTitle}」卡片强关联：policyKey = ${focusParamKey}。可在左侧预览点击该卡片、点清单「联动策略」或顶部芯片切换。`;

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <div className="shrink-0 border-b border-slate-200/80 bg-white/85 px-4 py-5 shadow-sm backdrop-blur-md sm:px-8">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700/85">Studio</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">场景配置</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
              <strong className="font-semibold text-slate-800">实时页</strong>与
              <strong className="font-semibold text-slate-800">联动策略二级页</strong>按{' '}
              <code className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-700 ring-1 ring-slate-200/80">
                policyKey
              </code>{' '}
              对应；双栏对照，顶部可切换当前指标。
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-slate-100/90 px-3 py-1.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200/60">
            <Eye className="h-4 w-4 text-emerald-600" strokeWidth={2} />
            {scene.name}
          </div>
        </div>

        <div className="mx-auto mt-5 max-w-[1600px] rounded-2xl border border-emerald-200/50 bg-gradient-to-r from-emerald-50/90 via-teal-50/40 to-cyan-50/30 px-4 py-4 shadow-sm ring-1 ring-white/60">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-emerald-900">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-emerald-600 shadow-sm ring-1 ring-emerald-100">
              <Link2 className="h-3.5 w-3.5" strokeWidth={2} />
            </span>
            联动对象（实时页 ⇄ 策略页）
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {linkageOptions.length === 0 ? (
              <p className="text-[13px] leading-relaxed text-slate-600">
                暂无可用对象：请在左侧启用带 LinkageStrategy 的指标卡（如温室：温/湿/CO₂/VPD/光/基质湿度/液位；灌溉：土壤含水、蓄水池液位等）。
              </p>
            ) : (
              linkageOptions.map(card => {
                const d = defs[card.type];
                const active = focusParamKey === card.type;
                return (
                  <button
                    key={card.type}
                    type="button"
                    onClick={() => {
                      setFocusParamKey(card.type);
                      const p = policies.find(x => x.policyKey === card.type);
                      if (p) onSelectPolicy(p.id);
                    }}
                    className={`rounded-xl px-3.5 py-2 text-[12px] font-semibold transition-all ${
                      active
                        ? 'border border-emerald-600 bg-gradient-to-b from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/25'
                        : 'border border-slate-200/90 bg-white/90 text-slate-700 shadow-sm hover:border-emerald-200 hover:bg-white'
                    }`}
                  >
                    {d?.title ?? card.type}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col divide-y divide-slate-200/80 xl:flex-row xl:divide-x xl:divide-y-0">
        <section className="flex min-h-0 min-w-0 flex-1 basis-0 flex-col overflow-hidden bg-white/70 backdrop-blur-sm">
          <PageConfigurator
            embedded
            embeddedWide
            scene={scene}
            draftCards={draftCards}
            onReorderCardsInBucket={onReorderCardsInBucket}
            onToggle={onToggleCard}
            linkedFocusParamKey={focusParamKey}
            onFocusLinkage={key => {
              setFocusParamKey(key);
              const p = policies.find(x => x.policyKey === key);
              if (p) onSelectPolicy(p.id);
            }}
          />
        </section>
        <section className="flex min-h-0 min-w-0 flex-1 basis-0 flex-col overflow-hidden bg-slate-50/50 backdrop-blur-sm">
          <StrategyConfigurator
            embedded
            embeddedWide
            scene={scene}
            policies={policies}
            selectedPolicyId={selectedPolicyId}
            onSelectPolicy={handleSelectPolicy}
            draftSections={draftSections}
            onToggleSection={onToggleSection}
            onReorderDraftSections={onReorderDraftSections}
            linkageContextHint={linkageHint ?? undefined}
            policyChoice="previewOnly"
          />
        </section>
      </div>
    </div>
  );
}
