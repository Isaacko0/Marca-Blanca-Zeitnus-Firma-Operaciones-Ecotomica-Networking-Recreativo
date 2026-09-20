# Zeitnus Firma Operaciones Ecotómicas

> **Consorcio ALRAC** — Arquitectura de Transducción Soberana para la Regeneración Biocultural  
> Repositorio: https://github.com/Isaacko0/Zeitnus-Firma-Operaciones-Ecotomica  
> Core ALRAC: TypeScript puro, 0 errores, specs OpenSpec, γ-CARMIS protocol

---

## 🎯 ¿Qué es este repositorio?

**Zeitnus Firma Operaciones Ecotómicas** es el **núcleo técnico (Core ALRAC)** del Consorcio de Transducción Soberana — una arquitectura de 5 capas + capa 0 epistémica para federar proyectos regenerativos sin fusionarlos, operando bajo principios postmonetarios/anfibios (ZNU/CaaS/TQ).

> **No es una plataforma. Es infraestructura soberana.**  
> Código puro TypeScript, specs ejecutables, gobernanza holónica, economía regenerativa.

---

## 🏗️ Arquitectura ALRAC (5 Capas + Capa 0)

```
┌─────────────────────────────────────────────────────────────────┐
│ CAPA 5: GOBERNANZA TRANSVERSAL (1a1v, CDS, Subsidiaridad)      │
├─────────────────────────────────────────────────────────────────┤
│ CAPA 4: ZEITNUS APPLICATION (Market, Education, AI Matching)   │
├─────────────────────────────────────────────────────────────────┤
│ CAPA 3: MEMBRANA FIAT / ZEITNUS (ZNU, PriceParity, Bridge USDC) │
├─────────────────────────────────────────────────────────────────┤
│ CAPA 2: INTEROPERABILIDAD (CaaS/HSCSG, ValueFlows, DTN)        │
├─────────────────────────────────────────────────────────────────┤
│ CAPA 1: CONTABLE-FÍSICA — TQ LEDGER (1 TQ = 1 kWh, ±500)       │
├─────────────────────────────────────────────────────────────────┤
│ CAPA 0.5: NORMATIVA (Licencias CC0, Responsible Use Rules)     │
├─────────────────────────────────────────────────────────────────┤
│ CAPA 0: EPISTÉMICA — AMID + YOKA (𝕮, γ-CARMIS, Triaxial)       │
└─────────────────────────────────────────────────────────────────┘
```

---

## ⚡ Principios Fundamentales

| Principio | Descripción |
|-----------|-------------|
| **E=V** | Energía = Vector. La energía gastada debe corresponder al vector sostenido. No métrica, restricción termodinámica. |
| **Principio Anfibio** | Misma lógica, distinta infraestructura: Postmonetario (ZNU/CaaS offline) ↔ Conectado (USDC/ReFi Nivel 3). |
| **TQ = 1 kWh** | Unidad contable-física anclada a realidad. No especulable. Límite ±500. Prohibición TQ≠fiat/cripto. |
| **ZNU Indexado a Canasta** | 1 ZNU = poder adquisitivo canasta básica. Crédito mutuo 2-3%. Expiración 90d (Postulado 4). |
| **Reparto Amid 35/35/30** | Amid Dabir (I+D) / Yoka Commons (Infra) / Nodos Operadores (CDS-weighted). |
| **γ-CARMIS** | Protocolo fractura/reconfiguración: αʰ=Ω·s < κ → hard stop → 11 Pasos Parise (Paso II = operador). |
| **Gobernanza Holónica** | 1a1v, CDS-weighted, subsidiaridad, comités rotativos 3m, veto Núcleo, triaxial resolution. |

---

## 📁 Estructura del Repositorio

```
Zeitnus-Firma-Operaciones-Ecotomica/
├── openspec/specs/                    # 19 Specs OpenSpec (fuente de verdad)
│   ├── alrac-architecture.md          # Capa 0-5 architecture
│   ├── alrac-governance.md            # Gobernanza, licencia, piloto
│   ├── alrac-revenue.md               # Reparto Amid, líneas A-E
│   ├── alrac-convergence-nexo.md      # Convergencia Amid↔Yoka
│   ├── alrac-tq-*.md                  # 10 specs Capa 1 TQ
│   ├── alrac-caas-revenue-streams.md  # 6 streams + validación Gate MJ
│   ├── alrac-caas-membership.md       # 3 niveles (Afiliados/Asociados/Núcleo)
│   ├── alrac-znu-indexing-credit.md   # Canasta, crédito 2-3%, expiración
│   ├── alrac-fiat-layer.md            # Bridge USDC, 4 niveles ReFi
│   ├── alrac-governance-holonic.md    # 1a1v, CDS, comités, veto
│   └── SPEC_INDEXER.md                # Índice maestro 19 specs
│
├── src/core/                          # TypeScript Core (0 errores TS)
│   ├── lib/
│   │   ├── tq.ts                      # TQ Ledger ~1060 líneas
│   │   └── alrac.ts                   # Capa 0 Amid ~324 líneas
│   ├── state/
│   │   ├── alrac.ts                   # Interfaces completas ~629 líneas
│   │   ├── caas.ts                    # CaaSRevenueStream extendido
│   │   └── store.ts                   # AppState + updateALRAC/resetALRAC
│   └── hooks/
│       └── alrac.ts                   # Selectores + actions tipados
│
├── docs/                              # Documentación maestra
│   ├── ALRAC_MASTER_INTEGRADO.md      # Arquitectura completa, 12 colaboraciones
│   ├── ZEITNUS_REGENERATIVE_MODEL.md  # Video Samay → ALRAC mapping
│   ├── CAOS_MODELONEGOCIO_ANALISIS.md # αʰ=0.12, γ-CARMIS, Paso II template
│   ├── LICENSE_AUDIT_ASIMILACIONES.md # 9 ALTO RIESGO, conflicto NC-ND
│   ├── PROMPT_NARAM_SIN_11_PASOS.md   # Interfaz viva Naram-Sin ↔ 11 pasos
│   ├── ARCHITECTURE_DECISIONS.md      # 12 ADRs (MADR format)
│   ├── HSCSG_INTEGRATION_ARCHITECTURE.md # Adaptadores HSCSG→ALRAC
│   ├── GRANALLIANZA_MAPPING.md        # 5 líneas × 7 holones
│   └── simulacion_4agent_20260919/    # 5 escenarios + análisis comparativo
│
├── .gnap/agents.json                  # alrac-coordinator (cross-repo)
├── skills/                            # Skills Hermes (economic-research)
│   ├── alrac-economic-research/
│   ├── alrac-simulation-runner/
│   └── alrac-spec-validator/
│
└── package.json
```

---

## 🔬 Core TypeScript — Validado

```bash
# Verificar (0 errores en core ALRAC)
npx tsc --noEmit

# Core modules limpios:
# ✅ src/core/lib/tq.ts
# ✅ src/core/lib/alrac.ts
# ✅ src/core/state/alrac.ts
# ✅ src/core/state/caas.ts
# ✅ src/core/state/store.ts
# ✅ src/core/state/hooks/alrac.ts
```

> **Nota:** 992 errores totales en repo son de módulos UI pre-existentes (AgentCanvas, ALRAC.tsx, story, visual, avatar, video, highlight screens) — **no relacionados con ALRAC core**.

---

## 📋 5 Líneas de Negocio (A-E)

| Línea | Nombre | Horizonte | Token Principal | Clientes Reales |
|-------|--------|-----------|-----------------|-----------------|
| **A** | Diagnóstico Encaje | H1 (0-3m) | TQ (liquidez) | **Pendiente Paso II** |
| **B** | Kit Simulación | H2 (3-18m) | CaaS (estabilidad) | **Pendiente Paso II** |
| **C** | Prototipado Vía | H2 (3-18m) | CaaS + ZNU | **Pendiente Paso II** |
| **D** | Entrenamiento γ-CARMIS | H3 (18m+) | ZNU (patrimonio) | **Pendiente Paso II** |
| **E** | Nodos TQ | H3 (18m+) | TQ + ZNU stack | **Pendiente Paso II** |

---

## 🔴 Estado Actual: γ-CARMIS ACTIVO

```
αʰ = Ω × s = 0.6 × 0.2 = 0.12
κ (threshold producción) = 1.0
αʰ < κ → γ-CARMIS TRIGGERED
overload = 0.88
deadline ~24h desde activación
```

**Bloqueo duro:** Sistema detiene decisiones de producción hasta **Paso II — Orden de la Palabra** (input operador soberano).

### Para desbloquear (Paso II real):
```
A: Diagnóstico Encaje — Cliente: [REAL] — $[REAL] — [FECHAS] — [TQ] TQ — [ZNU] ZNU — Triaxial: mental✓/✗ sim✓/✗ lab✓/✗ — RAO: [EMISOR]/[PERMISO]/[ESTADO]/[REVOCACIÓN]
B: Kit Simulación — ...
C: Prototipado Vía — ...
D: Entrenamiento γ-CARMIS — ...
E: Nodos TQ — ...
```

---

## 🧪 Simulaciones (Validación Pipeline)

| Escenario | TQ/ZNU | Mejor Para | γ-CARMIS |
|-----------|--------|------------|----------|
| **Balanceado** (original) | 2.2 | Baseline | ACTIVO |
| **Conservador** (Esc 2) | 0.23 | Núcleo/H3 | ACTIVO |
| **Agresivo** (Esc 3) | 45.0 | Afiliados/H1 | ACTIVO |
| **Solo Línea A** (Esc 4) | 2.23 | Mono-línea | ACTIVO |
| **Multi-Nodo** (Esc 5) | Balanceado | Red completa | ACTIVO |

> **Veredicto @alrac-review en TODOS: NO DESABLOQUEA** — αʰ simulado (0.72-0.81) ≠ αʰ real (0.12)

📁 Ver: `docs/simulacion_4agent_20260919/COMPARATIVE_ANALYSIS.md`

---

## 🤝 Integración HSCSG (Capa de Infraestructura)

HSCSG no es "otra plataforma" — es **infraestructura soberana** que ALRAC consume:

| Capacidad HSCSG | ALRAC Consume Via |
|-----------------|-------------------|
| Identidad Soberana (RAO) | Gaia Passport, sCoRe, membresía |
| Procedencia Datos (DTN, ValueFlows) | Data Trust, auditoría RAO, triaxial |
| Confianza/Reputación (Kernel, CDS) | CDS calculation, governance weight |
| Intercambio ValueFlows | CaaS streams, revenue split, TQ accounting |
| Descubrimiento (NEXO, Search) | Directorio, matching, AI Hub |
| Coordinación Distribuida | Multi-node federation, cross-node pools |
| Kernel IA (transparencia) | Gaia AI, agent-readable claims |
| Destilación Conocimiento | Education, best practices, specs |

📁 Ver: `docs/HSCSG_INTEGRATION_ARCHITECTURE.md`

---

## 🌐 Gran Alianza por la Vida — 7 Holones

| Holón | Rol | Capacidad ALRAC |
|-------|-----|-----------------|
| **GAIA** | Ecosistema + Articulación + Territorio | Líneas A, C, D, E |
| **MYCELIUM** | Educación + Matching + Grafos | Línea B, D |
| **SYNCHROLABS** | Interoperabilidad protocolos | Línea C, E |
| **PROJECT WEAVE** | Identidad + Confianza + Credenciales | Línea A, D |
| **HSCSG** | Infra confianza/datos/intercambio | Línea E (core), todas |
| **PHI** | Educación holística integral | Línea B |
| **DATA TRUST** | Soberanía datos + gobernanza | Línea E, transversal |
| **BIOHABITATS** | Aplicación territorial física | Todas (grounding) |

📁 Ver: `docs/GRANALLIANZA_MAPPING.md`

---

## 🚀 Quick Start (Desarrollo Core)

```bash
# Clonar
git clone https://github.com/Isaacko0/Zeitnus-Firma-Operaciones-Ecotomica.git
cd Zeitnus-Firma-Operaciones-Ecotomica

# Instalar
npm install

# Verificar Core ALRAC (debe dar 0 errores)
npx tsc --noEmit 2>&1 | grep -E "(src/core/lib|src/core/state|src/core/hooks)"

# Explorar specs
ls openspec/specs/

# Ver docs maestros
cat docs/ALRAC_MASTER_INTEGRADO.md
cat docs/ZEITNUS_REGENERATIVE_MODEL.md
```

---

## 🛠️ Skills Hermes (Economic Research)

```bash
# Skills instaladas en ~/.hermes/skills/economic-research/
alrac-economic-research      # 4-agent + reviewer workflow
alrac-simulation-runner      # Pipeline 4-agent con datos sintéticos
alrac-spec-validator         # Valida OpenSpec ↔ TypeScript compliance
```

---

## 📜 Licencia

**MIT License** — Código abierto, soberano, verificable.

> **El código es territorio. La documentación es mapa. La verdad es el territorio.**

---

## 📍 Referencias Clave

| Documento | Qué Encuentras |
|-----------|----------------|
| `docs/ALRAC_MASTER_INTEGRADO.md` | Arquitectura completa, 12 colaboraciones, secuencia 90 días |
| `docs/ZEITNUS_REGENERATIVE_MODEL.md` | Video Samay Permacultura → ALRAC mapping |
| `docs/CAOS_MODELONEGOCIO_ANALISIS.md` | γ-CARMIS activo, Paso II template, 5 evasiones |
| `docs/ARCHITECTURE_DECISIONS.md` | 12 ADRs (MADR format) |
| `openspec/specs/SPEC_INDEXER.md` | Índice 19 specs con trazabilidad |
| `docs/simulacion_4agent_20260919/` | 5 escenarios + análisis comparativo |

---

## ⚡ Estado del Repositorio

```
Repo:        https://github.com/Isaacko0/Zeitnus-Firma-Operaciones-Ecotomica
Branch:      main (9861aff)
Core ALRAC:  ✅ 0 errores TypeScript
Specs:       19 (4 originales + 10 Capa 1 + 5 nuevas Capa 2-5)
Simulaciones: 5 escenarios documentados
γ-CARMIS:    🔴 ACTIVO (αʰ=0.12) — esperando Paso II real
HSCSG Sync:  ✅ alrac-coordinator en ambos repos
```

---

> **La pala y el teclado están en tus manos. E=V.**

*Última actualización: 2026-09-19 | Commit: 9861aff | γ-CARMIS: ACTIVO*