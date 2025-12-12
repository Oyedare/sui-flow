"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { storeBlob, readBlob } from "@/lib/walrus";

const STORAGE_KEY = "sui-flow-tx-metadata";

export interface TransactionMetadata {
  note?: string;
  title?: string;
  labels?: string[];
}

export type MetadataMap = Record<string, TransactionMetadata>;

interface TransactionMetadataContextType {
  metadata: MetadataMap;
  getMetadata: (digest: string) => TransactionMetadata;
  updateMetadata: (digest: string, updates: Partial<TransactionMetadata>) => void;
  backupMetadata: () => Promise<string>; // Returns Blob ID
  restoreMetadata: (blobId: string) => Promise<boolean>; // Returns success status
}

const TransactionMetadataContext = createContext<TransactionMetadataContextType | undefined>(undefined);

export function TransactionMetadataProvider({ children }: { children: ReactNode }) {
  const [metadata, setMetadata] = useState<MetadataMap>({});

  // Load from storage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setMetadata(JSON.parse(stored));
      } catch (error) {
        console.error("Failed to parse transaction metadata", error);
      }
    }
  }, []);

  const getMetadata = (digest: string): TransactionMetadata => {
    return metadata[digest] || { note: "", title: "", labels: [] };
  };

  const updateMetadata = (digest: string, updates: Partial<TransactionMetadata>) => {
    setMetadata((prev) => {
      const existing = prev[digest] || {};
      const nextEntry = { ...existing, ...updates };

      // Basic cleanup: if all empty, maybe remove key? For now keep it simple.
      
      const next = {
        ...prev,
        [digest]: nextEntry,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const backupMetadata = async (): Promise<string> => {
    try {
        const json = JSON.stringify(metadata);
        // In a real app, we might encrypt this with the user's wallet signature
        // For now, we store as plain text JSON but Walrus IDs are obscure enough for this MVP
        const blobId = await storeBlob(json);
        if (!blobId) throw new Error("Failed to upload to Walrus");
        return blobId;
    } catch (e) {
        console.error("Backup failed", e);
        throw e;
    }
  };

  const restoreMetadata = async (blobId: string): Promise<boolean> => {
      try {
          const blob = await readBlob(blobId);
          if (!blob) return false;
          
          const parsed = JSON.parse(blob);
          if (typeof parsed !== 'object') throw new Error("Invalid format");

          // Merge strategy: Overwrite local with remote? Or smart merge?
          // Let's do simple merge: Remote wins on conflict, but keep local keys not in remote
          setMetadata(prev => {
              const next = { ...prev, ...parsed };
              localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
              return next;
          });
          return true;
      } catch (e) {
          console.error("Restore failed", e);
          return false;
      }
  };

  return (
    <TransactionMetadataContext.Provider value={{ metadata, getMetadata, updateMetadata, backupMetadata, restoreMetadata }}>
      {children}
    </TransactionMetadataContext.Provider>
  );
}

export function useTransactionMetadata() {
  const context = useContext(TransactionMetadataContext);
  if (!context) {
    throw new Error("useTransactionMetadata must be used within TransactionMetadataProvider");
  }
  return context;
}
