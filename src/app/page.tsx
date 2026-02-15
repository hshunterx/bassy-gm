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

  // Handler Status yang lebih responsif
  const handleStatus = useCallback((status) => {
    console.log("Current Status:", status.statusName);
    
    if (status.statusName === 'transactionPending' || status.statusName === 'building') {
        setStatusMessage("⏳ Memproses Transaksi...");
    } 
    else if (status.statusName === 'transactionIdle') {
        setStatusMessage("");
    }
    else if (status.statusName === 'success') {
        setStatusMessage("✅ GM Berhasil Terkirim!");
        if (status.transactionReceipts && status.transactionReceipts.length > 0) {
            setTxHash(status.transactionReceipts[0].transactionHash);
        }
    } 
    else if (status.statusName === 'error') {
        setStatusMessage("❌ Gagal. Silakan coba lagi.");
        setTimeout(() => setStatusMessage(""), 5000);
    }
  }, []);

  const openLink = useCallback((url) => {
    sdk.actions.openUrl(url);
  }, []);

  const builderSuffix = createBuilderCodeSuffix(BUILDER_CODE);
  const txData = '0x1249c58b' + builderSuffix.replace('0x', '');

  if (!isSDKLoaded) {
    return <div className="flex h-screen items-center justify-center bg-black text-zinc-500 font-mono text-xs tracking-widest">INITIALIZING BASSY...</div>;
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#1e3a8a_0%,_#000000_70%)] opacity-40 z-0" />
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6 w-full max-w-md mx-auto">
        
        {/* Profile Section */}
        <div className="mb-6 relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-fuchsia-600 rounded-full blur opacity-30"></div>
          <img 
            src={userPfp} 
            className="relative w-24 h-24 rounded-full border border-white/10 shadow-2xl object-cover"
            onError={(e) => { e.currentTarget.src = "/og-logobaru.jpeg" }}
          />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white mb-1 tracking-tighter">GM, {userName}</h1>
          <p className="text-blue-500 text-[10px] font-bold tracking-[0.3em] uppercase">
            {address ? `${address.slice(0,6)}...${address.slice(-4)}` : "Connecting..."}
          </p>
        </div>

        {/* Transaction Container */}
        <div className="w-full bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 shadow-2xl mb-6">
            
            {statusMessage && (
                <div className="mb-4 text-center text-xs font-bold py-3 bg-white/5 border border-white/10 text-blue-100 rounded-xl animate-pulse">
                    {statusMessage}
                </div>
            )}

            <Transaction 
              chainId={8453} 
              calls={[{ to: CONTRACT_ADDRESS, data: txData, value: BigInt(0) }]} 
              onStatus={handleStatus}
              capabilities={{ paymasterService: { url: PAYMASTER_URL } }}
            >
              {/* Tombol yang konsisten (tidak putih) */}
              <TransactionButton 
                text="SEND GM ⚡" 
                className="w-full bg-white text-black font-extrabold text-sm py-4 rounded-2xl hover:bg-zinc-200 transition-all active:scale-95 shadow-lg shadow-white/5" 
              />
              <TransactionStatus className="block text-center mt-4">
                <TransactionStatusLabel className="text-[10px] uppercase tracking-widest text-zinc-600" />
              </TransactionStatus>
            </Transaction>
            
            {txHash && (
                <button 
                    onClick={() => openLink(`https://basescan.org/tx/${txHash}`)}
                    className="mt-4 w-full text-[10px] font-bold text-zinc-500 hover:text-white transition-colors"
                >
                    [ VIEW ON BASESCAN ]
                </button>
            )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 w-full opacity-80">
            <button 
                onClick={() => openLink("https://warpcast.com/~/developers/embed?url=https%3A%2F%2Fneynar-spam.vercel.app%2F")}
                className="bg-zinc-900/50 border border-white/5 text-zinc-400 font-bold py-3 rounded-xl text-[10px] uppercase tracking-widest"
            >
               🛡️ Check Spam
            </button>
            <button 
                onClick={() => openLink("https://dune.com/base/base-metrics")}
                className="bg-zinc-900/50 border border-white/5 text-zinc-400 font-bold py-3 rounded-xl text-[10px] uppercase tracking-widest"
            >
               📊 Bassy Chart
            </button>
        </div>

        <footer className="mt-12 text-[8px] text-zinc-700 font-bold tracking-[0.5em] uppercase">
          Builder: {BUILDER_CODE}
        </footer>
      </div>
    </main>
  );
}