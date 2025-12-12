"use client";

import { useQuery } from "@tanstack/react-query";
import { Currency } from "@/contexts/SettingsContext";

// Pyth price feed IDs for forex pairs
const PRICE_FEED_IDS = {
  EUR_USD: "0xa995cbf0a1737e6f85e4952011400e979d39c065f49e06180802c638e132c30b",
  GBP_USD: "0x84c2dde9633d93d1bcad84e7dc41c9d56578b7ec52fabedc1f335d673df0a7c1",
  USD_JPY: "0xef2c957e19672ac49d150f83c076592a0e698cd981d774d173367936a188fd52",
};

// Pyth Hermes API endpoint
const PYTH_HERMES_URL = "https://hermes.pyth.network";
const CACHE_KEY = "sui-flow-currency-rates";
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

interface PythPrice {
  id: string;
  price: {
    price: string;
    conf: string;
    expo: number;
    publish_time: number;
  };
}

interface CachedRates {
  rates: Record<Currency, number>;
  timestamp: number;
}

/**
 * Fetch live currency exchange rates from Pyth Network
 * Caches results for 1 hour in localStorage
 */
export function useCurrencyRates() {
  return useQuery({
    queryKey: ["currency-rates"],
    queryFn: async () => {
      try {
        // Check localStorage cache first
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { rates, timestamp }: CachedRates = JSON.parse(cached);
          const age = Date.now() - timestamp;
          
          // Return cached rates if less than 1 hour old
          if (age < CACHE_DURATION) {
            console.log("Using cached currency rates, age:", Math.floor(age / 60000), "minutes");
            return rates;
          }
        }

        console.log("Fetching fresh currency rates from Pyth...");
        
        // Fetch all forex price feeds
        const feedIds = Object.values(PRICE_FEED_IDS);
        const response = await fetch(
          `${PYTH_HERMES_URL}/v2/updates/price/latest?ids[]=${feedIds.join("&ids[]=")}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch currency rates");
        }

        const data = await response.json();
        const parsed = data.parsed as PythPrice[];

        // Extract rates
        const rates: Record<Currency, number> = {
          USD: 1, // Base currency
          EUR: 0.92, // Fallback
          GBP: 0.79, // Fallback
          NGN: 1580, // Fallback (Pyth doesn't have NGN/USD)
          JPY: 149, // Fallback
        };

        // Parse Pyth prices
        parsed.forEach((priceData) => {
          const price = parseFloat(priceData.price.price);
          const expo = priceData.price.expo;
          const actualPrice = price * Math.pow(10, expo);

          if (priceData.id === PRICE_FEED_IDS.EUR_USD) {
            // Feed is EUR/USD ($1.08), we want USD -> EUR (0.92)
            rates.EUR = 1 / actualPrice;
          } else if (priceData.id === PRICE_FEED_IDS.GBP_USD) {
            // Feed is GBP/USD ($1.27), we want USD -> GBP (0.79)
            rates.GBP = 1 / actualPrice;
          } else if (priceData.id === PRICE_FEED_IDS.USD_JPY) {
            // Feed is USD/JPY (149), we want USD -> JPY (149)
            rates.JPY = actualPrice;
          }
        });

        // Cache to localStorage
        const cacheData: CachedRates = {
          rates,
          timestamp: Date.now(),
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
        console.log("Cached fresh currency rates");

        return rates;
      } catch (error) {
        console.error("Error fetching currency rates:", error);
        
        // Try to return cached rates even if expired
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { rates }: CachedRates = JSON.parse(cached);
          console.log("Using expired cache as fallback");
          return rates;
        }
        
        // Return fallback rates on error
        return {
          USD: 1,
          EUR: 0.92,
          GBP: 0.79,
          NGN: 1580,
          JPY: 149,
        };
      }
    },
    staleTime: CACHE_DURATION, // 1 hour
    gcTime: CACHE_DURATION * 2, // Keep in memory for 2 hours
    refetchInterval: CACHE_DURATION, // Refetch every hour
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });
}
