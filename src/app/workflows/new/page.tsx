'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { WorkflowForm } from '@/components/workflows/WorkflowForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewWorkflowPage() {
  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <Link href="/workflows">
          <Button variant="ghost" size="sm" className="gap-2 text-white/40 hover:text-white mb-4">
            <ArrowLeft className="h-4 w-4" /> Back to Workflows
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-white tracking-tight">Map New Workflow</h1>
        <p className="text-white/40 mt-1">Define your process steps to detect operational waste.</p>
      </div>

      <WorkflowForm />
    </div>
  );
}
