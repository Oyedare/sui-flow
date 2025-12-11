"use client";

import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { useMemo } from "react";
import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";

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
  
  // 1. Fetch all balances for the connected account
  const { data: balances, isLoading: isBalancesLoading, error: balancesError } = useSuiClientQuery(
    "getAllBalances",
    { owner: account?.address || "" },
    {
      enabled: !!account,
      refetchInterval: 10000, // Refresh every 10s
    }
  );

  // 2. We need to fetch metadata for each unique coin type found
  // Note: simpler to use the useSuiClient implementation inside a useEffect or 
  // multiple useSuiClientQuery calls, but for dynamic lists, react-query's `useQueries` 
  // or a manual fetch in useEffect with results stored in state/cache is often cleaner.
  // For MVP, we'll try a simpler approach: 
  // We can't easily hook `useSuiClientQuery` in a loop.
  // We will assume basic metadata fetching.

  // Let's use a separate logic for metadata. 
  // Ideally, dApp Kit would have a 'useCoinMetadata' that accepts a list, but it's 1-by-1.
  // We'll create a lightweight custom fetcher for metadata inside the components or here.
  
  // Since we cannot run hooks conditionally or in loops easily without `useQueries`,
  // let's just return the raw balances and let the UI component or a sub-provider handle metadata
  // OR we can implement a `useQueries` pattern if we install it, but `dapp-kit` wraps `tanstack-query`.

  return {
    balances: balances || [],
    isLoading: isBalancesLoading,
    error: balancesError,
  };
}
