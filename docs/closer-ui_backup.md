# RESPALDO DE FUENTE — Closer UI (closerdao/closer-ui)

## Identificación de la fuente

- **Título:** closer-ui — Plataforma de gobernanza y aldea de CloserDAO
- **Autor/Org:** closerdao (Closer)
- **Repo:** https://github.com/closerdao/closer-ui
- **Rama:** develop
- **Tipo:** Monorepo Next.js 16 + Turborepo (TypeScript 93.6%, JavaScript 4.5%, HTML 1.6%, CSS 0.3%)
- **Licencia:** Attribution-NonCommercial 4.0 International (CC BY-NC 4.0) — ver LICENCE.md

## ⚖️ Aviso de derechos de autor y restricción de licencia

**CC BY-NC 4.0 es una licencia NO comercial.** Bajo el principio de la skill de asimilación (regla de extirpación de infra ajena y aislamiento de licencias incompatibles), **NO se copia código fuente ni assets de closer-ui** en este repositorio. Se asimila únicamente la **lógica pura de dominio** (gobernanza de aldea, pesos de voto, facturación de aldeas, roles) reimplementada en TypeScript puro, sin tocar el código original. La licencia CC BY-NC restringe uso comercial; este repo (Zeitnus/ALRAC, MIT) no incorpora código de closer-ui.

## Qué es el repositorio

Monorepo de la plataforma Closer (closer.earth), la herramienta de gobernanza que TDF usa actualmente para sus votos y operaciones de aldea. Stack: Next.js 16, React, Tailwind, Turborepo, pnpm workspaces, Node 24.

## Estructura destacada

| Directorio | Contenido |
|------------|-----------|
| `apps/` | Aplicaciones Next.js (village-app, procurement, etc.) |
| `packages/closer/` | Paquete core de lógica de dominio (gobernanza, billing, villages) |
| `docs/` | Documentación interna |
| `CONTEXT.md` | Contexto del proyecto (accommodation discounts, gas-aware staking) |
| `LICENCE.md` | CC BY-NC 4.0 |

## Lógica de dominio identificada (para asimilar como lógica pura, NO copiar código)

- Gobernanza de aldea con propuestas, votos y tally
- Pesos de voto basados en tokens ($TDF, $Presence, $Sweat, staking)
- Facturación de aldeas (`villageBilling`) con rotación de credenciales
- Staking con conciencia de gas (`gas-aware staking`)
- Descuentos de alojamiento
- Roles y permisos de aldea

## Estado

- 2,695 commits, 337 ramas, 0 tags
- Último commit: 2 días atrás (Nov 17, 2026) — merge PR #1356 (trpc-9.2b village admin UI)
- Fase 1 de verificación de voto (PR #1179) abierta, en revisión
