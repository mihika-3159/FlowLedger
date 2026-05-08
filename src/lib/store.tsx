'use client';

import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { AppState, Workflow, AnalysisResult, ActionPlan } from './types';
import { DEFAULT_SETTINGS } from './constants';
import { DEMO_WORKFLOWS, DEMO_ANALYSES, DEMO_ACTION_PLANS } from './demo-data';

const STORAGE_KEY = 'flowledger-state';

const initialState: AppState = {
  workflows: [],
  analyses: [],
  actionPlans: [],
  isDemoLoaded: false,
  settings: DEFAULT_SETTINGS,
};

type Action =
  | { type: 'LOAD_STATE'; payload: AppState }
  | { type: 'LOAD_DEMO_DATA' }
  | { type: 'CLEAR_DATA' }
  | { type: 'ADD_WORKFLOW'; payload: Workflow }
  | { type: 'UPDATE_WORKFLOW'; payload: Workflow }
  | { type: 'DELETE_WORKFLOW'; payload: string }
  | { type: 'ADD_ANALYSIS'; payload: AnalysisResult }
  | { type: 'ADD_ACTION_PLAN'; payload: ActionPlan }
  | { type: 'UPDATE_ACTION_PLAN'; payload: ActionPlan }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppState['settings']> }
  | { type: 'UPDATE_RECOMMENDATION_STATUS'; payload: { analysisId: string; recId: string; status: 'planned' | 'in_progress' | 'completed' | 'skipped' } }
  | { type: 'UPDATE_ACTION_ITEM'; payload: { planId: string; itemId: string; updates: Partial<import('./types').ActionItem> } };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'LOAD_STATE':
      return action.payload;
    case 'LOAD_DEMO_DATA':
      return {
        ...state,
        workflows: [...state.workflows.filter(w => !w.isDemo), ...DEMO_WORKFLOWS],
        analyses: [...state.analyses.filter(a => !a.workflowId.startsWith('demo-')), ...DEMO_ANALYSES],
        actionPlans: [...state.actionPlans.filter(p => !p.workflowId.startsWith('demo-')), ...DEMO_ACTION_PLANS],
        isDemoLoaded: true,
      };
    case 'CLEAR_DATA':
      return { ...initialState };
    case 'ADD_WORKFLOW':
      return { ...state, workflows: [...state.workflows, action.payload] };
    case 'UPDATE_WORKFLOW':
      return { ...state, workflows: state.workflows.map(w => w.id === action.payload.id ? action.payload : w) };
    case 'DELETE_WORKFLOW':
      return {
        ...state,
        workflows: state.workflows.filter(w => w.id !== action.payload),
        analyses: state.analyses.filter(a => a.workflowId !== action.payload),
        actionPlans: state.actionPlans.filter(p => p.workflowId !== action.payload),
      };
    case 'ADD_ANALYSIS':
      return { ...state, analyses: [...state.analyses.filter(a => a.workflowId !== action.payload.workflowId), action.payload] };
    case 'ADD_ACTION_PLAN':
      return { ...state, actionPlans: [...state.actionPlans.filter(p => p.workflowId !== action.payload.workflowId), action.payload] };
    case 'UPDATE_ACTION_PLAN':
      return { ...state, actionPlans: state.actionPlans.map(p => p.id === action.payload.id ? action.payload : p) };
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case 'UPDATE_RECOMMENDATION_STATUS': {
      const { analysisId, recId, status } = action.payload;
      return {
        ...state,
        analyses: state.analyses.map(a => a.id === analysisId ? {
          ...a,
          recommendations: a.recommendations.map(r => r.id === recId ? { ...r, status } : r),
        } : a),
      };
    }
    case 'UPDATE_ACTION_ITEM': {
      const { planId, itemId, updates } = action.payload;
      return {
        ...state,
        actionPlans: state.actionPlans.map(p => p.id === planId ? {
          ...p,
          items: p.items.map(item => item.id === itemId ? { ...item, ...updates } : item),
        } : p),
      };
    }
    default:
      return state;
  }
}

interface StoreContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [hydrated, setHydrated] = React.useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        dispatch({ type: 'LOAD_STATE', payload: { ...initialState, ...parsed } });
      }
    } catch (e) {
      console.warn('Failed to load state from localStorage:', e);
    }
    setHydrated(true);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (hydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        console.warn('Failed to save state to localStorage:', e);
      }
    }
  }, [state, hydrated]);

  if (!hydrated) {
    return null;
  }

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context;
}

export function useDashboardMetrics() {
  const { state } = useStore();
  const { analyses, workflows, actionPlans } = state;

  const totalHoursWasted = analyses.reduce((s, a) => s + a.costAnalysis.hoursWastedPerWeek, 0);
  const estimatedAnnualSavings = analyses.reduce((s, a) => s + a.costAnalysis.potentialSavings, 0);
  const allBottlenecks = analyses.flatMap(a => a.bottlenecks);
  const topBottlenecks = [...allBottlenecks].sort((a, b) => b.severity - a.severity).slice(0, 5);
  const avgHealth = analyses.length > 0 ? Math.round(analyses.reduce((s, a) => s + a.workflowHealthScore, 0) / analyses.length) : 0;
  const allRecs = analyses.flatMap(a => a.recommendations);
  const quickWins = allRecs.filter(r => r.difficulty === 'Easy');
  const highImpact = allRecs.filter(r => r.priority === 'P0' || r.priority === 'P1');
  const backlog = allRecs.filter(r => r.status === 'planned');

  const deptMap = new Map<string, { hours: number; cost: number }>();
  for (const a of analyses) {
    const wf = workflows.find(w => w.id === a.workflowId);
    const dept = wf?.department || 'Unknown';
    const existing = deptMap.get(dept) || { hours: 0, cost: 0 };
    deptMap.set(dept, {
      hours: existing.hours + a.costAnalysis.hoursWastedPerWeek,
      cost: existing.cost + a.costAnalysis.annualCostLoss,
    });
  }

  const typeMap = new Map<string, { count: number; hours: number }>();
  for (const b of allBottlenecks) {
    const existing = typeMap.get(b.type) || { count: 0, hours: 0 };
    typeMap.set(b.type, { count: existing.count + 1, hours: existing.hours + b.timeWastedMinutes / 60 });
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const baseSavings = estimatedAnnualSavings / 12;

  return {
    totalHoursWasted: Math.round(totalHoursWasted * 10) / 10,
    estimatedAnnualSavings: Math.round(estimatedAnnualSavings),
    topBottlenecks,
    workflowHealthScore: avgHealth,
    quickWinsCount: quickWins.length,
    highImpactCount: highImpact.length,
    automationBacklogCount: backlog.length,
    totalWorkflows: workflows.length,
    analyzedWorkflows: analyses.length,
    wasteByDepartment: Array.from(deptMap.entries()).map(([dept, data]) => ({ department: dept, hours: Math.round(data.hours * 10) / 10, cost: Math.round(data.cost) })),
    wasteByType: Array.from(typeMap.entries()).map(([type, data]) => ({ type, count: data.count, hours: Math.round(data.hours * 10) / 10 })),
    savingsTrend: months.map((month, i) => ({
      month,
      projected: Math.round(baseSavings * (i + 1) * 0.15),
      actual: Math.round(baseSavings * (i + 1) * 0.1 * (i < 4 ? 1 : 0)),
    })),
  };
}
