"use client";

import { useState } from "react";
import { CloudUpload, Lock, CheckCircle2, Copy } from "lucide-react";
import { TaxReport } from "@/lib/taxEngine";

interface WalrusBackupProps {
  report: TaxReport;
}

export function WalrusBackup({ report }: WalrusBackupProps) {
  const [status, setStatus] = useState<'idle' | 'encrypting' | 'uploading' | 'success'>('idle');
  const [blobId, setBlobId] = useState<string | null>(null);

  const handleBackup = async () => {
    setStatus('encrypting');
    
    try {
      // Convert report to JSON string
      const reportData = JSON.stringify(report);
      
      setStatus('uploading');
      
      // Upload to Walrus (with encryption)
      const { storeBlob } = await import('@/lib/walrus');
      const blobId = await storeBlob(reportData, true);
      
      setBlobId(blobId);
      setStatus('success');
    } catch (error) {
      console.error('Walrus backup failed:', error);
      alert('Failed to backup to Walrus. Please try again.');
      setStatus('idle');
    }
  };

  const copyBlobId = () => {
    if (blobId) navigator.clipboard.writeText(blobId);
  };

  if (status === 'success' && blobId) {
    return (
      <div className="flex flex-col gap-2 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-900/30 rounded-xl animate-in fade-in slide-in-from-bottom-2">
        <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-medium">
          <CheckCircle2 size={18} />
          Backup Secure on Walrus
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 rounded-lg p-2 border border-purple-200 dark:border-purple-900/50">
          <code className="text-xs font-mono flex-1 truncate text-gray-600 dark:text-gray-300">
            {blobId}
          </code>
          <button 
            onClick={copyBlobId}
            className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md transition-colors"
            title="Copy Blob ID"
          >
            <Copy size={14} className="text-gray-500" />
          </button>
        </div>
        <p className="text-[10px] text-purple-600/70 dark:text-purple-400/70">
          Save this Blob ID. You need it to restore your report later.
        </p>
      </div>
    );
  }

  return (
    <button
      onClick={handleBackup}
      disabled={status !== 'idle'}
      className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-purple-500/25 disabled:opacity-70 disabled:cursor-wait"
    >
      {status === 'idle' && (
        <>
          <CloudUpload size={16} /> 
          Save to Walrus
        </>
      )}
      {status === 'encrypting' && (
        <>
          <Lock size={16} className="animate-pulse" />
          Encrypting...
        </>
      )}
      {status === 'uploading' && (
        <>
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Uploading to Blob...
        </>
      )}
    </button>
  );
}
