"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchFloorPrices, isTradeportConfigured } from "@/lib/tradeport";
import { KNOWN_COLLECTIONS } from "@/lib/nftCollections";

const CACHE_TIME = 60 * 60 * 1000; // 1 hour

/**
 * Hook to fetch NFT floor prices from Tradeport
 * Returns floor prices mapped by collection slug
 */
export function useNFTFloorPrices() {
  return useQuery({
    queryKey: ["nft-floor-prices"],
    queryFn: async () => {
      // Check if API is configured
      if (!isTradeportConfigured()) {
        console.log("Tradeport API not configured - floor prices unavailable");
        return {};
      }

      // Get all collection slugs
      const slugs = KNOWN_COLLECTIONS.map((c) => c.slug);
      
      // Fetch floor prices
      const floorPrices = await fetchFloorPrices(slugs);
      
      return floorPrices;
    },
    staleTime: CACHE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

/**
 * Get floor price for a specific collection
 */
export function getFloorPrice(
  floorPrices: Record<string, number> | undefined,
  collectionSlug: string
): number | null {
  if (!floorPrices) return null;
  return floorPrices[collectionSlug] || null;
}
