import React, { useState } from 'react';
import { 
  BrainCircuit, 
  Search, 
  CheckCircle2, 
  BookOpen, 
  Sparkles, 
  Server, 
  Terminal,
  ShieldCheck,
  Tag,
  Clock,
  Layers,
  ArrowRight
} from 'lucide-react';
import { IncidentRecord } from '../../../server/memoryOps';

interface MemoryExplorerProps {
  incidents: IncidentRecord[];
  onSelectIncident: (inc: IncidentRecord) => void;
}

export const MemoryExplorer: React.FC<MemoryExplorerProps> = ({ incidents, onSelectIncident }) => {
  const [search, setSearch] = useState('');
  const [selectedIncident, setSelectedIncident] = useState<IncidentRecord>(incidents[0] || null);
  const [activeTab, setActiveTab] = useState<'Overview' | 'Root Cause' | 'Solution' | 'Learnings'>('Overview');

  const resolvedIncidents = incidents.filter(i => 
    i.title.toLowerCase().includes(search.toLowerCase()) ||
    i.service.toLowerCase().includes(search.toLowerCase()) ||
    i.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Memory Explorer</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Explore past incidents and learn from historical resolutions in the Hindsight bank.
          </p>
        </div>
      </div>

      {/* 2-Column Split View: List on Left, Detail on Right (Matches Screenshot) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: List of Memories */}
        <div className="lg:col-span-5 space-y-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search memories, services, or tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {resolvedIncidents.map((inc) => {
              const isSelected = selectedIncident?.id === inc.id;
              return (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className={`cursor-pointer p-4 rounded-xl border transition duration-150 space-y-2 ${
                    isSelected
                      ? 'bg-blue-950/40 border-blue-500/60 shadow-lg shadow-blue-950/40'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold text-blue-400">{inc.id}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-medium">
                      {inc.status}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-100 leading-snug">{inc.title}</h4>
                  
                  <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-mono">
                    <span>Service: <strong className="text-slate-300 font-normal">{inc.service}</strong></span>
                    <span>•</span>
                    <span>{inc.environment}</span>
                  </div>

                  {inc.resolution && (
                    <p className="text-[11px] text-slate-400 line-clamp-1 italic">
                      Fix: {inc.resolution.fixApplied}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Memory Inspector */}
        <div className="lg:col-span-7">
          {selectedIncident ? (
            <div className="glass-card rounded-2xl border border-slate-800 p-6 space-y-5 shadow-2xl">
              {/* Card Header */}
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                      {selectedIncident.id}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {new Date(selectedIncident.createdAt).toLocaleDateString()} • {selectedIncident.environment}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">{selectedIncident.title}</h3>
                  <div className="text-xs text-slate-400 font-mono">
                    Service: <strong className="text-blue-400">{selectedIncident.service}</strong>
                  </div>
                </div>

                <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold shrink-0">
                  {selectedIncident.status}
                </span>
              </div>

              {/* Sub-Tabs: Overview, Root Cause, Solution, Learnings */}
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
                {(['Overview', 'Root Cause', 'Solution', 'Learnings'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                      activeTab === tab
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="space-y-4 text-xs">
                {activeTab === 'Overview' && (
                  <div className="space-y-3">
                    <div>
                      <span className="text-slate-400 font-semibold block mb-1">Incident Description & Raw Logs:</span>
                      <pre className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto whitespace-pre-wrap">
                        {selectedIncident.rawLogs}
                      </pre>
                    </div>

                    {/* Tags */}
                    <div>
                      <span className="text-slate-400 font-semibold block mb-1">Tags:</span>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="text-[10px] px-2.5 py-0.5 rounded-md bg-slate-800 text-blue-300 border border-slate-700 font-mono">
                          #{selectedIncident.service}
                        </span>
                        <span className="text-[10px] px-2.5 py-0.5 rounded-md bg-slate-800 text-purple-300 border border-slate-700 font-mono">
                          #{selectedIncident.severity}
                        </span>
                        <span className="text-[10px] px-2.5 py-0.5 rounded-md bg-slate-800 text-emerald-300 border border-slate-700 font-mono">
                          #HindsightRetained
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'Root Cause' && (
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <span className="font-bold text-amber-400 block text-xs uppercase tracking-wider">Confirmed Ground Truth:</span>
                    <p className="text-slate-200 text-xs leading-relaxed">
                      {selectedIncident.resolution?.confirmedRootCause || 'Under active root cause investigation.'}
                    </p>
                  </div>
                )}

                {activeTab === 'Solution' && (
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <span className="font-bold text-emerald-400 block text-xs uppercase tracking-wider">Verified Resolution Applied:</span>
                    <p className="text-emerald-300/90 text-xs leading-relaxed font-mono">
                      {selectedIncident.resolution?.fixApplied || 'Troubleshooting runbook in progress.'}
                    </p>
                    {selectedIncident.resolution?.confirmedBy && (
                      <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-900">
                        Verified by: <strong className="text-slate-300">{selectedIncident.resolution.confirmedBy}</strong>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'Learnings' && (
                  <div className="p-4 bg-purple-950/30 rounded-xl border border-purple-800/40 space-y-2">
                    <span className="font-bold text-purple-300 block text-xs uppercase tracking-wider flex items-center space-x-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-pink-400" />
                      <span>Post-Mortem Operational Heuristics</span>
                    </span>
                    <p className="text-slate-200 text-xs leading-relaxed italic">
                      "{selectedIncident.resolution?.postMortemLessons || 'Always ensure pre-flight configuration validations are in place.'}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-2xl border border-slate-800 p-12 text-center text-slate-400">
              Select an incident from the left to view memory details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
