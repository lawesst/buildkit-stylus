'use client'

import { useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract, useFeeData } from 'wagmi'
import { NFT_CONTRACT_ADDRESS, NFT_ABI } from '@/lib/contracts'

export function MintNFT() {
  const { address, isConnected } = useAccount()
  const [mintTo, setMintTo] = useState('')
  const [mintedTokenId, setMintedTokenId] = useState<string | null>(null)

  // Read next token ID
  const { data: nextTokenId } = useReadContract({
    address: NFT_CONTRACT_ADDRESS as `0x${string}`,
    abi: NFT_ABI,
    functionName: 'nextTokenId',
    query: {
      enabled: NFT_CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000',
    },
  })

  // Get current fee data to ensure proper gas pricing
  const { data: feeData } = useFeeData({
    chainId: 421614, // Arbitrum Sepolia
  })

  // Write contract (mint function)
  const { data: hash, writeContract, isPending, error } = useWriteContract({
    mutation: {
      onError: (error) => {
        console.error('Write contract error:', error)
      },
    },
  })

  // Wait for transaction
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const handleMint = async () => {
    if (!isConnected || !address) {
      alert('Please connect your wallet first')
      return
    }

    const recipient = mintTo || address

    try {
      // Calculate gas prices with proper buffer to avoid "max fee per gas less than block base fee" error
      // Add 20% buffer to maxFeePerGas and 10% to maxPriorityFeePerGas to ensure transaction goes through
      const baseMaxFeePerGas = feeData?.maxFeePerGas || BigInt(20000000) // Default fallback (20 gwei)
      const baseMaxPriorityFeePerGas = feeData?.maxPriorityFeePerGas || BigInt(1000000) // Default fallback (1 gwei)
      
      // Add buffer: 20% for maxFeePerGas, 10% for maxPriorityFeePerGas
      const maxFeePerGas = (baseMaxFeePerGas * BigInt(120)) / BigInt(100)
      const maxPriorityFeePerGas = (baseMaxPriorityFeePerGas * BigInt(110)) / BigInt(100)
      
      // Set reasonable gas limit for mint operation
      // Minting an NFT typically uses ~100k-200k gas, we'll use 300k as a safe upper bound
      const gasLimit = BigInt(300000) // 300k gas limit
      
      console.log('Gas prices:', {
        baseMaxFeePerGas: baseMaxFeePerGas.toString(),
        maxFeePerGas: maxFeePerGas.toString(),
        baseMaxPriorityFeePerGas: baseMaxPriorityFeePerGas.toString(),
        maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
        gasLimit: gasLimit.toString(),
      })

      writeContract({
        address: NFT_CONTRACT_ADDRESS as `0x${string}`,
        abi: NFT_ABI,
        functionName: 'mint',
        args: [recipient as `0x${string}`],
        maxFeePerGas,
        maxPriorityFeePerGas,
        gas: gasLimit, // Set explicit gas limit to prevent wallet from using block gas limit
      })
    } catch (err) {
      console.error('Mint error:', err)
    }
  }

  // Track minted token ID from transaction receipt
  if (isSuccess && hash && !mintedTokenId) {
    // In a real app, you'd parse the Transfer event from the receipt
    // For MVP, we'll just show success
    setMintedTokenId(nextTokenId?.toString() || 'unknown')
  }

  return (
    <div className="card">
      <h2>Mint NFT</h2>
      <p>
        Mint a new NFT
      </p>

      {!isConnected ? (
        <div className="status info">Please connect your wallet first</div>
      ) : (
        <>
          <input
            type="text"
            placeholder={`Recipient address (default: ${address})`}
            value={mintTo}
            onChange={(e) => setMintTo(e.target.value)}
          />

          <button
            onClick={handleMint}
            disabled={isPending || isConfirming || NFT_CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000'}
          >
            {isPending
              ? 'Confirming...'
              : isConfirming
              ? 'Minting...'
              : 'Mint NFT'}
          </button>

          {error && (
            <div className="status error">
              Error: {error.message}
            </div>
          )}

          {isSuccess && (
            <div className="status success">
              <div>NFT minted successfully!</div>
              <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                Transaction: <span className="address">{hash}</span>
              </div>
              {mintedTokenId && (
                <div style={{ marginTop: '0.5rem' }}>
                  Token ID: {mintedTokenId}
                </div>
              )}
            </div>
          )}

          {nextTokenId !== undefined && (
            <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#888' }}>
              Next token ID: {nextTokenId.toString()}
            </div>
          )}
        </>
      )}
    </div>
  )
}
