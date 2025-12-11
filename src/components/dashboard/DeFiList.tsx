import { ProtocolInfo, identifyProtocol } from "@/lib/defiUtils";
import { ExternalLink, Layers } from "lucide-react";

interface DeFiListProps {
  positions: {
    coinType: string;
    totalBalance: string; 
    lockedBalance?: any;
  }[];
}

export function DeFiList({ positions }: DeFiListProps) {
  if (!positions || positions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in duration-500">
        <div className="w-16 h-16 bg-blue-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
          <Layers className="text-blue-400" size={32} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          No DeFi Positions Found
        </h3>
        <p className="text-gray-500 max-w-sm text-sm">
          We couldn't detect any known LP tokens or lending positions in your wallet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {positions.map((pos) => {
        const info = identifyProtocol(pos.coinType) as ProtocolInfo;
        // Should settle name display. E.g. "Cetus LP"
        // Try to parse asset names from coinType if possible, or just generic
        const nameParts = pos.coinType.split("::");
        const displayName = nameParts.length > 2 
            ? `${nameParts[nameParts.length - 1]} Position` // e.g. "Pool Position"
            : "Unknown Position";

        return (
          <div 
            key={pos.coinType}
            className="group relative overflow-hidden bg-white dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800 rounded-xl p-6 transition-all hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5"
          >
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gray-50 dark:bg-zinc-800 flex items-center justify-center text-xl`}>
                        {/* Placeholder Icon based on name first char */}
                        {info.name[0]}
                    </div>
                    <div>
                        <h4 className={`font-bold ${info.color}`}>{info.name}</h4>
                        <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full w-fit mt-1">
                            {info.type}
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="mb-6">
                <div className="text-xs text-gray-400 mb-1">Asset Type</div>
                <div className="text-xs font-mono text-gray-600 dark:text-gray-400 truncate" title={pos.coinType}>
                    {pos.coinType}
                </div>
                {/* 
                   Future Feature: Show Value in USD.
                   Requires fetching pool state which is heavy. 
                   For MVP, we just show existence.
                */}
            </div>

            <a 
                href={info.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-gray-900 dark:bg-white text-white dark:text-black rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
            >
                Manage on {info.name} <ExternalLink size={14} />
            </a>
          </div>
        );
      })}
    </div>
  );
}
