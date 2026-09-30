import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { hindsightEngine } from './hindsight.js';
import { llmService } from './llm.js';
import { openclawBridge } from './openclawBridge.js';
import { memoryOpsStore, diagnoseIncident, sanitizeLogs } from './memoryOps.js';
import { processSalesAgent } from './agents/dealIntelligence.js';
import { processDevOpsAgent } from './agents/incidentResponse.js';
import { processSupportAgent } from './agents/customerSupport.js';
import { processFeedbackAgent } from './agents/feedbackSynthesizer.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// 1. Status & Configuration
app.get('/api/status', (req, res) => {
  const status = hindsightEngine.getStatus();
  const incidents = memoryOpsStore.getAll();
  res.json({
    ...status,
    hasGroqKey: !!process.env.GROQ_API_KEY,
    hasOpenAiKey: !!process.env.OPENAI_API_KEY,
    currentModel: llmService.getModel(),
    incidentStats: {
      total: incidents.length,
      critical: incidents.filter(i => i.severity === 'Critical').length,
      resolved: incidents.filter(i => i.status === 'Resolved').length,
      investigating: incidents.filter(i => i.status === 'Investigating' || i.status === 'Diagnosed').length,
    }
  });
});

app.post('/api/config', (req, res) => {
  const { hindsightApiKey, groqApiKey, openAiApiKey, model } = req.body;
  if (hindsightApiKey !== undefined) {
    process.env.HINDSIGHT_API_KEY = hindsightApiKey;
    hindsightEngine.setApiKey(hindsightApiKey);
  }
  if (groqApiKey !== undefined) {
    process.env.GROQ_API_KEY = groqApiKey;
  }
  if (openAiApiKey !== undefined) {
    process.env.OPENAI_API_KEY = openAiApiKey;
  }
  if (model) {
    llmService.setModel(model);
  }
  llmService.initClients();
  res.json({ success: true, message: 'Configuration updated successfully' });
});

// 2. MemoryOps AI Core Endpoints
app.get('/api/memoryops/incidents', (req, res) => {
  res.json(memoryOpsStore.getAll());
});

app.get('/api/memoryops/incidents/:id', (req, res) => {
  const inc = memoryOpsStore.getById(req.params.id);
  if (!inc) return res.status(404).json({ error: 'Incident not found' });
  res.json(inc);
});

app.post('/api/memoryops/analyze', async (req, res) => {
  try {
    const { title, service, severity, environment, rawLogs, notes } = req.body;
    if (!title || !service || !rawLogs) {
      return res.status(400).json({ error: 'Missing required incident fields: title, service, rawLogs' });
    }

    // 1. Create incident & sanitize logs
    const incident = memoryOpsStore.createIncident({
      title,
      service,
      severity: severity || 'High',
      environment: environment || 'Production',
      rawLogs,
      notes,
    });

    // 2. AI diagnosis with Hindsight memory recall
    const diagnosis = await diagnoseIncident(incident);

    res.json({
      incident,
      diagnosis,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/memoryops/resolve', async (req, res) => {
  try {
    const { incidentId, confirmedRootCause, fixApplied, resolvedSuccessfully, postMortemLessons, confirmedBy } = req.body;
    if (!incidentId || !confirmedRootCause || !fixApplied) {
      return res.status(400).json({ error: 'Missing resolution details' });
    }

    const success = await memoryOpsStore.recordResolution(incidentId, {
      confirmedRootCause,
      fixApplied,
      resolvedSuccessfully: resolvedSuccessfully ?? true,
      postMortemLessons: postMortemLessons || '',
      confirmedBy: confirmedBy || 'Engineer (SRE)',
      resolvedAt: new Date().toISOString(),
    });

    if (!success) return res.status(404).json({ error: 'Incident not found' });
    res.json({ success: true, message: 'Resolution confirmed and retained to Hindsight long-term operational memory!' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/memoryops/seed', (req, res) => {
  memoryOpsStore.seedDemoIncidents();
  res.json({ success: true, message: 'Synthetic incident dataset refreshed' });
});

// Interactive AI Copilot Query & Incident Intelligence Endpoint
app.post('/api/memoryops/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message required' });

    // 1. Recall related Hindsight memories
    const recalled = await hindsightEngine.recall(message, 'devops');
    
    // 2. Build prompt with Hindsight persistent memory grounding
    const systemPrompt = `You are MemoryOps AI, an expert autonomous Site Reliability Engineering (SRE) and Incident Intelligence Agent powered by Vectorize Hindsight Persistent Memory.
You have access to persistent organizational memory: World Facts (infra limits), Experiences (past incident resolutions), and Mental Models (heuristics).
Always be concise, precise, actionable, and cite matching historical incidents (e.g. INC-104) and safe runbook steps when answering questions.`;

    const response = await llmService.generateResponse({
      systemPrompt,
      userPrompt: `User Question: "${message}"\n\nProvide a structured, helpful answer. If suggesting commands, use markdown code blocks.`,
      memoryContext: recalled.formattedContext,
      domain: 'devops'
    });

    const recalledList = [
      ...recalled.facts.map(f => ({ score: 0.95, text: `[Fact] ${f.subject}: ${f.content}` })),
      ...recalled.experiences.map(e => ({ score: 0.92, text: `[Experience] ${e.context} -> Action: ${e.actionTaken} -> Outcome: ${e.outcome}` })),
      ...recalled.mentalModels.map(m => ({ score: 0.88, text: `[Mental Model] ${m.pattern}: ${m.insight}` }))
    ];

    res.json({
      reply: response.content,
      recalledMemories: recalledList
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Memory Operations (Retain, Recall, Reflect, Inspect)
app.get('/api/memories', (req, res) => {
  const memories = hindsightEngine.getAllMemories();
  res.json(memories);
});

app.post('/api/memories/retain', async (req, res) => {
  try {
    const { domain, type, data } = req.body;
    const result = await hindsightEngine.retain({ domain, type, data });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/memories/recall', async (req, res) => {
  try {
    const { query, domain } = req.body;
    const result = await hindsightEngine.recall(query, domain);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/memories/reflect', async (req, res) => {
  try {
    const { domain } = req.body;
    const result = await hindsightEngine.reflect(domain);
    res.json({ success: true, mentalModels: result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/memories/reset', (req, res) => {
  hindsightEngine.resetToSeed();
  memoryOpsStore.seedDemoIncidents();
  res.json({ success: true, message: 'All memories and incidents reset to high-fidelity seed data' });
});

// 4. OpenClaw Endpoint
app.post('/api/openclaw/execute', async (req, res) => {
  try {
    const { goal, domain } = req.body;
    const task = await openclawBridge.executeTask(goal || 'Analyze recent incidents', domain || 'devops');
    res.json(task);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/openclaw/tasks', (req, res) => {
  res.json(openclawBridge.getAllTasks());
});

// 5. Domain Agents
app.post('/api/agent/sales', async (req, res) => {
  try {
    const { prompt, stateless } = req.body;
    const result = await processSalesAgent(prompt, stateless);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/agent/devops', async (req, res) => {
  try {
    const { prompt, stateless } = req.body;
    const result = await processDevOpsAgent(prompt, stateless);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/agent/support', async (req, res) => {
  try {
    const { prompt, stateless } = req.body;
    const result = await processSupportAgent(prompt, stateless);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/agent/feedback', async (req, res) => {
  try {
    const { prompt, stateless } = req.body;
    const result = await processFeedbackAgent(prompt, stateless);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Comparative Benchmark
app.post('/api/benchmark', async (req, res) => {
  try {
    const { prompt, domain } = req.body;
    let agentFn: any;
    switch (domain) {
      case 'sales':
        agentFn = processSalesAgent;
        break;
      case 'devops':
        agentFn = processDevOpsAgent;
        break;
      case 'support':
        agentFn = processSupportAgent;
        break;
      default:
        agentFn = processFeedbackAgent;
    }

    const [statelessRes, hindsightRes] = await Promise.all([
      agentFn(prompt, true),
      agentFn(prompt, false),
    ]);

    res.json({
      stateless: statelessRes,
      hindsight: hindsightRes,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 MemoryOps AI & Hindsight Server running on http://localhost:${PORT}`);
});
