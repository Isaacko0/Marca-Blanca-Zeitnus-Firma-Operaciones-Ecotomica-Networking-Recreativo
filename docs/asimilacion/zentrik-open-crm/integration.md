# Análisis Arquitectónico de Integración — Zentrik Open CRM → HSCSG

**Fecha:** 2026-11-11
**Repositorio fuente:** https://github.com/Zentrik-AI/zentrik-open-crm
**Metodología:** HSCSG Unified Assimilation Science — Fase 2 (Análisis Arquitectónico) + OpenSpec SDD

---

## 1. Visión General del Sistema Asimilado

Zentrik Open CRM implementa el **primer ARM (Agent Relationship Management) open source**. Su arquitectura se define por **cuatro invariantes** (README, architecture.md):

1. **One Write Path** — Personas y agentes cambian los mismos records a través de las mismas operaciones validadas (`src/core/ops.ts`). No side-channel agente-only, no import que salte validación.
2. **Everything Shows Its Source** — Un hecho cita la nota que lo dice, o se dibuja como corazonada (hunch). Un agente que no puede fundamentar un claim debe decirlo.
3. **Nothing Lands Unapproved** — El cambio de un agente se valida, luego se retiene como propuesta hasta que una persona decide. Modo directo es una elección, y se loggea.
4. **The Records Are Yours** — Una carpeta que posees, en formatos legibles, trabajando con el agente que uses.

---

## 2. Arquitectura en Capas (5 Capas)

```
┌─────────────────────────────────────────────────────────────┐
│  LAYER 5: AGENT INTERFACES                                  │
│  ├─ MCP Server (stdio, JSON-RPC 2.0, no SDK)               │
│  ├─ CLI `crm` (Node, same operations as MCP)               │
│  └─ Loopback HTTP API (127.0.0.1, SSE, Host/Origin check)  │
├─────────────────────────────────────────────────────────────┤
│  LAYER 4: WORKSPACE RUNTIME (cli/store.ts)                 │
│  ├─ Atomic writes (pid+uuid tmp → fsync → rename)          │
│  ├─ Local-process lock (mkdir candidate → rename, no steal)│
│  ├─ Revision tracking (sha1 content hash)                   │
│  ├─ Backups on import/reset (.open-crm/backups/<rev>.json) │
│  └─ Generated views (INDEX.md, accounts/*.md) sync on write│
├─────────────────────────────────────────────────────────────┤
│  LAYER 3: CORE OPERATIONS (src/core/ops.ts)                │
│  ├─ applyChange(workspace, change) → Applied (pure, deterministic)│
│  ├─ submitChange(workspace, change) → {applied|proposed}   │
│  ├─ resolveProposal(workspace, id, approve|reject)         │
│  ├─ proposalConflict detection (baseline vs current)       │
│  └─ Receipts (stable-key retries, not a queue)             │
├─────────────────────────────────────────────────────────────┤
│  LAYER 2: DOMAIN LOGIC (src/core/*.ts)                     │
│  ├─ types.ts — Vocabulario completo (Account, Claim, Op, ...)│
│  ├─ model.ts — Stages, sources, priorities, labels, utils  │
│  ├─ validate.ts — Structural + referential checks          │
│  ├─ claims.ts — Claims = source of truth; needs/risks derived│
│  ├─ memory.ts — AccountMemory: grounding, committee, gaps, │
│  │   since, commitments, questions, lint, table (AccountRow)│
│  ├─ brief.ts — Daily brief: ranked attention items         │
│  ├─ patterns.ts — Lexical cross-account recurrence → signals│
│  ├─ markdown.ts — Generated views with recordIds in backticks│
│  ├─ investigation.ts — Jev: line-by-line classification    │
│  ├─ calls.ts — Granola/TypeSafe providers, batch import    │
│  └─ demo.ts — Synthetic workspace with injected clock      │
├─────────────────────────────────────────────────────────────┤
│  LAYER 1: UI (src/)                                         │
│  ├─ React 18 + Vite + Tailwind + TypeScript                │
│  ├─ Clear v2 design system (semantic CSS tokens)           │
│  ├─ Components: AccountCard, Book, Brief, ClaimList,       │
│  │   PatternList, ProposalReview, Trace, Table, TaskList   │
│  ├─ Views: Home, Accounts, Book, Calls, Pipeline, Review,  │
│  │   Settings, Trace                                       │
│  └─ Two modes: Browser (localStorage) / Folder (API+SSE)   │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Modelo de Datos — Análisis Formal

### 3.1 Entidades Principales (src/types.ts)

```typescript
// Identidad y ciclo de vida
Account:   { id, name, domain, segment, stage∈{researching,active,expanding,renewing,at_risk},
             priority∈{low,medium,high,urgent}, arr: number, health: number|null,
             fit: number|null, sourceConfidence: number|null, owner, tags[],
             contacts: Contact[], needs: string[], risks: string[], lastTouch: string|null,
             archivedAt?, archiveReason?, createdAt }

Deal:      { id, accountId, name, stage∈{lead,qualified,proposal,negotiation,won,lost},
             value: number, owner, closeDate, probability, createdAt }

Task:      { id, title, accountId?, dealId?, contactId?, due, owner,
             priority, status∈{open,waiting,done,cancelled}, reason?, evidence: noteId[],
             origin?: Actor }  // origin = {kind: "agent", name: "claude-code"}

Note:      { id, accountId, contactId?, dealId?, source∈{call,email,meeting,note,support,
             community,review,github,usage,market}, title, body, sentiment,
             createdAt, sourceRef?, occurredAt?, interaction?: boolean, origin? }

Claim:     { id, accountId, kind∈{need,risk,goal,objection,commitment,fact}, text,
             evidence: noteId[], contactId?, status∈{active,resolved,superseded},
             createdAt, resolvedAt?, resolvedReason?, supersededBy?,
             owner?: "us"|"them", due?: string, origin? }  // commitments have owner+due
```

### 3.2 Invariantes Estructurales (validate.ts)

1. **IDs únicos globalmente** — prefijos: `acct_`, `contact_`, `deal_`, `task_`, `note_`, `prop_`, `act_`, `claim_`
2. **Referencialidad** — `note.accountId` → `Account.id`; `claim.evidence[]` → `Note.id`; `task.evidence[]` → `Note.id`
3. **Valores permitidos** — enums centralizados en `model.ts` (stages, sources, priorities, influences, sentiments)
4. **Scores nulos ≠ cero** — `health`, `fit`, `sourceConfidence` = `null` (unknown), no 0
5. **Contact freshness** — solo `interaction: true` con source ∈ {call,email,meeting,support} + `occurredAt` avanza `lastSeen`/`lastTouch`
6. **Legacy migration** — `migrateLegacyClaims()` convierte `Account.needs[]`/`risks[]` → `Claim` sin evidencia (hunches)

### 3.3 Operaciones (Ops) — El Write Path Unificado

```typescript
type Op =
  | {type: "account.add", name, domain?, segment?, owner?, stage?, priority?, contact?}
  | {type: "account.update", accountId, patch: Partial<AccountFields>}
  | {type: "account.archive", accountId, archived: boolean, reason}
  | {type: "contact.add", accountId, name, role, influence?, email?}
  | {type: "deal.add", accountId, name, stage?, value?, owner?, closeDate?}
  | {type: "deal.move", dealId, stage}
  | {type: "task.add", title, accountId?, due?, owner?, priority?, reason?, evidence?}
  | {type: "task.set_status", taskId, status}
  | {type: "task.update", taskId, patch: Partial<TaskFields>}
  | {type: "note.add", accountId, title, body, source, sourceRef?, sentiment?, contactId?, occurredAt?, interaction?}
  | {type: "claim.add", accountId, kind, text, evidence?, contactId?, owner?, due?}
  | {type: "claim.resolve", claimId, reason, replacement?: {text, evidence?, kind?, owner?, due?}}
```

**Change = Op + metadata determinista:**
```typescript
Change = { key?, review?, recordId, childId?, at: ISOstring, actor: Actor, op: Op }
```

---

## 4. Motor de Memoria y Razonamiento (src/core/memory.ts)

### 4.1 GroundedClaim — Unidad Atómica de Conocimiento

```typescript
GroundedClaim = {
  claim: Claim,
  notes: Note[],           // evidence resuelta
  contact?: Contact,       // si claim.contactId
  latest: string|null,     // fecha evidencia más nueva
  ageDays: number|null,    // days since latest
  grounded: boolean,       // evidence.length > 0
  stale: boolean,          // ageDays > STALE_EVIDENCE_DAYS (45)
  overdue: boolean         // commitment + due passed
}
```

### 4.2 AccountMemory — Vista Computada Completa

```typescript
AccountMemory = {
  account: Account,
  claims: GroundedClaim[],           // active, newest evidence first, hunches last
  byKind: Record<ClaimKind, GroundedClaim[]>,
  history: GroundedClaim[],          // resolved/superseded, newest first
  committee: CommitteeLane[],        // 4 lanes: economic, champion, technical, user
  gaps: CommitteeLane[],             // lanes with 0 members
  since: { from: lastTouch|null, notes, claims, tasksDone },  // post-last-verified
  commitments: { ours, theirs },     // active commitments by owner
  questions: Question[],             // ranked 1-6: overdue→hunches→gaps→stale→no-touch
  openTasks: Task[],
  openDeals: Deal[],
  counts: { grounded, hunches, stale }
}
```

### 4.3 Comité de Decisión (Buying Committee Map)

```typescript
committeeLanes = [
  {influence: "economic", label: "Signs off", ask: "Who approves the budget and signs?"},
  {influence: "champion", label: "Pushes for it", ask: "Who inside wants this to happen?"},
  {influence: "technical", label: "Evaluates", ask: "Who checks that it will work for them?"},
  {influence: "user", label: "Lives with it", ask: "Who will use it day to day?"}
]
```
- Cada contacto mapea a un lane por `influence`
- `daysSince` = días desde `lastSeen` (null = never seen)
- `mentions` = notas citando al contacto
- `claims` = claims fundamentados por ese contacto
- **Gaps** = lanes vacíos → generan questions rank 3-4

### 4.4 Lint — Auditoría de Calidad de Memoria

```typescript
LintFinding = {
  code: "hunch" | "stale_evidence" | "overdue_commitment" | "no_signer" | "unseen_contact" | "note_without_ref" | "agent_task_without_evidence",
  severity: "warn" | "info",
  message: string,
  accountId, accountName, recordId
}
```
- Ejecuta en `crm lint`, `crm check`, CI
- `warn`: hunches, overdue commitments, no signer (economic gap en stage decisorio), agent tasks sin evidencia
- `info`: stale evidence (>45d), unseen contacts, notes sin sourceRef

### 4.5 Tabla de Cuentas — Comparación Ordenada

```typescript
AccountRow = {
  account: Account,
  value: number,           // arr + open pipeline value
  openPipeline: number,
  lastTouch: string|null,  // null = unknown (sorts bottom)
  claims: number,
  grounded: number,
  groundedRatio: number|null,  // null if no claims (sorts bottom)
  openTasks: number,
  nextDue: string|null,    // null = unknown (sorts bottom)
  overdue: number
}

sortAccountRows(rows, key, direction):
  // UNKNOWN NUNCA SUBE: reversing sort no promueve record sin confirmar
  unknown = (key==="lastTouch" && lastTouch===null) ||
            (key==="grounded" && groundedRatio===null) ||
            (key==="nextDue" && nextDue===null)
  if unknown(a) !== unknown(b): return unknown(a) ? 1 : -1
```

---

## 5. Detección de Patrones y Frontera Cuenta→Producto (patterns.ts)

### 5.1 Agrupación Léxica (Determinista, Sin ML)

```typescript
keyTerms(text): Set<string>  // lowercase, no punctuation, no stopwords, plural→singular (trim 's' no 'ss')

related(a, b): boolean
  // shared ≥ 3 terms OR (shared ≥ 2 AND jaccard ≥ 0.4)

findPatterns(workspace, minAccounts=2): Pattern[]
  // Union-find over active claims (need,objection,goal,risk,fact) cross-account
  // Groups by related(keyTerms)
  // Filter: ≥ minAccounts distinct accounts
```

### 5.2 Pattern — Evidencia Agregada

```typescript
Pattern = {
  id: stableId("pattern", ...sortedClaimIds),
  label: shortestClaimText,
  kinds: [{kind, count}] sorted desc,
  accounts: [{id, name}],
  claims: Claim[],
  notes: Note[] (all evidence, newest first),
  terms: string[] (intersection of all claim terms),
  latest: string|null,
  hunches: number (claims with 0 evidence)
}
```

### 5.3 Signals Bundle — Handoff a Product Tool (Zentrik)

```typescript
SignalSource = {
  sourceKey: "open-crm.<workspace-slug>",  // stable for retries
  externalId: note.id,                      // note id in workspace namespace
  signalType: signalTypeOf[note.source],    // meeting_notes, feedback_record, support_ticket, reconstructed_notes, review, discovery_report
  name: note.title,
  text: note.body,
  occurredAt?: note.occurredAt,
  providerType: "open-crm",
  sourceLinks: [{url, name}] | [],          // only real URLs
  additionalContext: "Account: X (domain) Source reference: Y Recorded in Open CRM as a call note.",
  account: {externalId, name, domain?},     // shareSafe drops domain
  participants: [{name, role, email?, affiliation: "external"}] | [],
  supports: [{kind: ClaimKind, text: string}]  // claims this note grounds
}

SignalsBundle = {
  schema: "open-crm-signals.v1",
  product: "Open CRM",
  generatedAt: ISOstring,
  workspace: string,
  shareSafe: boolean,
  pattern?: {id, label, accounts: string[]},
  sources: SignalSource[]
}
```

**Principio clave:** El bundle lleva **fuentes, no conclusiones**. La herramienta de producto (Zentrik) extrae sus propias conclusiones. `crm export --signals` escribe `exports/signals-<date>/bundle.json` + 1 Markdown por source.

---

## 6. Flujo Agente-Humano (ops.ts + mcp.ts + actions.ts)

### 6.1 Submit Change (Agent → Review/Direct)

```typescript
submitChange(workspace, change):
  if human OR (agentMode === "direct" AND !change.review):
    applied = applyChange(workspace, change)
    logActivity(applied.workspace, {actor: change.actor, summary: applied.summary, ...})
    return {outcome: "applied", workspace: receipt(applied.workspace, ...), ...}
  else:
    // REVIEW MODE (default)
    applied = applyChange(projectPending(workspace), change)  // simulate on pending
    proposal = {id, createdAt, actor, change, summary, status: "pending", base: proposalBase(...)}
    return {outcome: "proposed", workspace: receipt(workspace with proposal, ...), proposalId, ...}
```

### 6.2 Resolve Proposal (Human Approval)

```typescript
resolveProposal(workspace, proposalId, approve|reject, resolvedBy):
  proposal = find(proposalId)
  if approve:
    issue = proposalApprovalIssue(workspace, proposal)  // baseline conflict?
    if issue: throw OpError(issue.code, issue.message)
    try:
      applied = applyChange(workspace, proposal.change)
    catch:
      // check if depends on another pending proposal
      if applyChange(projectPending(others), proposal.change) works:
        throw OpError("depends_on_pending", "Approve that one first")
      throw
    resolved = {status: "applied", resolvedAt, resolvedBy, targetId: applied.targetId}
  else:
    resolved = {status: "rejected", resolvedAt, resolvedBy}
    if proposal.change.key: mark receipt rejected
  logActivity with "approved"/"rejected by <person>"
  trimProposals (keep 100 resolved)
  return {workspace, proposal: resolved}
```

### 6.3 Conflict Detection (Baseline)

```typescript
proposalBase(workspace, op): Record<string,unknown>|undefined
  // For updates: current values of fields being changed
  // e.g., account.update → {stage, priority, arr, health, fit, tags, needs, risks} current values

proposalConflict(workspace, proposal):
  current = proposalBase(workspace, proposal.change.op)
  if current && !proposal.base: return "older proposal has no baseline"
  if current && canonical(current) !== canonical(proposal.base): return "fields changed since prepared"
  // canonical = JSON.stringify with sorted object keys
```

### 6.4 Receipts (Idempotency Keys)

```typescript
// change.key = stable source/action key (e.g., "daily-review-2026-11-11")
// Repeating same key + operation = returns existing result
// Different operation or rejected result = conflict
// Receipts retained after proposal leaves visible history
// NOT a queue to clear between runs — local history for retries
```

---

## 7. Two Homes: Browser vs Folder (architecture.md)

| Aspecto | Browser Mode (`npm run dev`) | Folder Mode (`crm ui`) |
|---------|------------------------------|------------------------|
| **Storage** | `localStorage` key `zentrik-open-crm.workspace.v2` | `~/crm/workspace.json` (file) |
| **Agents** | One-way Markdown snapshot (Settings → Agent workspace) | Full loop: CLI + MCP + API + SSE |
| **Writes** | Single-writer (browser tab) | Coordinated: app + CLI + MCP + agents |
| **Imports** | Wholesale replace, guarded by revision | Same, with backup + lock |
| **Backup** | Failed saves preserve invalid originals | `.open-crm/backups/<rev>.json` before replace |
| **Recovery** | Export unsaved work before leaving | `crm restore <rev>` from explicit backup |

---

## 8. Fuentes Duraderas (sources.ts)

```typescript
crm source add <file>:
  1. sha256(content) → filename
  2. Copy to sources/<hash>.<ext>
  3. Record in sources/index.json (open-crm-sources.v1):
     {id, kind∈{transcript,email,calendar,ticket,export,document},
      path, sha256, size, originalName, externalId?, date?, capturedBy}
  4. Dedupe: same content hash OR same externalId → returns existing
  5. Note cites: sourceRef: "source:<id>"
  6. crm why on note → reaches file
```

---

## 9. Puntos de Integración HSCSG

### 9.1 Paquetes NPM Propuestos

| Paquete | Contenido | Dependencias | Entry Points |
|---------|-----------|--------------|--------------|
| `@hscsg/arm-core` | `src/core/*` + `src/types.ts` + `src/core/model.ts` | **Zero** (pure TS) | `types`, `ops`, `validate`, `claims`, `memory`, `brief`, `patterns`, `markdown`, `investigation`, `calls`, `demo`, `model` |
| `@hscsg/arm-cli` | `cli/store.ts`, `cli/actions.ts`, `cli/main.ts`, `cli/templates.ts`, `cli/agent-kit.ts` | `@hscsg/arm-core`, `node:fs`, `node:path`, `node:crypto` | `crm` command, `actions.*`, `readWorkspace`, `updateWorkspace`, `replaceWorkspace` |
| `@hscsg/arm-mcp` | `cli/mcp.ts` (parametrized brand, tools) | `@hscsg/arm-core`, `@hscsg/arm-cli` (actions), `node:readline` | `serveMcp(dir)`, `tools[]` |
| `@hscsg/arm-api` | `cli/api.ts`, `cli/server.ts` | `@hscsg/arm-core`, `@hscsg/arm-cli` (store) | `createApi(dir)`, `createServer(dir, port)` |
| `@hscsg/arm-ui` | `src/` (React components, views, tokens, brand) | `@hscsg/arm-core`, `react`, `react-dom`, `lucide-react`, `tailwind-merge`, `clsx` | `App`, `components/*`, `views/*`, `tokens.css`, `brand.ts` |

### 9.2 Integración con Kernel HSCSG

```typescript
// hscsg-sistema-alraico (kernel orquestación)
interface ARMModule {
  core: typeof import("@hscsg/arm-core");
  cli: typeof import("@hscsg/arm-cli");
  mcp: typeof import("@hscsg/arm-mcp");
  api: typeof import("@hscsg/arm-api");
  ui: typeof import("@hscsg/arm-ui");
}

// hscsg-coeficiente-autonomia (AUT/CDS)
Account.valor → replaces Account.arr (ZNU units)
Deal.valor → replaces Deal.value (ZNU units)
priceParity oracle → USD/USDC conversion when Nivel 3 ReFi active

// hscsg-monetary-integration (ZNU/priceParity)
lib/valueDual.ts → dual-mode calculations
nodeMode/priceParity in store → runtime mode switch
/agencia screen → renders labels per mode
```

### 9.3 OpenSpec SDD — Specs Vivas

Cada paquete tendrá su `.openspec/` con:
- `arm-core.openspec.yml` — types, ops, validate, memory, patterns contracts
- `arm-cli.openspec.yml` — workspace format, store, actions, templates contracts
- `arm-mcp.openspec.yml` — MCP tools, JSON-RPC, tool schemas contracts
- `arm-api.openspec.yml` — HTTP API, SSE, lock protocol contracts
- `arm-ui.openspec.yml` — component props, view contracts, token semantics

---

## 10. Tests y Validación (Estrategia HSCSG)

| Nivel | Herramienta | Qué Valida |
|-------|-------------|------------|
| **Unit** | `node --test tests/unit/*.test.ts` | Core ops, validate, memory, patterns, claims, brief — pure functions |
| **Integration** | `npm run test:package` | Pack → install without deps → CLI/MCP/UI work on temp workspace |
| **E2E** | Playwright (`tests/e2e/`) | Browser edition + agent-to-Review loop on folder workspace |
| **Smoke** | `scripts/package-smoke.mjs` | Installed package runs `crm init`, `crm ui`, MCP server starts |
| **Contract** | OpenSpec validation | Specs match implementation; breaking changes detected |

**Tests clave a portar/mantener:**
- `ops.test.ts` — applyChange, submitChange, resolveProposal, conflict detection, receipts
- `validate.test.ts` — validateWorkspace, normalizeWorkspace, parseWorkspace
- `memory.test.ts` — groundClaim, accountMemory, committee, lint, table sorting (unknowns bottom)
- `patterns.test.ts` — keyTerms, related, findPatterns, signalsBundle, shareSafe
- `claims.test.ts` — migrateLegacyClaims, deriveAccountLists, activeClaims
- `store.test.ts` — readWorkspace, updateWorkspace, replaceWorkspace, lock, backups, restore
- `mcp.test.ts` — initialize, tools/list, tools/call (all tools), error handling
- `investigation.test.ts` — Jev line-by-line, confidence, "Check closely" flag

---

## 11. Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación HSCSG |
|--------|-------------|---------|------------------|
| **Brand leakage** — referencias a "Zentrik"/"Open CRM" en código core | Alta | Legal/brand | Parametrizar `brand.ts` equivalente; search/replace en Fase 3 |
| **Lock en network drives/synced clones** | Media | Data loss | Documentar: lock = local-process only; no distributed; stop writers before manual repair |
| **Editor writes bypassing lock** | Media | Corruption | `replaceWorkspace` rechecks rev before commit; backups immutable; `crm check --fix` regenerates views |
| **Agent hallucination en investigation.ts** | Baja | Bad data | Jev confidence 0.6-0.8 → "Check closely" flag; never auto-apply; human review required |
| **Signals bundle schema drift** | Media | Integration break | OpenSpec contract on `open-crm-signals.v1`; versioned schema; tests against Zentrik Signals API |
| **Node version mismatch** | Baja | Runtime errors | `engines: node>=22.18`; `bin/open-crm.js` checks version first; CI en Node 22.18+ |
| **CSS token drift en UI** | Media | Inconsistent UX | Semantic tokens only; violet=agent reserved; design-system.md as contract; `tokens.css` single source |

---

## 12. Métricas de Complejidad (para estimación Fase 3)

| Métrica | Valor | Nota |
|---------|-------|------|
| **Archivos TypeScript core** | 10 | types, model, ops, validate, claims, memory, brief, patterns, markdown, investigation, calls, demo |
| **Archivos CLI** | 11 | store, actions, main, mcp, api, server, sources, calls, call-providers, call-samples, investigation, templates, agent-kit |
| **Componentes React** | ~25 | En `src/components/` + `src/views/` |
| **Líneas core logic** | ~2,500 | Sin UI, sin tests |
| **Líneas CLI** | ~2,000 | Incluyendo providers |
| **Líneas UI** | ~3,000 | Components + views + styles |
| **Operaciones (Op types)** | 13 | account.add/update/archive, contact.add, deal.add/move, task.add/set_status/update, note.add, claim.add/resolve |
| **MCP Tools** | 20 | status, list_accounts, show_account, search, list_tasks, patterns, signals_bundle, list_sources, list_proposals, add_note, add_task, add_claim, add_account, update_account, add_contact, investigation, list_calls, show_call, add_deal, move_deal, decide, set_mode |
| **Claim Kinds** | 6 | need, risk, goal, objection, commitment, fact |
| **Note Sources** | 10 | call, email, meeting, note, support, community, review, github, usage, market |

---

## 13. Conclusión Arquitectónica

Zentrik Open CRM es **excepcionalmente limpio** para asimilación HSCSG:

1. **Separación estricta de capas** — Core pure TS (zero deps) consumido por CLI, MCP, API, UI
2. **Single write path real** — `ops.ts` es el único lugar donde muta el workspace
3. **Determinismo** — `applyChange` puro → proposals se aprueban mañana idénticas a hoy
4. **Evidencia-first** — Claims requieren `evidence[]`; hunches son first-class citizens
5. **Frontera cuenta→producto explícita** — Patterns → Signals bundle (fuentes, no conclusiones)
6. **Agent-native** — MCP server sin SDK, JSON-RPC 2.0, tools mapean 1:1 a ops
7. **Local-first real** — Folder workspace, atomic writes, lock, backups, no DB, no cloud required
8. **Extensible** — Vocabulario en `model.ts`, ops en `ops.ts`, nuevo claim kind = 1 línea en enum

**Recomendación:** Asimilar **completo** como 5 paquetes npm `@hscsg/arm-*` con OpenSpec SDD, aplicando principio anfibio para unidad monetaria, integrando con kernel HSCSG (Alraico, AUT/CDS, ZNU, priceParity). Tiempo estimado Fase 3: 2-3 semanas para paquetes core + CLI + MCP; 1-2 semanas para UI + API; 1 semana para tests + validación OpenSpec + docs español.

---

**Firmado:** Isaac Ko (Isaacko0) — HSCSG v15 OS
**Fecha:** 2026-11-11
**Metodología:** HSCSG Unified Assimilation Science + OpenSpec SDD