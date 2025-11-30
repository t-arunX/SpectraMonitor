
import React from 'react';
import { X, Moon, Sun, Type, Monitor } from 'lucide-react';
import { AppConfig } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AppConfig;
  setConfig: (config: AppConfig) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, config, setConfig }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1e293b] w-full max-w-md rounded-2xl shadow-2xl border border-slate-700 overflow-hidden animate-fade-in-up">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
          <h2 className="text-lg font-bold text-white">Configuration</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition"><X size={20}/></button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Theme */}
          <div>
            <label className="text-sm font-semibold text-slate-300 mb-3 block">Theme Preference</label>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setConfig({...config, theme: 'dark'})}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${config.theme === 'dark' ? 'bg-[#607AD6] border-[#607AD6] text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'}`}
              >
                <Moon size={18} /> Dark
              </button>
              <button 
                onClick={() => setConfig({...config, theme: 'light'})}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${config.theme === 'light' ? 'bg-[#607AD6] border-[#607AD6] text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'}`}
              >
                <Sun size={18} /> Light
              </button>
            </div>
          </div>

          {/* Density */}
          <div>
             <label className="text-sm font-semibold text-slate-300 mb-3 block">Display Density</label>
             <div className="flex items-center justify-between bg-slate-800 p-3 rounded-xl border border-slate-700">
                <span className="text-slate-300 flex items-center gap-2"><Monitor size={16}/> Compact Mode</span>
                <div 
                    onClick={() => setConfig({...config, compactMode: !config.compactMode})}
                    className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${config.compactMode ? 'bg-[#607AD6]' : 'bg-slate-600'}`}
                >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${config.compactMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </div>
             </div>
          </div>

          {/* AI Settings */}
           <div>
             <label className="text-sm font-semibold text-slate-300 mb-3 block">AI Features</label>
             <div className="flex items-center justify-between bg-slate-800 p-3 rounded-xl border border-slate-700 mb-2">
                <span className="text-slate-300 text-sm">Highlight Anomalies</span>
                <input 
                    type="checkbox" 
                    checked={config.showAnomalies} 
                    onChange={(e) => setConfig({...config, showAnomalies: e.target.checked})}
                    className="accent-[#607AD6] w-4 h-4" 
                />
             </div>
          </div>
        </div>

        <div className="p-4 bg-slate-900/50 border-t border-slate-700 flex justify-end">
            <button onClick={onClose} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition">
                Done
            </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
