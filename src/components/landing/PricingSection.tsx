"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useState } from "react";

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
       name: "Starter",
       price: "Free",
       description: "Perfect for tracking your personal wallet.",
       features: ["Real-time Tracking", "1 Connected Wallet", "Basic History (30 Days)", "Public Community Support"],
       cta: "Start Free",
       primary: false
    },
    {
       name: "Pro",
       price: isAnnual ? "$0" : "$0",
       period: isAnnual ? "/year" : "/mo",
       description: "Advanced analytics for serious investors. (Currently Free)",
       features: ["Unlimited Wallets", "Full History Export", "Tax Reports (FIFO/LIFO)", "DeFi Position Analytics", "Priority Support"],
       cta: "Get Pro",
       primary: true
    },
    {
       name: "Whale",
       price: "Contact",
       description: "Custom solutions for funds and institutions.",
       features: ["API Access", "Custom Integrations", "Dedicated Account Manager", "White-label Options"],
       cta: "Contact Sales",
       primary: false
    }
  ];

  return (
    <section id="pricing" className="py-32 bg-gray-50 dark:bg-zinc-950 border-t border-gray-200 dark:border-zinc-800/50">
       <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
             <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">Simple Pricing</h2>
             <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
                Start for free, upgrade when you need more power.
             </p>
             
             {/* Toggle */}
             <div className="flex items-center justify-center gap-4">
                <span className={`text-sm ${!isAnnual ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>Monthly</span>
                <button 
                  onClick={() => setIsAnnual(!isAnnual)}
                  className="w-14 h-8 bg-gray-200 dark:bg-zinc-800 rounded-full relative p-1 transition-colors"
                >
                   <div className={`w-6 h-6 bg-blue-500 rounded-full transition-transform ${isAnnual ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
                <span className={`text-sm ${isAnnual ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>Annual <span className="text-green-600 dark:text-green-500 text-xs ml-1 font-medium">SAVE 20%</span></span>
             </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
             {plans.map((plan, i) => (
                <motion.div 
                   key={plan.name}
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.1 }}
                   viewport={{ once: true }}
                   className={`rounded-3xl p-8 border ${plan.primary ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-500/50 relative' : 'bg-white dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-800 shadow-sm'}`}
                >
                   {plan.primary && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                         MOST POPULAR
                      </div>
                   )}
                   
                   <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">{plan.name}</h3>
                      <div className="flex items-baseline gap-1">
                         <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                         {plan.price !== "Free" && plan.price !== "Contact" && <span className="text-gray-500">{plan.period}</span>}
                      </div>
                      <p className="text-sm text-gray-500 mt-4 h-10">{plan.description}</p>
                   </div>

                   <button className={`w-full py-3 rounded-xl font-medium mb-8 transition-colors ${plan.primary ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25' : 'bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-900 dark:text-white'}`}>
                      {plan.cta}
                   </button>
                   
                   <div className="space-y-4">
                      {plan.features.map(feat => (
                         <div key={feat} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                            <Check size={16} className="text-blue-500 shrink-0 mt-0.5" />
                            {feat}
                         </div>
                      ))}
                   </div>
                </motion.div>
             ))}
          </div>
       </div>
    </section>
  );
}
