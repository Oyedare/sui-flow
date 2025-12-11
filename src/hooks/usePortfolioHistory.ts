"use client";

import { useEffect, useState } from "react";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";

const STORAGE_KEY = "sui-flow-portfolio-history";
const MAX_HISTORY_DAYS = 90; // Keep 90 days of history

export interface PortfolioSnapshot {
  timestamp: number;
  totalValue: number;
  date: string; // YYYY-MM-DD format
}

/**
 * Hook to track and retrieve portfolio value history
 * Generates historical data from current portfolio value
 */
export function usePortfolioHistory(currentValue: number) {
  const account = useCurrentAccount();
  const [history, setHistory] = useState<PortfolioSnapshot[]>([]);

  // Generate simulated historical data for demo purposes
  // Only update once per day to avoid excessive re-renders
  useEffect(() => {
    if (!account || currentValue === 0) {
      setHistory([]);
      return;
    }

    const key = `${STORAGE_KEY}-${account.address}`;
    const stored = localStorage.getItem(key);
    const today = new Date().toISOString().split("T")[0];
    
    // Check if we have stored history
    if (stored) {
      try {
        const parsed: PortfolioSnapshot[] = JSON.parse(stored);
        
        // Check if we already updated today
        const existingIndex = parsed.findIndex((s) => s.date === today);
        
        if (existingIndex >= 0) {
          // Already have today's snapshot, just use it without updating
          // (unless value changed significantly - more than 1%)
          const existingValue = parsed[existingIndex].totalValue;
          const percentChange = Math.abs((currentValue - existingValue) / existingValue);
          
          if (percentChange < 0.01) {
            // Value hasn't changed significantly, skip update
            setHistory(parsed);
            return;
          }
          
          // Significant change, update today's value
          parsed[existingIndex] = {
            timestamp: Date.now(),
            totalValue: currentValue,
            date: today,
          };
        } else {
          // New day, add new snapshot
          parsed.push({
            timestamp: Date.now(),
            totalValue: currentValue,
            date: today,
          });
        }
        
        setHistory(parsed);
        localStorage.setItem(key, JSON.stringify(parsed));
        return;
      } catch (error) {
        console.error("Failed to parse portfolio history:", error);
      }
    }

    // Generate initial historical data (simulated growth pattern)
    const generateHistory = () => {
      const snapshots: PortfolioSnapshot[] = [];
      const now = Date.now();
      const daysToGenerate = 30; // Generate 30 days of history
      
      for (let i = daysToGenerate; i >= 0; i--) {
        const date = new Date(now - i * 24 * 60 * 60 * 1000);
        const dateStr = date.toISOString().split("T")[0];
        
        // Simulate portfolio growth with some volatility
        // Start from 70-90% of current value and grow to current
        const progress = (daysToGenerate - i) / daysToGenerate;
        const baseMultiplier = 0.7 + (progress * 0.3); // 0.7 to 1.0
        const volatility = (Math.random() - 0.5) * 0.1; // ±5% random variation
        const value = currentValue * (baseMultiplier + volatility);
        
        snapshots.push({
          timestamp: date.getTime(),
          totalValue: Math.max(0, value),
          date: dateStr,
        });
      }
      
      return snapshots;
    };

    const initialHistory = generateHistory();
    setHistory(initialHistory);
    localStorage.setItem(key, JSON.stringify(initialHistory));
  }, [currentValue, account]);

  return history;
}

/**
 * Get portfolio history for a specific time period
 */
export function getHistoryForPeriod(
  history: PortfolioSnapshot[],
  days: number
): PortfolioSnapshot[] {
  if (history.length === 0) return [];
  
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return history.filter((s) => s.timestamp >= cutoff);
}

/**
 * Calculate portfolio performance metrics
 */
export function calculatePerformance(history: PortfolioSnapshot[]) {
  if (history.length < 2) {
    return {
      change: 0,
      changePercent: 0,
      startValue: 0,
      endValue: 0,
    };
  }

  const startValue = history[0].totalValue;
  const endValue = history[history.length - 1].totalValue;
  const change = endValue - startValue;
  const changePercent = startValue > 0 ? (change / startValue) * 100 : 0;

  return {
    change,
    changePercent,
    startValue,
    endValue,
  };
}
