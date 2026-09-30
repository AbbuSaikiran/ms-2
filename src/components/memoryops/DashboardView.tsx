import React, { useState } from 'react';
import { 
  Server, 
  CheckCircle2, 
  Flame, 
  Sparkles, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  BarChart3,
  PieChart,
  Calendar
} from 'lucide-react';

interface DashboardViewProps {
  onNewIncident: () => void;
  onSelectService: (service: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNewIncident, onSelectService }) => {
  const [timeRange, setTimeRange] = useState('Last 30 days');

  // Trend data for bars
  const days = [
    { day: 'Mon', total: 6, resolved: 5, critical: 1 },
    { day: 'Tue', total: 9, resolved: 7, critical: 2 },
    { day: 'Wed', total: 4, resolved: 4, critical: 0 },
    { day: 'Thu', total: 8, resolved: 6, critical: 1 },
    { day: 'Fri', total: 11, resolved: 9, critical: 3 },
    { day: 'Sat', total: 3, resolved: 3, critical: 0 },
    { day: 'Sun', total: 2, resolved: 2, critical: 0 },
  ];

  const services = [
    { name: 'PostgreSQL', count: 8, pct: 33, color: 'bg-blue-500' },
    { name: 'API Gateway', count: 6, pct: 25, color: 'bg-indigo-500' },
    { name: 'Worker Service', count: 4, pct: 17, color: 'bg-purple-500' },
    { name: 'Frontend', count: 3, pct: 12, color: 'bg-amber-500' },
    { name: 'Others', count: 3, pct: 12, color: 'bg-emerald-500' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Dashboard</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor incidents, get AI-powered insights, and learn from your operational history.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-transparent border-none text-xs text-slate-200 focus:outline-none cursor-pointer font-medium"
            >
              <option value="Last 7 days">Last 7 days</option>
              <option value="Last 30 days">Last 30 days</option>
              <option value="Last 90 days">Last 90 days</option>
            </select>
          </div>

          <button
            onClick={onNewIncident}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-900/30 transition"
          >
            + New Incident
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Incidents */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Incidents</span>
            <div className="p-1.5 rounded-lg bg-blue-950/80 text-blue-400">
              <Server className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-mono font-extrabold text-white">24</span>
            <span className="text-xs text-emerald-400 flex items-center font-medium font-mono">
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>20%</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Across all environments</p>
        </div>

        {/* Resolved */}
        <div className="glass-card p-5 rounded-2xl border border-emerald-900/30 space-y-2">
          <div className="flex items-center justify-between text-xs text-emerald-400">
            <span>Resolved</span>
            <div className="p-1.5 rounded-lg bg-emerald-950/80 text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-mono font-extrabold text-emerald-400">18</span>
            <span className="text-xs text-emerald-400 flex items-center font-medium font-mono">
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>50%</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Confirmed fixes in Hindsight</p>
        </div>

        {/* Critical Open */}
        <div className="glass-card p-5 rounded-2xl border border-red-900/30 space-y-2">
          <div className="flex items-center justify-between text-xs text-red-400">
            <span>Critical Open</span>
            <div className="p-1.5 rounded-lg bg-red-950/80 text-red-400">
              <Flame className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-mono font-extrabold text-red-400">3</span>
            <span className="text-xs text-emerald-400 flex items-center font-medium font-mono">
              <ArrowDownRight className="h-3.5 w-3.5" />
              <span>25%</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Under active investigation</p>
        </div>

        {/* Memory Hits */}
        <div className="glass-card p-5 rounded-2xl border border-purple-900/30 space-y-2">
          <div className="flex items-center justify-between text-xs text-purple-400">
            <span>Memory Hits</span>
            <div className="p-1.5 rounded-lg bg-purple-950/80 text-purple-400">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-mono font-extrabold text-purple-300">16</span>
            <span className="text-xs text-emerald-400 flex items-center font-medium font-mono">
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>60%</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Recalled past post-mortems</p>
        </div>
      </div>

      {/* 2 Graphs Row: Incident Trends + Top Services */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Incident Trends Bar Chart */}
        <div className="lg:col-span-8 glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                <BarChart3 className="h-4 w-4 text-blue-400" />
                <span>Incident Trends</span>
              </h3>
              <p className="text-[11px] text-slate-400">Daily breakdown of total, resolved, and critical events</p>
            </div>

            {/* Legend */}
            <div className="flex items-center space-x-3 text-[11px]">
              <span className="flex items-center space-x-1 text-blue-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block" />
                <span>Total</span>
              </span>
              <span className="flex items-center space-x-1 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />
                <span>Resolved</span>
              </span>
              <span className="flex items-center space-x-1 text-pink-500">
                <span className="w-2.5 h-2.5 rounded-sm bg-pink-500 inline-block" />
                <span>Critical</span>
              </span>
            </div>
          </div>

          {/* Bar Chart Visual */}
          <div className="pt-4 h-48 flex items-end justify-between gap-3 border-b border-slate-800 pb-2">
            {days.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center space-y-2 group">
                <div className="w-full flex items-end justify-center space-x-1 h-36">
                  {/* Total Bar */}
                  <div
                    style={{ height: `${(d.total / 12) * 100}%` }}
                    className="w-3 bg-blue-500/80 hover:bg-blue-400 rounded-t transition-all group-hover:scale-y-105"
                    title={`Total: ${d.total}`}
                  />
                  {/* Resolved Bar */}
                  <div
                    style={{ height: `${(d.resolved / 12) * 100}%` }}
                    className="w-3 bg-emerald-500/80 hover:bg-emerald-400 rounded-t transition-all group-hover:scale-y-105"
                    title={`Resolved: ${d.resolved}`}
                  />
                  {/* Critical Bar */}
                  <div
                    style={{ height: `${(d.critical / 12) * 100}%` }}
                    className="w-3 bg-pink-500/80 hover:bg-pink-400 rounded-t transition-all group-hover:scale-y-105"
                    title={`Critical: ${d.critical}`}
                  />
                </div>
                <span className="text-[11px] font-mono text-slate-400">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Services Breakdown */}
        <div className="lg:col-span-4 glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
              <PieChart className="h-4 w-4 text-purple-400" />
              <span>Top Services</span>
            </h3>
            <span className="text-xs font-mono font-bold text-slate-400">24 Total</span>
          </div>

          <div className="space-y-3 pt-2">
            {services.map((svc) => (
              <div
                key={svc.name}
                onClick={() => onSelectService(svc.name)}
                className="cursor-pointer p-2.5 rounded-xl hover:bg-slate-900/80 transition space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${svc.color}`} />
                    <span className="font-semibold text-slate-200">{svc.name}</span>
                  </div>
                  <div className="font-mono text-slate-400 text-[11px]">
                    {svc.count} <span className="text-slate-500">({svc.pct}%)</span>
                  </div>
                </div>

                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                  <div className={`${svc.color} h-full rounded-full`} style={{ width: `${svc.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
