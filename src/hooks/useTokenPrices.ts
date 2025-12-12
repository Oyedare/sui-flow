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
  // USDC (Native)
  "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC": "0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a",
  // WAL (Walrus)
  "0x356a26eb9e012a68958082340d4c4116e7f55615cf27affcff209cf0ae544f59::wal::WAL": "0xeba0732395fae9dec4bae12e52760b35fc1c5671e2da8b449c9af4efe5d54341",
  // CETUS
  "0x06864a6f921804860930db6ddbe2e16acdf8504495ea7481637a1c8b9a8fe54b::cetus::CETUS": "0xe5b274b2611143df055d6e7cd8d93fe1961716bcd4dca1cad87a83bc1e78c1ef",
  // SCA (Scallop)
  "0x701631484196c342721867e37039a04a504245c6139cd3697669d675629c4a8::sca::SCA": "0x7e17f0ac105abe9214deb9944c30264f5986bf292869c6bd8e8da3ccd92d79bc",
  // NAVX (Navi)
  "0xa99b8952d4f7d947ea77fe46c5e8165e23132e186a8635848528c050a41703e::navx::NAVX": "0x2a025dfa219a1286c0788331168532f6b864ec0b8e7526ae76c2438c641add69",
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
        // Find ALL coinTypes for this Feed ID
        const matchingCoinTypes = Object.keys(PRICE_FEED_IDS).filter(
          (key) => {
            const definedId = PRICE_FEED_IDS[key];
            const feedId = feed.id;
            // robust check for 0x prefix
            return definedId.toLowerCase() === `0x${feedId}`.toLowerCase() || 
                   definedId.toLowerCase() === feedId.toLowerCase();
          }
        );

        if (matchingCoinTypes.length > 0) {
          const rawPrice = parseFloat(feed.price.price);
          const expo = feed.price.expo;
          const realPrice = rawPrice * Math.pow(10, expo);
          
          // Assign price to ALL matching coin types
          matchingCoinTypes.forEach(type => {
            priceMap[type] = realPrice;
          });
        }
      });

      return priceMap;
    },
    enabled: coinTypes.length > 0,
    refetchInterval: 1000 * 60 * 60, // 1 hour refresh
    staleTime: 1000 * 60 * 60, // 1 hour cache
  });
}
