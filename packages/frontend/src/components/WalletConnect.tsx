'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useEffect, useState } from 'react'

export function WalletConnect() {
  const { address, isConnected, chain } = useAccount()
  const { connectors, connect, error: connectError, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const [mounted, setMounted] = useState(false)

  // Handle hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  // Get the best available connector - prioritize MetaMask
  const getBestConnector = () => {
    // First, try to find MetaMask specifically
    const metaMaskConnector = connectors.find(c => 
      c.name.toLowerCase().includes('metamask') || 
      c.id === 'metaMask' ||
      c.id === 'io.metamask'
    )
    if (metaMaskConnector && metaMaskConnector.ready) {
      return metaMaskConnector
    }
    
    // Then prefer any ready connector
    const readyConnector = connectors.find(c => c.ready)
    if (readyConnector) return readyConnector
    
    // Fallback to MetaMask even if not ready (will show as disabled)
    if (metaMaskConnector) return metaMaskConnector
    
    // Last resort: any connector
    return connectors[0]
  }

  const bestConnector = getBestConnector()
  const hasConnectors = connectors.length > 0
  const isMetaMask = bestConnector?.name.toLowerCase().includes('metamask') || 
                     bestConnector?.id === 'metaMask' ||
                     bestConnector?.id === 'io.metamask'

  // Connected state
  if (isConnected && address) {
    return (
      <div className="card">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <h2 style={{ margin: 0, flex: '1 1 auto', minWidth: 0 }}>Wallet Connected</h2>
          <button
            onClick={() => disconnect()}
            style={{
              padding: '0.5rem 1rem',
              background: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '600',
              transition: 'opacity 0.2s',
              flexShrink: 0,
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            Disconnect
          </button>
        </div>
        
        <div style={{ 
          background: '#0a0a0a',
          padding: '1rem',
          borderRadius: '6px',
          border: '1px solid #2a2a2a'
        }}>
          <div style={{ marginBottom: '0.75rem' }}>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
              Address
            </div>
            <div className="address" style={{ 
              fontSize: '0.95rem',
              wordBreak: 'break-all',
              color: '#60a5fa'
            }}>
              {address}
            </div>
          </div>
          
          {chain && (
            <div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
                Network
              </div>
              <div style={{ fontSize: '0.95rem', color: '#e0e0e0' }}>
                {chain.name} (Chain ID: {chain.id})
              </div>
            </div>
          )}
        </div>

        {chain?.id !== 421614 && (
          <div style={{
            marginTop: '1rem',
            padding: '0.75rem',
            background: '#7c2d12',
            border: '1px solid #9a3412',
            borderRadius: '6px',
            color: '#fed7aa',
            fontSize: '0.9rem'
          }}>
            Please switch to <strong>Arbitrum Sepolia</strong> (Chain ID: 421614) in your wallet
          </div>
        )}
      </div>
    )
  }

  // Not connected - show connect button
  if (!mounted) {
    return (
      <div className="card">
        <h2>Connect Wallet</h2>
        <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
          Loading...
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h2>Connect Wallet</h2>
      <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>
        Connect your wallet to get started.
      </p>

      {/* Error Message */}
      {connectError && (
        <div style={{
          marginBottom: '1rem',
          padding: '0.75rem',
          background: '#7f1d1d',
          border: '1px solid #991b1b',
          borderRadius: '6px',
          color: '#fca5a5',
          fontSize: '0.9rem'
        }}>
          <strong>Connection Error:</strong> {connectError.message}
          {process.env.NODE_ENV === 'development' && (
            <details style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
              <summary style={{ cursor: 'pointer', color: '#fca5a5' }}>Debug Info</summary>
              <pre style={{ 
                marginTop: '0.5rem', 
                padding: '0.5rem', 
                background: '#0a0a0a', 
                borderRadius: '4px',
                overflow: 'auto',
                fontSize: '0.75rem'
              }}>
                {JSON.stringify(connectError, null, 2)}
              </pre>
            </details>
          )}
        </div>
      )}

      {/* Main Connect Button */}
      {hasConnectors && bestConnector && (
        <button
          onClick={async () => {
            try {
              console.log('Connecting with connector:', bestConnector.name, bestConnector)
              console.log('Connector ready:', bestConnector.ready)
              console.log('Is pending:', isPending)
              
              if (!bestConnector.ready) {
                console.warn('Connector not ready, attempting connection anyway...')
              }
              
              await connect({ connector: bestConnector })
            } catch (error) {
              console.error('Connection error:', error)
            }
          }}
          disabled={isPending}
          style={{
            width: '100%',
            padding: '1rem 1.5rem',
            background: !isPending
              ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
              : '#374151',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: !isPending ? 'pointer' : 'not-allowed',
            opacity: !isPending ? 1 : 0.6,
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '1rem'
          }}
          onMouseEnter={(e) => {
            if (!isPending) {
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)'
            }
          }}
          onMouseLeave={(e) => {
            if (!isPending) {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }
          }}
        >
          {isPending ? (
            <>
              <span>Connecting to MetaMask...</span>
            </>
          ) : (
            <>
              <span>Connect MetaMask</span>
              {!bestConnector.ready && (
                <span style={{ fontSize: '0.8rem', opacity: 0.8, marginLeft: '0.5rem' }}>
                  (Click to try anyway)
                </span>
              )}
            </>
          )}
        </button>
      )}

      {/* Debug Info in Development */}
      {process.env.NODE_ENV === 'development' && hasConnectors && (
        <details style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#64748b' }}>
          <summary style={{ cursor: 'pointer', padding: '0.5rem' }}>Debug Info</summary>
          <div style={{ 
            marginTop: '0.5rem', 
            padding: '0.75rem', 
            background: '#0a0a0a', 
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontFamily: 'monospace'
          }}>
            <div><strong>Connectors found:</strong> {connectors.length}</div>
            <div><strong>Best connector:</strong> {bestConnector?.name} (ready: {bestConnector?.ready ? 'Yes' : 'No'})</div>
            <div><strong>Connector ID:</strong> {bestConnector?.id}</div>
            <div><strong>Is pending:</strong> {isPending ? 'Yes' : 'No'}</div>
            <div><strong>Has error:</strong> {connectError ? connectError.message : 'No'}</div>
            <div style={{ marginTop: '0.5rem' }}>
              <strong>All connectors:</strong>
              <ul style={{ marginLeft: '1rem', marginTop: '0.25rem' }}>
                {connectors.map(c => (
                  <li key={c.uid}>
                    {c.name} - Ready: {c.ready ? 'Yes' : 'No'} - ID: {c.id}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ marginTop: '0.5rem' }}>
              <strong>window.ethereum:</strong> {typeof window !== 'undefined' && (window as any).ethereum ? 'Available' : 'Not found'}
            </div>
          </div>
        </details>
      )}

      {/* Alternative Connectors */}
      {hasConnectors && connectors.length > 1 && (
        <details style={{ marginTop: '1rem' }}>
          <summary style={{
            cursor: 'pointer',
            color: '#94a3b8',
            fontSize: '0.9rem',
            padding: '0.5rem',
            userSelect: 'none'
          }}>
            Other wallet options ({connectors.length - 1})
          </summary>
          <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {connectors
              .filter(c => c.uid !== bestConnector?.uid)
              .map((connector) => (
                <button
                  key={connector.uid}
                  onClick={async () => {
                    try {
                      console.log('Connecting with alternative connector:', connector.name)
                      await connect({ connector })
                    } catch (error) {
                      console.error('Connection error:', error)
                    }
                  }}
                  disabled={isPending}
                  style={{
                    padding: '0.75rem 1rem',
                    background: connector.ready ? '#1a1a1a' : '#0a0a0a',
                    border: '1px solid #2a2a2a',
                    borderRadius: '6px',
                    color: connector.ready ? '#e0e0e0' : '#64748b',
                    cursor: !isPending ? 'pointer' : 'not-allowed',
                    fontSize: '0.9rem',
                    textAlign: 'left',
                    opacity: connector.ready ? 1 : 0.6
                  }}
                >
                  {connector.name}
                  {!connector.ready && ' (not available)'}
                </button>
              ))}
          </div>
        </details>
      )}

      {/* No Wallet Detected */}
      {!hasConnectors && (
        <div style={{
          padding: '1.5rem',
          background: '#0f1419',
          border: '1px solid #1e3a5f',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#60a5fa', marginBottom: '0.5rem' }}>MetaMask Not Detected</h3>
          <p style={{ color: '#94a3b8', marginBottom: '1rem', lineHeight: '1.6' }}>
            Please install MetaMask browser extension to connect your wallet and interact with Stylus contracts.
          </p>
          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #f6851b 0%, #e2761b 100%)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: '600',
              transition: 'all 0.2s',
              boxShadow: '0 2px 8px rgba(246, 133, 27, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(246, 133, 27, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(246, 133, 27, 0.3)'
            }}
          >
            Install MetaMask →
          </a>
          <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#64748b', lineHeight: '1.6' }}>
            <p style={{ marginBottom: '0.5rem' }}>After installing MetaMask:</p>
            <ol style={{ textAlign: 'left', display: 'inline-block', margin: 0, paddingLeft: '1.5rem' }}>
              <li>Refresh this page</li>
              <li>Click "Connect MetaMask" button</li>
              <li>Approve the connection in MetaMask</li>
              <li>Switch to Arbitrum Sepolia network</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  )
}
