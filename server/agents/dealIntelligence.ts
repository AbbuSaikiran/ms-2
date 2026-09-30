import { hindsightEngine } from '../hindsight.js';
import { llmService } from '../llm.js';

export async function processSalesAgent(prompt: string, stateless = false) {
  const domain = 'sales';

  let memoryContext = '';
  let recalledMemories = null;

  if (!stateless) {
    recalledMemories = await hindsightEngine.recall(prompt, domain);
    memoryContext = recalledMemories.formattedContext;
  }

  const systemPrompt = `You are an elite AI Deal Intelligence and Enterprise Sales Memory Agent.
Your goal is to help sales reps win deals by remembering every prospect objection, past pricing negotiation, competitor comparison, and stakeholder priority across conversations.
Always reference specific historical patterns and provide battle-tested tactics from memory.`;

  const response = await llmService.generateResponse({
    systemPrompt,
    userPrompt: prompt,
    memoryContext,
    stateless,
    domain,
  });

  return {
    response: response.content,
    provider: response.provider,
    model: response.model,
    recalledMemories,
  };
}
