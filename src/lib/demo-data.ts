import type { Workflow, WorkflowStep, AnalysisResult, Bottleneck, CostAnalysis, AutomationRecommendation, ActionPlan, ActionItem } from './types';

function makeId(): string {
  return Math.random().toString(36).substring(2, 11);
}

// ============================================================
// 1. HR Onboarding Workflow
// ============================================================
const hrSteps: WorkflowStep[] = [
  { id: 'hr1', name: 'Collect candidate documents', owner: 'HR Coordinator', department: 'HR', timeMinutes: 45, type: 'manual', isManual: true, painPoints: ['Email back-and-forth', 'Missing documents'], order: 1 },
  { id: 'hr2', name: 'Verify background check', owner: 'HR Specialist', department: 'HR', timeMinutes: 120, type: 'manual', isManual: true, painPoints: ['Waiting on third-party vendor', 'Manual status tracking'], order: 2 },
  { id: 'hr3', name: 'Create employee accounts', owner: 'IT Admin', department: 'Engineering', timeMinutes: 60, type: 'manual', isManual: true, painPoints: ['5 different systems to provision', 'Copy-paste credentials'], order: 3 },
  { id: 'hr4', name: 'Manager approval', owner: 'Hiring Manager', department: 'Engineering', timeMinutes: 30, type: 'approval', isManual: false, painPoints: ['Sits in inbox for days', 'No visibility on status'], order: 4 },
  { id: 'hr5', name: 'Prepare onboarding materials', owner: 'HR Coordinator', department: 'HR', timeMinutes: 40, type: 'manual', isManual: true, painPoints: ['Manual doc assembly', 'Outdated templates'], order: 5 },
  { id: 'hr6', name: 'Schedule orientation sessions', owner: 'HR Coordinator', department: 'HR', timeMinutes: 25, type: 'manual', isManual: true, painPoints: ['Calendar coordination across 4 teams'], order: 6 },
  { id: 'hr7', name: 'Equipment procurement', owner: 'Office Manager', department: 'Operations', timeMinutes: 90, type: 'manual', isManual: true, painPoints: ['No standard checklist', 'Delayed orders'], order: 7 },
  { id: 'hr8', name: 'First-day checklist completion', owner: 'Buddy/Mentor', department: 'HR', timeMinutes: 60, type: 'manual', isManual: true, painPoints: ['Paper-based checklist', 'Inconsistent experience'], order: 8 },
];

const hrWorkflow: Workflow = {
  id: 'demo-hr-onboarding',
  name: 'New Employee Onboarding',
  department: 'HR',
  description: 'End-to-end process for onboarding a new hire from offer acceptance to first productive day. Involves HR, IT, hiring manager, and office operations.',
  frequency: 'weekly',
  steps: hrSteps,
  createdAt: '2026-01-15T09:00:00Z',
  updatedAt: '2026-05-01T14:30:00Z',
  isDemo: true,
  notes: 'Average 3 new hires per week. Process takes 5-7 business days. Frequent complaints about slow IT provisioning and missing documents.',
  analyzed: true,
};

// ============================================================
// 2. Invoice Approval Workflow
// ============================================================
const invoiceSteps: WorkflowStep[] = [
  { id: 'inv1', name: 'Receive vendor invoice', owner: 'AP Clerk', department: 'Finance', timeMinutes: 10, type: 'manual', isManual: true, painPoints: ['Invoices arrive via email, fax, and mail'], order: 1 },
  { id: 'inv2', name: 'Enter into accounting system', owner: 'AP Clerk', department: 'Finance', timeMinutes: 20, type: 'manual', isManual: true, painPoints: ['Manual data entry', 'Duplicate invoices'], order: 2 },
  { id: 'inv3', name: 'Match PO to invoice', owner: 'AP Clerk', department: 'Finance', timeMinutes: 25, type: 'manual', isManual: true, painPoints: ['Cross-referencing spreadsheets', 'Missing PO numbers'], order: 3 },
  { id: 'inv4', name: 'Department manager approval', owner: 'Dept Manager', department: 'Operations', timeMinutes: 15, type: 'approval', isManual: false, painPoints: ['Approval sits in queue for 2+ days', 'No escalation path'], order: 4 },
  { id: 'inv5', name: 'Finance director sign-off', owner: 'Finance Director', department: 'Finance', timeMinutes: 10, type: 'approval', isManual: false, painPoints: ['Second bottleneck', 'Often out of office'], order: 5 },
  { id: 'inv6', name: 'Schedule payment', owner: 'AP Clerk', department: 'Finance', timeMinutes: 15, type: 'manual', isManual: true, painPoints: ['Manual bank transfer setup', 'Late payment penalties'], order: 6 },
];

const invoiceWorkflow: Workflow = {
  id: 'demo-invoice-approval',
  name: 'Invoice Approval Process',
  department: 'Finance',
  description: 'Multi-step invoice processing from receipt to payment. Involves AP team, department managers, and finance leadership for sign-off.',
  frequency: 'daily',
  steps: invoiceSteps,
  createdAt: '2026-02-01T10:00:00Z',
  updatedAt: '2026-04-28T16:00:00Z',
  isDemo: true,
  notes: 'Process ~15 invoices per day. Average cycle time is 8 days. 12% of invoices have discrepancies requiring rework.',
  analyzed: true,
};

// ============================================================
// 3. Customer Support Escalation
// ============================================================
const supportSteps: WorkflowStep[] = [
  { id: 'cs1', name: 'Ticket received', owner: 'L1 Support Agent', department: 'Customer Support', timeMinutes: 5, type: 'manual', isManual: false, painPoints: ['High volume'], order: 1 },
  { id: 'cs2', name: 'Initial triage & categorization', owner: 'L1 Support Agent', department: 'Customer Support', timeMinutes: 15, type: 'manual', isManual: true, painPoints: ['Inconsistent categorization', 'Wrong routing'], order: 2 },
  { id: 'cs3', name: 'Attempt L1 resolution', owner: 'L1 Support Agent', department: 'Customer Support', timeMinutes: 30, type: 'manual', isManual: true, painPoints: ['Lack of knowledge base', 'Repeated lookups'], order: 3 },
  { id: 'cs4', name: 'Escalate to L2', owner: 'L1 Support Agent', department: 'Customer Support', timeMinutes: 10, type: 'handoff', isManual: true, painPoints: ['Context lost in handoff', 'No warm transfer'], order: 4 },
  { id: 'cs5', name: 'L2 investigation', owner: 'L2 Support Engineer', department: 'Engineering', timeMinutes: 45, type: 'manual', isManual: true, painPoints: ['Re-asks same questions', 'Limited tooling access'], order: 5 },
  { id: 'cs6', name: 'Engineering review (if needed)', owner: 'Software Engineer', department: 'Engineering', timeMinutes: 60, type: 'review', isManual: true, painPoints: ['Interrupts sprint work', 'No SLA for internal requests'], order: 6 },
  { id: 'cs7', name: 'Resolution & customer follow-up', owner: 'L2 Support Engineer', department: 'Customer Support', timeMinutes: 20, type: 'manual', isManual: true, painPoints: ['Manual email drafting', 'No templates'], order: 7 },
];

const supportWorkflow: Workflow = {
  id: 'demo-support-escalation',
  name: 'Customer Support Escalation',
  department: 'Customer Support',
  description: 'Process for handling customer issues from initial ticket through L1/L2 support and potential engineering escalation.',
  frequency: 'daily',
  steps: supportSteps,
  createdAt: '2026-01-20T08:00:00Z',
  updatedAt: '2026-05-02T11:00:00Z',
  isDemo: true,
  notes: '~40 escalations per week. 35% of L1 tickets get escalated. Average resolution time is 3.2 days. Customer satisfaction impacted by slow handoffs.',
  analyzed: true,
};

// ============================================================
// 4. Sales Handoff Workflow
// ============================================================
const salesSteps: WorkflowStep[] = [
  { id: 'sl1', name: 'Deal closed in CRM', owner: 'Account Executive', department: 'Sales', timeMinutes: 15, type: 'manual', isManual: true, painPoints: ['CRM data often incomplete'], order: 1 },
  { id: 'sl2', name: 'Create handoff document', owner: 'Account Executive', department: 'Sales', timeMinutes: 40, type: 'manual', isManual: true, painPoints: ['Manual doc creation', 'Inconsistent format', 'Copy-paste from CRM'], order: 2 },
  { id: 'sl3', name: 'Internal handoff meeting', owner: 'Account Executive', department: 'Sales', timeMinutes: 30, type: 'manual', isManual: false, painPoints: ['Scheduling delays', '3-5 people needed'], order: 3 },
  { id: 'sl4', name: 'CS team setup', owner: 'CS Manager', department: 'Customer Support', timeMinutes: 35, type: 'manual', isManual: true, painPoints: ['Re-entering data into CS tools', 'Missing context'], order: 4 },
  { id: 'sl5', name: 'Customer kickoff scheduling', owner: 'CS Manager', department: 'Customer Support', timeMinutes: 20, type: 'manual', isManual: true, painPoints: ['Back-and-forth emails', 'Timezone coordination'], order: 5 },
];

const salesWorkflow: Workflow = {
  id: 'demo-sales-handoff',
  name: 'Sales-to-CS Handoff',
  department: 'Sales',
  description: 'Process for transitioning closed deals from sales to customer success. Critical for customer experience and retention.',
  frequency: 'weekly',
  steps: salesSteps,
  createdAt: '2026-03-10T09:00:00Z',
  updatedAt: '2026-04-30T15:00:00Z',
  isDemo: true,
  notes: '~8 handoffs per week. Average 4-day delay between close and kickoff. 20% of customers report poor onboarding experience.',
  analyzed: true,
};

// ============================================================
// 5. Weekly Reporting Workflow
// ============================================================
const reportingSteps: WorkflowStep[] = [
  { id: 'rp1', name: 'Pull data from analytics tools', owner: 'Data Analyst', department: 'Operations', timeMinutes: 45, type: 'manual', isManual: true, painPoints: ['5 different data sources', 'Manual exports'], order: 1 },
  { id: 'rp2', name: 'Clean and normalize data', owner: 'Data Analyst', department: 'Operations', timeMinutes: 30, type: 'manual', isManual: true, painPoints: ['Inconsistent formats', 'Missing fields'], order: 2 },
  { id: 'rp3', name: 'Build report in spreadsheet', owner: 'Data Analyst', department: 'Operations', timeMinutes: 60, type: 'manual', isManual: true, painPoints: ['Copy-paste into template', 'Formula errors'], order: 3 },
  { id: 'rp4', name: 'Create executive summary', owner: 'Ops Manager', department: 'Operations', timeMinutes: 30, type: 'manual', isManual: true, painPoints: ['Interpreting raw numbers', 'Repetitive narrative'], order: 4 },
  { id: 'rp5', name: 'Review with leadership', owner: 'VP Operations', department: 'Operations', timeMinutes: 30, type: 'review', isManual: false, painPoints: ['Last-minute changes', 'Version confusion'], order: 5 },
  { id: 'rp6', name: 'Distribute to stakeholders', owner: 'Ops Manager', department: 'Operations', timeMinutes: 15, type: 'manual', isManual: true, painPoints: ['Manual email to 12 people', 'No read tracking'], order: 6 },
];

const reportingWorkflow: Workflow = {
  id: 'demo-weekly-reporting',
  name: 'Weekly Operations Report',
  department: 'Operations',
  description: 'Weekly process to compile, analyze, and distribute operational metrics across the company. Feeds into executive decision-making.',
  frequency: 'weekly',
  steps: reportingSteps,
  createdAt: '2026-02-15T08:00:00Z',
  updatedAt: '2026-05-03T09:00:00Z',
  isDemo: true,
  notes: 'Takes one full analyst day every week. Report is often outdated by the time it reaches leadership. Multiple requests for real-time dashboards.',
  analyzed: true,
};

// ============================================================
// Demo Workflows Export
// ============================================================
export const DEMO_WORKFLOWS: Workflow[] = [
  hrWorkflow,
  invoiceWorkflow,
  supportWorkflow,
  salesWorkflow,
  reportingWorkflow,
];

// ============================================================
// Pre-computed Analysis Results
// ============================================================

function generateBottlenecks(workflow: Workflow): Bottleneck[] {
  const bottlenecks: Bottleneck[] = [];
  const hourlyRate = 55;

  for (const step of workflow.steps) {
    if (step.type === 'approval') {
      bottlenecks.push({
        id: `bn-${step.id}`,
        workflowId: workflow.id,
        stepId: step.id,
        type: 'approval_delay',
        severity: 8,
        title: `Approval bottleneck at "${step.name}"`,
        description: `The approval step "${step.name}" owned by ${step.owner} causes an average 2-day delay. ${step.painPoints.join('. ')}.`,
        timeWastedMinutes: step.timeMinutes * 3,
        costImpact: (step.timeMinutes * 3 / 60) * hourlyRate,
        affectedStep: step.name,
        recommendation: `Implement auto-approval rules for routine cases and set up escalation timers with notifications.`,
      });
    }
    if (step.isManual && step.timeMinutes >= 30) {
      bottlenecks.push({
        id: `bn-manual-${step.id}`,
        workflowId: workflow.id,
        stepId: step.id,
        type: 'manual_repetition',
        severity: Math.min(10, Math.floor(step.timeMinutes / 10)),
        title: `Manual time sink: "${step.name}"`,
        description: `${step.owner} spends ${step.timeMinutes} minutes on this manual step each occurrence. Pain points: ${step.painPoints.join(', ')}.`,
        timeWastedMinutes: Math.floor(step.timeMinutes * 0.6),
        costImpact: (step.timeMinutes * 0.6 / 60) * hourlyRate,
        affectedStep: step.name,
        recommendation: `Automate data collection and processing. Use integrations to eliminate manual data entry.`,
      });
    }
    if (step.painPoints.some(p => p.toLowerCase().includes('copy') || p.toLowerCase().includes('re-enter') || p.toLowerCase().includes('manual'))) {
      if (!bottlenecks.find(b => b.stepId === step.id && b.type === 'copy_paste')) {
        bottlenecks.push({
          id: `bn-cp-${step.id}`,
          workflowId: workflow.id,
          stepId: step.id,
          type: 'copy_paste',
          severity: 6,
          title: `Data duplication in "${step.name}"`,
          description: `Manual copy-paste or re-entry of data at this step. High risk of errors and wasted effort.`,
          timeWastedMinutes: Math.floor(step.timeMinutes * 0.4),
          costImpact: (step.timeMinutes * 0.4 / 60) * hourlyRate,
          affectedStep: step.name,
          recommendation: `Set up API integrations between systems to auto-sync data. Eliminate manual data transfer.`,
        });
      }
    }
    if (step.type === 'handoff') {
      bottlenecks.push({
        id: `bn-ho-${step.id}`,
        workflowId: workflow.id,
        stepId: step.id,
        type: 'slow_handoff',
        severity: 7,
        title: `Slow handoff at "${step.name}"`,
        description: `Context is lost during the handoff from ${step.owner}. ${step.painPoints.join('. ')}.`,
        timeWastedMinutes: step.timeMinutes * 2,
        costImpact: (step.timeMinutes * 2 / 60) * hourlyRate,
        affectedStep: step.name,
        recommendation: `Create structured handoff templates with required fields. Use shared workspaces for context continuity.`,
      });
    }
  }
  return bottlenecks;
}

function generateCostAnalysis(workflow: Workflow, bottlenecks: Bottleneck[]): CostAnalysis {
  const hourlyRate = 55;
  const totalWastedMinutes = bottlenecks.reduce((sum, b) => sum + b.timeWastedMinutes, 0);
  const freq = { daily: 5, weekly: 1, biweekly: 0.5, monthly: 0.23, quarterly: 0.077 };
  const weeklyMultiplier = freq[workflow.frequency] || 1;
  const hoursWastedPerWeek = (totalWastedMinutes / 60) * weeklyMultiplier;
  const weeklyCost = hoursWastedPerWeek * hourlyRate;
  const annualCost = weeklyCost * 52;
  const automatable = workflow.steps.filter(s => s.isManual).length / workflow.steps.length;
  const potentialSavings = annualCost * automatable * 0.7;

  return {
    workflowId: workflow.id,
    hoursWastedPerWeek: Math.round(hoursWastedPerWeek * 10) / 10,
    estimatedSalaryCostPerWeek: Math.round(weeklyCost),
    annualCostLoss: Math.round(annualCost),
    potentialSavings: Math.round(potentialSavings),
    roiEstimate: Math.round((potentialSavings / (potentialSavings * 0.2)) * 100),
    automationCoverage: Math.round(automatable * 100),
  };
}

function generateRecommendations(workflow: Workflow, bottlenecks: Bottleneck[]): AutomationRecommendation[] {
  const tools: Record<string, string> = {
    approval_delay: 'Slack Workflows / Jira Automation',
    manual_repetition: 'Zapier / Make.com',
    duplicate_work: 'Notion / Confluence Templates',
    unclear_ownership: 'Linear / Asana',
    copy_paste: 'Retool / n8n',
    unnecessary_meeting: 'Loom / Async Standups',
    slow_handoff: 'Slack Channels / Shared Docs',
    high_cost: 'Custom Internal Tool',
  };

  return bottlenecks.map((b, i) => ({
    id: `rec-${b.id}`,
    workflowId: workflow.id,
    bottleneckId: b.id,
    title: `Automate: ${b.affectedStep}`,
    description: b.recommendation,
    estimatedTimeSavedMinutes: b.timeWastedMinutes,
    difficulty: b.severity >= 8 ? 'Hard' as const : b.severity >= 5 ? 'Medium' as const : 'Easy' as const,
    priority: b.severity >= 8 ? 'P0' as const : b.severity >= 6 ? 'P1' as const : b.severity >= 4 ? 'P2' as const : 'P3' as const,
    affectedDepartment: workflow.department,
    suggestedTool: tools[b.type] || 'Zapier',
    implementationSteps: [
      'Audit current manual process',
      'Define automation requirements',
      `Set up ${tools[b.type] || 'automation tool'}`,
      'Test with sample data',
      'Train team members',
      'Monitor and iterate',
    ],
    status: i === 0 ? 'in_progress' as const : 'planned' as const,
  }));
}

function generateAnalysis(workflow: Workflow): AnalysisResult {
  const bottlenecks = generateBottlenecks(workflow);
  const costAnalysis = generateCostAnalysis(workflow, bottlenecks);
  const recommendations = generateRecommendations(workflow, bottlenecks);
  const manualSteps = workflow.steps.filter(s => s.isManual).length;
  const healthScore = Math.max(10, 100 - (bottlenecks.length * 8) - (manualSteps * 5));

  return {
    id: `analysis-${workflow.id}`,
    workflowId: workflow.id,
    bottlenecks,
    costAnalysis,
    recommendations,
    workflowHealthScore: healthScore,
    summary: `Analysis of "${workflow.name}" identified ${bottlenecks.length} bottlenecks causing an estimated ${costAnalysis.hoursWastedPerWeek} hours of waste per week ($${costAnalysis.annualCostLoss.toLocaleString()}/year). ${recommendations.filter(r => r.difficulty === 'Easy').length} quick wins available for immediate implementation.`,
    analyzedAt: new Date().toISOString(),
    isAI: false,
  };
}

export const DEMO_ANALYSES: AnalysisResult[] = DEMO_WORKFLOWS.map(generateAnalysis);

function generateActionPlan(workflow: Workflow, analysis: AnalysisResult): ActionPlan {
  const items: ActionItem[] = analysis.recommendations.map((rec, i) => ({
    id: `action-${rec.id}`,
    workflowId: workflow.id,
    recommendationId: rec.id,
    title: rec.title,
    description: rec.description,
    owner: workflow.steps.find(s => s.id === analysis.bottlenecks.find(b => b.id === rec.bottleneckId)?.stepId)?.owner || 'Operations Lead',
    deadline: new Date(Date.now() + (i + 1) * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    expectedImpact: `Save ~${Math.round(rec.estimatedTimeSavedMinutes / 60 * 10) / 10} hours per occurrence`,
    estimatedSavingsPerWeek: Math.round(rec.estimatedTimeSavedMinutes / 60 * 55),
    status: i === 0 ? 'in_progress' as const : 'planned' as const,
    phase: rec.difficulty === 'Easy' ? 'quick_win' as const : rec.difficulty === 'Medium' ? 'medium_term' as const : 'strategic' as const,
    checklist: rec.implementationSteps.map((step, j) => ({ text: step, done: i === 0 && j < 2 })),
  }));

  return {
    id: `plan-${workflow.id}`,
    workflowId: workflow.id,
    items,
    totalEstimatedSavings: items.reduce((s, item) => s + item.estimatedSavingsPerWeek * 52, 0),
    createdAt: new Date().toISOString(),
  };
}

export const DEMO_ACTION_PLANS: ActionPlan[] = DEMO_WORKFLOWS.map((wf, i) => generateActionPlan(wf, DEMO_ANALYSES[i]));
