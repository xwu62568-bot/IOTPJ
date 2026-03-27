import { Outlet, useNavigate, useLocation } from 'react-router';
import { Home, LayoutGrid, Bell, Settings } from 'lucide-react';
import { messages } from '../data/mock-data';

const tabs = [
  { path: '/', icon: Home, label: '首页' },
  { path: '/zones', icon: LayoutGrid, label: '分区' },
  { path: '/messages', icon: Bell, label: '消息', badge: true },
  { path: '/settings', icon: Settings, label: '设置' },
];

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="flex flex-col h-full bg-[#F5F6FA] max-w-md mx-auto relative">
      <div className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </div>
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 flex z-50">
        {tabs.map((tab) => {
          const active = location.pathname === tab.path || (tab.path !== '/' && location.pathname.startsWith(tab.path));
          const isHome = tab.path === '/' && location.pathname === '/';
          const isActive = active || isHome;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex-1 flex flex-col items-center py-2.5 gap-0.5 transition-colors relative ${
                isActive ? 'text-emerald-600' : 'text-gray-400'
              }`}
            >
              <div className="relative">
                <tab.icon className="w-5 h-5" />
                {tab.badge && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              <span className="text-[11px]">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
