import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import {
    SparklesIcon,
    EnvelopeIcon,
    LockClosedIcon,
    EyeIcon,
    EyeSlashIcon,
    CheckCircleIcon,
} from '@heroicons/react/24/outline';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(form.email, form.password);
            toast.success('Welcome back!');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-950">
            {/* Ambient Lighting Orbs */}
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-md space-y-6 relative z-10 animate-slide-up">
                {/* Brand Header */}
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 shadow-xl shadow-indigo-600/30 mb-2">
                        <SparklesIcon className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">
                        Sign in to <span className="gradient-text">QuizGen AI</span>
                    </h1>
                    <p className="text-slate-400 text-sm">
                        Adaptive assessments and intelligent exam analytics
                    </p>
                </div>

                {/* Login Card */}
                <div className="card shadow-2xl p-7 border-slate-800">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="label">Email Address</label>
                            <div className="relative">
                                <EnvelopeIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="email"
                                    className="input pl-10"
                                    placeholder="you@example.com"
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="label">Password</label>
                            <div className="relative">
                                <LockClosedIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="input pl-10 pr-10"
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                                >
                                    {showPassword ? (
                                        <EyeSlashIcon className="w-4 h-4" />
                                    ) : (
                                        <EyeIcon className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-3.5 text-sm font-bold shadow-xl shadow-indigo-600/30"
                        >
                            {loading ? 'Authenticating...' : 'Sign In to Account'}
                        </button>
                    </form>

                    <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
                        <p className="text-slate-400 text-xs">
                            Don't have an account yet?{' '}
                            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-bold hover:underline">
                                Create an account →
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Features Highlights */}
                <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
                        <p className="text-[11px] font-bold text-white">Dynamic AI</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Custom Questions</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
                        <p className="text-[11px] font-bold text-indigo-400">Adaptive</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">4 Difficulty Tiers</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
                        <p className="text-[11px] font-bold text-emerald-400">Analytics</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Deep Reports</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
