"use client";

import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui.js/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ToastContainer } from "@/components/ui/ToastContainer";
import { SettingsProvider } from "@/contexts/SettingsContext";
import "@mysten/dapp-kit/dist/index.css";

const queryClient = new QueryClient();

// Read network from localStorage (default to mainnet)
const getStoredNetwork = (): "mainnet" | "testnet" => {
  if (typeof window === "undefined") return "mainnet";
  try {
    const stored = localStorage.getItem("sui-flow-settings");
    if (stored) {
      const settings = JSON.parse(stored);
      return settings.network || "mainnet";
    }
  } catch {
    // Ignore errors
  }
  return "mainnet";
};

const network = getStoredNetwork();
const networks = {
  mainnet: { url: getFullnodeUrl("mainnet") },
  testnet: { url: getFullnodeUrl("testnet") },
};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networks} defaultNetwork={network}>
        <WalletProvider autoConnect>
          <SettingsProvider>
            <NotificationProvider>
              {children}
              <ToastContainer />
            </NotificationProvider>
          </SettingsProvider>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
