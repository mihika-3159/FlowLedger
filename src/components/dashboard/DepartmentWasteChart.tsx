'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { DEPARTMENT_COLORS } from '@/lib/constants';
import type { Department } from '@/lib/types';

interface Props {
  data: { department: string; hours: number; cost: number }[];
}

export function DepartmentWasteChart({ data }: Props) {
  if (data.length === 0) return null;

  const chartData = data.map(d => ({
    ...d,
    fill: DEPARTMENT_COLORS[d.department as Department] || '#6366f1',
  }));

  return (
    <div className="flex items-center gap-4">
      <div className="h-[200px] w-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={chartData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="hours" stroke="none" paddingAngle={3}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.fill} fillOpacity={0.85} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: '#0d0d14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px', color: '#fff' }}
              formatter={(value: any) => [`${value} hrs/wk`, 'Waste']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-col gap-2">
        {chartData.map((d, i) => (
          <div key={i} className="flex items-center gap-2 text-[11px]">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: d.fill }} />
            <span className="text-white/60">{d.department}</span>
            <span className="ml-auto text-white/30">{d.hours}h</span>
          </div>
        ))}
      </div>
    </div>
  );
}
