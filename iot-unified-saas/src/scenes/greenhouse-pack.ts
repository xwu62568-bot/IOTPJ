import type { ScenePackage } from './types';
import type { CardDefinition, PageSchema, StrategyPageSchema, StrategySectionModule } from '../platform/types';
import { CONTROL_STRATEGY_PARAM_KEYS, linkageLabels, hasControlStrategy } from '../data/app-alignment';

/** 与 APP paramCardDefs 字段对齐（略去设计稿里单独的「复合营养池」卡，APP 为拆开的单指标） */
const greenhouseCards: CardDefinition[] = [
  {
    type: 'temperature',
    title: '温度',
    unit: '℃',
    icon: 'thermometer',
    colorClass: 'text-red-500',
    bgClass: 'bg-red-50',
    alarmBgClass: 'bg-red-500',
    category: 'metric',
    defaultMetricKeys: ['temperature'],
    hasLinkage: true,
    hasLinkageStrategy: true,
    description: '环境空气温度；可进联动策略。',
  },
  {
    type: 'humidity',
    title: '湿度',
    unit: '%',
    icon: 'droplets',
    colorClass: 'text-blue-500',
    bgClass: 'bg-blue-50',
    alarmBgClass: 'bg-blue-500',
    category: 'metric',
    defaultMetricKeys: ['humidity'],
    hasLinkage: true,
    hasLinkageStrategy: true,
    description: '空气湿度；可进联动策略。',
  },
  {
    type: 'co2',
    title: 'CO₂',
    unit: 'PPM',
    icon: 'wind',
    colorClass: 'text-amber-500',
    bgClass: 'bg-amber-50',
    alarmBgClass: 'bg-amber-500',
    category: 'metric',
    defaultMetricKeys: ['co2'],
    hasLinkage: true,
    hasLinkageStrategy: true,
    description: '二氧化碳浓度。',
  },
  {
    type: 'vpd',
    title: 'VPD',
    unit: 'kPa',
    icon: 'gauge',
    colorClass: 'text-purple-500',
    bgClass: 'bg-purple-50',
    alarmBgClass: 'bg-purple-500',
    category: 'metric',
    defaultMetricKeys: ['vpd'],
    hasLinkage: true,
    hasLinkageStrategy: true,
    description: '蒸汽压亏缺（由温湿度计算）。',
  },
  {
    type: 'light',
    title: '光照',
    unit: 'lux',
    icon: 'sun',
    colorClass: 'text-yellow-500',
    bgClass: 'bg-yellow-50',
    alarmBgClass: 'bg-yellow-500',
    category: 'metric',
    defaultMetricKeys: ['light'],
    hasLinkage: true,
    hasLinkageStrategy: true,
    description: '环境光照（lux）。',
  },
  {
    type: 'par',
    title: 'PAR',
    unit: 'μmol',
    icon: 'sun',
    colorClass: 'text-orange-500',
    bgClass: 'bg-orange-50',
    alarmBgClass: 'bg-orange-500',
    category: 'metric',
    defaultMetricKeys: ['par'],
    hasLinkage: true,
    hasLinkageStrategy: false,
    description: '光合有效辐射；APP 侧暂无 controlStrategies 条目。',
  },
  {
    type: 'pressure',
    title: '气压',
    unit: 'hPa',
    icon: 'gauge',
    colorClass: 'text-gray-500',
    bgClass: 'bg-gray-50',
    alarmBgClass: 'bg-gray-500',
    category: 'metric',
    defaultMetricKeys: ['pressure'],
    hasLinkage: false,
    hasLinkageStrategy: false,
    description: '气压，纯展示。',
  },
  {
    type: 'soilTemp',
    title: '基质温度',
    unit: '℃',
    icon: 'thermometer',
    colorClass: 'text-orange-600',
    bgClass: 'bg-orange-50',
    alarmBgClass: 'bg-orange-500',
    category: 'metric',
    defaultMetricKeys: ['soilTemp'],
    rootNest: 'medium',
    hasLinkage: false,
    hasLinkageStrategy: false,
    description: '根区基质温度；APP 先进 RootZoneDetail。',
  },
  {
    type: 'soilHumidity',
    title: '基质湿度',
    unit: '%',
    icon: 'droplets',
    colorClass: 'text-lime-600',
    bgClass: 'bg-lime-50',
    alarmBgClass: 'bg-lime-500',
    category: 'metric',
    defaultMetricKeys: ['soilHumidity'],
    rootNest: 'medium',
    hasLinkage: true,
    hasLinkageStrategy: true,
    description: '基质湿度；可直接进灌溉联动。',
  },
  {
    type: 'waterTemp',
    title: '水温',
    unit: '℃',
    icon: 'thermometer',
    colorClass: 'text-cyan-500',
    bgClass: 'bg-cyan-50',
    alarmBgClass: 'bg-cyan-500',
    category: 'metric',
    defaultMetricKeys: ['waterTemp'],
    rootNest: 'solution',
    hasLinkage: false,
    hasLinkageStrategy: false,
    description: '营养液水温。',
  },
  {
    type: 'waterLevel',
    title: '液位',
    unit: 'm',
    icon: 'waves',
    colorClass: 'text-cyan-600',
    bgClass: 'bg-cyan-50',
    alarmBgClass: 'bg-cyan-500',
    category: 'metric',
    defaultMetricKeys: ['waterLevel'],
    rootNest: 'solution',
    hasLinkage: true,
    hasLinkageStrategy: true,
    description: '营养液液位；可直接进液位联动。',
  },
  {
    type: 'ec',
    title: 'EC',
    unit: 'mS/cm',
    icon: 'zap',
    colorClass: 'text-emerald-500',
    bgClass: 'bg-emerald-50',
    alarmBgClass: 'bg-emerald-500',
    category: 'metric',
    defaultMetricKeys: ['ec'],
    rootNest: 'solution',
    hasLinkage: false,
    hasLinkageStrategy: false,
    description: '电导率。',
  },
  {
    type: 'ph',
    title: 'pH',
    unit: '',
    icon: 'flask',
    colorClass: 'text-indigo-500',
    bgClass: 'bg-indigo-50',
    alarmBgClass: 'bg-indigo-500',
    category: 'metric',
    defaultMetricKeys: ['ph'],
    rootNest: 'solution',
    hasLinkage: false,
    hasLinkageStrategy: false,
    description: '酸碱度。',
  },
  {
    type: 'energy',
    title: '电能监控',
    unit: '',
    icon: 'zap',
    colorClass: 'text-purple-600',
    bgClass: 'bg-purple-50',
    alarmBgClass: 'bg-purple-500',
    category: 'energy',
    defaultMetricKeys: ['power', 'energy'],
    hasLinkage: false,
    hasLinkageStrategy: false,
    description: '总功率、日电量、电表摘要（APP 有电表时出现）。',
  },
];

/** 供温室外的场景包复用（如专业灌溉的墒情/液位策略页模块拼装） */
export function linkageSectionsFor(paramKey: string): StrategySectionModule[] {
  const meta = hasControlStrategy(paramKey) ? linkageLabels[paramKey] : null;
  const base: StrategySectionModule[] = [
    {
      kind: 'live-value',
      label: '当前实时值',
      description: '与 APP 联动页顶部白色卡片一致。',
    },
    {
      kind: 'schedule-day-night',
      label: '时段控制模式',
      description: '与 APP「时段控制模式」卡片：昼夜分档开关 + 白天/夜间 Tab。',
    },
    {
      kind: 'target-range',
      label: meta?.rangeTitle ?? '控制目标区间',
      description: '目标、上/下偏移、回差、控制区间摘要与回差说明（Zap + 绿色提示）。',
    },
  ];

  if (paramKey === 'vpd') {
    base.push({
      kind: 'vpd-computed-hint',
      label: 'VPD 计算说明',
      description: '温湿度计算 VPD，无需单独选反馈探头（紫色提示条）。',
    });
  } else {
    base.push({
      kind: 'feedback-sensor',
      label: '反馈传感器',
      description: '下拉选择参与反馈的传感器（Thermometer 区块）；VPD 页不展示。',
    });
  }

  const up = meta?.upLabel ?? '上越限侧';
  const down = meta?.downLabel ?? '下越限侧';

  base.push(
    {
      kind: 'execution-linkage',
      label: '执行设备',
      description: `高于上界 · ${up}（琥珀）与低于下界 · ${down}（cyan）；端口选择与开/关。`,
    },
    {
      kind: 'linkage-explain',
      label: '动作说明',
      description: '何时动作 / 何时停（灰色列表说明块）。',
    },
  );

  return base;
}

const strategyPages: StrategyPageSchema[] = CONTROL_STRATEGY_PARAM_KEYS.map(key => {
  const link = linkageLabels[key];
  return {
    id: `policy.${key}`,
    sceneKey: 'greenhouse',
    policyKey: key,
    title: link.label,
    sections: linkageSectionsFor(key),
  };
});

const defaultGreenhousePage: PageSchema = {
  id: 'page.greenhouse.realtime.default',
  sceneKey: 'greenhouse',
  name: '项目详情 · 实时',
  pageKey: 'realtime',
  groups: [
    { key: 'climate', label: '环境气候', order: 0 },
    { key: 'rootzone', label: '根区水肥', order: 1 },
    { key: 'energy', label: '电能监控', order: 2 },
  ],
  cards: [
    ...(['temperature', 'humidity', 'co2', 'vpd', 'light', 'par', 'pressure'] as const).map((type, order) => ({
      id: `c-${type}`,
      type,
      layoutGroup: 'climate',
      enabled: true,
      order,
    })),
    {
      id: 'r-soilTemp',
      type: 'soilTemp',
      layoutGroup: 'rootzone',
      rootNest: 'medium',
      enabled: true,
      order: 0,
    },
    {
      id: 'r-soilHumidity',
      type: 'soilHumidity',
      layoutGroup: 'rootzone',
      rootNest: 'medium',
      enabled: true,
      order: 1,
    },
    {
      id: 'r-waterTemp',
      type: 'waterTemp',
      layoutGroup: 'rootzone',
      rootNest: 'solution',
      enabled: true,
      order: 0,
    },
    {
      id: 'r-waterLevel',
      type: 'waterLevel',
      layoutGroup: 'rootzone',
      rootNest: 'solution',
      enabled: true,
      order: 1,
    },
    { id: 'r-ec', type: 'ec', layoutGroup: 'rootzone', rootNest: 'solution', enabled: true, order: 2 },
    { id: 'r-ph', type: 'ph', layoutGroup: 'rootzone', rootNest: 'solution', enabled: true, order: 3 },
    { id: 'e-power', type: 'energy', layoutGroup: 'energy', enabled: true, order: 0 },
  ],
};

export const greenhouseScenePackage: ScenePackage = {
  key: 'greenhouse',
  name: '温室种植',
  tagline: '环境调控、光配方与根区水肥的统一运营入口',
  status: 'active',
  capabilities: [
    { key: 'climate', label: '环境气候' },
    { key: 'lighting', label: '光环境与灯控' },
    { key: 'co2', label: 'CO₂ 管理' },
    { key: 'rootzone', label: '根区 / 营养液' },
    { key: 'energy', label: '电能监控' },
  ],
  cardPalette: greenhouseCards,
  defaultPage: defaultGreenhousePage,
  strategyPages,
};
