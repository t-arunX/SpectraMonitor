import React, { useState, useEffect } from 'react';
import { AppDefinition, FeatureFlag, PushCampaign, SdkConfig } from '../types';
import { apiClient } from '../services/apiClient';
import Heatmap from './Heatmap';
import { 
    BarChart3, Settings2, Bell, Code, Copy, Download, ToggleLeft, ToggleRight, Plus
} from 'lucide-react';

interface AppDashboardProps {
  app: AppDefinition;
}

const AppDashboard: React.FC<AppDashboardProps> = ({ app }) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'config' | 'messaging' | 'sdk'>('analytics');
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sdkConfig, setSdkConfig] = useState<SdkConfig>({
      apiKey: `sk_live_${app.id}`,
      endpoint: 'http://localhost:8080/api',
      logLevel: 'info',
      enableCrashReporting: true,
      enableAnalytics: true,
      sessionTimeout: 30
  });

  useEffect(() => {
    const loadFlags = async () => {
        setIsLoading(true);
        const fetchedFlags = await apiClient.getFeatureFlags();
        setFlags(fetchedFlags);
        setIsLoading(false);
    };
    loadFlags();
  }, [app.id]);

  const toggleFlag = async (id: string) => {
    const flag = flags.find(f => f.id === id);
    if (!flag) return;
    const updated = await apiClient.updateFeatureFlag(id, { enabled: !flag.enabled });
    setFlags(flags.map(f => f.id === id ? updated : f));
  };

  const ConfigView = () => (
      <div className="p-6 max-w-5xl mx-auto animate-fade-in">
          <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Feature Flags</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Control feature rollout in real-time.</p>
              </div>
          </div>

          <div className="space-y-4">
              {isLoading ? (
                  [1,2,3].map(i => (
                      <div key={i} className="bg-white dark:bg-[#1e293b] p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between animate-pulse">
                          <div className="space-y-2">
                              <div className="h-6 w-48 bg-slate-200 dark:bg-slate-700 rounded"></div>
                              <div className="h-4 w-64 bg-slate-200 dark:bg-slate-700 rounded"></div>
                          </div>
                          <div className="w-12 h-8 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                      </div>
                  ))
              ) : (
                  <>
                    {flags.length === 0 && <div className="text-slate-500">No flags defined.</div>}
                    {flags.map(flag => (
                        <div key={flag.id} className="bg-white dark:bg-[#1e293b] p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
                            <div className="flex-1">
                                <h4 className="text-slate-900 dark:text-white font-semibold text-lg">{flag.name}</h4>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">{flag.description}</p>
                            </div>

                            <div className="flex items-center gap-8">
                                <button onClick={() => toggleFlag(flag.id)} className={`transition-colors ${flag.enabled ? 'text-[#607AD6]' : 'text-slate-400 dark:text-slate-600'}`}>
                                    {flag.enabled ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
                                </button>
                            </div>
                        </div>
                    ))}
                  </>
              )}
          </div>
      </div>
  );

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950">
      <div className="bg-white dark:bg-[#0f172a] border-b border-slate-200 dark:border-slate-800 px-6 pt-4">
          <div className="flex space-x-6 overflow-x-auto no-scrollbar">
              {[
                  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                  { id: 'config', label: 'Remote Config', icon: Settings2 },
              ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`pb-3 flex items-center gap-2 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                        activeTab === tab.id 
                            ? 'border-[#607AD6] text-[#607AD6]' 
                            : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                      <tab.icon size={16} /> {tab.label}
                  </button>
              ))}
          </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950">
          {activeTab === 'config' && <ConfigView />}
          {activeTab === 'analytics' && <div className="p-8 text-slate-500">Analytics Panel Ready</div>}
      </div>
    </div>
  );
};

export default AppDashboard;