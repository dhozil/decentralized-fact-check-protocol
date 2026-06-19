"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Masthead from "@/components/Masthead";
import Footer from "@/components/Footer";
import ToastContainer, { showToast } from "@/components/Toast";
import FactCheckClient from "@/lib/contract";
import { getRandomClaim, getClaimsByCategory, getCategories } from "@/lib/sampleClaims";

export default function SubmitPage() {
  const router = useRouter();
  const [claim, setClaim] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [showCategories, setShowCategories] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletProvider, setWalletProvider] = useState<any>(null);
  const [client, setClient] = useState<FactCheckClient>(() => new FactCheckClient());

  useEffect(() => {
    if (walletAddress) {
      const c = new FactCheckClient(walletAddress);
      setClient(c);
    }
  }, [walletAddress]);

  const categories = getCategories();

  const handleRandomClaim = () => {
    if (selectedCategory) {
      const claims = getClaimsByCategory(selectedCategory);
      if (claims.length > 0) {
        const randomIndex = Math.floor(Math.random() * claims.length);
        setClaim(claims[randomIndex].text);
        setSourceUrl(claims[randomIndex].sourceUrl);
        return;
      }
    }
    const random = getRandomClaim();
    setClaim(random.text);
    setSourceUrl(random.sourceUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claim.trim()) return;
    if (!walletAddress || !walletProvider) {
      showToast({ type: "error", title: "Wallet Not Connected", message: "Please connect your wallet first" });
      return;
    }

    setIsSubmitting(true);
    showToast({ type: "pending", title: "Submitting Claim", message: "Sending transaction... AI consensus may take 1-3 minutes." });

    try {
      const result = await client.submitClaim(claim, sourceUrl, walletProvider);
      if (result.success) {
        showToast({
          type: "success",
          title: "Claim Submitted!",
          message: "AI is analyzing your claim. Redirecting to explorer...",
          txHash: result.txHash,
        });
        setClaim("");
        setSourceUrl("");
        // Redirect to explorer after 2 seconds
        setTimeout(() => {
          router.push("/explorer");
        }, 2000);
      } else {
        showToast({ type: "error", title: "Submission Failed", message: result.error || "Unknown error" });
      }
    } catch (error) {
      console.error("Failed to submit claim:", error);
      showToast({ type: "error", title: "Submission Failed", message: "Transaction was rejected or failed" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper">
      <Masthead
        onWalletChange={setWalletAddress}
        onProviderChange={setWalletProvider}
      />

      <main className="py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <span className="text-xs font-serif tracking-widest text-muted uppercase">
              Breaking News
            </span>
            <h1 className="headline-lg mt-2">Submit a Claim</h1>
            <p className="font-body text-muted mt-2">
              Enter any statement for AI-powered fact verification
            </p>
            <div className="rule-thin mt-4 max-w-xs mx-auto"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="article-card p-8">
            <div className="space-y-6">
              {/* Random Claim Generator */}
              <div className="bg-highlight border border-border p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex-1">
                    <p className="font-serif text-sm font-semibold mb-1">
                      Quick Start: Generate Random Claim
                    </p>
                    <p className="text-xs text-muted">
                      Try the system with real 2026 news
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowCategories(!showCategories)}
                        className="btn-newspaper text-xs py-2 px-3"
                      >
                        {selectedCategory || "All"}
                      </button>
                      {showCategories && (
                        <div className="absolute top-full left-0 mt-1 bg-white border border-border shadow-lg z-10 min-w-[120px]">
                          <button
                            type="button"
                            onClick={() => { setSelectedCategory(""); setShowCategories(false); }}
                            className="block w-full text-left px-3 py-2 text-xs hover:bg-highlight font-serif"
                          >
                            All
                          </button>
                          {categories.map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => { setSelectedCategory(cat); setShowCategories(false); }}
                              className="block w-full text-left px-3 py-2 text-xs hover:bg-highlight font-serif"
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleRandomClaim}
                      className="btn-newspaper btn-primary text-xs py-2 px-4"
                    >
                      Random
                    </button>
                  </div>
                </div>
              </div>

              {/* Claim input */}
              <div>
                <label className="block font-serif text-sm uppercase tracking-wider mb-2">
                  The Claim
                </label>
                <textarea
                  value={claim}
                  onChange={(e) => setClaim(e.target.value)}
                  placeholder='e.g., "Bitcoin reached an all-time high of $150,000 in Q1 2026"'
                  className="textarea-newspaper"
                  rows={4}
                  required
                />
              </div>

              {/* Source URL input */}
              <div>
                <label className="block font-serif text-sm uppercase tracking-wider mb-2">
                  Source URL (Optional)
                </label>
                <input
                  type="url"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  placeholder="https://example.com/article"
                  className="input-newspaper"
                />
              </div>

              {/* Staking info */}
              <div className="bg-highlight p-4 border border-border">
                <div className="flex items-start gap-3">
                  <span className="text-accent text-xl">&#9888;</span>
                  <div>
                    <p className="font-serif text-sm font-semibold">
                      Submission requires 1 $GEN stake
                    </p>
                    <p className="text-xs text-muted mt-1">
                      Your stake is returned if the claim is verified. Earn reputation for accurate submissions.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting || !claim.trim()}
                className="btn-newspaper btn-primary w-full py-4 text-lg"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Analyzing...
                  </span>
                ) : (
                  "Submit for Verification"
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
      <ToastContainer />
    </div>
  );
}
