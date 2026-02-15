import type { Metadata } from 'next';
import './globals.css';
import '@coinbase/onchainkit/styles.css'; 
import { Providers } from '../components/Providers';

// URL Aplikasi Kamu
const appUrl = 'https://bassy-gm.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: 'Bassy GM',
  description: 'GM On-Chain with Bassy',
  openGraph: {
    title: 'Bassy GM',
    description: 'Send GM On-Chain with Bassy.',
    images: [`${appUrl}/og-logobaru.jpeg`], 
  },
  other: {
    // ID Wajib (Jangan Dihapus)
    'base:app_id': '6984afdb4609f1d788ad2be1', 
    
    // Konfigurasi Frame v2
    'fc:frame': JSON.stringify({
      version: "next",
      imageUrl: `${appUrl}/og-logobaru.jpeg`, 
      button: {
        title: "Launch Bassy GM",
        action: {
          type: "launch_frame",
          name: "Bassy GM",
          url: appUrl,
          splashImageUrl: `${appUrl}/og-logobaru.jpeg`,
          splashBackgroundColor: "#000000",
        },
      },
    }),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-black text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}