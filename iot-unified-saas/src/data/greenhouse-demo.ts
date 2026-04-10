import type { CardType } from '../platform/types';

/** 与 APP mock-data realtimeData 一致的展示值 */
export const demoTelemetry: Record<string, { value: string; sub?: string; unit: string; alarm?: 'L' | 'H' }> = {
  temperature: { value: '24.5', unit: '℃' },
  humidity: { value: '62.0', unit: '%' },
  co2: { value: '620', unit: 'PPM' },
  light: { value: '585', unit: 'lux' },
  par: { value: '380', unit: 'μmol' },
  pressure: { value: '1013', unit: 'hPa' },
  soilTemp: { value: '20.3', unit: '℃' },
  soilHumidity: { value: '68', unit: '%' },
  waterTemp: { value: '22.5', unit: '℃' },
  waterLevel: { value: '0.45', unit: 'm' },
  ec: { value: '1.8', unit: 'mS/cm' },
  ph: { value: '6.2', unit: '' },
};

export function calcVPDLeafAir(temp: number, humidity: number): { leaf: string; air: string } {
  const svp = 0.6108 * Math.exp((17.27 * temp) / (temp + 237.3));
  const avp = svp * (humidity / 100);
  const leafTemp = temp - 2;
  const svpLeaf = 0.6108 * Math.exp((17.27 * leafTemp) / (leafTemp + 237.3));
  const leaf = Math.round((svpLeaf - avp) * 100) / 100;
  const air = Math.round((svp - avp) * 100) / 100;
  return { leaf: String(leaf), air: String(air) };
}

/** 顶条强调色：与 APP 告警时用红底不同，Demo 用左侧色条 + 文字色 */
export function cardAccent(type: CardType): { bar: string; value: string } {
  switch (type) {
    case 'temperature':
      return { bar: 'bg-red-500', value: 'text-gray-800' };
    case 'humidity':
      return { bar: 'bg-blue-500', value: 'text-gray-800' };
    case 'co2':
      return { bar: 'bg-amber-500', value: 'text-gray-800' };
    case 'vpd':
      return { bar: 'bg-purple-500', value: 'text-gray-800' };
    case 'light':
      return { bar: 'bg-yellow-500', value: 'text-gray-800' };
    case 'par':
      return { bar: 'bg-orange-500', value: 'text-orange-600' };
    case 'pressure':
      return { bar: 'bg-gray-400', value: 'text-gray-700' };
    case 'soilTemp':
      return { bar: 'bg-orange-500', value: 'text-orange-600' };
    case 'soilHumidity':
      return { bar: 'bg-lime-500', value: 'text-lime-700' };
    case 'waterTemp':
      return { bar: 'bg-cyan-500', value: 'text-cyan-600' };
    case 'waterLevel':
      return { bar: 'bg-cyan-600', value: 'text-cyan-700' };
    case 'ec':
      return { bar: 'bg-emerald-500', value: 'text-emerald-600' };
    case 'ph':
      return { bar: 'bg-indigo-500', value: 'text-indigo-600' };
    case 'energy':
      return { bar: 'bg-purple-500', value: 'text-purple-700' };
    default:
      return { bar: 'bg-emerald-500', value: 'text-emerald-700' };
  }
}
