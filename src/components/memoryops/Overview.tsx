import React from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  Flame, 
  BrainCircuit, 
  Activity, 
  ArrowRight,
  Terminal,
  Clock,
  Sparkles,
  Server
} from 'lucide-react';

interface OverviewProps {
  incidents: any[];
  onNavigateToAnalyzer: () => void;
  onNavigateToExplorer: () => void;
  onSelectIncident: (inc: any) => void;
}

export const Overview: React.FC<OverviewProps> = ({
  incidents,
  onNavigateToAnalyzer,
  onNavigateToExplorer,
  onSelectIncident,
}) => {
  const total = incidents.length;
  const critical = incidents.filter(i => i.severity === 'Critical').length;
  const resolved = incidents.filter(i => i.status === 'Resolved').length;
  const memoryBacked = incidents.filter(i => i.diagnosis?.historicalMatches && i.diagnosis.historicalMatches.length > 0).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-r from-slate-900 via-red-950/40 to-slate-900 border border-red-500/30 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold">
            <ShieldAlert className="h-3.5 w-3.5 text-red-400" />
            <span>MemoryOps AI • SRE Operational Intelligence</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Incident Response with <span className="bg-gradient-to-r from-red-400 via-amber-300 to-purple-400 bg-clip-text text-transparent">Persistent Memory</span>
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Eliminates repetitive investigation during outages. When an incident occurs, MemoryOps AI queries <strong className="text-purple-300">Hindsight</strong> to retrieve verified root causes, safe runbook steps, and post-mortems from past production failures.
          </p>

          <div className="pt-2 flex items-center space-x-3">
            <button
              onClick={onNavigateToAnalyzer}
              className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-semibold rounded-xl text-xs shadow-lg shadow-red-950 transition"
            >
              <Terminal className="h-4 w-4" />
              <span>Analyze New Incident</span>
            </button>
            <button
              onClick={onNavigateToExplorer}
              className="flex items-center space-x-1.5 px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-medium rounded-xl text-xs border border-slate-700 transition"
            >
              <BrainCircuit className="h-4 w-4 text-purple-400" />
              <span>Explore Memory Bank</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Incidents Tracked</span>
            <Server className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-white">{total}</div>
          <p className="text-[11px] text-slate-500">Across dev, staging & prod</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-red-900/30 space-y-1">
          <div className="flex items-center justify-between text-xs text-red-400">
            <span>Critical Severity</span>
            <Flame className="h-4 w-4 text-red-400" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-red-400">{critical}</div>
          <p className="text-[11px] text-slate-500">Immediate SRE triage</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-emerald-900/30 space-y-1">
          <div className="flex items-center justify-between text-xs text-emerald-400">
            <span>Confirmed Resolved</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-emerald-400">{resolved}</div>
          <p className="text-[11px] text-slate-500">Retained in Hindsight</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-purple-900/30 space-y-1">
          <div className="flex items-center justify-between text-xs text-purple-400">
            <span>Memory-Backed Advice</span>
            <Sparkles className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-purple-300">
            {total > 0 ? `${Math.round((memoryBacked / total) * 100)}%` : '100%'}
          </div>
          <p className="text-[11px] text-slate-500">Cites historical post-mortems</p>
        </div>
      </div>

      {/* Recent Incident Activity Feed */}
      <div className="glass-card rounded-2xl border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
            <Activity className="h-4 w-4 text-red-400" />
            <span>Operational Incidents & Memory Retention Stream</span>
          </h3>
          <span className="text-xs text-slate-500">Click any incident to inspect diagnosis & resolution</span>
        </div>

        <div className="space-y-3">
          {incidents.map((inc) => (
            <div
              key={inc.id}
              onClick={() => onSelectIncident(inc)}
              className="cursor-pointer p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-red-500/40 hover:bg-slate-900 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2.5">
                  <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">
                    {inc.id}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    inc.severity === 'Critical' ? 'bg-red-950 text-red-300 border border-red-800' :
                    inc.severity === 'High' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                    'bg-blue-950 text-blue-300 border border-blue-800'
                  }`}>
                    {inc.severity}
                  </span>
                  <span className="text-xs font-semibold text-slate-200">{inc.title}</span>
                </div>
                <div className="flex items-center space-x-3 text-[11px] text-slate-400">
                  <span>Service: <strong className="text-slate-300 font-normal">{inc.service}</strong></span>
                  <span>•</span>
                  <span>Env: <strong className="text-slate-300 font-normal">{inc.environment}</strong></span>
                  {inc.resolution && (
                    <>
                      <span>•</span>
                      <span className="text-emerald-400 font-medium">Verified by: {inc.resolution.confirmedBy}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <span className={`text-[11px] font-mono px-2.5 py-1 rounded-full ${
                  inc.status === 'Resolved' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800' : 'bg-amber-950/80 text-amber-300 border border-amber-800'
                }`}>
                  {inc.status}
                </span>
                <ArrowRight className="h-4 w-4 text-slate-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
