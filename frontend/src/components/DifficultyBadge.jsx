export default function DifficultyBadge({ difficulty }) {
    const configs = {
        Easy: {
            classes: 'badge-easy',
            dot: 'bg-emerald-400 shadow-[0_0_8px_#34d399]',
        },
        Medium: {
            classes: 'badge-medium',
            dot: 'bg-amber-400 shadow-[0_0_8px_#fbbf24]',
        },
        Hard: {
            classes: 'badge-hard',
            dot: 'bg-orange-400 shadow-[0_0_8px_#fb923c]',
        },
        Expert: {
            classes: 'badge-expert',
            dot: 'bg-rose-400 shadow-[0_0_8px_#f43f5e]',
        },
    };

    const cfg = configs[difficulty] || configs.Medium;

    return (
        <span className={cfg.classes}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`} />
            <span className="font-semibold tracking-wide">{difficulty}</span>
        </span>
    );
}

