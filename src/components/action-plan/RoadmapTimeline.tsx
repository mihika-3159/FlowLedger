'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Clock, Zap } from 'lucide-react';
import type { ActionItem } from '@/lib/types';

interface Props {
  items: ActionItem[];
}

export function RoadmapTimeline({ items }: Props) {
  const phases = [
    { id: 'quick_win', label: 'Quick Wins', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { id: 'medium_term', label: 'Medium Term', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { id: 'strategic', label: 'Strategic', color: 'text-violet-400', bg: 'bg-violet-500/10' },
  ];

  return (
    <div className="relative space-y-12 before:absolute before:left-[17px] before:top-2 before:h-[calc(100%-16px)] before:w-px before:bg-white/[0.06]">
      {phases.map((phase, pIdx) => {
        const phaseItems = items.filter(item => item.phase === phase.id);
        if (phaseItems.length === 0) return null;

        return (
          <div key={phase.id} className="relative pl-10 space-y-6">
            <div className="absolute left-0 top-1.5 h-9 w-9 rounded-full bg-[#07070b] border border-white/10 flex items-center justify-center z-10">
              <Zap className={`h-4 w-4 ${phase.color}`} />
            </div>
            
            <div>
              <h3 className={`text-sm font-bold uppercase tracking-widest ${phase.color} mb-1`}>{phase.label}</h3>
              <p className="text-[10px] text-white/20 font-medium">ESTIMATED IMPACT: ${(phaseItems.reduce((acc, i) => acc + i.estimatedSavingsPerWeek, 0) * 52).toLocaleString()} / YEAR</p>
            </div>

            <div className="grid gap-4">
              {phaseItems.map((item, iIdx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: iIdx * 0.1 }}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 group hover:bg-white/[0.04] transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">{item.title}</span>
                        {item.status === 'completed' && <CheckCircle2 className="h-3 w-3 text-emerald-400" />}
                      </div>
                      <p className="text-[11px] text-white/40 leading-relaxed">{item.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[10px] font-bold text-emerald-400">+${(item.estimatedSavingsPerWeek * 52).toLocaleString()}</p>
                      <div className="flex items-center gap-1 text-[9px] text-white/20 mt-1 justify-end">
                        <Clock className="h-2.5 w-2.5" />
                        <span>By {new Date(item.deadline).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
