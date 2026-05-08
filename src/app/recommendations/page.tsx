'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { RecommendationCard } from '@/components/recommendations/RecommendationCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Lightbulb, 
  Search, 
  Filter, 
  Sparkles, 
  ArrowRight,
  Plus,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { staggerContainer } from '@/lib/constants';

export default function RecommendationsPage() {
  const searchParams = useSearchParams();
  const { state, dispatch } = useStore();
  const [searchQuery, setSearchQuery] = React.useState('');

  const workflowId = searchParams.get('workflowId');
  const recId = searchParams.get('id');

  const allRecommendations = state.analyses.flatMap(a => 
    a.recommendations.map(r => ({ ...r, analysisId: a.id }))
  );

  const filteredRecs = allRecommendations.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.suggestedTool.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesWorkflow = workflowId ? r.workflowId === workflowId : true;
    const matchesId = recId ? r.id === recId : true;
    return matchesSearch && matchesWorkflow && matchesId;
  });

  const handleStatusUpdate = (analysisId: string, recommendationId: string, status: any) => {
    dispatch({ 
      type: 'UPDATE_RECOMMENDATION_STATUS', 
      payload: { analysisId, recId: recommendationId, status } 
    });
  };

  const workflow = state.workflows.find(w => w.id === workflowId);

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          {workflowId && (
            <Link href={`/analysis?id=${workflowId}`}>
              <Button variant="ghost" size="sm" className="h-8 p-0 text-white/30 hover:text-white gap-2">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Analysis
              </Button>
            </Link>
          )}
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Automation Backlog
            {workflow && <span className="text-white/30 ml-2">/ {workflow.name}</span>}
          </h1>
          <p className="text-sm text-white/40">Prioritized automation opportunities to eliminate workflow waste.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/10 bg-white/5 text-white/60 gap-2">
            <Filter className="h-4 w-4" /> Filter Priority
          </Button>
          <Link href="/action-plan">
            <Button className="bg-indigo-500 hover:bg-indigo-600 gap-2">
              Action Plan <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
        <Input 
          placeholder="Search recommendations or tools..." 
          className="pl-10 bg-white/[0.03] border-white/[0.08]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredRecs.length > 0 ? (
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredRecs.map((rec, idx) => (
            <RecommendationCard 
              key={rec.id} 
              recommendation={rec} 
              index={idx} 
              onStatusUpdate={(status) => handleStatusUpdate(rec.analysisId, rec.id, status)}
            />
          ))}
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
            <Lightbulb className="h-8 w-8 text-white/10" />
          </div>
          <h3 className="text-lg font-semibold text-white">No recommendations found</h3>
          <p className="text-sm text-white/40 mt-1">Try clearing filters or analyze more workflows.</p>
        </div>
      )}
    </div>
  );
}
