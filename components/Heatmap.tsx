
import React from 'react';

const Heatmap: React.FC = () => {
    // Generate random heat points
    const points = Array.from({ length: 15 }).map((_, i) => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        intensity: Math.random()
    }));

    return (
        <div className="relative w-full h-[600px] bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-lg">
            {/* Wireframe Background */}
            <div className="absolute inset-0 flex flex-col items-center pt-10 opacity-30 pointer-events-none">
                <div className="w-3/4 h-8 bg-slate-600 rounded mb-4"></div>
                <div className="w-full h-40 bg-slate-700 mb-4"></div>
                <div className="grid grid-cols-2 gap-4 w-full px-4">
                    <div className="h-24 bg-slate-700 rounded"></div>
                    <div className="h-24 bg-slate-700 rounded"></div>
                    <div className="h-24 bg-slate-700 rounded"></div>
                    <div className="h-24 bg-slate-700 rounded"></div>
                </div>
                <div className="absolute bottom-10 right-10 w-12 h-12 bg-blue-500 rounded-full"></div>
            </div>

            {/* Heatmap Overlay */}
            <div className="absolute inset-0 pointer-events-none">
                {points.map((p, i) => (
                    <div 
                        key={i}
                        className="absolute rounded-full blur-xl"
                        style={{
                            left: `${p.x}%`,
                            top: `${p.y}%`,
                            width: '60px',
                            height: '60px',
                            background: `radial-gradient(circle, rgba(255, 0, 0, ${p.intensity * 0.8}) 0%, rgba(255, 165, 0, ${p.intensity * 0.4}) 50%, transparent 100%)`,
                            transform: 'translate(-50%, -50%)'
                        }}
                    ></div>
                ))}
            </div>

            <div className="absolute top-4 left-4 bg-black/70 px-3 py-1 rounded text-white text-xs font-mono">
                Screen: Product_Detail_v2
            </div>
             <div className="absolute bottom-4 left-4 flex gap-2 text-[10px] text-white bg-black/50 p-2 rounded">
                <span className="flex items-center gap-1"><div className="w-2 h-2 bg-red-500 rounded-full"></div> High Click</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 bg-orange-400 rounded-full"></div> Medium</span>
            </div>
        </div>
    );
};

export default Heatmap;
