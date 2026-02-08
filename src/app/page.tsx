'use client';

import { useEffect, useState } from 'react';
import { sdk } from '@farcaster/miniapp-sdk'; 
import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';
import { Avatar, Name } from '@coinbase/onchainkit/identity';
import { 
  Transaction, 
  TransactionButton,
  TransactionSponsor,
  TransactionStatus,
  TransactionStatusLabel,
  TransactionStatusAction
} from '@coinbase/onchainkit/transaction';
import type { LifecycleStatus } from '@coinbase/onchainkit/transaction';

export default function Home() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [streak, setStreak] = useState(0);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [lastCheckIn, setLastCheckIn] = useState(0);

  // Inisialisasi Data
  useEffect(() => {
    const savedStreak = localStorage.getItem('gm_streak');
    const savedTime = localStorage.getItem('last_gm_checkin');
    if (savedStreak) setStreak(parseInt(savedStreak));
    if (savedTime) setLastCheckIn(parseInt(savedTime));
    
    sdk.actions.ready();
  }, []);

  const handleStatus = (status: LifecycleStatus) => {
    console.log("Status:", status.statusName);
    
    // Munculkan popup segera setelah transaksi dikonfirmasi di blockchain
    if (status.statusName === 'success') {
      const now = Date.now();
      const newStreak = streak + 1;
      
      setStreak(newStreak);
      setLastCheckIn(now);
      localStorage.setItem('gm_streak', newStreak.toString());
      localStorage.setItem('last_gm_checkin', now.toString());
      
      setShowSuccessPopup(true);
      // Sembunyikan popup setelah 4 detik
      setTimeout(() => setShowSuccessPopup(false), 4000);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white relative overflow-hidden">
      {/* SUCCESS POPUP - Dipaksa muncul di paling depan */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm px-6">
          <div className="bg-blue-600 border-2 border-blue-400 p-8 rounded-[2rem] text-center shadow-[0_0_50px_rgba(37,99,235,0.8)] scale-110 transition-all">
            <span className="text-5xl mb-2 block">🔥</span>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter">GM BERHASIL!</h2>
            <p className="mt-2 text-blue-100 font-bold uppercase tracking-widest">Day {streak} Streak</p>
            <div className="mt-4 text-[10px] bg-white/20 py-1 px-3 rounded-full uppercase">Transaksi Selesai</div>
          </div>
        </div>
      )}

      {/* Konten Utama */}
      <header className="p-4 flex justify-between items-center border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <h1 className="text-xl font-black italic text-blue-500 uppercase">Bassy GM</h1>
        <Wallet>
          <ConnectWallet className="bg-blue-600 rounded-full text-xs font-bold px-4 py-2 border-none">
            <Avatar className="h-4 w-4" />
            <Name />
          </ConnectWallet>
        </Wallet>
      </header>

      <main className="flex-grow flex flex-col items-center p-6 mt-4">
        <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-[3rem] p-8 text-center backdrop-blur-3xl shadow-2xl">
          <div className="relative w-24 h-24 mx-auto mb-4">
             <div className="w-24 h-24 rounded-full border-2 border-blue-500 overflow-hidden shadow-[0_0_20px_rgba(59,130,246,0.5)]">
               <img src="/logo-baru.png" className="w-full h-full object-cover" alt="pfp" />
             </div>
             <div className="absolute bottom-0 right-0 w-6 h-6 bg-blue-600 rounded-full border-2 border-black"></div>
          </div>

          <h2 className="text-2xl font-black italic uppercase mb-2">GM, Hunter!</h2>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-1 inline-block mb-8">
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">🔥 {streak} HARI CHECK-IN</span>
          </div>

          <Transaction 
            chainId={8453} 
            calls={[{ to: '0x1D6837873D70E989E733e83F676B66b96fB690A8', data: '0x1249c58b', value: BigInt(0) }]} 
            onStatus={handleStatus}
            capabilities={{ paymasterService: { url: 'https://api.developer.coinbase.com/rpc/v1/base/f8b308db-f748-402c-b50c-1c903a02862f' } }}
          >
            <TransactionButton text="SEND GM ON-CHAIN (FREE)" className="w-full bg-blue-600 font-black py-4 rounded-2xl shadow-lg uppercase active:scale-95 transition-transform" />
            <TransactionSponsor className="mt-2 text-[10px] text-blue-400 font-bold uppercase" />
            <TransactionStatus className="mt-2 text-xs">
              <TransactionStatusLabel className="text-slate-500 font-bold uppercase" />
              <TransactionStatusAction className="text-blue-500 underline ml-1" />
            </TransactionStatus>
          </Transaction>
          
          <a href="https://vibrant-bassy.nfts2.me" target="_blank" className="mt-4 block w-full bg-gradient-to-r from-purple-600 to-pink-600 font-black py-4 rounded-2xl uppercase shadow-lg active:scale-95 transition-transform">Mint NFT FREE 🚀</a>
        </div>
      </main>
    </div>
  );
}