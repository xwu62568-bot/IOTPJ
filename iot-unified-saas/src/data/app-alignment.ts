/**
 * 与 APP/src/app 对齐的常量：paramKey、联动策略、LinkageStrategy 模块。
 */

/** mock-data controlStrategies 中存在的 paramKey（进入 LinkageStrategy 页） */
export const CONTROL_STRATEGY_PARAM_KEYS = [
  'temperature',
  'humidity',
  'co2',
  'light',
  'vpd',
  'soilHumidity',
  'waterLevel',
] as const;

export type ControlStrategyParamKey = (typeof CONTROL_STRATEGY_PARAM_KEYS)[number];

export function hasControlStrategy(paramKey: string): paramKey is ControlStrategyParamKey {
  return (CONTROL_STRATEGY_PARAM_KEYS as readonly string[]).includes(paramKey);
}

/** 与 mock-data linkageTemplates 一致 */
export const linkageLabels: Record<
  ControlStrategyParamKey,
  {
    label: string;
    description: string;
    upLabel: string;
    downLabel: string;
    unit: string;
    /** 与 APP LinkageStrategy strategyUiCopy.rangeTitle 一致 */
    rangeTitle: string;
  }
> = {
  temperature: {
    label: '温度联动',
    description: '多级降温/加温控制策略',
    upLabel: '降温',
    downLabel: '加温',
    unit: '℃',
    rangeTitle: '温控目标区间',
  },
  humidity: {
    label: '湿度联动',
    description: '除湿/加湿控制策略',
    upLabel: '除湿',
    downLabel: '加湿',
    unit: '%',
    rangeTitle: '湿度目标区间',
  },
  co2: {
    label: 'CO₂联动',
    description: 'CO₂浓度补充与排放控制',
    upLabel: '排放',
    downLabel: '补充',
    unit: 'PPM',
    rangeTitle: '浓度目标区间',
  },
  light: {
    label: '光照联动',
    description: '补光与遮阳控制策略',
    upLabel: '遮阳',
    downLabel: '补光',
    unit: 'μmol',
    rangeTitle: '光照目标区间',
  },
  vpd: {
    label: 'VPD联动',
    description: 'VPD蒸腾压差控制，综合温湿度调节',
    upLabel: '降低VPD(加湿)',
    downLabel: '升高VPD(除湿)',
    unit: 'kPa',
    rangeTitle: 'VPD 目标区间',
  },
  soilHumidity: {
    label: '灌溉联动',
    description: '基质湿度驱动灌溉控制',
    upLabel: '停止灌溉',
    downLabel: '启动灌溉',
    unit: '%',
    rangeTitle: '灌溉控制区间',
  },
  waterLevel: {
    label: '液位联动',
    description: '营养液液位控制',
    upLabel: '停止补水',
    downLabel: '启动补水',
    unit: 'm',
    rangeTitle: '液位控制区间',
  },
};

/** 与 APP linkage-strategy.tsx strategyUiCopy 完全一致 */
export const linkageStrategyUiCopy: Record<
  ControlStrategyParamKey,
  {
    rangeTitle: string;
    targetLabel: string;
    upperOffsetLabel: string;
    lowerOffsetLabel: string;
    feedbackTitle: string;
    feedbackHint: string;
    deviceTitle: string;
    deviceEmptyText: string;
    deviceHint: string;
  }
> = {
  temperature: {
    rangeTitle: '温控目标区间',
    targetLabel: '目标温度',
    upperOffsetLabel: '上偏移',
    lowerOffsetLabel: '下偏移',
    feedbackTitle: '温度反馈传感器',
    feedbackHint: '选择参与本策略反馈控制的温度测点。',
    deviceTitle: '温控执行设备',
    deviceEmptyText: '还没有配置温控执行设备',
    deviceHint: '请绑定风机、开窗、湿帘或其他温控执行设备。',
  },
  humidity: {
    rangeTitle: '湿度目标区间',
    targetLabel: '目标湿度',
    upperOffsetLabel: '上偏移',
    lowerOffsetLabel: '下偏移',
    feedbackTitle: '湿度反馈传感器',
    feedbackHint: '选择参与本策略反馈控制的湿度测点。',
    deviceTitle: '湿度执行设备',
    deviceEmptyText: '还没有配置湿度执行设备',
    deviceHint: '请绑定加湿器、除湿机或通风设备。',
  },
  co2: {
    rangeTitle: '浓度目标区间',
    targetLabel: '目标浓度',
    upperOffsetLabel: '上偏移',
    lowerOffsetLabel: '下偏移',
    feedbackTitle: '浓度反馈传感器',
    feedbackHint: '选择用于 CO₂ 补气与排气控制的浓度测点。',
    deviceTitle: '补气/排气设备',
    deviceEmptyText: '还没有配置 CO₂ 执行设备',
    deviceHint: '请绑定 CO₂ 电磁阀、新风或排气设备。',
  },
  light: {
    rangeTitle: '光照目标区间',
    targetLabel: '目标光照',
    upperOffsetLabel: '上偏移',
    lowerOffsetLabel: '下偏移',
    feedbackTitle: '光照反馈传感器',
    feedbackHint: '选择用于补光与遮阳控制的光照测点。',
    deviceTitle: '补光/遮阳设备',
    deviceEmptyText: '还没有配置补光或遮阳设备',
    deviceHint: '请绑定补光灯或遮阳执行设备。',
  },
  vpd: {
    rangeTitle: 'VPD 目标区间',
    targetLabel: '目标 VPD',
    upperOffsetLabel: '上偏移',
    lowerOffsetLabel: '下偏移',
    feedbackTitle: '',
    feedbackHint: '',
    deviceTitle: 'VPD 调节设备',
    deviceEmptyText: '还没有配置 VPD 调节设备',
    deviceHint: '请绑定加湿、除湿、湿帘或通风设备。',
  },
  soilHumidity: {
    rangeTitle: '灌溉控制区间',
    targetLabel: '目标含水率',
    upperOffsetLabel: '上偏移',
    lowerOffsetLabel: '下偏移',
    feedbackTitle: '基质反馈传感器',
    feedbackHint: '选择用于灌溉控制的基质湿度测点。',
    deviceTitle: '灌溉执行设备',
    deviceEmptyText: '还没有配置灌溉执行设备',
    deviceHint: '请绑定灌溉泵、电磁阀等灌溉设备。',
  },
  waterLevel: {
    rangeTitle: '液位控制区间',
    targetLabel: '目标液位',
    upperOffsetLabel: '上偏移',
    lowerOffsetLabel: '下偏移',
    feedbackTitle: '液位反馈传感器',
    feedbackHint: '选择用于补液控制的液位测点。',
    deviceTitle: '补液执行设备',
    deviceEmptyText: '还没有配置补液执行设备',
    deviceHint: '请绑定补水阀、配肥泵等补液设备。',
  },
};

/** 与 APP mock-data 中各 strategy day.setpoint 一致（用于预览） */
export const linkageDemoSetpoints: Record<
  ControlStrategyParamKey,
  { target: number; upperOffset: number; lowerOffset: number; hysteresis: number }
> = {
  temperature: { target: 24, upperOffset: 2, lowerOffset: 2, hysteresis: 1 },
  humidity: { target: 65, upperOffset: 5, lowerOffset: 7, hysteresis: 3 },
  co2: { target: 900, upperOffset: 150, lowerOffset: 120, hysteresis: 50 },
  light: { target: 650, upperOffset: 200, lowerOffset: 150, hysteresis: 80 },
  vpd: { target: 0.9, upperOffset: 0.25, lowerOffset: 0.2, hysteresis: 0.1 },
  soilHumidity: { target: 70, upperOffset: 5, lowerOffset: 10, hysteresis: 3 },
  waterLevel: { target: 0.5, upperOffset: 0.08, lowerOffset: 0.1, hysteresis: 0.03 },
};

export function demoCurrentReading(paramKey: ControlStrategyParamKey): string {
  switch (paramKey) {
    case 'temperature':
      return '24.5';
    case 'humidity':
      return '62.0';
    case 'co2':
      return '620';
    case 'light':
      return '380';
    case 'vpd':
      return '0.95';
    case 'soilHumidity':
      return '68';
    case 'waterLevel':
      return '0.45';
    default:
      return '--';
  }
}
