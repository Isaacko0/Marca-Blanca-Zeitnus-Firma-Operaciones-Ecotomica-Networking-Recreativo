# Guía Legal Safe para Repo HSCSG v15 OS

**Fecha**: 2026-09-12  
**Propósito**: Documentar qué archivos son seguros, cuáles requieren transformación y cuáles deben eliminarse/archivarse para cumplimiento legal.

---

## Clasificación de Archivos en Repo

### ✅ **SEGUROS - Contenido Propio / Transformativo / Dominio Público**

| Categoría | Archivos | Justificación |
|-----------|----------|---------------|
| **Código fuente** | `src/core/lib/*.ts`, `src/core/lib/*.test.ts` | Código original HSCSG |
| **Skills propias** | `skills/hscsg-*/SKILL.md` | Creadas por Isaac/Zeitnus/HSCSG |
| **Documentos fundacionales** | `hscsg_definition.md`, `hscsg_mj_synthesis.md`, `CHANGELOG.md` | Trabajo original |
| **Métricas/Arquitectura** | `metrics.ts`, `loopEngine.ts`, `valueDual.ts`, `boundaries.ts` | Código original |
| **Investigación transformativa** | `INVESTIGACION_OBLINGER_CLG_HSCSG.md` | Análisis propio de fuentes públicas |
| **Configuración** | `package.json`, `tsconfig.json`, `.github/workflows/*` | Configuración propia |

---

### ⚠️ **REQUIEREN TRANSFORMACIÓN - Contenido de Terceros (Fair Use)**

| Archivo | Fuente Original | Acción Requerida |
|---------|----------------|------------------|
| `docs/biotesis_yoka_integration.md` | Corpus Yoka (Mundo Paralelo, AFP) | **Resumir/parafrasear** - No reproducir >90 chars textuales |
| `docs/filosofia_propria_yoka_integration.md` | AFP (El Arte de la Filosofía Propia) | **Resumir/parafrasear** - Conceptos transformados |
| `docs/mk1_balbi_integration.md` | MK-1 (Fabio F. Balbi) | **Resumir/parafrasear** - Solo conceptos, no texto |
| `docs/el_enlace_yoka_fabio_integration.md` | El Enlace (Yoka + Fabio) | **Resumir/parafrasear** - Narrativa transformada |
| `docs/iambrainstorming_integration.md` | iambrainstorming (libro completo 1.9MB) | **ELIMINAR archivo completo** - Solo mantener `*_backup.md` local |
| `docs/copiosis_integration.md` | Copiosis (proyecto externo) | **Resumir conceptos** - No copiar especificación |
| `docs/auravana_*_integration.md` | Auravana/OneCommunity (SSS-PP-PE-001) | **Citar especificación** - No reproducir 364 celdas |
| `docs/breadchain_*_integration.md` | Breadchain (proyecto externo) | **Resumir patrones** - No copiar ADRs textuales |
| `docs/gaia_*_integration.md` | Gaia (proyecto externo) | **Resumir patrones** - No copiar constituciones |
| `docs/colonia_*_integration.md` | Colony (proyecto externo) | **Resumir patrones** - No copiar código |
| `docs/urbanika_*_backup.md` | Urbanika (proyectos externos) | **ELIMINAR** - Solo mantener análisis propio |

---

### ❌ **ELIMINAR / SOLO LOCAL - Backups Completos de Terceros**

**91 archivos `*_backup.*` en `docs/` y subdirectorios**

| Patrón | Acción | Justificación |
|--------|--------|---------------|
| `*_backup.md` | **ELIMINAR del repo** - Mover a `~/HSCSG_Backups_Local/` | Copias completas de obras ajenas = infracción copyright |
| `*_backup.txt` | **ELIMINAR del repo** - Mover a local | Igual que arriba |
| `docs/_licencia_incompatible/*` | **ELIMINAR del repo** - Ya etiquetados como incompatibles | Carpeta explícita de problemas legales |
| `docs/.local_backups/` | **NO SUBIR** - Ya en gitignore | Correcto |

**Archivos específicos problemáticos**:
- `docs/iambrainstorming_libro_completo.md` (1.9 MB - libro completo ajeno)
- `docs/onecommunity_global_backup_en.md` (1.8 MB - especificación completa)
- `docs/onecommunity_global_backup_es.md` (56 KB - traducción completa)
- `docs/towards_open_civics_backup.txt` (documento completo ajeno)

---

## Protocolo "Repo-Safe" para Contenido Externo

### Regla de Oro: **Transformar, no Copiar**

| Tipo de Contenido | Límite Seguro | Transformación Requerida |
|-------------------|---------------|--------------------------|
| **Citas textuales** | ≤ 90 caracteres | Parafrasear + citar fuente |
| **Conceptos/Ideas** | Ilimitado | Expresar con palabras propias + atribución |
| **Datos/Hechos** | Ilimitado | Presentar en tablas/gráficas propias |
| **Estructuras/Frameworks** | Ilimitado | Re-dibujar/reescribir con ontología HSCSG |
| **Código** | Funciones cortas (<10 líneas) | Reescribir con tipos HSCSG + licencia compatible |

### Checklist antes de commit

```bash
# 1. No hay archivos *_backup.* en docs/
find docs -name "*_backup*" -type f

# 2. No hay libros/documentos completos ajenos > 50KB
find docs -name "*.md" -size +50k -exec ls -lh {} \;

# 3. Citas > 90 chars son propias o fair use documentado
grep -r "\"[^\"]\{90,\}\"" docs/ --include="*.md"

# 4. Imágenes: solo propias o CC0/Unsplash
find docs -name "*.png" -o -name "*.jpg" -o -name "*.svg"
```

---

## Archivos Creados/Modificados en Esta Sesión (Todos Seguros)

| Archivo | Tipo | Justificación |
|---------|------|---------------|
| `src/core/lib/metrics.ts` | Código original | Métricas HSCSG puras (ninguna métrica SaaS) |
| `skills/hscsg/hscsg-viabilidad-territorial/SKILL.md` | Skill original | Ontología HSCSG pura |
| `skills/hscsg/hscsg-autotrofia-disenador/SKILL.md` | Skill original | Ontología HSCSG pura |
| `skills/hscsg/hscsg-comunicacion-veraz/SKILL.md` | Skill original | Ontología HSCSG pura |
| `skills/hscsg/hscsg-ingenieria-inversa-patrones-vivos/SKILL.md` | Skill original | Ontología HSCSG pura |
| `skills/hscsg/hscsg-asimilacion-ecosistemica/SKILL.md` | Skill original | Ontología HSCSG pura |
| `docs/INVESTIGACION_OBLINGER_CLG_HSCSG.md` | Investigación transformativa | Análisis propio + fair use documentado |
| `docs/LEGAL_SAFE_GUIDE.md` | Guía propia | Documento de cumplimiento |
| `skills/OUR_SKILLS.md` | Manifiesto actualizado | Inventario propio |

---

## Próximas Acciones Recomendadas

### Inmediato (Antes de próximo push)
```bash
# 1. Eliminar backups del repo (mover a local primero)
mkdir -p ~/HSCSG_Backups_Local/docs
mv docs/*_backup.* ~/HSCSG_Backups_Local/docs/
mv docs/_licencia_incompatible ~/HSCSG_Backups_Local/docs/
mv docs/iambrainstorming_libro_completo.md ~/HSCSG_Backups_Local/docs/
mv docs/onecommunity_global_backup_*.md ~/HSCSG_Backups_Local/docs/
mv docs/towards_open_civics_backup.txt ~/HSCSG_Backups_Local/docs/
mv docs/urbanika/*_backup.md ~/HSCSG_Backups_Local/docs/urbanika/

# 2. Verificar limpieza
find docs -name "*_backup*" -type f  # Debe retornar vacío
```

### Mediano Plazo (Próximas 2 semanas)
1. **Transformar** archivos `*_integration.md` problemáticos → versiones resumidas/parafraseadas
2. **Crear** `docs/ATTRIBUTIONS.md` - Registro centralizado de fuentes + licencias
3. **Auditar** `iambrainstorming_libro_completo.md` - Si es esencial, buscar licencia o reescribir

### Continuo
- **Nunca commitear** archivos `*_backup.*` 
- **Siempre transformar** contenido externo antes de integrar
- **Documentar** en `ATTRIBUTIONS.md` cada fuente externa usada

---

## Licencia del Repo

```
HSCSG v15 OS - Holosociocibersimbiogénesis
Copyright © 2024-2026 Isaac Ko (Isaacko0) / Zeitnus / HSCSG

Licencia: AGPL-3.0-or-later (código) | CC-BY-SA-4.0 (documentación)
Excepción: Contenido transformado de fuentes públicas bajo fair use (investigación, comentario, crítica)

Fuentes externas transformadas:
- Brian Oblinger (brianoblinger.com) - Análisis de metodología CLG
- Yoka (Mundo Paralelo, AFP) - Corpus filosófico (parafraseado)
- Fabio F. Balbi (MK-1) - Modelo ontológico (conceptos)
- Auravana/OneCommunity (SSS-PP-PE-001) - 364 celdas (referenciadas, no copiadas)
- Proyectos asimilados (Gaia, Breadchain, Colony, etc.) - Patrones extraídos (no código)
```

---

## Contacto Legal

Para dudas sobre cumplimiento: **Isaac Ko (Isaacko0)** - Mantenedor principal HSCSG v15 OS

> *"La transparencia radical (Ley III) aplica también a cumplimiento legal: lo que no es nuestro, se atribuye; lo que no tiene licencia compatible, se transforma o se elimina."*