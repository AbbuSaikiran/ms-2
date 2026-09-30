import React, { useState, useEffect } from 'react';
import { HeroLanding } from './HeroLanding';
import { DashboardView } from './DashboardView';
import { IncidentAnalyzer } from './IncidentAnalyzer';
import { DiagnosisResultView } from './DiagnosisResultView';
import { IncidentHistoryTable } from './IncidentHistoryTable';
import { MemoryExplorer } from './MemoryExplorer';
import { RunbookLibrary } from './RunbookLibrary';
import { StatelessCompare } from './StatelessCompare';
import { ResolutionFeedbackModal } from './ResolutionFeedbackModal';
import { LiveTelemetryStream } from './LiveTelemetryStream';
import { DocsPage } from '../pages/DocsPage';
import { OpenClawView } from '../OpenClawView';
import { AICopilotChat } from './AICopilotChat';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  BrainCircuit, 
  BookOpen, 
  BarChart3, 
  Settings, 
  Search, 
  User, 
  RotateCcw,
  Sparkles,
  SplitSquareVertical,
  Terminal,
  Zap,
  CheckCircle2,
  Compass,
  Radio,
  FileText,
  Bot,
  MessageSquare
} from 'lucide-react';
import { IncidentRecord } from '../../../server/memoryOps';

interface MemoryOpsDashboardProps {
  onRefreshGlobalStats: () => void;
  onOpenSettings: () => void;
  activeTab?: SidebarTab;
  setActiveTab?: (tab: SidebarTab) => void;
}

export type SidebarTab = 
  | 'landing'
  | 'ai-copilot'
  | 'dashboard'
  | 'live-stream'
  | 'new-incident'
  | 'history'
  | 'memory-explorer'
  | 'runbooks'
  | 'compare'
  | 'diagnosis'
  | 'docs'
  | 'openclaw';

export const MemoryOpsDashboard: React.FC<MemoryOpsDashboardProps> = ({ 
  onRefreshGlobalStats,
  onOpenSettings,
  activeTab: controlledTab,
  setActiveTab: setControlledTab
}) => {
  const [internalTab, setInternalTab] = useState<SidebarTab>('landing');
  const activeTab = controlledTab || internalTab;
  const setActiveTab = (tab: SidebarTab) => {
    if (setControlledTab) setControlledTab(tab);
    setInternalTab(tab);
  };
  const [incidents, setIncidents] = useState<IncidentRecord[]>([]);
  const [activeIncident, setActiveIncident] = useState<IncidentRecord | null>(null);
  const [activeDiagnosis, setActiveDiagnosis] = useState<any>(null);
  const [analyzerPreset, setAnalyzerPreset] = useState<any>(null);
  const [isResolutionModalOpen, setIsResolutionModalOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  const fetchIncidents = async () => {
    try {
      const res = await fetch('/api/memoryops/incidents');
      const data = await res.json();
      setIncidents(data);
      if (data.length > 0 && !activeIncident) {
        setActiveIncident(data[0]);
        if (data[0].diagnosis) setActiveDiagnosis(data[0].diagnosis);
      }
      onRefreshGlobalStats();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const handleDiagnoseComplete = (result: { incident: IncidentRecord; diagnosis: any }) => {
    setActiveIncident(result.incident);
    setActiveDiagnosis(result.diagnosis);
    setActiveTab('diagnosis');
    fetchIncidents();
  };

  const handleSelectIncident = (inc: IncidentRecord) => {
    setActiveIncident(inc);
    if (inc.diagnosis) {
      setActiveDiagnosis(inc.diagnosis);
      setActiveTab('diagnosis');
    } else {
      setActiveTab('history');
    }
  };

  const handleResetDemoSeed = async () => {
    await fetch('/api/memoryops/seed', { method: 'POST' });
    await fetchIncidents();
  };

  // If on landing tab, render beautiful full-width hero presentation
  if (activeTab === 'landing') {
    return (
      <div className="w-full space-y-12 animate-in fade-in duration-300">
        <HeroLanding
          onGetStarted={() => setActiveTab('new-incident')}
          onExploreMemory={() => setActiveTab('memory-explorer')}
          onOpenDemo={(preset) => {
            setAnalyzerPreset(preset);
            setActiveTab('new-incident');
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[850px] animate-in fade-in duration-300">
      {/* Left Sidebar Navigation */}
      <aside className="w-full lg:w-64 glass-card rounded-3xl p-4 border border-slate-800 flex flex-col justify-between shrink-0 shadow-2xl">
        <div className="space-y-6">
          {/* Logo */}
          <div 
            onClick={() => setActiveTab('landing')}
            className="flex items-center space-x-2.5 px-3 py-2 cursor-pointer group"
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-500 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-105 transition">
              <Zap className="h-5 w-5 text-white fill-white" />
            </div>
            <div>
              <span className="font-extrabold text-sm text-white tracking-tight">MemoryOps AI</span>
              <span className="block text-[10px] text-slate-400">Incident Intelligence</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('landing')}
              className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 transition"
            >
              <Compass className="h-4 w-4" />
              <span>← Back to Overview</span>
            </button>

            {/* AI Copilot & Query Assistant */}
            <button
              onClick={() => setActiveTab('ai-copilot')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'ai-copilot'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/40'
                  : 'text-purple-300 hover:text-white hover:bg-purple-950/40 border border-purple-500/20'
              }`}
            >
              <Bot className="h-4 w-4 text-cyan-400" />
              <span>AI SRE Copilot</span>
              <span className="ml-auto text-[9px] bg-purple-950 text-purple-300 px-1.5 py-0.2 rounded font-mono font-bold border border-purple-800">
                ASK AI
              </span>
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Command Center</span>
            </button>

            <button
              onClick={() => setActiveTab('live-stream')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'live-stream'
                  ? 'bg-red-600 text-white shadow-md shadow-red-900/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
              }`}
            >
              <Radio className="h-4 w-4 text-red-400 animate-pulse" />
              <span>Real-Time Stream</span>
              <span className="ml-auto text-[9px] bg-red-950 border border-red-800 text-red-300 px-1.5 py-0.2 rounded-full font-mono">
                LIVE
              </span>
            </button>

            <button
              onClick={() => {
                setAnalyzerPreset(null);
                setActiveTab('new-incident');
              }}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'new-incident'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
              }`}
            >
              <PlusCircle className="h-4 w-4 text-emerald-400" />
              <span>Analyze Incident</span>
            </button>

            {activeIncident && activeDiagnosis && (
              <button
                onClick={() => setActiveTab('diagnosis')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'diagnosis'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
                    : 'text-purple-300 hover:bg-slate-900/80'
                }`}
              >
                <Sparkles className="h-4 w-4 text-pink-400" />
                <span>AI Diagnosis ({activeIncident.id})</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('history')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'history'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
              }`}
            >
              <History className="h-4 w-4" />
              <span>Incident History</span>
            </button>

            <button
              onClick={() => setActiveTab('memory-explorer')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'memory-explorer'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
              }`}
            >
              <BrainCircuit className="h-4 w-4 text-purple-400" />
              <span>Memory Explorer</span>
            </button>

            <button
              onClick={() => setActiveTab('runbooks')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'runbooks'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
              }`}
            >
              <BookOpen className="h-4 w-4 text-amber-400" />
              <span>Runbook Library</span>
            </button>

            <button
              onClick={() => setActiveTab('compare')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'compare'
                  ? 'bg-pink-600 text-white shadow-md shadow-pink-900/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
              }`}
            >
              <SplitSquareVertical className="h-4 w-4 text-pink-400" />
              <span>Stateless vs Memory</span>
            </button>

            <button
              onClick={() => setActiveTab('docs')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'docs'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
              }`}
            >
              <FileText className="h-4 w-4 text-emerald-400" />
              <span>Architecture Docs</span>
            </button>

            <button
              onClick={onOpenSettings}
              className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 transition"
            >
              <Settings className="h-4 w-4" />
              <span>LLM & Settings</span>
            </button>
          </nav>
        </div>

        {/* Powered By Hindsight Pill at Sidebar Bottom */}
        <div className="pt-6 border-t border-slate-800/80">
          <div className="p-3 bg-gradient-to-r from-blue-950/60 to-purple-950/60 border border-purple-800/40 rounded-2xl flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-purple-600 text-white">
              <BrainCircuit className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-200">Powered by Hindsight</div>
              <div className="text-[10px] text-purple-300/80">Persistent memory for AI agents</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main App Canvas */}
      <main className="flex-1 space-y-6 min-w-0">
        {/* Top Bar with Search & User Profile */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
          {/* Global Search with ⌘K Badge */}
          <div className="relative w-full sm:w-96">
            <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search incidents, services, or error messages..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-12 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
            />
            <span className="absolute right-3 top-2.5 text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              ⌘K
            </span>
          </div>

          {/* User Profile & Demo Reset */}
          <div className="flex items-center space-x-3 self-end sm:self-auto">
            <button
              onClick={() => setActiveTab('live-stream')}
              className="text-xs text-red-400 hover:text-red-300 px-3 py-1.5 bg-red-950/50 hover:bg-red-950 border border-red-800/60 rounded-xl transition flex items-center space-x-1.5 font-semibold"
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <span>Live Stream</span>
            </button>

            <button
              onClick={handleResetDemoSeed}
              className="text-xs text-slate-400 hover:text-white px-3 py-1.5 bg-slate-800/60 hover:bg-slate-800 border border-slate-700 rounded-xl transition flex items-center space-x-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Demos</span>
            </button>

            <div className="flex items-center space-x-2.5 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">
                A
              </div>
              <div className="text-left hidden sm:block">
                <span className="text-xs font-semibold text-slate-200 block leading-tight">Admin</span>
                <span className="text-[10px] text-slate-400 block leading-tight">DevOps Team</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Views */}
        {activeTab === 'ai-copilot' && (
          <AICopilotChat
            onAnalyzeIncident={(preset) => {
              setAnalyzerPreset(preset);
              setActiveTab('new-incident');
            }}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            onNewIncident={() => setActiveTab('new-incident')}
            onSelectService={() => setActiveTab('history')}
          />
        )}

        {activeTab === 'live-stream' && (
          <LiveTelemetryStream
            onAnalyzePreset={(preset) => {
              setAnalyzerPreset(preset);
              setActiveTab('new-incident');
            }}
            onRefreshStats={fetchIncidents}
          />
        )}

        {activeTab === 'new-incident' && (
          <IncidentAnalyzer 
            onDiagnoseComplete={handleDiagnoseComplete}
            initialData={analyzerPreset}
          />
        )}

        {activeTab === 'diagnosis' && activeIncident && activeDiagnosis && (
          <DiagnosisResultView
            incident={activeIncident}
            diagnosis={activeDiagnosis}
            onBack={() => setActiveTab('new-incident')}
            onOpenResolutionModal={() => setIsResolutionModalOpen(true)}
            onOpenCompare={() => setActiveTab('compare')}
          />
        )}

        {activeTab === 'history' && (
          <IncidentHistoryTable
            incidents={incidents}
            onSelectIncident={handleSelectIncident}
          />
        )}

        {activeTab === 'memory-explorer' && (
          <MemoryExplorer
            incidents={incidents}
            onSelectIncident={handleSelectIncident}
          />
        )}

        {activeTab === 'runbooks' && (
          <RunbookLibrary />
        )}

        {activeTab === 'compare' && (
          <StatelessCompare currentIncident={activeIncident} />
        )}

        {activeTab === 'docs' && (
          <DocsPage onStartAnalyzing={() => setActiveTab('new-incident')} />
        )}

        {activeTab === 'openclaw' && (
          <OpenClawView onRefreshStats={fetchIncidents} />
        )}

        {/* Resolution Modal */}
        {activeIncident && (
          <ResolutionFeedbackModal
            isOpen={isResolutionModalOpen}
            onClose={() => setIsResolutionModalOpen(false)}
            incident={activeIncident}
            onResolvedSuccess={fetchIncidents}
          />
        )}
      </main>
    </div>
  );
};
