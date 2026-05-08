'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Zap, 
  Clock, 
  Wrench, 
  ArrowRight, 
  Target,
  CheckCircle2,
  AlertCircle,
  Play
} from 'lucide-react';
import type { AutomationRecommendation } from '@/lib/types';
import { PRIORITY_COLORS, DIFFICULTY_COLORS, DEPARTMENT_COLORS } from '@/lib/constants';

interface Props {
  recommendation: AutomationRecommendation;
  index: number;
  onStatusUpdate?: (status: any) => void;
}

export function RecommendationCard({ recommendation, index, onStatusUpdate }: Props) {
  const isCompleted = recommendation.status === 'completed';
  const isInProgress = recommendation.status === 'in_progress';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className={`glass-card border-white/[0.06] bg-transparent hover:border-white/[0.1] transition-all overflow-hidden group ${isCompleted ? 'opacity-60' : ''}`}>
        <CardContent className="p-0">
          <div className="p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 text-[9px] h-5 px-1.5">
                    {recommendation.priority} PRIORITY
                  </Badge>
                  <Badge variant="outline" className="h-5 px-1.5 text-[9px] font-bold uppercase tracking-widest border-white/10 bg-white/5 text-white/40">
                    {recommendation.difficulty}
                  </Badge>
                </div>
                <h3 className={`text-base font-bold text-white transition-colors ${isCompleted ? 'line-through text-white/30' : 'group-hover:text-emerald-400'}`}>
                  {recommendation.title}
                </h3>
              </div>
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.03] ${isCompleted ? 'text-emerald-500' : 'text-white/20'}`}>
                {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <Zap className="h-5 w-5" />}
              </div>
            </div>

            <p className="text-xs text-white/50 leading-relaxed mb-6">
              {recommendation.description}
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="flex items-center gap-2 text-[10px] text-white/40">
                <Clock className="h-3.5 w-3.5 text-white/20" />
                <span>Save {recommendation.estimatedTimeSavedMinutes}m / event</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-white/40">
                <Wrench className="h-3.5 w-3.5 text-white/20" />
                <span className="line-clamp-1">{recommendation.suggestedTool}</span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Next Steps</p>
              <div className="space-y-1.5">
                {recommendation.implementationSteps.slice(0, 2).map((step, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px] text-white/60">
                    <div className="h-1 w-1 rounded-full bg-indigo-500/40" />
                    <span className="line-clamp-1">{step}</span>
                  </div>
                ))}
                {recommendation.implementationSteps.length > 2 && (
                  <p className="text-[10px] text-white/20 pl-3">+{recommendation.implementationSteps.length - 2} more steps</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/[0.06] bg-white/[0.01] px-6 py-3">
            <div className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className="h-5 px-1.5 text-[9px] font-bold uppercase tracking-widest"
                style={{ 
                  color: DEPARTMENT_COLORS[recommendation.affectedDepartment], 
                  borderColor: `${DEPARTMENT_COLORS[recommendation.affectedDepartment]}33`,
                  backgroundColor: `${DEPARTMENT_COLORS[recommendation.affectedDepartment]}11`
                }}
              >
                {recommendation.affectedDepartment}
              </Badge>
            </div>
            <div className="flex gap-2">
              {!isCompleted ? (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onStatusUpdate?.('completed')}
                    className="h-8 px-3 text-[10px] text-emerald-400 hover:bg-emerald-400/10 hover:text-emerald-300"
                  >
                    Resolve
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 px-3 text-[10px] text-indigo-400 hover:bg-indigo-400/10 hover:text-indigo-300 gap-1.5"
                  >
                    Implement <Play className="h-3 w-3" />
                  </Button>
                </>
              ) : (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onStatusUpdate?.('planned')}
                  className="h-8 px-3 text-[10px] text-white/20 hover:text-white"
                >
                  Undo
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
