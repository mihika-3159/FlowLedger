'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: { value: number; label: string };
  color: string;
  delay?: number;
}

export function MetricCard({ title, value, subtitle, icon, trend, color, delay = 0 }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Card className="glass-card group relative overflow-hidden border-white/[0.06] bg-transparent transition-all duration-300 hover:border-white/[0.12] hover:shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: `linear-gradient(135deg, ${color}08, transparent)` }} />
        <CardContent className="relative p-5">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">{title}</p>
              <motion.p
                className="mt-2 text-2xl font-bold tracking-tight text-white"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: delay + 0.2 }}
              >
                {value}
              </motion.p>
              {subtitle && <p className="mt-1 text-[11px] text-white/30">{subtitle}</p>}
              {trend && (
                <div className="mt-2 flex items-center gap-1.5">
                  <span className={`text-[11px] font-medium ${trend.value >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
                  </span>
                  <span className="text-[10px] text-white/25">{trend.label}</span>
                </div>
              )}
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl transition-colors duration-300" style={{ backgroundColor: `${color}15`, color }}>
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
