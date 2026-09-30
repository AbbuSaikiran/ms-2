import React, { useState } from 'react';
import { 
  SplitSquareVertical, 
  Sparkles, 
  Bot, 
  BrainCircuit, 
  Play, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  Headphones,
  LineChart,
  Layers,
  Flame
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BenchmarkProps {
  onSelectAgent: (tab: any) => void;
}

const BENCHMARK_SCENARIOS = [
  {
    id: 'sales-1',
    title: 'Sales Objection Handling (Acme Corp)',
    domain: 'sales',
    icon: TrendingUp,
    badge: 'Deal Intelligence',
    color: 'blue',
    prompt: 'Mark from Acme Corp is still hesitating on signing the contract because of latency concerns and Competitor X pricing. What should our response strategy be?',
    explanation: 'Hindsight recalls Mark Stevens (VP Eng), previous SOC2 validation in Call 1, and the 2-year price lock approved in Call 2 to construct a tailored rebuttal.'
  },
  {
    id: 'devops-1',
    title: 'Live 504 Outage on Payment Gateway',
    domain: 'devops',
    icon: ShieldAlert,
    badge: 'DevOps Incident',
    color: 'red',
    prompt: 'URGENT: Alert firing! Payment gateway is returning 504 timeouts to checkout users. Error rate is 12%. Should we restart the pods?',
    explanation: 'Stateless suggests generic pod restarts (which causes retry storms). Hindsight recalls INC-402 and immediately recommends PgBouncer pool scaling & Redis stale cache.'
  },
  {
    id: 'support-1',
    title: 'VIP Developer Webhook TLS Mismatch',
    domain: 'support',
    icon: Headphones,
    badge: 'VIP Support',
    color: 'emerald',
    prompt: 'I am getting SSL handshake error on my custom Python webhook receiver again. Fix this now.',
    explanation: 'Hindsight identifies Sarah Jenkins (VIP Tier, Python 3.11 asyncio) from past tickets and outputs exact certifi TLS 1.3 code without asking for repetitive info.'
  },
  {
    id: 'feedback-1',
    title: 'Analytics Export Frustration Synthesis',
    domain: 'feedback',
    icon: LineChart,
    badge: 'Product Strategy',
    color: 'amber',
    prompt: 'Why are enterprise users complaining about the latest v2.4 dashboard update, and what should we prioritize next sprint?',
    explanation: 'Hindsight correlates 60+ customer interactions linking automated pipeline breakage to recent UI export relocation.'
  }
];

export const ComparisonBenchmark: React.FC<BenchmarkProps> = ({ onSelectAgent }) => {
  const [selectedScenario, setSelectedScenario] = useState(BENCHMARK_SCENARIOS[0]);
  const [customPrompt, setCustomPrompt] = useState(BENCHMARK_SCENARIOS[0].prompt);
  const [isLoading, setIsLoading] = useState(false);
  const [benchmarkResult, setBenchmarkResult] = useState<{
    stateless: any;
    hindsight: any;
  } | null>(null);

  const handleSelectScenario = (scenario: typeof BENCHMARK_SCENARIOS[0]) => {
    setSelectedScenario(scenario);
    setCustomPrompt(scenario.prompt);
    setBenchmarkResult(null);
  };

  const handleRunBenchmark = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/benchmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: customPrompt,
          domain: selectedScenario.domain,
        }),
      });
      const data = await res.json();
      setBenchmarkResult(data);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-purple-500/20 shadow-2xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold">
            <Flame className="h-3.5 w-3.5 text-pink-400" />
            <span>Hackathon Demonstration</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Stateless AI vs. <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Hindsight Memory</span>
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Witness how <strong className="text-purple-300">Hindsight Persistent Memory</strong> transforms generic, forgetful LLMs into domain-expert enterprise agents that continuously retain facts, recall historical context, and synthesize mental models.
          </p>
        </div>
      </div>

      {/* Preset Scenarios Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span>Select a Hackathon Benchmark Scenario</span>
          </h2>
          <span className="text-xs text-slate-500">Click any card to load</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {BENCHMARK_SCENARIOS.map((sc) => {
            const Icon = sc.icon;
            const isSelected = selectedScenario.id === sc.id;
            return (
              <div
                key={sc.id}
                onClick={() => handleSelectScenario(sc)}
                className={`cursor-pointer p-4 rounded-2xl border transition-all duration-200 ${
                  isSelected
                    ? 'bg-purple-950/40 border-purple-500/60 shadow-lg shadow-purple-950/50 scale-[1.02]'
                    : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-xl bg-slate-800/90 text-purple-400`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {sc.badge}
                  </span>
                </div>
                <h3 className="font-semibold text-xs text-slate-100 mb-1 line-clamp-1">{sc.title}</h3>
                <p className="text-[11px] text-slate-400 line-clamp-2">{sc.explanation}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Prompt Input Box */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
        <label className="block text-xs font-semibold text-slate-300 flex items-center justify-between">
          <span>Target Scenario Prompt</span>
          <span className="text-[11px] text-slate-500">Domain: {selectedScenario.domain.toUpperCase()}</span>
        </label>
        <textarea
          rows={2}
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          className="w-full bg-slate-950/90 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
        />
        <div className="flex items-center justify-between pt-1">
          <p className="text-xs text-slate-400 flex items-center space-x-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-purple-400"></span>
            <span>Simulates single query against both standard LLM & Hindsight engine</span>
          </p>
          <button
            onClick={handleRunBenchmark}
            disabled={isLoading}
            className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-xl text-xs shadow-lg shadow-purple-900/40 transition disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Comparing Cognitive Output...</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-current" />
                <span>Run Side-by-Side Comparison</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Side-by-Side Comparison Results */}
      {benchmarkResult && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2 animate-in fade-in duration-300">
          {/* Left Column: Stateless Generic AI */}
          <div className="bg-slate-900/90 border border-red-900/40 rounded-2xl overflow-hidden shadow-xl flex flex-col">
            <div className="p-4 bg-red-950/30 border-b border-red-900/40 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-lg bg-red-950 text-red-400 border border-red-800">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-200">Standard Stateless AI</h3>
                  <p className="text-[11px] text-red-400/80">No Memory • Forgets Past Interactions</p>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-800 font-mono">
                {benchmarkResult.stateless.provider}
              </span>
            </div>

            <div className="p-5 flex-1 space-y-4">
              <div className="p-3 bg-red-950/20 border border-red-900/30 rounded-xl flex items-start space-x-2 text-xs text-red-300/90">
                <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <span>Lacks knowledge of previous calls, stakeholder preferences, and proven resolution history.</span>
              </div>
              <div className="text-xs text-slate-300 whitespace-pre-line leading-relaxed font-sans bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                {benchmarkResult.stateless.response}
              </div>
            </div>
          </div>

          {/* Right Column: Hindsight Memory Agent */}
          <div className="bg-slate-900/90 border border-purple-500/50 rounded-2xl overflow-hidden shadow-2xl flex flex-col relative ring-1 ring-purple-500/30">
            <div className="p-4 bg-gradient-to-r from-purple-950/60 to-blue-950/60 border-b border-purple-500/30 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-lg bg-purple-600 text-white shadow-lg shadow-purple-600/30">
                  <BrainCircuit className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white flex items-center space-x-1.5">
                    <span>Hindsight Adaptive Agent</span>
                    <Sparkles className="h-3.5 w-3.5 text-pink-400" />
                  </h3>
                  <p className="text-[11px] text-purple-300 font-medium">Persistent Memory • Continuous Learning</p>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-900/80 text-purple-200 border border-purple-700 font-mono">
                {benchmarkResult.hindsight.provider}
              </span>
            </div>

            <div className="p-5 flex-1 space-y-4">
              {/* Recalled Memory Summary Pills */}
              {benchmarkResult.hindsight.recalledMemories && (
                <div className="p-3.5 bg-purple-950/30 border border-purple-800/40 rounded-xl space-y-2">
                  <div className="text-[11px] font-semibold text-purple-300 flex items-center justify-between">
                    <span>Hindsight Context Recalled:</span>
                    <span className="font-mono text-[10px] text-slate-400">
                      {benchmarkResult.hindsight.recalledMemories.facts?.length || 0} Facts • {benchmarkResult.hindsight.recalledMemories.experiences?.length || 0} Experiences • {benchmarkResult.hindsight.recalledMemories.mentalModels?.length || 0} Models
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {benchmarkResult.hindsight.recalledMemories.mentalModels?.map((m: any) => (
                      <span key={m.id} className="text-[10px] px-2 py-0.5 bg-pink-950/80 text-pink-300 border border-pink-800/60 rounded-md font-medium">
                        Model: {m.pattern.slice(0, 35)}...
                      </span>
                    ))}
                    {benchmarkResult.hindsight.recalledMemories.facts?.map((f: any) => (
                      <span key={f.id} className="text-[10px] px-2 py-0.5 bg-blue-950/80 text-blue-300 border border-blue-800/60 rounded-md font-medium">
                        Fact: {f.subject}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-xs text-slate-100 whitespace-pre-line leading-relaxed font-sans bg-slate-950/80 p-4 rounded-xl border border-purple-900/30 shadow-inner">
                {benchmarkResult.hindsight.response}
              </div>

              <div className="pt-2 flex items-center justify-end">
                <button
                  onClick={() => onSelectAgent(selectedScenario.domain)}
                  className="flex items-center space-x-1.5 text-xs text-purple-400 hover:text-purple-300 font-semibold"
                >
                  <span>Open Full {selectedScenario.badge} Agent</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
