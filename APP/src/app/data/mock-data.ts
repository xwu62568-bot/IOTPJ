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

export interface SensorData {
  id: string;
  name: string;
  model: string;
  online: boolean;
  metrics: { label: string; value: string; unit: string }[];
  lastUpdate: string;
}

export interface Device {
  id: string;
  name: string;
  type: 'dry-contact' | 'meter';
  online: boolean;
  lastReport: string;
  ports?: DryContactPort[];
  totalPorts?: number;
  meterId?: string; // associated meter id
  // meter fields
  voltage?: string;
  current?: string;
  power?: string;
  energy?: string;
  powerFactor?: string;
  associatedDevices?: string[]; // associated dry-contact device ids
}

export interface DryContactPort {
  id: number;
  name: string;
  type: string;
  status: boolean;
  configured: boolean;
  meterId?: string; // associated meter for energy collection
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
    totalPorts: 12, meterId: 'd3',
    ports: [
      { id: 1, name: '补光灯-1', type: '灯', status: true, configured: true, meterId: 'd3' },
      { id: 2, name: '补光灯-2', type: '灯', status: true, configured: true, meterId: 'd3' },
      { id: 3, name: '排风阀-A', type: '阀', status: false, configured: true },
      { id: 4, name: '循环泵-1', type: '泵', status: true, configured: true },
      { id: 5, name: '灌溉阀-1', type: '阀', status: false, configured: true },
      { id: 6, name: '灌溉阀-2', type: '阀', status: false, configured: true },
      { id: 7, name: '', type: '', status: false, configured: false },
      { id: 8, name: '', type: '', status: false, configured: false },
      { id: 9, name: '', type: '', status: false, configured: false },
      { id: 10, name: '', type: '', status: false, configured: false },
      { id: 11, name: '', type: '', status: false, configured: false },
      { id: 12, name: '', type: '', status: false, configured: false },
    ]
  },
  {
    id: 'd2', name: 'BCB-08-DCF', type: 'dry-contact', online: true, lastReport: '2026-03-20 14:28',
    totalPorts: 12,
    ports: [
      { id: 1, name: 'CO₂电磁阀', type: '阀', status: false, configured: true },
      { id: 2, name: '加热器', type: '灯', status: false, configured: true },
      { id: 3, name: '搅拌泵', type: '泵', status: true, configured: true },
      { id: 4, name: '', type: '', status: false, configured: false },
      { id: 5, name: '', type: '', status: false, configured: false },
      { id: 6, name: '', type: '', status: false, configured: false },
      { id: 7, name: '', type: '', status: false, configured: false },
      { id: 8, name: '', type: '', status: false, configured: false },
      { id: 9, name: '', type: '', status: false, configured: false },
      { id: 10, name: '', type: '', status: false, configured: false },
      { id: 11, name: '', type: '', status: false, configured: false },
      { id: 12, name: '', type: '', status: false, configured: false },
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
      { id: 1, name: '补水阀', type: '阀', status: false, configured: true },
      { id: 2, name: '配肥泵', type: '泵', status: false, configured: true },
      { id: 3, name: '', type: '', status: false, configured: false },
      { id: 4, name: '', type: '', status: false, configured: false },
      { id: 5, name: '', type: '', status: false, configured: false },
      { id: 6, name: '', type: '', status: false, configured: false },
      { id: 7, name: '', type: '', status: false, configured: false },
      { id: 8, name: '', type: '', status: false, configured: false },
      { id: 9, name: '', type: '', status: false, configured: false },
      { id: 10, name: '', type: '', status: false, configured: false },
      { id: 11, name: '', type: '', status: false, configured: false },
      { id: 12, name: '', type: '', status: false, configured: false },
    ]
  },
];

export const sensors: SensorData[] = [
  { id: '25', name: '温湿度CO₂-1', model: 'BLS-4', online: true, lastUpdate: '14:30',
    metrics: [
      { label: 'CO₂', value: '620', unit: 'PPM' },
      { label: '湿度', value: '62.0', unit: '%' },
      { label: '温度', value: '16.9', unit: '℃' },
      { label: '光照', value: '585', unit: 'lux' },
    ]
  },
  { id: '24', name: '温湿度CO₂-2', model: 'BLS-4', online: true, lastUpdate: '14:29',
    metrics: [
      { label: 'CO₂', value: '600', unit: 'PPM' },
      { label: '湿度', value: '64.2', unit: '%' },
      { label: '温度', value: '17.1', unit: '℃' },
      { label: '光照', value: '51', unit: 'lux' },
    ]
  },
  { id: '29', name: 'PAR传感器', model: 'BLS-PAR', online: true, lastUpdate: '14:30',
    metrics: [
      { label: 'PPFD', value: '0', unit: 'PPFD' },
    ]
  },
  { id: '30', name: '温湿度CO₂-3', model: 'BLS-4', online: false, lastUpdate: '10:15',
    metrics: [
      { label: 'CO₂', value: '--', unit: 'PPM' },
      { label: '湿度', value: '--', unit: '%' },
      { label: '温度', value: '--', unit: '℃' },
      { label: '光照', value: '--', unit: 'lux' },
    ]
  },
];

export const realtimeData = {
  temperature: { value: 16.9, unit: '℃', alarm: 'L' as const, status: 'alarm' as const },
  humidity: { value: 62.0, unit: '%', alarm: null, status: 'normal' as const },
  co2: { value: 600, unit: 'PPM', alarm: null, status: 'normal' as const },
  vpd: { value: 0.73, value2: 0.61, unit: 'kPa', alarm: 'L' as const, status: 'alarm' as const },
  light: { value: null as number | null, unit: 'PPFD', alarm: null, status: 'offline' as const },
  nutrientPool: {
    ph: 6.2, ec: 1.8, temp: 22.5,
    pipePh: null as number | null, pipeEc: null as number | null, pipeTemp: null as number | null,
    waterLevel: 0.17, substrateHumidity: 68, substrateTemp: 20.3,
  },
};

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