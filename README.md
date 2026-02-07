# BuildKit Stylus

Developer infrastructure playground for Arbitrum using Stylus (Rust) smart contracts as first-class citizens.

## 🎯 Overview

BuildKit Stylus is a hackathon MVP demonstrating how to build, deploy, and interact with Stylus smart contracts written in Rust. The project showcases that Stylus contracts work seamlessly with existing Ethereum tooling - events, ABIs, and RPC calls are identical to Solidity contracts.

## 📦 Project Structure

```
buildkit-stylus/
├── packages/
│   ├── stylus-contracts/    # Rust smart contracts (ERC-721-like NFT)
│   ├── frontend/            # Next.js frontend with wallet integration
│   ├── dashboard/           # Analytics dashboard (integrated in frontend)
│   ├── indexer/             # Event indexer (Node.js + ethers.js)
│   └── cli/                 # CLI tools
```

## ✨ Features

### Stylus Contracts
- **ERC-721-like NFT contract** written entirely in Rust
- Compiled to WASM for Arbitrum Stylus
- Emits standard EVM events (compatible with all tooling)
- Deployed on Arbitrum Sepolia

### Frontend
- Wallet connection (MetaMask, WalletConnect)
- NFT minting interface
- Real-time event listening
- Gasless transaction flow demo (ERC-4337 simulation)

### Analytics Dashboard
- Real-time statistics (total mints, unique users)
- Recent events display
- Contract metadata
- Queries blockchain directly via API routes

### Indexer
- Listens to Stylus contract events
- Stores events in SQLite/JSON
- REST API for querying events
- Works identically to Solidity contract indexing

## 🛠️ Tech Stack

- **Smart Contracts**: Rust (Stylus SDK 0.10.x)
- **Frontend**: Next.js 14, Viem, Wagmi
- **Indexer**: Node.js, ethers.js
- **Deployment**: Vercel (frontend), Arbitrum Sepolia (contracts)

## 🚀 Quick Start

### Prerequisites
- Rust 1.93.0+
- Node.js 18+
- pnpm 8+

### Deploy Contracts
```bash
cd packages/stylus-contracts
cargo install cargo-stylus
cargo stylus build
cargo stylus deploy --network sepolia
```

### Run Frontend
```bash
cd packages/frontend
pnpm install
pnpm dev
```

### Run Indexer
```bash
cd packages/indexer
pnpm install
pnpm dev
```

## 📝 Contract Details

- **Network**: Arbitrum Sepolia
- **Chain ID**: 421614
- **Contract Address**: 0x9734bc2be26a92c02f32f3dee397b20aa6fe3edb
- **Contract Type**: Stylus (Rust → WASM)

## 🔑 Key Concepts

### Stylus vs Solidity
- Stylus contracts are written in Rust and compiled to WASM
- They emit **standard EVM events** - no special handling needed
- ABIs are standard JSON format
- All existing Ethereum tooling works without modifications

### Event Indexing
Stylus events are indexed exactly like Solidity events:
- Use `eth_getLogs` RPC calls
- Parse using standard ABI
- Store in any database
- No differences in the indexing process

## 📚 Documentation

- [Stylus Contracts README](../packages/stylus-contracts/README.md)
- [Frontend README](../packages/frontend/README.md)
- [Indexer README](../packages/indexer/README.md)

## 🔗 Links

- **GitHub**: https://github.com/lawesst/buildkit-stylus
- **Arbiscan**: https://sepolia.arbiscan.io/address/0x9734bc2be26a92c02f32f3dee397b20aa6fe3edb
