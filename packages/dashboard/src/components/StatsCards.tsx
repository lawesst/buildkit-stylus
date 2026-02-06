'use client'

import { useEffect, useState } from 'react'

interface Stats {
  totalEvents: number
  eventsByContract: Array<{ contract_name: string; count: number }>
  eventsByType: Array<{ event_name: string; count: number }>
  lastProcessedBlock: number
}

interface StatsCardsProps {
  indexerApi: string
}

export function StatsCards({ indexerApi }: StatsCardsProps) {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [uniqueUsers, setUniqueUsers] = useState<number>(0)
  const [totalMints, setTotalMints] = useState<number>(0)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${indexerApi}/stats`)
        const data = await response.json()
        if (data.success) {
          setStats(data.stats)
          
          // Calculate unique users from Transfer events
          const transferEvents = await fetch(
            `${indexerApi}/events?event=Transfer&limit=1000`
          ).then(r => r.json())
          
          if (transferEvents.success) {
            const uniqueAddresses = new Set<string>()
            transferEvents.events.forEach((event: any) => {
              let eventData: any = typeof event.event_data === 'string' 
                ? JSON.parse(event.event_data) 
                : event.event_data
              
              // Handle array format from indexer (ethers.js returns args as array)
              if (Array.isArray(eventData)) {
                eventData = {
                  from: eventData[0] || '0x0',
                  to: eventData[1] || '0x0',
                  tokenId: eventData[2] || '0',
                }
              }
              
              // Transfer events have 'to' field (recipient)
              if (eventData.to) {
                uniqueAddresses.add(eventData.to.toLowerCase())
              }
            })
            setUniqueUsers(uniqueAddresses.size)
            setTotalMints(transferEvents.events.length)
          }
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
    const interval = setInterval(fetchStats, 10000) // Refresh every 10 seconds
    return () => clearInterval(interval)
  }, [indexerApi])

  if (loading) {
    return (
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="card" style={{ padding: '1.5rem', minHeight: '120px' }}>
            <div style={{ color: '#94a3b8', textAlign: 'center' }}>Loading...</div>
          </div>
        ))}
      </div>
    )
  }

  const cards = [
    {
      title: 'Total Mints',
      value: totalMints.toLocaleString(),
      description: 'NFTs minted from Stylus contract',
      icon: '📈',
      color: '#3b82f6',
    },
    {
      title: 'Unique Users',
      value: uniqueUsers.toLocaleString(),
      description: 'Unique addresses that received NFTs',
      icon: '👥',
      color: '#8b5cf6',
    },
    {
      title: 'Recent Events',
      value: stats?.totalEvents.toLocaleString() || '0',
      description: 'All events indexed from contracts',
      icon: '📋',
      color: '#10b981',
    },
    {
      title: 'Contract Info',
      value: stats?.lastProcessedBlock.toLocaleString() || '0',
      description: 'Most recent block indexed',
      icon: '📝',
      color: '#f59e0b',
    },
  ]

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
      gap: '1rem',
      marginBottom: '1.5rem'
    }}>
      {cards.map((card, index) => (
        <div
          key={index}
          className="card"
          style={{
            padding: '1.5rem',
            background: `linear-gradient(135deg, ${card.color}15 0%, ${card.color}05 100%)`,
            border: `1px solid ${card.color}30`,
            minWidth: 0, // Prevent overflow
            overflow: 'hidden', // Prevent content from overflowing
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '2rem', flexShrink: 0 }}>{card.icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
                {card.title}
              </div>
              <div style={{ 
                fontSize: '1.75rem', 
                fontWeight: '700', 
                color: card.color,
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                lineHeight: '1.2'
              }}>
                {card.value}
              </div>
            </div>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem' }}>
            {card.description}
          </div>
        </div>
      ))}
    </div>
  )
}
