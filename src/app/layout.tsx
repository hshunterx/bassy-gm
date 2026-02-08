import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://bassy-gm.vercel.app/'), // Ganti dengan URL deployment Anda
  title: 'Bassy GM',
  description: 'GM On-Chain with Bassy, powered by Base.',
  openGraph: {
    title: 'Bassy GM',
    description: 'GM On-Chain with Bassy, powered by Base.',
    images: ['/og-logobaru.jpeg'], // Menggunakan logo baru
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': 'https://bassy-gm.vercel.app/og-logobaru.jpeg', // Ganti dengan URL deployment Anda
    'fc:frame:button:1': 'SEND GM BASE',
    'fc:frame:button:1:action': 'tx',
    'fc:frame:button:1:target': 'https://bassy-gm.vercel.app/api/tx', // Endpoint API untuk transaksi
    'fc:frame:button:1:post_url': 'https://bassy-gm.vercel.app/api/tx', // Endpoint API untuk post transaksi
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}