---
name: brief-detector-recommender
description: Detecta gaps, recomienda briefs, proyecta necesidades y extrapola patrones; invocable por orchestrator.
version: 0.1.0
author: Isaac Ko (Isaacko0), Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [hscsg, briefs, detector, recommender, projection, extrapolation, orchestration]
    related_skills: [hscsg-next-steps-orchestrator, hscsg-gaia-mycelium-integration, hermes-agent-skill-authoring, plan]
---

# Brief Detector & Recommender Skill

Skill que detecta gaps en la documentación, recomienda briefs prioritarios, proyecta necesidades futuras y extrapola patrones de asimilación. Diseñada para ser invocada por `hscsg-next-steps-orchestrator` como parte del ciclo de mejora continua.

## When to Use

- Tras cada asimilación de repo/proyecto (trigger automático via orchestrator)
- Cuando el orchestrator detecta que `BRIEFS_INDEX.md` está desactualizado
- Usuario pide "¿qué briefs faltan?" o "¿qué brief crear ahora?"
- Ciclo semanal de mantenimiento de documentación
- Antes de planificar próxima asimilación (input para decisión)

## Prerequisites

- Repo `HSCSG_v15_OS` clonado en `master`
- `docs/BRIEFS_INDEX.md` existente y parseable
- `docs/BRIEF_EXHAUSTIVO_HSCSG_COSATECA_OS.md` como referencia fundacional
- `docs/fuentes_indice.json` con fuentes asimiladas
- Node 24.19 + pnpm 10.12.1, Python 3.11+

## How to Run

```bash
# Invocación desde orchestrator (recomendada)
node scripts/brief-detector-recommender.js detect
node scripts/brief-detector-recommender.js recommend
node scripts/brief-detector-recommender.js project
node scripts/brief-detector-recommender.js extrapolate
node scripts/brief-detector-recommender.js full-cycle

# O via terminal tool directo:
# terminal(command="cd /c/Users/Isaacko0/HSCSG_v15_OS && node scripts/brief-detector-recommender.js full-cycle", timeout=120)
```

## Quick Reference

| Comando | Acción |
|---------|--------|
| `detect` | Escanea `BRIEFS_INDEX.md` + `fuentes_indice.json` + repo → detecta gaps, duplicados, desactualizados |
| `recommend` | Basado en gaps + prioridad estratégica → lista briefs recomendados con prioridad P0/P1/P2 |
| `project` | Proyecta necesidades a 30/60/90 días basado en roadmap + gaps + tendencias |
| `extrapolate` | Extrapola patrones de asimilación → predice próximos repos, skills, briefs |
| `full-cycle` | Ejecuta detect → recommend → project → extrapolate → genera reporte + actualiza `BRIEFS_INDEX.md` |

## Architecture

### Input Sources (Parsed Automatically)

1. **`docs/BRIEFS_INDEX.md`** — Índice actual (parse markdown tables)
2. **`docs/fuentes_indice.json`** — Fuentes asimiladas + estado
3. **`docs/BRIEF_EXHAUSTIVO_HSCSG_COSATECA_OS.md`** — Brief fundacional (gaps vs visión)
4. **`scripts/orchestrator-next-steps.js`** — Workstreams activos + tasks pendientes
5. **`package.json` + `src/`** — Código actual (módulos implementados vs gaps)
6. **`skills/`** — Skills desplegadas vs pendientes
6. **Git history** — Últimas asimilaciones (patrón temporal)

### Core Algorithms

#### 1. Gap Detection (Detect)
```python
# Pseudocode
gaps = []
# 1. Fuentes en fuentes_indice.json con estado ⏳ Pendiente → gap BI-XXX
# 2. Briefs en BRIEFS_INDEX.md con estado 🔴 P0 Pendiente → gap SM-XXX
# 3. Módulos en src/core/lib/ vs briefs BF-040+ → módulos sin spec
# 4. Skills en skills/ vs briefs BF-050+ → skills sin doc
# 5. Vasos comunicantes en orchestrator vs specs BF-043 → vasos sin spec
# 6. Proyectos en fuentes_indice.json sin backup/integration → gap BI-XXX
# 7. Terms en "Madurez por Término" con 🔴/🟡 sin brief asociado → gap
# 8. Dupes: mismo concepto en múltiples briefs sin consolidación
```

#### 2. Recommendation Engine (Recommend)
```python
# Score = (Strategic_Value * 0.4) + (Unblock_Factor * 0.3) + (Effort_Inverse * 0.2) + (Dependency_Count * 0.1)
# Strategic_Value: 1-10 (alineación con visión BF-001)
# Unblock_Factor: cuántos workstreams/tasks desbloquea
# Effort_Inverse: 1/estimated_days (menos esfuerzo = más score)
# Dependency_Count: cuántos otros briefs dependen de este
```

#### 3. Projection (Project)
```python
# Horizon 30d: gaps P0 + workstreams activos en orchestrator
# Horizon 60d: gaps P1 + términos 🟡 en "Madurez por Término" + skills pendientes
# Horizon 90d: visión BF-001 (fases 0-D) + tendencias asimilación (1 repo/2 sem aprox)
```

#### 4. Extrapolation (Extrapolate)
```python
# Patrones detectados:
# - Frecuencia asimilación: 1 repo / 2 semanas (basado en git history)
# - Tipos de repo: identidad > gobernanza > economía > infra > IA > social
# - Briefs por repo: 2 (backup + integration) + 0-3 specs + 0-1 skill
# - Skills por workstream: 1 por capability crítica
# Predicción: próximos 3 repos probables, 6-8 briefs, 1-2 skills
```

### Output Format

#### Detection Report (`brief-detection-report.json`)
```json
{
  "timestamp": "2026-08-22T10:00:00Z",
  "gaps_detected": [
    {"id": "BI-012", "type": "backup_missing", "source": "Copiosis v7.1", "priority": "P0", "related_briefs": ["BF-001§2.17"]},
    {"id": "SM-044", "type": "spec_missing", "module": "lib/netbenefit.ts", "priority": "P0", "workstream": "GAIA_INTEGRATION"},
    {"id": "SK-004", "type": "skill_missing", "capability": "netbenefit", "priority": "P0"}
  ],
  "duplicates": [],
  "outdated": [{"brief": "BF-030", "reason": "incomplete per index"}],
  "stats": {"total_gaps": 15, "P0": 8, "P1": 4, "P2": 3}
}
```

#### Recommendation List (`brief-recommendations.md`)
```markdown
# Briefs Recomendados (Orden de Prioridad)

## P0 — Críticos (Desbloquean workstreams activos)
1. **BI-012/013** — `copiosis_backup.md` + `copiosis_integration.md` (desbloquea GAIA_INTEGRATION + BF-044/045/046)
2. **BI-014/015** — `conway_automaton_backup.md` + `conway_automaton_integration.md` (desbloquea Autómata Soberano + BF-044)
3. **SM-044/045/046** — Specs `netbenefit`, `cds_jurados`, `copiosis` (requeridos por GAIA_INTEGRATION)

## P1 — Importantes (Próximos 30 días)
4. **BI-016/017** — `onemanco_backup.md` + `onemanco_integration.md` (Runtime empresarial)
5. **BF-030** — Completar `contento_deseOS_analysis.md` (auto-llenado + roles)

## P2 — Estratégicos (Próximos 90 días)
6. **BI-018/019** — Integral Collective
7. **BI-020** — DisCO
...
```

#### Projection Report (`brief-projection-30-60-90.md`)
```markdown
# Proyección de Necesidades de Briefs

## 30 días (Próximo Sprint)
- Completar P0 specs (BF-044/045/046) para GAIA_INTEGRATION
- Asimilar Copiosis + Conway (2 repos, 4 briefs)
- Crear skills para netbenefit, cds_jurados, copiosis

## 60 días
- Asimilar OneManCompany (2 briefs + 1 skill)
- Completar specs Autómata (SOUL, E²R, Spawn)
- Migrar valueDual.ts → lib/ (economía anfibia)

## 90 días (Visión BF-001 Fases 0-A)
- Asimilar Integral Collective + DisCO + FABSHIP
- Pipeline P1→P10 (DeseOS) → 11 módulos + auto-llenado
- Skills para todos los módulos core
- Meta: 30+ briefs completados, 8 skills desplegadas
```

#### Extrapolation Report (`brief-extrapolation.md`)
```markdown
# Extrapolación de Patrones de Asimilación

## Patrones Detectados (basado en 10 asimilaciones previas)

### Frecuencia
- **1 repo / 2 semanas** (git history: 10 repos en 20 semanas)
- **Ciclo completo**: 2-3 semanas (backup + integration + specs + skill + PR)

### Distribución de Tipos de Repo
1. **Identidad/Gobernanza** (30%): OpenBot, Conway, OneManCompany, Integral
2. **Economía** (20%): Copiosis, DisCO, FABSHIP
3. **Infra/Comms** (20%): neko, **Discovery Layer**, Project Weave
4. **IA/Inteligencia** (15%): Autómata, CoachFAB, Weave
4. **Social/Ecosistema** (15%): Hylo, navteka, DisCO, FABSHIP

### Briefs por Repo (Promedio)
- 2 BI (backup + integration)
- 1-3 SM (specs técnicos)
- 0-1 SK (skill si capability crítica)
- 0-1 BF (frontend/UX si aplica)
- **Total: 4-7 briefs por repo**

#### Extrapolation Report (`brief-extrapolation.md`)

```markdown
# Extrapolación de Patrones de Asimilación

## Patrones Detectados (basado en 10 asimilaciones previas)

### Frecuencia
- **1 repo / 2 semanas** (git history: 10 repos en 20 semanas)
- **Ciclo completo**: 2-3 semanas (backup + integration + specs + skill + PR)

### Distribución de Tipos de Repo
1. **Identidad/Gobernanza** (30%): OpenBot, Conway, OneManCompany, Integral
2. **Economía** (20%): Copiosis, DisCO, FABSHIP
3. **Infra/Comms** (20%): neko, **Discovery Layer**, Project Weave
4. **IA/Inteligencia** (15%): Autómata, CoachFAB, Weave
4. **Social/Ecosistema** (15%): Hylo, navteka, DisCO, FABSHIP

### Briefs por Repo (Promedio)
- 2 BI (backup + integration)
- 1-3 SM (specs técnicos)
- 0-1 SK (skill si capability crítica)
- 0-1 BF (frontend/UX si aplica)
- **Total: 4-7 briefs por repo**

### Predicción Próximos 3 Repos (Probabilidad)
1. **Copiosis v7.1** (95%) — Gap P0 crítico, financiado por Gaia
2. **Conway Automaton** (90%) — Isomorfismo MJ, Autómata pendiente
3. **OneManCompany fork** (85%) — Runtime empresarial, Vessel+Talent
4. **Integral Collective** (80%) — Loop celular, arquitectura base

### Predicción Briefs Próximos 60 Días
- 8 BI (4 repos × 2)
- 12 SM (4 repos × 3 specs avg)
- 3 SK (1 por capability crítica)
- **Total estimado: 23 briefs nuevos**

### **NUEVA PREDICCIÓN: Libro Ecoaldeas Federadas v1.0 (LEF)**
**Probabilidad: 100%** — Ya asimilado como spec funcional, genera 13 specs P0/P1:
- LEF-energy-catalog, LEF-symmetric-limits, LEF-exchange-guard, LEF-conversion-factor
- LEF-product-federation, LEF-cross-node-pools, LEF-governance-3levels
- LEF-land-tenure, LEF-tax-fund, LEF-node-architecture, LEF-digital-sovereignty, LEF-progressive-autonomy

**Impacto**: +13 specs P0/P1, workstream LEF_SPECS nuevo, desbloquea autonomía completa

### Recomendación Estratégica Actualizada
- Priorizar Copiosis + Conway (desbloquean Autómata + GAIA_INTEGRATION)
- **Ejecutar LEF_SPECS workstream en paralelo** (13 specs, 26 días esfuerzo, valor 90+)
- Crear skill `lef-assimilation` antes de empezar specs
- Parallelizar: energy-catalog + symmetric-limits + exchange-guard (P0 paralelo)
- Parallelizar: conversion-factor + product-federation + cross-node-pools (P1 paralelo)
```

---

## Integration with Orchestrator

### Invocation from Orchestrator
```javascript
// En scripts/orchestrator-next-steps.js
async function runBriefDetector() {
  const { execSync } = require('child_process');
  const result = execSync('node scripts/brief-detector-recommender.js full-cycle', { 
    encoding: 'utf-8', 
    timeout: 120000 
  });
  console.log(result);
  // Parse output, update BRIEFS_INDEX.md, add tasks to orchestrator-state.json
}
```

### Orchestrator State Update
```json
// orchestrator-state.json
{
  "briefDetector": {
    "lastRun": "2026-08-22T10:00:00Z",
    "gapsDetected": 15,
    "recommendationsGenerated": 12,
    "projection30d": 5,
    "projection60d": 8,
    "projection90d": 15,
    "extrapolationNextRepos": ["Copiosis", "Conway", "OneManCompany"],
    "nextBriefsPredicted": 23,
    "lastReportPath": "docs/brief-detection-report.json"
  }
}
```

### Orchestrator Task Integration
```json
// En orchestrator-next-steps.js baseTasks
{
  "id": "BRIEF-detect",
  "title": "Ejecutar brief-detector-recommender full-cycle",
  "deps": [],
  "effort": 1,
  "value": 90,
  "workstream": "DOCUMENTATION",
  "source": "agent",
  "priority": 95,
  "blocks": ["BRIEF-create-P0"],
  "status": "pending"
}
```

---

## Implementation Specification

### Script Entry Point: `scripts/brief-detector-recommender.js`

```javascript
#!/usr/bin/env node
/**
 * Brief Detector & Recommender
 * Detecta gaps, recomienda briefs, proyecta necesidades, extrapola patrones
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const DOCS = path.join(ROOT, 'docs');
const SKILLS = path.join(ROOT, 'skills');
const SRC = path.join(ROOT, 'src');

class BriefDetectorRecommender {
  constructor() {
    this.state = {
      gaps: [],
      recommendations: [],
      projections: { "30d": [], "60d": [], "90d": [] },
      extrapolations: {}
    };
  }

  // 1. LOAD SOURCES
  loadSources() {
    this.briefsIndex = this.parseBriefsIndex(path.join(DOCS, 'BRIEFS_INDEX.md'));
    this.fuentes = JSON.parse(fs.readFileSync(path.join(DOCS, 'fuentes_indice.json'), 'utf-8'));
    this.briefExhaustivo = fs.readFileSync(path.join(DOCS, 'BRIEF_EXHAUSTIVO_HSCSG_COSATECA_OS.md'), 'utf-8');
    this.orchestrator = this.parseOrchestrator(path.join(ROOT, 'scripts', 'orchestrator-next-steps.js'));
    this.gitLog = this.getGitLog();
    this.skills = this.scanSkills();
    this.srcModules = this.scanSrcModules();
  }

  parseBriefsIndex(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    // Parse markdown tables → array of brief objects
    // Regex para tablas markdown con pipes
    const tables = content.match(/\|[\s\S]*?\|/g) || [];
    const briefs = [];
    tables.forEach(table => {
      const rows = table.trim().split('\n').slice(2); // skip header + separator
      rows.forEach(row => {
        const cols = row.split('|').map(c => c.trim()).filter(Boolean);
        if (cols.length >= 4) {
          briefs.push({
            id: cols[0],
            doc: cols[1],
            location: cols[2],
            status: cols[3],
            description: cols[4] || ''
          });
        }
      });
    });
    return briefs;
  }

  // ... more parsing methods

  // 2. DETECT GAPS
  detectGaps() {
    const gaps = [];
    
    // Gap type 1: Fuentes pendientes
    this.fuentes.forEach(f => {
      if (f.estado === '⏳ Pendiente') {
        this.state.gaps.push({
          id: `BI-${String(f.id).padStart(3,'0')}`,
          type: 'backup_missing',
          source: f.nombre,
          priority: 'P0',
          related_briefs: f.briefs_relacionados || []
        });
      }
    });

    // Gap type 2: Specs P0 pendientes
    this.briefsIndex.forEach(b => {
      if (b.status.includes('🔴') || b.status.includes('P0 Pendiente')) {
        this.state.gaps.push({
          id: `SM-${b.id.replace('BF-','')}`,
          type: 'spec_missing',
          module: b.description.match(/`([^`]+)`/)?.[1] || 'unknown',
          priority: 'P0',
          workstream: this.inferWorkstream(b)
        });
      }
    });

    // Gap type 3: Skills sin doc
    this.skills.forEach(s => {
      const hasDoc = this.briefsIndex.some(b => b.doc.includes(s.name));
      if (!hasDoc && s.category !== 'web') {
        this.state.gaps.push({
          id: `SK-${String(this.state.gaps.filter(g=>g.type==='skill_missing').length+1).padStart(3,'0')}`,
          type: 'skill_missing',
          capability: s.name,
          priority: 'P0'
        });
      }
    });

    // Gap type 4: Fuentes sin backup/integration
    this.fuentes.forEach(f => {
      if (f.estado === '⏳ Pendiente') {
        this.state.gaps.push({
          id: `BI-${String(f.id).padStart(3,'0')}`,
          type: 'backup_integration_missing',
          source: f.nombre,
          priority: 'P0',
          related_briefs: [`BF-001§${f.seccion_ref || 'N/A'}`]
        });
      }
    });

    // Gap type 5: Módulos sin spec
    this.srcModules.forEach(m => {
      const hasSpec = this.briefsIndex.some(b => b.description.includes(m));
      if (!hasSpec && !m.includes('test') && !m.includes('.d.ts')) {
        this.state.gaps.push({
          id: `SM-${String(this.state.gaps.filter(g=>g.type==='spec_missing').length+1).padStart(3,'0')}`,
          type: 'spec_missing',
          module: m,
          priority: 'P1',
          workstream: 'CORE'
        });
      }
    });

    return this.state.gaps;
  }

  // 3. RECOMMEND
  recommend() {
    const scored = this.state.gaps.map(g => ({
      ...g,
      score: this.calculateScore(g)
    })).sort((a,b) => b.score - a.score);

    this.state.recommendations = scored.map((g,i) => ({
      rank: i+1,
      ...g,
      rationale: this.generateRationale(g)
    }));
  }

  calculateScore(gap) {
    const strategic = this.strategicValue(gap);
    const unblocks = this.unblockFactor(gap);
    const effortInv = 1 / (this.estimateEffort(gap) || 1);
    const deps = this.dependencyCount(gap);
    return strategic * 0.4 + unblocks * 0.3 + effortInv * 0.2 + deps * 0.1;
  }

  strategicValue(gap) {
    // Alineación con BF-001 visión + workstreams activos
    const highValueWorkstreams = ['GAIA_INTEGRATION', 'P0_SPECS', 'COACH', 'MIGRATION'];
    if (highValueWorkstreams.some(w => gap.workstream === w)) return 10;
    if (gap.priority === 'P0') return 9;
    if (gap.priority === 'P1') return 7;
    return 5;
  }

  unblockFactor(gap) {
    // Cuántos tasks/briefs dependen de este
    const blocks = this.orchestrator.tasks.filter(t => t.deps?.includes(gap.id)).length;
    return Math.min(blocks * 2, 10);
  }

  estimateEffort(gap) {
    if (gap.type === 'backup_missing') return 3; // días
    if (gap.type === 'integration_missing') return 4;
    if (gap.type === 'spec_missing') return 2;
    if (gap.type === 'skill_missing') return 2;
    return 3;
  }

  dependencyCount(gap) {
    return this.orchestrator.tasks.filter(t => t.deps?.includes(gap.id)).length;
  }

  // 4. PROJECT
  project() {
    const now = new Date();
    const horizons = { "30d": [], "60d": [], "90d": [] };
    
    this.state.recommendations.forEach(r => {
      const effort = this.estimateEffort(r);
      const startDays = this.calculateStartDays(r);
      const endDays = startDays + effort;
      
      if (endDays <= 30) horizons["30d"].push(r);
      else if (endDays <= 60) horizons["60d"].push(r);
      else horizons["90d"].push(r);
    });
    
    this.state.projections = horizons;
  }

  // 5. EXTRAPOLATE
  extrapolate() {
    // Análisis de git log para frecuencia
    const freq = this.calculateAssimilationFrequency();
    const repoTypes = this.classifyRepos();
    const briefsPerRepo = this.calculateBriefsPerRepo();
    
    this.state.extrapolations = {
      frequency: freq,
      repoTypes: repoTypes,
      briefsPerRepo: briefsPerRepo,
      nextRepos: this.predictNextRepos(3),
      briefsNext60Days: this.predictBriefs(60),
      strategicAdvice: this.generateStrategicAdvice()
    };
  }

  // 6. GENERATE OUTPUTS
  generateOutputs() {
    const timestamp = new Date().toISOString();
    
    // 1. Detection Report
    fs.writeFileSync(
      path.join(DOCS, 'brief-detection-report.json'),
      JSON.stringify({ timestamp, gaps: this.state.gaps }, null, 2)
    );

    // 2. Recommendations
    const recMd = this.generateRecommendationsMd();
    fs.writeFileSync(path.join(DOCS, 'brief-recommendations.md'), recMd);

    // 3. Projections
    const projMd = this.generateProjectionsMd();
    fs.writeFileSync(path.join(DOCS, 'brief-projection-30-60-90.md'), projMd);

    // 4. Extrapolation
    const extraMd = this.generateExtrapolationMd();
    fs.writeFileSync(path.join(DOCS, 'brief-extrapolation.md'), extraMd);

    // 5. Update BRIEFS_INDEX.md (append new recommended briefs as pending)
    this.updateBriefsIndex();

    // 5. Summary for orchestrator
    console.log(JSON.stringify({
      gapsDetected: this.state.gaps.length,
      recommendations: this.state.recommendations.length,
      projections: {
        "30d": this.state.projections["30d"].length,
        "60d": this.state.projections["60d"].length,
        "90d": this.state.projections["90d"].length
      },
      extrapolation: {
        nextRepos: this.state.extrapolations.nextRepos,
        briefsNext60Days: this.state.extrapolations.briefsNext60Days
      }
    }, null, 2));
  }

  // MAIN
  async run(command = 'full-cycle') {
    console.log(`🔍 Brief Detector & Recommender — ${command}`);
    this.loadSources();
    
    if (command === 'detect' || command === 'full-cycle') {
      this.detectGaps();
      console.log(`✅ Detect: ${this.state.gaps.length} gaps found`);
    }
    if (command === 'recommend' || command === 'full-cycle') {
      this.recommend();
      console.log(`✅ Recommend: ${this.state.recommendations.length} briefs prioritized`);
    }
    if (command === 'project' || command === 'full-cycle') {
      this.project();
      console.log(`✅ Project: 30d=${this.state.projections["30d"].length}, 60d=${this.state.projections["60d"].length}, 90d=${this.state.projections["90d"].length}`);
    }
    if (command === 'extrapolate' || command === 'full-cycle') {
      this.extrapolate();
      console.log(`✅ Extrapolate: ${this.state.extrapolations.nextRepos.length} next repos predicted`);
    }
    if (command === 'full-cycle') {
      this.generateOutputs();
      console.log('✅ Full cycle complete. Reports written to docs/');
    }
  }
}

// CLI
const detector = new BriefDetectorRecommender();
const command = process.argv[2] || 'full-cycle';
detector.run(command).catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
```

---

## Skill Invocation from Orchestrator

### In `scripts/orchestrator-next-steps.js`
```javascript
// Add to command switch
case 'brief-detect':
  execSync('node scripts/brief-detector-recommender.js detect', { stdio: 'inherit' });
  break;
case 'brief-recommend':
  execSync('node scripts/brief-detector-recommender.js recommend', { stdio: 'inherit' });
  break;
case 'brief-project':
  execSync('node scripts/brief-detector-recommender.js project', { stdio: 'inherit' });
  break;
case 'brief-extrapolate':
  execSync('node scripts/brief-detector-recommender.js extrapolate', { stdio: 'inherit' });
  break;
case 'brief-full-cycle':
  execSync('node scripts/brief-detector-recommender.js full-cycle', { stdio: 'inherit' });
  break;
```

### Orchestrator Task for Continuous Improvement
```json
{
  "id": "BRIEF-detector-cycle",
  "title": "Ejecutar brief-detector-recommender full-cycle (semanal)",
  "deps": [],
  "effort": 1,
  "value": 85,
  "workstream": "DOCUMENTATION",
  "source": "agent",
  "priority": 80,
  "recurring": "weekly",
  "blocks": [],
  "status": "pending",
  "notes": "Actualiza BRIEFS_INDEX.md, detecta gaps, recomienda próximos briefs"
}
```

---

## Pitfalls

1. **Parsing markdown tables frágil** → Usar regex robustos + fallback a parsing línea por línea
2. **fuentes_indice.json puede estar desactualizado** → Verificar contra git log reciente
3. **Briefs en múltiples ubicaciones** → Buscar en `docs/`, `skills/`, `scripts/`, `src/`
4. **Extrapolación basada en pocos datos** → Marcar confidence level bajo hasta 20+ asimilaciones
4. **Actualización de BRIEFS_INDEX.md** → Hacer backup antes de escribir; validar markdown resultante
5. **Orchestrator state sync** → Asegurar que `orchestrator-state.json` se actualice después

---

## Verification

```bash
# Test rápido
node scripts/brief-detector-recommender.js detect
node scripts/brief-detector-recommender.js recommend
node scripts/brief-detector-recommender.js full-cycle

# Verificar outputs
cat docs/brief-detection-report.json
cat docs/brief-recommendations.md
cat docs/brief-projection-30-60-90.md
cat docs/brief-extrapolation.md

# Verificar BRIEFS_INDEX.md actualizado
grep -c "BF-" docs/BRIEFS_INDEX.md
```

---

## Related Skills

- `hscsg-next-steps-orchestrator` — Invoca esta skill, consume sus outputs
- `hscsg-gaia-mycelium-integration` — Consume gaps de GAIA_INTEGRATION
- `hermes-agent-skill-authoring` — Estándares para documentar nuevos briefs
- `plan` — Para crear plan detallado por brief recomendado

---

*Skill generada: 2026-08-22 | Invocable por `hscsg-next-steps-orchestrator` | Parte del ciclo de mejora continua HSCSG v15 OS*