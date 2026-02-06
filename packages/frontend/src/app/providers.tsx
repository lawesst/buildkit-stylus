'use client'

import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createConfig, http } from 'wagmi'
import { arbitrumSepolia } from 'wagmi/chains'
import { injected, metaMask, walletConnect } from 'wagmi/connectors'
import { useState, useEffect } from 'react'

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

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

const config = createConfig({
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

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // Return empty div during SSR to prevent hydration errors
  if (!mounted) {
    return <div style={{ minHeight: '100vh', background: '#0a0a0a' }} />
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
