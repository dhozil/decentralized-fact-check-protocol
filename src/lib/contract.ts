import { createClient } from "genlayer-js";
import { testnetBradbury } from "genlayer-js/chains";
import type { Claim, Challenge, UserProfile, LeaderboardEntry, Stats, TransactionResult } from "./types";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}` || "0x00E4b2FA5d63D03462a1857F2D7D4B8e1452c6e3";

const reader = createClient({ chain: testnetBradbury });

// Rate limiting
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 5000; // 5 seconds between requests

async function rateLimitedCall<T>(fn: () => Promise<T>): Promise<T> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest));
  }
  lastRequestTime = Date.now();
  try {
    return await fn();
  } catch (error: any) {
    if (error?.message?.includes("rate limit") || error?.message?.includes("LimitExceeded")) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      lastRequestTime = Date.now();
      return fn();
    }
    throw error;
  }
}

function weiToGen(wei: number | bigint): number {
  return Number(wei) / 1e18;
}

function parseContractData(data: any): any {
  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch {
      return data;
    }
  }
  if (data instanceof Map) {
    return Object.fromEntries(data.entries());
  }
  return data;
}

class FactCheckClient {
  private address?: string;

  constructor(address?: string) {
    this.address = address;
  }

  updateAccount(address: string): void {
    this.address = address;
  }

  private async getWriteClient(provider: any): Promise<any> {
    // Switch network first using provider directly
    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x107D" }],
      });
    } catch (switchError: any) {
      const code = switchError?.code || switchError?.error?.code;
      if (code === 4902) {
        await provider.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: "0x107D",
            chainName: "GenLayer Bradbury Testnet",
            nativeCurrency: { name: "GEN", symbol: "GEN", decimals: 18 },
            rpcUrls: ["https://rpc-bradbury.genlayer.com"],
            blockExplorerUrls: ["https://explorer-bradbury.genlayer.com"],
          }],
        });
      }
    }
    return createClient({
      chain: testnetBradbury,
      account: this.address as `0x${string}`,
      provider,
    });
  }

  async getClaims(): Promise<Claim[]> {
    try {
      const result: any = await rateLimitedCall(() =>
        reader.readContract({
          address: CONTRACT_ADDRESS,
          functionName: "get_claims",
          args: [],
        })
      );
      const parsed = parseContractData(result);
      if (typeof parsed === "string") {
        const claims = JSON.parse(parsed);
        return Array.isArray(claims) ? claims : [];
      }
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return [];
    } catch (error) {
      console.error("Failed to fetch claims:", error);
      return [];
    }
  }

  async getClaim(claimId: string): Promise<Claim | null> {
    try {
      const result: any = await rateLimitedCall(() =>
        reader.readContract({
          address: CONTRACT_ADDRESS,
          functionName: "get_claim",
          args: [claimId],
        })
      );
      const parsed = parseContractData(result);
      if (typeof parsed === "string") {
        return JSON.parse(parsed) as Claim;
      }
      return parsed as Claim;
    } catch (error) {
      console.error("Failed to fetch claim:", error);
      return null;
    }
  }

  async getClaimChallenges(claimId: string): Promise<Challenge[]> {
    try {
      const result: any = await rateLimitedCall(() =>
        reader.readContract({
          address: CONTRACT_ADDRESS,
          functionName: "get_claim_challenges",
          args: [claimId],
        })
      );
      const parsed = parseContractData(result);
      if (typeof parsed === "string") {
        const challenges = JSON.parse(parsed);
        return Array.isArray(challenges) ? challenges : [];
      }
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return [];
    } catch (error) {
      console.error("Failed to fetch challenges:", error);
      return [];
    }
  }

  async getUserProfile(address: string): Promise<UserProfile> {
    try {
      const result: any = await rateLimitedCall(() =>
        reader.readContract({
          address: CONTRACT_ADDRESS,
          functionName: "get_user_profile",
          args: [address],
        })
      );
      const parsed = parseContractData(result);
      const profile = typeof parsed === "string" ? JSON.parse(parsed) : parsed;
      return {
        address: profile.address || address,
        submissions: Number(profile.submissions) || 0,
        correct_submissions: Number(profile.correct_submissions) || 0,
        challenges: Number(profile.challenges) || 0,
        successful_challenges: Number(profile.successful_challenges) || 0,
        reputation: Number(profile.reputation) || 0,
        total_staked: weiToGen(Number(profile.total_staked) || 0),
        pending_rewards: weiToGen(Number(profile.pending_rewards) || 0),
      };
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      return {
        address,
        submissions: 0,
        correct_submissions: 0,
        challenges: 0,
        successful_challenges: 0,
        reputation: 0,
        total_staked: 0,
        pending_rewards: 0,
      };
    }
  }

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    try {
      const result: any = await rateLimitedCall(() =>
        reader.readContract({
          address: CONTRACT_ADDRESS,
          functionName: "get_leaderboard",
          args: [],
        })
      );
      const parsed = parseContractData(result);
      const data = typeof parsed === "string" ? JSON.parse(parsed) : parsed;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
      return [];
    }
  }

  async getStats(): Promise<Stats> {
    try {
      const result: any = await rateLimitedCall(() =>
        reader.readContract({
          address: CONTRACT_ADDRESS,
          functionName: "get_stats",
          args: [],
        })
      );
      const parsed = parseContractData(result);
      const stats = typeof parsed === "string" ? JSON.parse(parsed) : parsed;
      return {
        total_claims: Number(stats.total_claims) || 0,
        total_challenges: Number(stats.total_challenges) || 0,
        total_staked: weiToGen(Number(stats.total_staked) || 0),
        verified_claims: Number(stats.verified_claims) || 0,
      };
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      return {
        total_claims: 0,
        total_challenges: 0,
        total_staked: 0,
        verified_claims: 0,
      };
    }
  }

  async submitClaim(claimText: string, sourceUrl: string, provider?: any): Promise<TransactionResult> {
    if (!provider) {
      return { success: false, error: "Wallet provider required" };
    }
    try {
      const client = await this.getWriteClient(provider);
      const txHash = await client.writeContract({
        address: CONTRACT_ADDRESS,
        functionName: "submit_claim",
        args: [claimText, sourceUrl],
        value: BigInt("1000000000000000000"),
      });
      await client.waitForTransactionReceipt({
        hash: txHash,
        retries: 30,
        interval: 60000,
      });
      return { success: true, txHash: txHash as string };
    } catch (error: any) {
      console.error("Failed to submit claim:", error);
      const msg = error?.message || error?.shortMessage || error?.details || JSON.stringify(error) || "Unknown error";
      return { success: false, error: msg };
    }
  }

  async challengeClaim(claimId: string, reason: string, provider?: any): Promise<TransactionResult> {
    if (!provider) {
      return { success: false, error: "Wallet provider required" };
    }
    try {
      const client = await this.getWriteClient(provider);
      const txHash = await client.writeContract({
        address: CONTRACT_ADDRESS,
        functionName: "challenge_claim",
        args: [claimId, reason],
        value: BigInt("5000000000000000000"),
      });
      await client.waitForTransactionReceipt({
        hash: txHash,
        retries: 30,
        interval: 60000,
      });
      return { success: true, txHash: txHash as string };
    } catch (error: any) {
      console.error("Failed to challenge claim:", error);
      const msg = error?.message || error?.shortMessage || error?.details || JSON.stringify(error) || "Unknown error";
      return { success: false, error: msg };
    }
  }

  async withdrawRewards(provider?: any): Promise<TransactionResult> {
    if (!provider) {
      return { success: false, error: "Wallet provider required" };
    }
    try {
      const client = await this.getWriteClient(provider);
      const txHash = await client.writeContract({
        address: CONTRACT_ADDRESS,
        functionName: "withdraw_rewards",
        args: [],
      });
      await client.waitForTransactionReceipt({
        hash: txHash,
        retries: 30,
        interval: 5000,
      });
      return { success: true, txHash: txHash as string };
    } catch (error: any) {
      console.error("Failed to withdraw rewards:", error);
      const msg = error?.message || error?.shortMessage || error?.details || JSON.stringify(error) || "Unknown error";
      return { success: false, error: msg };
    }
  }
}

export default FactCheckClient;
