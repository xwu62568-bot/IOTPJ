import { useState } from 'react';
import { User, Bell, Globe, Ruler, Clock, Info, HelpCircle, ChevronRight, Moon, Wifi, Shield, Database, LogOut, Trash2, BellRing, BellOff, Vibrate } from 'lucide-react';
import { Switch } from './ui/switch';

export function SettingsPage() {
  const [alarmNotify, setAlarmNotify] = useState(true);
  const [deviceNotify, setDeviceNotify] = useState(true);
  const [systemNotify, setSystemNotify] = useState(false);
  const [vibrate, setVibrate] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [showDetail, setShowDetail] = useState<string | null>(null);

  // Notification settings sub-page
  if (showDetail === 'notification') {
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => setShowDetail(null)} className="w-8 h-8 flex items-center justify-center">
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <h3 className="text-[16px]">通知设置</h3>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-50">
          <div className="flex items-center gap-3 p-3.5">
            <BellRing className="w-5 h-5 text-red-500" />
            <span className="flex-1 text-[14px]">告警通知</span>
            <Switch checked={alarmNotify} onCheckedChange={setAlarmNotify} />
          </div>
          <div className="flex items-center gap-3 p-3.5">
            <Wifi className="w-5 h-5 text-blue-500" />
            <span className="flex-1 text-[14px]">设备上下线通知</span>
            <Switch checked={deviceNotify} onCheckedChange={setDeviceNotify} />
          </div>
          <div className="flex items-center gap-3 p-3.5">
            <Bell className="w-5 h-5 text-gray-400" />
            <span className="flex-1 text-[14px]">系统通知</span>
            <Switch checked={systemNotify} onCheckedChange={setSystemNotify} />
          </div>
          <div className="flex items-center gap-3 p-3.5">
            <Vibrate className="w-5 h-5 text-gray-400" />
            <span className="flex-1 text-[14px]">震动反馈</span>
            <Switch checked={vibrate} onCheckedChange={setVibrate} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
          <span className="text-[12px] text-gray-400 block">告警静默时段</span>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-gray-400 block mb-1">开始时间</label>
              <input type="time" defaultValue="22:00" className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-[14px]" />
            </div>
            <div>
              <label className="text-[11px] text-gray-400 block mb-1">结束时间</label>
              <input type="time" defaultValue="07:00" className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-[14px]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Profile sub-page
  if (showDetail === 'profile') {
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => setShowDetail(null)} className="w-8 h-8 flex items-center justify-center">
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <h3 className="text-[16px]">个人资料</h3>
        </div>

        <div className="flex flex-col items-center py-4">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-[28px] mb-3">
            张
          </div>
          <button className="text-[12px] text-emerald-600">更换头像</button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-50">
          {[
            { label: '用户名', value: '张工程师' },
            { label: '手机号', value: '138****8888' },
            { label: '邮箱', value: 'zhang@greenhouse.com' },
            { label: '角色', value: '超级管理员' },
            { label: '加入时间', value: '2025-06-15' },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between p-3.5">
              <span className="text-[13px] text-gray-400">{item.label}</span>
              <span className="text-[13px]">{item.value}</span>
            </div>
          ))}
        </div>

        <button className="w-full bg-emerald-600 text-white rounded-xl py-3 text-[14px]">
          修改密码
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-[20px] mb-4">设置</h2>

      {/* Profile card */}
      <button
        onClick={() => setShowDetail('profile')}
        className="w-full bg-white rounded-2xl p-4 shadow-sm mb-4 flex items-center gap-3 text-left"
      >
        <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-[20px]">
          张
        </div>
        <div className="flex-1">
          <h3 className="text-[16px]">张工程师</h3>
          <span className="text-[12px] text-gray-400">超级管理员</span>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-300" />
      </button>

      {/* Personal */}
      <div className="mb-4">
        <span className="text-[12px] text-gray-400 ml-1 mb-1 block">个人</span>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-50">
          <button onClick={() => setShowDetail('notification')} className="w-full flex items-center gap-3 p-3.5 text-left">
            <Bell className="w-5 h-5 text-gray-400" />
            <span className="flex-1 text-[14px]">通知设置</span>
            <span className="text-[12px] text-gray-400">
              {alarmNotify || deviceNotify ? '已开启' : '已关闭'}
            </span>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </button>
          <button className="w-full flex items-center gap-3 p-3.5 text-left">
            <Shield className="w-5 h-5 text-gray-400" />
            <span className="flex-1 text-[14px]">账号安全</span>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </button>
        </div>
      </div>

      {/* Preferences */}
      <div className="mb-4">
        <span className="text-[12px] text-gray-400 ml-1 mb-1 block">偏好设置</span>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-50">
          <div className="flex items-center gap-3 p-3.5">
            <Moon className="w-5 h-5 text-gray-400" />
            <span className="flex-1 text-[14px]">深色模式</span>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>
          <div className="flex items-center gap-3 p-3.5">
            <Database className="w-5 h-5 text-gray-400" />
            <span className="flex-1 text-[14px]">自动同步</span>
            <Switch checked={autoSync} onCheckedChange={setAutoSync} />
          </div>
          <button className="w-full flex items-center gap-3 p-3.5 text-left">
            <Globe className="w-5 h-5 text-gray-400" />
            <span className="flex-1 text-[14px]">语言设置</span>
            <span className="text-[12px] text-gray-400">中文</span>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </button>
          <button className="w-full flex items-center gap-3 p-3.5 text-left">
            <Ruler className="w-5 h-5 text-gray-400" />
            <span className="flex-1 text-[14px]">单位设置</span>
            <span className="text-[12px] text-gray-400">公制</span>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </button>
          <button className="w-full flex items-center gap-3 p-3.5 text-left">
            <Clock className="w-5 h-5 text-gray-400" />
            <span className="flex-1 text-[14px]">时间格式</span>
            <span className="text-[12px] text-gray-400">24小时制</span>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </button>
        </div>
      </div>

      {/* About */}
      <div className="mb-4">
        <span className="text-[12px] text-gray-400 ml-1 mb-1 block">关于</span>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-50">
          <button className="w-full flex items-center gap-3 p-3.5 text-left">
            <Info className="w-5 h-5 text-gray-400" />
            <span className="flex-1 text-[14px]">版本信息</span>
            <span className="text-[12px] text-gray-400">v1.2.0</span>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </button>
          <button className="w-full flex items-center gap-3 p-3.5 text-left">
            <HelpCircle className="w-5 h-5 text-gray-400" />
            <span className="flex-1 text-[14px]">帮助与反馈</span>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <button className="w-full bg-white rounded-2xl shadow-sm p-3.5 flex items-center gap-3 text-gray-500">
          <Trash2 className="w-4 h-4" />
          <span className="text-[13px]">清除缓存</span>
          <span className="text-[12px] text-gray-400 ml-auto">23.5 MB</span>
        </button>
        <button className="w-full bg-white rounded-2xl shadow-sm p-3.5 flex items-center gap-3 text-red-500">
          <LogOut className="w-4 h-4" />
          <span className="text-[13px]">退出登录</span>
        </button>
      </div>
    </div>
  );
}
