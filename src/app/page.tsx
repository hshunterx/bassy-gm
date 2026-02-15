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

  // Perbaikan deteksi status transaksi
  const handleStatus = useCallback((status) => {
    console.log("Tx Status:", status.statusName);
    
    // Deteksi saat sedang diproses
    if (status.statusName === 'transactionPending' || status.statusName === 'building') {
        setStatusMessage("⏳ Sedang Memverifikasi...");
    } 
    // Deteksi sukses instan
    else if (status.statusName === 'success' || (status.transactionReceipts && status.transactionReceipts.length > 0)) {
        setStatusMessage("✅ GM Sukses Terkirim!");
        if (status.transactionReceipts && status.transactionReceipts.length > 0) {
            setTxHash(status.transactionReceipts[0].transactionHash);
        }
    } 
    else if (status.statusName === 'error') {
        setStatusMessage("❌ Gagal. Cek koneksi Anda.");
    }
  }, []);

  const openLink = (url) => sdk.actions.openUrl(url);

  const builderSuffix = createBuilderCodeSuffix(BUILDER_CODE);
  const txData = '0x1249c58b' + builderSuffix.replace('0x', '');

  if (!isSDKLoaded) return null;

  return (
    <main className="min-h-screen bg-[#050505] text-white flex flex-col font-sans relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-blue-600/20 blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6 w-full max-w-md mx-auto">
        
        <div className="mb-6 relative">
          <div className="absolute inset-0 bg-blue-500 rounded-full blur-[20px] opacity-40"></div>
          <img 
            src={userPfp} 
            className="relative w-28 h-28 rounded-full border-2 border-white/10 shadow-2xl object-cover"
            onError={(e) => { e.currentTarget.src = "/og-logobaru.jpeg" }}
          />
        </div>

        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight uppercase italic">GM, {userName}</h1>
          <div className="inline-block px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
            <p className="text-blue-400 text-[10px] font-bold tracking-widest uppercase">
              {address ? `${address.slice(0,6)}...${address.slice(-4)}` : "Wallet Connected"}
            </p>
          </div>
        </div>

        <div className="w-full bg-[#111111]/80 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 shadow-2xl mb-8">
            
            {statusMessage && (
                <div className={`mb-6 text-center text-xs font-bold py-3 rounded-2xl border ${statusMessage.includes('✅') ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-blue-500/10 text-blue-300 border-blue-500/20 animate-pulse'}`}>
                    {statusMessage}
                </div>
            )}

            <div className="min-h-[80px] flex flex-col items-center justify-center">
              <Transaction 
                chainId={8453} 
                calls={[{ to: CONTRACT_ADDRESS, data: txData, value: BigInt(0) }]} 
                onStatus={handleStatus}
                capabilities={{ paymasterService: { url: PAYMASTER_URL } }}
              >
                <TransactionButton 
                  text="SEND GM BASE ⚡" 
                  className="w-full !bg-blue-600 !text-white font-black text-sm py-5 rounded-2xl hover:!bg-blue-500 transition-all active:scale-95 shadow-lg shadow-blue-900/20" 
                />
                <div className="mt-4">
                  <TransactionStatus>
                    <TransactionStatusLabel className="text-[9px] uppercase tracking-[0.2em] text-center w-full block text-zinc-500" />
                  </TransactionStatus>
                </div>
              </Transaction>
            </div>
            
            {txHash && (
                <button 
                    onClick={() => openLink(`https://basescan.org/tx/${txHash}`)}
                    className="mt-6 w-full text-[10px] font-bold text-zinc-500 hover:text-blue-400 transition-colors tracking-widest"
                >
                    — VIEW ON BASESCAN —
                </button>
            )}
        </div>

        <div className="grid grid-cols-2 gap-4 w-full">
            <button 
                onClick={() => openLink("https://warpcast.com/~/developers/embed?url=https%3A%2F%2Fneynar-spam.vercel.app%2F")}
                className="bg-zinc-900/40 border border-white/5 text-zinc-400 font-bold py-4 rounded-2xl text-[10px] uppercase tracking-widest"
            >
               🛡️ Check Spam
            </button>
            <button 
                onClick={() => openLink("https://dune.com/base/base-metrics")}
                className="bg-zinc-900/40 border border-white/5 text-zinc-400 font-bold py-4 rounded-2xl text-[10px] uppercase tracking-widest"
            >
               📊 Bassy Chart
            </button>
        </div>

        <p className="mt-12 text-[9px] text-zinc-800 font-bold uppercase tracking-[0.4em]">
          ID: {BUILDER_CODE}
        </p>
      </div>
    </main>
  );
}