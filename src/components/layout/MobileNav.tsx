'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, GitBranch, BarChart3, Map, DollarSign,
  Lightbulb, CheckSquare, Zap, Menu, X,
} from 'lucide-react';
import { NAV_ITEMS } from '@/lib/constants';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, GitBranch, BarChart3, Map, DollarSign, Lightbulb, CheckSquare,
};

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.03] lg:hidden" />
        }
      >
        <Menu className="h-5 w-5 text-white/70" />
      </SheetTrigger>
      <SheetContent side="left" className="w-[260px] border-white/[0.06] bg-[#0a0a0f] p-0">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <div className="flex h-16 items-center gap-2.5 border-b border-white/[0.06] px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="text-[15px] font-semibold text-white">FlowLedger</span>
        </div>
        <nav className="space-y-0.5 px-3 py-4">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            const Icon = iconMap[item.icon] || LayoutDashboard;
            return (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                <div className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors ${
                  isActive ? 'bg-white/[0.07] text-white' : 'text-white/50 hover:bg-white/[0.04] hover:text-white/80'
                }`}>
                  <Icon className={`h-4 w-4 ${isActive ? 'text-indigo-400' : 'text-white/40'}`} />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
