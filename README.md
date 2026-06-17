<div align="center">

# ⛓️ Decentralized Fact-Check Protocol

### AI-Powered Truth Verification on GenLayer

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![GenLayer](https://img.shields.io/badge/GenLayer-Bradbury-blue)](https://genlayer.com)

[Live Demo](https://your-vercel-url.vercel.app) • [Contract](https://explorer-bradbury.genlayer.com/address/0x00E4b2FA5d63D03462a1857F2D7D4B8e1452c6e3) • [Documentation](#getting-started)

</div>

---

## Overview

A decentralized fact-checking protocol where anyone can submit claims for AI-powered verification. Multiple AI validators independently analyze evidence and reach consensus on verdicts — creating an immutable record of truth on the blockchain.

### How It Works

```
┌──────────────────────────────────────────────────────────────┐
│                      USER INTERFACE                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │    Home     │  │   Submit    │  │  Explorer   │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
└──────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                  GENLAYER SMART CONTRACT                     │
│                                                              │
│  submit_claim(claim, source) ──► AI Analysis ──► Verdict     │
│                                                              │
│  Challenge System: Anyone can dispute with 5 $GEN stake      │
└──────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                   VALIDATOR NETWORK                          │
│                                                              │
│  Leader Proposal ──► Vote ──► Consensus ──► Final Verdict    │
│                                                              │
│  • TRUE: Claim verified by evidence                          │
│  • FALSE: Claim contradicted by evidence                     │
│  • UNVERIFIABLE: Insufficient evidence                       │
└──────────────────────────────────────────────────────────────┘
```

## Features

| Feature | Description |
|---------|-------------|
| **Submit Claims** | Submit any statement for AI verification with 1 $GEN stake |
| **AI Consensus** | Multiple validators independently analyze and reach consensus |
| **Challenge System** | Dispute verdicts with 5 $GEN stake; successful challenges earn 2x reward |
| **Reputation System** | Track accuracy and build reputation as a fact-checker |
| **Leaderboard** | Top fact-checkers ranked by reputation |
| **Withdraw Rewards** | Collect earned rewards from successful challenges |

## Network Configuration

| Parameter | Value |
|-----------|-------|
| **Network** | GenLayer Bradbury Testnet |
| **Chain ID** | `4221` |
| **RPC URL** | `https://rpc-bradbury.genlayer.com` |
| **Explorer** | `https://explorer-bradbury.genlayer.com` |
| **Contract** | [`0x00E4b2FA5d63D03462a1857F2D7D4B8e1452c6e3`](https://explorer-bradbury.genlayer.com/address/0x00E4b2FA5d63D03462a1857F2D7D4B8e1452c6e3) |
| **Faucet** | `https://testnet-faucet.genlayer.foundation` |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [MetaMask](https://metamask.io/) wallet
- GEN tokens from [testnet faucet](https://testnet-faucet.genlayer.foundation)

### Installation

```bash
# Clone repository
git clone https://github.com/dhozil/decentralized-fact-check-protocol.git
cd decentralized-fact-check-protocol

# Install dependencies
cd frontend
npm install

# Start development server
npm run dev
```

### Environment Variables

Create `.env.local` in the `frontend` directory:

```env
NEXT_PUBLIC_GENLAYER_RPC_URL=https://rpc-bradbury.genlayer.com
NEXT_PUBLIC_GENLAYER_CHAIN_ID=4221
NEXT_PUBLIC_GENLAYER_CHAIN_NAME=GenLayer Bradbury Testnet
NEXT_PUBLIC_GENLAYER_SYMBOL=GEN
NEXT_PUBLIC_GENLAYER_EXPLORER=https://explorer-bradbury.genlayer.com
NEXT_PUBLIC_CONTRACT_ADDRESS=0x00E4b2FA5d63D03462a1857F2D7D4B8e1452c6e3
```

### Deploy Contract

```bash
# Install GenLayer CLI
npm install -g genlayer

# Configure network
genlayer network

# Deploy
genlayer deploy --contract contracts/fact_check.py
```

## Smart Contract API

### Write Methods

| Method | Parameters | Stake | Description |
|--------|-----------|-------|-------------|
| `submit_claim` | `claim_text`, `source_url` | 1 GEN | Submit a claim for verification |
| `challenge_claim` | `claim_id`, `reason` | 5 GEN | Challenge an existing verdict |
| `withdraw_rewards` | - | - | Withdraw pending rewards |

### Read Methods

| Method | Parameters | Returns |
|--------|-----------|---------|
| `get_claims` | - | All claims |
| `get_claim` | `claim_id` | Specific claim |
| `get_claim_challenges` | `claim_id` | Challenges for a claim |
| `get_user_profile` | `address` | User stats |
| `get_leaderboard` | - | Top 10 fact-checkers |
| `get_stats` | - | Protocol statistics |

## Tokenomics

| Action | Stake | Reward | Result |
|--------|-------|--------|--------|
| Submit Claim | 1 GEN | +1 reputation | AI analyzes and stores verdict |
| Challenge (Success) | 5 GEN | 10 GEN (2x) | Verdict updated, +2 reputation |
| Challenge (Failed) | 5 GEN | 0 GEN | Stake burned |
| Withdraw | - | Pending rewards | Transfer to wallet |

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS |
| **Smart Contract** | Python (GenLayer Intelligent Contracts) |
| **Blockchain** | GenLayer Bradbury Testnet |
| **AI Engine** | GenVM with Optimistic Democracy consensus |
| **Wallet** | MetaMask + genlayer-js SDK |

## Project Structure

```
decentralized-fact-check-protocol/
├── contracts/
│   └── fact_check.py          # GenLayer smart contract
├── deploy/
│   └── deployScript.ts        # Deployment script
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx       # Home page
│   │   │   ├── submit/        # Submit claim page
│   │   │   └── explorer/      # Explorer page
│   │   ├── components/        # React components
│   │   └── lib/               # Utilities & contract client
│   ├── public/                # Static assets
│   └── package.json
├── README.md
└── DEPLOYMENT.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Acknowledgments

- [GenLayer](https://genlayer.com) for the intelligent contract platform
- [VERIDIAN](https://github.com/YoneCode/VERIDIAN) for reference implementation patterns
- All contributors and testers on Bradbury Testnet

---

<div align="center">

**Built with ❤️ on GenLayer**

[Report Bug](https://github.com/dhozil/decentralized-fact-check-protocol/issues) • [Request Feature](https://github.com/dhozil/decentralized-fact-check-protocol/issues)

</div>
