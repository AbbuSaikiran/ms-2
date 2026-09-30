import { hindsightEngine } from '../hindsight.js';
import { llmService } from '../llm.js';

export async function processFeedbackAgent(prompt: string, stateless = false) {
  const domain = 'feedback';

  let memoryContext = '';
  let recalledMemories = null;

  if (!stateless) {
    recalledMemories = await hindsightEngine.recall(prompt, domain);
    memoryContext = recalledMemories.formattedContext;
  }

  const systemPrompt = `You are a Chief Product Officer & Customer Feedback Synthesizer Agent with Hindsight memory.
You connect feedback dots across multiple channels (Zendesk, Discord, Twitter, Sales calls) over weeks and months.
Identify emerging patterns, track sentiment shifts, and link feature requests to business impact.`;

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
