'use client';

import { useEffect, useState } from 'react';
import sdk from '@farcaster/frame-sdk';
import { 
  ConnectWallet, 
  Wallet, 
  WalletDropdown, 
  WalletDropdownDisconnect 
} from '@coinbase/onchainkit/wallet';
import { 
  Address, 
  Avatar, 
  Name, 
  Identity, 
  EthBalance 
} from '@coinbase/onchainkit/identity';
import { Transaction, TransactionButton } from '@coinbase/onchainkit/transaction';
import type { LifecycleStatus } from '@coinbase/onchainkit/transaction';

const NFT_CONTRACT_ADDRESS = '0x1D6837873D70E989E733e83F676B66b96fB690A8';

export default function Home() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [userName, setUserName] = useState<string | undefined>(undefined);

  useEffect(() => {
    const load = async () => {
      try {
        const context = await sdk.context;
        if (context?.user?.displayName) {
          setUserName(context.user.displayName);
        }
        sdk.actions.ready();
      } catch (error) {
        console.error("Farcaster SDK load failed:", error);
      }
    };

    if (!isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
    }
  }, [isSDKLoaded]);

  const handleStatus = (status: LifecycleStatus) => {
    console.log('Transaction Status:', status);
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white font-sans overflow-x-hidden relative">
      
      {/* Background Metaverse Animasi */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px] animate-pulse"></div>
      </div>

      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-black/40 backdrop-blur-xl border-b border-white/10 sticky top-0 z-20">
        <h1 className="text-xl font-black italic tracking-tighter text-blue-500">BASSY GM</h1>
        <Wallet>
          <ConnectWallet className="bg-blue-600 rounded-full px-4 py-2 text-sm text-white border-none transition-transform active:scale-95">
            <Avatar className="h-5 w-5" />
            <Name />
          </ConnectWallet>
        </Wallet>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-start p-6 text-center">
        
        {/* TOMBOL MENU DI POSISI GARIS KUNING */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-md mt-4 mb-8">
            <a 
              href="https://wild-event-563.app.ohara.ai/" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/5 hover:bg-white/10 border border-white/10 py-3 rounded-2xl text-[10px] font-bold tracking-widest uppercase transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg backdrop-blur-sm"
            >
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]"></span>
              Neynar & Spam
            </a>
            <a 
              href="https://success-settlers-744.app.ohara.ai/" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/5 hover:bg-white/10 border border-white/10 py-3 rounded-2xl text-[10px] font-bold tracking-widest uppercase transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg backdrop-blur-sm"
            >
              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse shadow-[0_0_8px_#a855f7]"></span>
              Bassy Chart
            </a>
        </div>

        {/* Card Utama */}
        <div className="max-w-md w-full bg-white/5 backdrop-blur-2xl p-8 rounded-[3rem] border border-white/10 space-y-6 shadow-2xl">
          
          <div className="space-y-4">
            <div className="relative inline-block">
              {/* Logo Kubus Kamu */}
              <img 
                src="/logo-baru.png" 
                alt="Bassy Logo" 
                className="w-24 h-24 mx-auto object-contain animate-[bounce_4s_infinite]"
                onError={(e) => { e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/5726/5726678.png"; }}
              />
            </div>
            <h2 className="text-2xl font-black italic tracking-tight">GM, {userName || 'Anon'}! 🔵</h2>
          </div>

          <div className="w-full">
            <Transaction
              chainId={8453}
              calls={[{
                to: NFT_CONTRACT_ADDRESS as `0x${string}`,
                data: '0x1249c58b' as `0x${string}`, 
                value: BigInt(0),
              }]}
              onStatus={handleStatus}
            >
              <TransactionButton 
                text="SEND GM ON-CHAIN"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl transition-all shadow-[0_0_25px_rgba(37,99,235,0.4)] border-none" 
              />
            </Transaction>
          </div>

          <div className="flex items-center justify-center gap-2 pt-2">
            <div className="text-[9px] font-mono text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></span>
              Base Mainnet Active
            </div>
          </div>
        </div>
      </main>

      <footer className="p-6 text-center text-slate-700 text-[10px] font-bold uppercase tracking-widest">
        Bassy Ecosystem • 2026
      </footer>
    </div>
  );
}