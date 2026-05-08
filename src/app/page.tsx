'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useStore, useDashboardMetrics } from '@/lib/store';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { WasteBreakdownChart } from '@/components/dashboard/WasteBreakdownChart';
import { SavingsTrendChart } from '@/components/dashboard/SavingsTrendChart';
import { DepartmentWasteChart } from '@/components/dashboard/DepartmentWasteChart';
import { QuickWins } from '@/components/dashboard/QuickWins';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  DollarSign, 
  Activity, 
  AlertTriangle, 
  ArrowUpRight, 
  Plus, 
  Zap,
  TrendingUp,
  ShieldAlert
} from 'lucide-react';
import Link from 'next/link';
import { fadeInUp, staggerContainer } from '@/lib/constants';

export default function Dashboard() {
  const { state } = useStore();
  const metrics = useDashboardMetrics();

  if (state.workflows.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center mt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative mb-6"
        >
          <div className="absolute -inset-4 rounded-full bg-indigo-500/10 blur-2xl" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-xl shadow-indigo-500/20">
            <Activity className="h-10 w-10 text-white" />
          </div>
        </motion.div>
        <h2 className="text-2xl font-bold text-white">Welcome to FlowLedger</h2>
        <p className="mt-2 max-w-md text-white/50">
          Start by adding a workflow or load our demo data to see how we help identify operational waste.
        </p>
        <div className="mt-8 flex gap-4">
          <Link href="/workflows/new">
            <Button className="gap-2 bg-indigo-500 hover:bg-indigo-600">
              <Plus className="h-4 w-4" /> Add Workflow
            </Button>
          </Link>
          <Button 
            variant="outline" 
            className="border-white/10 bg-white/5 hover:bg-white/10"
            onClick={() => {/* handled in header but we can add secondary trigger here if needed */}}
          >
            Watch Demo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* KPI Section */}
      <motion.div 
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <MetricCard 
          title="Total Hours Wasted"
          value={`${metrics.totalHoursWasted}h`}
          subtitle="per week across workflows"
          icon={<Clock className="h-5 w-5" />}
          color="#6366f1"
          trend={{ value: -12, label: 'vs last month' }}
          delay={0.1}
        />
        <MetricCard 
          title="Annual Savings Potential"
          value={`$${metrics.estimatedAnnualSavings.toLocaleString()}`}
          subtitle="based on automation impact"
          icon={<DollarSign className="h-5 w-5" />}
          color="#10b981"
          trend={{ value: 15, label: 'vs last month' }}
          delay={0.2}
        />
        <MetricCard 
          title="Workflow Health"
          value={`${metrics.workflowHealthScore}/100`}
          subtitle="weighted efficiency score"
          icon={<Activity className="h-5 w-5" />}
          color="#f59e0b"
          delay={0.3}
        />
        <MetricCard 
          title="Active Bottlenecks"
          value={metrics.topBottlenecks.length}
          subtitle="critical issues identified"
          icon={<AlertTriangle className="h-5 w-5" />}
          color="#ef4444"
          delay={0.4}
        />
      </motion.div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div variants={fadeInUp} className="lg:col-span-2">
          <Card className="glass-card border-white/[0.06] bg-transparent overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-indigo-400" />
                  Savings Realization Trend
                </CardTitle>
                <CardDescription className="text-white/40 text-xs">Projected vs actual savings after automation</CardDescription>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-white/30 hover:text-white">
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <SavingsTrendChart data={metrics.savingsTrend} />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card className="glass-card border-white/[0.06] bg-transparent h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Zap className="h-4 w-4 text-emerald-400" />
                Quick Wins
              </CardTitle>
              <CardDescription className="text-white/40 text-xs">Immediate high-ROI opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <QuickWins recommendations={state.analyses.flatMap(a => a.recommendations)} />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Secondary Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div variants={fadeInUp}>
          <Card className="glass-card border-white/[0.06] bg-transparent">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-red-400" />
                Waste Breakdown by Type
              </CardTitle>
              <CardDescription className="text-white/40 text-xs">Hours lost per week categorized by inefficiency type</CardDescription>
            </CardHeader>
            <CardContent>
              <WasteBreakdownChart data={metrics.wasteByType} />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card className="glass-card border-white/[0.06] bg-transparent">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Activity className="h-4 w-4 text-indigo-400" />
                Department Impact
              </CardTitle>
              <CardDescription className="text-white/40 text-xs">Operational waste distributed across the company</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-6">
              <DepartmentWasteChart data={metrics.wasteByDepartment} />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
