"use client";

import { useTokenBalances } from "@/hooks/useTokenBalances";
import { useTokenPrices } from "@/hooks/useTokenPrices";
import { useTransactionHistory } from "@/hooks/useTransactionHistory";
import { TaxEngine, TaxReport as TaxReportType } from "@/lib/taxEngine";
import { fetchAllTransactionHistoryGraphQL } from "@/lib/sui-graphql";
import { Download, FileText, CloudDownload, RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";
import { WalrusBackup } from "./WalrusBackup";
import { useSettings } from "@/contexts/SettingsContext";
import { useQueryClient } from "@tanstack/react-query";
import { useCurrentAccount } from "@mysten/dapp-kit";

export function TaxReport() {
  const { data: history, isLoading: isHistoryLoading } = useTransactionHistory();
  const account = useCurrentAccount();
  const { balances } = useTokenBalances(); 
  const { settings } = useSettings();
  const queryClient = useQueryClient();
  
  const coinTypes = useMemo(() => balances.map(b => b.coinType), [balances]);
  const { data: prices } = useTokenPrices(coinTypes);

  const [report, setReport] = useState<TaxReportType | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState({ processed: 0, total: 0 });
  const [statusMessage, setStatusMessage] = useState("");
  
  // Restore State
  const [restoreInput, setRestoreInput] = useState("");
  const [isRestoring, setIsRestoring] = useState(false);

  const handleRestore = async () => {
    if (!restoreInput) return;
    setIsRestoring(true);
    
    try {
      // Fetch and decrypt from Walrus
      const { readBlob } = await import('@/lib/walrus');
      const reportData = await readBlob(restoreInput, true);
      const restoredReport = JSON.parse(reportData);
      
      setReport(restoredReport);
      setIsRestoring(false);
      setRestoreInput("");
    } catch (error) {
      console.error('Walrus restore failed:', error);
      alert('Failed to restore from Walrus. Please check the Blob ID and try again.');
      setIsRestoring(false);
    }
  };
  
  // Liability State
  const [exchangeRate, setExchangeRate] = useState(1650); 
  const liability = useMemo(() => {
    if (!report) return null;
    const netGain = report.totalRealizedGain - report.totalRealizedLoss;
    return TaxEngine.calculateNigeriaLiability(netGain, exchangeRate);
  }, [report, exchangeRate]);

  /* Removed Nautilus State */

  const handleGenerate = async () => {
    if (!account?.address) return;
    
    setIsGenerating(true);
    setProgress({ processed: 0, total: 0 });


    try {
      // 1. Connect
      /* Removed Nautilus Verification Steps */
      
      // Dynamic import to avoid SSR issues
      const { getHistoricalPrice: fetchHistoricalPrice } = await import("@/lib/pythBenchmarks");
      let reportData: TaxReportType;
      
      const priceFetcher = async (coinType: string, timestamp: number) => {
         const prices = await queryClient.fetchQuery({
            queryKey: ["historical-price", coinType, timestamp],
            queryFn: () => fetchHistoricalPrice(coinType, timestamp)
         });
         return prices || 0;
      };

      const progressCallback = (processed: number, total: number) => {
         setProgress({ processed, total });
      };
      
        // 0. Fetch Full History
        setStatusMessage("Fetching Full Transaction History...");
        const fullHistory = await fetchAllTransactionHistoryGraphQL(
           account.address, 
           settings.network,
           (count) => setStatusMessage(`Fetched ${count} transactions...`)
        );

        setStatusMessage("Calculated Gains & Losses. Finalizing...");

        // Actual Calculation
        switch (settings.taxMethod) {
          case "LIFO":
            reportData = await TaxEngine.calculateLIFO(fullHistory, priceFetcher, progressCallback);
            break;
          case "Average":
            reportData = await TaxEngine.calculateAverage(fullHistory, priceFetcher, progressCallback);
            break;
          case "FIFO":
          default:
            reportData = await TaxEngine.calculateFIFO(fullHistory, priceFetcher, progressCallback);
            break;
        }
      
      setReport(reportData);
    } catch (error: any) {
      console.error("Tax generation failed:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsGenerating(false);
      setStatusMessage("");
    }
  };

  const handleDownload = () => {
    if (!report) return;
    
    const csvContent = [
      "Date,Type,Asset,Amount,Price,TotalValue,CostBasis,GainLoss",
      ...report.events.map(e => 
        `${e.date},${e.type},${e.asset},${e.amount},${e.price},${e.totalValue},${e.costBasis || 0},${e.gainLoss || 0}`
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "sui_flow_tax_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getAlphaColor = (hex: string, alpha: number) => {
    // ...
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Removed Nautilus UI Badge */}

      {!report ? (
        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-3xl bg-gray-50 dark:bg-zinc-900/50">
           <FileText className="text-gray-400 mb-4" size={48} />
           <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Generate Verified Tax Report</h3>
           <p className="text-gray-500 text-center max-w-sm mb-6">
             Securely calculate capital gains using verifiable off-chain computation.
           </p>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-6 py-3 text-white rounded-full font-medium transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 hover:opacity-90 min-w-[240px] justify-center"
              style={{ 
                  backgroundColor: settings.accentColor,
                  boxShadow: `0 10px 15px -3px ${getAlphaColor(settings.accentColor, 0.25)}`
              }}
            >
              {isGenerating ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span className="flex flex-col items-start text-xs text-left">
                        <span className="font-semibold">{statusMessage || "Processing..."}</span>
                        {progress.total > 0 && <span className="opacity-80">Scanning tx {progress.processed}/{progress.total}</span>}
                    </span>
                  </>
              ) : (
                  <>
                    <RefreshCw size={18} />
                    Generate Tax Report
                  </>
              )}
            </button>

            {/* Restore Section */}
            <div className="w-full max-w-xs flex flex-col items-center mt-8 pt-6 border-t border-dashed border-gray-200 dark:border-zinc-800">
               <span className="text-xs text-gray-400 mb-3 uppercase tracking-wider font-semibold">Or Restore Backup</span>
               <div className="flex w-full gap-2">
                 <input 
                   type="text" 
                   value={restoreInput}
                   onChange={(e) => setRestoreInput(e.target.value)}
                   placeholder="Paste Blob ID..."
                   className="flex-1 px-3 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2"
                   style={{ '--tw-ring-color': getAlphaColor(settings.accentColor, 0.5) } as any}
                 />
                 <button
                   onClick={handleRestore}
                   disabled={isRestoring || !restoreInput}
                   className="px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-600 dark:text-gray-300 rounded-lg transition-colors disabled:opacity-50"
                 >
                   {isRestoring ? (
                     <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                   ) : (
                     <CloudDownload size={18} />
                   )}
                 </button>
               </div>
            </div>
         </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Cards */}
          {/* ... (keep existing summary cards) ... */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 rounded-2xl">
              <div className="text-sm text-green-700 dark:text-green-300 uppercase font-medium">Realized Gains</div>
              <div className="text-3xl font-bold text-green-700 dark:text-green-400">
                +${report.totalRealizedGain.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-2xl">
              <div className="text-sm text-red-700 dark:text-red-300 uppercase font-medium">Realized Losses</div>
              <div className="text-3xl font-bold text-red-700 dark:text-red-400">
                -${report.totalRealizedLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          {/* Liability Estimator (Nigeria) */}
          <div className="p-6 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl space-y-4">
             <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                   🇳🇬 Nigeria Tax Liability Estimator <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-bold border border-green-200 dark:border-green-800">Tax Act 2025 (Effective 2026)</span>
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">1 USD = ₦</span>
                  <input 
                    type="number" 
                    value={exchangeRate} 
                    onChange={(e) => setExchangeRate(Number(e.target.value))}
                    className="w-24 px-2 py-1 border border-gray-200 dark:border-zinc-700 rounded-md bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2"
                    style={{ '--tw-ring-color': getAlphaColor(settings.accentColor, 0.5) } as any}
                  />
                </div>
             </div>
             
             {/* ... (rest of estimator) ... */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-xl">
                   <div className="text-xs text-gray-500 mb-1">Effective Rate</div>
                   <div className="text-2xl font-bold text-gray-900 dark:text-white">
                     {liability?.effectiveRate.toFixed(1)}%
                   </div>
                   <div className="text-[10px] text-gray-400 mt-1">Based on new PIT bands</div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-xl">
                   <div className="text-xs text-gray-500 mb-1">Estimated Tax (NGN)</div>
                   <div className="text-2xl font-bold text-gray-900 dark:text-white">
                     ₦{liability?.taxNGN.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                   </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-xl">
                   <div className="text-xs text-gray-500 mb-1">Estimated Tax (USD)</div>
                   <div className="text-2xl font-bold text-gray-900 dark:text-white">
                     ${liability?.taxUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                   </div>
                </div>
             </div>
             <p className="text-xs text-gray-400 flex flex-col gap-1">
               <span>*Bands: 0% (First ₦800k), then 15%, 18%, 21%, 23%, 25%.</span>
               <span className="text-green-600 dark:text-green-500 font-medium">✓ Digital Asset Loss Relief Applied (Ring-fenced). Gains are taxed as income.</span>
             </p>
          </div>

          {/* Action Footer */}
          <div className="flex justify-end gap-3 items-center flex-wrap">
             <button 
               onClick={() => setReport(null)}
               className="px-4 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
             >
               Reset
             </button>
             
             <WalrusBackup report={report} />

             <button
               onClick={handleDownload}
               className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-black rounded-lg font-medium flex items-center gap-2 hover:opacity-90 transition-opacity"
             >
               <Download size={16} /> Download CSV
             </button>
          </div>
        </div>
      )}
    </div>
  );
}
