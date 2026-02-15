import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'API Active' });
}

export async function POST() {
  return NextResponse.json({ message: 'Use Miniapp frontend for tx' });
}