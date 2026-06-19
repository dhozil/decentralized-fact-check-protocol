# Decentralized Fact-Check Protocol

## Project Notes

### Executive Summary

The Decentralized Fact-Check Protocol is an AI-powered fact verification platform built on GenLayer's Intelligent Contract infrastructure. The platform enables anyone to submit claims for verification, where multiple AI validators independently analyze evidence and reach consensus on verdicts—creating an immutable record of truth on the blockchain.

### The Problem

In today's digital age, misinformation spreads faster than ever. Traditional fact-checking is centralized, slow, and often biased. Users have no way to independently verify claims without relying on trusted third parties. The Decentralized Fact-Check Protocol solves this by leveraging GenLayer's Optimistic Democracy consensus mechanism to create a trustless, transparent, and decentralized fact-checking system.

### How It Works

The protocol operates through three main components: claim submission, AI analysis, and consensus verification.

**Claim Submission:** Users submit claims they want verified along with a source URL. A 1 GEN stake is required to prevent spam and ensure commitment to the verification process. The claim is stored on-chain with all metadata including the submitter's address and timestamp.

**AI Analysis:** When a claim is submitted, the GenLayer intelligent contract automatically initiates an AI analysis process. The contract uses `gl.nondet.web.get()` to fetch evidence from the provided source URL and additional sources. The AI then evaluates the claim against the evidence using a large language model, producing a verdict (TRUE, FALSE, or UNVERIFIABLE) with a confidence score and reasoning.

**Consensus Verification:** GenLayer's Optimistic Democracy ensures that multiple validators independently analyze the same claim. The leader validator proposes a verdict, and other validators verify by running their own analysis. Validators agree if the verdict matches and confidence scores are within a 30-point tolerance. This consensus mechanism prevents manipulation and ensures accuracy.

### Challenge System

The protocol includes a robust challenge system that allows anyone to dispute a verdict. If a user believes a verdict is incorrect, they can challenge it by staking 5 GEN. The claim is re-analyzed by AI validators, and if the verdict changes, the challenger receives a 2x reward (10 GEN) and reputation points. This creates an economic incentive for accurate fact-checking and continuous verification.

### Reputation System

Every user has an on-chain reputation score that tracks their contribution to the protocol. Reputation increases when submitting claims that receive definitive verdicts (TRUE or FALSE) and when successfully challenging incorrect verdicts. The leaderboard showcases top fact-checkers, creating a competitive yet collaborative environment for truth-seeking.

### Technical Implementation

The protocol is built using GenLayer's Intelligent Contract framework with Python-based smart contracts. The contract utilizes several key GenLayer features:

- **TreeMap Storage:** All claims, user profiles, and challenge records are stored as JSON strings in TreeMap structures for efficient retrieval and management.
- **AI Consensus:** The `gl.vm.run_nondet_unsafe()` function enables leader-validator consensus with configurable tolerance for agreement.
- **Web Scraping:** `gl.nondet.web.get()` allows contracts to fetch real-time web evidence for claim verification.
- **Prompt Engineering:** Structured prompts with JSON response formats ensure consistent and parseable AI outputs.

The frontend is built with Next.js 16, React 19, TypeScript, and Tailwind CSS, featuring a newspaper-inspired design that evokes trust and authority. The UI includes three main pages: Home (landing), Submit (claim submission), and Explorer (verdict browsing).

### Tokenomics

The protocol operates on a simple yet effective tokenomics model:
- Submit Claim: 1 GEN stake (returned upon verification)
- Challenge Verdict: 5 GEN stake
- Successful Challenge: 10 GEN reward (2x stake)
- Failed Challenge: Stake burned

This model ensures that all participants have skin in the game while creating sustainable economic incentives for accurate fact-checking.

### Network Configuration

- **Network:** GenLayer Bradbury Testnet
- **Chain ID:** 4221
- **RPC:** https://rpc-bradbury.genlayer.com
- **Explorer:** https://explorer-bradbury.genlayer.com
- **Contract:** 0x00E4b2FA5d63D03462a1857F2D7D4B8e1452c6e3

### Future Vision

The Decentralized Fact-Check Protocol aims to become the standard for decentralized truth verification. Future developments include:
- Integration with news APIs for real-time fact-checking
- Browser extensions for on-the-go verification
- Mobile applications for broader accessibility
- Cross-chain deployment for wider reach
- Governance tokens for decentralized protocol management

### Conclusion

The Decentralized Fact-Check Protocol demonstrates the power of GenLayer's Intelligent Contract platform in solving real-world problems. By combining AI analysis with blockchain consensus, we create a trustless system where truth prevails over misinformation. The protocol is open-source, community-driven, and designed for scalability—making it a cornerstone for decentralized truth verification in the digital age.

---

**Built with ❤️ on GenLayer**

*Repository: https://github.com/dhozil/decentralized-fact-check-protocol*
