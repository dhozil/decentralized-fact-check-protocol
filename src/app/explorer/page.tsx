"use client";

import { useState, useEffect, useCallback } from "react";
import Masthead from "@/components/Masthead";
import ClaimCard from "@/components/ClaimCard";
import SearchBar from "@/components/SearchBar";
import Leaderboard from "@/components/Leaderboard";
import Footer from "@/components/Footer";
import ToastContainer, { showToast } from "@/components/Toast";
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

interface LeaderboardEntry {
  address: string;
  reputation: number;
  submissions: number;
  correct_submissions: number;
}

export default function ExplorerPage() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [filteredClaims, setFilteredClaims] = useState<Claim[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [challengeModal, setChallengeModal] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletProvider, setWalletProvider] = useState<any>(null);
  const [client, setClient] = useState<FactCheckClient>(() => new FactCheckClient());

  useEffect(() => {
    if (walletAddress) {
      const c = new FactCheckClient(walletAddress);
      setClient(c);
    }
  }, [walletAddress]);

  const fetchData = useCallback(async () => {
    try {
      // Fetch claims and leaderboard in parallel
      const [claimsData, leaderboardData] = await Promise.all([
        client.getClaims(),
        client.getLeaderboard(),
      ]);
      setClaims(claimsData);
      setFilteredClaims(claimsData);
      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [client]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredClaims(claims);
      return;
    }
    const lowerQuery = query.toLowerCase();
    const filtered = claims.filter(
      (claim) =>
        claim.text.toLowerCase().includes(lowerQuery) ||
        claim.verdict.toLowerCase().includes(lowerQuery) ||
        claim.submitter.toLowerCase().includes(lowerQuery)
    );
    setFilteredClaims(filtered);
  };

  const handleChallenge = async (claimId: string, reason: string) => {
    if (!walletAddress || !walletProvider) {
      showToast({ type: "error", title: "Wallet Not Connected", message: "Please connect your wallet first" });
      return;
    }

    showToast({ type: "pending", title: "Challenging Verdict", message: "Sending challenge transaction..." });

    try {
      const result = await client.challengeClaim(claimId, reason, walletProvider);
      if (result.success) {
        showToast({
          type: "success",
          title: "Challenge Submitted",
          message: "Challenge is being evaluated by validators.",
          txHash: result.txHash,
        });
        setChallengeModal(null);
        await fetchData();
      } else {
        showToast({ type: "error", title: "Challenge Failed", message: result.error || "Unknown error" });
      }
    } catch (error) {
      console.error("Failed to challenge claim:", error);
      showToast({ type: "error", title: "Challenge Failed", message: "Transaction was rejected or failed" });
    }
  };

  return (
    <div className="min-h-screen bg-paper">
      <Masthead
        onWalletChange={setWalletAddress}
        onProviderChange={setWalletProvider}
      />

      <main className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <span className="text-xs font-serif tracking-widest text-muted uppercase">
              Verification Archive
            </span>
            <h1 className="headline-lg mt-2">Explore Verified Claims</h1>
            <p className="font-body text-muted mt-2">
              Browse all submitted claims and their AI-verified verdicts
            </p>
            <div className="rule-thin mt-4 max-w-xs mx-auto"></div>
          </div>

          {/* Search */}
          <SearchBar onSearch={handleSearch} />

          {/* Claims Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-border border-t-accent"></div>
              <p className="font-body text-muted mt-4">Loading claims from blockchain...</p>
            </div>
          ) : filteredClaims.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-body text-muted text-lg">No claims submitted yet.</p>
              <a href="/submit" className="btn-newspaper btn-primary mt-4 inline-block">
                Submit the First Claim
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClaims.map((claim) => (
                <ClaimCard
                  key={claim.id}
                  claim={claim}
                  onChallenge={(id) => setChallengeModal(id)}
                />
              ))}
            </div>
          )}

          {/* Leaderboard */}
          <div className="mt-12">
            <Leaderboard entries={leaderboard} />
          </div>
        </div>
      </main>

      <Footer />
      <ToastContainer />
    </div>
  );
}
