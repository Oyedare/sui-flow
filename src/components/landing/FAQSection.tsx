"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";

export function FAQSection() {
  const faqs = [
    {
       q: "Is my wallet safe?",
       a: "Yes. Flow is a non-custodial application. We never have access to your private keys or funds. We simply read on-chain data to display your portfolio."
    },
    {
       q: "How accurate are the tax calculations?",
       a: "We use standard FIFO (First-In, First-Out), LIFO, and Average Cost basis methods. While we strive for 100% accuracy using historical price data, we always recommend reviewing your reports with a certified tax professional."
    },
    {
       q: "Can I export my data?",
       a: "Absolutely. You can export your entire transaction history and capital gains reports as CSV files at any time."
    },
    {
       q: "What is Walrus and why do you use it?",
       a: "Walrus is a decentralized storage protocol on Sui. We use it to let you save your custom transaction notes and labels encrypted on the blockchain, so you don't need a centralized login to keep your data."
    },
    {
       q: "Do you support all Sui wallets?",
       a: "We support any wallet compatible with the Sui Wallet Standard, including Slush, Suiet, Ethos, and Nightly."
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-32 bg-white dark:bg-zinc-950 border-t border-gray-200 dark:border-zinc-800/50">
       <div className="container px-4 mx-auto max-w-3xl">
          <div className="text-center mb-16">
             <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
             <p className="text-xl text-gray-600 dark:text-gray-400">
                Have questions? We're here to help.
             </p>
          </div>

          <div className="space-y-4">
             {faqs.map((faq, i) => (
                <div key={i} className="border border-gray-200 dark:border-zinc-800 rounded-2xl bg-gray-50 dark:bg-zinc-900/30 overflow-hidden">
                   <button 
                     onClick={() => setOpenIndex(openIndex === i ? null : i)}
                     className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-100 dark:hover:bg-zinc-800/50 transition-colors"
                   >
                      <span className="text-lg font-medium text-gray-900 dark:text-white">{faq.q}</span>
                      {openIndex === i ? <Minus className="text-blue-500" /> : <Plus className="text-gray-500" />}
                   </button>
                   <AnimatePresence>
                      {openIndex === i && (
                         <motion.div 
                           initial={{ height: 0, opacity: 0 }}
                           animate={{ height: "auto", opacity: 1 }}
                           exit={{ height: 0, opacity: 0 }}
                           className="overflow-hidden"
                         >
                            <div className="p-6 pt-0 text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-200 dark:border-zinc-800/50">
                               {faq.a}
                            </div>
                         </motion.div>
                      )}
                   </AnimatePresence>
                </div>
             ))}
          </div>
       </div>
    </section>
  );
}
