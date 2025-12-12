"use client";

import { useMemo, useState, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { PieChart, Pie, Cell, Legend } from "recharts";
import { TrendingUp, TrendingDown, PieChartIcon, Activity, AlertCircle, Download, ArrowRightLeft } from "lucide-react";
import { usePortfolioHistory, getHistoryForPeriod, calculatePerformance } from "@/hooks/usePortfolioHistory";
import { formatCurrency } from "@/lib/currency";
import { useSettings } from "@/contexts/SettingsContext";
import { useCurrencyRates } from "@/hooks/useCurrencyRates";
import { domToPng } from "modern-screenshot";
import clsx from "clsx";
import { InfoTooltip } from "../ui/InfoTooltip";
import { useCashFlowHistory } from "@/hooks/useCashFlowHistory";
import { calculateCashFlow } from "@/lib/cashFlowProcessor";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { BarChart, Bar } from "recharts";

interface AnalyticsProps {
  totalValue: number;
  assets: any[];
  prices: Record<string, number>;
}

type TimePeriod = "7d" | "30d" | "90d" | "1y";

const COLORS = ["#3b82f6", "#14b8a6", "#8b5cf6", "#f59e0b", "#ef4444", "#10b981"];

// Download card as image using modern-screenshot
const downloadCardAsImage = async (elementRef: HTMLDivElement | null, filename: string) => {
  if (!elementRef) return;
  
  try {
    const dataUrl = await domToPng(elementRef, {
      scale: 2, // Higher quality
      backgroundColor: '#ffffff',
    });
    
    const link = document.createElement("a");
    link.download = `${filename}.png`;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error("Failed to download image:", error);
    alert("Failed to download image. Please try again or use your browser's screenshot feature.");
  }
};

export function Analytics({ totalValue, assets, prices }: AnalyticsProps) {
  const { settings } = useSettings();
  const { data: exchangeRates } = useCurrencyRates();
  const history = usePortfolioHistory(totalValue);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("30d");
  
  // Refs for downloading cards
  const performanceChartRef = useRef<HTMLDivElement>(null);
  const allocationChartRef = useRef<HTMLDivElement>(null);
  const portfolioChangeRef = useRef<HTMLDivElement>(null);
  const topAssetRef = useRef<HTMLDivElement>(null);
  const riskLevelRef = useRef<HTMLDivElement>(null);

  // Get history for selected period
  const periodHistory = useMemo(() => {
    const days = timePeriod === "7d" ? 7 : timePeriod === "30d" ? 30 : timePeriod === "90d" ? 90 : 365;
    return getHistoryForPeriod(history, days);
  }, [history, timePeriod]);

  // Calculate performance
  const performance = useMemo(() => {
    return calculatePerformance(periodHistory);
  }, [periodHistory]);

  const chartData = useMemo(() => {
    return periodHistory.map((snapshot) => ({
      date: new Date(snapshot.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: snapshot.totalValue,
    }));
  }, [periodHistory]);

  // Cash Flow Data
  const account = useCurrentAccount();
  const { data: rawTransactions } = useCashFlowHistory();
  const cashFlowData = useMemo(() => {
    if (!rawTransactions || !prices) return [];
    // Filter by period? For now just show all fetched (which is recent 50+50)
    // To match periods accurately we'd need more history, but let's just show what we have.
    const allProcessed = calculateCashFlow(rawTransactions, prices, account?.address);
    // Slice to last 14 days or so to keep custom chart clean if needed
    return allProcessed.slice(-14); 
  }, [rawTransactions, prices, account]);
  const cashFlowRef = useRef<HTMLDivElement>(null);

  // Calculate asset allocation
  const allocationData = useMemo(() => {
    if (!assets || assets.length === 0) {
      return [];
    }

    const getDecimals = (coinType: string) => {
      if (coinType.includes("::sui::SUI")) return 9;
      if (coinType.includes("::usdc::USDC") || coinType.includes("::wusdc::WUSDC")) return 6;
      return 9;
    };

    const formatBalance = (amount: string, decimals: number) => {
      return parseInt(amount) / Math.pow(10, decimals);
    };

    const getSymbol = (coinType: string) => {
      if (coinType.includes("::sui::SUI")) return "SUI";
      if (coinType.includes("::wusdc::WUSDC")) return "USDC";
      return coinType.split("::").pop() || "UNK";
    };

    const assetValues = assets
      .filter((asset) => asset.totalBalance !== "0") // Only include assets with balance
      .map((asset) => {
        const decimals = getDecimals(asset.coinType);
        const amount = formatBalance(asset.totalBalance, decimals);
        const price = prices[asset.coinType] || 0;
        const value = amount * price;
        
        return {
          name: getSymbol(asset.coinType),
          value,
        };
      })
      .filter((asset) => asset.value > 0); // Filter out zero-value assets

    // Sort by value and take top 5, group rest as "Others"
    const sorted = assetValues.sort((a, b) => b.value - a.value);
    const top5 = sorted.slice(0, 5);
    const others = sorted.slice(5);
    
    if (others.length > 0) {
      const othersValue = others.reduce((sum, a) => sum + a.value, 0);
      top5.push({ name: "Others", value: othersValue });
    }

    return top5;
  }, [assets, prices]);

  // Calculate risk metrics
  const riskMetrics = useMemo(() => {
    if (allocationData.length === 0) {
      return {
        concentration: 0,
        diversification: 0,
        volatility: "Low",
      };
    }

    const topAssetPercent = (allocationData[0].value / totalValue) * 100;
    const diversificationScore = Math.min(100, allocationData.length * 20);
    
    // Simple volatility based on price changes
    let volatility = "Low";
    if (performance.changePercent > 20 || performance.changePercent < -20) {
      volatility = "High";
    } else if (performance.changePercent > 10 || performance.changePercent < -10) {
      volatility = "Medium";
    }

    return {
      concentration: topAssetPercent,
      diversification: diversificationScore,
      volatility,
    };
  }, [allocationData, totalValue, performance]);

  const hasData = history.length > 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div ref={portfolioChangeRef} className="p-6 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl relative">
          <button
            onClick={() => downloadCardAsImage(portfolioChangeRef.current, "portfolio-change")}
            className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            title="Download as image"
          >
            <Download size={16} className="text-gray-600 dark:text-gray-400" />
          </button>
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-2">
            <Activity size={16} />
            <span>Portfolio Change</span>
            <InfoTooltip content="This is the change in value of your portfolio over the selected time period." />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(Math.abs(performance.change), settings.currency, { exchangeRates })}
          </div>
          <div className={clsx(
            "flex items-center gap-1 text-sm mt-1",
            performance.changePercent >= 0 ? "text-green-600" : "text-red-600"
          )}>
            {performance.changePercent >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span>{performance.changePercent.toFixed(2)}%</span>
          </div>
        </div>

        <div ref={topAssetRef} className="p-6 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl relative">
          <button
            onClick={() => downloadCardAsImage(topAssetRef.current, "top-asset")}
            className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            title="Download as image"
          >
            <Download size={16} className="text-gray-600 dark:text-gray-400" />
          </button>
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-2">
            <PieChartIcon size={16} />
            <span>Top Asset</span>
            <InfoTooltip content="This is the asset that makes up the largest percentage of your portfolio." />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {allocationData[0]?.name || "N/A"}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {riskMetrics.concentration.toFixed(1)}% of portfolio
          </div>
        </div>

        <div ref={riskLevelRef} className="p-6 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl relative">
          <button
            onClick={() => downloadCardAsImage(riskLevelRef.current, "risk-level")}
            className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            title="Download as image"
          >
            <Download size={16} className="text-gray-600 dark:text-gray-400" />
          </button>
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-2">
            <AlertCircle size={16} />
            <span>Risk Level</span>
            <InfoTooltip content="This is the risk level of your portfolio based on the volatility of your assets." />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {riskMetrics.volatility}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Diversification: {riskMetrics.diversification}/100
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div ref={performanceChartRef} className="p-6 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Portfolio Performance</h3>
            <InfoTooltip content="This is the change in value of your portfolio over the selected time period." />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadCardAsImage(performanceChartRef.current, `portfolio-performance-${timePeriod}`)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              title="Download as image"
            >
              <Download size={18} className="text-gray-600 dark:text-gray-400" />
            </button>
            <div className="flex gap-2">
              {(["7d", "30d", "90d", "1y"] as TimePeriod[]).map((period) => (
                <button
                  key={period}
                  onClick={() => setTimePeriod(period)}
                  className={clsx(
                    "px-3 py-1 rounded-lg text-sm font-medium transition-all",
                    timePeriod === period
                      ? "text-white shadow-md"
                      : "bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-700"
                  )}
                  style={timePeriod === period ? { backgroundColor: settings.accentColor } : {}}
                >
                  {period.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {hasData && chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis 
                dataKey="date" 
                stroke="#9ca3af"
                style={{ fontSize: "12px" }}
              />
              <YAxis 
                stroke="#9ca3af"
                style={{ fontSize: "12px" }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  color: "#111827",
                  padding: "8px 12px",
                }}
                formatter={(value: number) => [formatCurrency(value, settings.currency, { exchangeRates }), "Value"]}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={settings.accentColor} 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <Activity size={48} className="mx-auto mb-4 opacity-50" />
              <p>No historical data yet</p>
              <p className="text-sm mt-2">Portfolio data will be tracked daily</p>
            </div>
          </div>
        )}
      </div>

      {/* Cash Flow Chart */}
      <div ref={cashFlowRef} className="p-6 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cash Flow (Last 14 Days)</h3>
            <InfoTooltip content="Money In (Green) vs Money Out (Red) based on transaction history and current prices." />
          </div>
          <button
            onClick={() => downloadCardAsImage(cashFlowRef.current, "cash-flow")}
            className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            title="Download as image"
          >
            <Download size={18} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {cashFlowData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cashFlowData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis 
                dataKey="date" 
                stroke="#9ca3af"
                style={{ fontSize: "12px" }}
              />
              <YAxis 
                stroke="#9ca3af"
                style={{ fontSize: "12px" }}
                tickFormatter={(value) => `$${(value).toLocaleString()}`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  color: "#111827",
                  padding: "8px 12px",
                }}
                formatter={(value: number, name: string) => [
                  formatCurrency(value, settings.currency, { exchangeRates }),
                  name === "in" ? "In (+)" : "Out (-)"
                ]}
              />
              <Legend />
              <Bar dataKey="in" name="in" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="out" name="out" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400">
             <div className="text-center">
              <ArrowRightLeft size={48} className="mx-auto mb-4 opacity-50" />
              <p>No recent cash flow data</p>
            </div>
          </div>
        )}
      </div>

      {/* Asset Allocation */}
      <div ref={allocationChartRef} className="p-6 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Asset Allocation</h3>
          <InfoTooltip content="This is the allocation of your portfolio across different asset classes." />
          </div>
          <button
            onClick={() => downloadCardAsImage(allocationChartRef.current, "asset-allocation")}
            className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            title="Download as image"
          >
            <Download size={18} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>
        
        {allocationData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    color: "#111827",
                    padding: "8px 12px",
                  }}
                  formatter={(value: number) => [formatCurrency(value, settings.currency, { exchangeRates }), "Value"]}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="space-y-3">
              {allocationData.map((asset, index) => {
                const percent = (asset.value / totalValue) * 100;
                return (
                  <div key={asset.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="font-medium text-gray-900 dark:text-white">{asset.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {formatCurrency(asset.value, settings.currency, { exchangeRates })}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {percent.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="h-[250px] flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <PieChartIcon size={48} className="mx-auto mb-4 opacity-50" />
              <p>No assets to display</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
