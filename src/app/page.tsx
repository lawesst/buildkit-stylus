'use client'

import Link from 'next/link'
import { WalletConnect } from '@/components/WalletConnect'
import { ContractInfo } from '@/components/ContractInfo'
import { MintNFT } from '@/components/MintNFT'
import { EventListener } from '@/components/EventListener'

export default function Home() {
  return (
    <div className="container">
      {/* Header */}
      <header style={{ 
        marginBottom: '2rem',
        paddingBottom: '1.5rem',
        borderBottom: '1px solid rgba(40, 160, 240, 0.2)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ flex: '1 1 200px', minWidth: 0 }}>
            <h1 style={{ margin: 0, marginBottom: '0.5rem', fontSize: 'clamp(1.5rem, 5vw, 2.5rem)' }}>
              BuildKit <span className="gradient-text">Stylus</span>
            </h1>
            <p style={{ 
              margin: 0, 
              color: 'var(--text-secondary)',
              fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)'
            }}>
              Developer Infrastructure for Arbitrum
            </p>
          </div>
          <div style={{ 
            display: 'flex', 
            gap: '0.75rem', 
            flexWrap: 'wrap',
            width: '100%',
            maxWidth: '100%'
          }}>
            <Link 
              href="/gasless"
              style={{
                padding: '0.625rem 1.25rem',
                background: 'linear-gradient(135deg, #28A0F0 0%, #9D4EDD 100%)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: 'clamp(0.85rem, 2vw, 0.9rem)',
                fontWeight: '600',
                transition: 'all 0.25s ease',
                boxShadow: '0 4px 12px rgba(40, 160, 240, 0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                flex: '1 1 auto',
                minWidth: '120px',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(40, 160, 240, 0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(40, 160, 240, 0.3)'
              }}
            >
              Gasless Flow
            </Link>
            <Link
              href="/dashboard"
              style={{
                padding: '0.625rem 1.25rem',
                background: 'rgba(40, 160, 240, 0.1)',
                border: '1px solid rgba(40, 160, 240, 0.3)',
                color: 'var(--arb-blue-light)',
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: 'clamp(0.85rem, 2vw, 0.9rem)',
                fontWeight: '600',
                transition: 'all 0.25s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                flex: '1 1 auto',
                minWidth: '120px',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(40, 160, 240, 0.2)'
                e.currentTarget.style.borderColor = 'var(--arb-blue)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(40, 160, 240, 0.1)'
                e.currentTarget.style.borderColor = 'rgba(40, 160, 240, 0.3)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              Analytics
            </Link>
          </div>
        </div>
      </header>


      <WalletConnect />

      <ContractInfo />

      <MintNFT />

      <EventListener />
    </div>
  )
}
