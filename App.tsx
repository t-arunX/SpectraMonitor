
import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import DeviceList from './components/DeviceList';
import DeviceSession from './components/DeviceSession';
import ProfileScreen from './components/ProfileScreen';
import SettingsModal from './components/SettingsModal';
import AppDashboard from './components/AppDashboard';
import UserGuide from './components/UserGuide';
import AppSelector from './components/AppSelector';
import AppOnboarding from './components/AppOnboarding';
import { apiClient } from './services/apiClient';
import { AppDefinition, Device, Tab, AppConfig } from './types';
import { X, Layers, Settings, UserCircle, LayoutDashboard, Menu, HelpCircle, Moon, Sun } from 'lucide-react';

const App: React.FC = () => {
  const [apps, setApps] = useState<AppDefinition[]>([]);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoadingApps, setIsLoadingApps] = useState(true);
  const [isLoadingDevices, setIsLoadingDevices] = useState(false);
  
  // UI States
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [showAppSelector, setShowAppSelector] = useState(false); // If true, shows grid. If false and selectedAppId exists, shows dashboard.

  // Settings & Theme
  const [showSettings, setShowSettings] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  const [config, setConfig] = useState<AppConfig>({
      theme: 'dark',
      fontSize: 'medium',
      compactMode: false,
      showAnomalies: true
  });

  // Session Timeout Logic
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimeout = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setShowTimeoutWarning(false);
      timeoutRef.current = setTimeout(() => {
          setShowTimeoutWarning(true);
      }, 15 * 60 * 1000); // 15 minutes
  };

  useEffect(() => {
      // Add event listeners for activity
      window.addEventListener('mousemove', resetTimeout);
      window.addEventListener('keydown', resetTimeout);
      window.addEventListener('click', resetTimeout);
      window.addEventListener('scroll', resetTimeout);
      
      resetTimeout(); // Initial start

      return () => {
          window.removeEventListener('mousemove', resetTimeout);
          window.removeEventListener('keydown', resetTimeout);
          window.removeEventListener('click', resetTimeout);
          window.removeEventListener('scroll', resetTimeout);
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
      }
  }, []);

  // Apply Theme
  useEffect(() => {
    const root = document.documentElement;
    if (config.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [config.theme]);

  const toggleTheme = () => {
    setConfig(prev => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }));
  };

  // Initial Data Load
  useEffect(() => {
    const loadApps = async () => {
      try {
        setIsLoadingApps(true);
        const fetchedApps = await apiClient.getApps();
        setApps(fetchedApps);
        
        // If no apps exist, start onboarding immediately
        if (fetchedApps.length === 0) {
            setIsOnboarding(true);
        } else if (!selectedAppId) {
            // If apps exist but none selected, show selector
            setShowAppSelector(true);
        }
      } catch (err) {
        console.error("Failed to load apps", err);
      } finally {
        setIsLoadingApps(false);
      }
    };
    loadApps();
    
    // Connect Global Socket
    apiClient.connectSocket();
  }, []);

  // Load devices when app changes
  useEffect(() => {
    if (selectedAppId) {
      setShowAppSelector(false); // Close selector when app is picked
      const loadDevices = async () => {
        setIsLoadingDevices(true);
        const fetchedDevices = await apiClient.getDevices(selectedAppId);
        setDevices(fetchedDevices);
        setIsLoadingDevices(false);
      };
      loadDevices();

      // Ensure Dashboard Tab exists
      const dashboardId = `dashboard_${selectedAppId}`;
      const app = apps.find(a => a.id === selectedAppId);
      if (app) {
          // Clear tabs from other apps or reset
          setTabs(prev => {
              const existingDashboard = prev.find(t => t.id === dashboardId);
              if (existingDashboard) return prev;
              const newTab: Tab = { id: dashboardId, type: 'app-overview', title: 'App Dashboard', data: app };
              return [newTab]; // Reset to just dashboard on app switch
          });
          setActiveTabId(dashboardId);
      }
    }
  }, [selectedAppId, apps]);

  const handleDeviceSelect = (device: Device) => {
    const existingTab = tabs.find(t => t.id === device.id);
    if (existingTab) {
      setActiveTabId(existingTab.id);
    } else {
      const newTab: Tab = {
        id: device.id,
        type: 'device',
        title: `${device.userName}`,
        data: device
      };
      setTabs([...tabs, newTab]);
      setActiveTabId(newTab.id);
    }
    setIsMobileMenuOpen(false);
  };

  const handleDeviceAdded = (newDevice: Device) => {
    setDevices([...devices, newDevice]);
  };

  const openProfile = () => {
      const id = 'profile_tab';
      if (!tabs.find(t => t.id === id)) {
          setTabs([...tabs, { id, type: 'profile', title: 'My Profile' }]);
      }
      setActiveTabId(id);
      setIsMobileMenuOpen(false);
  };

  const closeTab = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    const newTabs = tabs.filter(t => t.id !== tabId);
    setTabs(newTabs);
    if (activeTabId === tabId) {
      setActiveTabId(newTabs.length > 0 ? newTabs[newTabs.length - 1].id : null);
    }
  };

  const handleAppCreated = (newApp: AppDefinition) => {
      setApps([...apps, newApp]);
      setIsOnboarding(false);
      setSelectedAppId(newApp.id);
      setShowAppSelector(false);
  };

  // --- RENDER LOGIC FOR ONBOARDING / SELECTOR ---
  
  if (isOnboarding) {
      return (
          <div className="h-screen w-screen bg-slate-50 dark:bg-slate-950">
               <div className="absolute top-4 right-4 z-50">
                    <button onClick={toggleTheme} className="p-2 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg">
                        {config.theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
               </div>
              <AppOnboarding 
                onComplete={handleAppCreated} 
                onCancel={() => {
                    setIsOnboarding(false);
                    // If canceling with no apps, we stay here essentially, but logically go to selector (which will be empty/prompt create)
                    if (apps.length > 0) setShowAppSelector(true);
                }} 
              />
          </div>
      );
  }

  if (showAppSelector) {
      return (
          <div className="h-screen w-screen bg-slate-50 dark:bg-slate-950">
              <div className="absolute top-4 right-4 z-50">
                    <button onClick={toggleTheme} className="p-2 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg">
                        {config.theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
               </div>
              <AppSelector 
                apps={apps} 
                onSelect={(id) => setSelectedAppId(id)} 
                onCreate={() => setIsOnboarding(true)}
                onAppDeleted={(deletedId) => {
                  setApps(prev => prev.filter(a => a.id !== deletedId));
                  if (selectedAppId === deletedId) setSelectedAppId(null);
                }}
              />
          </div>
      );
  }

  // --- MAIN APP RENDER ---

  const activeTab = tabs.find(t => t.id === activeTabId);
  const selectedApp = apps.find(a => a.id === selectedAppId);

  return (
    <div className="flex h-screen w-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 font-sans transition-colors duration-200">
      
      {/* Session Timeout Warning Modal */}
      {showTimeoutWarning && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
             <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-2xl max-w-sm text-center border border-slate-200 dark:border-slate-800 animate-fade-in-up">
                 <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                     <UserCircle size={32} />
                 </div>
                 <h2 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Are you still there?</h2>
                 <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm">You've been inactive for over 15 minutes. We'll keep your session alive if you're still working.</p>
                 <button 
                    onClick={resetTimeout}
                    className="bg-[#607AD6] text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600 transition w-full shadow-lg"
                 >
                    I'm Active
                 </button>
             </div>
          </div>
      )}

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 z-40 justify-between">
         <div className="flex items-center gap-2">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600 dark:text-slate-300">
                <Menu />
            </button>
            <span className="font-bold text-slate-800 dark:text-white">SpectraMonitor</span>
         </div>
         <div className="flex gap-2">
             <button onClick={toggleTheme} className="p-2 text-slate-500 dark:text-slate-400">
                {config.theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
             </button>
             <button onClick={() => setShowSettings(true)} className="p-2 text-slate-500"><Settings size={20}/></button>
         </div>
      </div>

      {/* Sidebar Container */}
      <div className={`fixed inset-0 z-50 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:flex md:flex-row transition-transform duration-300 ease-in-out`}>
         
         <Sidebar 
            apps={apps} 
            selectedAppId={selectedAppId} 
            onSelectApp={(id) => { setSelectedAppId(id); }}
            onAddApp={() => setIsOnboarding(true)}
            className="h-full"
         />
         
         {selectedApp ? (
            <DeviceList 
            appName={selectedApp.name}
            appId={selectedApp.id}
            devices={devices} 
            onSelectDevice={handleDeviceSelect}
            onDeviceAdded={handleDeviceAdded}
            className="h-full shadow-xl md:shadow-none"
            isLoading={isLoadingDevices}
            onNavigateBack={() => setShowAppSelector(true)}
            />
         ) : (
            <div className="w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400">
                {isLoadingApps ? <div className="w-8 h-8 border-4 border-slate-300 border-t-[#607AD6] rounded-full animate-spin"></div> : "Select an App"}
            </div>
         )}
         
         <div 
            className="md:hidden absolute inset-0 -z-10 bg-black/50" 
            onClick={() => setIsMobileMenuOpen(false)}
            style={{ display: isMobileMenuOpen ? 'block' : 'none' }}
         ></div>
      </div>

      {/* Floating Action Buttons */}
      <div className="hidden md:flex fixed bottom-4 left-3 z-50 flex-col gap-4">
           <button onClick={() => setShowGuide(true)} className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors" title="User Guide">
             <HelpCircle size={20} />
           </button>
           <button onClick={openProfile} className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors" title="Profile">
             <UserCircle size={20} />
           </button>
           <button onClick={() => setShowSettings(true)} className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors" title="Settings">
             <Settings size={20} />
           </button>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-950 pt-14 md:pt-0 transition-colors">
        
        {/* Tabs Bar */}
        <div className="h-10 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-end px-2 space-x-1 overflow-x-auto no-scrollbar pt-1">
            <button 
                onClick={() => setShowAppSelector(true)}
                className="mr-2 px-2 py-1 text-xs font-bold text-[#607AD6] hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded flex items-center gap-1 transition-colors"
            >
                <Layers size={14} /> Apps
            </button>
            <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-800 mx-2 self-center"></div>
            
            {tabs.map(tab => (
                <div 
                    key={tab.id}
                    onClick={() => setActiveTabId(tab.id)}
                    className={`
                        group flex items-center max-w-[200px] h-9 px-4 rounded-t-lg text-xs cursor-pointer border-t border-x transition-all select-none
                        ${activeTabId === tab.id 
                            ? 'bg-slate-100 dark:bg-slate-900 text-[#607AD6] border-slate-200 dark:border-slate-800 border-b-slate-100 dark:border-b-slate-900 mb-[-1px] z-10 font-bold shadow-sm' 
                            : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:text-slate-800 dark:hover:text-slate-300'
                        }
                    `}
                >
                    {tab.type === 'app-overview' && <LayoutDashboard size={12} className="mr-2"/>}
                    <span className="truncate mr-2">{tab.title}</span>
                    <button 
                        onClick={(e) => closeTab(e, tab.id)}
                        className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-red-500/20 hover:text-red-500 rounded-full transition-all"
                    >
                        <X size={10} />
                    </button>
                </div>
            ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 relative overflow-hidden bg-white dark:bg-slate-900 shadow-inner">
            {activeTab?.type === 'device' && activeTab.data && (
                <DeviceSession 
                    key={activeTab.id} 
                    device={activeTab.data} 
                    onToggleTheme={toggleTheme}
                    isDarkMode={config.theme === 'dark'}
                />
            )}
            {activeTab?.type === 'profile' && (
                <ProfileScreen />
            )}
            {activeTab?.type === 'app-overview' && activeTab.data && (
                <AppDashboard app={activeTab.data} />
            )}
            {!activeTab && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 dark:text-slate-800 pointer-events-none select-none">
                    <Layers size={96} />
                    <h1 className="text-4xl font-bold mt-4 tracking-tighter text-slate-400 dark:text-slate-700">SpectraMonitor</h1>
                </div>
            )}
        </div>
      </div>

      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
        config={config} 
        setConfig={setConfig} 
      />

      <UserGuide 
         isOpen={showGuide}
         onClose={() => setShowGuide(false)}
      />
    </div>
  );
};

export default App;
