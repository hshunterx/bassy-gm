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
  const [userName, setUserName] = useState<string>("");
  const [userPfp, setUserPfp] = useState<string>("/logo-baru.png"); 
  const [streak, setStreak] = useState(0);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [lastCheckIn, setLastCheckIn] = useState(0);

  useEffect(() => {
    const loadContext = async () => {
      const context = await sdk.context;
      if (context?.user) {
        setUserName(context.user.displayName || context.user.username || "Hunter");
        // PERBAIKAN PFP: Langsung ambil dari context jika tersedia
        if (context.user.pfpUrl) {
          setUserPfp(context.user.pfpUrl);
        } else if (context.user.fid) {
           // Fallback ke Neynar jika context kosong
           fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${context.user.fid}`, {
             headers: { 'api_key': 'AC79604A-1C42-401D-AEEB-603CEE7C57B2' }
           })
           .then(res => res.json())
           .then(data => {
             if (data?.users?.[0]?.pfp_url) setUserPfp(data.users[0].pfp_url);
           });
        }
      }
      sdk.actions.ready();
    };
    loadContext();

    const savedStreak = localStorage.getItem('gm_streak');
    if (savedStreak) setStreak(parseInt(savedStreak));
  }, []);

  const handleStatus = (status: LifecycleStatus) => {
    if (status.statusName === 'success') {
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem('gm_streak', newStreak.toString());
      localStorage.setItem('last_gm_checkin', Date.now().toString());
      
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 5000);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white relative">
      {/* POPUP: Z-Index super tinggi agar tidak tertutup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 px-6">
          <div className="bg-blue-600 p-10 rounded-[3rem] text-center border-2 border-blue-400 shadow-2xl scale-110">
            <span className="text-6xl mb-4 block">🔥</span>
            <h2 className="text-3xl font-black uppercase italic">GM SUCCESS!</h2>
            <p className="text-xl font-bold mt-2">STREAK: {streak} HARI</p>
          </div>
        </div>
      )}

      <header className="p-4 flex justify-between items-center border-b border-white/10 sticky top-0 bg-black/80 z-50">
        <h1 className="text-xl font-black italic text-blue-500">BASSY GM</h1>
        <Wallet>
          <ConnectWallet className="bg-blue-600 rounded-full text-xs font-bold px-4 py-2">
            <Avatar className="h-4 w-4" />
            <Name />
          </ConnectWallet>
        </Wallet>
      </header>

      <main className="flex-grow flex flex-col items-center p-6 text-center">
        <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-[3rem] p-10 shadow-2xl backdrop-blur-md">
          <div className="relative w-28 h-28 mx-auto mb-6">
             <img src={userPfp} className="w-28 h-28 rounded-full border-4 border-blue-600 shadow-lg object-cover" alt="pfp" />
             <div className="absolute bottom-1 right-1 w-7 h-7 bg-blue-600 rounded-full border-2 border-black"></div>
          </div>

          <h2 className="text-3xl font-black italic uppercase mb-2">GM, {userName}!</h2>
          <div className="bg-blue-600/20 border border-blue-600/40 rounded-full px-6 py-2 inline-block mb-10">
            <span className="text-xs font-black text-blue-400 uppercase tracking-widest">🔥 {streak} HARI CHECK-IN</span>
          </div>

          <Transaction 
            chainId={8453} 
            calls={[{ to: '0x1D6837873D70E989E733e83F676B66b96fB690A8', data: '0x1249c58b', value: BigInt(0) }]} 
            onStatus={handleStatus}
            capabilities={{ paymasterService: { url: 'https://api.developer.coinbase.com/rpc/v1/base/f8b308db-f748-402c-b50c-1c903a02862f' } }}
          >
            <TransactionButton text="SEND GM ON-CHAIN (FREE)" className="w-full bg-blue-600 font-black py-5 rounded-[2rem] text-lg shadow-xl hover:scale-105 transition-transform" />
            <TransactionSponsor className="mt-4 text-[10px] text-blue-500 font-bold uppercase" />
            <TransactionStatus>
              <TransactionStatusLabel className="text-slate-500" />
              <TransactionStatusAction className="text-blue-500 underline ml-2" />
            </TransactionStatus>
          </Transaction>
        </div>
      </main>
    </div>
  );
}