
import React from 'react';
import { X, Book, Monitor, Database, Terminal, Shield, BarChart3, Settings } from 'lucide-react';

interface UserGuideProps {
    isOpen: boolean;
    onClose: () => void;
}

const UserGuide: React.FC<UserGuideProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white dark:bg-[#1e293b] w-full max-w-4xl h-[80vh] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col animate-fade-in-up">
                
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#607AD6]/10 rounded-lg">
                            <Book className="text-[#607AD6]" size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">SpectraMonitor User Guide</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Complete documentation for developers & admins</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 bg-white dark:bg-[#0f172a]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        
                        <Section 
                            icon={Monitor} 
                            title="Device Monitoring" 
                            description="Monitor active user sessions in real-time. View screen mirrors, check battery/network status, and track session duration."
                        >
                            <ul className="list-disc ml-4 space-y-1 text-slate-600 dark:text-slate-400 text-sm mt-2">
                                <li>Use <b>Screen Mirror</b> to see user activity.</li>
                                <li>Request interaction permission for touch controls.</li>
                                <li>View network quality graphs in Overview.</li>
                            </ul>
                        </Section>

                        <Section 
                            icon={Terminal} 
                            title="Logs & Debugging" 
                            description="Access real-time application logs. Use AI to analyze errors and detect anomalies automatically."
                        >
                             <ul className="list-disc ml-4 space-y-1 text-slate-600 dark:text-slate-400 text-sm mt-2">
                                <li>Filter logs by tag or level.</li>
                                <li>Click <b>Ask AI</b> for automated root cause analysis.</li>
                                <li>View crash stack traces with source mapping.</li>
                            </ul>
                        </Section>

                        <Section 
                            icon={Database} 
                            title="Database & Files" 
                            description="Inspect and modify the app's local database (Realm/SQLite) and Sandbox file system."
                        >
                             <ul className="list-disc ml-4 space-y-1 text-slate-600 dark:text-slate-400 text-sm mt-2">
                                <li>CRUD operations on database nodes.</li>
                                <li>Download sandbox files directly.</li>
                                <li>Execute custom queries.</li>
                            </ul>
                        </Section>

                         <Section 
                            icon={Shield} 
                            title="Remote Configuration" 
                            description="Manage feature flags and rollout percentages instantly without app store updates."
                        >
                             <ul className="list-disc ml-4 space-y-1 text-slate-600 dark:text-slate-400 text-sm mt-2">
                                <li>Toggle features on/off globally.</li>
                                <li>Set percentage-based rollouts.</li>
                                <li>A/B test configuration overrides.</li>
                            </ul>
                        </Section>

                         <Section 
                            icon={BarChart3} 
                            title="Analytics & Funnels" 
                            description="Track user journeys, retention rates, and conversion funnels."
                        >
                             <ul className="list-disc ml-4 space-y-1 text-slate-600 dark:text-slate-400 text-sm mt-2">
                                <li>Visualize drop-off points in Funnels.</li>
                                <li>View Interaction Heatmaps.</li>
                                <li>Monitor App Health Scores (0-100).</li>
                            </ul>
                        </Section>

                        <Section 
                            icon={Settings} 
                            title="SDK Integration" 
                            description="How to integrate SpectraMonitor into your mobile application."
                        >
                             <div className="bg-slate-100 dark:bg-slate-900 p-3 rounded-lg mt-2 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-600 dark:text-slate-300">
                                 Spectra.init({'{'}<br/>
                                 &nbsp;&nbsp;apiKey: "sk_live...",<br/>
                                 &nbsp;&nbsp;enableCrashReporting: true<br/>
                                 {'}'});
                             </div>
                        </Section>

                    </div>
                </div>

                <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-center text-sm text-slate-500 dark:text-slate-400">
                    Need more help? Contact support@spectramonitor.io
                </div>
            </div>
        </div>
    );
};

const Section: React.FC<{icon: any, title: string, description: string, children: React.ReactNode}> = ({ icon: Icon, title, description, children }) => (
    <div className="flex gap-4">
        <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300">
                <Icon size={20} />
            </div>
        </div>
        <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>
            {children}
        </div>
    </div>
);

export default UserGuide;
