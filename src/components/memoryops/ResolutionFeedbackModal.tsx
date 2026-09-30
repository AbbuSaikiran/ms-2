import React, { useState } from 'react';
import { X, CheckCircle2, BrainCircuit, Sparkles, BookOpen, User } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ResolutionFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  incident: any;
  onResolvedSuccess: () => void;
}

export const ResolutionFeedbackModal: React.FC<ResolutionFeedbackModalProps> = ({
  isOpen,
  onClose,
  incident,
  onResolvedSuccess,
}) => {
  const [confirmedRootCause, setConfirmedRootCause] = useState('');
  const [fixApplied, setFixApplied] = useState('');
  const [resolvedSuccessfully, setResolvedSuccessfully] = useState(true);
  const [postMortemLessons, setPostMortemLessons] = useState('');
  const [confirmedBy, setConfirmedBy] = useState('Alex Rivera (Staff SRE)');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !incident) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/memoryops/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incidentId: incident.id,
          confirmedRootCause,
          fixApplied,
          resolvedSuccessfully,
          postMortemLessons,
          confirmedBy,
        }),
      });
      const data = await res.json();
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.8 },
      });
      onResolvedSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-800">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100">FR-05: Confirmed Resolution & Hindsight Learning Loop</h3>
              <p className="text-[11px] text-slate-400">Record ground-truth operational outcome for incident {incident.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 bg-purple-950/30 border border-purple-800/40 rounded-xl flex items-start space-x-2 text-xs text-purple-300">
            <BrainCircuit className="h-4 w-4 text-pink-400 shrink-0 mt-0.5" />
            <span>
              <strong>Continuous Memory Retention:</strong> Saving this outcome tells Hindsight to store the verified root cause and fix so subsequent matching incidents immediately receive this exact runbook.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Confirmed Root Cause</label>
            <textarea
              required
              rows={2}
              value={confirmedRootCause}
              onChange={(e) => setConfirmedRootCause(e.target.value)}
              placeholder="e.g. PgBouncer pool starvation caused by unclosed DB connection in async worker..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Confirmed Fix Applied</label>
            <textarea
              required
              rows={2}
              value={fixApplied}
              onChange={(e) => setFixApplied(e.target.value)}
              placeholder="e.g. Scaled PgBouncer pooler size from 50 to 250 and enabled Redis stale-while-revalidate..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 font-sans"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Resolution Outcome</label>
              <select
                value={resolvedSuccessfully ? 'true' : 'false'}
                onChange={(e) => setResolvedSuccessfully(e.target.value === 'true')}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-medium"
              >
                <option value="true">✅ Successfully Resolved (Retain as Positive Fix)</option>
                <option value="false">❌ Fix Failed (Retain as Ineffective Attempt)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Confirmed By (Engineer)</label>
              <input
                type="text"
                required
                value={confirmedBy}
                onChange={(e) => setConfirmedBy(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Post-Mortem Lessons Learned</label>
            <input
              type="text"
              value={postMortemLessons}
              onChange={(e) => setPostMortemLessons(e.target.value)}
              placeholder="e.g. Never restart microservice pods during DB pool saturation."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end space-x-3 border-t border-slate-800/80">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !confirmedRootCause.trim() || !fixApplied.trim()}
              className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl text-xs shadow-lg shadow-emerald-950 transition disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Retaining to Hindsight...</span>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Save Outcome & Retain in Memory</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
