'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { useStore } from '@/lib/store';
import { FlowCanvas } from '@/components/workflow-map/FlowCanvas';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Map, 
  Settings2, 
  Share2, 
  Download,
  LayoutGrid
} from 'lucide-react';
import Link from 'next/link';

export default function WorkflowMapPage() {
  const searchParams = useSearchParams();
  const { state } = useStore();
  
  const workflowId = searchParams.get('id');
  const workflow = state.workflows.find(w => w.id === workflowId) || state.workflows[0];
  const analysis = state.analyses.find(a => a.workflowId === workflow?.id);

  if (!workflow) {
    return (
      <div className="p-8 text-center mt-20">
        <h2 className="text-xl font-bold text-white">No workflow selected</h2>
        <p className="text-white/40 mt-2">Please select a workflow from the list to view its map.</p>
        <Link href="/workflows">
          <Button className="mt-6 bg-indigo-500">View Workflows</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="p-4 lg:p-6 border-b border-white/[0.06] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0a0a0f]">
        <div className="flex items-center gap-4">
          <Link href="/workflows">
            <Button variant="ghost" size="icon" className="h-9 w-9 text-white/30 hover:text-white">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Map className="h-4 w-4 text-indigo-400" />
              <h1 className="text-lg font-bold text-white">Workflow Map: {workflow.name}</h1>
            </div>
            <p className="text-[11px] text-white/30 font-medium uppercase tracking-widest mt-0.5">
              {workflow.department} · {workflow.steps.length} STEPS · {analysis?.bottlenecks.length || 0} BOTTLENECKS
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-9 gap-2 text-xs text-white/40 hover:text-white">
            <Share2 className="h-4 w-4" /> Share
          </Button>
          <Button variant="ghost" size="sm" className="h-9 gap-2 text-xs text-white/40 hover:text-white">
            <Download className="h-4 w-4" /> Export
          </Button>
          <div className="h-6 w-px bg-white/10 mx-2" />
          <Button variant="outline" className="h-9 gap-2 text-xs border-white/10 bg-white/5 text-white/60">
            <Settings2 className="h-4 w-4" /> Map Options
          </Button>
        </div>
      </div>

      <div className="flex-1 p-4 bg-[#07070b]">
        <FlowCanvas workflow={workflow} analysis={analysis} />
      </div>
    </div>
  );
}
