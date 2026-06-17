# Deployment Guide

## Contract Information

| Config | Value |
|--------|-------|
| **Contract Address** | `0x00E4b2FA5d63D03462a1857F2D7D4B8e1452c6e3` |
| **Network** | GenLayer Bradbury Testnet |
| **Chain ID** | 4221 |
| **RPC URL** | `https://rpc-bradbury.genlayer.com` |
| **Explorer** | `https://explorer-bradbury.genlayer.com/address/0x00E4b2FA5d63D03462a1857F2D7D4B8e1452c6e3` |

## Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_GENLAYER_RPC_URL=https://rpc-bradbury.genlayer.com
NEXT_PUBLIC_GENLAYER_CHAIN_ID=4221
NEXT_PUBLIC_GENLAYER_CHAIN_NAME=GenLayer Bradbury Testnet
NEXT_PUBLIC_GENLAYER_SYMBOL=GEN
NEXT_PUBLIC_GENLAYER_EXPLORER=https://explorer-bradbury.genlayer.com
NEXT_PUBLIC_CONTRACT_ADDRESS=0x00E4b2FA5d63D03462a1857F2D7D4B8e1452c6e3
```

### 3. Start Development Server

```bash
npm run dev
```

Open http://localhost:3000

## Deploy New Contract

If you need to deploy a new contract:

### 1. Install GenLayer CLI

```bash
npm install -g genlayer
```

### 2. Configure Network

```bash
genlayer network
# Select "testnetBradbury"
```

### 3. Fund Wallet

Get testnet GEN from faucet: `testnet-faucet.genlayer.foundation`

### 4. Deploy Contract

```bash
genlayer deploy --contract contracts/fact_check.py
```

### 5. Update Environment

Update `NEXT_PUBLIC_CONTRACT_ADDRESS` in `.env.local` with new address.

## Verify Contract

Check contract on explorer:
```
https://explorer-bradbury.genlayer.com/address/0xc7A35De7D7714cE23a383517D3ed02716A344e3d
```

## Build for Production

```bash
npm run build
npm start
```

## Deploy to Cloudflare Pages

1. Push to GitHub
2. Connect repo to Cloudflare Pages
3. Set build settings:
   - Framework: Next.js
   - Build command: `npm run build`
   - Build output: `.next`
4. Add environment variables

## Troubleshooting

### "Method not found: gen_call"
- Contract tidak ada di address tersebut
- RPC URL salah
- Chain ID tidak match

### "Transaction reverted"
- Insufficient GEN balance
- Stake kurang dari minimum
- Contract execution error

### "Failed to fetch claims"
- RPC endpoint down
- Network connectivity issue
- Contract not deployed

## References

- [VERIDIAN Project](https://github.com/YoneCode/VERIDIAN) - Reference implementation
- [GenLayer Documentation](https://docs.genlayer.com)
- [GenLayer Faucet](https://testnet-faucet.genlayer.foundation)
