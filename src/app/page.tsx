// @ts-nocheck
'use client';

import { useEffect, useState, useCallback } from 'react';
import { sdk } from '@farcaster/miniapp-sdk'; 
import { Transaction, TransactionButton, TransactionStatus, TransactionStatusLabel } from '@coinbase/onchainkit/transaction';
import { useAccount, useConnect } from 'wagmi';
import { coinbaseWallet } from 'wagmi/connectors';

const BUILDER_CODE = 'bc_3so7rnx9'; 
const PAYMASTER_URL = 'https://api.developer.coinbase.com/rpc/v1/base/f8b308db-f748-402c-b50c-1c903a02862f';
const CONTRACT_ADDRESS = '0x1D6837873D70E989E733e83F676B66b96fB690A8'; 

function createBuilderCodeSuffix(code) {
  const codeHex = Array.from(code).map(c => c.charCodeAt(0).toString(16)).join('');
  const codeLength = (code.length).toString(16).padStart(2, '0');
  const ercMarker = '80218021802180218021802180218021';
  const schemaId = '00';
  return '0x' + codeHex + codeLength + schemaId + ercMarker;
}

export default function Home() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [userName, setUserName] = useState("Hunter");
  const [userPfp, setUserPfp] = useState("/og-logobaru.jpeg");
  const [statusMessage, setStatusMessage] = useState("");
  const [txHash, setTxHash] = useState(null);

  const { address, isConnected } = useAccount();
  const { connect } = useConnect();

  useEffect(() => {
    const init = async () => {
      try {
        const context = await sdk.context;
        if (context && context.user) {
          setUserName(context.user.displayName || "Hunter");
          setUserPfp(context.user.pfpUrl || "/og-logobaru.jpeg");
        }
        if (!isConnected) {
          connect({ connector: coinbaseWallet({ appName: 'Bassy GM' }) });
        }
      } catch (e) {
        console.error("SDK Error:", e);
      } finally {
        sdk.actions.ready();
        setIsSDKLoaded(true);
      }
    };
    init();
  }, [connect, isConnected]);

  const handleStatus = useCallback((status) => {
    // LANGSUNG DETEKSI RECEIPT (Cara tercepat hilangkan loading)
    if (status.transactionReceipts && status.transactionReceipts.length > 0) {
        setStatusMessage("✅ GM Berhasil!");
        setTxHash(status.transactionReceipts[0].transactionHash);
        return;
    }

    if (status.statusName === 'transactionPending' || status.statusName === 'building') {
        setStatusMessage("⏳ Memproses...");
    } else if (status.statusName === 'success') {
        setStatusMessage("✅ GM Berhasil!");
    } else if (status.statusName === 'error') {
        setStatusMessage("❌ Gagal.");
    }
  }, []);

  const openLink = (url) => sdk.actions.openUrl(url);
  const builderSuffix = createBuilderCodeSuffix(BUILDER_CODE);
  const txData = '0x1249c58b' + builderSuffix.replace('0x', '');

  if (!isSDKLoaded) return null;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[250px] bg-blue-600/20 blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6 w-full max-w-md mx-auto">
        <div className="mb-6 relative">
          <div className="absolute inset-0 bg-blue-500 rounded-full blur-[15px] opacity-30"></div>
          <img src={userPfp} className="relative w-24 h-24 rounded-full border border-white/10 shadow-2xl object-cover" onError={(e) => { e.currentTarget.src = "/og-logobaru.jpeg" }} />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-black mb-1 uppercase italic">GM, {userName}</h1>
          <p className="text-blue-500 text-[10px] font-bold tracking-widest uppercase">{address ? `${address.slice(0,6)}...${address.slice(-4)}` : "Connecting..."}</p>
        </div>

        <div className="w-full bg-