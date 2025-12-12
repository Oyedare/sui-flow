"use client";

import { motion } from "framer-motion";
import { 
  PieChart, 
  ArrowRightLeft, 
  Coins, 
  FileText, 
  Ghost, 
  Wallet,
  LucideIcon
} from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay: number;
}

function FeatureCard({ icon: Icon, title, description, delay }: FeatureCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      viewport={{ once: true }}
      className="p-6 rounded-2xl bg-white dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 hover:border-blue-500/50 hover:bg-gray-50 dark:hover:bg-zinc-800/80 transition-all duration-300 group shadow-sm"
    >
      <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-zinc-800 group-hover:bg-blue-500/20 flex items-center justify-center mb-4 transition-colors">
        <Icon className="text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" size={24} />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-100 transition-colors">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}

export function FeaturesGrid() {
  const features = [
    {
      icon: PieChart,
      title: "Portfolio Dashboard",
      description: "Visualize your asset allocation and net worth evolution across timeframes."
    },
    {
      icon: FileText,
      title: "Auto Tax Reports",
      description: "Generate FIFO/LIFO tax reports ready for your accountant in one click."
    },
    {
      icon: Coins,
      title: "DeFi Tracking",
      description: "Deep integration with Navi, Cetus, and Scallop to track your yield positions."
    },
    {
      icon: ArrowRightLeft,
      title: "Cash Flow Analytics",
      description: "Understand your spending habits with detailed In/Out flow analysis."
    },
    {
      icon: Ghost,
      title: "Privacy First",
      description: "Your metadata is stored on Walrus decentralized storage, not our servers."
    },
    {
      icon: Wallet,
      title: "Multi-Wallet Watch",
      description: "Add cold wallets or watched addresses to see your total aggregated net worth."
    }
  ];

  return (
    <section id="features" className="py-32 bg-gray-50 dark:bg-zinc-950">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">Everything You Need</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Powerful features designed for the modern Sui investor.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <FeatureCard key={i} {...f} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}
