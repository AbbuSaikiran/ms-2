import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Play, 
  Pause, 
  Zap, 
  ShieldAlert, 
  CheckCircle2, 
  Sparkles, 
  BrainCircuit, 
  Radio, 
  ArrowUpRight, 
  Flame, 
  Clock, 
  Cpu, 
  RotateCw,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { IncidentRecord } from '../../../server/memoryOps';

interface LiveTelemetryStreamProps {
  onAnalyzePreset: (incident: any) => void;
  onRefreshStats: () => void;
}

interface TelemetryEvent {
  id: string;
  timestamp: string;
  service: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'FATAL';
  message: string;
  memoryMatch?: string;
  confidence?: number;
}

export const LiveTelemetryStream: React.FC<LiveTelemetryStreamProps> = ({
  onAnalyzePreset,
  onRefreshStats
}) => {
  const [isRunning, setIsRunning] = useState(true);
  const [speed, setSpeed] = useState<1 | 2 | 5>(1);
  const [events, setEvents] = useState<TelemetryEvent[]>([]);
  const [activeAlert, setActiveAlert] = useState<TelemetryEvent | null>(null);

  // Real-time ticking metrics
  const [packetsProcessed, setPacketsProcessed] = useState(248190);
  const [activePods, setActivePods] = useState(148);
  const [memoryHitsCount, setMemoryHitsCount] = useState(1420);
  const [avgMttrSeconds, setAvgMttrSeconds] = useState(240); // 4m 00s
  const [liveClock, setLiveClock] = useState(new Date().toLocaleTimeString());

  // Clock tick
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveClock(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Synthetic log templates
  const logTemplates = [
    { service: 'payment-gateway', level: 'INFO', message: 'HTTP POST /v1/charges 200 OK duration=42ms' },
    { service: 'order-api', level: 'INFO', message: 'Kafka consumer committed offset 948192 on partition 3' },
    { service: 'auth-service', level: 'INFO', message: 'JWT token validated for user_session_881a' },
    { service: 'checkout-service', level: 'WARN', message: 'Connection pool usage reached 84% [pg_bouncer_active=84/100]' },
    { service: 'inventory-svc', level: 'INFO', message: 'Inventory cache hit in Redis cluster node-02' },
    { service: 'payment-gateway', level: 'WARN', message: 'Circuit breaker half-open state detected for Stripe webhook' },
    { service: 'cart-service', level: 'INFO', message: 'Session cart serialized successfully (size=4.2KB)' },
    { service: 'auth-service', level: 'WARN', message: 'OAuth provider responded in 480ms (> SLA threshold of 250ms)' },
  ];

  const criticalOutageScenarios = [
    {
      service: 'checkout-service',
      level: 'FATAL',
      message: 'FATAL: remaining connection slots are reserved for non-replication superuser connections (pg_bouncer exhausted)',
      memoryMatch: 'INC-104: Checkout DB Pool Exhaustion (Cosine 0.94)',
      confidence: 96,
      preset: {
        title: 'Checkout DB Connection Pool Exhaustion [CRITICAL]',
        service: 'checkout-service',
        severity: 'P1',
        rawLogs: `FATAL: remaining connection slots are reserved for non-replication superuser connections
at /app/node_modules/pg/lib/connection.js:57:11
Checkout service 500 error rate spiked to 38.4%
pg_bouncer client_active: 100/100, server_active: 100/100`,
        metrics: 'Error rate: 38.4%, Latency p99: 4850ms, DB Pool: 100%'
      }
    },
    {
      service: 'auth-service',
      level: 'ERROR',
      message: 'ERROR: JWKS validation timeout (504 Gateway Timeout on https://auth.internal/keys)',
      memoryMatch: 'INC-106: Expired OAuth Signing Certificate (Cosine 0.91)',
      confidence: 91,
      preset: {
        title: 'Auth Service JWKS Key Rotation Failure',
        service: 'auth-service',
        severity: 'P1',
        rawLogs: `HTTP 504 Gateway Timeout fetching JWKS endpoint
Unable to verify JWT token signature for 420 req/sec
TLS handshake error: certificate has expired or is not yet valid`,
        metrics: 'Auth failure rate: 76%, Auth p99: 5000ms'
      }
    },
    {
      service: 'inventory-svc',
      level: 'FATAL',
      message: 'FATAL: java.lang.OutOfMemoryError: Java heap space during catalog sync',
      memoryMatch: 'INC-108: Kafka Batch Buffer OOM Spike (Cosine 0.93)',
      confidence: 94,
      preset: {
        title: 'Inventory Service OOMKilled in Pods',
        service: 'inventory-svc',
        severity: 'P2',
        rawLogs: `java.lang.OutOfMemoryError: Java heap space
ExitCode 137 (OOMKilled) on pod inventory-svc-798dfb9f6-2xq9k
Restart count: 8 within 10 minutes`,
        metrics: 'Memory usage: 100% (4096MB/4096MB), Restarts: 8'
      }
    }
  ];

  // Continuous stream effect
  useEffect(() => {
    if (!isRunning) return;

    const intervalTime = Math.floor(1200 / speed);
    const streamInterval = setInterval(() => {
      // Pick a random normal log
      const template = logTemplates[Math.floor(Math.random() * logTemplates.length)];
      const newEvent: TelemetryEvent = {
        id: 'evt_' + Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toLocaleTimeString(),
        service: template.service,
        level: template.level as any,
        message: template.message
      };

      setEvents(prev => [newEvent, ...prev.slice(0, 49)]);
      setPacketsProcessed(p => p + Math.floor(Math.random() * 8) + 1);

      // Random micro-variations
      if (Math.random() > 0.8) {
        setMemoryHitsCount(m => m + 1);
      }
    }, intervalTime);

    return () => clearInterval(streamInterval);
  }, [isRunning, speed]);

  // Inject critical simulated outage
  const handleSimulateOutage = (scenarioIndex = 0) => {
    const scenario = criticalOutageScenarios[scenarioIndex % criticalOutageScenarios.length];
    const alertEvent: TelemetryEvent = {
      id: 'alert_' + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      service: scenario.service,
      level: scenario.level as any,
      message: scenario.message,
      memoryMatch: scenario.memoryMatch,
      confidence: scenario.confidence
    };

    setActiveAlert(alertEvent);
    setEvents(prev => [alertEvent, ...prev.slice(0, 49)]);
    setPacketsProcessed(p => p + 120);
    setMemoryHitsCount(m => m + 3);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Real-time Ticker Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl border border-blue-900/40 bg-blue-950/20 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-blue-300 font-semibold mb-1">
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              <span>Telemetry Packets</span>
            </span>
            <Activity className="h-3.5 w-3.5 text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {packetsProcessed.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 mt-1 flex items-center space-x-1">
            <span className="text-emerald-400 font-bold">+{(speed * 8.4).toFixed(1)}/s</span>
            <span>• Live Ingestion Stream</span>
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-purple-900/40 bg-purple-950/20 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-purple-300 font-semibold mb-1">
            <span className="flex items-center space-x-1.5">
              <BrainCircuit className="h-3.5 w-3.5 text-purple-400" />
              <span>Hindsight Memory Hits</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-900/60 text-purple-300 font-mono">98.4% Acc</span>
          </div>
          <div className="text-2xl font-extrabold text-purple-200 font-mono">
            {memoryHitsCount.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            <span>Biomimetic Recall active</span>
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-emerald-900/40 bg-emerald-950/20 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-emerald-300 font-semibold mb-1">
            <span className="flex items-center space-x-1.5">
              <Clock className="h-3.5 w-3.5 text-emerald-400" />
              <span>Live Avg MTTR</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-bold">-91%</span>
          </div>
          <div className="text-2xl font-extrabold text-emerald-300 font-mono">
            04m 12s
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            <span>Down from 45m (Stateless baseline)</span>
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-amber-900/40 bg-amber-950/20 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-amber-300 font-semibold mb-1">
            <span className="flex items-center space-x-1.5">
              <Cpu className="h-3.5 w-3.5 text-amber-400" />
              <span>Active K8s Pods</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">HEALTHY</span>
          </div>
          <div className="text-2xl font-extrabold text-amber-200 font-mono">
            {activePods} Nodes
          </div>
          <div className="text-[10px] text-slate-400 mt-1 flex items-center space-x-1">
            <span>Local Clock:</span>
            <span className="font-mono text-slate-300">{liveClock}</span>
          </div>
        </div>
      </div>

      {/* Active Incident Alert Banner (Triggered in real-time) */}
      {activeAlert && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/90 via-red-900/40 to-slate-900 border-2 border-red-600/80 shadow-2xl shadow-red-950 animate-in slide-in-from-top-4 duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="p-2.5 rounded-xl bg-red-600 text-white shrink-0 animate-bounce">
              <Flame className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-extrabold">LIVE P1 INCIDENT DETECTED</span>
                <span className="text-xs font-mono text-red-300">{activeAlert.service}</span>
                <span className="text-xs text-slate-400">• {activeAlert.timestamp}</span>
              </div>
              <p className="text-sm font-bold text-white mt-1">{activeAlert.message}</p>
              {activeAlert.memoryMatch && (
                <div className="flex items-center space-x-2 mt-1.5 text-xs text-purple-300 bg-purple-950/80 px-2.5 py-1 rounded-lg border border-purple-800/60 inline-flex">
                  <BrainCircuit className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                  <span>Hindsight Matched: <strong>{activeAlert.memoryMatch}</strong></span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => {
                const scenario = criticalOutageScenarios.find(s => s.service === activeAlert.service) || criticalOutageScenarios[0];
                onAnalyzePreset(scenario.preset);
              }}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-red-700/30 flex items-center space-x-1.5 transition"
            >
              <Sparkles className="h-4 w-4" />
              <span>Auto-Diagnose With Memory</span>
            </button>
            <button
              onClick={() => setActiveAlert(null)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Stream Controls & Live Console */}
      <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        {/* Console Header / Toolbar */}
        <div className="bg-slate-900/90 px-5 py-3.5 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block"></span>
            </div>
            <div className="h-4 w-px bg-slate-800"></div>
            <div className="flex items-center space-x-2">
              <Radio className={`h-4 w-4 ${isRunning ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
              <span className="text-xs font-bold text-white font-mono">LIVE_TELEMETRY_INGESTION_DAEMON</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Speed buttons */}
            <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-mono">
              <button
                onClick={() => setSpeed(1)}
                className={`px-2 py-0.5 rounded-lg transition ${speed === 1 ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                1x
              </button>
              <button
                onClick={() => setSpeed(2)}
                className={`px-2 py-0.5 rounded-lg transition ${speed === 2 ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                2x
              </button>
              <button
                onClick={() => setSpeed(5)}
                className={`px-2 py-0.5 rounded-lg transition ${speed === 5 ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                5x
              </button>
            </div>

            {/* Play/Pause toggle */}
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                isRunning
                  ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  : 'bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-700/30'
              }`}
            >
              {isRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              <span>{isRunning ? 'Pause Stream' : 'Resume'}</span>
            </button>

            {/* Simulate Outage Trigger Button */}
            <button
              onClick={() => handleSimulateOutage(Math.floor(Math.random() * criticalOutageScenarios.length))}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white shadow-md shadow-red-700/30 transition"
            >
              <Flame className="h-3.5 w-3.5" />
              <span>Simulate Production Outage</span>
            </button>
          </div>
        </div>

        {/* Live Terminal Output */}
        <div className="bg-slate-950 p-4 font-mono text-xs max-h-96 overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800">
          {events.length === 0 && (
            <div className="text-slate-500 text-center py-8">
              Initializing live telemetry pipeline... Starting daemon...
            </div>
          )}
          {events.map((evt) => {
            const isFatal = evt.level === 'FATAL' || evt.level === 'ERROR';
            const isWarn = evt.level === 'WARN';
            return (
              <div 
                key={evt.id} 
                className={`flex items-start space-x-2 py-1 px-2 rounded transition ${
                  isFatal 
                    ? 'bg-red-950/60 border border-red-800/80 text-red-200' 
                    : isWarn 
                    ? 'bg-amber-950/30 text-amber-200' 
                    : 'hover:bg-slate-900/60 text-slate-300'
                }`}
              >
                <span className="text-slate-500 text-[11px] shrink-0">[{evt.timestamp}]</span>
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold shrink-0 ${
                  evt.level === 'FATAL' 
                    ? 'bg-red-600 text-white' 
                    : evt.level === 'ERROR' 
                    ? 'bg-red-900 text-red-200' 
                    : evt.level === 'WARN' 
                    ? 'bg-amber-800 text-amber-100' 
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {evt.level}
                </span>
                <span className="text-blue-400 font-semibold shrink-0">[{evt.service}]</span>
                <span className="flex-1 break-all">{evt.message}</span>
                {evt.memoryMatch && (
                  <span className="px-2 py-0.5 rounded bg-purple-900/80 text-purple-300 text-[10px] font-semibold border border-purple-700 shrink-0">
                    ⚡ {evt.memoryMatch}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
