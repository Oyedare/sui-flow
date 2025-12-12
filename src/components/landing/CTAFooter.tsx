"use client";

import { ConnectButton } from "@mysten/dapp-kit";
import { Github } from "lucide-react";

export function CTAFooter() {
  return (
    <footer className="bg-white dark:bg-zinc-950 border-t border-gray-200 dark:border-zinc-800 pt-32 pb-12 relative overflow-hidden">
       {/* Background Glow */}
       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-blue-600/5 dark:bg-blue-600/10 blur-[100px] -z-10 rounded-full" />

       <div className="container px-4 mx-auto">
          
          {/* Final CTA */}
          <div className="text-center mb-32">
             <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight">
                Ready to take control?
             </h2>
             <p className="text-xl text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-12">
                Join 10,000+ users tracking their Sui portfolio with privacy and precision.
             </p>
             <div className="flex justify-center">
                <div className="relative group">
                   <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-200" />
                   <div className="relative bg-white dark:bg-zinc-950 rounded-xl p-1">
                      <ConnectButton className="!bg-blue-600 !text-white !font-bold !px-10 !py-4 !rounded-lg !h-auto !text-lg hover:!bg-blue-700 transition-colors" />
                   </div>
                </div>
             </div>
             <p className="text-sm text-gray-500 mt-6">No credit card required. Free forever for personal use.</p>
          </div>

          {/* Footer Grid */}
          <div className="grid md:grid-cols-4 gap-12 border-t border-gray-200 dark:border-zinc-800 pt-12">
             <div className="col-span-2">
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 dark:from-blue-500 dark:to-teal-400 bg-clip-text text-transparent mb-4">Flow</div>
                <p className="text-gray-500 max-w-sm mb-6">
                   The privacy-first portfolio tracker for the Sui ecosystem. Built with ❤️ for the community.
                </p>
                <div className="flex gap-4">
                   <a href="https://x.com/_stephentony_" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 dark:bg-zinc-900 rounded-lg text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white transition-colors">
                      <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-current">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                      </svg>
                   </a>
                   <a href="https://github.com/Oyedare/sui-flow" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 dark:bg-zinc-900 rounded-lg text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white transition-colors"><Github size={20} /></a>
                </div>
             </div>
             
             <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Product</h4>
                <ul className="space-y-3 text-gray-500">
                   <li className="hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer transition-colors">Features</li>
                   <li className="hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer transition-colors">Pricing</li>
                   <li className="hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer transition-colors">Roadmap</li>
                   <li className="hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer transition-colors">Changelog</li>
                </ul>
             </div>

             <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Resources</h4>
                <ul className="space-y-3 text-gray-500">
                   <li className="hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer transition-colors">Documentation</li>
                   <li className="hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer transition-colors">API Reference</li>
                   <li className="hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer transition-colors">Support</li>
                   <li className="hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer transition-colors">Terms of Service</li>
                </ul>
             </div>
          </div>
          
          <div className="text-center text-gray-400 dark:text-zinc-800 mt-20 text-sm font-mono hover:text-gray-600 dark:hover:text-zinc-700 transition-colors cursor-default">
             SUI-FLOW-2025
          </div>
       </div>
    </footer>
  );
}
