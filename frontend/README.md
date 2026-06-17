# The Fact Checker - Frontend

Decentralized Fact-Check Protocol frontend built with Next.js, powered by GenLayer AI Validators.

## Features

- Submit claims for AI-powered fact verification
- Real-time verdict display with confidence scores
- Challenge system for disputed verdicts
- Leaderboard and statistics
- Newspaper-style UI design

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_GENLAYER_RPC_URL=https://rpc-bradbury.genlayer.com
NEXT_PUBLIC_GENLAYER_CHAIN_ID=4221
NEXT_PUBLIC_GENLAYER_CHAIN_NAME=GenLayer Bradbury Testnet
NEXT_PUBLIC_GENLAYER_SYMBOL=GEN
NEXT_PUBLIC_GENLAYER_EXPLORER=https://explorer-bradbury.genlayer.com
NEXT_PUBLIC_CONTRACT_ADDRESS=0xc7A35De7D7714cE23a383517D3ed02716A344e3d
```

## Deploy on Vercel

1. Push to GitHub
2. Import repository on [Vercel](https://vercel.com/new)
3. Add environment variables in Vercel dashboard
4. Deploy

## Network

- **Network:** GenLayer Bradbury Testnet
- **Chain ID:** 4221
- **RPC:** https://rpc-bradbury.genlayer.com
- **Explorer:** https://explorer-bradbury.genlayer.com
