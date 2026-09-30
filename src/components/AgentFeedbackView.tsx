import React, { useState } from 'react';
import { 
  LineChart, 
  Send, 
  Brain, 
  Sparkles, 
  Layers, 
  PlusCircle, 
  Lightbulb,
  BarChart3,
  MessageSquareDiff
} from 'lucide-react';

interface AgentFeedbackViewProps {
  onOpenAddMemory: (domain: string) => void;
  onRefreshStats: () => void;
}

export const AgentFeedbackView: React.FC<AgentFeedbackViewProps> = ({ onOpenAddMemory, onRefreshStats }) => {
  const [prompt, setPrompt] = useState('Synthesize customer feedback from Zendesk, Discord, and recent quarterly reviews regarding our bulk data export features.');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'agent'; content: string; memories?: any }>>([
    {
      role: 'agent',
      content: '📊 **Product Strategy & Feedback Synthesizer Agent**\n\nI accumulate qualitative feedback, feature requests, and community discussions across weeks and months. I spot trends that one-shot analysis misses and link user pain points directly to engineering roadmaps.'
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
      const res = await fetch('/api/agent/feedback', {
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 glass-card rounded-2xl border border-amber-900/30">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30">
            <LineChart className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <span>Product Feedback Synthesizer Agent</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
                Voice of Customer
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Accumulates multi-channel feedback, detects subtle sentiment shifts, and synthesizes actionable product roadmaps.
            </p>
          </div>
        </div>

        <button
          onClick={() => onOpenAddMemory('feedback')}
          className="flex items-center space-x-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-amber-900/30 transition self-start md:self-auto"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Retain User Feedback</span>
        </button>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => handleSend('What are the top 3 friction points reported by enterprise analysts in Q3?')}
          className="p-3 text-left glass-card glass-card-hover rounded-xl text-xs text-slate-300 border border-slate-800"
        >
          <span className="font-semibold text-amber-400 block mb-1">📈 Top Friction Points</span>
          <span>"What are the top 3 friction points reported by enterprise analysts in Q3?"</span>
        </button>
        <button
          onClick={() => handleSend('Why did customer sentiment dip slightly after release v2.4?')}
          className="p-3 text-left glass-card glass-card-hover rounded-xl text-xs text-slate-300 border border-slate-800"
        >
          <span className="font-semibold text-pink-400 block mb-1">📉 Release Sentiment Dip Analysis</span>
          <span>"Why did customer sentiment dip slightly after release v2.4?"</span>
        </button>
        <button
          onClick={() => handleSend('Recommend product roadmap items to reduce enterprise churn based on past experiences.')}
          className="p-3 text-left glass-card glass-card-hover rounded-xl text-xs text-slate-300 border border-slate-800"
        >
          <span className="font-semibold text-emerald-400 block mb-1">🚀 Churn Prevention Roadmap</span>
          <span>"Recommend product roadmap items to reduce enterprise churn based on past experiences."</span>
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
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'bg-slate-900/90 text-slate-200 border border-slate-800 shadow-sm'
                }`}
              >
                {m.memories && (
                  <div className="mb-3 pb-3 border-b border-slate-800/80 space-y-1.5">
                    <div className="flex items-center space-x-1.5 text-[10px] font-semibold text-amber-400">
                      <Brain className="h-3.5 w-3.5" />
                      <span>Recalled Product Insights:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {m.memories.mentalModels?.map((model: any) => (
                        <span key={model.id} className="text-[10px] bg-amber-950/80 text-amber-300 border border-amber-800/60 px-2 py-0.5 rounded">
                          Synthesis: {model.pattern.slice(0, 32)}...
                        </span>
                      ))}
                      {m.memories.facts?.map((fact: any) => (
                        <span key={fact.id} className="text-[10px] bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded">
                          Trend: {fact.subject}
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
            <div className="flex items-center space-x-2 text-xs text-amber-400 p-2">
              <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              <span>Cross-referencing multi-channel feedback and synthesizing roadmaps...</span>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center space-x-3">
          <input
            type="text"
            placeholder="Ask about feedback patterns, feature demand, or release impact..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !prompt.trim()}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-amber-900/30 transition flex items-center space-x-1.5 disabled:opacity-50"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
