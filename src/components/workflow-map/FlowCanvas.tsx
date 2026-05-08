'use client';

import React, { useMemo, useCallback } from 'react';
import { 
  ReactFlow, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState,
  Panel,
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { StepNode } from './StepNode';
import { BottleneckEdge } from './BottleneckEdge';
import type { Workflow, AnalysisResult } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2, ZoomIn, ZoomOut, Zap } from 'lucide-react';

const nodeTypes = {
  step: StepNode,
};

const edgeTypes = {
  bottleneck: BottleneckEdge,
};

interface Props {
  workflow: Workflow;
  analysis?: AnalysisResult;
}

export function FlowCanvas({ workflow, analysis }: Props) {
  const initialNodes = useMemo(() => {
    return workflow.steps.map((step, i) => ({
      id: step.id,
      type: 'step',
      data: { 
        step, 
        isBottleneck: analysis?.bottlenecks.some(b => b.stepId === step.id) 
      },
      position: { x: 250, y: i * 180 + 50 },
    }));
  }, [workflow, analysis]);

  const initialEdges = useMemo(() => {
    const edges = [];
    for (let i = 0; i < workflow.steps.length - 1; i++) {
      const sourceId = workflow.steps[i].id;
      const targetId = workflow.steps[i+1].id;
      const isBottleneck = analysis?.bottlenecks.some(b => b.stepId === sourceId);
      
      edges.push({
        id: `e${sourceId}-${targetId}`,
        source: sourceId,
        target: targetId,
        type: 'bottleneck',
        data: { isBottleneck },
        animated: isBottleneck,
      });
    }
    return edges;
  }, [workflow, analysis]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="h-full w-full rounded-2xl border border-white/[0.06] bg-[#07070b] overflow-hidden relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        className="bg-[#07070b]"
      >
        <Background variant={BackgroundVariant.Dots} color="rgba(255,255,255,0.05)" gap={20} />
        <Controls className="bg-[#0d0d14] border-white/10 fill-white/40" />
        <Panel position="top-right" className="flex gap-2">
          <div className="flex items-center gap-2 bg-[#0d0d14]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 shadow-xl">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Live Analysis Active</span>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}
