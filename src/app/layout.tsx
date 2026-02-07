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

// Metadata terbaru sesuai standar Base Mini App & Farcaster v2
export const metadata: Metadata = {
  title: "Bassy GM",
  description: "Say GM on Base via Farcaster",
  openGraph: {
    title: "Bassy GM",
    description: "Say GM on Base via Farcaster",
    images: ["https://bassy-gm.vercel.app/og-image.png.jpeg"],
  },
  other: {
    // Verifikasi ID Aplikasi Base kamu
    "base:app_id": "6984afdb4609f1d788ad2be1",
    // Format Manifest Mini App terbaru (menggantikan fc:frame lama)
    "fc:frame": JSON.stringify({
      version: "next",
      imageUrl: "https://bassy-gm.vercel.app/og-image.png.jpeg",
      button: {
        title: "SEND GM Bassy",
        action: {
          type: "launch_app", // Gunakan launch_app sesuai dokumentasi terbaru
          name: "Bassy GM",
          url: "https://bassy-gm.vercel.app",
          splashImageUrl: "https://bassy-gm.vercel.app/og-image.png.jpeg",
          splashBackgroundColor: "#0052FF",
        },
      },
    }),
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