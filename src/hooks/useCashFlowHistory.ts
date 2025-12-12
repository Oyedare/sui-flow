"use client";

import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { useQuery } from "@tanstack/react-query";
import { SuiTransactionBlockResponse } from "@mysten/sui.js/client";

export function useCashFlowHistory() {
  const account = useCurrentAccount();
  const client = useSuiClient();

  return useQuery({
    queryKey: ["cash-flow-history", account?.address],
    queryFn: async () => {
      if (!account?.address) return [];

      const [sent, received] = await Promise.all([
        client.queryTransactionBlocks({
          filter: { FromAddress: account.address },
          options: {
            showBalanceChanges: true,
            showEffects: true,
          },
          limit: 50,
          order: "descending",
        }),
        client.queryTransactionBlocks({
          filter: { ToAddress: account.address },
          options: {
            showBalanceChanges: true,
            showEffects: true,
          },
          limit: 50,
          order: "descending",
        })
      ]);

      // Merge and deduplicate by digest
      // Merge and deduplicate by digest
      const map = new Map<string, any>();
      
      sent.data.forEach(tx => map.set(tx.digest, tx));
      received.data.forEach(tx => map.set(tx.digest, tx));

      // Sort by timestamp descending
      return Array.from(map.values()).sort((a, b) => {
         const tA = Number(a.timestampMs || 0);
         const tB = Number(b.timestampMs || 0);
         return tB - tA;
      });
    },
    enabled: !!account,
    refetchInterval: 60000,
  });
}
