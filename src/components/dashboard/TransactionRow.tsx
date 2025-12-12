"use client";

import { SuiTransactionBlockResponse } from "@mysten/sui.js/client";
import { CheckCircle2, XCircle, ArrowRightLeft, Move, StickyNote } from "lucide-react";
import { useNotifications } from "@/contexts/NotificationContext";
import { useTransactionMetadata } from "@/hooks/useTransactionMetadata";

import { useSettings } from "@/contexts/SettingsContext";

interface TransactionRowProps {
  tx: any; // Using any to bypass mismatch for MVP
  onClick: () => void;
}

// ... imports
// ... interface

export function TransactionRow({ tx, onClick }: TransactionRowProps) {
  const { addNotification } = useNotifications();
  const { getMetadata } = useTransactionMetadata();
  const { settings } = useSettings();
  const metadata = getMetadata(tx.digest);

  const getAlphaColor = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

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
             <span 
                className={`font-medium ${metadata.title ? 'font-bold' : 'text-gray-900 dark:text-gray-100'}`}
                style={metadata.title ? { color: settings.accentColor } : {}}
             >
                {metadata.title || (hasBalanceChange ? "Transaction" : "Interaction")}
             </span>
             {metadata.labels && metadata.labels.length > 0 && (
                <div className="flex gap-1">
                    {metadata.labels.slice(0, 2).map(label => (
                        <span 
                            key={label} 
                            className="text-[10px] px-1.5 py-0.5 rounded-full border"
                            style={{ 
                                backgroundColor: getAlphaColor(settings.accentColor, 0.1),
                                color: settings.accentColor,
                                borderColor: getAlphaColor(settings.accentColor, 0.2)
                            }}
                        >
                            #{label}
                        </span>
                    ))}
                    {metadata.labels.length > 2 && (
                         <span className="text-[10px] text-gray-400">+{metadata.labels.length - 2}</span>
                    )}
                </div>
             )}
             <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(tx.digest);
                  addNotification("success", "Transaction digest copied to clipboard", "Copied");
                }}
                className="text-xs text-gray-400 bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors flex items-center gap-1 opacity-0 group-hover:opacity-100"
                title="Copy Digest"
              >
                  {tx.digest.slice(0, 4)}...
             </button>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="text-xs text-gray-500">
              {timestamp}
            </div>
            {metadata.note && (
               <div className="flex items-center gap-1 text-[10px] text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-700">
                 <StickyNote size={10} />
                 <span className="max-w-[100px] truncate hidden sm:block">{metadata.note}</span>
               </div>
            )}
          </div>
        </div>
      </div>

      <div className="text-gray-400 group-hover:text-[var(--accent)] transition-colors">
        <ArrowRightLeft size={16} />
      </div>
    </div>
  );
}
