# Integración: OccupySaaS ZeroAuthy → HSCSG Marca Blanca

## Triple Perspectiva

### 1. Usuario: Qué quiere lograr en su nodo

El usuario de HSCSG Marca Blanca quiere:
- **Autenticación soberana**: Un servidor de identidad auto-hospedable que reemplace Auth0/Okta sin per-seat tax
- **Compatibilidad drop-in**: Sus apps existentes con SDKs de Auth0 sigan funcionando sin cambios de código
- **Control total de datos**: Usuarios, tokens, logs en su propia infraestructura (SQLite/PostgreSQL/MySQL)
- **Extensibilidad nativa**: Actions compatibles con Auth0 para lógica custom sin vendor lock-in
- **Multi-tenancy**: Múltiples organizaciones/tenants aislados en una sola instancia
- **Observabilidad completa**: Logs, event streams, métricas sin telemetría obligatoria
- **Integración CaaS**: Autenticación como servicio comunitario (acceso por contribución real, no dinero)

### 2. LLM: Qué asimilar (lógica pura) y qué extirpar (infra ajena)

#### ASIMILAR - Lógica Pura (patrones isomórficos)

| Componente ZeroAuthy | Módulo HSCSG | Lógica a Extraer |
|---------------------|--------------|------------------|
| **Token Service** | `auth-tokens.ts` | JWT signing/validation, JWKS rotation, refresh token rotation, revocation |
| **Auth Flows** | `auth-flows.ts` | Authorization code + PKCE, client credentials, device flow, passwordless, OTP grant |
| **MFA Engine** | `auth-mfa.ts` | TOTP, email/SMS/voice codes, recovery codes, policies, remember-browser |
| **User Management** | `auth-users.ts` | CRUD, identity linking, sessions, search, import/export |
| **Tenant/Org Model** | `auth-tenants.ts` | Multi-tenancy, organizations, members, role assignments, connections |
| **Actions Runtime** | `auth-actions.ts` | Node.js sandbox, triggers (login, signup, credentials exchange), modules, jobs |
| **Event Streams** | `auth-events.ts` | CloudEvents, webhooks, SSE, retries, failed delivery inspection |
| **Storage Abstraction** | `auth-storage.ts` | Interface Store, drivers (memory, SQLite, PG, MySQL, gRPC plugin) |
| **Rate Limiting** | `auth-ratelimit.ts` | Token bucket per tenant/IP/endpoint group |
| **Custom DB Connections** | `auth-customdb.ts` | Node.js script execution (login, get_user, create, change_password) |

#### EXTIRPAR - Infraestructura Ajena (NO copiar)

| Componente | Razón | Alternativa HSCSG |
|------------|-------|-------------------|
| Go HTTP server / chi router | Runtime específico Go | Zustand store + fetch API |
| SQLite/PostgreSQL/MySQL drivers | DB-specific | localStorage / IndexedDB / CaaS backend |
| gRPC storage plugins | Protobuf/Go-specific | Adapter pattern en TypeScript |
| Node.js Actions runtime (vm2/isolated-vm) | Sandbox Go-specific | Web Workers / iframe sandbox / CaaS compute |
| OpenSSL/TLS cert management | OS-level | Navegador maneja TLS; CaaS gateway |
| Docker/Podman deployment | Container orchestration | Static hosting (GitHub Pages, IPFS, CaaS) |
| Makefile build system | Go toolchain | Vite + npm scripts |
| OpenID conformance suite | Certificación vendor | Test suite propio compatible CaaS |
| Auth0 SDK compatibility layer | Vendor-specific | Adapter genérico para cualquier OAuth2/OIDC |
| Admin console (Vue app) | Separate SPA | Pantalla integrada en HSCSG (`AuthAdmin.tsx`) |

### 3. HSCSG + CaaS: Isomorfismo con Leyes I/II/III y CaaS

#### Ley I: No dañar base material / personas
- **ZeroAuthy**: Usuarios son entidades soberanas, no "seats" facturables
- **HSCSG**: `AuthUser` = persona con credenciales propias, datos en su nodo
- **Mapeo**: `user_id` → `entityId` (RAO attribuible); no hay "tenant admin" que posea usuarios

#### Ley II: Ganarse la vida soberanizando = AUT × CDS
- **ZeroAuthy**: Self-hosted = soberanía de infraestructura
- **HSCSG**: `AuthModule` corre en el nodo del usuario; CaaS provee backend compartido opcional
- **Mapeo**: 
  - `AUT` (Autonomía) = control total de keys, tokens, policies
  - `CDS` (Contribución Digital Soberana) = contribución a red CaaS = acceso a features avanzadas
  - `priceParity`: 1 AUTH_CREDIT = 1 USD equivalencia via oráculo CaaS

#### Ley III: Lucidez, nunca engañar
- **ZeroAuthy**: Open source, clean-room, provenance tracking (`x-source`)
- **HSCSG**: Append-only audit log en `AuthEventStore`; `LucidezMode` revela raw tokens, decisions
- **Mapeo**: Cada auth decision (grant/deny/revoke) → `AuthEvent` con `provenance`, `timestamp`, `actor`

#### CaaS: Comunidad como Servicio
- **ZeroAuthy**: Single-tenant o multi-tenant SaaS (Plan 47)
- **HSCSG**: Red federada de nodos auth; `AuthMesh` comparte JWKS, revocation lists via gossip
- **Crédito CaaS**: Operar nodo auth validador = gana `AUTH_CREDITS`; consumir auth remoto = gasta créditos
- **Fallback**: Modo offline (localStorage) siempre funcional; modo online (CaaS) para scale

## Tabla de Mapeo Isomórfico

| ZeroAuthy Concept | HSCSG Module | Ley I | Ley II | Ley III | CaaS |
|-------------------|--------------|-------|--------|---------|------|
| Tenant | `AuthTenant` | Soberano | AUT | Transparente | Nodo en mesh |
| Application | `AuthClient` | Propio | CDS | Auditable | Registro distribuido |
| User | `AuthEntity` | Persona | AUT×CDS | Lucidez | RAO-attributed |
| Token (access/refresh) | `AuthToken` | Material | AUT | Append-only | ValueDual (ZNU/USD) |
| MFA Factor | `AuthFactor` | Seguridad | Soberanía | Verificable | Local-first |
| Action | `AuthScript` | Extensible | Contribución | Revisable | CaaS compute |
| Event Stream | `AuthEventLog` | Memoria | CDS | Inmutable | Gossip sync |
| Organization | `AuthCollective` | Grupo | AUT | Gobernanza | Federação |
| Custom Domain | `AuthDomain` | Identidad | Soberanía | Verificable | DNS descentralizado |
| Rate Limit | `AuthQuota` | Protección | Justa | Transparente | Token bucket CaaS |

## Qué Asimilar vs Qué Extirpar (Resumen)

### ✅ ASIMILAR (Lógica Pura → TypeScript/Zustand)
1. **Token lifecycle**: create, validate, rotate, revoke, introspect
2. **Auth flows**: authorization_code_pkce, client_credentials, device_code, passwordless, otp
3. **MFA state machine**: enroll → challenge → verify → recover
4. **User/Entity CRUD**: create, read, update, delete, link identities, search
5. **Tenant/Org hierarchy**: create, settings, connections, branding, domains
6. **Actions engine**: trigger types, context, secrets, modules, job queue
7. **Event sourcing**: CloudEvents schema, webhook delivery, SSE, retry logic
8. **Storage interface**: generic Store contract (get/set/delete/query)
9. **Rate limiting**: token bucket algorithm per tenant/IP/endpoint
10. **Custom DB protocol**: script interface, sandboxing, error handling
11. **OpenID Connect metadata**: discovery, JWKS, configuration
12. **Consent & third-party apps**: grants, scopes, revocation

### ❌ EXTIRPAR (Infra Go/Node/OS → No copiar)
1. HTTP server, routing, middleware chain
2. Database drivers, migrations, connection pooling
3. TLS/SSL certificate management, ACME
4. Process management, signals, graceful shutdown
5. Configuration parsing (YAML + env vars), validation
6. Logging framework (zap), structured logging
7. Metrics (Prometheus), profiling (pprof)
8. Build system (Go modules, Makefile, cross-compile)
9. Docker/Podman files, Kubernetes manifests
10. Node.js VM sandbox (vm2, isolated-vm)
11. Auth0 SDK compatibility shims
12. Admin console as separate Vue app
13. Deploy CLI, migration tooling
14. OpenID conformance test runner

## Isomorfismo Leyes I/II/III + CaaS (Detalle)

### Ley I: No Dañar → Auth como Derecho, No Producto
```
ZeroAuthy: "Drop-in replacement for Auth0" → HSCSG: "Auth soberano por defecto"
- Usuario no paga por seat → Usuario contribuye (código, nodo, specs) → Acceso total
- Datos en servidor del usuario → Datos en nodo del usuario (localStorage/IndexedDB/CaaS)
- Vendor puede borrar cuenta → Usuario posee sus claves; red CaaS no puede revocar identidad
```

### Ley II: AUT × CDS → Auth Economy
```
ZeroAuthy: Self-hosted = cost infrastructure → HSCSG: Self-hosted = AUT; CaaS = CDS
- AUT: Claves maestras, tokens, policies bajo control usuario
- CDS: Operar nodo validador, contribuir specs, reportar bugs = AUTH_CREDITS
- priceParity: 1 AUTH_CREDIT ≈ 1 USD (oráculo CaaS Nivel 3 ReFi)
- Modo anfibio: Lógica idéntica; render muestra ZNU (offline) o USD (online)
```

### Ley III: Lucidez → Transparencia Radical
```
ZeroAuthy: x-source provenance, clean-room policy → HSCSG: AuthEventStore append-only
- Cada grant/deny/revoke → evento con: actor, reasoning, policy version, timestamp
- LucidezMode en UI: muestra raw JWT, decision tree, provenance chain
- Auditoría comunitaria: cualquiera puede verificar auth decisions contra policy
```

### CaaS: Red Federada de Auth
```
ZeroAuthy Plan 47: Hosted multi-tenant SaaS → HSCSG: AuthMesh P2P
- Nodos comparten: JWKS públicos, revocation lists, threat intel
- Consenso: Gossip protocol (no blockchain, no mining)
- Incentivos: Validar auth ajeno = ganar créditos; consumir = gastar
- Fallback: Modo local siempre operativo (offline-first)
```

## Vasos Comunicantes Cross-Repo

| Módulo HSCSG | Conexión ZeroAuthy | Vaso Comunicante |
|--------------|-------------------|------------------|
| `caas-credits.ts` | Auth credits earning | `AuthValidatorNode` emite `CreditEarned` event |
| `identity-rao.ts` | User → RAO attribution | `AuthEntity` siempre crea RAO al registrarse |
| `governance-triads.ts` | Org governance | `AuthCollective` usa triadas para policy changes |
| `value-dual.ts` | Token pricing | `AuthToken` usa `valueDual(ZNU, USD)` para display |
| `autonomy-guard.ts` | Offline auth | `AuthModule` funciona sin red (localStorage) |
| `consensus-gossip.ts` | JWKS sync | `AuthMesh` propaga keys via gossip |

## Decisiones EBD (D1-D8) Aplicadas a Auth

| D# | Decisión | Evidencia Primaria | Módulo Afectado |
|----|----------|-------------------|-----------------|
| D1 | Auth nativo CaaS (no wrapper Auth0) | ZeroAuthy clean-room = precedente | `auth-core.ts` |
| D2 | ACP por entidad (auth autonomous) | ADSOA: "autonomous controllability" | `auth-acp.ts` |
| D3 | DF replicado (auth state sync) | ADSOA: "several processes intercommunicated" | `auth-sync.ts` |
| D4 | Content Code semántico (auth events) | IEICE 2016: "identifies message with content" | `auth-events.ts` |
| D5 | UV-PKI propia (JWKS mesh) | ADSOA: "root-CA partitioned, uniqueness verified" | `auth-jwks.ts` |
| D6 | Folio Structure (auth transactions) | ADSOA: "identifies the transaction" | `auth-folio.ts` |
| D7 | Autonomous Guard (offline auth) | ADS: "continue operating despite failure" | `auth-guard.ts` |
| D8 | Coordination Protocol (mesh sync) | ADSOA: "autonomous coordinability" | `auth-mesh.ts` |

## KPIs y Tests Obligatorios

| Módulo | KPIs Mínimos | Test File |
|--------|-------------|-----------|
| `auth-tokens` | sign/verify < 5ms; rotation 100% success; revocation < 10ms | `auth-tokens.test.ts` |
| `auth-flows` | PKCE flow E2E < 500ms; device flow polling < 2s | `auth-flows.test.ts` |
| `auth-mfa` | TOTP verify < 10ms; recovery 100% | `auth-mfa.test.ts` |
| `auth-users` | CRUD < 20ms; search 10k users < 100ms | `auth-users.test.ts` |
| `auth-tenants` | Create tenant < 100ms; isolation verified | `auth-tenants.test.ts` |
| `auth-actions` | Script exec < 100ms; sandbox escape 0 | `auth-actions.test.ts` |
| `auth-events` | Webhook delivery 99.9%; SSE reconnect < 5s | `auth-events.test.ts` |
| `auth-storage` | All drivers pass conformance suite | `auth-storage.test.ts` |
| `auth-ratelimit` | Accurate bucket accounting; burst handling | `auth-ratelimit.test.ts` |
| `auth-mesh` | JWKS sync < 5s; partition tolerance | `auth-mesh.test.ts` |

## Plan de Implementación (Archivo por Archivo)

### Fase 3.1: Core Types + State
```
src/core/state/auth.ts           # AuthState, AuthEntity, AuthToken, AuthTenant, AuthClient, AuthFactor, AuthEvent
src/core/state/auth.test.ts      # Type tests, makeAuthState() seed
```

### Fase 3.2: Lógica Pura (lib)
```
src/core/lib/auth-tokens.ts      # sign, verify, rotate, revoke, introspect, JWKS
src/core/lib/auth-flows.ts       # authorization_code_pkce, client_credentials, device_code, passwordless, otp
src/core/lib/auth-mfa.ts         # enroll, challenge, verify, recover, policies
src/core/lib/auth-users.ts       # CRUD, link, search, import, export
src/core/lib/auth-tenants.ts     # CRUD, settings, connections, branding, domains, orgs
src/core/lib/auth-actions.ts     # triggers, context, sandbox, modules, jobs
src/core/lib/auth-events.ts      # CloudEvents, webhooks, SSE, retries, dead letter
src/core/lib/auth-storage.ts     # Store interface, memory driver, CaaS driver
src/core/lib/auth-ratelimit.ts   # token bucket per tenant/IP/endpoint
src/core/lib/auth-mesh.ts        # gossip JWKS, revocation sync, threat intel
src/core/lib/auth-value.ts       # valueDual integration, priceParity, nodeMode
```

### Fase 3.3: Store Integration
```
src/core/state/store.ts          # + auth: AuthState, actions, resetAll, partialize
```

### Fase 3.4: Pantalla + Nav
```
src/app/screens/AuthAdmin.tsx    # Dashboard: tenants, users, apps, logs, settings
src/app/screens/AuthFlows.tsx    # Visual flow builder/debugger
src/app/screens/AuthMesh.tsx     # Mesh status, peers, sync health
src/app/layout/Aside.tsx         # + AuthAdmin, AuthFlows, AuthMesh items (icon: Shield, GitBranch, Network)
src/app/App.tsx                  # + routes /auth, /auth/flows, /auth/mesh
```

### Fase 3.5: i18n (ES/EN/PT - 150+ keys per screen)
```
src/i18n/locales/es/auth.json
src/i18n/locales/en/auth.json
src/i18n/locales/pt/auth.json
```

### Fase 3.6: Tests KPI + Verificación
```
npm run test:auth                # vitest run src/core/lib/auth-*.test.ts
npx tsc --noEmit                 # 0 errores
npm run build                    # build OK
npm run preview                  # rutas /auth, /auth/flows, /auth/mesh → HTTP 200
```

## Referencias

- ZeroAuthy README: https://github.com/occupysaas/zeroauthy/blob/main/README.md
- Clean Room Policy: https://github.com/occupysaas/zeroauthy/blob/main/CLEAN_ROOM.md
- OpenID Conformance: https://github.com/occupysaas/zeroauthy/blob/main/docs/conformance.md
- Management API Roadmap: https://github.com/occupysaas/zeroauthy/blob/main/docs/superpowers/specs/2026-10-19-zeroauthy-management-roadmap-design.md
- HSCSG Architecture: `skills/hscsg-repo-assimilation/references/hscsg-architecture.md`
- Principio Anfibio: `skills/hscsg-repo-assimilation/references/anfibio-assimilation.md`
- Value Dual Pattern: `skills/hscsg-repo-assimilation/references/value-dual-pattern.md`