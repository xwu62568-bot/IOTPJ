import { useState } from 'react';
import { AlertTriangle, Monitor, Settings, Users, Circle, CheckCheck, X, ArrowLeft, ChevronRight } from 'lucide-react';
import { messages as initialMessages } from '../data/mock-data';
import type { Message } from '../data/mock-data';

const categories = [
  { key: 'all', label: '全部' },
  { key: 'alarm', label: '告警' },
  { key: 'device', label: '设备' },
  { key: 'system', label: '系统' },
  { key: 'member', label: '协作' },
];

const typeIcons = {
  alarm: AlertTriangle,
  device: Monitor,
  system: Settings,
  member: Users,
};

const typeColors = {
  alarm: 'bg-red-100 text-red-600',
  device: 'bg-blue-100 text-blue-600',
  system: 'bg-gray-100 text-gray-600',
  member: 'bg-emerald-100 text-emerald-600',
};

export function MessagesPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [msgList, setMsgList] = useState<Message[]>(initialMessages);
  const [selectedMsg, setSelectedMsg] = useState<Message | null>(null);

  const filtered = activeTab === 'all' ? msgList : msgList.filter(m => m.type === activeTab);
  const unreadCount = msgList.filter(m => !m.read).length;

  const markAllRead = () => {
    setMsgList(prev => prev.map(m => ({ ...m, read: true })));
  };

  const markRead = (id: string) => {
    setMsgList(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
  };

  const deleteMsg = (id: string) => {
    setMsgList(prev => prev.filter(m => m.id !== id));
    if (selectedMsg?.id === id) setSelectedMsg(null);
  };

  const openDetail = (msg: Message) => {
    markRead(msg.id);
    setSelectedMsg(msg);
  };

  // Message detail view
  if (selectedMsg) {
    const Icon = typeIcons[selectedMsg.type];
    const colorClass = typeColors[selectedMsg.type];
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setSelectedMsg(null)} className="w-8 h-8 flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h3 className="text-[16px]">消息详情</h3>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClass}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-[15px]">{selectedMsg.title}</h4>
              <div className="text-[11px] text-gray-400 mt-0.5">{selectedMsg.time}</div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <p className="text-[14px] text-gray-600 leading-relaxed">{selectedMsg.content}</p>
          </div>

          {selectedMsg.projectName && (
            <div className="bg-emerald-50 rounded-xl p-3 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-gray-400">关联项目</div>
                <div className="text-[13px] text-emerald-700">{selectedMsg.projectName}</div>
              </div>
              <ChevronRight className="w-4 h-4 text-emerald-400" />
            </div>
          )}

          {selectedMsg.type === 'alarm' && (
            <div className="bg-red-50 rounded-xl p-3">
              <div className="text-[11px] text-gray-400 mb-1">处理建议</div>
              <p className="text-[12px] text-gray-600">
                请检查相关设备运行状态，必要时调整环境控制参数。如告警持续，请联系现场技术人员排查。
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => deleteMsg(selectedMsg.id)}
            className="flex-1 border border-red-200 text-red-500 rounded-xl py-3 text-[14px]"
          >
            删除消息
          </button>
          <button
            onClick={() => setSelectedMsg(null)}
            className="flex-1 bg-emerald-600 text-white rounded-xl py-3 text-[14px]"
          >
            返回列表
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-[20px]">消息中心</h2>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{unreadCount}</span>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-1 text-[12px] text-emerald-600">
            <CheckCheck className="w-3.5 h-3.5" /> 全部已读
          </button>
        )}
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto">
        {categories.map(cat => {
          const count = cat.key === 'all' ? msgList.length : msgList.filter(m => m.type === cat.key).length;
          return (
            <button
              key={cat.key}
              onClick={() => setActiveTab(cat.key)}
              className={`px-3 py-1.5 rounded-full text-[12px] whitespace-nowrap transition-colors ${
                activeTab === cat.key ? 'bg-emerald-600 text-white' : 'bg-white text-gray-500'
              }`}
            >
              {cat.label} {count > 0 && <span className="ml-0.5">({count})</span>}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <CheckCheck className="w-12 h-12 mb-3 text-gray-200" />
          <span className="text-[14px]">暂无消息</span>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(msg => {
            const Icon = typeIcons[msg.type];
            const colorClass = typeColors[msg.type];
            return (
              <div
                key={msg.id}
                className="w-full bg-white rounded-2xl shadow-sm relative overflow-hidden"
              >
                <button
                  onClick={() => openDetail(msg)}
                  className="w-full p-4 text-left"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {!msg.read && <Circle className="w-2 h-2 fill-emerald-500 text-emerald-500 shrink-0" />}
                        <h4 className={`text-[14px] truncate ${!msg.read ? '' : 'text-gray-500'}`}>{msg.title}</h4>
                      </div>
                      <p className="text-[12px] text-gray-400 mt-0.5 truncate">{msg.content}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] text-gray-300">{msg.time}</span>
                        {msg.projectName && <span className="text-[11px] text-emerald-500">{msg.projectName}</span>}
                      </div>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); deleteMsg(msg.id); }}
                      className="w-7 h-7 flex items-center justify-center text-gray-300 hover:text-red-400 shrink-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
