'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useStore, useDashboardMetrics } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  DollarSign, 
  TrendingUp, 
  Target, 
  BarChart3, 
  ArrowUpRight,
  Calculator,
  PieChart as PieIcon,
  Zap,
  ArrowRight
} from 'lucide-react';
import { SavingsTrendChart } from '@/components/dashboard/SavingsTrendChart';
import { DepartmentWasteChart } from '@/components/dashboard/DepartmentWasteChart';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { fadeInUp, staggerContainer } from '@/lib/constants';
import Link from 'next/link';

export default function SavingsPage() {
  const { state } = useStore();
  const metrics = useDashboardMetrics();

  if (state.analyses.length === 0) {
    return (
      <div className="p-8 text-center mt-20">
        <div className="h-16 w-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 mx-auto">
          <DollarSign className="h-8 w-8 text-white/10" />
        </div>
        <h2 className="text-xl font-bold text-white">No savings data available</h2>
        <p className="text-white/40 mt-2 max-w-sm mx-auto">
          Analyze workflows to calculate potential savings and track your operational ROI.
        </p>
        <Link href="/workflows">
          <Button className="mt-8 bg-indigo-500">Analyze Workflows</Button>
        </Link>
      </div>
    );
  }

  const totalPossibleSavings = metrics.estimatedAnnualSavings;
  const currentRealizedSavings = Math.round(totalPossibleSavings * 0.12); // Mock realization
  const realizationRate = Math.round((currentRealizedSavings / totalPossibleSavings) * 100);

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Operational ROI & Savings</h1>
          <p className="text-sm text-white/40">Track the business impact of your workflow improvements.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/10 bg-white/5 text-white/60 gap-2">
            <Calculator className="h-4 w-4" /> Global Estimates
          </Button>
          <Button className="bg-indigo-500 hover:bg-indigo-600 gap-2">
            Export Report <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Hero Stats */}
      <motion.div 
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="glass-card border-white/[0.06] bg-gradient-to-br from-indigo-500/10 to-transparent p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <DollarSign className="h-24 w-24" />
          </div>
          <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Annual Loss Detected</p>
          <h3 className="text-3xl font-bold text-white">${(metrics.estimatedAnnualSavings / 0.7).toLocaleString()}</h3>
          <p className="text-xs text-white/30 mt-2 flex items-center gap-1.5">
            <TrendingUp className="h-3 w-3 text-red-400" />
            +4.2% since last quarter
          </p>
        </Card>

        <Card className="glass-card border-white/[0.06] bg-gradient-to-br from-emerald-500/10 to-transparent p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Target className="h-24 w-24" />
          </div>
          <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Recoverable Capital</p>
          <h3 className="text-3xl font-bold text-white">${metrics.estimatedAnnualSavings.toLocaleString()}</h3>
          <p className="text-xs text-white/30 mt-2 flex items-center gap-1.5">
            <Zap className="h-3 w-3 text-emerald-400" />
            72% automation confidence
          </p>
        </Card>

        <Card className="glass-card border-white/[0.06] bg-white/[0.02] p-6">
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3">Savings Realization</p>
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <h3 className="text-2xl font-bold text-white">${currentRealizedSavings.toLocaleString()}</h3>
              <span className="text-[10px] font-bold text-indigo-400">{realizationRate}% of goal</span>
            </div>
            <Progress value={realizationRate} className="h-1.5 bg-white/5" indicatorClassName="bg-indigo-500" />
            <p className="text-[10px] text-white/20 text-center">BASED ON COMPLETED ACTION ITEMS</p>
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Trend Chart */}
        <motion.div variants={fadeInUp}>
          <Card className="glass-card border-white/[0.06] bg-transparent">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-indigo-400" />
                Projected ROI Timeline
              </CardTitle>
              <CardDescription className="text-white/40">Realized vs. potential savings over the next 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <SavingsTrendChart data={metrics.savingsTrend} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Department Breakdown */}
        <motion.div variants={fadeInUp}>
          <Card className="glass-card border-white/[0.06] bg-transparent">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <PieIcon className="h-5 w-5 text-emerald-400" />
                Waste Source Distribution
              </CardTitle>
              <CardDescription className="text-white/40">Annual cost impact grouped by department</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-6">
              <DepartmentWasteChart data={metrics.wasteByDepartment} />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Top Impact Workflows */}
      <motion.div variants={fadeInUp}>
        <Card className="glass-card border-white/[0.06] bg-transparent">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Highest Impact Workflows</CardTitle>
            <CardDescription className="text-white/40">Processes with the largest recovery potential</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/[0.06] text-[10px] text-white/30 uppercase tracking-widest">
                    <th className="px-6 py-4 font-bold">Workflow Name</th>
                    <th className="px-6 py-4 font-bold">Department</th>
                    <th className="px-6 py-4 font-bold">Hours Wasted/Wk</th>
                    <th className="px-6 py-4 font-bold">Potential Savings</th>
                    <th className="px-6 py-4 font-bold">ROI Score</th>
                    <th className="px-6 py-4 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {state.analyses.slice(0, 5).sort((a, b) => b.costAnalysis.potentialSavings - a.costAnalysis.potentialSavings).map((a) => {
                    const wf = state.workflows.find(w => w.id === a.workflowId);
                    return (
                      <tr key={a.id} className="group hover:bg-white/[0.01] transition-colors">
                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold text-white">{wf?.name}</span>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className="bg-white/5 border-white/5 text-white/40 text-[10px]">
                            {wf?.department}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-white/60">
                          {a.costAnalysis.hoursWastedPerWeek}h
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-emerald-400">${a.costAnalysis.potentialSavings.toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-16 bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500" style={{ width: `${a.costAnalysis.roiEstimate / 6}%` }} />
                            </div>
                            <span className="text-[10px] font-bold text-white/40">{a.costAnalysis.roiEstimate}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link href={`/analysis?id=${a.workflowId}`}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-white/20 hover:text-white">
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
