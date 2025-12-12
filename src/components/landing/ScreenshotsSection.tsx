"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function ScreenshotsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <section ref={containerRef} className="py-32 bg-white dark:bg-zinc-950 overflow-hidden">
       <div className="container px-4 mx-auto">
          <div className="text-center mb-20">
             <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">Built for Clarity</h2>
             <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                A user interface designed to make complex DeFi data simple and actionable.
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-[800px] md:h-[600px]">
             {/* Left Column - Analytics */}
             <motion.div style={{ y: y1 }} className="space-y-8">
                <div className="h-80 bg-gray-50 dark:bg-zinc-900 rounded-3xl border border-gray-200 dark:border-zinc-800 p-6 shadow-xl relative overflow-hidden flex flex-col">
                    <div className="text-sm font-semibold text-gray-500 mb-4 flex items-center gap-2">
                       <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                       </div>
                       Portfolio Analytics
                    </div>
                    {/* SVG Line Chart Mock */}
                    <div className="flex-1 w-full relative mt-4">
                       <svg className="w-full h-full" viewBox="0 0 300 150" preserveAspectRatio="none">
                          <defs>
                             <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                             </linearGradient>
                          </defs>
                          {/* Area Fill */}
                          <path 
                             d="M0,150 L0,100 C50,80 100,120 150,60 C200,20 250,80 300,40 L300,150 Z" 
                             fill="url(#chartGradient)" 
                          />
                          {/* Line Stroke */}
                          <path 
                             d="M0,100 C50,80 100,120 150,60 C200,20 250,80 300,40" 
                             fill="none" 
                             stroke="#3b82f6" 
                             strokeWidth="3" 
                             strokeLinecap="round" 
                             strokeLinejoin="round" 
                          />
                          {/* Data Point with Pulse */}
                          <circle cx="150" cy="60" r="4" fill="#3b82f6" className="animate-pulse" />
                       </svg>
                       
                       {/* Mock Tooltip */}
                       <div className="absolute top-[20%] left-[50%] transform -translate-x-1/2 -translate-y-[150%] bg-white dark:bg-zinc-800 p-2 rounded-lg shadow-lg border border-gray-100 dark:border-zinc-700 text-xs">
                          <div className="font-semibold text-gray-900 dark:text-white">$155,420</div>
                          <div className="text-green-500">+12%</div>
                       </div>
                    </div>
                </div>
                <div className="h-64 bg-gray-50 dark:bg-zinc-900 rounded-3xl border border-gray-200 dark:border-zinc-800 p-6 shadow-xl relative overflow-hidden">
                    <div className="text-sm font-semibold text-gray-500 mb-4">Asset Allocation</div>
                    {/* Mini Pie Chart Mock */}
                    <div className="flex items-center justify-center h-48 relative">
                       <div className="w-32 h-32 rounded-full border-[16px] border-blue-500 border-r-teal-400 border-b-indigo-500 rotate-45" />
                       <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-xs text-gray-500">Top Asset</span>
                          <span className="font-bold text-gray-900 dark:text-white">SUI</span>
                       </div>
                    </div>
                </div>
             </motion.div>

             {/* Middle Column - History & Transactions */}
             <motion.div style={{ y: y3 }} className="space-y-8 pt-12 md:pt-0">
                <div className="h-full bg-gray-50 dark:bg-zinc-900 rounded-3xl border border-gray-200 dark:border-zinc-800 p-6 shadow-xl relative overflow-hidden">
                    <div className="text-sm font-semibold text-gray-500 mb-4">Recent Activity</div>
                    <div className="space-y-4">
                        {[
                          { type: 'in', label: 'Receive', amount: '+500 SUI', time: '2m ago' },
                          { type: 'out', label: 'Send', amount: '-1,200 USDC', time: '1h ago' },
                          { type: 'swap', label: 'Swap', amount: 'SUI → CETUS', time: '3h ago' },
                          { type: 'in', label: 'Receive', amount: '+50 SUI', time: '1d ago' },
                        ].map((tx, i) => (
                            <div key={i} className="flex justify-between items-center border-b border-gray-200 dark:border-zinc-800/50 pb-4 last:border-0">
                               <div className="flex gap-3 items-center">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                     tx.type === 'in' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 
                                     tx.type === 'out' ? 'bg-red-100 dark:bg-red-900/30 text-red-600' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
                                  }`}>
                                     {tx.type === 'in' ? '↓' : tx.type === 'out' ? '↑' : '↔'}
                                  </div>
                                  <div>
                                     <div className="font-medium text-gray-900 dark:text-white text-sm">{tx.label}</div>
                                     <div className="text-xs text-gray-500">{tx.time}</div>
                                  </div>
                               </div>
                               <div className={`text-sm font-medium ${tx.type === 'in' ? 'text-green-600' : 'text-gray-900 dark:text-white'}`}>
                                  {tx.amount}
                               </div>
                            </div>
                        ))}
                    </div>
                </div>
             </motion.div>

             {/* Right Column - DeFi */}
             <motion.div style={{ y: y2 }} className="space-y-8">
                <div className="h-80 bg-gray-50 dark:bg-zinc-900 rounded-3xl border border-gray-200 dark:border-zinc-800 p-6 shadow-xl relative overflow-hidden">
                    <div className="text-sm font-semibold text-gray-500 mb-4">DeFi Positions</div>
                    {/* Staking Card Mock */}
                    <div className="bg-white dark:bg-zinc-950 rounded-xl p-4 border border-gray-200 dark:border-zinc-800 mb-4">
                       <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                             <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-[10px] text-white font-bold">S</div>
                             <span className="font-medium text-sm text-gray-900 dark:text-white">Sui Staking</span>
                          </div>
                          <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 px-2 py-0.5 rounded-full">APY 3.5%</span>
                       </div>
                       <div className="text-xl font-bold text-gray-900 dark:text-white mb-1">12,450 SUI</div>
                       <div className="text-xs text-gray-500">~ $42,330.00</div>
                    </div>
                    
                    {/* LP Card Mock */}
                    <div className="bg-white dark:bg-zinc-950 rounded-xl p-4 border border-gray-200 dark:border-zinc-800">
                       <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                             <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center text-[10px] text-white font-bold">C</div>
                             <span className="font-medium text-sm text-gray-900 dark:text-white">Cetus Pool</span>
                          </div>
                          <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 px-2 py-0.5 rounded-full">APR 12%</span>
                       </div>
                       <div className="text-xl font-bold text-gray-900 dark:text-white mb-1">SUI-USDC</div>
                       <div className="text-xs text-gray-500">Liquidity: $5,240.00</div>
                    </div>
                </div>
                
                <div className="h-64 bg-gray-50 dark:bg-zinc-900 rounded-3xl border border-gray-200 dark:border-zinc-800 p-6 shadow-xl relative overflow-hidden flex flex-col items-center justify-center text-center">
                     <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
                        <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                     </div>
                     <h4 className="font-bold text-gray-900 dark:text-white mb-2">Mobile Ready</h4>
                     <p className="text-sm text-gray-500">Track your portfolio on the go with fully responsive design.</p>
                </div>
             </motion.div>

          </div>
       </div>
    </section>
  );
}
