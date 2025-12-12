"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function TrustSection() {
  const stats = [
    { label: "Tracked Value", value: "$100M+" },
    { label: "Active Wallets", value: "10,000+" },
    { label: "Tax Reports", value: "2,000+" },
  ];

  const partners = [
    { name: "Sui", color: "text-blue-400" },
    { name: "Walrus", color: "text-orange-400" },
    { name: "Pyth", color: "text-purple-400" },
    { name: "Navi", color: "text-teal-400" },
    { name: "Cetus", color: "text-cyan-400" },
    { name: "Scallop", color: "text-indigo-400" },
  ];

  return (
    <section className="py-20 border-y border-gray-200 dark:border-zinc-800/50 bg-gray-50/50 dark:bg-zinc-950/50 backdrop-blur-sm">
      <div className="container px-4 mx-auto">
        
        {/* Stats Ticker */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-16 border-b border-gray-200 dark:border-zinc-800/50 pb-12">
          {stats.map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Integration Logos */}
        <div className="text-center">
           <p className="text-sm text-gray-500 mb-10 uppercase tracking-widest font-medium">Powering the Next Gen of Sui DeFi</p>
           
           <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20">
              {/* Sui */}
              <div className="group flex flex-col items-center gap-2 transition-all cursor-pointer">
                 <img src="/assets/logos/sui.svg" alt="Sui" className="h-10 w-auto dark:invert-0" />
                 <span className="text-xs font-medium text-gray-400 group-hover:text-blue-500 transition-colors">Sui</span>
              </div>

              {/* Walrus (Database icon fallback) */}
              <div className="group flex flex-col items-center gap-2 transition-all cursor-pointer">
                 <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-900/20 text-orange-600 group-hover:scale-110 transition-transform">
                  <img src="/assets/logos/walrus-logo.jpg" alt="Walrus" className="h-10 w-auto" />
                 </div>
                 <span className="text-xs font-medium text-gray-400 group-hover:text-orange-500 transition-colors">Walrus</span>
              </div>

              {/* Pyth */}
              <div className="group flex flex-col items-center gap-2 transition-all cursor-pointer">
                 <img src="/assets/logos/pyth.svg" alt="Pyth" className="h-10 w-auto" />
                 <span className="text-xs font-medium text-gray-400 group-hover:text-purple-500 transition-colors">Pyth</span>
              </div>

              {/* Navi (Navigation icon fallback) */}
              {/* <div className="group flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-all cursor-pointer">
                 <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-teal-100 dark:bg-teal-900/20 text-teal-600 group-hover:scale-110 transition-transform">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
                 </div>
                 <span className="text-xs font-medium text-gray-400 group-hover:text-teal-500 transition-colors">Navi</span>
              </div> */}

              {/* Cetus */}
              {/* <div className="group flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-all cursor-pointer">
                 <img src="/assets/logos/cetus.svg" alt="Cetus" className="h-10 w-auto" />
                 <span className="text-xs font-medium text-gray-400 group-hover:text-cyan-500 transition-colors">Cetus</span>
              </div> */}

              {/* Scallop (Disc/Shell icon fallback) */}
              {/* <div className="group flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-all cursor-pointer">
                 <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 group-hover:scale-110 transition-transform">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M12 2v20"/></svg>
                 </div>
                 <span className="text-xs font-medium text-gray-400 group-hover:text-indigo-500 transition-colors">Scallop</span>
              </div> */}

              {/* Nautilus (Shell/Aperture icon fallback) */}
              {/* <div className="group flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-all cursor-pointer">
                 <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/20 text-blue-600 group-hover:scale-110 transition-transform">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="14.31" y1="8" x2="20.05" y2="17.94"/><line x1="9.69" y1="8" x2="21.17" y2="8"/><line x1="7.38" y1="12" x2="13.12" y2="2.06"/><line x1="9.69" y1="16" x2="3.95" y2="6.06"/><line x1="14.31" y1="16" x2="2.83" y2="16"/><line x1="16.62" y1="12" x2="10.88" y2="21.94"/></svg>
                 </div>
                 <span className="text-xs font-medium text-gray-400 group-hover:text-blue-500 transition-colors">Nautilus</span>
              </div> */}

              {/* SuiNS (AtSign icon fallback) */}
              <div className="group flex flex-col items-center gap-2 transition-all cursor-pointer">
                 <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white group-hover:scale-110 transition-transform">
                  <img src="/assets/logos/suins-logo.png" alt="" />
                 </div>
                 <span className="text-xs font-medium text-gray-400 group-hover:text-blue-900 transition-colors">SuiNS</span>
              </div>
           </div>
        </div>

      </div>
    </section>
  );
}
