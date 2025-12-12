"use client";

import { TokenBalance } from "@/hooks/useTokenBalances";
import { useSettings } from "@/contexts/SettingsContext";
import { formatCurrency } from "@/lib/currency";

interface AssetListProps {
  balances: any[]; // using 'any' temporarily while type matches strict hook return
  prices: Record<string, number>;
}

// Helper to normalize balance
// In a real app, pass metadata.decimals. 
// For MVP, SUI is 9, USDC is 6.
function formatBalance(amount: string, decimals: number = 9) {
  const val = parseInt(amount) / Math.pow(10, decimals);
  return val;
}

function getDecimals(coinType: string) {
  if (coinType.includes("::sui::SUI")) return 9;
  if (coinType.includes("::wusdc::WUSDC") || coinType.includes("::usdc::USDC")) return 6;
  return 9; // default
}

function getSymbol(coinType: string) {
  if (coinType.includes("::sui::SUI")) return "SUI";
  if (coinType.includes("::wusdc::WUSDC")) return "USDC";
  return coinType.split("::").pop() || "UNK";
}

export function AssetList({ balances, prices }: AssetListProps) {
  const { settings } = useSettings();
  
  // Sort by value (descending)
  const items = balances
    .filter((b) => b.totalBalance !== "0")
    .map((b) => {
      const decimals = getDecimals(b.coinType);
      const amount = formatBalance(b.totalBalance, decimals);
      const price = prices[b.coinType] || 0;
      const value = amount * price;

      return {
        ...b,
        formattedAmount: amount,
        symbol: getSymbol(b.coinType),
        price,
        value,
      };
    })
    .sort((a, b) => b.value - a.value);

  // Calculate total for display? (Can pass back up or display here)
  
  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 bg-gray-50 dark:bg-zinc-900 rounded-2xl">
        No assets found.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-zinc-950/50">
          <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            <th className="px-6 py-4">Asset</th>
            <th className="px-6 py-4 text-right">Price</th>
            <th className="px-6 py-4 text-right">Balance</th>
            <th className="px-6 py-4 text-right">Value</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
          {items.map((item) => (
            <tr key={item.coinType} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  {/* Icon Placeholder */}
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-bold text-xs">
                    {item.symbol[0]}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">{item.symbol}</div>
                    <div className="text-xs text-gray-400 hidden sm:block truncate max-w-[100px]">
                      {item.coinType.split("::")[0].slice(0, 6)}...
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-right tabular-nums">
                <div className="text-gray-900 dark:text-gray-100">
                  {formatCurrency(item.price, settings.currency, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                </div>
              </td>
              <td className="px-6 py-4 text-right tabular-nums">
                <div className="text-gray-900 dark:text-gray-100">
                  {settings.hideBalances 
                    ? "••••" 
                    : item.formattedAmount.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                </div>
              </td>
              <td className="px-6 py-4 text-right tabular-nums font-medium">
                <div className="text-gray-900 dark:text-gray-100">
                  {settings.hideBalances
                    ? "••••"
                    : formatCurrency(item.value, settings.currency)}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
