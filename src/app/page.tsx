'use client';

import { useEffect, useState } from 'react';
import { sdk } from '@farcaster/miniapp-sdk'; 
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
// API Key Neynar kamu sudah terpasang
const NEYNAR_API_KEY = 'AC79604A-1C42-401D-AEEB-603CEE7C57B2'; 

export default function Home() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [userName, setUserName] = useState<string | undefined>(undefined);
  const [userPfp, setUserPfp] = useState<string>("/logo-baru.png"); // Default jika PFP gagal dimuat
  const [lastCheckIn, setLastCheckIn] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [canCheckIn, setCanCheckIn] = useState<boolean>(true);

  useEffect(() => {
    const load = async () => {
      try {
        const context = await sdk.context;
        if (context?.user) {
          setUserName(context.user.displayName);
          
          // MENGAMBIL DATA PROFIL DARI NEYNAR BERDASARKAN FID
          if (context.user.fid) {
            fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${context.user.fid}`, {
              headers: { 'api_key': NEYNAR_API_KEY }
            })
            .then(res => res.json())
            .then(data => {
              if (data.users && data.users[0]) {
                setUserPfp(data.users[0].pfp_url);
              }
            })
            .catch(err => console.error("Neynar Fetch Error:", err));
          }
        }
        sdk.actions.ready();
      } catch (error) {
        console.error("Farcaster Mini-app SDK load failed:", error);
      }
    };

    if (!isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
    }

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
        setTimeLeft(`${hours}j ${minutes}m ${seconds}s`);
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
      alert("✅ GM Berhasil! Kamu sudah check-in.");
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
          <ConnectWallet className="bg-blue-600 rounded-full px-4 py-2 text-sm text-white border-none transition-all active:scale-95">
            <Avatar className="h-4 w-4" />
            <Name />
          </ConnectWallet>
        </Wallet>
      </header>

      <main className="relative z-10 flex-grow flex flex-col items-center justify-start p-6 text-center">
        
        {/* Tombol Navigasi Menu Atas */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-md mt-2 mb-8 px-2">
            <a href="https://wild-event-563.app.ohara.ai/" target="_blank" className="bg-white/5 border border-white/10 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
              Neynar & Spam
            </a>
            <a href="https://success-settlers-744.app.ohara.ai/" target="_blank" className="bg-white/5 border border-white/10 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95">
              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"></span>
              Bassy Chart
            </a>
        </div>

        <div className="max-w-md w-full bg-white/5 backdrop-blur-2xl p-8 rounded-[3rem] border border-white/10 space-y-6 shadow-2xl transition-all">
          <div className="space-y-4">
            {/* TAMPILAN FOTO PROFIL DARI NEYNAR */}
            <div className="relative mx-auto w-24 h-24">
              <img 
                src={userPfp} 
                alt="User PFP" 
                className="w-24 h-24 mx-auto rounded-full object-cover border-2 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,