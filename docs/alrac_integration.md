# ALRAC — Consorcio de Transducción Soberana — Integración Triple Perspectiva

## 1. Perspectiva Usuario

### Qué quiere lograr
El usuario (Isaac Ko, fundador Zeitnus, futurista enfocado en autonomía) quiere:
- **Operacionalizar ALRAC** como vehículo comercial real que facture desde el mes 1
- **Resolver la tensión TQ vs ZNU** que existe en HSCSG desde el Postulado 4: TQ como cinta métrica no acumulable (cumple Postulado 4) y ZNU como reserva/puente dentro de cooperativa (cumple ZEITNUS)
- **Evitar duplicación con NEXO** (§3.5): coordinar con Yoka *antes* de construir, no después
- **Tener un piloto real en 90 días**: Experimento 2 (Trusted Credential) de la Gran Alianza + caso Línea A real
- **Constitución legal** como cooperativa de trabajo asociado (no captar ahorro hasta año 2-3 auditado)

### Valor para su nodo Zeitnus
- ALRAC = **capa comercial** que monetiza la arquitectura HSCSG (A-E) sin comprometer la lógica postmonetaria
- **Principio Anfibio nativo**: TQ (postmonetario) ↔ ZNU (conectado) separados por función, no por ideología
- **CaaS integrado**: Línea A usa Base Material/AUT; Línea B usa stack Cergio; Línea C usa RAO + ledger TQ
- **Gobernanza de paz** = isomorfismo directo con Leyes MJ + CaaS

### Casos de uso en Zeitnus
1. **Pantalla ALRAC** (`/alrac`): Dashboard completo 5 tabs (Arquitectura, Gobernanza, Reparto, Productos, Convergencia ALRAC-NEXO)
2. **Diagnóstico Línea A**: Aplicar método 6 campos (Yoka) + AEI/Triaxial (Amid) a cooperativas/ecoaldeas reales
3. **Piloto Línea C**: Experimento 2 Trusted Credential — RAO como pieza que resuelve "agent-readable ≠ trustworthy ≠ interoperable"
4. **Reparto automático**: Ecuación Amid calculada en tiempo real según armonía αʰ aportada por cada capa
5. **Auditoría licencias**: Cerrar conflicto CC BY-NC-ND 4.0 (Yoka & Fabio Balbi) en repo HSCSG antes de invitar formalmente

---

## 2. Perspectiva LLM (Asimilación Técnica)

### Qué asimilar (Lógica Pura — Preservar)
| Componente | Archivo Zeitnus | Descripción |
|---|---|---|
| **Tipos dominio** | `src/core/state/alrac.ts` | Interfaces completas: ALRACState, EpistemicLayer (Amid+Yoka), NormativeLayer, AccountingLayer (TQ), InteropLayer (CaaS/HSCSG), FiatLayer (ZEITNUS), ALRACGovernance, RevenueSplit, ProductLine, PilotConfig |
| **Funciones puras** | `src/core/lib/alrac.ts` | 15+ funciones: `verifyCredoStability`, `calculateHarmony`, `detectOverloadAndTriggerCARMIS`, `runTriaxialVerification`, `createSixFieldRecord`, `registerHuella`, `checkConvergence`, `legitimateSeparation`, `createTQAccount`, `createTQTransaction`, `verifyTQProhibition`, `calculateConversionFactor`, `calculateRevenueSplit`, `verifyPPEClause`, `verifyBetaCrit`, `getDecisionLadderStep`, `runLicenseAudit`, `verifyALRACNEXOConvergence`, `verifyTQZNUSeparation`, `createTrustedCredentialPilot`, `getConsortiumStatus` |
| **Hooks React** | `src/core/state/hooks/alrac.ts` | Selectors: `useALRAC`, `useALRACActions`, `useEpistemicLayer`, `useAccountingLayer`, `useInteropLayer`, `useFiatLayer`, `useGovernance`, `useRevenueSplit`, `useProductLines`, `useConsortiumStatus` |
| **Pantalla interactiva** | `src/app/screens/ALRAC.tsx` | 5 tabs: Architecture (5 capas expandibles), Governance (paz + auditoría), Revenue (fórmula Amid + capas + protección), Products (A-E con badges), Convergence (tabla ALRAC↔NEXO + pasos + riesgos) |
| **Nav + i18n + Route** | `Aside.tsx`, `i18n.ts`, `App.tsx` | Nav item `alrac` (icono GitBranch, amber), keys ES/EN/PT (120+), route `/alrac` |

### Qué extirpar (Infra Ajena — NO preservar)
- ❌ Servidores, bases de datos, APIs externas — ALRAC es lógica de coordinación, no infraestructura
- ❌ Blockchain/contratos inteligentes para gobernanza — Verificación Triaxial y γ-CARMIS son lógica pura
- ❌ Captación de ahorro en Capa 3 — explícitamente prohibido hasta 2-3 años auditados
- ❌ Licencia CC BY-NC-ND 4.0 — conflicto conocido, debe resolverse (CC0 para Amid, custom para Yoka)
- ❌ Diagnosticar clínicamente / crear dependencia — candado epistémico inquebrantable en ambos registros

### Stack Zeitnus (anfibio)
- **Tipos**: TypeScript interfaces puras (sin runtime deps externas)
- **Estado**: Zustand persist (localStorage) — `alrac: ALRACState` en `AppState`
- **UI**: React 18 + Tailwind + lucide-react (icono `GitBranch`)
- **Persistencia**: `partialize` incluye `alrac: st.alrac`
- **Acciones**: `updateALRAC`, `resetALRAC` en store

---

## 3. Perspectiva HSCSG + CaaS (Isomorfismo Completo)

### Mapeo ALRAC ↔ HSCSG (Leyes MJ + CaaS)

| ALRAC Concept | HSCSG Module | Ley MJ / CaaS |
|---|---|---|
| **Capa 0 Amid (PI, 𝕮, γ-CARMIS, Triaxial, AEI)** | `VitalTimeInvariants`, `Verificacion`, `KernelProtocol` | Ley III: Lucidez = verificación triaxial como estándar |
| **Capa 0 Yoka (Fricción, Presencia, 6 campos)** | `EV` (E→V pattern), `Lucidez` | Ley III: Fricción = señal, no deuda; Presencia = lucidez operativa |
| **Capa 0.5 (7 Principios + 5 Anti-reglas)** | `Soberanía` (13 pilares), `Integral` (loop CDS→OAD→COS→ITC→FRS) | Ley I/II/III: Principios = implementación operativa leyes |
| **Capa 1 TQ (1 TQ = 1 kWh, ±500, NFC offline)** | `Solarpunk` (EnergyAccounting), `ValueFlows` | Ley I: Energía no dañable; Ley II: Reciprocidad soberana |
| **Capa 2 CaaS/HSCSG (AUT, RAO, Autómata, Federación)** | `CaaS`, `AUT`, `RAO`, `Automaton`, `AgentMesh` | Ley II: Soberanizando (AUT×CDS); CaaS: acceso por contribución |
| **Capa 3 ZEITNUS (Cooperativa, puente bancario)** | `ZNU`, `Vesting`, `Trustlines` | Ley I: Respaldo producción real; Puente fiat controlado |
| **Prohibición cambiaria TQ ≠ Fiat** | Arquitectura: Capa 3 aisla Capa 1 | Ley I: Separación física/digital (membrana) |
| **Ecuación Amid (reparto 50/50 + armonía)** | `CaaS` revenueShare, `ValueFlows` exchanges | Ley II: AUT×CDS = contribución real medida |
| **PPE (γ_ind ≈ ½θ_generado)** | `Integral` FRS signals, `Kernel` BT213 límites | Ley III: Anti-explotación = lucidez auditada |
| **β_crit (techo anti-acaparamiento)** | `Solarpunk` ±500 TQ limits, `VitalTime` decay | Ley I: No dañar base material (acumulación = daño) |
| **Verificación Triaxial = árbitro** | `Verificacion` (mental + sim + lab) | Ley III: Decidir por correspondencia, no votación |
| **γ-CARMIS / Consentimiento total** | `KernelProtocol` reconfig, `EV` convergencia | Ley I/II/III: Reconfigurar antes de romper |
| **Escalera decisión (Gran Alianza)** | `Pipeline` actuator, `Integral` loop | CaaS: Construir → Integrar → Asociarse → Adoptar → Co-crear → Fusionar |
| **Auditoría licencias** | `Legal-Safe` workflow, `ATTRIBUTIONS.md` | Ley III: Lucidez = transparencia legal |
| **Línea A (Encaje/Paz)** | `Soberania` diagnóstico, `EV` fricción/coherencia | Ley III: Paz = ausencia fricción sostenida |
| **Línea B (Nodo Llave en Mano)** | `Solarpunk` meshNode, `AgentCanvas` deploy | Ley I/II: Hardware+software soberano deployable |
| **Línea C (Medición/Confianza)** | `RAO` (identidad+emisor+procedencia+permisos+estado), `Integral` FRS | Ley III: Confianza = procedencia auditable |
| **Línea D (Editorial/Escuela)** | `Contenido`, `Educacion`, `Fuentes` | CaaS: Conocimiento como servicio por contribución |
| **Línea E (Estudio Zeitnus)** | `Agencia` (método agencia + anfibio) | Sostiene A-D mientras maduran |

### Isomorfismo con Leyes Materialismo Jerárquico

| Ley MJ | ALRAC Correspondence |
|---|---|
| **Ley I: No dañar base material/personas** | Capa 1 TQ (energía real no dañable), Prohibición cambiaria, β_crit anti-acaparamiento, Capa 3 membrana fiat protege TQ |
| **Ley II: Ganarse vida soberanizando (AUT×CDS)** | CaaS Capa 2 (acceso por contribución), AUT vectores, Reparto Amid (armonía = contribución real), Línea A encaje = diagnóstico soberano |
| **Ley III: Lucidez, nunca engañar** | Verificación Triaxial (no votación), γ-CARMIS (reconfigurar antes de ruptura), Candado epistémico (nunca diagnóstico clínico), Fricción como señal honesta |

### CaaS Integration
- **Acceso por contribución real** = Capa 2 (CaaS/HSCSG) + Reparto Amid (armonía αʰ)
- **Compatibilidad existencial (E→V)** = Criterio membresía CaaS renovado diario (no identidad fija)
- **Mapa vivo (E→V/NEXO)** = Conocimiento compartido CaaS sin autoridad central
- **Convergencia sin autoridad** = Gobernanza CaaS (noAbsorption, triaxialArbiter, γ-CARMIS distributed)
- **Separación legítima** = Salida CaaS sin deuda, sin confesión ajena

### Verificación Técnica (Post-Integración)
```bash
cd /c/Users/Isaacko0/Zeitnus_local
npx tsc --noEmit            # 0 errores
npm run build               # build OK
npm run preview &           # background
curl 200 en /alrac          # ruta ALRAC operativa
pvl verify --suite=all      # compliance PVL completo
```

### Archivos Creados/Modificados

| Archivo | Acción |
|---|---|
| `src/core/state/alrac.ts` | CREATE — Tipos completos (ALRACState + 25+ sub-interfaces) |
| `src/core/lib/alrac.ts` | CREATE — Lógica pura (15+ funciones) |
| `src/core/state/hooks/alrac.ts` | CREATE — Hooks React (10 selectors) |
| `src/app/screens/ALRAC.tsx` | CREATE — Pantalla 5 tabs (3,300+ líneas) |
| `src/core/state/store.ts` | MODIFY — +ALRAC imports, state, actions (updateALRAC, resetALRAC), resetAll, partialize, initial state |
| `src/app/App.tsx` | MODIFY — +ALRAC import + route `/alrac` |
| `src/app/layout/Aside.tsx` | MODIFY — +GitBranchIcon import + nav item `alrac` |
| `src/core/lib/i18n.ts` | MODIFY — +nav.alrac + 120+ keys ALRAC (ES/EN/PT) |
| `docs/alrac_backup.md` | CREATE — Backup documento original |
| `docs/alrac_integration.md` | CREATE — Este archivo (triple perspectiva) |

### GNAP Bridge (Cross-Repo Coordination)
- `.gnap/` ya existe en **AMBOS** repos (Zeitnus + HSCSG_v15_OS) desde commit anterior
- Agentes ALRAC relevantes en `agents.json`:
  - `zeitnus-architect` → implementa ALRAC en Zeitnus
  - `hscsg-researcher` → asimila fuentes ALRAC (Alraico, Ecoaldeas, Javier, etc.)
  - `openspec-engineer` → especifica ALRAC en OpenSpec SDD
  - `alraico-kernel` → valida isomorfismo Leyes MJ
  - `legal-safe-validator` → cierra auditoría licencias (incluye conflicto Yoka & Fabio Balbi)
- Tarea compartida `FA-1` ya incluye coordinación ALRAC-NEXO (Paso 0)

---

## Próximos Pasos Recomendados (Inmediatos)

1. **Paso 0 (ESTA SEMANA)**: Conversación con Yoka — ¿ALRAC = vehículo comercial NEXO o capas coordinadas? Determina si fusionar docs o coordinar explícitamente.

2. **Verificación Build**: `npx tsc --noEmit` + `npm run build` + `curl 200 /alrac`

3. **Semanas 1-3**: Cerrar `LICENSE_AUDIT_ASIMILACIONES.md` incluyendo material Yoka & Fabio Balbi (CC BY-NC-ND 4.0)

4. **Semanas 2-4**: Cartas individuales a Amid, Cergio, Javier, Pepe (no genérica, cada capa con su contexto y remuneración fórmula Amid)

5. **Semanas 4-8**: Lanzar **Experimento 2 — Trusted Credential** (Gran Alianza) + caso Línea A real
   - RAO de HSCSG resuelve "agent-readable ≠ trustworthy ≠ interoperable"
   - Experimento 2 ya definido por tercero independiente (Gran Alianza)

6. **Semanas 8-12**: Constitución legal cooperativa trabajo asociado + primer nodo TQ instalado

7. **Integración OpenSpec**: Crear specs ALRAC en `openspec/specs/` (alrac-architecture, alrac-governance, alrac-revenue, alrac-convergence-nexo)

8. **Agente GNAP `alrac-coordinator`**: Añadir a `agents.json` ambos repos para coordinación ALRAC específica