import { hindsightEngine } from '../hindsight.js';
import { llmService } from '../llm.js';

export async function processSupportAgent(prompt: string, stateless = false) {
  const domain = 'support';

  let memoryContext = '';
  let recalledMemories = null;

  if (!stateless) {
    recalledMemories = await hindsightEngine.recall(prompt, domain);
    memoryContext = recalledMemories.formattedContext;
  }

  const systemPrompt = `You are a VIP Enterprise Customer Support Agent equipped with Hindsight long-term memory.
You remember customer tech stacks, communication preferences, past tickets, and past resolutions.
Never ask customers to repeat information they have already provided. Tailor your communication style directly to the customer's profile.`;

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
