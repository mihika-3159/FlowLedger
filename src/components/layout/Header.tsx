'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MobileNav } from './MobileNav';
import { Sparkles, Database, Trash2 } from 'lucide-react';
import { NAV_ITEMS } from '@/lib/constants';

export function Header() {
  const pathname = usePathname();
  const { state, dispatch } = useStore();

  const currentPage = NAV_ITEMS.find(
    item => pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
  );
  const pageTitle = currentPage?.label || 'Dashboard';

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/[0.06] bg-[#0a0a0f]/80 px-4 backdrop-blur-xl lg:px-8">
      <div className="flex items-center gap-3">
        <MobileNav />
        <div>
          <h1 className="text-[15px] font-semibold text-white">{pageTitle}</h1>
          <p className="text-[11px] text-white/30">
            {state.workflows.length} workflows · {state.analyses.length} analyzed
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {!state.isDemoLoaded ? (
          <Button
            size="sm"
            onClick={() => dispatch({ type: 'LOAD_DEMO_DATA' })}
            className="gap-1.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-xs font-medium text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 border-0"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Load Demo Data
          </Button>
        ) : (
          <Badge variant="outline" className="gap-1 border-indigo-500/30 bg-indigo-500/10 text-indigo-300">
            <Database className="h-3 w-3" />
            Demo Active
          </Badge>
        )}
        {state.workflows.length > 0 && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              if (confirm('Clear all data? This cannot be undone.')) {
                dispatch({ type: 'CLEAR_DATA' });
              }
            }}
            className="text-xs text-white/30 hover:text-red-400"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </header>
  );
}
