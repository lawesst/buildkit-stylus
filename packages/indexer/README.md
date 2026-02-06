# Stylus Contract Event Indexer

A Node.js indexer that listens to events emitted by Stylus contracts and exposes them via a REST API.

## 🎯 Stylus Indexing = Solidity Indexing

**Indexing Stylus contracts is IDENTICAL to indexing Solidity contracts.**

### Why They're Identical

1. **Same Event Format**: Stylus contracts emit standard Ethereum events using the same format as Solidity. Events defined with the `sol!` macro in Rust generate identical event signatures.

2. **Same Event Logs**: Events are stored in the same EVM log format on-chain. The `evm::log()` function in Stylus produces identical log entries to Solidity's `emit` statement.

3. **Same ABI Format**: Stylus contracts generate standard JSON ABIs that are identical to Solidity contract ABIs. You can use the same ABI parsing and event decoding logic.

4. **Same RPC Methods**: We use the same Ethereum RPC methods:
   - `eth_getLogs` - to fetch event logs
   - `eth_blockNumber` - to track block progression
   - `eth_getBlockByNumber` - to get block details

5. **Same Tooling**: You can use ethers.js, viem, web3.js, or any Ethereum library without any modifications. The contract being compiled from Rust instead of Solidity is completely transparent to the indexer.

### Example: Transfer Event

**Solidity:**
```solidity
event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
emit Transfer(from, to, tokenId);
```

**Stylus (Rust):**
```rust
sol! {
    event Transfer(
        address indexed from,
        address indexed to,
        uint256 indexed token_id
    );
}
evm::log(Transfer { from, to, token_id });
```

**Result**: Both produce identical event logs that can be indexed using the same code!

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Access to Arbitrum Sepolia RPC endpoint

### Installation

```bash
cd packages/indexer
pnpm install
```

### Configuration

Create a `.env` file (optional):

```env
RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
CHAIN_ID=421614
START_BLOCK=0
CONFIRMATIONS=1
POLL_INTERVAL=5000
DATABASE_PATH=./data/indexer.db
API_PORT=3001
NFT_CONTRACT_ADDRESS=0x1e3d7fd130aaadf17dfafa50370044813854bf53
```

### Run

```bash
# Development (with auto-reload)
pnpm dev

# Production
pnpm start
```

The indexer will:
1. Connect to the RPC endpoint
2. Initialize the database
3. Start listening for events
4. Start the REST API server

## 📡 API Endpoints

### GET /events

Query events with optional filters.

**Query Parameters:**
- `contract` - Filter by contract name (e.g., "nft")
- `event` - Filter by event name (e.g., "Transfer")
- `fromBlock` - Start block number
- `toBlock` - End block number
- `limit` - Maximum results (default: 100)
- `offset` - Pagination offset (default: 0)

**Example:**
```bash
curl "http://localhost:3001/events?contract=nft&event=Transfer&limit=10"
```

### GET /events/tx/:txHash

Get all events for a specific transaction.

**Example:**
```bash
curl "http://localhost:3001/events/tx/0x..."
```

### GET /events/contract/:contractName

Get all events for a specific contract.

**Example:**
```bash
curl "http://localhost:3001/events/contract/nft?limit=50"
```

### GET /stats

Get indexing statistics.

**Example:**
```bash
curl "http://localhost:3001/stats"
```

### GET /health

Health check endpoint.

**Example:**
```bash
curl "http://localhost:3001/health"
```

## 📊 Database Schema

### events

Stores all indexed events.

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| contract_name | TEXT | Contract name (e.g., "nft") |
| contract_address | TEXT | Contract address |
| event_name | TEXT | Event name (e.g., "Transfer") |
| block_number | INTEGER | Block number |
| block_hash | TEXT | Block hash |
| transaction_hash | TEXT | Transaction hash |
| transaction_index | INTEGER | Transaction index in block |
| log_index | INTEGER | Log index in transaction |
| event_data | TEXT | JSON-encoded event arguments |
| indexed_at | INTEGER | Timestamp when indexed |

### indexer_state

Tracks indexer state.

| Column | Type | Description |
|--------|------|-------------|
| key | TEXT | State key (e.g., "last_block") |
| value | TEXT | State value |

## 🔧 How It Works

1. **Event Listening**: Uses `ethers.js` Contract.on() to listen for real-time events
2. **Historical Indexing**: Polls for past events using `queryFilter()`
3. **Block Tracking**: Tracks last processed block to avoid re-indexing
4. **Event Storage**: Stores events in SQLite with full metadata
5. **REST API**: Exposes indexed events via REST endpoints

## 📝 Adding New Contracts

To index events from a new Stylus contract:

1. Add contract configuration to `src/config.ts`:

```typescript
contracts: {
  myContract: {
    address: '0x...',
    abi: [
      {
        name: 'MyEvent',
        type: 'event',
        inputs: [
          { indexed: true, name: 'param1', type: 'address' },
          { indexed: false, name: 'param2', type: 'uint256' },
        ],
      },
    ],
  },
}
```

2. The indexer will automatically:
   - Initialize the contract
   - Listen for events
   - Index historical events
   - Expose events via API

## 🎓 Key Takeaways

- **Stylus events = Solidity events** - Same format, same indexing approach
- **No special handling needed** - Use standard Ethereum tooling
- **Same ABI format** - Parse events the same way
- **Same RPC methods** - Use standard Ethereum RPC calls
- **Fully compatible** - Works with ethers.js, viem, web3.js, etc.

## 📚 Resources

- [Stylus Documentation](https://docs.arbitrum.io/stylus)
- [ethers.js Documentation](https://docs.ethers.org/)
- [Ethereum Event Logs](https://ethereum.org/en/developers/docs/blocks/#block-log)
