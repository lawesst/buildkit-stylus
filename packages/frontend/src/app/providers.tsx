'use client'

import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createConfig, http } from 'wagmi'
import { arbitrumSepolia } from 'wagmi/chains'
import { injected, metaMask, walletConnect } from 'wagmi/connectors'
import { useState, useEffect } from 'react'

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

// Create config lazily to avoid SSR issues
function createWagmiConfig() {
  // Build connectors array - prioritize MetaMask
  // We use metaMask() first as it's specifically designed for MetaMask
  // Then injected() as fallback for other wallets
  const connectors: any[] = [
    metaMask(), // Primary: Specifically for MetaMask
    injected(), // Fallback: Detects any injected wallet provider
  ]

  // Only add WalletConnect if project ID is available
  if (walletConnectProjectId && walletConnectProjectId.trim() !== '') {
    connectors.push(
      walletConnect({
        projectId: walletConnectProjectId,
      }) as any
    )
  }

  return createConfig({
    chains: [arbitrumSepolia],
    connectors,
    transports: {
      [arbitrumSepolia.id]: http('https://sepolia-rollup.arbitrum.io/rpc', {
        // Add timeout and retry configuration for better reliability
        timeout: 30000,
      }),
    },
    // Add batch configuration for better performance
    batch: {
      multicall: true,
    },
  })
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Retry failed requests
        retry: 1,
        // Refetch on window focus
        refetchOnWindowFocus: false,
      },
    },
  }))

  // Create config only on client side to avoid SSR issues
  // Use state instead of useMemo to ensure it's created after mount
  const [config, setConfig] = useState<any>(null)

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    // Create config after mount (client-side only)
    if (typeof window !== 'undefined') {
      try {
        const wagmiConfig = createWagmiConfig()
        setConfig(wagmiConfig)
        setMounted(true) // Only set mounted after config is created
      } catch (error) {
        console.error('Error creating wagmi config:', error)
        // Set mounted even on error so we can show error state
        setMounted(true)
      }
    }
  }, [])

  // Return loading state during SSR or while config is being created
  if (!mounted || !config) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontFamily: 'Inter, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '1.5rem', 
            marginBottom: '1rem',
            color: '#28A0F0'
          }}>
            Loading BuildKit Stylus...
          </div>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '3px solid rgba(40, 160, 240, 0.3)',
            borderTop: '3px solid #28A0F0',
            borderRadius: '50%',
            margin: '0 auto',
            animation: 'spin 1s linear infinite'
          }} />
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    )
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
