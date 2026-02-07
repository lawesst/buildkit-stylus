'use client'

import { useEffect, useState } from 'react'

interface ContractMetadataProps {}

export function ContractMetadata({}: ContractMetadataProps) {
  const [metadata, setMetadata] = useState({
    nft: {
      address: '0x1e3d7fd130aaadf17dfafa50370044813854bf53',
      name: 'NFT',
      description: 'Minimal ERC-721-like NFT contract written in Rust for Arbitrum Stylus',
      network: 'Arbitrum Sepolia',
      chainId: 421614,
    },
  })

  return (
    <div className="card">
      <h2>Contract Metadata</h2>
      <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '1rem' }}>
        Information about deployed Stylus contracts
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {Object.entries(metadata).map(([name, contract]) => (
          <div
            key={name}
            style={{
              padding: '1rem',
              background: '#0a0a0a',
              border: '1px solid #2a2a2a',
              borderRadius: '6px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{
                padding: '0.25rem 0.5rem',
                background: '#3b82f6',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: '600',
                color: 'white'
              }}>
                STYLUS
              </span>
              <span style={{ fontSize: '1rem', fontWeight: '600' }}>{contract.name}</span>
            </div>

            <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
              {contract.description}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: '#64748b' }}>Network:</span>
                <span style={{ color: '#e0e0e0' }}>{contract.network}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: '#64748b' }}>Chain ID:</span>
                <span style={{ color: '#e0e0e0' }}>{contract.chainId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', alignItems: 'center' }}>
                <span style={{ color: '#64748b' }}>Address:</span>
                <a
                  href={`https://sepolia.arbiscan.io/address/${contract.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="address"
                  style={{ fontSize: '0.8rem' }}
                >
                  {contract.address.slice(0, 10)}...{contract.address.slice(-8)}
                </a>
              </div>
            </div>

            <div style={{
              marginTop: '0.75rem',
              padding: '0.75rem',
              background: '#0f1419',
              border: '1px solid #1e3a5f',
              borderRadius: '4px',
              fontSize: '0.8rem',
              color: '#94a3b8',
              lineHeight: '1.6'
            }}>
              <strong style={{ color: '#60a5fa' }}>STYLUS NOTE:</strong> This contract is written in Rust
              and compiled to WASM, but from the indexer&apos;s perspective, it works exactly like a Solidity
              contract. Events are standard EVM events, ABIs are standard JSON ABIs.
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
