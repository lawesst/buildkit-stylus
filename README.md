# BuildKit Stylus - Frontend

Production-ready Next.js frontend for BuildKit Stylus, deployed on Vercel.

## 🚀 Live URLs

- **Main App**: https://buildkit-2yktv4rul-mtuneccesarys-projects.vercel.app
- **Dashboard**: https://buildkit-2yktv4rul-mtuneccesarys-projects.vercel.app/dashboard
- **Gasless Flow**: https://buildkit-2yktv4rul-mtuneccesarys-projects.vercel.app/gasless

## ✨ Features

- **Wallet Connection** - MetaMask, WalletConnect support
- **NFT Minting** - Mint NFTs from Stylus contract
- **Analytics Dashboard** - Real-time stats and events (queries blockchain directly)
- **Gasless Flow Demo** - Simulated ERC-4337 flow

## 🔧 Setup

```bash
pnpm install
pnpm dev
```

## 📦 Environment Variables

- `NEXT_PUBLIC_NFT_CONTRACT_ADDRESS` - NFT contract address
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` - (Optional) WalletConnect project ID

## 📝 Contract

- **Network**: Arbitrum Sepolia (Chain ID: 421614)
- **Address**: 0x9734bc2be26a92c02f32f3dee397b20aa6fe3edb
- **Type**: Stylus (Rust → WASM)

## 🛠️ Tech Stack

- Next.js 14 (App Router)
- Viem + Wagmi
- Vercel Deployment
