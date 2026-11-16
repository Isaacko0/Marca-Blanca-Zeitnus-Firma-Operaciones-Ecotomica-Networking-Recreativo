# Zentrik ARM Asimilación — Patrones y Pendientes (Sesión 2026-11-11)

## Resumen de la Asimilación

**Repo fuente:** https://github.com/Zentrik-AI/zentrik-open-crm (commit 4d26eb6, 2026-10-28)
**Licencia:** Apache-2.0
**Estado:** Fase 1-2 completadas, Fase 3 en progreso (5 paquetes npm generados, OpenSpec specs creadas)

---

## Patrones de Asimilación ARM (Validados en Esta Sesión)

### 1. Arquitectura 5 Capas → Paquetes npm
```
Layer 5: Agent Interfaces  →  @hscsg/arm-mcp (MCP server stdio)
Layer 4: Workspace Runtime  →  @hscsg/arm-cli (store, actions, templates)
Layer 3: Core Operations    →  @hscsg/arm-core (ops.ts: applyChange, submitChange, resolveProposal)
Layer 2: Domain Logic       →  @hscsg/arm-core (model, validate, claims, memory, brief, patterns, markdown, investigation, calls, demo)
Layer 1: UI                 →  @hscsg/arm-ui (React + Vite + Clear v2)
```

### 2. Invariants ARM (4 Pilares) — Verificados en Código
| Invariant | Implementación |
|-----------|----------------|
| One Write Path | `ops.ts:applyChange()` puro + `submitChange()` + `resolveProposal()` |
| Everything Shows Source | `Claim.evidence[]` + `groundClaim()` + `accountMemory()` |
| Nothing Lands Unapproved | `submitChange()` review gate + `resolveProposal()` + `proposalConflict()` |
| Records Are Yours | Folder workspace + atomic writes + lock + backups + SSE |

### 3. Principio Anfibio Monetario (Implementado en `valueDual.ts`)
```typescript
// Modo postmonetario (default HSCSG): ZNU/CaaS units
// Modo conectado (Nivel 3 ReFi): USD/USDC via priceParity oracle
// Lógica AGNÓSTICA a unidad — solo presentación cambia
toDualValue(znu: number, config: DualValueConfig): DualValue
```

### 4. Account Work → Product Work (Patterns → Signals)
- **findPatterns()**: Union-find lexical, Jaccard ≥0.4 or 3 shared terms
- **signalsBundle()**: `open-crm-signals.v1` → `arm-signals.v1` (providerType: "arm")
- **Share-safe mode**: People as roles, drop PII
- **Principio**: Llevar FUENTES, no conclusiones

### 5. Stack-Agnostic Core (Zero Deps)
- `arm-core` = pure TypeScript, consumible por Go/Python/Rust via bindings
- `arm-cli` = Node.js (store, actions, MCP, API, templates)
- `arm-mcp` = JSON-RPC 2.0 stdio (sin SDK)
- `arm-api` = Loopback HTTP + SSE (127.0.0.1 only)
- `arm-ui` = React 18 + Vite + Tailwind + Clear v2

---

## Pendientes y Recomendaciones (Fase 3-4)

### 🔴 Crítico — Fix Compilación TypeScript (arm-core)
```bash
# Errores actuales:
1. Imports @hscsg/arm-core/* → cambiar a paths relativos (./core/*, ../types, etc.)
2. structuredClone(seedWorkspace) en demo.ts → JSON.parse(JSON.stringify(seedWorkspace))
3. brand import en markdown.ts → usar brand local de arm-core (src/lib/brand.ts)
4. seed.ts import en demo.ts → path relativo correcto
```

### 🟡 Alto — Instalación y Build Monorepo
```bash
# npm 11 no soporta workspace:* protocol
# Cambiado a file:../arm-core en package.json de cada package
# Requiere npm install individual en cada package:
cd packages/arm-core && npm install && npm run build
cd packages/arm-cli && npm install && npm run build
cd packages/arm-mcp && npm install && npm run build
cd packages/arm-api && npm install && npm run build
cd packages/arm-ui && npm install && npm run build
```

### 🟡 Alto — Tests Unitarios Mínimos
| Package | Tests Requeridos |
|---------|------------------|
| arm-core | ops.test.ts, validate.test.ts, memory.test.ts, claims.test.ts, patterns.test.ts, brief.test.ts, valueDual.test.ts |
| arm-cli | store.test.ts, actions.test.ts, sources.test.ts, templates.test.ts, agent-kit.test.ts |
| arm-mcp | mcp.test.ts (initialize, tools/list, tools/call all tools, error handling) |
| arm-api | api.test.ts (Host/Origin/JSON validation, routing, SSE) |
| arm-ui | components.test.tsx (tokens, agent badge, grounding indicators) |

### 🟢 Medio — Validación E2E
```bash
# Flujo completo:
arm init ~/arm-test --demo     # workspace HSCSG funcional
arm ui                         # browser folder mode
# En otra terminal: claude/codex/cursor en ~/arm-test
# Agent: "Run the daily review" → propose changes
# UI: Review → Approve → verify SSE updates
# Verify: crm check --fix, crm export --signals --share-safe
```

### 🟢 Medio — Pantalla `/agencia` (Modo Monetario)
- Componente React para toggle `postmonetario` ↔ `conectado`
- Usa `valueDual.detectModeFromEnv()` + localStorage persistence
- Muestra labels dual: "42,000 ZNU" / "$105,000 USD (42,000 ZNU)"
- Integra con `nodeMode/priceParity` en store

### 🟢 Medio — Integración Kernel HSCSG
| Kernel Módulo | Punto de Integración |
|---------------|---------------------|
| `hscsg-sistema-alraico` | `arm-core` como módulo vivo en kernel orquestación |
| `hscsg-coeficiente-autonomia` | `Account.valor` (ZNU) + `Deal.valor` → AUT/CDS calculations |
| `hscsg-monetary-integration` | `valueDual.priceParity` oracle → ZNU/USD conversion |
| `hscsg-zeitnus-anthropology-analyzer` | `arm-patterns` → signals para Zeitnus |

---

## Decisiones de Asimilación (Documentadas en backup.md + integration.md)

| Decisión | Qué | Por Qué |
|----------|-----|---------|
| **5 paquetes npm** | core, cli, mcp, api, ui | Separación de concerns, consumo independiente |
| **OpenSpec SDD** | 5 specs YAML validadas | Specs vivas, trazabilidad, CI/CD ready |
| **Principio Anfibio** | `valueDual.ts` + `nodeMode/priceParity` | Misma lógica, render decide etiqueta |
| **Brand HSCSG** | `ARM` / `HSCSG ARM` | No Zentrik/Open CRM; `brand.ts` single source |
| **Docs SOLO local** | backup.md, integration.md en ~/ | Política HSCSG: no subir CHANGELOG/docs sensibles a GitHub |
| **Source archive** | `~/Zentrik-Open-CRM-Source-2026-11-11/` | Código completo para referencia futura |

---

## Pitfalls Específicos ARM (Aprendidos Esta Sesión)

| Pitfall | Síntoma | Solución |
|---------|---------|----------|
| **Imports @hscsg/arm-core en arm-core** | TS errors: "Cannot find module" | Usar paths relativos (`./core/*`, `../types`) |
| **structuredClone no disponible** | Runtime error en demo.ts | `JSON.parse(JSON.stringify(obj))` |
| **Brand import circular** | markdown.ts importa brand de zentrik | Crear `src/lib/brand.ts` local en arm-core |
| **workspace:* protocol npm 11** | `npm error EUNSUPPORTEDPROTOCOL` | Cambiar a `file:../arm-core` en package.json |
| **Seed workspace dates** | Tests flaky por wall clock | `createDemoWorkspace(now: Date)` con clock inyectado |
| **Violet = agent token** | CSS tokens: violet reservado para agent work | Usar semantic tokens, evitar one-off colors |

---

## Archivos Generados en Esta Sesión

### Documentación Asimilación (HSCSG Repo)
```
docs/asimilacion/zentrik-open-crm/
├── backup.md           # 15 KB — Inventario, copyright, decisiones fase 2
└── integration.md      # 25 KB — Análisis arquitectónico completo
```

### Copias Locales (Política HSCSG)
```
~/Zentrik-Open-CRM-backup-2026-11-11.md
~/Zentrik-Open-CRM-integration-2026-11-11.md
~/Documents/Zentrik-Open-CRM-*.md
~/Desktop/Zentrik-Open-CRM-*.md
~/Zentrik-Open-CRM-Source-2026-11-11/   # Código fuente completo
```

### Paquetes npm (packages/)
```
packages/
├── arm-core/
│   ├── src/
│   │   ├── index.ts
│   │   ├── types.ts
│   │   ├── core/           # 11 archivos (model, ops, validate, claims, memory, brief, patterns, markdown, investigation, calls, demo)
│   │   ├── lib/            # brand.ts, valueDual.ts (anfibio)
│   │   └── data/           # seed.ts (workspace demo HSCSG)
│   ├── openspec/specs/arm-core.openspec.yml
│   ├── package.json, tsconfig.build.json
│   └── bin/ (no aplica)
├── arm-cli/
│   ├── src/                # store, actions, templates, sources, agent-kit, main, index
│   ├── bin/arm.js          # Entry point con Node version check
│   ├── openspec/specs/arm-cli.openspec.yml
│   └── package.json, tsconfig.build.json
├── arm-mcp/
│   ├── src/index.ts        # MCP server stdio, 20 tools
│   ├── openspec/specs/arm-mcp.openspec.yml
│   └── package.json, tsconfig.build.json
├── arm-api/
│   ├── openspec/specs/arm-api.openspec.yml
│   └── package.json, tsconfig.build.json
├── arm-ui/
│   ├── openspec/specs/arm-ui.openspec.yml
│   ├── src/lib/brand.ts    # ARM / HSCSG ARM
│   └── package.json, tsconfig.build.json
```

### Monorepo Config
```
package.json (root)  # workspaces: ["packages/*"] + scripts arm:build, arm:typecheck, arm:test, arm:spec
```

---

## Próximos Pasos Inmediatos (Orden Recomendado)

1. **Fix arm-core TS compilation** → cambiar imports, fix structuredClone, brand local
2. **npm install + build cada package** → verificar 0 errores
3. **Crear tests unitarios mínimos** → cubrir invariants ARM
4. **E2E smoke test** → `arm init --demo` → `arm ui` → MCP agent → Review
5. **Pantalla `/agencia`** → toggle modo monetario
6. **Integración kernel** → conectar con Alraico, AUT/CDS, ZNU

---

**Firmado:** Isaac Ko (Isaacko0) — HSCSG v15 OS
**Fecha:** 2026-11-11
**Metodología:** HSCSG Unified Assimilation Science (5 fases + OpenSpec SDD + Principio Anfibio)