"use client";

import { useNFTs } from "@/hooks/useNFTs";
import { ExternalLink, Image as ImageIcon, TrendingUp } from "lucide-react";
import { getCollectionName, getMarketplaceUrl } from "@/lib/nftCollections";

export function NFTList() {
  const { data: nfts, isLoading } = useNFTs();

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!nfts || nfts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-3xl bg-gray-50 dark:bg-zinc-900/50">
        <ImageIcon className="text-gray-400 mb-4" size={48} />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          No NFTs Found
        </h3>
        <p className="text-gray-500 text-center max-w-sm">
          Your wallet doesn't contain any NFTs yet. Start collecting on the Sui ecosystem!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {nfts.map((nft) => {
        const collectionName = getCollectionName(nft.type);
        const marketplaceUrl = getMarketplaceUrl(nft.type);
        
        return (
          <div
            key={nft.objectId}
            className="group relative bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            {/* NFT Image */}
            <div className="aspect-square bg-gray-100 dark:bg-zinc-800 relative overflow-hidden">
              {/* Walrus Cache Indicator */}
              {nft.isCached && (
                <div className="absolute top-2 left-2 z-10 px-2 py-1 bg-green-500/90 backdrop-blur-sm rounded-full flex items-center gap-1">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs text-white font-medium">Cached</span>
                </div>
              )}
              
              {nft.imageUrl ? (
                <img
                  src={nft.imageUrl}
                  alt={nft.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src = "";
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="text-gray-400" size={48} />
                </div>
              )}
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <a
                  href={`https://suiscan.xyz/testnet/object/${nft.objectId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-white/90 dark:bg-zinc-900/90 rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-white dark:hover:bg-zinc-900 transition-colors"
                >
                  View on Explorer <ExternalLink size={14} />
                </a>
              </div>
            </div>

            {/* NFT Info */}
            <div className="p-4">
              {/* Collection Badge */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full font-medium">
                  {collectionName}
                </span>
                {marketplaceUrl && (
                  <a
                    href={marketplaceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
                  >
                    <TrendingUp size={12} />
                    Market
                  </a>
                )}
              </div>

              <h4 className="font-semibold text-gray-900 dark:text-white truncate mb-1">
                {nft.name}
              </h4>
              
              {nft.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
                  {nft.description}
                </p>
              )}

              {/* Floor Price Placeholder - Will be populated when API key is available */}
              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-zinc-800">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Floor Price</span>
                  <span className="text-gray-400 dark:text-gray-500 italic">Coming soon</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
