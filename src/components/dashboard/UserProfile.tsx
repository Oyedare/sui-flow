import { useCurrentAccount, useDisconnectWallet } from "@mysten/dapp-kit";
import { useSuiNS } from "@/hooks/useSuiNS";
import { User, Wallet, LogOut, Copy, ChevronDown } from "lucide-react";
import { useState } from "react";
import { getAvatarUrl } from "@/lib/avatar";

export function UserProfile() {
  const account = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();
  const { data: suins } = useSuiNS(account?.address);
  const [isOpen, setIsOpen] = useState(false);

  if (!account) return null;

  const displayName = suins?.name || `${account.address.slice(0, 5)}...${account.address.slice(-4)}`;
  const avatarSrc = suins?.avatarUrl || getAvatarUrl(account.address);

  const copyAddress = () => {
    navigator.clipboard.writeText(account.address);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-2 py-2 pr-4 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-md rounded-full border border-white/20 dark:border-zinc-700/50 shadow-sm transition-all hover:bg-white/80 dark:hover:bg-zinc-800/80 group"
      >
        {/* Avatar Circle */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-teal-400 flex items-center justify-center text-white shadow-inner overflow-hidden">
          <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
        </div>

        {/* Name/Address */}
        <div className="flex flex-col items-start">
          <span className="text-sm font-bold text-gray-800 dark:text-gray-100 leading-tight">
            {displayName}
          </span>
          {suins?.name && (
             <span className="text-[10px] text-gray-500 font-mono leading-tight">
               {account.address.slice(0, 4)}...{account.address.slice(-4)}
             </span>
          )}
        </div>
        
        <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-gray-100 dark:border-zinc-800 overflow-hidden animate-in fade-in zoom-in-95 duration-100 p-1 z-50">
           <button 
             onClick={copyAddress}
             className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-left"
           >
             <Copy size={16} /> Copy Address
           </button>
           <button 
             onClick={() => disconnect()}
             className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-left"
           >
             <LogOut size={16} /> Disconnect
           </button>
        </div>
      )}
      
      {/* Backdrop to close */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}
