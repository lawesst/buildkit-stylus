/**
 * REST API for querying indexed events
 * 
 * Exposes endpoints to fetch events indexed from Stylus contracts.
 */

import express from 'express'
import { Storage } from './storage.js'

/**
 * Helper to convert BigInt values to strings for JSON serialization
 */
function serializeBigInt(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj
  }
  
  if (typeof obj === 'bigint') {
    return obj.toString()
  }
  
  if (Array.isArray(obj)) {
    return obj.map(serializeBigInt)
  }
  
  if (typeof obj === 'object') {
    const result: any = {}
    for (const [key, value] of Object.entries(obj)) {
      result[key] = serializeBigInt(value)
    }
    return result
  }
  
  return obj
}

export function createApi(app: express.Application, storage: Storage) {
  // Enable CORS for dashboard
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type')
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200)
    }
    next()
  })
  /**
   * GET /events
   * Query events with optional filters
   * 
   * Query params:
   * - contract: Filter by contract name (e.g., "nft")
   * - event: Filter by event name (e.g., "Transfer")
   * - fromBlock: Start block number
   * - toBlock: End block number
   * - limit: Maximum number of results (default: 100)
   * - offset: Pagination offset (default: 0)
   */
  app.get('/events', (req, res) => {
    try {
      const {
        contract,
        event: eventName,
        fromBlock,
        toBlock,
        limit = '100',
        offset = '0',
      } = req.query

      let query = 'SELECT * FROM events WHERE 1=1'
      const params: any[] = []

      if (contract) {
        query += ' AND contract_name = ?'
        params.push(contract)
      }

      if (eventName) {
        query += ' AND event_name = ?'
        params.push(eventName)
      }

      if (fromBlock) {
        query += ' AND block_number >= ?'
        params.push(parseInt(fromBlock as string))
      }

      if (toBlock) {
        query += ' AND block_number <= ?'
        params.push(parseInt(toBlock as string))
      }

      query += ' ORDER BY block_number DESC, log_index DESC'
      query += ' LIMIT ? OFFSET ?'
      params.push(parseInt(limit as string), parseInt(offset as string))

      const events = storage.getEvents({
        contract: contract as string,
        event: eventName as string,
        fromBlock: fromBlock ? parseInt(fromBlock as string) : undefined,
        toBlock: toBlock ? parseInt(toBlock as string) : undefined,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      })

      res.json({
        success: true,
        count: events.length,
        events: events.map((e: any) => {
          const eventData = typeof e.event_data === 'string' ? JSON.parse(e.event_data) : e.event_data
          return {
            ...e,
            event_data: serializeBigInt(eventData),
          }
        }),
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      })
    }
  })

  /**
   * GET /events/:txHash
   * Get all events for a specific transaction
   */
  app.get('/events/tx/:txHash', (req, res) => {
    try {
      const { txHash } = req.params
      const events = storage.getEventsByTx(txHash)

      res.json({
        success: true,
        transactionHash: txHash,
        count: events.length,
        events: events.map((e: any) => {
          const eventData = typeof e.event_data === 'string' ? JSON.parse(e.event_data) : e.event_data
          return {
            ...e,
            event_data: serializeBigInt(eventData),
          }
        }),
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      })
    }
  })

  /**
   * GET /events/contract/:contractName
   * Get all events for a specific contract
   */
  app.get('/events/contract/:contractName', (req, res) => {
    try {
      const { contractName } = req.params
      const { limit = '100', offset = '0' } = req.query

      const events = storage.getEventsByContract(
        contractName,
        parseInt(limit as string),
        parseInt(offset as string)
      )

      res.json({
        success: true,
        contract: contractName,
        count: events.length,
        events: events.map((e: any) => {
          const eventData = typeof e.event_data === 'string' ? JSON.parse(e.event_data) : e.event_data
          return {
            ...e,
            event_data: serializeBigInt(eventData),
          }
        }),
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      })
    }
  })

  /**
   * GET /stats
   * Get indexing statistics
   */
  app.get('/stats', (req, res) => {
    try {
      const stats = storage.getStats()

      res.json({
        success: true,
        stats,
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      })
    }
  })

  /**
   * GET /health
   * Health check endpoint
   */
  app.get('/health', (req, res) => {
    res.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
    })
  })
}
