'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Trash2, 
  ArrowRight, 
  ArrowLeft, 
  Save, 
  Clock, 
  User, 
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  GitCommit
} from 'lucide-react';
import type { Department, Frequency, Workflow, WorkflowStep, StepType } from '@/lib/types';
import { fadeInUp, slideInLeft } from '@/lib/constants';

const DEPARTMENTS: Department[] = [
  'Engineering', 'HR', 'Finance', 'Sales', 'Marketing', 
  'Operations', 'Customer Support', 'Legal', 'Product', 'Design'
];

const FREQUENCIES: Frequency[] = ['daily', 'weekly', 'biweekly', 'monthly', 'quarterly'];

const STEP_TYPES: { value: StepType; label: string }[] = [
  { value: 'manual', label: 'Manual Task' },
  { value: 'automated', label: 'Automated Task' },
  { value: 'approval', label: 'Approval Gate' },
  { value: 'handoff', label: 'Handoff' },
  { value: 'review', label: 'Review' },
];

export function WorkflowForm() {
  const router = useRouter();
  const { dispatch } = useStore();
  const [step, setStep] = React.useState(1);
  
  // Form State
  const [formData, setFormData] = React.useState<Partial<Workflow>>({
    name: '',
    department: 'Operations',
    description: '',
    frequency: 'weekly',
    steps: [],
    notes: ''
  });

  const [currentSteps, setCurrentSteps] = React.useState<WorkflowStep[]>([]);

  const addStep = () => {
    const newStep: WorkflowStep = {
      id: Math.random().toString(36).substring(2, 11),
      name: '',
      owner: '',
      department: formData.department as Department,
      timeMinutes: 15,
      type: 'manual',
      isManual: true,
      painPoints: [],
      order: currentSteps.length + 1
    };
    setCurrentSteps([...currentSteps, newStep]);
  };

  const updateStep = (id: string, updates: Partial<WorkflowStep>) => {
    setCurrentSteps(currentSteps.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const removeStep = (id: string) => {
    setCurrentSteps(currentSteps.filter(s => s.id !== id).map((s, i) => ({ ...s, order: i + 1 })));
  };

  const handleSubmit = () => {
    if (!formData.name || currentSteps.length === 0) return;

    const newWorkflow: Workflow = {
      ...(formData as Workflow),
      id: `wf-${Math.random().toString(36).substring(2, 11)}`,
      steps: currentSteps,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDemo: false,
      analyzed: false
    };

    dispatch({ type: 'ADD_WORKFLOW', payload: newWorkflow });
    router.push('/workflows');
  };

  const isStep1Valid = formData.name && formData.description;
  const isStep2Valid = currentSteps.length > 0 && currentSteps.every(s => s.name && s.owner);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8 flex items-center justify-between px-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300 ${
              step >= i ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-white/10 bg-white/5 text-white/20'
            }`}>
              {step > i ? <CheckCircle2 className="h-5 w-5" /> : i}
            </div>
            {i < 3 && (
              <div className={`h-0.5 flex-1 mx-2 transition-all duration-300 ${
                step > i ? 'bg-indigo-500' : 'bg-white/10'
              }`} />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            {...fadeInUp}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">Basic Information</h2>
              <p className="text-sm text-white/40">Give your workflow a name and define its scope.</p>
            </div>

            <Card className="glass-card border-white/[0.06] bg-transparent">
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Workflow Name</Label>
                  <Input 
                    id="name" 
                    placeholder="e.g. Monthly Payroll Processing" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-white/5 border-white/10"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Primary Department</Label>
                    <Select 
                      value={formData.department} 
                      onValueChange={(v) => setFormData({ ...formData, department: v as Department })}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0d0d14] border-white/10">
                        {DEPARTMENTS.map(d => (
                          <SelectItem key={d} value={d}>{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Frequency</Label>
                    <Select 
                      value={formData.frequency} 
                      onValueChange={(v) => setFormData({ ...formData, frequency: v as Frequency })}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0d0d14] border-white/10">
                        {FREQUENCIES.map(f => (
                          <SelectItem key={f} value={f} className="capitalize">{f}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Process Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Briefly describe why this process exists and what it accomplishes..." 
                    className="bg-white/5 border-white/10 min-h-[100px]"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button 
                disabled={!isStep1Valid}
                onClick={() => setStep(2)}
                className="bg-indigo-500 hover:bg-indigo-600 gap-2"
              >
                Next: Define Steps <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            {...fadeInUp}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">Workflow Steps</h2>
              <p className="text-sm text-white/40">Break down the process into individual tasks and owners.</p>
            </div>

            <div className="space-y-4">
              {currentSteps.map((s, idx) => (
                <motion.div key={s.id} {...slideInLeft} transition={{ delay: idx * 0.05 }}>
                  <Card className="glass-card border-white/[0.06] bg-transparent group">
                    <CardContent className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-white/5 border-white/10 text-white/40 h-6">Step {s.order}</Badge>
                          <GitCommit className="h-4 w-4 text-indigo-400/50" />
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeStep(s.id)}
                          className="h-8 w-8 text-white/20 hover:text-red-400 hover:bg-red-400/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-[11px] text-white/40">Step Name</Label>
                          <Input 
                            placeholder="e.g. Data Export" 
                            className="bg-white/5 border-white/10 h-9 text-sm"
                            value={s.name}
                            onChange={(e) => updateStep(s.id, { name: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[11px] text-white/40">Owner Role/Name</Label>
                          <Input 
                            placeholder="e.g. Ops Manager" 
                            className="bg-white/5 border-white/10 h-9 text-sm"
                            value={s.owner}
                            onChange={(e) => updateStep(s.id, { owner: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label className="text-[11px] text-white/40">Type</Label>
                          <Select 
                            value={s.type} 
                            onValueChange={(v) => updateStep(s.id, { type: v as StepType, isManual: v === 'manual' })}
                          >
                            <SelectTrigger className="bg-white/5 border-white/10 h-9 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#0d0d14] border-white/10">
                              {STEP_TYPES.map(st => (
                                <SelectItem key={st.value} value={st.value}>{st.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[11px] text-white/40">Time (Minutes)</Label>
                          <div className="flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5 text-white/20" />
                            <Input 
                              type="number" 
                              className="bg-white/5 border-white/10 h-9 text-sm"
                              value={s.timeMinutes}
                              onChange={(e) => updateStep(s.id, { timeMinutes: parseInt(e.target.value) || 0 })}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[11px] text-white/40">Manual Process?</Label>
                          <div className="flex h-9 items-center px-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className={`h-7 w-full text-[10px] transition-all ${
                                s.isManual ? 'bg-amber-500/10 border-amber-500/50 text-amber-500' : 'bg-white/5 border-white/10 text-white/30'
                              }`}
                              onClick={() => updateStep(s.id, { isManual: !s.isManual })}
                            >
                              {s.isManual ? 'YES (Manual)' : 'NO (Automated)'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              <Button 
                variant="outline" 
                onClick={addStep}
                className="w-full border-dashed border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 h-12 gap-2 text-white/40"
              >
                <Plus className="h-4 w-4" /> Add Workflow Step
              </Button>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="ghost" onClick={() => setStep(1)} className="gap-2 text-white/40">
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
              <Button 
                disabled={!isStep2Valid}
                onClick={() => setStep(3)}
                className="bg-indigo-500 hover:bg-indigo-600 gap-2"
              >
                Next: Finalize <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            {...fadeInUp}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">Final Review & Notes</h2>
              <p className="text-sm text-white/40">Add any additional context for AI analysis.</p>
            </div>

            <Card className="glass-card border-white/[0.06] bg-transparent">
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label>Workflow Summary</Label>
                  <div className="rounded-lg bg-white/5 p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/40">Name:</span>
                      <span className="text-white font-medium">{formData.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/40">Total Steps:</span>
                      <span className="text-white font-medium">{currentSteps.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/40">Est. Total Time:</span>
                      <span className="text-white font-medium">
                        {currentSteps.reduce((acc, s) => acc + s.timeMinutes, 0)} minutes
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes / Pain Points (Optional)</Label>
                  <Textarea 
                    id="notes" 
                    placeholder="Paste meeting notes, Slack thread summaries, or specific bottlenecks you've noticed..." 
                    className="bg-white/5 border-white/10 min-h-[150px]"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                  <p className="text-[10px] text-white/30 flex items-center gap-1.5">
                    <AlertCircle className="h-3 w-3" />
                    AI will use these notes to identify subtle bottlenecks.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between pt-4">
              <Button variant="ghost" onClick={() => setStep(2)} className="gap-2 text-white/40">
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
              <Button 
                onClick={handleSubmit}
                className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:shadow-indigo-500/20 shadow-lg gap-2"
              >
                <Save className="h-4 w-4" /> Save & Map Workflow
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
