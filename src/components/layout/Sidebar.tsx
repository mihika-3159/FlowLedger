'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, GitBranch, BarChart3, Map, DollarSign,
  Lightbulb, CheckSquare, Zap,
} from 'lucide-react';
import { NAV_ITEMS } from '@/lib/constants';

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, GitBranch, BarChart3, Map, DollarSign, Lightbulb, CheckSquare,
};

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[240px] flex-col border-r border-white/[0.06] bg-[#0a0a0f]/95 backdrop-blur-xl lg:flex">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 border-b border-white/[0.06] px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/20">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <span className="text-[15px] font-semibold tracking-tight text-white">FlowLedger</span>
        <span className="ml-auto rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-medium text-indigo-400 ring-1 ring-indigo-500/20">v1.0</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-white/30">Platform</p>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = iconMap[item.icon] || LayoutDashboard;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-white/[0.07] text-white shadow-sm'
                    : 'text-white/50 hover:bg-white/[0.04] hover:text-white/80'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-indigo-500"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className={`h-4 w-4 ${isActive ? 'text-indigo-400' : 'text-white/40 group-hover:text-white/60'}`} />
                {item.label}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/[0.06] p-4">
        <div className="rounded-lg bg-gradient-to-br from-indigo-500/10 to-violet-500/10 p-3 ring-1 ring-indigo-500/10">
          <p className="text-[11px] font-medium text-indigo-300">Workflow Intelligence</p>
          <p className="mt-0.5 text-[10px] text-white/40">AI-powered waste detection</p>
        </div>
      </div>
    </aside>
  );
}
