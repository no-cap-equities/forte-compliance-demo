import { createConfig, http } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { base, baseSepolia } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiConfig } from 'wagmi'
import { BLOCKCHAIN_CONFIG } from './config'

// Create a custom chain for Base Sepolia if needed (only if not provided by wagmi)
const baseSepoliaChain = baseSepolia || {
  id: BLOCKCHAIN_CONFIG.CHAIN_ID,
  name: BLOCKCHAIN_CONFIG.CHAIN_NAME,
  network: 'base-sepolia',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: [BLOCKCHAIN_CONFIG.RPC_URL] },
    public: { http: [BLOCKCHAIN_CONFIG.RPC_URL] },
  },
  blockExplorers: {
    default: { name: 'Basescan', url: 'https://sepolia.basescan.org' },
  },
  contracts: {},
}

// Configure wagmi client with error handling
export const config = createConfig({
  chains: [baseSepoliaChain, base],
  connectors: [
    injected({
      shimDisconnect: true,
    })
  ],
  transports: {
    [baseSepoliaChain.id]: http(BLOCKCHAIN_CONFIG.RPC_URL),
    [base.id]: http(),
  },
})

// Create a react-query client with error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

// Export provider wrapper with error boundary
export function WagmiProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={config}>
        {children}
      </WagmiConfig>
    </QueryClientProvider>
  )
} 