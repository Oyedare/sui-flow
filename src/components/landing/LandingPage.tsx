"use client";

import { CTAFooter } from "./CTAFooter";
import { FAQSection } from "./FAQSection";
import { FeaturesGrid } from "./FeaturesGrid";
import { HeroSection } from "./HeroSection";
import { PricingSection } from "./PricingSection";
import { ProblemSolutionSection } from "./ProblemSolutionSection";
import { ScreenshotsSection } from "./ScreenshotsSection";
import { TrustSection } from "./TrustSection";
import { WalletButton } from "../WalletButton"; // Fallback/Hidden usage if needed

import { useSettings } from "@/contexts/SettingsContext";
import { Moon, Sun } from "lucide-react";

export function LandingPage() {
  const { settings, updateSettings } = useSettings();

  const toggleTheme = () => {
     const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
     updateSettings({ theme: nextTheme });
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 font-sans text-gray-900 dark:text-gray-100 overflow-x-hidden selection:bg-blue-500/30">
       <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800/50">
          <div className="container px-4 mx-auto h-16 flex items-center justify-between">
             <div className="text-xl font-bold bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
                Flow
             </div>
             <div>
                {/* Minimal Header CTA - we rely on Hero Connect but keeping nav if needed */}
                <nav className="flex items-center gap-6">
                   <div className="hidden md:flex gap-8 text-sm font-medium text-gray-600 dark:text-gray-400">
                      <a href="#features" className="hover:text-blue-600 dark:hover:text-white transition-colors">Features</a>
                      <a href="#pricing" className="hover:text-blue-600 dark:hover:text-white transition-colors">Pricing</a>
                      <a href="#faq" className="hover:text-blue-600 dark:hover:text-white transition-colors">FAQ</a>
                   </div>
                   
                   <button 
                     onClick={toggleTheme}
                     className="p-2 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                   >
                      {settings.theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                   </button>
                </nav>
             </div>
          </div>
       </header>

       <main>
          <HeroSection />
          <TrustSection />
          <ProblemSolutionSection />
          <FeaturesGrid />
          <ScreenshotsSection />
          <PricingSection />
          <FAQSection />
       </main>

       <CTAFooter />
    </div>
  );
}
