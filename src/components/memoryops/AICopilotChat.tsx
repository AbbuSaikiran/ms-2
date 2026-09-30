import React, { useState, useEffect, useRef } from 'react';
import { 
  BrainCircuit, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Terminal, 
  ShieldCheck, 
  Zap, 
  RotateCcw,
  Copy,
  Check,
  Search,
  BookOpen,
  Activity,
  ArrowRight
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  recalledMemories?: any[];
}

export const AICopilotChat: React.FC<{ onAnalyzeIncident?: (incident: any) => void }> = ({ onAnalyzeIncident }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: `Hello! I am **MemoryOps AI**, your Autonomous SRE Incident & Memory Copilot powered by **Vectorize Hindsight**. 

I remember all previous production incidents, confirmed root causes, infra limits, and verified runbooks. 

You can ask me questions like:
- *"What caused our last database connection starvation incident?"*
- *"Show me the verified runbook for JWKS token timeout in auth-service"*
- *"What are the current connection pool limits for pg_bouncer?"*
- *"Diagnose 504 Gateway Timeouts during flash sale surges"*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/memoryops/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend }),
      });

      const data = await res.json();
      const aiMsg: ChatMessage = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: data.reply || 'I processed your query against Hindsight persistent memory.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recalledMemories: data.recalledMemories
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: 'ai-err-' + Date.now(),
          sender: 'ai',
          text: `Error connecting to MemoryOps AI backend: ${err.message}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyText = (txt: string, id: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const sampleQuestions = [
    'What caused our last database connection pool exhaustion?',
    'What is the safe runbook for JWKS key expiration in auth-service?',
    'Explain the root cause of OOMKilled worker pods',
    'How does Hindsight persistent memory prevent repeat outages?'
  ];

  return (
    <div className="glass-card rounded-3xl border border-white/10 flex flex-col h-[750px] shadow-2xl overflow-hidden animate-in fade-in duration-300 bg-[#070B18]">
      {/* Header */}
      <div className="p-4 bg-[#0B132B]/90 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-[1px]">
            <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
              <BrainCircuit className="h-5 w-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-white">MemoryOps AI SRE Copilot</h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-800 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Hindsight Connected</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Ask any question to retrieve historical postmortems, heuristics & verified runbooks</p>
          </div>
        </div>

        <button
          onClick={() => setMessages([messages[0]])}
          className="text-slate-400 hover:text-white p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition text-xs flex items-center space-x-1"
          title="Clear chat history"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Clear Chat</span>
        </button>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2.5 bg-slate-950/60 border-b border-white/5 flex items-center gap-2 overflow-x-auto text-[11px]">
        <span className="text-slate-500 font-mono shrink-0 flex items-center space-x-1">
          <Sparkles className="h-3 w-3 text-amber-400" />
          <span>Quick Ask:</span>
        </span>
        {sampleQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-3 py-1 rounded-full bg-white/5 hover:bg-purple-950/60 hover:text-purple-300 text-slate-300 border border-white/10 whitespace-nowrap transition"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Message Stream */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
        {messages.map((m) => {
          const isAi = m.sender === 'ai';
          return (
            <div
              key={m.id}
              className={`flex items-start space-x-3 ${isAi ? '' : 'flex-row-reverse space-x-reverse'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                  isAi
                    ? 'bg-gradient-to-tr from-purple-600 to-cyan-500 text-slate-950 shadow-md shadow-purple-900/30'
                    : 'bg-blue-600 text-white'
                }`}
              >
                {isAi ? <Bot className="h-4 w-4 text-slate-950" /> : <User className="h-4 w-4" />}
              </div>

              {/* Bubble */}
              <div className={`max-w-2xl space-y-2 ${isAi ? 'text-left' : 'text-right'}`}>
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isAi
                      ? 'bg-[#0E1730] border border-white/10 text-slate-200 shadow-xl'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-900/40'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans">{m.text}</div>

                  {/* Recalled Memory Citations Badge */}
                  {m.recalledMemories && m.recalledMemories.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/10 space-y-1.5 text-left">
                      <div className="text-[10px] font-mono text-cyan-300 font-bold uppercase tracking-wider flex items-center space-x-1">
                        <BrainCircuit className="h-3 w-3 text-cyan-400" />
                        <span>Recalled Hindsight Operational Memories ({m.recalledMemories.length})</span>
                      </div>
                      <div className="space-y-1">
                        {m.recalledMemories.slice(0, 3).map((mem, mi) => (
                          <div
                            key={mi}
                            className="p-2 rounded-lg bg-slate-950/80 border border-white/5 text-[11px] text-slate-300 font-mono"
                          >
                            <span className="text-purple-400 font-bold mr-1">[Score: {mem.score.toFixed(2)}]</span>
                            <span>{mem.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                  <div className="flex items-center space-x-2 text-[10px] text-slate-500 px-1">
                  <span>{m.timestamp}</span>
                  {isAi && (
                    <button
                      onClick={() => copyText(m.text, m.id)}
                      className="hover:text-slate-300 flex items-center space-x-1 transition"
                    >
                      {copiedId === m.id ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedId === m.id ? 'Copied' : 'Copy'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center space-x-3 text-xs text-purple-300 animate-pulse">
            <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center">
              <BrainCircuit className="h-4 w-4 animate-spin text-purple-400" />
            </div>
            <div className="p-3.5 rounded-2xl bg-[#0E1730] border border-white/10 text-slate-300 font-mono text-xs">
              Searching Hindsight memory graph & reasoning with Groq LLM...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-4 bg-[#0B132B] border-t border-white/10 flex items-center space-x-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI Copilot about any incident, runbook, or infrastructure problem..."
          className="flex-1 bg-slate-950 border border-white/10 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 transition font-sans"
        />

        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-2xl shadow-lg shadow-blue-600/30 transition disabled:opacity-50 shrink-0"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};
