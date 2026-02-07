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
  const [lastCheckIn, setLastCheckIn] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [canCheckIn, setCanCheckIn] = useState<boolean>(true);

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

    // Ambil data waktu terakhir dari memori HP
    const savedTime = localStorage.getItem('last_gm_checkin');
    if (savedTime) {
      setLastCheckIn(parseInt(savedTime));
    }
  }, [isSDKLoaded]);

  // Logika Hitung Mundur 12 Jam
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const twelveHours = 12 * 60 * 60 * 1000;
      const nextAllowedTime = lastCheckIn + twelveHours;

      if (now < nextAllowedTime) {
        setCanCheckIn(false);
        const diff = nextAllowedTime - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}j ${minutes}m ${seconds}d`);
      } else {
        setCanCheckIn(true);
        setTimeLeft("");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [lastCheckIn]);

  const handleStatus = (status: LifecycleStatus) => {
    if (status.statusName === 'success') {
      const now = Date.now();
      localStorage.setItem('last_gm_checkin', now.toString());
      setLastCheckIn(now);
      alert("GM Berhasil! Kamu sudah check-in. Kembali lagi dalam 12 jam.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white font-sans overflow-x-hidden relative">
      
      {/* Background Metaverse */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[120px]"></div>
      </div>

      <header className="flex justify-between items-center p-4 bg-black/40 backdrop-blur-xl border-b border-white/10 sticky top-0 z-20">
        <h1 className="text-xl font-black italic tracking-tighter text-blue-500">BASSY GM</h1>
        <Wallet>
          <ConnectWallet className="bg-blue-600 rounded-full px-4 py-2 text-sm text-white border-none">
            <Avatar className="h-4 w-4" />
            <Name />
          </ConnectWallet>
        </Wallet>
      </header>

      <main className="relative z-10 flex-grow flex flex-col items-center justify-start p-6 text-center">
        
        {/* Tombol Navigasi Sesuai Garis Kuning */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-md mt-2 mb-8">
            <a href="https://wild-event-563.app.ohara.ai/" target="_blank" className="bg-white/5 border border-white/10 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
              Neynar & Spam
            </a>
            <a href="https://success-settlers-744.app.ohara.ai/" target="_blank" className="bg-white/5 border border-white/10 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"></span>
              Bassy Chart
            </a>
        </div>

        <div className="max-w-md w-full bg-white/5 backdrop-blur-2xl p-8 rounded-[3rem] border border-white/10 space-y-6 shadow-2xl">
          <div className="space-y-4">
            <img src="/logo-baru.png" alt="Logo" className="w-24 h-24 mx-auto object-contain animate-[bounce_4s_infinite]" />
            <h2 className="text-2xl font-black italic">GM, {userName || 'Anon'}! 🔵</h2>
          </div>

          <div className="w-full">
            {canCheckIn ? (
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
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] border-none" 
                />
              </Transaction>
            ) : (
              <div className="w-full bg-slate-800/50 text-slate-400 py-4 rounded-2xl font-black border border-white/5 cursor-not-allowed">
                CHECKED IN: {timeLeft}
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-2 pt-2">
            <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${canCheckIn ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
              {canCheckIn ? 'Status: Ready to GM' : 'Status: Waiting Period'}
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