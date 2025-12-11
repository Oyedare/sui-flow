"use client";

import { X, ExternalLink, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { SuiTransactionBlockResponse } from "@mysten/sui.js/client";
import { formatBalance, getDecimals, getSymbol } from "@/lib/format";

interface TransactionDetailModalProps {
  tx: SuiTransactionBlockResponse;
  onClose: () => void;
}

export function TransactionDetailModal({ tx, onClose }: TransactionDetailModalProps) {
  const isSuccess = tx.effects?.status.status === "success";
  const timestamp = tx.timestampMs ? new Date(Number(tx.timestampMs)).toLocaleString() : "Unknown Date";

  // Parse Balance Changes
  const changes = tx.balanceChanges || [];
  
  // We only care about changes for the current user (owner), but typically the RPC returns 
  // changes relevant to the query. For now, we list all changes present in the response object
  // which are usually grouped by owner.
  
  const assetsIn = changes.filter(c => parseInt(c.amount) > 0);
  const assetsOut = changes.filter(c => parseInt(c.amount) < 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-zinc-800">
          <div>
             <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Transaction Details</h3>
             <span className={`text-xs px-2 py-0.5 rounded-full ${isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
               {isSuccess ? 'Success' : 'Failed'}
             </span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          
          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4">
             <div className="p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-xl">
               <div className="text-xs text-gray-500 uppercase">Time</div>
               <div className="text-sm font-medium text-gray-900 dark:text-gray-200">{timestamp}</div>
             </div>
             <div className="p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-xl">
               <div className="text-xs text-gray-500 uppercase">Fee</div>
               <div className="text-sm font-medium text-gray-900 dark:text-gray-200">
                 {formatBalance(tx.effects?.gasUsed.computationCost || "0", 9)} SUI
               </div>
             </div>
          </div>

          {/* Asset Changes */}
          <div className="space-y-4">
            {assetsOut.length > 0 && (
                <div>
                    <h4 className="text-sm font-semibold text-gray-500 mb-2 flex items-center gap-1">
                        <ArrowUpRight size={14} className="text-red-500" /> Out
                    </h4>
                    <div className="space-y-2">
                        {assetsOut.map((c, i) => (
                            <div key={i} className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/20">
                                <span className="font-medium text-red-600 dark:text-red-400">
                                    {formatBalance(c.amount, getDecimals(c.coinType)).toLocaleString()} {getSymbol(c.coinType)}
                                </span>
                                <span className="text-xs text-gray-400 font-mono">
                                    {c.coinType.split('::').pop()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {assetsIn.length > 0 && (
                 <div>
                    <h4 className="text-sm font-semibold text-gray-500 mb-2 flex items-center gap-1">
                        <ArrowDownLeft size={14} className="text-green-500" /> In
                    </h4>
                    <div className="space-y-2">
                        {assetsIn.map((c, i) => (
                            <div key={i} className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-100 dark:border-green-900/20">
                                <span className="font-medium text-green-600 dark:text-green-400">
                                    +{formatBalance(c.amount, getDecimals(c.coinType)).toLocaleString()} {getSymbol(c.coinType)}
                                </span>
                                <span className="text-xs text-gray-400 font-mono">
                                    {c.coinType.split('::').pop()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {assetsIn.length === 0 && assetsOut.length === 0 && (
                <div className="text-center text-gray-400 text-sm py-4">
                    No balance changes detected.
                </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50">
          <a
            href={`https://suiscan.xyz/mainnet/tx/${tx.digest}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
          >
            View on Explorer <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}
