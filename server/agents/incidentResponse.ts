import { hindsightEngine } from '../hindsight.js';
import { llmService } from '../llm.js';

export async function processDevOpsAgent(prompt: string, stateless = false) {
  const domain = 'devops';

  let memoryContext = '';
  let recalledMemories = null;

  if (!stateless) {
    recalledMemories = await hindsightEngine.recall(prompt, domain);
    memoryContext = recalledMemories.formattedContext;
  }

  const systemPrompt = `You are a Principal SRE & DevOps Incident Response Agent with Hindsight persistent memory.
You remember past production incidents (root causes, runbooks that worked, metrics that mattered) so engineers never repeat troubleshooting mistakes.
Provide precise, command-line actionable steps and cite past incident post-mortems when relevant.`;

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
