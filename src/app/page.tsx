// @ts-nocheck
'use client';

import { useEffect, useState, useCallback } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

// --- KONFIGURASI ---
const BUILDER_CODE = 'bc_3so7rnx9';
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

  useEffect(() => {
    async function start() {
      try {
        const ctx = await sdk.context;
        if (ctx?.user) {
          setUserName(ctx.user.displayName || "Hunter");
          setUserPfp(ctx.user.pfpUrl || "/og-logobaru.jpeg");
        }
      } catch (e) { console.error(e); }
      finally {
        sdk.actions.ready();
        setIsReady(true);
      }
    }
    start();
  }, []);

  // --- FUNGSI TRANSAKSI NATIVE FARCASTER ---
  const sendGmNative = useCallback(async () => {
    setMsg("⏳ Membuka Dompet...");
    const suffix = createBuilderCodeSuffix(BUILDER_CODE).replace('0x', '');
    const txData = '0x1249c58b' + suffix;

    try {
      // Menggunakan SDK Actions untuk memicu transaksi di dalam Warpcast
      const result = await sdk.actions.sendTransaction({
        chainId: 8453, // Base Mainnet
        to: CONTRACT_ADDRESS,
        data: txData,
        value: "0",
      });

      if (result?.hash) {
        setHash(result.hash);
        setMsg("✅ GM Berhasil!");
      }
    } catch (error) {
      console.error(error);
      setMsg("❌ Transaksi Dibatalkan.");
      setTimeout(() => setMsg(""), 3000);
    }
  }, []);

  if (!isReady) return null;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="absolute top-0 w-full h-64 bg-blue-600/10 blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-sm">
        <img src={userPfp} className="w-24 h-24 rounded-full mx-auto mb-4 border border-white/10 shadow-2xl" onError={(e) => { e.currentTarget.src = "/og-logobaru.jpeg" }} />
        <h1 className="text-3xl font-black mb-1 uppercase italic tracking-tighter">GM, {userName}</h1>
        <p className="text-blue-500 text-[10px] font-bold tracking-widest mb-10 uppercase opacity-70 italic">Bassy Protocol</p>

        <div className="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl shadow-2xl">
          {msg && (
            <div className={`mb-6 text-[10px] font-bold py-3 px-4 rounded-2xl border ${msg.includes('✅') ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-blue-500/10 text-blue-300 border-blue-500/20 animate-pulse'}`}>
              {msg}
            </div>
          )}
          
          <button 
            onClick={sendGmNative}
            className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl hover:bg-blue-500 active:scale-95 transition-all shadow-lg shadow-blue-900/20 text-sm uppercase tracking-widest"
          >
            SEND GM BASE ⚡
          </button>

          {hash && (
            <button 
              onClick={() => sdk.actions.openUrl(`https://basescan.org/tx/${hash}`)} 
              className="mt-6 text-[10px] text-zinc-500 underline uppercase font-bold tracking-tighter hover:text-white"
            >
              View on Basescan
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <button onClick={() => sdk.actions.openUrl("https://warpcast.com/~/developers/embed?url=https%3A%2F%2Fneynar-spam.vercel.app%2F")} className="bg-zinc-900/30 border border-white/5 py-3.5 rounded-2xl text-[10px] font-bold text-zinc-400 uppercase tracking-widest hover:bg-zinc-800 transition-all">🛡️ Spam</button>
          <button onClick={() => sdk.actions.openUrl("https://dune.com/base/base-metrics")} className="bg-zinc-900/30 border border-white/5 py-3.5 rounded-2xl text-[10px] font-bold text-zinc-400 uppercase tracking-widest hover:bg-zinc-800 transition-all">📊 Chart</button>
        </div>
        
        <p className="mt-12 text-[8px] text-zinc-800 font-bold uppercase tracking-[0.4em]">ID: {BUILDER_CODE}</p>
      </div>
    </div>
  );
}