"use client";

import { useCurrentAccount } from "@mysten/dapp-kit";
import { useQuery } from "@tanstack/react-query";
import { fetchTransactionHistoryGraphQL } from "@/lib/sui-graphql";
import { useSettings } from "@/contexts/SettingsContext";

export function useTransactionHistory() {
  const account = useCurrentAccount();
  const { settings } = useSettings();

  return useQuery({
    queryKey: ["transactions", account?.address, settings.network],
    queryFn: async () => {
        if (!account?.address) return { data: [], nextCursor: null, hasNextPage: false };
        return fetchTransactionHistoryGraphQL(account.address, settings.network, null, 50);
    },
    enabled: !!account?.address,
    refetchInterval: 30000,
  });
}
