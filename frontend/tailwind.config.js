/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#f0f5ff',
                    100: '#e0ecff',
                    200: '#b9d5ff',
                    300: '#7cb5ff',
                    400: '#388eff',
                    500: '#136dec',
                    600: '#0650c8',
                    700: '#073f9f',
                    800: '#0b3582',
                    900: '#0f2d6b',
                },
                accent: {
                    400: '#a78bfa',
                    500: '#8b5cf6',
                    600: '#7c3aed',
                },
                dark: {
                    800: '#0f172a',
                    850: '#0b1120',
                    900: '#030712',
                }
            },
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
                mono: ['"JetBrains Mono"', 'monospace'],
            },
            boxShadow: {
                'glow-blue': '0 0 25px -5px rgba(59, 130, 246, 0.4)',
                'glow-indigo': '0 0 25px -5px rgba(99, 102, 241, 0.4)',
                'glow-purple': '0 0 25px -5px rgba(168, 85, 247, 0.4)',
                'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.4)',
                'glow-rose': '0 0 25px -5px rgba(244, 63, 94, 0.4)',
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            },
            animation: {
                'fade-in': 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                'pulse-slow': 'pulse 3s infinite',
                'float': 'float 4s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
                slideUp: { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-6px)' },
                },
            }
        },
    },
    plugins: [],
}
