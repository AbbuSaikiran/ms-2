import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  CheckCircle2, 
  Clock, 
  Flame,
  Layers,
  ArrowRight
} from 'lucide-react';
import { IncidentRecord } from '../../../server/memoryOps';

interface IncidentHistoryTableProps {
  incidents: IncidentRecord[];
  onSelectIncident: (inc: IncidentRecord) => void;
}

export const IncidentHistoryTable: React.FC<IncidentHistoryTableProps> = ({
  incidents,
  onSelectIncident,
}) => {
  const [search, setSearch] = useState('');
  const [serviceFilter, setServiceFilter] = useState('All Services');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [envFilter, setEnvFilter] = useState('All Environments');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredIncidents = incidents.filter((i) => {
    const matchesSearch =
      i.id.toLowerCase().includes(search.toLowerCase()) ||
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.service.toLowerCase().includes(search.toLowerCase());

    const matchesService = serviceFilter === 'All Services' || i.service === serviceFilter;
    const matchesStatus = statusFilter === 'All Status' || i.status === statusFilter;
    const matchesEnv = envFilter === 'All Environments' || i.environment === envFilter;

    return matchesSearch && matchesService && matchesStatus && matchesEnv;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Incident History</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            View and manage all incidents with their resolution status and Hindsight memory links.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search incidents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-red-500"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex items-center space-x-2.5 w-full md:w-auto overflow-x-auto">
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-red-500"
          >
            <option value="All Services">All Services</option>
            <option value="payment-gateway">payment-gateway</option>
            <option value="auth-service">auth-service</option>
            <option value="notification-worker">notification-worker</option>
            <option value="PostgreSQL">PostgreSQL</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-red-500"
          >
            <option value="All Status">All Status</option>
            <option value="Resolved">Resolved</option>
            <option value="Diagnosed">Diagnosed</option>
            <option value="Investigating">Investigating</option>
          </select>

          <select
            value={envFilter}
            onChange={(e) => setEnvFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-red-500"
          >
            <option value="All Environments">All Environments</option>
            <option value="Production">Production</option>
            <option value="Staging">Staging</option>
            <option value="Development">Development</option>
          </select>
        </div>
      </div>

      {/* Table Card */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-4 font-mono">INC ID</th>
                <th className="py-3.5 px-4">Title</th>
                <th className="py-3.5 px-4">Service</th>
                <th className="py-3.5 px-4">Severity</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 font-mono">Created</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredIncidents.map((inc) => (
                <tr
                  key={inc.id}
                  onClick={() => onSelectIncident(inc)}
                  className="hover:bg-slate-900/80 cursor-pointer transition"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-200">
                    {inc.id}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-200 max-w-xs truncate">
                    {inc.title}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">
                    {inc.service}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                        inc.severity === 'Critical'
                          ? 'bg-red-950 text-red-300 border border-red-800'
                          : inc.severity === 'High'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-blue-950 text-blue-300 border border-blue-800'
                      }`}
                    >
                      {inc.severity}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-mono px-2.5 py-1 rounded-full font-semibold ${
                        inc.status === 'Resolved'
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                          : 'bg-amber-950/80 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {inc.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                    {new Date(inc.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectIncident(inc);
                      }}
                      className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center space-x-1 ml-auto"
                    >
                      <span>View</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between text-xs text-slate-400">
          <span>Showing {filteredIncidents.length} of {incidents.length} incidents</span>
          <div className="flex items-center space-x-1.5">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white disabled:opacity-40 transition"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="px-3 py-1 rounded-lg bg-red-600 text-white font-mono font-bold">1</button>
            <button className="px-3 py-1 rounded-lg border border-slate-800 text-slate-300 font-mono hover:bg-slate-800">2</button>
            <button className="px-3 py-1 rounded-lg border border-slate-800 text-slate-300 font-mono hover:bg-slate-800">3</button>
            <button className="px-3 py-1 rounded-lg border border-slate-800 text-slate-300 font-mono hover:bg-slate-800">4</button>
            <button
              onClick={() => setCurrentPage(p => p + 1)}
              className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white transition"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
