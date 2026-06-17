"use client";

import { useState, useEffect } from "react";
import FactCheckClient from "@/lib/contract";

interface MastheadProps {
  onWalletChange?: (address: string | null) => void;
  onProviderChange?: (provider: any) => void;
}

export default function Masthead({ onWalletChange, onProviderChange }: MastheadProps) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [pendingRewards, setPendingRewards] = useState<number>(0);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  useEffect(() => {
    checkConnection();
  }, []);

  useEffect(() => {
    onWalletChange?.(walletAddress);
    if (walletAddress) {
      loadRewards();
    }
  }, [walletAddress, onWalletChange]);

  const checkConnection = async () => {
    if (typeof window.ethereum === "undefined") return;
    try {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        onProviderChange?.(window.ethereum);
      }
    } catch (error) {
      console.error("Failed to check connection:", error);
    }
  };

  const loadRewards = async () => {
    if (!walletAddress) return;
    try {
      const client = new FactCheckClient();
      const profile = await client.getUserProfile(walletAddress);
      setPendingRewards(profile.pending_rewards);
    } catch (error) {
      console.error("Failed to load rewards:", error);
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("Please install MetaMask to use this application");
      return;
    }
    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setWalletAddress(accounts[0]);
      onProviderChange?.(window.ethereum);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setPendingRewards(0);
    onProviderChange?.(null);
    onWalletChange?.(null);
  };

  const switchToBradbury = async () => {
    if (typeof window.ethereum === "undefined") return;
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x107D" }],
      });
    } catch (error: any) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x107D",
                chainName: "GenLayer Bradbury Testnet",
                nativeCurrency: { name: "GEN", symbol: "GEN", decimals: 18 },
                rpcUrls: ["https://rpc-bradbury.genlayer.com"],
                blockExplorerUrls: ["https://explorer-bradbury.genlayer.com"],
              },
            ],
          });
        } catch (addError) {
          console.error("Failed to add chain:", addError);
        }
      }
    }
  };

  const handleWithdraw = async () => {
    if (!walletAddress || pendingRewards <= 0) return;
    setIsWithdrawing(true);
    try {
      const client = new FactCheckClient(walletAddress);
      const result = await client.withdrawRewards(window.ethereum);
      if (result.success) {
        alert(`Successfully withdrew ${pendingRewards.toFixed(4)} GEN!`);
        setPendingRewards(0);
      } else {
        alert(`Withdrawal failed: ${result.error}`);
      }
    } catch (error) {
      console.error("Failed to withdraw:", error);
      alert("Withdrawal failed");
    } finally {
      setIsWithdrawing(false);
    }
  };

  const formatDate = () => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date().toLocaleDateString("en-US", options);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="border-b-2 border-border bg-paper">
      {/* Top bar with date and wallet */}
      <div className="border-b border-border py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <span className="font-body text-muted">{formatDate()}</span>
          <span className="font-body text-muted">GenLayer Bradbury Testnet</span>
          <div>
            {walletAddress ? (
              <div className="flex items-center gap-3">
                <a
                  href="https://testnet-faucet.genlayer.foundation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-highlight px-2 py-1 hover:bg-accent hover:text-paper transition-colors"
                >
                  Get GEN
                </a>
                <button
                  onClick={switchToBradbury}
                  className="text-xs bg-highlight px-2 py-1 hover:bg-border hover:text-paper transition-colors"
                >
                  Switch to Bradbury
                </button>

                {/* Rewards section */}
                {pendingRewards > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 font-semibold">
                      {pendingRewards.toFixed(4)} GEN
                    </span>
                    <button
                      onClick={handleWithdraw}
                      disabled={isWithdrawing}
                      className="text-xs bg-green-700 text-white px-2 py-1 hover:bg-green-800 transition-colors disabled:opacity-50"
                    >
                      {isWithdrawing ? "Withdrawing..." : "Withdraw"}
                    </button>
                  </div>
                )}

                <span className="font-mono text-xs bg-highlight px-2 py-1">
                  {formatAddress(walletAddress)}
                </span>
                <button
                  onClick={disconnectWallet}
                  className="text-xs text-muted hover:text-accent transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="btn-newspaper text-xs py-1 px-3"
              >
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main masthead */}
      <div className="py-8 px-4 text-center">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px bg-border flex-1 max-w-20"></div>
            <span className="text-xs font-serif tracking-widest text-muted uppercase">
              Est. 2026
            </span>
            <div className="h-px bg-border flex-1 max-w-20"></div>
          </div>
          <h1 className="masthead text-5xl md:text-7xl lg:text-8xl tracking-wide">
            The Fact Checker
          </h1>
          <p className="font-serif text-lg md:text-xl mt-3 text-muted italic">
            Decentralized Truth Protocol — Powered by GenLayer AI Validators
          </p>
          <div className="mt-6 rule-double"></div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="border-t border-border py-4 px-4 bg-white">
        <div className="max-w-7xl mx-auto flex justify-center gap-4">
          <a
            href="/"
            className="px-6 py-3 font-serif text-base font-semibold uppercase tracking-wider border border-border hover:bg-ink hover:text-paper transition-all"
          >
            Home
          </a>
          <a
            href="/submit"
            className="px-6 py-3 font-serif text-base font-semibold uppercase tracking-wider bg-accent text-paper border border-accent hover:bg-red-900 transition-all"
          >
            Submit Claim
          </a>
          <a
            href="/explorer"
            className="px-6 py-3 font-serif text-base font-semibold uppercase tracking-wider border border-border hover:bg-ink hover:text-paper transition-all"
          >
            Explorer
          </a>
          <a
            href="/explorer#leaderboard"
            className="px-6 py-3 font-serif text-base font-semibold uppercase tracking-wider border border-border hover:bg-ink hover:text-paper transition-all"
          >
            Leaderboard
          </a>
        </div>
      </nav>
    </header>
  );
}
