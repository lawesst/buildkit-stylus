# Frontend

Next.js application for interacting with Stylus contracts on Arbitrum Sepolia.

## Features

- **Wallet Connect**: Connect MetaMask, WalletConnect, or injected wallets
- **Mint NFTs**: Call the Stylus `mint()` function to create new NFTs
- **Read Events**: Real-time listening to `Transfer` events from Stylus contracts
- **Contract Info**: Display contract address and network information

## Stylus vs Solidity: Frontend Perspective

### Key Insight: **No Difference!**

Stylus contracts work **exactly** like Solidity contracts from the frontend perspective. Here's why:

### 1. **Standard RPC Calls**

Both Stylus and Solidity contracts use the same Ethereum JSON-RPC methods:
- `eth_call` - Read contract state
- `eth_sendTransaction` - Write to contract
- `eth_getLogs` - Read event logs

```typescript
// This code works identically for Stylus and Solidity contracts
const result = await writeContract({
  address: contractAddress,
  abi: contractABI,
  functionName: 'mint',
  args: [recipient],
})
```

### 2. **Standard ABIs**

Stylus contracts generate Solidity-compatible ABIs using `cargo stylus generate-abi`. The ABI format is identical:

```json
{
  "name": "mint",
  "type": "function",
  "inputs": [{"name": "to", "type": "address"}],
  "outputs": [{"name": "", "type": "uint256"}]
}
```

### 3. **Standard Events**

Stylus contracts emit events using `evm::log()` in Rust, but they appear as standard Ethereum event logs:

```rust
// In Rust (Stylus)
evm::log(Transfer {
    from: Address::ZERO,
    to,
    token_id,
});
```

```typescript
// In TypeScript (Frontend) - works the same for both
useWatchContractEvent({
  address: contractAddress,
  abi: contractABI,
  eventName: 'Transfer',
  onLogs(logs) {
    // Handle events
  },
})
```

### 4. **Standard Addresses**

Stylus contracts have standard Ethereum addresses (0x...) and can be called, queried, and indexed just like Solidity contracts.

### What's Different?

The **only** difference is in development:
- **Stylus**: Write contracts in Rust, compile to WASM
- **Solidity**: Write contracts in Solidity, compile to EVM bytecode

But once deployed, both are just contracts on-chain with standard interfaces.

## Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Contract Address

After deploying your Stylus contract, set the address:

```bash
# Option 1: Environment variable
export NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0x...

# Option 2: Create .env.local
echo "NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0x..." > .env.local
```

Or update `src/lib/contracts.ts` directly.

### 3. Run Development Server

```bash
pnpm dev
```

Visit http://localhost:3000

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Main page
│   ├── providers.tsx       # Wagmi/React Query providers
│   └── globals.css         # Global styles
├── components/
│   ├── WalletConnect.tsx   # Wallet connection UI
│   ├── ContractInfo.tsx   # Contract address and network info
│   ├── MintNFT.tsx         # Mint function interaction
│   └── EventListener.tsx   # Real-time event listening
└── lib/
    └── contracts.ts        # Contract configuration and ABIs
```

## Components

### WalletConnect

Connects user's wallet (MetaMask, WalletConnect, etc.) to the app.

### ContractInfo

Displays:
- Network (Arbitrum Sepolia)
- Chain ID
- Contract address
- Contract type (Stylus/Rust)

### MintNFT

Allows users to:
- Call the `mint()` function
- Specify recipient address (defaults to connected wallet)
- View transaction status
- See next token ID

### EventListener

Real-time event listener that:
- Watches for `Transfer` events
- Displays event data (from, to, tokenId)
- Shows timestamp

## How It Works

### 1. Wallet Connection

Uses `wagmi` hooks to connect wallets:

```typescript
const { address, isConnected } = useAccount()
const { connect } = useConnect()
```

### 2. Calling Stylus Functions

Uses `useWriteContract` hook - works identically for Stylus and Solidity:

```typescript
const { writeContract } = useWriteContract({
  address: NFT_CONTRACT_ADDRESS,
  abi: NFT_ABI,
  functionName: 'mint',
  args: [recipient],
})
```

### 3. Reading Contract State

Uses `useReadContract` hook:

```typescript
const { data } = useReadContract({
  address: NFT_CONTRACT_ADDRESS,
  abi: NFT_ABI,
  functionName: 'nextTokenId',
})
```

### 4. Listening to Events

Uses `useWatchContractEvent` hook:

```typescript
useWatchContractEvent({
  address: NFT_CONTRACT_ADDRESS,
  abi: NFT_ABI,
  eventName: 'Transfer',
  onLogs(logs) {
    // Handle events
  },
})
```

## Environment Variables

```bash
# Contract address (required after deployment)
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0x...

# WalletConnect project ID (optional)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=...
```

## Integration with Stylus Contracts

1. **Deploy Contract**: `pnpm stylus:deploy` (from root)
2. **Get Address**: Check `packages/stylus-contracts/deployments/sepolia.json`
3. **Set Address**: Update `NEXT_PUBLIC_NFT_CONTRACT_ADDRESS` or `src/lib/contracts.ts`
4. **Use ABI**: ABI is already included in `src/lib/contracts.ts` (matches generated ABI)

## Troubleshooting

### "Contract not deployed yet"

Set `NEXT_PUBLIC_NFT_CONTRACT_ADDRESS` environment variable or update `src/lib/contracts.ts`.

### "Wrong Network"

Switch your wallet to Arbitrum Sepolia (Chain ID: 421614).

### Events not showing

- Ensure contract is deployed
- Check contract address is correct
- Verify wallet is connected
- Check browser console for errors

### Transaction fails

- Check you have ETH on Arbitrum Sepolia
- Verify contract address is correct
- Check network is Arbitrum Sepolia
- Review contract function requirements

## Tech Stack

- **Next.js 14**: React framework with App Router
- **Wagmi 2**: React hooks for Ethereum
- **Viem 2**: TypeScript Ethereum library
- **React Query**: Data fetching and caching
- **TypeScript**: Type safety

## Development

```bash
# Start dev server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint
pnpm lint
```
