import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DifficultyBadge from '../components/DifficultyBadge';
import Navbar from '../components/Navbar';
import client from '../api/client';
import toast from 'react-hot-toast';
import {
    SparklesIcon,
    CheckCircleIcon,
    XCircleIcon,
    ArrowRightIcon,
    TrophyIcon,
    FireIcon,
    BoltIcon,
} from '@heroicons/react/24/outline';

export default function QuizPage() {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [attempt, setAttempt] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [feedback, setFeedback] = useState(null); // {correct, explanation, next_difficulty}
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [questionsAnswered, setQuestionsAnswered] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [quizComplete, setQuizComplete] = useState(false);

    // Start or load attempt
    useEffect(() => {
        const init = async () => {
            try {
                const quizRes = await client.get(`/api/quizzes/${quizId}`);
                setQuiz(quizRes.data);
                setTotalQuestions(quizRes.data.total_questions);

                const attemptRes = await client.post(`/api/attempts/start?quiz_id=${quizId}`);
                setAttempt(attemptRes.data);
                setCurrentQuestion(attemptRes.data.first_question);
                setTotalQuestions(attemptRes.data.total_questions || quizRes.data.total_questions);
            } catch (err) {
                toast.error('Failed to initialize quiz session');
            } finally {
                setLoading(false);
            }
        };
        init();
    }, [quizId]);

    const handleSubmitAnswer = useCallback(async () => {
        if (!selectedAnswer || !currentQuestion || submitting || feedback) return;
        setSubmitting(true);
        try {
            const res = await client.post(`/api/attempts/${attempt.attempt_id}/answer`, {
                question_id: currentQuestion.id,
                selected_answer: selectedAnswer,
            });
            setFeedback(res.data);
            setScore(res.data.current_score);
            setQuestionsAnswered(res.data.questions_answered);

            if (res.data.correct) {
                setStreak(prev => prev + 1);
            } else {
                setStreak(0);
            }

            if (res.data.is_quiz_complete) {
                await client.post(`/api/attempts/${attempt.attempt_id}/complete`);
                setQuizComplete(true);
            }
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Failed to submit answer');
        } finally {
            setSubmitting(false);
        }
    }, [selectedAnswer, currentQuestion, submitting, feedback, attempt]);

    const handleNextQuestion = useCallback(() => {
        if (quizComplete) {
            navigate(`/results/${attempt.attempt_id}`);
            return;
        }
        if (feedback?.next_question) {
            setCurrentQuestion(feedback.next_question);
            setSelectedAnswer(null);
            setFeedback(null);
        }
    }, [quizComplete, feedback, attempt, navigate]);

    // Keyboard shortcuts: 1-4, A-D, Enter
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (loading || !currentQuestion) return;

            const key = e.key.toUpperCase();
            const optionMap = {
                '1': currentQuestion.option_a,
                'A': currentQuestion.option_a,
                '2': currentQuestion.option_b,
                'B': currentQuestion.option_b,
                '3': currentQuestion.option_c,
                'C': currentQuestion.option_c,
                '4': currentQuestion.option_d,
                'D': currentQuestion.option_d,
            };

            if (!feedback && optionMap[key]) {
                setSelectedAnswer(optionMap[key]);
            } else if (e.key === 'Enter') {
                if (!feedback && selectedAnswer) {
                    handleSubmitAnswer();
                } else if (feedback) {
                    handleNextQuestion();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentQuestion, feedback, selectedAnswer, loading, handleSubmitAnswer, handleNextQuestion]);

    const options = currentQuestion ? [
        { key: 'A', num: '1', value: currentQuestion.option_a },
        { key: 'B', num: '2', value: currentQuestion.option_b },
        { key: 'C', num: '3', value: currentQuestion.option_c },
        { key: 'D', num: '4', value: currentQuestion.option_d },
    ] : [];

    const getOptionClass = (value) => {
        let cls = 'option-btn';
        if (!feedback) {
            if (selectedAnswer === value) cls += ' selected';
        } else {
            if (value === currentQuestion.correct_answer) {
                cls += ' correct';
            } else if (selectedAnswer === value && value !== currentQuestion.correct_answer) {
                cls += ' incorrect';
            }
        }
        return cls;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Navbar />
                <div className="text-center space-y-4">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent shadow-glow-indigo" />
                    <p className="text-slate-300 font-semibold">Preparing your adaptive quiz session...</p>
                </div>
            </div>
        );
    }

    const progressPercentage = totalQuestions > 0 ? Math.round((questionsAnswered / totalQuestions) * 100) : 0;

    return (
        <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
            <Navbar />
            <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
                
                {/* Header Card */}
                <div className="card space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                                {quiz?.subject} • {quiz?.topic}
                            </span>
                            <h2 className="text-lg font-bold text-white tracking-tight mt-0.5">{quiz?.title}</h2>
                        </div>
                        <div className="flex items-center gap-3">
                            {streak >= 2 && (
                                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold shadow-sm shadow-amber-950 animate-bounce">
                                    <FireIcon className="w-4 h-4 text-amber-400" />
                                    <span>{streak} Streak!</span>
                                </div>
                            )}
                            <div className="text-right">
                                <span className="text-base font-extrabold text-white">
                                    {score} <span className="text-xs text-slate-500 font-normal">/ {questionsAnswered}</span>
                                </span>
                                <p className="text-[10px] uppercase font-semibold text-slate-400">Score</p>
                            </div>
                        </div>
                    </div>

                    {/* Progress Track */}
                    <div className="space-y-1.5">
                        <div className="flex justify-between text-xs text-slate-400 font-semibold">
                            <span>Question {questionsAnswered + (feedback ? 0 : 1)} of {totalQuestions}</span>
                            <span>{progressPercentage}% Complete</span>
                        </div>
                        <div className="h-2.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-500 shadow-glow-indigo"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Main Question Card */}
                {currentQuestion && (
                    <div className="card space-y-6 animate-slide-up">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-400 font-medium">Difficulty:</span>
                                <DifficultyBadge difficulty={currentQuestion.difficulty} />
                            </div>
                            <span className="hidden sm:inline-block text-[11px] text-slate-500 font-medium">
                                Press 1-4 or A-D to select
                            </span>
                        </div>

                        {/* Question Text */}
                        <div className="text-lg sm:text-xl font-bold text-white leading-relaxed">
                            {currentQuestion.question_text}
                        </div>

                        {/* Options List */}
                        <div className="space-y-3">
                            {options.map((opt) => (
                                <button
                                    key={opt.key}
                                    className={getOptionClass(opt.value)}
                                    onClick={() => !feedback && setSelectedAnswer(opt.value)}
                                    disabled={!!feedback}
                                >
                                    <div className="flex items-start gap-3.5">
                                        <div className="w-7 h-7 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center font-mono text-xs font-bold text-slate-300 shrink-0 mt-0.5">
                                            {opt.key}
                                        </div>
                                        <div className="text-sm sm:text-base font-medium leading-relaxed pt-0.5">
                                            {opt.value}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Feedback & Explanation Box */}
                        {feedback && (
                            <div className={`rounded-2xl p-5 border space-y-3 animate-slide-up ${
                                feedback.correct 
                                    ? 'bg-emerald-950/30 border-emerald-500/40 shadow-glow-emerald' 
                                    : 'bg-rose-950/30 border-rose-500/40 shadow-glow-rose'
                            }`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {feedback.correct ? (
                                            <CheckCircleIcon className="w-6 h-6 text-emerald-400" />
                                        ) : (
                                            <XCircleIcon className="w-6 h-6 text-rose-400" />
                                        )}
                                        <h4 className={`text-base font-bold ${feedback.correct ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            {feedback.correct ? 'Correct! Outstanding answer.' : 'Incorrect'}
                                        </h4>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                                        <BoltIcon className="w-4 h-4 text-indigo-400" />
                                        <span>Next Level:</span>
                                        <DifficultyBadge difficulty={feedback.next_difficulty} />
                                    </div>
                                </div>

                                {!feedback.correct && (
                                    <div className="text-xs text-slate-300">
                                        <span className="text-slate-400">Correct Answer: </span>
                                        <span className="font-bold text-emerald-400">{currentQuestion.correct_answer}</span>
                                    </div>
                                )}

                                {currentQuestion.explanation && (
                                    <div className="pt-2 border-t border-slate-800/80">
                                        <p className="text-xs font-semibold text-slate-400 mb-1">Explanation & Context:</p>
                                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                                            {currentQuestion.explanation}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Action Submit / Next Button */}
                        {!feedback ? (
                            <button
                                onClick={handleSubmitAnswer}
                                disabled={!selectedAnswer || submitting}
                                className="btn-primary w-full text-base py-3.5 shadow-xl shadow-indigo-600/30"
                            >
                                {submitting ? (
                                    <span>Verifying answer...</span>
                                ) : (
                                    <span>Submit Answer (or press Enter)</span>
                                )}
                            </button>
                        ) : (
                            <button
                                onClick={handleNextQuestion}
                                className={`w-full font-bold py-3.5 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-xl ${
                                    quizComplete
                                        ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white shadow-amber-600/30'
                                        : 'btn-primary'
                                }`}
                            >
                                {quizComplete ? (
                                    <>
                                        <TrophyIcon className="w-5 h-5" />
                                        <span>Complete Quiz & View Performance Report →</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Next Question →</span>
                                        <ArrowRightIcon className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                )}

                {/* Quiz Complete celebration screen */}
                {quizComplete && !feedback && (
                    <div className="card text-center p-8 sm:p-12 space-y-6 animate-slide-up">
                        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-500 flex items-center justify-center text-white mx-auto shadow-xl shadow-amber-500/30 animate-bounce">
                            <TrophyIcon className="w-10 h-10" />
                        </div>
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Quiz Completed!</h2>
                            <p className="text-slate-400 text-sm mt-1">Your adaptive learning session has been recorded.</p>
                        </div>
                        <div className="inline-block p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                            <p className="text-3xl font-extrabold text-indigo-400">
                                {score} <span className="text-sm text-slate-500 font-medium">/ {totalQuestions}</span>
                            </p>
                            <p className="text-xs text-slate-400 font-semibold uppercase mt-0.5">
                                {Math.round((score / totalQuestions) * 100)}% Accuracy
                            </p>
                        </div>
                        <div>
                            <button
                                onClick={() => navigate(`/results/${attempt.attempt_id}`)}
                                className="btn-primary w-full max-w-sm py-3.5 text-base shadow-xl shadow-indigo-600/30"
                            >
                                View Detailed Performance Report
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

