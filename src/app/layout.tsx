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
  title: "Bassy GM - Onchain App",
  description: "Say GM on Base via Farcaster",
  openGraph: {
    title: "Bassy GM",
    description: "Say GM on Base via Farcaster",
    images: ["https://bassy-gm.vercel.app/og-image.png.jpeg"],
  },
  other: {
    "fc:frame": "vNext",
    "fc:frame:image": "https://bassy-gm.vercel.app/og-image.png.jpeg",
    "fc:frame:button:1": "SEND GM Bassy",
    "fc:frame:button:1:action": "launch_app",
    "fc:frame:button:1:target": "https://bassy-gm.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}