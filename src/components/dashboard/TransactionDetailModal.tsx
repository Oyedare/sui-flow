"use client";

import { X, ExternalLink, ArrowDownLeft, ArrowUpRight, StickyNote, Tag, Save, Pencil } from "lucide-react";
import { SuiTransactionBlockResponse } from "@mysten/sui.js/client";
import { formatBalance, getDecimals, getSymbol } from "@/lib/format";
import { useTransactionMetadata } from "@/hooks/useTransactionMetadata";
import { useState } from "react";
import { useNotifications } from "@/contexts/NotificationContext";
import { useSettings } from "@/contexts/SettingsContext";

interface TransactionDetailModalProps {
  tx: SuiTransactionBlockResponse;
  onClose: () => void;
}

export function TransactionDetailModal({ tx, onClose }: TransactionDetailModalProps) {
  const { settings } = useSettings();
  const isSuccess = tx.effects?.status.status === "success";
  const timestamp = tx.timestampMs ? new Date(Number(tx.timestampMs)).toLocaleString() : "Unknown Date";
  const { addNotification } = useNotifications();

  // New Metadata Hook
  const { getMetadata, updateMetadata } = useTransactionMetadata();
  const savedMeta = getMetadata(tx.digest);

  // Local State for editing
  const [title, setTitle] = useState(savedMeta.title || "");
  const [note, setNote] = useState(savedMeta.note || "");
  const [labels, setLabels] = useState<string[]>(savedMeta.labels || []);
  const [newLabel, setNewLabel] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const getAlphaColor = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const handleSave = () => {
    updateMetadata(tx.digest, {
        title,
        note,
        labels
    });
    addNotification("success", "Transaction details saved successfully", "Saved");
    // Optionally close or just show success
  };

  const addLabel = (e?: React.FormEvent) => {
      e?.preventDefault();
      if (newLabel.trim() && !labels.includes(newLabel.trim())) {
          setLabels([...labels, newLabel.trim()]);
          setNewLabel("");
      }
  };

  const removeLabel = (label: string) => {
      setLabels(labels.filter(l => l !== label));
  };

  // ... Balance parsing logic (unchanged)
  const changes = tx.balanceChanges || [];
  const assetsIn = changes.filter(c => parseInt(c.amount) > 0);
  const assetsOut = changes.filter(c => parseInt(c.amount) < 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-zinc-800 shrink-0">
          <div className="flex-1 mr-4">
             {isEditingTitle ? (
                 <input 
                    autoFocus
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={() => setIsEditingTitle(false)}
                    placeholder="Transaction Title"
                    className="w-full text-lg font-bold text-gray-900 dark:text-gray-100 bg-transparent border-b-2 focus:outline-none"
                    style={{ borderColor: settings.accentColor }}
                 />
             ) : (
                 <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setIsEditingTitle(true)}>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate">
                        {title || "Transaction Details"}
                    </h3>
                    <Pencil size={14} className="text-gray-400 transition-colors group-hover:text-[var(--accent)]" />
                 </div>
             )}
             <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full ${isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                   {isSuccess ? 'Success' : 'Failed'}
                </span>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Body - Scrollable */}
        <div className="p-6 space-y-6 overflow-y-auto">
          
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

          {/* Labels Section */}
          <div>
            <div className="flex items-center gap-2 mb-2">
                <Tag size={16} className="text-gray-400" />
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Labels</h4>
             </div>
             <div className="flex flex-wrap gap-2 mb-2">
                 {labels.map(label => (
                     <span 
                        key={label} 
                        className="px-2 py-1 rounded-full text-xs flex items-center gap-1"
                        style={{ 
                            backgroundColor: getAlphaColor(settings.accentColor, 0.1),
                            color: settings.accentColor 
                        }}
                     >
                         #{label}
                         <button onClick={() => removeLabel(label)} className="hover:opacity-70"><X size={10} /></button>
                     </span>
                 ))}
             </div>
             <form onSubmit={addLabel} className="flex gap-2">
                 <input 
                   value={newLabel}
                   onChange={(e) => setNewLabel(e.target.value)}
                   placeholder="Add tag (e.g. #food)"
                   className="flex-1 px-3 py-2 text-sm bg-gray-50 dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700 focus:outline-none border-transparent focus:border-[var(--accent)]"
                 />
                 <button type="submit" disabled={!newLabel.trim()} className="px-3 py-2 bg-gray-100 dark:bg-zinc-700 rounded-lg text-sm font-medium disabled:opacity-50">Add</button>
             </form>
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

          {/* User Note */}
          <div className="pt-4 border-t border-gray-100 dark:border-zinc-800">
             <div className="flex items-center gap-2 mb-2">
                <StickyNote size={16} className="text-gray-400" />
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Note</h4>
             </div>
             <textarea 
               value={note}
               onChange={(e) => setNote(e.target.value)}
               placeholder="Add a note to remember this transaction..."
               className="w-full p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl border-none focus:ring-2 text-sm text-gray-900 dark:text-gray-100 resize-none h-24 placeholder:text-gray-400"
               style={{ '--tw-ring-color': getAlphaColor(settings.accentColor, 0.2) } as any}
             />
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 shrink-0 flex gap-3">
          <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-2 py-3 text-white rounded-xl font-medium transition-opacity hover:opacity-90 shadow-lg"
              style={{ 
                  backgroundColor: settings.accentColor,
                  boxShadow: `0 10px 15px -3px ${getAlphaColor(settings.accentColor, 0.2)}`
              }}
            >
              <Save size={18} /> Save Changes
          </button>
          <a
            href={`https://suiscan.xyz/mainnet/tx/${tx.digest}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 flex items-center justify-center gap-2 py-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-colors"
          >
            <ExternalLink size={18} />
          </a>
        </div>
      </div>
    </div>
  );
}
