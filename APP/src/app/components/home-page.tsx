import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Search, Plus, Wifi, WifiOff, AlertTriangle, CheckCircle,
  ChevronRight, ChevronDown, ChevronUp
} from 'lucide-react';
import { projects, alarmHistory } from '../data/mock-data';

export function HomePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [alarmsExpanded, setAlarmsExpanded] = useState(false);

  const filtered = projects.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  // Sort alarms: critical first, then warning
  const sortedAlarms = [...alarmHistory].sort((a, b) => {
    const order = { critical: 0, warning: 1 };
    return order[a.level] - order[b.level];
  });
  const visibleAlarms = alarmsExpanded ? sortedAlarms : sortedAlarms.slice(0, 2);

  return (
    <div className="p-4 space-y-4">
      {/* Welcome header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[11px] text-gray-400">2026年3月20日 · 星期五</div>
          <h2 className="text-[20px] mt-0.5">你好，张工程师 👋</h2>
        </div>
        <button onClick={() => navigate('/create-project')} className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Active alarms */}
      {sortedAlarms.length > 0 && (
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-[13px]">最近告警</span>
              <span className="bg-red-100 text-red-600 text-[10px] px-1.5 py-0.5 rounded-full">{sortedAlarms.length}</span>
            </div>
            <button onClick={() => navigate('/messages')} className="text-[11px] text-emerald-600 flex items-center gap-0.5">
              查看全部 <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2">
            {visibleAlarms.map(alarm => (
              <div key={alarm.id} className={`rounded-xl p-3 flex items-center gap-3 ${
                alarm.level === 'critical' ? 'bg-red-50' : 'bg-amber-50'
              }`}>
                <div className={`w-2 h-2 rounded-full shrink-0 ${
                  alarm.level === 'critical' ? 'bg-red-500 animate-pulse' : 'bg-amber-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] truncate">{alarm.project} · {alarm.type}</div>
                  <div className="text-[11px] text-gray-400">当前 {alarm.value} · 阈值 {alarm.threshold}</div>
                </div>
                <span className="text-[10px] text-gray-400 shrink-0">{alarm.time}</span>
              </div>
            ))}
          </div>
          {sortedAlarms.length > 2 && (
            <button
              onClick={() => setAlarmsExpanded(!alarmsExpanded)}
              className="w-full flex items-center justify-center gap-1 text-[11px] text-gray-400 mt-2 pt-2 border-t border-gray-100"
            >
              {alarmsExpanded ? (<>收起 <ChevronUp className="w-3 h-3" /></>) : (<>展开更多 ({sortedAlarms.length - 2}) <ChevronDown className="w-3 h-3" /></>)}
            </button>
          )}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="搜索项目..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white rounded-xl border-none outline-none text-[14px] shadow-sm"
        />
      </div>

      {/* Project list */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-[13px] text-gray-500">项目列表</span>
          <span className="text-[11px] text-gray-400">{filtered.length} 个项目</span>
        </div>
        <div className="space-y-3">
          {filtered.map(project => (
            <button
              key={project.id}
              onClick={() => navigate(`/project/${project.id}`)}
              className="w-full bg-white rounded-2xl p-4 shadow-sm text-left"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-[15px]">{project.name}</h3>
                  <span className="text-[12px] text-gray-400">{project.zoneName}</span>
                </div>
                {project.alarmStatus === 'critical' && (
                  <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-[11px] flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> {project.alarmCount}
                  </span>
                )}
                {project.alarmStatus === 'warning' && (
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-600 rounded-full text-[11px] flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> {project.alarmCount}
                  </span>
                )}
                {project.alarmStatus === 'normal' && (
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded-full text-[11px] flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> 正常
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-[12px] text-gray-500">
                {project.onlineDevices === project.totalDevices ? (
                  <Wifi className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <WifiOff className="w-3.5 h-3.5 text-amber-500" />
                )}
                <span>设备 {project.onlineDevices}/{project.totalDevices} 在线</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}