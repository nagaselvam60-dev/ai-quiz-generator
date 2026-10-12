import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import {
    UserCircleIcon,
    ShieldCheckIcon,
    CpuChipIcon,
    ArrowRightOnRectangleIcon,
    IdentificationIcon,
    EnvelopeIcon,
    CalendarIcon,
    CircleStackIcon,
} from '@heroicons/react/24/outline';

export default function ProfilePage() {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
            <Navbar />
            <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
                
                {/* Title */}
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">Account & System Profile</h1>
                    <p className="text-slate-400 text-sm mt-1">Manage your credentials and view engine configurations.</p>
                </div>

                {/* Profile Identity Card */}
                <div className="card space-y-6">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white text-3xl font-extrabold shadow-xl shadow-indigo-600/30">
                            {user?.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="text-center sm:text-left space-y-1">
                            <div className="flex items-center gap-2 justify-center sm:justify-start">
                                <h2 className="text-2xl font-bold text-white">{user?.name || 'Registered User'}</h2>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    Active
                                </span>
                            </div>
                            <p className="text-sm text-slate-400">{user?.email}</p>
                            <p className="text-xs text-slate-500 flex items-center gap-1 justify-center sm:justify-start pt-1">
                                <CalendarIcon className="w-3.5 h-3.5" />
                                <span>Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recent'}</span>
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800">
                        <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/80">
                            <span className="text-[11px] font-semibold uppercase text-slate-500 flex items-center gap-1.5 mb-1">
                                <IdentificationIcon className="w-3.5 h-3.5" />
                                User ID
                            </span>
                            <span className="text-sm font-mono font-bold text-slate-200">#{user?.id || '1'}</span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/80">
                            <span className="text-[11px] font-semibold uppercase text-slate-500 flex items-center gap-1.5 mb-1">
                                <EnvelopeIcon className="w-3.5 h-3.5" />
                                Email Status
                            </span>
                            <span className="text-sm font-semibold text-emerald-400">Verified</span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/80">
                            <span className="text-[11px] font-semibold uppercase text-slate-500 flex items-center gap-1.5 mb-1">
                                <CircleStackIcon className="w-3.5 h-3.5" />
                                Database
                            </span>
                            <span className="text-sm font-semibold text-emerald-400">PostgreSQL Connected</span>
                        </div>
                    </div>
                </div>

                {/* System & Architecture Info */}
                <div className="card space-y-4">
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                        <CpuChipIcon className="w-5 h-5 text-indigo-400" />
                        <span>Platform Engine Architecture</span>
                    </h2>
                    
                    <div className="space-y-3">
                        <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 space-y-1">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">AI Question Generation</p>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                                    Gemini 1.5 Flash + Fallback Bank
                                </span>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed">
                                Questions are synthesized using Google Gemini AI, with auto-fallback to the curated 50+ subject repository when offline or unconfigured.
                            </p>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-1">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Adaptive Difficulty Engine</p>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                                    Dynamic Calibration
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Evaluates responses in real-time. Correct answers elevate subsequent question complexity (Easy → Medium → Hard → Expert).
                            </p>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <ShieldCheckIcon className="w-5 h-5 text-emerald-400" />
                                <div>
                                    <p className="text-xs font-bold text-white">Bcrypt & JWT Authentication</p>
                                    <p className="text-[11px] text-slate-400">Tokens encrypted and stored securely in local browser storage.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sign Out Button */}
                <div className="pt-2">
                    <button
                        onClick={() => {
                            logout();
                            window.location.href = '/login';
                        }}
                        className="btn-danger w-full py-3.5 flex items-center justify-center gap-2 text-sm font-bold shadow-lg"
                    >
                        <ArrowRightOnRectangleIcon className="w-4 h-4" />
                        <span>Sign Out of Account</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
