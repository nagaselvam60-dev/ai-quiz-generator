import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import client from '../api/client';
import toast from 'react-hot-toast';
import {
    SparklesIcon,
    BookOpenIcon,
    ArrowUpTrayIcon,
    DocumentTextIcon,
    CheckCircleIcon,
    XMarkIcon,
    LightBulbIcon,
    AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';

const CATEGORIES = {
    "Computer Science": ["Python", "Java", "C", "C++", "Data Structures", "Algorithms", "DBMS", "Operating Systems", "Computer Networks", "Software Engineering"],
    "AI & Data": ["Artificial Intelligence", "Machine Learning", "Deep Learning", "Data Science", "Natural Language Processing", "Computer Vision", "Generative AI"],
    "Web Development": ["HTML", "CSS", "JavaScript", "React", "Node.js", "Web Development"],
    "Cybersecurity": ["Cybersecurity", "Network Security", "Cryptography", "Ethical Hacking", "Cyber Forensics", "Information Security"],
    "Mathematics": ["Algebra", "Calculus", "Statistics", "Probability", "Discrete Mathematics"],
    "Science": ["Physics", "Chemistry", "Biology", "Environmental Science"],
    "Management": ["Business Management", "Marketing", "Finance", "Entrepreneurship"],
    "Emerging Tech": ["Internet of Things", "Cloud Computing", "Blockchain", "Mobile Application Development", "Robotics"],
};

const TOPIC_SUGGESTIONS = {
    "Python": ["Functions & Lambdas", "Data Structures & Types", "OOP & Classes", "Decorators & Generators", "Exception Handling", "File I/O"],
    "Machine Learning": ["Supervised vs Unsupervised", "Decision Trees & Random Forests", "Gradient Descent", "Neural Networks Basics", "Model Evaluation & Cross-Validation"],
    "Data Structures": ["Binary Search Trees", "Stacks & Queues", "Graph Traversals (BFS/DFS)", "Hash Tables", "Dynamic Programming"],
    "DBMS": ["SQL Joins & Grouping", "Database Normalization (1NF-BCNF)", "ACID Properties & Transactions", "Indexing & Query Optimization"],
    "Cybersecurity": ["Public Key Cryptography", "Firewalls & Packet Filtering", "SQL Injection & XSS", "Zero Trust Architecture"],
    "Computer Networks": ["TCP/IP vs OSI Stack", "Routing Algorithms", "DNS & DHCP Protocol", "Subnetting & CIDR", "TLS/SSL Handshake"],
    "Operating Systems": ["Process Scheduling", "Deadlocks & Prevention", "Virtual Memory & Paging", "Semaphores & Mutexes"],
    "JavaScript": ["Closures & Scopes", "Event Loop & Promises", "Async/Await", "Prototypes & ES6 Classes", "DOM Manipulation"],
    "React": ["Component Lifecycle & Hooks", "State Management & Context", "Virtual DOM & Reconciliation", "Performance Optimization"],
};

export default function CreateQuizPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const [form, setForm] = useState({
        subject: location.state?.prefillSubject || 'Python',
        topic: location.state?.prefillTopic || '',
        numQuestions: 5,
        startingDifficulty: 'Medium',
        customText: '',
    });

    const [activeCategory, setActiveCategory] = useState("Computer Science");
    const [customSubject, setCustomSubject] = useState('');
    const [useCustomSubject, setUseCustomSubject] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [materialId, setMaterialId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [materialMode, setMaterialMode] = useState('none'); // none, paste, file
    const [isDragging, setIsDragging] = useState(false);

    // AI Generation step ticker
    const [generationStep, setGenerationStep] = useState(0);

    const selectedSubject = useCustomSubject ? customSubject : form.subject;
    const currentSuggestions = TOPIC_SUGGESTIONS[selectedSubject] || [];

    useEffect(() => {
        let timer;
        if (loading) {
            timer = setInterval(() => {
                setGenerationStep(prev => (prev + 1) % 4);
            }, 1200);
        } else {
            setGenerationStep(0);
        }
        return () => clearInterval(timer);
    }, [loading]);

    const handleFileUpload = async (file) => {
        if (!file) return;
        const allowed = ['pdf', 'docx', 'txt'];
        const ext = file.name.split('.').pop().toLowerCase();
        if (!allowed.includes(ext)) {
            toast.error('Only PDF, DOCX, or TXT documents are supported');
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            toast.error('File size exceeds 10MB limit');
            return;
        }

        setUploadLoading(true);
        try {
            const fd = new FormData();
            fd.append('file', file);
            const res = await client.post('/api/materials/upload', fd, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMaterialId(res.data.id);
            setUploadedFile(file.name);
            toast.success(`Uploaded: ${file.name}`);
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Document upload failed');
        } finally {
            setUploadLoading(false);
        }
    };

    const handleGenerate = async (e) => {
        e.preventDefault();
        const subject = selectedSubject.trim();
        if (!subject) {
            toast.error('Please select or enter a subject');
            return;
        }
        if (!form.topic.trim()) {
            toast.error('Please enter a topic or chapter');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                subject,
                topic: form.topic.trim(),
                num_questions: form.numQuestions,
                starting_difficulty: form.startingDifficulty,
                study_material_id: materialMode === 'file' ? materialId : null,
                custom_text: materialMode === 'paste' && form.customText ? form.customText.trim() : null,
            };

            const res = await client.post('/api/quizzes/generate', payload);
            toast.success('Quiz generated successfully!');
            navigate(`/quiz/${res.data.id}`);
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Failed to generate quiz');
        } finally {
            setLoading(false);
        }
    };

    const stepsText = [
        "Analyzing topic & cognitive learning objectives...",
        "Crafting adaptive multiple-choice questions...",
        "Formulating realistic distractors & explanations...",
        "Finalizing interactive test session...",
    ];

    return (
        <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
            <Navbar />
            <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
                
                {/* Header Title */}
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
                        <SparklesIcon className="w-3.5 h-3.5" />
                        <span>AI MCQ Architect</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                        Create Adaptive Quiz
                    </h1>
                    <p className="text-slate-400 text-sm sm:text-base mt-1">
                        Select a domain, enter your topic, and our AI will build custom questions tailored to your performance.
                    </p>
                </div>

                <form onSubmit={handleGenerate} className="space-y-6">
                    
                    {/* Subject Section */}
                    <div className="card space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <BookOpenIcon className="w-5 h-5 text-indigo-400" />
                                <h2 className="text-base font-bold text-white">Subject Selection</h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => setUseCustomSubject(!useCustomSubject)}
                                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                            >
                                {useCustomSubject ? '← Browse Preset Subjects' : '+ Custom Subject'}
                            </button>
                        </div>

                        {!useCustomSubject ? (
                            <div className="space-y-4">
                                {/* Category Pills */}
                                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                                    {Object.keys(CATEGORIES).map(cat => (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => setActiveCategory(cat)}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                                                activeCategory === cat
                                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                                                    : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700/60'
                                            }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>

                                {/* Subjects Grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                                    {CATEGORIES[activeCategory]?.map(s => {
                                        const isSelected = form.subject === s;
                                        return (
                                            <button
                                                key={s}
                                                type="button"
                                                onClick={() => setForm({ ...form, subject: s })}
                                                className={`p-3 rounded-xl text-xs font-bold text-left transition-all border ${
                                                    isSelected
                                                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm shadow-indigo-950'
                                                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                                                }`}
                                            >
                                                {s}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div>
                                <label className="label">Custom Subject Name</label>
                                <input
                                    className="input"
                                    placeholder="e.g. Distributed Systems, Quantum Cryptography, Bio-Informatics"
                                    value={customSubject}
                                    onChange={e => setCustomSubject(e.target.value)}
                                    required={useCustomSubject}
                                    autoFocus
                                />
                            </div>
                        )}
                    </div>

                    {/* Topic Section */}
                    <div className="card space-y-4">
                        <div className="flex items-center gap-2.5">
                            <LightBulbIcon className="w-5 h-5 text-indigo-400" />
                            <h2 className="text-base font-bold text-white">Topic / Chapter Focus</h2>
                        </div>
                        <div>
                            <input
                                className="input text-base"
                                placeholder={`e.g. ${currentSuggestions[0] || 'Neural Network Backpropagation, Recursion, SQL Joins...'}`}
                                value={form.topic}
                                onChange={e => setForm({ ...form, topic: e.target.value })}
                                required
                            />
                        </div>

                        {currentSuggestions.length > 0 && (
                            <div className="pt-1">
                                <p className="text-xs font-semibold text-slate-400 mb-2">Suggested topics for {selectedSubject}:</p>
                                <div className="flex flex-wrap gap-2">
                                    {currentSuggestions.map(t => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => setForm({ ...form, topic: t })}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                                                form.topic === t
                                                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                                                    : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-700/60 hover:text-white'
                                            }`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Study Material Optional Section */}
                    <div className="card space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <DocumentTextIcon className="w-5 h-5 text-indigo-400" />
                                <h2 className="text-base font-bold text-white">Source Material <span className="text-xs font-normal text-slate-400">(Optional)</span></h2>
                            </div>
                        </div>

                        {/* Mode Selector */}
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { id: 'none', label: 'AI Knowledge Base' },
                                { id: 'paste', label: 'Paste Notes' },
                                { id: 'file', label: 'Upload Document' },
                            ].map(m => (
                                <button
                                    key={m.id}
                                    type="button"
                                    onClick={() => setMaterialMode(m.id)}
                                    className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all border ${
                                        materialMode === m.id
                                            ? 'bg-indigo-600/20 border-indigo-500 text-white'
                                            : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:bg-slate-800/40 hover:text-slate-300'
                                    }`}
                                >
                                    {m.label}
                                </button>
                            ))}
                        </div>

                        {materialMode === 'paste' && (
                            <div className="space-y-1">
                                <textarea
                                    className="input h-36 font-mono text-xs leading-relaxed"
                                    placeholder="Paste lecture notes, study guide, or article text here. AI will craft questions specifically from your text..."
                                    value={form.customText}
                                    onChange={e => setForm({ ...form, customText: e.target.value })}
                                />
                                <p className="text-[11px] text-slate-400 text-right">
                                    {form.customText.length} characters
                                </p>
                            </div>
                        )}

                        {materialMode === 'file' && (
                            <div>
                                {uploadedFile ? (
                                    <div className="flex items-center justify-between p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30">
                                        <div className="flex items-center gap-3">
                                            <CheckCircleIcon className="w-6 h-6 text-emerald-400" />
                                            <div>
                                                <p className="text-sm font-semibold text-white">{uploadedFile}</p>
                                                <p className="text-xs text-slate-400">Ready for question extraction</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => { setUploadedFile(null); setMaterialId(null); }}
                                            className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                                        >
                                            <XMarkIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                                        onDragLeave={() => setIsDragging(false)}
                                        onDrop={e => {
                                            e.preventDefault();
                                            setIsDragging(false);
                                            if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]);
                                        }}
                                        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
                                            isDragging 
                                                ? 'border-indigo-500 bg-indigo-500/10' 
                                                : 'border-slate-800 hover:border-slate-700 bg-slate-950/30'
                                        }`}
                                    >
                                        <input
                                            type="file"
                                            id="file-upload"
                                            className="hidden"
                                            accept=".pdf,.docx,.txt"
                                            onChange={e => handleFileUpload(e.target.files?.[0])}
                                        />
                                        <label htmlFor="file-upload" className="cursor-pointer block">
                                            <ArrowUpTrayIcon className="w-8 h-8 text-indigo-400 mx-auto mb-2 animate-bounce" />
                                            <p className="text-sm font-semibold text-white">
                                                {uploadLoading ? 'Uploading & parsing text...' : 'Click or drag PDF, DOCX, or TXT here'}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-1">Maximum file size 10MB</p>
                                        </label>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Quiz Parameters */}
                    <div className="card space-y-5">
                        <div className="flex items-center gap-2.5">
                            <AdjustmentsHorizontalIcon className="w-5 h-5 text-indigo-400" />
                            <h2 className="text-base font-bold text-white">Quiz Parameters</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Number of Questions */}
                            <div>
                                <label className="label">Number of Questions</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {[5, 10, 15, 20].map(n => (
                                        <button
                                            key={n}
                                            type="button"
                                            onClick={() => setForm({ ...form, numQuestions: n })}
                                            className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${
                                                form.numQuestions === n
                                                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                                                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                                            }`}
                                        >
                                            {n} Qs
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Starting Difficulty */}
                            <div>
                                <label className="label">Starting Difficulty Level</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { level: 'Easy', color: 'border-emerald-500 text-emerald-400 bg-emerald-500/10' },
                                        { level: 'Medium', color: 'border-amber-500 text-amber-400 bg-amber-500/10' },
                                        { level: 'Hard', color: 'border-orange-500 text-orange-400 bg-orange-500/10' },
                                    ].map(item => (
                                        <button
                                            key={item.level}
                                            type="button"
                                            onClick={() => setForm({ ...form, startingDifficulty: item.level })}
                                            className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${
                                                form.startingDifficulty === item.level
                                                    ? item.color + ' shadow-sm'
                                                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                                            }`}
                                        >
                                            {item.level}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full text-base py-4 shadow-xl shadow-indigo-600/30 group"
                    >
                        <SparklesIcon className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                        <span>Generate & Launch Adaptive Quiz</span>
                    </button>
                </form>
            </div>

            {/* AI Generation Loading Modal */}
            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
                    <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl space-y-6">
                        <div className="relative w-20 h-20 mx-auto">
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 animate-spin" />
                            <div className="absolute inset-1 rounded-2xl bg-slate-900 flex items-center justify-center">
                                <SparklesIcon className="w-8 h-8 text-indigo-400 animate-pulse" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-extrabold text-white">Generating AI Questions</h3>
                            <p className="text-indigo-400 text-sm font-semibold mt-2 h-6 animate-pulse">
                                {stepsText[generationStep]}
                            </p>
                            <p className="text-xs text-slate-500 mt-2">
                                Calibrating adaptive difficulty for {selectedSubject} — {form.topic}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

