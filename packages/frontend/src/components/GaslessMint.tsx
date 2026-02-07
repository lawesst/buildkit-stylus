'use client'

/**
 * Gasless Message Posting Component - Archetype 2
 * 
 * Calls the real Stylus gasless contract's post_message function.
 * This demonstrates real Stylus + ERC-4337 Account Abstraction compatibility.
 * 
 * NOTE: While the contract is designed for AA/paymaster sponsorship,
 * this frontend currently calls it with a standard transaction.
 * In a full AA implementation, you would use a paymaster to sponsor gas.
 */

import { useState, useEffect } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useFeeData } from 'wagmi'
import { GASLESS_CONTRACT_ADDRESS, GASLESS_ABI } from '@/lib/contracts'

type FlowState = 'idle' | 'posting' | 'confirming' | 'success' | 'error'

export function GaslessMint() {
  const { address, isConnected } = useAccount()
  const [message, setMessage] = useState('')
  const [flowState, setFlowState] = useState<FlowState>('idle')

  // Get current fee data for gas pricing
  const { data: feeData } = useFeeData({
    chainId: 421614, // Arbitrum Sepolia
  })

  // Write contract (post_message function)
  const { data: hash, writeContract, isPending, error } = useWriteContract({
    mutation: {
      onError: (error) => {
        console.error('Post message error:', error)
        setFlowState('error')
      },
    },
  })

  // Wait for transaction
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  // Update flow state based on transaction status
  useEffect(() => {
    if (isPending) {
      setFlowState('posting')
    } else if (isConfirming) {
      setFlowState('confirming')
    } else if (isSuccess) {
      setFlowState('success')
    } else if (error) {
      setFlowState('error')
    } else if (!hash && !isPending && !isConfirming) {
      setFlowState('idle')
    }
  }, [isPending, isConfirming, isSuccess, error, hash])

  const handlePostMessage = async () => {
    if (!isConnected || !address) {
      alert('Please connect your wallet first')
      return
    }

    if (!message.trim()) {
      alert('Please enter a message')
      return
    }

    if (GASLESS_CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000') {
      alert('Gasless contract not deployed yet. Please deploy it first.')
      return
    }

    try {
      setFlowState('posting')

      // Calculate gas prices with buffer
      const baseMaxFeePerGas = feeData?.maxFeePerGas || BigInt(20000000)
      const baseMaxPriorityFeePerGas = feeData?.maxPriorityFeePerGas || BigInt(1000000)
      
      const maxFeePerGas = (baseMaxFeePerGas * BigInt(120)) / BigInt(100)
      const maxPriorityFeePerGas = (baseMaxPriorityFeePerGas * BigInt(110)) / BigInt(100)
      
      // Gas limit for post_message (string operations can be gas-intensive)
      const gasLimit = BigInt(200000) // 200k gas limit

      writeContract({
        address: GASLESS_CONTRACT_ADDRESS as `0x${string}`,
        abi: GASLESS_ABI,
        functionName: 'post_message',
        args: [message.trim()],
        maxFeePerGas,
        maxPriorityFeePerGas,
        gas: gasLimit,
      })
    } catch (err) {
      console.error('Post message error:', err)
      setFlowState('error')
    }
  }

  const reset = () => {
    setFlowState('idle')
    setMessage('')
  }

  return (
    <div className="card">
      <h2>Post Gasless Message</h2>
      <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '1.5rem' }}>
        Post a message to the Stylus gasless contract. This contract is designed for
        ERC-4337 Account Abstraction, where a paymaster would sponsor the gas fees.
      </p>

      {GASLESS_CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000' && (
        <div style={{
          padding: '1rem',
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '8px',
          color: '#EF4444',
          marginBottom: '1rem'
        }}>
          <strong>Contract Not Deployed</strong>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem' }}>
            The gasless contract has not been deployed yet. Deploy it using:
            <code style={{ display: 'block', marginTop: '0.5rem', padding: '0.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '4px' }}>
              cd packages/stylus-contracts && bash scripts/deploy.sh gasless sepolia
            </code>
          </p>
        </div>
      )}

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
          Message
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message (max 1000 characters)"
          maxLength={1000}
          rows={4}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-secondary)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)',
            fontSize: '0.9rem',
            fontFamily: 'inherit',
            resize: 'vertical',
          }}
        />
        <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem' }}>
          {message.length} / 1000 characters
        </div>
      </div>

      {flowState === 'success' && hash && (
        <div style={{
          padding: '1rem',
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '8px',
          color: '#10b981',
          marginBottom: '1rem'
        }}>
          <strong>Message Posted Successfully!</strong>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem' }}>
            Transaction: <a
              href={`https://sepolia.arbiscan.io/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#10b981', textDecoration: 'underline' }}
            >
              {hash.slice(0, 10)}...{hash.slice(-8)}
            </a>
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: '0.75rem',
              padding: '0.5rem 1rem',
              background: 'transparent',
              border: '1px solid #10b981',
              borderRadius: '6px',
              color: '#10b981',
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            Post Another Message
          </button>
        </div>
      )}

      {flowState === 'error' && (
        <div style={{
          padding: '1rem',
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '8px',
          color: '#EF4444',
          marginBottom: '1rem'
        }}>
          <strong>Error Posting Message</strong>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem' }}>
            {error?.message || 'An error occurred while posting the message'}
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: '0.75rem',
              padding: '0.5rem 1rem',
              background: 'transparent',
              border: '1px solid #EF4444',
              borderRadius: '6px',
              color: '#EF4444',
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            Try Again
          </button>
        </div>
      )}

      <button
        onClick={handlePostMessage}
        disabled={!isConnected || flowState === 'posting' || flowState === 'confirming' || !message.trim()}
        style={{
          width: '100%',
          padding: '0.875rem 1.5rem',
          background: flowState === 'posting' || flowState === 'confirming'
            ? 'var(--bg-tertiary)'
            : 'var(--arb-gradient)',
          color: 'white',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: flowState === 'posting' || flowState === 'confirming' || !message.trim()
            ? 'not-allowed'
            : 'pointer',
          transition: 'all var(--transition-base)',
          opacity: flowState === 'posting' || flowState === 'confirming' || !message.trim() ? 0.6 : 1,
        }}
      >
        {flowState === 'posting' && 'Posting Message...'}
        {flowState === 'confirming' && 'Confirming Transaction...'}
        {flowState === 'idle' && 'Post Message'}
        {flowState === 'success' && 'Message Posted'}
        {flowState === 'error' && 'Post Message'}
      </button>

      {!isConnected && (
        <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#94a3b8', textAlign: 'center' }}>
          Connect your wallet to post a message
        </p>
      )}

      <div style={{
        marginTop: '2rem',
        padding: '1.5rem',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-secondary)',
        borderRadius: 'var(--radius-md)',
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '0.75rem', fontSize: '1rem' }}>
          How It Works
        </h3>
        <div style={{ fontSize: '0.85rem', lineHeight: '1.8', color: '#94a3b8' }}>
          <p style={{ marginBottom: '0.75rem' }}>
            <strong style={{ color: 'var(--text-primary)' }}>1. Contract Call:</strong> Your message
            is sent to the Stylus gasless contract's <code>post_message()</code> function.
          </p>
          <p style={{ marginBottom: '0.75rem' }}>
            <strong style={{ color: 'var(--text-primary)' }}>2. Event Emission:</strong> The contract
            emits a <code>MessagePosted</code> event with your address and message.
          </p>
          <p style={{ marginBottom: '0.75rem' }}>
            <strong style={{ color: 'var(--text-primary)' }}>3. Indexing:</strong> The indexer
            picks up the event and stores it for analytics.
          </p>
          <p style={{ margin: 0 }}>
            <strong style={{ color: 'var(--text-primary)' }}>4. ERC-4337 Ready:</strong> This contract
            is designed to work with Account Abstraction, where a paymaster would sponsor gas fees,
            allowing users to interact without holding ETH.
          </p>
        </div>
      </div>
    </div>
  )
}
