import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Plus, Bell } from 'lucide-react';
import { projects } from '../data/mock-data';
import { RealtimeTab } from './tabs/realtime-tab';
import { DevicesTab } from './tabs/devices-tab';
import { SensorsTab } from './tabs/sensors-tab';
import { ProjectSettingsTab } from './tabs/project-settings-tab';
import { AddDevice } from './add-device';
import { ProjectAlarms } from './project-alarms';

const tabs = ['实时', '设备', '传感器', '设置'];

type OverlayPage = null | 'add-device' | 'alarms';

export function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [inSubPage, setInSubPage] = useState(false);
  const [overlay, setOverlay] = useState<OverlayPage>(null);
  const project = projects.find(p => p.id === id) || projects[0];

  const showHeader = !inSubPage && !overlay;

  return (
    <div className="min-h-screen bg-[#F5F6FA]">
      <div className="flex flex-col min-h-screen max-w-md mx-auto bg-[#F5F6FA]">
        {/* Header */}
        {showHeader && (
          <div className="bg-emerald-600 text-white px-4 pt-3 pb-0 rounded-b-3xl shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h3 className="text-[16px] text-white truncate px-3">{project.name}</h3>
              <div className="flex gap-2">
                <button onClick={() => setOverlay('add-device')} className="w-8 h-8 flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </button>
                <button onClick={() => setOverlay('alarms')} className="w-8 h-8 flex items-center justify-center relative">
                  <Bell className="w-5 h-5" />
                  {project.alarmCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[9px] flex items-center justify-center">
                      {project.alarmCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex">
              {tabs.map((tab, i) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(i)}
                  className={`flex-1 pb-3 text-[13px] relative transition-colors ${
                    activeTab === i ? 'text-white' : 'text-white/60'
                  }`}
                >
                  {tab}
                  {activeTab === i && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-white rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 pb-6">
          {overlay === 'add-device' && (
            <AddDevice onBack={() => setOverlay(null)} />
          )}
          {overlay === 'alarms' && (
            <ProjectAlarms onBack={() => setOverlay(null)} projectName={project.name} />
          )}
          {!overlay && activeTab === 0 && <RealtimeTab onSubPageChange={setInSubPage} />}
          {!overlay && activeTab === 1 && <DevicesTab onSubPageChange={setInSubPage} />}
          {!overlay && activeTab === 2 && <SensorsTab onSubPageChange={setInSubPage} />}
          {!overlay && activeTab === 3 && <ProjectSettingsTab />}
        </div>
      </div>
    </div>
  );
}
