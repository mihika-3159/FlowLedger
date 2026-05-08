'use client';

import React from 'react';
import { BaseEdge, EdgeProps, getSmoothStepPath, EdgeLabelRenderer } from '@xyflow/react';
import { AlertCircle } from 'lucide-react';

export function BottleneckEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data
}: EdgeProps<any>) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const isBottleneck = data?.isBottleneck;

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: isBottleneck ? '#ef4444' : 'rgba(255,255,255,0.1)',
          strokeWidth: isBottleneck ? 3 : 1.5,
          transition: 'stroke 0.3s, stroke-width 0.3s',
        }}
      />
      {isBottleneck && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="flex items-center gap-1.5 rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-bold text-white shadow-lg ring-4 ring-[#07070b]"
          >
            <AlertCircle className="h-3 w-3" />
            BOTTLENECK
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
