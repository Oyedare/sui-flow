"use client";

import { useTransactionHistory } from "@/hooks/useTransactionHistory";
import { TransactionRow } from "./TransactionRow";
import { TransactionDetailModal } from "./TransactionDetailModal";
import { useState } from "react";

export function HistoryList() {
  const { data, isLoading } = useTransactionHistory();
  const [selectedTx, setSelectedTx] = useState<any>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 bg-gray-50 dark:bg-zinc-900 rounded-2xl">
        No transactions found.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {data.data.map((tx) => (
          <TransactionRow 
             key={tx.digest} 
             tx={tx as any} 
             onClick={() => setSelectedTx(tx)}
          />
        ))}
      </div>

      {selectedTx && (
        <TransactionDetailModal 
          tx={selectedTx} 
          onClose={() => setSelectedTx(null)} 
        />
      )}
    </>
  );
}
