import React, { useState } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  Play, 
  CheckCircle2, 
  BrainCircuit, 
  Activity, 
  Terminal, 
  Cpu, 
  Copy, 
  Check, 
  ShieldAlert,
  Zap,
  Server,
  Layers,
  Database
} from 'lucide-react';

interface HeroLandingProps {
  onGetStarted: () => void;
  onExploreMemory: () => void;
  onOpenDemo: (preset: any) => void;
}

export const HeroLanding: React.FC<HeroLandingProps> = ({
  onGetStarted,
  onExploreMemory,
  onOpenDemo,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const copyRemediation = () => {
    navigator.clipboard.writeText('kubectl set env deployment/pgbouncer POOL_SIZE=100 -n production && kubectl rollout restart deployment/checkout-service');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const demoPresets = [
    {
      id: 'db-exhaustion',
      title: 'Postgres Connection Pool Starvation',
      service: 'checkout-service',
      severity: 'P1',
      rawLogs: `[ERROR] [db_pool] Timeout: connection pool exhausted (max_connections=100)\n[WARN] [http_handler] 504 Gateway Timeout on POST /v1/checkout\n[ERROR] [pg_driver] could not obtain connection from pool within 5000ms`,
      notes: 'Triggered during evening surge. Matches historical incident INC-104.',
      timeReduction: '45m → 3.5m'
    },
    {
      id: 'jwks-timeout',
      title: 'Auth Service JWKS Key Rotation Failure',
      service: 'auth-service',
      severity: 'P1',
      rawLogs: `[FATAL] [auth_init] HTTP 504 Gateway Timeout on https://auth.internal/jwks\n[FATAL] Unable to verify JWT token signatures for active API gateways`,
      notes: 'Certificate expired on canary endpoint. Matches historical incident INC-106.',
      timeReduction: '60m → 4.2m'
    },
    {
      id: 'oom-leak',
      title: 'Notification Worker Buffer Memory Leak',
      service: 'notification-worker',
      severity: 'P2',
      rawLogs: `[WARN] [memory_monitor] Container RSS memory reached 98% (limit: 2048Mi)\n[ERROR] [k8s] Pod notification-worker-x921 was OOMKilled (exit code 137)`,
      notes: 'Async queue buffered 50k items without backpressure. Matches historical incident INC-108.',
      timeReduction: '35m → 2.8m'
    }
  ];

  return (
    <div className="space-y-24 animate-in fade-in duration-300">
      {/* 1. HERO SECTION (Matching exact visual design from screenshot) */}
      <section className="relative pt-12 pb-24 text-center overflow-hidden">
        {/* Subtle Starry Particles Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff18_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none opacity-40" />

        {/* Central Purple/Indigo Nebula Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] bg-gradient-to-tr from-purple-600/25 via-indigo-600/30 to-blue-600/20 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[850px] h-[200px] bg-purple-900/15 blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          {/* Floating Product Hunt Capsule Badge (Exact Screenshot Design) */}
          <div className="inline-block">
            <div className="inline-flex items-center space-x-3 px-5 py-2 rounded-full bg-white text-slate-900 shadow-2xl shadow-purple-500/10 transform hover:scale-105 transition duration-200">
              {/* Product Hunt Circle Icon */}
              <div className="w-6 h-6 rounded-full bg-[#DA552F] flex items-center justify-center text-white font-extrabold text-[12px] shrink-0">
                P
              </div>
              <div className="text-left">
                <div className="text-[9px] uppercase tracking-wider font-extrabold text-slate-500 font-mono leading-none">
                  #1 PRODUCT OF THE WEEK
                </div>
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  Developer & SRE Tools
                </div>
              </div>
            </div>
          </div>

          {/* Main Huge Center Title */}
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
              Full-Stack AI SRE <br />
              <span>Agent for DevOps</span>
            </h1>
          </div>

          {/* Subtitle description */}
          <p className="text-slate-300/90 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-normal">
            Accelerate your engineering team's incident recovery and eliminate recurring outages. MemoryOps is the AI Incident Agent built to remember past failures, root causes, and verified runbooks. Try free or watch it work:
          </p>

          {/* Pill Action Buttons (Exact Screenshot Design) */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            {/* White Pill Button */}
            <button
              onClick={onGetStarted}
              className="px-7 py-3.5 rounded-full bg-white text-slate-950 font-bold text-xs sm:text-sm hover:bg-slate-100 shadow-xl shadow-white/10 transition transform hover:-translate-y-0.5 flex items-center space-x-2"
            >
              <span>Start Clearing Incidents</span>
              <ArrowRight className="h-4 w-4 ml-0.5" />
            </button>

            {/* Dark Translucent Glass Pill Button */}
            <button
              onClick={() => onOpenDemo(demoPresets[0])}
              className="px-6 py-3.5 rounded-full bg-white/[0.08] hover:bg-white/[0.14] text-slate-200 font-medium text-xs sm:text-sm border border-white/15 backdrop-blur-md transition flex items-center space-x-2"
            >
              <Sparkles className="h-4 w-4 text-purple-300" />
              <span>Watch the Agent Work</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. SUB-HERO PARTNER / ECOSYSTEM TAGLINE */}
      <section className="text-center space-y-6 max-w-5xl mx-auto px-4">
        <p className="text-xs sm:text-sm font-medium text-slate-400">
          The best engineering teams use AI Agents with Persistent Memory
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-slate-500 text-xs font-mono font-bold tracking-wider uppercase opacity-70">
          <span className="hover:text-slate-300 transition">Kubernetes</span>
          <span className="hover:text-slate-300 transition">PostgreSQL</span>
          <span className="hover:text-slate-300 transition">Datadog</span>
          <span className="hover:text-slate-300 transition">AWS Cloud</span>
          <span className="hover:text-slate-300 transition">PagerDuty</span>
          <span className="hover:text-slate-300 transition">Redis</span>
          <span className="hover:text-slate-300 transition">Kafka</span>
        </div>
      </section>

      {/* 3. INTERACTIVE TOPOLOGY & SOLUTION GRAPH (Reference Image 1) */}
      <section className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#070B18] relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 border-b border-white/5 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 text-xs font-bold border border-purple-500/20">
                LIVE TOPOLOGY & MEMORY CORRELATION
              </span>
              <span className="text-slate-400 text-xs">• Active Incident INC-104</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Autonomous Correlation Across Distributed Microservices
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-xs font-mono text-red-400 font-bold">P1 OUTAGE MITIGATION READY</span>
          </div>
        </div>

        {/* Topology Node Graph Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Interactive Topology Event Nodes */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 space-y-3">
              <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-red-400" />
                  <span>1. Incident Ingestion & Secret Redaction</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded">
                  Tokens Scrubbed
                </span>
              </div>
              <div className="p-3 bg-red-950/30 border border-red-900/50 rounded-xl font-mono text-xs text-red-200">
                <p className="text-slate-400 text-[10px]">// Incoming telemetry from checkout-service pod</p>
                <p>FATAL: remaining connection slots reserved (pg_bouncer: 100/100 active)</p>
                <p className="text-red-400">HTTP 504 Gateway Timeout spiked to 38.4% on POST /v1/checkout</p>
              </div>
            </div>

            {/* Flow line */}
            <div className="flex items-center justify-center py-1">
              <div className="h-6 w-px bg-gradient-to-b from-red-500 to-purple-500"></div>
            </div>

            {/* Node 2: Hindsight Memory Recall */}
            <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-900/50 space-y-3">
              <div className="text-xs font-bold text-purple-200 flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <BrainCircuit className="h-4 w-4 text-purple-400" />
                  <span>2. Hindsight Biomimetic Recall (Cosine: 0.94)</span>
                </span>
                <span className="text-[10px] font-mono text-purple-300 bg-purple-900/60 px-2 py-0.5 rounded">
                  INC-104 Matched
                </span>
              </div>
              <p className="text-xs text-slate-300">
                MemoryOps AI identified an exact match from <strong className="text-purple-300">INC-104 (Oct 14 Postmortem)</strong>: Idle client connections held by unpooled batch sync worker during flash sale.
              </p>
            </div>
          </div>

          {/* Right: Prescribed Solution Flyout Card */}
          <div className="lg:col-span-5 glass-card p-5 rounded-2xl border border-purple-900/40 bg-gradient-to-b from-purple-950/20 to-slate-950 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-300 flex items-center space-x-1.5">
                <Sparkles className="h-4 w-4 text-cyan-400" />
                <span>AI Root Cause & Remediation</span>
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                96% Confidence
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white">PostgreSQL Connection Exhaustion</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Max connection ceiling hit due to unclosed database handles in background payment reconciler worker.
              </p>
            </div>

            {/* Recommended CLI Command with Copy */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300">Verified Runbook Execution:</span>
                <button 
                  onClick={copyRemediation}
                  className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300"
                >
                  {copiedCode ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedCode ? 'Copied' : 'Copy CLI'}</span>
                </button>
              </div>
              <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-cyan-300 overflow-x-auto whitespace-pre-wrap">
kubectl scale deployment/payment-reconciler --replicas=0 -n prod && kubectl set env deployment/pgbouncer POOL_SIZE=120
              </pre>
            </div>

            <button
              onClick={() => onOpenDemo(demoPresets[0])}
              className="w-full py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition"
            >
              Analyze in Sandbox Command Center →
            </button>
          </div>
        </div>
      </section>

      {/* 4. 1-Click Interactive Demo Presets */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Explore Pre-Loaded Production Incident Scenarios
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Select an incident below to see how MemoryOps retrieves historical context and recommends immediate fixes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {demoPresets.map((preset) => (
            <div
              key={preset.id}
              onClick={() => onOpenDemo(preset)}
              className="glass-card glass-card-hover p-5 rounded-2xl border border-white/10 cursor-pointer space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold font-mono ${
                  preset.severity === 'P1' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                }`}>
                  {preset.severity} INCIDENT
                </span>
                <span className="text-xs text-emerald-400 font-mono font-bold">{preset.timeReduction}</span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition">
                  {preset.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {preset.notes}
                </p>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-purple-400 font-semibold">
                <span>Run Memory Analysis</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
