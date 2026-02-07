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
    // Background Metaverse (Radial Gradient Animasi)
    <div className="flex flex-col min-h-screen bg-black text-white font-sans overflow-x-hidden relative">
      
      {/* Efek Cahaya Metaverse di Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
      </div>

      {/* Header / Navbar */}
      <header className="flex justify-between items-center p-4 bg-black/40 backdrop-blur-xl border-b border-white/10 sticky top-0 z-20">
        <h1 className="text-xl font-black italic tracking-tighter text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">BASSY GM</h1>
        
        <Wallet>
          <ConnectWallet className="bg-blue-600 hover:bg-blue-700 transition-all rounded-full px-4 py-2 text-sm text-white border-none shadow-lg shadow-blue-900/20">
            <Avatar className="h-5 w-5" />
            <Name />
          </ConnectWallet>
          <WalletDropdown>
            <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
              <Avatar />
              <Name />
              <Address className="text-blue-400" />
              <EthBalance />
            </Identity>
            <WalletDropdownDisconnect className="hover:bg-red-500/10 text-red-400" />
          </WalletDropdown>
        </Wallet>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white/5 backdrop-blur-2xl p-8 rounded-[3rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 space-y-8">
          
          <div className="space-y-4">
            {/* LOGO BARU MENGGANTIKAN IKAN */}
            <div className="relative inline-block group">
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-2xl opacity-20 group-hover:opacity-50 transition-opacity"></div>
              <img 
                src="/logo-baru.png" 
                alt="Bassy Logo" 
                className="relative w-32 h-32 mx-auto object-contain animate-[bounce_3s_infinite]"
                onError={(e) => {
                  // Fallback jika gambar belum terupload/salah nama
                  e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/5726/5726678.png";
                }}
              />
            </div>
            
            <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
              GM, {userName || 'Anon'}! 🔵
            </h2>
            
            <p className="text-slate-400 text-base leading-relaxed">
              Tekan tombol di bawah untuk kirim GM on-chain ke Bassy via Base Network.
            </p>
          </div>

          <div className="flex flex-col gap-4 w-full">
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
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl transition-all active:scale-95 shadow-[0_0_30px_rgba(37,99,235,0.4)] border-none" 
              />
            </Transaction>
          </div>

          <div className="pt-4 flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-[10px] font-mono text-blue-400/60 uppercase tracking-[0.2em]">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></span>
                Network: Base Mainnet
              </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 p-6 text-center text-slate-600 text-[10px] uppercase tracking-widest font-bold">
        Built with 💙 on Base Metaverse
      </footer>
    </div>
  );
}