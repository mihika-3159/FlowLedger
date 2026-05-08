import type { 
  Workflow, 
  WorkflowStep, 
  AnalysisResult, 
  Bottleneck, 
  CostAnalysis, 
  AutomationRecommendation, 
  BottleneckType,
  Difficulty,
  Priority
} from '../types';
import { DEFAULT_SETTINGS, FREQUENCY_MULTIPLIER } from '../constants';

export function runRuleBasedAnalysis(workflow: Workflow): AnalysisResult {
  const bottlenecks: Bottleneck[] = [];
  const hourlyRate = DEFAULT_SETTINGS.avgHourlyRate;
  const freqMult = FREQUENCY_MULTIPLIER[workflow.frequency] || 52;
  const weeklyMult = freqMult / 52;

  workflow.steps.forEach((step) => {
    // 1. Approval Delays
    if (step.type === 'approval') {
      bottlenecks.push({
        id: `bn-appr-${step.id}`,
        workflowId: workflow.id,
        stepId: step.id,
        type: 'approval_delay',
        severity: 8,
        title: `Decision Bottleneck: ${step.name}`,
        description: `Approval steps often cause multi-day delays due to asynchronous review and inbox clutter.`,
        timeWastedMinutes: Math.round(step.timeMinutes * 2.5),
        costImpact: Math.round((step.timeMinutes * 2.5 / 60) * hourlyRate * freqMult),
        affectedStep: step.name,
        recommendation: `Automate this approval using Slack/Teams workflows with auto-escalation for non-response.`
      });
    }

    // 2. Manual Repetition
    if (step.isManual && step.timeMinutes > 30) {
      bottlenecks.push({
        id: `bn-man-${step.id}`,
        workflowId: workflow.id,
        stepId: step.id,
        type: 'manual_repetition',
        severity: 7,
        title: `High-Duration Manual Task: ${step.name}`,
        description: `This task consumes significant human capital (${step.timeMinutes}m) which could be better spent on high-leverage work.`,
        timeWastedMinutes: Math.round(step.timeMinutes * 0.6),
        costImpact: Math.round((step.timeMinutes * 0.6 / 60) * hourlyRate * freqMult),
        affectedStep: step.name,
        recommendation: `Use RPA or custom scripts to handle the repetitive data manipulation or retrieval.`
      });
    }

    // 3. Copy-Paste / Duplicate Work
    const cpKeywords = ['copy', 'paste', 're-enter', 'manual entry', 'csv', 'export', 'import'];
    const lowerName = step.name.toLowerCase();
    const lowerDesc = (step.description || '').toLowerCase();
    const isCopyPaste = cpKeywords.some(k => lowerName.includes(k) || lowerDesc.includes(k));

    if (isCopyPaste) {
      bottlenecks.push({
        id: `bn-cp-${step.id}`,
        workflowId: workflow.id,
        stepId: step.id,
        type: 'copy_paste',
        severity: 6,
        title: `Data Silo / Copy-Paste: ${step.name}`,
        description: `Moving data manually between systems is error-prone and highly inefficient.`,
        timeWastedMinutes: Math.round(step.timeMinutes * 0.4),
        costImpact: Math.round((step.timeMinutes * 0.4 / 60) * hourlyRate * freqMult),
        affectedStep: step.name,
        recommendation: `Set up a direct API integration between the source and destination systems.`
      });
    }

    // 4. Slow Handoffs
    if (step.type === 'handoff') {
      bottlenecks.push({
        id: `bn-ho-${step.id}`,
        workflowId: workflow.id,
        stepId: step.id,
        type: 'slow_handoff',
        severity: 5,
        title: `Information Loss at Handoff: ${step.name}`,
        description: `Handoffs between ${step.owner} and the next owner are primary sources of context loss and idle time.`,
        timeWastedMinutes: Math.round(step.timeMinutes * 1.2),
        costImpact: Math.round((step.timeMinutes * 1.2 / 60) * hourlyRate * freqMult),
        affectedStep: step.name,
        recommendation: `Standardize the handoff format with a mandatory checklist or automated notification.`
      });
    }
  });

  // Calculate Aggregates
  const totalWastedMinutesPerWeek = bottlenecks.reduce((acc, b) => acc + b.timeWastedMinutes, 0) * weeklyMult;
  const annualCostLoss = bottlenecks.reduce((acc, b) => acc + b.costImpact, 0);
  const hoursWastedPerWeek = Math.round((totalWastedMinutesPerWeek / 60) * 10) / 10;
  
  const automatableSteps = workflow.steps.filter(s => s.isManual).length;
  const automationCoverage = Math.round((automatableSteps / workflow.steps.length) * 100);
  const potentialSavings = Math.round(annualCostLoss * 0.75); // Assume 75% efficiency gain

  const costAnalysis: CostAnalysis = {
    workflowId: workflow.id,
    hoursWastedPerWeek,
    estimatedSalaryCostPerWeek: Math.round((hoursWastedPerWeek * hourlyRate)),
    annualCostLoss,
    potentialSavings,
    roiEstimate: 450, // Static ROI for fallback
    automationCoverage
  };

  // Generate Recommendations
  const recommendations: AutomationRecommendation[] = bottlenecks.map((b, i) => {
    let diff: Difficulty = 'Medium';
    let prio: Priority = 'P1';

    if (b.severity >= 8) { prio = 'P0'; diff = 'Hard'; }
    else if (b.severity <= 4) { prio = 'P3'; diff = 'Easy'; }

    return {
      id: `rec-${b.id}`,
      workflowId: workflow.id,
      bottleneckId: b.id,
      title: `Automate ${b.affectedStep}`,
      description: b.recommendation,
      estimatedTimeSavedMinutes: b.timeWastedMinutes,
      difficulty: diff,
      priority: prio,
      affectedDepartment: workflow.department,
      suggestedTool: 'Zapier / Internal Tool',
      implementationSteps: [
        'Analyze data requirements',
        'Map source to destination fields',
        'Configure automation logic',
        'Deploy and monitor'
      ],
      status: 'planned'
    };
  });

  const healthScore = Math.max(15, 100 - (bottlenecks.length * 10) - (automatableSteps * 4));

  return {
    id: `analysis-${workflow.id}-${Date.now()}`,
    workflowId: workflow.id,
    bottlenecks,
    costAnalysis,
    recommendations,
    workflowHealthScore: healthScore,
    summary: `Rule-based analysis identified ${bottlenecks.length} critical bottlenecks. Implementing automation could recover approximately ${hoursWastedPerWeek} hours per week.`,
    analyzedAt: new Date().toISOString(),
    isAI: false
  };
}
