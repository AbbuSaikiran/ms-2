import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingDown, 
  Clock, 
  BrainCircuit, 
  CheckCircle2, 
  Flame, 
  Zap, 
  Calendar,
  Layers
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('Last 30 days');

  const mttrData = [
    { week: 'W1', mttr: 42, target: 20 },
    { week: 'W2', mttr: 31, target: 20 },
    { week: 'W3', mttr: 22, target: 20 },
    { week: 'W4 (Memory Active)', mttr: 14, target: 20 },
  ];

  const recallStats = [
    { category: 'PostgreSQL & DB Pools', recalls: 48, accuracy: 96 },
    { category: 'Kubernetes CrashLoop', recalls: 34, accuracy: 94 },
    { category: 'Async Queue Memory Leaks', recalls: 28, accuracy: 91 },
    { category: 'API Ingress 504 Timeouts', recalls: 22, accuracy: 95 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">SRE Operational Analytics</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Measure incident response efficiency, MTTR reduction, and Hindsight memory recall accuracy.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-transparent border-none text-xs text-slate-200 focus:outline-none cursor-pointer font-medium"
            >
              <option value="Last 30 days">Last 30 days</option>
              <option value="Last Quarter">Last Quarter</option>
              <option value="All Time">All Time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Top Impact Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 block font-medium">Average MTTR</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-mono font-extrabold text-emerald-400">14 min</span>
            <span className="text-xs text-emerald-400 flex items-center font-mono">↓ 66%</span>
          </div>
          <p className="text-[11px] text-slate-500">Down from 42m before Hindsight</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-purple-900/30 space-y-1">
          <span className="text-xs text-purple-400 block font-medium">Memory Recall Accuracy</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-mono font-extrabold text-purple-300">94.8%</span>
            <span className="text-xs text-emerald-400 flex items-center font-mono">↑ 12%</span>
          </div>
          <p className="text-[11px] text-slate-500">Exact post-mortem matches</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-blue-900/30 space-y-1">
          <span className="text-xs text-blue-400 block font-medium">Engineer Time Saved</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-mono font-extrabold text-blue-400">184 hrs</span>
            <span className="text-xs text-blue-300 font-mono">This Month</span>
          </div>
          <p className="text-[11px] text-slate-500">Repetitive triage eliminated</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-amber-900/30 space-y-1">
          <span className="text-xs text-amber-400 block font-medium">Runbook Adoption</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-mono font-extrabold text-amber-300">92%</span>
            <span className="text-xs text-emerald-400 font-mono">👍 Helpful</span>
          </div>
          <p className="text-[11px] text-slate-500">Verified by DevOps teams</p>
        </div>
      </div>

      {/* MTTR Reduction Chart */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
              <TrendingDown className="h-4 w-4 text-emerald-400" />
              <span>Mean Time to Resolution (MTTR) Progression</span>
            </h3>
            <p className="text-[11px] text-slate-400">Comparing MTTR before and after Hindsight memory retention</p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
            Target Met (&lt; 20m)
          </span>
        </div>

        {/* Progress Bar Visualization */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-3">
          {mttrData.map((d) => (
            <div key={d.week} className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-2">
              <span className="text-xs font-semibold text-slate-400 block">{d.week}</span>
              <div className="flex items-baseline space-x-2">
                <span className={`text-2xl font-mono font-bold ${d.mttr <= 20 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {d.mttr}m
                </span>
                <span className="text-[10px] text-slate-500 font-mono">/ target {d.target}m</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full rounded-full ${d.mttr <= 20 ? 'bg-emerald-400' : 'bg-red-500'}`} 
                  style={{ width: `${Math.min(100, (d.mttr / 50) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Memory Category Frequency */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
          <BrainCircuit className="h-4 w-4 text-purple-400" />
          <span>Hindsight Memory Recall by Category</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recallStats.map((st) => (
            <div key={st.category} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-200">{st.category}</span>
                <span className="text-purple-300 font-mono">{st.recalls} recalls</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Accuracy: <strong className="text-emerald-400 font-mono">{st.accuracy}%</strong></span>
                <span className="text-[10px] font-mono text-slate-500">Ground truth verified</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
