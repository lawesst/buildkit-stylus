# BuildKit (Stylus Edition)

> A developer infrastructure playground for Arbitrum using Stylus (Rust) smart contracts as first-class citizens.

BuildKit demonstrates a complete developer workflow for building, deploying, and interacting with Stylus smart contracts on Arbitrum. This project showcases how Rust-compiled WebAssembly contracts integrate seamlessly with existing Ethereum tooling.

## 🎯 Features

- **Stylus NFT Contract**: Minimal ERC-721-like NFT contract written entirely in Rust
- **Next.js Frontend**: Modern web interface for minting NFTs and interacting with Stylus contracts
- **Event Indexer**: Node.js service that indexes on-chain events from Stylus contracts
- **Analytics Dashboard**: Real-time dashboard showing contract metrics and activity
- **Gasless Flow Demo**: Simulated ERC-4337 account abstraction flow
- **Mobile Responsive**: Fully responsive design optimized for all screen sizes

## 🏗️ Architecture

### Monorepo Structure

This monorepo uses pnpm workspaces to manage multiple packages:

```
buildkit-stylus/
├── packages/
│   ├── stylus-contracts/    # Rust → WASM smart contracts
│   ├── frontend/            # Next.js user interface
│   ├── indexer/             # Event indexing service
│   ├── dashboard/           # Analytics visualization
│   └── cli/                 # Developer CLI tool (planned)
├── pnpm-workspace.yaml
└── package.json
```

### Stylus Workflow

Stylus contracts are Rust programs that compile to WebAssembly (WASM) and run on Arbitrum Stylus:

1. **Development**: Write Rust contracts using the `stylus-sdk` crate
2. **Compilation**: Use `cargo-stylus` to compile Rust → WASM
3. **Deployment**: Deploy WASM bytecode to Arbitrum Sepolia via Stylus deployment flow
4. **Interaction**: Contracts appear as standard Ethereum contracts on-chain, accessible via:
   - Standard RPC calls (`eth_call`, `eth_sendTransaction`)
   - `ethers.js` / `viem` in frontend
   - Event indexing via standard Ethereum logs
   - ABI generation from Rust code

### Key Design Decisions

- **Stylus-first**: All core logic in Rust/WebAssembly for performance and developer experience
- **Minimal Solidity**: Only use Solidity for proxy patterns or compatibility if absolutely necessary
- **Separation of Concerns**: Each package has a single responsibility
- **No Auth**: Hackathon MVP focuses on core functionality
- **Arbitrum Sepolia Only**: Single testnet to keep scope manageable

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0
- **Rust** (latest stable)
- **cargo-stylus**: `cargo install cargo-stylus`
- **WASM target**: `rustup target add wasm32-unknown-unknown`

### Installation

```bash
# Clone the repository
git clone https://github.com/lawesst/buildkit-stylus.git
cd buildkit-stylus

# Install dependencies
pnpm install

# Build Stylus contracts
pnpm stylus:build
```

### Deployment

```bash
# Set your private key (for deployment)
cd packages/stylus-contracts
echo "STYLUS_PRIVATE_KEY=0x..." > .env

# Deploy contracts to Arbitrum Sepolia
pnpm stylus:deploy
```

See [packages/stylus-contracts/README.md](./packages/stylus-contracts/README.md) for detailed deployment instructions.

### Running Services

```bash
# Start frontend (http://localhost:3000)
pnpm dev

# Start indexer (http://localhost:3001)
pnpm indexer:start

# Start dashboard (http://localhost:3002)
pnpm dashboard:dev
```

## 📦 Packages

### `stylus-contracts`

Rust smart contracts compiled to WebAssembly for Arbitrum Stylus.

**Features:**
- ERC-721-like NFT contract with `mint()` function
- Event emission using `self.vm().log()` (stylus-sdk 0.10.x)
- Standard EVM-compatible events

**Tech Stack:**
- Rust
- `stylus-sdk` 0.10.0
- `alloy-primitives` & `alloy-sol-types`

**Documentation:** [packages/stylus-contracts/README.md](./packages/stylus-contracts/README.md)

### `frontend`

Next.js application for interacting with Stylus contracts.

**Features:**
- Wallet connection (MetaMask, WalletConnect)
- NFT minting interface
- Event listener for real-time updates
- Gasless flow demo (ERC-4337 simulation)
- Mobile-responsive design

**Tech Stack:**
- Next.js 14 (App Router)
- React 18
- `wagmi` + `viem` for blockchain interactions
- TypeScript

**Documentation:** [packages/frontend/README.md](./packages/frontend/README.md)

### `indexer`

Node.js service that indexes on-chain events from Stylus contracts.

**Features:**
- Listens for `Transfer` events from NFT contract
- Stores events in SQLite or JSON
- REST API for querying indexed events
- Automatic block tracking

**Tech Stack:**
- Node.js
- `ethers.js` v6
- Express.js
- SQLite/JSON storage

**Documentation:** [packages/indexer/README.md](./packages/indexer/README.md)

### `dashboard`

Analytics UI for visualizing contract interactions and metrics.

**Features:**
- Total mints count
- Unique users tracking
- Recent events timeline
- Contract metadata display
- Data flow visualization

**Tech Stack:**
- Next.js 14
- React 18
- TypeScript

**Documentation:** [packages/dashboard/README.md](./packages/dashboard/README.md)

## 🔗 Deployed Contracts

**Network:** Arbitrum Sepolia (Chain ID: 421614)

**NFT Contract:**
- Address: `0x9734bc2be26a92c02f32f3dee397b20aa6fe3edb`
- Deployment Tx: [View on Arbiscan](https://sepolia.arbiscan.io/tx/0xd27b9c4bc2324a44a0de1819f3479c9e1cfc599d9f61f0c1bf6825741be40054)
- Contract: [View on Arbiscan](https://sepolia.arbiscan.io/address/0x9734bc2be26a92c02f32f3dee397b20aa6fe3edb)

## 🛠️ Tech Stack

### Smart Contracts
- **Rust** with `stylus-sdk` 0.10.0
- **WebAssembly** (WASM) compilation target
- **cargo-stylus** for build and deployment

### Frontend
- **Next.js** 14 with App Router
- **React** 18
- **TypeScript**
- **wagmi** + **viem** for blockchain interactions
- **Tailwind CSS** (via Next.js)

### Backend/Infrastructure
- **Node.js** with TypeScript
- **ethers.js** v6 for blockchain interactions
- **Express.js** for REST API
- **SQLite/JSON** for event storage

### Development Tools
- **pnpm** workspaces for monorepo management
- **TypeScript** for type safety
- **ESLint** for code quality

## 📚 Documentation

- [Architecture Overview](./ARCHITECTURE.md)
- [Stylus Contracts](./packages/stylus-contracts/README.md)
- [Frontend Guide](./packages/frontend/README.md)
- [Indexer Documentation](./packages/indexer/README.md)
- [Dashboard Guide](./packages/dashboard/README.md)

## 🔑 Key Concepts

### Stylus Events = Standard EVM Events

Stylus contracts emit events using `self.vm().log()`, which produces **standard EVM logs** that are:
- Identical in format to Solidity events
- Indexable by standard Ethereum tooling
- Queryable via `eth_getLogs` RPC method
- Decodable using standard JSON ABIs

**This means:** You can use all existing Ethereum tooling (ethers.js, The Graph, etc.) without any modifications!

### Calling Stylus Contracts

Stylus contracts are **standard Ethereum contracts** on-chain. You interact with them exactly like Solidity contracts:
- Use standard RPC calls (`eth_call`, `eth_sendTransaction`)
- Use standard ABIs (generated from Rust code)
- No special handling required

## 🧪 Development

### Scripts

```bash
# Build all packages
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint

# Build Stylus contracts
pnpm stylus:build

# Deploy Stylus contracts
pnpm stylus:deploy
```

### Environment Variables

Create `.env` files in respective packages:

**`packages/stylus-contracts/.env`:**
```
STYLUS_PRIVATE_KEY=0x...
```

**`packages/frontend/.env.local`:**
```
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=... (optional)
```

**`packages/indexer/.env`:**
```
RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
NFT_CONTRACT_ADDRESS=0x...
```

## 🤝 Contributing

This is a hackathon MVP focused on clarity and developer experience. Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- [Arbitrum](https://arbitrum.io/) for Stylus infrastructure
- [Stylus SDK](https://github.com/OffchainLabs/stylus-sdk-rs) team
- The Rust and WebAssembly communities

## 🔗 Links

- **Repository**: https://github.com/lawesst/buildkit-stylus
- **Arbitrum Sepolia Explorer**: https://sepolia.arbiscan.io/
- **Stylus Documentation**: https://docs.arbitrum.io/stylus

---

Built with ❤️ for the Arbitrum ecosystem
