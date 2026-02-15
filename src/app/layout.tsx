import type { Metadata } from 'next';
import './globals.css';

// URL Deployment kamu (Pastikan ini benar)
const appUrl = 'https://bassy-gm.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: 'Bassy GM',
  description: 'GM On-Chain with Bassy, powered by Base.',
  openGraph: {
    title: 'Bassy GM',
    description: 'Send GM On-Chain with Bassy.',
    images: [`${appUrl}/og-logobaru.jpeg`], 
  },
  other: {
    // ID Aplikasi Base (JANGAN DIHAPUS)
    'base:app_id': '6984afdb4609f1d788ad2be1', 
    
    // Konfigurasi Frame v2 Standar
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
      <body className="antialiased bg-black text-white">{children}</body>
    </html>
  );
}