import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import client from '../api/client';
import {
    ClockIcon,
    MagnifyingGlassIcon,
    SparklesIcon,
    CheckCircleIcon,
    ArrowRightIcon,
    AcademicCapIcon,
} from '@heroicons/react/24/outline';

export default function HistoryPage() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        client.get('/api/history')
            .then(r => setHistory(r.data.history || []))
            .finally(() => setLoading(false));
    }, []);

    const getScoreBadge = (pct) => {
        if (pct >= 80) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
        if (pct >= 60) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    };

    const filtered = history.filter(item => {
        const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const completedQuizzes = history.filter(h => h.status === 'completed');
    const avgScore = completedQuizzes.length > 0
        ? Math.round(completedQuizzes.reduce((acc, curr) => acc + (curr.percentage || 0), 0) / completedQuizzes.length)
        : 0;

    return (
        <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
            <Navbar />
            <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
                
                {/* Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
                            <ClockIcon className="w-3.5 h-3.5" />
                            <span>Learning Timeline</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                            Quiz Attempt History
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">
                            Review all your completed assessments, scores, and improvement trajectories.
                        </p>
                    </div>

                    <Link to="/create-quiz" className="btn-primary text-xs py-2.5 px-4 self-start sm:self-auto flex items-center gap-2">
                        <SparklesIcon className="w-4 h-4" />
                        <span>Create New Quiz</span>
                    </Link>
                </div>

                {/* KPI Summary Cards */}
                {history.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="card p-5">
                            <p className="text-xs uppercase font-semibold text-slate-400">Total Attempts</p>
                            <p className="text-3xl font-extrabold text-white mt-1">{history.length}</p>
                            <p className="text-xs text-slate-500 mt-1">{completedQuizzes.length} completed</p>
                        </div>
                        <div className="card p-5">
                            <p className="text-xs uppercase font-semibold text-slate-400">Average Performance</p>
                            <p className="text-3xl font-extrabold text-indigo-400 mt-1">{avgScore}%</p>
                            <p className="text-xs text-slate-500 mt-1">Across all completed quizzes</p>
                        </div>
                        <div className="card p-5">
                            <p className="text-xs uppercase font-semibold text-slate-400">Best Achievement</p>
                            <p className="text-3xl font-extrabold text-emerald-400 mt-1">
                                {history.length > 0 ? Math.max(...history.map(h => h.percentage || 0)) : 0}%
                            </p>
                            <p className="text-xs text-slate-500 mt-1">Highest scored session</p>
                        </div>
                    </div>
                )}

                {/* Filters & Search */}
                <div className="card p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full sm:w-80">
                        <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Filter by quiz title or topic..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="input pl-10 py-2 text-xs"
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        {['all', 'completed', 'in_progress'].map(st => (
                            <button
                                key={st}
                                onClick={() => setFilterStatus(st)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all border ${
                                    filterStatus === st
                                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-white'
                                }`}
                            >
                                {st.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                </div>

                {/* History Table / Content */}
                {loading ? (
                    <div className="card text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent mb-4" />
                        <p className="text-slate-400 text-sm">Loading historical data...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="card text-center py-16 space-y-4">
                        <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto">
                            <AcademicCapIcon className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">No quiz records found</h3>
                            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                                {searchTerm ? 'No results matched your search query.' : 'You have not taken any quizzes yet. Generate one now!'}
                            </p>
                        </div>
                        {!searchTerm && (
                            <Link to="/create-quiz" className="btn-primary text-xs py-2 px-5 inline-flex items-center gap-2">
                                <SparklesIcon className="w-4 h-4" />
                                <span>Create Quiz</span>
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="card overflow-hidden p-0 border-slate-800">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 text-xs uppercase font-semibold">
                                        <th className="text-left py-4 px-6">Assessment Title</th>
                                        <th className="text-left py-4 px-4 hidden md:table-cell">Questions</th>
                                        <th className="text-left py-4 px-4">Score</th>
                                        <th className="text-left py-4 px-4 hidden sm:table-cell">Date Attempted</th>
                                        <th className="text-left py-4 px-4">Status</th>
                                        <th className="text-right py-4 px-6">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60">
                                    {filtered.map((item) => (
                                        <tr
                                            key={item.attempt_id}
                                            className="hover:bg-slate-800/30 transition-colors group"
                                        >
                                            <td className="py-4 px-6">
                                                <p className="font-semibold text-white group-hover:text-indigo-400 transition-colors">
                                                    {item.title}
                                                </p>
                                            </td>
                                            <td className="py-4 px-4 hidden md:table-cell text-slate-400 text-xs">
                                                {item.questions} Questions
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className={`inline-block px-2.5 py-0.5 rounded-full border text-xs font-bold ${getScoreBadge(item.percentage)}`}>
                                                    {item.percentage}%
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 hidden sm:table-cell text-xs text-slate-400">
                                                {new Date(item.date).toLocaleDateString(undefined, {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className={`inline-block text-xs px-2.5 py-0.5 rounded-full font-medium ${
                                                    item.status === 'completed'
                                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                }`}>
                                                    {item.status === 'completed' ? 'Completed' : 'In Progress'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                {item.status === 'completed' ? (
                                                    <Link
                                                        to={`/results/${item.attempt_id}`}
                                                        className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:underline"
                                                    >
                                                        <span>Report</span>
                                                        <ArrowRightIcon className="w-3.5 h-3.5" />
                                                    </Link>
                                                ) : (
                                                    <Link
                                                        to={`/quiz/${item.quiz_id}`}
                                                        className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 hover:underline"
                                                    >
                                                        <span>Resume</span>
                                                        <ArrowRightIcon className="w-3.5 h-3.5" />
                                                    </Link>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
