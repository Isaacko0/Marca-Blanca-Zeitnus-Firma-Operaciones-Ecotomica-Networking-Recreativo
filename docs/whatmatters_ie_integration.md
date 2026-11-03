# WhatMatters / Protocolo IE — Integration Document (FASE 2)

**Basado en**: `docs/whatmatters_ie_backup.md`  
**Objetivo**: Asimilar Protocolo IE + RCE + Red Triádica en HSCSG v15 OS como módulo anfibio offline-first  
**Metodología**: HSCSG v15 OS — 4 Fases (Backup → Docs → Implementación → Validación)

---

## 1. Análisis de Encaje en HSCSG (Vasos Comunicantes)

### 1.1 Mapeo a Módulos Existentes

| Concepto WhatMatters | → Módulo HSCSG | Vaso Comunicante | Estado |
|---------------------|----------------|------------------|--------|
| **Protocolo IE (3→2)** | `virginia.network` | `virginia.ieProtocol` | Nuevo |
| **Árbol triádico** | `virginia.tree` | `virginia.coordinationTree` | Nuevo |
| **RCE Math (coeficientes)** | `rbe.rceMath` | `rbe.distributeRCE` | Nuevo |
| **Comisión regresiva** | `caas.protocolFee` | `caas.regressiveFee` | Nuevo |
| **Atestaciones soulbound** | `poh.verification` | `poh.attestContribution` | Extiende Poh |
| **Staking peso efectivo** | `caas.staking` | `caas.stakeBonusWeight` | Extiende CaaS |
| **Peer scoring (GIVE)** | `caas.peerScoring` | `caas.giveAllocation` | Nuevo |
| **Facilitador IA** | `contenido.captureIdea` + `story.engine` | `createStoryProject` + `synthesizeConsensus` | Extiende Contenido/Story |
| **Certificados impacto** | `integral.hypercerts` | `integral.impactCertMint` | Nuevo |
| **Calculadora RCE** | `rbe.calculator` | `rbe.rceTable` | Nuevo |
| **Red triádica UI** | `virginia.treeView` | `virginia.treeView` | Nuevo |

### 1.2 Principio Anfibio Aplicado

| Modo | Financiamiento | Distribución | Verificación | Gobernanza |
|------|----------------|--------------|--------------|------------|
| **Postmonetario** | CaaS streams (suscripción ZNU, revenue share AUT) | RCE en ZNU, CaaS payouts | IA local + auditoría humana local | CDS 1a1v + expertise, mandatos revocables |
| **Conectado** | USDC/USDT + green bonds + land value capture | USD/USDC via `priceParity` oráculo ReFi N3 | IA cloud + auditoría remota + blockchain tx | CDS + verificación on-chain (Poh/RAO) |

**Puente**: `priceParity` oráculo ReFi Nivel 3 (ZNU ↔ USD/USDC)  
**Migración**: `nodeMode` en store + sync backend opcional

---

## 2. Especificación FASE 3 — Estructura de Archivos

### 2.1 Tipos y Constantes (Core)

```
src/core/lib/ie-constants.ts          # Coeficientes canónicos, pesos, límites
src/core/lib/ie-rce-math.ts           # Port TS puro de RCEMath.sol (calculadora)
src/core/lib/ie-protocol-fee.ts       # Port TS de ProtocolFee.sol
src/core/lib/ie-types.ts              # Types: IEChallenge, IEPosition, IEMilestone, etc.
src/core/lib/ie-attestation.ts        # Registro atestaciones offline-first (EAS-compatible)
src/core/lib/ie-protocol.ts           # Lógica pura: árbol, consenso, distribución, staking, GIVE
src/core/lib/ie-dv-tests.ts           # Tests DV (calibración vs prototipo $288,008)
```

### 2.2 Estado y Hooks (Zustand)

```
src/core/state/ie-protocol.ts         # INITIAL_STATE, achievements, storage keys
src/core/state/hooks/ie-protocol.ts   # Store completo con actions + selectors
```

### 2.3 Pantallas (React/TSX)

```
src/app/screens/IEChallengeDashboard.tsx    # Dashboard desafíos (lista, crear, KPIs)
src/app/screens/IEChallengeWorkspace.tsx    # Vista árbol + hitos + mi estado (adaptado ChallengeClient)
src/app/screens/IETreeView.tsx              # Visualizador árbol triádico SVG (adaptado TreeView)
src/app/screens/IERCECalculator.tsx         # Calculadora RCE inversa (adaptado RceCalculator)
src/app/screens/IEAIAgentPanel.tsx          # Facilitador IA consenso (adaptado AgentPanel)
src/app/screens/IEMilestoneTimeline.tsx     # Línea tiempo hitos (adaptado MilestoneTimeline)
src/app/screens/IECertificates.tsx          # Certificados impacto + reputación
src/app/screens/IESimulation.tsx            # Simulador crecimiento IE (3^n) + proyección RCE
```

### 2.4 Integración Repo

```
src/core/state/store.ts               # + slice ieProtocol, actions, partialize, initialState
src/app/layout/Aside.tsx              # + nav items: ieProtocol, ieCalculator, ieCertificates
src/core/lib/i18n.ts                  # + claves ES/EN/PT (nav, titles, labels, tooltips)
openspec/specs/ie-protocol/openapi.yaml  # API especificación para agentes
```

---

## 3. Diseño de Datos (TypeScript)

### 3.1 Tipos Core (ie-types.ts)

```typescript
// Niveles IE: 1-21 (MAX_LEVEL)
export type IELevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21;

// Clases de peso RCE
export type WeightClass = 'full' | 'low' | 'mid';
export const WEIGHT_NUM: Record<WeightClass, bigint> = { full: 3n, low: 2n, mid: 1n };

// Desafío IE
export interface IEChallenge {
  id: string;
  funder: string;                    // DID Poh
  token: string;                     // 'ZNU' | 'USDC' | token address
  metaURI: string;                   // IPFS/URL descripción
  funded: bigint;                    // neto en escrow (base units)
  released: bigint;                  // ya liberado
  level: IELevel;                    // profundidad actual red
  seedCount: number;                 // 0-3
  milestones: IEMilestone[];
  status: 'forming' | 'active' | 'completed' | 'closed';
  createdAt: number;
  updatedAt: number;
}

// Hito con consenso
export interface IEMilestone {
  id: string;
  title: string;
  amount: bigint;                    // tramo a liberar (neto)
  approvalsRequired: number;         // umbral consenso
  approvals: number;                 // consenso actual
  released: boolean;
  releasedAt?: number;
  a3AtRelease?: bigint;              // A3 snapshot para distribución lazy futura
}

// Posición en árbol triádico
export interface IEPosition {
  id: string;                        // positionId (uint256 como string)
  challengeId: string;
  holder: string;                    // DID Poh
  parentId: string;                  // '0' para seeds
  depth: IELevel;                    // 1 = seeds
  childCount: number;                // 0-3
  isCoordinator: boolean;            // marcada por financiador
  stake: bigint;                     // tokens staked (base units)
  giveReceived: bigint;              // GIVE points recibidos
  weightClass: WeightClass;          // derivada: full/low/mid
  effectiveWeight: bigint;           // class + stakeBonus + giveBonus
  createdAt: number;
  updatedAt: number;
}

// Atestación soulbound (offline-first)
export interface IEAttestation {
  uid: string;                       // keccak256 hash
  schema: 'contribution' | 'consensus' | 'role' | 'impact';
  attester: string;                  // DID
  recipient: string;                 // DID
  time: number;
  revoked: boolean;
  data: string;                      // JSON stringified payload
}

// Certificado impacto (Hypercert-style)
export interface IMImpactCert {
  id: string;
  challengeId: string;
  milestoneId: string;
  uri: string;                       // qué se logró
  impact: bigint;                    // fondos liberados (proxy magnitud)
  contributors: number;              // posiciones en red al mintear
  time: number;
}

// Configuración financiación anfibia
export interface IEFundingConfig {
  mode: 'postmonetario' | 'conectado';
  token: 'ZNU' | 'USDC' | string;
  priceParity?: number;              // ZNU/USD oráculo (modo conectado)
  protocolFeeBps: number;            // calculado por ProtocolFee.regressive()
  caasStreams?: string[];            // ['suscripcion', 'revenue_share', ...]
}

// Estado global IE Protocol
export interface IEProtocolState {
  challenges: Record<string, IEChallenge>;
  positions: Record<string, IEPosition>;      // indexado por positionId
  challengePositions: Record<string, string[]>; // challengeId -> positionIds[]
  attestations: Record<string, IEAttestation>; // indexado por uid
  receivedAttestations: Record<string, string[]>; // recipient DID -> uids[]
  impactCerts: IMImpactCert[];
  certsOfChallenge: Record<string, string[]>; // challengeId -> certIds[]
  giveAllocations: Record<string, Record<string, bigint>>; // challengeId -> allocator -> amount
  giveReceived: Record<string, bigint>;       // positionId -> total GIVE received
  globalMetrics: IEGlobalMetrics;
  ui: IEUIState;
}

export interface IEGlobalMetrics {
  totalActiveChallenges: number;
  totalParticipants: number;
  totalFunded: bigint;
  totalReleased: bigint;
  totalRCEDistributed: bigint;
  avgNetworkDepth: number;
  coordinatorRatio: number;
  consensusRate: number;
  attestationCount: number;
  impactCertCount: number;
}

export interface IEUIState {
  selectedChallengeId?: string;
  selectedPositionId?: string;
  screen: 'dashboard' | 'workspace' | 'calculator' | 'certificates' | 'simulation';
  toasts: IEToast[];
}
```

### 3.2 Constantes Canónicas (ie-constants.ts)

```typescript
// Coeficientes RCE verbatim del prototipo WhatMatters (niveles 1-21)
export const IE_COEFFICIENTS: readonly bigint[] = [
  3n, 11n, 33n, 99n, 288n, 864n, 2565n, 7695n, 23088n, 69267n,
  207048n, 621120n, 1863363n, 5583450n, 16750272n, 50250819n,
  150693168n, 452079264n, 1356237795n, 4068181218n, 12204542928n
];

export const IE_MAX_LEVEL = 21;
export const IE_W_FULL = 3n;  // Alta/Tronco/Semilla
export const IE_W_LOW = 2n;   // Baja
export const IE_W_MID = 1n;   // Media

// Staking
export const IE_STAKE_UNIT = 1_000_000_000n;  // 1,000 mUSDC (6 decimales)
export const IE_MAX_STAKE_BONUS = 6n;

// Peer Scoring (GIVE)
export const IE_GIVE_BUDGET = 100n;
export const IE_GIVE_UNIT = 20n;
export const IE_MAX_GIVE_BONUS = 5n;

// Comisión regresiva (bps) - umbrales en base units (6 decimales)
export const IE_FEE_TIERS = [
  { max: 10_000_000_000n, bps: 1000 },    // ≤ 10k   -> 10%
  { max: 100_000_000_000n, bps: 700 },    // ≤ 100k  -> 7%
  { max: 1_000_000_000_000n, bps: 400 },  // ≤ 1M    -> 4%
  { max: 10_000_000_000_000n, bps: 200 }, // ≤ 10M   -> 2%
  { max: 0n, bps: 100 }                    // > 10M   -> 1% (max es 0 = sin límite)
] as const;

// Esquemas atestación (EAS-compatible)
export const IE_SCHEMAS = {
  contribution: 'WhatMatters:Contribution',
  consensus: 'WhatMatters:MilestoneConsensus',
  role: 'WhatMatters:Role',
  impact: 'WhatMatters:ImpactCertification',
} as const;
```

---

## 4. Funciones Puras (Lógica de Negocio)

### 4.1 ie-rce-math.ts (Port exacto RCEMath.sol)

```typescript
/** Personas físicas en base de árbol completo nivel n = 3^n */
export function iePhysicalPersons(level: number): bigint { ... }

/** Posiciones totales red hasta nivel n = (3^(n+1) - 3) / 2 */
export function iePositionsTotal(level: number): bigint { ... }

/** Coeficiente canónico por nivel (1-21) */
export function ieCoefficient(level: number): bigint { ... }

/** Valor 1 RCE (Alta/Tronco/Semilla) para fondo en nivel */
export function ieOneRce(fund: bigint, level: number): bigint { ... }

/** Payout para posición dado peso (3/2/1) */
export function iePayout(fund: bigint, level: number, weightNum: bigint): bigint { ... }

/** Tabla completa RCE para fondo dado (reproduce prototipo Excel) */
export function ieRCETable(fund: bigint, maxLevel?: number): IERCERow[] { ... }

// Formatting (asume 6 decimales tipo USDC)
export function ieFormatUSDC(baseUnits: bigint, maxFrac?: number): string { ... }
export function ieFormatBigInt(v: bigint): string { ... }
```

### 4.2 ie-protocol-fee.ts (Port exacto ProtocolFee.sol)

```typescript
export function ieFeeBps(amount: bigint): bigint { ... }
export function ieSplit(amount: bigint): { fee: bigint; net: bigint } { ... }
```

### 4.3 ie-protocol.ts (Lógica Core Protocolo)

```typescript
// Árbol triádico
export function ieCreatePosition(
  challenge: IEChallenge,
  holder: string,
  parentId: string,
  depth: number
): IEPosition { ... }

export function ieCanJoin(challenge: IEChallenge, parentPosition: IEPosition): boolean { ... }
export function ieGetChildren(positions: IEPosition[], parentId: string): IEPosition[] { ... }
export function ieGetRoots(positions: IEPosition[]): IEPosition[] { ... }

// Pesos
export function ieWeightClass(position: IEPosition): WeightClass { ... }
export function ieStakeBonus(stake: bigint): bigint { ... }
export function ieGiveBonus(giveReceived: bigint): bigint { ... }
export function ieEffectiveWeight(position: IEPosition): bigint { ... }

// Consenso y distribución
export function ieCanApprove(challenge: IEChallenge, milestoneId: string, voter: string): boolean { ... }
export function ieCalculateA3(positions: IEPosition[]): bigint { ... }
export function ieCalculatePayouts(
  positions: IEPosition[],
  trancheAmount: bigint
): Map<string, bigint> { ... } // positionId -> amount

// Validación invariantes
export function ieValidateTree(challenge: IEChallenge, positions: IEPosition[]): { valid: boolean; errors: string[] } { ... }
export function ieConservationCheck(payouts: Map<string, bigint>, tranche: bigint): boolean { ... } // Σ = tranche

// Simulación crecimiento
export function ieSimulateGrowth(initialSeeds: number, maxLevel: IELevel): IEGrowthProjection[] { ... }
```

### 4.4 ie-attestation.ts (Registro Offline-First)

```typescript
export function ieCreateAttestation(
  schema: keyof typeof IE_SCHEMAS,
  attester: string,
  recipient: string,
  data: object
): IEAttestation { ... }

export function ieRevokeAttestation(uid: string, attester: string): boolean { ... }
export function ieGetReceived(recipient: string, attestations: Record<string, IEAttestation>): IEAttestation[] { ... }
export function ieReputationScore(recipient: string, attestations: Record<string, IEAttestation>): number { ... }
```

### 4.5 ie-dv-tests.ts (Tests DV - Calibración Prototipo)

```typescript
// Fondo prototipo: $288,008 (6 decimales)
const PROTOTYPE_FUND = 288_008_000_000n;

export function dvTestPhysicalPersons(): boolean { ... }
export function dvTestPositionsTotal(): boolean { ... }
export function dvTestOneRceMatchesPrototype(): boolean { ... } // tolerancia 1 centavo
export function dvTestWeightClassesLevel5(): boolean { ... }    // full=100002¢, low=66668¢, mid=33334¢
export function dvTestConservation(): boolean { ... }           // Σ pagos = tramo
export function dvTestFeeSchedule(): boolean { ... }
export function runAllDVTests(): { passed: number; failed: number; details: string[] } { ... }
```

---

## 5. Estado Zustand (Hooks)

### 5.1 Acciones Principales (ie-protocol.ts hooks)

```typescript
// Challenges
createChallenge: (input: CreateChallengeInput) => IEChallenge
fundChallenge: (challengeId: string, gross: bigint) => { fee: bigint; net: bigint }
closeChallenge: (challengeId: string) => bigint // refunded

// Network growth
seed: (challengeId: string) => IEPosition
join: (challengeId: string, parentPositionId: string) => IEPosition
setCoordinator: (challengeId: string, positionId: string, value: boolean) => void

// Contributions & Consensus
contribute: (challengeId: string, positionId: string, workURI: string) => IEAttestation
approveMilestone: (challengeId: string, milestoneId: string) => IEAttestation
releaseMilestone: (challengeId: string, milestoneId: string) => { payouts: Map<string, bigint>; a3: bigint }
claim: (challengeId: string) => bigint

// Staking
stake: (challengeId: string, positionId: string, amount: bigint) => bigint // newStake
unstake: (challengeId: string, positionId: string, amount: bigint) => bigint

// Peer Scoring (GIVE)
allocateGive: (challengeId: string, toPositionId: string, amount: bigint) => bigint // totalReceived

// AI Facilitator
synthesizeConsensus: (challengeTitle: string, milestoneTitle: string, contributions: string) => SynthesisResult
generateFunderReport: (challengeTitle: string, milestones: IEMilestone[], contributions: string) => string

// Views / Selectors
getChallenge: (id: string) => IEChallenge | undefined
getPosition: (id: string) => IEPosition | undefined
getPositionsOf: (challengeId: string) => IEPosition[]
getMilestones: (challengeId: string) => IEMilestone[]
getClaimable: (challengeId: string, holder: string) => bigint
getReputation: (holder: string) => number
getGiveRemaining: (challengeId: string, holder: string) => bigint
getCurrentA3: (challengeId: string) => bigint
getProjectedPayout: (challengeId: string, positionId: string, milestoneId: string) => bigint

// Persistence
saveToStorage: () => void
reset: () => void
detectV1Data: () => boolean
migrateV1ToV2: () => void
```

---

## 6. Pantallas — Especificación UX

### 6.1 IEChallengeDashboard.tsx
- **Lista desafíos**: cards con KPIs (fondos, nivel, participantes, % liberado)
- **Crear desafío**: modal form (metaURI, hitos[], montos[], umbrales[])
- **Filtros**: active/completed/closed, búsqueda por título
- **Acciones rápidas**: nueva simulación, calculadora RCE, certificados

### 6.2 IEChallengeWorkspace.tsx (Vista Principal)
- **Header**: título desafío, financiador, KPIs (custodia, repartido, nivel, posiciones, A3)
- **Árbol izquierdo**: `IETreeView` interactivo (click select, join debajo, contribute)
- **Panel derecho**: posición seleccionada (detalles, peso efectivo, proyección RCE, acciones)
- **Hitos**: `IEMilestoneTimeline` con progreso consenso, botón aprobar
- **IA Facilitador**: `IEAIAgentPanel` (sintetizar consenso, informe financiadores)
- **Mi estado**: RCE claimable, reputación, GIVE restante, stake
- **Toast celebración**: 💸 al detectar nuevo milestone released

### 6.3 IETreeView.tsx
- **SVG Reingold-Tilford**: layout automático, compact mode >30 nodos
- **Colores**: `--full` (Alta), `--low` (Baja), `--mid` (Media)
- **Coordinador**: anillo dorado `#fcd34d`
- **GIVE arcs**: curvas Bézier animadas `#e879f9`
- **Payout pulse**: animación CSS escalonada por depth (+RCE fly text)
- **Leyenda**: clases, coordinador, GIVE arcs

### 6.4 IERCECalculator.tsx
- **Input**: fondo USD + slider niveles (1-21)
- **Presets**: $288,008, $1M, $3.5M (XPRIZE), $100M
- **Tabla**: nivel, personas, posiciones, coef, 1 RCE, 2/3 RCE, 1/3 RCE
- **Highlight**: nivel 5 (calibración $1,000.03)
- **100% client-side** (offline-first, demo a prueba de fallos)

### 6.5 IEAIAgentPanel.tsx
- **Textarea**: aportes/discusión grupo
- **Botones**: "Sintetizar consenso" + "Informe para financiadores"
- **Resultado síntesis**: badge recomendación (approve/revise/reject), summary, rationale, openQuestions
- **Resultado informe**: markdown renderizado
- **Modo stub**: aviso si sin ANTHROPIC_API_KEY (heurística local)

### 6.6 IECertificates.tsx
- **Mis certificados**: grid ImpactCerts (uri, impact, contributors, time)
- **Mis atestaciones**: lista por schema (contribution, consensus, role)
- **Reputación score**: contador atestaciones no revocadas
- **Verificar on-chain**: botón (modo conectado) → explorer

### 6.7 IESimulation.tsx
- **Inputs**: semillas iniciales (1-3), nivel máximo (1-21), fondo estimado
- **Outputs**: tabla crecimiento (nivel, nuevas posiciones, acumulado, coordinadores)
- **Gráfico**: 3^n exponencial + proyección RCE por nivel/clase
- **Escenarios**: optimista/pesimista/realista (factor reclutamiento 1.5-2.5)

---

## 7. Navegación e i18n

### 7.1 Aside.tsx — Nav Items

```typescript
{ key: 'ieProtocol', navKey: 'nav.ieProtocol', icon: GitBranch, color: 'text-cyan-400', path: '/ie-protocol' },
{ key: 'ieCalculator', navKey: 'nav.ieCalculator', icon: Calculator, color: 'text-emerald-400', path: '/ie-calculator' },
{ key: 'ieCertificates', navKey: 'nav.ieCertificates', icon: Award, color: 'text-amber-400', path: '/ie-certificates' },
```

### 7.2 i18n.ts — Claves (ES/EN/PT)

```typescript
// Nav
'nav.ieProtocol': { es: 'Protocolo IE', en: 'IE Protocol', pt: 'Protocolo IE' },
'nav.ieCalculator': { es: 'Calculadora RCE', en: 'RCE Calculator', pt: 'Calculadora RCE' },
'nav.ieCertificates': { es: 'Certificados Impacto', en: 'Impact Certificates', pt: 'Certificados Impacto' },

// Titles
'title.ieProtocol': { es: 'Protocolo Inteligencia Exponencial', en: 'Exponential Intelligence Protocol', pt: 'Protocolo Inteligência Exponencial' },
'title.ieCalculator': { es: 'Calculadora Renta Compartida Exponencial', en: 'Exponential Shared Income Calculator', pt: 'Calculadora Renda Compartilhada Exponencial' },

// Labels IE
'ie.challenge': { es: 'Desafío', en: 'Challenge', pt: 'Desafio' },
'ie.seed': { es: 'Semilla', en: 'Seed', pt: 'Semente' },
'ie.join': { es: 'Unirme', en: 'Join', pt: 'Entrar' },
'ie.contribute': { es: 'Aportar', en: 'Contribute', pt: 'Contribuir' },
'ie.approve': { es: 'Aprobar hito', en: 'Approve milestone', pt: 'Aprovar marco' },
'ie.claim': { es: 'Cobrar RCE', en: 'Claim RCE', pt: 'Resgatar RCE' },
'ie.stake': { es: 'Stakear', en: 'Stake', pt: 'Stakear' },
'ie.give': { es: 'Dar GIVE', en: 'Give GIVE', pt: 'Dar GIVE' },
'ie.coordinator': { es: 'Coordinador/a', en: 'Coordinator', pt: 'Coordenador/a' },
'ie.weightClass.full': { es: 'Alta / Tronco / Semilla', en: 'Full / Trunk / Seed', pt: 'Alta / Tronco / Semente' },
'ie.weightClass.low': { es: 'Baja', en: 'Low', pt: 'Baixa' },
'ie.weightClass.mid': { es: 'Media', en: 'Mid', pt: 'Média' },
'ie.rce': { es: 'Renta Compartida Exponencial', en: 'Exponential Shared Income', pt: 'Renda Compartilhada Exponencial' },
'ie.a3': { es: 'Peso total efectivo (A3)', en: 'Total effective weight (A3)', pt: 'Peso total efetivo (A3)' },
'ie.milestone': { es: 'Hito', en: 'Milestone', pt: 'Marco' },
'ie.consensus': { es: 'Consenso', en: 'Consensus', pt: 'Consenso' },
'ie.attestation': { es: 'Atestación', en: 'Attestation', pt: 'Atestação' },
'ie.impactCert': { es: 'Certificado de impacto', en: 'Impact certificate', pt: 'Certificado de impacto' },
'ie.aiSynthesize': { es: 'Sintetizar consenso', en: 'Synthesize consensus', pt: 'Sintetizar consenso' },
'ie.aiReport': { es: 'Informe para financiadores', en: 'Funder report', pt: 'Relatório para financiadores' },
```

---

## 8. OpenSpec (API para Agentes)

```yaml
# openspec/specs/ie-protocol/openapi.yaml
openapi: 3.0.3
info:
  title: IE Protocol API
  version: 1.0.0
  description: Protocolo Inteligencia Exponencial - Renta Compartida Exponencial
servers:
  - url: http://localhost:3000/api/ie
    description: Local development
paths:
  /challenges:
    get: { summary: Listar desafíos }
    post: { summary: Crear desafío, requestBody: { content: { application/json: { schema: { $ref: '#/components/schemas/CreateChallengeInput' } } } } }
  /challenges/{id}:
    get: { summary: Obtener desafío }
  /challenges/{id}/fund:
    post: { summary: Fondear desafío }
  /challenges/{id}/seed:
    post: { summary: Registrar semilla }
  /challenges/{id}/join:
    post: { summary: Unirse a posición, requestBody: { parentPositionId } }
  /challenges/{id}/positions:
    get: { summary: Árbol completo posiciones }
  /positions/{id}/contribute:
    post: { summary: Registrar aporte }
  /positions/{id}/stake:
    post: { summary: Stakear tokens }
  /positions/{id}/give:
    post: { summary: Asignar GIVE a par }
  /milestones/{id}/approve:
    post: { summary: Aprobar hito (consenso) }
  /milestones/{id}/release:
    post: { summary: Liberar y repartir RCE }
  /challenges/{id}/claim:
    post: { summary: Cobrar RCE disponible }
  /challenges/{id}/close:
    post: { summary: Cerrar desafío (reembolso escrow) }
  /ai/synthesize:
    post: { summary: IA sintetiza consenso }
  /ai/report:
    post: { summary: IA redacta informe financiadores }
  /calculator/rce:
    post: { summary: Tabla RCE para fondo/niveles }
  /simulate/growth:
    post: { summary: Simular crecimiento IE }
  /attestations/{uid}:
    get: { summary: Obtener atestación }
  /certificates:
    get: { summary: Certificados impacto }
components:
  schemas:
    CreateChallengeInput: { type: object, properties: { token: {type:string}, metaURI:{type:string}, milestones: {type:array, items: {type:object, properties: {title:{type:string}, amount:{type:string}, approvalsRequired:{type:integer}}}}}}
    # ... resto schemas
```

---

## 9. Tests de Validación (FASE 4)

### 9.1 Unit Tests (Vitest/Jest)

```typescript
// src/core/lib/__tests__/ie-rce-math.test.ts
describe('IE RCE Math', () => {
  test('physicalPersons: 3^5 = 243', () => expect(iePhysicalPersons(5)).toBe(243n));
  test('positionsTotal: L5 = 363', () => expect(iePositionsTotal(5)).toBe(363n));
  test('oneRce prototype calibration: $288,008 L5 = $1,000.03', () => {
    const fund = 288_008_000_000n;
    const oneRce = ieOneRce(fund, 5);
    expect(Number(oneRce / 10_000n)).toBe(100002); // centavos floor
  });
  test('weight classes L5: full=100002¢, low=66668¢, mid=33334¢', () => { ... });
  test('conservation: Σ payouts = tranche', () => { ... });
});

// src/core/lib/__tests__/ie-protocol-fee.test.ts
describe('Protocol Fee', () => {
  test('≤10k -> 10%', () => expect(ieFeeBps(10_000_000_000n)).toBe(1000n));
  test('100k -> 7%', () => expect(ieFeeBps(100_000_000_000n)).toBe(700n));
  test('split conservation: fee + net = gross', () => { ... });
});

// src/core/lib/__tests__/ie-protocol.test.ts
describe('IE Protocol Logic', () => {
  test('tree growth: 3 seeds → 3^n per level', () => { ... });
  test('effectiveWeight = class + stakeBonus + giveBonus', () => { ... });
  test('A3 = Σ effectiveWeight', () => { ... });
  test('payout conservation', () => { ... });
  test('stake bonus cap at 6', () => { ... });
  test('give bonus cap at 5', () => { ... });
});
```

### 9.2 DV Tests (Ejecución Determinista)

```bash
# Ejecutar tests DV puros (sin blockchain, sin red)
npm run test:ie-dv
# Debe pasar: 7/7 tests calibración prototipo WhatMatters
```

### 9.3 E2E Tests (Playwright)

```typescript
// e2e/ie-protocol.spec.ts
test('flujo completo: crear → fund → seed x3 → join → contribute → approve → release → claim', async () => { ... });
test('calculadora RCE reproduce prototipo', async () => { ... });
test('árbol triádico renderiza correctamente', async () => { ... });
test('facilitador IA propone decisión', async () => { ... });
```

---

## 10. Roadmap Implementación (Fases)

| Fase | Entregables | Criterio Éxito |
|------|-------------|----------------|
| **F3.1** | Types + Constants + RCE Math + Protocol Fee | `npx tsc --noEmit` clean, DV tests 7/7 pass |
| **F3.2** | Attestation Registry + Protocol Logic (puro) | 100% coverage funciones puras, conservation verified |
| **F3.3** | Estado Zustand + Hooks + Persistence | `saveToStorage`/`reset`/`migrateV1ToV2` funcionan |
| **F3.4** | Dashboard + Workspace + TreeView + Calculator | Render sin errores, TreeView 10k nodos @60fps |
| **F3.5** | AI Agent Panel + Milestone Timeline + Certificates | IA stub funciona, markdown render OK |
| **F3.6** | Simulación + Integración Store/Nav/i18n | Nav items activos, i18n ES/EN/PT completo |
| **F3.7** | OpenSpec + Tests E2E | `npx tsc --noEmit` clean, 80% coverage E2E |
| **F3.8** | Deploy + Monitoreo | SLO: 99.9% uptime, p99 < 200ms |

---

## 11. Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Coeficientes RCE no derivables (hardcode) | Alta | Medio | Documentar como "canónicos del prototipo", tests DV validan |
| Árbol grande → gas/performance | Media | Alto | Distribución lazy + A3 incremental (Fase 2 roadmap) |
| IA Agent falla (rate limit, key missing) | Media | Bajo | Modo stub obligatorio, heurística local determinista |
| Atestaciones offline vs on-chain sync | Media | Medio | Diseño "offline-first": localStorage + sync opcional background |
| Staking/GIVE gaming (sybil) | Media | Alto | Requiere Poh verificado para entrar; roadmap: World ID / identidad estatal |

---

## 12. Licencia y Atribución

- **Código WhatMatters**: MIT License → uso transformativo permitido
- **Atribución en código**: `// Based on WhatMatters IE Protocol (MIT) by Virginia Barco, David Chaparro et al.`
- **Nombres propietarios**: Usar términos genéricos en HSCSG:
  - "WhatMatters" → "Protocolo IE" / "Red Triádica"
  - "Renta Compartida Exponencial" → "RCE" / "Renta Compartida Exponencial"
  - "Inteligencia Exponencial" → "IE" / "Inteligencia Exponencial"

---

*Integration Document v1.0 | 2026-11-03 | HSCSG v15 OS | Principio Anfibio*