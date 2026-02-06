# Stylus Analytics Dashboard

Real-time analytics dashboard for Stylus contracts on Arbitrum Sepolia.

## 🎯 Data Flow: Stylus → Indexer → Dashboard

### 1. Stylus Contract (Rust/WASM)
- Contract emits events using `evm::log()` (e.g., `Transfer` events)
- Events are stored in **standard EVM logs** on Arbitrum Sepolia
- Format is **identical to Solidity events** - no special handling needed

### 2. Indexer (Node.js + ethers.js)
- Listens to blockchain using standard Ethereum RPC methods:
  - `eth_getLogs` - Query event logs
  - `eth_blockNumber` - Track block progression
- Queries events from Stylus contracts (same as Solidity contracts)
- Parses events using contract ABI (standard JSON ABI format)
- Stores events in SQLite/JSON database
- Exposes REST API at `http://localhost:3001`

### 3. Dashboard (Next.js)
- Fetches data from indexer API
- Displays analytics: total mints, unique users, recent events
- Shows contract metadata and statistics

## 🔑 Key Point

**The entire data flow is identical to Solidity contracts.**

Stylus events are standard EVM events, so they can be indexed and displayed using the same tools and patterns. The contract being compiled from Rust instead of Solidity is completely transparent to the indexer and dashboard.

## 🚀 Quick Start

### Prerequisites

- Indexer running on port 3001 (see `/packages/indexer`)

### Run

```bash
cd packages/dashboard
pnpm install
pnpm dev
```

Dashboard will be available at `http://localhost:3002`

## 📊 Features

- **Total Mints**: Count of Transfer events (NFT mints)
- **Unique Users**: Unique addresses that received NFTs
- **Total Events**: All events indexed from contracts
- **Last Block**: Most recent block indexed
- **Recent Events**: Latest events with full details
- **Contract Metadata**: Information about deployed contracts

## 🔌 API Integration

The dashboard fetches data from the indexer API:

- `GET /stats` - Get statistics
- `GET /events` - Get events with filters
- `GET /events/contract/:contractName` - Get events by contract

## 📝 Configuration

Set the indexer API URL via environment variable:

```env
NEXT_PUBLIC_INDEXER_API=http://localhost:3001
```

Default: `http://localhost:3001`

## 🎓 Why Stylus = Solidity for Indexing

1. **Same Event Format**: Stylus `evm::log()` produces identical logs to Solidity `emit`
2. **Same ABI Format**: Standard JSON ABIs, same parsing logic
3. **Same RPC Methods**: Uses `eth_getLogs`, `eth_blockNumber`, etc.
4. **Same Tooling**: Works with ethers.js, viem, web3.js without modifications
5. **Same Event Logs**: Stored in the same EVM log format on-chain

The dashboard treats Stylus contract events exactly like Solidity contract events.
