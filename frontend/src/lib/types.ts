export interface Claim {
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

export interface Challenge {
  id: string;
  claim_id: string;
  challenger: string;
  reason: string;
  old_verdict: string;
  old_confidence: number;
  old_reasoning: string;
  new_verdict: string;
  new_confidence: number;
  new_reasoning: string;
  is_successful: boolean;
  staked_amount: number;
}

export interface UserProfile {
  address: string;
  submissions: number;
  correct_submissions: number;
  challenges: number;
  successful_challenges: number;
  reputation: number;
  total_staked: number;
  pending_rewards: number;
}

export interface LeaderboardEntry {
  address: string;
  reputation: number;
  submissions: number;
  correct_submissions: number;
}

export interface Stats {
  total_claims: number;
  total_challenges: number;
  total_staked: number;
  verified_claims: number;
}

export interface TransactionResult {
  success: boolean;
  txHash?: string;
  error?: string;
}
