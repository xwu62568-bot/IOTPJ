import { useState } from 'react';
import { Clock, Edit, FolderOpen, Users, UserPlus, Shield, Trash2, ChevronRight, Sun, Moon, Bell, BellOff, Download, RotateCcw, Wifi } from 'lucide-react';
import { Switch } from '../ui/switch';

const members = [
  { name: '张工程师', role: '超级管理员', avatar: '张', online: true },
  { name: '李技术员', role: '运维人员', avatar: '李', online: true },
  { name: '王助理', role: '查看成员', avatar: '王', online: false },
];

const roles = ['超级管理员', '运维人员', '查看成员'];

export function ProjectSettingsTab() {
  const [projectName, setProjectName] = useState('A1号温室-番茄');
  const [editing, setEditing] = useState(false);
  const [dayStart, setDayStart] = useState('06:00');
  const [dayEnd, setDayEnd] = useState('18:00');
  const [alarmNotify, setAlarmNotify] = useState(true);
  const [offlineNotify, setOfflineNotify] = useState(true);
  const [dataInterval, setDataInterval] = useState('5');
  const [autoControl, setAutoControl] = useState(true);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  // Member detail
  if (selectedMember) {
    const member = members.find(m => m.name === selectedMember);
    if (!member) return null;
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => setSelectedMember(null)} className="w-8 h-8 flex items-center justify-center">
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <h3 className="text-[16px]">成员详情</h3>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col items-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-[24px] mb-2 ${
            member.online ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'
          }`}>
            {member.avatar}
          </div>
          <h4 className="text-[16px]">{member.name}</h4>
          <span className={`text-[11px] mt-0.5 flex items-center gap-1 ${member.online ? 'text-emerald-500' : 'text-gray-400'}`}>
            <Wifi className="w-2.5 h-2.5" /> {member.online ? '当前在线' : '离线'}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <span className="text-[12px] text-gray-400 block mb-2">角色权限</span>
          <div className="flex flex-wrap gap-2">
            {roles.map(r => (
              <button
                key={r}
                className={`px-3 py-1.5 rounded-lg text-[12px] ${
                  r === member.role ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-50">
          <div className="flex items-center justify-between p-3.5">
            <span className="text-[13px] text-gray-400">加入时间</span>
            <span className="text-[13px]">2025-08-12</span>
          </div>
          <div className="flex items-center justify-between p-3.5">
            <span className="text-[13px] text-gray-400">最近活跃</span>
            <span className="text-[13px]">{member.online ? '刚刚' : '2小时前'}</span>
          </div>
        </div>

        {member.role !== '超级管理员' && (
          <button className="w-full border border-red-200 text-red-500 rounded-xl py-3 text-[14px]">
            移除成员
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Project info */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-50">
        <div className="flex items-center gap-3 p-3.5">
          <Edit className="w-4 h-4 text-gray-400" />
          <span className="flex-1 text-[13px]">项目名称</span>
          {editing ? (
            <div className="flex items-center gap-1">
              <input
                value={projectName}
                onChange={e => setProjectName(e.target.value)}
                className="bg-gray-50 rounded-lg px-2 py-0.5 text-[12px] w-36"
                autoFocus
              />
              <button onClick={() => setEditing(false)} className="text-emerald-600 text-[12px]">确定</button>
            </div>
          ) : (
            <button onClick={() => setEditing(true)} className="flex items-center gap-1 text-[12px] text-gray-400">
              {projectName} <Edit className="w-3 h-3" />
            </button>
          )}
        </div>
        <button className="w-full flex items-center gap-3 p-3.5 text-left">
          <FolderOpen className="w-4 h-4 text-gray-400" />
          <span className="flex-1 text-[13px]">所属分区</span>
          <span className="text-[12px] text-gray-400">东区</span>
          <ChevronRight className="w-4 h-4 text-gray-300" />
        </button>
        <button className="w-full flex items-center gap-3 p-3.5 text-left">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="flex-1 text-[13px]">项目时区</span>
          <span className="text-[12px] text-gray-400">UTC+8</span>
          <ChevronRight className="w-4 h-4 text-gray-300" />
        </button>
      </div>

      {/* Day/Night schedule */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <span className="text-[12px] text-gray-400 block mb-3">白天/夜晚时段</span>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-gray-400 flex items-center gap-1 mb-1">
              <Sun className="w-3 h-3 text-amber-500" /> 白天开始
            </label>
            <input
              type="time"
              value={dayStart}
              onChange={e => setDayStart(e.target.value)}
              className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-[14px]"
            />
          </div>
          <div>
            <label className="text-[11px] text-gray-400 flex items-center gap-1 mb-1">
              <Moon className="w-3 h-3 text-indigo-500" /> 夜晚开始
            </label>
            <input
              type="time"
              value={dayEnd}
              onChange={e => setDayEnd(e.target.value)}
              className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-[14px]"
            />
          </div>
        </div>
      </div>

      {/* Control settings */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-50">
        <div className="flex items-center gap-3 p-3.5">
          <RotateCcw className="w-4 h-4 text-gray-400" />
          <span className="flex-1 text-[13px]">自动控制</span>
          <Switch checked={autoControl} onCheckedChange={setAutoControl} />
        </div>
        <div className="flex items-center gap-3 p-3.5">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="flex-1 text-[13px]">数据采集间隔</span>
          <select
            value={dataInterval}
            onChange={e => setDataInterval(e.target.value)}
            className="bg-gray-50 rounded-lg px-2 py-1 text-[12px] appearance-none"
          >
            <option value="1">1 分钟</option>
            <option value="5">5 分钟</option>
            <option value="10">10 分钟</option>
            <option value="30">30 分钟</option>
          </select>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-50">
        <div className="flex items-center gap-3 p-3.5">
          <Bell className="w-4 h-4 text-red-500" />
          <span className="flex-1 text-[13px]">告警通知</span>
          <Switch checked={alarmNotify} onCheckedChange={setAlarmNotify} />
        </div>
        <div className="flex items-center gap-3 p-3.5">
          <BellOff className="w-4 h-4 text-gray-400" />
          <span className="flex-1 text-[13px]">设备离线通知</span>
          <Switch checked={offlineNotify} onCheckedChange={setOfflineNotify} />
        </div>
      </div>

      {/* Members */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-[13px] text-gray-500">项目成员 ({members.length})</span>
          <button className="text-[12px] text-emerald-600 flex items-center gap-1">
            <UserPlus className="w-3.5 h-3.5" /> 邀请
          </button>
        </div>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-50">
          {members.map(m => (
            <button key={m.name} onClick={() => setSelectedMember(m.name)} className="w-full flex items-center gap-3 p-3.5 text-left">
              <div className="relative">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] ${
                  m.online ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'
                }`}>
                  {m.avatar}
                </div>
                {m.online && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
                )}
              </div>
              <div className="flex-1">
                <div className="text-[13px]">{m.name}</div>
                <div className="text-[11px] text-gray-400 flex items-center gap-1">
                  <Shield className="w-3 h-3" /> {m.role}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </button>
          ))}
        </div>
      </div>

      {/* Data management */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-50">
        <button className="w-full flex items-center gap-3 p-3.5 text-left text-gray-500">
          <Download className="w-4 h-4" />
          <span className="text-[13px]">导出历史数据</span>
          <ChevronRight className="w-4 h-4 text-gray-300 ml-auto" />
        </button>
      </div>

      {/* Danger zone */}
      <button className="w-full bg-white rounded-2xl shadow-sm p-3.5 flex items-center gap-3 text-red-500">
        <Trash2 className="w-4 h-4" />
        <span className="text-[13px]">删除项目</span>
      </button>
    </div>
  );
}
