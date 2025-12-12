"use client";

import { motion } from "framer-motion";
import { ConnectButton } from "@mysten/dapp-kit";
import { ArrowRight, BarChart3, Wallet } from "lucide-react";
import { useState, useEffect } from "react";

export function HeroSection() {
  const [effects, setEffects] = useState<any[]>([]);

  useEffect(() => {
    // Generate random values only on client-side to prevent hydration mismatch
    const generatedEffects = [...Array(20)].map((_, i) => ({
      id: i,
      initial: {
        x: Math.random() * 100 + "vw",
        y: Math.random() * 100 + "vh",
        scale: Math.random() * 0.5 + 0.5,
        opacity: Math.random() * 0.3,
      },
      animate: {
        y: [null, Math.random() * -100 + "vh"],
      },
      transition: {
        duration: Math.random() * 10 + 20,
        repeat: Infinity,
        ease: "linear",
      },
      style: {
        width: Math.random() * 200 + 50 + "px",
        height: Math.random() * 200 + 50 + "px",
      }
    }));
    setEffects(generatedEffects);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden pt-20 pb-32 bg-white dark:bg-zinc-950">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-100 via-white to-white dark:from-blue-900/20 dark:via-zinc-950 dark:to-zinc-950 -z-10" />
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-20">
         {effects.map((effect) => (
            <motion.div
              key={effect.id}
              className="absolute bg-blue-500/20 dark:bg-blue-500 rounded-full blur-xl"
              initial={effect.initial}
              animate={effect.animate}
              transition={effect.transition}
              style={effect.style}
            />
         ))}
      </div>

      <div className="container pt-[5rem] px-4 mx-auto text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 text-sm mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Live on Sui Mainnet
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white tracking-tight mb-6">
            Master Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 dark:from-blue-400 dark:to-teal-400">Sui Portfolio</span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Privacy-first tracking, powerful analytics, and seamless DeFi integration. 
            All your wallets, one dashboard.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
              <div className="relative bg-white dark:bg-zinc-950 rounded-xl p-1">
                 {/* Wrapper to style the Connect Button */}
                 <ConnectButton className="!bg-blue-600 !text-white !font-bold !px-8 !py-4 !rounded-lg !h-auto !text-lg hover:!bg-blue-700 transition-colors shadow-lg" />
              </div>
            </div>
            
            {/* <button className="px-8 py-4 rounded-xl bg-gray-100 dark:bg-zinc-900 text-gray-900 dark:text-white font-medium border border-gray-200 dark:border-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors flex items-center gap-2">
              Explore Demo <ArrowRight size={18} />
            </button> */}
          </div>
        </motion.div>

        {/* Dashboard Preview Mock */}
        <motion.div
          initial={{ opacity: 0, y: 40, rotateX: 20 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-20 relative mx-auto max-w-5xl px-4"
          style={{ perspective: "1000px" }}
        >
          <div className="relative rounded-3xl border border-gray-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl shadow-2xl overflow-hidden transform-gpu p-6 md:p-8 text-left">
             
             {/* Mock Header */}
             <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                   <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">Flow</div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">0x...8a2f</span>
                </div>
             </div>

             {/* Net Worth Card */}
             <div className="p-8 mb-8 rounded-3xl bg-gradient-to-br from-blue-600/10 to-teal-400/10 border border-blue-500/20">
                <div className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Total Net Worth</div>
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                   $155,420.50
                </div>
             </div>

             {/* Asset List Mock */}
             <div className="space-y-4">
                <div className="flex items-center justify-between px-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
                   <span>Asset</span>
                   <span>Balance</span>
                </div>
                
                {[
                  { name: "Sui", symbol: "SUI", price: "$3.42", balance: "25,000 SUI", value: "$85,500.00", color: "bg-blue-500" },
                  { name: "USD Coin", symbol: "USDC", price: "$1.00", balance: "42,500 USDC", value: "$42,500.00", color: "bg-green-500" },
                  { name: "Cetus", symbol: "CETUS", price: "$0.15", balance: "182,000 CETUS", value: "$27,300.00", color: "bg-teal-500" },
                ].map((asset, i) => (
                   <div key={asset.symbol} className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-zinc-800">
                      <div className="flex items-center gap-3">
                         <div className={`w-10 h-10 rounded-full ${asset.color} flex items-center justify-center text-white font-bold text-xs`}>
                            {asset.symbol[0]}
                         </div>
                         <div>
                            <div className="font-semibold text-gray-900 dark:text-white">{asset.name}</div>
                            <div className="text-sm text-gray-500">{asset.price}</div>
                         </div>
                      </div>
                      <div className="text-right">
                         <div className="font-medium text-gray-900 dark:text-white">{asset.value}</div>
                         <div className="text-sm text-gray-500">{asset.balance}</div>
                      </div>
                   </div>
                ))}
             </div>

          </div>
          
          {/* Glow Behind */}
          <div className="absolute -inset-4 bg-blue-500/10 dark:bg-blue-500/20 blur-3xl -z-10 rounded-[3rem]" />
        </motion.div>
      </div>
    </section>
  );
}
