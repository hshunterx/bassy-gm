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
  const [isReady, setIsReady] = useState(false);
  const [userName, setUserName] = useState("Hunter");
  const [userPfp, setUserPfp] = useState("/og-logobaru.jpeg");
  const [msg, setMsg] = useState("");
  const [hash, setHash] = useState(null);

  const { address, isConnected } = useAccount();
  const { connect } = useConnect();

  useEffect(() => {
    async function start() {
      try {
        const ctx = await sdk.context;
        if (ctx?.user) {
          setUserName(ctx.user.displayName || "Hunter");
          setUserPfp(ctx.user.pfpUrl || "/og-logobaru.jpeg");
        }
        if (!isConnected) {
          connect({ connector: coinbaseWallet({ appName: 'Bassy GM' }) });
        }
      } catch (e) {
        console.error(e);
      } finally {
        sdk.actions.ready();
        setIsReady(true);
      }
    }
    start();
  }, [connect, isConnected]);

  const onStatus = useCallback((s) => {
    if (s.transactionReceipts?.length > 0) {
      setMsg("✅ GM Berhasil!");
      setHash(s.transactionReceipts[0].transactionHash);
    } else if (s.statusName === 'transactionPending' || s.statusName === 'building') {
      setMsg("⏳ Memproses...");
    } else if (s.statusName === 'error') {
      setMsg("❌ Gagal.");
    }
  }, []);

  const builderSuffix = createBuilderCodeSuffix(BUILDER_CODE);
  const txData = '0x1249c58b' + builderSuffix.replace('0x', '');

  if (!isReady) return null;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="absolute top-0 w-full h-64 bg-blue-600/10 blur-[100px]" />
      
      <div className="relative z-10 w-full max-w-sm text-center">
        <img src={userPfp} className="w-24 h-24 rounded-full mx-auto mb-4 border border-white/10 shadow-xl" onError={(e) => { e.currentTarget.src = "/og-logobaru.jpeg" }} />
        <h1 className="text-3xl font-black mb-1 uppercase italic">GM, {userName}</h1>
        <p className="text-blue-500 text-[10px] font-bold tracking-widest mb-8">{address ? `${address.slice(0,6)}...${address.slice(-4)}` : "Connecting..."}</p>

        <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6 backdrop-blur-xl shadow-2xl">
          {msg && <div className="mb-4 text-[10px] font-bold py-2 bg-blue-500/10 text-blue-300 rounded-lg">{msg}</div>}
          
          <Transaction chainId={8453} calls={[{ to: CONTRACT_ADDRESS, data: txData, value: BigInt(0) }]} onStatus={onStatus} capabilities={{ paymasterService: { url: PAYMASTER_URL } }}>
            <TransactionButton text="SEND GM BASE ⚡" className="w-full !bg-blue-600 !text-white font-black py-4 rounded-xl active:scale-95 transition-all" />
            <TransactionStatus><TransactionStatusLabel className="text-[9px] uppercase text-zinc-600 mt-2 block" /></TransactionStatus>
          </Transaction>

          {hash && (
            <button onClick={() => sdk.actions.openUrl(`https://basescan.org/tx/${hash}`)} className="mt-4 text-[9px] text-zinc-500 underline uppercase font-bold">View Transaction</button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <button onClick={() => sdk.actions.openUrl("https://warpcast.com/~/developers/embed?url=https%3A%2F%2Fneynar-spam.vercel.app%2F")} className="bg-zinc-900/50 border border-white/5 py-3 rounded-xl text-[10px] font-bold text-zinc-400 uppercase">🛡️ Spam Check</button>
          <button onClick={() => sdk.actions.openUrl("https://dune.com/base/base-metrics")} className="bg-zinc-900/50 border border-white/5 py-3 rounded-xl text-[10px] font-bold text-zinc-400 uppercase">📊 Bassy Chart</button>
        </div>
        
        <p className="mt-12 text-[8px] text-zinc-800 font-bold uppercase tracking-[0.4em]">ID: {BUILDER_CODE}</p>
      </div>
    </div>
  );
}