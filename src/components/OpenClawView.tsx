import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  Terminal, 
  Play, 
  CheckCircle2, 
  BrainCircuit, 
  Layers, 
  Zap, 
  ArrowRight,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface OpenClawViewProps {
  onRefreshStats: () => void;
}

export const OpenClawView: React.FC<OpenClawViewProps> = ({ onRefreshStats }) => {
  const [goal, setGoal] = useState('Analyze past deal objections for Acme Corp and formulate an autonomous follow-up proposal with SOC2 compliance proof.');
  const [domain, setDomain] = useState<'sales' | 'devops' | 'support' | 'feedback'>('sales');
  const [isRunning, setIsRunning] = useState(false);
  const [taskResult, setTaskResult] = useState<any>(null);

  const handleRunOpenClaw = async () => {
    if (!goal.trim()) return;
    setIsRunning(true);
    setTaskResult(null);

    try {
      const res = await fetch('/api/openclaw/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal, domain }),
      });
      const data = await res.json();
      setTaskResult(data);
      onRefreshStats();
      confetti({
        particleCount: 50,
        spread: 60,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 glass-card rounded-2xl border border-indigo-900/40">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-950/50">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <span>OpenClaw + Hindsight Memory Integration</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800 font-mono">
                @vectorize-io/hindsight-openclaw
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Autonomous agent environment executing multi-step goals while persisting and recalling durable memory across sessions.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-start md:self-auto">
          <div className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300 font-mono text-[11px]">Plugin Active</span>
          </div>
        </div>
      </div>

      {/* Configuration Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="p-4 glass-card rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-400">
            <Terminal className="h-4 w-4" />
            <span>OpenClaw Plugin Config</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed font-mono bg-slate-950/70 p-2.5 rounded-xl border border-slate-900">
            openclaw plugins install @vectorize-io/hindsight-openclaw
          </p>
        </div>

        <div className="p-4 glass-card rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center space-x-2 text-xs font-semibold text-purple-400">
            <Zap className="h-4 w-4" />
            <span>LLM Execution Engine</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Groq High-Speed Inference (Supports <span className="text-slate-200 font-mono">openai/gpt-oss-120b</span>, <span className="text-slate-200 font-mono">qwen/qwen3-32b</span>, <span className="text-slate-200 font-mono">llama-3.3-70b</span>).
          </p>
        </div>

        <div className="p-4 glass-card rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400">
            <BrainCircuit className="h-4 w-4" />
            <span>Biomimetic Memory Slot</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Continuous background <strong className="text-slate-200 font-normal">Retain</strong> & <strong className="text-slate-200 font-normal">Recall</strong> with automatic error-recovery against function calling failures.
          </p>
        </div>
      </div>

      {/* Task Execution Form */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Autonomous Agent Objective</label>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="Define agent task..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Domain</label>
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              <option value="sales">Sales (Deal Intelligence)</option>
              <option value="devops">DevOps (Incident Response)</option>
              <option value="support">Support (VIP Accounts)</option>
              <option value="feedback">Product (Feedback Synthesis)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-slate-400">
            OpenClaw will autonomously retrieve relevant Hindsight memory before executing.
          </span>
          <button
            onClick={handleRunOpenClaw}
            disabled={isRunning || !goal.trim()}
            className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-semibold rounded-xl text-xs shadow-lg shadow-indigo-900/40 transition disabled:opacity-50"
          >
            {isRunning ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Running Autonomous Execution...</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-current" />
                <span>Execute OpenClaw Agent</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Task Execution Output & Step Trace */}
      {taskResult && (
        <div className="glass-card rounded-2xl border border-indigo-900/40 overflow-hidden shadow-2xl space-y-4 p-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div className="flex items-center space-x-2.5">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <div>
                <h3 className="text-sm font-bold text-slate-100">Task Completed Successfully</h3>
                <p className="text-[11px] text-slate-400 font-mono">Task ID: {taskResult.id}</p>
              </div>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
              Status: {taskResult.status.toUpperCase()}
            </span>
          </div>

          {/* Autonomous Step Trace */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Autonomous Execution Trace</h4>
            <div className="space-y-2">
              {taskResult.steps?.map((step: any) => (
                <div key={step.step} className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 flex items-start space-x-3 text-xs">
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold shrink-0 mt-0.5">
                    Step {step.step}
                  </span>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200">{step.action}</span>
                      {step.memoryOperation && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                          {step.memoryOperation}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-400 font-mono text-[11px]">{step.result}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Output Content */}
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Agent Synthesis Output</h4>
            <div className="p-4 bg-slate-950/90 rounded-xl border border-indigo-900/30 text-xs text-slate-200 whitespace-pre-line leading-relaxed font-sans shadow-inner">
              {taskResult.output}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
