'use client';

import { useEffect, useState } from 'react';
import { sdk } from '@farcaster/miniapp-sdk'; 
import { Transaction, TransactionButton, TransactionStatus, TransactionStatusLabel } from '@coinbase/onchainkit/transaction';
import type { LifecycleStatus } from '@coinbase/onchainkit/transaction';

// Komponen Overlay Animasi Metaverse (sederhana)
const MetaverseOverlay = () => (
  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
    {/* Grid Neon */}
    <div className="absolute inset-0 bg-grid-neon opacity-20 animate-pulse-slow"></div>
    {/* Partikel Terbang */}
    <div className="absolute inset-0 flex items-center justify-center">
      {[...Array(50)].map((_, i) => (
        <div 
          key={i} 
          className="absolute w-1 h-1 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full animate-float blur-sm" 
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  </div>
);

export default function Home() {
  const [userName, setUserName] = useState("Hunter");
  const [userPfp, setUserPfp] = useState("/og-logobaru.jpeg"); // Menggunakan logo baru
  const [loading, setLoading] = useState(false);
  const [showMoreActions, setShowMoreActions] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        const context = await sdk.context;
        if (context?.user) {
          setUserName(context.user.displayName || "Hunter");
          // Gunakan PFP user jika tersedia, jika tidak pakai logo default
          setUserPfp(context.user.pfpUrl || "/og-logobaru.jpeg");
        }
        sdk.actions.ready();
      } catch (e) {
        console.error("SDK Init Error:", e);
      }
    };
    init();
  }, []);

  const handleStatus = (status: LifecycleStatus) => {
    switch (status.statusName) {
      case 'init':
        setLoading(true);
        setStatusMessage("⏳ Membuka Dompet...");
        break;
      case 'transactionPending':
        setLoading(true);
        setStatusMessage("🚀 Mengirim ke Blockchain...");
        break;
      case 'success':
        setLoading(false);
        setStatusMessage("✅ GM Berhasil Dikirim!");
        setTimeout(() => setStatusMessage(""), 3000); // Hapus pesan setelah 3 detik
        break;
      case 'error':
        setLoading(false);
        setStatusMessage("❌ Transaksi Gagal atau Dibatalkan!");
        setTimeout(() => setStatusMessage(""), 3000); // Hapus pesan setelah 3 detik
        break;
    }
  };

  const handleActionClick = (url: string) => {
    sdk.actions.openUrl(url);
  };

  return (
    <main className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 font-sans overflow-hidden">
      <MetaverseOverlay /> {/* Animasi Metaverse */}

      {/* Status Bar Neon */}
      {statusMessage && (
        <div className="fixed top-0 left-0 right-0 z-50 p-4 text-center bg-gradient-to-r from-blue-600 to-fuchsia-600 text-sm font-bold shadow-xl animate-fade-in-down">
          {statusMessage}
        </div>
      )}

      {/* Kartu Utama */}
      <div className="relative z-10 w-full max-w-sm bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-blue-500/30 rounded-[2.5rem] p-8 shadow-[0_0_50px_rgba(59,130,246,0.3)] text-center animate-scale-in">
        <div className="relative mx-auto w-28 h-28 mb-6">
          <img src={userPfp} className="rounded-full border-4 border-blue-600 shadow-[0_0_20px_rgba(59,130,246,0.7)] object-cover w-full h-full" alt="profile or logo" />
          {loading && <div className="absolute inset-0 border-t-4 border-l-4 border-blue-400 rounded-full animate-spin"></div>}
        </div>

        <h1 className="text-4xl font-black italic tracking-tighter mb-2 uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">GM, {userName}</h1>
        <p className="text-sm font-bold tracking-[0.2em] uppercase text-fuchsia-400 mb-10">Bassy Protocol</p>

        {/* Tombol SEND GM BASE */}
        <Transaction 
          chainId={8453} 
          calls={[{ to: '0x1D6837873D70E989E733e83F676B66b96fB690A8', data: '0x1249c58b', value: BigInt(0) }]} 
          onStatus={handleStatus}
          capabilities={{ 
            paymasterService: { url: 'https://api.developer.coinbase.com/rpc/v1/base/f8b308db-f748-402c-b50c-1c903a02862f' } 
          }}
        >
          <TransactionButton 
            text={loading ? "TRANSACTION IN PROGRESS..." : "SEND GM BASE"} 
            className="w-full bg-gradient-to-br from-blue-600 to-fuchsia-600 hover:from-blue-500 hover:to-fuchsia-500 text-white font-black py-5 rounded-2xl transition-all duration-300 active:scale-95 shadow-[0_0_30px_rgba(59,130,246,0.5)] uppercase text-lg mb-4" 
          />
          <TransactionStatus className="text-[10px] uppercase font-bold text-zinc-400 mt-2">
            <TransactionStatusLabel />
          </TransactionStatus>
        </Transaction>

        {/* Tombol Lainnya (Membuka setelah diklik) */}
        <button 
          onClick={() => setShowMoreActions(!showMoreActions)} 
          className="mt-6 w-full text-xs font-bold uppercase tracking-wide text-blue-400 hover:text-fuchsia-400 transition-colors duration-200"
        >
          {showMoreActions ? "▲ HIDE ACTIONS" : "▼ MORE ACTIONS"}
        </button>

        {showMoreActions && (
          <div className="mt-4 space-y-3 animate-fade-in">
            <button 
              onClick={() => handleActionClick("https://warpcast.com/~/developers/embed?url=https%3A%2F%2Fneynar-spam.vercel.app%2F")} 
              className="w-full bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 rounded-xl text-md transition-all duration-300 active:scale-95 shadow-[0_0_20px_rgba(168,85,247,0.4)] uppercase"
            >
              Neynar & Spam
            </button>
            <button 
              onClick={() => handleActionClick("https://dune.com/base/base-metrics")} 
              className="w-full bg-gradient-to-br from-green-500 to-cyan-500 hover:from-green-400 hover:to-cyan-400 text-white font-bold py-4 rounded-xl text-md transition-all duration-300 active:scale-95 shadow-[0_0_20px_rgba(34,197,94,0.4)] uppercase"
            >
              Bassy Chart
            </button>
            <button 
              onClick={() => handleActionClick("https://www.google.com/search?q=free+nft+mint+base")} // Link ke pencarian Google sementara
              className="w-full bg-gradient-to-br from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-bold py-4 rounded-xl text-md transition-all duration-300 active:scale-95 shadow-[0_0_20px_rgba(251,191,36,0.4)] uppercase"
            >
              Mint NFT Free
            </button>
          </div>
        )}
      </div>

      <footer className="relative z-10 mt-12 text-[10px] text-zinc-700 font-black uppercase tracking-[0.3em] opacity-80">
        Bassy Ecosystem • {new Date().getFullYear()}
      </footer>
    </main>
  );
}