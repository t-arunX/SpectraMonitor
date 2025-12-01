
import React, { useState } from 'react';
import { AppDefinition } from '../types';
import { Plus, LayoutGrid, Smartphone, ChevronRight, Trash2 } from 'lucide-react';
import { apiClient } from '../services/apiClient';

interface AppSelectorProps {
    apps: AppDefinition[];
    onSelect: (appId: string) => void;
    onCreate: () => void;
    onAppDeleted?: (appId: string) => void;
}

const AppSelector: React.FC<AppSelectorProps> = ({ apps, onSelect, onCreate, onAppDeleted }) => {
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (e: React.MouseEvent, appId: string) => {
        e.stopPropagation();
        if (confirm('Delete this app and all its devices? This cannot be undone.')) {
            try {
                await apiClient.deleteApp(appId);
                onAppDeleted?.(appId);
            } catch (err) {
                console.error('Failed to delete app:', err);
            }
        }
    };
    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 p-8 overflow-y-auto">
            <div className="max-w-6xl mx-auto w-full">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">Select Application</h1>
                        <p className="text-slate-500 dark:text-slate-400">Choose a project to monitor or configure a new one.</p>
                    </div>
                    <button 
                        onClick={onCreate}
                        className="px-5 py-2.5 bg-[#607AD6] hover:bg-blue-600 text-white rounded-lg font-medium shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all hover:scale-105"
                    >
                        <Plus size={18} /> New App
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Create New Card (Alternative access) */}
                    <div 
                        onClick={onCreate}
                        className="group min-h-[180px] border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-[#607AD6] dark:hover:border-[#7B8DDB] hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-all"
                    >
                        <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500 group-hover:text-[#607AD6] group-hover:scale-110 transition-transform mb-3">
                            <Plus size={24} />
                        </div>
                        <h3 className="font-semibold text-slate-600 dark:text-slate-300 group-hover:text-[#607AD6]">Add New Application</h3>
                    </div>

                    {/* App List */}
                    {apps.map(app => (
                        <div 
                            key={app.id}
                            onClick={() => onSelect(app.id)}
                            className="group bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-[#607AD6]/50 dark:hover:border-[#7B8DDB]/50 transition-all cursor-pointer relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                <button
                                    onClick={(e) => handleDelete(e, app.id)}
                                    className="p-1.5 rounded hover:bg-red-500/20 hover:text-red-500 transition-colors"
                                    title="Delete app"
                                >
                                    <Trash2 size={16} />
                                </button>
                                <ChevronRight className="text-[#607AD6]" />
                            </div>

                            <div className="flex items-start justify-between mb-6">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center text-2xl shadow-inner">
                                    {app.icon || '📱'}
                                </div>
                                <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
                                    {app.platform}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{app.name}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 h-10">
                                {app.description}
                            </p>

                            <div className="flex items-center gap-4 text-xs font-mono text-slate-500 dark:text-slate-500 border-t border-slate-100 dark:border-slate-700 pt-4">
                                <span className="flex items-center gap-1">ID: {app.id.substring(0,8)}...</span>
                                {app.createdAt && <span>• {new Date(app.createdAt).toLocaleDateString()}</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AppSelector;
