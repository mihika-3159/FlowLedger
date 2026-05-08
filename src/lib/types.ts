// ============================================================
// FlowLedger Core Type Definitions
// ============================================================

export type Department =
  | 'Engineering'
  | 'HR'
  | 'Finance'
  | 'Sales'
  | 'Marketing'
  | 'Operations'
  | 'Customer Support'
  | 'Legal'
  | 'Product'
  | 'Design';

export type Frequency = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly';

export type Priority = 'P0' | 'P1' | 'P2' | 'P3';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type StepType = 'manual' | 'automated' | 'semi-automated' | 'approval' | 'handoff' | 'review';

export type BottleneckType =
  | 'approval_delay'
  | 'manual_repetition'
  | 'duplicate_work'
  | 'unclear_ownership'
  | 'copy_paste'
  | 'unnecessary_meeting'
  | 'slow_handoff'
  | 'high_cost';

export type ActionStatus = 'planned' | 'in_progress' | 'completed' | 'skipped';

// ============================================================
// Workflow Data Structures
// ============================================================

export interface WorkflowStep {
  id: string;
  name: string;
  owner: string;
  department: Department;
  timeMinutes: number;
  type: StepType;
  isManual: boolean;
  painPoints: string[];
  description?: string;
  order: number;
}

export interface Workflow {
  id: string;
  name: string;
  department: Department;
  description: string;
  frequency: Frequency;
  steps: WorkflowStep[];
  createdAt: string;
  updatedAt: string;
  isDemo: boolean;
  notes?: string;
  analyzed: boolean;
}

// ============================================================
// Analysis Results
// ============================================================

export interface Bottleneck {
  id: string;
  workflowId: string;
  stepId: string;
  type: BottleneckType;
  severity: number; // 1-10
  title: string;
  description: string;
  timeWastedMinutes: number;
  costImpact: number;
  affectedStep: string;
  recommendation: string;
}

export interface CostAnalysis {
  workflowId: string;
  hoursWastedPerWeek: number;
  estimatedSalaryCostPerWeek: number;
  annualCostLoss: number;
  potentialSavings: number;
  roiEstimate: number; // percentage
  automationCoverage: number; // percentage of steps that can be automated
}

export interface AutomationRecommendation {
  id: string;
  workflowId: string;
  bottleneckId: string;
  title: string;
  description: string;
  estimatedTimeSavedMinutes: number;
  difficulty: Difficulty;
  priority: Priority;
  affectedDepartment: Department;
  suggestedTool: string;
  implementationSteps: string[];
  status: ActionStatus;
}

export interface AnalysisResult {
  id: string;
  workflowId: string;
  bottlenecks: Bottleneck[];
  costAnalysis: CostAnalysis;
  recommendations: AutomationRecommendation[];
  workflowHealthScore: number; // 0-100
  summary: string;
  analyzedAt: string;
  isAI: boolean;
}

// ============================================================
// Action Plan
// ============================================================

export interface ActionItem {
  id: string;
  workflowId: string;
  recommendationId: string;
  title: string;
  description: string;
  owner: string;
  deadline: string;
  expectedImpact: string;
  estimatedSavingsPerWeek: number;
  status: ActionStatus;
  phase: 'quick_win' | 'medium_term' | 'strategic';
  checklist: { text: string; done: boolean }[];
}

export interface ActionPlan {
  id: string;
  workflowId: string;
  items: ActionItem[];
  totalEstimatedSavings: number;
  createdAt: string;
}

// ============================================================
// Dashboard Aggregates
// ============================================================

export interface DashboardMetrics {
  totalHoursWasted: number;
  estimatedAnnualSavings: number;
  topBottlenecks: Bottleneck[];
  workflowHealthScore: number;
  quickWinsCount: number;
  highImpactCount: number;
  automationBacklogCount: number;
  totalWorkflows: number;
  analyzedWorkflows: number;
  wasteByDepartment: { department: string; hours: number; cost: number }[];
  wasteByType: { type: string; count: number; hours: number }[];
  savingsTrend: { month: string; projected: number; actual: number }[];
}

// ============================================================
// App State
// ============================================================

export interface AppState {
  workflows: Workflow[];
  analyses: AnalysisResult[];
  actionPlans: ActionPlan[];
  isDemoLoaded: boolean;
  settings: {
    avgHourlyRate: number;
    workHoursPerYear: number;
    currency: string;
  };
}
