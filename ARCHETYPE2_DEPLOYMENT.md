# Archetype 2: Gasless Contract - Deployment Guide

## ✅ What's Complete

1. **Contract Created**: `packages/stylus-contracts/contracts/gasless/`
   - `post_message(message: String)` function
   - `MessagePosted` event emission
   - SDK 0.10 compatible
   - Builds successfully

2. **Frontend Updated**: `packages/frontend/src/components/GaslessMint.tsx`
   - Replaced simulation with real contract calls
   - Uses `GASLESS_CONTRACT_ADDRESS` and `GASLESS_ABI`
   - Proper transaction handling with gas pricing

3. **Indexer Configured**: `packages/indexer/src/config.ts`
   - Added gasless contract configuration
   - Listens for `MessagePosted` events
   - Ready to index once contract is deployed

## 🚀 Manual Deployment Steps

### Option 1: Using the Deploy Script

```bash
cd packages/stylus-contracts
bash scripts/deploy.sh gasless sepolia
```

### Option 2: Direct cargo-stylus Command

```bash
cd packages/stylus-contracts
source .env
cargo stylus deploy \
  --contract gasless \
  --endpoint https://sepolia-rollup.arbitrum.io/rpc \
  --private-key "$STYLUS_PRIVATE_KEY"
```

### Option 3: Using Stylus.toml Configuration

The `Stylus.toml` file is already configured. You can try:

```bash
cd packages/stylus-contracts
source .env
cargo stylus deploy --contract gasless
```

## 📝 After Deployment

Once the contract is deployed, you'll get:
- Contract address (e.g., `0x...`)
- Deployment transaction hash
- Activation transaction hash

### 1. Update deployments/sepolia.json

Add the gasless contract to the deployments file:

```json
{
  "network": "arbitrum-sepolia",
  "chainId": 421614,
  "contracts": {
    "nft": { ... },
    "gasless": {
      "address": "0x...",
      "deploymentTx": "0x...",
      "activationTx": "0x...",
      "deployedAt": "2026-02-07T...",
      "contractName": "GaslessApp",
      "description": "Stateless gasless contract for ERC-4337 Account Abstraction compatibility"
    }
  }
}
```

### 2. Update Frontend Environment

Add to `packages/frontend/.env.local`:

```bash
NEXT_PUBLIC_GASLESS_CONTRACT_ADDRESS=0x...
```

### 3. Update Indexer Environment (Optional)

Add to `packages/indexer/.env`:

```bash
GASLESS_CONTRACT_ADDRESS=0x...
```

Or the indexer will automatically read from `deployments/sepolia.json`.

## 🧪 Testing

1. **Start Frontend**:
   ```bash
   cd packages/frontend
   pnpm dev
   ```

2. **Navigate to Gasless Page**:
   - Go to `http://localhost:3000/gasless`
   - Connect wallet
   - Enter a message
   - Click "Post Message"

3. **Verify on Arbiscan**:
   - Check transaction: `https://sepolia.arbiscan.io/tx/<tx_hash>`
   - Verify event emission

4. **Check Indexer** (if running):
   ```bash
   cd packages/indexer
   pnpm dev
   ```
   - Events should appear in the indexer
   - Check dashboard: `http://localhost:3002`

## 📋 Contract Details

- **Function**: `post_message(message: String)`
- **Event**: `MessagePosted(address indexed user, string message)`
- **Validation**: 
  - Message cannot be empty
  - Message max length: 1000 characters
- **Gas Limit**: ~200k (for string operations)

## 🔍 Troubleshooting

### Deployment Fails

1. **Check Balance**: Ensure you have ETH on Arbitrum Sepolia
   ```bash
   bash scripts/check-balance.sh
   ```

2. **Check Build**: Ensure contract builds
   ```bash
   cargo stylus build --contract gasless
   ```

3. **Check Private Key**: Ensure `.env` file has `STYLUS_PRIVATE_KEY`

### Frontend Shows "Contract Not Deployed"

- Verify `NEXT_PUBLIC_GASLESS_CONTRACT_ADDRESS` is set
- Restart the frontend dev server
- Check browser console for errors

### Events Not Indexing

- Verify contract address in indexer config
- Check indexer logs for errors
- Ensure indexer is running and connected to RPC

## ✅ Completion Checklist

- [ ] Contract deployed to Arbitrum Sepolia
- [ ] Contract address added to `deployments/sepolia.json`
- [ ] `NEXT_PUBLIC_GASLESS_CONTRACT_ADDRESS` set in frontend `.env.local`
- [ ] Frontend tested - can post messages
- [ ] Events visible on Arbiscan
- [ ] Indexer picking up `MessagePosted` events
- [ ] Dashboard showing gasless events
