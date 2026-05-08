import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Workflow, AnalysisResult } from "../types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const PROMPT_TEMPLATE = `
Analyze the following company workflow and identify operational waste, bottlenecks, and automation opportunities.
Format your response as a strict JSON object following this interface:
{
  "bottlenecks": [
    {
      "stepId": "string",
      "type": "approval_delay" | "manual_repetition" | "duplicate_work" | "unclear_ownership" | "copy_paste" | "unnecessary_meeting" | "slow_handoff" | "high_cost",
      "severity": number (1-10),
      "title": "string",
      "description": "string",
      "timeWastedMinutes": number,
      "costImpact": number (annual cost in USD),
      "affectedStep": "string",
      "recommendation": "string"
    }
  ],
  "summary": "string (2-3 sentences)",
  "workflowHealthScore": number (0-100),
  "recommendations": [
    {
      "title": "string",
      "description": "string",
      "difficulty": "Easy" | "Medium" | "Hard",
      "priority": "P0" | "P1" | "P2" | "P3",
      "suggestedTool": "string",
      "implementationSteps": ["string"]
    }
  ]
}

Workflow Data:
Name: {{NAME}}
Department: {{DEPARTMENT}}
Description: {{DESCRIPTION}}
Frequency: {{FREQUENCY}}
Additional Notes: {{NOTES}}

Steps:
{{STEPS}}

Return ONLY the JSON object.
`;

export async function runAIAnalysis(workflow: Workflow): Promise<Partial<AnalysisResult>> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing Gemini API Key");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const stepsStr = workflow.steps
    .map(s => `- [Step ${s.order}] ${s.name} (${s.owner}): ${s.timeMinutes}m, Manual: ${s.isManual}, Type: ${s.type}`)
    .join("\n");

  const prompt = PROMPT_TEMPLATE
    .replace("{{NAME}}", workflow.name)
    .replace("{{DEPARTMENT}}", workflow.department)
    .replace("{{DESCRIPTION}}", workflow.description)
    .replace("{{FREQUENCY}}", workflow.frequency)
    .replace("{{NOTES}}", workflow.notes || "None")
    .replace("{{STEPS}}", stepsStr);

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  // Extract JSON from response (handling potential markdown blocks)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to parse AI response as JSON");
  }

  const parsed = JSON.parse(jsonMatch[0]);
  return parsed;
}
