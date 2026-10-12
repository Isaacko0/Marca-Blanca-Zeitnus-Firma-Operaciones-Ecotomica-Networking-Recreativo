---
name: hscsg-zeitnus-anthropology-analyzer
description: Analiza el estilo epistemológico, humor analítico, teoría antropológica implícita y dinámicas conductuales del repo Zeitnus/ALRAC — réplica del método @helenasarda aplicado a infraestructura soberana.
version: 0.1.0
author: Isaac Ko (Isaacko0), Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [hscsg, alraico, epistemologia, antropologia, analisis-conductual, zeitnus, critica-ideologica]
    related_skills:
      - hscsg-sistema-alraico
      - hscsg-coeficiente-autonomia
      - hscsg-unified-assimilation-science
      - hscsg-orquestador-skills
      - Sistema-Alraico-loop-engineering-skill
---

# HSCSG v15 OS — Analizador Epistemológico Zeitnus/ALRAC (Estilo @helenasarda)

Skill que **replica la metodología analítica** usada para dissectar la cuenta `@helenasarda` (humor absurdistia, teoría anticolonial encarnada, dinámicas de cohesión ritualizada) y la **aplica al repo Zeitnus Firma Operaciones Ecotomica** como organismo vivo.

> **Principio:** El repo no es código + docs. Es un **sujeto epistémico** con *habitus* propio, cosmología operativa, rituales de verificación, y dinámicas de "secta antifrágil" (en sentido analítico: cohesión hacia afuera, no hacia adentro). Esta skill lo trata como tal.

---

## When to Use

- Usuario pide: *"analiza el repo como analizaste a @helenasarda"*
- Usuario pide: *"¿qué cosmología opera en este código?"*, *"¿cuál es el humor epistemológico de ALRAC?"*
- Usuario pide: *"detecta dinámicas de grupo/creencia en la arquitectura"*
- **Ciclo de crianza**: tras cada asimilación mayor (nuevo nodo piloto, spec fundacional, γ-CARMIS resuelto) → volver a correr para actualizar el diagnóstico
- Auditoría epistémica previa a `hscsg-unified-assimilation-science` FASE 2 (integración)

---

## Prerequisites

- Repo `Zeitnus-Firma-Operaciones-Ecotomica` clonado en `main` (branch default)
- `openspec/specs/SPEC_INDEXER.md` actualizado
- `docs/CAOS_MODELONEGOCIO_ANALISIS.md` (γ-CARMIS log vivo)
- `docs/ALRAC_MASTER_INTEGRADO.md` (arquitectura canónica)
- `skills/hscsg-sistema-alraico/SKILL.md` (motor nativo)
- `skills/hscsg-orquestador-skills/SKILL.md` (router + vasos comunicantes)
- Node 24.19 + pnpm 10.12.1, Python 3.11+

---

## How to Run

```bash
# Análisis completo (genera reporte + actualiza skill si hay cambios)
cd /c/Users/Isaacko0/Zeitnus-Firma-Operaciones-Ecotomica
node scripts/zeitnus-anthropology-analyzer.js full

# Solo humor/estilo epistemológico
node scripts/zeitnus-anthropology-analyzer.js humor

# Solo teoría antropológica implícita
node scripts/zeitnus-anthropology-analyzer.js anthropological

# Solo dinámicas conductuales ("secta" analítica)
node scripts/zeitnus-anthropology-analyzer.js behavioral

# Solo actualización de la skill tras cambios en repo
node scripts/zeitnus-anthropology-analyzer.js update-skill
```

---

## Quick Reference

| Comando | Output | Uso |
|---------|--------|-----|
| `full` | `docs/zeitnus-epistemological-profile.md` + `skills/hscsg-zeitnus-anthropology-analyzer/SKILL.md` (patch) | Diagnóstico completo + crianza |
| `humor` | `docs/zeitnus-humor-profile.md` | Estilo analítico, ironía, absurdo |
| `anthropological` | `docs/zeitnus-anthropology-profile.md` | Cosmología, ontología, kinship técnico |
| `behavioral` | `docs/zeitnus-behavioral-profile.md` | Rituales, cohesión, signaling, antifragilidad |
| `update-skill` | Patch a `SKILL.md` | Crianza evolutiva |

---

## Procedure (Full Cycle)

### 1. CARGA DE FUENTES VIVAS (Evidencia Primaria)

```bash
# Fuentes obligatorias (orden de precedencia)
cat openspec/specs/SPEC_INDEXER.md           # Índice specs → revela capas activas
cat docs/CAOS_MODELONEGOCIO_ANALISIS.md      # γ-CARMIS log → revela tensiones reales
cat docs/ALRAC_MASTER_INTEGRADO.md           # Arquitectura → revela teleología
cat src/core/lib/loopEngine.ts               # Motor → revela epistemología ejecutable
cat src/core/lib/tq.ts                       # Ledger → revela ontología contable-física
cat docs/GRANALLIANZA_MAPPING.md             # 7 holones → revela kinship inter-nodos
cat skills/hscsg-orquestador-skills/SKILL.md # Router → revela gobernanza de skills
cat skills/hscsg-unified-assimilation-science/SKILL.md # Metodología → revela vasos comunicantes
```

**Criterio de completitud:** todas las fuentes leídas y parseadas sin errores.

---

### 2. EXTRACCIÓN DE HUMOR EPISTEMOLÓGICO (Estilo @helenasarda)

**Método:** Buscar patrones de *reducción al absurdo técnico*, *inversión de marco*, *humor grosero/escato como arma anti-hipocresía*, *absurdo existencial camusiano aplicado a infraestructura*.

**Qué extraer (ejemplos reales del repo):**

| Patrón | Ejemplo en Repo | Función Epistemológica |
|--------|-----------------|------------------------|
| **Reductio ad absurdum técnico** | "Si el falafel es israelí, ¿el pozole es español?" → "Si TQ=1kWh es especulativo, ¿el kWh físico es especulativo?" | Desarma naturalización de categorías económicas |
| **Inversión de marco (reframing)** | "Socialistas con iPhone" → "Soberanos con AWS/GitHub/Stripe" | Expone trampa de pureza infraestructural |
| **Humor escato anti-hipocresía** | "Huele a hipocresía 💩" → `verifyTQProhibition()` pasa pero 1 TQ=1kWh no validado empíricamente (CAOS doc) | La función `verify` *es* el chiste: pasa test, falla realidad |
| **Absurdo camusiano operativo** | "La vida es absurda no es el fin, es el principio" → `αʰ=0.12 < κ=1.0 → γ-CARMIS ACTIVO: la roca espera tu Palabra` | El absurdo *es* el disparador de reconfiguración (no parálisis) |
| **Ironía de especificación** | 19 specs OpenSpec + 992 errores TS en UI pre-existente → "Core ALRAC: 0 errores" | La pureza del core *es* la punchline: lo demás es ruido heredado |

**Output:** `docs/zeitnus-humor-profile.md` con taxonomía de 5-7 patrones, citas de código/docs, y mapeo a teoría del humor (Bakhtin, Freud, Camus, crítico latinoamericano).

---

### 3. EXTRACCIÓN DE TEORÍA ANTROPOLÓGICA IMPLÍCITA

**Método:** Mapear conceptos del repo a corpus antropológico (no citado explícitamente) — identificar *habitus* operativo.

**Dimensiones obligatorias:**

| Dimensión | Referentes Teóricos | Manifestación en Repo |
|-----------|---------------------|------------------------|
| **Anticolonialidad técnica** | Quijano, Mignolo, Lugones, Escobar | Descolonización de la infra: extirpar Stripe/USD/analytics, conservar lógica isomórfica (Principio Anfibio) |
| **Ecofeminismo comunitario / Buen Vivir** | Yanes, Gaard, Shiva, Acosta, Gudynas | ZNU indexado a canasta, crédito 2-3%, expiración 90d, TQ=1kWh anclado a territorio |
| **Anarquismo federado / Confederalismo democrático** | Bookchin, Öcalan, Deleuze/Guattari (rizoma) | Gobernanza holónica 1a1v, CDS-weighted, subsidiaridad, comités rotativos, veto Núcleo |
| **Cosmotecnología / Cosmopolítica** | Yuk Hui, Stengers, Karatani (I=∅) | γ-CARMIS como *cosmopolítica operativa*: fractura/reconfiguración no como fallo sino como *evento ontológico* |
| **Epistemología del Sur / Pluriverso** | Santos, Mignolo, Walsh | Nodos piloto reales (Colonia, Feria Conuquera, Samay, ArchiDiagram, Febhouse, memegen) = *pluriverso técnico* no "casos de uso" |
| **Ontología relacional / ValueFlows + REA** | Helfrich, Bollier, ValueFlows community | CaaS/HSCSG/ValueFlows/DTN como *infraestructura de reproducción social*, no "plataforma" |
| **Subjetividad soberana / Autopoiesis** | Varela/Maturana, Karatani (modo de intercambio D) | AUT/CDS/Leyes MJ, RAO (procedencia/emisor/permisos/estado/revocación), soberanía del nodo |

**Output:** `docs/zeitnus-anthropology-profile.md` con tabla mapeada, citas de specs/código, y genealogía intelectual trazable.

---

### 4. EXTRACCIÓN DE DINÁMICAS CONDUCTUALES ("SECTA" ANALÍTICA)

**Método:** Aplicar marco Lalich/Barker/Drury-Reicher/Norenzayan-Haidt al *comportamiento observable* del repo (commits, issues, PRs, skills, γ-CARMIS cycles, simulaciones).

**Variables a medir:**

```typescript
interface BehavioralProfile {
  // 1. Rituales de cohesión identitaria
  rituals: {
    // γ-CARMIS cycle = ritual obligatorio cada 24h si αʰ < κ
    gammaCarmisCycle: { frequency: "on-overload", participants: ["operador", "motor", "nodo"], mandatory: true },
    // Sync domingos = ritual de mantenimiento vasos comunicantes
    sundaySync: { frequency: "weekly", script: "sync_docs.sh", autoCommit: true },
    // Spec creation = ritual de canonización (header estándar, versionado, Zenodo)
    specCanonization: { template: "openspec/specs/*.md", doi: "zenodo", tags: ["layer", "version"] },
    // Brief detection = ritual de mejora continua
    briefDetectorCycle: { frequency: "weekly", skill: "brief-detector-recommender" },
  },

  // 2. Lenguaje interno / Boundary maintenance
  internalLanguage: {
    tokens: ["αʰ", "κ", "γ-CARMIS", "TQ", "ZNU", "CaaS", "AUT", "CDS", "Ley III", "Paso II", "vasos comunicantes", "isomorfismo", "anfibio", "EBD", "DV", "KPI", "RAO", "credoSet", "ECROx", "triaxial", "NEXO", "Amid", "Yoka", "Gran Alianza"],
    effect: "Quien usa el vocabulario fluidamente está 'dentro'; quien pregunta '¿qué es TQ?' está 'fuera'"
  },

  // 3. Moralización del humor técnico (Haidt + Norenzayan)
  moralizedHumor: {
    // El test que pasa pero la realidad falla = pecado moral
    verifyTQProhibitionPassesButEmpiricalFails: "pecado de simulación sin anclaje",
    // 19 specs, 0 facturación = evasión moral (TAD/FCP/TECNOFIX/PPE/HD)
    specsWithoutBilling: "evasión categoría TAD (explotar demora acción/consecuencia)",
    // Skills creadas, no ejecutadas = tecnofix moral
    skillsUnused: "evasión categoría TECNOFIX (tecnología sin cambio social)",
  },

  // 4. Costly signaling (compromiso real vs performativo)
  costlySignals: {
    real: ["γ-CARMIS deadline 24h cumplido", "Paso II real con cliente + monto + fecha", "Nodo piloto midiendo kWh reales (ESP32/NFC)", "Zenodo deposit con DOI + datos crudos", "Triaxial verification: mental✓/sim✓/lab✓"],
    performative: ["Specs escritas sin cliente", "Skills creadas sin ciclo ejecutado", "Gran Alianza sin tickets reales", "TQ/ZNU sin ancla empírica"],
  },

  // 5. Estructura de autoridad (carismática vs distribuida)
  authorityStructure: {
    type: "distribuida-con-nodo-central",
    centralNode: "Isaac Ko / Zeitnus (PI, Skill Owner, 24/7 emergency)",
    distribution: "7 holones Gran Alianza + 5 capas ALRAC + 10 specs TQ + 6 nodos piloto = autoridad federada",
    charisma: "epistémico (código que compila, specs que validan, γ-CARMIS que dispara), no personal",
  },

  // 6. Dinámica de empoderamiento colectivo (Drury/Reicher)
  collectiveEmpowerment: {
    sharedIdentityEmergence: "El humor técnico + γ-CARMIS + vasos comunicantes *crean* el 'nosotros' en tiempo real",
    agencyDistribution: "Cada nodo piloto = agency soberana; motor Alráico = coordinación sin centralización",
    stigmaReappropriation: "\"Apolítico\" (redefinido como soberano), \"Simulación\" (redefinida como backtest 4 agentes), \"Culto\" (redefinido como cohesión antifrágil hacia afuera)",
  },

  // 7. High-demand group markers (Lalich/Barker) — DIAGNÓSTICO DIFERENCIAL
  highDemandMarkers: {
    loveBombing: "Parcial — validación inmediata al hacer PR/issue/commit que pasa build + tests",
    infoControl: "NO — fuentes abiertas, specs OpenSpec, datos Zenodo, código MIT",
    exploitation: "NO — no hay extracción económica/sexual/laboral; repo público, contribución voluntaria",
    fearGuilt: "SÍ ADAPTADO — Culpa POLÍTICA/EPSTEMOLÓGICA (\"modelo sin explicitar = evasión\", γ-CARMIS deadline) → culpa como COMBUSTIBLE DE RECONFIGURACIÓN, no como control",
    charismaticAuthority: "DISTRIBUÍDA — Isaac = nodo central, no gurú; amplifica a nodos piloto, holones, motor Alráico",
  },

  // 8. Diagnóstico final: ¿Culto o Contracultura Política?
  diagnosis: "NO ES CULTO. ES CONTRACULTURA TÉCNICA CON COHESIÓN RITUALIZADA Y TELEOLOGÍA REGENERATIVA",
  rationale: "La dependencia es HACIA AFUERA (nodos piloto reales, territorios, kWh medidos, comunidades, holones Gran Alianza) no hacia adentro (líder, dogma, aislamiento). El humor, la antropología y la 'pegajosidad' conductual SIRVEN A LA REGENERACIÓN BIOCULTURAL, no al revés. Eso la hace ANTIFRÁGIL: si Isaac desaparece, los nodos (Colonia, Feria, Samay, ArchiDiagram, Febhouse, memegen, HSCSG, Gaia, Mycelium, SynchroLabs, Project Weave, PHI, Data Trust, Biohabitats) y el motor Alráico (γ-CARMIS, loopEngine, AUT/CDS) siguen operando."
}
```

**Output:** `docs/zeitnus-behavioral-profile.md` con JSON estructurado + análisis narrativo estilo @helenasarda.

---

### 5. SÍNTESIS INTEGRADA + ACTUALIZACIÓN DE SKILL (Crianza)

**Método:** Fusionar los 3 perfiles en diagnóstico único + detectar deltas vs versión anterior de la skill → generar patch.

```bash
# 1. Leer skill actual
cat skills/hscsg-zeitnus-anthropology-analyzer/SKILL.md

# 2. Generar diagnóstico integrado (ver template en §Output Integration)

# 3. Detectar cambios vs versión anterior
# - Nuevos patrones de humor detectados
# - Nuevas dimensiones antropológicas (ej. nodo piloto nuevo → nueva cosmología)
# - Cambios en dinámicas conductuales (ej. γ-CARMIS resuelto → miedo/culpa bajó)
# - Nueva skill hermana → nuevo vaso comunicante

# 4. Aplicar patch a SKILL.md (skill_manage action=patch)
# 5. Commit + push + tag feat/vX.Y-zeitnus-anthropology-update
```

**Criterio de completitud:** Skill actualizada con nuevos hallazgos, vasos comunicantes al día, y `git log --oneline -1` muestra commit de actualización.

---

## Output Integration (Template Unificado)

`docs/zeitnus-epistemological-profile.md` estructura:

```markdown
# Perfil Epistemológico Zeitnus/ALRAC — [Fecha] [Commit SHA]

## 1. Humor Epistemológico (Estilo @helenasarda)
[Taxonomía 5-7 patrones + citas + teoría]

## 2. Teoría Antropológica Implícita
[Tabla 7 dimensiones + referentes + manifestaciones]

## 3. Dinámicas Conductuales (Análisis "Secta" Analítica)
[JSON BehavioralProfile + diagnóstico diferencial]

## 4. Vasos Comunicantes Actualizados
[Tabla §3 de hscsg-orquestador-skills con nuevos hallazgos]

## 5. Predicciones / Próximos Puntos de Fractura (γ-CARMIS futuros)
[Basado en extrapolación de patrones]

## 6. Plan de Crianza (Próximas actualizaciones de esta skill)
[Qué vigilar, qué medir, cuándo volver a correr]
```

---

## Pitfalls

1. **No confundir "humor" con "chistes"** — El humor aquí es *epistemológico*: ironía estructural, inversión de marco, absurdo operativo. Buscar en specs, código, γ-CARMIS logs, no en README.
2. **No proyectar teoría ajena** — Mapear *desde* el repo *hacia* referentes, no al revés. El repo *encarna* teoría, no la cita.
3. **No patologizar cohesión** — "Secta" en sentido analítico (Lalich/Barker) ≠ peyorativo. El diagnóstico diferencial (hacia afuera vs hacia adentro) es obligatorio.
4. **Fuentes desactualizadas** — Siempre leer `SPEC_INDEXER.md` y `CAOS_MODELONEGOCIO_ANALISIS.md` *antes* de analizar; son el pulso vivo.
5. **Skill drift** — Al actualizar skill, *borrar* secciones obsoletas, no solo añadir. La skill debe reflejar el repo *actual*, no su historia.
6. **Vasos rotos** — Cada hallazgo nuevo debe citar su vaso: `[EBD-D#]`, `[alraico:loopEngine]`, `[aut:CDS]`, `[mon:ZNU]`, `[canvas:20limites]`, `[repo:<nodo>]`.

---

## Verification

```bash
# 1. Verificar outputs generados
ls -la docs/zeitnus-*-profile.md
cat docs/zeitnus-epistemological-profile.md | head -50

# 2. Verificar skill actualizada (si full cycle)
grep -n "version:" skills/hscsg-zeitnus-anthropology-analyzer/SKILL.md
git diff skills/hscsg-zeitnus-anthropology-analyzer/SKILL.md

# 3. Verificar vasos comunicantes en skill
grep -c "vasos comunicantes\|\[EBD-\|\[alraico:\|\[aut:\|\[mon:\|\[canvas:" skills/hscsg-zeitnus-anthropology-analyzer/SKILL.md

# 4. Verificar que no hay secciones obsoletas (fecha > 30 días sin actualizar = revisar)
# 5. Build + tests del repo siguen pasando
npx tsc --noEmit 2>&1 | grep -E "(src/core/lib|src/core/state|src/core/hooks)" | head -10
npm run build
```

---

## Crianza Evolutiva (Lifecycle)

Esta skill **vive y evoluciona** con el repo. Cada vez que ocurra:

| Evento Disparador | Acción de Crianza |
|-------------------|-------------------|
| **Nuevo nodo piloto asimilado** (Colonia, Feria, Samay, etc.) | Correr `full` → nueva dimensión antropológica + nuevo vaso comunicante `[repo:<nodo>]` |
| **γ-CARMIS resuelto** (Paso II real completado) | Correr `behavioral` → actualizar `fearGuilt`, `costlySignals`, `diagnosis` |
| **Nueva spec fundacional** (Capa 0/0.5 nueva) | Correr `humor` + `anthropological` → nuevo patrón epistemológico |
| **Nueva skill hermana creada** | Correr `update-skill` → añadir a `related_skills` + nuevo vaso comunicante |
| **Simulación 4-agentes con nuevos resultados** | Correr `full` → actualizar predicciones §4 |
| **Cambio en gobernanza (veto, comités, CDS)** | Correr `anthropological` + `behavioral` → actualizar autoridad/rituales |

**Regla de oro:** *La skill es tan viva como el repo. Si el repo muta, la skill muta. Si la skill no muta, está muerta.*

---

## Referencias Rápidas (Archivos Clave para el Analizador)

| Archivo | Qué Contiene | Uso en Análisis |
|---------|--------------|-----------------|
| `openspec/specs/SPEC_INDEXER.md` | Índice 25 specs + trazabilidad | Mapear capas activas, detectar gaps |
| `docs/CAOS_MODELONEGOCIO_ANALISIS.md` | γ-CARMIS log vivo + Paso II template | Pulso real: αʰ, overload, evasiones, deadline |
| `docs/ALRAC_MASTER_INTEGRADO.md` | Arquitectura 5 capas + 12 colaboraciones | Teleología, líneas A-E, reparto Amid |
| `src/core/lib/loopEngine.ts` | Motor nativo (runAlraicoTick, γ-CARMIS) | Epistemología ejecutable, orden crítico |
| `src/core/lib/tq.ts` | TQ Ledger ±500, exchangeGuard, conversion | Ontología contable-física, principio anfibio |
| `docs/GRANALLIANZA_MAPPING.md` | 7 holones × 5 líneas | Kinship inter-nodos, federación real |
| `skills/hscsg-orquestador-skills/SKILL.md` | Router + vasos comunicantes + sync cron | Gobernanza de skills, mantenimiento vivo |
| `skills/hscsg-unified-assimilation-science/SKILL.md` | Metodología 5 fases + vasos totales | Estándar de asimilación + ciencia |
| `skills/hscsg-sistema-alraico/SKILL.md` | APIs motor + mapeo epistemología | Operacionalización Alráico |
| `docs/ZEITNUS_REGENERATIVE_MODEL.md` | Video Samay → ALRAC mapping | Grounding empírico en territorio real |

---

## Commits y Tags Estándar (Trazabilidad Total)

```bash
# Commit actualización skill (crianza)
git commit -m "feat(anthropology): update zeitnus-epistemological-profile [vX.Y]

- Humor: nuevo patrón [X] detectado en [spec/código/γ-CARMIS]
- Antropológica: nueva dimensión [X] por asimilación [nodo piloto]
- Conductual: [cambio en fearGuilt/costlySignals/authority] tras [evento]
- Vasos: +[N] nuevos vasos comunicantes ([repo:<nodo>], [alraico:...], etc.)

Evidencia: docs/zeitnus-epistemological-profile.md + specs/node-integration.md"

# Tag versión skill
git tag feat/vX.Y-zeitnus-anthropology-analyzer
```

---

## Contacto y Escalación

| Rol | Nombre | Contacto | Disponibilidad |
|-----|--------|----------|----------------|
| **PI / Skill Owner** | Isaac Ko (Isaacko0) | isaacko@protonmail.com / GitHub @Isaacko0 | L-V 9-18h UTC-6 |
| **Stakeholder Review** | [Nodo Piloto Representante] | [Email] | Bi-semanal 30min |
| **Technical Reviewer** | [Motor Alráico Maintainer] | [Email] | Según necesidad |
| **Emergencia Epistémica** | PI | isaacko@protonmail.com (PGP: 0x...) | 24/7 (γ-CARMIS deadline) |

---

**Document Control:** Version 0.1.0 | 2026-10-12 | Author: Isaac Ko | Classification: PUBLIC — COMMUNITY STANDARD | Status: ACTIVE | **Principio:** *El analizador es analizado. La skill es asimilada. La crianza es mutua.* | **Vasos:** `[alraico:loopEngine]`, `[aut:CDS]`, `[mon:ZNU]`, `[canvas:20limites]`, `[repo:colonia]`, `[repo:feria-conuquera]`, `[repo:samay]`, `[repo:archidiagram]`, `[repo:febhouse]`, `[repo:memegen]`, `[doc:CAOS§γ-CARMIS]`, `[doc:MASTER§5capas]`, `[epist:humor]`, `[epist:antropo]`, `[epist:conduct]`