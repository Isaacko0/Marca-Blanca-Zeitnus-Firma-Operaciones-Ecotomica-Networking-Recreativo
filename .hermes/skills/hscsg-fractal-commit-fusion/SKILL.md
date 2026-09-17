---
name: hscsg-fractal-commit-fusion
description: Fusiona commits en documento con filosofía fractal HSCSG.
version: 1.0
---

# Skill: Fusión Fractal de Commits (HSCSG)

> **Principio**: La historia de un documento vivo no es lineal. Cada commit es un órgano del organismo. La fusión no aplana — integra fractalmente.

## Qué hace

Dado un archivo en el repo HSCSG v15 OS, analiza TODO su historial de commits, extrae la contribución semántica de cada uno, y produce un documento fusionado que:
- **Conserva** la información que sobrevive a la poda
- **Compone** lo que se complementa
- **Elimina** solo lo explícitamente compostado
- **Mantiene** trazabilidad: cada sección referencia sus commits origen

## Filosofía Fractal HSCSG Aplicada

| Principio HSCSG | Aplicación en Fusión |
|-----------------|---------------------|
| **E=V** | Solo se fusiona lo que optimiza soberanía con mínimo desperdicio |
| **Reciclaje orgánico** | Lo obsoleto se compone, no se borra — queda en git history |
| **Acople sin fusión** | Cada commit mantiene su identidad en la trazabilidad |
| **Corrección sin defensa** | Si un commit posterior corrige uno anterior, gana el corregido |
| **Verificación triaxial** | Mental + Sim (historial git) + Lab (contenido real) |
| **Resonancia** | Commits que resuenan se integran profundamente |

## Uso

```bash
hermes skill run hscsg-fractal-commit-fusion --file docs/BIO_THESIS_NEXO_ARCHITECTURE.md
```

## Algoritmo de Fusión Fractal

### Fase 1: Cosecha (Harvest)
```bash
git log --oneline --follow -- <archivo>
# Para cada commit: hash, mensaje, diff semántico, contexto
```

### Fase 2: Clasificación Semántica

| Tipo | Acción en Fusión |
|------|------------------|
| **Semilla** | Base fundacional — siempre se conserva |
| **Expansión** | Se integra completa |
| **Refinamiento** | Gana la versión refinada |
| **Corrección** | Gana la corrección |
| **Reestructuración** | Gana la nueva estructura |
| **Podar/Compostar** | Se respeta — no se recupera |
| **Fusión externa** | Se integra el contenido traído |

### Fase 3: Resonancia y Acople

Detectar commits que **resuenan** (mismo tema en commits separados → sección coherente).

### Fase 4: Composición Fractal

1. **Estructura maestra** = estructura del commit más reciente
2. **Contenido por sección** = fusión semántica de todos los commits
3. **Trazabilidad** = `<!-- fused-from: commit1, commit2, commit3 -->`
4. **Changelog semántico** = apéndice con aporte de cada commit

## Implementación (fusion_fractal.py)

```python
import subprocess, re, json
from dataclasses import dataclass
from typing import List, Dict

@dataclass
class CommitContribution:
    hash: str
    message: str
    date: str
    author: str
    diff_type: str  # seed/expansion/refinement/correction/restructure/prune/merge
    sections_affected: List[str]
    content_added: str
    content_removed: str
    content_modified: Dict[str, tuple]
    semantic_summary: str

def harvest_commits(filepath: str) -> List[CommitContribution]:
    # git log --follow -p -- <filepath>
    # Parsear diffs con heurísticas semánticas
    pass

def classify_diff(diff: str) -> str:
    # Heurísticas semánticas
    pass

def fuse_fractal(contributions: List[CommitContribution]) -> str:
    # 1. Estructura del último commit
    # 2. Fusionar contenido por sección cronológicamente
    # 3. Reglas: corrección > refinamiento > expansión > semilla
    # 4. Insertar trazabilidad
    pass
```

## Ejemplo Salida

```markdown
## Sección: La Ley Natural

<!-- fused-from: 222f7f3, 0f8c036, 5d1f28c, 47ad58c -->

La ley natural no es filosofía. Es física...

---

### Changelog Semántico
| Commit | Tipo | Aporte |
|--------|------|--------|
| 222f7f3 | seed | Estructura base v0.1 |
| 0f8c036 | expansion | +Parte V, +ley natural |
| 5d1f28c | expansion | +Partes I-IV (53 secciones) |
| 47ad58c | refinement | Header v6.0, integración |
```

## Comandos Útiles

```bash
git log --oneline --follow -- docs/BIO_THESIS_NEXO_ARCHITECTURE.md
git diff 0f8c036..47ad58c -- docs/BIO_THESIS_NEXO_ARCHITECTURE.md
git log -p --follow -S "La ley natural" -- docs/BIO_THESIS_NEXO_ARCHITECTURE.md
```

## Integración HSCSG v15 OS

- `hscsg-dual-context-engine` — contexto dual
- `hscsg-asimilacion-legal-safe` — validación legal-safe
- `hscsg-openspec-integration` — si resultado es spec OpenSpec

## Verificación Triaxial del Resultado

| Eje | Validación |
|-----|------------|
| **Mental** | ¿Documento fusionado se entiende coherentemente? |
| **Sim** | ¿Historial git simula evolución real? |
| **Lab** | ¿Contenido pasa tests coherencia E=V? |

---

**La fusión fractal no aplana la historia. La hace respirable.**
**Cada commit fue un latido. El documento fusionado es el organismo vivo.**
