"use client";

import { useSettings, Currency, Theme, TaxMethod, Network } from "@/contexts/SettingsContext";
import { Settings as SettingsIcon, Palette, DollarSign, Calculator, Globe } from "lucide-react";
import clsx from "clsx";

export function Settings() {
  const { settings, updateSettings, getCurrencySymbol } = useSettings();

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
      <div className="flex items-center gap-3">
        <SettingsIcon className="text-blue-600 dark:text-blue-400" size={28} />
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Customize your Sui Flow experience</p>
        </div>
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
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                      : "bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700"
                  )}
                >
                  {theme.label}
                </button>
              ))}
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
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
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
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
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
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
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
                settings.showSuinsProfile ? "bg-blue-600" : "bg-gray-300 dark:bg-zinc-700"
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
      </div>
    </div>
  );
}
