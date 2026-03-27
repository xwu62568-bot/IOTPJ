import { useState } from 'react';
import {
  ArrowLeft, AlertTriangle, CheckCircle, Clock, Filter,
  ChevronDown, Bell, BellOff, X
} from 'lucide-react';
import { alarmHistory } from '../data/mock-data';

type FilterLevel = 'all' | 'critical' | 'warning';
type FilterStatus = 'all' | 'active' | 'resolved';

interface AlarmItem {
  id: string;
  project: string;
  type: string;
  value: string;
  threshold: string;
  time: string;
  level: 'critical' | 'warning';
  status: 'active' | 'resolved';
  resolvedTime?: string;
}

// Extend mock alarms with status
const allAlarms: AlarmItem[] = [
  ...alarmHistory.map(a => ({ ...a, status: 'active' as const })),
  { id: 'a5', project: 'A2号温室-草莓', type: '湿度过高', value: '92%', threshold: '85%', time: '昨天 16:20', level: 'warning' as const, status: 'resolved' as const, resolvedTime: '昨天 17:05' },
  { id: 'a6', project: 'B2号温室-辣椒', type: '温度过低', value: '8.2℃', threshold: '12℃', time: '昨天 06:15', level: 'critical' as const, status: 'resolved' as const, resolvedTime: '昨天 07:30' },
  { id: 'a7', project: 'A1号温室-番茄', type: '光照不足', value: '120μmol', threshold: '200μmol', time: '3月18日', level: 'warning' as const, status: 'resolved' as const, resolvedTime: '3月18日 10:20' },
];

export function ProjectAlarms({ onBack, projectName }: { onBack: () => void; projectName: string }) {
  const [levelFilter, setLevelFilter] = useState<FilterLevel>('all');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAlarm, setSelectedAlarm] = useState<AlarmItem | null>(null);

  const filtered = allAlarms.filter(a => {
    if (levelFilter !== 'all' && a.level !== levelFilter) return false;
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    return true;
  });

  const activeCount = allAlarms.filter(a => a.status === 'active').length;
  const criticalCount = allAlarms.filter(a => a.level === 'critical' && a.status === 'active').length;

  // Alarm detail view
  if (selectedAlarm) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 -mx-4 -mt-4 px-4 py-3 bg-white shadow-sm">
          <button onClick={() => setSelectedAlarm(null)} className="w-8 h-8 flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-[17px] flex-1">告警详情</h1>
        </div>

        <div className={`rounded-2xl p-4 ${selectedAlarm.level === 'critical' ? 'bg-red-50' : 'bg-amber-50'}`}>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className={`w-5 h-5 ${selectedAlarm.level === 'critical' ? 'text-red-500' : 'text-amber-500'}`} />
            <span className={`text-[14px] ${selectedAlarm.level === 'critical' ? 'text-red-700' : 'text-amber-700'}`}>
              {selectedAlarm.level === 'critical' ? '紧急告警' : '警告'}
            </span>
            <span className={`ml-auto px-2 py-0.5 rounded-full text-[11px] ${
              selectedAlarm.status === 'active'
                ? 'bg-red-100 text-red-600'
                : 'bg-gray-100 text-gray-500'
            }`}>
              {selectedAlarm.status === 'active' ? '未处理' : '已恢复'}
            </span>
          </div>
          <h3 className="text-[16px] text-gray-800 mb-1">{selectedAlarm.type}</h3>
          <p className="text-[13px] text-gray-500">{selectedAlarm.project}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex justify-between text-[13px]">
            <span className="text-gray-400">当前值</span>
            <span className="text-red-600">{selectedAlarm.value}</span>
          </div>
          <div className="h-px bg-gray-100" />
          <div className="flex justify-between text-[13px]">
            <span className="text-gray-400">阈值</span>
            <span>{selectedAlarm.threshold}</span>
          </div>
          <div className="h-px bg-gray-100" />
          <div className="flex justify-between text-[13px]">
            <span className="text-gray-400">触发时间</span>
            <span>{selectedAlarm.time}</span>
          </div>
          {selectedAlarm.resolvedTime && (
            <>
              <div className="h-px bg-gray-100" />
              <div className="flex justify-between text-[13px]">
                <span className="text-gray-400">恢复时间</span>
                <span className="text-emerald-600">{selectedAlarm.resolvedTime}</span>
              </div>
            </>
          )}
        </div>

        {selectedAlarm.status === 'active' && (
          <div className="flex gap-3">
            <button className="flex-1 py-3 rounded-xl border border-gray-200 text-[14px] text-gray-600 flex items-center justify-center gap-1.5">
              <BellOff className="w-4 h-4" /> 静默此告警
            </button>
            <button className="flex-1 py-3 rounded-xl bg-emerald-600 text-white text-[14px] flex items-center justify-center gap-1.5 active:bg-emerald-700">
              <CheckCircle className="w-4 h-4" /> 标记已处理
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 -mx-4 -mt-4 px-4 py-3 bg-white shadow-sm">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-[17px] flex-1">项目告警</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`w-8 h-8 flex items-center justify-center rounded-lg ${showFilters ? 'bg-emerald-100' : ''}`}
        >
          <Filter className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white rounded-xl p-3 shadow-sm text-center">
          <Bell className="w-4 h-4 text-gray-400 mx-auto mb-1" />
          <div className="text-[16px]">{allAlarms.length}</div>
          <div className="text-[10px] text-gray-400">全部</div>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm text-center">
          <AlertTriangle className="w-4 h-4 text-red-500 mx-auto mb-1" />
          <div className="text-[16px] text-red-600">{activeCount}</div>
          <div className="text-[10px] text-gray-400">未处理</div>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm text-center">
          <AlertTriangle className="w-4 h-4 text-red-600 mx-auto mb-1" />
          <div className="text-[16px] text-red-700">{criticalCount}</div>
          <div className="text-[10px] text-gray-400">紧急</div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3 animate-[fadeIn_0.2s_ease]">
          <div>
            <span className="text-[12px] text-gray-400 mb-2 block">告警级别</span>
            <div className="flex gap-2">
              {([['all', '全部'], ['critical', '紧急'], ['warning', '警告']] as const).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setLevelFilter(val)}
                  className={`px-3 py-1.5 rounded-lg text-[12px] transition-all ${
                    levelFilter === val ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className="text-[12px] text-gray-400 mb-2 block">处理状态</span>
            <div className="flex gap-2">
              {([['all', '全部'], ['active', '未处理'], ['resolved', '已恢复']] as const).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setStatusFilter(val)}
                  className={`px-3 py-1.5 rounded-lg text-[12px] transition-all ${
                    statusFilter === val ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Alarm list */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-[14px] text-gray-400">暂无告警记录</p>
          </div>
        ) : (
          filtered.map(alarm => (
            <button
              key={alarm.id}
              onClick={() => setSelectedAlarm(alarm)}
              className={`w-full rounded-2xl p-4 text-left shadow-sm transition-all ${
                alarm.status === 'resolved' ? 'bg-white opacity-70' :
                alarm.level === 'critical' ? 'bg-red-50' : 'bg-amber-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                  alarm.status === 'resolved' ? 'bg-gray-300' :
                  alarm.level === 'critical' ? 'bg-red-500 animate-pulse' : 'bg-amber-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[13px]">{alarm.type}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                      alarm.status === 'resolved' ? 'bg-gray-100 text-gray-400' :
                      alarm.level === 'critical' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {alarm.status === 'resolved' ? '已恢复' : alarm.level === 'critical' ? '紧急' : '警告'}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-400">{alarm.project}</div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[11px] text-gray-400">
                      当前 {alarm.value} · 阈值 {alarm.threshold}
                    </span>
                    <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" /> {alarm.time}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
