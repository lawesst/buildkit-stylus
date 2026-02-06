# Quick Deployment Guide

## Prerequisites Check

✅ Rust/Cargo: Installed
✅ NFT Contract: Exists
⏳ cargo-stylus: Installing...

## Steps to Deploy

### 1. Set Your Private Key

You need a private key with ETH on Arbitrum Sepolia:

```bash
export STYLUS_PRIVATE_KEY="0xYOUR_PRIVATE_KEY_HERE"
```

**Security Note**: Never commit your private key. Use environment variables only.

### 2. Get Test ETH (if needed)

If you don't have ETH on Arbitrum Sepolia:
- Bridge from Ethereum Sepolia: https://bridge.arbitrum.io/ (switch to Sepolia)
- Or use a faucet: https://faucet.quicknode.com/arbitrum/sepolia

### 3. Build the Contract

```bash
cd packages/stylus-contracts
cargo stylus build
```

### 4. Deploy the Contract

```bash
# From project root
pnpm stylus:deploy

# Or from stylus-contracts directory
cargo stylus deploy --network sepolia
```

### 5. Update Frontend with Contract Address

After deployment, you'll get a contract address. Update the frontend:

**Option A: Environment Variable**
```bash
export NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0x...
# Then restart the dev server
```

**Option B: Update contracts.ts**
Edit `packages/frontend/src/lib/contracts.ts` and update:
```typescript
export const NFT_CONTRACT_ADDRESS = '0x...' as `0x${string}`
```

The deployment address will also be saved to:
`packages/stylus-contracts/deployments/sepolia.json`

## Quick Command Sequence

```bash
# 1. Set private key
export STYLUS_PRIVATE_KEY="0x..."

# 2. Build and deploy
pnpm stylus:build
pnpm stylus:deploy

# 3. Get the contract address from output or deployments/sepolia.json

# 4. Update frontend
export NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0x...

# 5. Restart dev server (if running)
# The frontend will automatically pick up the new address
```

## Troubleshooting

- **"cargo-stylus not found"**: Wait for installation to complete, or run `cargo install cargo-stylus`
- **"Private key not found"**: Make sure you exported `STYLUS_PRIVATE_KEY`
- **"Insufficient funds"**: Get test ETH on Arbitrum Sepolia
- **"Network error"**: Check your internet connection and RPC URL
