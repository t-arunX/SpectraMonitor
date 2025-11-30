
import React from 'react';
import { AppDefinition } from '../types';
import { LayoutGrid, Plus } from 'lucide-react';

interface SidebarProps {
  apps: AppDefinition[];
  selectedAppId: string | null;
  onSelectApp: (id: string) => void;
  onAddApp?: () => void;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ apps, selectedAppId, onSelectApp, onAddApp, className }) => {
  return (
    <div className={`w-16 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col items-center py-6 space-y-4 z-20 pb-24 transition-colors ${className}`}>
      <div className="w-10 h-10 bg-gradient-to-br from-[#607AD6] to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4 cursor-pointer">
        <LayoutGrid className="text-white" size={20} />
      </div>
      
      {apps.map((app) => (
        <button
          key={app.id}
          onClick={() => onSelectApp(app.id)}
          className={`relative group w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
            selectedAppId === app.id 
              ? 'bg-slate-100 dark:bg-slate-800 text-[#607AD6] shadow-sm scale-105 border border-slate-200 dark:border-slate-700' 
              : 'bg-transparent text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-600 dark:hover:text-white'
          }`}
          title={app.name}
        >
          <span className="text-lg filter">{app.icon}</span>
          
          {/* Tooltip */}
          <div className="absolute left-14 bg-slate-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap z-50 shadow-xl translate-x-[-10px] group-hover:translate-x-0 hidden md:block">
            {app.name}
          </div>
        </button>
      ))}

      <button 
        onClick={onAddApp}
        className="w-10 h-10 rounded-xl flex items-center justify-center bg-transparent border border-slate-300 dark:border-slate-800 border-dashed text-slate-400 hover:text-[#607AD6] hover:border-[#607AD6] transition-colors"
        title="Add Application"
      >
        <Plus size={20} />
      </button>
    </div>
  );
};

export default Sidebar;
