import React, { useState } from 'react';
import { 
  BookOpen, 
  BrainCircuit, 
  Terminal, 
  Zap, 
  ShieldCheck, 
  Layers, 
  Code2, 
  Cpu, 
  Copy, 
  Check, 
  ExternalLink,
  Sparkles,
  ArrowRight,
  Database,
  Lock
} from 'lucide-react';

export const DocsPage: React.FC<{ onStartAnalyzing?: () => void }> = ({ onStartAnalyzing }) => {
  const [activeSection, setActiveSection] = useState<'architecture' | 'hindsight' | 'api' | 'openclaw' | 'runbooks' | 'security'>('architecture');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 bg-gradient-to-r from-blue-950/40 via-purple-950/20 to-slate-900/60 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
              <BookOpen className="h-3.5 w-3.5" />
              <span>MemoryOps AI Documentation & Architecture</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Biomimetic SRE Memory System Guide
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl">
              Understand how MemoryOps AI leverages Vectorize Hindsight persistent memory to eliminate repeat production outages and reduce MTTR from 45 minutes to 4 minutes.
            </p>
          </div>
          {onStartAnalyzing && (
            <button
              onClick={onStartAnalyzing}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 transition shrink-0"
            >
              <span>Launch Incident Analyzer</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Docs Tabs Navigation */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveSection('architecture')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
            activeSection === 'architecture'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>System Architecture</span>
        </button>

        <button
          onClick={() => setActiveSection('hindsight')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
            activeSection === 'hindsight'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
          }`}
        >
          <BrainCircuit className="h-4 w-4 text-purple-400" />
          <span>Hindsight 3-Tier Memory</span>
        </button>

        <button
          onClick={() => setActiveSection('api')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
            activeSection === 'api'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
          }`}
        >
          <Terminal className="h-4 w-4 text-emerald-400" />
          <span>REST API Endpoints</span>
        </button>

        <button
          onClick={() => setActiveSection('openclaw')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
            activeSection === 'openclaw'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
          }`}
        >
          <Cpu className="h-4 w-4 text-indigo-400" />
          <span>OpenClaw Integration</span>
        </button>

        <button
          onClick={() => setActiveSection('security')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
            activeSection === 'security'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-900/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
          }`}
        >
          <Lock className="h-4 w-4 text-amber-400" />
          <span>Security & Secret Scrubbing</span>
        </button>
      </div>

      {/* Content Section: Architecture */}
      {activeSection === 'architecture' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Terminal className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-white">1. Intake & Secret Sanitization</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Raw error logs, stack traces, and metrics are scrubbed of API tokens, Bearer tokens, DB credentials, and PII before reaching memory or LLMs.
              </p>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <BrainCircuit className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-white">2. Hindsight Biomimetic Recall</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Queries World Facts (infra limits), Past Experiences (prior postmortems), and Mental Models (heuristics) via semantic cosine similarity.
              </p>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-white">3. Confirmed Resolution Loop</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                When on-call engineers confirm the fix, the root cause, fix commands, and outcome are retained permanently into Hindsight.
              </p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span>End-to-End Information Flow</span>
            </h3>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 font-mono text-xs text-slate-300 overflow-x-auto leading-6">
              <p className="text-blue-400 font-bold">// 1. Telemetry / Alert Ingestion</p>
              <p>Alert Triggered → MemoryOps AI Intake API → Secret Scrubber regex pipeline</p>
              <p className="text-purple-400 font-bold mt-2">// 2. Multi-tier Context Synthesis</p>
              <p>Hindsight.recall(query, limit=5) → Retrieve Experiences + Mental Models + Runbooks</p>
              <p className="text-emerald-400 font-bold mt-2">// 3. High-Speed LLM Reasoning (Groq)</p>
              <p>Groq openai/gpt-oss-120b → Structured JSON Diagnosis (Root Cause, Probability, Runbooks, kubectl actions)</p>
              <p className="text-amber-400 font-bold mt-2">// 4. Closed-Loop Learning</p>
              <p>Engineer clicks "Confirm Resolution" → Hindsight.retain(experience) → Agent remembers forever</p>
            </div>
          </div>
        </div>
      )}

      {/* Content Section: Hindsight 3-Tier */}
      {activeSection === 'hindsight' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="glass-card p-5 rounded-2xl border border-blue-900/40 bg-blue-950/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400">TIER 1</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-900/60 text-blue-200">Static / Infra</span>
              </div>
              <h4 className="text-base font-bold text-white">World Facts</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Objective infrastructure topology, max connection pools (e.g. pg_bouncer max_connections: 100), JVM heap limits, and Kubernetes quotas.
              </p>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-purple-900/40 bg-purple-950/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-400">TIER 2</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-900/60 text-purple-200">Dynamic / Episodic</span>
              </div>
              <h4 className="text-base font-bold text-white">Experiences</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Episodic memories of past outages, confirmed resolutions, postmortem retrospectives, and exact CLI remediation steps that worked.
              </p>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-emerald-900/40 bg-emerald-950/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400">TIER 3</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-200">Reflective / Abstract</span>
              </div>
              <h4 className="text-base font-bold text-white">Mental Models</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                High-level operational principles synthesized via Hindsight Reflect. E.g. "Payment gateway 504 timeouts during morning traffic spikes are usually caused by stale Redis cache locks."
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Content Section: REST API */}
      {activeSection === 'api' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 rounded bg-blue-600 text-white text-xs font-bold font-mono">POST</span>
                <span className="text-sm font-mono text-slate-200">/api/memoryops/analyze</span>
              </div>
              <button
                onClick={() => copyToClipboard(`curl -X POST http://localhost:3001/api/memoryops/analyze \\
  -H "Content-Type: application/json" \\
  -d '{"title":"High DB Connection Latency","service":"checkout-service","severity":"P1","rawLogs":"FATAL: remaining connection slots are reserved"}'`, 'api-analyze')}
                className="flex items-center space-x-1 text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 border border-slate-700"
              >
                {copiedCode === 'api-analyze' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedCode === 'api-analyze' ? 'Copied' : 'Copy cURL'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Analyzes an incoming incident, scrubs sensitive tokens, queries Hindsight persistent memory, and calls Groq to generate a structured root cause diagnosis.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 rounded bg-emerald-600 text-white text-xs font-bold font-mono">POST</span>
                <span className="text-sm font-mono text-slate-200">/api/memoryops/resolve</span>
              </div>
              <button
                onClick={() => copyToClipboard(`curl -X POST http://localhost:3001/api/memoryops/resolve \\
  -H "Content-Type: application/json" \\
  -d '{"incidentId":"INC-104","confirmedRootCause":"Idle connections held by batch worker","resolutionSteps":["Scaled down batch pods","Increased pool to 100"],"preventiveMeasures":"Add pgBouncer connection reaper"}'`, 'api-resolve')}
                className="flex items-center space-x-1 text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 border border-slate-700"
              >
                {copiedCode === 'api-resolve' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedCode === 'api-resolve' ? 'Copied' : 'Copy cURL'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Closes the learning loop by saving verified human feedback and remediation steps into Hindsight experiences.
            </p>
          </div>
        </div>
      )}

      {/* Content Section: OpenClaw */}
      {activeSection === 'openclaw' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Cpu className="h-4 w-4 text-indigo-400" />
              <span>OpenClaw Autonomous Agent Integration</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              MemoryOps AI includes full native compatibility with the official <strong className="text-indigo-300">@vectorize-io/hindsight-openclaw</strong> plugin. OpenClaw agents use the Hindsight memory plugin to autonomously investigate logs, query past postmortems, and execute verified safe runbooks.
            </p>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 font-mono text-xs text-slate-300">
              <p className="text-slate-500">// openclaw.config.json</p>
              <p>&#123;</p>
              <p className="pl-4">"agent": "memoryops-incident-agent",</p>
              <p className="pl-4">"plugins": ["@vectorize-io/hindsight-openclaw"],</p>
              <p className="pl-4">"config": &#123;</p>
              <p className="pl-8">"memoryBank": "devops-incidents",</p>
              <p className="pl-8">"recallConfidenceThreshold": 0.85</p>
              <p className="pl-4">&#125;</p>
              <p>&#125;</p>
            </div>
          </div>
        </div>
      )}

      {/* Content Section: Security */}
      {activeSection === 'security' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Zero-Trust Secret Scrubbing Engine</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Production logs frequently contain sensitive credentials. MemoryOps AI runs a deterministic regex sanitizer before any log is dispatched to Hindsight or the LLM.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-900 text-slate-300">
                <span className="text-red-400 font-bold block mb-1">Scrubbed Patterns:</span>
                <ul className="list-disc list-inside space-y-1 text-slate-400">
                  <li>Authorization Bearer Tokens (<code className="text-slate-300">[REDACTED_BEARER_TOKEN]</code>)</li>
                  <li>API Keys & Secret Keys (<code className="text-slate-300">[REDACTED_API_KEY]</code>)</li>
                  <li>Database connection strings & passwords</li>
                  <li>Email addresses & IP hostnames</li>
                </ul>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-900 text-slate-300">
                <span className="text-emerald-400 font-bold block mb-1">Compliance Guarantee:</span>
                <p className="text-slate-400">
                  Ensures SOC2, GDPR, and HIPAA compliance for production memory ingestion without leaking company credentials to external embeddings.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
