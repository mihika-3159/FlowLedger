'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, ChevronDown, ChevronUp, User, Calendar, Target } from 'lucide-react';
import type { ActionItem } from '@/lib/types';
import { Progress } from '@/components/ui/progress';

interface Props {
  items: ActionItem[];
  onToggleItem: (itemId: string, checkIndex: number) => void;
  onUpdateStatus: (itemId: string, status: any) => void;
}

export function ActionChecklist({ items, onToggleItem, onUpdateStatus }: Props) {
  const [expandedId, setExpandedId] = React.useState<string | null>(items[0]?.id || null);

  return (
    <div className="space-y-4">
      {items.map((item, idx) => {
        const completedSteps = item.checklist.filter(c => c.done).length;
        const totalSteps = item.checklist.length;
        const progress = Math.round((completedSteps / totalSteps) * 100);
        const isExpanded = expandedId === item.id;

        return (
          <Card key={item.id} className={`glass-card border-white/[0.06] bg-transparent transition-all ${item.status === 'completed' ? 'opacity-60' : ''}`}>
            <CardContent className="p-0">
              <div 
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/[0.02]"
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div 
                    className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      item.status === 'completed' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-white/10 text-white/10'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateStatus(item.id, item.status === 'completed' ? 'planned' : 'completed');
                    }}
                  >
                    {item.status === 'completed' && <CheckCircle2 className="h-4 w-4" />}
                  </div>
                  <div className="space-y-0.5">
                    <h3 className={`text-sm font-bold ${item.status === 'completed' ? 'line-through text-white/30' : 'text-white'}`}>
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 text-[10px] text-white/30">
                        <User className="h-3 w-3" />
                        <span>{item.owner}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-white/30">
                        <Calendar className="h-3 w-3" />
                        <span>{item.deadline}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="hidden md:flex flex-col items-end gap-1.5 w-24">
                    <div className="flex justify-between w-full text-[9px] font-bold text-white/30 tracking-widest uppercase">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-1 bg-white/5" indicatorClassName="bg-indigo-500" />
                  </div>
                  {isExpanded ? <ChevronUp className="h-4 w-4 text-white/20" /> : <ChevronDown className="h-4 w-4 text-white/20" />}
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-white/[0.04]"
                  >
                    <div className="p-5 space-y-6 bg-white/[0.01]">
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Implementation Checklist</p>
                        <div className="grid gap-2">
                          {item.checklist.map((check, cIdx) => (
                            <div 
                              key={cIdx}
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/[0.03] transition-colors cursor-pointer group"
                              onClick={() => onToggleItem(item.id, cIdx)}
                            >
                              {check.done ? (
                                <CheckCircle2 className="h-4 w-4 text-indigo-400" />
                              ) : (
                                <Circle className="h-4 w-4 text-white/10 group-hover:text-white/30" />
                              )}
                              <span className={`text-xs ${check.done ? 'text-white/60 line-through' : 'text-white/80'}`}>
                                {check.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between rounded-lg bg-indigo-500/5 border border-indigo-500/10 p-3">
                        <div className="flex items-center gap-2">
                          <Target className="h-3.5 w-3.5 text-indigo-400" />
                          <span className="text-[11px] font-medium text-white/60">Expected Impact:</span>
                        </div>
                        <span className="text-xs font-bold text-indigo-300">{item.expectedImpact}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
