import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';
import { Play, Pause, Trash2, Search, BrainCircuit, AlertTriangle, Info, FileText } from 'lucide-react';
import { analyzeLogs, summarizeLogs } from '../services/geminiService';

interface LogViewerProps {
  logs: LogEntry[];
  isPaused: boolean;
  setPaused: (paused: boolean) => void;
  onClear: () => void;
  isLoading?: boolean;
}

const LogViewer: React.FC<LogViewerProps> = ({ logs, isPaused, setPaused, onClear, isLoading }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = React.useState('');
  const [aiAnalysis, setAiAnalysis] = React.useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [summary, setSummary] = React.useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = React.useState(false);
  const [showClearConfirm, setShowClearConfirm] = React.useState(false);

  // Auto-scroll to bottom unless paused or user scrolled up (simplified to always scroll if not paused)
  useEffect(() => {
    if (!isPaused && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isPaused]);

  const filteredLogs = logs.filter(log => 
    log.message.toLowerCase().includes(filter.toLowerCase()) || 
    log.tag?.toLowerCase().includes(filter.toLowerCase())
  );

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAiAnalysis(null);
    const result = await analyzeLogs(logs.slice(-20)); // Analyze last 20 logs
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  const handleSummarize = async () => {
    setIsSummarizing(true);
    setSummary(null);
    const result = await summarizeLogs(logs);
    setSummary(result);
    setIsSummarizing(false);
  };

  const confirmClear = () => {
      onClear();
      setShowClearConfirm(false);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-red-400';
      case 'warn': return 'text-yellow-400';
      case 'debug': return 'text-blue-400';
      default: return 'text-slate-300';
    }
  };

  if (isLoading) {
      return (
          <div className="flex flex-col h-full bg-[#0f172a] border border-slate-800 rounded-lg shadow-sm overflow-hidden p-4 space-y-2">
              <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-2">
                      <div className="w-24 h-8 bg-slate-800 rounded animate-pulse"></div>
                      <div className="w-24 h-8 bg-slate-800 rounded animate-pulse"></div>
                  </div>
                  <div className="w-24 h-8 bg-slate-800 rounded animate-pulse"></div>
              </div>
              {[1,2,3,4,5,6,7,8,9,10].map(i => (
                  <div key={i} className="h-6 bg-slate-800 rounded animate-pulse w-full opacity-60"></div>
              ))}
          </div>
      )
  }

  return (
    <div className="flex flex-col h-full bg-[#0f172a] border border-slate-800 rounded-lg shadow-sm overflow-hidden relative">
      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
          <div className="absolute inset-0 z-50 bg-black/60 flex items-center justify-center backdrop-blur-sm p-4">
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-2xl max-w-sm w-full text-center">
                  <div className="w-12 h-12 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Trash2 size={24} />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">Clear All Logs?</h3>
                  <p className="text-slate-400 text-sm mb-6">This action cannot be undone. Are you sure you want to remove all captured logs?</p>
                  <div className="flex justify-center gap-4">
                      <button onClick={() => setShowClearConfirm(false)} className="px-4 py-2 text-slate-300 hover:bg-slate-800 rounded-lg text-sm font-medium transition-colors">Cancel</button>
                      <button onClick={confirmClear} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors shadow-lg">Clear Logs</button>
                  </div>
              </div>
          </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center space-x-2">
           <div className="relative">
             <Search className="absolute left-2 top-1.5 w-4 h-4 text-slate-500" />
             <input 
                type="text" 
                placeholder="Filter logs..." 
                className="bg-slate-800 text-slate-200 text-sm pl-8 pr-2 py-1 rounded border border-slate-700 focus:outline-none focus:border-blue-500 w-48 transition-colors"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
             />
           </div>
           
           <button 
             onClick={() => setShowClearConfirm(true)}
             className="px-3 py-1 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded transition-colors text-xs font-medium flex items-center gap-1"
             title="Clear Logs"
           >
             <Trash2 size={14} /> Clear All
           </button>

           <button 
             onClick={() => setPaused(!isPaused)}
             className={`p-1.5 rounded transition-colors ${isPaused ? 'text-yellow-400 bg-yellow-400/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
             title={isPaused ? "Resume Auto-scroll" : "Pause Auto-scroll"}
           >
             {isPaused ? <Play size={16} /> : <Pause size={16} />}
           </button>
        </div>
        
        <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500">{logs.length} events</span>
             <button 
                onClick={handleSummarize}
                disabled={isSummarizing || logs.length === 0}
                className="flex items-center space-x-1 px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white text-xs rounded transition-colors disabled:opacity-50"
             >
                <FileText size={14} />
                <span>{isSummarizing ? 'Summarizing...' : 'Summarize'}</span>
             </button>
             <button 
                onClick={handleAnalyze}
                disabled={isAnalyzing || logs.length === 0}
                className="flex items-center space-x-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded transition-colors disabled:opacity-50"
             >
                <BrainCircuit size={14} />
                <span>{isAnalyzing ? 'Analyzing...' : 'Ask AI'}</span>
             </button>
        </div>
      </div>

      {/* AI Summary Panel */}
      {summary && (
        <div className="p-4 bg-slate-800/50 border-b border-slate-700 text-slate-200 text-sm max-h-48 overflow-y-auto animate-fade-in">
            <div className="flex justify-between items-start mb-2 sticky top-0 bg-slate-800/90 p-1 rounded backdrop-blur-sm">
                <h4 className="font-semibold flex items-center gap-2 text-indigo-300"><FileText size={16}/> Log Summary</h4>
                <button onClick={() => setSummary(null)} className="text-slate-400 hover:text-white transition-colors">×</button>
            </div>
            <p className="whitespace-pre-wrap font-mono text-xs leading-relaxed">{summary}</p>
        </div>
      )}

      {/* AI Analysis Panel */}
      {aiAnalysis && (
        <div className="p-4 bg-indigo-900/20 border-b border-indigo-500/30 text-indigo-200 text-sm overflow-y-auto max-h-48 animate-fade-in">
            <div className="flex justify-between items-start mb-2 sticky top-0 bg-indigo-900/90 p-1 rounded backdrop-blur-sm">
                <h4 className="font-semibold flex items-center gap-2"><BrainCircuit size={16}/> Analysis Result</h4>
                <button onClick={() => setAiAnalysis(null)} className="text-indigo-400 hover:text-white transition-colors">×</button>
            </div>
            <p className="whitespace-pre-wrap font-mono text-xs leading-relaxed">{aiAnalysis}</p>
        </div>
      )}

      {/* Logs Area */}
      <div className="flex-1 overflow-y-auto p-2 font-mono text-xs space-y-1">
        {filteredLogs.map((log) => (
          <div key={log.id} className="flex hover:bg-slate-800/50 rounded px-1 py-0.5 group transition-colors">
            <span className="text-slate-500 min-w-[80px] select-none">{log.timestamp}</span>
            <span className={`w-12 font-bold uppercase select-none ${getLevelColor(log.level)}`}>{log.level}</span>
            <span className="text-slate-400 mr-2 select-none border border-slate-700 rounded px-1 text-[10px] h-fit self-center">{log.tag}</span>
            <span className="text-slate-300 break-all">{log.message}</span>
          </div>
        ))}
        {filteredLogs.length === 0 && (
            <div className="text-center text-slate-600 mt-10">No logs matching filter</div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default LogViewer;