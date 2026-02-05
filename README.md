# 🐟 Bassy GM - Farcaster Mini App v2

Bassy GM is a decentralized micro-application (Mini App) built on the **Base Network** and integrated with the **Farcaster v2 Framework**. This project allows users to send on-chain "GM" signals directly from their Warpcast feed.

## 🚀 Features
- **Farcaster v2 Integration**: Native Frame experience within Warpcast.
- **On-chain Transactions**: Interactive "SEND GM" button powered by **Base Mainnet**.
- **OnchainKit**: Utilizing Coinbase OnchainKit for seamless wallet connection and identity.
- **Dynamic Identity**: Automatically greets users using their Farcaster Display Name.

## 🛠️ Tech Stack
- **Blockchain**: [Base](https://base.org)
- **Framework**: [Next.js 15](https://nextjs.org/)
- **SDK**: [@farcaster/frame-sdk](https://www.npmjs.com/package/@farcaster/frame-sdk)
- **Web3 Tools**: [OnchainKit](https://onchainkit.xyz/), [Wagmi](https://wagmi.sh/), [Viem](https://viem.sh/)

## ⛓️ Smart Contract
The GM action interacts with the following contract on Base:
- **Contract Address**: `0x1D6837873D70E989E733e83F676B66b96fB690A8`
- **Network**: Base Mainnet (Chain ID: 8453)

## 📦 Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install