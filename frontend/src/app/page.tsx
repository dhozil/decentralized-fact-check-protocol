"use client";

import Masthead from "@/components/Masthead";
import HowItWorks from "@/components/HowItWorks";
import StatsSection from "@/components/StatsSection";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import FactCheckClient from "@/lib/contract";

export default function Home() {
  const [stats, setStats] = useState({
    total_claims: 0,
    total_challenges: 0,
    total_staked: 0,
    verified_claims: 0,
  });
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletProvider, setWalletProvider] = useState<any>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const client = new FactCheckClient();
        const data = await client.getStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to load stats:", error);
      }
    };
    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-paper">
      <Masthead
        onWalletChange={setWalletAddress}
        onProviderChange={setWalletProvider}
      />

      <main>
        {/* Hero Section */}
        <section className="py-16 px-4 border-b border-border">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-xs font-serif tracking-widest text-muted uppercase">
              Powered by GenLayer AI Validators
            </span>
            <h1 className="headline-xl mt-4 mb-6">
              Decentralized Truth Protocol
            </h1>
            <p className="font-body text-xl text-muted leading-relaxed max-w-2xl mx-auto mb-8">
              Submit any claim for AI-powered fact verification. Multiple validators
              independently analyze evidence and reach consensus on verdicts.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/submit" className="btn-newspaper btn-primary text-lg px-8 py-4">
                Submit a Claim
              </a>
              <a href="/explorer" className="btn-newspaper text-lg px-8 py-4">
                Explore Verdicts
              </a>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="py-12 px-4 bg-white border-b border-border">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-4xl font-serif font-bold text-accent">
                  {stats.total_claims}
                </div>
                <div className="text-sm text-muted font-body mt-1">Claims Verified</div>
              </div>
              <div>
                <div className="text-4xl font-serif font-bold text-accent">
                  {stats.verified_claims}
                </div>
                <div className="text-sm text-muted font-body mt-1">Definitive Verdicts</div>
              </div>
              <div>
                <div className="text-4xl font-serif font-bold text-accent">
                  {stats.total_staked.toFixed(1)}
                </div>
                <div className="text-sm text-muted font-body mt-1">$GEN Staked</div>
              </div>
              <div>
                <div className="text-4xl font-serif font-bold text-accent">
                  {stats.total_challenges}
                </div>
                <div className="text-sm text-muted font-body mt-1">Challenges</div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <HowItWorks />

        {/* Stats */}
        <StatsSection stats={stats} />
      </main>

      <Footer />
    </div>
  );
}
