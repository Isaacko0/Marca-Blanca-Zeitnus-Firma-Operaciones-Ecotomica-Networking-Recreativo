---
name: whatmatters-ie-protocol
description: Use when asimilando Protocolo Inteligencia Exponencial (IE) + Renta Compartida Exponencial (RCE) de WhatMatters en HSCSG v15 OS. Implementa red triádica 3→2, matemática RCE canónica, consenso por atestaciones, staking, peer scoring GIVE, facilitador IA, certificados impacto.
category: agency
---

# WhatMatters IE Protocol — Skill Auto-Ejecutable

**Fuente**: GitHub `dav1dchaparro/whatmatters` (MIT License) + Hackathon Ethereum Uruguay 2026  
**Versión**: 1.0 | **Fecha**: 2026-11-03 | **HSCSG v15 OS**

---

## 🎯 Objetivo

Asimilar el **Protocolo Inteligencia Exponencial (IE)** completo como módulo anfibio en HSCSG v15 OS:
- Red fractal triádica (3 semillas → ×3 por nivel → 3.4B en nivel 20)
- Renta Compartida Exponencial (RCE) con matemática canónica calibrada vs prototipo ($288,008 → 1 RCE = $1,000.03 en L5)
- Consenso por atestaciones soulbound (no 1 token = 1 voto)
- Staking (peso efectivo +1 per 1000 USDC, max +6)
- Peer scoring GIVE (estilo Coordinape, +1 per 20 GIVE, max +5)
- Facilitador IA human-in-the-loop (sintetiza + propone + redacta informe)
- Certificados impacto (Hypercert-style) al liberar hitos
- Comisión regresiva protocolo (10% → 1%)

---

## 📋 FASES HSCSG v15 OS

### FASE 0: Backup ✅
- Repo backup: `~/Marca-Blanca-Zeitnus-Firma-Operaciones-Ecotomica-Networking-Recreativo_BACKUP_20261029_164943`

### FASE 1: Backup Document ✅
- `docs/whatmatters_ie_backup.md` — Análisis exhaustivo (arquitectura, contratos, frontend, tests, roadmap)

### FASE 2: Integration Document ✅
- `docs/whatmatters_ie_integration.md` — Especificación completa FASE 3 (tipos, lógica, estado, pantallas, nav, i18n, OpenSpec, tests)

### FASE 3: Implementación Módulo (PENDIENTE)
Ver **Estructura de Archivos** abajo.

### FASE 4: Validación (PENDIENTE)
- DV Tests: 7/7 calibración prototipo WhatMatters
- TypeScript clean: `npx tsc --noEmit`
- E2E: flujo completo crear→fund→seed→join→contribute→approve→release→claim

---

## 🧱 Estructura de Archivos FASE 3

### Core Libraries (Lógica Pura)
```
src/core/lib/ie-constants.ts           # Coeficientes canónicos, pesos, límites, fee tiers
src/core/lib/ie-rce-math.ts            # Port TS exacto RCEMath.sol (calculadora)
src/core/lib/ie-protocol-fee.ts        # Port TS exacto ProtocolFee.sol
src/core/lib/ie-types.ts               # Types: IEChallenge, IEPosition, IEMilestone, IEAttestation, IMImpactCert
src/core/lib/ie-attestation.ts         # Registro atestaciones offline-first (EAS-compatible)
src/core/lib/ie-protocol.ts            # Lógica pura: árbol, consenso, distribución, staking, GIVE
src/core/lib/ie-dv-tests.ts            # Tests DV deterministas (calibración prototipo)
```

### Estado (Zustand)
```
src/core/state/ie-protocol.ts          # INITIAL_STATE, achievements, storage keys
src/core/state/hooks/ie-protocol.ts    # Store completo: actions + selectors + persistence
```

### Pantallas (React/TSX)
```
src/app/screens/IEChallengeDashboard.tsx      # Dashboard desafíos (lista, crear, KPIs)
src/app/screens/IEChallengeWorkspace.tsx      # Vista árbol + hitos + mi estado + IA
src/app/screens/IETreeView.tsx                # Visualizador árbol triádico SVG
src/app/screens/IERCECalculator.tsx           # Calculadora RCE inversa (client-side)
src/app/screens/IEAIAgentPanel.tsx            # Facilitador IA consenso
src/app/screens/IEMilestoneTimeline.tsx       # Línea tiempo hitos con progreso
src/app/screens/IECertificates.tsx            # Certificados impacto + reputación
src/app/screens/IESimulation.tsx              # Simulador crecimiento IE + proyección RCE
```

### Integración Repo
```
src/core/state/store.ts               # + slice ieProtocol, actions, partialize, initialState
src/app/layout/Aside.tsx              # + nav items: ieProtocol, ieCalculator, ieCertificates
src/core/lib/i18n.ts                  # + claves ES/EN/PT (nav, titles, labels, tooltips)
openspec/specs/ie-protocol/openapi.yaml  # API especificación para agentes
```

---

## ⚙️ Funciones DV (Deterministic Verification)

### 7 Tests Obligatorios (Calibración Prototipo WhatMatters)

| Test | Descripción | Tolerancia |
|------|-------------|------------|
| `dvTestPhysicalPersons` | 3^1=3, 3^5=243, 3^10=59049, 3^21=10460353203 | Exacto |
| `dvTestPositionsTotal` | (3^(n+1)-3)/2: L1=3, L5=363, L10=88572 | Exacto |
| `dvTestOneRceMatchesPrototype` | 1 RCE en centavos: L1=9600267, L5=100003, L10=416 | ±1 centavo |
| `dvTestWeightClassesLevel5` | full=100002¢, low=66668¢, mid=33334¢ (floor) | ±1 centavo |
| `dvTestConservation` | Σ payouts = tramo (sin sobre-distribuir) | Exacto |
| `dvTestFeeSchedule` | Comisión regresiva: ≤10k=10%, ≤100k=7%, ≤1M=4%, ≤10M=2%, >10M=1% | Exacto |
| `dvTestStakingGiveBonuses` | Stake bonus cap 6, Give bonus cap 5 | Exacto |

**Ejecución**: `npm run test:ie-dv` (sin blockchain, sin red, determinista)

---

## 🔗 Vasos Comunicantes (Integración HSCSG)

| Módulo WhatMatters | → HSCSG Module | Vaso Comunicante |
|-------------------|----------------|------------------|
| Protocolo IE (3→2) | `virginia.network` | `virginia.ieProtocol` |
| Árbol triádico | `virginia.tree` | `virginia.coordinationTree` |
| RCE Math | `rbe.rceMath` | `rbe.distributeRCE` |
| Comisión regresiva | `caas.protocolFee` | `caas.regressiveFee` |
| Atestaciones soulbound | `poh.verification` | `poh.attestContribution` |
| Staking peso efectivo | `caas.staking` | `caas.stakeBonusWeight` |
| Peer scoring GIVE | `caas.peerScoring` | `caas.giveAllocation` |
| Facilitador IA | `contenido.captureIdea` + `story.engine` | `createStoryProject` + `synthesizeConsensus` |
| Certificados impacto | `integral.hypercerts` | `integral.impactCertMint` |
| Calculadora RCE | `rbe.calculator` | `rbe.rceTable` |

---

## 🐸 Principio Anfibio

| Modo | Financiamiento | Distribución | Verificación | Gobernanza |
|------|----------------|--------------|--------------|------------|
| **Postmonetario** | CaaS streams (ZNU, AUT revenue share) | RCE en ZNU, CaaS payouts | IA local + auditoría humana local | CDS 1a1v + expertise, mandatos revocables |
| **Conectado** | USDC/USDT + green bonds + land value capture | USD/USDC via `priceParity` oráculo ReFi N3 | IA cloud + auditoría remota + blockchain tx | CDS + verificación on-chain (Poh/RAO) |

**Puente**: `priceParity` oráculo ReFi Nivel 3 (ZNU ↔ USD/USDC)  
**Config**: `nodeMode` en store + `IEFundingConfig.mode`

---

## 🧪 Comando de Validación Rápida

```bash
# 1. Types check
npx tsc --noEmit

# 2. DV Tests (7 tests calibración)
npm run test:ie-dv

# 3. Unit tests
npm run test:unit -- --testPathPattern=ie-

# 4. E2E smoke test
npm run test:e2e -- --grep="IE Protocol"
```

---

## 📝 Checklist Implementación

### Core Libraries
- [ ] `ie-constants.ts` — Coeficientes, pesos, fee tiers, esquemas
- [ ] `ie-rce-math.ts` — physicalPersons, positionsTotal, coefficient, oneRce, payout, rceTable, format
- [ ] `ie-protocol-fee.ts` — feeBps, split
- [ ] `ie-types.ts` — IEChallenge, IEPosition, IEMilestone, IEAttestation, IMImpactCert, IEProtocolState
- [ ] `ie-attestation.ts` — createAttestation, revoke, getReceived, reputationScore
- [ ] `ie-protocol.ts` — createPosition, canJoin, weightClass, stakeBonus, giveBonus, effectiveWeight, canApprove, calculateA3, calculatePayouts, validateTree, conservationCheck, simulateGrowth
- [ ] `ie-dv-tests.ts` — 7 DV tests + runAllDVTests()

### Estado Zustand
- [ ] `ie-protocol.ts` (state) — INITIAL_STATE, achievements, storage keys
- [ ] `hooks/ie-protocol.ts` — createChallenge, fund, seed, join, setCoordinator, contribute, approve, release, claim, stake, unstake, allocateGive, synthesizeConsensus, generateReport, selectors, persistence, migration

### Pantallas
- [ ] `IEChallengeDashboard.tsx` — Lista, crear, KPIs, filtros
- [ ] `IEChallengeWorkspace.tsx` — Header KPIs, TreeView izquierdo, panel derecho, hitos, IA, mi estado
- [ ] `IETreeView.tsx` — SVG Reingold-Tilford, compact mode, colores, coordinador, GIVE arcs, payout pulse
- [ ] `IERCECalculator.tsx` — Input fondo+niveles, presets, tabla, highlight L5, 100% client-side
- [ ] `IEAIAgentPanel.tsx` — Textarea, sintetizar/informe, resultado badge+summary+rationale+questions, modo stub
- [ ] `IEMilestoneTimeline.tsx` — Progreso consenso, botón aprobar, estado released
- [ ] `IECertificates.tsx` — Grid ImpactCerts, atestaciones por schema, reputation score
- [ ] `IESimulation.tsx` — Inputs semillas/nivel/fondo, tabla crecimiento, gráfico 3^n, proyección RCE

### Integración
- [ ] `store.ts` — slice ieProtocol, actions, partialize, initialState
- [ ] `Aside.tsx` — nav items: ieProtocol (GitBranch, cyan), ieCalculator (Calculator, emerald), ieCertificates (Award, amber)
- [ ] `i18n.ts` — 50+ claves ES/EN/PT
- [ ] `openspec/specs/ie-protocol/openapi.yaml` — API completa

### Tests
- [ ] DV tests 7/7 pass
- [ ] Unit tests >90% coverage funciones puras
- [ ] E2E: flujo completo + calculadora + árbol render

---

## ⚠️ Pitfalls Conocidos (del repo original)

1. **Coeficientes no derivables** — Hardcodeados del Excel prototipo (redondeos no reversibles). Documentar y testear.
2. **Distribución O(n)** — `currentA3` recorre todas las posiciones. Para árboles grandes → lazy distribution + A3 incremental (Fase 2).
3. **Modo stub IA obligatorio** — Sin `ANTHROPIC_API_KEY` usa heurística local. Nunca romper demo.
4. **Atestaciones offline-first** — localStorage + sync opcional. No depender de EAS canónico en MVP.
5. **Staking/GIVE gaming** — Requiere Poh verificado para entrar. Roadmap: World ID / identidad estatal.
6. **Polvo redondeo** → treasury. Verificar conservation test: Σ pagos = tramo.
7. **Clase peso asignación** — Regla: seed/coordinator=Alta, hoja=Baja, intermedia=Media. Calibrar con equipo.

---

## 📚 Referencias

- **Repo**: https://github.com/dav1dchaparro/whatmatters (MIT)
- **PDF**: WhatMatters_Entrega_Final_2026.pdf
- **Video**: https://www.youtube.com/watch?v=-atoASIq_Gw (Virginia Barco)
- **Web**: https://www.whatmatters.pro/
- **Buidl**: https://dorahacks.io/buidl/47193
- **Arquitectura**: ARCHITECTURE.md, PITCH.md, PLAN.md, IMPROVEMENTS.md

---

## 🏁 Criterio Done

- [ ] `npx tsc --noEmit` → 0 errores (solo pre-existing unrelated)
- [ ] `npm run test:ie-dv` → 7/7 tests PASS
- [ ] Navegación a `/ie-protocol`, `/ie-calculator`, `/ie-certificates` funcional
- [ ] Flujo completo demo: crear → fund → seed x3 → join → contribute → approve → release → claim
- [ ] Calculadora RCE reproduce prototipo exacto ($288,008 L5 = $1,000.03)
- [ ] Árbol renderiza 1000+ nodos @60fps
- [ ] IA Panel modo stub funciona sin API key
- [ ] Persistencia localStorage + migración v1→v2
- [ ] OpenSpec válido (swagger-codegen compatible)

---

*Skill v1.0 | HSCSG v15 OS | Principio Anfibio | MIT License (transformativo)*