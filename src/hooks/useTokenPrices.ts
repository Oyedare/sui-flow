"use client";

import { useQuery } from "@tanstack/react-query";

// Pyth Hermes Endpoint
const HERMES_URL = "https://hermes.pyth.network";

// Mapping of CoinType to Pyth Price Feed ID
export const PRICE_FEED_IDS: Record<string, string> = {
  // SUI
  "0x2::sui::SUI": "0x23d7315113f5b1d3ba7a83604c44b94d79f4fd69af77f804fc7f920a6dc65744",
  // USDC (Wormhole) - Standard USDC on Sui
  "0x5d4b302506645c37ff133b971b3f4534e4ce8df6a7e01b7a414e6b9bfb278db::wusdc::WUSDC": "0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a",
  // USDC (Native) - Check official ID if different, usually similar peg
  // For MVP we stick to these major ones.
};

interface PythPriceResponse {
  parsed: {
    id: string;
    price: {
      price: string;
      conf: string;
      expo: number;
      publish_time: number;
    };
    ema_price: {
      price: string;
      conf: string;
      expo: number;
      publish_time: number;
    };
  }[];
}

export function useTokenPrices(coinTypes: string[]) {
  return useQuery({
    queryKey: ["token-prices", coinTypes],
    queryFn: async () => {
      // 1. Filter coinTypes that we have IDs for
      const idsToFetch = coinTypes
        .map((type) => PRICE_FEED_IDS[type])
        .filter(Boolean);

      if (idsToFetch.length === 0) return {};

      // 2. Construct Query Param
      const params = new URLSearchParams();
      idsToFetch.forEach((id) => params.append("ids[]", id));

      // 3. Fetch from Hermes
      const response = await fetch(`${HERMES_URL}/v2/updates/price/latest?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch prices from Hermes");
      }

      const data: PythPriceResponse = await response.json();

      // 4. Map back to CoinTypes
      const priceMap: Record<string, number> = {};

      data.parsed.forEach((feed) => {
        // Find the coinType for this Feed ID
        const coinType = Object.keys(PRICE_FEED_IDS).find(
          (key) => PRICE_FEED_IDS[key] === "0x" + feed.id // Hermes sends IDs without 0x in older versions, checking response structure usually includes 0x or not. 
          // v2/updates/price/latest typically returns hex id. Let's handle both just in case or assume strict match.
          // Actually Hermes v2 IDs in JSON are hex strings.
        );
        
        // Match by ID (ignoring case/prefix issues if any)
        const matchedCoinType = Object.keys(PRICE_FEED_IDS).find(
            key => PRICE_FEED_IDS[key].toLowerCase() === `0x${feed.id}` || PRICE_FEED_IDS[key].toLowerCase() === feed.id 
        );

        if (matchedCoinType) {
          const rawPrice = parseFloat(feed.price.price);
          const expo = feed.price.expo;
          const realPrice = rawPrice * Math.pow(10, expo);
          priceMap[matchedCoinType] = realPrice;
        }
      });

      return priceMap;
    },
    enabled: coinTypes.length > 0,
    refetchInterval: 30000, // 30s refresh
  });
}
