'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { WorkflowCard } from '@/components/workflows/WorkflowCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  Filter, 
  LayoutGrid, 
  List,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { staggerContainer, fadeInUp } from '@/lib/constants';

export default function WorkflowsPage() {
  const { state, dispatch } = useStore();
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredWorkflows = state.workflows.filter(wf => 
    wf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    wf.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Internal Workflows</h1>
          <p className="text-sm text-white/40">Manage and monitor all mapped internal processes</p>
        </div>
        <div className="flex items-center gap-3">
          {state.workflows.length === 0 && (
            <Button 
              variant="outline" 
              onClick={() => dispatch({ type: 'LOAD_DEMO_DATA' })}
              className="border-indigo-500/30 bg-indigo-500/5 text-indigo-400 hover:bg-indigo-500/10 gap-2"
            >
              <Sparkles className="h-4 w-4" /> Load Demo Data
            </Button>
          )}
          <Link href="/workflows/new">
            <Button className="bg-indigo-500 hover:bg-indigo-600 gap-2">
              <Plus className="h-4 w-4" /> New Workflow
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/[0.02] border border-white/[0.06] p-4 rounded-xl">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
          <Input 
            placeholder="Search workflows, departments..." 
            className="pl-10 bg-white/[0.03] border-white/[0.08] focus:border-indigo-500/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button variant="outline" size="sm" className="bg-white/5 border-white/5 text-white/50 gap-2 flex-1 md:flex-none">
            <Filter className="h-3.5 w-3.5" /> Filter
          </Button>
          <div className="h-8 w-px bg-white/[0.06] mx-2 hidden md:block" />
          <div className="flex bg-white/5 rounded-lg p-1">
            <Button variant="ghost" size="icon" className="h-7 w-7 bg-white/10 text-white">
              <LayoutGrid className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-white/30">
              <List className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {filteredWorkflows.length > 0 ? (
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredWorkflows.map((wf, idx) => (
            <WorkflowCard key={wf.id} workflow={wf} index={idx} />
          ))}
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="h-16 w-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-white/10" />
          </div>
          <h3 className="text-lg font-semibold text-white">No workflows found</h3>
          <p className="text-sm text-white/40 mt-1">Try adjusting your search or add a new workflow</p>
        </motion.div>
      )}
    </div>
  );
}
