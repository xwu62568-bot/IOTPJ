import type { NavKey } from '../layout/AppShell';

export type PlaceholderNavKey = Exclude<
  NavKey,
  'scenes' | 'studio'
>;

type LayerTag = '中层 · 编排与交付' | '底层 · 平台内核';

const PLACEHOLDER_COPY: Record<
  PlaceholderNavKey,
  {
    title: string;
    layer: LayerTag;
    summary: string;
    bullets: string[];
    codeHints: string[];
  }
> = {
  reports: {
    title: '报表与导出',
    layer: '中层 · 编排与交付',
    summary:
      '跨项目、跨场景的指标汇总、周期订阅、文件导出与对外共享链接。与场景包中的卡片/策略解耦，通过统一数据模型取数。',
    bullets: [
      '看板模板 / 固定报表：绑定租户默认时区与权限过滤',
      '订阅与推送：邮件、Webhook、对象存储落地',
      '导出：CSV / Parquet / PDF（示意），受 RBAC 与数据域约束',
      '能效、产量等业务对标报表由各场景插件声明指标映射',
    ],
    codeHints: ['src/platform/types.ts（报表契约可扩展）', '各 ScenePackage.capabilities ↔ 报表维度映射（未接线）'],
  },
  devices: {
    title: '设备与物模型',
    layer: '底层 · 平台内核',
    summary:
      '设备档案、物模型版本、接入协议适配、在线状态与子设备拓扑。场景侧的卡片与策略通过点位 key 绑定到物模型属性。',
    bullets: [
      '型号库：属性 / 事件 / 服务定义与版本迁移',
      '接入：MQTT / HTTP / 网关子设备（Demo 无真实连接）',
      '影子设备：期望态 / 上报态对齐、批量固件（占位）',
      '与「时序与点位」共享 PointId 命名空间',
    ],
    codeHints: ['src/platform/types.ts · Device, DeviceModelRef, DataPoint', '设备列表 UI 未实现'],
  },
  telemetry: {
    title: '时序与点位',
    layer: '底层 · 平台内核',
    summary:
      '测点注册、采样策略、降采样与冷热分层、数据质量标记。\n实时页卡片与告警规则均引用同一套点位抽象。',
    bullets: [
      '点位：遥测 / 属性 / 计算量（与 CardDefinition.defaultMetricKeys 对齐思路）',
      '查询：最近值、区间聚合、插值（由统一查询服务承载，Demo 用 greenhouse-demo 静态值）',
      '多租户隔离：项目级数据域 + 行级权限过滤',
      '流式规则输入：规则引擎消费时序 Topic（占位）',
    ],
    codeHints: ['src/platform/types.ts · DataPoint', 'src/data/greenhouse-demo.ts · 演示遥测'],
  },
  rules: {
    title: '规则与自动化',
    layer: '底层 · 平台内核',
    summary:
      '阈值告警、防抖、联动动作、场景级自动化与工作流。平台输出 Alarm / Command，\nAPP 侧「联动策略」为其中一类面向用户的配置面。',
    bullets: [
      '规则类型：越限、变化率、组合条件、计划窗口',
      '动作：通知、写下行、触发场景策略、打开工单（占位）',
      '与策略配置：Linkage 为可视化策略壳，底层可映射到规则 DSL',
      '仿真与回放：沙箱环境验证（未实现）',
    ],
    codeHints: ['src/platform/types.ts · RuleRef（示意）', '真实 RuleEngine 服务边界未接线'],
  },
  projects: {
    title: '租户与项目',
    layer: '底层 · 平台内核',
    summary:
      '租户、组织、项目空间、资源配额与Feature Flag。场景包在项目内启用，\n默认页面 / 策略模板可按项目覆盖。',
    bullets: [
      '租户：订阅套餐、地域、计费账户（占位）',
      '项目：设备归属、数据留存、场景启用列表',
      '配置分层：平台默认 → 租户 → 项目 → 运行时草稿（与当前 Demo 草稿态一致）',
      '多项目切换：导航与数据域切换（未实现 UI）',
    ],
    codeHints: ['TenantId, ProjectId in src/platform/types.ts', 'CFG 存储未实现'],
  },
  access: {
    title: '权限与数据域',
    layer: '底层 · 平台内核',
    summary:
      'RBAC、数据域（设备/项目/自定义分组）、行列级权限与字段脱敏。\n所有配置类 API 与导出均需走统一鉴权中间件。',
    bullets: [
      '角色模板：租户管理员、项目编辑、只读、外协（占位）',
      '数据域：按项目 / 设备分组 / 标签过滤可访问点位',
      '与场景：场景中心仅展示当前主体有权安装的包',
      '审计联动：敏感操作二次确认与理由（占位）',
    ],
    codeHints: ['src/platform/types.ts · RoleTemplate, PermissionScope', '细粒度策略引擎未实现'],
  },
  audit: {
    title: '审计与合规',
    layer: '底层 · 平台内核',
    summary:
      '配置变更、登录、数据导出、规则启停等操作的不可篡改日志与检索。\n满足等保/ISO 等外审时举证需求（本 Demo 仅架构位）。',
    bullets: [
      '记录维度：谁 / 何时 / 何地 / 对何种资源 / 旧值新值',
      '留存与合规：按租户策略归档（占位）',
      '导出：签名的审计包（占位）',
      '与 SSO / IdP 登录事件关联（占位）',
    ],
    codeHints: ['审计流水存储与 WORM 未实现', '可对接 SIEM Webhook'],
  },
};

export function PlatformModulePlaceholder({ nav }: { nav: PlaceholderNavKey }) {
  const c = PLACEHOLDER_COPY[nav];

  return (
    <div className="relative px-4 py-8 sm:px-8 sm:py-10">
      <div className="pointer-events-none absolute right-0 top-24 h-48 w-48 rounded-full bg-violet-200/20 blur-3xl" />
      <div className="relative mx-auto max-w-3xl">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center rounded-full bg-gradient-to-r from-slate-100 to-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200/90">
            {c.layer}
          </span>
          <span className="text-[11px] font-medium text-slate-400">模块骨架</span>
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">{c.title}</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-slate-600 whitespace-pre-line">{c.summary}</p>

        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-[var(--shadow-card)] ring-1 ring-white/60 backdrop-blur-sm">
          <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500" />
          <div className="p-6 sm:p-7">
            <div className="text-[13px] font-bold text-slate-800">能力边界（示意）</div>
            <ul className="mt-4 space-y-3 text-[14px] text-slate-600">
              {c.bullets.map((b, i) => (
                <li key={i} className="flex gap-3 leading-snug">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-dashed border-slate-300/80 bg-slate-50/60 p-5 ring-1 ring-slate-100/80">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">代码 / 类型锚点</div>
          <ul className="mt-3 space-y-2 text-[13px] text-slate-700">
            {c.codeHints.map((line, i) => (
              <li key={i} className="font-mono text-[12px] leading-relaxed">
                {line}
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-8 text-[13px] leading-relaxed text-slate-500">
          本页仅为<strong className="text-slate-700">平台模块完整性</strong>占位，不含真实表单与接口；落地时可按上述边界拆分服务与 OpenAPI。
        </p>
      </div>
    </div>
  );
}

export function isPlaceholderNav(nav: NavKey): nav is PlaceholderNavKey {
  return nav !== 'scenes' && nav !== 'studio';
}
