---
name: hscsg-unification-master-plan
description: Plan maestro quirúrgico para unificación completa HSCSG v15 OS — limpieza PSG, módulos core, UI, GNAP, verificación CI. Usar cuando necesites ejecutar la unificación total del codebase HSCSG.
category: devops
---

# HSCSG v15 OS — Plan Maestro Unificación Completa

**Objetivo:** `tsc --noEmit = 0` + `build OK` + `curl 200` en 11 rutas + 7 agentes GNAP heartbeat activo

---

## RESUMEN EJECUTIVO

| Métrica | Target |
|---------|--------|
| `tsc --noEmit` | **0 errores** (solo warnings pre-existentes) |
| `npm run build` | **Exit code 0** |
| Rutas 200 OK | **11/11** |
| Agentes GNAP | **7** con heartbeat |
| Specs OpenSpec | **13** PVL compliant |
| Módulos integrados | **11** (alrac, tq, cpp, znu, samay, colonya, feria, clc, ruddick, solarpunk, mweria) |

---

## FASE 0: LIMPIEZA QUIRÚRGICA (Día 1-2) — *PRERREQUISITO INDISPENSABLE*

```bash
# 0.1 Excisión PSG (proyecto parasito que contradice filosofía)
rm /c/Users/Isaacko0/Zeitnus-Firma-Operaciones-Ecotomica/CONCLUSIONES_PSG.md

# 0.2 Limpieza documento principal (BRIEF_EXHAUSTIVO)
# Editar: BRIEF_EXHAUSTIVO_HSCSG_COSATECA_OS.md
# - Eliminar líneas: 50 (Micro-SaaS), 403 (ICOs), 662 (Micro-SaaS), 1035 (Fase 0 Micro-SaaS)
# - Eliminar líneas: 1088-1090 (Revenue Demo USDC, Patrocinios ESG)
# - Eliminar línea 1403: scale7_equity
# - Reescribir tabla línea 1800: quitar "Cloud SaaS" columna
# - Reemplazar "Revenue Demo chunks USDC" → "Demostración Soberanía chunks ZNU"

# 0.3 Archivar exploraciones previas
mkdir -p docs/archived/{saas-explorations,tokenomics-experiments,external-repos}
mv berryvesting_*.md awesome_opc_backup.md anthropics_commerce-agents_backup.md aurora_gov_backup.md docs/archived/
mv CONCLUSIONES_PSG.md docs/archived/psg-experiment/ 2>/dev/null || true

# 0.4 Verificar limpieza
cd /c/Users/Isaacko0/Zeitnus-Firma-Operaciones-Ecotomica
npx tsc --noEmit 2>&1 | grep -E "(error|Error)" | head -20
```

**Criterio de salida:** `tsc --noEmit` solo muestra errores pre-existentes (guided_autonomous, nieves-*, mma_engine), **ninguno nuevo por limpieza**.

---

## FASE 1: COMPLETAR MÓDULOS CORE FALTANTES (Día 3-7)

### 1.1 Crear `src/core/state/<modulo>.ts` para cada proyecto asimilado

```typescript
// Plantilla estándar para cada estado:
/c/Users/Isaacko0/Zeitnus-Firma-Operaciones-Ecotomica/src/core/state/

├── alrac.ts          # Ya existe (en alrac.ts types)
├── tq.ts             # ← CREAR: export interface TQState { network: TQNetwork; accounts: Map<DID, TQAccount>; ... }
├── cpp.ts            # ← CREAR: export interface CPPState { pools: CPPPool[]; bridgeConfig: CPPBridgeConfig; ... }
├── znu.ts            # ← CREAR: export interface ZNUState { vestings: ZNUVesting[]; creditCapacity: Map<DID, bigint>; ... }
├── samay.ts          # ← CREAR: export interface SamayState { node: SamayNode; pillars: SamayPillar[]; ... }
├── colonya.ts        # ← CREAR: export interface ColoniaState { node: ColoniaNode; residents: Map<DID, ColoniaResident>; ... }
├── feria.ts          # ← CREAR: export interface FeriaState { node: ALRACNode; pools: CPPPool[]; ... }
├── clc.ts            # ← CREAR: export interface CLCState { node: ALRACNode; pools: CPPPool[]; measurementEngine: MeasurementEngine; ... }
├── ruddick.ts        # ← CREAR: export interface RuddickState { node: SamayNode; mweriaPools: TrustBasket[]; ... }
```

### 1.2 Actualizar `src/core/state/store.ts` — **PUNTO CRÍTICO**

```typescript
// En store.ts: importar todos los estados + crear slices + persist + resetAll

// Imports
import type { TQState } from './tq';
import type { CPPState } from './cpp';
import type { ZNUState } from './znu';
import type { SamayState } from './samay';
import type { ColoniaState } from './colonya';
import type { FeriaState } from './feria';
import type { CLCState } from './clc';
import type { RuddickState } from './ruddick';

// En interface AppState:
interface AppState {
  // ... existentes
  tq: TQState;
  cpp: CPPState;
  znu: ZNUState;
  samay: SamayState;
  colonya: ColoniaState;
  feria: FeriaState;
  clc: CLCState;
  ruddick: RuddickState;
  // ...
}

// En create(): inicializar cada slice con make<Modulo>State()
// En resetAll(): resetear cada slice
// En partialize: (state) => ({ ..., tq: state.tq, cpp: state.cpp, ... })
```

### 1.3 Extender `src/core/lib/alrac.ts` con tipos faltantes

```typescript
// Añadir al final de alrac.ts (antes de factory functions):

// === TIPOS CLC/CPP EXTENDIDOS ===
export interface MeasurementEngine { ... }  // de cosmolocal_integration.md
export interface FederationProtocol { ... }  // de cosmolocal_integration.md
export interface CosmoLocalPrinciple { ... }  // ya existe

// === TIPOS RUDDICK/GEF ===
export interface MweriaConfig { ... }
export interface KayaGovernance { ... }
export interface TrustBasketConfig { ... }
export interface PollinatorRebellionConfig { ... }
export interface OfflineFirstPrinciple { ... }

// === FACTORY FUNCTIONS FALTANTES ===
export function createCLCNode(): ALRACNode { ... }  // ya en cosmolocal_integration.md
export function createGEFNode(): ALRACNode { ... }  // NEW: nodo GEF Kilifi
export function createSolarpunkNode(): ALRACNode { ... }  // NEW: nodo Solarpunk mesh
```

---

## FASE 2: CREAR MÓDULOS RUDDICK/GEF (Día 8-12)

### 2.1 Archivos nuevos en `src/core/lib/`

| Archivo | Basado en | Función clave |
|---------|-----------|---------------|
| `mweria.ts` | `ruddick_integration.md` §5 | `createMweriaPool()`, `cycleCommitments()`, `calculateEquilibrium()` |
| `kaya.ts` | `ruddick_integration.md` §5 | `createKayaGovernance()`, `heartPump()`, `spiritResolve()` |
| `trustBasket.ts` | `ruddick_integration.md` §5 | `curate()`, `evaluate()`, `limit()`, `exchange()` |
| `protocolFunctions.ts` | `ruddick_integration.md` §5 | 4 funciones puras: curate, evaluate, limit, exchange |
| `mutualCreditBootstrap.ts` | `ruddick_integration.md` §5 | `magicCoinsSoup()`, `seedMutualCredit()`, `recoverCoins()` |
| `communityCircles.ts` | `ruddick_integration.md` §5 | `talkingStick()`, `mediate()`, `formalize()` |
| `patientCapital.ts` | `ruddick_integration.md` §5 | `waqfLoan()`, `reputationScore()`, `znuVestingSchedule()` |
| `pollinatorRebellion.ts` | `ruddick_integration.md` §5 | `federateBioregions()`, `crossPollinate()` |
| `offlineFirstPrinciple.ts` | `ruddick_integration.md` §5 | `toAnalog()`, `toDigital()`, `meshSync()` |
| `ruddick.ts` | `ruddick_integration.md` | Integración completa: `createGEFNode()`, types export |

### 2.2 Specs OpenSpec correspondientes

```bash
# Crear en openspec/specs/
ruddick-economiadelasraices.md    # Spec canónica libro → ALRAC
mweria-protocol.md               # Protocolo mweria offline-first
kaya-governance.md               # Gobernanza kaya (corazón+espíritu)
trust-basket.md                  # Canasto confianza (4 funciones)
magic-coins-soup.md              # Bootstrap crédito mutuo
```

---

## FASE 3: COMPLETAR MÓDULOS CLC/CPP (Día 13-15)

### 3.1 Extender `src/core/lib/cpp.ts`

```typescript
// Añadir al final de cpp.ts:

// SwapEngine (offline-first TypeScript)
export class SwapEngine {
  inventory: Map<string, bigint>;
  executeDirectSwap(fromAsset, toAsset, amount): SwapResult;
  calculateFees(amount): FeeBreakdown;
  settleSwap(swap): Settlement;
}

// ValuationModule trait
export interface ValuationModule {
  getQuote(fromAsset, toAsset, amount): Quote;
  updateRates(rates: Map<string, ConversionFactor>): void;
}

// Implementaciones
export class DecimalQuoter implements ValuationModule { ... }
export class RelativeQuoter implements ValuationModule { ... }
export class OracleQuoter implements ValuationModule { ... }

// MeasurementEngine (Appendices A-C CLC)
export class MeasurementEngine {
  trackEvents(O, X, P, F, G): void;
  calculateCohortMeasures(): CohortMeasure[];
  calculateVelocity(): { V_commit: number; V_swap: number };
  generateKPIReport(): KPIReport[];
}
```

### 3.2 Spec bridge CLC

```bash
openspec/specs/clc-cpp-integration.md  # Bridge CLC v0.8 → ALRAC Capa 2
```

---

## FASE 4: PANTALLAS UI + NAVEGACIÓN (Día 16-19)

### 4.1 Pantallas faltantes

| Pantalla | Archivo | Tabs | Icono |
|----------|---------|------|-------|
| **ALRAC Core** | `ALRAC.tsx` | Epistémica \| Normativa \| Contable \| Interop \| Fiat | `Layers` |
| **CPP/Interop** | `CPPInterop.tsx` | Pools \| Compromisos \| Exchange \| Exposure \| Federación | `GitBranch` |
| **TQ/Contable** | `TQAccounting.tsx` | Red TQ \| Demurrage \| Rotación \| Velocity \| Bridge CPP | `Zap` |
| **Zeitnus/Fiat** | `Zeitnus.tsx` | Coop \| Nómina \| Tierra \| Banco \| PriceParity | `Banknote` |
| **Samay** | `Samay.tsx` | Mweria \| Kaya \| Canasto \| Protocolos \| Digital \| Mañana | `Sprout` |
| **Feria Conuquera** | `FeriaConuquera.tsx` | Mercado \| TQ/Trueque \| Gobernanza \| Educación \| Red | `Store` |
| **+Colonia** | `Colonia.tsx` | Masterplan \| Energía \| Innovación \| Comunidad \| Gobernanza \| Inversión | `Map` |
| **CLC/CPP** | `CLCInterop.tsx` | Market \| Pools \| Swaps \| Measurement \| Governance | `Globe` |
| **Ruddick/GEF** | `RuddickEconomics.tsx` | Mweria \| Kaya \| Canasto \| Protocolos \| Digital \| Mañana | `Heart` |
| **Solarpunk Mesh** | `SolarpunkMesh.tsx` | Nodos DTN \| Mesh \| Energy \| Mesh Apps \| Federation | `Wifi` |

### 4.2 Actualizar navegación

```typescript
// src/app/layout/Aside.tsx
// Añadir al array navItems:
{ key: 'alrac', label: 'ALRAC', icon: Layers, color: 'violet', path: '/alrac' },
{ key: 'cpp', label: 'CPP/Interop', icon: GitBranch, color: 'cyan', path: '/cpp' },
{ key: 'tq', label: 'TQ/Contable', icon: Zap, color: 'amber', path: '/tq' },
{ key: 'zeitnus', label: 'Zeitnus', icon: Banknote, color: 'green', path: '/zeitnus' },
{ key: 'samay', label: 'Samay', icon: Sprout, color: 'blue', path: '/samay' },
{ key: 'feria', label: 'Feria Conuquera', icon: Store, color: 'orange', path: '/feria' },
{ key: 'colonya', label: '+Colonia', icon: Map, color: 'emerald', path: '/colonya' },
{ key: 'clc', label: 'CLC/CPP', icon: Globe, color: 'indigo', path: '/clc' },
{ key: 'ruddick', label: 'GEF/Ruddick', icon: Heart, color: 'red', path: '/ruddick' },
{ key: 'solarpunk', label: 'Solarpunk Mesh', icon: Wifi, color: 'teal', path: '/solarpunk' },

// src/core/lib/i18n.ts - añadir keys ES/EN/PT para todas
```

### 4.3 Rutas en `src/app/App.tsx`

```tsx
<Route path="/alrac" element={<ALRAC />} />
<Route path="/cpp" element={<CPPInterop />} />
<Route path="/tq" element={<TQAccounting />} />
<Route path="/zeitnus" element={<Zeitnus />} />
<Route path="/samay" element={<Samay />} />
<Route path="/feria" element={<FeriaConuquera />} />
<Route path="/colonya" element={<Colonia />} />
<Route path="/clc" element={<CLCInterop />} />
<Route path="/ruddick" element={<RuddickEconomics />} />
<Route path="/solarpunk" element={<SolarpunkMesh />} />
```

---

## FASE 5: REGISTRO GNAP + AGENTES (Día 20)

### 5.1 Crear `.gnap/agents.json`

```json
{
  "agents": [
    { "did": "did:key:alrac-core", "name": "ALRAC Core", "repo": "hscsg", "capabilities": ["gamma_carmis", "triaxial_verification", "caas", "skill_credential", "gnap_orchestration"], "status": "active", "lastHeartbeat": 0 },
    { "did": "did:key:feria-conuquera-caracas", "name": "Feria Conuquera", "repo": "feria", "capabilities": ["tq_network", "cpp_pool", "assembly_governance"], "status": "active", "lastHeartbeat": 0 },
    { "did": "did:key:colonya-uy", "name": "+Colonia", "repo": "colonia", "capabilities": ["tq_network", "cpp_pool", "energy_catalog", "land_trust", "znu_credit"], "status": "active", "lastHeartbeat": 0 },
    { "did": "did:key:samay-ec", "name": "Samay Permacultura", "repo": "samay", "capabilities": ["mweria_network", "kaya_governance", "trust_basket", "water_design"], "status": "active", "lastHeartbeat": 0 },
    { "did": "did:key:clc-gef", "name": "Cosmo-Local Credit (GEF)", "repo": "clc", "capabilities": ["cpp_protocol", "swap_engine", "valuation_module", "measurement_engine"], "status": "active", "lastHeartbeat": 0 },
    { "did": "did:key:gef-kilifi", "name": "Grassroots Economics Foundation", "repo": "gef", "capabilities": ["mweria_network", "kaya_governance", "trust_basket", "community_circles"], "status": "active", "lastHeartbeat": 0 },
    { "did": "did:key:solarpunk-mesh", "name": "Solarpunk Mesh Network", "repo": "solarpunk", "capabilities": ["mesh_protocol", "dtn_bundle", "energy_catalog", "offline_first"], "status": "active", "lastHeartbeat": 0 }
  ]
}
```

### 5.2 Task Chains GNAP (cross-border)

```json
// .gnap/taskchains.json
{
  "taskChains": [
    { "id": "feria_colonia_alimentos", "name": "Cross-border Alimentos", "steps": [...] },
    { "id": "samay_feria_semillas", "name": "Semillas Criollas Andes-Caribe", "steps": [...] },
    { "id": "clc_federation", "name": "CLC Federation Sync", "steps": [...] },
    { "id": "pollinator_rebellion", "name": "Pollinator Rebellion Sync", "steps": [...] }
  ]
}
```

---

## FASE 6: VERIFICACIÓN FINAL + CI (Día 21-22)

### 6.1 Script de Verificación

```bash
#!/bin/bash
# verify-unification.sh

cd /c/Users/Isaacko0/Zeitnus-Firma-Operaciones-Ecotomica

echo "=== 1. TypeScript Compilation ==="
npx tsc --noEmit 2>&1 | tee tsc-output.log
ERRORS=$(grep -c "error TS" tsc-output.log || true)
echo "Errors: $ERRORS"
[ "$ERRORS" -eq 0 ] || exit 1

echo "=== 2. Build ==="
npm run build 2>&1 | tee build-output.log
[ $? -eq 0 ] || exit 1

echo "=== 3. Preview Server + Health Checks ==="
npm run preview &
PREVIEW_PID=$!
sleep 10

ROUTES=("/" "/alrac" "/cpp" "/tq" "/zeitnus" "/samay" "/feria" "/colonya" "/clc" "/ruddick" "/solarpunk")
for route in "${ROUTES[@]}"; do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:4173$route")
  echo "$route -> $CODE"
  [ "$CODE" = "200" ] || echo "WARNING: $route returned $CODE"
done

kill $PREVIEW_PID

echo "=== 4. GNAP Agents Registry ==="
cat .gnap/agents.json | jq '.agents | length'
cat .gnap/agents.json | jq '.agents[].did'

echo "=== 5. Specs OpenSpec Validación ==="
for spec in openspec/specs/*.md; do
  echo "Validating $spec..."
  # spec-validator "$spec" 2>&1 | grep -E "(PASS|FAIL|PVL)"
done

echo "=== UNIFICACIÓN COMPLETA ==="
```

### 6.2 Criterios de Éxito Final

| Criterio | Target |
|----------|--------|
| `tsc --noEmit` | **0 errores** (solo warnings pre-existentes en guided_autonomous, nieves-*, mma_engine) |
| `npm run build` | **Exit code 0** |
| `curl /<route>` | **200 OK** en 11 rutas |
| GNAP agents | **7 agentes** registrados con heartbeat |
| Specs OpenSpec | **13 specs** PVL compliant |
| Cobertura módulos | **11 módulos** (alrac, tq, cpp, znu, samay, colonya, feria, clc, ruddick, solarpunk, mweria) |

---

---

## FASE 7: PROOF OF AURA FARMING (Día 23-30) — *NUEVA FASE* 🎯

### 7.1 Fixes Críticos Pendientes (Día 23)

```bash
# Fix 2 exports restantes en ev.ts
sed -i 's/export const detectCoherence/const detectCoherence/' src/core/lib/ev.ts
sed -i 's/export const calculateAutonomyCost/const calculateAutonomyCost/' src/core/lib/ev.ts

# Verificar build
npm run build
```

### 7.2 Módulos Proof of Aura Creados (Día 23-24) ✅

| Módulo | Archivo | Estado |
|--------|---------|--------|
| Core Types & Scoring | `src/core/lib/aura.ts` | ✅ Creado |
| Farming Detection (7 vectores) | `src/core/lib/aura-farming-detection.ts` | ✅ Creado |
| Credencial Verificable | `src/core/lib/aura-credential.ts` | ✅ Creado |
| State Slice + Factory | `src/core/state/aura.ts` + `aura-state-factory.ts` | ✅ Creados |
| Store Integration | `src/core/state/store.ts` | ✅ Integrado |
| Spec OpenSpec | `openspec/specs/aura-protocol.md` | ⏳ Pendiente |
| UI Screen | `src/app/screens/Aura.tsx` | ⏳ Pendiente |
| Tests Adversariales | `src/core/lib/__tests__/aura-farming.adversarial.test.ts` | ⏳ Pendiente |

### 7.3 Integración Proof of Aura en Plan Maestro (Día 24-26)

```bash
# 1. Crear spec OpenSpec
cat > openspec/specs/aura-protocol.md << 'EOF'
# Spec: Aura Protocol — Proof of Authentic Presence
**Capa ALRAC:** 0.5 (Normativa Extendida) + 1 (Contable-Física) + 2 (Interoperabilidad)
**Versión:** 0.1.0
**Estado:** Draft

## Criterios de Aceptación (PVL)
- [ ] `computeAuraScore()` typechecks + unit tests 100%
- [ ] `detectAuraFarming()` detects 7 attack vectors in simulation
- [ ] `AuraCredential` issued by GAIA COMMONS + verified by ConvergeMaps
- [ ] Integration with TQ/EV/ZNU/Symbiosky/γ-CARMIS/ConvergeMaps verified
- [ ] Farming detection catches 95% synthetic farmers in adversarial test
- [ ] False positive rate < 2% on real node data
- [ ] Credential renewal flow (90 days) operational
EOF

# 2. UI Screen Aura.tsx (tabs: Score, Credential, Farming Detection, History)
# 3. Tests adversariales: 1000 synthetic farmers vs 100 real nodes
# 4. CPP Pool para aura credentials cross-nodo
# 4. GNAP task chain: cross-node aura verification
```

### 7.4 Integración con Nodos Piloto (Día 27-30)

| Nodo | Integración Proof of Aura | Acción |
|------|---------------------------|--------|
| **Feria Conuquera** | TQ 10 años + 45 colectivos | Farming detection en trueque |
| **+Colonia** | 515ha, CLT, ZNU | Credencial residente/inversor |
| **Samay** | 20 años, water design | Aura regeneración territorial |
| **Febhouse/ArchiDiagram** | 60k arquitectos | Aura profesional (portafolio EV) |
| **memegen.link** | 200+ templates | Aura cultural (meme coherence) |
| **Ruddick/GEF** | mweria/kaya/trustBasket | Aura ancestral (community trust) |
| **Bancassol** | Banca comunitaria | Aura financiera soberana |

### 7.5 Criterios de Éxito Actualizados (con Proof of Aura)

| Criterio | Target |
|----------|--------|
| `tsc --noEmit` | **0 errores** (incluyendo aura modules) |
| `npm run build` | **Exit code 0** |
| `curl /<route>` | **200 OK** en 12 rutas (+ `/aura`) |
| Proof of Aura | **Credential issued** + **Farming detection 95%** |
| GNAP agents | **8 agentes** (incluye `aura-verifier`) |
| Specs OpenSpec | **14 specs** (+ `aura-protocol.md`) |
| Farming detection | **95% catch rate** + **<2% false positive** |
| Credential renewal | **90 días** + ConvergeMaps re-attestation |

---

## RIESGOS Y MITIGACIONES

| Riesgo | Probabilidad | Mitigación |
|--------|--------------|------------|
| Errores TS pre-existentes bloquean verificación | Alta | Documentar lista blanca errores permitidos; no bloquear merge |
| Pantallas 11 = mucho trabajo UI | Media | Usar componentes base (Card, Stat, Btn, Badge, EmptyState, Field, Bar) — no crear nuevos |
| GNAP heartbeat requiere infra | Baja | Simular heartbeat con `setInterval` en store para demo |
| Specs OpenSpec validation tool no existe | Baja | Validación manual: estructura + tipos + PVL criteria |

---

## EJECUCIÓN

```bash
# Ejecutar fase por fase con supervisión humana en puntos de control
# Cada fase requiere edición manual de archivos
# Verificación final automatizada
./verify-unification.sh
```

---

> **La unificación completa NO es un documento — es el codebase compilado y verificado.**  
> **Cuando `tsc --noEmit = 0` + `build OK` + 11 rutas 200 + 7 agentes GNAP = UNIFICACIÓN COMPLETA.**