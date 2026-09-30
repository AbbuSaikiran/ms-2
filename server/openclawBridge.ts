import { hindsightEngine } from './hindsight.js';
import { llmService } from './llm.js';

export interface OpenClawAgentTask {
  id: string;
  goal: string;
  domain: 'sales' | 'devops' | 'support' | 'feedback';
  status: 'running' | 'completed' | 'failed';
  steps: Array<{
    step: number;
    action: string;
    toolCalled?: string;
    result: string;
    memoryOperation?: string;
  }>;
  output: string;
}

export class OpenClawBridge {
  private activeTasks: Map<string, OpenClawAgentTask> = new Map();

  /**
   * Runs an autonomous OpenClaw agent workflow with Hindsight tools & memory reflection
   */
  public async executeTask(goal: string, domain: 'sales' | 'devops' | 'support' | 'feedback'): Promise<OpenClawAgentTask> {
    const taskId = `openclaw_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const task: OpenClawAgentTask = {
      id: taskId,
      goal,
      domain,
      status: 'running',
      steps: [],
      output: '',
    };
    this.activeTasks.set(taskId, task);

    // Step 1: OpenClaw Memory Recall
    task.steps.push({
      step: 1,
      action: 'OpenClaw initialized @vectorize-io/hindsight-openclaw plugin',
      toolCalled: 'hindsight_recall',
      result: `Recalling long-term memories for domain "${domain}" on query: "${goal}"`,
      memoryOperation: 'RECALL',
    });

    const memoryResult = await hindsightEngine.recall(goal, domain);

    // Step 2: Autonomous Reasoning with Groq / LLM
    task.steps.push({
      step: 2,
      action: 'Formulating agent execution plan using recalled Mental Models & Facts',
      result: `Loaded ${memoryResult.facts.length} facts, ${memoryResult.experiences.length} experiences, and ${memoryResult.mentalModels.length} mental models`,
    });

    const llmResponse = await llmService.generateResponse({
      systemPrompt: `You are an autonomous OpenClaw agent equipped with the official Hindsight Memory plugin (@vectorize-io/hindsight-openclaw).
Execute the user's objective thoroughly and ground your reasoning in the recalled memory context.`,
      userPrompt: goal,
      memoryContext: memoryResult.formattedContext,
      domain,
    });

    // Step 3: OpenClaw Retaining New Outcome
    task.steps.push({
      step: 3,
      action: 'Persisting execution result back to Hindsight storage',
      toolCalled: 'hindsight_retain',
      result: 'Durable experience stored for future interactions',
      memoryOperation: 'RETAIN',
    });

    await hindsightEngine.retain({
      domain,
      type: 'experience',
      data: {
        context: `OpenClaw task execution: ${goal.slice(0, 80)}`,
        actionTaken: 'Executed autonomous multi-step reasoning with Hindsight grounding',
        outcome: llmResponse.content.slice(0, 100) + '...',
        sentiment: 'positive',
      }
    });

    task.status = 'completed';
    task.output = llmResponse.content;

    return task;
  }

  public getTask(taskId: string): OpenClawAgentTask | undefined {
    return this.activeTasks.get(taskId);
  }

  public getAllTasks(): OpenClawAgentTask[] {
    return Array.from(this.activeTasks.values());
  }
}

export const openclawBridge = new OpenClawBridge();
