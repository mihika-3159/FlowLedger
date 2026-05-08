import { NextRequest, NextResponse } from 'next/server';
import { analyzeWorkflow } from '@/lib/ai/analyzer';
import { Workflow } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const workflow = await req.json() as Workflow;
    
    if (!workflow || !workflow.steps) {
      return NextResponse.json({ error: "Invalid workflow data" }, { status: 400 });
    }

    const result = await analyzeWorkflow(workflow);
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("API Analysis Error:", error);
    return NextResponse.json({ 
      error: "Failed to analyze workflow", 
      details: error.message 
    }, { status: 500 });
  }
}
