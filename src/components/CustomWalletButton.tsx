"use client";

import { ConnectButton, useCurrentAccount, useDisconnectWallet, useSuiClientQuery } from "@mysten/dapp-kit";
import { getAvatarUrl } from "@/lib/avatar";
import { LogOut, Copy, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import { useNotifications } from "@/contexts/NotificationContext";
import { useSettings } from "@/contexts/SettingsContext";

export function CustomWalletButton() {
  const account = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { addNotification } = useNotifications();
  const { settings } = useSettings();

  // Fetch SuiNS Name
  const { data: suins } = useSuiClientQuery("resolveNameServiceNames", {
    address: account?.address || "",
  });
  const suinsName = suins?.data?.[0];

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopy = () => {
    if (account?.address) {
      navigator.clipboard.writeText(account.address);
      addNotification("success", "Address copied to clipboard", "Copied");
      setIsOpen(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setIsOpen(false);
  };

  // If not connected, show default Connect Button (it handles the modal well)
  if (!account) {
    return (
      <ConnectButton 
        className="!text-white !font-medium !rounded-full !px-6 !py-2 transition-all hover:!opacity-90"
        style={{ backgroundColor: settings.accentColor }}
      />
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "flex items-center gap-3 pl-1 pr-4 py-1 rounded-full border transition-all duration-200",
          "bg-white dark:bg-zinc-900",
          "border-gray-200 dark:border-zinc-800",
          "hover:shadow-md",
        )}
        style={{ 
            borderColor: isOpen ? settings.accentColor : undefined,
            // We use inline style for hover border if possible, or use a class that refs a variable
            // Since we cannot easily do hover via inline style without state, we will assume --accent is available globally
            // or we skip specific color on hover and just use accent if open.
            // But user asked for hover state.
             boxShadow: isOpen ? `0 0 0 2px ${settings.accentColor}33` : undefined // 33 = 20% opacity approx
        }}
        onMouseEnter={(e) => {
            if (!isOpen) e.currentTarget.style.borderColor = settings.accentColor;
        }}
        onMouseLeave={(e) => {
            if (!isOpen) e.currentTarget.style.borderColor = '';
        }}
      >
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 ring-2 ring-white dark:ring-zinc-800">
          <img 
            src={getAvatarUrl(account.address)} 
            alt="Wallet Avatar" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Name/Address */}
        <div className="flex flex-col items-start">
           <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-tight">
             {settings.showSuinsProfile && suinsName 
               ? suinsName 
               : `${account.address.slice(0, 4)}...${account.address.slice(-4)}`}
           </span>
           {settings.showSuinsProfile && suinsName && (
             <span className="text-[10px] text-gray-500 dark:text-gray-400 font-mono">
               {account.address.slice(0, 4)}...{account.address.slice(-4)}
             </span>
           )}
        </div>

        <ChevronDown size={14} className={clsx("text-gray-400 transition-transform", isOpen && "rotate-180")} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-gray-100 dark:border-zinc-800 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-200">
           <div className="px-3 py-2 border-b border-gray-100 dark:border-zinc-800 mb-1">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Wallet</span>
           </div>
           
           <button 
             onClick={handleCopy}
             className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
           >
             <Copy size={16} className="text-gray-400" />
             Copy Address
           </button>
           
           <button 
             onClick={handleDisconnect}
             className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
           >
             <LogOut size={16} />
             Disconnect
           </button>
        </div>
      )}
    </div>
  );
}
