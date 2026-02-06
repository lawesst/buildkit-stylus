'use client'

/**
 * Gasless Mint Component - ERC-4337 Account Abstraction Demo
 * 
 * This is a SIMULATION/DEMO. A full ERC-4337 implementation would require
 * UserOperation construction, paymaster integration, and bundler service.
 */

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { NFT_CONTRACT_ADDRESS } from '@/lib/contracts'

type FlowState = 'idle' | 'building' | 'signing' | 'submitting' | 'success' | 'error'

export function GaslessMint() {
  const { address, isConnected } = useAccount()
  const [recipient, setRecipient] = useState('')
  const [flowState, setFlowState] = useState<FlowState>('idle')
  const [userOpHash, setUserOpHash] = useState<string | null>(null)
  const [txHash, setTxHash] = useState<string | null>(null)

  /**
   * Simulate the gasless mint flow
   * 
   * In a real ERC-4337 implementation, this would:
   * 1. Build UserOperation with:
   *    - sender: User's smart contract wallet address
   *    - nonce: Current nonce from the wallet
   *    - callData: Encoded mint() function call
   *    - callGasLimit: Estimated gas for the call
   *    - verificationGasLimit: Gas for signature verification
   *    - preVerificationGas: Gas for UserOperation overhead
   *    - maxFeePerGas: Maximum fee user is willing to pay
   *    - maxPriorityFeePerGas: Priority fee
   *    - paymasterAndData: Paymaster address + signature (if sponsored)
   *    - signature: User's signature over the UserOperation
   * 
   * 2. Send UserOperation to bundler via:
   *    - eth_sendUserOperation RPC method
   *    - Or use a library like @account-abstraction/sdk
   * 
   * 3. Bundler aggregates and submits to EntryPoint
   * 
   * 4. EntryPoint validates and executes:
   *    - Validates paymaster signature
   *    - Calls paymaster.validatePaymasterUserOp()
   *    - Executes the contract call (mint function)
   *    - Pays gas from paymaster's balance
   * 
   * For this demo, we simulate the steps with delays.
   */
  const handleGaslessMint = async () => {
    if (!isConnected || !address) {
      alert('Please connect your wallet first')
      return
    }

    const mintTo = recipient || address

    try {
      // Step 1: Build UserOperation
      setFlowState('building')
      setUserOpHash(null)
      setTxHash(null)

      // Simulate UserOperation construction
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // In real implementation:
      // const userOp = await buildUserOperation({
      //   sender: smartWalletAddress,
      //   callData: encodeFunctionData({
      //     abi: NFT_ABI,
      //     functionName: 'mint',
      //     args: [mintTo],
      //   }),
      //   paymasterAndData: paymasterAddress + paymasterSignature,
      // })
      
      const simulatedUserOpHash = `0x${Array.from({ length: 64 }, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('')}`

      // Step 2: Sign UserOperation (simulated)
      setFlowState('signing')
      await new Promise(resolve => setTimeout(resolve, 600))

      // In real implementation:
      // const signature = await signUserOperation(userOp, privateKey)
      // userOp.signature = signature

      // Step 3: Submit to bundler
      setFlowState('submitting')
      setUserOpHash(simulatedUserOpHash)

      // Simulate bundler processing
      await new Promise(resolve => setTimeout(resolve, 1500))

      // In real implementation:
      // const userOpHash = await bundler.sendUserOperation(userOp)
      // const receipt = await bundler.waitForUserOperation(userOpHash)

      // Simulate transaction hash
      const simulatedTxHash = `0x${Array.from({ length: 64 }, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('')}`

      setTxHash(simulatedTxHash)
      setFlowState('success')
    } catch (error) {
      console.error('Gasless mint error:', error)
      setFlowState('error')
    }
  }

  const reset = () => {
    setFlowState('idle')
    setUserOpHash(null)
    setTxHash(null)
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <h2 style={{ margin: 0 }}>Gasless Mint</h2>
        <span style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '0.25rem 0.75rem',
          borderRadius: '12px',
          fontSize: '0.75rem',
          fontWeight: '600'
        }}>
          ERC-4337 Demo
        </span>
      </div>

      <div style={{ 
        background: '#0f1419',
        border: '1px solid #1e3a5f',
        borderRadius: '6px',
        padding: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          marginBottom: '0.5rem',
          color: '#60a5fa'
        }}>
          <strong>Gas Sponsored on Arbitrum (Demo)</strong>
        </div>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
          This is a <strong style={{ color: '#fbbf24' }}>SIMULATION</strong> of ERC-4337 Account Abstraction.
          A paymaster contract would sponsor the gas fees, so you wouldn&apos;t need ETH.
        </p>
        <div style={{ 
          fontSize: '0.85rem', 
          color: '#fbbf24',
          padding: '0.5rem',
          background: '#1a1a1a',
          borderRadius: '4px',
          border: '1px solid #3a2a00'
        }}>
          This demo does not execute real transactions. Use the regular &quot;Mint NFT&quot; button for actual minting.
        </div>
      </div>

      {!isConnected ? (
        <div className="status info">
          Please connect your wallet first to use gasless transactions
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              Recipient Address
            </label>
            <input
              type="text"
              placeholder={`${address} (your address)`}
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: '#0a0a0a',
                border: '1px solid #2a2a2a',
                borderRadius: '6px',
                color: '#e0e0e0',
                fontSize: '0.9rem'
              }}
            />
          </div>

          <button
            onClick={flowState === 'success' ? reset : handleGaslessMint}
            disabled={
              flowState === 'building' || 
              flowState === 'signing' || 
              flowState === 'submitting' ||
              NFT_CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000'
            }
            style={{
              width: '100%',
              padding: '0.75rem 1.5rem',
              background: flowState === 'success' 
                ? '#22c55e' 
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '6px',
              color: 'white',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: flowState === 'idle' || flowState === 'success' ? 'pointer' : 'not-allowed',
              opacity: (flowState === 'building' || flowState === 'signing' || flowState === 'submitting') ? 0.7 : 1,
              transition: 'all 0.2s'
            }}
          >
            {flowState === 'idle' && 'Mint NFT (Gasless)'}
            {flowState === 'building' && 'Building UserOperation...'}
            {flowState === 'signing' && 'Signing UserOperation...'}
            {flowState === 'submitting' && 'Submitting to Bundler...'}
            {flowState === 'success' && 'Success! Mint Again'}
            {flowState === 'error' && 'Error - Try Again'}
          </button>

          {/* Flow Status */}
          {flowState !== 'idle' && flowState !== 'error' && (
            <div style={{ marginTop: '1rem' }}>
              <div style={{ 
                fontSize: '0.85rem', 
                color: '#94a3b8',
                marginBottom: '0.5rem'
              }}>
                Flow Status:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  color: flowState === 'building' ? '#60a5fa' : '#22c55e'
                }}>
                  <span style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    background: flowState === 'building' ? '#60a5fa' : '#22c55e',
                    display: 'inline-block'
                  }}></span>
                  <span>Build UserOperation</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  color: flowState === 'signing' ? '#60a5fa' : flowState === 'building' ? '#64748b' : '#22c55e'
                }}>
                  <span style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    background: flowState === 'signing' ? '#60a5fa' : flowState === 'building' ? '#64748b' : '#22c55e',
                    display: 'inline-block'
                  }}></span>
                  <span>Sign UserOperation</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  color: flowState === 'submitting' ? '#60a5fa' : (flowState === 'building' || flowState === 'signing') ? '#64748b' : '#22c55e'
                }}>
                  <span style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    background: flowState === 'submitting' ? '#60a5fa' : (flowState === 'building' || flowState === 'signing') ? '#64748b' : '#22c55e',
                    display: 'inline-block'
                  }}></span>
                  <span>Submit to Bundler</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  color: flowState === 'success' ? '#22c55e' : '#64748b'
                }}>
                  <span style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    background: flowState === 'success' ? '#22c55e' : '#64748b',
                    display: 'inline-block'
                  }}></span>
                  <span>Execute on Arbitrum</span>
                </div>
              </div>
            </div>
          )}

          {/* Success State */}
          {flowState === 'success' && (
            <div className="status success" style={{ marginTop: '1rem' }}>
              <div style={{ marginBottom: '0.5rem' }}>
                <strong>Gasless Transaction Simulated!</strong>
              </div>
              <div style={{ 
                fontSize: '0.85rem', 
                background: '#1a1a1a',
                padding: '0.75rem',
                borderRadius: '6px',
                marginBottom: '0.5rem',
                border: '1px solid #2a2a2a'
              }}>
                <div style={{ color: '#fbbf24', marginBottom: '0.5rem', fontWeight: '600' }}>
                  This is a SIMULATION
                </div>
                <div style={{ color: '#94a3b8', lineHeight: '1.6' }}>
                  This demo simulates the gasless transaction flow. The transaction hashes below
                  are randomly generated for demonstration purposes and do not represent real
                  on-chain transactions.
                </div>
                <div style={{ color: '#60a5fa', marginTop: '0.5rem', fontSize: '0.8rem' }}>
                  To actually mint an NFT, use the regular &quot;Mint NFT&quot; button on the home page.
                </div>
              </div>
              {userOpHash && (
                <div style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                  <div style={{ color: '#94a3b8' }}>Simulated UserOperation Hash:</div>
                  <div className="address" style={{ wordBreak: 'break-all', opacity: 0.7 }}>
                    {userOpHash}
                  </div>
                </div>
              )}
              {txHash && (
                <div style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                  <div style={{ color: '#94a3b8' }}>Simulated Transaction Hash:</div>
                  <div className="address" style={{ wordBreak: 'break-all', opacity: 0.7 }}>
                    {txHash}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                    (This hash will not appear on Arbiscan - it&apos;s a demo)
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Error State */}
          {flowState === 'error' && (
            <div className="status error" style={{ marginTop: '1rem' }}>
              <div>
                <strong>Transaction Failed</strong>
              </div>
              <div style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                In a real implementation, this would show the actual error from the bundler
                or EntryPoint contract. Common errors include insufficient paymaster balance
                or invalid UserOperation signature.
              </div>
            </div>
          )}

          {/* Technical Details */}
          <details style={{ marginTop: '1.5rem', fontSize: '0.85rem' }}>
            <summary style={{ 
              cursor: 'pointer', 
              color: '#94a3b8',
              marginBottom: '0.5rem'
            }}>
              Technical Details (ERC-4337)
            </summary>
            <div style={{ 
              background: '#0a0a0a',
              padding: '1rem',
              borderRadius: '6px',
              marginTop: '0.5rem',
              fontSize: '0.8rem',
              color: '#94a3b8',
              lineHeight: '1.6'
            }}>
              <p style={{ marginBottom: '0.75rem' }}>
                <strong>This is a simulation.</strong> A full ERC-4337 implementation requires:
              </p>
              <ul style={{ marginLeft: '1.5rem', marginBottom: '0.75rem' }}>
                <li>Smart Contract Wallet (SCW) - User&apos;s account abstraction wallet</li>
                <li>Paymaster Contract - Sponsors gas fees for transactions</li>
                <li>Bundler Service - Aggregates and submits UserOperations</li>
                <li>EntryPoint Contract - Validates and executes UserOperations</li>
              </ul>
              <p style={{ marginBottom: '0.75rem' }}>
                <strong>ERC-4337 Compatibility:</strong> Any contract that uses standard EVM calls
                is compatible with ERC-4337. The paymaster can sponsor gas for any contract interaction.
              </p>
              <p>
                <strong>Real Implementation:</strong> Use libraries like{' '}
                <code style={{ background: '#1a1a1a', padding: '0.2rem 0.4rem', borderRadius: '3px' }}>
                  @account-abstraction/sdk
                </code>
                {' '}or{' '}
                <code style={{ background: '#1a1a1a', padding: '0.2rem 0.4rem', borderRadius: '3px' }}>
                  @alchemy/aa-sdk
                </code>
                {' '}to build and submit UserOperations.
              </p>
            </div>
          </details>
        </>
      )}
    </div>
  )
}
