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
  Identity 
} from '@coinbase/onchainkit/identity';
import { 
  Transaction, 
  TransactionButton, 
  TransactionStatus, 
  TransactionStatusAction, 
  TransactionStatusLabel 
} from '@coinbase/onchainkit/transaction';
import { base } from 'viem/chains';

export default function Home() {
  // Contoh alamat kontrak Mint (bisa kamu ganti nanti)
  const contracts = [
    {
      address: '0x035bb637375a20ee409867946258416035041040' as `0x${string}`,
      abi: [{"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"}],
      functionName: 'mint',
      args: [], 
    },
  ];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-slate-950 text-white">
      <div className="max-w-md w-full space-y-8 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
        
        {/* Header Section */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter">Bassy GM</h1>
          <p className="text-slate-400">Connect your wallet to start minting on Base</p>
        </div>

        {/* Wallet Connection Section */}
        <div className="flex justify-center">
          <Wallet>
            <ConnectWallet className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-all">
              <Avatar className="h-6 w-6" />
              <Name />
            </ConnectWallet>
            <WalletDropdown>
              <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                <Avatar />
                <Name />
                <Address />
              </Identity>
              <WalletDropdownDisconnect />
            </WalletDropdown>
          </Wallet>
        </div>

        {/* Transaction Section */}
        <div className="pt-4 border-t border-slate-800">
          <Transaction
            chainId={base.id}
            calls={contracts}
            onSuccess={(res) => console.log('Mint Success:', res)}
            onError={(err) => console.error('Mint Error:', err)}
          >
            <TransactionButton className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors" text="Mint NFT Now" />
            <TransactionStatus>
              <TransactionStatusLabel className="text-sm text-center block mt-2" />
              <TransactionStatusAction className="text-blue-400 font-medium hover:underline block text-center mt-1" />
            </TransactionStatus>
          </Transaction>
        </div>

      </div>

      <footer className="mt-8 text-slate-500 text-sm italic">
        Powered by Base & OnchainKit
      </footer>
    </main>
  );
}