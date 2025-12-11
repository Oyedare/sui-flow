import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { loadNFTCache, getCachedNFT, cacheNFT, getWalrusImageUrl } from "@/lib/nftCache";
import { cacheNFTImage } from "@/lib/cacheNFTImage";

export interface NFT {
  objectId: string;
  name: string;
  description: string;
  imageUrl: string;
  type: string;
  isCached?: boolean; // Indicates if using Walrus cache
}

export function useNFTs() {
  const account = useCurrentAccount();
  const suiClient = useSuiClient();

  const query = useQuery({
    queryKey: ["nfts", account?.address],
    queryFn: async () => {
      if (!account?.address) return [];

      try {
        // Load cache
        const cache = loadNFTCache(account.address);

        // Fetch all owned objects
        const objects = await suiClient.getOwnedObjects({
          owner: account.address,
          options: {
            showType: true,
            showContent: true,
            showDisplay: true,
          },
          filter: {
            // Filter for objects that have display metadata (typically NFTs)
            MatchNone: [
              { StructType: "0x2::coin::Coin" }, // Exclude coins
            ],
          },
        });

        const nfts: NFT[] = [];

        for (const obj of objects.data) {
          if (!obj.data) continue;

          const display = obj.data.display?.data;
          const content = obj.data.content;

          // Skip if no display data (not an NFT)
          if (!display) continue;

          const objectId = obj.data.objectId;
          const originalImageUrl = display.image_url || display.img_url || "";
          
          // Check if we have a cached version
          const cachedEntry = cache[objectId];
          const isCached = Boolean(cachedEntry);
          const imageUrl = isCached ? cachedEntry.walrusUrl : originalImageUrl;

          nfts.push({
            objectId,
            name: display.name || "Unnamed NFT",
            description: display.description || "",
            imageUrl,
            type: obj.data.type || "Unknown",
            isCached,
          });
        }

        return nfts;
      } catch (error) {
        console.error("Error fetching NFTs:", error);
        return [];
      }
    },
    enabled: !!account?.address,
    staleTime: 30000, // 30 seconds
  });

  // Background caching for uncached NFTs
  useEffect(() => {
    if (!account?.address || !query.data) return;

    const uncachedNFTs = query.data.filter(nft => !nft.isCached && nft.imageUrl);
    
    if (uncachedNFTs.length === 0) return;

    // Cache images in background (don't block UI)
    const cacheImages = async () => {
      for (const nft of uncachedNFTs) {
        try {
          const blobId = await cacheNFTImage(nft.imageUrl);
          const walrusUrl = getWalrusImageUrl(blobId);
          
          // Save to cache
          cacheNFT(account.address!, {
            objectId: nft.objectId,
            blobId,
            imageUrl: nft.imageUrl,
            cachedAt: Date.now(),
            walrusUrl,
          });
          
          console.log(`✅ Cached NFT "${nft.name}" to Walrus`);
        } catch (error) {
          // Silently skip images that can't be cached (CORS, network errors, etc.)
          // This is expected for some NFT providers
          if (error instanceof Error && error.message.includes('CORS')) {
            console.log(`⚠️  Skipping "${nft.name}" - CORS not allowed by server`);
          }
          // Don't log other errors to avoid console spam
        }
      }
    };

    // Start caching after a short delay
    const timer = setTimeout(() => {
      cacheImages();
    }, 2000);

    return () => clearTimeout(timer);
  }, [query.data, account?.address]);

  return query;
}
