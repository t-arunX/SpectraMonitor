import React from 'react';
import { Device } from '../types';
import { Smartphone, Signal, WifiOff, Search } from 'lucide-react';

interface DeviceListProps {
  devices: Device[];
  onSelectDevice: (device: Device) => void;
  appName: string;
  className?: string;
  isLoading?: boolean;
}

const DeviceList: React.FC<DeviceListProps> = ({ devices, onSelectDevice, appName, className, isLoading }) => {
  const [search, setSearch] = React.useState('');

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
        <h2 className="text-slate-900 dark:text-slate-100 font-semibold mb-1">{appName}</h2>
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
    </div>
  );
};

export default DeviceList;