'use client';

import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { BottleneckCard } from '@/components/analysis/BottleneckCard';
import { CostCalculator } from '@/components/analysis/CostCalculator';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Sparkles, 
  ArrowLeft, 
  FileText, 
  Clock, 
  Target,
  ChevronRight,
  RefreshCw,
  BarChart4,
  Zap,
  Activity
} from 'lucide-react';
import Link from 'next/link';
import { fadeInUp, staggerContainer } from '@/lib/constants';

export default function AnalysisPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { state, dispatch } = useStore();
  const [analyzing, setAnalyzing] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  const workflowId = searchParams.get('id');
  const workflow = state.workflows.find(w => w.id === workflowId) || state.workflows[0];
  const analysis = state.analyses.find(a => a.workflowId === workflow?.id);

  const startAnalysis = async () => {
    if (!workflow) return;
    
    setAnalyzing(true);
    setProgress(0);
    
    // Simulate progress steps
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 90) return p;
        return p + 10;
      });
    }, 400);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workflow),
      });

      const result = await response.json();
      
      if (result.error) throw new Error(result.error);

      dispatch({ type: 'ADD_ANALYSIS', payload: result });
      dispatch({ type: 'UPDATE_WORKFLOW', payload: { ...workflow, analyzed: true } });
      
      setProgress(100);
      setTimeout(() => setAnalyzing(false), 500);
    } catch (error) {
      console.error("Analysis failed:", error);
      setAnalyzing(false);
    } finally {
      clearInterval(interval);
    }
  };

  if (!workflow) {
    return (
      <div className="p-8 text-center mt-20">
        <h2 className="text-xl font-bold text-white">No workflow selected</h2>
        <p className="text-white/40 mt-2">Please select a workflow from the list to analyze.</p>
        <Link href="/workflows">
          <Button className="mt-6 bg-indigo-500">View Workflows</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link href="/workflows">
            <Button variant="ghost" size="sm" className="h-8 p-0 text-white/30 hover:text-white gap-2">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to List
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white tracking-tight">Waste Analysis: {workflow.name}</h1>
            {analysis?.isAI && (
              <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 gap-1.5 h-6">
                <Sparkles className="h-3 w-3" /> AI POWERED
              </Badge>
            )}
          </div>
        </div>
        {!analysis ? (
          <Button 
            onClick={startAnalysis}
            disabled={analyzing}
            className="bg-gradient-to-r from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/20 gap-2 h-11"
          >
            {analyzing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Run Efficiency Audit
          </Button>
        ) : (
          <Button 
            variant="outline"
            onClick={startAnalysis}
            disabled={analyzing}
            className="border-white/10 bg-white/5 text-white/60 hover:text-white gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${analyzing ? 'animate-spin' : ''}`} />
            Re-run Audit
          </Button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {analyzing ? (
          <motion.div 
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-32 space-y-8"
          >
            <div className="relative">
              <div className="absolute -inset-8 rounded-full bg-indigo-500/10 blur-3xl animate-pulse" />
              <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <Sparkles className="h-10 w-10 text-indigo-400" />
              </div>
            </div>
            <div className="space-y-4 text-center max-w-sm w-full">
              <h3 className="text-lg font-bold text-white">AI Engine Auditing Workflow...</h3>
              <p className="text-sm text-white/40">Identifying bottlenecks, calculating cost waste, and generating automation roadmap.</p>
              <div className="space-y-2">
                <Progress value={progress} className="h-1.5 bg-white/5" indicatorClassName="bg-indigo-500" />
                <div className="flex justify-between text-[10px] text-white/20 font-medium uppercase tracking-widest">
                  <span>{progress < 40 ? 'Processing Steps' : progress < 70 ? 'Detecting Waste' : 'Optimizing ROI'}</span>
                  <span>{progress}%</span>
                </div>
              </div>
            </div>
          </motion.div>
        ) : analysis ? (
          <motion.div 
            key="results"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Left Column: Bottlenecks */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-indigo-400" />
                  <h2 className="text-lg font-bold text-white">Detected Inefficiencies</h2>
                </div>
                <Badge variant="outline" className="border-white/10 text-white/40">
                  {analysis.bottlenecks.length} ISSUES FOUND
                </Badge>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {analysis.bottlenecks.map((bn, idx) => (
                  <BottleneckCard key={bn.id} bottleneck={bn} index={idx} />
                ))}
              </div>
            </div>

            {/* Right Column: ROI & Impact */}
            <div className="space-y-8">
              <Card className="glass-card border-white/[0.06] bg-indigo-500/[0.02] overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold uppercase tracking-widest text-indigo-400">Analysis Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-white/70 leading-relaxed italic">
                    "{analysis.summary}"
                  </p>
                  <div className="mt-6 flex items-center justify-between border-t border-white/[0.06] pt-4">
                    <div className="text-center flex-1 border-r border-white/[0.06]">
                      <p className="text-[10px] text-white/30 uppercase tracking-widest">Health Score</p>
                      <p className={`text-xl font-bold mt-1 ${
                        analysis.workflowHealthScore > 70 ? 'text-emerald-400' : 
                        analysis.workflowHealthScore > 40 ? 'text-amber-400' : 'text-red-400'
                      }`}>
                        {analysis.workflowHealthScore}/100
                      </p>
                    </div>
                    <div className="text-center flex-1">
                      <p className="text-[10px] text-white/30 uppercase tracking-widest">Automation</p>
                      <p className="text-xl font-bold mt-1 text-white">
                        {analysis.costAnalysis.automationCoverage}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <CostCalculator 
                initialHours={analysis.costAnalysis.hoursWastedPerWeek} 
                initialAnnualLoss={analysis.costAnalysis.annualCostLoss} 
              />

              <Card className="glass-card border-white/[0.06] bg-transparent">
                <CardHeader>
                  <CardTitle className="text-sm font-bold uppercase tracking-widest text-white/40">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href={`/workflow-map?id=${workflow.id}`}>
                    <Button variant="outline" className="w-full justify-between border-white/5 bg-white/5 hover:bg-white/10 group">
                      <span className="flex items-center gap-2"><BarChart4 className="h-4 w-4 text-indigo-400" /> View Flow Map</span>
                      <ChevronRight className="h-4 w-4 text-white/20 group-hover:text-white/40" />
                    </Button>
                  </Link>
                  <Link href={`/recommendations?workflowId=${workflow.id}`}>
                    <Button variant="outline" className="w-full justify-between border-white/5 bg-white/5 hover:bg-white/10 group">
                      <span className="flex items-center gap-2"><Zap className="h-4 w-4 text-emerald-400" /> Full Recommendations</span>
                      <ChevronRight className="h-4 w-4 text-white/20 group-hover:text-white/40" />
                    </Button>
                  </Link>
                  <Link href={`/action-plan?workflowId=${workflow.id}`}>
                    <Button className="w-full justify-between bg-indigo-500 hover:bg-indigo-600 shadow-lg shadow-indigo-500/20 group mt-4">
                      <span className="flex items-center gap-2"><Target className="h-4 w-4" /> Build Action Plan</span>
                      <ChevronRight className="h-4 w-4 text-white/40" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="h-20 w-20 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-6">
              <FileText className="h-10 w-10 text-white/10" />
            </div>
            <h2 className="text-xl font-bold text-white">No analysis available for this workflow</h2>
            <p className="text-white/40 mt-2 max-w-sm">
              Run an efficiency audit to identify bottlenecks and calculate potential savings.
            </p>
            <Button 
              onClick={startAnalysis}
              className="mt-8 bg-indigo-500 hover:bg-indigo-600 px-8 h-12 gap-2"
            >
              <Sparkles className="h-4 w-4" /> Start Audit
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

