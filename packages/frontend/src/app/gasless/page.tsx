'use client'

import Link from 'next/link'
import { WalletConnect } from '@/components/WalletConnect'
import { ContractInfo } from '@/components/ContractInfo'
import { GaslessMint } from '@/components/GaslessMint'


export default function GaslessPage() {
  return (
    <div className="container">
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <h1 style={{ margin: 0 }}>Gasless Stylus Interactions</h1>
          <Link 
            href="/"
            style={{
              padding: '0.5rem 1rem',
              background: '#1a1a1a',
              color: '#e0e0e0',
              textDecoration: 'none',
              borderRadius: '6px',
              fontSize: '0.9rem',
              fontWeight: '600',
              border: '1px solid #2a2a2a',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#2a2a2a'
              e.currentTarget.style.borderColor = '#3a3a3a'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#1a1a1a'
              e.currentTarget.style.borderColor = '#2a2a2a'
            }}
          >
            ← Back to Home
          </Link>
        </div>
        <p style={{ fontSize: '1.1rem', color: '#94a3b8', marginTop: '0.5rem' }}>
          Experience gasless transactions with Stylus contracts using ERC-4337 Account Abstraction.
          No ETH required - gas is sponsored by a paymaster contract.
        </p>
      </div>

      <WalletConnect />

      <ContractInfo />

      <GaslessMint />

      <div className="card" style={{ background: '#0f1419', borderColor: '#1e3a5f' }}>
        <h3 style={{ marginBottom: '1rem', color: '#60a5fa' }}>How It Works</h3>
        <div style={{ fontSize: '0.9rem', lineHeight: '1.8', color: '#94a3b8' }}>
          <p style={{ marginBottom: '1rem' }}>
            <strong style={{ color: '#e0e0e0' }}>1. UserOperation Construction:</strong> Your transaction intent is wrapped
            in a UserOperation object, which includes the contract call data, gas limits, and
            paymaster information.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            <strong style={{ color: '#e0e0e0' }}>2. Paymaster Sponsorship:</strong> A paymaster contract validates your
            transaction and agrees to sponsor the gas fees. This happens off-chain before
            submission to reduce costs.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            <strong style={{ color: '#e0e0e0' }}>3. Bundler Aggregation:</strong> A bundler service collects multiple
            UserOperations and submits them as a single transaction to the EntryPoint contract.
          </p>
          <p>
            <strong style={{ color: '#e0e0e0' }}>4. Execution:</strong> The EntryPoint contract validates signatures,
            calls the paymaster to pay for gas, and executes your Stylus contract call. You
            get your NFT without spending any ETH!
          </p>
        </div>
      </div>
    </div>
  )
}
