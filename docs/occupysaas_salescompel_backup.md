# Backup: OccupySaaS SalesCompel

## Información General

- **Repositorio original**: https://github.com/occupysaas/salescompel
- **Organización**: occupysaas
- **Licencia**: Apache-2.0
- **Estado**: Early prototype, compatibility laboratory implemented
- **Fecha de clonación**: 2026-11-04
- **Commits**: 173 commits en main

## Qué es SalesCompel

SalesCompel es un reemplazo open-source y gratuito de Salesforce, con un core Go/PostgreSQL multi-tenant, editor de registros Vue, y un laboratorio de compatibilidad que verifica comportamiento contra la API pública de Salesforce.

### Stack Tecnológico

- **Lenguaje principal**: TypeScript (82.9%), Go (12.5%), Vue (2.4%), CSS (1.5%)
- **Backend**: Go + PostgreSQL (tenant-isolated)
- **Frontend**: Vue 3 + Pinia + Vue Router + i18n + RTL support
- **API**: REST (OpenAPI 3.2), SOQL subset, External-ID upsert
- **Auth**: Provisioned bearer principals
- **Testing**: Compatibility laboratory con JSforce, simple-salesforce, sf CLI, Chromium

### Arquitectura Core

```
salescompel/
├── api/                    # OpenAPI specs (candidate-openapi.yaml, openapi.yaml)
├── cmd/salescompel/        # Entry point CLI
├── internal/               # Lógica de negocio privada (Go)
├── compat/                 # Compatibility laboratory
│   ├── clients/            # JSforce, simple-salesforce, sf CLI, Chromium
│   ├── fixtures/           # OpenAPI fixtures, Salesforce schema
│   └── README.md           # Setup guide
├── docs/                   # Documentación extensa + roadmap + planes
├── locales/                # i18n files
├── scripts/                # Scripts de utilidad
├── web/                    # Vue frontend (record editor)
└── THIRD_PARTY_NOTICES.md  # Third-party license tracking
```

### Roadmap y Hitos (M0-M10)

| Hito | Estado Actual | Foco Restante |
|------|---------------|---------------|
| M0 — Target inventory | Partial | Required features, integrations, packages, operating targets |
| M1 — Behavior laboratory | Partial; pilot baseline accepted | Broader client coverage, CLI/plugin runners, repeatable evidence |
| M1R — Release-history review | Partial | Complete source inventory, reconcile relevant changes |
| M2 — Platform walking slice | Walking slice accepted; milestone open | Remaining milestone dependencies and exclusions |
| M3 — Protocol and query fidelity | Early implementation | REST/query semantics, external IDs, SOAP, Bulk, identity |
| M4 — Metadata and security | Bounded slices implemented | Dynamic schema, deployment, permissions, sharing |
| M5 — Migration | Planning and contracts | Import/export, resumability, deltas, reconciliation |
| M6 — Sales workflows and UI | Early prototype implemented | Broader sales workflows, reporting, localized acceptance |
| M7 — Automation and customization | Feasibility work remains | Formulas, Flow, Apex, imported component runtimes |
| M8 — Integrations and events | Contract outlines | Integration APIs, event delivery, reconnect/retry behavior |
| M9 — Production certification | Not reached | Migration rehearsals, security, performance, recovery, cutover |
| M10 — Wider Salesforce coverage | Scope-dependent | Separate inventories and certification for additional clouds/profiles |

**Presupuesto estimado**: 185–350 plan equivalents adicionales hasta M9 (estimación rough, no forecast de fechas).

### Funcionalidades Implementadas

**Compatibility Laboratory (Plan 1)**:
- Offline specification y test laboratory
- Pilot profile, source register, behavior contracts
- Locked JSforce/Salesforce CLI/simple-salesforce harness con 11 escenarios
- Fixture journals, ID-scoped cleanup
- JSON/Markdown reports, profile-bound comparator
- Per-language catalogs y validation
- OpenAPI 3.0 REST contract y External Services fixtures
- Offline y manual live CI

**Platform Walking Slice (Plan 2)**:
- Persistent Account/Contact CRUD
- Object `describe` y limited queries (SOQL subset)
- External-ID upsert
- Provisioned bearer authentication
- Localized Vue record workflow
- Real JSforce, simple-salesforce, sf CLI, Chromium candidate gates
- Platform CI workflow

**Catalog Upgrades (Plan 8)**:
- Catalog version 2 con 80-character bounds para custom fields sintéticos de Account
- Upgrade transaccional al startup; oversized values bloquean upgrade sin cambiar datos

**Plan 16 Local Candidate Acceptance**:
- Dos runs secuenciales completos pasando across database, real clients, restart, browser gates

### Estado Actual

> **El candidato NO es production-ready ni certificado Salesforce-compatible.** El baseline de 11 escenarios está registrado; obligaciones M1 más amplias y superficies de protocolo/seguridad/migración permanecen pendientes.

### Black-Box Testing Policy (CLEAN_ROOM.md)

**Alcance de testing**:
- Usar orgs Salesforce que el maintainer posee o autoriza testear (trial, Developer Edition, sandboxes)
- Usar datos sintéticos y APIs públicas documentadas via clientes sin modificar (JSforce, Salesforce CLI, simple-salesforce)
- Mantener tests dentro del scope autorizado; track fixtures, restore settings, cleanup
- La misma persona/sesión puede correr reference tests, analizar resultados, implementar comportamiento compatible
- Autorización del maintainer = aprobación suficiente del proyecto

**Evidencia e implementación**:
- Describir comportamiento observado independientemente: inputs, status/error codes, field types, defaults, ordering, pagination, permissions, committed effects
- Registrar profile, API/client versions, capture dates, contract IDs, reproduction steps
- Distinguir comportamiento observado de assumptions y tests sintéticos
- Mantener credenciales, raw auth material, sensitive captures privadas
- Documentación pública, estándares, API descriptions apropiadamente licenciadas pueden informar contratos

**Selección de fuentes y reutilización de código**:
- Preferir behavior tests observables e implementación independiente
- Evitar copiar código third-party cuando el comportamiento puede establecerse sin ello
- Material open-source puede considerarse cuando su licencia real permite copia, modificación, uso/distribución comercial
- Directorio de repos Salesforce = discovery source, NO blanket permission
- Para cada fragmento reutilizado deliberadamente: documentar en `THIRD_PARTY_NOTICES.md` (upstream URL, pinned revision, paths, license, why, modifications, required notices)

**Métodos excluidos**:
- NO usar proprietary Salesforce implementation source, decompilar server software, o inspeccionar managed-package internals
- NO copiar UI templates, stylesheets, icons, images, product prose de Salesforce
- NO usar información confidencial o bajo NDA

### Licencia

Apache-2.0. Ver `LICENSE`.

### Desarrollo

```bash
# Compatibility laboratory
npm ci --prefix compat/clients/node --ignore-scripts
npm --prefix compat/clients/node run check

# Ver candidate OpenAPI contract servido
GET /services/data/v65.0/openapi.yaml (authenticated)
```