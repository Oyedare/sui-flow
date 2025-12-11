"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Currency = "USD" | "EUR" | "GBP" | "NGN" | "JPY";
export type Theme = "light" | "dark" | "system";
export type TaxMethod = "FIFO" | "LIFO" | "Average";
export type Network = "mainnet" | "testnet";

interface Settings {
  currency: Currency;
  theme: Theme;
  taxMethod: TaxMethod;
  showSuinsProfile: boolean;
  network: Network;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => void;
  getCurrencySymbol: () => string;
}

const defaultSettings: Settings = {
  currency: "USD",
  theme: "system",
  taxMethod: "FIFO",
  showSuinsProfile: true,
  network: "mainnet",
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const STORAGE_KEY = "sui-flow-settings";

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error("Failed to parse settings:", error);
      }
    }
  }, []);

  // Apply theme changes
  useEffect(() => {
    const root = document.documentElement;
    
    const applyTheme = (isDark: boolean) => {
      if (isDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };
    
    if (settings.theme === "dark") {
      applyTheme(true);
    } else if (settings.theme === "light") {
      applyTheme(false);
    } else {
      // System preference
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      applyTheme(mediaQuery.matches);
      
      // Listen for system theme changes
      const listener = (e: MediaQueryListEvent) => applyTheme(e.matches);
      mediaQuery.addEventListener("change", listener);
      
      return () => mediaQuery.removeEventListener("change", listener);
    }
  }, [settings.theme]);

  const updateSettings = (updates: Partial<Settings>) => {
    setSettings((prev) => {
      const newSettings = { ...prev, ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      return newSettings;
    });
  };

  const getCurrencySymbol = (): string => {
    const symbols: Record<Currency, string> = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      NGN: "₦",
      JPY: "¥",
    };
    return symbols[settings.currency];
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, getCurrencySymbol }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
}
