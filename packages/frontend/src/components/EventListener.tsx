'use client'

import { useEffect, useState } from 'react'
import { useAccount, useWatchContractEvent } from 'wagmi'
import { NFT_CONTRACT_ADDRESS, NFT_ABI } from '@/lib/contracts'

interface TransferEvent {
  from: string
  to: string
  tokenId: bigint
  timestamp: Date
}

export function EventListener() {
  const { isConnected } = useAccount()
  const [events, setEvents] = useState<TransferEvent[]>([])

  useWatchContractEvent({
    address: NFT_CONTRACT_ADDRESS as `0x${string}`,
    abi: NFT_ABI,
    eventName: 'Transfer',
    onLogs(logs) {
      const newEvents = logs.map((log) => ({
        from: log.args.from || '0x0',
        to: log.args.to || '0x0',
        tokenId: log.args.tokenId || 0n,
        timestamp: new Date(),
      }))
      setEvents((prev) => [...newEvents, ...prev].slice(0, 10)) // Keep last 10 events
    },
    enabled: NFT_CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000',
  })

  return (
    <div className="card">
      <h2>Transfer Events</h2>

      {NFT_CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000' ? (
        <div className="status info">Contract not deployed yet</div>
      ) : !isConnected ? (
        <div className="status info">Connect wallet to see events</div>
      ) : events.length === 0 ? (
        <div className="status info">No events yet. Mint an NFT to see Transfer events.</div>
      ) : (
        <div className="event-list">
          {events.map((event, index) => (
            <div key={index} className="event-item">
              <div>
                <strong>From:</strong> <span className="address">{event.from}</span>
              </div>
              <div>
                <strong>To:</strong> <span className="address">{event.to}</span>
              </div>
              <div>
                <strong>Token ID:</strong> {event.tokenId.toString()}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
                {event.timestamp.toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
