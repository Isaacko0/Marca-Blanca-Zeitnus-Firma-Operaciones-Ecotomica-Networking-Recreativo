---
name: hscsg-dual-context-engine
category: hscsg
version: 1.0.0
description: Motor dual-context obligatorio HSCSG v15 OS (local+GitHub).
author: Isaacko0 / Zeitnus / HSCSG + Hermes Agent
---

# hscsg-dual-context-engine

**Motor de Contexto Dual Obligatorio** - Establece `~/HSCSG_Backups_Local/` (contexto local ilimitado) + `HSCSG_v15_OS/` (repo GitHub legal-safe) como base de conocimiento obligatoria para CUALQUIER consulta o prompt que mencione HSCSG v15 OS.

---

## Principio Fundamental
> **Toda interaccion sobre HSCSG v15 OS DEBE partir de AMBOS contextos simultaneamente**
> - Local = biblioteca cruda (backups, papers, libros completos, vault Obsidian)
> - GitHub = produccion curada (codigo legal-safe, skills, metricas, arquitectura)

---

## Arquitectura de Contextos

```
HSCSG v15 OS - DUAL CONTEXT ENGINE

LOCAL (~/HSCSG_Backups_Local/)
├── 91 backups *_backup.md
├── iambrainstorming_libro_completo.md (1.9MB)
├── onecommunity_global_backup_*.md
├── urbanika/*_backup.md (8 proyectos)
├── skills_archivadas/ (6 skills business VC)
├── papers_externos/ (PDFs, papers, vault Obsidian)
└── HSCSG_Work/notes/ (gitignored)
   ACCESO: Solo lectura, ilimitado
   USO: Investigacion, extraccion patrones

GITHUB (HSCSG_v15_OS/)
├── src/core/lib/ (loopEngine, metrics, valueDual)
├── skills/hscsg/ (15 skills soberanas)
├── docs/ (157 archivos transformativos)
├── scripts/legal-safe-check.sh
├── .git/hooks/pre-commit (bloqueo legal automatico)
   ACCESO: Lectura/escritura, legal-safe
   USO: Implementacion, commit, deploy
```

---

## Protocolo de Consulta Obligatorio

### ANTES de responder CUALQUIER prompt sobre HSCSG v15 OS:

```markdown
## CHECKLIST DUAL-CONTEXT

### 1. CONTEXTO GITHUB (Base Curada)
- Skills en skills/hscsg/ (leer OUR_SKILLS.md)
- Metricas en src/core/lib/metrics.ts
- Loops en src/core/lib/loopEngine.ts
- Arquitectura en hscsg_definition.md
- Validacion legal en LEGAL_SAFE_GUIDE.md

### 2. CONTEXTO LOCAL (Biblioteca Cruda)
- Backups relevantes en ~/HSCSG_Backups_Local/docs/
- Skills archivadas en ~/HSCSG_Backups_Local/skills_archivadas/
- Papers/vault en ~/HSCSG_Backups_Local/papers/
- Notas en ~/HSCSG_Work/notes/

### 3. SINTESIS OBLIGATORIA
- Respuesta integra: GitHub (curado) + Local (crudo) = respuesta completa
- Si sugiere codigo -> validar con legal-safe-check.sh
- Si sugiere investigacion -> referenciar backups locales + transformar a GitHub
```

---

## Flujo por Tipo de Consulta

### TIPO A: Investigacion / Exploracion
1. BUSCAR en LOCAL: find ~/HSCSG_Backups_Local -name "*.md" | xargs grep -l "X"
2. LEER backups relevantes (contexto completo, sin limites)
3. EXTRAER conceptos/patrones (NO copiar texto)
4. TRANSFORMAR a ontologia HSCSG (AUT/CDS/ZNU/gamma-CARMIS)
5. DOCUMENTAR en GitHub: docs/INVESTIGACION_X_HSCSG.md + ATTRIBUTIONS.md
6. VALIDAR: ./scripts/legal-safe-check.sh

### TIPO B: Implementacion / Codigo
1. LEER GitHub: skills/hscsg/, src/core/lib/, metrics.ts, loopEngine.ts
2. CONSULTAR Local: patrones en backups (buscar, no copiar)
3. DISENAR con ontologia HSCSG pura (sin metricas SaaS/VC)
4. IMPLEMENTAR en src/core/lib/ o skills/hscsg/
5. VALIDAR: ./scripts/legal-safe-check.sh (pre-commit automatico)
6. COMMIT: git add + commit (hook valida legal-safe)

### TIPO C: Decision Arquitectonica
1. BASE GITHUB: hscsg_definition.md (MATHEMAs, Principios, Anfibio)
2. BASE GITHUB: loopEngine.ts (6 loops, gamma-CARMIS, resonancia)
3. BASE GITHUB: metrics.ts (16 metricas soberanas)
4. BASE LOCAL: backups proyectos asimilados (Gaia, Breadchain, Colony)
5. SINTESIS: Respuesta = Principios GitHub + Patrones Local + Ontologia HSCSG
6. DOCUMENTAR en CHANGELOG.md + docs/

### TIPO D: Validacion / Auditoria
1. METRICAS GITHUB: TerritorialSovereigntyIndex (16 componentes)
2. SKILLS GITHUB: hscsg-viabilidad-territorial (umbrales AUT/CDS/ZNU)
3. LOOPS GITHUB: gamma-CARMIS (sobrecargas Sigma P_i > kappa)
4. PATRONES LOCAL: backups proyectos similares
5. VEREDICTO: PASS/FAIL con metricas concretas + brechas

---

## Archivos Clave de Referencia Rapida

| Contexto | Archivo | Contenido |
|----------|---------|-----------|
| GitHub Base | skills/OUR_SKILLS.md | 15 skills + indice |
| GitHub Base | src/core/lib/metrics.ts | 16 metricas soberanas |
| GitHub Base | src/core/lib/loopEngine.ts | 6 loops + gamma-CARMIS |
| GitHub Base | hscsg_definition.md | MATHEMAs, Principios, Anfibio |
| GitHub Base | docs/LEGAL_SAFE_GUIDE.md | Clasificacion legal 336 archivos |
| GitHub Base | docs/ATTRIBUTIONS.md | 9 fuentes transformadas fair use |
| Local Biblioteca | ~/HSCSG_Backups_Local/docs/ | 91 backups + libros |
| Local Biblioteca | ~/HSCSG_Backups_Local/skills_archivadas/ | 6 skills VC |
| Local Trabajo | ~/HSCSG_Work/notes/ | Notas gitignored |

---

## Regla de Oro para el Asistente

> **CADA VEZ que el usuario mencione HSCSG v15 OS, el asistente DEBE:**
> 1. Asumir que AMBOS contextos estan activos
> 2. Consultar GitHub base (skills, metricas, loops, arquitectura, legal)
> 3. Consultar Local biblioteca (backups, papers, skills archivadas) cuando sea relevante
> 4. Sintetizar respuesta integrando ambos
> 5. Si sugiere codigo/archivo -> validar legal-safe automaticamente
> 6. Documentar decisiones en GitHub (CHANGELOG, docs, ATTRIBUTIONS)

---

## Comandos de Activacion

```bash
# Activar dual-context para sesion
hermes skill run hscsg-dual-context-engine --activate

# Verificar estado de ambos contextos
hermes skill run hscsg-dual-context-engine --status

# Sincronizar: extraer de local -> transformar -> validar -> commitear
hermes skill run hscsg-dual-context-engine --sync "concepto_a_extraer"

# Validar repo completo (dual-context check)
hermes skill run hscsg-dual-context-engine --validate-all
```

---

## Integracion Skills

| Skill | Rol en Dual-Context |
|-------|---------------------|
| hscsg-asimilacion-legal-safe | Ejecutor FASE 1-4 (explora local -> transforma -> valida -> commit) |
| hscsg-orquestador-skills | Router maestro: decide que skill usar segun dual-context |
| hscsg-sistema-alraico | gamma-CARMIS monitorea coherencia dual-context |
| hscsg-viabilidad-territorial | Valida que aportes mejoren metricas soberanas |
| hscsg-ingenieria-inversa-patrones-vivos | Extrae patrones de backups locales (FASE 1) |
| hscsg-asimilacion-ecosistemica | Transforma repo externo -> modulo HSCSG (FASE 2-3) |

---

## Referencias
- hscsg-asimilacion-legal-safe (workflow 4 fases implementado)
- scripts/legal-safe-check.sh (validacion automatica 5 checks)
- .git/hooks/pre-commit (bloqueo legal automatico)
- docs/LEGAL_SAFE_GUIDE.md (clasificacion completa)
- docs/ATTRIBUTIONS.md (9 fuentes fair use)
- src/core/lib/metrics.ts (TerritorialSovereigntyIndex 16 componentes)
- src/core/lib/loopEngine.ts (6 loops, gamma-CARMIS, resonancia)
- hscsg_definition.md (MATHEMAs, Principio Anfibio, Beta Perpetua)
