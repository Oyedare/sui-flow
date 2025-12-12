import { SuiTransactionBlockResponse } from "@mysten/sui.js/client";
import { getDecimals, formatBalance } from "./format";

interface CashFlowData {
  date: string;
  in: number;
  out: number;
}

export function calculateCashFlow(
  transactions: SuiTransactionBlockResponse[],
  prices: Record<string, number>,
  address?: string
): CashFlowData[] {
  const dailyMap = new Map<string, { in: number; out: number }>();

  transactions.forEach((tx) => {
    if (!tx.balanceChanges || !tx.timestampMs) return;

    const date = new Date(Number(tx.timestampMs)).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    if (!dailyMap.has(date)) {
      dailyMap.set(date, { in: 0, out: 0 });
    }

    const entry = dailyMap.get(date)!;

    tx.balanceChanges.forEach((change) => {
      // Only care about changes for the current user
      if (address && change.owner && 
          typeof change.owner === 'object' && 
          'AddressOwner' in change.owner && 
          change.owner.AddressOwner !== address) {
          return;
      }

      const amount = BigInt(change.amount);
      const decimals = getDecimals(change.coinType);
      const val = formatBalance(Number(amount), decimals);
      const price = prices[change.coinType] || 0;
      const usdValue = val * price;

      if (usdValue > 0) {
        entry.in += usdValue;
      } else {
        entry.out += Math.abs(usdValue);
      }
    });

    // Also consider gas? 
    // Usually gas is included in balanceChanges for SUI as a negative amount on the sender.
    // So it's already covered.
  });

  // Convert to array and reverse (oldest to newest) for chart
  return Array.from(dailyMap.entries())
    .map(([date, data]) => ({
      date,
      in: data.in,
      out: data.out,
    }))
    .reverse();
}
