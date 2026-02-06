# Stylus Contracts

Rust smart contracts for Arbitrum Stylus, compiled to WebAssembly (WASM) and deployed to Arbitrum Sepolia.

## Structure

- `contracts/`: Individual Stylus contract crates
- `Cargo.toml`: Workspace configuration
- `cargo-stylus.toml`: Stylus deployment configuration
- `deployments/`: Deployed contract addresses (git-ignored)
- `abis/`: Generated ABI files for frontend/indexer integration

## Prerequisites

1. **Rust Toolchain**: Install Rust (1.70+)
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```

2. **cargo-stylus**: Install the Stylus CLI tool
   ```bash
   cargo install cargo-stylus
   ```

3. **Test ETH on Arbitrum Sepolia**: You'll need ETH for gas fees
   - See [Getting Test ETH](#getting-test-eth) section below

4. **Environment Variables**: Set your private key
   ```bash
   export STYLUS_PRIVATE_KEY="your_private_key_here"
   ```
   ⚠️ **Security**: Never commit your private key. Use environment variables or a `.env` file (git-ignored).

## Quick Start

### 1. Build Contracts

Compile Rust contracts to WebAssembly:

```bash
# From project root
pnpm stylus:build

# Or from this directory
cd packages/stylus-contracts
cargo stylus build
```

**What this does:**
- Compiles each contract in `contracts/` to WASM bytecode
- Outputs `.wasm` files in `target/` directory
- Validates contract code and dependencies

**Expected output:**
```
Compiling nft v0.1.0
Finished release [optimized] target(s)
```

### 2. Generate ABIs

Generate Solidity-compatible ABIs from Rust contracts:

```bash
cargo stylus generate-abi
```

**What this does:**
- Parses Rust contract code
- Generates JSON ABI files in `abis/` directory
- These ABIs are used by frontend/indexer for type-safe interactions

**Output location:** `abis/<contract-name>.json`

### 3. Deploy Contracts

Deploy contracts to Arbitrum Sepolia:

```bash
# From project root
pnpm stylus:deploy

# Or from this directory
cd packages/stylus-contracts
cargo stylus deploy --network sepolia
```

**What this does:**
- Uploads WASM bytecode to Arbitrum Sepolia
- Activates the Stylus program (if needed)
- Returns contract addresses
- Saves deployment info to `deployments/sepolia.json`

**Expected output:**
```
Deploying nft...
Contract deployed at: 0x...
Transaction hash: 0x...
```

### 4. Verify Deployment

Check deployment status:

```bash
# List deployed contracts
cat deployments/sepolia.json
```

## Deployment Configuration

### Network Settings

Network configuration is in `cargo-stylus.toml`:

```toml
[network.sepolia]
rpc-url = "https://sepolia-rollup.arbitrum.io/rpc"
private-key = "${STYLUS_PRIVATE_KEY}"
```

### Environment Variables

Set your private key as an environment variable:

```bash
# Option 1: Export in your shell
export STYLUS_PRIVATE_KEY="0x..."

# Option 2: Use a .env file (create .env in this directory)
echo "STYLUS_PRIVATE_KEY=0x..." > .env
```

⚠️ **Never commit private keys to git!** The `.env` file should be in `.gitignore`.

### Deploying Specific Contracts

Deploy a single contract:

```bash
cargo stylus deploy --network sepolia --contract nft
```

Deploy all contracts:

```bash
cargo stylus deploy --network sepolia
```

## Getting Test ETH

You need ETH on Arbitrum Sepolia to pay for gas fees. Here's how to get it:

### Option 1: Arbitrum Sepolia Faucet (Recommended)

1. **Bridge from Ethereum Sepolia**:
   - Go to [Arbitrum Sepolia Bridge](https://bridge.arbitrum.io/)
   - Connect your wallet
   - Switch to Sepolia testnet
   - Bridge ETH from Ethereum Sepolia to Arbitrum Sepolia

2. **Direct Faucet** (if available):
   - Visit [Arbitrum Sepolia Faucet](https://faucet.quicknode.com/arbitrum/sepolia)
   - Enter your wallet address
   - Request test ETH

### Option 2: Ethereum Sepolia → Arbitrum Sepolia Bridge

1. Get ETH on Ethereum Sepolia first:
   - [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
   - [Infura Sepolia Faucet](https://www.infura.io/faucet/sepolia)
   - [QuickNode Sepolia Faucet](https://faucet.quicknode.com/ethereum/sepolia)

2. Bridge to Arbitrum Sepolia:
   - Use [Arbitrum Bridge](https://bridge.arbitrum.io/)
   - Select Sepolia testnet
   - Bridge your ETH

### Option 3: Community Faucets

- Check Arbitrum Discord for community faucets
- Some require social verification or tasks

### Checking Your Balance

```bash
# Using cast (from foundry)
cast balance <your_address> --rpc-url https://sepolia-rollup.arbitrum.io/rpc

# Or check on block explorer
# https://sepolia.arbiscan.io/address/<your_address>
```

**Minimum recommended:** 0.01 ETH on Arbitrum Sepolia for multiple deployments.

## Common Errors and Fixes

### Error: "Private key not found"

**Problem:** `STYLUS_PRIVATE_KEY` environment variable is not set.

**Fix:**
```bash
export STYLUS_PRIVATE_KEY="0x..."
# Or add to your shell profile (~/.zshrc, ~/.bashrc)
```

### Error: "Insufficient funds"

**Problem:** Not enough ETH in your account for gas fees.

**Fix:**
- Get test ETH (see [Getting Test ETH](#getting-test-eth))
- Check balance: `cast balance <address> --rpc-url https://sepolia-rollup.arbitrum.io/rpc`
- Deployments typically cost 0.001-0.01 ETH depending on contract size

### Error: "Compilation failed"

**Problem:** Rust compilation errors in contract code.

**Fix:**
```bash
# Check for syntax errors
cargo check

# Check specific contract
cd contracts/nft
cargo check

# Common issues:
# - Missing dependencies in Cargo.toml
# - Incorrect stylus-sdk version
# - Rust version too old (need 1.70+)
```

### Error: "Network connection failed"

**Problem:** Cannot connect to Arbitrum Sepolia RPC.

**Fix:**
- Check internet connection
- Verify RPC URL in `cargo-stylus.toml`
- Try alternative RPC endpoint:
  ```toml
  rpc-url = "https://sepolia-rollup.arbitrum.io/rpc"
  # Or use Alchemy/Infura endpoint if you have one
  ```

### Error: "Contract already deployed"

**Problem:** Contract WASM hash already exists on-chain.

**Fix:**
- This is normal if you're redeploying the same code
- Stylus contracts are immutable by default
- To deploy a new version, modify the contract code first
- Or use a different contract name

### Error: "WASM file not found"

**Problem:** Contract wasn't built before deployment.

**Fix:**
```bash
# Build first, then deploy
cargo stylus build
cargo stylus deploy --network sepolia
```

### Error: "ABI generation failed"

**Problem:** Rust code doesn't match Stylus ABI generation requirements.

**Fix:**
- Ensure `#[entrypoint]` and `#[public]` attributes are correct
- Check that events use `sol!` macro
- Verify storage uses `sol_storage!` macro
- See contract examples in `contracts/` directory

### Error: "Activation failed"

**Problem:** Stylus program activation transaction failed.

**Fix:**
- Check you have enough ETH for activation (can be expensive)
- Verify network is Arbitrum Sepolia (Stylus not available on all networks)
- Wait a few minutes and retry (network congestion)

## Development Workflow

### Typical Development Cycle

```bash
# 1. Write/edit contract code
vim contracts/nft/src/lib.rs

# 2. Check for errors
cargo check

# 3. Build contract
cargo stylus build

# 4. Generate ABI
cargo stylus generate-abi

# 5. Deploy to testnet
cargo stylus deploy --network sepolia

# 6. Test interaction (using cast, ethers.js, etc.)
cast call <contract_address> "owner_of(uint256)" 0 --rpc-url https://sepolia-rollup.arbitrum.io/rpc
```

### Hot Reload Development

For faster iteration:

```bash
# Watch mode (if supported)
cargo stylus build --watch

# Or use a script to rebuild on file changes
# See scripts/deploy.sh for example
```

## Contract Addresses

Deployed contract addresses are stored in `deployments/sepolia.json`:

```json
{
  "nft": {
    "address": "0x...",
    "deployed_at": "2024-01-01T00:00:00Z",
    "transaction_hash": "0x...",
    "block_number": 12345678
  }
}
```

This file is git-ignored by default. Share addresses manually or use a deployment registry.

## Integration with Other Packages

After deployment, other packages use the contract addresses:

1. **Frontend**: Reads `deployments/sepolia.json` and `abis/` for contract interactions
2. **Indexer**: Uses addresses to filter events, ABIs to decode logs
3. **CLI**: Uses addresses for querying and interacting with contracts

## Troubleshooting

### Check Contract Status

```bash
# Verify contract is deployed
cast code <contract_address> --rpc-url https://sepolia-rollup.arbitrum.io/rpc

# Should return non-empty bytecode if deployed
```

### View Deployment Logs

```bash
# Check cargo-stylus logs
cargo stylus deploy --network sepolia --verbose

# Or check transaction on block explorer
# https://sepolia.arbiscan.io/tx/<tx_hash>
```

### Reset Deployment State

If you need to start fresh:

```bash
# Remove deployment records (contracts still on-chain)
rm deployments/sepolia.json

# Rebuild from scratch
cargo clean
cargo stylus build
```

## Additional Resources

- [Stylus Documentation](https://docs.arbitrum.io/stylus)
- [cargo-stylus GitHub](https://github.com/offchainlabs/cargo-stylus)
- [Arbitrum Sepolia Explorer](https://sepolia.arbiscan.io/)
- [Stylus by Example](https://docs.arbitrum.io/stylus-by-example)

## Contracts

Each contract is a separate crate in the `contracts/` directory:

- **nft**: Minimal ERC-721-like NFT contract (see `contracts/nft/`)
