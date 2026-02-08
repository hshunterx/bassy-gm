'use client';

import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { base } from 'viem/chains';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { coinbaseWallet } from 'wagmi/connectors';
import { useState, type ReactNode } from 'react';

// Konfigurasi Wagmi yang diperkuat untuk Smart Wallet & Paymaster
const config = createConfig({
  chains: [base],
  connectors: [
    coinbaseWallet({ 
      appName: 'Bassy GM',
      preference: 'all' // Mengutamakan Smart Wallet untuk pengalaman gasless
    })
  ],
  ssr: true,
  transports: { 
    [base.id]: http() 
  },
});

export function Providers({ children }: { children: ReactNode }) {
  // Menggunakan useState agar QueryClient tidak dibuat ulang saat render ulang (re-render)
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider 
          // SARAN: Masukkan API Key langsung di sini jika env variable bermasalah
          apiKey="AC79604A-1C42-401D-AEEB-603CEE7C57B2" 
          chain={base}
          config={{
            appearance: {
              mode: 'auto',
              theme: 'default',
            }
          }}
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}