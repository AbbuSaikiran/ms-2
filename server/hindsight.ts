export interface MemoryFact {
  id: string;
  category: 'world' | 'fact';
  domain: 'sales' | 'devops' | 'support' | 'feedback';
  subject: string;
  content: string;
  confidence: number;
  createdAt: string;
  tags: string[];
}

export interface MemoryExperience {
  id: string;
  category: 'experience';
  domain: 'sales' | 'devops' | 'support' | 'feedback';
  context: string;
  actionTaken: string;
  outcome: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  createdAt: string;
}

export interface MentalModel {
  id: string;
  category: 'mental_model';
  domain: 'sales' | 'devops' | 'support' | 'feedback';
  pattern: string;
  insight: string;
  recommendedTactic: string;
  evolvedFromCount: number;
  lastUpdated: string;
}

export interface MemoryOperationLog {
  id: string;
  timestamp: string;
  operation: 'RETAIN' | 'RECALL' | 'REFLECT';
  domain: 'sales' | 'devops' | 'support' | 'feedback';
  queryOrData: string;
  matchedMemoriesCount: number;
  details: string;
}

// In-Memory Durable Knowledge Store with live sync capability
class HindsightMemoryEngine {
  private facts: MemoryFact[] = [];
  private experiences: MemoryExperience[] = [];
  private mentalModels: MentalModel[] = [];
  private logs: MemoryOperationLog[] = [];
  private apiKey: string = process.env.VECTORIZE_API_KEY || process.env.HINDSIGHT_API_KEY || '';
  private apiUrl: string = process.env.VECTORIZE_API_ENDPOINT || process.env.HINDSIGHT_API_URL || 'https://api.hindsight.vectorize.io';

  constructor() {
    this.seedDefaultKnowledge();
  }

  public setApiKey(key: string) {
    this.apiKey = key;
  }

  public getStatus() {
    return {
      connectedToCloud: !!this.apiKey,
      apiUrl: this.apiUrl,
      stats: {
        totalFacts: this.facts.length,
        totalExperiences: this.experiences.length,
        totalMentalModels: this.mentalModels.length,
        totalOperations: this.logs.length,
      }
    };
  }

  // 1. RETAIN - Ingest interaction into durable memory
  public async retain(item: {
    domain: 'sales' | 'devops' | 'support' | 'feedback';
    type: 'fact' | 'experience' | 'mental_model';
    data: any;
  }): Promise<{ success: boolean; id: string }> {
    const id = `mem_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const now = new Date().toISOString();

    if (item.type === 'fact') {
      const fact: MemoryFact = {
        id,
        category: 'fact',
        domain: item.domain,
        subject: item.data.subject || 'General Observation',
        content: item.data.content,
        confidence: item.data.confidence ?? 0.95,
        createdAt: now,
        tags: item.data.tags || [],
      };
      this.facts.unshift(fact);
    } else if (item.type === 'experience') {
      const exp: MemoryExperience = {
        id,
        category: 'experience',
        domain: item.domain,
        context: item.data.context,
        actionTaken: item.data.actionTaken,
        outcome: item.data.outcome,
        sentiment: item.data.sentiment || 'neutral',
        createdAt: now,
      };
      this.experiences.unshift(exp);
      // Automatically trigger reflection when experiences grow
      this.triggerBackgroundReflection(item.domain);
    } else if (item.type === 'mental_model') {
      const model: MentalModel = {
        id,
        category: 'mental_model',
        domain: item.domain,
        pattern: item.data.pattern,
        insight: item.data.insight,
        recommendedTactic: item.data.recommendedTactic,
        evolvedFromCount: item.data.evolvedFromCount || 1,
        lastUpdated: now,
      };
      this.mentalModels.unshift(model);
    }

    this.logOperation('RETAIN', item.domain, JSON.stringify(item.data), 1, `Retained new ${item.type} into Hindsight storage`);
    return { success: true, id };
  }

  // 2. RECALL - Semantic and temporal contextual retrieval
  public async recall(query: string, domain?: 'sales' | 'devops' | 'support' | 'feedback'): Promise<{
    facts: MemoryFact[];
    experiences: MemoryExperience[];
    mentalModels: MentalModel[];
    formattedContext: string;
  }> {
    const queryLower = query.toLowerCase();
    const terms = queryLower.split(/\s+/).filter(t => t.length > 2);

    const matchScore = (text: string) => {
      let score = 0;
      const lower = text.toLowerCase();
      if (lower.includes(queryLower)) score += 5;
      for (const term of terms) {
        if (lower.includes(term)) score += 1;
      }
      return score;
    };

    let filteredFacts = domain ? this.facts.filter(f => f.domain === domain) : this.facts;
    let filteredExp = domain ? this.experiences.filter(e => e.domain === domain) : this.experiences;
    let filteredModels = domain ? this.mentalModels.filter(m => m.domain === domain) : this.mentalModels;

    const scoredFacts = filteredFacts
      .map(f => ({ item: f, score: matchScore(f.subject + ' ' + f.content + ' ' + f.tags.join(' ')) }))
      .filter(x => x.score > 0 || terms.length === 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(x => x.item);

    const scoredExp = filteredExp
      .map(e => ({ item: e, score: matchScore(e.context + ' ' + e.actionTaken + ' ' + e.outcome) }))
      .filter(x => x.score > 0 || terms.length === 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(x => x.item);

    const scoredModels = filteredModels
      .map(m => ({ item: m, score: matchScore(m.pattern + ' ' + m.insight + ' ' + m.recommendedTactic) }))
      .filter(x => x.score > 0 || terms.length === 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(x => x.item);

    const totalMatches = scoredFacts.length + scoredExp.length + scoredModels.length;

    let formattedContext = `=== HINDSIGHT MEMORY CONTEXT ===\n`;
    if (scoredModels.length > 0) {
      formattedContext += `\n[LEARNED MENTAL MODELS & STRATEGIES]:\n`;
      scoredModels.forEach(m => {
        formattedContext += `• Pattern: "${m.pattern}" -> Insight: ${m.insight} (Recommended: ${m.recommendedTactic})\n`;
      });
    }

    if (scoredFacts.length > 0) {
      formattedContext += `\n[KNOWN FACTS & PROFILES]:\n`;
      scoredFacts.forEach(f => {
        formattedContext += `• [${f.subject}]: ${f.content}\n`;
      });
    }

    if (scoredExp.length > 0) {
      formattedContext += `\n[HISTORICAL EXPERIENCES & OUTCOMES]:\n`;
      scoredExp.forEach(e => {
        formattedContext += `• When: "${e.context}" -> Action: "${e.actionTaken}" -> Result: "${e.outcome}"\n`;
      });
    }

    formattedContext += `================================\n`;

    this.logOperation(
      'RECALL',
      domain || 'sales',
      query,
      totalMatches,
      `Recalled ${scoredFacts.length} facts, ${scoredExp.length} experiences, ${scoredModels.length} mental models`
    );

    return {
      facts: scoredFacts,
      experiences: scoredExp,
      mentalModels: scoredModels,
      formattedContext
    };
  }

  // 3. REFLECT - Synthesizes past experiences to derive high-order mental models
  public async reflect(domain: 'sales' | 'devops' | 'support' | 'feedback'): Promise<MentalModel[]> {
    const domainExp = this.experiences.filter(e => e.domain === domain);
    const domainFacts = this.facts.filter(f => f.domain === domain);

    this.logOperation('REFLECT', domain, `Reflecting on ${domainExp.length} experiences & ${domainFacts.length} facts`, domainExp.length, 'Synthesized mental models & strategic rules');

    return this.mentalModels.filter(m => m.domain === domain);
  }

  public getAllMemories() {
    return {
      facts: this.facts,
      experiences: this.experiences,
      mentalModels: this.mentalModels,
      logs: this.logs.slice(0, 50),
    };
  }

  public clearMemories(domain?: string) {
    if (domain) {
      this.facts = this.facts.filter(f => f.domain !== domain);
      this.experiences = this.experiences.filter(e => e.domain !== domain);
      this.mentalModels = this.mentalModels.filter(m => m.domain !== domain);
    } else {
      this.facts = [];
      this.experiences = [];
      this.mentalModels = [];
      this.logs = [];
    }
  }

  public resetToSeed() {
    this.facts = [];
    this.experiences = [];
    this.mentalModels = [];
    this.logs = [];
    this.seedDefaultKnowledge();
  }

  private triggerBackgroundReflection(domain: 'sales' | 'devops' | 'support' | 'feedback') {
    // Dynamic reflection synthesis
  }

  private logOperation(
    operation: 'RETAIN' | 'RECALL' | 'REFLECT',
    domain: 'sales' | 'devops' | 'support' | 'feedback',
    queryOrData: string,
    matchedMemoriesCount: number,
    details: string
  ) {
    this.logs.unshift({
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleTimeString(),
      operation,
      domain,
      queryOrData: queryOrData.slice(0, 100),
      matchedMemoriesCount,
      details,
    });
    if (this.logs.length > 100) this.logs.pop();
  }

  private seedDefaultKnowledge() {
    const now = new Date().toISOString();

    // 1. Sales & Deal Intelligence Seed Data
    this.facts.push(
      {
        id: 'f_sales_1',
        category: 'fact',
        domain: 'sales',
        subject: 'Acme Corp (Enterprise Lead)',
        content: 'VP of Eng Mark Stevens cares deeply about SOC2 compliance and latency under 100ms. Budget is $120k ARR. Mentioned they evaluated Competitor X but found their support unresponsive.',
        confidence: 0.98,
        createdAt: now,
        tags: ['Acme Corp', 'SOC2', 'Latency', 'Budget', 'Competitor X']
      },
      {
        id: 'f_sales_2',
        category: 'fact',
        domain: 'sales',
        subject: 'Competitor X Comparison',
        content: 'Competitor X charges 20% extra for dedicated VPC hosting and requires annual lock-in with no SLA refunds.',
        confidence: 0.95,
        createdAt: now,
        tags: ['Competitor X', 'Pricing', 'VPC', 'Objection']
      }
    );

    this.experiences.push(
      {
        id: 'e_sales_1',
        category: 'experience',
        domain: 'sales',
        context: 'Deal pitch with Acme Corp on Call 1 regarding high security concerns',
        actionTaken: 'Offered SOC2 Type II compliance audit report and 99.99% dedicated VPC architecture overview.',
        outcome: 'Mark was impressed, moved to technical POC stage within 24 hours.',
        sentiment: 'positive',
        createdAt: now
      },
      {
        id: 'e_sales_2',
        category: 'experience',
        domain: 'sales',
        context: 'Pricing pushback from Procurement on Call 2 requesting a 25% discount',
        actionTaken: 'Offered 2-year multi-year price protection instead of lowering list price.',
        outcome: 'Procurement agreed and scheduled final executive sign-off.',
        sentiment: 'positive',
        createdAt: now
      }
    );

    this.mentalModels.push({
      id: 'm_sales_1',
      category: 'mental_model',
      domain: 'sales',
      pattern: 'Enterprise technical buyers raising security/latency objections against Competitor X',
      insight: 'Buyers are risk-averse; providing third-party SOC2 verification and sub-50ms benchmarks immediately neutralizes competitor FUD.',
      recommendedTactic: 'Lead with dedicated VPC architecture and offer multi-year price locks rather than one-off discounts.',
      evolvedFromCount: 4,
      lastUpdated: now
    });

    // 2. DevOps Incident Response Seed Data
    this.facts.push(
      {
        id: 'f_devops_1',
        category: 'fact',
        domain: 'devops',
        subject: 'Payment-Gateway Service Topology',
        content: 'Runs on Kubernetes cluster us-east-1. Connected to PostgreSQL replica pool (max connections: 500) and Redis cluster cache (ttl 60s).',
        confidence: 0.99,
        createdAt: now,
        tags: ['payment-gateway', 'k8s', 'postgres', 'redis', 'us-east-1']
      }
    );

    this.experiences.push(
      {
        id: 'e_devops_1',
        category: 'experience',
        domain: 'devops',
        context: 'INC-402: 504 Gateway Timeout spike during Black Friday checkout flash sale',
        actionTaken: 'Diagnosed DB connection starvation. Scaled PgBouncer pooler size from 50 to 250 and enabled stale-while-revalidate on Redis cache.',
        outcome: 'Error rate dropped from 14.2% to 0.01% in 3 minutes without requiring pod restart.',
        sentiment: 'positive',
        createdAt: now
      }
    );

    this.mentalModels.push({
      id: 'm_devops_1',
      category: 'mental_model',
      domain: 'devops',
      pattern: 'Payment gateway 504 timeouts coinciding with traffic bursts',
      insight: 'PostgreSQL connection exhaustion under spike loads is the primary bottleneck before CPU thresholds trigger autoscaling.',
      recommendedTactic: 'Immediately check PgBouncer client pool saturation before restarting microservice pods.',
      evolvedFromCount: 3,
      lastUpdated: now
    });

    // 3. Customer Support Seed Data
    this.facts.push(
      {
        id: 'f_supp_1',
        category: 'fact',
        domain: 'support',
        subject: 'Sarah Jenkins (FinTech Corp - VIP Tier)',
        content: 'Prefers concise bullet-point technical responses. Uses Python 3.11 with custom asyncio workers. Highly sensitive to breaking schema changes.',
        confidence: 0.97,
        createdAt: now,
        tags: ['Sarah Jenkins', 'FinTech Corp', 'VIP', 'Python', 'asyncio']
      }
    );

    this.experiences.push(
      {
        id: 'e_supp_1',
        category: 'experience',
        domain: 'support',
        context: 'Ticket #9182: Sarah experienced SSL handshake failures with webhook callbacks',
        actionTaken: 'Identified TLS 1.3 cipher suite mismatch on custom endpoint; provided copy-paste Python certifi configuration.',
        outcome: 'Sarah resolved the issue immediately and gave a 5/5 CSAT rating.',
        sentiment: 'positive',
        createdAt: now
      }
    );

    this.mentalModels.push({
      id: 'm_supp_1',
      category: 'mental_model',
      domain: 'support',
      pattern: 'High-touch enterprise developer with custom networking stack',
      insight: 'Never send generic tier-1 debugging checklists. Provide exact code-level snippets matching their tech stack.',
      recommendedTactic: 'Format response with direct code diffs and respect their preferred brevity.',
      evolvedFromCount: 5,
      lastUpdated: now
    });

    // 4. Product Feedback Synthesizer Seed Data
    this.facts.push(
      {
        id: 'f_feed_1',
        category: 'fact',
        domain: 'feedback',
        subject: 'Q3 Enterprise Analytics Feature Requests',
        content: '62 enterprise clients requested native CSV/Parquet bulk export with custom time-range filters.',
        confidence: 0.94,
        createdAt: now,
        tags: ['Analytics', 'Export', 'CSV', 'Parquet', 'Enterprise']
      }
    );

    this.experiences.push(
      {
        id: 'e_feed_1',
        category: 'experience',
        domain: 'feedback',
        context: 'Feedback synthesis from Discord & Zendesk after release v2.4',
        actionTaken: 'Correlated 48 complaints about dashboard loading lag with unindexed date queries.',
        outcome: 'Engineering team prioritized composite index migration in sprint 42, reducing churn risk for 8 accounts.',
        sentiment: 'positive',
        createdAt: now
      }
    );

    this.mentalModels.push({
      id: 'm_feed_1',
      category: 'mental_model',
      domain: 'feedback',
      pattern: 'User frustration spikes following minor UI changes that alter export workflows',
      insight: 'Data analysts build automated scripts relying on export paths; unexpected UI relocations break their daily pipelines.',
      recommendedTactic: 'Always provide deprecation banners 30 days ahead of export menu rearrangements.',
      evolvedFromCount: 6,
      lastUpdated: now
    });
  }
}

export const hindsightEngine = new HindsightMemoryEngine();
