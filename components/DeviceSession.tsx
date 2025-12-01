import React, { useState, useEffect } from 'react';
import { Device, LogEntry, CrashReport, ChatSession, NetworkRequest } from '../types';
import ScreenMirror from './ScreenMirror';
import LogViewer from './LogViewer';
import { apiClient } from '../services/apiClient';
import { getPerformanceTips } from '../services/geminiService';
import { 
  Activity, MessageSquare, Terminal, Monitor, Database, 
  AlertOctagon, Sparkles, ChevronRight, ChevronDown, 
  Wifi, Footprints, Search, Folder, File, Trash2, Edit2, Check, X, 
  SendHorizontal, Archive, PlusCircle, Wrench, Globe, Download, Moon, Sun
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';

interface DeviceSessionProps {
  device: Device;
  onToggleTheme?: () => void;
  isDarkMode?: boolean;
}

// Simple DBNode for visualization (Empty state initially)
interface DBNodeProps {
  node: any;
  level?: number;
  editingNode: {key: string, value: any} | null;
  setEditingNode: (node: {key: string, value: any} | null) => void;
  handleUpdateNode: (key: string, newValue: any) => void;
}

const DBNode: React.FC<DBNodeProps> = ({ node, level = 0, editingNode, setEditingNode, handleUpdateNode }) => {
    const [expanded, setExpanded] = useState(true);
    const hasChildren = node.children && node.children.length > 0;
    const isEditing = editingNode?.key === node.key;
    const [tempVal, setTempVal] = useState(node.value);

    return (
        <div style={{ marginLeft: `${level * 12}px` }} className="text-sm font-mono my-1 group">
            <div className="flex items-center hover:bg-slate-100 dark:hover:bg-slate-800 rounded px-2 py-1 transition-colors">
                <div className="cursor-pointer flex items-center flex-1" onClick={() => setExpanded(!expanded)}>
                     <span className="text-slate-400 dark:text-slate-500 mr-2 w-4 flex justify-center">
                        {hasChildren && (expanded ? <ChevronDown size={12}/> : <ChevronRight size={12}/>)}
                    </span>
                    <span className="text-purple-600 dark:text-purple-400 mr-2">{node.key}:</span>
                    {hasChildren ? (
                        <span className="text-slate-500 text-xs">{node.type} [{node.children.length}]</span>
                    ) : (
                        isEditing ? (
                            <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                                <input 
                                    type="text" 
                                    value={tempVal} 
                                    onChange={e => setTempVal(e.target.value)}
                                    className="bg-white dark:bg-slate-900 border border-[#607AD6] text-slate-900 dark:text-white px-1 rounded h-6 w-32 focus:outline-none"
                                />
                                <button onClick={() => handleUpdateNode(node.key, tempVal)} className="text-green-500 hover:text-green-600"><Check size={14}/></button>
                                <button onClick={() => setEditingNode(null)} className="text-red-500 hover:text-red-600"><X size={14}/></button>
                            </div>
                        ) : (
                            <span className="text-green-600 dark:text-green-400">{String(node.value)}</span>
                        )
                    )}
                </div>
            </div>
            {hasChildren && expanded && (
                <div>
                    {node.children.map((child: any) => (
                        <DBNode 
                            key={child.key} 
                            node={child} 
                            level={level + 1} 
                            editingNode={editingNode}
                            setEditingNode={setEditingNode}
                            handleUpdateNode={handleUpdateNode}
                        />
                    ))}
                </div>
            )}
        </div>
    )
};

const DeviceSession: React.FC<DeviceSessionProps> = ({ device, onToggleTheme, isDarkMode }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [isPaused, setPaused] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'screen' | 'logs' | 'files' | 'database' | 'crashes' | 'chat' | 'journey' | 'network' | 'tools'>('overview');
  
  // Screen Share State
  const [isScreenShareActive, setIsScreenShareActive] = useState(false);
  const [isRequestingScreen, setIsRequestingScreen] = useState(false);
  const [currentFrame, setCurrentFrame] = useState<string | null>(null);

  // Chat state
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  
  // DB State
  const [dbData, setDbData] = useState<any[]>([]); // Initialize empty
  const [dbQuery, setDbQuery] = useState('');
  const [editingNode, setEditingNode] = useState<{key: string, value: any} | null>(null);

  // Files State
  const [currentPath, setCurrentPath] = useState<any[]>([]);
  
  // Network State
  const [networkRequests, setNetworkRequests] = useState<NetworkRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<NetworkRequest | null>(null);
  const [networkData, setNetworkData] = useState<{time: number, speed: number}[]>([]);

  // AI & Data state
  const [perfTips, setPerfTips] = useState<string | null>(null);
  
  // Initialize Connection
  useEffect(() => {
    // 1. Join Session
    apiClient.joinDeviceSession(device.id);

    // 2. Fetch Historical Logs
    setIsLoadingLogs(true);
    apiClient.getLogs(device.id).then((fetchedLogs) => {
        setLogs(fetchedLogs);
        setIsLoadingLogs(false);
    });

    // 3. Listen for New Logs
    const logUnsub = apiClient.onNewLog((newLog) => {
        if (!isPaused) {
            setLogs(prev => [...prev, newLog].slice(-500));
        }
    });

    // 4. Listen for Screen Frames
    const screenUnsub = apiClient.onScreenFrame((base64) => {
        setCurrentFrame(base64);
    });

    // 5. AI Tips
    getPerformanceTips({ cpu: 45, memory: 60 }).then(setPerfTips);

    return () => {
        // Cleanup subscriptions if needed in real implementation
    }
  }, [device.id]);


  // Handlers
  const handleRequestScreen = () => {
      setIsRequestingScreen(true);
      setTimeout(() => {
          setIsRequestingScreen(false);
          setIsScreenShareActive(true);
      }, 1000);
  };

  const healthScore = device.health?.score ?? 85;
  
  const OverviewTab = () => (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700/50">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Activity className="text-[#607AD6]" /> App Health Score
            </h3>
            <div className="flex items-end gap-2 mb-2">
                <span className="text-5xl font-bold text-slate-900 dark:text-white">{healthScore}</span>
                <span className="text-slate-500 dark:text-slate-400 mb-1">/ 100</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden mb-6">
                <div className="h-full bg-[#607AD6]" style={{ width: `${healthScore}%` }}></div>
            </div>
        </div>
        <div className="space-y-6">
            <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700/50 h-[180px] flex flex-col">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-md font-semibold text-slate-900 dark:text-white flex items-center gap-2"><Wifi size={16}/> Network Quality</h3>
                </div>
            </div>
        </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-200">
      {/* Header */}
      <div className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-4 lg:px-6 shadow-sm z-10">
        <div className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${device.status === 'online' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-slate-400'}`}></div>
            <div>
                <h2 className="text-slate-900 dark:text-white font-bold text-lg leading-tight truncate max-w-[150px] lg:max-w-xs">{device.userName}</h2>
                <div className="hidden sm:flex text-xs text-slate-500 dark:text-slate-400 items-center gap-2">
                    <span>{device.model}</span> • <span>{device.osVersion}</span>
                </div>
            </div>
        </div>

        <div className="flex items-center gap-2">
            {/* Tab Navigation */}
            <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl overflow-x-auto no-scrollbar max-w-[200px] sm:max-w-md lg:max-w-xl">
                 {[
                     { id: 'overview', icon: Activity, label: 'Overview' },
                     { id: 'screen', icon: Monitor, label: 'Screen' },
                     { id: 'logs', icon: Terminal, label: 'Logs' },
                 ].map(tab => (
                     <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                            activeTab === tab.id 
                                ? 'bg-white dark:bg-[#607AD6] text-[#607AD6] dark:text-white shadow-sm' 
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800'
                        }`}
                     >
                         <tab.icon size={14} /> <span className="hidden lg:inline">{tab.label}</span>
                     </button>
                 ))}
            </div>

            {/* Theme Toggle */}
            {onToggleTheme && (
                <button 
                    onClick={onToggleTheme}
                    className="p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 transition-colors ml-2 border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                    title="Toggle Theme"
                >
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden relative bg-slate-50 dark:bg-slate-950">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'screen' && (
            <div className="h-full flex flex-col items-center justify-center p-8 bg-slate-200 dark:bg-slate-900/50">
                {isRequestingScreen && (
                    <div className="absolute inset-0 bg-black/60 z-50 flex flex-col items-center justify-center backdrop-blur-sm">
                        <div className="w-12 h-12 border-4 border-[#607AD6] border-t-transparent rounded-full animate-spin mb-4"></div>
                        <div className="text-white font-semibold">Requesting user permission...</div>
                    </div>
                )}
                <ScreenMirror 
                    deviceModel={device.model} 
                    isOnline={device.status === 'online'} 
                    onRequestStart={handleRequestScreen}
                    isActive={isScreenShareActive}
                    currentFrame={currentFrame}
                />
            </div>
        )}
        {activeTab === 'logs' && <LogViewer logs={logs} isPaused={isPaused} setPaused={setPaused} onClear={() => setLogs([])} isLoading={isLoadingLogs} />}
      </div>
    </div>
  );
};

export default DeviceSession;