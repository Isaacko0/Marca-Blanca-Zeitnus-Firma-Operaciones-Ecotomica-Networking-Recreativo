# Integración: OccupySaaS SalesCompel → HSCSG Marca Blanca

## Triple Perspectiva

### 1. Usuario: Qué quiere lograr en su nodo

El usuario de HSCSG Marca Blanca quiere:
- **CRM soberano**: Reemplazo de Salesforce auto-hospedable sin per-seat tax ni vendor lock-in
- **Compatibilidad real**: Sus integraciones existentes (JSforce, simple-salesforce, sf CLI) sigan funcionando
- **Datos propios**: Accounts, Contacts, Opportunities, custom objects en su PostgreSQL/IndexedDB
- **Extensibilidad nativa**: Apex/Flow-equivalentes como scripts TypeScript sandboxeados
- **Multi-tenancy**: Múltiples orgs aisladas en una instancia
- **Migración gradual**: Import/export compatible con Salesforce data model
- **Integración CaaS**: CRM como servicio comunitario (acceso por contribución, no licencia)

### 2. LLM: Qué asimilar (lógica pura) y qué extirpar (infra ajena)

#### ASIMILAR - Lógica Pura (patrones isomórficos)

| Componente SalesCompel | Módulo HSCSG | Lógica a Extraer |
|------------------------|--------------|------------------|
| **Data Model** | `crm-model.ts` | SObject definitions, fields, relationships, picklists, formulas |
| **CRUD Engine** | `crm-crud.ts` | Create, read, update, delete, upsert (external ID), bulk operations |
| **Query Engine** | `crm-query.ts` | SOQL subset parser/executor: SELECT, WHERE, ORDER BY, LIMIT, OFFSET, relationships |
| **Describe System** | `crm-describe.ts` | Object/field metadata, picklist values, referenceTo, compound fields |
| **External ID Index** | `crm-externalid.ts` | Upsert by external ID, uniqueness enforcement, conflict resolution |
| **Auth & Tenancy** | `crm-auth.ts` | Bearer token validation, tenant isolation, provisioned principals |
| **Catalog/Metadata** | `crm-catalog.ts` | Custom objects/fields, versioned catalog, upgrade transactions |
| **Compatibility Lab** | `crm-compat.ts` | Test harness, scenario runner, baseline comparison, report generation |
| **Record UI State** | `crm-ui-state.ts` | List views, detail/edit forms, inline edit, validation, localization |
| **Change Tracking** | `crm-changes.ts` | Field history, audit trail, feed, collaboration |

#### EXTIRPAR - Infraestructura Ajena (NO copiar)

| Componente | Razón | Alternativa HSCSG |
|------------|-------|-------------------|
| Go HTTP server / PostgreSQL driver | Runtime Go-specific | Zustand + IndexedDB / CaaS PostgreSQL |
| gRPC/internal packages | Go-internal | TypeScript modules |
| Vue 3 + Pinia frontend | Separate SPA | React screens integradas en HSCSG |
| JSforce/simple-salesforce/sf CLI harness | Testing tools only | Test suite propio compatible CaaS |
| Chromium-based browser tests | E2E infra | Playwright/Vitest en CI |
| OpenAPI 3.2 generation from Go | Codegen Go-specific | OpenSpec specs en TypeScript |
| Salesforce fixture fixtures | Reference data | Synthetic fixtures generados |
| Deploy/migration tooling | Salesforce-specific | CaaS migration framework |
| Apex/Flow runtime (future) | Proprietary VM | TypeScript sandbox (Web Workers) |

### 3. HSCSG + CaaS: Isomorfismo con Leyes I/II/III y CaaS

#### Ley I: No dañar base material / personas
- **SalesCompel**: Datos de CRM son del cliente, no del vendor
- **HSCSG**: `CrmEntity` = datos del usuario/organización; soberanía total
- **Mapeo**: `Account`/`Contact` → `CrmRecord` con `ownerEntityId` (RAO); no "org owner" que posea datos

#### Ley II: Ganarse la vida soberanizando = AUT × CDS
- **SalesCompel**: Self-hosted = control infraestructura
- **HSCSG**: `CrmModule` en nodo usuario; CaaS backend compartido opcional
- **Mapeo**:
  - `AUT` = control total de schema, data, automations, sharing rules
  - `CDS` = contribuir schemas, reportar compat gaps, operar nodo validador = `CRM_CREDITS`
  - `priceParity`: 1 CRM_CREDIT ≈ 1 USD via oráculo CaaS Nivel 3 ReFi

#### Ley III: Lucidez, nunca engañar
- **SalesCompel**: Compatibility lab = evidence-based; baseline grabado
- **HSCSG**: `CrmEventLog` append-only; `LucidezMode` muestra raw SOQL, query plan, compat score
- **Mapeo**: Cada query/mutation → `CrmEvent` con `provenance`, `compatScore`, `baselineRef`

#### CaaS: Comunidad como Servicio
- **SalesCompel**: Single-tenant candidate → future multi-tenant SaaS
- **HSCSG**: `CrmMesh` red federada; schema registry distribuido; data gravity local
- **Crédito CaaS**: Operar nodo CRM validador = gana `CRM_CREDITS`; consumir CRM remoto = gasta
- **Fallback**: Modo offline (IndexedDB) siempre funcional; modo online (CaaS) para scale/colaboración

## Tabla de Mapeo Isomórfico

| SalesCompel Concept | HSCSG Module | Ley I | Ley II | Ley III | CaaS |
|---------------------|--------------|-------|--------|---------|------|
| Org/Tenant | `CrmTenant` | Soberano | AUT | Transparente | Nodo en mesh |
| SObject (Account, Contact) | `CrmSObject` | Propio | CDS | Auditable | Schema registry |
| Record | `CrmRecord` | Material | AUT×CDS | Lucidez | RAO-attributed |
| Field (standard/custom) | `CrmField` | Definición | Soberanía | Versionada | Catalog v2+ |
| External ID | `CrmExternalId` | Identidad | AUT | Verificable | Index distribuido |
| SOQL Query | `CrmQuery` | Consulta | Justa | Explicable | Query mesh |
| Describe | `CrmDescribe` | Metadatos | CDS | Completa | Schema gossip |
| Bearer Token | `CrmPrincipal` | Acceso | Soberanía | Rotable | CaaS auth |
| Catalog Version | `CrmCatalog` | Evolución | AUT | Migrable | Upgrade protocol |
| Compatibility Test | `CrmCompatTest` | Evidencia | CDS | Repetible | Baseline compartido |
| Record UI | `CrmRecordView` | Interfaz | AUT | Localizable | Component mesh |

## Qué Asimilar vs Qué Extirpar (Resumen)

### ✅ ASIMILAR (Lógica Pura → TypeScript/Zustand)
1. **SObject model**: Definition, fields, types, relationships, formulas, validation rules
2. **CRUD operations**: Create, read, update, delete, upsert (external ID), bulk API semantics
3. **SOQL subset**: Parser + executor para SELECT, WHERE (operators), ORDER BY, LIMIT, OFFSET, parent/child relationships
4. **Describe API**: Object metadata, field metadata, picklists, referenceTo, compound fields
5. **External ID index**: Unique constraint, upsert semantics, conflict resolution (match on external ID)
6. **Tenant isolation**: Row-level security, provisioned principals, org boundaries
7. **Catalog system**: Custom objects/fields, versioning, transactional upgrades, bounds enforcement
8. **Compatibility laboratory**: Scenario runner, baseline capture, comparator, report generation
9. **Record UI patterns**: List views, detail pages, inline edit, validation, i18n/RTL
10. **Change tracking**: Field history, audit log, feed items, collaboration
11. **Authentication**: Bearer token validation, scopes, session management
12. **OpenAPI contract**: REST endpoints, request/response schemas, error formats

### ❌ EXTIRPAR (Infra Go/PostgreSQL/Vue/Testing → No copiar)
1. Go HTTP server, routing, middleware
2. PostgreSQL driver, connection pooling, migrations (sqlc)
3. Vue 3 + Pinia + Vue Router + i18n frontend
4. JSforce, simple-salesforce, sf CLI test harness
5. Chromium/Playwright browser automation
6. Salesforce schema fixtures (copyright Salesforce)
6. OpenAPI generation from Go structs
7. Deploy CLI, metadata API compatibility
8. Apex/Flow runtime (future work)
9. SOAP API, Bulk API, Streaming API (future)
10. Permission sets, sharing rules, territory management (future)

## Isomorfismo Leyes I/II/III + CaaS (Detalle)

### Ley I: No Dañar → CRM como Bien Común, No Renta
```
SalesCompel: "Free, open-source Salesforce replacement" → HSCSG: "CRM soberano por derecho"
- Usuario no paga por seat/license → Usuario contribuye (schema, data, compat tests) → Acceso total
- Datos en PostgreSQL del usuario → Datos en nodo usuario (IndexedDB/CaaS PostgreSQL)
- Vendor puede deprecate API → Usuario posee schema; red CaaS no puede romper compatibilidad
- Export walls → Export nativo (CSV, JSON, Parquet); CaaS mesh sync opcional
```

### Ley II: AUT × CDS → CRM Economy
```
SalesCompel: Self-hosted = infra cost → HSCSG: Self-hosted = AUT; CaaS = CDS
- AUT: Schema, data, automations, sharing rules bajo control usuario
- CDS: Contribuir SObject definitions, compat test scenarios, operar nodo = CRM_CREDITS
- priceParity: 1 CRM_CREDIT ≈ 1 USD (oráculo CaaS Nivel 3 ReFi)
- Modo anfibio: Lógica idéntica; render muestra ZNU (offline) o USD (online)
- Catalog upgrades: Transaccionales, backward-compatible, user-controlled timing
```

### Ley III: Lucidez → Compatibilidad Transparente
```
SalesCompel: Compatibility lab = evidence → HSCSG: CrmEventLog + LucidezMode
- Cada query/mutation → evento con: SOQL, query plan, compat score vs baseline, provenance
- LucidezMode en UI: muestra raw SOQL, execution plan, baseline diff, compat gaps
- Auditoría comunitaria: cualquiera puede verificar compat score contra baseline público
- Baseline compartido: 11 escenarios reference grabados; nuevo baseline = PR + review
```

### CaaS: Red Federada de CRM
```
SalesCompel futuro: Multi-tenant SaaS → HSCSG: CrmMesh P2P
- Nodos comparten: Schema registry (custom objects), compat baselines, threat intel
- Consenso: Gossip protocol para schema changes; CRDT para record sync (opt-in)
- Incentivos: Validar compat ajeno = ganar créditos; consumir CRM remoto = gastar
- Data gravity: Records stay local; mesh = metadata + compat, NO data replication por defecto
- Fallback: Modo local siempre operativo (offline-first IndexedDB)
```

## Vasos Comunicantes Cross-Repo

| Módulo HSCSG | Conexión SalesCompel | Vaso Comunicante |
|--------------|---------------------|------------------|
| `caas-credits.ts` | CRM credits earning | `CrmValidatorNode` emite `CreditEarned` al validar compat |
| `identity-rao.ts` | Record → RAO attribution | `CrmRecord` crea RAO al insertar; `ownerEntityId` obligatorio |
| `governance-triads.ts` | Org governance | `CrmTenant` usa triadas para schema changes approval |
| `value-dual.ts` | Record pricing | `CrmRecord` usa `valueDual(ZNU, USD)` para display value |
| `autonomy-guard.ts` | Offline CRM | `CrmModule` funciona sin red (IndexedDB) |
| `consensus-gossip.ts` | Schema sync | `CrmMesh` propaga custom object definitions via gossip |
| `auth-module.ts` | Bearer auth | `CrmPrincipal` integra con `AuthModule` tokens |

## Decisiones EBD (D1-D8) Aplicadas a CRM

| D# | Decisión | Evidencia Primaria | Módulo Afectado |
|----|----------|-------------------|-----------------|
| D1 | CRM nativo CaaS (no wrapper SF) | SalesCompel clean-room = precedente | `crm-core.ts` |
| D2 | ACP por entidad (record autonomous) | ADSOA: "autonomous controllability" | `crm-acp.ts` |
| D3 | DF replicado (record state sync) | ADSOA: "several processes intercommunicated" | `crm-sync.ts` |
| D4 | Content Code semántico (CRM events) | IEICE 2016: "identifies message with content" | `crm-events.ts` |
| D5 | UV-PKI propia (schema registry mesh) | ADSOA: "root-CA partitioned, uniqueness verified" | `crm-schema.ts` |
| D6 | Folio Structure (CRM transactions) | ADSOA: "identifies the transaction" | `crm-folio.ts` |
| D7 | Autonomous Guard (offline CRM) | ADS: "continue operating despite failure" | `crm-guard.ts` |
| D8 | Coordination Protocol (mesh sync) | ADSOA: "autonomous coordinability" | `crm-mesh.ts` |

## KPIs y Tests Obligatorios

| Módulo | KPIs Mínimos | Test File |
|--------|-------------|-----------|
| `crm-model` | Schema validation < 5ms; 100% field types covered | `crm-model.test.ts` |
| `crm-crud` | CRUD < 20ms; bulk 1000 records < 500ms; upsert external ID 100% | `crm-crud.test.ts` |
| `crm-query` | SOQL parse < 2ms; execute 10k records < 100ms; relationship traversal | `crm-query.test.ts` |
| `crm-describe` | Describe < 10ms; full metadata accuracy 100% | `crm-describe.test.ts` |
| `crm-externalid` | Upsert conflict resolution 100%; index lookup < 5ms | `crm-externalid.test.ts` |
| `crm-auth` | Token validation < 5ms; tenant isolation verified | `crm-auth.test.ts` |
| `crm-catalog` | Upgrade transaction atomic; bounds enforced; rollback on oversize | `crm-catalog.test.ts` |
| `crm-compat` | 11 baseline scenarios pass; report generation < 1s | `crm-compat.test.ts` |
| `crm-ui-state` | List render 100 records < 50ms; inline edit save < 100ms | `crm-ui-state.test.ts` |
| `crm-changes` | History append < 5ms; audit trail complete | `crm-changes.test.ts` |
| `crm-mesh` | Schema gossip < 5s; partition tolerance | `crm-mesh.test.ts` |

## Plan de Implementación (Archivo por Archivo)

### Fase 3.1: Core Types + State
```
src/core/state/crm.ts            # CrmState, CrmTenant, CrmSObject, CrmRecord, CrmField, CrmQuery, CrmEvent
src/core/state/crm.test.ts       # Type tests, makeCrmState() seed
```

### Fase 3.2: Lógica Pura (lib)
```
src/core/lib/crm-model.ts        # SObject definitions, field types, relationships, formulas, validation
src/core/lib/crm-crud.ts         # create, read, update, delete, upsert, bulk
src/core/lib/crm-query.ts        # SOQL parser + executor (subset)
src/core/lib/crm-describe.ts     # Object/field metadata, picklists, referenceTo
src/core/lib/crm-externalid.ts   # External ID index, upsert semantics, conflicts
src/core/lib/crm-auth.ts         # Bearer validation, tenant isolation, principals
src/core/lib/crm-catalog.ts      # Custom objects/fields, versioning, upgrades, bounds
src/core/lib/crm-compat.ts       # Scenario runner, baseline capture, comparator, reports
src/core/lib/crm-ui-state.ts     # List views, detail/edit, inline edit, validation, i18n
src/core/lib/crm-changes.ts      # Field history, audit log, feed, collaboration
src/core/lib/crm-mesh.ts         # Schema gossip, compat baseline sync, CRDT opt-in
src/core/lib/crm-value.ts        # valueDual integration, priceParity, nodeMode
```

### Fase 3.3: Store Integration
```
src/core/state/store.ts          # + crm: CrmState, actions, resetAll, partialize
```

### Fase 3.4: Pantallas + Nav
```
src/app/screens/CrmAdmin.tsx     # Dashboard: tenants, objects, records, compat lab
src/app/screens/CrmRecords.tsx   # List/detail/edit records (Account, Contact, custom)
src/app/screens/CrmSchema.tsx    # Schema builder: custom objects, fields, relationships
src/app/screens/CrmCompat.tsx    # Compatibility lab runner, baseline comparison, reports
src/app/screens/CrmMesh.tsx      # Mesh status, schema registry, peer health
src/app/layout/Aside.tsx         # + CrmAdmin, CrmRecords, CrmSchema, CrmCompat, CrmMesh (icons: Briefcase, Table, GitBranch, CheckCircle, Network)
src/app/App.tsx                  # + routes /crm, /crm/records, /crm/schema, /crm/compat, /crm/mesh
```

### Fase 3.5: i18n (ES/EN/PT - 150+ keys per screen)
```
src/i18n/locales/es/crm.json
src/i18n/locales/en/crm.json
src/i18n/locales/pt/crm.json
```

### Fase 3.6: Tests KPI + Verificación
```
npm run test:crm                 # vitest run src/core/lib/crm-*.test.ts
npx tsc --noEmit                 # 0 errores
npm run build                    # build OK
npm run preview                  # rutas /crm/* → HTTP 200
```

## Referencias

- SalesCompel README: https://github.com/occupysaas/salescompel/blob/main/README.md
- Black-Box Testing Policy: https://github.com/occupysaas/salescompel/blob/main/CLEAN_ROOM.md
- Compatibility Roadmap: https://github.com/occupysaas/salescompel/blob/main/docs/plans/2026-10-14-salesforce-compatibility-roadmap.md
- Plan 1 Lab: https://github.com/occupysaas/salescompel/blob/main/docs/plans/2026-10-15-plan-1-compatibility-laboratory.md
- Plan 2 Walking Slice: https://github.com/occupysaas/salescompel/blob/main/docs/superpowers/plans/2026-10-15-plan-2-platform-walking-slice.md
- Plan 2 Implementation: https://github.com/occupysaas/salescompel/blob/main/docs/compat/plan-2-implementation.md
- Plan 16 Acceptance: https://github.com/occupysaas/salescompel/blob/main/docs/compat/plan-16-cli-query-column-metadata.md
- HSCSG Architecture: `skills/hscsg-repo-assimilation/references/hscsg-architecture.md`
- Principio Anfibio: `skills/hscsg-repo-assimilation/references/anfibio-assimilation.md`
- Value Dual Pattern: `skills/hscsg-repo-assimilation/references/value-dual-pattern.md`