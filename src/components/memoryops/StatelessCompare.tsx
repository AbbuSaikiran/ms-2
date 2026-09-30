import React, { useState } from 'react';
import { 
  SplitSquareVertical, 
  Bot, 
  BrainCircuit, 
  AlertTriangle, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  Flame,
  CheckCircle2,
  Terminal
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface StatelessCompareProps {
  currentIncident?: any;
}

const COMPARISON_SCENARIOS = [
  {
    id: 'inc-104',
    title: 'Payment Gateway 504 Outage (PgBouncer Exhaustion)',
    service: 'payment-gateway',
    prompt: `[ERROR] [db_pool] Timeout: connection pool exhausted (max_connections=100)
[WARN]  [http_handler] 504 Gateway Timeout on POST /v1/checkout
[ERROR] [pg_driver] could not obtain connection from pool within 5000ms`,
    statelessResponse: {
      summary: 'Generic microservice failure. Recommends restarting application pods and checking upstream ingress logs.',
      drawbacks: [
        'Suggests restarting pods, which causes cascading connection reconnect storms during high traffic.',
        'No knowledge of PgBouncer pool sizing or Redis cache config.',
        'Forces SREs to re-diagnose from scratch.',
      ]
    },
    memoryResponse: {
      summary: 'Instantly matches INC-104 and Hindsight model. Identifies DB connection starvation.',
      advantages: [
        'Explicitly warns AGAINST restarting pods (prevents retry storm).',
        'Provides exact tested runbook command: kubectl scale deployment/pgbouncer --replicas=5.',
        'Recommends enabling Redis stale-while-revalidate for read endpoints.',
        'Cites verified post-mortem confirmed by Staff SRE Alex Rivera.',
      ]
    }
  },
  {
    id: 'inc-208',
    title: 'Auth Service CrashLoopBackOff (Missing Vault Secret)',
    service: 'auth-service',
    prompt: `[FATAL] [auth_init] KeyError: 'JWT_SIGNING_SECRET_V2' not found in environment
[FATAL] [runtime] Container crashed with exit code 1
[ERROR] [k8s_events] Back-off restarting failed container auth-service-pod-7f9a`,
    statelessResponse: {
      summary: 'Container crashed with exit code 1. Recommends inspecting Dockerfile or increasing pod memory limit.',
      drawbacks: [
        'Misdiagnoses missing secret as potential memory/Docker issue.',
        'No awareness of newly introduced JWT_SIGNING_SECRET_V2 schema.',
      ]
    },
    memoryResponse: {
      summary: 'Matches INC-208 post-mortem. Identifies CI/CD Vault key omission immediately.',
      advantages: [
        'Pins the root cause to staging namespace Vault secret synchronization.',
        'Provides verified fix command: kubectl apply -f k8s/staging/secrets.yaml.',
        'Suggests pre-deployment Helm schema validation rule.',
      ]
    }
  }
];

export const StatelessCompare: React.FC<StatelessCompareProps> = () => {
  const [selectedScenario, setSelectedScenario] = useState(COMPARISON_SCENARIOS[0]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-6 glass-card rounded-2xl border border-purple-900/30 space-y-2">
        <div className="flex items-center space-x-2 text-xs font-bold text-purple-300 uppercase tracking-wider">
          <SplitSquareVertical className="h-4 w-4 text-pink-400" />
          <span>FR-07: Stateless LLM vs Hindsight Memory-Informed Diagnosis</span>
        </div>
        <h2 className="text-xl font-bold text-white">The Operational Difference: Proof of Memory Value</h2>
        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          Stateless assistants treat every outage as day one, frequently recommending dangerous generic fixes (like pod restarts). MemoryOps AI grounds recommendations in historical post-mortems and confirmed runbooks.
        </p>
      </div>

      {/* Scenario Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {COMPARISON_SCENARIOS.map((sc) => (
          <div
            key={sc.id}
            onClick={() => setSelectedScenario(sc)}
            className={`cursor-pointer p-4 rounded-xl border transition ${
              selectedScenario.id === sc.id
                ? 'bg-purple-950/40 border-purple-500/60 shadow-lg'
                : 'glass-card glass-card-hover border-slate-800'
            }`}
          >
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase block w-max mb-1 font-bold">
              {sc.service}
            </span>
            <h4 className="text-xs font-bold text-slate-100">{sc.title}</h4>
          </div>
        ))}
      </div>

      {/* Side by Side Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stateless LLM */}
        <div className="glass-card rounded-2xl border border-red-900/40 overflow-hidden shadow-xl flex flex-col">
          <div className="p-4 bg-red-950/40 border-b border-red-900/40 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-lg bg-red-950 text-red-400 border border-red-800">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-100">Standard Stateless LLM</h3>
                <p className="text-[11px] text-red-400/80">Zero Historical Memory • Blind Triage</p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
              No Context
            </span>
          </div>

          <div className="p-5 flex-1 space-y-4 text-xs">
            <div className="p-3 bg-red-950/20 border border-red-900/30 rounded-xl space-y-1">
              <span className="font-semibold text-red-300 block">Typical Recommendation:</span>
              <p className="text-slate-300 leading-relaxed font-sans">{selectedScenario.statelessResponse.summary}</p>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-red-400 uppercase text-[11px] tracking-wider block">Critical Risks & Blindspots:</span>
              <ul className="space-y-1.5 text-slate-300">
                {selectedScenario.statelessResponse.drawbacks.map((d, i) => (
                  <li key={i} className="flex items-start space-x-2 text-[11px]">
                    <AlertTriangle className="h-3.5 w-3.5 text-red-400 shrink-0 mt-0.5" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* MemoryOps AI */}
        <div className="glass-card rounded-2xl border border-purple-500/50 overflow-hidden shadow-2xl flex flex-col relative ring-1 ring-purple-500/30">
          <div className="p-4 bg-gradient-to-r from-purple-950/60 to-blue-950/60 border-b border-purple-500/30 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-lg bg-purple-600 text-white shadow-lg shadow-purple-600/30">
                <BrainCircuit className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white flex items-center space-x-1.5">
                  <span>MemoryOps AI</span>
                  <Sparkles className="h-3.5 w-3.5 text-pink-400" />
                </h3>
                <p className="text-[11px] text-purple-300 font-medium">Hindsight Persistent Operational Memory</p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-900 text-purple-200 border border-purple-700">
              Grounded in Post-Mortems
            </span>
          </div>

          <div className="p-5 flex-1 space-y-4 text-xs">
            <div className="p-3 bg-purple-950/30 border border-purple-800/40 rounded-xl space-y-1">
              <span className="font-semibold text-purple-300 block">Memory-Informed Recommendation:</span>
              <p className="text-slate-200 leading-relaxed font-sans">{selectedScenario.memoryResponse.summary}</p>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-emerald-400 uppercase text-[11px] tracking-wider block">Operational Advantages:</span>
              <ul className="space-y-1.5 text-slate-200">
                {selectedScenario.memoryResponse.advantages.map((adv, i) => (
                  <li key={i} className="flex items-start space-x-2 text-[11px]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{adv}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
