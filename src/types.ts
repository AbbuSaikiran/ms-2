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

export interface ServerStatus {
  connectedToCloud: boolean;
  apiUrl: string;
  hasGroqKey: boolean;
  hasOpenAiKey: boolean;
  stats: {
    totalFacts: number;
    totalExperiences: number;
    totalMentalModels: number;
    totalOperations: number;
  };
}
