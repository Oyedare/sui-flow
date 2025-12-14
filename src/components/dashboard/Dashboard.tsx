"use client";

import { useTokenBalances } from "@/hooks/useTokenBalances";
import { useTokenPrices } from "@/hooks/useTokenPrices";
import { useMemo, useState, useEffect } from "react";
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
import { Eye, EyeOff } from "lucide-react";
import { useOnboarding } from "@/hooks/useOnboarding";

type Tab = 'assets' | 'defi' | 'nfts' | 'history' | 'tax' | 'analytics' | 'settings';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('assets');
  const { balances, isLoading: isBalancesLoading } = useTokenBalances();
  const { settings, updateSettings } = useSettings();
  const { data: exchangeRates } = useCurrencyRates();
  const { startTour, hasSeenOnboarding } = useOnboarding();

  useEffect(() => {
    if (!hasSeenOnboarding && !isBalancesLoading) {
        const timer = setTimeout(() => {
            startTour();
        }, 1500); // Wait for animations
        return () => clearTimeout(timer);
    }
  }, [hasSeenOnboarding, isBalancesLoading, startTour]);

  // Helper for alpha colors since we can't easily use Tailwind opacity modifiers on CSS vars without RGB format
  const getAlphaColor = (hex: string, alpha: number) => {
      // Simple hex to rgba
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: settings.accentColor }}></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500" id="dashboard-header">

      {/* Portfolio Summary Card */}
      <div 
        id="net-worth-card"
        className="p-8 rounded-3xl backdrop-blur-sm border"
        style={{
            background: `linear-gradient(135deg, ${getAlphaColor(settings.accentColor, 0.1)}, ${getAlphaColor(settings.accentColor, 0.05)})`,
            borderColor: getAlphaColor(settings.accentColor, 0.2)
        }}
      >
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider">
            Total Net Worth
          </h2>
          <button 
            onClick={() => updateSettings({ hideBalances: !settings.hideBalances })}
            className="text-gray-400 transition-colors hover:opacity-80"
            style={{ color: settings.hideBalances ? undefined : undefined }}
          >
            {settings.hideBalances ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <div 
            className="text-4xl font-bold bg-clip-text text-transparent"
            style={{ backgroundImage: `linear-gradient(to right, ${settings.accentColor}, #2dd4bf)` }}
        >
             {settings.hideBalances 
               ? "••••••••" 
               : formatCurrency(totalValue, settings.currency, { exchangeRates })}
        </div>
      </div>

      {/* Tabs */}
      <div id="dashboard-tabs" className="flex gap-2 p-1 bg-gray-100 dark:bg-zinc-900/50 rounded-full w-fit overflow-x-auto max-w-full">
        {(['assets', 'defi', 'nfts', 'history', 'tax', 'analytics', 'settings'] as Tab[]).map((tab) => (
            <button
              key={tab}
              id={tab === 'settings' ? 'settings-tab-btn' : undefined}
              onClick={() => setActiveTab(tab)}
              className={clsx(
                "px-4 py-2 rounded-full font-medium transition-all text-sm whitespace-nowrap flex items-center gap-2",
                activeTab === tab 
                  ? "bg-white dark:bg-zinc-800 shadow-sm" 
                  : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
              )}
              style={activeTab === tab ? { color: settings.accentColor } : {}}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'defi' && (
                  <span 
                    className="text-[10px] px-1.5 rounded-full"
                    style={{ 
                        backgroundColor: getAlphaColor(settings.accentColor, 0.1),
                        color: settings.accentColor 
                    }}
                  >
                      {defiPositions.length}
                  </span>
              )}
            </button>
        ))}
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
        {/* Pre-render History for instant load */}
        <div className={clsx("animate-in fade-in duration-300", activeTab === 'history' ? "block" : "hidden")}>
             <h3 className="text-xl font-semibold dark:text-white px-2 mb-4">Recent Activity</h3>
             <HistoryList />
        </div>

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
