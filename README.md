# BuildKit Stylus - Standalone Frontend

This is the standalone production-ready frontend for BuildKit Stylus, deployed on Vercel.

## 🚀 Production Deployment

- **Live URL**: https://buildkit-2yktv4rul-mtuneccesarys-projects.vercel.app
- **Dashboard**: https://buildkit-2yktv4rul-mtuneccesarys-projects.vercel.app/dashboard
- **Gasless Flow**: https://buildkit-2yktv4rul-mtuneccesarys-projects.vercel.app/gasless

## ✨ Features

### ✅ Integrated Dashboard
- **No external indexer needed** - queries blockchain directly via API routes
- Real-time analytics: Total mints, unique users, recent events
- Contract metadata and statistics
- All on the same Vercel deployment

### ✅ Blockchain API Routes
- `/api/events` - Query Transfer events from Arbitrum Sepolia
- `/api/stats` - Calculate real-time statistics
- `/api/health` - Health check endpoint

### ✅ NFT Minting
- Connect wallet (MetaMask, WalletConnect)
- Mint NFTs from Stylus contract
- View transaction history
- Real-time event listening

### ✅ Gasless Flow Demo
- Simulated ERC-4337 gasless transaction flow
- Educational UI explaining Account Abstraction

## 🏗️ Architecture

```
Frontend (Next.js)
├── Main App (/)
│   ├── Wallet Connection
│   ├── Contract Info
│   ├── Mint NFT
│   └── Event Listener
├── Dashboard (/dashboard)
│   ├── Stats Cards
│   ├── Recent Events
│   ├── Contract Metadata
│   └── Data Flow Diagram
├── Gasless Flow (/gasless)
│   └── Simulated AA Flow
└── API Routes
    ├── /api/events (queries blockchain)
    ├── /api/stats (calculates stats)
    └── /api/health (health check)
```

## 🔧 Setup

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## 📦 Environment Variables

Set in Vercel dashboard:

- `NEXT_PUBLIC_NFT_CONTRACT_ADDRESS` - NFT contract address (0x9734bc2be26a92c02f32f3dee397b20aa6fe3edb)
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` - (Optional) WalletConnect project ID

## 🎯 Key Improvements

1. **No External Dependencies**: Dashboard queries blockchain directly, no separate indexer service needed
2. **Single Deployment**: Everything on one Vercel project
3. **Production Ready**: Proper error handling, loading states, responsive design
4. **Fixed Issues**: 
   - Contract address validation (trim whitespace)
   - Mint button functionality
   - Indexer connection issues

## 📝 Contract Details

- **Network**: Arbitrum Sepolia
- **Chain ID**: 421614
- **Contract Address**: 0x9734bc2be26a92c02f32f3dee397b20aa6fe3edb
- **Contract Type**: Stylus (Rust → WASM)
- **RPC**: https://sepolia-rollup.arbitrum.io/rpc

## 🔗 Links

- **GitHub**: https://github.com/lawesst/buildkit-stylus
- **Vercel Dashboard**: https://vercel.com/mtuneccesarys-projects/buildkit-app
- **Arbiscan**: https://sepolia.arbiscan.io/address/0x9734bc2be26a92c02f32f3dee397b20aa6fe3edb

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Blockchain**: Viem, Wagmi
- **Styling**: CSS Modules, Custom CSS Variables
- **Deployment**: Vercel
- **Blockchain Network**: Arbitrum Sepolia
