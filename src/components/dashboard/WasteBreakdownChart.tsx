'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BOTTLENECK_LABELS, BOTTLENECK_COLORS } from '@/lib/constants';
import type { BottleneckType } from '@/lib/types';

interface Props {
  data: { type: string; count: number; hours: number }[];
}

export function WasteBreakdownChart({ data }: Props) {
  const chartData = data.map(d => ({
    ...d,
    label: BOTTLENECK_LABELS[d.type as BottleneckType] || d.type,
    fill: BOTTLENECK_COLORS[d.type as BottleneckType] || '#6366f1',
  }));

  if (chartData.length === 0) return null;

  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
          <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} />
          <YAxis type="category" dataKey="label" axisLine={false} tickLine={false} width={120} tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} />
          <Tooltip
            contentStyle={{ background: '#0d0d14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px', color: '#fff' }}
            formatter={(value: number) => [`${value} hrs/wk`, 'Waste']}
          />
          <Bar dataKey="hours" radius={[0, 4, 4, 0]} barSize={18}>
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.fill} fillOpacity={0.8} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
