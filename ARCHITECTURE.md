# BuildKit Architecture

## Overview

BuildKit is a monorepo designed around Stylus (Rust) smart contracts as first-class citizens on Arbitrum. The architecture prioritizes clarity and developer experience for a hackathon MVP.

## Monorepo Structure

```
buildkit-stylus/
├── packages/
│   ├── stylus-contracts/    # Rust → WASM contracts
│   ├── frontend/            # Next.js user interface
│   ├── indexer/             # Event indexing service
│   ├── dashboard/           # Analytics visualization
│   └── cli/                 # Developer CLI tool
├── pnpm-workspace.yaml      # Workspace configuration
└── package.json             # Root package config
```

## Package Responsibilities

### 1. stylus-contracts

**Purpose**: Rust smart contracts compiled to WebAssembly for Arbitrum Stylus.

**Key Files**:
- `contracts/*/`: Individual contract crates
- `Cargo.toml`: Rust workspace configuration
- `cargo-stylus.toml`: Stylus deployment settings

**Workflow**:
1. Write Rust code using `stylus-sdk` crate
2. Compile with `cargo stylus build` → produces `.wasm` files
3. Deploy with `cargo stylus deploy` → uploads to Arbitrum Sepolia
4. Generate ABI files for frontend/indexer integration

**Stylus Integration**:
- Contracts compile to WASM bytecode
- Deployed contracts appear as standard Ethereum contracts
- Events and function calls work identically to Solidity contracts
- ABIs are generated from Rust code annotations

### 2. frontend

**Purpose**: Next.js application for users to interact with Stylus contracts.

**Tech Stack**:
- Next.js 14 (App Router)
- React 18
- viem + wagmi for blockchain interactions
- TypeScript

**Stylus Integration**:
- Uses generated ABIs from `stylus-contracts` for type safety
- Calls contract functions via standard RPC (`eth_call`, `eth_sendTransaction`)
- Listens to contract events via wagmi hooks
- No special handling needed - Stylus contracts are standard contracts on-chain

### 3. indexer

**Purpose**: Node.js service that indexes on-chain events from Stylus contracts.

**Features**:
- Polls Arbitrum Sepolia for new blocks
- Filters events from known Stylus contract addresses
- Parses events using contract ABIs
- Stores indexed data (in-memory for MVP)

**Stylus Integration**:
- Reads standard Ethereum event logs
- Uses ABI files to decode event data
- No difference from indexing Solidity contracts

### 4. dashboard

**Purpose**: Analytics UI for visualizing contract metrics and interactions.

**Features**:
- Charts and graphs (using Recharts)
- Transaction volume visualization
- Event timeline
- Contract state dashboards

**Data Flow**:
- Consumes data from indexer (via API or direct connection)
- Displays aggregated metrics

### 5. cli

**Purpose**: Developer tool for BuildKit operations.

**Commands**:
- `buildkit deploy`: Deploy Stylus contracts
- `buildkit query`: Query contract state
- `buildkit generate-abi`: Generate ABI files
- `buildkit interact`: Call contract functions

**Stylus Integration**:
- Wraps `cargo-stylus` commands
- Provides convenient interface for common operations

## Stylus Contract Workflow

### Development Flow

```
1. Write Rust contract (packages/stylus-contracts/contracts/my-contract/)
   ↓
2. Compile: cargo stylus build
   ↓
3. Generate ABI: cargo stylus generate-abi
   ↓
4. Deploy: cargo stylus deploy --network sepolia
   ↓
5. Contract address saved to shared config
   ↓
6. Frontend/Indexer/CLI use address + ABI to interact
```

### Integration Points

**Stylus contracts integrate with the rest of the stack via**:

1. **ABI Files**: Generated from Rust code, shared across packages
   - Location: `packages/stylus-contracts/abis/`
   - Used by: frontend, indexer, cli

2. **Contract Addresses**: Deployed addresses stored in shared config
   - Location: `packages/stylus-contracts/deployments/sepolia.json`
   - Used by: all packages

3. **Standard RPC**: All interactions use standard Ethereum JSON-RPC
   - No special Stylus-specific RPC calls needed
   - Works with any Ethereum tooling (ethers.js, viem, etc.)

## Design Decisions

### Why Monorepo?

- Shared ABIs and contract addresses
- Unified development workflow
- Single dependency management
- Easy cross-package refactoring

### Why pnpm Workspaces?

- Fast, efficient dependency management
- Strict dependency resolution
- Good monorepo support
- Native workspace protocol

### Why Separate Dashboard?

- Different deployment target (can run separately)
- Different tech requirements (analytics libraries)
- Clear separation of concerns
- Can be extended to separate backend API later

### Why Minimal Solidity?

- Stylus-first philosophy
- Rust provides better developer experience
- WASM performance benefits
- Only use Solidity for proxy patterns if absolutely necessary

### Why No Auth?

- Hackathon MVP scope
- Focus on core Stylus functionality
- Can add later if needed
- Reduces complexity

### Why Arbitrum Sepolia Only?

- Single testnet keeps scope manageable
- Easier deployment and testing
- Can extend to mainnet later
- Sepolia has Stylus support

## Data Flow

```
Stylus Contract (Rust → WASM)
    ↓
Deployed to Arbitrum Sepolia
    ↓
    ├─→ Frontend (user interactions via wagmi/viem)
    ├─→ Indexer (event polling and storage)
    └─→ CLI (developer operations)
            ↓
        Dashboard (visualizes indexed data)
```

## Future Extensions (Out of MVP Scope)

- Database for indexer (currently in-memory)
- Authentication system
- Multi-chain support
- Contract upgrade patterns
- Testing framework integration
- CI/CD pipelines
