import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import {
  Activity,
  BarChart3,
  Building2,
  ClipboardList,
  LayoutPanelLeft,
  Layers,
  Package,
  Shield,
  Sparkles,
  Zap,
} from 'lucide-react';

export type NavKey =
  | 'scenes'
  | 'studio'
  | 'reports'
  | 'devices'
  | 'telemetry'
  | 'rules'
  | 'projects'
  | 'access'
  | 'audit';

type NavItem = { key: NavKey; label: string; hint: string; icon: LucideIcon };

const navGroups: { title: string; items: NavItem[] }[] = [
  {
    title: '场景与业务',
    items: [
      { key: 'scenes', label: '场景中心', hint: '场景包与能力', icon: Layers },
      { key: 'studio', label: '场景配置', hint: '实时页 · 联动策略', icon: LayoutPanelLeft },
    ],
  },
  {
    title: '编排与交付',
    items: [{ key: 'reports', label: '报表与导出', hint: '订阅 · 导出 · 对标', icon: BarChart3 }],
  },
  {
    title: '平台内核',
    items: [
      { key: 'devices', label: '设备与物模型', hint: '接入 · 型号 · 拓扑', icon: Package },
      { key: 'telemetry', label: '时序与点位', hint: '测点 · 质量 · 聚合', icon: Activity },
      { key: 'rules', label: '规则与自动化', hint: '告警 · 联动 · 编排', icon: Zap },
      { key: 'projects', label: '租户与项目', hint: '组织 · 配额 · 配置', icon: Building2 },
      { key: 'access', label: '权限与数据域', hint: 'RBAC · 数据域', icon: Shield },
      { key: 'audit', label: '审计与合规', hint: '留痕 · 举证', icon: ClipboardList },
    ],
  },
];

export function AppShell({
  active,
  onNavigate,
  children,
}: {
  active: NavKey;
  onNavigate: (k: NavKey) => void;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen flex text-slate-900">
      <aside className="flex w-60 shrink-0 flex-col border-r border-white/60 bg-white/75 shadow-[var(--shadow-sidebar)] backdrop-blur-xl">
        <div className="relative overflow-hidden border-b border-slate-200/60 px-4 py-5">
          <div className="pointer-events-none absolute -right-8 -top-12 h-32 w-32 rounded-full bg-emerald-400/15 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-8 -left-6 h-24 w-24 rounded-full bg-violet-400/10 blur-2xl" />
          <div className="relative flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/25">
              <Sparkles className="h-5 w-5" strokeWidth={2} />
            </div>
            <div className="min-w-0 pt-0.5">
              <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-600/90">IoT SaaS</div>
              <div className="mt-0.5 text-[15px] font-semibold leading-tight text-slate-900">统一平台</div>
              <p className="mt-1 text-[11px] leading-snug text-slate-500">Demo · 全模块导航与边界</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 min-h-0 space-y-5 overflow-y-auto px-2.5 py-4">
          {navGroups.map(group => (
            <div key={group.title}>
              <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400/90">
                {group.title}
              </div>
              <div className="space-y-1">
                {group.items.map(item => {
                  const Icon = item.icon;
                  const isOn = active === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => onNavigate(item.key)}
                      className={`group w-full rounded-xl px-3 py-2.5 text-left transition-all duration-200 ${
                        isOn
                          ? 'bg-gradient-to-r from-emerald-50 to-teal-50/50 text-emerald-950 shadow-sm ring-1 ring-emerald-200/60'
                          : 'text-slate-600 hover:bg-slate-50/90 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span
                          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                            isOn
                              ? 'bg-white text-emerald-600 shadow-sm ring-1 ring-emerald-100'
                              : 'bg-slate-100/80 text-slate-500 group-hover:bg-white group-hover:text-slate-700 group-hover:ring-1 group-hover:ring-slate-200/80'
                          }`}
                        >
                          <Icon className="h-4 w-4" strokeWidth={2} />
                        </span>
                        <span className="min-w-0">
                          <span className={`block text-[13px] font-semibold leading-tight ${isOn ? 'text-emerald-950' : ''}`}>
                            {item.label}
                          </span>
                          <span className="mt-0.5 block text-[11px] leading-snug text-slate-500">{item.hint}</span>
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        <div className="shrink-0 border-t border-slate-200/60 bg-slate-50/50 px-3 py-3">
          <p className="text-center text-[10px] leading-relaxed text-slate-400">不接真实设备 · 架构演示</p>
        </div>
      </aside>
      <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-auto bg-transparent">{children}</main>
    </div>
  );
}
