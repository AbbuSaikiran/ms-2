import React, { useState } from 'react';
import { X, Key, Zap, CheckCircle2, Cloud, Sparkles, Cpu } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (keys: { hindsightApiKey: string; groqApiKey: string; openAiApiKey: string; model?: string }) => Promise<void>;
  currentHindsightKey?: string;
  currentModel?: string;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentModel = 'llama-3.3-70b-versatile',
}) => {
  const [hindsightKey, setHindsightKey] = useState('');
  const [groqKey, setGroqKey] = useState('');
  const [openAiKey, setOpenAiKey] = useState('');
  const [model, setModel] = useState(currentModel);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await onSave({
      hindsightApiKey: hindsightKey,
      groqApiKey: groqKey,
      openAiApiKey: openAiKey,
      model,
    });
    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-purple-950/70 border border-purple-800/60 text-purple-400">
              <Key className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-100">LLM & Hindsight Configuration</h3>
              <p className="text-xs text-slate-400">Configure Groq Models, OpenClaw & API Keys</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Hindsight Info Banner */}
          <div className="p-3.5 bg-gradient-to-r from-purple-950/40 to-blue-950/40 border border-purple-800/40 rounded-xl flex items-start space-x-3">
            <Cloud className="h-5 w-5 text-purple-400 mt-0.5 shrink-0" />
            <div className="text-xs space-y-1">
              <p className="text-purple-200 font-medium">Hindsight Cloud & Free Credits Promo</p>
              <p className="text-slate-400">
                Use promo code <span className="font-mono text-purple-300 font-bold bg-purple-900/50 px-1.5 py-0.5 rounded border border-purple-700/50">MEMHACK99</span> on <a href="https://ui.hindsight.vectorize.io" target="_blank" rel="noreferrer" className="text-blue-400 underline hover:text-blue-300">ui.hindsight.vectorize.io</a> for $50 free credits!
              </p>
            </div>
          </div>

          {/* Model Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center space-x-1.5">
              <Cpu className="h-3.5 w-3.5 text-purple-400" />
              <span>Recommended LLM Model</span>
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-purple-500"
            >
              <option value="llama-3.3-70b-versatile">llama-3.3-70b-versatile (Groq - Super Fast)</option>
              <option value="openai/gpt-oss-120b">openai/gpt-oss-120b (Groq Hackathon Recommended)</option>
              <option value="qwen/qwen3-32b">qwen/qwen3-32b (Groq Hackathon Recommended)</option>
              <option value="mixtral-8x7b-32768">mixtral-8x7b-32768 (Groq)</option>
              <option value="gpt-4o-mini">gpt-4o-mini (OpenAI)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center space-x-1">
                <span>Groq API Key</span>
                <Zap className="h-3.5 w-3.5 text-amber-400" />
              </span>
              <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer" className="text-[11px] font-normal text-blue-400 hover:underline">Get Free Key</a>
            </label>
            <input
              type="password"
              placeholder="gsk_..."
              value={groqKey}
              onChange={(e) => setGroqKey(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Hindsight API Key</span>
              <span className="text-[11px] font-normal text-slate-400">Optional (Falls back to Local Engine)</span>
            </label>
            <input
              type="password"
              placeholder="hs_live_..."
              value={hindsightKey}
              onChange={(e) => setHindsightKey(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>OpenAI API Key (Optional)</span>
              <span className="text-[11px] font-normal text-slate-400">gpt-4o-mini</span>
            </label>
            <input
              type="password"
              placeholder="sk-proj-..."
              value={openAiKey}
              onChange={(e) => setOpenAiKey(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-mono"
            />
          </div>

          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center space-x-2 px-5 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-purple-900/30 transition disabled:opacity-50"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Saved!</span>
                </>
              ) : isSaving ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Save Settings</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
