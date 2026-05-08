'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  Users, 
  Layers, 
  ArrowRight, 
  Calendar,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import type { Workflow } from '@/lib/types';
import { DEPARTMENT_COLORS, FREQUENCY_LABELS } from '@/lib/constants';
import Link from 'next/link';

interface Props {
  workflow: Workflow;
  index: number;
}

export function WorkflowCard({ workflow, index }: Props) {
  const totalMinutes = workflow.steps.reduce((acc, step) => acc + step.timeMinutes, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);
  const manualSteps = workflow.steps.filter(s => s.isManual).length;
  const manualPercentage = Math.round((manualSteps / workflow.steps.length) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="glass-card group border-white/[0.06] bg-transparent hover:border-white/[0.12] transition-all">
        <CardContent className="p-0">
          <div className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className="h-5 px-1.5 text-[10px] font-semibold uppercase tracking-wider"
                    style={{ 
                      color: DEPARTMENT_COLORS[workflow.department], 
                      borderColor: `${DEPARTMENT_COLORS[workflow.department]}33`,
                      backgroundColor: `${DEPARTMENT_COLORS[workflow.department]}11`
                    }}
                  >
                    {workflow.department}
                  </Badge>
                  {workflow.isDemo && (
                    <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-white/5 text-white/40 border-white/5">
                      DEMO
                    </Badge>
                  )}
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
                  {workflow.name}
                </h3>
              </div>
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${workflow.analyzed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-white/20'}`}>
                {workflow.analyzed ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              </div>
            </div>

            <p className="line-clamp-2 text-xs text-white/50 mb-6 leading-relaxed">
              {workflow.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2 text-[11px] text-white/40">
                <Clock className="h-3.5 w-3.5 text-white/20" />
                <span>{totalHours}h duration</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-white/40">
                <Layers className="h-3.5 w-3.5 text-white/20" />
                <span>{workflow.steps.length} steps</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-white/40">
                <Calendar className="h-3.5 w-3.5 text-white/20" />
                <span>{FREQUENCY_LABELS[workflow.frequency]}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-white/40">
                <Users className="h-3.5 w-3.5 text-white/20" />
                <span>{manualPercentage}% manual</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/[0.06] bg-white/[0.01] px-5 py-3">
            <span className="text-[10px] font-medium text-white/30 uppercase tracking-widest">
              Last updated {new Date(workflow.updatedAt).toLocaleDateString()}
            </span>
            <Link href={workflow.analyzed ? `/analysis?id=${workflow.id}` : `/workflow-map?id=${workflow.id}`}>
              <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs text-white/60 hover:text-white hover:bg-white/5">
                {workflow.analyzed ? 'View Analysis' : 'Explore Map'} <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
