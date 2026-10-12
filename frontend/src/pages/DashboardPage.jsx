import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import client from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import {
    AcademicCapIcon,
    ChartBarIcon,
    TrophyIcon,
    QuestionMarkCircleIcon,
    SparklesIcon,
    BoltIcon,
    ArrowTrendingUpIcon,
    ChevronRightIcon,
    PlayIcon,
} from '@heroicons/react/24/outline';

const QUICK_TOPICS = [
    { subject: 'Python', topic: 'Functions & Data Types', icon: '🐍', color: 'from-blue-600/30 to-indigo-600/30' },
    { subject: 'Machine Learning', topic: 'Neural Networks', icon: '🧠', color: 'from-purple-600/30 to-pink-600/30' },
    { subject: 'Data Structures', topic: 'Trees & Graphs', icon: '🌲', color: 'from-emerald-600/30 to-teal-600/30' },
    { subject: 'Cybersecurity', topic: 'Network Security', icon: '🛡️', color: 'from-amber-600/30 to-orange-600/30' },
];

function StatCard({ icon: Icon, label, value, subtext, gradient, glowColor }) {
    return (
        <div className="relative group overflow-hidden bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-5 shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${gradient} opacity-10 rounded-full blur-xl group-hover:opacity-20 transition-opacity`} />
            <div className="flex items-center gap-3.5 mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-md ${glowColor}`}>
                    <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
            </div>
            <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{value}</p>
                {subtext && <p className="text-xs text-slate-400 mt-1 font-medium truncate">{subtext}</p>}
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        client.get('/api/dashboard')
            .then(r => setData(r.data))
            .catch(() => setData(null))
            .finally(() => setLoading(false));
    }, []);

    const getScoreColor = (pct) => {
        if (pct >= 80) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
        if (pct >= 60) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    };

    const handleQuickStart = (subject, topic) => {
        navigate('/create-quiz', { state: { prefillSubject: subject, prefillTopic: topic } });
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <Navbar />
            <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
                
                {/* Hero Greeting Card */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-indigo-950/50 backdrop-blur-xl border border-slate-800 p-6 sm:p-8 shadow-2xl">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-1/3 -mb-10 w-60 h-60 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
                                <SparklesIcon className="w-3.5 h-3.5" />
                                <span>AI Adaptive Engine Ready</span>
                            </div>
                            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                                Welcome back, <span className="gradient-text">{user?.name || 'Learner'}</span> 👋
                            </h1>
                            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
                                Test your skills with dynamically generated questions that adjust difficulty automatically as you learn.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link
                                to="/create-quiz"
                                className="btn-primary text-sm py-3 px-6 shadow-xl shadow-indigo-600/30"
                            >
                                <SparklesIcon className="w-4 h-4 mr-2" />
                                <span>Start New Quiz</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="card text-center py-24">
                        <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent mb-4" />
                        <p className="text-slate-400 text-sm font-medium">Loading your personalized dashboard...</p>
                    </div>
                ) : (
                    <>
                        {/* Stats Grid */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <ArrowTrendingUpIcon className="w-5 h-5 text-indigo-400" />
                                    <span>Learning Analytics</span>
                                </h2>
                                <span className="text-xs text-slate-500 font-medium">Real-time metrics</span>
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                                <StatCard
                                    icon={AcademicCapIcon}
                                    label="Total Quizzes"
                                    value={data?.total_quizzes ?? 0}
                                    subtext="Completed tests"
                                    gradient="from-blue-600 to-indigo-600"
                                    glowColor="shadow-blue-500/30"
                                />
                                <StatCard
                                    icon={ChartBarIcon}
                                    label="Average Score"
                                    value={`${data?.average_score ?? 0}%`}
                                    subtext="Across all subjects"
                                    gradient="from-violet-600 to-purple-600"
                                    glowColor="shadow-violet-500/30"
                                />
                                <StatCard
                                    icon={TrophyIcon}
                                    label="Best Score"
                                    value={`${data?.best_score ?? 0}%`}
                                    subtext="Personal record"
                                    gradient="from-amber-500 to-yellow-600"
                                    glowColor="shadow-amber-500/30"
                                />
                                <StatCard
                                    icon={QuestionMarkCircleIcon}
                                    label="Questions"
                                    value={data?.questions_attempted ?? 0}
                                    subtext="Attempted so far"
                                    gradient="from-emerald-500 to-teal-600"
                                    glowColor="shadow-emerald-500/30"
                                />
                                <StatCard
                                    icon={BoltIcon}
                                    label="Strongest"
                                    value={data?.strongest_topic || '—'}
                                    subtext="Highest accuracy"
                                    gradient="from-cyan-500 to-blue-600"
                                    glowColor="shadow-cyan-500/30"
                                />
                                <StatCard
                                    icon={SparklesIcon}
                                    label="Focus Area"
                                    value={data?.weakest_topic || '—'}
                                    subtext="Needs more practice"
                                    gradient="from-rose-500 to-pink-600"
                                    glowColor="shadow-rose-500/30"
                                />
                            </div>
                        </div>

                        {/* Quick Start Topics */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <SparklesIcon className="w-5 h-5 text-indigo-400" />
                                    <span>Popular Quiz Topics</span>
                                </h2>
                                <Link to="/create-quiz" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300">
                                    Explore all →
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {QUICK_TOPICS.map((item) => (
                                    <button
                                        key={item.subject}
                                        onClick={() => handleQuickStart(item.subject, item.topic)}
                                        className="text-left group relative overflow-hidden bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 hover:border-indigo-500/50 rounded-2xl p-4 shadow-lg hover:shadow-indigo-500/10 transition-all duration-200"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-2xl">{item.icon}</span>
                                            <span className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                                <PlayIcon className="w-3.5 h-3.5" />
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-white text-base group-hover:text-indigo-400 transition-colors">
                                            {item.subject}
                                        </h3>
                                        <p className="text-xs text-slate-400 mt-0.5">{item.topic}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Recent Quizzes */}
                        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-xl">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-lg font-bold text-white">Recent Quizzes</h2>
                                    <p className="text-xs text-slate-400">Review your past performance and answers</p>
                                </div>
                                <Link to="/history" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                                    <span>Full History</span>
                                    <ChevronRightIcon className="w-3.5 h-3.5" />
                                </Link>
                            </div>

                            {data?.recent_quizzes?.length > 0 ? (
                                <div className="space-y-3">
                                    {data.recent_quizzes.map((quiz) => (
                                        <div
                                            key={quiz.attempt_id}
                                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-950/50 border border-slate-800/60 hover:border-slate-700 transition-all"
                                        >
                                            <div className="flex items-center gap-3.5">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-sm font-bold shrink-0">
                                                    Q
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-white text-sm sm:text-base">
                                                        {quiz.title}
                                                    </h3>
                                                    <p className="text-xs text-slate-400">
                                                        {new Date(quiz.date).toLocaleDateString(undefined, {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-0 border-slate-800/60 pt-2 sm:pt-0">
                                                <div className="text-left sm:text-right">
                                                    <span className={`inline-block px-2.5 py-0.5 rounded-full border text-xs font-bold ${getScoreColor(quiz.percentage)}`}>
                                                        {quiz.percentage}%
                                                    </span>
                                                    <p className="text-[11px] text-slate-400 mt-0.5">
                                                        {quiz.score}/{quiz.total} correct
                                                    </p>
                                                </div>

                                                {quiz.status === 'completed' ? (
                                                    <Link
                                                        to={`/results/${quiz.attempt_id}`}
                                                        className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 px-3 py-1.5 rounded-xl transition-all"
                                                    >
                                                        Analysis →
                                                    </Link>
                                                ) : (
                                                    <Link
                                                        to={`/quiz/${quiz.quiz_id}`}
                                                        className="text-xs font-semibold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 px-3 py-1.5 rounded-xl transition-all"
                                                    >
                                                        Resume →
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 rounded-xl bg-slate-950/30 border border-dashed border-slate-800">
                                    <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto mb-3">
                                        <AcademicCapIcon className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-base font-bold text-white mb-1">No quizzes taken yet</h3>
                                    <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                                        Generate your first AI quiz to see adaptive scoring and performance analytics.
                                    </p>
                                    <Link
                                        to="/create-quiz"
                                        className="btn-primary text-xs py-2 px-4"
                                    >
                                        Create Your First Quiz
                                    </Link>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

