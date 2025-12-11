"use client";

import { useTokenBalances } from "@/hooks/useTokenBalances";
import { useTokenPrices } from "@/hooks/useTokenPrices";
import { useMemo, useState } from "react";
import { AssetList } from "./AssetList";
import { HistoryList } from "./HistoryList";
import { TaxReport } from "./TaxReport";
import { Analytics } from "./Analytics";
import { DeFiList } from "./DeFiList";
import { identifyProtocol } from "@/lib/defiUtils";
import { getDecimals, formatBalance } from "@/lib/format";
import { NFTList } from "./NFTList";
import { Settings } from "./Settings";
import { useSettings } from "@/contexts/SettingsContext";
import { formatCurrency } from "@/lib/currency";
import { useCurrencyRates } from "@/hooks/useCurrencyRates";
import clsx from "clsx";

type Tab = 'assets' | 'defi' | 'nfts' | 'history' | 'tax' | 'analytics' | 'settings';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('assets');
  const { balances, isLoading: isBalancesLoading } = useTokenBalances();
  const { settings } = useSettings();
  const { data: exchangeRates } = useCurrencyRates();

  // Split Standard Assets vs DeFi Positions
  const { assets, defiPositions } = useMemo(() => {
    const assets = [];
    const defiPositions = [];
    
    for (const b of balances) {
       if (identifyProtocol(b.coinType)) {
         defiPositions.push(b);
       } else {
         assets.push(b);
       }
    }
    return { assets, defiPositions };
  }, [balances]);

  // Extract coin types for pricing (only for Standard Assets)
  const coinTypes = useMemo(() => {
    return assets.map((b) => b.coinType);
  }, [assets]);

  const { data: prices, isLoading: isPricesLoading } = useTokenPrices(coinTypes);

  // Calculate Total Value (Assets Only)
  const totalValue = useMemo(() => {
    if (!assets || !prices) return 0;
    
    return assets.reduce((sum, balance) => {
      const price = prices[balance.coinType] || 0;
      const decimals = getDecimals(balance.coinType);
      const amount = formatBalance(balance.totalBalance, decimals);
      return sum + (amount * price);
    }, 0);
  }, [assets, prices]);

  if (isBalancesLoading) {
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Portfolio Summary Card */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-600/10 to-teal-400/10 border border-blue-500/20 backdrop-blur-sm">
        <h2 className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">
          Total Net Worth
        </h2>
        <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
             {formatCurrency(totalValue, settings.currency, { exchangeRates })}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-gray-100 dark:bg-zinc-900/50 rounded-full w-fit">
        <button
          onClick={() => setActiveTab('assets')}
          className={clsx(
            "px-4 py-2 rounded-full font-medium transition-all text-sm",
            activeTab === 'assets' 
              ? "bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm" 
              : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
          )}
        >
          Assets
        </button>
        <button
          onClick={() => setActiveTab('defi')}
          className={clsx(
            "px-4 py-2 rounded-full font-medium transition-all text-sm flex items-center gap-2",
            activeTab === 'defi' 
              ? "bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm" 
              : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
          )}
        >
          DeFi <span className="text-[10px] bg-blue-100 dark:bg-blue-900/30 px-1.5 rounded-full">{defiPositions.length}</span>
        </button>
        <button
          onClick={() => setActiveTab('nfts')}
          className={clsx(
            "px-4 py-2 rounded-full font-medium transition-all text-sm",
            activeTab === 'nfts' 
              ? "bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm" 
              : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
          )}
        >
          NFTs
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={clsx(
            "px-4 py-2 rounded-full font-medium transition-all text-sm",
            activeTab === 'history' 
              ? "bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm" 
              : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
          )}
        >
          History
        </button>
        <button
          onClick={() => setActiveTab('tax')}
          className={clsx(
            "px-4 py-2 rounded-full font-medium transition-all text-sm",
            activeTab === 'tax' 
              ? "bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm" 
              : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
          )}
        >
          Tax Report
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={clsx(
            "px-4 py-2 rounded-full font-medium transition-all text-sm",
            activeTab === 'analytics' 
              ? "bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm" 
              : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
          )}
        >
          Analytics
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={clsx(
            "px-4 py-2 rounded-full font-medium transition-all text-sm",
            activeTab === 'settings' 
              ? "bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm" 
              : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
          )}
        >
          Settings
        </button>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === 'assets' && (
           <div className="animate-in fade-in duration-300">
             <h3 className="text-xl font-semibold dark:text-white px-2 mb-4">Your Assets</h3>
             {/* Pass only Standard Assets */}
             <AssetList balances={assets} prices={prices || {}} />
           </div>
        )}
        {activeTab === 'defi' && (
           <div className="animate-in fade-in duration-300">
             <h3 className="text-xl font-semibold dark:text-white px-2 mb-4">DeFi Positions</h3>
             <DeFiList positions={defiPositions} />
           </div>
        )}
        {activeTab === 'nfts' && (
           <div className="animate-in fade-in duration-300">
             <h3 className="text-xl font-semibold dark:text-white px-2 mb-4">Your NFTs</h3>
             <NFTList />
           </div>
        )}
        {activeTab === 'history' && (
           <div className="animate-in fade-in duration-300">
             <h3 className="text-xl font-semibold dark:text-white px-2 mb-4">Recent Activity</h3>
             <HistoryList />
           </div>
        )}
        {activeTab === 'tax' && (
           <div className="animate-in fade-in duration-300">
             <h3 className="text-xl font-semibold dark:text-white px-2 mb-4">Tax & Reporting</h3>
             <TaxReport />
           </div>
        )}

        {activeTab === 'analytics' && (
           <div className="animate-in fade-in duration-300">
             <Analytics totalValue={totalValue} assets={assets} prices={prices || {}} />
           </div>
        )}

        {activeTab === 'settings' && (
           <div className="animate-in fade-in duration-300">
             <Settings />
           </div>
        )}
      </div>
    </div>
  );
}
