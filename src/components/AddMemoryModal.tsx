import React, { useState } from 'react';
import { X, Plus, Brain, Database, History, Lightbulb } from 'lucide-react';

interface AddMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: { domain: string; type: 'fact' | 'experience' | 'mental_model'; data: any }) => Promise<void>;
  defaultDomain?: string;
}

export const AddMemoryModal: React.FC<AddMemoryModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  defaultDomain = 'sales',
}) => {
  const [domain, setDomain] = useState<'sales' | 'devops' | 'support' | 'feedback'>(
    defaultDomain as any || 'sales'
  );
  const [type, setType] = useState<'fact' | 'experience' | 'mental_model'>('fact');

  // Fact fields
  const [subject, setSubject] = useState('');
  const [factContent, setFactContent] = useState('');
  const [tags, setTags] = useState('');

  // Experience fields
  const [context, setContext] = useState('');
  const [actionTaken, setActionTaken] = useState('');
  const [outcome, setOutcome] = useState('');
  const [sentiment, setSentiment] = useState<'positive' | 'neutral' | 'negative'>('positive');

  // Mental model fields
  const [pattern, setPattern] = useState('');
  const [insight, setInsight] = useState('');
  const [recommendedTactic, setRecommendedTactic] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let payload: any = {};
    if (type === 'fact') {
      payload = {
        subject,
        content: factContent,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        confidence: 0.95,
      };
    } else if (type === 'experience') {
      payload = {
        context,
        actionTaken,
        outcome,
        sentiment,
      };
    } else {
      payload = {
        pattern,
        insight,
        recommendedTactic,
        evolvedFromCount: 1,
      };
    }

    await onAdd({ domain, type, data: payload });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-emerald-950/70 border border-emerald-800/60 text-emerald-400">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-100">Retain New Hindsight Memory</h3>
              <p className="text-xs text-slate-400">Store durable facts, past experiences, or mental models</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Domain & Type Selectors */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Agent Domain</label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              >
                <option value="sales">Sales & Deal Intelligence</option>
                <option value="devops">DevOps Incident Response</option>
                <option value="support">Customer Support Concierge</option>
                <option value="feedback">Product Feedback Synthesizer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Memory Primitive</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-purple-500 font-medium"
              >
                <option value="fact">World Fact (Durable Knowledge)</option>
                <option value="experience">Experience (Interaction History)</option>
                <option value="mental_model">Mental Model (Learned Strategy)</option>
              </select>
            </div>
          </div>

          {/* Conditional Forms */}
          {type === 'fact' && (
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Subject / Entity Name</label>
                <input
                  required
                  placeholder="e.g. Acme Corp Infrastructure or Sarah Jenkins"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Fact Content / Specifications</label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Needs sub-50ms latency in EU-Central and SOC2 Type II certification..."
                  value={factContent}
                  onChange={(e) => setFactContent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Tags (Comma Separated)</label>
                <input
                  placeholder="e.g. SOC2, Enterprise, Acme, Latency"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          )}

          {type === 'experience' && (
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Context / Trigger Scenario</label>
                <input
                  required
                  placeholder="e.g. Prospect objected to annual lock-in contract terms"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Action Taken by Agent/Human</label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. Proposed quarterly checkpoints with guaranteed SLA refund clauses"
                  value={actionTaken}
                  onChange={(e) => setActionTaken(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Outcome / Result</label>
                <input
                  required
                  placeholder="e.g. Deal closed in 3 days with $80k ARR"
                  value={outcome}
                  onChange={(e) => setOutcome(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          )}

          {type === 'mental_model' && (
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Identified Recurring Pattern</label>
                <input
                  required
                  placeholder="e.g. Enterprise buyers asking about competitor security certifications"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Core Cognitive Insight</label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. Security teams care about audit logs and data retention policies more than raw feature checklists."
                  value={insight}
                  onChange={(e) => setInsight(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Recommended Tactic / Strategy</label>
                <input
                  required
                  placeholder="e.g. Send one-click SOC2 audit room link upfront before technical demos"
                  value={recommendedTactic}
                  onChange={(e) => setRecommendedTactic(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          )}

          <div className="pt-3 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-950 transition"
            >
              {isSubmitting ? 'Retaining...' : 'Retain to Hindsight'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
