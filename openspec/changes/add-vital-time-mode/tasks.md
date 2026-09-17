# Tasks: FASE 1 — Integración Core Moneda Tiempo Vital (Refactor Limpio + Tests)

**Change**: add-vital-time-mode  
**Fecha**: 2026-09-15  
**Principio**: Refactor completo eliminando duplicados, alineado a Bio-Tesis MAESTRA v2.0  
**Orden**: Secuencial (dependencias marcadas)

---

## 🔴 REFACTOR CRÍTICO (Eliminar Duplicados - Bloquea TypeScript)

### ⬜ TASK-001: vitalTime.ts — ELIMINAR DUPLICADOS COMPLETOS
- [ ] Leer archivo actual completo (965 líneas)
- [ ] Identificar TODOS los duplicados: `humanArtificer` (3x), `translationSignature` (3x), `afpVitalTime` (2x), `powerAsVitalTime` (2x), `ballastEquation` (2x), `realMargin` (2x), `kernelLimits` (2x con tipos diferentes), `nodeId`/`name`/etc (2x)
- [ ] Reescribir archivo COMPLETO con UNA sola definición por campo
- [ ] Tipos limpios: `VitalTimeNode`, `VitalTimeAmount`, `TriaxialProof`, `LoopEngineState`
- [ ] Exportar tipos base para uso en otros archivos
- [ ] Verificar: `npx tsc --noEmit` sin errores en vitalTime.ts

### ⬜ TASK-002: vitalTimeTriaxial.ts — ELIMINAR DUPLICADOS + verifyTriaxial() LIMPIO
- [ ] Leer archivo actual completo (510 líneas)
- [ ] Eliminar: `witnessVerification` duplicado (3x), `combinedScore` redeclarado (3x), `allPassed`/`passed` redeclarados
- [ ] Eliminar imports no usados: `VitalTimeAmount`, `VitalTimeNode`, `VitalTimeMode`
- [ ] Implementar `verifyTriaxial()` LIMPIO con 3 ejes:
  - Mental: firma + 2 dominios + kernelLimitsRespected (VIA-27, VIA-25)
  - Simulación: loopEngine + γ-CARMIS + coherencia BT213 (VIA-25)
  - Laboratorio: E=V cuerpo + testigo + responsabilidad BT214 (VIA-21)
- [ ] Score ponderado: mental*0.4 + sim*0.3 + lab*0.3 ≥ 0.7
- [ ] Verificar: `npx tsc --noEmit` sin errores en vitalTimeTriaxial.ts

### ⬜ TASK-003: vitalTimeTransduction.ts — ELIMINAR DUPLICADOS MASIVOS
- [ ] Leer archivo actual completo (635 líneas)
- [ ] Eliminar: redeclaraciones completas de funciones (transduceTQtoVitalTime 3x, transduceVitalTimeToTQ 3x, canNodeTransduce 3x, resetDailyTransductionLimits 3x, getTransductionUsage 3x)
- [ ] Eliminar: imports duplicados, tipos duplicados (VitalTimeNode 3x, VitalTimeAmount 3x)
- [ ] Eliminar: variables no usadas (energyCapacityKWh, requiresTwoDomainsIntegration, artificerResponsibilityAccepted, kernelOp, toAmount, fromNode, rateConfig, transductionId, triaxialVerified, toNode)
- [ ] Implementar UNA sola versión de cada función con 5/7 validaciones ordenadas
- [ ] Verificar: `npx tsc --noEmit` sin errores en vitalTimeTransduction.ts

### ⬜ TASK-004: vitalTimeInvariants.ts — ELIMINAR PROPIEDADES DUPLICADAS
- [ ] Leer archivo actual completo
- [ ] Eliminar: propiedades duplicadas masivas (kernelNoConsciousnessAudit 2x, kernelNoDecideTruth 2x, humanResponsibilityNonDelegable 2x, aiCannotPayCost 2x, afpVitalTimeConsciousEnergy 2x, powerIsVitalTime 2x, ballastEquation 2x, evasionLightensToday 2x, presenceDensifies 2x, totalPaidEqual 2x, peaceFromAssumption 2x, umbralInfoInsufficient 2x, afpSustainsBallast 2x, realMarginVariable 2x, evasionReducesMargin 2x, presenceExpandsMargin 2x, extractionSequestersMargin 2x, evolutionReorganizesMargin 2x, thresholdReal 2x, lagReal 2x, relationalLagReal 2x, kernelOrganizesTracesNotDecides 2x, kernelNoConsciousnessAuditInvariant 2x, etc.)
- [ ] Reorganizar por fuente: E=V §19, Kernel §13, Humano §14, AFP §40, BT180, BT165, BT164
- [ ] UNA sola propiedad por invariante
- [ ] Verificar: `npx tsc --noEmit` sin errores en vitalTimeInvariants.ts

### ⬜ TASK-005: kernelProtocol.ts — COMPLETAR VIAs FALTANTES + FIX DUPLICADOS
- [ ] Agregar VIA-00, VIA-11, VIA-30, VIA-31 al registro (faltan en type Record)
- [ ] Eliminar propiedades duplicadas en objetos (múltiples claves iguales)
- [ ] Eliminar parámetros no usados: kernelText, protocol, input en funciones
- [ ] Verificar: `npx tsc --noEmit` sin errores en kernelProtocol.ts

### ⬜ TASK-006: humanArtificer.ts — ELIMINAR VARIABLES NO USADAS
- [ ] Eliminar: `organizedTraces`, `integratedView` en humanTransform()
- [ ] Verificar: `npx tsc --noEmit` sin errores en humanArtificer.ts

### ⬜ TASK-007: loopEngine.ts — INTEGRAR vitalTime EN AppState
- [ ] **REQUERIDO**: Agregar `vitalTime` a `AppState` en `src/core/state/store.ts`
- [ ] Importar tipos de `vitalTime.ts` (no duplicar)
- [ ] Fix: `staleNodes` no definido en `simulateReconfig()` caso vitalTime
- [ ] Fix: `vitalTime` property en `Partial<AppState>` deltas
- [ ] Verificar: `npx tsc --noEmit` sin errores en loopEngine.ts

### ⬜ TASK-008: metrics.ts — AGREGAR EXPORTS FALTANTES (Compatibilidad Screens)
- [ ] Agregar exports que usan screens existentes: `autFromCAC`, `pgsLM`, `leyI`, `leyII`, `population`, `survivalCredit`, `znuEligible`, `znuEmission`, `demurrage`, `ics`, `cacStatus`
- [ ] Mantener nuevos tipos VitalTimeFlow, VitalTimeActivationCost
- [ ] Verificar: `npx tsc --noEmit` sin errores en metrics.ts + screens

### ⬜ TASK-009: store.ts — AGREGAR vitalTime A AppState
- [ ] Agregar `vitalTime: { nodes: Record<string, VitalTimeNode>, staleAlerts: string[], pendingVerifications: string[] }` a AppState
- [ ] Importar `VitalTimeNode` de `vitalTime.ts`
- [ ] Verificar: `npx tsc --noEmit` sin errores en store.ts

---

## ✅ IMPLEMENTACIÓN NUEVA (Archivos Limpios)

### ⬜ TASK-010: valueDual.ts — REFACTOR Anfibio 3 Modos
- [ ] Verificar implementación actual correcta (ya hecha en commit 8359539)
- [ ] Confirmar: `NodeMode = 'postmonetario' | 'conectado' | 'vital_time'`
- [ ] Confirmar: `vitalTimeRotate`, `vitalTimeDecay`, `displayValueUnified`
- [ ] Verificar: `npx tsc --noEmit` sin errores

### ⬜ TASK-011: Nuevos Archivos Kernel (Verificar Limpios)
- [ ] `kernelProtocol.ts` - Kernel unificado + VIA00-31 + Consola VIA-0
- [ ] `bt213KernelLimits.ts` - Límite kernel BT213
- [ ] `humanArtificer.ts` - Humano artífice BT214
- [ ] `mk1Ontology.ts` - MK-1 ontología fractal
- [ ] `hogueraAFPEnlace.ts` - La Hoguera, AFP, El Enlace
- [ ] `viaProtocols.ts` - 32 VIAs ejecutables
- [ ] Verificar cada uno: `npx tsc --noEmit` sin errores

---

## 📋 SPECS OPENSPEC (Ya Actualizadas - Verificar)

### ⬜ TASK-012: Specs OpenSpec Alineadas Bio-Tesis v2.0
- [ ] `openspec/specs/vital-time-currency.md` ✅ Actualizada
- [ ] `openspec/specs/nexo-architecture.md` ✅ Actualizada
- [ ] `openspec/specs/kernel-protocol.md` ✅ Actualizada
- [ ] `openspec/specs/triaxial-verification.md` ✅ Actualizada
- [ ] `openspec/changes/add-vital-time-mode/proposal.md` ✅ Actualizada
- [ ] `openspec/changes/add-vital-time-mode/design.md` ✅ Actualizada
- [ ] `openspec/changes/add-vital-time-mode/tasks.md` ✅ Este archivo

---

## 🧪 TESTS TRIAXIALES OBLIGATORIOS (FASE 2)

### ⬜ TASK-013: Tests VitalTime Core
- [ ] Crear `src/core/lib/vitalTime.test.ts`
- [ ] Test `vitalTimeRotate()`: libera exceso > protegido tras rotationDays
- [ ] Test `vitalTimeRotate()`: no rota si daysSinceActivity < rotationDays
- [ ] Test `vitalTimeDecay()`: decay detectable tras 7 días
- [ ] Test `verifyTriaxial()`: passed=true si combinedScore ≥ 0.7 + todos passed
- [ ] Test `verifyTriaxial()`: rechaza si mental intenta auditar conciencia (Kernel §13)
- [ ] Test `verifyTriaxial()`: requiere responsabilidad BT214 en lab (Humano §14)
- [ ] Test `transduceTQtoVitalTime()`: válido si αʰ≥0.6 + triaxial + kernelLimits + responsabilidad + 2dominios
- [ ] Test `transduceTQtoVitalTime()`: rechaza si kernelLimitsValidated=false
- [ ] Test `vitalTimeMintLoop()`: minea si triaxial verificada + 2 dominios integrados
- [ ] Test `vitalTimeMintLoop()`: alerta pendingVerifications si sin triaxial
- [ ] Test `calculateTerritorialSovereigntyIndex()`: incluye vitalTimeAutonomy + kernelLimitsRespected + humanArtificerActive
- [ ] Test `runDisappearanceTest()`: verifica kernelLocal + artificerLocal
- [ ] Ejecutar: `pnpm test` → todos pasando

---

## ✅ VALIDACIÓN OPENSPEC + CI/CD

### ⬜ TASK-014: Validación OpenSpec
- [ ] Instalar OpenSpec CLI: `npm install -g @fission-ai/openspec@latest`
- [ ] Inicializar: `openspec init` en HSCSG_v15_OS
- [ ] Validar specs: `openspec validate --strict` → pasa
- [ ] Verificar trazabilidad spec↔código completa

### ⬜ TASK-015: CI/CD + Legal-Safe
- [ ] Verificar CI `.github/workflows/openspec-validate.yml` pasa
- [ ] Verificar pre-commit legal-safe pasa
- [ ] Commit + push

---

## 🤖 SKILLS AGENTES HSCSG (Patrón OpenSpec)

### ⬜ TASK-016: Skills Agentes (6 skills)
- [ ] Crear `skills/hscsg/hscsg-write-spec/` — Escribe specs formato OpenSpec
- [ ] Crear `skills/hscsg/hscsg-draft-proposal/` — Redacta proposal.md desde idea
- [ ] Crear `skills/hscsg/hscsg-verify-specs/` — Valida specs + tests triaxiales
- [ ] Crear `skills/hscsg/hscsg-onboard/` — Onboarding guiado HSCSG v15 OS
- [ ] Crear `skills/hscsg/hscsg-archive-change/` — Archiva change completo
- [ ] Crear `skills/hscsg/hscsg-sync-stores/` — Sincroniza stores cross-repo

---

## 🔗 STORES CROSS-REPO (RIDF, Gaia, Alráico, NEXO)

### ⬜ TASK-017: Stores Cross-Repo
- [ ] Inicializar stores en `openspec/stores/ridf-store/specs/`
- [ ] Inicializar stores en `openspec/stores/gaia-store/specs/`
- [ ] Inicializar stores en `openspec/stores/alraico-store/specs/`
- [ ] Inicializar stores en `openspec/stores/nexus-store/specs/`
- [ ] Especs base por store (federated-exchange, ecovillage-network, epistemological-protocol, sovereign-coupling)
- [ ] Configurar sincronización git push

---

## 🎯 CRITERIOS DE ACEPTACIÓN FASE 1 (DEFINICIÓN DE HECHO)

| Criterio | Verificación | Estado |
|----------|--------------|--------|
| **TypeScript compila SIN ERRORES** | `npx tsc --noEmit` exit code 0 | 🔴 BLOQUEANTE |
| **0 duplicados en vitalTime*.ts** | 0 propiedades duplicadas, 0 redeclaraciones | 🔴 BLOQUEANTE |
| **Tests triaxiales pasan** | `pnpm test` exit code 0 | ⬜ |
| **OpenSpec validate pasa** | `openspec validate --strict` exit code 0 | ⬜ |
| **Pre-commit legal-safe pasa** | `git commit` sin bloqueo | ⬜ |
| **IST calcula 18 componentes** | `calculateTerritorialSovereigntyIndex()` incluye nuevos | ⬜ |
| **LoopEngine ejecuta Loop 7** | `runAlraicoTick()` incluye vitalTimeMintLoop | ⬜ |
| **Transducción F válida** | `transduceTQtoVitalTime(5, 0.7, true, true, true, true)` → valid=true | ⬜ |
| **Kernel limits respetados** | `validateKernelOperation()` no violations en código | ⬜ |
| **Humano artífice requerido** | `humanTransform()` firma responsabilidad | ⬜ |
| **Screens existentes compilan** | `autFromCAC`, `pgsLM`, `leyI`, `leyII`, etc. exportados | ⬜ |

---

## 📦 DEPENDENCIAS ENTRE TASKS (ORDEN CRÍTICO)

```
TASK-001 (vitalTime.ts - ELIMINAR DUPLICADOS)
    ↓ (tipos base limpios)
TASK-002 (vitalTimeTriaxial.ts - usa tipos vitalTime)
TASK-003 (vitalTimeTransduction.ts - usa tipos vitalTime + triaxial)
TASK-004 (vitalTimeInvariants.ts - usa tipos vitalTime)
    ↓
TASK-005 (kernelProtocol.ts - VIAs completos)
TASK-006 (humanArtificer.ts - limpio)
    ↓
TASK-009 (store.ts - +vitalTime en AppState)
    ↓
TASK-007 (loopEngine.ts - usa store.vitalTime)
TASK-008 (metrics.ts - exports compatibilidad + nuevos)
    ↓
TASK-010 (valueDual.ts - verificar)
TASK-011 (nuevos kernel - verificar)
    ↓
TASK-013 (TESTS - valida todo lo anterior)
    ↓
TASK-014 (OpenSpec validate)
TASK-015 (CI/Legal-Safe + Commit)
    ↓
TASK-016 (Skills agentes)
TASK-017 (Stores cross-repo)
```

---

## ⚠️ NOTAS CRÍTICAS

1. **TASK-001 a TASK-009 son BLOQUEANTES** para TypeScript. No avanzar a tests hasta que `npx tsc --noEmit` pase completamente.

2. **Duplicados identificados en vitalTime.ts** (del commit anterior):
   - `humanArtificer` definido 3 veces con tipos diferentes
   - `translationSignature` definido 3 veces
   - `afpVitalTime` definido 2 veces
   - `powerAsVitalTime` definido 2 veces
   - `ballastEquation` definido 2 veces
   - `realMargin` definido 2 veces
   - `kernelLimits` definido 2 veces con tipos incompatibles
   - `nodeId`, `name`, `vitalTimeBalance`, `protectedVitalTime`, `lastActivity`, `rotationDays`, `demurrageRate`, `triaxialVerificationCount`, `resonanceConnections`, `mode`, `transductionEnabled` definidos 2 veces

3. **Duplicados en vitalTimeTransduction.ts**: Funciones completas redeclaradas 3 veces cada una.

4. **Exports faltantes en metrics.ts** rompen screens existentes (Automat, Automata, CaaS, Colaberry, Colectivo, Home, Lucidez, Orquestacion, ZNU, etc.)

5. **store.ts DEBE tener vitalTime** antes de loopEngine.ts para que `st.vitalTime.nodes` exista.

---

## 🚀 PRÓXIMO PASO INMEDIATO

```bash
# 1. Empezar por TASK-001: vitalTime.ts refactor completo
# Leer archivo actual, identificar duplicados, reescribir limpio

# 2. Verificar: npx tsc --noEmit | grep vitalTime.ts

# 3. Continuar TASK-002, TASK-003, TASK-004 en orden

# 4. Solo cuando tsc --noEmit pase 100% → TASK-013 (tests)
```

---

**Estado**: Listo para empezar TASK-001 (vitalTime.ts refactor crítico)