'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { 
  Clock, 
  User, 
  Zap, 
  AlertTriangle,
  CheckCircle2,
  Lock,
  Unlock
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { WorkflowStep, Department } from '@/lib/types';
import { DEPARTMENT_COLORS } from '@/lib/constants';

export const StepNode = memo(({ data, selected }: NodeProps<any>) => {
  const { step, isBottleneck } = data;

  return (
    <div className={`relative min-w-[220px] rounded-xl border-2 bg-[#0d0d14] p-4 transition-all duration-300 ${
      selected ? 'border-indigo-500 shadow-lg shadow-indigo-500/20' : 'border-white/[0.08]'
    } ${isBottleneck ? 'ring-2 ring-red-500/20' : ''}`}>
      
      {isBottleneck && (
        <div className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow-lg animate-pulse">
          <AlertTriangle className="h-4 w-4" />
        </div>
      )}

      <Handle type="target" position={Position.Top} className="!bg-indigo-500 !w-3 !h-3 !-top-1.5" />
      
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <Badge 
            variant="outline" 
            className="h-5 px-1.5 text-[9px] font-bold uppercase tracking-widest"
            style={{ 
              color: DEPARTMENT_COLORS[step.department as Department], 
              borderColor: `${DEPARTMENT_COLORS[step.department as Department]}33`,
              backgroundColor: `${DEPARTMENT_COLORS[step.department as Department]}11`
            }}
          >
            {step.department}
          </Badge>
          <div className="flex items-center gap-1.5">
            {step.isManual ? (
              <Lock className="h-3 w-3 text-amber-500/50" />
            ) : (
              <Unlock className="h-3 w-3 text-emerald-500/50" />
            )}
          </div>
        </div>

        <div className="space-y-1">
          <h4 className="text-sm font-bold text-white line-clamp-1">{step.name}</h4>
          <div className="flex items-center gap-2 text-[10px] text-white/40">
            <User className="h-3 w-3" />
            <span>{step.owner}</span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/[0.06] pt-3">
          <div className="flex items-center gap-1.5 text-[10px] text-white/30">
            <Clock className="h-3 w-3" />
            <span>{step.timeMinutes}m</span>
          </div>
          {step.type === 'automated' || !step.isManual ? (
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[9px] h-5">
              AUTOMATED
            </Badge>
          ) : (
            <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[9px] h-5">
              MANUAL
            </Badge>
          )}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-indigo-500 !w-3 !h-3 !-bottom-1.5" />
    </div>
  );
});

StepNode.displayName = 'StepNode';
