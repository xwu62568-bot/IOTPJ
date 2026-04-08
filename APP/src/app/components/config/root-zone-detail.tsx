import { ArrowLeft, Beaker, ChevronRight, Droplets, Gauge, Thermometer, Waves } from 'lucide-react';

type RootZoneKey = 'soilTemp' | 'soilHumidity' | 'waterTemp' | 'waterLevel' | 'ec' | 'ph';

interface RootZoneDetailMeta {
  title: string;
  subtitle: string;
  icon: typeof Thermometer;
  iconColor: string;
  badge: string;
  idealRange: string;
  sceneSummary: string;
  diagnosisTitle: string;
  diagnosisText: string;
  recommendationTitle: string;
  recommendations: string[];
  strategyLabel?: string;
}

const rootZoneMeta: Record<RootZoneKey, RootZoneDetailMeta> = {
  soilTemp: {
    title: '根区温度',
    subtitle: '用于判断根系活性、吸收效率和基质热环境。',
    icon: Thermometer,
    iconColor: 'text-orange-500',
    badge: '根区基质',
    idealRange: '18 ~ 24 ℃',
    sceneSummary: '根区温度偏低会降低根系活性，偏高则容易导致根压下降和烂根风险。',
    diagnosisTitle: '现场判断',
    diagnosisText: '适合作为根区健康监测参数，通常与灌溉水温、棚内温度和基质湿度一起判断。',
    recommendationTitle: '运维建议',
    recommendations: [
      '根区温度长期低于 18℃ 时，优先检查灌溉水温和夜间保温。',
      '根区温度高于 24℃ 时，关注基质透气性和液路温升。',
      '建议与基质湿度趋势一起观察，避免高温高湿叠加。',
    ],
  },
  soilHumidity: {
    title: '基质湿度',
    subtitle: '用于灌溉启停判断，是根区控制的核心反馈量。',
    icon: Droplets,
    iconColor: 'text-lime-600',
    badge: '根区基质',
    idealRange: '60 ~ 75 %',
    sceneSummary: '基质湿度决定灌溉节奏和根系供水状态，过低易失水，过高易缺氧。',
    diagnosisTitle: '现场判断',
    diagnosisText: '一般作为灌溉策略的反馈源，需要结合液位、EC 和灌溉时长一起校正。',
    recommendationTitle: '运维建议',
    recommendations: [
      '苗期或高蒸腾时段可适当提高目标含水率。',
      '若湿度恢复慢，优先检查滴灌流量和阀门动作。',
      '连续高湿时应检查排液和基质透气情况。',
    ],
    strategyLabel: '灌溉策略配置',
  },
  waterTemp: {
    title: '营养液温度',
    subtitle: '反映根区液路热环境，影响溶氧和根系吸收。',
    icon: Thermometer,
    iconColor: 'text-cyan-500',
    badge: '营养液回路',
    idealRange: '18 ~ 22 ℃',
    sceneSummary: '营养液温度过高会降低溶氧，过低会抑制根系吸收和生长速度。',
    diagnosisTitle: '现场判断',
    diagnosisText: '应结合回液温差、环境温度和循环时间一起看，判断是否存在液路升温。',
    recommendationTitle: '运维建议',
    recommendations: [
      '液温超过 24℃ 时，建议检查水箱保温和循环泵发热。',
      '液温偏低时，注意避免夜间冷液直灌根区。',
      '可结合 EC、pH 波动判断根区吸收是否稳定。',
    ],
  },
  waterLevel: {
    title: '营养液液位',
    subtitle: '用于判断补液时机，避免断液和泵空转。',
    icon: Waves,
    iconColor: 'text-cyan-600',
    badge: '营养液回路',
    idealRange: '0.40 ~ 0.58 m',
    sceneSummary: '液位过低会影响灌溉连续性，过高则可能导致补液逻辑失效或溢流风险。',
    diagnosisTitle: '现场判断',
    diagnosisText: '通常与补水阀、配肥泵、灌溉频次和回液量一起联动判断。',
    recommendationTitle: '运维建议',
    recommendations: [
      '液位持续下降时优先检查补液阀、补水泵和管路堵塞。',
      '频繁触发补液时，建议复核灌溉计划和回液损耗。',
      '低液位告警应与灌溉策略做联锁，防止泵空转。',
    ],
    strategyLabel: '补液策略配置',
  },
  ec: {
    title: 'EC',
    subtitle: '反映营养液浓度，关系到水肥供应强度。',
    icon: Beaker,
    iconColor: 'text-emerald-500',
    badge: '营养液回路',
    idealRange: '1.5 ~ 2.2 mS/cm',
    sceneSummary: 'EC 偏低代表肥浓不足，偏高则可能导致盐分压力和根系吸收受阻。',
    diagnosisTitle: '现场判断',
    diagnosisText: '应结合作物阶段、辐射强度、回液 EC 与灌溉频次综合判断，不宜只看单点值。',
    recommendationTitle: '运维建议',
    recommendations: [
      '高温强光阶段可适当下调 EC，避免根区渗透压过高。',
      '回液 EC 高于供液 EC 时，要关注蒸发损失和灌溉不足。',
      'EC 波动大时，检查配肥泵比例和混肥均匀性。',
    ],
  },
  ph: {
    title: 'pH',
    subtitle: '反映营养液酸碱平衡，影响元素有效性。',
    icon: Gauge,
    iconColor: 'text-indigo-500',
    badge: '营养液回路',
    idealRange: '5.5 ~ 6.5',
    sceneSummary: 'pH 偏离推荐区间后，会直接影响 Ca、Fe、P 等元素吸收效率。',
    diagnosisTitle: '现场判断',
    diagnosisText: '应结合 EC、补液配方和作物缺素症状一起判断，不建议只根据单次波动调整。',
    recommendationTitle: '运维建议',
    recommendations: [
      'pH 持续偏高时，优先检查原水碱度和酸液投加比例。',
      'pH 持续偏低时，注意避免酸液过量和母液配置偏差。',
      '建议同时观察回液 pH，判断根区吸收与缓冲状态。',
    ],
  },
};

export function RootZoneDetail({
  paramKey,
  paramLabel,
  currentValue,
  unit,
  sensorName,
  onBack,
  onOpenStrategy,
}: {
  paramKey: RootZoneKey;
  paramLabel: string;
  currentValue: string;
  unit: string;
  sensorName?: string;
  onBack: () => void;
  onOpenStrategy?: () => void;
}) {
  const meta = rootZoneMeta[paramKey];
  const Icon = meta.icon;

  return (
    <div className="space-y-4 -m-4 p-4 pb-24">
      <div className="flex items-center gap-3 mb-2">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <h3 className="text-[16px] truncate">{paramLabel}</h3>
          <p className="text-[11px] text-gray-400 truncate">{meta.subtitle}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[12px] text-gray-400 mb-1">当前实时值</div>
            <div className="text-[28px] text-gray-900">
              {currentValue}
              <span className="text-[14px] ml-1">{unit}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="px-2.5 py-1 rounded-full bg-gray-100 text-[10px] text-gray-500">{meta.badge}</span>
            <Icon className={`w-5 h-5 ${meta.iconColor}`} />
          </div>
        </div>
        <div className="mt-3 bg-gray-50 rounded-xl p-3 text-[12px] text-gray-600">
          数据来源：<span className="text-gray-800">{sensorName || '当前显示传感器'}</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-gray-700">推荐控制区间</span>
          <span className="text-[12px] text-emerald-600">{meta.idealRange}</span>
        </div>
        <div className="bg-emerald-50 rounded-xl p-3 text-[12px] text-emerald-700">
          {meta.sceneSummary}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
        <div className="text-[13px] text-gray-700">{meta.diagnosisTitle}</div>
        <div className="text-[12px] leading-5 text-gray-500">{meta.diagnosisText}</div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
        <div className="text-[13px] text-gray-700">{meta.recommendationTitle}</div>
        <div className="space-y-2">
          {meta.recommendations.map(item => (
            <div key={item} className="bg-gray-50 rounded-xl p-3 text-[12px] text-gray-600 leading-5">
              {item}
            </div>
          ))}
        </div>
      </div>

      {onOpenStrategy && meta.strategyLabel && (
        <button
          onClick={onOpenStrategy}
          className="w-full bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between text-left"
        >
          <div>
            <div className="text-[13px] text-gray-800">{meta.strategyLabel}</div>
            <div className="text-[11px] text-gray-400 mt-0.5">进入自动控制与执行设备配置</div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300" />
        </button>
      )}
    </div>
  );
}
