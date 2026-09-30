import React, { useState } from 'react';
import { 
  Headphones, 
  Send, 
  Brain, 
  UserCheck, 
  Sparkles, 
  Code2, 
  PlusCircle, 
  HeartHandshake
} from 'lucide-react';

interface AgentSupportViewProps {
  onOpenAddMemory: (domain: string) => void;
  onRefreshStats: () => void;
}

export const AgentSupportView: React.FC<AgentSupportViewProps> = ({ onOpenAddMemory, onRefreshStats }) => {
  const [prompt, setPrompt] = useState('Sarah Jenkins here. The webhook listener is throwing TLS verification errors again in our staging environment.');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'agent'; content: string; memories?: any }>>([
    {
      role: 'agent',
      content: '🎧 **VIP Support & Customer Memory Concierge**\n\nI remember customer profiles, programming language preferences, tech stack architectures, and previous tickets so users never have to repeat their backstory.'
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
      const res = await fetch('/api/agent/support', {
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 glass-card rounded-2xl border border-emerald-900/30">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
            <Headphones className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <span>Customer Support & VIP Concierge Agent</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                Client Profile Memory
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Maintains high-touch context across tickets. Adapts communication style and provides tailored code solutions.
            </p>
          </div>
        </div>

        <button
          onClick={() => onOpenAddMemory('support')}
          className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-900/30 transition self-start md:self-auto"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Retain Customer Profile</span>
        </button>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => handleSend('Show Sarah Jenkins customer profile, tech preferences, and past CSAT ratings.')}
          className="p-3 text-left glass-card glass-card-hover rounded-xl text-xs text-slate-300 border border-slate-800"
        >
          <span className="font-semibold text-emerald-400 block mb-1">👤 VIP Account Summary</span>
          <span>"Show Sarah Jenkins customer profile, tech preferences, and past CSAT ratings."</span>
        </button>
        <button
          onClick={() => handleSend('How should we format our response for Sarah Jenkins to match her communication preference?')}
          className="p-3 text-left glass-card glass-card-hover rounded-xl text-xs text-slate-300 border border-slate-800"
        >
          <span className="font-semibold text-blue-400 block mb-1">🎯 Tailored Tone Synthesis</span>
          <span>"How should we format our response for Sarah Jenkins to match her communication preference?"</span>
        </button>
        <button
          onClick={() => handleSend('Provide Python asyncio code for TLS 1.3 cert verification without generic preamble.')}
          className="p-3 text-left glass-card glass-card-hover rounded-xl text-xs text-slate-300 border border-slate-800"
        >
          <span className="font-semibold text-purple-400 block mb-1">🐍 Instant Code Solution</span>
          <span>"Provide Python asyncio code for TLS 1.3 cert verification without generic preamble."</span>
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
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-900/90 text-slate-200 border border-slate-800 shadow-sm'
                }`}
              >
                {m.memories && (
                  <div className="mb-3 pb-3 border-b border-slate-800/80 space-y-1.5">
                    <div className="flex items-center space-x-1.5 text-[10px] font-semibold text-emerald-400">
                      <Brain className="h-3.5 w-3.5" />
                      <span>Recalled Customer Context:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {m.memories.mentalModels?.map((model: any) => (
                        <span key={model.id} className="text-[10px] bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 px-2 py-0.5 rounded">
                          Style: {model.recommendedTactic}
                        </span>
                      ))}
                      {m.memories.facts?.map((fact: any) => (
                        <span key={fact.id} className="text-[10px] bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded">
                          Profile: {fact.subject}
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
            <div className="flex items-center space-x-2 text-xs text-emerald-400 p-2">
              <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
              <span>Fetching customer profile and tailoring response style...</span>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center space-x-3">
          <input
            type="text"
            placeholder="Type customer question or support ticket inquiry..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !prompt.trim()}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-900/30 transition flex items-center space-x-1.5 disabled:opacity-50"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
