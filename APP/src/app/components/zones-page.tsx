import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Plus, ChevronRight, AlertTriangle, Wifi, WifiOff, Edit, Trash2, CheckCircle, MapPin, LayoutGrid } from 'lucide-react';
import { zones, projects } from '../data/mock-data';

export function ZonesPage() {
  const navigate = useNavigate();
  const [expandedZone, setExpandedZone] = useState<string | null>(null);

  const totalDevices = zones.reduce((s, z) => s + z.deviceCount, 0);
  const totalAlarms = zones.reduce((s, z) => s + z.alarmCount, 0);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[20px]">分区管理</h2>
        <button onClick={() => navigate('/create-zone')} className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Zone summary */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white rounded-xl p-3 shadow-sm text-center">
          <LayoutGrid className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
          <div className="text-[16px] text-gray-800">{zones.length}</div>
          <div className="text-[10px] text-gray-400">分区</div>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm text-center">
          <MapPin className="w-4 h-4 text-blue-500 mx-auto mb-1" />
          <div className="text-[16px] text-gray-800">{totalDevices}</div>
          <div className="text-[10px] text-gray-400">总设备</div>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm text-center">
          <AlertTriangle className="w-4 h-4 text-red-500 mx-auto mb-1" />
          <div className="text-[16px] text-red-600">{totalAlarms}</div>
          <div className="text-[10px] text-gray-400">告警</div>
        </div>
      </div>

      {/* Zone list */}
      <div className="space-y-3">
        {zones.map(zone => {
          const expanded = expandedZone === zone.id;
          const zoneProjects = projects.filter(p => p.zoneId === zone.id);
          return (
            <div key={zone.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <button
                onClick={() => setExpandedZone(expanded ? null : zone.id)}
                className="w-full p-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-[14px]" style={{ backgroundColor: zone.color }}>
                    {zone.name[0]}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[15px]">{zone.name}</h3>
                    <div className="flex gap-3 text-[12px] text-gray-400 mt-0.5">
                      <span>{zone.projectCount} 项目</span>
                      <span>{zone.deviceCount} 设备</span>
                      {zone.alarmCount > 0 && (
                        <span className="text-red-500 flex items-center gap-0.5">
                          <AlertTriangle className="w-3 h-3" />{zone.alarmCount}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={e => { e.stopPropagation(); }}
                      className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center"
                    >
                      <Edit className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                    <ChevronRight className={`w-4 h-4 text-gray-300 transition-transform ${expanded ? 'rotate-90' : ''}`} />
                  </div>
                </div>
              </button>
              {expanded && (
                <div className="px-4 pb-3 space-y-2">
                  {zoneProjects.map(p => (
                    <button
                      key={p.id}
                      onClick={() => navigate(`/project/${p.id}`)}
                      className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl text-left"
                    >
                      <div className="flex-1">
                        <div className="text-[13px]">{p.name}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] text-gray-400 flex items-center gap-0.5">
                            {p.onlineDevices === p.totalDevices ? (
                              <Wifi className="w-2.5 h-2.5 text-emerald-500" />
                            ) : (
                              <WifiOff className="w-2.5 h-2.5 text-amber-500" />
                            )}
                            {p.onlineDevices}/{p.totalDevices}
                          </span>
                          {p.alarmStatus === 'critical' && (
                            <span className="text-[10px] text-red-500 flex items-center gap-0.5">
                              <AlertTriangle className="w-2.5 h-2.5" /> {p.alarmCount}
                            </span>
                          )}
                          {p.alarmStatus === 'warning' && (
                            <span className="text-[10px] text-amber-500 flex items-center gap-0.5">
                              <AlertTriangle className="w-2.5 h-2.5" /> {p.alarmCount}
                            </span>
                          )}
                          {p.alarmStatus === 'normal' && (
                            <span className="text-[10px] text-emerald-500 flex items-center gap-0.5">
                              <CheckCircle className="w-2.5 h-2.5" /> 正常
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </button>
                  ))}
                  <button className="w-full flex items-center justify-center gap-1 text-[12px] text-emerald-600 py-2">
                    <Plus className="w-3.5 h-3.5" /> 添加项目到{zone.name}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}