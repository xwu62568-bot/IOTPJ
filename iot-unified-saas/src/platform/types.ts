/**
 * 平台内核类型（跨场景）— Demo 级，便于对齐全局能力边界。
 */

export type TenantId = string;
export type ProjectId = string;
export type DeviceId = string;
export type PointId = string;

/** 物模型属性 / 测点（时序数据锚点） */
export interface DataPoint {
  id: PointId;
  key: string;
  label: string;
  unit?: string;
  kind: 'telemetry' | 'attribute' | 'computed';
}

export interface DeviceModelRef {
  modelKey: string;
  version: string;
}

export interface Device {
  id: DeviceId;
  name: string;
  projectId: ProjectId;
  model: DeviceModelRef;
  online: boolean;
  points: DataPoint[];
}

/** 规则/告警在真实系统中独立服务；此处仅表达与卡片、策略的关联键 */
export interface RuleRef {
  id: string;
  name: string;
  bindsToCardKeys: string[];
}

export type PermissionScope = 'tenant' | 'project' | 'device';

export interface RoleTemplate {
  key: string;
  label: string;
  scopes: PermissionScope[];
}

/** 实时页上一张卡片的逻辑定义（平台侧元数据） */
export type CardCategory = 'metric' | 'control' | 'composite' | 'energy' | 'custom';

/**
 * 与 APP `paramCardDefs.key` 一致；`energy` 为实时页「电能监控」整块。
 */
export type CardType =
  | 'temperature'
  | 'humidity'
  | 'co2'
  | 'vpd'
  | 'light'
  | 'par'
  | 'pressure'
  | 'soilTemp'
  | 'soilHumidity'
  | 'waterTemp'
  | 'waterLevel'
  | 'ec'
  | 'ph'
  | 'energy';

export interface CardDefinition {
  type: CardType;
  title: string;
  unit: string;
  /** APP lucide 图标名 */
  icon: string;
  /** Tailwind 颜色类（与 APP paramCardDef 一致） */
  colorClass: string;
  bgClass: string;
  alarmBgClass: string;
  category: CardCategory;
  defaultMetricKeys: string[];
  /** APP: hasLinkage */
  hasLinkage: boolean;
  /** 是否存在 LinkageStrategy（controlStrategies） */
  hasLinkageStrategy: boolean;
  /** 根区水肥子区：基质 / 营养液；环境气候、电能无此项 */
  rootNest?: 'medium' | 'solution';
  description: string;
}

export interface CardInstance {
  id: string;
  type: CardType;
  layoutGroup: string;
  /** 与 CardDefinition.rootNest 一致，用于根区排序与预览分栏 */
  rootNest?: 'medium' | 'solution';
  enabled: boolean;
  order: number;
}

export interface PageSchema {
  id: string;
  sceneKey: string;
  name: string;
  pageKey: 'realtime' | 'devices' | 'sensors' | 'settings';
  groups: { key: string; label: string; order: number }[];
  cards: CardInstance[];
}

/**
 * 与 APP `LinkageStrategy` 信息块一一对应（可配置是否展示、顺序）。
 */
export type StrategySectionKind =
  | 'live-value'
  | 'schedule-day-night'
  | 'target-range'
  | 'feedback-sensor'
  | 'vpd-computed-hint'
  | 'execution-linkage'
  | 'linkage-explain';

export interface StrategySectionModule {
  kind: StrategySectionKind;
  label: string;
  description: string;
}

export interface StrategyPageSchema {
  id: string;
  sceneKey: string;
  /** 与 APP paramKey / controlStrategies.paramKey 一致 */
  policyKey: string;
  title: string;
  sections: StrategySectionModule[];
}
