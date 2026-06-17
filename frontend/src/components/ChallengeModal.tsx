"use client";

import { useState } from "react";

interface ChallengeModalProps {
  claimId: string;
  onClose: () => void;
  onSubmit: (claimId: string, reason: string) => Promise<void>;
}

export default function ChallengeModal({ claimId, onClose, onSubmit }: ChallengeModalProps) {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(claimId, reason);
      onClose();
    } catch (error) {
      console.error("Challenge failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-ink/80 flex items-center justify-center z-50 p-4">
      <div className="article-card max-w-lg w-full animate-fade-in">
        {/* Header */}
        <div className="border-b border-border p-6">
          <div className="flex justify-between items-center">
            <h3 className="headline-md">Challenge Verdict</h3>
            <button
              onClick={onClose}
              className="text-muted hover:text-ink transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <p className="font-body text-muted mb-4">
              You are about to challenge the verdict for claim{" "}
              <span className="font-mono text-ink">{claimId}</span>.
            </p>
            <div className="bg-highlight border border-border p-4 mb-4">
              <p className="text-sm font-serif">
                <strong>Stake required:</strong> 5 $GEN
              </p>
              <p className="text-xs text-muted mt-1">
                If your challenge is successful, you&apos;ll receive 2x your stake. If unsuccessful,
                your stake will be burned.
              </p>
            </div>
          </div>

          <div className="mb-6">
            <label className="block font-serif text-sm uppercase tracking-wider mb-2">
              Reason for Challenge
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why you believe this verdict is incorrect..."
              className="textarea-newspaper"
              rows={4}
              required
            />
          </div>

          <div className="flex gap-4">
            <button type="button" onClick={onClose} className="btn-newspaper flex-1">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !reason.trim()}
              className="btn-newspaper btn-primary flex-1"
            >
              {isSubmitting ? "Submitting..." : "Submit Challenge"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
