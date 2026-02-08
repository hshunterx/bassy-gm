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

  useEffect(() => {
    const init = async () => {
      const context = await sdk.context;
      if (context?.user?.pfpUrl) setUserPfp(context.user.pfpUrl);
      sdk.actions.ready();
    };
    init();
    const saved = localStorage.getItem('gm_streak');
    if (saved) setStreak(parseInt(saved));
  }, []);

  const handleStatus = (status: LifecycleStatus) => {
    // Paymaster tetap bekerja di sini
    if (status.statusName === 'success') {
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem('gm_streak', newStreak.toString());
      
      // TAMPILAN SUKSES
      setIsSuccess(true);
      alert("✅ GM BERHASIL DIKIRIM!"); // Notifikasi cadangan paling aman
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white p-6 items-center font-sans">
      
      {/* Tampilan Notifikasi Sukses Sederhana */}
      {isSuccess && (
        <div className="bg-green-600 w-full p-4 rounded-xl mb-4 text-center font-black animate-bounce">
          🔥 GM BERHASIL! STREAK: {streak}
        </div>
      )}

      <header className="w-full flex justify-between items-center mb-8">
        <h1 className="text-xl font-black italic text-blue-500">BASSY GM</h1>
        <Wallet>
          <ConnectWallet className="bg-blue-600 rounded-full px-4 py-1 text-xs">
            <Avatar className="h-4 w-4" />
            <Name />
          </ConnectWallet>
        </Wallet>
      </header>

      <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] w-full max-w-sm text-center">
        <img src={userPfp} className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-blue-500" alt="pfp" />
        <h2 className="text-2xl font-black italic uppercase">GM, Hunter!</h2>
        <p className="text-blue-400 font-bold mb-6">HARI KE-{streak}</p>

        <Transaction 
          chainId={8453} 
          calls={[{ to: '0x1D6837873D70E989E733e83F676B66b96fB690A8', data: '0x1249c58b', value: BigInt(0) }]} 
          onStatus={handleStatus}
          capabilities={{ paymasterService: { url: 'https://api.developer.coinbase.com/rpc/v1/base/f8b308db-f748-402c-b50c-1c903a02862f' } }}
        >
          <TransactionButton text="SEND GM (FREE)" className="w-full bg-blue-600 py-4 rounded-xl font-black" />
          <TransactionStatus className="mt-4">
            <TransactionStatusLabel className="text-slate-500 text-xs uppercase" />
            <TransactionStatusAction className="text-blue-500 text-xs underline block" />
          </TransactionStatus>
        </Transaction>
      </div>

      {isSuccess && (
        <button onClick={() => setIsSuccess(false)} className="mt-4 text-xs text-slate-500 underline">
          Tutup Notifikasi
        </button>
      )}
    </div>
  );
}