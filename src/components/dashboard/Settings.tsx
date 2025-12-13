"use client";

import { useSettings, Currency, Theme, TaxMethod, Network } from "@/contexts/SettingsContext";
import { Settings as SettingsIcon, Palette, DollarSign, Calculator, Globe, Database, UploadCloud, DownloadCloud, Copy, Trash2, Plus, Wallet } from "lucide-react";
import clsx from "clsx";
import { useTransactionMetadata } from "@/hooks/useTransactionMetadata";
import { useNotifications } from "@/contexts/NotificationContext";
import { useState } from "react";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useSignPersonalMessage, useCurrentAccount } from "@mysten/dapp-kit";

export function Settings() {
  const { settings, updateSettings, getCurrencySymbol } = useSettings();
  const { startTour } = useOnboarding();

  const currencies: Currency[] = ["USD", "EUR", "GBP", "NGN", "JPY"];
  const themes: { value: Theme; label: string }[] = [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
    { value: "system", label: "System" },
  ];
  const taxMethods: TaxMethod[] = ["FIFO", "LIFO", "Average"];
  const networks: { value: Network; label: string; description: string }[] = [
    { value: "mainnet", label: "Mainnet", description: "Real assets and transactions" },
    { value: "testnet", label: "Testnet", description: "Test environment (Walrus compatible)" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SettingsIcon className="text-[var(--accent)]" size={28} />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Customize your Flow experience</p>
          </div>
        </div>
        <button
          onClick={startTour}
          className="px-4 py-2 text-sm font-medium text-[var(--accent)] bg-[var(--accent)]/10 hover:bg-[var(--accent)]/20 rounded-full transition-colors"
        >
          Replay Tour
        </button>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Display Settings */}
        <div className="p-6 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Palette size={20} className="text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Display</h3>
          </div>

          {/* Theme */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Theme
            </label>
            <div className="flex gap-2">
              {themes.map((theme) => (
                <button
                  key={theme.value}
                  onClick={() => updateSettings({ theme: theme.value })}
                  className={clsx(
                    "flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-all",
                    settings.theme === theme.value
                      ? "bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/25"
                      : "bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700"
                  )}
                >
                  {theme.label}
                </button>
              ))}
            </div>
          </div>

          {/* Accent Color */}
          <div className="mb-6">
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Accent Color
             </label>
             <div className="flex flex-wrap gap-3">
                {[
                   { name: 'Blue', hex: '#2563eb' },
                   { name: 'Purple', hex: '#9333ea' },
                   { name: 'Pink', hex: '#db2777' },
                   { name: 'Orange', hex: '#ea580c' },
                   { name: 'Teal', hex: '#0d9488' },
                ].map(color => (
                   <button
                      key={color.hex}
                      onClick={() => updateSettings({ accentColor: color.hex })}
                      className={clsx(
                         "w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center",
                         settings.accentColor === color.hex ? "border-gray-900 dark:border-white scale-110" : "border-transparent hover:scale-105"
                      )}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                   >
                      {settings.accentColor === color.hex && <div className="w-2 h-2 bg-white rounded-full" />}
                   </button>
                ))}
                
                {/* Custom Color Picker */}
                <div className="relative">
                   <div className="w-10 h-10 rounded-full border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 flex items-center justify-center cursor-pointer overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 opacity-50 pointer-events-none" />
                      <Plus size={16} className="absolute text-gray-500 pointer-events-none" />
                      <input 
                        type="color" 
                        value={settings.accentColor} 
                        onChange={(e) => updateSettings({ accentColor: e.target.value })}
                        className="opacity-0 absolute inset-0 cursor-pointer w-full h-full z-10"
                      />
                   </div>
                </div>
             </div>
          </div>

          {/* Currency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Currency
            </label>
            <div className="grid grid-cols-5 gap-2">
              {currencies.map((currency) => (
                <button
                  key={currency}
                  onClick={() => updateSettings({ currency })}
                  className={clsx(
                    "px-4 py-2 rounded-lg font-medium text-sm transition-all",
                    settings.currency === currency
                      ? "bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/25"
                      : "bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700"
                  )}
                >
                  {currency}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Current symbol: {getCurrencySymbol()}
            </p>
          </div>
        </div>

        {/* Tax Settings */}
        <div className="p-6 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Calculator size={20} className="text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tax Calculation</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cost Basis Method
            </label>
            <div className="flex gap-2">
              {taxMethods.map((method) => (
                <button
                  key={method}
                  onClick={() => updateSettings({ taxMethod: method })}
                  className={clsx(
                    "flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-all",
                    settings.taxMethod === method
                      ? "bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/25"
                      : "bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700"
                  )}
                >
                  {method}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {settings.taxMethod === "FIFO" && "First In, First Out - Sell oldest assets first"}
              {settings.taxMethod === "LIFO" && "Last In, First Out - Sell newest assets first"}
              {settings.taxMethod === "Average" && "Average Cost - Use average purchase price"}
            </p>
          </div>
        </div>

        {/* Network Settings */}
        <div className="p-6 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Globe size={20} className="text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Network</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sui Network
            </label>
            <div className="space-y-2">
              {networks.map((network) => (
                <button
                  key={network.value}
                  onClick={() => {
                    updateSettings({ network: network.value });
                    // Reload page to apply network change
                    window.location.reload();
                  }}
                  className={clsx(
                    "w-full px-4 py-3 rounded-lg font-medium text-sm transition-all text-left",
                    settings.network === network.value
                      ? "bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/25"
                      : "bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700"
                  )}
                >
                  <div className="font-semibold">{network.label}</div>
                  <div className={clsx(
                    "text-xs mt-0.5",
                    settings.network === network.value ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
                  )}>
                    {network.description}
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-2 flex items-start gap-1">
              <span>⚠️</span>
              <span>Changing network will reload the page</span>
            </p>
          </div>
        </div>

        {/* Profile Settings */}
        <div className="p-6 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign size={20} className="text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Profile</h3>
          </div>
          {/* ... existing profile code ... */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Show Suins Profile
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Display Suins name and avatar in header
              </p>
            </div>
            <button
              onClick={() => updateSettings({ showSuinsProfile: !settings.showSuinsProfile })}
              className={clsx(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                settings.showSuinsProfile ? "bg-[var(--accent)]" : "bg-gray-300 dark:bg-zinc-700"
              )}
            >
              <span
                className={clsx(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                  settings.showSuinsProfile ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
          </div>
        </div>

        {/* Watch-only Wallets */}
        <div className="p-6 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Wallet size={20} className="text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Watch-only Wallets</h3>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Add other wallet addresses to view their assets combined with yours.
            </p>

            {/* List */}
            {settings.watchedWallets.length > 0 && (
              <div className="space-y-2">
                {settings.watchedWallets.map((wallet) => (
                  <div key={wallet} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border border-gray-200 dark:border-zinc-700/50">
                     <span className="font-mono text-sm text-gray-700 dark:text-gray-300 truncate mr-2">
                       {wallet}
                     </span>
                     <button
                        onClick={() => updateSettings({ watchedWallets: settings.watchedWallets.filter(w => w !== wallet) })}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Remove wallet"
                     >
                       <Trash2 size={16} />
                     </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New */}
            <div className="flex gap-2">
               <div className="flex-1">
                 <WatchedWalletInput 
                   onAdd={(address) => {
                     if (settings.watchedWallets.includes(address)) return;
                     updateSettings({ watchedWallets: [...settings.watchedWallets, address] });
                   }} 
                 />
               </div>
            </div>
          </div>
        </div>

        {/* Data Sync Settings */}
        <DataSyncSection />

      </div>
    </div>
  );
}

function DataSyncSection() {
    const { backupMetadata, restoreMetadata } = useTransactionMetadata();
    const { addNotification } = useNotifications();
    const { mutateAsync: signPersonalMessage } = useSignPersonalMessage();
    const currentAccount = useCurrentAccount();
    const [backupId, setBackupId] = useState<string | null>(null);
    const [restoreId, setRestoreId] = useState("");
    const [sealPassword, setSealPassword] = useState("");
    const [isBackingUp, setIsBackingUp] = useState(false);
    const [isRestoring, setIsRestoring] = useState(false);

    const getKeyMaterial = async (action: "backup" | "restore") => {
        if (sealPassword.trim()) {
            console.log(`[Seal] Using Manual Password for ${action}`);
            return { signature: sealPassword.trim(), isPassword: true };
        }
        
        // Fallback to Wallet Signature
        const message = new TextEncoder().encode("Sign this message to authenticate and process your Seal Backup.");
        const signature = await signPersonalMessage({ message });
        return { signature: signature.signature, isPassword: false };
    };

    const handleBackup = async () => {
        setIsBackingUp(true);
        try {
            // 1. Get Encryption Key (Password or Signature)
            const { signature, isPassword } = await getKeyMaterial("backup");
            
            // Debug: Show verification fingerprint
            const fingerprint = signature.slice(0, 8) + "...";
            console.log("[Seal] Key Fingerprint:", fingerprint);

            // 2. Perform backup with encryption
            const id = await backupMetadata(signature);
            setBackupId(id);
            addNotification("success", `Encrypted! ${isPassword ? "Password used." : `Wallet Key: ${fingerprint}`}`, "Sealed Backup Created");
        } catch (e: any) {
            console.error(e);
            
            const msg = e.message || "";
            if (msg.includes("Rejected") || msg.includes("Cancel")) {
                addNotification("error", "Signature request cancelled.", "Backup Cancelled");
            } else {
                addNotification("error", `Error: ${msg.slice(0, 50)}...`, "Backup Failed");
            }
        } finally {
            setIsBackingUp(false);
        }
    };

    const handleRestore = async () => {
        const cleanId = restoreId.trim();
        if (!cleanId) return;
        
        setIsRestoring(true);
        let fingerprint = "Unknown";
        let usedPassword = false;
        
        try {
            // 1. Get Decryption Key
            const { signature, isPassword } = await getKeyMaterial("restore");
            usedPassword = isPassword;
            fingerprint = signature.slice(0, 8) + "...";

            // 2. Restore with decryption
            const success = await restoreMetadata(cleanId, signature);
            if (success) {
                 addNotification("success", `Restored!`, "Restore Complete");
                 setRestoreId("");
            } else {
                 throw new Error("Restore returned false");
            }
        } catch (e: any) {
            console.error(e);
            const msg = e.message || "";
            
            if (msg.includes("Walrus read failed") || msg.includes("404")) {
                 addNotification("error", "Blob ID not found. Check input.", "Download Failed");
            } else if (msg.includes("decrypt") || msg.includes("padding") || msg.includes("Key mismatch")) {
                 const addr = currentAccount?.address ? `${currentAccount.address.slice(0,6)}...` : "Unknown";
                 const keyType = usedPassword ? "Password" : "Wallet Key";
                 addNotification("error", `Key mismatch! Used ${keyType}: ${fingerprint}. Address: ${addr}`, "Decryption Failed");
            } else {
                 addNotification("error", `Failed: ${msg.slice(0, 40)}...`, "Restore Failed");
            }
        } finally {
            setIsRestoring(false);
        }
    };

    return (
        <div className="p-6 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Database size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Seal Data Sync</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Encrypted decentralized backup on Walrus</p>
            </div>
          </div>
          
          <div className="space-y-6">
              {/* Optional Password Input */}
              <div className="bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded-lg border border-yellow-100 dark:border-yellow-900/30">
                  <label className="block text-xs font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                      Cross-Device Password (Recommended)
                  </label>
                  <input 
                    type="password"
                    value={sealPassword}
                    onChange={(e) => setSealPassword(e.target.value)}
                    placeholder="Enter a secret password..."
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 rounded border border-yellow-200 dark:border-yellow-800 focus:outline-none focus:border-yellow-500"
                  />
                  <p className="text-[10px] text-yellow-700 dark:text-yellow-400 mt-1">
                      If set, this password will be used to encrypt/decrypt instead of your wallet signature. Use this if you have issues restoring on other devices.
                  </p>
              </div>

              {/* Backup */}
              <div className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-xl border border-gray-200 dark:border-zinc-700/50">
                  <div className="flex items-start justify-between mb-4">
                      <div>
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                              <UploadCloud size={16} className="text-blue-500" /> Seal & Backup
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Encrypt settings and save to Walrus.
                          </p>
                      </div>
                  </div>
                  
                  {backupId ? (
                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 rounded-lg p-3 animate-in fade-in slide-in-from-top-2">
                          <p className="text-xs text-green-700 dark:text-green-300 font-medium mb-1">Sealed Backup ID (Save this!):</p>
                          <div className="flex items-center gap-2">
                              <code className="text-xs bg-white dark:bg-zinc-900 px-2 py-1 rounded border border-green-200 dark:border-green-800/50 flex-1 truncate font-mono text-gray-700 dark:text-gray-300 select-all">
                                  {backupId}
                              </code>
                              <button 
                                onClick={() => {
                                    navigator.clipboard.writeText(backupId);
                                    addNotification("success", "ID copied to clipboard", "Copied");
                                }}
                                className="p-1.5 hover:bg-green-200 dark:hover:bg-green-800 rounded text-green-700 dark:text-green-300"
                              >
                                  <Copy size={14} />
                              </button>
                          </div>
                      </div>
                  ) : (
                      <button 
                        onClick={handleBackup}
                        disabled={isBackingUp}
                        className="w-full py-2 bg-[var(--accent)] hover:opacity-90 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                      >
                          {isBackingUp ? (
                              <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Sealing...
                              </>
                          ) : (
                              <>
                                <UploadCloud size={16} />
                                {sealPassword ? "Seal with Password" : "Seal with Wallet"}
                              </>
                          )}
                      </button>
                  )}
              </div>

              {/* Restore */}
              <div className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-xl border border-gray-200 dark:border-zinc-700/50">
                  <div className="flex items-start justify-between mb-4">
                      <div>
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                              <DownloadCloud size={16} className="text-purple-500" /> Unseal & Restore
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Decrypt and restore data using your wallet signature.
                          </p>
                      </div>
                  </div>
                  
                  <div className="flex gap-2">
                      <input 
                        value={restoreId}
                        onChange={(e) => setRestoreId(e.target.value)}
                        placeholder="Enter Sealed Blob ID..."
                        className="flex-1 px-3 py-2 text-sm bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 rounded-lg border border-gray-200 dark:border-zinc-700 focus:outline-none focus:border-blue-500"
                      />
                      <button 
                        onClick={handleRestore}
                        disabled={isRestoring || !restoreId}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                      >
                          {isRestoring ? (
                              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                              <DownloadCloud size={16} />
                          )}
                          Restore
                      </button>
                  </div>
              </div>
          </div>
      </div>
    );
}

function WatchedWalletInput({ onAdd }: { onAdd: (address: string) => void }) {
  const [input, setInput] = useState("");

  const handleAdd = () => {
    if (!input.trim().startsWith("0x") || input.trim().length < 50) {
      if (!input.includes("0x")) return; 
    }
    onAdd(input.trim());
    setInput("");
  };

  return (
    <div className="flex gap-2">
      <input 
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter 0x... address"
        className="flex-1 px-3 py-2 text-sm bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 rounded-lg border border-gray-200 dark:border-zinc-700 focus:outline-none focus:border-blue-500"
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
      />
      <button 
        onClick={handleAdd}
        disabled={!input}
        className="px-3 py-2 bg-[var(--accent)] hover:opacity-90 disabled:opacity-50 text-white rounded-lg transition-colors"
      >
        <Plus size={20} />
      </button>
    </div>
  );
}
