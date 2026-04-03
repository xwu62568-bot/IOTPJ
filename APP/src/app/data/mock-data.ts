export interface Project {
  id: string;
  name: string;
  zoneId: string;
  zoneName: string;
  onlineDevices: number;
  totalDevices: number;
  alarmStatus: 'normal' | 'warning' | 'critical';
  alarmCount: number;
}

export interface Zone {
  id: string;
  name: string;
  projectCount: number;
  deviceCount: number;
  alarmCount: number;
  color: string;
}

export interface Message {
  id: string;
  type: 'alarm' | 'system' | 'device' | 'member';
  title: string;
  content: string;
  time: string;
  read: boolean;
  projectName?: string;
}

export interface SensorMetric {
  label: string;
  value: string;
  unit: string;
  paramKey: string; // links to parameter card key
}

export interface SensorData {
  id: string;
  name: string;
  model: string;
  sensorType: SensorPackageType;
  online: boolean;
  metrics: SensorMetric[];
  lastUpdate: string;
  showOnRealtime: boolean; // whether to display on realtime page
}

export type SensorPackageType = 'single-temp' | 'single-humidity' | 'single-co2' | 'single-light' | 'single-par'
  | 'single-soil-temp' | 'single-soil-humidity' | 'single-water-temp' | 'single-level' | 'single-ec' | 'single-ph'
  | 'three-in-one' | 'five-in-one';

export interface SensorTypeOption {
  key: SensorPackageType;
  label: string;
  description: string;
  metrics: string[];
  icon: string;
  category: 'single' | 'combo';
}

export const sensorTypeOptions: SensorTypeOption[] = [
  // Combo sensors
  { key: 'five-in-one', label: '五合一传感器', description: '温度+湿度+CO₂+光照+气压', metrics: ['temperature', 'humidity', 'co2', 'light', 'pressure'], icon: '📡', category: 'combo' },
  { key: 'three-in-one', label: '三合一传感器', description: '温度+湿度+CO₂', metrics: ['temperature', 'humidity', 'co2'], icon: '📟', category: 'combo' },
  // Single sensors
  { key: 'single-temp', label: '温度传感器', description: '环境温度', metrics: ['temperature'], icon: '🌡️', category: 'single' },
  { key: 'single-humidity', label: '湿度传感器', description: '环境湿度', metrics: ['humidity'], icon: '💧', category: 'single' },
  { key: 'single-co2', label: 'CO₂传感器', description: 'CO₂浓度', metrics: ['co2'], icon: '🫧', category: 'single' },
  { key: 'single-light', label: '光照传感器', description: '光照强度', metrics: ['light'], icon: '☀️', category: 'single' },
  { key: 'single-par', label: 'PAR传感器', description: '光合有效辐射', metrics: ['par'], icon: '🔆', category: 'single' },
  { key: 'single-soil-temp', label: '土壤温度传感器', description: '基质/土壤温度', metrics: ['soilTemp'], icon: '🌱', category: 'single' },
  { key: 'single-soil-humidity', label: '土壤湿度传感器', description: '基质/土壤湿度', metrics: ['soilHumidity'], icon: '🪴', category: 'single' },
  { key: 'single-water-temp', label: '水温传感器', description: '营养液水温', metrics: ['waterTemp'], icon: '🌊', category: 'single' },
  { key: 'single-level', label: '液位传感器', description: '营养液液位', metrics: ['waterLevel'], icon: '📏', category: 'single' },
  { key: 'single-ec', label: 'EC传感器', description: '电导率', metrics: ['ec'], icon: '⚡', category: 'single' },
  { key: 'single-ph', label: 'pH传感器', description: '酸碱度', metrics: ['ph'], icon: '🧪', category: 'single' },
];

// Dry contact device types for professional greenhouse
export const dryContactDeviceTypes = [
  { key: 'fill-light', label: '补光灯', icon: '💡', category: '光照' },
  { key: 'fresh-air-fan', label: '新风机', icon: '🌬️', category: '通风' },
  { key: 'rack-fan', label: '种植架循环风扇', icon: '🔄', category: '通风' },
  { key: 'dehumidifier', label: '除湿机', icon: '🏜️', category: '湿度' },
  { key: 'humidifier', label: '加湿器', icon: '💨', category: '湿度' },
  { key: 'co2-generator', label: 'CO₂发生器', icon: '🫧', category: 'CO₂' },
  { key: 'ceiling-fan', label: '吸顶风扇', icon: '🌀', category: '通风' },
  { key: 'floor-blower', label: '地板吹风', icon: '🌊', category: '通风' },
  { key: 'water-pump', label: '水泵', icon: '🔧', category: '灌溉' },
  { key: 'solenoid-valve', label: '电磁阀', icon: '🔩', category: '灌溉' },
  { key: 'inner-shade-motor', label: '内遮阳电机', icon: '🏗️', category: '遮阳' },
  { key: 'outer-shade-motor', label: '外遮阳电机', icon: '☂️', category: '遮阳' },
  { key: 'wet-curtain-pump', label: '湿帘水泵', icon: '🧊', category: '降温' },
  { key: 'push-pull-fan', label: '推拉风机', icon: '🌪️', category: '通风' },
  { key: 'circulation-fan', label: '循环风扇', icon: '♻️', category: '通风' },
  { key: 'window-motor', label: '开窗电机', icon: '🪟', category: '通风' },
  { key: 'roll-film-motor', label: '电动卷膜器', icon: '📜', category: '覆盖' },
  { key: 'inflator-fan', label: '充气风机', icon: '🎈', category: '覆盖' },
] as const;

export type DryContactDeviceType = typeof dryContactDeviceTypes[number]['key'];

// Linkage strategy templates - professional greenhouse control logic
export interface LinkageStage {
  id: string;
  name: string;
  triggerValue: number;
  hysteresis: number;
  delay: number; // seconds
  devices: { deviceId: string; portId: number; portName: string; deviceType: string; action: 'on' | 'off' }[];
  enabled: boolean;
}

export interface LinkageStrategy {
  paramKey: string;
  paramLabel: string;
  enabled: boolean;
  dayNightSplit: boolean;
  dayStages: LinkageStage[];
  nightStages: LinkageStage[];
}

// Professional linkage templates per parameter
export const linkageTemplates: Record<string, { label: string; description: string; upLabel: string; downLabel: string; unit: string; suggestedStages: { name: string; devices: string[]; triggerOffset: number }[] }> = {
  temperature: {
    label: '温度联动',
    description: '多级降温/加温控制策略',
    upLabel: '降温',
    downLabel: '加温',
    unit: '℃',
    suggestedStages: [
      { name: '一级降温-循环风扇', devices: ['circulation-fan', 'ceiling-fan', 'rack-fan'], triggerOffset: 2 },
      { name: '二级降温-自然通风', devices: ['window-motor', 'push-pull-fan', 'fresh-air-fan'], triggerOffset: 4 },
      { name: '三级降温-蒸发降温', devices: ['wet-curtain-pump', 'push-pull-fan'], triggerOffset: 6 },
      { name: '四级降温-遮阳', devices: ['inner-shade-motor', 'outer-shade-motor'], triggerOffset: 8 },
    ],
  },
  humidity: {
    label: '湿度联动',
    description: '除湿/加湿控制策略',
    upLabel: '除湿',
    downLabel: '加湿',
    unit: '%',
    suggestedStages: [
      { name: '一级除湿-通风除湿', devices: ['fresh-air-fan', 'window-motor'], triggerOffset: 5 },
      { name: '二级除湿-机械除湿', devices: ['dehumidifier'], triggerOffset: 10 },
      { name: '加湿-雾化加湿', devices: ['humidifier'], triggerOffset: -10 },
    ],
  },
  co2: {
    label: 'CO₂联动',
    description: 'CO₂浓度补充与排放控制',
    upLabel: '排放',
    downLabel: '补充',
    unit: 'PPM',
    suggestedStages: [
      { name: 'CO₂补充', devices: ['co2-generator'], triggerOffset: -100 },
      { name: 'CO₂排放-通风', devices: ['fresh-air-fan', 'window-motor', 'push-pull-fan'], triggerOffset: 200 },
    ],
  },
  light: {
    label: '光照联动',
    description: '补光与遮阳控制策略',
    upLabel: '遮阳',
    downLabel: '补光',
    unit: 'μmol',
    suggestedStages: [
      { name: '补光', devices: ['fill-light'], triggerOffset: -100 },
      { name: '遮阳', devices: ['inner-shade-motor', 'outer-shade-motor'], triggerOffset: 200 },
    ],
  },
  vpd: {
    label: 'VPD联动',
    description: 'VPD蒸腾压差控制，综合温湿度调节',
    upLabel: '降低VPD(加湿)',
    downLabel: '升高VPD(除湿)',
    unit: 'kPa',
    suggestedStages: [
      { name: 'VPD过高-加湿降温', devices: ['humidifier', 'wet-curtain-pump'], triggerOffset: 0.3 },
      { name: 'VPD过低-除湿通风', devices: ['dehumidifier', 'fresh-air-fan', 'circulation-fan'], triggerOffset: -0.3 },
    ],
  },
  soilHumidity: {
    label: '灌溉联动',
    description: '基质湿度驱动灌溉控制',
    upLabel: '停止灌溉',
    downLabel: '启动灌溉',
    unit: '%',
    suggestedStages: [
      { name: '灌溉启动', devices: ['water-pump', 'solenoid-valve'], triggerOffset: -10 },
    ],
  },
  waterLevel: {
    label: '液位联动',
    description: '营养液液位控制',
    upLabel: '停止补水',
    downLabel: '启动补水',
    unit: 'm',
    suggestedStages: [
      { name: '低液位补水', devices: ['water-pump'], triggerOffset: -0.1 },
    ],
  },
};

// Parameter card definitions for realtime page
export interface ParamCardDef {
  key: string;
  label: string;
  unit: string;
  icon: string;
  color: string;
  bgColor: string;
  alarmColor: string;
  hasLinkage: boolean;
}

export const paramCardDefs: ParamCardDef[] = [
  { key: 'temperature', label: '温度', unit: '℃', icon: 'thermometer', color: 'text-red-500', bgColor: 'bg-red-50', alarmColor: 'bg-red-500', hasLinkage: true },
  { key: 'humidity', label: '湿度', unit: '%', icon: 'droplets', color: 'text-blue-500', bgColor: 'bg-blue-50', alarmColor: 'bg-blue-500', hasLinkage: true },
  { key: 'co2', label: 'CO₂', unit: 'PPM', icon: 'wind', color: 'text-amber-500', bgColor: 'bg-amber-50', alarmColor: 'bg-amber-500', hasLinkage: true },
  { key: 'vpd', label: 'VPD', unit: 'kPa', icon: 'gauge', color: 'text-purple-500', bgColor: 'bg-purple-50', alarmColor: 'bg-purple-500', hasLinkage: true },
  { key: 'light', label: '光照', unit: 'lux', icon: 'sun', color: 'text-yellow-500', bgColor: 'bg-yellow-50', alarmColor: 'bg-yellow-500', hasLinkage: true },
  { key: 'par', label: 'PAR', unit: 'μmol', icon: 'sun', color: 'text-orange-500', bgColor: 'bg-orange-50', alarmColor: 'bg-orange-500', hasLinkage: true },
  { key: 'soilTemp', label: '基质温度', unit: '℃', icon: 'thermometer', color: 'text-orange-600', bgColor: 'bg-orange-50', alarmColor: 'bg-orange-500', hasLinkage: false },
  { key: 'soilHumidity', label: '基质湿度', unit: '%', icon: 'droplets', color: 'text-lime-600', bgColor: 'bg-lime-50', alarmColor: 'bg-lime-500', hasLinkage: true },
  { key: 'waterTemp', label: '水温', unit: '℃', icon: 'thermometer', color: 'text-cyan-500', bgColor: 'bg-cyan-50', alarmColor: 'bg-cyan-500', hasLinkage: false },
  { key: 'waterLevel', label: '液位', unit: 'm', icon: 'waves', color: 'text-cyan-600', bgColor: 'bg-cyan-50', alarmColor: 'bg-cyan-500', hasLinkage: true },
  { key: 'ec', label: 'EC', unit: 'mS/cm', icon: 'zap', color: 'text-emerald-500', bgColor: 'bg-emerald-50', alarmColor: 'bg-emerald-500', hasLinkage: false },
  { key: 'ph', label: 'pH', unit: '', icon: 'flask', color: 'text-indigo-500', bgColor: 'bg-indigo-50', alarmColor: 'bg-indigo-500', hasLinkage: false },
  { key: 'pressure', label: '气压', unit: 'hPa', icon: 'gauge', color: 'text-gray-500', bgColor: 'bg-gray-50', alarmColor: 'bg-gray-500', hasLinkage: false },
];

export interface Device {
  id: string;
  name: string;
  type: 'dry-contact' | 'meter';
  online: boolean;
  lastReport: string;
  ports?: DryContactPort[];
  totalPorts?: number;
  meterId?: string;
  voltage?: string;
  current?: string;
  power?: string;
  energy?: string;
  powerFactor?: string;
  associatedDevices?: string[];
}

export interface DryContactPort {
  id: number;
  name: string;
  type: string;
  deviceType: DryContactDeviceType | '';
  status: boolean;
  configured: boolean;
  meterId?: string;
}

export const projects: Project[] = [
  { id: '1', name: 'A1号温室-番茄', zoneId: '1', zoneName: '东区', onlineDevices: 8, totalDevices: 10, alarmStatus: 'critical', alarmCount: 2 },
  { id: '2', name: 'A2号温室-草莓', zoneId: '1', zoneName: '东区', onlineDevices: 6, totalDevices: 6, alarmStatus: 'normal', alarmCount: 0 },
  { id: '3', name: 'B1号温室-黄瓜', zoneId: '2', zoneName: '西区', onlineDevices: 4, totalDevices: 5, alarmStatus: 'warning', alarmCount: 1 },
  { id: '4', name: 'B2号温室-辣椒', zoneId: '2', zoneName: '西区', onlineDevices: 7, totalDevices: 7, alarmStatus: 'normal', alarmCount: 0 },
  { id: '5', name: 'C1号温室-生菜', zoneId: '3', zoneName: '南区', onlineDevices: 3, totalDevices: 4, alarmStatus: 'warning', alarmCount: 1 },
];

export const zones: Zone[] = [
  { id: '1', name: '东区', projectCount: 2, deviceCount: 16, alarmCount: 2, color: '#3B82F6' },
  { id: '2', name: '西区', projectCount: 2, deviceCount: 12, alarmCount: 1, color: '#10B981' },
  { id: '3', name: '南区', projectCount: 1, deviceCount: 4, alarmCount: 1, color: '#F59E0B' },
];

export const messages: Message[] = [
  { id: '1', type: 'alarm', title: '温度过高告警', content: 'A1号温室温度达到38.5℃，超过设定阈值35℃', time: '5分钟前', read: false, projectName: 'A1号温室-番茄' },
  { id: '2', type: 'alarm', title: 'VPD异常告警', content: 'A1号温室VPD值0.42kPa，低于推荐范围', time: '12分钟前', read: false, projectName: 'A1号温室-番茄' },
  { id: '3', type: 'device', title: '设备离线通知', content: 'B1号温室干接点设备BCB-08离线', time: '1小时前', read: true, projectName: 'B1号温室-黄瓜' },
  { id: '4', type: 'system', title: '固件升级可用', content: '干接点设备固件v2.3.1已发布，建议更新', time: '3小时前', read: true },
  { id: '5', type: 'member', title: '新成员加入', content: '王工程师已加入A2号温室项目', time: '昨天', read: true, projectName: 'A2号温室-草莓' },
  { id: '6', type: 'alarm', title: 'CO₂浓度偏低', content: 'C1号温室CO₂浓度320PPM，低于目标值600PPM', time: '昨天', read: true, projectName: 'C1号温室-生菜' },
];

export const devices: Device[] = [
  {
    id: 'd1', name: 'BCB-16-DCF', type: 'dry-contact', online: true, lastReport: '2026-03-20 14:30',
    totalPorts: 16, meterId: 'd3',
    ports: [
      { id: 1, name: '补光灯-1', type: '灯', deviceType: 'fill-light', status: true, configured: true, meterId: 'd3' },
      { id: 2, name: '补光灯-2', type: '灯', deviceType: 'fill-light', status: true, configured: true, meterId: 'd3' },
      { id: 3, name: '新风机-A', type: '风机', deviceType: 'fresh-air-fan', status: false, configured: true },
      { id: 4, name: '循环风扇-1', type: '风扇', deviceType: 'circulation-fan', status: true, configured: true },
      { id: 5, name: '循环风扇-2', type: '风扇', deviceType: 'circulation-fan', status: true, configured: true },
      { id: 6, name: '除湿机-1', type: '除湿', deviceType: 'dehumidifier', status: false, configured: true },
      { id: 7, name: '内遮阳电机', type: '电机', deviceType: 'inner-shade-motor', status: false, configured: true },
      { id: 8, name: '外遮阳电机', type: '电机', deviceType: 'outer-shade-motor', status: false, configured: true },
      { id: 9, name: '推拉风机-A', type: '风机', deviceType: 'push-pull-fan', status: false, configured: true },
      { id: 10, name: '推拉风机-B', type: '风机', deviceType: 'push-pull-fan', status: false, configured: true },
      { id: 11, name: '湿帘水泵', type: '泵', deviceType: 'wet-curtain-pump', status: false, configured: true },
      { id: 12, name: '开窗电机-A', type: '电机', deviceType: 'window-motor', status: false, configured: true },
      { id: 13, name: '', type: '', deviceType: '', status: false, configured: false },
      { id: 14, name: '', type: '', deviceType: '', status: false, configured: false },
      { id: 15, name: '', type: '', deviceType: '', status: false, configured: false },
      { id: 16, name: '', type: '', deviceType: '', status: false, configured: false },
    ]
  },
  {
    id: 'd2', name: 'BCB-08-DCF', type: 'dry-contact', online: true, lastReport: '2026-03-20 14:28',
    totalPorts: 12,
    ports: [
      { id: 1, name: 'CO₂电磁阀', type: '阀', deviceType: 'co2-generator', status: false, configured: true },
      { id: 2, name: '加湿器-1', type: '加湿', deviceType: 'humidifier', status: false, configured: true },
      { id: 3, name: '水泵-主', type: '泵', deviceType: 'water-pump', status: true, configured: true },
      { id: 4, name: '灌溉阀-A', type: '阀', deviceType: 'solenoid-valve', status: false, configured: true },
      { id: 5, name: '灌溉阀-B', type: '阀', deviceType: 'solenoid-valve', status: false, configured: true },
      { id: 6, name: '吸顶风扇-1', type: '风扇', deviceType: 'ceiling-fan', status: true, configured: true },
      { id: 7, name: '地板吹风-1', type: '风扇', deviceType: 'floor-blower', status: false, configured: true },
      { id: 8, name: '电动卷膜器', type: '电机', deviceType: 'roll-film-motor', status: false, configured: true },
      { id: 9, name: '', type: '', deviceType: '', status: false, configured: false },
      { id: 10, name: '', type: '', deviceType: '', status: false, configured: false },
      { id: 11, name: '', type: '', deviceType: '', status: false, configured: false },
      { id: 12, name: '', type: '', deviceType: '', status: false, configured: false },
    ]
  },
  {
    id: 'd3', name: 'DTSD-3P', type: 'meter', online: true, lastReport: '2026-03-20 14:31',
    voltage: '220.4V', current: '12.5A', power: '8.24kW', energy: '12,456kWh', powerFactor: '0.97',
    associatedDevices: ['d1'],
  },
  {
    id: 'd4', name: 'BCB-12-DCF', type: 'dry-contact', online: false, lastReport: '2026-03-20 10:15',
    totalPorts: 12,
    ports: [
      { id: 1, name: '补水阀', type: '阀', deviceType: 'solenoid-valve', status: false, configured: true },
      { id: 2, name: '配肥泵', type: '泵', deviceType: 'water-pump', status: false, configured: true },
      { id: 3, name: '', type: '', deviceType: '', status: false, configured: false },
      { id: 4, name: '', type: '', deviceType: '', status: false, configured: false },
      { id: 5, name: '', type: '', deviceType: '', status: false, configured: false },
      { id: 6, name: '', type: '', deviceType: '', status: false, configured: false },
      { id: 7, name: '', type: '', deviceType: '', status: false, configured: false },
      { id: 8, name: '', type: '', deviceType: '', status: false, configured: false },
      { id: 9, name: '', type: '', deviceType: '', status: false, configured: false },
      { id: 10, name: '', type: '', deviceType: '', status: false, configured: false },
      { id: 11, name: '', type: '', deviceType: '', status: false, configured: false },
      { id: 12, name: '', type: '', deviceType: '', status: false, configured: false },
    ]
  },
];

export const sensors: SensorData[] = [
  {
    id: '25', name: '温湿度CO₂光照-1', model: 'BLS-5A', sensorType: 'five-in-one', online: true, lastUpdate: '14:30', showOnRealtime: true,
    metrics: [
      { label: '温度', value: '24.5', unit: '℃', paramKey: 'temperature' },
      { label: '湿度', value: '62.0', unit: '%', paramKey: 'humidity' },
      { label: 'CO₂', value: '620', unit: 'PPM', paramKey: 'co2' },
      { label: '光照', value: '585', unit: 'lux', paramKey: 'light' },
      { label: '气压', value: '1013', unit: 'hPa', paramKey: 'pressure' },
    ]
  },
  {
    id: '24', name: '温湿度CO₂-2', model: 'BLS-3A', sensorType: 'three-in-one', online: true, lastUpdate: '14:29', showOnRealtime: false,
    metrics: [
      { label: '温度', value: '25.1', unit: '℃', paramKey: 'temperature' },
      { label: '湿度', value: '64.2', unit: '%', paramKey: 'humidity' },
      { label: 'CO₂', value: '600', unit: 'PPM', paramKey: 'co2' },
    ]
  },
  {
    id: '29', name: 'PAR传感器', model: 'BLS-PAR', sensorType: 'single-par', online: true, lastUpdate: '14:30', showOnRealtime: true,
    metrics: [
      { label: 'PAR', value: '380', unit: 'μmol', paramKey: 'par' },
    ]
  },
  {
    id: '30', name: '温湿度CO₂-3', model: 'BLS-3A', sensorType: 'three-in-one', online: false, lastUpdate: '10:15', showOnRealtime: false,
    metrics: [
      { label: '温度', value: '--', unit: '℃', paramKey: 'temperature' },
      { label: '湿度', value: '--', unit: '%', paramKey: 'humidity' },
      { label: 'CO₂', value: '--', unit: 'PPM', paramKey: 'co2' },
    ]
  },
  {
    id: '31', name: '基质温湿度-1', model: 'BLS-SH', sensorType: 'single-soil-humidity', online: true, lastUpdate: '14:30', showOnRealtime: true,
    metrics: [
      { label: '基质湿度', value: '68', unit: '%', paramKey: 'soilHumidity' },
    ]
  },
  {
    id: '32', name: '基质温度-1', model: 'BLS-ST', sensorType: 'single-soil-temp', online: true, lastUpdate: '14:30', showOnRealtime: true,
    metrics: [
      { label: '基质温度', value: '20.3', unit: '℃', paramKey: 'soilTemp' },
    ]
  },
  {
    id: '33', name: 'EC传感器', model: 'BLS-EC', sensorType: 'single-ec', online: true, lastUpdate: '14:28', showOnRealtime: true,
    metrics: [
      { label: 'EC', value: '1.8', unit: 'mS/cm', paramKey: 'ec' },
    ]
  },
  {
    id: '34', name: 'pH传感器', model: 'BLS-PH', sensorType: 'single-ph', online: true, lastUpdate: '14:28', showOnRealtime: true,
    metrics: [
      { label: 'pH', value: '6.2', unit: '', paramKey: 'ph' },
    ]
  },
  {
    id: '35', name: '液位传感器', model: 'BLS-LV', sensorType: 'single-level', online: true, lastUpdate: '14:30', showOnRealtime: true,
    metrics: [
      { label: '液位', value: '0.45', unit: 'm', paramKey: 'waterLevel' },
    ]
  },
  {
    id: '36', name: '水温传感器', model: 'BLS-WT', sensorType: 'single-water-temp', online: true, lastUpdate: '14:29', showOnRealtime: true,
    metrics: [
      { label: '水温', value: '22.5', unit: '℃', paramKey: 'waterTemp' },
    ]
  },
];

export const realtimeData = {
  temperature: { value: 24.5, unit: '℃', alarm: null as string | null, status: 'normal' as const },
  humidity: { value: 62.0, unit: '%', alarm: null, status: 'normal' as const },
  co2: { value: 620, unit: 'PPM', alarm: null, status: 'normal' as const },
  vpd: { value: 0.95, value2: 0.82, unit: 'kPa', alarm: null, status: 'normal' as const },
  light: { value: 585, unit: 'lux', alarm: null, status: 'normal' as const },
  par: { value: 380, unit: 'μmol', alarm: null, status: 'normal' as const },
  soilTemp: { value: 20.3, unit: '℃', alarm: null, status: 'normal' as const },
  soilHumidity: { value: 68, unit: '%', alarm: null, status: 'normal' as const },
  waterTemp: { value: 22.5, unit: '℃', alarm: null, status: 'normal' as const },
  waterLevel: { value: 0.45, unit: 'm', alarm: null, status: 'normal' as const },
  ec: { value: 1.8, unit: 'mS/cm', alarm: null, status: 'normal' as const },
  ph: { value: 6.2, unit: '', alarm: null, status: 'normal' as const },
  pressure: { value: 1013, unit: 'hPa', alarm: null, status: 'normal' as const },
};

export type SensorAggregationMode = 'single' | 'avg' | 'max' | 'min';

export interface RealtimeDisplayBinding {
  id: string;
  paramKey: string;
  label: string;
  aggregation: SensorAggregationMode;
  sensorIds: string[];
  primarySensorId?: string;
  fallbackSensorIds?: string[];
}

export interface StrategySourceBinding {
  aggregation: SensorAggregationMode;
  sensorIds: string[];
  primarySensorId?: string;
  excludeOffline: boolean;
  fallbackSensorIds?: string[];
}

export interface StrategySetpoint {
  target: number;
  upperOffset: number;
  lowerOffset: number;
  hysteresis: number;
  delaySeconds: number;
}

export interface StrategyAction {
  id: string;
  deviceId: string;
  portId: number;
  portName: string;
  deviceType: string;
  action: 'on' | 'off';
  durationSeconds?: number;
  order: number;
}

export interface StrategyStageDefinition {
  id: string;
  name: string;
  triggerWhen: 'above' | 'below';
  triggerValue: number;
  recoverValue: number;
  delaySeconds: number;
  parallel: boolean;
  enabled: boolean;
  actions: StrategyAction[];
}

export interface StrategyInterlock {
  id: string;
  type: 'mutex' | 'requires' | 'inhibit';
  label: string;
  description: string;
}

export interface StrategyPeriodConfig {
  label: string;
  setpoint: StrategySetpoint;
  stages: StrategyStageDefinition[];
}

export interface ControlStrategyDefinition {
  id: string;
  paramKey: string;
  name: string;
  description: string;
  enabled: boolean;
  priority: number;
  displayBindingId?: string;
  sourceBinding: StrategySourceBinding;
  dayNightSplit: boolean;
  day: StrategyPeriodConfig;
  night: StrategyPeriodConfig;
  interlocks: StrategyInterlock[];
}

export const realtimeDisplayBindings: RealtimeDisplayBinding[] = [
  {
    id: 'display-temperature',
    paramKey: 'temperature',
    label: '实时温度显示',
    aggregation: 'single',
    sensorIds: ['25', '24'],
    primarySensorId: '25',
    fallbackSensorIds: ['24'],
  },
  {
    id: 'display-humidity',
    paramKey: 'humidity',
    label: '实时湿度显示',
    aggregation: 'single',
    sensorIds: ['25', '24'],
    primarySensorId: '25',
    fallbackSensorIds: ['24'],
  },
  {
    id: 'display-co2',
    paramKey: 'co2',
    label: '实时 CO₂ 显示',
    aggregation: 'single',
    sensorIds: ['25', '24'],
    primarySensorId: '25',
    fallbackSensorIds: ['24'],
  },
  {
    id: 'display-light',
    paramKey: 'light',
    label: '实时光照显示',
    aggregation: 'single',
    sensorIds: ['25'],
    primarySensorId: '25',
  },
  {
    id: 'display-par',
    paramKey: 'par',
    label: '实时 PAR 显示',
    aggregation: 'single',
    sensorIds: ['29'],
    primarySensorId: '29',
  },
  {
    id: 'display-pressure',
    paramKey: 'pressure',
    label: '实时气压显示',
    aggregation: 'single',
    sensorIds: ['25'],
    primarySensorId: '25',
  },
  {
    id: 'display-soil-temp',
    paramKey: 'soilTemp',
    label: '实时基质温度显示',
    aggregation: 'single',
    sensorIds: ['32'],
    primarySensorId: '32',
  },
  {
    id: 'display-soil-humidity',
    paramKey: 'soilHumidity',
    label: '实时基质湿度显示',
    aggregation: 'single',
    sensorIds: ['31'],
    primarySensorId: '31',
  },
  {
    id: 'display-water-temp',
    paramKey: 'waterTemp',
    label: '实时水温显示',
    aggregation: 'single',
    sensorIds: ['36'],
    primarySensorId: '36',
  },
  {
    id: 'display-water-level',
    paramKey: 'waterLevel',
    label: '实时液位显示',
    aggregation: 'single',
    sensorIds: ['35'],
    primarySensorId: '35',
  },
  {
    id: 'display-ec',
    paramKey: 'ec',
    label: '实时 EC 显示',
    aggregation: 'single',
    sensorIds: ['33'],
    primarySensorId: '33',
  },
  {
    id: 'display-ph',
    paramKey: 'ph',
    label: '实时 pH 显示',
    aggregation: 'single',
    sensorIds: ['34'],
    primarySensorId: '34',
  },
];

export const controlStrategies: ControlStrategyDefinition[] = [
  {
    id: 'strategy-temperature-climate',
    paramKey: 'temperature',
    name: '温度气候控制',
    description: '根据温度进行分级降温，白天与夜间独立设定。',
    enabled: true,
    priority: 100,
    displayBindingId: 'display-temperature',
    sourceBinding: {
      aggregation: 'avg',
      sensorIds: ['25', '24'],
      primarySensorId: '25',
      excludeOffline: true,
      fallbackSensorIds: ['25'],
    },
    dayNightSplit: true,
    day: {
      label: '白天',
      setpoint: { target: 24, upperOffset: 2, lowerOffset: 2, hysteresis: 1, delaySeconds: 60 },
      stages: [
        {
          id: 'temp-day-stage-1',
          name: '一级降温',
          triggerWhen: 'above',
          triggerValue: 26,
          recoverValue: 25,
          delaySeconds: 60,
          parallel: true,
          enabled: true,
          actions: [
            { id: 'temp-day-stage-1-act-1', deviceId: 'd1', portId: 4, portName: '循环风扇-1', deviceType: 'circulation-fan', action: 'on', order: 1 },
            { id: 'temp-day-stage-1-act-2', deviceId: 'd2', portId: 6, portName: '吸顶风扇-1', deviceType: 'ceiling-fan', action: 'on', order: 2 },
          ],
        },
        {
          id: 'temp-day-stage-2',
          name: '二级降温',
          triggerWhen: 'above',
          triggerValue: 28,
          recoverValue: 26,
          delaySeconds: 90,
          parallel: true,
          enabled: true,
          actions: [
            { id: 'temp-day-stage-2-act-1', deviceId: 'd1', portId: 3, portName: '新风机-A', deviceType: 'fresh-air-fan', action: 'on', order: 1 },
            { id: 'temp-day-stage-2-act-2', deviceId: 'd1', portId: 12, portName: '开窗电机-A', deviceType: 'window-motor', action: 'on', order: 2 },
          ],
        },
        {
          id: 'temp-day-stage-3',
          name: '三级降温',
          triggerWhen: 'above',
          triggerValue: 30,
          recoverValue: 28,
          delaySeconds: 120,
          parallel: true,
          enabled: true,
          actions: [
            { id: 'temp-day-stage-3-act-1', deviceId: 'd1', portId: 11, portName: '湿帘水泵', deviceType: 'wet-curtain-pump', action: 'on', order: 1 },
            { id: 'temp-day-stage-3-act-2', deviceId: 'd1', portId: 9, portName: '推拉风机-A', deviceType: 'push-pull-fan', action: 'on', order: 2 },
          ],
        },
      ],
    },
    night: {
      label: '夜间',
      setpoint: { target: 22, upperOffset: 2, lowerOffset: 2, hysteresis: 1, delaySeconds: 120 },
      stages: [
        {
          id: 'temp-night-stage-1',
          name: '夜间通风降温',
          triggerWhen: 'above',
          triggerValue: 24,
          recoverValue: 23,
          delaySeconds: 120,
          parallel: false,
          enabled: true,
          actions: [
            { id: 'temp-night-stage-1-act-1', deviceId: 'd1', portId: 3, portName: '新风机-A', deviceType: 'fresh-air-fan', action: 'on', order: 1 },
          ],
        },
      ],
    },
    interlocks: [
      { id: 'temp-lock-1', type: 'requires', label: '湿帘需联动风机', description: '湿帘水泵动作时，必须同时开启至少一台风机。' },
      { id: 'temp-lock-2', type: 'inhibit', label: '夜间禁遮阳', description: '夜间模式下不允许触发遮阳电机。' },
    ],
  },
  {
    id: 'strategy-humidity-climate',
    paramKey: 'humidity',
    name: '湿度调节',
    description: '根据空气湿度进行除湿或加湿控制。',
    enabled: true,
    priority: 90,
    displayBindingId: 'display-humidity',
    sourceBinding: {
      aggregation: 'avg',
      sensorIds: ['25', '24'],
      primarySensorId: '25',
      excludeOffline: true,
      fallbackSensorIds: ['25'],
    },
    dayNightSplit: true,
    day: {
      label: '白天',
      setpoint: { target: 65, upperOffset: 5, lowerOffset: 7, hysteresis: 3, delaySeconds: 90 },
      stages: [
        {
          id: 'humidity-day-stage-1',
          name: '一级除湿',
          triggerWhen: 'above',
          triggerValue: 70,
          recoverValue: 67,
          delaySeconds: 120,
          parallel: true,
          enabled: true,
          actions: [
            { id: 'humidity-day-stage-1-act-1', deviceId: 'd1', portId: 3, portName: '新风机-A', deviceType: 'fresh-air-fan', action: 'on', order: 1 },
          ],
        },
        {
          id: 'humidity-day-stage-2',
          name: '加湿维持',
          triggerWhen: 'below',
          triggerValue: 58,
          recoverValue: 62,
          delaySeconds: 90,
          parallel: false,
          enabled: true,
          actions: [
            { id: 'humidity-day-stage-2-act-1', deviceId: 'd2', portId: 2, portName: '加湿器-1', deviceType: 'humidifier', action: 'on', order: 1 },
          ],
        },
      ],
    },
    night: {
      label: '夜间',
      setpoint: { target: 70, upperOffset: 5, lowerOffset: 8, hysteresis: 3, delaySeconds: 120 },
      stages: [
        {
          id: 'humidity-night-stage-1',
          name: '夜间机械除湿',
          triggerWhen: 'above',
          triggerValue: 76,
          recoverValue: 72,
          delaySeconds: 180,
          parallel: false,
          enabled: true,
          actions: [
            { id: 'humidity-night-stage-1-act-1', deviceId: 'd1', portId: 6, portName: '除湿机-1', deviceType: 'dehumidifier', action: 'on', order: 1 },
          ],
        },
      ],
    },
    interlocks: [
      { id: 'humidity-lock-1', type: 'mutex', label: '加湿/除湿互斥', description: '加湿器与除湿设备不可同时运行。' },
    ],
  },
  {
    id: 'strategy-co2-enrichment',
    paramKey: 'co2',
    name: 'CO₂ 补气',
    description: '按 CO₂ 浓度进行补气，并与通风设备互锁。',
    enabled: true,
    priority: 80,
    displayBindingId: 'display-co2',
    sourceBinding: {
      aggregation: 'avg',
      sensorIds: ['25', '24'],
      primarySensorId: '25',
      excludeOffline: true,
      fallbackSensorIds: ['25'],
    },
    dayNightSplit: false,
    day: {
      label: '全时段',
      setpoint: { target: 900, upperOffset: 150, lowerOffset: 120, hysteresis: 50, delaySeconds: 60 },
      stages: [
        {
          id: 'co2-stage-1',
          name: '补气阶段',
          triggerWhen: 'below',
          triggerValue: 780,
          recoverValue: 860,
          delaySeconds: 60,
          parallel: false,
          enabled: true,
          actions: [
            { id: 'co2-stage-1-act-1', deviceId: 'd2', portId: 1, portName: 'CO₂电磁阀', deviceType: 'co2-generator', action: 'on', durationSeconds: 300, order: 1 },
          ],
        },
      ],
    },
    night: {
      label: '备用',
      setpoint: { target: 900, upperOffset: 150, lowerOffset: 120, hysteresis: 50, delaySeconds: 60 },
      stages: [],
    },
    interlocks: [
      { id: 'co2-lock-1', type: 'mutex', label: '补气与新风互斥', description: 'CO₂ 补气时禁止新风机和开窗动作。' },
    ],
  },
  {
    id: 'strategy-light-photoperiod',
    paramKey: 'light',
    name: '光照补光',
    description: '根据光照强度控制补光设备，并预留遮阳阶段。',
    enabled: true,
    priority: 70,
    displayBindingId: 'display-light',
    sourceBinding: {
      aggregation: 'single',
      sensorIds: ['25'],
      primarySensorId: '25',
      excludeOffline: true,
    },
    dayNightSplit: false,
    day: {
      label: '光照控制',
      setpoint: { target: 650, upperOffset: 200, lowerOffset: 150, hysteresis: 80, delaySeconds: 120 },
      stages: [
        {
          id: 'light-stage-1',
          name: '补光阶段',
          triggerWhen: 'below',
          triggerValue: 500,
          recoverValue: 620,
          delaySeconds: 180,
          parallel: false,
          enabled: true,
          actions: [
            { id: 'light-stage-1-act-1', deviceId: 'd1', portId: 1, portName: '补光灯-1', deviceType: 'fill-light', action: 'on', order: 1 },
            { id: 'light-stage-1-act-2', deviceId: 'd1', portId: 2, portName: '补光灯-2', deviceType: 'fill-light', action: 'on', order: 2 },
          ],
        },
      ],
    },
    night: {
      label: '备用',
      setpoint: { target: 650, upperOffset: 200, lowerOffset: 150, hysteresis: 80, delaySeconds: 120 },
      stages: [],
    },
    interlocks: [
      { id: 'light-lock-1', type: 'inhibit', label: '夜间禁补光', description: '非设定光周期内，不执行补光动作。' },
    ],
  },
  {
    id: 'strategy-vpd-climate',
    paramKey: 'vpd',
    name: 'VPD 协同调节',
    description: 'VPD 由温湿度共同计算，用于综合气候控制。',
    enabled: true,
    priority: 95,
    displayBindingId: 'display-temperature',
    sourceBinding: {
      aggregation: 'avg',
      sensorIds: ['25', '24'],
      primarySensorId: '25',
      excludeOffline: true,
      fallbackSensorIds: ['25'],
    },
    dayNightSplit: true,
    day: {
      label: '白天',
      setpoint: { target: 0.9, upperOffset: 0.25, lowerOffset: 0.2, hysteresis: 0.1, delaySeconds: 90 },
      stages: [
        {
          id: 'vpd-day-stage-1',
          name: 'VPD 过高降 VPD',
          triggerWhen: 'above',
          triggerValue: 1.15,
          recoverValue: 1.0,
          delaySeconds: 120,
          parallel: true,
          enabled: true,
          actions: [
            { id: 'vpd-day-stage-1-act-1', deviceId: 'd2', portId: 2, portName: '加湿器-1', deviceType: 'humidifier', action: 'on', order: 1 },
            { id: 'vpd-day-stage-1-act-2', deviceId: 'd1', portId: 11, portName: '湿帘水泵', deviceType: 'wet-curtain-pump', action: 'on', order: 2 },
          ],
        },
        {
          id: 'vpd-day-stage-2',
          name: 'VPD 过低升 VPD',
          triggerWhen: 'below',
          triggerValue: 0.7,
          recoverValue: 0.82,
          delaySeconds: 120,
          parallel: false,
          enabled: true,
          actions: [
            { id: 'vpd-day-stage-2-act-1', deviceId: 'd1', portId: 6, portName: '除湿机-1', deviceType: 'dehumidifier', action: 'on', order: 1 },
          ],
        },
      ],
    },
    night: {
      label: '夜间',
      setpoint: { target: 0.75, upperOffset: 0.2, lowerOffset: 0.15, hysteresis: 0.08, delaySeconds: 120 },
      stages: [],
    },
    interlocks: [
      { id: 'vpd-lock-1', type: 'mutex', label: 'VPD 正反调节互斥', description: '加湿降 VPD 与除湿升 VPD 不可同时执行。' },
    ],
  },
  {
    id: 'strategy-irrigation-substrate',
    paramKey: 'soilHumidity',
    name: '基质湿度灌溉',
    description: '根据基质湿度触发灌溉与停止灌溉。',
    enabled: true,
    priority: 85,
    displayBindingId: 'display-soil-humidity',
    sourceBinding: {
      aggregation: 'single',
      sensorIds: ['31'],
      primarySensorId: '31',
      excludeOffline: true,
    },
    dayNightSplit: false,
    day: {
      label: '灌溉控制',
      setpoint: { target: 70, upperOffset: 5, lowerOffset: 10, hysteresis: 3, delaySeconds: 30 },
      stages: [
        {
          id: 'soil-stage-1',
          name: '启动灌溉',
          triggerWhen: 'below',
          triggerValue: 60,
          recoverValue: 68,
          delaySeconds: 30,
          parallel: true,
          enabled: true,
          actions: [
            { id: 'soil-stage-1-act-1', deviceId: 'd2', portId: 3, portName: '水泵-主', deviceType: 'water-pump', action: 'on', durationSeconds: 180, order: 1 },
            { id: 'soil-stage-1-act-2', deviceId: 'd2', portId: 4, portName: '灌溉阀-A', deviceType: 'solenoid-valve', action: 'on', durationSeconds: 180, order: 2 },
          ],
        },
      ],
    },
    night: {
      label: '备用',
      setpoint: { target: 70, upperOffset: 5, lowerOffset: 10, hysteresis: 3, delaySeconds: 30 },
      stages: [],
    },
    interlocks: [
      { id: 'soil-lock-1', type: 'inhibit', label: '低液位禁止灌溉', description: '营养液液位过低时，灌溉策略自动抑制。' },
    ],
  },
  {
    id: 'strategy-water-level',
    paramKey: 'waterLevel',
    name: '液位补液',
    description: '低液位时执行补液，高液位停止。',
    enabled: true,
    priority: 88,
    displayBindingId: 'display-water-level',
    sourceBinding: {
      aggregation: 'single',
      sensorIds: ['35'],
      primarySensorId: '35',
      excludeOffline: true,
    },
    dayNightSplit: false,
    day: {
      label: '补液控制',
      setpoint: { target: 0.5, upperOffset: 0.08, lowerOffset: 0.1, hysteresis: 0.03, delaySeconds: 20 },
      stages: [
        {
          id: 'water-level-stage-1',
          name: '低液位补液',
          triggerWhen: 'below',
          triggerValue: 0.4,
          recoverValue: 0.48,
          delaySeconds: 20,
          parallel: false,
          enabled: true,
          actions: [
            { id: 'water-level-stage-1-act-1', deviceId: 'd4', portId: 1, portName: '补水阀', deviceType: 'solenoid-valve', action: 'on', order: 1 },
            { id: 'water-level-stage-1-act-2', deviceId: 'd4', portId: 2, portName: '配肥泵', deviceType: 'water-pump', action: 'on', order: 2 },
          ],
        },
      ],
    },
    night: {
      label: '备用',
      setpoint: { target: 0.5, upperOffset: 0.08, lowerOffset: 0.1, hysteresis: 0.03, delaySeconds: 20 },
      stages: [],
    },
    interlocks: [
      { id: 'water-level-lock-1', type: 'requires', label: '补液需阀泵联动', description: '补液时补水阀和配肥泵必须按顺序联动。' },
    ],
  },
];

export const dashboardSummary = {
  totalProjects: 5,
  onlineDevices: 28,
  totalDevices: 32,
  activeAlarms: 4,
  todayEnergy: 96.5,
  monthEnergy: 2840,
  weather: { temp: 22, humidity: 55, condition: '多云', wind: '东南风 3级' },
};

export const alarmHistory = [
  { id: 'a1', project: 'A1号温室-番茄', type: '温度过高', value: '38.5℃', threshold: '35℃', time: '14:25', level: 'critical' as const },
  { id: 'a2', project: 'A1号温室-番茄', type: 'VPD偏低', value: '0.42kPa', threshold: '0.80kPa', time: '14:18', level: 'warning' as const },
  { id: 'a3', project: 'B1号温室-黄瓜', type: '设备离线', value: 'BCB-08', threshold: '--', time: '13:30', level: 'warning' as const },
  { id: 'a4', project: 'C1号温室-生菜', type: 'CO₂偏低', value: '320PPM', threshold: '600PPM', time: '12:45', level: 'warning' as const },
];

export const energyHistory = [
  { hour: '00', value: 2.1 },
  { hour: '02', value: 1.8 },
  { hour: '04', value: 1.5 },
  { hour: '06', value: 3.2 },
  { hour: '08', value: 5.8 },
  { hour: '10', value: 7.4 },
  { hour: '12', value: 8.2 },
  { hour: '14', value: 8.5 },
  { hour: '16', value: 7.1 },
  { hour: '18', value: 5.3 },
  { hour: '20', value: 3.8 },
  { hour: '22', value: 2.5 },
];
