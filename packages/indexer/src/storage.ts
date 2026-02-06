/**
 * Storage abstraction for events
 * Supports both SQLite and JSON file storage
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'

export interface Event {
  id: number
  contract_name: string
  contract_address: string
  event_name: string
  block_number: number
  block_hash: string
  transaction_hash: string
  transaction_index: number
  log_index: number
  event_data: any
  indexed_at: number
}

export interface Storage {
  saveEvent(event: Omit<Event, 'id'>): void
  getEvents(filters?: {
    contract?: string
    event?: string
    fromBlock?: number
    toBlock?: number
    limit?: number
    offset?: number
  }): Event[]
  getEventsByTx(txHash: string): Event[]
  getEventsByContract(contractName: string, limit?: number, offset?: number): Event[]
  getStats(): {
    totalEvents: number
    eventsByContract: Array<{ contract_name: string; count: number }>
    eventsByType: Array<{ event_name: string; count: number }>
    lastProcessedBlock: number
  }
  saveLastBlock(blockNumber: number): void
  getLastBlock(): number
}

/**
 * JSON file-based storage
 * Simple alternative to SQLite that doesn't require native compilation
 */
export class JsonStorage implements Storage {
  private events: Event[] = []
  private lastId = 0
  private lastBlock = 0
  private filePath: string
  private statePath: string

  constructor(databasePath: string) {
    // Convert database path to JSON file path
    const basePath = databasePath.replace(/\.db$/, '')
    this.filePath = `${basePath}_events.json`
    this.statePath = `${basePath}_state.json`

    // Ensure directory exists
    const dir = dirname(this.filePath)
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true })
    }

    // Load existing data
    this.load()
  }

  private load() {
    // Load events
    if (existsSync(this.filePath)) {
      try {
        const data = readFileSync(this.filePath, 'utf-8')
        this.events = JSON.parse(data)
        this.lastId = Math.max(0, ...this.events.map(e => e.id))
      } catch (error) {
        console.warn('⚠️  Could not load events file, starting fresh')
        this.events = []
      }
    }

    // Load state
    if (existsSync(this.statePath)) {
      try {
        const state = JSON.parse(readFileSync(this.statePath, 'utf-8'))
        this.lastBlock = state.lastBlock || 0
      } catch (error) {
        console.warn('⚠️  Could not load state file')
      }
    }
  }

  private save() {
    try {
      writeFileSync(this.filePath, JSON.stringify(this.events, null, 2))
      writeFileSync(this.statePath, JSON.stringify({ lastBlock: this.lastBlock }, null, 2))
    } catch (error) {
      console.error('❌ Error saving to JSON file:', error)
    }
  }

  saveEvent(event: Omit<Event, 'id'>): void {
    // Check for duplicates
    const exists = this.events.some(
      e => e.transaction_hash === event.transaction_hash && e.log_index === event.log_index
    )
    if (exists) {
      return
    }

    this.lastId++
    const newEvent: Event = {
      id: this.lastId,
      ...event,
    }
    this.events.push(newEvent)
    this.save()
  }

  getEvents(filters?: {
    contract?: string
    event?: string
    fromBlock?: number
    toBlock?: number
    limit?: number
    offset?: number
  }): Event[] {
    let filtered = [...this.events]

    if (filters?.contract) {
      filtered = filtered.filter(e => e.contract_name === filters.contract)
    }

    if (filters?.event) {
      filtered = filtered.filter(e => e.event_name === filters.event)
    }

    if (filters?.fromBlock !== undefined) {
      filtered = filtered.filter(e => e.block_number >= filters.fromBlock!)
    }

    if (filters?.toBlock !== undefined) {
      filtered = filtered.filter(e => e.block_number <= filters.toBlock!)
    }

    // Sort by block number descending
    filtered.sort((a, b) => b.block_number - a.block_number || b.log_index - a.log_index)

    // Apply pagination
    const offset = filters?.offset || 0
    const limit = filters?.limit || 100

    return filtered.slice(offset, offset + limit)
  }

  getEventsByTx(txHash: string): Event[] {
    return this.events
      .filter(e => e.transaction_hash === txHash)
      .sort((a, b) => a.log_index - b.log_index)
  }

  getEventsByContract(contractName: string, limit = 100, offset = 0): Event[] {
    return this.events
      .filter(e => e.contract_name === contractName)
      .sort((a, b) => b.block_number - a.block_number)
      .slice(offset, offset + limit)
  }

  getStats() {
    const eventsByContract = new Map<string, number>()
    const eventsByType = new Map<string, number>()

    for (const event of this.events) {
      eventsByContract.set(
        event.contract_name,
        (eventsByContract.get(event.contract_name) || 0) + 1
      )
      eventsByType.set(event.event_name, (eventsByType.get(event.event_name) || 0) + 1)
    }

    return {
      totalEvents: this.events.length,
      eventsByContract: Array.from(eventsByContract.entries()).map(([name, count]) => ({
        contract_name: name,
        count,
      })),
      eventsByType: Array.from(eventsByType.entries()).map(([name, count]) => ({
        event_name: name,
        count,
      })),
      lastProcessedBlock: this.lastBlock,
    }
  }

  saveLastBlock(blockNumber: number): void {
    this.lastBlock = blockNumber
    this.save()
  }

  getLastBlock(): number {
    return this.lastBlock
  }
}

/**
 * SQLite storage (if better-sqlite3 is available)
 */
export class SqliteStorage implements Storage {
  constructor(private db: any) {}

  saveEvent(event: Omit<Event, 'id'>): void {
    const stmt = this.db.prepare(`
      INSERT OR IGNORE INTO events (
        contract_name, contract_address, event_name,
        block_number, block_hash, transaction_hash,
        transaction_index, log_index, event_data, indexed_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    stmt.run(
      event.contract_name,
      event.contract_address,
      event.event_name,
      event.block_number,
      event.block_hash,
      event.transaction_hash,
      event.transaction_index,
      event.log_index,
      typeof event.event_data === 'string' ? event.event_data : JSON.stringify(event.event_data),
      event.indexed_at
    )
  }

  getEvents(filters?: {
    contract?: string
    event?: string
    fromBlock?: number
    toBlock?: number
    limit?: number
    offset?: number
  }): Event[] {
    let query = 'SELECT * FROM events WHERE 1=1'
    const params: any[] = []

    if (filters?.contract) {
      query += ' AND contract_name = ?'
      params.push(filters.contract)
    }

    if (filters?.event) {
      query += ' AND event_name = ?'
      params.push(filters.event)
    }

    if (filters?.fromBlock !== undefined) {
      query += ' AND block_number >= ?'
      params.push(filters.fromBlock)
    }

    if (filters?.toBlock !== undefined) {
      query += ' AND block_number <= ?'
      params.push(filters.toBlock)
    }

    query += ' ORDER BY block_number DESC, log_index DESC'
    query += ' LIMIT ? OFFSET ?'
    params.push(filters?.limit || 100, filters?.offset || 0)

    const rows = this.db.prepare(query).all(...params) as any[]
    return rows.map(row => ({
      ...row,
      event_data: typeof row.event_data === 'string' ? JSON.parse(row.event_data) : row.event_data,
    }))
  }

  getEventsByTx(txHash: string): Event[] {
    const rows = this.db
      .prepare('SELECT * FROM events WHERE transaction_hash = ? ORDER BY log_index')
      .all(txHash) as any[]
    return rows.map(row => ({
      ...row,
      event_data: typeof row.event_data === 'string' ? JSON.parse(row.event_data) : row.event_data,
    }))
  }

  getEventsByContract(contractName: string, limit = 100, offset = 0): Event[] {
    const rows = this.db
      .prepare(
        'SELECT * FROM events WHERE contract_name = ? ORDER BY block_number DESC LIMIT ? OFFSET ?'
      )
      .all(contractName, limit, offset) as any[]
    return rows.map(row => ({
      ...row,
      event_data: typeof row.event_data === 'string' ? JSON.parse(row.event_data) : row.event_data,
    }))
  }

  getStats() {
    const totalEvents = this.db.prepare('SELECT COUNT(*) as count FROM events').get() as {
      count: number
    }

    const eventsByContract = this.db
      .prepare('SELECT contract_name, COUNT(*) as count FROM events GROUP BY contract_name')
      .all() as Array<{ contract_name: string; count: number }>

    const eventsByType = this.db
      .prepare('SELECT event_name, COUNT(*) as count FROM events GROUP BY event_name')
      .all() as Array<{ event_name: string; count: number }>

    const lastBlock = this.db
      .prepare('SELECT value FROM indexer_state WHERE key = ?')
      .get('last_block') as { value: string } | undefined

    return {
      totalEvents: totalEvents.count,
      eventsByContract,
      eventsByType,
      lastProcessedBlock: lastBlock ? parseInt(lastBlock.value) : 0,
    }
  }

  saveLastBlock(blockNumber: number): void {
    this.db
      .prepare('INSERT OR REPLACE INTO indexer_state (key, value) VALUES (?, ?)')
      .run('last_block', blockNumber.toString())
  }

  getLastBlock(): number {
    const row = this.db
      .prepare('SELECT value FROM indexer_state WHERE key = ?')
      .get('last_block') as { value: string } | undefined
    return row ? parseInt(row.value) : 0
  }
}

/**
 * Create storage instance (SQLite if available, otherwise JSON)
 */
export function createStorage(databasePath: string): Storage {
  try {
    // Try to use SQLite
    const Database = require('better-sqlite3')
    const db = new Database(databasePath)
    
    // Initialize schema
    db.exec(`
      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        contract_name TEXT NOT NULL,
        contract_address TEXT NOT NULL,
        event_name TEXT NOT NULL,
        block_number INTEGER NOT NULL,
        block_hash TEXT NOT NULL,
        transaction_hash TEXT NOT NULL,
        transaction_index INTEGER NOT NULL,
        log_index INTEGER NOT NULL,
        event_data TEXT NOT NULL,
        indexed_at INTEGER NOT NULL,
        UNIQUE(transaction_hash, log_index)
      )
    `)

    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_contract ON events(contract_address);
      CREATE INDEX IF NOT EXISTS idx_event_name ON events(event_name);
      CREATE INDEX IF NOT EXISTS idx_block_number ON events(block_number);
      CREATE INDEX IF NOT EXISTS idx_transaction_hash ON events(transaction_hash);
    `)

    db.exec(`
      CREATE TABLE IF NOT EXISTS indexer_state (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      )
    `)

    console.log('💾 Using SQLite storage')
    return new SqliteStorage(db)
  } catch (error) {
    console.log('💾 SQLite not available, using JSON file storage')
    return new JsonStorage(databasePath)
  }
}
