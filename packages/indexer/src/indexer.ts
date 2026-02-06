/**
 * Event Indexer
 * 
 * Listens to Stylus contract events and stores them in the database.
 * 
 * STYLUS INDEXING:
 * ================
 * 
 * This indexer works with Stylus contracts exactly as it would with Solidity contracts:
 * 
 * 1. **Event Listening**: We use ethers.js Contract.on() to listen for events.
 *    Stylus events are emitted using `evm::log()` which produces standard EVM logs,
 *    so ethers.js treats them identically to Solidity events.
 * 
 * 2. **Event Decoding**: Events are decoded using the contract ABI. Stylus contracts
 *    generate standard JSON ABIs, so the decoding process is identical.
 * 
 * 3. **Block Tracking**: We track the last processed block to avoid re-indexing.
 *    This works the same for Stylus and Solidity contracts since they're on the
 *    same blockchain.
 * 
 * 4. **Event Storage**: Events are stored with the same structure regardless of
 *    whether they came from a Stylus or Solidity contract.
 */

import { ethers } from 'ethers'
import { config } from './config.js'
import { Storage } from './storage.js'

export class EventIndexer {
  private provider: ethers.Provider
  private contracts: Map<string, ethers.Contract> = new Map()
  private isRunning = false
  private pollInterval?: NodeJS.Timeout

  constructor(
    private config: typeof import('./config.js').config,
    private storage: Storage
  ) {
    // Initialize provider
    this.provider = new ethers.JsonRpcProvider(config.rpcUrl)
    
    // Load last processed block
    const lastBlock = this.storage.getLastBlock()
    if (lastBlock > 0) {
      console.log(`📦 Resuming from block ${lastBlock}`)
    } else {
      console.log(`📦 Starting from block ${this.config.startBlock}`)
      this.storage.saveLastBlock(this.config.startBlock)
    }
    
    // Initialize contracts
    this.initContracts()
  }

  /**
   * Initialize contract instances
   * STYLUS NOTE: Contract initialization is identical to Solidity contracts
   */
  private initContracts() {
    for (const [name, contractConfig] of Object.entries(this.config.contracts)) {
      const iface = new ethers.Interface(contractConfig.abi)
      const contract = new ethers.Contract(
        contractConfig.address,
        iface,
        this.provider
      )
      this.contracts.set(name, contract)
      console.log(`✅ Initialized contract: ${name} at ${contractConfig.address}`)
    }
  }

  /**
   * Start indexing events
   */
  async start() {
    if (this.isRunning) {
      console.log('⚠️  Indexer is already running')
      return
    }

    this.isRunning = true
    console.log('🔄 Starting event indexer...')

    // Setup event listeners for real-time events
    this.setupEventListeners()

    // Start polling for historical events
    this.startPolling()
  }

  /**
   * Setup event listeners for real-time event indexing
   * STYLUS NOTE: Event listeners work identically for Stylus and Solidity contracts
   */
  private setupEventListeners() {
    for (const [name, contract] of this.contracts.entries()) {
      const contractConfig = this.config.contracts[name]

      // Listen for Transfer events (NFT contract)
      if (contractConfig.abi.some((e: any) => e.name === 'Transfer')) {
        contract.on('Transfer', async (...args) => {
          // Last argument is the event object
          const event = args[args.length - 1]
          await this.handleEvent(name, 'Transfer', event)
        })
        console.log(`👂 Listening for Transfer events on ${name}`)
      }

      // Listen for MessagePosted events (if present)
      if (contractConfig.abi.some((e: any) => e.name === 'MessagePosted')) {
        contract.on('MessagePosted', async (...args) => {
          // Last argument is the event object
          const event = args[args.length - 1]
          await this.handleEvent(name, 'MessagePosted', event)
        })
        console.log(`👂 Listening for MessagePosted events on ${name}`)
      }
    }
  }

  /**
   * Start polling for historical events
   */
  private startPolling() {
    this.pollInterval = setInterval(async () => {
      try {
        await this.processHistoricalEvents()
      } catch (error) {
        console.error('❌ Error processing historical events:', error)
      }
    }, this.config.pollInterval)
  }

  /**
   * Process historical events by querying past blocks
   * STYLUS NOTE: Querying events works identically for Stylus and Solidity contracts
   */
  private async processHistoricalEvents() {
    const currentBlock = await this.provider.getBlockNumber()
    const lastBlock = this.storage.getLastBlock()
    const fromBlock = lastBlock + 1
    const toBlock = currentBlock - this.config.confirmations

    if (fromBlock > toBlock) {
      return // No new blocks to process
    }

    console.log(`📊 Processing blocks ${fromBlock} to ${toBlock}`)

    // Query events for each contract
    for (const [name, contract] of this.contracts.entries()) {
      const contractConfig = this.config.contracts[name]

      // Query Transfer events
      if (contractConfig.abi.some((e: any) => e.name === 'Transfer')) {
        const filter = contract.filters.Transfer()
        const events = await contract.queryFilter(filter, fromBlock, toBlock)
        
        for (const event of events) {
          if (event) {
            await this.handleEvent(name, 'Transfer', event as ethers.Log)
          }
        }
      }

      // Query MessagePosted events
      if (contractConfig.abi.some((e: any) => e.name === 'MessagePosted')) {
        const filter = contract.filters.MessagePosted()
        const events = await contract.queryFilter(filter, fromBlock, toBlock)
        
        for (const event of events) {
          if (event) {
            await this.handleEvent(name, 'MessagePosted', event as ethers.Log)
          }
        }
      }
    }

    // Update last processed block
    this.storage.saveLastBlock(toBlock)
  }

  /**
   * Handle a single event
   * STYLUS NOTE: Event handling is identical for Stylus and Solidity events
   */
  private async handleEvent(
    contractName: string,
    eventName: string,
    event: ethers.Log | any
  ) {
    try {
      const contract = this.contracts.get(contractName)!
      let parsedEvent: ethers.LogDescription | null = null
      let logData: {
        address: string
        blockNumber: number
        blockHash: string
        transactionHash: string
        transactionIndex: number
        index: number
      }

      // Check if event is already parsed (from contract.on) or raw log (from queryFilter)
      if (event && typeof event === 'object' && 'args' in event && 'fragment' in event) {
        // Already parsed event from contract.on() - ethers v6 EventLog
        parsedEvent = event as ethers.LogDescription
        const eventLog = event as any
        logData = {
          address: eventLog.address || this.config.contracts[contractName].address,
          blockNumber: eventLog.blockNumber || 0,
          blockHash: eventLog.blockHash || '',
          transactionHash: eventLog.transactionHash || eventLog.hash || '',
          transactionIndex: eventLog.transactionIndex || 0,
          index: eventLog.index || eventLog.logIndex || 0,
        }
      } else {
        // Raw log from queryFilter, need to parse
        const log = event as ethers.Log
        parsedEvent = contract.interface.parseLog({
          topics: log.topics as string[],
          data: log.data,
        })
        logData = {
          address: log.address,
          blockNumber: log.blockNumber,
          blockHash: log.blockHash || '',
          transactionHash: log.transactionHash,
          transactionIndex: log.transactionIndex,
          index: log.index,
        }
      }

      if (!parsedEvent) {
        console.warn(`⚠️  Could not parse event: ${eventName}`)
        return
      }

      // Get block info if not already available
      let blockHash = logData.blockHash
      if (!blockHash && logData.blockNumber > 0) {
        try {
          const block = await this.provider.getBlock(logData.blockNumber)
          if (block) {
            blockHash = block.hash || ''
          }
        } catch (error) {
          console.warn(`⚠️  Could not fetch block ${logData.blockNumber}:`, error)
        }
      }

      // Store event
      this.storage.saveEvent({
        contract_name: contractName,
        contract_address: logData.address,
        event_name: eventName,
        block_number: logData.blockNumber,
        block_hash: blockHash,
        transaction_hash: logData.transactionHash,
        transaction_index: logData.transactionIndex,
        log_index: logData.index,
        event_data: parsedEvent.args,
        indexed_at: Date.now(),
      })

      console.log(
        `✅ Indexed ${eventName} from ${contractName} ` +
        `(block ${logData.blockNumber}, tx ${logData.transactionHash.slice(0, 10)}...)`
      )
    } catch (error) {
      console.error(`❌ Error handling event ${eventName}:`, error)
    }
  }

  /**
   * Stop indexing
   */
  stop() {
    this.isRunning = false
    if (this.pollInterval) {
      clearInterval(this.pollInterval)
    }
    
    // Remove all event listeners
    for (const contract of this.contracts.values()) {
      contract.removeAllListeners()
    }
    
    console.log('🛑 Indexer stopped')
  }
}
