import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Brain, 
  Database, 
  History, 
  Lightbulb, 
  RefreshCw, 
  Plus, 
  Search,
  Filter,
  CheckCircle,
  Activity,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { MemoryFact, MemoryExperience, MentalModel, MemoryOperationLog } from '../types';

interface MemoryVisualizerProps {
  onOpenAddMemory: (domain: string) => void;
  onRefreshStats: () => void;
}

export const MemoryVisualizer: React.FC<MemoryVisualizerProps> = ({ onOpenAddMemory, onRefreshStats }) => {
  const [activeDomainFilter, setActiveDomainFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'facts' | 'experiences' | 'mental_models' | 'logs'>('mental_models');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isReflecting, setIsReflecting] = useState(false);

  const [facts, setFacts] = useState<MemoryFact[]>([]);
  const [experiences, setExperiences] = useState<MemoryExperience[]>([]);
  const [mentalModels, setMentalModels] = useState<MentalModel[]>([]);
  const [logs, setLogs] = useState<MemoryOperationLog[]>([]);

  const fetchMemories = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/memories');
      const data = await res.json();
      setFacts(data.facts || []);
      setExperiences(data.experiences || []);
      setMentalModels(data.mentalModels || []);
      setLogs(data.logs || []);
      onRefreshStats();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  const handleTriggerReflect = async (domain: string) => {
    setIsReflecting(true);
    try {
      const targetDomain = domain === 'all' ? 'sales' : domain;
      await fetch('/api/memories/reflect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: targetDomain }),
      });
      await fetchMemories();
    } catch (err) {
      console.error(err);
    } finally {
      setIsReflecting(false);
    }
  };

  // Filtered views
  const filteredFacts = facts.filter(f => 
    (activeDomainFilter === 'all' || f.domain === activeDomainFilter) &&
    (f.subject.toLowerCase().includes(searchQuery.toLowerCase()) || f.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredExperiences = experiences.filter(e =>
    (activeDomainFilter === 'all' || e.domain === activeDomainFilter) &&
    (e.context.toLowerCase().includes(searchQuery.toLowerCase()) || e.actionTaken.toLowerCase().includes(searchQuery.toLowerCase()) || e.outcome.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredMentalModels = mentalModels.filter(m =>
    (activeDomainFilter === 'all' || m.domain === activeDomainFilter) &&
    (m.pattern.toLowerCase().includes(searchQuery.toLowerCase()) || m.insight.toLowerCase().includes(searchQuery.toLowerCase()) || m.recommendedTactic.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredLogs = logs.filter(l =>
    activeDomainFilter === 'all' || l.domain === activeDomainFilter
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 glass-card rounded-2xl border border-pink-900/30">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 rounded-xl bg-gradient-to-tr from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-900/30">
            <Brain className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <span>Hindsight Memory Studio & Cognitive Inspector</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-950 text-pink-300 border border-pink-800 font-mono">
                Biomimetic Architecture
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Inspect the three foundational layers of persistent memory: Worlds (Facts), Experiences (Interactions), and Mental Models (Learned Strategies).
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-start md:self-auto">
          <button
            onClick={() => handleTriggerReflect(activeDomainFilter)}
            disabled={isReflecting}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-amber-900/30 transition disabled:opacity-50"
          >
            <Sparkles className={`h-3.5 w-3.5 ${isReflecting ? 'animate-spin' : ''}`} />
            <span>{isReflecting ? 'Synthesizing...' : 'Trigger Reflect'}</span>
          </button>

          <button
            onClick={() => onOpenAddMemory(activeDomainFilter === 'all' ? 'sales' : activeDomainFilter)}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-pink-900/30 transition"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Retain Memory</span>
          </button>
        </div>
      </div>

      {/* Memory Layer Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => setActiveTab('mental_models')}
          className={`cursor-pointer p-4 rounded-2xl border transition-all ${
            activeTab === 'mental_models'
              ? 'bg-pink-950/40 border-pink-500/60 shadow-lg shadow-pink-950/40'
              : 'glass-card glass-card-hover border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-pink-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Lightbulb className="h-3.5 w-3.5" />
              <span>Mental Models</span>
            </span>
            <span className="text-lg font-mono font-extrabold text-white">{mentalModels.length}</span>
          </div>
          <p className="text-[11px] text-slate-400">Synthesized cognitive rules & strategic heuristics.</p>
        </div>

        <div 
          onClick={() => setActiveTab('facts')}
          className={`cursor-pointer p-4 rounded-2xl border transition-all ${
            activeTab === 'facts'
              ? 'bg-cyan-950/40 border-cyan-500/60 shadow-lg shadow-cyan-950/40'
              : 'glass-card glass-card-hover border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Database className="h-3.5 w-3.5" />
              <span>Worlds & Facts</span>
            </span>
            <span className="text-lg font-mono font-extrabold text-white">{facts.length}</span>
          </div>
          <p className="text-[11px] text-slate-400">Ground truth profiles, tech stacks & entity specs.</p>
        </div>

        <div 
          onClick={() => setActiveTab('experiences')}
          className={`cursor-pointer p-4 rounded-2xl border transition-all ${
            activeTab === 'experiences'
              ? 'bg-purple-950/40 border-purple-500/60 shadow-lg shadow-purple-950/40'
              : 'glass-card glass-card-hover border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center space-x-1.5">
              <History className="h-3.5 w-3.5" />
              <span>Experiences</span>
            </span>
            <span className="text-lg font-mono font-extrabold text-white">{experiences.length}</span>
          </div>
          <p className="text-[11px] text-slate-400">Historical interactions, decisions & outcomes.</p>
        </div>

        <div 
          onClick={() => setActiveTab('logs')}
          className={`cursor-pointer p-4 rounded-2xl border transition-all ${
            activeTab === 'logs'
              ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-950/40'
              : 'glass-card glass-card-hover border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Activity className="h-3.5 w-3.5" />
              <span>Operations Feed</span>
            </span>
            <span className="text-lg font-mono font-extrabold text-white">{logs.length}</span>
          </div>
          <p className="text-[11px] text-slate-400">Live Retain, Recall & Reflect telemetry log.</p>
        </div>
      </div>

      {/* Controls Bar: Domain filter + Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
        {/* Domain Filter Buttons */}
        <div className="flex items-center space-x-1 w-full sm:w-auto overflow-x-auto">
          {['all', 'sales', 'devops', 'support', 'feedback'].map((domain) => (
            <button
              key={domain}
              onClick={() => setActiveDomainFilter(domain)}
              className={`px-3 py-1 rounded-xl text-xs font-medium capitalize transition-all shrink-0 ${
                activeDomainFilter === domain
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {domain === 'all' ? 'All Domains' : domain}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search memory contents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-pink-500"
          />
        </div>
      </div>

      {/* Content Panels */}
      <div className="space-y-3">
        {/* 1. Mental Models Tab */}
        {activeTab === 'mental_models' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMentalModels.map((model) => (
              <div key={model.id} className="p-5 glass-card rounded-2xl border border-pink-900/30 space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-pink-950/80 text-pink-300 border border-pink-800/60 uppercase">
                    {model.domain}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Synthesized from {model.evolvedFromCount} experiences
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-pink-300 mb-1">Pattern:</h4>
                  <p className="text-xs text-slate-200">{model.pattern}</p>
                </div>

                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-2">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 block">Cognitive Insight:</span>
                    <span className="text-xs text-slate-300">{model.insight}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-emerald-400 block">Recommended Tactic:</span>
                    <span className="text-xs text-emerald-300/90 font-medium">{model.recommendedTactic}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 2. Facts Tab */}
        {activeTab === 'facts' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFacts.map((fact) => (
              <div key={fact.id} className="p-5 glass-card rounded-2xl border border-cyan-900/30 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-cyan-300">{fact.subject}</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 uppercase">
                    {fact.domain}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{fact.content}</p>
                {fact.tags && fact.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {fact.tags.map((tag, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 3. Experiences Tab */}
        {activeTab === 'experiences' && (
          <div className="space-y-3">
            {filteredExperiences.map((exp) => (
              <div key={exp.id} className="p-4 glass-card rounded-2xl border border-purple-900/30 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 uppercase">
                      {exp.domain}
                    </span>
                    <span className="text-xs font-semibold text-slate-200">{exp.context}</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    <strong className="text-slate-300">Action:</strong> {exp.actionTaken}
                  </div>
                  <div className="text-xs text-emerald-400">
                    <strong className="text-slate-300">Outcome:</strong> {exp.outcome}
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 font-mono shrink-0">
                  {new Date(exp.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* 4. Logs Tab */}
        {activeTab === 'logs' && (
          <div className="space-y-2">
            {filteredLogs.map((log) => {
              const badgeColor =
                log.operation === 'RETAIN'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                  : log.operation === 'RECALL'
                  ? 'bg-blue-950 text-blue-300 border-blue-800'
                  : 'bg-amber-950 text-amber-300 border-amber-800';

              return (
                <div key={log.id} className="p-3 bg-slate-900/80 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${badgeColor}`}>
                      {log.operation}
                    </span>
                    <span className="text-slate-400 uppercase text-[10px] font-mono font-medium">[{log.domain}]</span>
                    <span className="text-slate-200 truncate font-mono text-[11px]">{log.details}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono ml-3 shrink-0">{log.timestamp}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
