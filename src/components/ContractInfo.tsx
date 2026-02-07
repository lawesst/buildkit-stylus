'use client'

import { useChainId } from 'wagmi'
import { arbitrumSepolia } from 'wagmi/chains'

import { NFT_CONTRACT_ADDRESS } from '@/lib/contracts'

export function ContractInfo() {
  const chainId = useChainId()
  const isCorrectNetwork = chainId === arbitrumSepolia.id

  return (
    <div className="card">
      <h2>Contract Information</h2>
      <div className="info-row">
        <span className="info-label">Network:</span>
        <span className="info-value">
          {isCorrectNetwork ? 'Arbitrum Sepolia ✓' : 'Wrong Network'}
        </span>
      </div>
      <div className="info-row">
        <span className="info-label">Chain ID:</span>
        <span className="info-value">{chainId}</span>
      </div>
      <div className="info-row">
        <span className="info-label">Contract Address:</span>
        <span className="address">{NFT_CONTRACT_ADDRESS}</span>
      </div>
      {!isCorrectNetwork && (
        <div className="status error" style={{ marginTop: '1rem' }}>
          Please switch to Arbitrum Sepolia network
        </div>
      )}
      {NFT_CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000' && (
        <div className="status info" style={{ marginTop: '1rem' }}>
          Contract not deployed yet. Deploy using: pnpm stylus:deploy
        </div>
      )}
    </div>
  )
}
