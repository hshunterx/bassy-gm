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

// Metadata terbaru sesuai instruksi Tim Base
export const metadata: Metadata = {
  title: "Bassy GM",
  description: "Send GM On BASE", // Deskripsi yang kamu inginkan muncul di Warpcast
  openGraph: {
    title: "Bassy GM",
    description: "Send GM On BASE",
    images: ["https://bassy-gm.vercel.app/logo-baru.png"], // Gunakan logo utama kamu
  },
  other: {
    // Verifikasi ID Aplikasi Base
    "base:app_id": "6984afdb4609f1d788ad2be1",
    
    // Konfigurasi Frame sesuai saran Tim Base
    "fc:frame": JSON.stringify({
      version: "next",
      imageUrl: "https://bassy-gm.vercel.app/logo-baru.png",
      button: {
        title: "Launch BASSY GM",
        action: {
          type: "launch_frame", // PERBAIKAN: Wajib 'launch_frame' sesuai instruksi Tim Base
          name: "Bassy GM",
          url: "https://bassy-gm.vercel.app",
          splashImageUrl: "https://bassy-gm.vercel.app/logo-baru.png",
          splashBackgroundColor: "#000000",
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