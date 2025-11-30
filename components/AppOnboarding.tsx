
import React, { useState } from 'react';
import { AppDefinition } from '../types';
import { apiClient } from '../services/apiClient';
import { Check, Copy, Terminal, Smartphone, Globe, Layers, ArrowRight, Loader2 } from 'lucide-react';

interface AppOnboardingProps {
    onComplete: (app: AppDefinition) => void;
    onCancel: () => void;
}

const AppOnboarding: React.FC<AppOnboardingProps> = ({ onComplete, onCancel }) => {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        platform: 'flutter',
        description: '',
        icon: '📱'
    });
    const [createdApp, setCreatedApp] = useState<AppDefinition | null>(null);

    const handleCreate = async () => {
        setIsLoading(true);
        try {
            const newApp = await apiClient.createApp({
                name: formData.name,
                platform: formData.platform as any,
                description: formData.description,
                icon: formData.icon
            });
            setCreatedApp(newApp);
            setStep(2);
        } catch (error) {
            console.error("Error creating app", error);
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Toast logic could go here
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 items-center justify-center p-6 animate-fade-in">
            <div className="w-full max-w-2xl bg-white dark:bg-[#1e293b] rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                
                {/* Header */}
                <div className="bg-slate-900 px-8 py-6 border-b border-slate-800">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">Setup New Application</h2>
                        <div className="flex items-center gap-2 text-sm">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-[#607AD6] text-white' : 'bg-slate-700 text-slate-400'}`}>1</span>
                            <div className={`w-8 h-0.5 ${step >= 2 ? 'bg-[#607AD6]' : 'bg-slate-700'}`}></div>
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-[#607AD6] text-white' : 'bg-slate-700 text-slate-400'}`}>2</span>
                            <div className={`w-8 h-0.5 ${step >= 3 ? 'bg-[#607AD6]' : 'bg-slate-700'}`}></div>
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-[#607AD6] text-white' : 'bg-slate-700 text-slate-400'}`}>3</span>
                        </div>
                    </div>
                </div>

                {/* Step 1: App Details */}
                {step === 1 && (
                    <div className="p-8">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Application Name</label>
                                <input 
                                    type="text" 
                                    className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-[#607AD6] focus:border-transparent outline-none transition-all dark:text-white"
                                    placeholder="e.g. Driver App Pro"
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Platform</label>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        {id: 'flutter', name: 'Flutter', icon: Smartphone},
                                        {id: 'ios', name: 'Native iOS', icon: Smartphone},
                                        {id: 'android', name: 'Native Android', icon: Smartphone},
                                        {id: 'react-native', name: 'React Native', icon: Layers},
                                    ].map(p => (
                                        <div 
                                            key={p.id}
                                            onClick={() => setFormData({...formData, platform: p.id})}
                                            className={`cursor-pointer p-4 rounded-xl border flex items-center gap-3 transition-all ${formData.platform === p.id ? 'border-[#607AD6] bg-[#607AD6]/5 ring-1 ring-[#607AD6]' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                        >
                                            <p.icon className={formData.platform === p.id ? 'text-[#607AD6]' : 'text-slate-400'} size={20} />
                                            <span className={`font-medium ${formData.platform === p.id ? 'text-[#607AD6]' : 'text-slate-600 dark:text-slate-300'}`}>{p.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Description (Optional)</label>
                                <textarea 
                                    className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-[#607AD6] focus:border-transparent outline-none transition-all dark:text-white h-24 resize-none"
                                    placeholder="Monitoring production environment..."
                                    value={formData.description}
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-8 border-t border-slate-100 dark:border-slate-800 pt-6">
                            <button onClick={onCancel} className="px-6 py-2.5 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium">Cancel</button>
                            <button 
                                onClick={handleCreate}
                                disabled={!formData.name || isLoading}
                                className="px-6 py-2.5 rounded-lg bg-[#607AD6] hover:bg-blue-600 text-white font-medium shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isLoading ? <Loader2 className="animate-spin" size={18}/> : 'Create & Continue'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Integration */}
                {step === 2 && createdApp && (
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Check size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Application Created Successfully!</h3>
                            <p className="text-slate-500 dark:text-slate-400 mt-2">Integrate the SDK to start receiving real-time data.</p>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 relative group">
                                <label className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2 block">Your API Key</label>
                                <div className="font-mono text-green-400 text-lg break-all pr-10">{createdApp.apiKey}</div>
                                <button 
                                    onClick={() => copyToClipboard(createdApp.apiKey || '')}
                                    className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors p-1"
                                    title="Copy Key"
                                >
                                    <Copy size={18} />
                                </button>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">SDK Initialization (Flutter)</label>
                                <div className="bg-[#1e1e1e] rounded-xl p-4 border border-slate-800 font-mono text-sm text-slate-300 overflow-x-auto">
                                    <p className="text-purple-400">import</p> <p className="text-orange-300 inline">'package:spectra_monitor/spectra.dart'</p>;<br/><br/>
                                    <p className="text-purple-400">void</p> main() {'{'}<br/>
                                    &nbsp;&nbsp;Spectra.init(<br/>
                                    &nbsp;&nbsp;&nbsp;&nbsp;apiKey: <span className="text-green-400">"{createdApp.apiKey}"</span>,<br/>
                                    &nbsp;&nbsp;&nbsp;&nbsp;endpoint: <span className="text-orange-300">"https://api.spectramonitor.io"</span><br/>
                                    &nbsp;&nbsp;);<br/>
                                    &nbsp;&nbsp;runApp(MyApp());<br/>
                                    {'}'}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mt-8 border-t border-slate-100 dark:border-slate-800 pt-6">
                            <button onClick={() => setStep(1)} className="text-slate-400 hover:text-slate-600 text-sm">Back to details</button>
                            <button 
                                onClick={() => setStep(3)}
                                className="px-6 py-2.5 rounded-lg bg-[#607AD6] hover:bg-blue-600 text-white font-medium shadow-lg flex items-center gap-2"
                            >
                                Verify Connection <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                )}

                 {/* Step 3: Verification (Simulated) */}
                 {step === 3 && createdApp && (
                    <div className="p-8 text-center">
                        <div className="max-w-md mx-auto py-12">
                             <div className="mb-6 relative">
                                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-300">
                                    <Smartphone size={40} />
                                </div>
                                <div className="absolute top-0 right-1/2 translate-x-10 -translate-y-2">
                                     <span className="flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#607AD6] opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#607AD6]"></span>
                                    </span>
                                </div>
                             </div>
                             
                             <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Waiting for first signal...</h3>
                             <p className="text-slate-500 dark:text-slate-400 mb-8">Run your app with the SDK initialized. We'll automatically detect when data starts flowing.</p>

                             <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900 p-4 rounded-lg text-sm text-blue-800 dark:text-blue-300 mb-8">
                                ℹ️ Tip: Check your debug console for "Spectra Connected" logs.
                             </div>

                             <button 
                                onClick={() => onComplete(createdApp)}
                                className="px-8 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:shadow-xl transition-all"
                            >
                                Skip & Go to Dashboard
                            </button>
                        </div>
                    </div>
                 )}
            </div>
        </div>
    );
};

export default AppOnboarding;
