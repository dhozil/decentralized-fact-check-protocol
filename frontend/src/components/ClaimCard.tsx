"use client";

import { useState, useEffect } from "react";
import FactCheckClient from "@/lib/contract";

interface Claim {
  id: string;
  text: string;
  source_url: string;
  verdict: string;
  confidence: number;
  reasoning: string;
  submitter: string;
  sources_checked: number;
  has_been_checked: boolean;
  challenge_count: number;
}

interface Challenge {
  id: string;
  claim_id: string;
  challenger: string;
  reason: string;
  old_verdict: string;
  old_confidence: number;
  new_verdict: string;
  new_confidence: number;
  is_successful: boolean;
}

interface ClaimCardProps {
  claim: Claim;
  onChallenge?: (claimId: string) => void;
}

export default function ClaimCard({ claim, onChallenge }: ClaimCardProps) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [showChallenges, setShowChallenges] = useState(false);
  const [loadingChallenges, setLoadingChallenges] = useState(false);

  const getVerdictClass = (verdict: string) => {
    switch (verdict.toUpperCase()) {
      case "TRUE":
        return "verdict-true";
      case "FALSE":
        return "verdict-false";
      default:
        return "verdict-unverifiable";
    }
  };

  const getVerdictLabel = (verdict: string) => {
    switch (verdict.toUpperCase()) {
      case "TRUE":
        return "VERIFIED TRUE";
      case "FALSE":
        return "DETECTED FALSE";
      default:
        return "UNVERIFIABLE";
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const loadChallenges = async () => {
    if (challenges.length > 0) {
      setShowChallenges(!showChallenges);
      return;
    }
    setLoadingChallenges(true);
    try {
      const client = new FactCheckClient();
      const data = await client.getClaimChallenges(claim.id);
      setChallenges(data);
      setShowChallenges(true);
    } catch (error) {
      console.error("Failed to load challenges:", error);
    } finally {
      setLoadingChallenges(false);
    }
  };

  return (
    <article className="article-card p-6 animate-fade-in">
      {/* Header with verdict badge */}
      <div className="flex justify-between items-start mb-4">
        <span className={`text-xs px-3 py-1 ${getVerdictClass(claim.verdict)}`}>
          {getVerdictLabel(claim.verdict)}
        </span>
        <div className="text-right">
          <div className="text-2xl font-serif font-bold text-ink">
            {claim.confidence}%
          </div>
          <div className="text-xs text-muted">Confidence</div>
        </div>
      </div>

      {/* Claim text */}
      <h3 className="headline-md mb-4 leading-tight">{claim.text}</h3>

      {/* Reasoning */}
      <p className="text-muted font-body mb-4 drop-cap">{claim.reasoning}</p>

      {/* Confidence bar */}
      <div className="mb-4">
        <div className="h-2 bg-highlight border border-border overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              claim.verdict === "TRUE"
                ? "bg-green-800"
                : claim.verdict === "FALSE"
                ? "bg-accent"
                : "bg-muted"
            }`}
            style={{ width: `${claim.confidence}%` }}
          />
        </div>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-2 gap-4 text-xs border-t border-border pt-4">
        <div>
          <span className="text-muted">Sources Checked:</span>
          <span className="ml-1 font-semibold">{claim.sources_checked}</span>
        </div>
        <div>
          <span className="text-muted">Challenges:</span>
          <span className="ml-1 font-semibold">{claim.challenge_count}</span>
        </div>
        <div>
          <span className="text-muted">Submitted by:</span>
          <span className="ml-1 font-mono">{formatAddress(claim.submitter)}</span>
        </div>
        <div>
          <span className="text-muted">ID:</span>
          <span className="ml-1 font-mono">{claim.id}</span>
        </div>
      </div>

      {/* Source link */}
      {claim.source_url && (
        <div className="mt-4 pt-4 border-t border-border">
          <a
            href={claim.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-accent hover:underline font-serif"
          >
            View Original Source &#8594;
          </a>
        </div>
      )}

      {/* Challenge details section */}
      {claim.challenge_count > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <button
            onClick={loadChallenges}
            disabled={loadingChallenges}
            className="text-xs text-accent hover:underline font-serif"
          >
            {loadingChallenges
              ? "Loading challenges..."
              : showChallenges
              ? "Hide Challenge Details"
              : `View ${claim.challenge_count} Challenge${claim.challenge_count > 1 ? "s" : ""}`}
          </button>

          {showChallenges && challenges.length > 0 && (
            <div className="mt-3 space-y-3">
              {challenges.map((chall) => (
                <div
                  key={chall.id}
                  className={`p-3 text-xs border ${
                    chall.is_successful ? "border-green-700 bg-green-50" : "border-border bg-highlight"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono">{formatAddress(chall.challenger)}</span>
                    <span
                      className={`px-2 py-0.5 ${
                        chall.is_successful ? "bg-green-700 text-white" : "bg-muted text-white"
                      }`}
                    >
                      {chall.is_successful ? "SUCCESSFUL" : "FAILED"}
                    </span>
                  </div>
                  <p className="text-muted mb-2">&quot;{chall.reason}&quot;</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-muted">Old:</span>{" "}
                      <span className={getVerdictClass(chall.old_verdict)}>
                        {chall.old_verdict} ({chall.old_confidence}%)
                      </span>
                    </div>
                    <div>
                      <span className="text-muted">New:</span>{" "}
                      <span className={getVerdictClass(chall.new_verdict)}>
                        {chall.new_verdict} ({chall.new_confidence}%)
                      </span>
                    </div>
                  </div>
                  {chall.is_successful && (
                    <div className="mt-2 text-green-800 font-semibold">
                      +10 GEN reward (2x stake)
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Challenge button */}
      {claim.has_been_checked && onChallenge && (
        <div className="mt-4">
          <button
            onClick={() => onChallenge(claim.id)}
            className="btn-newspaper text-xs w-full"
          >
            Challenge This Verdict (5 $GEN)
          </button>
        </div>
      )}
    </article>
  );
}
