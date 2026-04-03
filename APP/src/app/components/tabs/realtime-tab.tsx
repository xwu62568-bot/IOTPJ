import { useState } from 'react';
import {
  Thermometer, Droplets, Wind, Sun, Gauge, Zap, TrendingUp, TrendingDown,
  Activity, Waves, Beaker, BarChart3, Link2, ChevronRight
} from 'lucide-react';
import {
  sensors, devices, realtimeData, paramCardDefs, realtimeDisplayBindings, controlStrategies,
  type RealtimeDisplayBinding, type SensorData, type SensorMetric,
} from '../../data/mock-data';
import { LinkageStrategy } from '../config/linkage-strategy';

type ConfigPage = null | string; // paramKey

const iconMap: Record<string, any> = {
  thermometer: Thermometer,
  droplets: Droplets,
  wind: Wind,
  sun: Sun,
  gauge: Gauge,
  zap: Zap,
  waves: Waves,
  flask: Beaker,
};

// Compute VPD from temp & humidity
function calcVPD(temp: number, humidity: number): { leaf: number; air: number } {
  const svp = 0.6108 * Math.exp((17.27 * temp) / (temp + 237.3));
  const avp = svp * (humidity / 100);
  const leafTemp = temp - 2;
  const svpLeaf = 0.6108 * Math.exp((17.27 * leafTemp) / (leafTemp + 237.3));
  return { leaf: Math.round((svpLeaf - avp) * 100) / 100, air: Math.round((svp - avp) * 100) / 100 };
}

function resolveMetric(sensor: SensorData, paramKey: string): SensorMetric | undefined {
  return sensor.metrics.find(metric => metric.paramKey === paramKey);
}

function formatAggregatedValue(value: number) {
  if (Number.isInteger(value)) return String(value);
  return value.toFixed(value < 10 ? 2 : 1).replace(/\.?0+$/, '');
}

function resolveDisplayBinding(binding: RealtimeDisplayBinding) {
  const sourceSensors = binding.sensorIds
    .map(sensorId => sensors.find(sensor => sensor.id === sensorId))
    .filter((sensor): sensor is SensorData => Boolean(sensor));

  const available = sourceSensors
    .filter(sensor => sensor.online)
    .map(sensor => ({ sensor, metric: resolveMetric(sensor, binding.paramKey) }))
    .filter((item): item is { sensor: SensorData; metric: SensorMetric } => Boolean(item.metric && item.metric.value !== '--'));

  if (available.length === 0) return null;

  if (binding.aggregation === 'single') {
    const primary = available.find(item => item.sensor.id === binding.primarySensorId) || available[0];
    return {
      value: primary.metric.value,
      unit: primary.metric.unit,
      sensorName: primary.sensor.name,
    };
  }

  const numericValues = available
    .map(item => Number(item.metric.value))
    .filter(value => !Number.isNaN(value));

  if (numericValues.length === 0) return null;

  const aggregated = binding.aggregation === 'avg'
    ? numericValues.reduce((sum, value) => sum + value, 0) / numericValues.length
    : binding.aggregation === 'max'
      ? Math.max(...numericValues)
      : Math.min(...numericValues);

  return {
    value: formatAggregatedValue(aggregated),
    unit: available[0]?.metric.unit || '',
    sensorName: `${available.length} 个传感器${binding.aggregation === 'avg' ? '平均值' : binding.aggregation === 'max' ? '最大值' : '最小值'}`,
  };
}

export function RealtimeTab({ onSubPageChange }: { onSubPageChange?: (inSub: boolean) => void }) {
  const [configPage, setConfigPage] = useState<ConfigPage>(null);

  const goToConfig = (page: string) => {
    setConfigPage(page);
    onSubPageChange?.(true);
  };
  const goBack = () => {
    setConfigPage(null);
    onSubPageChange?.(false);
  };

  // Build active parameter cards from explicit realtime display bindings.
  const activeParams = new Map<string, { value: string; unit: string; sensorName: string }>();
  realtimeDisplayBindings.forEach(binding => {
    const resolved = resolveDisplayBinding(binding);
    if (resolved) {
      activeParams.set(binding.paramKey, resolved);
    }
  });

  // Always compute VPD if temp and humidity are available
  const tempData = activeParams.get('temperature');
  const humData = activeParams.get('humidity');
  let vpdData: { leaf: number; air: number } | null = null;
  if (tempData && humData && tempData.value !== '--' && humData.value !== '--') {
    vpdData = calcVPD(parseFloat(tempData.value), parseFloat(humData.value));
  }

  const strategyMap = new Map(controlStrategies.map(strategy => [strategy.paramKey, strategy]));

  // Linkage strategy page
  if (configPage) {
    const paramDef = paramCardDefs.find(p => p.key === configPage);
    const value = configPage === 'vpd'
      ? (vpdData ? String(vpdData.leaf) : '--')
      : (activeParams.get(configPage)?.value || '--');
    const unit = paramDef?.unit || '';

    return (
      <LinkageStrategy
        paramKey={configPage}
        paramLabel={paramDef?.label || configPage}
        currentValue={value}
        unit={unit}
        onBack={goBack}
      />
    );
  }

  // Group cards: environment, substrate/nutrient, power
  const envKeys = ['temperature', 'humidity', 'co2', 'vpd', 'light', 'par', 'pressure'];
  const substrateKeys = ['soilTemp', 'soilHumidity', 'waterTemp', 'waterLevel', 'ec', 'ph'];

  const envCards = paramCardDefs.filter(p => envKeys.includes(p.key) && (p.key === 'vpd' ? vpdData : activeParams.has(p.key)));
  const substrateCards = paramCardDefs.filter(p => substrateKeys.includes(p.key) && activeParams.has(p.key));
  const hasMeter = devices.some(d => d.type === 'meter');

  return (
    <div className="space-y-4">
      {/* Environment section */}
      {envCards.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-2 px-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[12px] text-gray-500">环境参数</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {envCards.map(card => {
              let value: string;
              let subValue: string | null = null;
              const isVPD = card.key === 'vpd';

              if (isVPD && vpdData) {
                value = String(vpdData.leaf);
                subValue = String(vpdData.air);
              } else {
                const d = activeParams.get(card.key);
                value = d?.value || '--';
              }

              const hasLink = card.hasLinkage && strategyMap.has(card.key);
              const rd = (realtimeData as any)[card.key];
              const alarm = rd?.alarm;
              const isAlarm = rd?.status === 'alarm';
              const IconComp = iconMap[card.icon] || Gauge;

              return (
                <button
                  key={card.key}
                  onClick={() => hasLink ? goToConfig(card.key) : undefined}
                  className={`rounded-2xl p-4 text-left relative overflow-hidden shadow-sm transition-all ${
                    isAlarm ? 'bg-red-50 border border-red-200' : 'bg-white'
                  } ${hasLink ? 'active:scale-[0.98]' : ''}`}
                >
                  {alarm && (
                    <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
                      {alarm}
                    </span>
                  )}
                  <div className="flex items-center justify-between mb-1.5">
                    <IconComp className={`w-5 h-5 ${card.color}`} />
                    {hasLink && (
                      <div className="flex items-center gap-0.5 text-[9px] text-gray-300">
                        <Link2 className="w-2.5 h-2.5" />
                        <ChevronRight className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </div>
                  <div className="text-[11px] text-gray-400">{card.label}</div>
                  <div className={`text-[22px] mt-0.5 ${isAlarm ? 'text-red-600' : 'text-gray-800'}`}>
                    {value}
                    <span className="text-[12px] ml-0.5">{card.unit}</span>
                  </div>
                  {isVPD && subValue && (
                    <div className="text-[11px] text-gray-400 mt-0.5">
                      空气 {subValue} {card.unit}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Substrate / Nutrient section */}
      {substrateCards.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-2 px-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
            <span className="text-[12px] text-gray-500">基质与营养液</span>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="grid grid-cols-3 gap-2">
              {substrateCards.map(card => {
                const d = activeParams.get(card.key);
                const hasLink = card.hasLinkage && strategyMap.has(card.key);
                return (
                  <button
                    key={card.key}
                    onClick={() => hasLink ? goToConfig(card.key) : undefined}
                    className={`${card.bgColor} rounded-xl p-2.5 text-center relative ${hasLink ? 'active:scale-[0.97]' : ''}`}
                  >
                    <div className="text-[10px] text-gray-400">{card.label}</div>
                    <div className={`text-[16px] ${card.color}`}>
                      {d?.value || '--'}
                      <span className="text-[9px] ml-0.5">{card.unit}</span>
                    </div>
                    {hasLink && (
                      <Link2 className="w-2.5 h-2.5 text-gray-300 absolute top-1.5 right-1.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Energy monitoring */}
      {hasMeter && (
        <div>
          <div className="flex items-center gap-1.5 mb-2 px-1">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
            <span className="text-[12px] text-gray-500">电能监控</span>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="bg-purple-50 rounded-lg p-2 text-center">
                <div className="text-[10px] text-gray-400">总功率</div>
                <div className="text-[16px] text-purple-600">8.24<span className="text-[9px]"> kW</span></div>
              </div>
              <div className="bg-blue-50 rounded-lg p-2 text-center">
                <div className="text-[10px] text-gray-400">今日用电</div>
                <div className="text-[16px] text-blue-600">96.5<span className="text-[9px]"> kWh</span></div>
              </div>
              <div className="bg-orange-50 rounded-lg p-2 text-center">
                <div className="text-[10px] text-gray-400">本月用电</div>
                <div className="text-[16px] text-orange-600">2,840<span className="text-[9px]"> kWh</span></div>
              </div>
            </div>
            {devices.filter(d => d.type === 'meter').map(meter => (
              <div key={meter.id} className="bg-gray-50 rounded-xl p-3 mb-2 last:mb-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-purple-500" />
                    <span className="text-[12px]">{meter.name}</span>
                  </div>
                  <span className="text-[10px] text-emerald-500 flex items-center gap-0.5">
                    <Activity className="w-2.5 h-2.5" /> 正常
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  <div className="text-center">
                    <div className="text-[9px] text-gray-400">电压</div>
                    <div className="text-[12px] text-blue-600">{meter.voltage || '--'}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[9px] text-gray-400">电流</div>
                    <div className="text-[12px] text-emerald-600">{meter.current || '--'}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[9px] text-gray-400">功率</div>
                    <div className="text-[12px] text-purple-600">{meter.power || '--'}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[9px] text-gray-400">功率因数</div>
                    <div className="text-[12px] text-gray-600">{meter.powerFactor || '--'}</div>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between mt-3 px-1">
              <div className="flex items-center gap-1 text-[11px] text-emerald-600">
                <TrendingDown className="w-3 h-3" /> 较昨日 -5.2%
              </div>
              <div className="flex items-center gap-1 text-[11px] text-orange-500">
                <TrendingUp className="w-3 h-3" /> 较上月 +3.8%
              </div>
              <span className="text-[10px] text-gray-400">累计 12,456 kWh</span>
            </div>
          </div>
        </div>
      )}

      {/* No sensors hint */}
      {envCards.length === 0 && substrateCards.length === 0 && (
        <div className="text-center py-16">
          <BarChart3 className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-[14px] text-gray-400">暂无传感器数据</p>
          <p className="text-[12px] text-gray-300 mt-1">请在「传感器」标签页中添加传感器</p>
        </div>
      )}
    </div>
  );
}
