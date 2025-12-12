"use client";

import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { useMemo } from "react";
import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";
import { useQuery } from "@tanstack/react-query";
import { useSettings } from "@/contexts/SettingsContext";

// Define a type for our enriched token data
export interface TokenBalance {
  coinType: string;
  totalBalance: string;
  lockedBalance: object | null;
  metadata?: {
    decimals: number;
    name: string;
    symbol: string;
    description: string;
    iconUrl?: string | null;
  } | null;
}

export function useTokenBalances() {
  const account = useCurrentAccount();
  const client = useSuiClient();
  const { settings } = useSettings();

  // Combine connected account + watched wallets
  const allAddresses = useMemo(() => {
    const list = [...settings.watchedWallets];
    if (account?.address && !list.includes(account.address)) {
      list.unshift(account.address);
    }
    return list;
  }, [account?.address, settings.watchedWallets]);

  // Use useQuery to handle async fetching for multiple addresses
  const { data: balances, isLoading, error } = useQuery({
    queryKey: ["all-balances", allAddresses.join(",")],
    queryFn: async () => {
      if (allAddresses.length === 0) return [];

      // Fetch all in parallel
      const results = await Promise.all(
        allAddresses.map(owner => client.getAllBalances({ owner }))
      );

      // Flatten and Aggregate
      const aggMap = new Map<string, { coinType: string; totalBalance: bigint; lockedBalance: object | null }>();

      results.forEach(res => {
        res.forEach(balance => {
          if (!aggMap.has(balance.coinType)) {
            aggMap.set(balance.coinType, {
              coinType: balance.coinType,
              totalBalance: BigInt(0),
              lockedBalance: null // complex merging skipped for MVP
            });
          }
          const current = aggMap.get(balance.coinType)!;
          current.totalBalance += BigInt(balance.totalBalance);
        });
      });

      return Array.from(aggMap.values()).map(b => ({
        ...b,
        totalBalance: b.totalBalance.toString()
      }));
    },
    enabled: allAddresses.length > 0,
    refetchInterval: 10000,
  });

  return {
    balances: balances || [],
    isLoading,
    error,
  };
}
