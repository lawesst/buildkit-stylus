'use client'

import { useEffect, useState } from 'react'

interface Event {
  id: number
  contract_name: string
  contract_address: string
  event_name: string
  block_number: number
  transaction_hash: string
  event_data: any
  indexed_at: number
}

interface RecentEventsProps {
  indexerApi: string
}

export function RecentEvents({ indexerApi }: RecentEventsProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setError(null)
        const response = await fetch(`${indexerApi}/events?limit=10`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const data = await response.json()
        if (data.success) {
          setEvents(data.events || [])
        } else {
          setError(data.error || 'Failed to fetch events')
        }
      } catch (error) {
        console.error('Error fetching events:', error)
        setError(error instanceof Error ? error.message : 'Failed to connect to indexer')
        setEvents([])
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
    const interval = setInterval(fetchEvents, 5000) // Refresh every 5 seconds
    return () => clearInterval(interval)
  }, [indexerApi])

  if (loading) {
    return (
      <div className="card">
        <h2>Recent Events</h2>
        <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
          Loading events...
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h2>Recent Events</h2>
      <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '1rem' }}>
        Latest events indexed from Stylus contracts
      </p>

      {error ? (
        <div style={{ 
          padding: '1.5rem', 
          textAlign: 'center', 
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '8px',
          color: '#EF4444'
        }}>
          <strong>Error loading events</strong>
          <p style={{ marginTop: '0.5rem', marginBottom: 0, fontSize: '0.9rem' }}>
            {error}
          </p>
        </div>
      ) : events.length === 0 ? (
        <div style={{ 
          padding: '2rem', 
          textAlign: 'center',
          background: 'rgba(40, 160, 240, 0.05)',
          border: '1px solid rgba(40, 160, 240, 0.2)',
          borderRadius: '8px',
          color: 'var(--text-secondary)'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📭</div>
          <strong style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            No events indexed yet
          </strong>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            Mint an NFT from the frontend to see Transfer events here!
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {events.map((event) => {
            let eventData: any = typeof event.event_data === 'string'
              ? JSON.parse(event.event_data)
              : event.event_data
            
            // Handle array format from indexer (ethers.js returns args as array)
            if (Array.isArray(eventData) && event.event_name === 'Transfer') {
              eventData = {
                from: eventData[0] || '0x0',
                to: eventData[1] || '0x0',
                tokenId: eventData[2] || '0',
              }
            }

            return (
              <div
                key={event.id}
                style={{
                  padding: '1rem',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-secondary)',
                  borderRadius: 'var(--radius-md)',
                  transition: 'all var(--transition-base)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-secondary)'
                  e.currentTarget.style.borderColor = 'var(--border-primary)'
                  e.currentTarget.style.transform = 'translateX(4px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--bg-tertiary)'
                  e.currentTarget.style.borderColor = 'var(--border-secondary)'
                  e.currentTarget.style.transform = 'translateX(0)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        background: event.event_name === 'Transfer' ? 'var(--arb-gradient)' : 'linear-gradient(135deg, #9D4EDD 0%, #7C3AED 100%)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: 'white'
                      }}>
                        {event.event_name}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                        {event.contract_name}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Block #{event.block_number.toLocaleString()}
                    </div>
                  </div>
                  <a
                    href={`https://sepolia.arbiscan.io/tx/${event.transaction_hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--arb-blue-light)',
                      textDecoration: 'none',
                      fontWeight: '500',
                      transition: 'color var(--transition-base)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                    onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                  >
                    View →
                  </a>
                </div>

                {/* Event Data */}
                <div style={{
                  marginTop: '0.75rem',
                  padding: '0.75rem',
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  fontFamily: 'JetBrains Mono, Courier New, monospace',
                  color: 'var(--text-secondary)',
                  overflowX: 'auto',
                  border: '1px solid var(--border-secondary)'
                }}>
                  {event.event_name === 'Transfer' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <div>
                        <span style={{ color: 'var(--text-tertiary)' }}>from:</span>{' '}
                        <span className="address">{eventData.from || 'N/A'}</span>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-tertiary)' }}>to:</span>{' '}
                        <span className="address">{eventData.to || 'N/A'}</span>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-tertiary)' }}>tokenId:</span>{' '}
                        <span style={{ color: 'var(--arb-blue-light)' }}>{eventData.tokenId?.toString() || eventData.token_id?.toString() || 'N/A'}</span>
                      </div>
                    </div>
                  )}
                  {event.event_name === 'MessagePosted' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <div>
                        <span style={{ color: 'var(--text-tertiary)' }}>sender:</span>{' '}
                        <span className="address">{eventData.sender || 'N/A'}</span>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-tertiary)' }}>message:</span>{' '}
                        <span>{eventData.message || 'N/A'}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
