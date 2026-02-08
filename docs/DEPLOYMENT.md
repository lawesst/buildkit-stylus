# Deployment Guide

Complete guide for deploying BuildKit (Stylus Edition) components.

## Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Rust (latest stable)
- `cargo-stylus` installed
- Test ETH on Arbitrum Sepolia

## Quick Start

### 1. Deploy Stylus Contracts

```bash
cd packages/stylus-contracts

# Set your private key
echo "STYLUS_PRIVATE_KEY=0x..." > .env

# Build contracts
cargo stylus build

# Deploy to Arbitrum Sepolia
cargo stylus deploy --endpoint https://sepolia-rollup.arbitrum.io/rpc --private-key $STYLUS_PRIVATE_KEY
```

See [packages/stylus-contracts/README.md](../packages/stylus-contracts/README.md) for detailed contract deployment.

### 2. Configure Frontend

```bash
cd packages/frontend

# Create .env.local
cat > .env.local << EOF
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_GASLESS_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=... (optional)
EOF
```

### 3. Deploy Frontend

#### Option A: Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set **Root Directory** to `packages/frontend`
3. Add environment variables in Vercel dashboard
4. Deploy

#### Option B: Local Development

```bash
pnpm dev
```

### 4. Start Indexer

```bash
cd packages/indexer

# Create .env
cat > .env << EOF
RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
NFT_CONTRACT_ADDRESS=0x...
GASLESS_CONTRACT_ADDRESS=0x...
EOF

# Start indexer
pnpm start
```

## Environment Variables

### Stylus Contracts
- `STYLUS_PRIVATE_KEY`: Private key for deployment (never commit!)

### Frontend
- `NEXT_PUBLIC_NFT_CONTRACT_ADDRESS`: Deployed NFT contract address
- `NEXT_PUBLIC_GASLESS_CONTRACT_ADDRESS`: Deployed gasless contract address
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`: WalletConnect project ID (optional)

### Indexer
- `RPC_URL`: Arbitrum Sepolia RPC endpoint
- `NFT_CONTRACT_ADDRESS`: NFT contract address
- `GASLESS_CONTRACT_ADDRESS`: Gasless contract address

## Troubleshooting

### Contract Deployment Fails
- Check you have sufficient ETH on Arbitrum Sepolia
- Verify RPC endpoint is correct
- Check gas prices (may need to retry during high network activity)

### Frontend Can't Connect
- Verify contract addresses are correct
- Check network is set to Arbitrum Sepolia (Chain ID: 421614)
- Ensure wallet is connected

### Indexer Not Working
- Verify RPC URL is accessible
- Check contract addresses match deployed contracts
- Review indexer logs for errors

## Production Deployment

For production deployments:

1. **Contracts**: Deploy to Arbitrum Mainnet (requires mainnet ETH)
2. **Frontend**: Use production environment variables
3. **Indexer**: Run as a persistent service (consider using a process manager like PM2)
4. **Monitoring**: Set up logging and error tracking

## Getting Test ETH

- **Arbitrum Sepolia Faucet**: https://faucet.quicknode.com/arbitrum/sepolia
- **Arbitrum Sepolia Bridge**: Bridge from Ethereum Sepolia
