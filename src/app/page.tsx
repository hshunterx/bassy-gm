'use client';

import { 
  ConnectWallet, 
  Wallet, 
  WalletDropdown, 
  WalletDropdownDisconnect 
} from '@coinbase/onchainkit/wallet';
import { 
  Address, 
  Avatar, 
  Name, 
  Identity, 
  EthBalance 
} from '@coinbase/onchainkit/identity';
import { Transaction, TransactionButton } from '@coinbase/onchainkit/transaction';
import type { LifecycleStatus } from '@coinbase/onchainkit/transaction';

// Ini adalah contoh alamat kontrak NFT di jaringan Base (Base Thanksgiving)
// Kamu bisa menggantinya nanti dengan alamat kontrakmu sendiri
const NFT_CONTRACT_ADDRESS = '0x1D6837873D70E989E733e83F676B66b96fB690A8';

export default function Home() {
  const handleStatus = (status: LifecycleStatus) => {
    console.log('Transaction Status:', status);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-white font-sans">
      {/* Header / Navbar */}
      <header className="flex justify-between items-center p-6 bg-slate-800 border-b border-slate-700">
        <h1 className="text-2xl font-bold tracking-tight text-blue-400">Bassy GM</h1>
        
        <Wallet>
          <ConnectWallet className="bg-blue-600 hover:bg-blue-700 transition-colors">
            <Avatar className="h-6 w-6" />
            <Name />
          </ConnectWallet>
          <WalletDropdown>
            <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
              <Avatar />
              <Name />
              <Address />
              <EthBalance />
            </Identity>
            <WalletDropdownDisconnect />
          </WalletDropdown>
        </Wallet>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-8 text-center">
        <div className="max-w-md bg-slate-800 p-10 rounded-3xl shadow-2xl border border-slate-700">
          <h2 className="text-4xl font-extrabold mb-4">Hello, Onchain World! 🔵</h2>
          <p className="text-slate-400 mb-8 text-lg">
            Selamat datang di aplikasi Onchain pertamamu. Hubungkan dompetmu untuk mulai mencetak NFT di jaringan Base.
          </p>

          <div className="flex flex-col gap-4 w-full">
            <Transaction
              chainId={8453} // ID untuk Base Mainnet
              calls={[{
                to: NFT_CONTRACT_ADDRESS,
                data: '0x1249c58b', // Contoh fungsi Mint (tergantung kontrak)
                value: BigInt(0),
              }]}
              onStatus={handleStatus}
            >
              <TransactionButton className="w-full bg-gradient-to-r from-blue-500 to-purple-600 font-bold py-4 rounded-xl hover:scale-105 transition-transform" />
            </Transaction>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-slate-500 text-sm">
        Built with 💙 on Base
      </footer>
    </div>
  );
}