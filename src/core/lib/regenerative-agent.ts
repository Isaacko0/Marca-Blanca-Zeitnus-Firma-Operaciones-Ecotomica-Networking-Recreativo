// src/core/lib/regenerative-agent.ts
// Agente regenerativo con memoria por dominio, patrones temporales y LLM como enriquecedor.
// Reimplementa la lógica pura de closerdao/oasa-agent (MemorySystem, TranslationLayer,
// DomainOrchestrator) en TypeScript puro. No copia código de ningún repo externo.
// LLM es enriquecedor, nunca sustituto de lógica determinística.

export interface TemporalPattern {
  name: string;
  pattern: unknown[];
  duration: number; // ms
  description: string;
}

export interface KnowledgeEntry {
  value: unknown;
  timestamp: number;
  temporalContext?: unknown;
}

export interface Episode {
  action: string;
  domains: string[];
  outcome: unknown;
  timestamp: number;
}

export interface DomainInsight {
  domain: string;
  content: unknown;
}

export interface Recommendation {
  domain: string;
  content: { text?: string; type?: string; [key: string]: unknown };
  priority: number;
  integrated?: boolean;
}

export interface IntegratedResponse {
  message: string;
  insights: DomainInsight[];
  recommendations: Recommendation[];
  conflicts?: Array<{
    type: string;
    domains: string[];
    recommendations: Recommendation[];
  }>;
}

export interface AgentQueryResult {
  message: string;
  insights: DomainInsight[];
  recommendations: Recommendation[];
  domains: string[];
  timestamp: number;
}

// ========== Memory System ==========

export class MemorySystem {
  private unifiedKnowledgeStore: Record<string, Record<string, KnowledgeEntry>> = {};
  private temporalPatterns: Record<string, TemporalPattern> = {};
  private episodicMemory: Episode[] = [];
  private indigenousKnowledge: Record<string, unknown> = {};

  storeKnowledge(
    domain: string,
    key: string,
    value: unknown,
    temporalContext?: unknown,
  ): boolean {
    if (!this.unifiedKnowledgeStore[domain]) {
      this.unifiedKnowledgeStore[domain] = {};
    }
    this.unifiedKnowledgeStore[domain][key] = {
      value,
      timestamp: Date.now(),
      temporalContext,
    };
    return true;
  }

  retrieveKnowledge(
    domain: string,
    key: string,
    temporalContext?: unknown,
  ): unknown | null {
    const domainStore = this.unifiedKnowledgeStore[domain];
    if (!domainStore || !(key in domainStore)) {
      return null;
    }
    const knowledge = domainStore[key];
    if (temporalContext && knowledge.temporalContext) {
      if (!this.isTemporallyRelevant(knowledge.temporalContext, temporalContext)) {
        return { value: knowledge.value, note: 'Warning: Temporal context mismatch' };
      }
    }
    return knowledge.value;
  }

  retrieveDomainKnowledge(domain: string): Record<string, unknown> {
    const domainStore = this.unifiedKnowledgeStore[domain];
    if (!domainStore) return {};
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(domainStore)) {
      result[key] = domainStore[key].value;
    }
    return result;
  }

  recordEpisode(action: string, domains: string[], outcome: unknown, timestamp: number = Date.now()): boolean {
    this.episodicMemory.push({ action, domains, outcome, timestamp });
    return true;
  }

  getEpisodicMemory(): Episode[] {
    return [...this.episodicMemory];
  }

  isTemporallyRelevant(knowledgeContext: unknown, queryContext: unknown): boolean {
    const kc = knowledgeContext as { season?: string } | undefined;
    const qc = queryContext as { season?: string } | undefined;
    if (!kc?.season || !qc?.season) return true;
    return kc.season === qc.season;
  }

  registerTemporalPattern(
    name: string,
    pattern: unknown[],
    duration: number,
    description: string,
  ): boolean {
    this.temporalPatterns[name] = { pattern, duration, description };
    return true;
  }

  getTemporalPatterns(): TemporalPattern[] {
    return Object.values(this.temporalPatterns);
  }
}

// ========== Translation Layer ==========

const DOMAIN_KEYWORDS: Record<string, string[]> = {
  water: ['water', 'river', 'lake', 'rain', 'retention', 'precipitación', 'río', 'lago'],
  biodiversity: ['species', 'biodiversity', 'ecosystem', 'forest', 'especie', 'ecosistema', 'bosque'],
  governance: ['decision', 'governance', 'stakeholder', 'community', 'decisión', 'gobernanza', 'comunidad'],
  financial: ['finance', 'investment', 'economic', 'capital', 'finanzas', 'inversión', 'económico', 'capital'],
};

export class TranslationLayer {
  private contextHistory: Array<{ type: 'query' | 'response'; content: unknown; timestamp: number; environmentalContext?: unknown }> = [];

  constructor(private domainOrchestrator: DomainOrchestrator) {}

  processQuery(query: string, environmentalContext: unknown = {}): AgentQueryResult {
    this.contextHistory.push({ type: 'query', content: query, timestamp: Date.now(), environmentalContext });

    const domains = this.detectRelevantDomains(query);
    const response = this.domainOrchestrator.processDomainQuery(query, domains, environmentalContext);

    this.contextHistory.push({ type: 'response', content: response, timestamp: Date.now() });

    return this.formatResponse(response, domains);
  }

  formatResponse(response: IntegratedResponse, domains: string[]): AgentQueryResult {
    return {
      message: response.message ?? 'No specific message provided',
      insights: response.insights ?? [],
      recommendations: response.recommendations ?? [],
      domains,
      timestamp: Date.now(),
    };
  }

  detectRelevantDomains(query: string): string[] {
    const domains: string[] = [];
    const queryLower = query.toLowerCase();

    for (const [domain, keywords] of Object.entries(DOMAIN_KEYWORDS)) {
      if (keywords.some((kw) => queryLower.includes(kw.toLowerCase()))) {
        domains.push(domain);
      }
    }

    if (domains.length === 0) {
      domains.push('water', 'biodiversity', 'governance', 'financial');
    }
    return domains;
  }

  translateEnvironmentalData(sensorData: unknown): Record<string, unknown> {
    const insights: Record<string, unknown> = {};
    const data = sensorData as Record<string, unknown>;
    if (data.waterQuality) {
      insights.waterQuality = {
        status: this.interpretWaterQuality(data.waterQuality as Record<string, unknown>),
      };
    }
    if (data.biodiversity) {
      insights.biodiversity = {
        status: this.interpretBiodiversity(data.biodiversity as Record<string, unknown>),
      };
    }
    return insights;
  }

  private interpretWaterQuality(data: Record<string, unknown>): string {
    const pH = Number(data.pH);
    const do2 = Number(data.dissolvedOxygen);
    if (Number.isNaN(pH) || pH < 6 || pH > 8) return 'Concern';
    if (Number.isNaN(do2) || do2 < 5) return 'Alert';
    return 'Good';
  }

  private interpretBiodiversity(data: Record<string, unknown>): string {
    const speciesCount = Number(data.speciesCount);
    const baseline = Number(data.baseline);
    if (Number.isNaN(speciesCount) || Number.isNaN(baseline)) return 'Unknown';
    if (speciesCount < baseline * 0.8) return 'Declining';
    if (speciesCount > baseline * 1.1) return 'Improving';
    return 'Stable';
  }
}

// ========== Domain Orchestrator ==========

export class DomainOrchestrator {
  private domains: Record<string, { processQuery: (query: string, env: unknown) => IntegratedResponse; getInsights?: (timeframe?: string) => unknown[] }> = {};
  private memory: MemorySystem;

  constructor(memory: MemorySystem) {
    this.memory = memory;
  }

  registerDomain(
    name: string,
    module: { processQuery: (query: string, env: unknown) => IntegratedResponse; getInsights?: (timeframe?: string) => unknown[] },
  ): boolean {
    this.domains[name] = module;
    return true;
  }

  processDomainQuery(
    query: string,
    domainNames: string[],
    environmentalContext: unknown = {},
  ): IntegratedResponse {
    const domainResponses: Record<string, IntegratedResponse> = {};

    for (const domainName of domainNames) {
      if (this.domains[domainName]) {
        domainResponses[domainName] = this.domains[domainName].processQuery(query, environmentalContext);
      }
    }

    const integrated = this.integrateDomainResponses(domainResponses, query);

    this.memory.recordEpisode('query_response', domainNames, { query, response: integrated }, Date.now());

    return integrated;
  }

  integrateDomainResponses(
    domainResponses: Record<string, IntegratedResponse>,
    originalQuery: string,
  ): IntegratedResponse {
    const responseDomains = Object.keys(domainResponses);

    if (responseDomains.length === 1) {
      return domainResponses[responseDomains[0]];
    }

    const allInsights: DomainInsight[] = [];
    const allRecommendations: Recommendation[] = [];

    for (const domain of responseDomains) {
      const response = domainResponses[domain];
      for (const insight of response.insights ?? []) {
        allInsights.push({ domain, content: insight.content });
      }
      for (const rec of response.recommendations ?? []) {
        allRecommendations.push({ ...rec, domain });
      }
    }

    const conflicts = this.identifyConflicts(allRecommendations);
    let finalRecommendations = allRecommendations;

    if (conflicts.length > 0) {
      finalRecommendations = this.resolveConflicts(conflicts, allRecommendations);
    }

    finalRecommendations.sort((a, b) => b.priority - a.priority);

    return {
      message: this.generateIntegratedMessage(originalQuery, allInsights, finalRecommendations),
      insights: allInsights,
      recommendations: finalRecommendations,
      conflicts: conflicts.length > 0 ? conflicts : undefined,
    };
  }

  private identifyConflicts(recommendations: Recommendation[]): Array<{
    type: string;
    domains: string[];
    recommendations: Recommendation[];
  }> {
    const conflicts: Array<{ type: string; domains: string[]; recommendations: Recommendation[] }> = [];

    const waterRecs = recommendations.filter(
      (r) => r.domain === 'water' && r.content.content.type === 'usage',
    );
    const biodiversityRecs = recommendations.filter(
      (r) => r.domain === 'biodiversity' && r.content.content.type === 'habitat',
    );

    for (const waterRec of waterRecs) {
      for (const bioRec of biodiversityRecs) {
        const waterAction = waterRec.content.content.text ?? '';
        const bioAction = bioRec.content.content.text ?? '';
        if (
          (waterAction.includes('increase') && bioAction.includes('protect')) ||
          (waterAction.includes('divert') && bioAction.includes('maintain'))
        ) {
          conflicts.push({
            type: 'resource_usage',
            domains: ['water', 'biodiversity'],
            recommendations: [waterRec, bioRec],
          });
        }
      }
    }

    return conflicts;
  }

  private resolveConflicts(
    conflicts: Array<{ type: string; domains: string[]; recommendations: Recommendation[] }>,
    allRecommendations: Recommendation[],
  ): Recommendation[] {
    let resolved = [...allRecommendations];

    for (const conflict of conflicts) {
      const sorted = [...conflict.recommendations].sort((a, b) => b.priority - a.priority);
      for (let i = 1; i < sorted.length; i++) {
        const index = resolved.findIndex(
          (rec) =>
            rec.domain === sorted[i].domain &&
            JSON.stringify(rec.content) === JSON.stringify(sorted[i].content),
        );
        if (index !== -1) {
          resolved.splice(index, 1);
        }
      }
      const highest = resolved.find(
        (rec) => rec.domain === sorted[0].domain && JSON.stringify(rec.content) === JSON.stringify(sorted[0].content),
      );
      if (highest) {
        highest.note = `Precedence over conflicting advice from ${conflict.recommendations.slice(1).map((r) => r.domain).join(', ')}`;
      }
    }

    return resolved;
  }

  private generateIntegratedMessage(
    query: string,
    insights: DomainInsight[],
    recommendations: Recommendation[],
  ): string {
    let message = `Based on your query about "${query}", here's what I understand:\n\n`;
    if (insights.length > 0) {
      message += 'Key insights:\n';
      insights.slice(0, 3).forEach((insight, index) => {
        message += `${index + 1}. [${insight.domain}] ${String(insight.content)}\n`;
      });
      message += '\n';
    }
    if (recommendations.length > 0) {
      message += 'Recommendations:\n';
      recommendations.slice(0, 3).forEach((rec, index) => {
        message += `${index + 1}. [${rec.domain}] ${rec.content.text ?? String(rec.content)}\n`;
      });
    }
    return message;
  }
}
