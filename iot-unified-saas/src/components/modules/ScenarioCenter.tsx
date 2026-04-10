import { BadgeCheck, FlaskConical, Leaf, Droplets, Zap } from 'lucide-react';
import type { ScenePackage } from '../../scenes/types';

const iconFor = (key: string) => {
  if (key === 'greenhouse') return Leaf;
  if (key === 'irrigation' || key === 'fertigation') return Droplets;
  if (key === 'energy') return Zap;
  return FlaskConical;
};

const statusStyle: Record<string, string> = {
  active: 'bg-emerald-100/90 text-emerald-900 ring-emerald-200/80',
  preview: 'bg-amber-50 text-amber-900 ring-amber-200/70',
  planned: 'bg-slate-100 text-slate-600 ring-slate-200/80',
};

const statusLabel: Record<string, string> = {
  active: '已启用',
  preview: '预览',
  planned: '规划中',
};

const iconBgFor = (key: string) => {
  if (key === 'greenhouse') return 'from-emerald-500 to-teal-600 shadow-emerald-500/20';
  if (key === 'irrigation') return 'from-sky-500 to-cyan-600 shadow-sky-500/20';
  if (key === 'fertigation') return 'from-violet-500 to-purple-600 shadow-violet-500/20';
  if (key === 'energy') return 'from-amber-500 to-orange-600 shadow-amber-500/20';
  return 'from-slate-500 to-slate-600 shadow-slate-500/15';
};

export function ScenarioCenter({
  scenes,
  selectedKey,
  onSelect,
}: {
  scenes: ScenePackage[];
  selectedKey: string;
  onSelect: (key: string) => void;
}) {
  return (
    <div className="relative px-4 py-8 sm:px-8 sm:py-10 lg:px-10">
      <div className="pointer-events-none absolute left-[10%] top-0 h-40 w-40 rounded-full bg-emerald-300/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-20 right-[5%] h-56 w-56 rounded-full bg-indigo-200/25 blur-3xl" />

      <div className="relative mx-auto max-w-5xl">
        <header className="mb-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700/80">Scene packages</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">场景中心</h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-slate-600">
            每个场景是一套可安装的能力包：页面模板、卡片物料与策略模块抽象。底层统一设备、数据与权限；在此选用场景并进入配置。
          </p>
          <p className="mt-2 text-sm text-emerald-800/80">
            点击卡片 → 打开「场景配置」并选中该场景
          </p>
        </header>

        <div className="grid gap-5 sm:grid-cols-2">
          {scenes.map(scene => {
            const Icon = iconFor(scene.key);
            const selected = selectedKey === scene.key;
            const grad = iconBgFor(scene.key);
            return (
              <button
                key={scene.key}
                type="button"
                onClick={() => onSelect(scene.key)}
                className={`group relative text-left transition-all duration-300 ${
                  selected
                    ? 'scale-[1.01] ring-2 ring-emerald-400 ring-offset-2 ring-offset-transparent'
                    : 'hover:-translate-y-0.5'
                }`}
              >
                <div
                  className={`relative overflow-hidden rounded-2xl border bg-white/90 p-6 shadow-[var(--shadow-card)] backdrop-blur-sm transition-all duration-300 ${
                    selected
                      ? 'border-emerald-300/80 shadow-[var(--shadow-card-hover)]'
                      : 'border-slate-200/80 hover:border-emerald-200/60 hover:shadow-[var(--shadow-card-hover)]'
                  }`}
                >
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white via-transparent to-emerald-50/0 opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="relative flex items-start justify-between gap-3">
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg ${grad}`}
                      >
                        <Icon className="h-6 w-6" strokeWidth={2} />
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-slate-900">{scene.name}</div>
                        <div className="mt-1 text-[13px] leading-snug text-slate-500">{scene.tagline}</div>
                      </div>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ring-1 ${statusStyle[scene.status]}`}
                    >
                      {statusLabel[scene.status]}
                    </span>
                  </div>
                  <div className="relative mt-5 flex flex-wrap gap-2">
                    {scene.capabilities.map(c => (
                      <span
                        key={c.key}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-slate-50/80 px-2.5 py-1 text-[11px] font-medium text-slate-600"
                      >
                        <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-emerald-500" strokeWidth={2} />
                        {c.label}
                      </span>
                    ))}
                  </div>
                  <div className="relative mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4 text-[12px]">
                    <span className="text-slate-400">
                      卡片 <span className="font-medium text-slate-600">{scene.cardPalette.length}</span>
                      <span className="mx-1.5 text-slate-300">·</span>
                      策略 <span className="font-medium text-slate-600">{scene.strategyPages.length}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                      进入配置
                      <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
