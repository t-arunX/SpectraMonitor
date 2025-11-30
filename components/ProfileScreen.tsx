import React from 'react';
import { User, Mail, Shield, Key } from 'lucide-react';

const ProfileScreen: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full bg-slate-950 p-8 animate-fade-in">
        <div className="bg-[#1e293b] w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-800 overflow-hidden">
            {/* Header / Cover */}
            <div className="h-32 bg-gradient-to-r from-[#607AD6] to-purple-600 relative">
                <div className="absolute -bottom-10 left-8">
                    <div className="w-24 h-24 bg-slate-900 rounded-full p-1">
                         <div className="w-full h-full bg-slate-700 rounded-full flex items-center justify-center text-2xl">👨‍💻</div>
                    </div>
                </div>
            </div>

            <div className="pt-12 px-8 pb-8">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Admin User</h1>
                        <p className="text-slate-400">Senior DevOps Engineer</p>
                    </div>
                    <button className="bg-[#607AD6] text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg hover:bg-blue-600 transition">
                        Edit Profile
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                        <div className="flex items-center gap-3 mb-2 text-slate-300">
                            <Mail size={18} /> <span className="text-sm font-semibold">Email</span>
                        </div>
                        <div className="text-white">admin@spectramonitor.io</div>
                    </div>
                    <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                        <div className="flex items-center gap-3 mb-2 text-slate-300">
                            <Shield size={18} /> <span className="text-sm font-semibold">Role</span>
                        </div>
                        <div className="text-white">Super Admin</div>
                    </div>
                </div>

                <div className="mt-8">
                    <h3 className="text-lg font-semibold text-white mb-4">Security</h3>
                    <div className="space-y-3">
                         <button className="w-full flex items-center justify-between p-4 bg-slate-900 rounded-xl hover:bg-slate-800 transition group border border-slate-800">
                            <div className="flex items-center gap-3 text-slate-300 group-hover:text-white">
                                <Key size={18} /> Change Password
                            </div>
                            <span className="text-slate-500">Last changed 30 days ago</span>
                         </button>
                         <button className="w-full flex items-center justify-between p-4 bg-slate-900 rounded-xl hover:bg-slate-800 transition group border border-slate-800">
                            <div className="flex items-center gap-3 text-slate-300 group-hover:text-white">
                                <Shield size={18} /> Two-Factor Authentication
                            </div>
                            <span className="text-green-500 text-sm font-bold">Enabled</span>
                         </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ProfileScreen;