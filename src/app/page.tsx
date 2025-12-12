"use client";

import { useCurrentAccount } from "@mysten/dapp-kit";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { CustomWalletButton } from "@/components/CustomWalletButton";
import { LandingPage } from "@/components/landing/LandingPage";

export default function Home() {
  const account = useCurrentAccount();

  if (account) {
    return (
      <div className="min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gray-50 dark:bg-zinc-950">
        <main className="flex flex-col gap-8 max-w-4xl mx-auto">
           {/* Header for Dashboard */}
           <div className="flex items-center justify-between w-full">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                Flow
              </h1>
              <CustomWalletButton />
           </div>

           <Dashboard />
        </main>
      </div>
    );
  }

  return <LandingPage />;
}
