# Harvey — Integración en HSCSG v15 OS

**Fecha**: 2026-10-29  
**Fuente**: `docs/harvey_backup.md`  
**Metodología**: HSCSG v15 OS — Asimilación Ecosistémica (4 fases) + Principio Anfibio

---

## 1. Perspectiva USUARIO — Qué quiere lograr en su nodo

### Journey del Usuario (Nodo Cosateca / HSCSG / Agencia Productizada)

> **Objetivo**: Tener un **agente de ventas autónomo soberano** en su nodo local que:
> - Encuentre prospectos de alto valor (micro-negocios 5-50 empleados, startups, empresas que contratan)
> - Escriba emails fríos **personalizados con hechos reales** (no templates genéricos)
> - Respete **límites legales y de deliverability** (CAN-SPAM, GDPR, warmup, opt-out)
> - Corra **sin coste marginal por token** (suscripción flat Claude/Codex)
> - Sea **auditable, editable y gobernable** por el colectivo (CDS)
> - Se integre con **CAAS payouts** (comisiones por cerrar → ZNU/USDC)
> - Alimente **Integral Loop** (señales → issues → decisiones → créditos → FRS)

### Flujos de Usuario Esperados

| Flujo | Descripción | Output HSCSG |
|-------|-------------|--------------|
| **Setup Inicial** | `harvey train <url>` → aprende producto, ICP, persona | `product_knowledge.md`, `competitive_intel.md` (gitignored) |
| **Configurar Señales** | `harvey signals --confirm free` → 26 señales gratis confirmadas | `SignalCatalog` en `integral.signals` + `capacidades` |
| **Descubrir** | `harvey discover --provider osm` (gratis) o DataForSEO/Serper | `Companies` + `Observations` en `integral` + `evidence` |
| **Perfilar** | `harvey profile` → 3 HTTP requests/biz, gratis | `signal_code` rows en `observations` (history = time series) |
| **Cohort Builder** | Dashboard: "Has agency AND running Google Ads AND NOT online booking → 23 cos" | `CohortQuery` en `integral` (SQL intersection) |
| **Escribir Campaña** | Writer agent → 3-email sequence (AIDA/PAS/BAB/QVC/3Ps) | `Campaign` + `Outbox` items en `content` + `agencia` |
| **Aprobar/Enviar** | Dashboard Outbox: A/R/E/J/K → approval ladder | `boundaries` policy gate + `caas` commission tracking |
| **Manejar Respuestas** | Handler → LAARC loop, intent classification, draft reply | `Conversation` stages en `integral` + `symbiosky` |
| **Analytics** | Analyst (idle cycles) → pipeline stats, intent distribution | `PVSO` metrics + `FRS` signals |
| **Payouts** | Closed-won → commission split → CAAS payout | `caas.runCaasPayout` filtrado por `poh.identities` |

### UX Requerida (Pantalla `Harvey.tsx`)

Tabs principales:
1. **Descubrir** — Provider menu con precios, estimate, run, presets (yc/accelerator/funding/hiring)
2. **Perfilar** — Leer sitios de empresas descubiertas, ver signals extraídos
3. **Escribir** — Campaigns escritas, feedback per-campaign para Writer
4. **Enviar** — Outbox decisions desk (A/R/E/J/K), approval/autopilot toggle
5. **Responder** — Conversations con threads, hand-back buttons, LAARC drafts
6. **Señales** — Signal catalog confirmation gate + Cohort builder (must have / disqualify / range)
7. **Analytics** — Today screen (4 headline figures, 14-day trends), Activity, Usage, Controls
8. **Config** — Persona, Product, ICP, Channels, Usage, Brain, Writer (YAML editor)

---

## 2. Perspectiva LLM — Qué asimilar (lógica pura) y qué extirpar (infra ajena)

### ✅ ASIMILAR — Lógica Pura (TypeScript, sin deps externas)

#### Tipos de Dominio (`src/core/state/harvey.ts`)

```typescript
// ===== Config Harvey (subset de harvey.yaml) =====
export interface HarveyPersona {
  name: string
  company: string
  role: string
  email: string
  tone: string
}

export interface HarveyProduct {
  name: string
  description: string
  pricing: string
  keyBenefits: string[]
  objectionResponses: Record<string, string>
  offer: string
  bookingUrl?: string
}

export interface HarveyICP {
  industries: string[]
  titles: string[]
  companySize: string
  geography: string[]
  hiringSignals: string[]
  geoCoordinates?: { lat: number; lng: number }[]
}

export interface HarveyEmailChannel {
  provider: 'gmail' | 'microsoft' | 'smtp' | 'instantly'
  maxDailySends: number
  requireApproval: boolean
  sendToRisky: boolean
  maxBounceRate: number
  warmup: { startDate?: string; minDays: number; dailyIncrease: number }
  sendWindow: { start: string; end: string; weekdaysOnly: boolean; timezone: string }
  linkDomains: string[]
}

export interface HarveyUsage {
  maxDailyClaudePercent: number
  heartbeatIntervalMinutes: number
  quietHours: { start: string; end: string; timezone: string }
}

export interface HarveyBrain {
  provider: 'claude' | 'codex'
  model?: string
  reasoningEffort?: 'minimal' | 'low' | 'medium' | 'high' | 'xhigh'
}

export interface HarveyWriter {
  humanizer?: boolean
}

export interface HarveyConfig {
  persona: HarveyPersona
  product: HarveyProduct
  icp: HarveyICP
  channels: { email: HarveyEmailChannel }
  usage: HarveyUsage
  brain: HarveyBrain
  writer: HarveyWriter
  compliance: {
    optOutLine: string
    postalAddress: string
    doNotContact: string[]
    precleared: { enabled: boolean; apiKey?: string }
  }
}

// ===== Signal Catalog (29 signals) =====
export type SignalCategory = 'discovery' | 'profile' | 'people' | 'contact'

export interface SignalDefinition {
  code: string
  category: SignalCategory
  label: string
  description: string
  cost: 'free' | 'paid'
  costDetail?: string
  confirmationRequired: boolean
  confirmed: boolean
}

export const HARVEY_SIGNALS: SignalDefinition[] = [
  // Discovery
  { code: 'SERP_RANK', category: 'discovery', label: 'SERP Rank', description: 'Positions 11-30: visible enough to be trying, and losing', cost: 'paid', costDetail: 'DataForSEO SERP / Serper', confirmationRequired: true, confirmed: false },
  { code: 'IN_LOCAL_PACK', category: 'discovery', label: 'In Local Pack', description: 'Holds one of three map slots above results', cost: 'paid', costDetail: 'DataForSEO Maps / Scavio Maps', confirmationRequired: true, confirmed: false },
  { code: 'MAPS_RANK', category: 'discovery', label: 'Maps Rank', description: 'Position in Google Maps', cost: 'paid', costDetail: 'DataForSEO Maps / Scavio Maps', confirmationRequired: true, confirmed: false },
  { code: 'NO_WEBSITE', category: 'discovery', label: 'No Website', description: 'Listing + phone + no site. Highest intent if you sell websites', cost: 'free', costDetail: 'DataForSEO Business Listings / Scavio Maps', confirmationRequired: true, confirmed: false },
  { code: 'UNCLAIMED_LISTING', category: 'discovery', label: 'Unclaimed Listing', description: 'Nobody claimed their Google Business Profile', cost: 'free', costDetail: 'DataForSEO Business Listings / Scavio Maps', confirmationRequired: true, confirmed: false },
  { code: 'REVIEW_RATING', category: 'discovery', label: 'Review Rating', description: 'Good but invisible, or visible but struggling', cost: 'free', costDetail: 'DataForSEO / Scavio', confirmationRequired: true, confirmed: false },
  { code: 'REVIEW_COUNT', category: 'discovery', label: 'Review Count', description: 'Volume of reviews', cost: 'free', costDetail: 'DataForSEO / Scavio', confirmationRequired: true, confirmed: false },
  // Profile
  { code: 'INCUMBENT_AGENCY', category: 'profile', label: 'Incumbent Agency', description: 'Current agency credited in footer. Builds targetable roster', cost: 'free', costDetail: 'Homepage scrape', confirmationRequired: true, confirmed: false },
  { code: 'RUNNING_GOOGLE_ADS', category: 'profile', label: 'Running Google Ads', description: 'Spending on acquisition today. Strongest budget signal', cost: 'free', costDetail: 'Homepage scrape (ad pixels)', confirmationRequired: true, confirmed: false },
  { code: 'RUNNING_META_ADS', category: 'profile', label: 'Running Meta Ads', description: 'Spending on Meta today', cost: 'free', costDetail: 'Homepage scrape (ad pixels)', confirmationRequired: true, confirmed: false },
  { code: 'NO_ONLINE_BOOKING', category: 'profile', label: 'No Online Booking', description: 'Leads must phone in, after-hours demand lost', cost: 'free', costDetail: 'Homepage scrape', confirmationRequired: true, confirmed: false },
  { code: 'NO_SCHEMA_MARKUP', category: 'profile', label: 'No Schema Markup', description: 'Concrete, checkable SEO gap', cost: 'free', costDetail: 'Homepage scrape', confirmationRequired: true, confirmed: false },
  { code: 'BLOG_STALE', category: 'profile', label: 'Blog Stale', description: 'Content marketing started and abandoned', cost: 'free', costDetail: 'Homepage + sitemap', confirmationRequired: true, confirmed: false },
  { code: 'SITE_PAGE_COUNT', category: 'profile', label: 'Site Page Count', description: 'Size of website', cost: 'free', costDetail: 'Sitemap.xml', confirmationRequired: true, confirmed: false },
  { code: 'TECH_STACK', category: 'profile', label: 'Tech Stack', description: 'Platform detection', cost: 'free', costDetail: 'Homepage headers/meta', confirmationRequired: true, confirmed: false },
  { code: 'BLOCKS_AI_CRAWLERS', category: 'profile', label: 'Blocks AI Crawlers', description: 'AI-search visibility', cost: 'free', costDetail: 'robots.txt', confirmationRequired: true, confirmed: false },
  { code: 'HIRING_ROLE', category: 'profile', label: 'Hiring Role', description: 'Roles matching icp.hiring_signals from careers page/board', cost: 'free', costDetail: 'Careers page / Greenhouse/Lever/Ashby/Workable feed', confirmationRequired: true, confirmed: false },
  { code: 'OPEN_ROLES', category: 'profile', label: 'Open Roles', description: 'Number of open roles', cost: 'free', costDetail: 'Careers page', confirmationRequired: true, confirmed: false },
  { code: 'YC_BACKED', category: 'profile', label: 'YC Backed', description: 'YC batch (W24, S23) from own site', cost: 'paid', costDetail: 'Serper/DataForSEO SERP', confirmationRequired: true, confirmed: false },
  { code: 'ACCELERATOR', category: 'profile', label: 'Accelerator', description: 'Techstars, 500 Global, Antler, EF, SPC, Neo, AI Grant, a16z speedrun, Plug and Play, Pioneer', cost: 'paid', costDetail: 'Serper/DataForSEO SERP', confirmationRequired: true, confirmed: false },
  { code: 'FUNDING_ROUND', category: 'profile', label: 'Funding Round', description: 'Raise announced on own site last 18 months (round, amount, date)', cost: 'paid', costDetail: 'Serper/DataForSEO SERP', confirmationRequired: true, confirmed: false },
  // People
  { code: 'CONTACT_FOUND', category: 'people', label: 'Contact Found', description: 'Named person on site', cost: 'free', costDetail: 'Team/About pages', confirmationRequired: true, confirmed: false },
  { code: 'DECISION_MAKER_TITLE', category: 'people', label: 'Decision Maker Title', description: 'Title matches ICP', cost: 'free', costDetail: 'Team/About pages', confirmationRequired: true, confirmed: false },
  { code: 'LIKELY_OWNER', category: 'people', label: 'Likely Owner', description: 'Owner by surname-in-name or title', cost: 'free', costDetail: 'Team/About pages', confirmationRequired: true, confirmed: false },
  { code: 'REGISTRY_VERIFIED', category: 'people', label: 'Registry Verified', description: 'Owner verified via public registry', cost: 'free', costDetail: 'Companies House / similar', confirmationRequired: true, confirmed: false },
  // Contact
  { code: 'EMAIL_PATTERN', category: 'contact', label: 'Email Pattern', description: 'Learned from published addresses', cost: 'free', costDetail: 'Site scrape', confirmationRequired: true, confirmed: false },
  { code: 'EMAIL_STATUS', category: 'contact', label: 'Email Status', description: 'verified / risky / guess / invalid', cost: 'free', costDetail: 'Verification logic', confirmationRequired: true, confirmed: false },
  { code: 'CONTACT_FORM_URL', category: 'contact', label: 'Contact Form URL', description: 'Fallback when no email', cost: 'free', costDetail: 'Site scrape', confirmationRequired: true, confirmed: false },
]

// ===== Observation (Row-per-fact, governed vocabulary) =====
export interface Observation {
  id: string
  companyId: string
  prospectId?: string
  collector: 'discover' | 'profile' | 'enrich' | 'verify' | 'scout' | 'writer' | 'handler' | 'analyst'
  signalCode: string
  valueNum?: number
  valueText?: string
  confidence: number        // 0-1
  evidenceUrl?: string
  observedAt: number
  runId: string
}

// ===== Company =====
export interface Company {
  id: string
  name: string
  domain?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  country?: string
  latitude?: number
  longitude?: number
  source: 'osm' | 'tinyfish' | 'dataforseo_business' | 'dataforseo_serp' | 'dataforseo_maps' | 'serper' | 'scavio_maps' | 'scavio_search'
  sourceRawId?: string
  createdAt: number
  updatedAt: number
  observations: Observation[]
}

// ===== Prospect (max 2 per company: owner + decision maker) =====
export interface Prospect {
  id: string
  companyId: string
  name: string
  title: string
  email?: string
  emailStatus: 'verified' | 'risky' | 'guess' | 'invalid'
  emailPattern?: string
  isOwner: boolean
  isDecisionMaker: boolean
  evidence: string[]        // qué observaciones respaldan este prospect
  stage: ProspectStage
  createdAt: number
  updatedAt: number
}

export type ProspectStage =
  | 'discovered'
  | 'profiled'
  | 'enriched'
  | 'verified'
  | 'campaign_queued'
  | 'initial_outreach'
  | 'engaged'
  | 'qualifying'
  | 'presenting'
  | 'negotiating'
  | 'closing'
  | 'closed_won'
  | 'closed_lost'
  | 'opted_out'
  | 'bounced'

// ===== Campaign =====
export interface Campaign {
  id: string
  prospectId: string
  framework: 'AIDA' | 'PAS' | 'BAB' | 'QVC' | '3Ps'
  emails: CampaignEmail[]
  status: 'draft' | 'queued' | 'sending' | 'sent' | 'paused' | 'completed' | 'replied'
  createdAt: number
  sentAt?: number
  feedback?: CampaignFeedback
}

export interface CampaignEmail {
  id: string
  sequenceNumber: 1 | 2 | 3
  subject: string
  body: string
  wordCount: number
  signalsReferenced: string[]     // qué signal_codes usa este email
  status: 'draft' | 'pending_approval' | 'approved' | 'held' | 'sent' | 'bounced' | 'replied'
  approvedAt?: number
  sentAt?: number
  scheduledAt?: number
  outboxId?: string
}

// ===== Conversation (Handler) =====
export interface Conversation {
  id: string
  prospectId: string
  campaignId: string
  stage: ConversationStage
  messages: ConversationMessage[]
  handedToHuman: boolean
  handedReason?: string
  closedAt?: number
  outcome?: 'won' | 'lost'
}

export type ConversationStage =
  | 'initial_outreach'
  | 'engaged'
  | 'qualifying'
  | 'presenting'
  | 'negotiating'
  | 'closing'
  | 'closed_won'
  | 'closed_lost'

export interface ConversationMessage {
  id: string
  from: 'prospect' | 'harvey' | 'human'
  text: string
  intent?: MessageIntent
  intentConfidence?: number
  draftReply?: string
  draftStatus?: 'pending' | 'approved' | 'held' | 'rejected'
  timestamp: number
}

export type MessageIntent =
  | 'interested'
  | 'objection_budget'
  | 'objection_authority'
  | 'objection_need'
  | 'objection_timing'
  | 'meeting_request'
  | 'contract_request'
  | 'opt_out'
  | 'other'

// ===== Outbox Item =====
export interface OutboxItem {
  id: string
  campaignId: string
  emailId: string
  prospectId: string
  companyId: string
  to: string
  subject: string
  body: string
  status: 'pending_approval' | 'approved' | 'held' | 'rejected' | 'sent' | 'bounced'
  verification: { emailStatus: string; signals: string[]; evidenceUrls: string[] }
  createdAt: number
  approvedAt?: number
  sentAt?: number
  heldReason?: string
}

// ===== Discovery Provider =====
export type DiscoveryProvider =
  | 'osm'
  | 'tinyfish'
  | 'dataforseo_business'
  | 'dataforseo_serp'
  | 'dataforseo_maps'
  | 'serper'
  | 'scavio_maps'
  | 'scavio_search'

export interface DiscoveryProviderInfo {
  id: DiscoveryProvider
  name: string
  costPerUnit: number
  unit: string
  freeTier: string
  bestFor: string
  requiresAccount: boolean
  requiresApiKey: boolean
}

// ===== Pipeline Decision (Determinístico) =====
export type PipelineAction =
  | 'handle_replies'
  | 'send_campaigns'
  | 'write_campaigns'
  | 'prospect'
  | 'idle_analyze'

export interface PipelineDecision {
  action: PipelineAction
  reason: string
  count: number
  details: string[]
}

// ===== Estado Global Harvey =====
export interface HarveyState {
  config: HarveyConfig
  signals: SignalDefinition[]
  companies: Company[]
  prospects: Prospect[]
  campaigns: Campaign[]
  conversations: Conversation[]
  outbox: OutboxItem[]
  runs: HarveyRun[]
  usage: HarveyUsageEvents
  settings: HarveySettings
  dashboardToken: string
}

export interface HarveyRun {
  id: string
  startedAt: number
  completedAt?: number
  decision: PipelineAction
  actionsTaken: string[]
  tokensUsed: { scout: number; writer: number; handler: number; sender: number; analyst: number }
  quotaRemaining: number
  errors: string[]
}

export interface HarveyUsageEvents {
  dailyCalls: number
  dailyTokens: { scout: number; writer: number; handler: number; sender: number; analyst: number }
  claudeQuotaPercent?: number
  codexQuotaPercent?: number
  lastQuotaCheck: number
}

export interface HarveySettings {
  warmup: { minDays: number; dailyIncrease: number; startDate?: string }
  linkedin: { enabled: boolean; credentials?: any }
  trulyinbox: { connected: boolean; apiKey?: string }
  precleared: { enabled: boolean; apiKey?: string }
}
```

#### Lógica Pura (`src/core/lib/harvey.ts`)

**Funciones fábrica + helpers (NO importan infra Python/CLI/SQLite):**

```typescript
// Factory
makeHarveyState(): HarveyState

// Config
loadHarveyConfig(yamlPath: string): HarveyConfig
saveHarveyConfig(config: HarveyConfig, yamlPath: string): void
mergeLocalConfig(base: HarveyConfig, local: Partial<HarveyConfig>): HarveyConfig

// Signal Catalog
getSignalCatalog(): SignalDefinition[]
confirmSignal(state: HarveyState, code: string): HarveyState
rejectSignal(state: HarveyState, code: string): HarveyState
getConfirmedSignals(state: HarveyState): SignalDefinition[]

// Discovery Providers
getDiscoveryProviders(): DiscoveryProviderInfo[]
estimateDiscoveryCost(provider: DiscoveryProvider, params: { locations: string[]; keywords: string[]; maxResults?: number }): { estimatedCost: number; estimatedResults: number }
runDiscovery(state: HarveyState, provider: DiscoveryProvider, params: DiscoveryParams): { state: HarveyState; companies: Company[]; runId: string }

// Profiling (Free HTTP profiler)
profileCompany(state: HarveyState, companyId: string): { state: HarveyState; observations: Observation[] }
profileCompaniesBatch(state: HarveyState, companyIds: string[]): { state: HarveyState; observations: Observation[] }

// Enrichment (Owners/Decision Makers)
enrichCompany(state: HarveyState, companyId: string): { state: HarveyState; prospects: Prospect[] }

// Email Verification
verifyEmailPattern(state: HarveyState, companyId: string): { state: HarveyState; pattern: string }
verifyProspectEmail(state: HarveyState, prospectId: string): { state: HarveyState; emailStatus: 'verified' | 'risky' | 'guess' | 'invalid' }

// Cohort Builder (SQL intersection → query)
buildCohortQuery(filters: CohortFilters): string
executeCohortQuery(state: HarveyState, query: string): Company[]
countCohortMatches(state: HarveyState, query: string): number

export interface CohortFilters {
  mustHave: string[]           // signal_codes requeridos
  mustNotHave: string[]        // signal_codes que descalifican
  ranges: { code: string; min?: number; max?: number }[]  // rangos numéricos
}

// Writer Agent (Skills injection)
generateCampaign(state: HarveyState, prospectId: string, companyId: string): { state: HarveyState; campaign: Campaign }
retryFailedWrites(state: HarveyState): HarveyState

// Sender Agent
stageEmailForSending(state: HarveyState, campaignId: string, emailId: string): HarveyState
drainOutbox(state: HarveyState): { state: HarveyState; sent: number; held: number; errors: string[] }
pauseSending(state: HarveyState): HarveyState
resumeSending(state: HarveyState): HarveyState

// Handler Agent
pollReplies(state: HarveyState): { state: HarveyState; newReplies: ConversationMessage[] }
classifyIntent(message: string, context: ConversationContext): { intent: MessageIntent; confidence: number }
generateReply(state: HarveyState, conversationId: string, messageId: string): { state: HarveyState; draft: string }
advanceConversationStage(state: HarveyState, conversationId: string, newStage: ConversationStage): HarveyState
handleBounce(state: HarveyState, email: string): HarveyState  // kill-switch si bounce rate > threshold

// Analyst Agent
generatePipelineStats(state: HarveyState): PipelineStats
generateCampaignPerformance(state: HarveyState, campaignId: string): CampaignPerformance
generateIntentDistribution(state: HarveyState): IntentDistribution

// Pipeline Decision Logic (Determinístico, sin modelo)
decideNextAction(state: HarveyState): PipelineDecision
shouldRunHeartbeat(state: HarveyState): boolean
checkBudget(state: HarveyState): { ok: boolean; reason?: string; quotaPercent?: number }

// Utils
export function formatSignalForEmail(signal: SignalDefinition, company: Company): string
export function selectFramework(signals: SignalDefinition[], stage: ProspectStage): 'AIDA' | 'PAS' | 'BAB' | 'QVC' | '3Ps'
export function applyLAARC(intent: MessageIntent, context: ConversationContext): string
export function checkOptOut(message: string): boolean
export function checkDoNotContact(email: string, doNotContactList: string[]): boolean
export function validatePreSendGate(email: CampaignEmail, config: HarveyConfig): { ok: boolean; errors: string[] }
```

#### Skills Loader (`src/core/lib/harvey-skills.ts`)

```typescript
// Skills son Markdown plano → concatenados al prompt del agente
// skills/email_frameworks.md, signal_playbook.md, objection_handling.md, etc.

export interface SkillFile {
  name: string
  content: string
  agents: ('scout' | 'writer' | 'sender' | 'handler' | 'analyst')[]
}

export function loadSkills(skillsDir: string): SkillFile[]
export function getSkillsForAgent(skills: SkillFile[], agent: 'scout' | 'writer' | 'sender' | 'handler' | 'analyst'): string
export function injectSkillsIntoPrompt(basePrompt: string, skillsContent: string): string
export function watchSkillsDir(skillsDir: string, onChange: () => void): () => void  // hot reload sin restart
```

#### Pipeline Orchestrator (`src/core/lib/harvey-pipeline.ts`)

```typescript
// Heartbeat loop determinístico
export interface HeartbeatConfig {
  intervalMinutes: number
  quietHours: { start: string; end: string; timezone: string }
  maxDailyClaudePercent: number
}

export class HarveyHeartbeat {
  constructor(
    private getState: () => HarveyState,
    private setState: (fn: (s: HarveyState) => HarveyState) => void,
    private config: HeartbeatConfig
  ) {}

  async tick(): Promise<void> {
    const state = this.getState()
    
    // 1. Quiet hours?
    if (this.inQuietHours(state)) return this.sleep()
    
    // 2. Budget OK?
    const budget = checkBudget(state)
    if (!budget.ok) return this.sleep()
    
    // 3. Decide (deterministic priority)
    const decision = decideNextAction(state)
    
    // 4. Act
    let newState = state
    switch (decision.action) {
      case 'handle_replies':
        newState = await this.handleReplies(newState)
        break
      case 'send_campaigns':
        newState = await this.drainOutbox(newState)
        break
      case 'write_campaigns':
        newState = await this.writeCampaigns(newState)
        break
      case 'prospect':
        newState = await this.runDiscoveryCycle(newState)
        break
      case 'idle_analyze':
        newState = this.runAnalyst(newState)
        break
    }
    
    // 5. Profiling + Outbox draining (every cycle)
    newState = this.profilePending(newState)
    newState = this.drainOutbox(newState)
    
    // 6. Log
    this.logRun(newState, decision)
    this.setState(() => newState)
  }

  // ... implementation methods
}
```

### ❌ EXTIRPAR — Infraestructura Ajena (NO llevar a HSCSG)

| Componente Original | Por qué extirpar | Reemplazo HSCSG |
|---------------------|------------------|-----------------|
| Python CLI (`harvey` command) | Runtime-specific | TS functions + scheduler en `automaton` / cron |
| SQLite (`data/harvey.db`) | File-based, single-process | Zustand store + `integral` observations (row-per-fact) |
| FastAPI Dashboard (`dashboard.py`) | Python web framework | React screen `Harvey.tsx` + existing dashboard patterns |
| Claude/Codex CLI isolation (`claude_runtime.py`, `codex.py`) | Process isolation, temp dirs | `boundaries` policy gateway + `agentMesh` isolation |
| SMTP/Gmail/IMAP/Microsoft Graph integrations | Mail provider SDKs | `channels` config + adapter pattern (anfibio) |
| TrulyInbox API | External SaaS | `regen`/`vecinal` community warmup tracking |
| Precleared API | External legal check | `boundaries` + `compliance` module |
| `harvey train <url>` (writes gitignored files) | File I/O side effects | `content.captureIdea` + `content.scoreIdea` + `agencia.setBrandDNA` |
| Discovery HTTP clients (Scout/Profile) | `httpx` + custom logic | `src/core/lib/harvey-discovery.ts` (pure TS, fetch) |
| Email rendering (Jinja2-like merge vars) | Python template | `src/core/lib/harvey-email.ts` (pure TS) |
| CSV Export | `csv` module | `content.exportHighlight` pattern / `agencia` deliverables |
| Loguru logging | Python logging | `automaton` audit log / `boundaries` audit |

### 🔄 ADAPTADORES ANFIBIOS (Modo Postmonetario ↔ Conectado)

```typescript
// src/core/lib/amphibious/harvey-adapters.ts
export interface HarveyAdapter {
  // Postmonetario (local, ZNU, offline-first)
  discoverLocal(params: DiscoveryParams): Company[]
  profileLocal(companyId: string): Observation[]
  writeCampaignLocal(prospectId: string): Campaign
  sendLocal(outboxId: string): void
  handleRepliesLocal(): ConversationMessage[]
  
  // Conectado (Claude/Codex CLI, mail providers, paid discovery)
  discoverConnected(params: DiscoveryParams): Promise<Company[]>
  writeCampaignConnected(prospectId: string): Promise<Campaign>
  sendConnected(outboxId: string): Promise<void>
  pollRepliesConnected(): Promise<ConversationMessage[]>
  checkQuotaConnected(): Promise<{ claude?: number; codex?: number }>
}

export function createHarveyAdapter(mode: 'postmonetario' | 'conectado', getState, setState): HarveyAdapter
```

---

## 3. Perspectiva HSCSG + CaaS — Isomorfismo con Leyes MJ I/II/III + CaaS

### Ley I: No Dañar Base Material ni Personas
- **Opt-out honesto e inmediato**: Cualquier "no thanks"/"STOP" = opt-out permanente, nada mueve a alguien off opted-out
- **Do-not-contact list**: Competidores, clientes existentes, dominios bloqueados — send gate checks on every email
- **Precleared check**: Verificación legal per-recipient antes de 1er cold email (GDPR/PECR/CASL)
- **Warmup obligatorio**: Dedicated domain, SPF/DKIM/DMARC, ramp lento — protege reputación del nodo
- **Bounce kill-switch**: >3% bounce rate → auto-pause, protege deliverability colectiva
- **LinkedIn off by default**: Respeta ToS, no pone en riesgo cuentas del colectivo
- **Bot disclosure**: Harvey instruido a responder verdad si preguntan "¿eres IA?"

### Ley II: Ganarse la Vida Soberanizando (AUT × CDS)
- **Signal catalog = AUT**: Usuario CONFIRMA qué señales busca (no black box) → soberanía de targeting
- **Cohort = Query explicable**: "Has agency AND running Google Ads AND NOT online booking → 23 cos" → CDS (decisión colectiva trazable)
- **Writer frameworks = Valor real**: AIDA/PAS/BAB/QVC/3Ps + ban-list AI-tells → emails que inician conversación, no pitch
- **Offer strategy**: "Never lead with offer, never pitch in cold email" → valor antes que extracción
- **Handler LAARC**: Listen→Acknowledge→Assess→Respond→Confirm → encontrar concern real, no "overcome objection"
- **Commission tracking**: Closed-won → `caas` payout split → AUT real monetizado
- **Subscription quota budgeting**: `max_daily_claude_percent` → deja headroom para trabajo propio del nodo

### Ley III: Lucidez, Nunca Engañar
- **Observations = Row-per-fact**: `observations(company_id, signal_code, value, confidence, evidence_url, run_id)` → append-only, provenance, history free
- **Confidence + evidence viajan con el dato**: "We think agency is X, 0.9 confidence, here's the URL"
- **Pre-send gate determinístico**: Unrendered merge tags, banned phrases, length cap, non-deliverable addresses → NO modelo, código puro
- **Approval queue por defecto**: Human-in-the-loop hasta que el colectivo confía
- **Autopilot holds**: External links, quoted instructions → held para revisión (prompt injection defense)
- **Signal vocabulary governed**: DB trigger rechaza `signal_code` no en catálogo → typo fails loudly
- **CSV export policy**: Excludes opted-out/unverified por defecto → no leak accidental

### CaaS (Comunidad como Servicio) — Acceso por Contribución Real
| Tier CaaS | Requisito Harvey | Acceso |
|-----------|------------------|--------|
| `visitante` | — | Ver dashboard read-only |
| `colaborador` | `PoHIdentity` + 1 campaign approved | Run discover/profile (free providers), ver analytics |
| `custodio` | `PoHIdentity` + 5 campaigns + bounce rate <2% | Paid discovery providers, autopilot toggle, commission split |
| `fundador` | `PoHIdentity` + 50 campaigns + $10k closed-won | Multi-product, calendar integration, voice callbacks config |

### Isomorfismos con Módulos Existentes

| Módulo HSCSG | Isomorfismo Harvey | Vasos Comunicantes |
|--------------|---------------------|---------------------|
| `automaton` | Heartbeat loop + decision logic | `harvey-pipeline.ts` → `automaton.proposeAction` |
| `agentCanvas` / `agentMesh` | Sub-agentes (Scout/Writer/Handler/Sender/Analyst) | `spawnAgent` con skills específicas |
| `content` (ContentCreation-OS) | Writer + skills library + product_knowledge | `captureIdea` → `product_knowledge.md`, `scoreIdea` → campaign feedback |
| `agencia` (DeseOS/Contento.pro) | Methodology + offer_strategy + competitive_intel | `reversePlan`, `setOfferPrice`, `addICP` |
| `boundaries` (Policy gateway) | Pre-send gate + do-not-contact + opt-out + precleared | `setBoundaryPolicy`, `addBoundaryRule` |
| `integral` (CDS→OAD→COS→ITC→FRS) | Signal catalog → Cohort query → Campaign → Conversation → Closed-won → Credits | `raiseIntegralIssue`, `ingestIntegralSignal`, `awardIntegralCredits` |
| `evidence` (CompAI CRM) | Signal observations + email verification + LAARC classification | `scoreEvidence`, `EvidenceKind` mapping |
| `symbiosky` | LAARC loop = conviction voting, reputation decay | `symCastVote`, `symDecayTick` |
| `caas` | Commission payouts, tier gating | `runCaasPayout`, `setCaasTier` |
| `capacidades` | Signal catalog as capabilities | `toggleCapability` per signal |
| `poh` | Sender identity verification | `attestKlerosIdentity` para sender reputation |
| `kleros` | Dispute resolution for commission disputes | `openKlerosDispute`, `resolveKlerosDispute` |
| `znu` / `priceParity` | Subscription quota budgeting (anfibio) | `nodeMode`, `setPriceParity` |

---

## 4. Decisiones EBD (Evidence-Based Design) — Plantilla Obligatoria

| D# | Decisión | Evidencia Primaria | Módulo/Test Afectado |
|----|----------|-------------------|---------------------|
| D1 | **Harvey nativo offline-first** (subscription-backed, no API keys) | Harvey usa Claude Code/Codex CLI en safe-mode; HSCSG principio anfibio | `harvey.ts`, `harvey-adapters.ts` |
| D2 | **Signal Catalog = Governed Vocabulary** (DB trigger rejects unknown codes) | Harvey: "typo fails loudly instead of quietly inventing junk signal" | `harvey.ts:SignalDefinition`, `integral.ts:observations` |
| D3 | **Row-per-fact Observations** (history free, confidence+provenance) | Harvey SQLite schema: `observations` table con evidence_url | `harvey.ts:Observation`, `evidence.ts` |
| D4 | **Deterministic Pipeline Decision** (4 counts, no model call) | Harvey: "decides deterministically... four counts: handle replies > send > write > prospect" | `harvey-pipeline.ts:decideNextAction` |
| D5 | **Approval Queue por Defecto** (human-in-the-loop) | Harvey: "every outgoing email waits for your approval... copilot until you decide otherwise" | `Harvey.tsx:Outbox`, `boundaries.ts` |
| D6 | **Pre-send Gate Determinístico** (sin modelo) | Harvey: "deterministic pre-send gate — no model involved — rejects: unrendered merge tags, banned phrases..." | `harvey.ts:validatePreSendGate`, `gate.py` logic |
| D7 | **LAARC Loop para Objections** (Listen→Acknowledge→Assess→Respond→Confirm) | Harvey `objection_handling.md`: "not overcoming, finding actual concern" | `harvey.ts:applyLAARC`, `symbiosky` |
| D8 | **Skills = Markdown Editable** (hot reload, no fine-tuning) | Harvey: "Change a file, next heartbeat behaves differently — no restart, no code change" | `harvey-skills.ts:watchSkillsDir` |
| D9 | **Cohort = Query, Not List** (SQL intersection) | Harvey: "A cohort is a query... set intersection happens in SQL" | `harvey.ts:buildCohortQuery`, `integral` loop |
| D10 | **Subscription Quota Budgeting** (max_daily_claude_percent) | Harvey: "reads active provider's subscription quota and throttles" | `harvey-pipeline.ts:checkBudget`, `caas` |
| D11 | **Email Verification Honesta** (verified/risky/guess/invalid, only deliverable sent) | Harvey: "A guess is never treated as a win" | `harvey.ts:verifyProspectEmail`, `evidence.ts:FactBand` |
| D12 | **Anfibio Codex/Claude** (aislamiento total, no fallback) | Harvey: "never falls back to Claude... if Codex fails, call fails with clear log" | `harvey-adapters.ts`, `boundaries` isolation |

---

## 5. Decisiones de Validación Estratégica (DV)

| DV# | Decisión | Justificación | Go/No-Go |
|-----|----------|---------------|----------|
| DV-01 | **Integrar Harvey como módulo `harvey` (no extender `automaton` únicamente)** | Harvey añade: discovery providers, signal catalog, cohort builder, writer frameworks, handler LAARC, approval queue, deliverability pipeline — más que solo heartbeat | **GO** |
| DV-02 | **Reutilizar `EvidenceModel` de `@core/lib/evidence` para signal observations** | Evidence Model (CompAI CRM) ya implementado con kinds + bands; signal observations = evidence con collector=scout/profile/enrich/verify | **GO** |
| DV-03 | **Skills loader = Markdown concatenation (no vector store/RAG)** | Isomorfo a Harvey: "skills concatenated straight into prompt... no fine-tuning, no vector store" | **GO** |
| DV-04 | **Dashboard = React screen `Harvey.tsx` (no FastAPI port)** | HSCSG ya tiene dashboard patterns (`Justicia.tsx`, `Pipeline.tsx`); FastAPI = infra ajena | **GO** |
| DV-05 | **Discovery providers = Adapter pattern (anfibio)** | Free providers (OSM, TinyFish) = postmonetario; Paid (DataForSEO, Serper) = conectado con priceParity | **GO** |
| DV-06 | **Mail providers = Adapter pattern (Gmail/Microsoft/SMTP/Instantly)** | Same interface, diferente implementación; `channels.email.provider` config | **GO** |
| DV-07 | **Codex isolation = `boundaries` policy gateway** | Harvey: "private temp home, empty workspace, no tools, no MCP, no hooks, no skills" = `boundaries.deny` all tools | **GO** |

---

## 6. KPIs Mínimos por Módulo (Tests Obligatorios)

| Módulo | KPIs Mínimos | Test File |
|--------|--------------|-----------|
| `harvey.ts` | `makeHarveyState` → estado válido; `decideNextAction` → prioridad correcta; `validatePreSendGate` → rechaza merge tags/banned phrases; `applyLAARC` → respuesta por intent; `buildCohortQuery` → SQL válido | `harvey.test.ts` |
| `harvey-skills.ts` | `loadSkills` → carga 9 skills; `getSkillsForAgent` → mapping correcto; `watchSkillsDir` → hot reload | `harvey-skills.test.ts` |
| `harvey-pipeline.ts` | `tick()` → respeta quiet hours, budget, prioridad; `profilePending` → observations creadas; hot reload skills | `harvey-pipeline.test.ts` |
| `harvey-adapters.ts` | Modo postmonetario: funciones locales OK; Modo conectado: interface cumple adapter | `harvey-adapters.test.ts` |
| `Harvey.tsx` | Render tabs sin error; `discover` llama store action; `outbox` A/R/E/J/K funciona; navegación fluida | Storybook + e2e |

---

## 7. Vasos Comunicantes Obligatorios (Citas Internas)

| Contexto | Formato | Enlace |
|----------|---------|--------|
| Decisión EBD D1 | `[EBD-D1]` | `docs/harvey_integration.md#4` |
| Decisión Validación DV-01 | `[DV-01]` | `docs/harvey_integration.md#5` |
| KPI Harvey Pipeline | `[KPI-Harvey-Pipeline]` | `src/core/lib/harvey-pipeline.test.ts` |
| Código: makeHarveyState | `[src/core/state/harvey.ts]` | `src/core/state/harvey.ts` |
| Código: Pipeline Decision | `[src/core/lib/harvey-pipeline.ts:L45-L80]` | `src/core/lib/harvey-pipeline.ts` |
| Código: LAARC Loop | `[src/core/lib/harvey.ts:L200-L250]` | `src/core/lib/harvey.ts` |
| Riesgo: Codex fallback | `[R1-CodexFallback]` | `docs/harvey_integration.md#2` (extirpar) |
| Paper resultado | `[Harvey-HSCSG-Assimilation]` | Este documento |

---

## 8. Estructura de Archivos a Generar (FASE 3)

```
src/
├── core/
│   ├── state/
│   │   ├── harvey.ts                    # Tipos + makeHarveyState()
│   │   ├── hooks/
│   │   │   └── harvey.ts                # Re-export tipado desde store
│   │   └── store.ts                     # + import HarveyState, makeHarveyState, actions
│   ├── lib/
│   │   ├── harvey.ts                    # Lógica pura (discover, profile, enrich, verify, write, send, handle, cohort)
│   │   ├── harvey-skills.ts             # Skills loader (Markdown → prompt injection + hot reload)
│   │   ├── harvey-pipeline.ts           # Heartbeat loop + decision logic determinístico
│   │   ├── harvey-email.ts              # Email rendering + merge vars + pre-send gate
│   │   ├── harvey-discovery.ts          # Discovery providers (OSM, TinyFish, DataForSEO, Serper, Scavio)
│   │   └── amphibious/
│   │       └── harvey-adapters.ts       # Modo postmonetario/conectado
│   └── state/hooks/
│       └── harvey.ts                    # Selectores tipados
├── app/
│   ├── screens/
│   │   └── Harvey.tsx                   # Pantalla 8 tabs (Descubrir, Perfilar, Escribir, Enviar, Responder, Señales, Analytics, Config)
│   ├── App.tsx                          # + Route path="harvey"
│   └── layout/
│       └── Aside.tsx                    # + NavItem { key: 'harvey', icon: Mail, path: '/harvey' }
├── skills/
│   └── harvey/
│       ├── email_frameworks.md          # ← asimilado de Harvey (editable)
│       ├── signal_playbook.md
│       ├── objection_handling.md        # LAARC loop
│       ├── lead_qualification.md        # BANT + ICP + MEDDIC
│       ├── sales_methodology.md         # ABC loop
│       ├── offer_strategy.md            # Offer ladder
│       ├── prospecting_tactics.md
│       ├── account_navigation.md
│       └── linkedin_outreach.md
├── docs/
│   └── harvey_integration.md            # ESTE DOCUMENTO
└── tests/
    ├── harvey.test.ts
    ├── harvey-skills.test.ts
    ├── harvey-pipeline.test.ts
    ├── harvey-adapters.test.ts
    └── harvey-discovery.test.ts
```

---

## 9. Icono Lucide Válido para Nav

```typescript
// En Aside.tsx importar:
import { Mail, Search, Users, Send, MessageSquare, BarChart2, Settings } from 'lucide-react'

// NavItem recomendado:
{ key: 'harvey', navKey: 'nav.harvey', icon: Mail, color: 'text-sky-400', path: '/harvey' }
// Alternativas: Search (discovery), Users (prospects), Send (outbound), MessageSquare (conversations), BarChart2 (analytics), Settings (config)
```

> **NOTA**: `TowerBroadcast`, `MasksTheater`, `Input`, `Textarea`, `Select` NO existen en lucide-react 0.453. Usar `Mail`, `Search`, `Users`, HTML crudo.

---

## 10. Checklist Pre-Entrega (FASE 4)

- [ ] `docs/harvey_backup.md` creado ✓
- [ ] `docs/harvey_integration.md` creado (triple perspectiva) ✓
- [ ] `src/core/state/harvey.ts` — tipos + `makeHarveyState()` 
- [ ] `src/core/lib/harvey.ts` — lógica pura completa
- [ ] `src/core/lib/harvey-skills.ts` — skills loader + hot reload
- [ ] `src/core/lib/harvey-pipeline.ts` — heartbeat + decision logic
- [ ] `src/core/lib/harvey-email.ts` — email rendering + pre-send gate
- [ ] `src/core/lib/harvey-discovery.ts` — discovery providers
- [ ] `src/core/lib/amphibious/harvey-adapters.ts` — adapters anfibios
- [ ] `src/core/state/hooks/harvey.ts` — re-export tipado
- [ ] `src/core/state/store.ts` — import tipos + estado + actions + resetAll + partialize
- [ ] `src/app/screens/Harvey.tsx` — 8 tabs, UI components (Card, Stat, Btn, Badge, EmptyState, EvidenceLedger, ScoreSchellingChart)
- [ ] `src/app/layout/Aside.tsx` — icono `Mail` + navKey `nav.harvey`
- [ ] `src/app/App.tsx` — import `Harvey` + `<Route path="harvey" />`
- [ ] `skills/harvey/` — 9 skills Markdown (email_frameworks, signal_playbook, objection_handling, lead_qualification, sales_methodology, offer_strategy, prospecting_tactics, account_navigation, linkedin_outreach)
- [ ] `npx tsc --noEmit` → 0 errores (core libs)
- [ ] `npm run build` → OK
- [ ] Preview: `/harvey` → HTTP 200
- [ ] Tests: `harvey.test.ts`, `harvey-skills.test.ts`, `harvey-pipeline.test.ts`, `harvey-adapters.test.ts`, `harvey-discovery.test.ts` → pass
- [ ] Commit + push + tag `feat/v1.0-harvey`

---

## 11. Próximos Pasos Post-Asimilación

1. **Multi-Product Support**: `harvey.yaml` → array de products, `harvey train` selecciona cuál usar por campaña
2. **Scheduled Re-observation**: `integral.ingestIntegralSignal` cuando signal cambia (ej. `RUNNING_GOOGLE_ADS` true→false) → trigger outreach
3. **Calendar Integration**: `harvey calendar connect` → auto-booking meetings (consent-gated) → `caas` commission tracking
4. **People Enrichment**: Public registries (Companies House, etc.) → `enrich` stage expansion
5. **Voice Callbacks**: Consent-gated inbound/opt-in only (FCC 24-17 compliant) → `agentMesh` + `boundaries`
6. **CAAS Commission Splits**: `closed_won` → `caas.runCaasPayout` con split por `agencia.icps` + `poh.identities` verification
7. **Integration con `content` (ContentCreation-OS)**: `harvey train` → `content.captureIdea` + `content.scoreIdea`; campaign feedback → `content.decideIdea`
8. **Integration con `agencia` (DeseOS/Contento.pro)**: `offer_strategy.md` + `product_knowledge.md` → `agencia.setBrandDNA`, `agencia.setOfferPrice`
9. **Integration con `symbiosky`**: LAARC loop → conviction voting + reputation decay para handler quality
10. **Integration con `poh`**: Sender reputation = `PoHIdentity` activa + `aura` score → deliverability boost