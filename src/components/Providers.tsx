'use client';

import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { base } from 'viem/chains';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { coinbaseWallet } from 'wagmi/connectors';
import { useState, type ReactNode } from 'react';

const config = createConfig({
  chains: [base],
  connectors: [coinbaseWallet({ appName: 'Bassy GM', preference: 'all' })],
  ssr: true,
  transports: { [base.id]: http() },
});

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider 
          apiKey="AC79604A-1C42-401D-AEEB-603CEE7C57B2" 
          chain={base}
          config={{
            paymaster: "https://api.developer.coinbase.com/rpc/v1/base/f8b308db-f748-402c-b50c-1c903a02862f"
          }}
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}