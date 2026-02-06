'use client'

/**
 * Stylus Analytics Dashboard
 * 
 * DATA FLOW: Stylus → Indexer → Dashboard
 * ========================================
 * 
 * 1. STYLUS CONTRACT (Rust/WASM)
 *    - Contract emits events using `evm::log()` (e.g., Transfer events)
 *    - Events are stored in standard EVM logs on Arbitrum Sepolia
 *    - Format is identical to Solidity events - no special handling needed
 * 
 * 2. INDEXER (Node.js + ethers.js)
 *    - Listens to blockchain using `eth_getLogs` RPC calls
 *    - Queries events from Stylus contracts (same as Solidity contracts)
 *    - Parses events using contract ABI (standard JSON ABI format)
 *    - Stores events in SQLite/JSON database
 *    - Exposes REST API at http://localhost:3001
 * 
 * 3. DASHBOARD (Next.js)
 *    - Fetches data from indexer API
 *    - Displays analytics: total mints, unique users, recent events
 *    - Shows contract metadata and statistics
 * 
 * KEY POINT: The entire data flow is identical to Solidity contracts.
 * Stylus events are standard EVM events, so they can be indexed and
 * displayed using the same tools and patterns.
 */

import { useEffect, useState } from 'react'
import { StatsCards } from '@/components/StatsCards'
import { RecentEvents } from '@/components/RecentEvents'
import { ContractMetadata } from '@/components/ContractMetadata'
import { DataFlowDiagram } from '@/components/DataFlowDiagram'

const INDEXER_API = process.env.NEXT_PUBLIC_INDEXER_API || 'http://localhost:3001'

export default function Dashboard() {
  const [indexerAvailable, setIndexerAvailable] = useState<boolean | null>(null)

  useEffect(() => {
    // Test indexer connection with better error handling
    const checkConnection = async () => {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 2000) // 2 second timeout
        
        const response = await fetch(`${INDEXER_API}/health`, {
          method: 'GET',
          mode: 'cors', // Explicitly enable CORS
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
          cache: 'no-store', // Prevent caching
        })
        
        clearTimeout(timeoutId)
        
        if (response.ok) {
          try {
            const data = await response.json()
            if (data && (data.success || data.status === 'healthy')) {
              setIndexerAvailable(true)
              return
            }
          } catch (jsonError) {
            // If response is ok but JSON parsing fails, still consider it connected
            if (response.status === 200) {
              setIndexerAvailable(true)
              return
            }
          }
        }
        setIndexerAvailable(false)
      } catch (error: any) {
        // Network errors, timeouts, etc.
        // Only log non-abort errors to reduce console noise
        if (error.name !== 'AbortError' && error.name !== 'TypeError') {
          console.error('Indexer connection error:', error)
        }
        setIndexerAvailable(false)
      }
    }
    
    // Initial check immediately
    checkConnection()
    // Recheck every 1.5 seconds for faster detection
    const interval = setInterval(checkConnection, 1500)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="container">
      <header style={{ 
        marginBottom: '3rem',
        paddingBottom: '2rem',
        borderBottom: '1px solid rgba(40, 160, 240, 0.2)'
      }}>
        <h1 style={{ margin: 0, marginBottom: '0.5rem' }}>
          <span className="gradient-text">Stylus</span> Analytics Dashboard
        </h1>
        <p style={{ 
          margin: 0, 
          fontSize: '1.1rem', 
          color: 'var(--text-secondary)'
        }}>
          Real-time analytics for Stylus contracts on Arbitrum Sepolia
        </p>
      </header>

      {indexerAvailable === false && (
        <div style={{
          padding: '1.5rem',
          background: 'rgba(40, 160, 240, 0.15)',
          border: '1px solid rgba(40, 160, 240, 0.3)',
          borderRadius: '12px',
          color: 'var(--arb-blue-light)',
          marginBottom: '1.5rem',
          backdropFilter: 'blur(10px)'
        }}>
          <strong style={{ fontSize: '1.1rem', display: 'block', marginBottom: '0.75rem' }}>ℹ️ Indexer Not Connected</strong>
          <p style={{ marginTop: '0.5rem', marginBottom: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            The indexer API is not available. Start it with: <code>cd packages/indexer && pnpm dev</code>
          </p>
          <p style={{ marginTop: '0.5rem', marginBottom: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            The dashboard will show static information below. Analytics will appear once the indexer is running.
          </p>
        </div>
      )}

      <DataFlowDiagram />

      {indexerAvailable === true ? (
        <>
          <div style={{ marginBottom: '1.5rem' }}>
            <StatsCards indexerApi={INDEXER_API} />
          </div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '1.5rem', 
            marginTop: '1.5rem' 
          }}>
            <RecentEvents indexerApi={INDEXER_API} />
            <ContractMetadata />
          </div>
        </>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
          <div className="card">
            <h2>Recent Events</h2>
            <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
              Start the indexer to see events here
            </div>
          </div>
          <ContractMetadata />
        </div>
      )}
    </div>
  )
}
