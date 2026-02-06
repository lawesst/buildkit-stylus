/**
 * Stylus Contract Event Indexer
 * 
 * STYLUS INDEXING NOTE:
 * =====================
 * 
 * Indexing Stylus contracts is IDENTICAL to indexing Solidity contracts because:
 * 
 * 1. **Same Event Format**: Stylus contracts emit standard Ethereum events using the
 *    same format as Solidity contracts. Events are defined using the `sol!` macro
 *    in Rust, which generates the same event signatures as Solidity.
 * 
 * 2. **Same Event Logs**: Events are stored in the same EVM log format on-chain.
 *    The `evm::log()` function in Stylus produces identical log entries to Solidity's
 *    `emit` statement.
 * 
 * 3. **Same ABI Format**: Stylus contracts generate standard JSON ABIs that are
 *    identical to Solidity contract ABIs. You can use the same ABI parsing and
 *    event decoding logic.
 * 
 * 4. **Same RPC Methods**: We use the same Ethereum RPC methods:
 *    - `eth_getLogs` - to fetch event logs
 *    - `eth_blockNumber` - to track block progression
 *    - `eth_getBlockByNumber` - to get block details
 * 
 * 5. **Same Tooling**: You can use ethers.js, viem, web3.js, or any Ethereum library
 *    without any modifications. The contract being compiled from Rust instead of
 *    Solidity is completely transparent to the indexer.
 * 
 * This indexer listens for events from Stylus contracts and stores them in SQLite.
 * It exposes a REST API to query indexed events.
 */

import { ethers } from 'ethers'
import express from 'express'
import { config } from './config.js'
import { EventIndexer } from './indexer.js'
import { createApi } from './api.js'
import { createStorage } from './storage.js'

// Initialize storage (SQLite if available, otherwise JSON)
const storage = createStorage(config.databasePath)

// Initialize Express app
const app = express()
app.use(express.json())

// Initialize event indexer
const indexer = new EventIndexer(config, storage)

// Setup REST API
createApi(app, storage)

// Start indexing
console.log('🚀 Starting Stylus Event Indexer...')
console.log(`📡 RPC: ${config.rpcUrl}`)
console.log(`📦 Contracts: ${Object.keys(config.contracts).join(', ')}`)
console.log(`💾 Database: ${config.databasePath}`)
console.log(`🌐 API: http://localhost:${config.apiPort}`)
console.log('')

// Start the indexer
indexer.start().catch(console.error)

// Start the API server
app.listen(config.apiPort, () => {
  console.log(`✅ API server running on http://localhost:${config.apiPort}`)
})

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down indexer...')
  indexer.stop()
  process.exit(0)
})
