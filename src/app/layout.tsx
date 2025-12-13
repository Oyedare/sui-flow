  import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Flow - Sui Portfolio Tracker",
  description: "Privacy-first portfolio tracker for the Sui ecosystem. Track assets, DeFi positions, and history.",
  openGraph: {
    title: "Flow - Master Your Sui Portfolio",
    description: "Privacy-first tracking, powerful analytics, and seamless DeFi integration.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flow - Master Your Sui Portfolio",
    description: "Privacy-first tracking, powerful analytics, and seamless DeFi integration.",
  },
};

import { Providers } from "@/components/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
