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
  TransactionStatusLabel
} from '@coinbase/onchainkit/transaction';
import type { LifecycleStatus } from '@coinbase/onchainkit/transaction';

const NFT_CONTRACT_ADDRESS = '0x1D6837873D70E989E733e83F676B66b96fB690A8';
const NEYNAR_API_KEY = 'AC79604A-1C42-401D-AEEB-603CEE7C57B2'; 
const PAYMASTER_URL = 'https://api.developer.coinbase.com/rpc/v1/base/f8b308db-f748-402c-b50c-1c903a02862f';

export default function Home() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [userName, setUserName] = useState<string | undefined>(undefined);
  const [userPfp, setUserPfp] = useState<string>("/logo-baru.png"); 
  const [lastCheckIn, setLastCheckIn] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [canCheckIn, setCanCheckIn] = useState<boolean>(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const context = await sdk.context;
        if (context?.user) {
          setUserName(context.user.displayName);
          if (context.user.fid) {
            fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${context.user.fid}`, {
              headers: { 'api_key': NEYNAR_API_KEY }
            })
            .then(res => res.json())
            .then(data => {
              if (data?.users?.[0]) setUserPfp(data.users[0].pfp_url);
            })
            .catch(err => console.error("Neynar Error:", err));
          }
        }
        sdk.actions.ready();
      } catch (error) {
        console.error("SDK Error:", error);
      }
    };

    if (!isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
    }

    const savedTime = localStorage.getItem('last_gm_checkin');
    const savedStreak = localStorage.getItem('gm_streak');
    if (savedTime) setLastCheckIn(parseInt(savedTime));
    if (savedStreak) setStreak(parseInt(savedStreak));
  }, [isSDKLoaded]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const nextAllowedTime = lastCheckIn + (12 * 60 * 60 * 1000);

      if (now < nextAllowedTime) {
        setCanCheckIn(false);
        const diff = nextAllowedTime - now;
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${h}j ${m}m ${s}s`);
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
      const newStreak = streak + 1;
      
      setStreak(newStreak);
      setLastCheckIn(now);
      localStorage.setItem('last_gm_checkin', now.toString());
      localStorage.setItem('gm_streak', newStreak.toString());
      
      // Popup muncul 2 detik
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 2000);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white font-sans overflow-x-hidden relative">
      {/*