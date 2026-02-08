'use client';

import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { base } from 'viem/chains';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { coinbaseWallet } from 'wagmi/connectors';
import { useState, type ReactNode } from 'react';

// Konfigurasi Wagmi tetap sama, ini sudah benar
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
          // Catatan: JANGAN masukkan properti 'config' atau 'paymaster' di sini 
          // karena OnchainKitProvider versi terbaru mengharapkan konfigurasi 
          // tersebut langsung di dalam komponen <Transaction /> di page.tsx
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}