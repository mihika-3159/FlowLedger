'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] items-center justify-center space-y-4">
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 180, 360]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20"
      >
        <Sparkles className="h-8 w-8 text-indigo-400" />
      </motion.div>
      <div className="space-y-2 text-center">
        <h3 className="text-sm font-bold text-white uppercase tracking-widest animate-pulse">Syncing Insights</h3>
        <p className="text-[10px] text-white/20 font-medium">OPTIMIZING WORKFLOW INTELLIGENCE</p>
      </div>
    </div>
  );
}
