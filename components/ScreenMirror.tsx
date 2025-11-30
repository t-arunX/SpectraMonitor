
import React from 'react';
import { Wifi, Battery, Signal, Lock, Play } from 'lucide-react';

interface ScreenMirrorProps {
  deviceModel: string;
  isOnline: boolean;
  onRequestStart: () => void;
  isActive: boolean;
  currentFrame: string | null;
}

const ScreenMirror: React.FC<ScreenMirrorProps> = ({ deviceModel, isOnline, onRequestStart, isActive, currentFrame }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 bg-slate-900 rounded-lg border border-slate-700 shadow-xl relative">
       <div className="mb-2 text-slate-400 text-xs uppercase tracking-wider font-semibold flex items-center gap-2">
            {isActive ? <span className="flex items-center gap-1 text-green-400"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Live Mirror</span> : "Screen Mirror"}
       </div>
      
      <div 
        className={`relative bg-black rounded-[3rem] border-8 border-slate-800 overflow-hidden shadow-2xl transition-all duration-500 ${isOnline ? 'opacity-100' : 'opacity-50 grayscale'}`} 
        style={{ width: '300px', height: '600px' }}
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-7 bg-black rounded-b-xl z-30 flex items-center justify-center space-x-2 pointer-events-none">
            <div className="w-16 h-4 bg-slate-900 rounded-full"></div>
        </div>

        {/* Status Bar */}
        <div className="absolute top-2 w-full px-6 flex justify-between text-white text-[10px] font-bold z-20 pointer-events-none">
            <span>LIVE</span>
            <div className="flex space-x-1 items-center">
                <Signal size={10} />
                <Wifi size={10} />
                <Battery size={10} />
            </div>
        </div>

        {/* Active Content */}
        {isActive && isOnline && currentFrame ? (
            <div className="w-full h-full bg-slate-100 relative pt-0 select-none">
                 <img 
                    src={`data:image/png;base64,${currentFrame}`} 
                    alt="Live Screen" 
                    className="w-full h-full object-cover"
                />
            </div>
        ) : (
            // Idle / Locked State
            <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center relative z-0">
                {!isActive && isOnline ? (
                    <div className="text-center p-6">
                        <div className="w-16 h-16 bg-[#607AD6]/20 rounded-full flex items-center justify-center mx-auto mb-4 text-[#607AD6]">
                            <Lock size={24} />
                        </div>
                        <h3 className="text-white font-semibold mb-2">Screen Locked</h3>
                        <p className="text-slate-400 text-xs mb-6">Start a session to view and interact with the user's screen.</p>
                        <button 
                            onClick={onRequestStart}
                            className="bg-[#607AD6] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-blue-600 transition shadow-lg flex items-center gap-2 mx-auto"
                        >
                            <Play size={16} fill="currentColor"/> Request Access
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500">
                        <Wifi size={32} className="mb-2 opacity-50"/>
                        <p>Waiting for Stream...</p>
                    </div>
                )}
            </div>
        )}
      </div>
      <div className="mt-4 text-sm text-slate-500 font-mono">{deviceModel}</div>
    </div>
  );
};

export default ScreenMirror;
