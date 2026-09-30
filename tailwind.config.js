/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#080D1A',
        card: '#111A2B',
        brand: {
          blue: '#5865F2',
          cyan: '#20D9D2',
          purple: '#8B5CF6',
          dark: '#080D1A',
          card: '#111A2B',
          border: 'rgba(255, 255, 255, 0.08)',
        },
        slate: {
          950: '#080D1A',
          900: '#111A2B',
          850: '#162238',
          800: '#1E2D4A',
          700: '#334155',
          400: '#94A3B8',
          100: '#F1F5F9',
        },
        memory: {
          fact: '#20D9D2',
          experience: '#8B5CF6',
          model: '#EC4899',
          retain: '#10B981',
          recall: '#5865F2',
          reflect: '#F59E0B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
