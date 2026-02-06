'use client'

/**
 * Data Flow Diagram Component
 * 
 * Visualizes how data flows from Stylus contracts → Indexer → Dashboard
 */

export function DataFlowDiagram() {
  return (
    <div className="card" style={{ marginBottom: '1.5rem' }}>
      <h2 style={{ marginBottom: '0.5rem' }}>Data Flow</h2>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        How Stylus contract events flow through the system
      </p>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        position: 'relative'
      }}>
        {/* Step 1: Stylus Contract */}
        <div style={{
          display: 'flex',
          gap: '1.5rem',
          alignItems: 'start',
          position: 'relative'
        }}>
          {/* Icon Badge */}
          <div style={{
            minWidth: '56px',
            height: '56px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #28A0F0 0%, #9D4EDD 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(40, 160, 240, 0.3)'
          }}>
            🔗
          </div>
          
          {/* Content */}
          <div style={{ flex: 1 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '0.75rem'
            }}>
              <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.25rem' }}>
                Stylus Contract
              </h3>
              <span style={{
                padding: '0.25rem 0.75rem',
                background: 'rgba(40, 160, 240, 0.15)',
                border: '1px solid rgba(40, 160, 240, 0.3)',
                borderRadius: '6px',
                fontSize: '0.75rem',
                color: 'var(--arb-blue-light)',
                fontWeight: '600'
              }}>
                Rust → WASM
              </span>
            </div>
            
            <p style={{ 
              fontSize: '0.9rem', 
              color: 'var(--text-secondary)', 
              lineHeight: '1.6',
              marginBottom: '1rem'
            }}>
              Contract emits events using <code style={{
                background: 'var(--bg-secondary)',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                fontSize: '0.85rem',
                color: 'var(--arb-blue-light)',
                border: '1px solid var(--border-secondary)'
              }}>self.vm().log()</code>. Events are stored as standard EVM logs on Arbitrum Sepolia.
            </p>
            
            <div style={{
              padding: '1rem',
              background: 'var(--bg-secondary)',
              borderRadius: '8px',
              border: '1px solid var(--border-secondary)',
              fontSize: '0.85rem',
              fontFamily: 'JetBrains Mono, Courier New, monospace',
              overflowX: 'auto'
            }}>
              <div style={{ color: 'var(--arb-blue-light)', marginBottom: '0.25rem' }}>
                <span style={{ color: 'var(--text-tertiary)' }}>// Rust (Stylus)</span>
              </div>
              <div style={{ color: 'var(--text-primary)' }}>
                <span style={{ color: 'var(--text-tertiary)' }}>self</span>.<span style={{ color: '#60a5fa' }}>vm</span>().<span style={{ color: '#60a5fa' }}>log</span>(<span style={{ color: '#fbbf24' }}>Transfer</span> {'{'}
              </div>
              <div style={{ color: 'var(--text-primary)', paddingLeft: '1rem' }}>
                <span style={{ color: '#60a5fa' }}>from</span>: <span style={{ color: '#fbbf24' }}>Address</span>::<span style={{ color: '#60a5fa' }}>ZERO</span>,
              </div>
              <div style={{ color: 'var(--text-primary)', paddingLeft: '1rem' }}>
                <span style={{ color: '#60a5fa' }}>to</span>,
              </div>
              <div style={{ color: 'var(--text-primary)', paddingLeft: '1rem' }}>
                <span style={{ color: '#60a5fa' }}>token_id</span>
              </div>
              <div style={{ color: 'var(--text-primary)' }}>
                {'}'})
              </div>
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '-0.5rem 0',
          position: 'relative'
        }}>
          <div style={{
            width: '2px',
            height: '2rem',
            background: 'linear-gradient(180deg, #28A0F0 0%, #10b981 100%)',
            borderRadius: '2px'
          }} />
          <div style={{
            position: 'absolute',
            fontSize: '1.25rem',
            color: '#10b981',
            background: 'var(--bg-card)',
            padding: '0 0.5rem'
          }}>
            ↓
          </div>
        </div>

        {/* Step 2: Indexer */}
        <div style={{
          display: 'flex',
          gap: '1.5rem',
          alignItems: 'start'
        }}>
          {/* Icon Badge */}
          <div style={{
            minWidth: '56px',
            height: '56px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
          }}>
            📡
          </div>
          
          {/* Content */}
          <div style={{ flex: 1 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '0.75rem'
            }}>
              <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.25rem' }}>
                Indexer
              </h3>
              <span style={{
                padding: '0.25rem 0.75rem',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '6px',
                fontSize: '0.75rem',
                color: '#10b981',
                fontWeight: '600'
              }}>
                Node.js + ethers.js
              </span>
            </div>
            
            <p style={{ 
              fontSize: '0.9rem', 
              color: 'var(--text-secondary)', 
              lineHeight: '1.6',
              marginBottom: '1rem'
            }}>
              Listens to blockchain using standard Ethereum RPC methods and stores events.
            </p>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '0.75rem',
              marginBottom: '1rem'
            }}>
              {[
                { method: 'eth_getLogs', desc: 'Query event logs' },
                { method: 'eth_blockNumber', desc: 'Track blocks' },
                { method: 'ABI parsing', desc: 'Decode events' },
                { method: 'Storage', desc: 'SQLite/JSON' }
              ].map((item, idx) => (
                <div key={idx} style={{
                  padding: '0.75rem',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-secondary)',
                  borderRadius: '6px',
                  fontSize: '0.85rem'
                }}>
                  <div style={{ 
                    color: '#10b981', 
                    fontWeight: '600',
                    marginBottom: '0.25rem',
                    fontFamily: 'JetBrains Mono, monospace'
                  }}>
                    {item.method}
                  </div>
                  <div style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{
              padding: '0.75rem 1rem',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: '6px',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)'
            }}>
              <strong style={{ color: '#10b981' }}>✓</strong> Indexing Stylus events is identical to Solidity events. Same RPC calls, same ABI format.
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '-0.5rem 0',
          position: 'relative'
        }}>
          <div style={{
            width: '2px',
            height: '2rem',
            background: 'linear-gradient(180deg, #10b981 0%, #f59e0b 100%)',
            borderRadius: '2px'
          }} />
          <div style={{
            position: 'absolute',
            fontSize: '1.25rem',
            color: '#f59e0b',
            background: 'var(--bg-card)',
            padding: '0 0.5rem'
          }}>
            ↓
          </div>
        </div>

        {/* Step 3: Dashboard */}
        <div style={{
          display: 'flex',
          gap: '1.5rem',
          alignItems: 'start'
        }}>
          {/* Icon Badge */}
          <div style={{
            minWidth: '56px',
            height: '56px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
          }}>
            📊
          </div>
          
          {/* Content */}
          <div style={{ flex: 1 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '0.75rem'
            }}>
              <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.25rem' }}>
                Dashboard
              </h3>
              <span style={{
                padding: '0.25rem 0.75rem',
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '6px',
                fontSize: '0.75rem',
                color: '#f59e0b',
                fontWeight: '600'
              }}>
                Next.js
              </span>
            </div>
            
            <p style={{ 
              fontSize: '0.9rem', 
              color: 'var(--text-secondary)', 
              lineHeight: '1.6',
              marginBottom: '1rem'
            }}>
              Fetches indexed events from the indexer's REST API and displays analytics.
            </p>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '0.75rem',
              marginBottom: '1rem'
            }}>
              {[
                { icon: '📈', label: 'Total Mints' },
                { icon: '👥', label: 'Unique Users' },
                { icon: '📋', label: 'Recent Events' },
                { icon: '📝', label: 'Contract Info' }
              ].map((item, idx) => (
                <div key={idx} style={{
                  padding: '0.75rem',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-secondary)',
                  borderRadius: '6px',
                  textAlign: 'center',
                  fontSize: '0.85rem'
                }}>
                  <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>
                    {item.icon}
                  </div>
                  <div style={{ color: 'var(--text-secondary)' }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{
              padding: '0.75rem 1rem',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-secondary)',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontFamily: 'JetBrains Mono, monospace',
              color: 'var(--text-secondary)'
            }}>
              <span style={{ color: 'var(--text-tertiary)' }}>API:</span>{' '}
              <span style={{ color: '#f59e0b' }}>GET</span> /events,{' '}
              <span style={{ color: '#f59e0b' }}>GET</span> /stats
            </div>
          </div>
        </div>
      </div>

      {/* Key Insight */}
      <div style={{
        marginTop: '2rem',
        padding: '1.25rem',
        background: 'linear-gradient(135deg, rgba(40, 160, 240, 0.1) 0%, rgba(157, 78, 221, 0.1) 100%)',
        border: '1px solid rgba(40, 160, 240, 0.2)',
        borderRadius: '10px',
        fontSize: '0.9rem',
        lineHeight: '1.7'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'start',
          gap: '0.75rem'
        }}>
          <div style={{
            fontSize: '1.5rem',
            lineHeight: '1'
          }}>
            💡
          </div>
          <div style={{ flex: 1 }}>
            <strong style={{ 
              color: 'var(--arb-blue-light)', 
              display: 'block', 
              marginBottom: '0.5rem',
              fontSize: '1rem'
            }}>
              Why This Works Seamlessly
            </strong>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
              Stylus contracts emit <strong style={{ color: 'var(--text-primary)' }}>standard EVM events</strong>.
              From the indexer's perspective, there's no difference between a Stylus event and a Solidity event.
              Both use the same log format, same ABI structure, and same RPC methods. This means you can use
              all existing Ethereum tooling without any modifications.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
