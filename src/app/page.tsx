'use client';

import { useEffect, useState } from 'react';
import { sdk } from '@farcaster/miniapp-sdk'; 
import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';
import { Avatar, Name } from '@coinbase/onchainkit/identity';
import { 
  Transaction, 
  TransactionButton,
  TransactionStatus,
  TransactionStatusLabel,
  TransactionStatusAction
} from '@coinbase/onchainkit/transaction';
import type { LifecycleStatus } from '@coinbase/onchainkit/transaction';

export default function Home() {
  const [userPfp, setUserPfp] = useState<string>("/logo-baru.png"); 
  const [streak, setStreak] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(""); // State baru untuk feedback

  useEffect(() => {
    const init = async () => {
      try {
        const context = await sdk.context;
        if (context?.user?.pfpUrl) setUserPfp(context.user.pfpUrl);
        // Memastikan SDK siap
        sdk.actions.ready();
      } catch (e) {
        console.error("SDK Init Error", e);
      }
    };
    init();
    const saved = localStorage.getItem('gm_streak');
    if (saved) setStreak(parseInt(saved));
  }, []);

  const handleStatus = (status: LifecycleStatus) => {
    console.log("Current Status:", status.statusName);
    
    // Memberikan feedback saat tombol diklik
    if (status.statusName === 'initiate') {
      setLoadingMsg("⌛ Membuka Dompet...");
    }
    
    if (status.statusName === 'transactionPending') {
      setLoadingMsg("🚀 Menunggu Blockchain...");
    }

    if (status.statusName === 'success') {
      setLoadingMsg(""); // Hapus pesan loading
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem('gm_streak', newStreak.toString());
      
      setIsSuccess(true);
      // Popup bawaan browser sebagai fallback terakhir
      alert(`✅ GM BERHASIL!\nStreak Anda: ${newStreak} Hari`);
    }

    if (status.statusName === 'error') {
      setLoadingMsg("");
      alert("❌ Transaksi Gagal atau Dibatalkan");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white p-6 items-center font-sans">
      
      {/* Notifikasi Loading / Sukses */}
      {(loadingMsg || isSuccess) && (
        <div className={`fixed top-4 left-4 right-4 z-[100] p-4 rounded-xl text-center font-black shadow-2xl transition-all ${isSuccess ? 'bg-green-600' : 'bg-blue-600 animate-pulse'}`}>
          {isSuccess ? `🔥 GM BERHASIL! STREAK: ${streak}` : loadingMsg}
        </div>
      )}

      <header className="w-full flex justify-between items-center mb-8 sticky top-0 bg-black/50 backdrop-blur-md py-2 z-10">
        <h1 className="text-xl font-black italic text-blue-500 uppercase tracking-tighter">Bassy GM</h1>
        <Wallet>
          <ConnectWallet className="bg-blue-600 rounded-full px-4 py-1 text-xs border-none active:scale-90 transition-transform">
            <Avatar className="h-4 w-4" />
            <Name />
          </ConnectWallet>
        </Wallet>
      </header>

      <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] w-full max-w-sm text-center shadow-2xl backdrop-blur-sm">
        <div className="relative w-20 h-20 mx-auto mb-4">
          <img src={userPfp} className="w-20 h-20 rounded-full border-2 border-blue-500 object-cover shadow-[0_0_15px_rgba(59,130,246,0.5)]" alt="pfp" />
          <div className="absolute bottom-0 right-0 w-5 h-5 bg-blue-600 rounded-full border-2 border-black"></div>
        </div>
        
        <h2 className="text-2xl font-black italic uppercase">GM, Hunter!</h2>
        <p className="text-blue-400 font-black mb-6 tracking-widest text-xs uppercase">HARI KE-{streak}</p>

        <Transaction 
          chainId={8453} 
          calls={[{ to: '0x1D6837873D70E989E733e83F676B66b96fB690A8', data: '0x1249c58b', value: BigInt(0) }]} 
          onStatus={handleStatus}
          capabilities={{ 
            paymasterService: { 
              url: 'https://api.developer.coinbase.com/rpc/v1/base/f8b308db-f748-402c-b50c-1c903a02862f' 
            } 
          }}
        >
          {/* Tombol tanpa properti kustom yang aneh agar stabil */}
          <TransactionButton 
            text="SEND GM (FREE)" 
            className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-2xl font-black shadow-lg transition-all active:scale-95" 
          />
          <TransactionStatus className="mt-4">
            <TransactionStatusLabel className="text-slate-500 text-[10px] uppercase font-bold" />
            <TransactionStatusAction className="text-blue-500 text-[10px] underline block mt-1" />
          </TransactionStatus>
        </Transaction>
      </div>

      {isSuccess && (
        <button 
          onClick={() => setIsSuccess(false)} 
          className="mt-6 text-[10px] text-slate-500 underline uppercase font-bold tracking-widest"
        >
          Tutup Notifikasi
        </button>
      )}

      <footer className="mt-auto py-4 text-[8px] text-zinc-800 font-black uppercase tracking-[0.3em]">
        Bassy Ecosystem • 2026
      </footer>
    </div>
  );
}