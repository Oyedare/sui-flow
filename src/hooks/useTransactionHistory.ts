"use client";

import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";

export function useTransactionHistory() {
  const account = useCurrentAccount();

  return useSuiClientQuery(
    "queryTransactionBlocks",
    {
      filter: {
        FromAddress: account?.address || "",
      },
      options: {
        showBalanceChanges: true,
        showEffects: true,
        showInput: true,
      },
      order: "descending",
      limit: 50,
    },
    {
      enabled: !!account,
      refetchInterval: 30000,
    }
  );
}
