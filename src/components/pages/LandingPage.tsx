import React from 'react';
import { 
  Zap, 
  Sparkles, 
  ArrowRight, 
  Play, 
  CheckCircle2, 
  BrainCircuit, 
  ShieldAlert, 
  Database, 
  Clock, 
  Cpu, 
  Layers, 
  Server, 
  Lock, 
  Activity,
  Terminal,
  BookOpen,
  GitBranch,
  Network,
  Share2,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

interface LandingPageProps {
  onGetStarted: () => void;
  onExploreDemo: () => void;
  onSignIn: () => void;
  onDocs: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onExploreDemo,
  onSignIn,
  onDocs,
}) => {
  return (
    <div className="space-y-24 animate-in fade-in duration-300">
      {/* 1. Hero Section (Inspired by Image 2 - Dark Cosmic Glow & Starry Aesthetic) */}
      <section className="relative pt-10 pb-16 overflow-hidden rounded-3xl bg-[#080D1A] border border-white/5">
        {/* Ambient Cosmic Lights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-blue-600/15 via-indigo-600/20 to-purple-600/15 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-10 left-1/4 w-80 h-80 bg-cyan-500/10 blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10 space-y-6">
          {/* Badge (#1 Product of the Week / AI SRE) */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 shadow-inner backdrop-blur-md">
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-black text-[10px] flex items-center justify-center">
              P
            </span>
            <span className="text-[11px] font-semibold text-slate-300">#1 INCIDENT AI OF THE WEEK</span>
            <span className="text-[11px] text-slate-500">•</span>
            <span className="text-[11px] text-blue-400 font-medium">DevOps & SRE Tools</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Turn Past Incidents Into <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
              Faster Solutions
            </span>
          </h1>

          {/* Main Tagline & Subhead */}
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            <strong className="text-slate-200">"Your incidents teach your AI how to solve the next one."</strong><br />
            MemoryOps AI is an intelligent SRE platform powered by <span className="text-purple-400 font-semibold">Hindsight Persistent Memory</span> that remembers historical outages, confirmed root causes, and tested runbooks.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={onGetStarted}
              className="flex items-center space-x-2 px-7 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-2xl text-sm shadow-xl shadow-blue-600/30 transition transform hover:-translate-y-0.5"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={onExploreDemo}
              className="flex items-center space-x-2 px-6 py-3.5 bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-medium rounded-2xl text-sm border border-slate-700/80 transition backdrop-blur-md"
            >
              <Play className="h-4 w-4 fill-slate-300 text-slate-300" />
              <span>Watch Live Demo</span>
            </button>
          </div>

          {/* Social Proof */}
          <div className="pt-8 text-xs text-slate-500 flex items-center justify-center space-x-2">
            <span>Trusted by forward-thinking platform teams at</span>
            <span className="text-slate-400 font-mono font-medium">FinTech, CloudOps & Startups</span>
          </div>
        </div>

        {/* Live Interactive Topology Preview (Inspired by Image 1) */}
        <div className="max-w-6xl mx-auto px-6 mt-12">
          <div className="glass-card rounded-3xl border border-white/10 p-6 shadow-2xl overflow-hidden relative">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-white/5">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                    <span>Live Incident Graph: P-2-399-11-26905974</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                      Core Banking • Mobile Banking
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">Problem: UPI transactions are slowing down and failing (High ORA-000560 deadlock)</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400 font-mono">Service Ticket Id: <strong className="text-cyan-400">tkt-1356</strong></span>
              </div>
            </div>

            {/* Impacted Entities Row (Inspired by Image 1) */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 my-4">
              <div className="p-3 bg-slate-900/90 rounded-2xl border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 font-semibold block">Application(s) 2</span>
                <span className="text-xs font-bold text-slate-200">Core & Mobile</span>
              </div>
              <div className="p-3 bg-slate-900/90 rounded-2xl border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 font-semibold block">Service(s) 14</span>
                <span className="text-xs font-bold text-blue-400">UPI-APP, Web_svc</span>
              </div>
              <div className="p-3 bg-slate-900/90 rounded-2xl border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 font-semibold block">Infrastructure 13</span>
                <span className="text-xs font-bold text-purple-400">10.2.33.12.45...</span>
              </div>
              <div className="p-3 bg-slate-900/90 rounded-2xl border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 font-semibold block">User Journeys 2</span>
                <span className="text-xs font-bold text-cyan-400">Credit, Payment</span>
              </div>
              <div className="p-3 bg-slate-900/90 rounded-2xl border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 font-semibold block">Memory Recall Hit</span>
                <span className="text-xs font-bold text-emerald-400">92% Match INC-104</span>
              </div>
            </div>

            {/* Simulated Solution Recommendation Flyout */}
            <div className="p-4 bg-gradient-to-r from-blue-950/40 via-purple-950/30 to-slate-950 rounded-2xl border border-blue-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-blue-600 text-white">
                  <BrainCircuit className="h-5 w-5" />
                </div>
                <div className="text-left text-xs">
                  <span className="font-bold text-white block">AI Solution Recommendation (Relevance Score 0.95)</span>
                  <span className="text-slate-300">Roll back conflicting uncommitted database transactions from deadlock pool. Verified fix from prior incident.</span>
                </div>
              </div>

              <button
                onClick={onGetStarted}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md transition shrink-0"
              >
                Inspect in Studio →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. How It Works: Capture → Recall → Diagnose → Learn */}
      <section className="max-w-6xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-xs font-bold text-blue-400 uppercase tracking-wider font-mono">Continuous Operational Learning</h2>
          <h3 className="text-3xl font-extrabold text-white">How MemoryOps AI Works</h3>
          <p className="text-slate-400 text-xs max-w-xl mx-auto">
            Traditional AI treats every outage like day one. MemoryOps AI learns continuously through a closed-loop memory lifecycle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          <div className="glass-card p-6 rounded-3xl border border-white/5 space-y-3 relative group hover:border-blue-500/40 transition">
            <div className="w-10 h-10 rounded-2xl bg-blue-950 text-blue-400 flex items-center justify-center font-mono font-bold text-sm border border-blue-800">
              01
            </div>
            <h4 className="text-base font-bold text-white">Capture Context</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ingests raw error logs, telemetry traces, and service topologies while automatically redacting tokens and secrets.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-white/5 space-y-3 relative group hover:border-purple-500/40 transition">
            <div className="w-10 h-10 rounded-2xl bg-purple-950 text-purple-400 flex items-center justify-center font-mono font-bold text-sm border border-purple-800">
              02
            </div>
            <h4 className="text-base font-bold text-white">Recall History</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Queries Hindsight's biomimetic memory bank to retrieve semantically and temporally matching past post-mortems.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-white/5 space-y-3 relative group hover:border-cyan-500/40 transition">
            <div className="w-10 h-10 rounded-2xl bg-cyan-950 text-cyan-400 flex items-center justify-center font-mono font-bold text-sm border border-cyan-800">
              03
            </div>
            <h4 className="text-base font-bold text-white">Diagnose & Runbook</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Synthesizes probable root causes and outputs prioritized, safe troubleshooting commands for human SRE review.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-white/5 space-y-3 relative group hover:border-emerald-500/40 transition">
            <div className="w-10 h-10 rounded-2xl bg-emerald-950 text-emerald-400 flex items-center justify-center font-mono font-bold text-sm border border-emerald-800">
              04
            </div>
            <h4 className="text-base font-bold text-white">Retain & Learn</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Engineer confirms the verified fix. Hindsight retains it as ground truth so identical future incidents resolve instantly.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Core Capabilities / Feature Grid */}
      <section className="max-w-6xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">Platform Capabilities</h2>
          <h3 className="text-3xl font-extrabold text-white">Designed for Production Reliability</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-3xl border border-white/5 space-y-3">
            <div className="p-3 rounded-2xl bg-blue-950/80 text-blue-400 w-max border border-blue-800/60">
              <Database className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-bold text-white">Persistent Biomimetic Memory</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Organizes operational intelligence into World Facts, Experiences, and synthesized Mental Models with zero context rot.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-white/5 space-y-3">
            <div className="p-3 rounded-2xl bg-purple-950/80 text-purple-400 w-max border border-purple-800/60">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-bold text-white">AI Root Cause Identification</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ranks probable root causes with supporting log quotes and confidence scores to cut mean-time-to-resolution (MTTR).
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-white/5 space-y-3">
            <div className="p-3 rounded-2xl bg-emerald-950/80 text-emerald-400 w-max border border-emerald-800/60">
              <BookOpen className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-bold text-white">Verified Runbook Generation</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Converts successful resolutions into durable runbooks with copyable, safe commands and rollback instructions.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Real Use Cases */}
      <section className="max-w-6xl mx-auto px-6 space-y-8">
        <div className="p-8 sm:p-12 glass-card rounded-3xl border border-slate-800 space-y-6">
          <div className="max-w-2xl space-y-2">
            <h3 className="text-2xl font-bold text-white">Real-World Outage Scenarios Handled</h3>
            <p className="text-xs text-slate-400">Battle-tested across critical infrastructure failures:</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800/80 space-y-1">
              <h5 className="text-xs font-bold text-blue-400">Database Connection Starvation</h5>
              <p className="text-[11px] text-slate-400">PgBouncer pool sizing & unclosed connection leak fixes.</p>
            </div>
            <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800/80 space-y-1">
              <h5 className="text-xs font-bold text-purple-400">CI/CD Deployment Failures</h5>
              <p className="text-[11px] text-slate-400">Missing Vault secrets & container CrashLoopBackOff triage.</p>
            </div>
            <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800/80 space-y-1">
              <h5 className="text-xs font-bold text-pink-400">Worker OOMKilled Memory Leaks</h5>
              <p className="text-[11px] text-slate-400">Unbounded batch queues & stream chunking mitigations.</p>
            </div>
            <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800/80 space-y-1">
              <h5 className="text-xs font-bold text-emerald-400">504 Upstream API Timeouts</h5>
              <p className="text-[11px] text-slate-400">Prevents dangerous microservice restart storms.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="max-w-6xl mx-auto px-6 pt-12 pb-8 border-t border-slate-900 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Zap className="h-4 w-4 text-blue-500 fill-blue-500" />
          <span className="font-bold text-slate-300">MemoryOps AI</span>
          <span>• Powered by Vectorize Hindsight</span>
        </div>

        <div className="flex items-center space-x-6 text-slate-400">
          <a href="https://github.com/vectorize-io/hindsight" target="_blank" rel="noreferrer" className="hover:text-white transition">GitHub</a>
          <button onClick={onDocs} className="hover:text-white transition">Documentation</button>
          <a href="https://hindsight.vectorize.io" target="_blank" rel="noreferrer" className="hover:text-white transition">Hindsight Cloud</a>
          <button onClick={onSignIn} className="hover:text-white transition">Sign In</button>
        </div>
      </footer>
    </div>
  );
};
