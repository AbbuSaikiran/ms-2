import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Terminal, 
  Play, 
  Sparkles, 
  Lock, 
  FileText, 
  Layers, 
  Zap,
  Info,
  BrainCircuit,
  Activity,
  Mic,
  MicOff,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Server,
  Database,
  ArrowRight,
  Cpu,
  BookmarkPlus
} from 'lucide-react';

interface IncidentAnalyzerProps {
  onDiagnoseComplete: (result: { incident: any; diagnosis: any }) => void;
  initialData?: {
    title?: string;
    service?: string;
    severity?: string;
    environment?: string;
    rawLogs?: string;
    notes?: string;
  } | null;
}

const SYNTHETIC_DEMO_PRESETS = [
  {
    name: 'Incident A: PostgreSQL Connection Starvation',
    title: 'Recurring 504 timeouts on checkout during evening traffic surge',
    service: 'payment-gateway',
    severity: 'Critical',
    environment: 'Production',
    rawLogs: `[ERROR] [db_pool] Timeout: connection pool exhausted (max_connections=100)
[WARN]  [http_handler] 504 Gateway Timeout on POST /v1/checkout
[ERROR] [pg_driver] could not obtain connection from pool within 5000ms
[DEBUG] [metrics] active_clients=100, waiting_clients=482, idle_in_transaction=14`,
    notes: 'Triggered during flash sale. Matches previous incident INC-104.',
    predictedMemory: 'INC-104: Checkout DB Pool Exhaustion (Cosine 0.94)',
    infraConstraint: 'pg_bouncer max_connections: 100'
  },
  {
    name: 'Incident B: Deployment Missing Secret Variable',
    title: 'Auth service pod crash loop following canary release',
    service: 'auth-service',
    severity: 'High',
    environment: 'Staging',
    rawLogs: `[FATAL] [auth_init] KeyError: 'JWT_SIGNING_SECRET_V2' not found in environment
[FATAL] [runtime] Container crashed with exit code 1
[ERROR] [k8s_events] Back-off restarting failed container auth-service-pod-7f9a`,
    notes: 'New secret was added to staging vault but omitted from deployment manifest.',
    predictedMemory: 'INC-106: Expired OAuth Signing Certificate (Cosine 0.91)',
    infraConstraint: 'Kubernetes Pod Security Policy v1.28'
  },
  {
    name: 'Incident C: Worker OOMKilled Memory Leak',
    title: 'Notification worker pod terminated by K8s OOM Killer',
    service: 'notification-worker',
    severity: 'Medium',
    environment: 'Production',
    rawLogs: `[WARN]  [memory_monitor] Container RSS memory reached 98% (limit: 2048Mi)
[ERROR] [k8s] Pod notification-worker-x921 was OOMKilled (exit code 137)
[WARN]  [queue] Unacknowledged batch size reached 50,000 items`,
    notes: 'Memory accumulated in async worker buffer during large campaign dispatch.',
    predictedMemory: 'INC-108: Kafka Batch Buffer OOM Spike (Cosine 0.93)',
    infraConstraint: 'Worker Memory Limit: 2048Mi'
  }
];

export const IncidentAnalyzer: React.FC<IncidentAnalyzerProps> = ({ onDiagnoseComplete, initialData }) => {
  const [title, setTitle] = useState(initialData?.title || SYNTHETIC_DEMO_PRESETS[0].title);
  const [service, setService] = useState(initialData?.service || SYNTHETIC_DEMO_PRESETS[0].service);
  const [severity, setSeverity] = useState<string>(initialData?.severity || SYNTHETIC_DEMO_PRESETS[0].severity);
  const [environment, setEnvironment] = useState<string>(initialData?.environment || SYNTHETIC_DEMO_PRESETS[0].environment);
  const [rawLogs, setRawLogs] = useState(initialData?.rawLogs || SYNTHETIC_DEMO_PRESETS[0].rawLogs);
  const [notes, setNotes] = useState(initialData?.notes || SYNTHETIC_DEMO_PRESETS[0].notes);

  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activePresetIndex, setActivePresetIndex] = useState(0);

  useEffect(() => {
    if (initialData) {
      if (initialData.title) setTitle(initialData.title);
      if (initialData.service) setService(initialData.service);
      if (initialData.severity) setSeverity(initialData.severity);
      if (initialData.environment) setEnvironment(initialData.environment);
      if (initialData.rawLogs) setRawLogs(initialData.rawLogs);
      if (initialData.notes) setNotes(initialData.notes);
    }
  }, [initialData]);

  const handleLoadPreset = (preset: typeof SYNTHETIC_DEMO_PRESETS[0], idx: number) => {
    setActivePresetIndex(idx);
    setTitle(preset.title);
    setService(preset.service);
    setSeverity(preset.severity);
    setEnvironment(preset.environment);
    setRawLogs(preset.rawLogs);
    setNotes(preset.notes);
  };

  const toggleVoiceRecording = () => {
    if (!isRecordingVoice) {
      setIsRecordingVoice(true);
      // Simulate live voice debrief transcription
      setTimeout(() => {
        setNotes((prev) => (prev ? prev + ' • On-call voice debrief: noticed latency spike correlated with cron worker.' : 'On-call voice debrief: noticed latency spike correlated with cron worker.'));
        setIsRecordingVoice(false);
      }, 3500);
    } else {
      setIsRecordingVoice(false);
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !service || !rawLogs) return;

    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/memoryops/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          service,
          severity,
          environment,
          rawLogs,
          notes,
        }),
      });
      const data = await res.json();
      onDiagnoseComplete(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1-Click Synthetic Preset Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            <span>1-Click Hackathon Synthetic Incident Presets</span>
          </h3>
          <span className="text-[11px] text-slate-500 font-mono">Quick load realistic failure telemetry</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {SYNTHETIC_DEMO_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleLoadPreset(preset, idx)}
              className={`p-3.5 text-left rounded-2xl border transition ${
                activePresetIndex === idx
                  ? 'bg-blue-950/40 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                  : 'glass-card glass-card-hover border-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-amber-400 block">{preset.name}</span>
                <span className={`text-[10px] font-mono px-2 py-0.2 rounded font-bold ${
                  preset.severity === 'Critical' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-amber-950 text-amber-300'
                }`}>
                  {preset.severity}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-1 mt-1">{preset.title}</p>
              <div className="flex items-center space-x-2 text-[10px] text-slate-500 pt-2 font-mono">
                <span className="text-slate-300">{preset.service}</span>
                <span>•</span>
                <span className="text-cyan-400">{preset.environment}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Split-Pane Layout: Intake Form (Left) + AI Memory Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Intake Form (7 Cols) */}
        <form onSubmit={handleAnalyze} className="lg:col-span-7 glass-card rounded-3xl p-6 border border-white/10 space-y-5 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <Terminal className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Incident Intake & Operational Diagnostics</h2>
                <p className="text-[11px] text-slate-400">MemoryOps AI sanitizes logs and queries Hindsight for historical root causes.</p>
              </div>
            </div>
            <div className="flex items-center space-x-1.5 px-3 py-1 bg-emerald-950/60 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 font-mono">
              <Lock className="h-3.5 w-3.5" />
              <span className="text-[10px]">Zero-Trust Scrubber</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Incident Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 504 Timeout spike on Payment Gateway"
                className="w-full bg-[#070B18] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Service / Application Name</label>
              <input
                type="text"
                required
                value={service}
                onChange={(e) => setService(e.target.value)}
                placeholder="e.g. payment-gateway or auth-service"
                className="w-full bg-[#070B18] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-cyan-300 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Severity</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full bg-[#070B18] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Low">Low (P3)</option>
                <option value="Medium">Medium (P2)</option>
                <option value="High">High (P1)</option>
                <option value="Critical">Critical (P0 Outage)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Environment</label>
              <select
                value={environment}
                onChange={(e) => setEnvironment(e.target.value)}
                className="w-full bg-[#070B18] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Production">Production</option>
                <option value="Staging">Staging</option>
                <option value="Development">Development</option>
              </select>
            </div>
          </div>

          {/* Raw Log Terminal Area with Scrubber Tag */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                <Terminal className="h-3.5 w-3.5 text-cyan-400" />
                <span>Raw Error Logs / Stack Traces</span>
              </label>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                🔒 API Keys & Bearer Tokens Auto-Redacted
              </span>
            </div>
            <textarea
              required
              rows={5}
              value={rawLogs}
              onChange={(e) => setRawLogs(e.target.value)}
              placeholder="Paste raw container logs, stdout/stderr, or exception traces..."
              className="w-full bg-[#070B18] border border-white/10 rounded-xl p-3.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          {/* Incident Notes & Voice Transcription */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">Optional SRE Incident Notes</label>
              <button
                type="button"
                onClick={toggleVoiceRecording}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                  isRecordingVoice 
                    ? 'bg-red-600 text-white animate-pulse' 
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                }`}
              >
                {isRecordingVoice ? <Mic className="h-3.5 w-3.5 animate-bounce" /> : <Mic className="h-3.5 w-3.5 text-cyan-400" />}
                <span>{isRecordingVoice ? 'Transcribing Voice...' : '🎙️ Record Voice Debrief'}</span>
              </button>
            </div>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Occurred 5 minutes after Canary v2.4 rollout"
              className="w-full bg-[#070B18] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isAnalyzing || !title.trim() || !rawLogs.trim()}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-xl shadow-blue-600/30 transition transform hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Querying Hindsight Memory & Generating AI Diagnosis...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-current" />
                  <span>Run Memory-Informed Diagnosis</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Right Column: AI Memory & Real-Time Intelligence Copilot Panel (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* AI Copilot Card */}
          <div className="glass-card p-5 rounded-3xl border border-cyan-500/20 bg-gradient-to-b from-[#0B132B]/90 to-[#070B18] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-xl bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  <BrainCircuit className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">Hindsight Live AI Memory Panel</h3>
                  <p className="text-[10px] text-slate-400">Pre-diagnosis telemetry & memory preview</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-800">
                ACTIVE
              </span>
            </div>

            {/* Real-time Match Prediction */}
            <div className="p-3.5 rounded-2xl bg-purple-950/20 border border-purple-900/40 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-purple-200 flex items-center space-x-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Predicted Hindsight Match</span>
                </span>
                <span className="text-[10px] font-mono text-purple-300 bg-purple-900/60 px-2 py-0.2 rounded font-bold">
                  94% Match
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                {SYNTHETIC_DEMO_PRESETS[activePresetIndex]?.predictedMemory || 'INC-104: Checkout DB Pool Exhaustion'}
              </p>
              <div className="text-[10px] text-slate-400 flex items-center space-x-1 pt-1">
                <Server className="h-3 w-3 text-cyan-400" />
                <span>Known Constraint: <strong>{SYNTHETIC_DEMO_PRESETS[activePresetIndex]?.infraConstraint}</strong></span>
              </div>
            </div>

            {/* Memory Indexing Checklist */}
            <div className="space-y-2 text-xs">
              <div className="font-bold text-slate-300 text-[11px] uppercase tracking-wider">
                Memory Layer Indexing Checklist
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-white/5 space-y-2 text-[11px]">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center space-x-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Tier 1: World Facts (Topology Limits)</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">Indexed</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center space-x-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Tier 2: Past Experiences (Postmortems)</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">Retrievable</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center space-x-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Tier 3: Mental Models (Heuristics)</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">Active</span>
                </div>
              </div>
            </div>

            {/* Expected MTTR Reduction */}
            <div className="p-3 rounded-2xl bg-emerald-950/20 border border-emerald-900/40 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">EXPECTED TIME TO RECOVERY</span>
                <span className="text-base font-black text-emerald-400 font-mono">03m 30s</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">WITHOUT MEMORY</span>
                <span className="text-xs font-mono text-slate-500 line-through">45m 00s</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
