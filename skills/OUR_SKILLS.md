# OUR_SKILLS — Manifest de Skills Propias (HSCSG v15 OS)

**Propósito:** Distinguir las skills que Isaac Ko (Isaacko0 / Zeitnus) creamos para HSCSG
de las skills de instalación de Hermes (agency-*, business-design/*, software-development/*, etc.).

**Cómo diferenciar:**
- Todas las nuestras usan prefijo `hscsg-` o son de Sistema Alráico, con `author: Isaacko0 / Zeitnus / HSCSG + Hermes Agent`.
- Viven en `HSCSG_v15_OS/skills/` (carpetas `SKILL.md`) y se espejan a `~/.hermes/skills/hscsg/`.
- El cron `sync_docs.sh` las re-copia automáticamente al índice de Hermes.

## Skills propias (creadas en conjunto) — 12 TOTAL

> **Ubicación:** Todas en `HSCSG_v15_OS/skills/<nombre>/` (carpetas `SKILL.md`) y
> indexadas en `~/.hermes/skills/hscsg/<nombre>/` (verificadas `available`).

|| # | Skill (name) | Dominio | Indexada |
||---|---|---|---|
|| 1 | `hscsg-repo-assimilation` | Asimilación repos (4 fases) | ✅ |
|| 2 | `hscsg-scientific-papers` | Protocolo papers (EBD, vasos comunicantes) | ✅ |
|| 3 | `hscsg-unified-assimilation-science` | Fusión asimilación + ciencia (maestra base) | ✅ (available) |
|| 4 | `hscsg-document-architect` | Documentos fundacionales unificados | ✅ |
|| 5 | `hscsg-multi-framework-integration` | Multi-framework (DisCO, 8 Cap, Integral) | ✅ (+ instalada `business-design/`) |
|| 6 | `loop-engineering-canvas` (carpeta `Sistema-Alraico-loop-engineering-skill`) | Canvas epistémico Alráico (20 límites, ECROx, triaxial) | ✅ (available) |
|| 7 | `hscsg-monetary-integration` | Sistemas monetarios alt. (G1, Túmin, PAR, ZCS/ZNU) | ✅ (available; colisión `business-strategy/` resuelta por carpeta) |
|| 8 | `hscsg-coeficiente-autonomia` | **NUEVA** AUT, CDS, 3 Leyes MJ, soberanía del nodo | ✅ (available) |
|| 9 | `hscsg-sistema-alraico` | **NUEVA** Kernel loopEngine: γ-CARMIS, resonancia, sobrecargas | ✅ (available) |
|| 10 | `hscsg-orquestador-skills` | **NUEVA** Router maestro + vasos comunicantes entre las 9 | ✅ (available) |
|| 11 | `hscsg-zeitnus-anthropology-analyzer` | **NUEVA** Analizador epistemológico estilo @helenasarda: humor, antropología, dinámicas conductuales del repo | ✅ (available) |
|| 12 | `hscsg-zeitnus-meme-diffusion` | **NUEVA** Difusión memeética afiliativa TikTok/FB: conceptos → humor ALRAC | ✅ (available) |

## Skills de instalación de Hermes (NO nuestras — no tocar con cron)

- `agency-*` (todas) — `~/.hermes/skills/agency-*/`
- `business-design/hscsg-multi-framework-integration` — versión de instalación (categoría)
- `business-strategy/hscsg-monetary-integration` — versión de instalación (categoría) — LA NUESTRA está en `hscsg/`
- `hscsg/hscsg-external-integration` — instalada previamente (foros cerrados)
- `software-development/*`, `creative/*`, `research/*`, etc.

## Notas

- `hscsg-orquestador-skills` es el ROUTER: mapea intención → skill específica y abre vasos
  comunicantes cruzados (formato `[alraico:loopEngine]`, `[aut:CDS]`, `[mon:ZNU]`, etc.).
- `hscsg-sistema-alraico` y `hscsg-coeficiente-autonomia` se extrajeron de `loopEngine.ts`,
  `Automat.tsx`, `Coach.tsx` (antes vivían dispersas, ahora son skills dedicadas).

## Pendiente

- Confirmar nombres de las **otras 2 skills de Alráico / coeficiente de autonomía** que el
  usuario menciona (no localizadas). Posiblemente sub-módulos de `Sistema-Alraico-loop-engineering-skill`.
