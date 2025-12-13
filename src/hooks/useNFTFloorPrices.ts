"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchFloorPrices, isTradeportConfigured } from "@/lib/tradeport";
import { NFT } from "./useNFTs";

const CACHE_TIME = 60 * 60 * 1000; // 1 hour

/**
 * Hook to fetch NFT floor prices from Tradeport/Indexer
 * Returns floor prices mapped by collection type
 */
export function useNFTFloorPrices(nfts: NFT[] = []) {
  // Extract types to use as query key dependency
  const types = nfts.map(n => n.type).sort();
  const typesKey = JSON.stringify(types);

  return useQuery({
    queryKey: ["nft-floor-prices", typesKey],
    queryFn: async () => {
      // Check if API is configured
      if (!isTradeportConfigured()) {
        console.log("Indexer API not configured - floor prices unavailable");
        return {};
      }

      if (nfts.length === 0) return {};

      // Get all unique collection types
      const uniqueTypes = Array.from(new Set(nfts.map((n) => n.type)));
      
      // Fetch floor prices
      const floorPrices = await fetchFloorPrices(uniqueTypes);
      
      return floorPrices;
    },
    enabled: nfts.length > 0,
    staleTime: CACHE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

/**
 * Get floor price for a specific NFT type
 */
export function getFloorPrice(
  floorPrices: Record<string, number> | undefined,
  nftType: string
): number | null {
  if (!floorPrices) return null;
  return floorPrices[nftType] || null;
}
