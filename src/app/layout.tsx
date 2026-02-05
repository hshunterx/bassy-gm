import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "../components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bassy GM",
  description: "Say GM on Base via Farcaster",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Metadata Frame v2 berdasarkan dokumentasi Base.org
  const frameMetadata = {
    version: "next",
    imageUrl: "https://bassy-gm.vercel.app/og-image.png.jpeg",
    button: {
      title: "SEND GM Bassy",
      action: {
        type: "launch_app",
        name: "Bassy GM",
        url: "https://bassy-gm.vercel.app",
        splashImageUrl: "https://bassy-gm.vercel.app/og-image.png.jpeg",
        splashBackgroundColor: "#0052FF",
      },
    },
  };

  return (
    <html lang="en">
      <head>
        {/* Pastikan menggunakan name="fc:frame" dengan stringify JSON */}
        <meta name="fc:frame" content={JSON.stringify(frameMetadata)} />
        <meta property="og:image" content="https://bassy-gm.vercel.app/og-image.png.jpeg" />
        <meta property="og:title" content="Bassy GM" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}