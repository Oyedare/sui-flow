// NFT Cache Service
// Manages caching of NFT metadata and images on Walrus

const CACHE_KEY_PREFIX = "nft-cache";
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface NFTCacheEntry {
  objectId: string;
  blobId: string;        // Walrus blob ID
  imageUrl: string;      // Original URL (fallback)
  cachedAt: number;      // Timestamp
  walrusUrl: string;     // Constructed Walrus URL
}

interface NFTCache {
  [objectId: string]: NFTCacheEntry;
}

/**
 * Get cache key for wallet address
 */
function getCacheKey(walletAddress: string): string {
  return `${CACHE_KEY_PREFIX}-${walletAddress}`;
}

/**
 * Load NFT cache from localStorage
 */
export function loadNFTCache(walletAddress: string): NFTCache {
  try {
    const key = getCacheKey(walletAddress);
    const stored = localStorage.getItem(key);
    
    if (!stored) return {};
    
    const cache: NFTCache = JSON.parse(stored);
    
    // Filter out expired entries
    const now = Date.now();
    const validCache: NFTCache = {};
    
    for (const [objectId, entry] of Object.entries(cache)) {
      if (now - entry.cachedAt < CACHE_TTL) {
        validCache[objectId] = entry;
      }
    }
    
    return validCache;
  } catch (error) {
    console.error("Failed to load NFT cache:", error);
    return {};
  }
}

/**
 * Save NFT cache to localStorage
 */
export function saveNFTCache(walletAddress: string, cache: NFTCache): void {
  try {
    const key = getCacheKey(walletAddress);
    localStorage.setItem(key, JSON.stringify(cache));
  } catch (error) {
    console.error("Failed to save NFT cache:", error);
  }
}

/**
 * Get cached entry for NFT
 */
export function getCachedNFT(walletAddress: string, objectId: string): NFTCacheEntry | null {
  const cache = loadNFTCache(walletAddress);
  return cache[objectId] || null;
}

/**
 * Add NFT to cache
 */
export function cacheNFT(walletAddress: string, entry: NFTCacheEntry): void {
  const cache = loadNFTCache(walletAddress);
  cache[entry.objectId] = entry;
  saveNFTCache(walletAddress, cache);
}

/**
 * Check if NFT is cached and valid
 */
export function isNFTCached(walletAddress: string, objectId: string): boolean {
  const entry = getCachedNFT(walletAddress, objectId);
  if (!entry) return false;
  
  const now = Date.now();
  return now - entry.cachedAt < CACHE_TTL;
}

/**
 * Clear expired cache entries
 */
export function cleanupNFTCache(walletAddress: string): void {
  const cache = loadNFTCache(walletAddress);
  saveNFTCache(walletAddress, cache); // loadNFTCache already filters expired entries
}

/**
 * Get Walrus URL from blob ID
 */
export function getWalrusImageUrl(blobId: string): string {
  const aggregatorUrl = process.env.NEXT_PUBLIC_WALRUS_AGGREGATOR_URL || 
    'https://aggregator.walrus-testnet.walrus.space';
  return `${aggregatorUrl}/v1/blobs/${blobId}`;
}
