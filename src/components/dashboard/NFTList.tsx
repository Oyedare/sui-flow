"use client";

import { useNFTs } from "@/hooks/useNFTs";
import { ExternalLink, Image as ImageIcon, TrendingUp } from "lucide-react";
import { getCollectionName, getMarketplaceUrl } from "@/lib/nftCollections";
import { useSettings } from "@/contexts/SettingsContext";

export function NFTList() {
  const { data: nfts, isLoading } = useNFTs();
  const { settings } = useSettings();

  const getAlphaColor = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: settings.accentColor }}></div>
      </div>
    );
  }

  if (!nfts || nfts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
           <ImageIcon className="text-gray-400" size={32} />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No NFTs Found</h3>
        <p className="text-gray-500 max-w-sm mt-2">
          Your wallet doesn't seem to contain any NFTs.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {nfts.map((nft) => {
        const collectionName = getCollectionName(nft.type);
        const marketplaceUrl = getMarketplaceUrl(nft.objectId);
        
        return (
          <div
            key={nft.objectId}
            className="group bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            {/* NFT Image */}
            <div className="aspect-square bg-gray-100 dark:bg-zinc-800 relative overflow-hidden">
               {nft.imageUrl ? (
                  <img 
                    src={nft.imageUrl} 
                    alt={nft.name || "NFT"} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
               ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-600">
                    <ImageIcon size={48} />
                  </div>
               )}
            </div>
            
            {/* NFT Info */}
            <div className="p-4">
              {/* Collection Badge */}
              <div className="flex items-center justify-between mb-2">
                <span 
                    className="text-xs px-2 py-1 rounded-full font-medium"
                    style={{ 
                        backgroundColor: getAlphaColor(settings.accentColor, 0.1),
                        color: settings.accentColor
                    }}
                >
                  {collectionName}
                </span>
                {marketplaceUrl && (
                  <a
                    href={marketplaceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-500 hover:opacity-80 transition-colors flex items-center gap-1"
                    style={{ '--hover-color': settings.accentColor } as any}
                    onMouseEnter={(e) => e.currentTarget.style.color = settings.accentColor}
                    onMouseLeave={(e) => e.currentTarget.style.color = ''}
                  >
                    <TrendingUp size={12} />
                    Market
                  </a>
                )}
              </div>

              <h4 className="font-semibold text-gray-900 dark:text-white truncate mb-1">
                {nft.name || "Unknown NFT"}
              </h4>
              
              {nft.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
                  {nft.description}
                </p>
              )}

              {/* Floor Price Placeholder */}
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
