import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Terminal, 
  Clock, 
  CheckCircle2, 
  ExternalLink,
  ShieldCheck,
  Zap,
  Play,
  Copy,
  Check
} from 'lucide-react';

interface Runbook {
  id: string;
  title: string;
  category: 'Database' | 'Deployment' | 'Performance' | 'API';
  description: string;
  stepsCount: number;
  readTime: string;
  steps: Array<{ step: number; title: string; command?: string }>;
  verifiedFromIncident: string;
}

const RUNBOOK_DATA: Runbook[] = [
  {
    id: 'rb-1',
    title: 'PostgreSQL Connection Issues',
    category: 'Database',
    description: 'Step-by-step guide to diagnose and fix PostgreSQL connection pool exhaustion and idle transaction leaks.',
    stepsCount: 4,
    readTime: '5 min read',
    verifiedFromIncident: 'INC-104',
    steps: [
      { step: 1, title: 'Inspect active client connections on PgBouncer', command: 'kubectl exec -it deployment/pgbouncer -- psql -c "SHOW POOLS;"' },
      { step: 2, title: 'Scale PgBouncer pooler size', command: 'kubectl scale deployment/pgbouncer --replicas=5 -n production' },
      { step: 3, title: 'Kill idle-in-transaction connection leaks', command: "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'idle in transaction' AND state_change < current_timestamp - INTERVAL '5' MINUTE;" },
      { step: 4, title: 'Enable Redis stale-while-revalidate for critical read paths' },
    ]
  },
  {
    id: 'rb-2',
    title: 'Deployment Failure Troubleshooting',
    category: 'Deployment',
    description: 'Resolve CrashLoopBackOff caused by missing environment variables or unconfigured Vault secrets.',
    stepsCount: 6,
    readTime: '8 min read',
    verifiedFromIncident: 'INC-208',
    steps: [
      { step: 1, title: 'Check pod crash logs and error codes', command: 'kubectl logs deployment/auth-service --tail=50' },
      { step: 2, title: 'Validate required Helm values schema', command: 'helm lint ./charts/app' },
      { step: 3, title: 'Sync missing Vault secret keys into namespace', command: 'kubectl apply -f k8s/staging/secrets.yaml' },
      { step: 4, title: 'Trigger rolling restart of application pods', command: 'kubectl rollout restart deployment/auth-service' },
    ]
  },
  {
    id: 'rb-3',
    title: 'High Memory Usage Investigation',
    category: 'Performance',
    description: 'How to diagnose and resolve OOMKilled worker pods and unbounded async queues.',
    stepsCount: 10,
    readTime: '15 min read',
    verifiedFromIncident: 'INC-319',
    steps: [
      { step: 1, title: 'Inspect container RSS memory metrics', command: 'kubectl top pods -l app=notification-worker' },
      { step: 2, title: 'Lower worker queue batch size limit from 50k to 500 items' },
      { step: 3, title: 'Scale worker pods to drain backlog', command: 'kubectl scale deployment/notification-worker --replicas=6' },
    ]
  },
  {
    id: 'rb-4',
    title: 'API Gateway 504 Timeout Mitigation',
    category: 'API',
    description: 'Mitigate upstream timeout spikes without causing microservice restart storms.',
    stepsCount: 3,
    readTime: '4 min read',
    verifiedFromIncident: 'INC-104',
    steps: [
      { step: 1, title: 'Do not restart pods (prevents retry storm)' },
      { step: 2, title: 'Scale PgBouncer pooler replicas', command: 'kubectl scale deployment/pgbouncer-pool --replicas=5' },
      { step: 3, title: 'Verify error rate drops to <0.01% in Grafana' },
    ]
  }
];

export const RunbookLibrary: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Runbooks');
  const [search, setSearch] = useState('');
  const [selectedRunbook, setSelectedRunbook] = useState<Runbook | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const categories = ['All Runbooks', 'Database', 'Deployment', 'Performance', 'API'];

  const filteredRunbooks = RUNBOOK_DATA.filter((rb) => {
    const matchesCategory = selectedCategory === 'All Runbooks' || rb.category === selectedCategory;
    const matchesSearch =
      rb.title.toLowerCase().includes(search.toLowerCase()) ||
      rb.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (cmd: string, idx: number) => {
    navigator.clipboard.writeText(cmd);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Runbook Library</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Quick access to proven operational solutions and verified troubleshooting guides.
          </p>
        </div>

        <button
          onClick={() => setSelectedRunbook(RUNBOOK_DATA[0])}
          className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-900/30 transition self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>New Runbook</span>
        </button>
      </div>

      {/* Search & Category Filter Pills */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search runbooks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Runbooks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRunbooks.map((rb) => (
          <div
            key={rb.id}
            onClick={() => setSelectedRunbook(rb)}
            className="cursor-pointer p-6 glass-card glass-card-hover rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 uppercase">
                  {rb.category}
                </span>
                <span className="text-[10px] text-emerald-400 font-mono font-medium flex items-center space-x-1">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Verified via {rb.verifiedFromIncident}</span>
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-100">{rb.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{rb.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span className="flex items-center space-x-1">
                <Terminal className="h-3.5 w-3.5 text-blue-400" />
                <span>{rb.stepsCount} steps</span>
              </span>
              <span className="flex items-center space-x-1">
                <Clock className="h-3.5 w-3.5 text-slate-500" />
                <span>{rb.readTime}</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedRunbook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 uppercase">
                  {selectedRunbook.category}
                </span>
                <h3 className="text-base font-bold text-slate-100 mt-1">{selectedRunbook.title}</h3>
              </div>
              <button
                onClick={() => setSelectedRunbook(null)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <p className="text-xs text-slate-300 leading-relaxed">{selectedRunbook.description}</p>

              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider">Troubleshooting Steps</h4>
                {selectedRunbook.steps.map((st, i) => (
                  <div key={i} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center space-x-2 text-xs font-semibold text-slate-200">
                      <span className="w-5 h-5 rounded-full bg-blue-900/60 text-blue-300 text-[10px] font-bold flex items-center justify-center">
                        {st.step}
                      </span>
                      <span>{st.title}</span>
                    </div>

                    {st.command && (
                      <div className="flex items-center justify-between p-2.5 bg-slate-900 rounded-lg border border-slate-800 font-mono text-xs text-slate-300">
                        <code className="text-emerald-400 truncate">{st.command}</code>
                        <button
                          onClick={() => handleCopy(st.command!, i)}
                          className="p-1 text-slate-400 hover:text-white rounded ml-2"
                        >
                          {copiedIndex === i ? (
                            <Check className="h-4 w-4 text-emerald-400" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono text-[11px]">Grounded in Hindsight Memory • {selectedRunbook.verifiedFromIncident}</span>
              <button
                onClick={() => setSelectedRunbook(null)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
