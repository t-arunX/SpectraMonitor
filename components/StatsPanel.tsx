import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const generateData = () => {
    return Array.from({ length: 20 }).map((_, i) => ({
        time: i,
        cpu: 20 + Math.random() * 30,
        memory: 40 + Math.random() * 20,
        network: Math.random() * 100
    }));
};

const StatsPanel: React.FC = () => {
  const [data, setData] = React.useState(generateData());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev.slice(1), {
            time: prev[prev.length - 1].time + 1,
            cpu: Math.max(0, Math.min(100, (prev[prev.length - 1].cpu || 0) + (Math.random() - 0.5) * 20)),
            memory: Math.max(0, Math.min(100, (prev[prev.length - 1].memory || 0) + (Math.random() - 0.5) * 10)),
            network: Math.max(0, Math.random() * 500) 
        }];
        return newData;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
      {/* CPU & Memory */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg flex flex-col">
        <h3 className="text-slate-400 text-sm font-semibold mb-4">System Performance</h3>
        <div className="flex-1 w-full min-h-[150px]">
            <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" hide />
                <YAxis stroke="#64748b" fontSize={10} domain={[0, 100]} />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                    itemStyle={{ fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="cpu" stroke="#ef4444" fillOpacity={1} fill="url(#colorCpu)" name="CPU %" />
                <Area type="monotone" dataKey="memory" stroke="#3b82f6" fillOpacity={1} fill="url(#colorMem)" name="Memory %" />
            </AreaChart>
            </ResponsiveContainer>
        </div>
      </div>

      {/* Network */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg flex flex-col">
        <h3 className="text-slate-400 text-sm font-semibold mb-4">Network Activity (KB/s)</h3>
        <div className="flex-1 w-full min-h-[150px]">
            <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
                 <defs>
                    <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" hide />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                    itemStyle={{ fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="network" stroke="#10b981" fillOpacity={1} fill="url(#colorNet)" name="Network" />
            </AreaChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
