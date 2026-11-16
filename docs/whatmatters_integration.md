# WhatMatters — Integración HSCSG (Triple Perspectiva)

## 1. Perspectiva Usuario: Qué quiere lograr en su nodo
El usuario (Isaac Ko / WhatMatters) busca materializar una **red de compensación multilateral viva** dentro de su nodo HSCSG/Zeitnus que permita:

- **Desbloquear liquidez real** para pymes, autónomos y familias sin deuda bancaria ni intereses
- **Validar empíricamente** la tasa de compensación efectiva (25-45% en redes calibradas) antes de ir a sandbox bancario
- **Operar bajo el principio anfibio**: misma lógica de compensación opera en modo postmonetario (ZNU/CaaS, offline default) o conectado (USD/USDC vía oráculo priceParity, Nivel 3 ReFi); el render decide la etiqueta, la lógica es agnóstica a la unidad
- **Integrar la gobernanza base-3** (triadas de verificación humana, anti-fraude, RCE) con la malla transaccional hiperbólica (grafo de compensación)
- **Conectar con el ecosistema HSCSG**: ALRAC (CaaS, AUT, ZNU, TQ), Zeitnus (Inteligencia Exponencial, RCE), Virginia Network (red recreativa), red de intercambio federada

**Casos de uso inmediatos en el nodo:**
- Pantalla `/whatmatters` para registrar obligaciones (a quién debo, cuánto, factura)
- Visualización de bucles detectados y propuestas de compensación atómica
- Panel de métricas: tasa compensación, velocidad circulación, liquidez liberada
- Invitación viral a acreedores (K>1) desde la interfaz
- Modo "simulación" (pre-compensación) antes de activar compromisos reales

## 2. Perspectiva LLM: Qué asimilar (lógica pura) y qué extirpar (infra ajena)

### ASIMILAR — Lógica Pura Isomórfica a HSCSG
| Concepto WhatMatters | Módulo HSCSG Target | Mapeo Isomórfico |
|---------------------|---------------------|------------------|
| **Obligación comercial** (deudor, acreedor, monto, factura) | `src/core/state/whatmatters.ts` → `Obligation` | Arista dirigida ponderada `E` en grafo `G=(V,E)` — isomorfo a `Trustlines.creditLine` pero sin emisor central |
| **Ciclo de compensación** (path, clearingAmount, estado) | `ClearingCycle` | Subgrafo ciclo cerrado `A→B→C→A` — isomorfo a `ALRAC.loopEngine` (cierre CDS→OAD→COS→ITC→FRS) |
| **Confirmación atómica 100%** (todos confirman o nada) | `AtomicConfirmation` | Estado machine `PROPOSED→CONFIRMED/EXPIRED` — isomorfo a `ACP.filter` (consenso total o rechazo) |
| **Pre-compensación / Mapeo en sombra** | `ShadowMappingEngine` | Simulación `CycleFinding` sin mutar estado — isomorfo a `AutonomyGuard.shadowMode` |
| **Crecimiento hiperbólico** (combinatoria N choose k, percolación) | `HyperbolicGrowthModel` | `C(N,3)` bucles potenciales — isomorfo a `ALRAC.federatedNodes` (7 holones → 7 experimentos) |
| **Árbol gobernanza base-3** (triadas verificación) | `GovernanceTriad` | Fractal `1→3→9→27` — isomorfo a `ZEITNUS.inteligenciaExponencial` (células base-3) |
| **Malla transaccional** (grafo abierto multidireccional) | `TransactionalMesh` | Grafo hiperbólico `G=(V,E)` — isomorfo a `Trustlines.routing` + `ALRAC.CaaS` |
| **Riesgo cero / Atomicidad** | `ZeroRiskProtocol` | `EXTINGUISHED` solo si 100% confirman — isomorfo a `ALRAC.RAO` (procedencia + permisos + revocación) |
| **Blindaje legal compensación civil** | `LegalComplianceLayer` | Art. 1195 CC / compensación obligaciones recíprocas — isomorfo a `ALRAC.legalSafe` |

### EXTIRPAR — Infraestructura Ajena (No va a HSCSG)
| Componente | Razón | Sustituto HSCSG |
|------------|-------|-----------------|
| PWA build config (Vite, Service Workers) | Infra de despliegue | HSCSG ya tiene Vite + PWA config |
| PostgreSQL / Neo4j / Memgraph | Backend externo | Zustand persist (localStorage) + grafos en memoria (JS/TS puro) |
| Web Push / Twilio / SendGrid | Servicios SaaS | Notificaciones locales + `data-hermes-send` widgets |
| Autenticación OAuth / biométrica | Infra ajena | `seed.ts` identity + `aura.ts` credentials |
| QR code generation lib | Dependencia externa | `qrcode` npm (permitido) o Canvas API nativo |
| Sandbox regulatorio / APIs bancarias | Contexto jurisdiccional | Mock/stub en `whatmatters.ts` para simulación |
| Movie/video production pipeline | Fuera de scope código | Referencia en `docs/` + link externo |

## 3. Perspectiva HSCSG + CaaS: Isomorfismo con Leyes I/II/III + CaaS

### Ley I — No dañar base material / personas
- **WhatMatters:** Compensación extingue deudas sin crear nueva deuda, sin intereses extractivos, sin retener valor
- **HSCSG:** `materialBalance.ts` — conservación de valor real (bienes/servicios/capacidad trabajo) vs. medio de pago catalizador
- **Mapeo:** `Obligation.amount` = valor real entregado; `ClearingCycle.clearingAmount` = valor extinguido; **nunca** se crea `amount` nuevo

### Ley II — Ganarse la vida soberanizando (AUT × CDS)
- **WhatMatters:** Cada participante soberaniza su capital de trabajo; AUT = capacidad de compensar sin liquidez externa; CDS = densidad de bucles cerrados en su triada/entorno
- **HSCSG:** `caas.ts` (AUT/CDS), `sovereignCredit.ts` (crédito mutuo sin emisor central)
- **Mapeo:** `HyperbolicGrowthModel.percolationThreshold` = umbral donde AUT colectivo > 1; `GovernanceTriad` = CDS local verificable

### Ley III — Lucidez, nunca engañar
- **WhatMatters:** Transparencia Radical — datos enmascarados hasta confirmación atómica; validación simétrica bilateral; trazabilidad inmutable
- **HSCSG:** `lucidez_material.ts` (Modo Lucidez), `evidence.ts` (EBD), `aura.ts` (verificación procedencia)
- **Mapeo:** `ShadowMappingEngine` = modo solo-lectura (lucidez algorítmica); `AtomicConfirmation` = verificación simétrica (lucidez contractual)

### CaaS — Comunidad como Servicio (Acceso por contribución real)
- **WhatMatters:** Entrada = registrar obligaciones reales (contribución contable); Salida = liquidez liberada (servicio)
- **HSCSG:** `caas.ts` — `contributionScore` → `accessLevel`; `tq.ts` (Time Quality / trabajo verificado)
- **Mapeo:** 
  - `Obligation` registrada + `Invoice` validada = `contributionScore += 1`
  - `ClearingCycle.EXTINGUISHED` = `tqCredits += clearingAmount * velocityFactor`
  - `GovernanceTriad` participación = `accessLevel` para RCE (Renta Compartida Exponencial)

### Arquitectura Bicapa WhatMatters ↔ HSCSG
```
┌─────────────────────────────────────────────────────────────┐
│  CAPA 1: GOBERNANZA BASE-3 (ZEITNUS / ALRAC)               │
│  src/core/state/governanceTriad.ts + src/core/lib/...       │
│  - Triadas verificación humana (anti-fraude)               │
│  - RCE distribution                                         │
│  - Inteligencia Exponencial (síntesis futura)              │
└──────────────────────────┬──────────────────────────────────┘
                           │ Trust Events / Verification
┌──────────────────────────▼──────────────────────────────────┐
│  CAPA 2: MALLA TRANSACCIONAL HIPERBÓLICA (WHATMATTERS)      │
│  src/core/state/whatmatters.ts + src/core/lib/whatmatters.ts│
│  - Grafo G=(V,E) obligaciones                              │
│  - CycleFinding (Johnson/Tarjan k=3..5)                    │
│  - AtomicConfirmation (100% o nada)                        │
│  - ShadowMapping (pre-compensación)                        │
└─────────────────────────────────────────────────────────────┘
```

### Vasos Comunicantes Cross-Repo Obligatorios
| WhatMatters | HSCSG Module | Vaso Comunicante |
|-------------|--------------|------------------|
| `Obligation` | `trustlines.ts` (creditLine) | `[src/core/state/whatmatters.ts:L45]` ↔ `[src/core/state/trustlines.ts:L30]` |
| `ClearingCycle` | `alrac.ts` (loopEngine) | `[src/core/lib/whatmatters.ts:findCycles]` ↔ `[src/core/lib/alrac.ts:executeLoop]` |
| `GovernanceTriad` | `zeitnus.ts` (inteligenciaExponencial) | `[src/core/state/governanceTriad.ts]` ↔ `[src/core/state/zeitnus.ts]` |
| `HyperbolicGrowth` | `alrac.ts` (federatedNodes) | `[src/core/lib/whatmatters.ts:percolation]` ↔ `[src/core/lib/alrac.ts:gnapSync]` |
| `ZeroRiskProtocol` | `acp.ts` (filter) | `[src/core/lib/whatmatters.ts:atomicConfirm]` ↔ `[src/core/lib/acp.ts:filter]` |
| `LegalCompliance` | `alrac.ts` (legalSafe) | `[docs/whatmatters_integration.md#legal]` ↔ `[docs/alrac_integration_technical.md]` |

### Decisiones EBD (Evidence-Based Design) Aplicadas
| D# | Decisión WhatMatters | Evidencia Primaria | Módulo Afectado |
|----|---------------------|-------------------|-----------------|
| D1 | Entrada mínima: solo pasivos ("a quién debo") | Conversación: reduce fricción cognitiva a cero | `whatmatters.ts` `ObligationInput` |
| D2 | Ciclos 3-5 nodos (no bucles largos) | NP-completo evita; alta prob. confirmación | `CycleFinding.maxDepth=5` |
| D3 | Confirmación atómica 100% (riesgo cero) | Conversación: "o se extingue ciclo completo o no se mueve nada" | `AtomicConfirmation.stateMachine` |
| D4 | Pre-compensación (shadow) antes de compromiso | Conversación: "simulación previa → revelación valor → activación umbral" | `ShadowMappingEngine` |
| D5 | Base-3 gobernanza + Hiperbólico transaccional | Conversación: "dos capas indispensables: árbol + malla" | `GovernanceTriad` + `TransactionalMesh` |
| D6 | Anfibio: postmonetario (ZNU) / conectado (USD) | Principio diseño HSCSG: "mismo cálculo, render decide etiqueta" | `valueDual.ts` + `nodeMode/priceParity` |
| D7 | Inclusión personas físicas vía pasivos familiares | Conversación: alquiler, odontólogo, taller, no nómina directa | `PersonObligation` extends `Obligation` |
| D8 | Blindaje legal: compensación civil Art. 1195 CC | Conversación: "no intermediación financiera, no captación depósitos" | `LegalComplianceLayer` |

### KPIs de Validación (Tests Obligatorios)
| Módulo | KPI Mínimo | Test File |
|--------|------------|-----------|
| `CycleFinding` | Detecta 100% ciclos 3-nodos en grafo denso 100 nodos | `whatmatters.test.ts` |
| `AtomicConfirmation` | 0 saldos alterados si 1 rechazo / timeout | `whatmatters.test.ts` |
| `ShadowMapping` | Simulación idéntica a ejecución real (solo lectura) | `whatmatters.test.ts` |
| `HyperbolicGrowth` | C(N,3) calculado correctamente para N=10..1000 | `whatmatters.test.ts` |
| `GovernanceTriad` | Verificación triada bloquea obligación sin factura | `governanceTriad.test.ts` |
| `ValueDual` | Mismo `clearingAmount` render ZNU vs USD (priceParity=1) | `whatmatters.test.ts` |

---

## Plan de Implementación en Marca-Blanca (Fase 3)

### Archivos a Crear/Modificar
```
src/core/state/whatmatters.ts          # Tipos + makeWhatMattersState()
src/core/lib/whatmatters.ts            # Lógica pura: CycleFinding, AtomicConfirmation, ShadowMapping, HyperbolicGrowth
src/core/lib/governanceTriad.ts        # Lógica triadas base-3 (verificación, RCE)
src/core/state/governanceTriad.ts      # Tipos triada
src/core/state/store.ts                # + whatmatters, + governanceTriad, actions, resetAll, partialize
src/app/screens/WhatMatters.tsx        # Pantalla PWA: registro obligaciones, bucles, métricas, QR
src/app/layout/Aside.tsx               # + icono lucide (GitBranch o Network) + item nav
src/app/App.tsx                        # + Route path="whatmatters"
docs/whatmatters_integration.md        # ESTE ARCHIVO
docs/whatmatters_backup.md             # YA CREADO
```

### Icono Lucide Válido
- **GitBranch** — representa ramificación/bifurcación/redes (grafo)
- **Network** — red de nodos conectados
- **Merge** — convergencia/compensaación
- **Circle** — ciclos cerrados

### i18n (ES/EN/PT — 150+ claves mínimas)
Claves base: `whatmatters.title`, `whatmatters.registerObligation`, `whatmatters.detectedCycles`, `whatmatters.atomicConfirm`, `whatmatters.clearingAmount`, `whatmatters.shadowMode`, `whatmatters.governanceTriad`, `whatmatters.hyperbolicGrowth`, `whatmatters.liquidityFreed`, `whatmatters.inviteCreditor`, `whatmatters.legalNotice`, `whatmatters.postmonetaryMode`, `whatmatters.connectedMode`, `whatmatters.priceParity`

---

## Verificación Pre-Entrega (Fase 4)
```bash
cd /c/Users/Isaacko0/Documents/repo_marca_blanca
npx tsc --noEmit            # 0 errores
npm run build               # build OK
npm run preview &           # HTTP 200 en /whatmatters
npx vitest run              # 100% pass (incluye whatmatters.test.ts)
```