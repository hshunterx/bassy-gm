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
        // Mengambil data konteks Farcaster
        const context = await sdk.context;
        if (context?.user?.displayName) {
          setUserName(context.user.displayName);
        }
        
        // Memberitahu Warpcast bahwa aplikasi sudah siap
        // Ini akan membuat status "Ready call" jadi HIJAU
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
    <div className="flex flex-col min-h-screen bg-slate-950 text-white font-sans">
      {/* Header / Navbar */}
      <header className="flex justify-between items-center p-4 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 sticky top-0 z-10">
        <h1 className="text-xl font-black italic tracking-tighter text-blue-500">BASSY GM</h1>
        
        <Wallet>
          <ConnectWallet className="bg-blue-600 hover:bg-blue-700 transition-all rounded-full px-4 py-2 text-sm text-white border-none shadow-none">
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
      <main className="flex-grow flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl border border-slate-800 space-y-8">
          <div className="space-y-4">
            <div className="inline-block p-4 bg-blue-600/10 rounded-full mb-2">
              <span className="text-5xl">🐟</span>
            </div>
            
            <h2 className="text-3xl font-extrabold tracking-tight">
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
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl transition-all active:scale-95 shadow-[0_0_20px_rgba(37,99,235,0.3)] border-none" 
              />
            </Transaction>
          </div>

          <div className="pt-4 flex flex-col items-center gap-2">
             <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em]">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                Network: Base Mainnet
              </div>
          </div>
        </div>
      </main>

      <footer className="p-6 text-center text-slate-600 text-[10px] uppercase tracking-widest font-bold">
        Built with 💙 on Base
      </footer>
    </div>
  );
}