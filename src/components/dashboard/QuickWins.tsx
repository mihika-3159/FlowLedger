'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Zap, Clock, DollarSign } from 'lucide-react';
import type { AutomationRecommendation } from '@/lib/types';
import { DIFFICULTY_COLORS, PRIORITY_COLORS } from '@/lib/constants';
import Link from 'next/link';

interface Props {
  recommendations: AutomationRecommendation[];
}

export function QuickWins({ recommendations }: Props) {
  const quickWins = recommendations
    .filter((r) => r.difficulty === 'Easy')
    .slice(0, 3);

  if (quickWins.length === 0) {
    return (
      <Card className="glass-card border-white/[0.06] bg-transparent">
        <CardContent className="flex flex-col items-center justify-center py-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.03] text-white/20">
            <Zap className="h-6 w-6" />
          </div>
          <p className="mt-4 text-sm font-medium text-white/50">No quick wins detected yet</p>
          <p className="mt-1 text-xs text-white/30">Analyze more workflows to find low-hanging fruit</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {quickWins.map((win, idx) => (
        <motion.div
          key={win.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: idx * 0.1 }}
        >
          <Card className="glass-card group overflow-hidden border-white/[0.06] bg-transparent transition-all hover:border-white/[0.1] hover:bg-white/[0.01]">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="h-5 border-emerald-500/30 bg-emerald-500/10 px-1.5 text-[10px] font-medium text-emerald-400">
                      QUICK WIN
                    </Badge>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-white/30">{win.affectedDepartment}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors">{win.title}</h3>
                  <p className="line-clamp-1 text-[11px] text-white/50">{win.description}</p>
                </div>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Zap className="h-4 w-4" />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-white/[0.04] pt-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-[10px] text-white/40">
                    <Clock className="h-3 w-3" />
                    <span>{win.estimatedTimeSavedMinutes}m saved</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-white/40">
                    <DollarSign className="h-3 w-3" />
                    <span>High ROI</span>
                  </div>
                </div>
                <Link href={`/recommendations?id=${win.id}`}>
                  <Button variant="ghost" size="sm" className="h-7 gap-1 px-2 text-[10px] text-indigo-400 hover:bg-indigo-400/10 hover:text-indigo-300">
                    View <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
