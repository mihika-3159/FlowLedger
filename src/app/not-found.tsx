'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] items-center justify-center p-8 text-center">
      <div className="h-20 w-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-8">
        <ShieldAlert className="h-10 w-10 text-red-400" />
      </div>
      <h1 className="text-4xl font-bold text-white tracking-tight">404</h1>
      <h2 className="text-xl font-semibold text-white/80 mt-2">Process Lost in Transit</h2>
      <p className="mt-4 max-w-md text-white/40 text-sm">
        The workflow or page you're looking for doesn't exist or has been archived. 
        Try returning to your dashboard.
      </p>
      <Link href="/" className="mt-8">
        <Button className="bg-indigo-500 hover:bg-indigo-600 gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Button>
      </Link>
    </div>
  );
}
