import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MemoryOpsDashboard, SidebarTab } from './components/memoryops/MemoryOpsDashboard';
import { AuthPage } from './components/pages/AuthPage';
import { ApiKeyModal } from './components/ApiKeyModal';
import { AddMemoryModal } from './components/AddMemoryModal';
import { ServerStatus } from './types';
import confetti from 'canvas-confetti';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SidebarTab>('landing');
  const [status, setStatus] = useState<ServerStatus | null>(null);
  const [user, setUser] = useState<any>({
    email: 'sre-admin@memoryops.ai',
    role: 'Staff SRE Lead'
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [isAddMemoryModalOpen, setIsAddMemoryModalOpen] = useState(false);
  const [addMemoryDomain, setAddMemoryDomain] = useState('devops');
  const [isResetting, setIsResetting] = useState(false);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/status');
      const data = await res.json();
      setStatus(data);
    } catch (err) {
      console.warn('Status fetch error:', err);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleSaveKeys = async (keys: { hindsightApiKey: string; groqApiKey: string; openAiApiKey: string; model?: string }) => {
    try {
      await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(keys),
      });
      await fetchStatus();
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetMemories = async () => {
    setIsResetting(true);
    try {
      await fetch('/api/memories/reset', { method: 'POST' });
      await fetchStatus();
      confetti({
        particleCount: 50,
        spread: 60,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsResetting(false);
    }
  };

  const handleOpenAddMemory = (domain: string) => {
    setAddMemoryDomain(domain);
    setIsAddMemoryModalOpen(true);
  };

  const handleAddMemorySubmit = async (item: any) => {
    try {
      await fetch('/api/memories/retain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      await fetchStatus();
      confetti({
        particleCount: 45,
        spread: 50,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Clean Minimalist Navbar with Logo, Sign In, Sign Up, and LLM Keys */}
      <Navbar
        user={user}
        onOpenSignIn={() => setIsAuthModalOpen(true)}
        onOpenSignUp={() => setIsAuthModalOpen(true)}
        onSignOut={() => setUser(null)}
        onOpenKeyModal={() => setIsKeyModalOpen(true)}
        onResetMemories={handleResetMemories}
        isResetting={isResetting}
        onGoHome={() => setActiveTab('landing')}
        onNavigateTab={(tab) => setActiveTab(tab as SidebarTab)}
      />

      {/* Main Workspace Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <MemoryOpsDashboard 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onRefreshGlobalStats={fetchStatus} 
          onOpenSettings={() => setIsKeyModalOpen(true)}
        />
      </main>

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md">
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs font-bold border border-slate-700 shadow-xl z-20"
            >
              ✕
            </button>
            <AuthPage
              onAuthSuccess={(authData) => {
                setUser(authData);
                setIsAuthModalOpen(false);
                confetti({ particleCount: 30, spread: 40 });
              }}
              onCancel={() => setIsAuthModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* API Keys Modal */}
      <ApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        onSave={handleSaveKeys}
      />

      {/* Add Memory Modal */}
      <AddMemoryModal
        isOpen={isAddMemoryModalOpen}
        onClose={() => setIsAddMemoryModalOpen(false)}
        onAdd={handleAddMemorySubmit}
        defaultDomain={addMemoryDomain}
      />

      {/* Modern Footer */}
      <footer className="border-t border-white/5 bg-[#04060C]/90 py-6 text-center text-xs text-slate-500 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <p className="text-slate-400">
              <strong className="text-white font-bold">MemoryOps AI</strong> • Built for the <strong className="text-cyan-400 font-semibold">Hindsight Hackathon</strong> (Vectorize Persistent Memory)
            </p>
          </div>
          <p className="font-mono text-[11px] text-slate-600">
            Hindsight Biomimetic Architecture • <span className="text-slate-400 font-bold">Vectorize.io</span>
          </p>
        </div>
      </footer>
    </div>
  );
};
