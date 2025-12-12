"use client";

import { motion } from "framer-motion";
import { X, Check } from "lucide-react";

export function ProblemSolutionSection() {
  return (
    <section className="py-32 bg-white dark:bg-zinc-950 relative overflow-hidden">
      <div className="container px-4 mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">Stop Tracking in the Dark</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Spreadsheets are messy. Manual tracking is painful. See the difference.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          
          {/* The Problem */}
          <motion.div 
             initial={{ opacity: 0, x: -50 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-3xl p-8 backdrop-blur-sm"
          >
             <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600 dark:text-red-500">
                   <X size={24} />
                </div>
                <h3 className="text-2xl font-bold text-red-800 dark:text-red-200">The Old Way</h3>
             </div>
             
             <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-red-700 dark:text-red-200/70">
                   <X size={16} className="shrink-0" /> Endless spreadsheets & broken formulas
                </li>
                <li className="flex items-center gap-3 text-red-700 dark:text-red-200/70">
                   <X size={16} className="shrink-0" /> Manually checking 10+ DeFi protocols
                </li>
                <li className="flex items-center gap-3 text-red-700 dark:text-red-200/70">
                   <X size={16} className="shrink-0" /> Panic during tax season
                </li>
             </ul>

             {/* Messy Spreadsheet Mock */}
             <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 opacity-75 dark:opacity-50 border border-red-200 dark:border-red-900/20 font-mono text-xs overflow-hidden shadow-inner">
                <div className="grid grid-cols-4 gap-2 text-gray-500 mb-2 border-b border-gray-200 dark:border-gray-800 pb-2">
                   <div>Date</div><div>Type</div><div>Amt</div><div>???</div>
                </div>
                {[1,2,3,4,5].map(i => (
                   <div key={i} className="grid grid-cols-4 gap-2 text-gray-600 py-1">
                      <div>2024-0{i}</div><div>SUI</div><div>100.{i}</div><div>ERROR</div>
                   </div>
                ))}
             </div>
          </motion.div>

          {/* The Solution */}
          <motion.div 
             initial={{ opacity: 0, x: 50 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden group"
          >
             <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors duration-500" />
             
             <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-500 rounded-lg text-white shadow-lg shadow-blue-500/30">
                       <Check size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Flow</h3>
                </div>
                
                <ul className="space-y-4 mb-8">
                    <li className="flex items-center gap-3 text-blue-900 dark:text-blue-100">
                    <Check size={16} className="text-blue-500 dark:text-blue-400 shrink-0" /> Auto-syncs wallet & DeFi positions
                    </li>
                    <li className="flex items-center gap-3 text-blue-900 dark:text-blue-100">
                    <Check size={16} className="text-blue-500 dark:text-blue-400 shrink-0" /> Real-time Net Worth tracking
                    </li>
                    <li className="flex items-center gap-3 text-blue-900 dark:text-blue-100">
                    <Check size={16} className="text-blue-500 dark:text-blue-400 shrink-0" /> Tax-ready CSV exports
                    </li>
                </ul>

                {/* Clean Dashboard Mock */}
                <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-blue-500/20 relative shadow-2xl">
                    <div className="flex justify-between items-end mb-4">
                       <div>
                          <div className="text-xs text-blue-600 dark:text-blue-400 mb-1">Total Balance</div>
                          <div className="text-xl font-bold text-gray-900 dark:text-white">$124,592.00</div>
                       </div>
                       <div className="text-green-600 dark:text-green-400 text-xs bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">+12.5%</div>
                    </div>
                    <div className="h-1 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                       <div className="h-full w-2/3 bg-blue-500 rounded-full" />
                    </div>
                </div>
             </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
