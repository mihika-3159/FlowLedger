// ============================================================
// FlowLedger Design Constants & Configuration
// ============================================================

import type { Department, BottleneckType, Priority, Difficulty, Frequency } from './types';

// ============================================================
// Navigation
// ============================================================

export const NAV_ITEMS = [
  { label: 'Dashboard', href: '/', icon: 'LayoutDashboard' },
  { label: 'Workflows', href: '/workflows', icon: 'GitBranch' },
  { label: 'Analysis', href: '/analysis', icon: 'BarChart3' },
  { label: 'Workflow Map', href: '/workflow-map', icon: 'Map' },
  { label: 'Savings', href: '/savings', icon: 'DollarSign' },
  { label: 'Recommendations', href: '/recommendations', icon: 'Lightbulb' },
  { label: 'Action Plan', href: '/action-plan', icon: 'CheckSquare' },
] as const;

// ============================================================
// Default Settings
// ============================================================

export const DEFAULT_SETTINGS = {
  avgHourlyRate: 55,
  workHoursPerYear: 2080,
  currency: 'USD',
};

// ============================================================
// Label Maps
// ============================================================

export const DEPARTMENT_COLORS: Record<Department, string> = {
  Engineering: '#6366f1',
  HR: '#ec4899',
  Finance: '#10b981',
  Sales: '#f59e0b',
  Marketing: '#8b5cf6',
  Operations: '#06b6d4',
  'Customer Support': '#f97316',
  Legal: '#64748b',
  Product: '#14b8a6',
  Design: '#e879f9',
};

export const BOTTLENECK_LABELS: Record<BottleneckType, string> = {
  approval_delay: 'Approval Delay',
  manual_repetition: 'Manual Repetition',
  duplicate_work: 'Duplicate Work',
  unclear_ownership: 'Unclear Ownership',
  copy_paste: 'Copy-Paste Work',
  unnecessary_meeting: 'Unnecessary Meeting',
  slow_handoff: 'Slow Handoff',
  high_cost: 'High-Cost Bottleneck',
};

export const BOTTLENECK_COLORS: Record<BottleneckType, string> = {
  approval_delay: '#ef4444',
  manual_repetition: '#f59e0b',
  duplicate_work: '#f97316',
  unclear_ownership: '#8b5cf6',
  copy_paste: '#ec4899',
  unnecessary_meeting: '#64748b',
  slow_handoff: '#06b6d4',
  high_cost: '#dc2626',
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  P0: 'Critical',
  P1: 'High',
  P2: 'Medium',
  P3: 'Low',
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  P0: '#ef4444',
  P1: '#f59e0b',
  P2: '#3b82f6',
  P3: '#64748b',
};

export const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  Easy: '#10b981',
  Medium: '#f59e0b',
  Hard: '#ef4444',
};

export const FREQUENCY_LABELS: Record<Frequency, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  biweekly: 'Bi-weekly',
  monthly: 'Monthly',
  quarterly: 'Quarterly',
};

export const FREQUENCY_MULTIPLIER: Record<Frequency, number> = {
  daily: 260,
  weekly: 52,
  biweekly: 26,
  monthly: 12,
  quarterly: 4,
};

// ============================================================
// Animation Variants (Framer Motion)
// ============================================================

export const fadeInUp: any = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" },
};

export const fadeIn: any = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.3 },
};

export const staggerContainer: any = {
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export const scaleIn: any = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.3, ease: "easeOut" },
};

export const slideInLeft: any = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.4, ease: "easeOut" },
};
