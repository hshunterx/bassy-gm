'use client';

import { useEffect, useState, useCallback } from 'react';
import { sdk } from '@farcaster/miniapp-sdk'; 
import { Transaction, TransactionButton, TransactionStatus, TransactionStatusLabel } from '@coinbase/onchainkit/transaction';
import type { LifecycleStatus } from '@coinbase/onchainkit/transaction';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

// --- KONFIGURASI PENTING (JANGAN DIHAPUS) ---
const BUILDER_CODE = 'bc_3so7rnx9'; // Kode Builder kamu
const PAYMASTER_URL = 'https://api.developer.coinbase.com/rpc/v1/base/f8b308db-f748-402c-b50c-1c903a02862f';
const CONTRACT_ADDRESS = '0x1D6837873D70E989E733e83F676B66b96fB690A8'; // Alamat Kontrak GM

// Fungsi untuk membuat Data Suffix ERC-8021 (Builder Code)
// Referensi: https://blog.base.dev/builder-codes-and-erc-8021-fixing-onchain-attribution
function createBuilderCodeSuffix(code: string): string {
  // Convert string code to hex
  const codeHex = Array.from(code).map(c => c.charCodeAt(0).toString(16)).join('');
  const codeLength = (code.length).toString(16).padStart(2, '0');
  
  // Standar ERC-8021 Marker
  const ercMarker = '80218021802180218021802180218021';
  const schemaId = '00';
  
  // Format: CodeHex + Length + SchemaId + Marker
  return `0x${codeHex}${codeLength}${schemaId}${ercMarker}`;
}

export default function Home() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [userName, setUserName] = useState("Hunter");
  const [userPfp, setUserPfp] = useState("/og-logobaru.jpeg");
  const [statusMessage, setStatusMessage] = useState("");
  const [txHash, setTxHash] = useState<string | null>(null);

  // Inisialisasi Farcaster SDK
  useEffect(() => {
    const init = async () => {
      try {
        const context = await sdk.context;
        if (context?.user) {
          setUserName(context.user.displayName || "Hunter");
          setUserPfp(context.user.pfpUrl || "/og-logobaru.jpeg");
        }
        // Memberitahu Warpcast bahwa aplikasi siap ditampilkan
        sdk.actions.ready();
        setIsSDKLoaded(true);
      } catch (e) {
        console.error("SDK Init Error:", e);
        // Tetap jalankan ready agar tidak stuck loading walau error
        sdk.actions.ready();
      }
    };
    init();
  }, []);

  const handleStatus = (status: LifecycleStatus) => {
    console.log("Transaction Status:", status);
    
    switch (status.statusName) {
      case 'transactionPending':
        setStatusMessage("🚀 Mengirim ke Blockchain...");
        break;
      case 'success':
        setStatusMessage("✅ GM Berhasil Dikirim!");
        // Simpan hash transaksi jika tersedia di data receipt
        if (status.transactionReceipts && status.transactionReceipts.length > 0) {
            setTxHash(status.transactionReceipts[0].transactionHash);
        }
        break;
      case 'error':
        setStatusMessage("❌ Gagal. Coba lagi.");
        break;
      default:
        setStatusMessage("");
    }
  };

  const openLink = useCallback((url: string) => {
    sdk.actions.openUrl(url);
  }, []);

  // Persiapan Data Transaksi dengan Builder Code
  const builderSuffix = createBuilderCodeSuffix(BUILDER_CODE);
  // Data asli '0x1249c58b' + Suffix (tanpa 0x di suffix karena digabung)
  // Perhatikan: Data asli harus hex, suffix kita sudah siapkan formatnya.
  // Karena wagmi/viem biasanya menangani 'data' sebagai hex string, 
  // kita gabungkan manual: data asli + suffix (tanpa 0x depannya)
  const txData = `0x1249c58b${builderSuffix.replace('0x', '')}` as `0x${string}`;

  if (!isSDKLoaded) {
    return <div className="flex h-screen items-center justify-center bg-black text-white">Loading Bassy GM...</div>;
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col font-sans relative overflow-hidden">
      
      {/* Background Effects (Modern & Ringan) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black z-0 pointer-events-none" />
      
      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6 w-full max-w-md mx-auto">
        
        {/* Profile Section */}
        <div className="mb-8 relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-1000"></div>
          <img 
            src={userPfp} 
            alt="Profile" 
            className="relative w-24 h-24 rounded-full border-2 border-white/10 shadow-2xl object-cover"
            onError={(e) => { e.currentTarget.src = "/og-logobaru.jpeg" }} // Fallback jika gambar error
          />
        </div>

        {/* Header Text */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
            GM, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">{userName}</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium tracking-widest uppercase">Bassy Protocol Enabled</p>
        </div>

        {/* Transaction Card */}
        <div className="w-full bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-3xl p-6 shadow-xl mb-6">
            
            {statusMessage && (
                <div className={`mb-4 text-center text-sm font-bold py-2 rounded-lg ${statusMessage.includes("✅") ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400"}`}>
                    {statusMessage}
                </div>
            )}

            <Transaction 
              chainId={8453} 
              calls={[{ 
                to: CONTRACT_ADDRESS, 
                data: txData, // Data sudah termasuk Builder Code
                value: BigInt(0) 
              }]} 
              onStatus={handleStatus}
              capabilities={{ 
                paymasterService: { url: PAYMASTER_URL } 
              }}
            >
              <TransactionButton 
                text="SEND GM ⚡" 
                className="w-full bg-white text-black font-bold text-lg py-4 rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]" 
              />
              <TransactionStatus className="block text-center mt-3 text-xs text-zinc-500" >
                <TransactionStatusLabel />
              </TransactionStatus>
            </Transaction>
            
            {txHash && (
                <button 
                    onClick={() => openLink(`https://basescan.org/tx/${txHash}`)}
                    className="mt-4 w-full text-xs text-zinc-400 underline decoration-zinc-700 hover:text-white"
                >
                    View on Basescan
                </button>
            )}
        </div>

        {/* Secondary Actions (Clean & Minimalist) */}
        <div className="grid grid-cols-2 gap-3 w-full">
            <button 
                onClick={() => openLink("https://warpcast.com/~/developers/embed?url=https%3A%2F%2Fneynar-spam.vercel.app%2F")}
                className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-semibold py-3 rounded-xl text-sm transition-colors"
            >
               🛡️ Check Spam
            </button>
            <button 
                onClick={() => openLink("https://dune.com/base/base-metrics")}
                className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-semibold py-3 rounded-xl text-sm transition-colors"
            >
               📊 Bassy Chart
            </button>
        </div>

        {/* Footer */}
        <div className="mt-12 opacity-30">
            <p className="text-[10px] font-mono text-zinc-500 uppercase">Powered by Base • {BUILDER_CODE}</p>
        </div>

      </div>
    </main>
  );
}