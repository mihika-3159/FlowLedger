'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  Clock, 
  DollarSign, 
  ArrowRight, 
  Lightbulb,
  ShieldAlert,
  Zap
} from 'lucide-react';
import type { Bottleneck } from '@/lib/types';
import { BOTTLENECK_COLORS, BOTTLENECK_LABELS } from '@/lib/constants';

interface Props {
  bottleneck: Bottleneck;
  index: number;
}

export function BottleneckCard({ bottleneck, index }: Props) {
  const severityColor = bottleneck.severity >= 8 ? 'text-red-400' : bottleneck.severity >= 5 ? 'text-amber-400' : 'text-indigo-400';
  const severityBg = bottleneck.severity >= 8 ? 'bg-red-500/10' : bottleneck.severity >= 5 ? 'bg-amber-500/10' : 'bg-indigo-500/10';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="glass-card border-white/[0.06] bg-transparent hover:border-white/[0.1] transition-all overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: BOTTLENECK_COLORS[bottleneck.type] }} />
        
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="h-5 px-1.5 text-[10px] font-semibold uppercase tracking-widest border-white/10 bg-white/5 text-white/40">
                  {BOTTLENECK_LABELS[bottleneck.type]}
                </Badge>
                <div className={`flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${severityBg} ${severityColor}`}>
                  <ShieldAlert className="h-3 w-3" />
                  SEVERITY {bottleneck.severity}/10
                </div>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                {bottleneck.title}
              </h3>
              <p className="text-[11px] text-white/30 font-medium">Affected Step: {bottleneck.affectedStep}</p>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.03] text-white/20">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>

          <p className="text-sm text-white/50 leading-relaxed mb-6">
            {bottleneck.description}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="rounded-lg bg-white/[0.03] p-3 border border-white/[0.04]">
              <div className="flex items-center gap-2 text-[10px] text-white/30 uppercase tracking-wider mb-1">
                <Clock className="h-3 w-3" /> Time Lost
              </div>
              <p className="text-base font-bold text-white">{bottleneck.timeWastedMinutes}m <span className="text-[10px] font-normal text-white/20">per event</span></p>
            </div>
            <div className="rounded-lg bg-white/[0.03] p-3 border border-white/[0.04]">
              <div className="flex items-center gap-2 text-[10px] text-white/30 uppercase tracking-wider mb-1">
                <DollarSign className="h-3 w-3" /> Cost Impact
              </div>
              <p className="text-base font-bold text-emerald-400">${bottleneck.costImpact.toLocaleString()} <span className="text-[10px] font-normal text-white/20">annual</span></p>
            </div>
          </div>

          <div className="rounded-xl bg-indigo-500/5 border border-indigo-500/10 p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10">
              <Lightbulb className="h-12 w-12 text-indigo-400" />
            </div>
            <div className="flex items-center gap-2 text-[11px] font-bold text-indigo-300 uppercase tracking-widest mb-2">
              <Zap className="h-3.5 w-3.5" /> Recommendation
            </div>
            <p className="text-xs text-white/70 leading-relaxed pr-8">
              {bottleneck.recommendation}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
