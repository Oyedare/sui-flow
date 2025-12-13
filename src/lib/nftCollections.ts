// Known Sui NFT Collections Registry
// This will be used to map NFT types to collection info and floor prices

export interface NFTCollection {
  name: string;
  slug: string; // Tradeport collection slug
  typePrefix: string; // NFT type prefix to match
  marketplaceUrl: string;
}

// Registry of known Sui NFT collections
export const KNOWN_COLLECTIONS: NFTCollection[] = [
  {
    name: "Sui Capys",
    slug: "capys",
    typePrefix: "0x",
    marketplaceUrl: "https://tradeport.xyz/sui/collection/capys",
  },
  {
    name: "Prime Machin",
    slug: "prime-machin",
    typePrefix: "0x",
    marketplaceUrl: "https://tradeport.xyz/sui/collection/prime-machin",
  },
  {
    name: "Cosmocadia",
    slug: "cosmocadia",
    typePrefix: "0x",
    marketplaceUrl: "https://tradeport.xyz/sui/collection/cosmocadia",
  },
];

/**
 * Detect collection from NFT type
 */
export function detectCollection(nftType: string): NFTCollection | null {
  for (const collection of KNOWN_COLLECTIONS) {
    if (nftType.includes(collection.typePrefix)) {
      return collection;
    }
  }
  return null;
}

/**
 * Get collection name from NFT type
 */
export function getCollectionName(nftType: string): string {
  const collection = detectCollection(nftType);
  return collection?.name || "Unknown Collection";
}

/**
 * Get marketplace URL for NFT
 */
export function getMarketplaceUrl(objectId: string): string {
  return `https://suiscan.xyz/mainnet/object/${objectId}`;
}
