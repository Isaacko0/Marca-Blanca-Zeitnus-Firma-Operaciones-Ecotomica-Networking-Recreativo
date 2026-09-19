# E→V Documento Maestro — Integración Triple Perspectiva

## 1. Perspectiva Usuario

### Qué quiere lograr
El usuario (Isaac Ko, futurista enfocado en autonomía) quiere **habitar E→V** como patrón operativo para:
- Alcanzar **claridad existencial**: ver lo que hay sin capa narrativa distorsionadora
- **Reducir fricción** interna: gasto divergente que no es deuda sino señal
- **Vivir sin justificar existencia**: "Nacemos en cero" — la existencia no nos debe nada
- Tomar decisiones **renovadas cada día** (compatibilidad existencial), no por identidad/contrato/deuda
- Tener un **mapa vivo** que evoluciona sin autoridad central, donde convergen operadores que reducen su evasión

### Valor para su nodo Zeitnus
- E→V = **núcleo operativo** que une y diversifica todos los módulos HSCSG (ENLACE AL PARADIGMA 0 / BIO-TESIS MAESTRA)
- Principio **Anfibio nativo**: misma lógica opera en modo postmonetario (ZNU/CaaS) o conectado (USD/USDC)
- **Entrada/Salida sin deuda** = compatibilidad total con CaaS (acceso por contribución real, no por dinero)

### Casos de uso en Zeitnus
1. **Pantalla E→V** (`/ev`): Visualizar ciclo E→V, detector fricción/coherencia, medidor margen, registro huella/rastro, verificador presencia, mapa vivo
2. **Integración cross-módulo**: VitalTime ↔ Energy ↔ Efficiency, TruthOwn ↔ TruthOntological, ZNU ↔ Autonomy
3. **Método E→V** aplicado a asimilaciones: Mirar repo → Identificar narrativa falsa (infra ajena) → Dejar de sostener (extirpar) → Registrar resultado (lógica pura)

---

## 2. Perspectiva LLM (Asimilación Técnica)

### Qué asimilar (Lógica Pura — Preservar)
| Componente | Archivo Zeitnus | Descripción |
|---|---|---|
| **Tipos dominio** | `src/core/state/ev.ts` | 70+ interfaces: Energy, Experience, Efficiency, Life, Truth, Virtue, Presence, Friction, Coherence, DataRoot, Margin, Restriction, Interference, Error, Evasion, Integration, TruthOwn, TruthOntological, Sovereignty, NaturalLaw, PositiveLaw, CouplingInternal, CouplingExternal, CompatibilityExistential, LegitimateSeparation, ZeroOrigin, EVRecord, Huella, Rastro, LivingMap, Convergence, EVMethod |
| **Funciones puras** | `src/core/lib/ev.ts` | 15+ funciones: `makeEVState()`, `energyToEfficiency()`, `lifeToVirtue()`, `detectFriction()`, `detectCoherence()`, `calculateMargin()`, `updateDataRoot()`, `integrateExperience()`, `recognizeError()`, `distinguishErrorFromEvasion()`, `calculateAutonomyCost()`, `calculateCds()`, `verifyPresence()`, `registerHuella()`, `generateRastro()`, `updateMapaVivo()`, `convergeMaps()`, `verifyCompatibility()`, `legitimateSeparation()`, `zeroOrigin()` |
| **Pantalla interactiva** | `src/app/screens/EV.tsx` | 6 tabs: Margin/Friction, Presence, Truth, Records, Zero/Origin, Declaration |
| **Hooks React** | `src/core/state/hooks/ev.ts` | Selectors: `useEV`, `useEVPresence`, `useEVTruth`, `useEVFriction`, `useEVTruthOwn`, `useEVTruthOntological`, `useEVSovereignty`, `useEVRecords` |
| **Nav + i18n** | `Aside.tsx`, `i18n.ts`, `App.tsx` | Item nav `ev` (icono Scale, color amber), keys ES/EN/PT, route `/ev` |

### Qué extirpar (Infra Ajena — NO preservar)
- ❌ Cloud/blockchain/USD/analytics — E→V es agnóstico a unidad monetaria
- ❌ Servidores, bases de datos, APIs externas — opera en capa consciente del operador
- ❌ Sistemas de creencia/adhesión/obediencia — solo correspondencia/no-correspondencia
- ❌ Validación externa — "no necesita que nadie lo valide para existir"

### Stack Zielnus (anfibio)
- **Tipos**: TypeScript interfaces puras (sin runtime deps)
- **Estado**: Zustand persist (localStorage) — `ev: EVState` en `AppState`
- **UI**: React 18 + Tailwind + lucide-react (icono `Scale`)
- **Persistencia**: `partialize` incluye `ev: st.ev`

---

## 3. Perspectiva HSCSG + CaaS (Isomorfismo Completo)

### Mapeo E→V ↔ HSCSG (Leyes MJ + CaaS)

| E→V Concept | HSCSG Module | Ley MJ / CaaS |
|---|---|---|
| **E (Energy/Vida)** | `VitalTime` / `EnergyAccounting` | Ley I: energía vital no dañable |
| **→ (Experience/Verdad)** | `VitalTimeInvariants` / `Presence` | Ley II: experiencia = trabajo soberano |
| **V (Efficiency/Virtud)** | `Efficiency` / `Autonomy` | Ley III: lucidez = no engaño |
| **Fricción** | `Friction` detector | Señal de gasto divergente (no deuda) |
| **Coherencia** | `Coherence` / `Autonomy` | Eficiencia real = soberanía con mínimo desperdicio |
| **Margen** | `Margin` calculator | Espacio real de trayectorias (CaaS) |
| **Restricción** | `Restriction` auditor | Parte del margen no disponible (dominio concreto) |
| **Interferencia** | `Interference` types | Fricción no propia; propia empieza al sostenerla sabiéndola |
| **Error vs Evasión** | `Error` vs `Evasion` types | Error cierra circuito; evasión lo mantiene abierto |
| **Integración** | `Integration` bridge | Puente experiencia→capacidad (aprendizaje) |
| **Verdad propia vs ontológica** | `TruthOwn` vs `TruthOntological` | Instancia final = operador (soberanía) |
| **Estatuto dual** | `DualStatute` | Capa operativa + Capa ontológica |
| **Huella/Rastro** | `Huella` / `Rastro` | Ocurrió → Comprendido+Integrado |
| **Mapa vivo** | `LivingMap` | Evolución acumulativa sin autoridad |
| **Convergencia sin autoridad** | `Convergence` | Operadores reduciendo evasión → mismo patrón |
| **Compatibilidad existencial** | `ExistentialCompatibility` | Dato de correspondencia (renovado diario) |
| **Estructuras acople vs evasión** | `CouplingInternal` / `CouplingExternal` | Acople devuelve capacidad; evasión captura atención |
| **Ley natural vs derecho positivo** | `NaturalLaw` vs `PositiveLaw` | Suelo vs construcción; contraste, no sustitución |
| **Método E→V** | `EVMethod` | 4 pasos: Mirar → Identificar → Dejar → Registrar (cuerpo) |
| **Formato registro** | `EVRecord` | 6 campos: categoría, costos, horizonte, rastro corporal, resultado, reapertura |
| **Entrada/Pertenencia/Salida** | `Membership` | Decisión renovada (no identidad/contrato/deuda) |
| **Separación legítima** | `LegitimateSeparation` | Divergencia sin pelea, sin confesión ajena |
| **Nacemos en cero** | `ZeroOrigin` | Sin contrato, sin deuda, existencia no debe nada |
| **Mentira vs Verdad** | `Truthfulness` | Mentira = fricción; Verdad = no fricción interna |
| **Claridad existencial** | `ExistentialClarity` | Ver lo que hay sin capa narrativa distorsionadora |
| **Riesgo declarado** | `DeclaredRisk` | Asimetría: fricción presente = dato; ausencia observable ≠ ausencia real |
| **Revisión/Estabilidad** | `CoreRevision` | Cerrar versión (estable); abrir solo por motivo real |

### Isomorfismo con Leyes Materialismo Jerárquico

| Ley MJ | E→V Correspondence |
|---|---|
| **Ley I: No dañar base material/personas** | Energy/Vida no dañable; Interferencia (extracción/traición/daño) = violación Ley I |
| **Ley II: Ganarse vida soberanizando (AUT×CDS)** | Experience/Verdad = trabajo soberano; Margin = espacio trayectorias CaaS; Autonomy = AUT×CDS |
| **Ley III: Lucidez, nunca engañar** | Fricción = señal gasto divergente; TruthOwn = instancia final evaluación; Coherence = lucidez operativa |

### CaaS Integration
- **Acceso por contribución real** = Entrada/Pertenencia/Salida renovada (no contrato/deuda)
- **Compatibilidad existencial** = Criterio de membresía CaaS (correspondencia diaria, no identidad fija)
- **Mapa vivo** = Conocimiento compartido CaaS sin autoridad central
- **Convergencia sin autoridad** = Gobernanza CaaS (noAbsorption, triaxialArbiter)

### Verificación Técnica (Post-Integración)
```bash
cd /c/Users/Isaacko0/Zeitnus_local
npx tsc --noEmit            # 0 errores (verificar)
npm run build               # build OK
npm run preview &           # background
curl 200 en /ev             # ruta EV operativa
pvl verify --suite=all      # compliance PVL completo
```

### Archivos Creados/Modificados (Commit 591a25c)
| Archivo | Acción |
|---|---|
| `src/core/state/ev.ts` | CREATE — Tipos completos (70+ interfaces) |
| `src/core/lib/ev.ts` | CREATE — Lógica pura (15+ funciones) |
| `src/core/state/hooks/ev.ts` | CREATE — Hooks React (8 selectors) |
| `src/app/screens/EV.tsx` | CREATE — Pantalla 6 tabs |
| `src/core/state/store.ts` | MODIFY — +EV imports, state, actions, resetAll, partialize |
| `src/app/App.tsx` | MODIFY — +EV route `/ev` |
| `src/app/layout/Aside.tsx` | MODIFY — +EV nav item (Scale, amber) |
| `src/core/lib/i18n.ts` | MODIFY — +nav.ev (ES/EN/PT) |
| `docs/ev_backup.md` | CREATE — Backup documento original |
| `docs/ev_integration.md` | CREATE — Este archivo (triple perspectiva) |

### GNAP Bridge (Cross-Repo Coordination)
- `.gnap/` creado en **AMBOS** repos (Zeitnus + HSCSG_v15_OS)
- `agents.json`: 4 agentes Zeitnus, 7 agentes HSCSG (comparten `isaac`, `zeitnus-architect`, `hscsg-researcher`, `ev-specialist`)
- `tasks/FA-1.json`: Tarea compartida "Establish GNAP bridge"
- `runs/FA-1-1.json`: Ejecución cross-repo
- `messages/1.json`: Broadcast coordinación
- **Commit convention**: `<agent-id>: <action> <entity> [details]`
- **Heartbeat loop**: git pull → check tasks → check messages → work → commit → push

---

## Próximos Pasos Recomendados

1. **Completar store wiring** para todos los 73+ módulos pendientes (Polymarket 8, LEF 13, ALRAICO 24, ALRAC 6, SOLARPUNK 13, ARTEMIS 8, EV 1)
2. **Definir shared task namespace GNAP** para asimilaciones HSCSG colaborativas
3. **Crear agente `pvl-validator`** en GNAP para compliance PVL automático
4. **Integrar GNAP con `hscsg-orquestador-skills`** para orquestación via git
5. **Verificar build completo** + curl 200 en todas las rutas nuevas