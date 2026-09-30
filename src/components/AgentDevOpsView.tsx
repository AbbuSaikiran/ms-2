import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Send, 
  Brain, 
  Terminal, 
  AlertOctagon, 
  Activity, 
  PlusCircle, 
  CheckCircle,
  Cpu
} from 'lucide-react';

interface AgentDevOpsViewProps {
  onOpenAddMemory: (domain: string) => void;
  onRefreshStats: () => void;
}

export const AgentDevOpsView: React.FC<AgentDevOpsViewProps> = ({ onOpenAddMemory, onRefreshStats }) => {
  const [prompt, setPrompt] = useState('Payment-gateway service is throwing 504 Gateway Timeouts under traffic surge. Error spike at 14.2%. What is the root cause and mitigation runbook?');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'agent'; content: string; memories?: any }>>([
    {
      role: 'agent',
      content: '🚨 **DevOps & Incident Response Agent Online**\n\nI retain telemetry architecture, historical post-mortems (like INC-402), and tested remediation runbooks. When an outage occurs, I recall what fixed similar failures and prevent dangerous anti-patterns (like premature pod restarts).'
    }
  ]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || prompt;
    if (!textToSend.trim()) return;

    const newMessages = [...messages, { role: 'user' as const, content: textToSend }];
    setMessages(newMessages);
    if (!customText) setPrompt('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/agent/devops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToSend }),
      });
      const data = await res.json();
      setMessages([
        ...newMessages,
        {
          role: 'agent',
          content: data.response,
          memories: data.recalledMemories,
        }
      ]);
      onRefreshStats();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 glass-card rounded-2xl border border-red-900/30">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <span>DevOps Incident Response & Runbook Agent</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-800">
                SRE Memory
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Learns from historical outages and post-mortems to deliver instant, proven mitigation steps under pressure.
            </p>
          </div>
        </div>

        <button
          onClick={() => onOpenAddMemory('devops')}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-red-900/30 transition self-start md:self-auto"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Retain Incident Post-Mortem</span>
        </button>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => handleSend('What was the resolution and root cause for INC-402 on payment-gateway?')}
          className="p-3 text-left glass-card glass-card-hover rounded-xl text-xs text-slate-300 border border-slate-800"
        >
          <span className="font-semibold text-red-400 block mb-1">🔍 Recall INC-402 Post-Mortem</span>
          <span>"What was the resolution and root cause for INC-402 on payment-gateway?"</span>
        </button>
        <button
          onClick={() => handleSend('Generate the exact kubectl commands to mitigate PgBouncer connection exhaustion.')}
          className="p-3 text-left glass-card glass-card-hover rounded-xl text-xs text-slate-300 border border-slate-800"
        >
          <span className="font-semibold text-amber-400 block mb-1">⚡ Instant Runbook Commands</span>
          <span>"Generate the exact kubectl commands to mitigate PgBouncer connection exhaustion."</span>
        </button>
        <button
          onClick={() => handleSend('What topology dependencies exist for the payment-gateway cluster?')}
          className="p-3 text-left glass-card glass-card-hover rounded-xl text-xs text-slate-300 border border-slate-800"
        >
          <span className="font-semibold text-emerald-400 block mb-1">🗺️ Service Topology Inspection</span>
          <span>"What topology dependencies exist for the payment-gateway cluster?"</span>
        </button>
      </div>

      {/* Chat Console */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden flex flex-col h-[520px]">
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-slate-900/90 text-slate-200 border border-slate-800 shadow-sm'
                }`}
              >
                {m.memories && (
                  <div className="mb-3 pb-3 border-b border-slate-800/80 space-y-1.5">
                    <div className="flex items-center space-x-1.5 text-[10px] font-semibold text-red-400">
                      <Brain className="h-3.5 w-3.5" />
                      <span>Recalled SRE Runbook & Topology Memory:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {m.memories.mentalModels?.map((model: any) => (
                        <span key={model.id} className="text-[10px] bg-red-950/80 text-red-300 border border-red-800/60 px-2 py-0.5 rounded">
                          Pattern: {model.pattern.slice(0, 32)}...
                        </span>
                      ))}
                      {m.memories.facts?.map((fact: any) => (
                        <span key={fact.id} className="text-[10px] bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded">
                          Topology: {fact.subject}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="whitespace-pre-line font-sans">{m.content}</div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center space-x-2 text-xs text-red-400 p-2">
              <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
              <span>Analyzing incident telemetry and matching historical runbooks...</span>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center space-x-3">
          <input
            type="text"
            placeholder="Report incident symptom, service name, or ask for runbook..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !prompt.trim()}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-red-900/30 transition flex items-center space-x-1.5 disabled:opacity-50"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
