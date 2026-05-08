import type { Workflow, AnalysisResult, CostAnalysis } from '../types';
import { runRuleBasedAnalysis } from './fallback-engine';
import { runAIAnalysis } from './gemini';
import { DEFAULT_SETTINGS, FREQUENCY_MULTIPLIER } from '../constants';

export async function analyzeWorkflow(workflow: Workflow): Promise<AnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return runRuleBasedAnalysis(workflow);
  }

  try {
    const aiResult = await runAIAnalysis(workflow);
    
    // Ensure cost calculations are consistent with our settings
    const hourlyRate = DEFAULT_SETTINGS.avgHourlyRate;
    const freqMult = FREQUENCY_MULTIPLIER[workflow.frequency] || 52;
    const weeklyMult = freqMult / 52;

    const totalWastedMinutesPerWeek = (aiResult.bottlenecks || []).reduce((acc, b) => acc + (b.timeWastedMinutes || 0), 0) * weeklyMult;
    const annualCostLoss = (aiResult.bottlenecks || []).reduce((acc, b) => acc + (b.costImpact || 0), 0);
    const hoursWastedPerWeek = Math.round((totalWastedMinutesPerWeek / 60) * 10) / 10;
    
    const automatableSteps = workflow.steps.filter(s => s.isManual).length;
    const automationCoverage = Math.round((automatableSteps / workflow.steps.length) * 100);
    const potentialSavings = Math.round(annualCostLoss * 0.8);

    const costAnalysis: CostAnalysis = {
      workflowId: workflow.id,
      hoursWastedPerWeek,
      estimatedSalaryCostPerWeek: Math.round(hoursWastedPerWeek * hourlyRate),
      annualCostLoss,
      potentialSavings,
      roiEstimate: 520,
      automationCoverage
    };

    return {
      id: `analysis-${workflow.id}-${Date.now()}`,
      workflowId: workflow.id,
      bottlenecks: (aiResult.bottlenecks || []).map(b => ({
        ...b,
        id: `bn-${Math.random().toString(36).substring(2, 9)}`,
        workflowId: workflow.id
      })),
      costAnalysis,
      recommendations: (aiResult.recommendations || []).map((r, i) => ({
        ...r,
        id: `rec-${Math.random().toString(36).substring(2, 9)}`,
        workflowId: workflow.id,
        bottleneckId: (aiResult.bottlenecks || [])[i]?.id || 'unknown',
        estimatedTimeSavedMinutes: (aiResult.bottlenecks || [])[i]?.timeWastedMinutes || 30,
        affectedDepartment: workflow.department,
        status: 'planned'
      })),
      workflowHealthScore: aiResult.workflowHealthScore || 70,
      summary: aiResult.summary || "Analysis completed.",
      analyzedAt: new Date().toISOString(),
      isAI: true
    } as AnalysisResult;
  } catch (error) {
    console.error("AI Analysis failed, falling back to rule-based:", error);
    return runRuleBasedAnalysis(workflow);
  }
}
