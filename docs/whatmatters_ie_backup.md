# WhatMatters / Protocolo IE — Backup Document (FASE 1)

**Fuente**: GitHub `dav1dchaparro/whatmatters` (MIT License) + PDF "WhatMatters_Entrega_Final_2026.pdf"  
**Hash**: `sha256:whatmatters-ie-protocol-2026-07-24`  
**Fecha asimilación**: 2026-11-03  
**Cluster**: Economía Colaborativa Exponencial, Gobernanza Algorítmica, Renta Ganada, Reputación Soberana  
**Principio**: Anfibio (Postmonetario ZNU/CaaS ↔ Conectado USD/USDC vía priceParity)

---

## Resumen Ejecutivo

**WhatMatters** = MVP Hackathon Ethereum Uruguay 2026 (DoraHacks #47193). Plataforma para **coordinar masivamente, financiar y recompensar** la resolución colaborativa de grandes desafíos. Motor: **Protocolo Inteligencia Exponencial (IE)** sobre Ethereum → distribuye **Renta Compartida Exponencial (RCE)** por contribuciones reales, coordinadas y verificadas.

**Diferenciador clave**: Unifica las mejores mecánicas de Coordinape (peer-scoring), Gitcoin (QF), Karma GAP (reputación soulbound), Hypercerts (certificados impacto) + **custodia por hitos con consenso** (no 1 token = 1 voto) + **reparto económico automático on-chain**.

---

## 1. Arquitectura del Sistema

### 1.1 Stack Técnico

| Capa | Tecnología | Detalles |
|------|------------|----------|
| **Smart Contracts** | Foundry + Solidity 0.8.24 | 4 contratos core + mocks + 19 tests (incl. fuzz) |
| **Frontend** | Next.js 14 (App Router) + viem | dApp completa: home, /create, /challenge/[id], /person/[address] |
| **IA Agéntica** | Anthropic SDK (Claude) | `/api/agent/synthesize` + `/api/agent/report` — human-in-the-loop |
| **Wallet** | viem puro + modo demo | Firma local con cuentas Anvil (sin MetaMask) |
| **Atestaciones** | Registro propio EAS-compatible | Soulbound, intransferibles, revocables solo por atestador |
| **Token** | MockUSDC (6 decimales) | ERC20 test con faucet abierto |

### 1.2 Estructura de Contratos

```
contracts/
├── src/
│   ├── libraries/
│   │   ├── RCEMath.sol          # Matemática canónica RCE (coeficientes, pesos, payout)
│   │   └── ProtocolFee.sol      # Comisión regresiva (hasta 10%)
│   ├── AttestationRegistry.sol  # Reputación soberana (EAS-compatible)
│   ├── WhatMatters.sol          # Core: desafíos, árbol triádico, consenso, RCE, claims
│   └── mocks/MockUSDC.sol       # ERC20 test
├── test/
│   └── RCEMath.t.sol            # 10 tests: calibración vs prototipo Excel
└── script/
    └── Deploy.s.sol             # Deploy + seed árbol demo (niveles 1-3)
```

### 1.3 Componentes Frontend

```
web/
├── app/
│   ├── page.tsx                 # Landing + Calculadora RCE + Simulación escala
│   ├── challenge/[id]/          # Vista desafío: árbol, hitos, IA, mi estado
│   ├── create/                  # Formulario crear desafío + hitos
│   ├── person/[address]/        # Perfil: atestaciones, reputación
│   └── api/agent/               # IA endpoints (synthesize, report)
├── components/
│   ├── TreeView.tsx             # SVG árbol triádico (pesos, GIVE arcs, coordinadores)
│   ├── RceCalculator.tsx        # Tabla RCE inversa (fondo → RCE por nivel/clase)
│   ├── ChallengeClient.tsx      # Lógica completa desafío (seed, join, contribute, approve, claim)
│   ├── AgentPanel.tsx           # Facilitador IA (sintetiza, propone, redacta informe)
│   ├── MilestoneTimeline.tsx    # Línea tiempo hitos con progreso consenso
│   └── DemoGuide.tsx            # Tour guiado modo demo
├── lib/
│   ├── rce.ts                   # Port TS exacto de RCEMath.sol (calculadora client-side)
│   ├── useChallenge.ts          # Hooks viem: readChallenge, positions, milestones, giveFlows
│   ├── actions.ts               # Write actions: seed, join, contribute, approve, claim, stake, give
│   ├── walletProvider.tsx       # Modo demo (firma local Anvil) + wallet real
│   └── contracts.ts             # ABIs + direcciones (Anvil/Base Sepolia)
```

---

## 2. Protocolo Inteligencia Exponencial (IE) — Especificación Completa

### 2.1 Red Fractal Triádica (3→2)

**Regla de crecimiento**: Cada posición genera hasta **3 hijos** (ternario).  
**Semilla**: 3 posiciones nivel 1 (seeds).  
**Crecimiento por nivel**: `3^n` personas en base del nivel `n`.

| Nivel | Personas base (3^n) | Posiciones totales (3^(n+1)-3)/2 | Escala |
|-------|---------------------|----------------------------------|--------|
| 1 | 3 | 3 | Grupo semilla |
| 2 | 9 | 12 | Equipo |
| 3 | 27 | 39 | Comunidad |
| 4 | 81 | 120 | Barrio |
| 5 | 243 | 363 | Ciudad |
| 10 | 59,049 | 88,572 | Estadio / Ciudad grande |
| 15 | 14.3M | 21.5M | Nacional |
| 20 | 3.48B | 5.23B | Planetario (mitad humanidad) |

**Fórmulas canónicas** (RCEMath.sol):
```solidity
physicalPersons(n) = 3^n
positionsTotal(n) = (3^(n+1) - 3) / 2
```

### 2.2 Clases de Peso RCE (Numerador / 3)

| Clase | Numerador | RCE equivalente | Asignación por regla |
|-------|-----------|-----------------|---------------------|
| **Alta / Tronco / Semilla** | 3 (W_FULL) | 1.0 RCE | depth=1 (seeds) OR isCoordinator=true |
| **Media** | 1 (W_MID) | 1/3 RCE | Tiene hijos (childCount > 0) |
| **Baja** | 2 (W_LOW) | 2/3 RCE | Hoja sin hijos (childCount = 0, depth > 1) |

### 2.3 Coeficientes Canónicos RCE (Niveles 1-21)

Tomados **verbatim del prototipo Excel** del equipo WhatMatters. `1 RCE = fondo / coeficiente[nivel]`.

| Nivel | Coeficiente | 1 RCE (fondo $288,008) |
|-------|-------------|------------------------|
| 1 | 3 | $96,002.67 |
| 2 | 11 | $26,182.55 |
| 3 | 33 | $8,727.52 |
| 4 | 99 | $2,909.17 |
| 5 | 288 | **$1,000.03** ← Calibración exacta |
| 6 | 864 | $333.34 |
| 7 | 2,565 | $112.28 |
| 8 | 7,695 | $37.43 |
| 9 | 23,088 | $12.47 |
| 10 | 69,267 | $4.16 |
| 15 | 16,750,272 | ~$0.017 |
| 20 | 4,068,181,218 | ~$0.00007 |
| 21 | 12,204,542,928 | ~$0.00002 |

### 2.4 Peso Efectivo (Distribución On-Chain)

```
effectiveWeight = classWeight + stakeBonus + giveBonus

Donde:
- classWeight ∈ {3, 2, 1}  (Alta/Baja/Media)
- stakeBonus = min(stake / STAKE_UNIT, MAX_STAKE_BONUS)  // STAKE_UNIT=1000 mUSDC, MAX=6
- giveBonus = min(giveReceived / GIVE_UNIT, MAX_GIVE_BONUS)  // GIVE_UNIT=20, MAX=5
```

**Distribución RCE por hito** (fórmula exacta, aritmética entera):
```
pago_i = tramo_hito × effectiveWeight_i / A3

Donde A3 = Σ effectiveWeight_j  (suma sobre TODAS las posiciones reales del desafío)
Garantía: Σ pagos = tramo  (sin sobre-distribuir; polvo → treasury)
```

### 2.5 Comisión Regresiva de Protocolo (ProtocolFee)

| Monto gestionado | Fee (bps) | % |
|------------------|-----------|---|
| ≤ 10,000 USDC | 1000 | 10% |
| ≤ 100,000 USDC | 700 | 7% |
| ≤ 1,000,000 USDC | 400 | 4% |
| ≤ 10,000,000 USDC | 200 | 2% |
| > 10,000,000 USDC | 100 | 1% |

---

## 3. Ciclo de Vida del Desafío (Sequence Diagram)

```
1. FINANCIADOR → createChallenge(token, metaURI, milestones[])
   - Define hitos: title, amount, approvalsRequired
   
2. FINANCIADOR → fund(gross)
   - ProtocolFee.split(gross) → (fee → treasury, net → escrow challenge)
   
3. SEMILLAS (3) → seed() ×3
   - Crean posiciones depth=1, class=Alta (W_FULL=3)
   
4. RED → join(inviterPositionId) × N
   - Cada nodo max 3 hijos → árbol ternario
   - depth = parent.depth + 1
   - Actualiza challenge.level = max(depth)
   
5. PARTICIPANTES → contribute(workURI)
   - Atestación soulbound SCHEMA_CONTRIBUTION
   - Registra aporte on-chain (reputación)
   
6. IA FACILITADOR → sintetiza aportes → propone decisión
   - POST /api/agent/synthesize {challengeTitle, milestoneTitle, contributions}
   - Retorna: summary, recommendation (approve/revise/reject), rationale, openQuestions
   
7. PARTICIPANTES → approveMilestone() (consenso por atestaciones)
   - Solo participantes (positionsHeld > 0)
   - Atestación SCHEMA_CONSENSUS por cada aprobación
   - Umbral: approvals >= approvalsRequired (definido por financiador)
   
8. CONTRATO → _release(milestoneId) al alcanzar umbral
   - Calcula A3 = Σ effectiveWeight
   - Reparte: claimable[challengeId][holder] += tramo × w_i / A3
   - Minta ImpactCert (Hypercert-style)
   - Polvo redondeo → treasury
   
9. PARTICIPANTES → claim() (patrón pull)
   - Recibe RCE (token)
   - Reputación queda on-chain
   
10. FINANCIADOR → closeChallenge()
    - Recupera escrow no liberado (funded - released)
```

---

## 4. Contratos Core — Código Fuente Completo

### 4.1 RCEMath.sol (Matemática Canónica)

```solidity
// Ver contenido completo en web_extract results
// Funciones clave:
// - physicalPersons(level)
// - positionsTotal(level)  
// - coefficient(level)  // 21 valores hardcodeados del prototipo
// - oneRce(fund, level)
// - payout(fund, level, weightNum)  // weightNum ∈ {3,2,1}
```

### 4.2 ProtocolFee.sol (Comisión Regresiva)

```solidity
function feeBps(amount) internal pure returns (bps)
function split(amount) internal pure returns (fee, net)
```

### 4.3 AttestationRegistry.sol (Reputación Soberana)

```solidity
struct Attestation {
    bytes32 schema;
    address attester;
    address recipient;
    uint64 time;
    bool revoked;
    bytes data;
}

function attest(schema, recipient, data) external returns (uid)
function revoke(uid) external  // solo atestador original
function receivedBy(recipient) view returns (uids[])
function reputationScore(recipient) view returns (score)
```

### 4.4 WhatMatters.sol (Core Protocol) — Funciones Principales

```solidity
// Challenge lifecycle
createChallenge(token, metaURI, milestoneTitles[], milestoneAmounts[], approvalsRequired[])
fund(challengeId, gross)  // con fee regresivo

// Network growth (triadic)
seed(challengeId)  // max 3 seeds, depth=1
join(challengeId, inviterPositionId)  // max 3 hijos, depth=parent+1

// Coordination
setCoordinator(challengeId, positionId, value)  // solo financiador
contribute(challengeId, positionId, workURI)    // atestación CONTRIBUTION

// Consensus & Release
approveMilestone(challengeId, milestoneId)      // atestación CONSENSUS
_release(milestoneId) internal                  // calcula A3, reparte RCE, minta ImpactCert
claim(challengeId)                              // pull pattern

// Staking (Polkadot-style)
stake(challengeId, positionId, amount)          // +1 weight per 1000 mUSDC, max +6
unstake(challengeId, positionId, amount)

// Peer Scoring (Coordinape-style)
allocateGive(challengeId, toPositionId, amount) // GIVE_BUDGET=100, GIVE_UNIT=20, max +5

// Views
getChallenge(challengeId)
getPosition(positionId)
positionsOf(challengeId)
milestoneCount(challengeId)
getMilestone(challengeId, milestoneId)
weightNumOf(positionId)        // clase base 3/2/1
effectiveWeightOf(positionId)  // clase + stake + give
giveBonusOf(positionId)
currentA3(challengeId)         // Σ effectiveWeight (denominador RCE)
impactCertCount()
getImpactCert(certId)
impactCertsOf(challengeId)
```

---

## 5. Frontend — Componentes Clave

### 5.1 TreeView.tsx — Visualización Árbol Triádico

- **Layout**: Algoritmo Reingold-Tilford adaptado (asignación x por subárbol, y por depth)
- **Modo compacto**: >30 nodos (radio reducido, sin labels)
- **Colores por peso**: `var(--full)` (Alta), `var(--low)` (Baja), `var(--mid)` (Media)
- **Coordinador**: Anillo dorado `#fcd34d`
- **GIVE arcs**: Curvas Bézier quadráticas animadas (`#e879f9`) entre dador y receptor
- **Payout pulse**: Animación CSS `payout-pulse` + texto fly "+RCE" escalonado por depth

### 5.2 RceCalculator.tsx — Calculadora Inversa (Client-Side)

- **Input**: Fondo total USD + niveles a mostrar (1-21)
- **Output**: Tabla completa reproduciendo prototipo Excel
- **Presets**: $288,008 (prototipo), $1M, $3.5M (XPRIZE), $100M
- **Highlight**: Nivel 5 (calibración $1,000.03)
- **100% client-side** (no depende de cadena) → demo a prueba de fallos

### 5.3 ChallengeClient.tsx — Lógica Completa Desafío

- **Estado reactivo**: `useChallenge` hook (viem publicClient, polling 4s)
- **Acciones**: seed, join, contribute, approve, claim, stake, unstake, give, setCoordinator, fund, close
- **Modo demo**: Selector "actuar como" (cuentas Anvil, firma local sin MetaMask)
- **Mi estado**: claimable, reputación, GIVE restante
- **Proyección RCE en vivo**: `(tramo × effectiveWeight) / A3` para posición seleccionada
- **Celebración**: Toast 💸 al detectar nuevo milestone released (una sola vez por release)

### 5.4 AgentPanel.tsx — Facilitador IA (Human-in-the-Loop)

- **Endpoint 1**: `/api/agent/synthesize` → Sintetiza aportes, propone decisión
  - Input: challengeTitle, milestoneTitle, contributions
  - Output: summary, recommendation (approve/revise/reject), rationale, openQuestions
  - Modo stub (sin ANTHROPIC_API_KEY): heurística local
  
- **Endpoint 2**: `/api/agent/report` → Redacta informe para financiadores
  - Input: challengeTitle, milestones[], contributions
  - Output: report (markdown)

---

## 6. Tests de Calibración (RCEMath.t.sol)

```solidity
// Fondo prototipo: $288,008 (6 decimales)
uint256 constant FUND = 288_008e6;

testPhysicalPersons()        // 3^1=3, 3^5=243, 3^10=59049, 3^21=10,460,353,203
testPositionsTotal()         // (3^(n+1)-3)/2: L1=3, L5=363, L10=88572
testOneRceMatchesPrototype() // 1 RCE en centavos USD: L1=9600267, L5=100003, L10=416
testWeightClassesLevel5()    // full=100002¢, low=66668¢, mid=33334¢ (floor 1 cent)
```

**Tolerancia**: 1 centavo (floor vs redondeo spreadsheet). **Todos en verde**.

---

## 7. Roadmap Oficial (IMPROVEMENTS.md)

### ✅ Ya Implementado (MVP)
- Peer scoring estilo Coordinape (`allocateGive`, GIVE_BUDGET=100)
- Certificados impacto estilo Hypercerts (ImpactCert ERC-1155-like al liberar hito)

### Tier 0 — Quick Wins (Horas)
- i18n ES/EN
- Tiempo real viem `watchContractEvent` (reemplazar polling 4s)
- Deploy verificado testnet (Base/OP Sepolia)
- Slither + forge snapshot (gas) + forge coverage en CI
- Responsive mobile + estados carga/vacío

### Tier 1 — Mecanismos Corazón (Impacto Alto)
1. **Quadratic Funding** (pool matching estilo Gitcoin Allo)
2. **Consenso por convicción** (acumulación temporal, decay exponencial)
3. **Distribución lazy + A3 incremental** (escala a millones sin loops O(n))

### Tier 2 — Adopción Masiva (Tesis Central)
4. **Account Abstraction / Gasless** (onboarding desde QR película sin wallet)
5. **ENS + Farcaster Frame** (identidad legible + distribución viral)
6. **Notificaciones** (XMTP / Push Protocol)

### Tier 3 — Arquitectura Escala
7. **Estrategias asignación enchufables** (patrón Allo: RCE, QF, directo, retroactivo)
8. **Subgraph / Indexador** (The Graph / Ponder)
9. **Migrar a EAS canónico** + formato Karma GAP

### Tier 4 — Profundidad IA (Tendencia ETHGlobal)
10. **Agente facilitador autónomo** (monitorea, propone proactivamente, alerta)
11. **Evaluación impacto por IA** (señal legitimidad para QF/RetroPGF)

---

## 8. Comparativa Ecosistema (Por qué WhatMatters)

| Protocolo | Custodia hitos | Reparto auto | Peer-scoring | Cert. impacto | Reputación soulbound |
|-----------|----------------|--------------|--------------|---------------|---------------------|
| Gitcoin QF/Allo | — | — | — | — | — |
| Coordinape | — | ✓ | ✓ | — | — |
| Karma GAP | — | — | — | — | ✓ |
| Hypercerts | — | — | — | ✓ | — |
| **WhatMatters** | **✓** | **✓** | **✓** | **✓** | **✓** |

---

## 9. Decisiones de Diseño Clave (ARCHITECTURE.md)

| Tema | Decisión | Motivo |
|------|----------|--------|
| Frontend wallet | viem puro + modo demo (firma local Anvil) | Demo a prueba de fallos sin MetaMask |
| Atestaciones | Registro propio EAS-compatible | Autocontenido; swap a EAS canónico en testnet |
| Coeficientes RCE | Hardcodeados del Excel | No derivables por fórmula (redondeos prototipo) |
| Distribución | Denominador A3 real, no coeficiente ideal | Garantiza no sobre-distribuir |
| Gobernanza | Consenso por atestaciones | Alternativa a 1 token = 1 voto |
| Liberación fondos | Tramos por hito (estilo Arbitrum) | Confianza financiador vs retroactivo incierto |

---

## 10. Doble Entregable por Desafío

Cada desafío produce **dos outputs** (modelo equipo):
1. 📄 **Propuesta**: documento metas + plan (referenciado por `metaURI`)
2. 💰 **Presupuesto**: hitos con tramos. **RCE compensa el "pensar juntos"**; ejecución requiere financiamiento adicional.

---

## 11. Licencia y Atribución

- **Licencia**: MIT (repositorio GitHub público)
- **Código**: Uso transformativo permitido con atribución
- **Atribución obligatoria**: "Basado en WhatMatters / Protocolo IE por Virginia Barco, David Chaparro et al. (Hackathon Ethereum Uruguay 2026, MIT License)"
- **Conceptos propietarios**: "Inteligencia Exponencial", "Renta Compartida Exponencial", "WhatMatters" — nombres de proyecto, usar términos genéricos en HSCSG (ej: "Protocolo IE", "RCE", "Red Triádica")

---

## 12. Archivos Fuente Referenciados (para FASE 3)

| Archivo | Tipo | Uso en HSCSG |
|---------|------|--------------|
| `RCEMath.sol` | Library | Port TS → `src/core/lib/ie-rce-math.ts` |
| `ProtocolFee.sol` | Library | Port TS → `src/core/lib/ie-protocol-fee.ts` |
| `AttestationRegistry.sol` | Contract | Adaptar → `src/core/lib/ie-attestation.ts` (offline-first) |
| `WhatMatters.sol` | Contract Core | Lógica pura → `src/core/lib/ie-protocol.ts` |
| `RCEMath.t.sol` | Tests | DV tests → `src/core/lib/ie-dv-tests.ts` |
| `rce.ts` | TS Lib | Base → `src/core/lib/ie-rce-calculator.ts` |
| `TreeView.tsx` | React | Adaptar → `src/app/screens/IETreeView.tsx` |
| `RceCalculator.tsx` | React | Adaptar → `src/app/screens/IERCECalculator.tsx` |
| `ChallengeClient.tsx` | React | Adaptar → `src/app/screens/IEChallengeWorkspace.tsx` |
| `AgentPanel.tsx` | React | Adaptar → `src/app/screens/IEAIAgentPanel.tsx` |
| `useChallenge.ts` | Hook | Adaptar → `src/core/state/hooks/ie-protocol.ts` |
| `actions.ts` | Actions | Adaptar → store actions IE |

---

*Backup completado: 2026-11-03 | HSCSG v15 OS | Principio Anfibio*