# Quick Deploy Instructions

## ✅ Setup Complete

- Private key: Configured (stored in `.env` file, git-ignored)
- Contract: Ready to deploy

## Deploy Steps

### 1. Make sure cargo-stylus is installed

```bash
cargo stylus --version
```

If not installed, install it:
```bash
cargo install cargo-stylus
```

### 2. Load your private key

The private key is stored in `.env`. To use it in your terminal:

```bash
# Load from .env file
export $(cat .env | xargs)
```

Or manually:
```bash
export STYLUS_PRIVATE_KEY="0xda85d5b2e5c49917b8448c0e476ee88ceb21d491a5a4c918632b34aeb36e4eae"
```

### 3. Check you have ETH on Arbitrum Sepolia

```bash
cd packages/stylus-contracts
./scripts/check-balance.sh
```

If you need test ETH:
- Bridge from Ethereum Sepolia: https://bridge.arbitrum.io/
- Faucet: https://faucet.quicknode.com/arbitrum/sepolia

### 4. Build the contract

```bash
# From project root
pnpm stylus:build

# Or from stylus-contracts directory
cd packages/stylus-contracts
cargo stylus build
```

### 5. Deploy the contract

```bash
# From project root
pnpm stylus:deploy

# Or from stylus-contracts directory
cd packages/stylus-contracts
cargo stylus deploy --network sepolia
```

### 6. Update frontend with contract address

After deployment, you'll see the contract address. Update it:

**Option A: Environment variable**
```bash
export NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0x...
```

**Option B: Update contracts.ts**
Edit `packages/frontend/src/lib/contracts.ts`:
```typescript
export const NFT_CONTRACT_ADDRESS = '0x...' as `0x${string}`
```

The address is also saved to:
`packages/stylus-contracts/deployments/sepolia.json`

## Security Reminder

⚠️ **Never commit your private key to git!**
- ✅ `.env` file is git-ignored
- ✅ Private key is safe in `.env`
- ❌ Never push `.env` to GitHub

## All-in-One Command

Once cargo-stylus is installed and you have ETH:

```bash
# Load private key
export $(cat .env | xargs)

# Build and deploy
pnpm stylus:build && pnpm stylus:deploy
```
