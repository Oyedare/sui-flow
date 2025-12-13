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
  backupMetadata: (signature?: string) => Promise<string>; // Returns Blob ID
  restoreMetadata: (blobId: string, signature?: string) => Promise<boolean>; // Returns success status
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

  const backupMetadata = async (signature?: string): Promise<string> => {
    try {
        let content = JSON.stringify(metadata);
        let skipsDefaultEncryption = false;
        
        // If signature is provided, encrypt with Seal
        if (signature) {
            const { encryptData } = await import("@/lib/seal");
            content = await encryptData(metadata, signature);
            skipsDefaultEncryption = true;
        }

        // Pass false for encryption if we already sealed it
        // If not sealed, we let storeBlob use its default encryption (true)
        const blobId = await storeBlob(content, !skipsDefaultEncryption);
        
        if (!blobId) throw new Error("Failed to upload to Walrus");
        return blobId;
    } catch (e) {
        console.error("Backup failed", e);
        throw e;
    }
  };

  const restoreMetadata = async (blobId: string, signature?: string): Promise<boolean> => {
      try {
          console.log("[Context] Fetching blob:", blobId);
          
          // If expecting a sealed blob (signature provided), tell readBlob NOT to decrypt (false)
          // because it wasn't encrypted by readBlob's default logic (or we want raw sealed data)
          const useDefaultDecryption = !signature;
          
          const blob = await readBlob(blobId, useDefaultDecryption);
          if (!blob) {
            console.error("[Context] Blob fetch return null/empty");
            return false;
          }
          console.log("[Context] Blob fetched. Length:", blob.length);
          
          let parsed: any;

          // If signature provided, try to decrypt with Seal
          if (signature) {
             console.log("[Context] Signature provided, attempting decryption...");
             const { decryptData } = await import("@/lib/seal");
             parsed = await decryptData(blob, signature);
          } else {
             parsed = JSON.parse(blob);
          }
          
          if (typeof parsed !== 'object') throw new Error("Invalid format");

          // Merge strategy
          setMetadata(prev => {
              const next = { ...prev, ...parsed };
              localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
              return next;
          });
          return true;
      } catch (e) {
          console.error("Restore failed", e);
          throw e; 
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
