"use client";

import { SuiTransactionBlockResponse } from "@mysten/sui.js/client";
import { CheckCircle2, XCircle, ArrowRightLeft, Move } from "lucide-react";
import { useNotifications } from "@/contexts/NotificationContext";

interface TransactionRowProps {
  tx: any; // Using any to bypass mismatch for MVP
  onClick: () => void;
}

export function TransactionRow({ tx, onClick }: TransactionRowProps) {
  const { addNotification } = useNotifications();
  const isSuccess = tx.effects?.status.status === "success";
  const timestamp = tx.timestampMs ? new Date(Number(tx.timestampMs)).toLocaleString() : "Unknown Date";
  
  // Simple type detection
  const hasBalanceChange = !!tx.balanceChanges && tx.balanceChanges.length > 0;
  
  return (
    <div 
      onClick={onClick}
      className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors group cursor-pointer active:scale-[0.99]"
    >
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-full ${isSuccess ? 'bg-green-100 text-green-600 dark:bg-green-900/30' : 'bg-red-100 text-red-600 dark:bg-red-900/30'}`}>
          {isSuccess ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
        </div>
        
        <div>
          <div className="flex items-center gap-2">
             <span className="font-medium text-gray-900 dark:text-gray-100">
                {hasBalanceChange ? "Transaction" : "Interaction"}
             </span>
             <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(tx.digest);
                  addNotification("success", "Transaction digest copied to clipboard", "Copied");
                }}
                className="text-xs text-gray-400 bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors flex items-center gap-1"
                title="Copy Digest"
             >
                {tx.digest.slice(0, 6)}...{tx.digest.slice(-4)}
             </button>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {timestamp}
          </div>
        </div>
      </div>

      <div className="text-gray-400 group-hover:text-blue-500 transition-colors">
        <ArrowRightLeft size={16} />
      </div>
    </div>
  );
}
