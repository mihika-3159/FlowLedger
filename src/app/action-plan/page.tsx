'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { RoadmapTimeline } from '@/components/action-plan/RoadmapTimeline';
import { ActionChecklist } from '@/components/action-plan/ActionChecklist';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target, 
  ArrowLeft, 
  LayoutList, 
  Calendar,
  Share2,
  Download,
  CheckCircle2,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function ActionPlanPage() {
  const searchParams = useSearchParams();
  const { state, dispatch } = useStore();
  
  const workflowId = searchParams.get('workflowId');
  const plan = state.actionPlans.find(p => workflowId ? p.workflowId === workflowId : true) || state.actionPlans[0];
  const workflow = state.workflows.find(w => w.id === plan?.workflowId);

  const handleToggleCheck = (itemId: string, checkIndex: number) => {
    if (!plan) return;
    const item = plan.items.find(i => i.id === itemId);
    if (!item) return;

    const newChecklist = [...item.checklist];
    newChecklist[checkIndex] = { ...newChecklist[checkIndex], done: !newChecklist[checkIndex].done };
    
    dispatch({ 
      type: 'UPDATE_ACTION_ITEM', 
      payload: { planId: plan.id, itemId, updates: { checklist: newChecklist } } 
    });
  };

  const handleUpdateStatus = (itemId: string, status: any) => {
    if (!plan) return;
    dispatch({ 
      type: 'UPDATE_ACTION_ITEM', 
      payload: { planId: plan.id, itemId, updates: { status } } 
    });
  };

  if (!plan) {
    return (
      <div className="p-8 text-center mt-20">
        <h2 className="text-xl font-bold text-white">No active action plans</h2>
        <p className="text-white/40 mt-2">Analyze a workflow to generate a prioritized improvement roadmap.</p>
        <Link href="/workflows">
          <Button className="mt-6 bg-indigo-500">View Workflows</Button>
        </Link>
      </div>
    );
  }

  const completedCount = plan.items.filter(i => i.status === 'completed').length;
  const totalCount = plan.items.length;
  const completionRate = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          {workflowId && (
            <Link href={`/analysis?id=${workflowId}`}>
              <Button variant="ghost" size="sm" className="h-8 p-0 text-white/30 hover:text-white gap-2">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Analysis
              </Button>
            </Link>
          )}
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Improvement Action Plan
            {workflow && <span className="text-white/30 ml-2">/ {workflow.name}</span>}
          </h1>
          <p className="text-sm text-white/40">Step-by-step roadmap to eliminate detected bottlenecks.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" className="text-white/40 hover:text-white gap-2">
            <Share2 className="h-4 w-4" /> Share
          </Button>
          <Button className="bg-indigo-500 hover:bg-indigo-600 gap-2">
            Download PDF <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Stats */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 space-y-6">
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Plan Progress</p>
              <div className="flex items-end justify-between">
                <h3 className="text-3xl font-bold text-white">{completionRate}%</h3>
                <span className="text-xs text-white/40 mb-1">{completedCount}/{totalCount} items</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${completionRate}%` }} />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest">Total Savings</p>
                  <p className="text-sm font-bold text-white">${plan.totalEstimatedSavings.toLocaleString()} / year</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest">Realized Impact</p>
                  <p className="text-sm font-bold text-white">${Math.round(plan.totalEstimatedSavings * (completionRate / 100)).toLocaleString()} / year</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6 relative overflow-hidden group">
            <div className="absolute -top-6 -right-6 h-24 w-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all" />
            <div className="relative space-y-4">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Next Quick Win</h3>
              </div>
              {plan.items.find(i => i.phase === 'quick_win' && i.status !== 'completed') ? (
                <>
                  <p className="text-xs text-white/60 leading-relaxed">
                    {plan.items.find(i => i.phase === 'quick_win' && i.status !== 'completed')?.title}
                  </p>
                  <Button variant="link" className="p-0 h-auto text-xs text-indigo-400 hover:text-indigo-300 gap-1.5">
                    Start implementing <ArrowRight className="h-3 w-3" />
                  </Button>
                </>
              ) : (
                <p className="text-xs text-white/40 italic">All quick wins completed!</p>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="list" className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-1">
              <TabsList className="bg-transparent h-auto p-0 gap-8">
                <TabsTrigger 
                  value="list" 
                  className="bg-transparent border-b-2 border-transparent rounded-none px-0 py-2 data-[state=active]:border-indigo-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none text-white/40 data-[state=active]:text-white font-bold text-xs uppercase tracking-widest"
                >
                  Action List
                </TabsTrigger>
                <TabsTrigger 
                  value="roadmap" 
                  className="bg-transparent border-b-2 border-transparent rounded-none px-0 py-2 data-[state=active]:border-indigo-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none text-white/40 data-[state=active]:text-white font-bold text-xs uppercase tracking-widest"
                >
                  Roadmap Timeline
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="list" className="focus-visible:outline-none">
              <ActionChecklist 
                items={plan.items} 
                onToggleItem={handleToggleCheck}
                onUpdateStatus={handleUpdateStatus}
              />
            </TabsContent>

            <TabsContent value="roadmap" className="focus-visible:outline-none py-4">
              <RoadmapTimeline items={plan.items} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

const Separator = () => <div className="h-px w-full bg-white/[0.06]" />;
