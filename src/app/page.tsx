"use client";

import { useCurrentAccount } from "@mysten/dapp-kit";
import { WalletButton } from "@/components/WalletButton";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { ThemeDebugger } from "@/components/ThemeDebugger";

export default function Home() {
  const account = useCurrentAccount();

  return (
    <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gray-50 dark:bg-zinc-950">
      <ThemeDebugger />
      <main className="flex flex-col gap-8 items-center">
        <div className="flex items-center justify-between w-full max-w-4xl">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
            Sui Flow
          </h1>
          <WalletButton />
        </div>
        
        {account ? (
          <Dashboard />
        ) : (
          <div className="flex flex-col items-center justify-center gap-8 mt-12 text-center">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white max-w-2xl">
              The Privacy-First Portfolio Tracker <br/> for the <span className="text-blue-500">Sui Ecosystem</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-xl">
              Track assets, calculate taxes, and analyze performance without compromising your data.
            </p>
            
            <div className="p-1">
              <WalletButton />
            </div>

            <div className="flex gap-4 text-sm text-gray-500 mt-12">
              <span className="px-4 py-2 bg-gray-100 dark:bg-zinc-800 rounded-full border border-gray-200 dark:border-zinc-700">Identity by Suins</span>
              <span className="px-4 py-2 bg-gray-100 dark:bg-zinc-800 rounded-full border border-gray-200 dark:border-zinc-700">Privacy by Nautilus</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
