import React from 'react';
import { Device } from '../types';
import { Smartphone, Signal, WifiOff, Search, Plus, X } from 'lucide-react';
import { apiClient } from '../services/apiClient';

interface DeviceListProps {
  devices: Device[];
  onSelectDevice: (device: Device) => true
  appName: string;
  appId: string;
  className?: string;
  isLoading?: boolean;
  onDeviceAdded?: (device: Device) => void;
}

const DeviceList: React.FC<DeviceListProps> = ({ devices, onSelectDevice, appName, appId, className, isLoading, onDeviceAdded }) => {
  const [search, setSearch] = React.useState('');
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [isCreating, setIsCreating] = React.useState(false);
  const [formData, setFormData] = React.useState({
    userName: '-',
    model: '--',
    osVersion: '--'
  });

  const handleAddDevice = async () => {
    if (!formData.userName.trim()) return;
    setIsCreating(true);
    try {
      const newDevice = await apiClient.createDevice(appId, {
        userName: formData.userName,
        model: formData.model,
        osVersion: formData.osVersion
      });
      onDeviceAdded?.(newDevice);
      setShowAddModal(false);
      setFormData({ userName: '', model: 'iPhone 14', osVersion: '17.0' });
    } catch (err) {
      console.error('Failed to add device:', err);
    } finally {
      setIsCreating(false);
    }
  };

  const filtered = devices.filter(d => 
    d.userName.toLowerCase().includes(search.toLowerCase()) || 
    d.model.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
      return (
          <div className={`w-80 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full transition-colors ${className}`}>
             <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mb-3"></div>
                <div className="h-9 w-full bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
             </div>
             <div className="p-2 space-y-2">
                {[1,2,3,4,5,6].map(i => (
                    <div key={i} className="h-16 w-full bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse border border-slate-200 dark:border-slate-800"></div>
                ))}
             </div>
          </div>
      )
  }

  return (
    <div className={`w-80 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full transition-colors ${className}`}>
      <div className="p-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-slate-900 dark:text-slate-100 font-semibold">{appName}</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            title="Add Device"
          >
            <Plus size={16} className="text-slate-600 dark:text-slate-400" />
          </button>
        </div>
        <p className="text-xs text-slate-500 mb-3">{devices.length} Active Sessions</p>
        
        <div className="relative">
            <Search className="absolute left-2.5 top-2 w-4 h-4 text-slate-400" />
            <input 
                type="text"
                placeholder="Find user or device..."
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-md py-1.5 pl-9 pr-3 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500 transition-colors"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filtered.map(device => (
          <div 
            key={device.id} 
            onClick={() => onSelectDevice(device)}
            className="group flex items-center p-3 rounded-lg cursor-pointer hover:bg-white dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-sm"
          >
            <div className={`relative flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${device.status === 'online' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                <Smartphone size={20} />
                <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900 ${
                    device.status === 'online' ? 'bg-green-500' : 
                    device.status === 'background' ? 'bg-yellow-500' : 'bg-slate-500'
                }`} />
            </div>
            
            <div className="ml-3 flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-200 truncate">{device.userName}</p>
                    <span className="text-[10px] text-slate-500">{device.sessionDuration}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-500">
                    <span className="truncate">{device.model}</span>
                    <span className="flex items-center space-x-1">
                       {device.status === 'offline' ? <WifiOff size={10} /> : <Signal size={10} />}
                       <span>{device.batteryLevel}%</span>
                    </span>
                </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Add Test Device</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>
            
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">User Name *</label>
                <input
                  type="text"
                  value={formData.userName}
                  onChange={(e) => setFormData({...formData, userName: e.target.value})}
                  placeholder="e.g., John Doe"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Device Model</label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => setFormData({...formData, model: e.target.value})}
                  placeholder="e.g., iPhone 14"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">OS Version</label>
                <input
                  type="text"
                  value={formData.osVersion}
                  onChange={(e) => setFormData({...formData, osVersion: e.target.value})}
                  placeholder="e.g., 17.0"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddDevice}
                disabled={isCreating || !formData.userName.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white rounded-md transition-colors"
              >
                {isCreating ? 'Adding...' : 'Add Device'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceList;