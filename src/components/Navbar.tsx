import React from 'react';
import { 
  ArrowRight,
  LogOut,
  Sparkles,
  KeyRound
} from 'lucide-react';

interface NavbarProps {
  user: any;
  onOpenSignIn: () => void;
  onOpenSignUp: () => void;
  onSignOut: () => void;
  onOpenKeyModal: () => void;
  onResetMemories: () => void;
  isResetting: boolean;
  onGoHome: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenSignIn,
  onOpenSignUp,
  onSignOut,
  onOpenKeyModal,
  onResetMemories,
  isResetting,
  onGoHome,
  onNavigateTab
}) => {
  return (
    <header className="border-b border-white/[0.06] bg-[#070A14]/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between h-20">
          {/* 1. Left: Sleek Geometric Glowing Prism / Delta Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={onGoHome}
          >
            <div className="relative flex items-center justify-center">
              {/* Prism Glowing Icon */}
              <svg 
                className="w-8 h-8 drop-shadow-[0_0_12px_rgba(168,85,247,0.6)] group-hover:scale-105 transition"
                viewBox="0 0 32 32" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <polygon 
                  points="16,4 29,27 3,27" 
                  fill="url(#prismGrad)" 
                  stroke="rgba(255,255,255,0.4)" 
                  strokeWidth="1"
                />
                <polygon 
                  points="16,10 24,24 8,24" 
                  fill="#070A14" 
                  opacity="0.85"
                />
                <defs>
                  <linearGradient id="prismGrad" x1="3" y1="4" x2="29" y2="27" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#C084FC" />
                    <stop offset="0.5" stopColor="#818CF8" />
                    <stop offset="1" stopColor="#22D3EE" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="font-bold text-lg tracking-tight text-white group-hover:text-purple-300 transition">
              MemoryOps
            </span>
          </div>

          {/* 2. Center: Clean Minimalist Nav Links (Home, Command Center, Docs, Runbooks) */}
          <nav className="hidden md:flex items-center space-x-9 text-xs font-medium text-slate-400">
            <button
              onClick={onGoHome}
              className="hover:text-white transition duration-150"
            >
              Home
            </button>
            <button
              onClick={() => onNavigateTab ? onNavigateTab('dashboard') : onGoHome()}
              className="hover:text-white transition duration-150"
            >
              Command Center
            </button>
            <button
              onClick={() => onNavigateTab ? onNavigateTab('docs') : onGoHome()}
              className="hover:text-white transition duration-150"
            >
              Docs
            </button>
            <button
              onClick={() => onNavigateTab ? onNavigateTab('runbooks') : onGoHome()}
              className="hover:text-white transition duration-150"
            >
              Changelog
            </button>
          </nav>

          {/* 3. Right: "Sign in ." and "Get started →" with LLM Keys trigger */}
          <div className="flex items-center space-x-4">
            {/* LLM Keys quick trigger icon */}
            <button
              onClick={onOpenKeyModal}
              title="Configure API Keys & Models"
              className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition"
            >
              <KeyRound className="h-4 w-4" />
            </button>

            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-purple-600 text-white font-bold text-[10px] flex items-center justify-center">
                    {user.email ? user.email.charAt(0).toUpperCase() : 'S'}
                  </div>
                  <span className="font-medium hidden sm:inline max-w-[110px] truncate">{user.email || 'SRE Admin'}</span>
                </div>
                <button
                  onClick={onSignOut}
                  title="Sign out"
                  className="text-xs text-slate-400 hover:text-red-400 p-1 transition"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={onOpenSignIn}
                  className="text-xs font-medium text-slate-300 hover:text-white transition flex items-center"
                >
                  <span>Sign in</span>
                  <span className="ml-1 text-slate-500">.</span>
                </button>

                <button
                  onClick={onOpenSignUp}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 shadow-sm transition transform hover:-translate-y-0.5 flex items-center space-x-1"
                >
                  <span>Get started</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-0.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
