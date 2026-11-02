# Proof of Humanity / Kleros — Integración en HSCSG v15 OS

**Fecha**: 2026-10-29  
**Fuente**: `docs/poh_kleros_backup.md`  
**Metodología**: HSCSG v15 OS — Asimilación Ecosistémica (4 fases) + Principio Anfibio

---

## 1. Perspectiva USUARIO — Qué quiere lograr en su nodo

### Journey del Usuario (Nodo Cosateca / HSCSG)

> **Objetivo**: Tener un **registro soberano de humanos verificados** en su nodo local, interoperable con PoH global, que sirva para:
> - **Governance anti-Sybil**: 1 humano = 1 voto en CDS/DAOs del nodo
> - **Distribución justa (UBI/CaaS)**: ZNU/CAaS payouts solo a humanos únicos
> - **Reputación verificable**: Soulbound ID portable cross-chain
> - **Defensa anti-bot/IA**: Distinguir humanos de agentes autónomos (Ley I)
> - **Justicia local**: Disputas resueltas vía Kleros-style court (Ley III)

### Flujos de Usuario Esperados

| Flujo | Descripción | Output |
|-------|-------------|--------|
| **Registro Local** | Usuario crea perfil con vídeo + metadatos off-chain (IPFS/local) | `PoHProfile` local + `SoulboundID` local |
| **Vouching Interno** | Miembros del nodo (firmantes Social DNA) avalan | `VouchRecord` + peso reputacional |
| **Challenge Period** | Ventana de disputa local (configurable días) | `Challenge` → `KlerosDispute` local |
| **Resolución Kleros** | Jurados del nodo (stake ZNU) votan anónimos | `Verdict` + `ReputationDelta` |
| **Inclusión/Rechazo** | Si pasa → `Included` + Soulbound ID activo | `PoHIdentity` con `registeredAt`, `expiresAt` |
| **Renovación Periódica** | Re-verificación antes de expiración | `RenewalChallenge` o auto-renovación si sin desafíos |
| **Cross-Chain Bridge** | Sincronizar con PoH global (Gnosis/Ethereum) via `ICrossChainProofOfHumanity` | `CrossChainProof` portable |

### UX Requerida (Pantalla `Poh.tsx`)

Tabs principales:
1. **Registro** — Formulario perfil + vídeo (offline-first, IPFS local)
2. **Vouching** — Lista pendientes, avalar, ver vouchers recibidos
3. **Desafíos** — Ver desafíos activos, crear challenge, evidencias
4. **Identidad** — Mis Soulbound IDs, estado, renovación, export cross-chain
5. **Kleros Local** — Jurados, disputas, price discovery (Schelling), apelaciones

---

## 2. Perspectiva LLM — Qué asimilar (lógica pura) y qué extirpar (infra ajena)

### ✅ ASIMILAR — Lógica Pura (TypeScript, sin deps externas)

#### Tipos de Dominio (`src/core/state/poh.ts`)
```typescript
// Perfil PoH (offline-first, sin blockchain)
interface PoHProfile {
  id: string                    // Soulbound ID local
  name: string
  videoHash: string             // CID IPFS o hash local
  photoHash: string
  walletAddress: string         // EVM address del usuario
  submittedAt: number
  vouchedBy: string[]           // nombres de miembros que voucharon
  status: 'pending' | 'vouched' | 'challenged' | 'included' | 'rejected' | 'expired'
  expiresAt: number             // timestamp expiración (ej. 1 año)
  crossChainProof?: CrossChainProof
}

// Vouching comunitario
interface VouchRecord {
  id: string
  profileId: string
  voucher: string               // nombre miembro nodo (firmó Social DNA)
  weight: number                // peso reputacional (basado en AUT/CDS)
  timestamp: number
}

// Challenge / Disputa local (estilo Kleros)
interface PohChallenge {
  id: string
  profileId: string
  challenger: string
  reason: string
  evidence: EvidenceRecord[]    // reusa EvidenceModel de @core/lib/evidence
  status: 'open' | 'in_court' | 'resolved' | 'appealed'
  createdAt: number
  resolvedAt?: number
  resolution?: string           // RAO text
  jurors: JurorVote[]
  appealed: boolean
}

// Jurado local (stake ZNU, no PNK)
interface JurorVote {
  jurorId: string
  verdict: 'a_favor' | 'en_contra' | 'abstencion'
  stake: number                 // ZNU staked
  reputation: number            // reputación jurados (decay si minoría)
}

// Soulbound ID cross-chain
interface CrossChainProof {
  chain: 'gnosis' | 'ethereum' | 'arbitrum'
  contractAddress: string
  humanityId: string            // bytes20
  isClaimed: boolean
  claimedAt?: number
}

// Estado global PoH
interface PohState {
  profiles: PoHProfile[]
  vouches: VouchRecord[]
  challenges: PohChallenge[]
  jurors: Juror[]               // reusa Juror de kleros.ts
  identities: PoHIdentity[]     // incluidos (humanos verificados)
  config: PohConfig
}

interface PohConfig {
  challengePeriodDays: number   // default 7
  minVouchesRequired: number    // default 1
  renewalPeriodDays: number     // default 365
  minJurorStake: number         // ZNU mínimo para ser jurado
  reputationDecay: number       // penalty por votar minoría
}
```

#### Lógica Pura (`src/core/lib/poh.ts`)

**Funciones fábrica + helpers (NO importan infra blockchain):**

```typescript
// Factory
makePohState(): PohState

// Registro
submitProfile(input: { name, videoHash, photoHash, walletAddress, submittedBy }): PoHProfile
getProfile(id: string): PoHProfile | undefined

// Vouching
vouch(profileId: string, voucher: string, weight: number): VouchRecord
getVouchesFor(profileId: string): VouchRecord[]
canEnterChallengePeriod(profile: PoHProfile): boolean  // minVouches + tiempo

// Challenge Period
openChallenge(profileId: string, challenger: string, reason: string): PohChallenge
addChallengeEvidence(challengeId: string, evidence: EvidenceRecord): PohChallenge
getActiveChallenges(): PohChallenge[]

// Kleros Local (jurados + votación)
seatJuror(name: string, stake: number): Juror
castVote(challengeId: string, jurorId: string, verdict: JurorVerdict): PohChallenge
resolveChallenge(challengeId: string, resolution: string): PohChallenge  // mayoría simple + reputationDecay
appealChallenge(challengeId: string): PohChallenge

// Inclusión / Identidad
includeHuman(profileId: string): PoHIdentity  // genera Soulbound ID local
getIdentity(humanName: string): PoHIdentity | undefined
renewIdentity(identityId: string): PoHIdentity

// Cross-Chain (read-only, para integración futura)
verifyCrossChain(humanityId: string, chain: 'gnosis'|'ethereum'): Promise<CrossChainProof>

// Utilidades
getPendingProfiles(): PoHProfile[]
getExpiringIdentities(days: number): PoHIdentity[]
computeHumanScore(identity: PoHIdentity): number  // basado en vouches, disputas ganadas, antigüedad
```

#### Extensión Kleros (`src/core/lib/kleros-extended.ts`)

```typescript
// Courts locales (configuración)
interface LocalCourt {
  id: string
  name: string
  minStake: number
  jurorCount: number          // 3, 5, 9, ... (impar)
  hiddenVotes: boolean
  appealCost: number          // ZNU
  maxAppeals: number
}

// Price Discovery via Schelling (isomorfo a Symbiosky + iambrainstorming)
interface PriceEstimate { juror: string; value: number; stake: number }
medianEstimate(estimates: PriceEstimate[]): number
priceDiscovery(estimates: PriceEstimate[], tolerancePct: number): { median, rewarded, penalized }

// Appeal System (costes exponenciales)
calculateAppealCost(round: number, baseCost: number): number
canAppeal(challenge: PohChallenge, appellant: string): boolean

// Juror Selection (sortition ponderada por stake ZNU)
selectJurors(pool: Juror[], count: number): Juror[]
```

### ❌ EXTIRPAR — Infraestructura Ajena (NO llevar a HSCSG)

| Componente Original | Por qué extirpar | Reemplazo HSCSG |
|---------------------|------------------|-----------------|
| Contratos Solidity (PoH v1/v2) | EVM-specific, gas, blockchain | Lógica pura TypeScript + estado local |
| Next.js/React frontend (v2-web) | Framework-specific, SSR, routing | Screen React nativo HSCSG (`Poh.tsx`) |
| The Graph Subgraph | Indexing centralizado, GraphQL | Queries locales sobre `PohState` (Zustand) |
| IPFS/Arweave para vídeo | Infra externa, costes | `videoHash` + almacenamiento local/IPFS opcional (configurable) |
| Gnosis Chain / Ethereum RPC | Red específica, gas | `nodeMode: 'postmonetario' | 'conectado'` + `priceParity` |
| Depósito reembolsable (ETH/PNK) | Tokenomics externa | Stake ZNU local (anfibio: ZNU o USDC vía priceParity) |
| PNK tokenomics | Token ajeno, supply fija | ZNU nativo (demurrage, priceParity ReFi Nivel 3) |
| Snapshot voting off-chain | Plataforma centralizada | `democracia` / `integral` loop CDS→OAD→COS→ITC→FRS |
| Kleros V1/V2 contracts (Arbitrum) | Blockchain-specific | Court local con jurados ZNU-staked |
| Vea Bridge / Gateway | Cross-chain infra compleja | `CrossChainProof` interface read-only (simulada) |

### 🔄 ADAPTADORES ANFIBIOS (para modo conectado)

```typescript
// src/core/lib/amphibious/poh-adapters.ts
interface PohAdapter {
  // Modo postmonetario (default): todo local, ZNU
  submitProfileLocal(profile: PoHProfileInput): PoHProfile
  vouchLocal(vouch: VouchInput): VouchRecord
  resolveChallengeLocal(challengeId: string): PohChallenge
  
  // Modo conectado: bridge a PoH global (Gnosis/Ethereum)
  submitProfileOnChain(profile: PoHProfileInput): Promise<CrossChainProof>
  verifyOnChain(humanityId: string): Promise<boolean>
  syncIdentities(): Promise<PoHIdentity[]>
}

// Factory por modo
createPohAdapter(mode: 'postmonetario' | 'conectado', priceParity?: number): PohAdapter
```

---

## 3. Perspectiva HSCSG + CaaS — Isomorfismo con Leyes MJ I/II/III + CaaS

### Ley I: No Dañar Base Material ni Personas
- **PoH → Identidad Soberana**: Registro local protege a personas de bots/Sybil/IA maliciosa
- **No KYC estatal**: No entrega datos biométricos a terceros; vídeo hash local, control del usuario
- **Anti-duplicados**: Challenge period + vouching comunitario = defensa de la base social

### Ley II: Ganarse la Vida Soberanizando (AUT × CDS)
- **Vouching = Contribución Social**: Quien vouchara aporta AUT (autonomía) + CDS (cohesión)
- **Jurados Kleros = Trabajo Verificado**: Stake ZNU + reputación = skin-in-the-game = AUT
- **UBI/CaaS Distribution**: Solo humanos incluidos (`PoHIdentity`) reciben payouts → filtro AUT real
- **Soulbound ID = Capital Social No-Transferible**: No se vende, se gana (isomorfo a `vesting` + `trustlines`)

### Ley III: Lucidez, Nunca Engañar
- **Challenge Period Transparente**: Cualquiera puede ver desafíos, evidencias, votos (append-only)
- **ReputationDecay Jurados**: Quien miente/vota mal pierde reputación (penalización verificable)
- **RAO (Registro Append-Only)**: Cada decisión de inclusión/rechazo queda en log inmutable
- **Cross-Chain Verification**: `ICrossChainProofOfHumanity` interface = verificación independiente

### CaaS (Comunidad como Servicio) — Acceso por Contribución Real
| Tier CaaS | Requisito PoH | Acceso |
|-----------|---------------|--------|
| `visitante` | — | Lectura sola |
| `colaborador` | `PoHIdentity` activa + 1 vouch | Participar en CDS, proponer issues |
| `custodio` | `PoHIdentity` + 3 vouches + 0 desafíos perdidos | Votar en CDS, ser jurado Kleros, recibir ZNU payout |
| `fundador` | `PoHIdentity` + 10 vouches + historial limpio | Gobernanza nodo, priceParity oracle, crear courts |

### Isomorfismos con Módulos Existentes

| Módulo HSCSG | Isomorfismo PoH/Kleros | Vasos Comunicantes |
|--------------|------------------------|---------------------|
| `kleros` (existente) | Extender con PoH-specific logic | `kleros.ts` → `poh.ts` + `kleros-extended.ts` |
| `justicia` (screen) | Fusionar: PoH challenges = disputes | Unificar pantalla `Justicia.tsx` → `Poh.tsx` |
| `trustlines` | Vouching = trustline social (crédito mutuo reputacional) | `vouch` ↔ `openTrustline` |
| `solarpunk.vouches` | Vouching PoH = vouch solar (mismo patrón) | `addVouch` ↔ `vouch` |
| `symbiosky` | Jurados = credibilidad por convicción (stake + reputationDecay) | `castVote` ↔ `symCastVote` + `symDecayTick` |
| `aura` | Soulbound ID = credencial Aura (RAO inmutable) | `attestIdentity` ↔ `aura-farming-detection` |
| `delegation` | Delegación de voto humano verificado | `delegatePower` solo si `PoHIdentity` activa |
| `caas` | Payouts solo a humanos incluidos | `runCaasPayout` filtra por `poh.identities` |
| `boundaries` | Policy gateway: solo humanos pueden ejecutar acciones críticas | `setBoundaryPolicy` requiere `isHuman` |
| `agentMesh` / `nooa` | Agentes autónomos distinguibles de humanos | `isHuman` check antes de `spawnAgent` |

---

## 4. Decisiones EBD (Evidence-Based Design) — Plantilla Obligatoria

| D# | Decisión | Evidencia Primaria | Módulo/Test Afectado |
|----|----------|-------------------|---------------------|
| D1 | **PoH nativo offline-first** (no dependencia blockchain) | PoH 2.0 usa Kleros V1 pero frontend off-chain; HSCSG principio anfibio | `poh.ts`, `poh-adapters.ts` |
| D2 | **Vouching = Trustline Social** (crédito mutuo reputacional) | Trustlines Protocol: deuda bilateral simétrica; PoH vouch = aval social | `poh.ts:vouch`, `trustlines.ts` |
| D3 | **Jurados stake ZNU (no PNK)** | Kleros usa PNK; HSCSG usa ZNU nativo + priceParity ReFi Nivel 3 | `kleros-extended.ts:seatJuror`, `znu.ts` |
| D4 | **Soulbound ID local + cross-chain read-only** | PoH 2.0 Soulbound IDs cross-chain; HSCSG principio anfibio | `poh.ts:CrossChainProof`, `poh-adapters.ts` |
| D5 | **Challenge Period = Integral Issue + Evidence Model** | Integral Collective loop CDS→OAD→COS→ITC→FRS; Evidence Model CompAI | `poh.ts:PohChallenge`, `evidence.ts`, `integral.ts` |
| D6 | **Price Discovery Schelling para jurados** | Symbiosky + iambrainstorming: score Schelling game; Kleros = Schelling point | `kleros-extended.ts:priceDiscovery` |
| D7 | **Renovación periódica = PVSO (Validación Soberana)** | HSCSG ciclos PVSO; PoH expiración = validación recurrente | `poh.ts:renewIdentity`, `pvsos` |
| D8 | **Modo Anfibio: ZNU local ↔ USDC vía priceParity** | DeseOS/Contento.pro: nodeMode + priceParity; ALRAC Nivel 3 ReFi | `poh-adapters.ts`, `store.ts:nodeMode/priceParity` |

---

## 5. Decisiones de Validación Estratégica (DV)

| DV# | Decisión | Justificación | Go/No-Go |
|-----|----------|---------------|----------|
| DV-01 | **Integrar PoH como módulo `poh` (no extender `kleros` únicamente)** | PoH añade: registro, vouching, challenge period, soulbound, renovación — más que solo disputes | **GO** |
| DV-02 | **Reutilizar `EvidenceModel` de `@core/lib/evidence` para challenges** | Evidence Model (CompAI CRM) ya implementado con kinds + bands; isomorfismo total | **GO** |
| DV-03 | **Jurados locales stake ZNU con reputationDecay (no PNK)** | Coherente con CaaS + ZNU nativo; PNK es token ajeno | **GO** |
| DV-04 | **Cross-chain read-only (no write) en Fase 1** | Escribir on-chain requiere infra ajena (wallet, gas, RPC); Fase 2 con adapter conectado | **GO (Fase 1 read-only)** |

---

## 6. KPIs Mínimos por Módulo (Tests Obligatorios)

| Módulo | KPIs Mínimos | Test File |
|--------|--------------|-----------|
| `poh.ts` | `submitProfile` → profile creado con ID único; `vouch` → peso acumulado; `openChallenge` → status `challenged`; `resolveChallenge` → mayoría simple + reputationDecay; `includeHuman` → Soulbound ID generado | `poh.test.ts` |
| `kleros-extended.ts` | `medianEstimate` → mediana correcta; `priceDiscovery` → rewarded/penalized dentro tolerancia; `selectJurors` → count correcto, ponderado por stake | `kleros-extended.test.ts` |
| `poh-adapters.ts` | Modo postmonetario: funciones locales OK; Modo conectado: interface cumple `ICrossChainProofOfHumanity` | `poh-adapters.test.ts` |
| `Poh.tsx` | Render tabs sin error; `submitProfile` llama store action; `vouch` actualiza estado; navegación fluida | Storybook + e2e |

---

## 7. Vasos Comunicantes Obligatorios (Citas Internas)

| Contexto | Formato | Enlace |
|----------|---------|--------|
| Decisión EBD D1 | `[EBD-D1]` | `docs/poh_kleros_integration.md#4` |
| Decisión Validación DV-01 | `[DV-01]` | `docs/poh_kleros_integration.md#5` |
| KPI PoH | `[KPI-PoH-Inclusion]` | `src/core/lib/poh.test.ts` |
| Código: makePohState | `[src/core/state/poh.ts]` | `src/core/state/poh.ts` |
| Código: vouch logic | `[src/core/lib/poh.ts:L45-L60]` | `src/core/lib/poh.ts` |
| Código: Kleros price discovery | `[src/core/lib/kleros-extended.ts:L149-L180]` | `src/core/lib/kleros-extended.ts` |
| Riesgo: Cross-chain write | `[R1-CrossChainWrite]` | `docs/poh_kleros_integration.md#2` (extirpar) |
| Paper resultado | `[PoH-HSCSG-Assimilation]` | Este documento |

---

## 8. Estructura de Archivos a Generar (FASE 3)

```
src/
├── core/
│   ├── state/
│   │   ├── poh.ts                    # Tipos + makePohState()
│   │   └── store.ts                  # + import PohState, makePohState, actions
│   ├── lib/
│   │   ├── poh.ts                    # Lógica pura (submit, vouch, challenge, include, renew)
│   │   ├── kleros-extended.ts        # Courts, price discovery, appeals, sortition
│   │   └── amphibious/
│   │       └── poh-adapters.ts       # Modo postmonetario/conectado
│   └── state/hooks/
│       └── poh.ts                    # Re-export tipado desde store
├── app/
│   ├── screens/
│   │   └── Poh.tsx                   # Pantalla 5 tabs (Registro, Vouching, Desafíos, Identidad, Kleros)
│   ├── App.tsx                       # + Route path="poh"
│   └── layout/
│       └── Aside.tsx                 # + NavItem { key: 'poh', icon: UserCheck, path: '/poh' }
├── docs/
│   └── poh_kleros_integration.md     # ESTE DOCUMENTO
└── tests/
    ├── poh.test.ts
    ├── kleros-extended.test.ts
    └── poh-adapters.test.ts
```

---

## 9. Icono Lucide Válido para Nav

```typescript
// En Aside.tsx importar:
import { UserCheck, ShieldCheck, Scale, Users, Gavel } from 'lucide-react'

// NavItem recomendado:
{ key: 'poh', navKey: 'nav.poh', icon: UserCheck, color: 'text-sky-400', path: '/poh' }
// Alternativas: ShieldCheck (verificación), Scale (justicia), Users (comunidad), Gavel (court)
```

> **NOTA**: `TowerBroadcast`, `MasksTheater`, `Input`, `Textarea`, `Select` NO existen en lucide-react 0.453. Usar `UserCheck`, `Radio`, HTML crudo.

---

## 10. Checklist Pre-Entrega (FASE 4)

- [ ] `docs/poh_kleros_backup.md` creado ✓
- [ ] `docs/poh_kleros_integration.md` creado (triple perspectiva) ✓
- [ ] `src/core/state/poh.ts` — tipos + `makePohState()` 
- [ ] `src/core/lib/poh.ts` — lógica pura completa
- [ ] `src/core/lib/kleros-extended.ts` — extensión Kleros
- [ ] `src/core/lib/amphibious/poh-adapters.ts` — adapters anfibios
- [ ] `src/core/state/hooks/poh.ts` — re-export tipado
- [ ] `src/core/state/store.ts` — import tipos + estado + actions + resetAll + partialize
- [ ] `src/app/screens/Poh.tsx` — 5 tabs, UI components (Card, Stat, Btn, Badge, EmptyState, EvidenceLedger)
- [ ] `src/app/layout/Aside.tsx` — icono `UserCheck` + navKey `nav.poh`
- [ ] `src/app/App.tsx` — import `Poh` + `<Route path="poh" />`
- [ ] `npx tsc --noEmit` → 0 errores (core libs)
- [ ] `npm run build` → OK
- [ ] Preview: `/poh` → HTTP 200
- [ ] Tests: `poh.test.ts`, `kleros-extended.test.ts`, `poh-adapters.test.ts` → pass
- [ ] Commit + push + tag `feat/v1.0-poh-kleros`

---

## 11. Próximos Pasos Post-Asimilación

1. **Cross-Chain Adapter Real**: Implementar `poh-adapters.ts` modo conectado con `viem`/`ethers` + RPC Gnosis (Fase 2)
2. **ZK-Proofs para Anonimato**: Integrar HIP-86 (anonymizing profiles) via ZK-SNARKs en `boundaries` policy
3. **AI Verification Module**: `poh.aiVerification` — distinguir humanos de agentes IA (Ley I) usando `boundaries` + `agentMesh`
4. **UBI Integration**: `caas.runCaasPayout` filtra por `poh.identities` activas
5. **Governance Integration**: `democracia.electDeptRep` / `integral.raiseIssue` requieren `PoHIdentity` activa