# BuildKit (Stylus Edition)

A developer infrastructure playground for Arbitrum using Stylus (Rust) smart contracts as first-class citizens.

## Architecture

### Monorepo Structure

This monorepo uses pnpm workspaces to manage multiple packages:

- **stylus-contracts**: Rust smart contracts compiled to WASM for Arbitrum Stylus
- **frontend**: Next.js application for interacting with Stylus contracts
- **indexer**: Node.js service that indexes on-chain events from Stylus contracts
- **dashboard**: Analytics UI for visualizing contract interactions and metrics
- **cli**: Command-line tool for BuildKit operations

### Stylus Workflow

Stylus contracts are Rust programs that compile to WebAssembly (WASM) and run on Arbitrum Stylus:

1. **Development**: Write Rust contracts using the `stylus-sdk` crate
2. **Compilation**: Use `cargo-stylus` to compile Rust → WASM
3. **Deployment**: Deploy WASM bytecode to Arbitrum Sepolia via Stylus deployment flow
4. **Interaction**: Contracts appear as standard Ethereum contracts on-chain, accessible via:
   - Standard RPC calls (eth_call, eth_sendTransaction)
   - ethers.js / viem in frontend
   - Event indexing via standard Ethereum logs
   - ABI generation from Rust code

### Key Design Decisions

- **Stylus-first**: All core logic in Rust/WebAssembly for performance and developer experience
- **Minimal Solidity**: Only use Solidity for proxy patterns or compatibility if absolutely necessary
- **Separation of Concerns**: Each package has a single responsibility
- **No Auth**: Hackathon MVP focuses on core functionality
- **Arbitrum Sepolia Only**: Single testnet to keep scope manageable

## Getting Started

```bash
# Install dependencies
pnpm install

# Build Stylus contracts
pnpm stylus:build

# Deploy contracts
pnpm stylus:deploy

# Start frontend
pnpm dev

# Start indexer
pnpm indexer:start

# Start dashboard
pnpm dashboard:dev
```

## Packages

See individual package READMEs for detailed documentation.
