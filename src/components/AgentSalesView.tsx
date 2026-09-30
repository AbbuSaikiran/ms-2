import React, { useState } from 'react';
import { 
  TrendingUp, 
  Send, 
  Brain, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  DollarSign, 
  Layers, 
  PlusCircle,
  FileCheck
} from 'lucide-react';

interface AgentSalesViewProps {
  onOpenAddMemory: (domain: string) => void;
  onRefreshStats: () => void;
}

export const AgentSalesView: React.FC<AgentSalesViewProps> = ({ onOpenAddMemory, onRefreshStats }) => {
  const [prompt, setPrompt] = useState('We are pitching Mark Stevens (VP of Engineering at Acme Corp) on Call 3. He asked why he should choose our cloud platform over Competitor X given their existing budget constraints.');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'agent'; content: string; memories?: any }>>([
    {
      role: 'agent',
      content: '👋 Welcome to the **Hindsight Deal Intelligence Agent**.\n\nI have persistent memory of past deals, objections, pricing negotiations, and stakeholder priorities (e.g. Acme Corp, Mark Stevens, Competitor X). Ask me to prepare meeting battlecards, draft objection rebuttals, or craft follow-up emails based on past won deals.'
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
      const res = await fetch('/api/agent/sales', {
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 glass-card rounded-2xl border border-blue-900/30">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <span>Sales & Deal Intelligence Agent</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800">
                Revenue Memory
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Learns buyer personas, remembers deal objections, and synthesizes winning negotiation tactics across calls.
            </p>
          </div>
        </div>

        <button
          onClick={() => onOpenAddMemory('sales')}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-900/30 transition self-start md:self-auto"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Retain Deal Memory</span>
        </button>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => handleSend('Generate an executive briefing on Acme Corp and Mark Stevens before our 2 PM call.')}
          className="p-3 text-left glass-card glass-card-hover rounded-xl text-xs text-slate-300 border border-slate-800"
        >
          <span className="font-semibold text-blue-400 block mb-1">📋 Executive Briefing</span>
          <span>"Generate an executive briefing on Acme Corp and Mark Stevens before our 2 PM call."</span>
        </button>
        <button
          onClick={() => handleSend('How did we handle Competitor X pricing objection in our previous enterprise deals?')}
          className="p-3 text-left glass-card glass-card-hover rounded-xl text-xs text-slate-300 border border-slate-800"
        >
          <span className="font-semibold text-purple-400 block mb-1">⚔️ Competitor Rebuttal</span>
          <span>"How did we handle Competitor X pricing objection in our previous enterprise deals?"</span>
        </button>
        <button
          onClick={() => handleSend('Draft a follow-up email offering a 2-year price lock to Mark with our SOC2 audit.')}
          className="p-3 text-left glass-card glass-card-hover rounded-xl text-xs text-slate-300 border border-slate-800"
        >
          <span className="font-semibold text-emerald-400 block mb-1">✉️ Targeted Pitch Email</span>
          <span>"Draft a follow-up email offering a 2-year price lock to Mark with our SOC2 audit."</span>
        </button>
      </div>

      {/* Interactive Chat Console */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden flex flex-col h-[520px]">
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-900/90 text-slate-200 border border-slate-800 shadow-sm'
                }`}
              >
                {/* Memory Pills inside Agent response */}
                {m.memories && (
                  <div className="mb-3 pb-3 border-b border-slate-800/80 space-y-1.5">
                    <div className="flex items-center space-x-1.5 text-[10px] font-semibold text-blue-400">
                      <Brain className="h-3.5 w-3.5" />
                      <span>Recalled from Hindsight Long-Term Memory:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {m.memories.mentalModels?.map((model: any) => (
                        <span key={model.id} className="text-[10px] bg-pink-950/80 text-pink-300 border border-pink-800/60 px-2 py-0.5 rounded">
                          Strategy: {model.pattern.slice(0, 30)}...
                        </span>
                      ))}
                      {m.memories.facts?.map((fact: any) => (
                        <span key={fact.id} className="text-[10px] bg-blue-950/80 text-blue-300 border border-blue-800/60 px-2 py-0.5 rounded">
                          Fact: {fact.subject}
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
            <div className="flex items-center space-x-2 text-xs text-blue-400 p-2">
              <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              <span>Hindsight recalling deal history & synthesizing strategy...</span>
            </div>
          )}
        </div>

        {/* Prompt Input */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center space-x-3">
          <input
            type="text"
            placeholder="Ask about past objections, competitor strategies, or deal notes..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !prompt.trim()}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-900/30 transition flex items-center space-x-1.5 disabled:opacity-50"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
