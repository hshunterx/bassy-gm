import { NextRequest, NextResponse } from 'next/server';
import { encodeFunctionData, parseAbi } from 'viem';

// Konfigurasi Kontrak Bassy
const contractAddress = '0x1D6837873D70E989E733e83F676B66b96fB690A8';
const contractAbi = parseAbi(['function checkIn()']);

export async function POST(req: NextRequest) {
  try {
    const data = encodeFunctionData({
      abi: contractAbi,
      functionName: 'checkIn',
      args: [],
    });

    return NextResponse.json({
      chainId: 'eip155:8453', // Base Mainnet
      method: 'eth_sendTransaction',
      params: {
        abi: contractAbi as any,
        to: contractAddress,
        data: data,
        value: '0', 
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Transaction failed' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Bassy GM Transaction API is active' });
}