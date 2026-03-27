import { useState } from 'react';
import { Thermometer, Droplets, Wind, Sun, Gauge, Zap, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { realtimeData, devices } from '../../data/mock-data';
import { TemperatureConfig } from '../config/temperature-config';
import { Co2Config } from '../config/co2-config';
import { LightConfig } from '../config/light-config';
import { VpdDetail } from '../config/vpd-detail';
import { NutrientPoolConfig } from '../config/nutrient-pool-config';
import { HumidityConfig } from '../config/humidity-config';

type ConfigPage = null | 'temp' | 'co2' | 'light' | 'vpd' | 'nutrient' | 'humidity';

export function RealtimeTab({ onSubPageChange }: { onSubPageChange?: (inSub: boolean) => void }) {
  const [configPage, setConfigPage] = useState<ConfigPage>(null);
  const d = realtimeData;

  const goToConfig = (page: ConfigPage) => {
    setConfigPage(page);
    onSubPageChange?.(true);
  };
  const goBack = () => {
    setConfigPage(null);
    onSubPageChange?.(false);
  };

  if (configPage === 'temp') return <TemperatureConfig onBack={goBack} />;
  if (configPage === 'co2') return <Co2Config onBack={goBack} />;
  if (configPage === 'light') return <LightConfig onBack={goBack} />;
  if (configPage === 'vpd') return <VpdDetail onBack={goBack} />;
  if (configPage === 'nutrient') return <NutrientPoolConfig onBack={goBack} />;
  if (configPage === 'humidity') return <HumidityConfig onBack={goBack} />;

  return (
    <div className="space-y-3">
      {/* Single metric cards - 2 column grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Temperature */}
        <button
          onClick={() => goToConfig('temp')}
          className={`rounded-2xl p-4 text-left relative overflow-hidden ${
            d.temperature.status === 'alarm' ? 'bg-red-50 border border-red-200' : 'bg-white'
          } shadow-sm`}
        >
          {d.temperature.alarm && (
            <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
              {d.temperature.alarm}
            </span>
          )}
          <Thermometer className="w-5 h-5 text-red-500 mb-2" />
          <div className="text-[11px] text-gray-400">温度</div>
          <div className={`text-[24px] mt-1 ${d.temperature.status === 'alarm' ? 'text-red-600' : 'text-gray-800'}`}>
            {d.temperature.value}<span className="text-[14px] ml-0.5">{d.temperature.unit}</span>
          </div>
        </button>

        {/* Humidity */}
        <button onClick={() => goToConfig('humidity')} className="bg-white rounded-2xl p-4 text-left shadow-sm">
          <Droplets className="w-5 h-5 text-blue-500 mb-2" />
          <div className="text-[11px] text-gray-400">湿度</div>
          <div className="text-[24px] text-blue-600 mt-1">
            {d.humidity.value}<span className="text-[14px] ml-0.5">{d.humidity.unit}</span>
          </div>
        </button>

        {/* CO2 */}
        <button onClick={() => goToConfig('co2')} className="bg-white rounded-2xl p-4 text-left shadow-sm">
          <Wind className="w-5 h-5 text-amber-500 mb-2" />
          <div className="text-[11px] text-gray-400">CO₂</div>
          <div className="text-[24px] text-amber-600 mt-1">
            {d.co2.value}<span className="text-[14px] ml-0.5">{d.co2.unit}</span>
          </div>
        </button>

        {/* VPD */}
        <button
          onClick={() => goToConfig('vpd')}
          className={`rounded-2xl p-4 text-left relative overflow-hidden ${
            d.vpd.status === 'alarm' ? 'bg-red-50 border border-red-200' : 'bg-white'
          } shadow-sm`}
        >
          {d.vpd.alarm && (
            <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
              {d.vpd.alarm}
            </span>
          )}
          <Gauge className="w-5 h-5 text-purple-500 mb-2" />
          <div className="text-[11px] text-gray-400">VPD</div>
          <div className={`text-[20px] mt-1 ${d.vpd.status === 'alarm' ? 'text-red-600' : 'text-gray-800'}`}>
            {d.vpd.value}<span className="text-[12px] ml-0.5">/ {d.vpd.value2} {d.vpd.unit}</span>
          </div>
        </button>
      </div>

      {/* Light - full width */}
      <button
        onClick={() => goToConfig('light')}
        className="w-full bg-white rounded-2xl p-4 text-left shadow-sm flex items-center gap-4"
      >
        <Sun className="w-6 h-6 text-yellow-500" />
        <div>
          <div className="text-[11px] text-gray-400">灯光</div>
          <div className="text-[20px] text-gray-400 mt-0.5">
            {d.light.value !== null ? d.light.value : '--'}<span className="text-[14px] ml-1">{d.light.unit}</span>
          </div>
        </div>
      </button>

      {/* Nutrient Pool Composite Card */}
      <button
        onClick={() => goToConfig('nutrient')}
        className="w-full bg-white rounded-2xl p-4 text-left shadow-sm"
      >
        <h4 className="text-[14px] mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          营养池系统
        </h4>
        <div className="space-y-3">
          <div>
            <span className="text-[11px] text-gray-400 block mb-1">营养池</span>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-blue-50 rounded-lg p-2 text-center">
                <div className="text-[10px] text-gray-400">pH</div>
                <div className="text-[16px] text-blue-600">{d.nutrientPool.ph}</div>
              </div>
              <div className="bg-emerald-50 rounded-lg p-2 text-center">
                <div className="text-[10px] text-gray-400">EC</div>
                <div className="text-[16px] text-emerald-600">{d.nutrientPool.ec}<span className="text-[9px]"> mS</span></div>
              </div>
              <div className="bg-orange-50 rounded-lg p-2 text-center">
                <div className="text-[10px] text-gray-400">温度</div>
                <div className="text-[16px] text-orange-600">{d.nutrientPool.temp}<span className="text-[9px]">℃</span></div>
              </div>
            </div>
          </div>
          <div>
            <span className="text-[11px] text-gray-400 block mb-1">管道</span>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <div className="text-[10px] text-gray-400">pH</div>
                <div className="text-[16px] text-gray-400">{d.nutrientPool.pipePh ?? '--'}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <div className="text-[10px] text-gray-400">EC</div>
                <div className="text-[16px] text-gray-400">{d.nutrientPool.pipeEc ?? '--'}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <div className="text-[10px] text-gray-400">温度</div>
                <div className="text-[16px] text-gray-400">{d.nutrientPool.pipeTemp ?? '--'}</div>
              </div>
            </div>
          </div>
          <div>
            <span className="text-[11px] text-gray-400 block mb-1">水位与基质</span>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-cyan-50 rounded-lg p-2 text-center">
                <div className="text-[10px] text-gray-400">水位</div>
                <div className="text-[16px] text-cyan-600">{d.nutrientPool.waterLevel}<span className="text-[9px]">m</span></div>
              </div>
              <div className="bg-lime-50 rounded-lg p-2 text-center">
                <div className="text-[10px] text-gray-400">基质湿度</div>
                <div className="text-[16px] text-lime-600">{d.nutrientPool.substrateHumidity}<span className="text-[9px]">%</span></div>
              </div>
              <div className="bg-orange-50 rounded-lg p-2 text-center">
                <div className="text-[10px] text-gray-400">基质温度</div>
                <div className="text-[16px] text-orange-600">{d.nutrientPool.substrateTemp}<span className="text-[9px]">℃</span></div>
              </div>
            </div>
          </div>
        </div>
      </button>

      {/* Energy Monitoring Cards */}
      <div className="w-full bg-white rounded-2xl p-4 text-left shadow-sm">
        <h4 className="text-[14px] mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-purple-500" />
          电能监控
        </h4>
        {/* Summary row */}
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
        {/* Per-meter breakdown */}
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
        {/* Energy trend hints */}
        <div className="flex items-center justify-between mt-3 px-1">
          <div className="flex items-center gap-1 text-[11px] text-emerald-600">
            <TrendingDown className="w-3 h-3" />
            较昨日 -5.2%
          </div>
          <div className="flex items-center gap-1 text-[11px] text-orange-500">
            <TrendingUp className="w-3 h-3" />
            较上月 +3.8%
          </div>
          <span className="text-[10px] text-gray-400">累计 12,456 kWh</span>
        </div>
      </div>
    </div>
  );
}