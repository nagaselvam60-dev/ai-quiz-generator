import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Cell, RadialBarChart, RadialBar,
} from 'recharts';
import Navbar from '../components/Navbar';
import client from '../api/client';
import {
    TrophyIcon,
    ArrowPathIcon,
    SparklesIcon,
    CheckCircleIcon,
    XCircleIcon,
    ArrowLeftIcon,
    DocumentChartBarIcon,
    LightBulbIcon,
    HomeIcon,
    ClockIcon,
} from '@heroicons/react/24/outline';

const DIFF_COLORS = { Easy: '#10b981', Medium: '#f59e0b', Hard: '#f97316', Expert: '#ef4444' };

function ScoreRing({ percentage }) {
    const color = percentage >= 80 ? '#10b981' : percentage >= 60 ? '#f59e0b' : '#ef4444';
    const data = [{ value: percentage, fill: color }, { value: 100 - percentage, fill: '#1e293b' }];
    
    let grade = 'C';
    if (percentage >= 90) grade = 'A+';
    else if (percentage >= 80) grade = 'A';
    else if (percentage >= 70) grade = 'B+';
    else if (percentage >= 60) grade = 'B';

    return (
        <div className="relative flex items-center justify-center w-48 h-48">
            <RadialBarChart
                width={190}
                height={190}
                innerRadius={65}
                outerRadius={85}
                data={data}
                startAngle={90}
                endAngle={-270}
                barSize={16}
            >
                <RadialBar dataKey="value" cornerRadius={8} />
            </RadialBarChart>
            <div className="absolute text-center">
                <p className="text-4xl font-extrabold text-white tracking-tight">{percentage}%</p>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-md text-xs font-extrabold bg-slate-800 text-indigo-400 border border-slate-700">
                    Grade {grade}
                </span>
            </div>
        </div>
    );
}

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
        return (
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 shadow-xl">
                <p className="text-white text-xs font-bold">{label}</p>
                <p className="text-indigo-400 text-xs font-semibold mt-1">Accuracy: {payload[0].value}%</p>
            </div>
        );
    }
    return null;
};

export default function ResultsPage() {
    const { attemptId } = useParams();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        client.get(`/api/reports/${attemptId}`)
            .then(r => setReport(r.data))
            .catch(() => setReport(null))
            .finally(() => setLoading(false));
    }, [attemptId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Navbar />
                <div className="text-center space-y-4">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent shadow-glow-indigo" />
                    <p className="text-slate-300 font-semibold">Compiling comprehensive analytics report...</p>
                </div>
            </div>
        );
    }

    if (!report) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Navbar />
                <div className="card text-center max-w-md p-8 space-y-4">
                    <p className="text-rose-400 font-bold">Failed to load performance report</p>
                    <Link to="/history" className="btn-primary inline-flex items-center gap-2">
                        <ArrowLeftIcon className="w-4 h-4" />
                        <span>Return to History</span>
                    </Link>
                </div>
            </div>
        );
    }

    const topicChartData = (report.topic_performance || []).map(t => ({
        name: t.topic.length > 14 ? t.topic.slice(0, 14) + '…' : t.topic,
        percentage: t.percentage,
        full: t.topic
    }));

    const diffChartData = (report.difficulty_performance || []).map(d => ({
        name: d.difficulty,
        percentage: d.percentage
    }));

    const strongTopics = report.strong_topics || [];
    const weakTopics = report.weak_topics || [];
    const recommendations = report.recommendations || [];

    return (
        <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
            <Navbar />
            <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
                
                {/* Hero Header Banner */}
                <div className="card bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-slate-800 p-6 sm:p-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-center md:text-left">
                            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
                                {report.subject} • {report.topic}
                            </span>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-3">
                                Performance Evaluation Report
                            </h1>
                            <p className="text-slate-400 text-sm mt-1">
                                Adaptive assessment results and AI learning recommendations
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link
                                to="/create-quiz"
                                className="btn-primary text-xs py-2.5 px-4 flex items-center gap-1.5"
                            >
                                <SparklesIcon className="w-4 h-4" />
                                <span>Create New Quiz</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Score & Key Metrics Row */}
                <div className="card p-6 sm:p-8">
                    <div className="flex flex-col lg:flex-row items-center justify-around gap-8">
                        {/* Radial Ring */}
                        <div className="flex flex-col items-center">
                            <ScoreRing percentage={report.percentage} />
                            <p className="text-xs font-semibold text-slate-400 mt-2 uppercase tracking-wider">
                                Overall Accuracy Score
                            </p>
                        </div>

                        {/* Metric Tiles */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full lg:max-w-xl">
                            {[
                                { label: 'Final Score', value: `${report.score} / ${report.total_questions}`, icon: TrophyIcon, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
                                { label: 'Correct Answers', value: report.correct, icon: CheckCircleIcon, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
                                { label: 'Incorrect', value: report.incorrect, icon: XCircleIcon, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
                                { label: 'Total Questions', value: report.total_questions, icon: DocumentChartBarIcon, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
                            ].map((item) => {
                                const Icon = item.icon;
                                return (
                                    <div
                                        key={item.label}
                                        className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800 text-center space-y-1"
                                    >
                                        <div className={`w-8 h-8 rounded-xl mx-auto flex items-center justify-center border ${item.color}`}>
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <p className="text-xl font-extrabold text-white tracking-tight pt-1">{item.value}</p>
                                        <p className="text-[11px] font-medium text-slate-400 uppercase">{item.label}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Topic-Wise Performance */}
                    {topicChartData.length > 0 && (
                        <div className="card space-y-4">
                            <h2 className="text-base font-bold text-white flex items-center gap-2">
                                <DocumentChartBarIcon className="w-5 h-5 text-indigo-400" />
                                <span>Topic-Wise Breakdown</span>
                            </h2>
                            <div className="h-56">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={topicChartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                        <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                        <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} domain={[0, 100]} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="percentage" radius={[6, 6, 0, 0]}>
                                            {topicChartData.map((entry, idx) => (
                                                <Cell key={idx} fill={entry.percentage >= 70 ? '#6366f1' : '#f43f5e'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}

                    {/* Difficulty Performance */}
                    {diffChartData.length > 0 && (
                        <div className="card space-y-4">
                            <h2 className="text-base font-bold text-white flex items-center gap-2">
                                <SparklesIcon className="w-5 h-5 text-indigo-400" />
                                <span>Adaptive Difficulty Calibration</span>
                            </h2>
                            <div className="h-56">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={diffChartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                        <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                        <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} domain={[0, 100]} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="percentage" radius={[6, 6, 0, 0]}>
                                            {diffChartData.map((entry, idx) => (
                                                <Cell key={idx} fill={DIFF_COLORS[entry.name] || '#6366f1'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}
                </div>

                {/* Strengths & Weaknesses */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="card border-emerald-500/30 bg-emerald-950/10 space-y-3">
                        <h2 className="text-base font-bold text-emerald-400 flex items-center gap-2">
                            <CheckCircleIcon className="w-5 h-5" />
                            <span>Mastered Areas</span>
                        </h2>
                        {strongTopics.length > 0 ? (
                            <ul className="space-y-2">
                                {strongTopics.map((t, idx) => (
                                    <li key={idx} className="flex items-center gap-2 text-sm text-slate-200">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                        <span>{t}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-slate-400 text-xs">Keep practicing to build proven mastery areas.</p>
                        )}
                    </div>

                    <div className="card border-amber-500/30 bg-amber-950/10 space-y-3">
                        <h2 className="text-base font-bold text-amber-400 flex items-center gap-2">
                            <LightBulbIcon className="w-5 h-5" />
                            <span>Focus & Revision Areas</span>
                        </h2>
                        {weakTopics.length > 0 ? (
                            <ul className="space-y-2">
                                {weakTopics.map((t, idx) => (
                                    <li key={idx} className="flex items-center gap-2 text-sm text-slate-200">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                        <span>{t}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-emerald-400 text-xs font-semibold">🎉 Zero weak areas detected — fantastic performance!</p>
                        )}
                    </div>
                </div>

                {/* AI Recommendations */}
                {recommendations.length > 0 && (
                    <div className="card space-y-4">
                        <h2 className="text-base font-bold text-white flex items-center gap-2">
                            <SparklesIcon className="w-5 h-5 text-indigo-400" />
                            <span>AI Learning Recommendations</span>
                        </h2>
                        <div className="space-y-2.5">
                            {recommendations.map((rec, i) => {
                                const text = typeof rec === 'object' ? rec.text : rec;
                                return (
                                    <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/40 border border-slate-800">
                                        <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                                            {i + 1}
                                        </span>
                                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{text}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Quick Actions Footer */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Link to="/create-quiz" className="btn-primary flex-1 py-3 text-center">
                        🚀 Take Another Quiz
                    </Link>
                    <Link to="/history" className="btn-secondary flex-1 py-3 text-center flex items-center justify-center gap-2">
                        <ClockIcon className="w-4 h-4" />
                        <span>View Past Attempts</span>
                    </Link>
                    <Link to="/dashboard" className="btn-secondary flex-1 py-3 text-center flex items-center justify-center gap-2">
                        <HomeIcon className="w-4 h-4" />
                        <span>Back to Dashboard</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
