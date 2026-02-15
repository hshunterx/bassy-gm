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

  // LOGIKA "INSTANT SUCCESS"
  const onStatus = useCallback((s) => {
    // Jika hash transaksi sudah ada, langsung tampilkan sukses (Optimistic)
    if (s.statusName === 'success' || (s.transactionReceipts && s.transactionReceipts.length > 0)) {
      setMsg("✅ GM Berhasil Terkirim!");
      if (s.transactionReceipts?.[0]) {
        setHash(s.transactionReceipts[0].transactionHash);
      }
    } else if (s.statusName === 'transactionPending' || s.statusName === 'building') {
      setMsg("⏳ Sedang Memproses...");
    } else if (s.statusName === 'error') {
      setMsg("❌ Gagal. Coba lagi.");
    }
  }, []);

  const builderSuffix = createBuilderCodeSuffix(BUILDER_CODE);
  const txData = '0x1249c58b' + builderSuffix.replace('0x', '');

  if (!isReady) return null;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="absolute top-0 w-full h-48 bg-blue-600/10 blur-[80px]" />
      
      <div className="relative z-10 w-full max-w-xs text-center">
        <img src={userPfp} className="w-20 h-20 rounded-full mx-auto mb-3 border border-white/10" onError={(e) => { e.currentTarget.src = "/og-logobaru.jpeg" }} />
        <h1 className="text-2xl font-black mb-1 italic uppercase">GM, {userName}</h1>
        <p className="text-blue-500 text-[9px] font-bold tracking-widest mb-6">{address ? `${address.slice(0,6)}...${address.slice(-4)}` : "Connecting..."}</p>

        <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-5 backdrop-blur-md">
          {msg && (
            <div className={`mb-4 text-[9px] font-bold py-2 rounded-lg border ${msg.includes('✅') ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-blue-500/10 text-blue-300 border-blue-500/20 animate-pulse'}`}>
              {msg}
            </div>
          )}
          
          <Transaction 
            chainId={8453} 
            calls={[{ to: CONTRACT_ADDRESS, data: txData, value: BigInt(0) }]} 
            onStatus={onStatus} 
            capabilities={{ paymasterService: { url: PAYMASTER_URL } }}
          >
            <TransactionButton 
              text="SEND GM BASE ⚡" 
              className="w-full !bg-blue-600 !text-white font-black py-3.5 rounded-xl active:scale-95 transition-all text-sm" 
            />
            <TransactionStatus>
              <TransactionStatusLabel className="text-[8px] uppercase text-zinc-600 mt-2 block" />
            </TransactionStatus>
          </Transaction>

          {hash && (
            <button onClick={() => sdk.actions.openUrl(`https://basescan.org/tx/${hash}`)} className="mt-4 text-[8px] text-zinc-500 underline uppercase font-bold tracking-tighter hover:text-white">
              View on Basescan
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4">
          <button onClick={() => sdk.actions.openUrl("https://warpcast.com/~/developers/embed?url=https%3A%2F%2Fneynar-spam.vercel.app%2F")} className="bg-zinc-900/30 border border-white/5 py-2.5 rounded-lg text-[8px] font-bold text-zinc-400 uppercase">🛡️ Spam</button>
          <button onClick={() => sdk.actions.openUrl("https://dune.com/base/base-metrics")} className="bg-zinc-900/30 border border-white/5 py-2.5 rounded-lg text-[8px] font-bold text-zinc-400 uppercase">📊 Chart</button>
        </div>
        
        <p className="mt-8 text-[7px] text-zinc-800 font-bold uppercase tracking-[0.4em]">ID: {BUILDER_CODE}</p>
      </div>
    </div>
  );
}