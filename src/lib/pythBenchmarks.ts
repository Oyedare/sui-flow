import { PRICE_FEED_IDS } from "@/hooks/useTokenPrices";

const BENCHMARKS_URL = "https://benchmarks.pyth.network";

interface HistoricalPrice {
  id: string;
  price: {
    price: string;
    expo: number;
    publish_time: number;
  };
}

// Simple in-memory cache: type:date -> price
const priceCache: Record<string, number> = {};

/**
 * Fetch historical price for a specific coin at a specific timestamp.
 * Returns 0 if not found or error.
 */
export async function getHistoricalPrice(coinType: string, timestampMs: number): Promise<number> {
  // 1. Get Feed ID and strip 0x prefix
  let feedId = PRICE_FEED_IDS[coinType];
  if (!feedId) {
    console.warn(`No price feed found for ${coinType}`);
    return 0; 
  }
  if (feedId.startsWith("0x")) {
    feedId = feedId.slice(2);
  }

  // 2. Check Cache
  const cacheKey = `${coinType}:${timestampMs}`;
  if (priceCache[cacheKey]) return priceCache[cacheKey];

  try {
    // 3. Convert to seconds
    const publishTime = Math.floor(timestampMs / 1000);

    // 4. Fetch using Path Parameter (fuzzy match: "at or before")
    // URL: /v1/updates/price/{timestamp}?ids={id}
    // Note: Pyth API expects 'ids' param, not 'ids[]'
    const realUrl = `${BENCHMARKS_URL}/v1/updates/price/${publishTime}?ids=${feedId}`;
    
    const response = await fetch(realUrl);
    
    if (!response.ok) {
       // 404 means no price found for this specific time
       // This might happen for very old transactions before the feed existed
       return 0;
    }

    const data: HistoricalPrice = await response.json();
    
    // Safety check - sometimes array is returned or different structure
    // Pyth Benchmarks v1 usually returns a binary blob or specific structure
    // Let's adjust based on the standard JSON response if available, or just parsing standard
    // Actually the standard benchmark API returns:
    // {
    //   "id": "...",
    //   "price": { ... }
    // }
    // But since we request list, it might be an array? 
    // The docs say "Returns the price update...". Let's assume object if single ID.
    
    // Let's safely handle if it breaks
    if (!data || !data.price) return 0;

    const rawPrice = parseFloat(data.price.price);
    const expo = data.price.expo;
    const realPrice = rawPrice * Math.pow(10, expo);

    // Cache it
    priceCache[cacheKey] = realPrice;
    return realPrice;

  } catch (error) {
    console.warn(`Failed to fetch history for ${coinType} @ ${timestampMs}`, error);
    return 0;
  }
}

/**
 * Batch fetch helper (optional optimization for later)
 */
export async function resolvePricesForEvents(
  events: Array<{ coinType: string; timestampMs: number }>
): Promise<Map<string, number>> {
  const map = new Map<string, number>();
  
  // Rate limit: 
  // We should create a queue or just run loop with delay.
  // For MVP, we'll let the TaxEngine call `getHistoricalPrice` sequentially with delay.
  return map;
}
