// @ts-nocheck
'use client';

import { useEffect, useState, useCallback } from 'react';
import { sdk } from '@farcaster/miniapp-sdk'; 
import { Transaction, TransactionButton, TransactionStatus, TransactionStatusLabel } from '@coinbase/onchainkit/transaction';
import { useAccount, useConnect } from 'wagmi';
import { coinbaseWallet } from 'wagmi/connectors';

// --- KONFIGURASI ---
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

  // Wagmi Hooks untuk memastikan koneksi dompet otomatis
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
        
        // Hubungkan dompet secara otomatis saat aplikasi dimuat
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

  const handleStatus = (status) => {
    if (status.statusName === 'transactionPending') {
        setStatusMessage("🚀 Mengirim ke Blockchain...");
    } 
    else if (status.statusName === 'success') {
        setStatusMessage("✅ GM Berhasil Dikirim!");
        if (status.transactionReceipts && status.transactionReceipts.length > 0) {
            setTxHash(status.transactionReceipts[0].transactionHash);
        }
    } 
    else if (status.statusName === 'error') {
        setStatusMessage("❌ Gagal. Pastikan saldo cukup/jaringan Base.");
    }
  };

  const openLink = useCallback((url) => {
    sdk.actions.openUrl(url);
  }, []);

  const builderSuffix = createBuilderCodeSuffix(BUILDER_CODE);
  const txData = '0x1249c58b' + builderSuffix.replace('0x', '');

  if (!isSDKLoaded) {
    return <div className="flex h-screen items-center justify-center bg-black text-white">Loading Bassy...</div>;
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-black z-0 pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6 w-full max-w-md mx-auto">
        
        <div className="mb-8 relative">
          <div className="absolute -inset-1 bg-blue-500 rounded-full blur opacity-50"></div>
          <img 
            src={userPfp} 
            className="relative w-24 h-24 rounded-full border-2 border-white/20 shadow-xl object-cover"
            onError={(e) => { e.currentTarget.src = "/og-logobaru.jpeg" }}
          />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-white mb-2">
            GM, <span className="text-blue-400">{userName}</span>
          </h1>
          <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase">
            {address ? `Wallet: ${address.slice(0,6)}...${address.slice(-4)}` : "Connecting Wallet..."}
          </p>
        </div>

        <div className="w-full bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 shadow-2xl mb-6">
            
            {statusMessage && (
                <div className="mb-4 text-center text-sm font-bold py-2 bg-blue-900/30 text-blue-300 rounded-lg">
                    {statusMessage}
                </div>
            )}

            {/* Tombol Transaksi Utama */}
            <Transaction 
              chainId={8453} 
              calls={[{ 
                to: CONTRACT_ADDRESS, 
                data: txData, 
                value: BigInt(0) 
              }]} 
              onStatus={handleStatus}
              capabilities={{ 
                paymasterService: { url: PAYMASTER_URL } 
              }}
            >
              <TransactionButton 
                text="SEND GM ⚡" 
                className="w-full bg-white text-black font-bold text-lg py-4 rounded-xl hover:opacity-90 transition-all active:scale-95" 
              />
              <TransactionStatus className="block text-center mt-3 text-xs text-zinc-500">
                <TransactionStatusLabel />
              </TransactionStatus>
            </Transaction>
            
            {txHash && (
                <button 
                    onClick={() => openLink(`https://basescan.org/tx/${txHash}`)}
                    className="mt-4 w-full text-xs text-zinc-400 underline hover:text-white"
                >
                    View on Basescan
                </button>
            )}
        </div>

        <div className="grid grid-cols-2 gap-3 w-full">
            <button 
                onClick={() => openLink("https://warpcast.com/~/developers/embed?url=https%3A%2F%2Fneynar-spam.vercel.app%2F")}
                className="bg-zinc-900 border border-zinc-800 text-zinc-300 font-semibold py-3 rounded-xl text-sm"
            >
               🛡️ Check Spam
            </button>
            <button 
                onClick={() => openLink("https://dune.com/base/base-metrics")}
                className="bg-zinc-900 border border-zinc-800 text-zinc-300 font-semibold py-3 rounded-xl text-sm"
            >
               📊 Bassy Chart
            </button>
        </div>

        <div className="mt-8 opacity-30 text-center">
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
              BUILDER ATTR: {BUILDER_CODE}
            </p>
        </div>
      </div>
    </main>
  );
}