import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
    HomeIcon, 
    SparklesIcon, 
    ClockIcon, 
    UserCircleIcon,
    ArrowRightOnRectangleIcon,
    PlusIcon,
} from '@heroicons/react/24/outline';

export default function Navbar() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => { 
        logout(); 
        navigate('/login'); 
    };

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: HomeIcon },
        { path: '/create-quiz', label: 'Create Quiz', icon: SparklesIcon },
        { path: '/history', label: 'History', icon: ClockIcon },
        { path: '/profile', label: 'Profile', icon: UserCircleIcon },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50">
            <div className="bg-slate-950/75 backdrop-blur-xl border-b border-slate-800/80 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 sm:h-18">
                        {/* Logo & Brand */}
                        <div className="flex items-center gap-8">
                            <Link to="/dashboard" className="flex items-center gap-3 group">
                                <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 shadow-md shadow-indigo-500/25 group-hover:shadow-indigo-500/50 group-hover:scale-105 transition-all duration-300">
                                    <span className="font-mono font-bold text-white text-base">AI</span>
                                    <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-950 shadow-[0_0_8px_#34d399]" />
                                </div>
                                <div>
                                    <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                                        Quiz<span className="gradient-text">Gen</span>
                                        <span className="hidden sm:inline-block text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                            v1.0
                                        </span>
                                    </span>
                                    <span className="hidden sm:block text-[10px] text-slate-400 font-medium -mt-1 tracking-wider uppercase">
                                        Adaptive Learning
                                    </span>
                                </div>
                            </Link>

                            {/* Desktop Navigation */}
                            <nav className="hidden md:flex items-center gap-1.5">
                                {navItems.map(item => {
                                    const Icon = item.icon;
                                    const isActive = location.pathname === item.path;
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                                                isActive
                                                    ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-sm shadow-indigo-950'
                                                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                                            }`}
                                        >
                                            <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                                            <span>{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* Right side controls */}
                        <div className="flex items-center gap-3">
                            {/* Quick Action Button */}
                            <Link
                                to="/create-quiz"
                                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-indigo-600/20 hover:shadow-indigo-500/30 active:scale-95 transition-all duration-200"
                            >
                                <PlusIcon className="w-3.5 h-3.5" />
                                <span>Create Quiz</span>
                            </Link>

                            {/* User Avatar & Logout */}
                            <div className="flex items-center gap-3 pl-2 sm:border-l sm:border-slate-800">
                                <Link 
                                    to="/profile"
                                    className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-800/60 transition-colors"
                                    title="View Profile"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm shadow-indigo-500/30">
                                        {user?.name?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <span className="hidden lg:inline text-xs font-semibold text-slate-300 max-w-[100px] truncate">
                                        {user?.name || 'User'}
                                    </span>
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    title="Sign Out"
                                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all duration-200"
                                >
                                    <ArrowRightOnRectangleIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Bottom Navigation */}
                <div className="md:hidden border-t border-slate-800/80 px-2 py-2 flex items-center justify-around bg-slate-950/90 backdrop-blur-xl">
                    {navItems.map(item => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[11px] font-medium transition-all ${
                                    isActive 
                                        ? 'text-indigo-400 font-bold' 
                                        : 'text-slate-400 hover:text-slate-200'
                                }`}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </header>
    );
}

