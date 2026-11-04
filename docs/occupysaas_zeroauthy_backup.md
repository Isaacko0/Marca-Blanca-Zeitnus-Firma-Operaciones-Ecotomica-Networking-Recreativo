# Backup: OccupySaaS ZeroAuthy

## Información General

- **Repositorio original**: https://github.com/occupysaas/zeroauthy
- **Organización**: occupysaas
- **Licencia**: Apache-2.0
- **Estado**: Early preview 1.0 (OpenID Certified)
- **Fecha de clonación**: 2026-11-04
- **Commits**: 779 commits en main

## Qué es ZeroAuthy

ZeroAuthy es una reimplementación **clean-room** de un servidor de identidad compatible con Auth0. Permite apuntar un SDK existente de Auth0 a un tenant de ZeroAuthy y funciona sin cambios de código.

### Stack Tecnológico

- **Lenguaje principal**: Go (81.7%)
- **Frontend**: TypeScript (6.4%), Vue (5%), JavaScript (4.9%)
- **Almacenamiento**: SQLite, PostgreSQL, MySQL, gRPC plugins, memoria
- **Build**: Go modules, Makefile
- **Tests**: Unit + contract + storage conformance + OpenID conformance suite

### Arquitectura Core

```
zeroauthy/
├── api/                    # OpenAPI specs (authentication.yaml, management.yaml)
├── cmd/zeroauthy/          # Entry point CLI
├── internal/               # Lógica de negocio privada
├── pkg/                    # Paquetes públicos reutilizables
├── console/                # Admin console (Vue + TypeScript)
├── proto/store/v1/         # gRPC storage plugin contracts
├── docs/                   # Documentación extensa + planes de implementación
├── tests/                  # Tests unit, e2e, conformance
└── scripts/                # Scripts de utilidad
```

### Funcionalidades Implementadas (Planes 1-34)

**Authentication API**:
- OIDC discovery, JWKS, multi-tenant domains
- Hosted login, authorization code + PKCE
- `client_credentials`, rotating refresh tokens, revoke & logout
- Password grants, PAR, device flow, consent, signup, password reset
- MFA: TOTP, email codes, recovery codes, MFA policies, remember-browser
- Passwordless: email/SMS, magic links, OTP grant
- Phone providers: Twilio, Amazon SNS, custom via Actions
- Custom database connections (Auth0 scripts compatible)

**Management API**:
- Applications, APIs, client grants, database connections
- Users (search, identity linking, sessions, refresh tokens, grants, tickets)
- User import/export jobs, verification email
- Tenant email providers and templates
- Roles, permissions, generic OAuth/OIDC, Google, Microsoft connections
- Actions: login, credentials exchange, signup, password reset/change, custom email triggers
- Organizations I & II: members, role assignments, invitations, org application grants
- Logs, log streams, statistics
- Event streams: CloudEvents, webhooks, SSE, Actions `event-stream`
- Tenant settings, attack protection, automatic blocks
- Signing keys, custom domains, automatic TLS
- Branding, themes, identifier-first login, localization

**Storage Plugins**:
- Memory (tests/demos)
- SQLite (pure Go, no CGO)
- PostgreSQL 14+ (requires UTF-8 LC_CTYPE)
- MySQL 8.0.17+ (no MariaDB)
- gRPC external plugins

**Verificación de Compatibilidad**:
- OpenID Certified: Basic OP, Config OP, Form Post OP
- Tested against RP-Initiated Logout OP profile
- Verified con: auth0-spa-js, auth0-react, nextjs-auth0, express-openid-connect, auth0-auth-js, node-auth0, Auth0.NET, Auth0 CLI, Deploy CLI
- `make conformance` ejecuta suite completa OIDF (~10-20 min)

### Roadmap (Planes 33b-48)

| Plan | Área | Profundidad |
|------|------|-------------|
| 33b | WebAuthn MFA y passkeys | full |
| 35 | Client credentials: private_key_jwt, JAR, token exchange | short |
| 36 | Enterprise OIDC restante | short |
| 37 | SAML, WS-Federation, SCIM, self-service SSO | full |
| 38 | AD/LDAP connector, Forms and Flows, network ACLs | full |
| 39 | Additional social providers | short |
| 40 | Actions III | short |
| 41 | OIDC protocol extras, CIBA, certificación OIDF formal | full |
| 42 | My Account API, My Organization API | full |
| 43 | Token Vault, connected accounts | full |
| 44 | ACUL, remaining Universal Login modes | full |
| 45 | Operational hardening sweep | short |
| 46 | Release pipeline, packaging, samples | short |
| 47 | Hosted zeroauthy (multi-tenant SaaS) | full |
| 48 | Refresh tokens II | short |

### Clean Room Policy

**Fuentes permitidas**:
- Documentación pública de Auth0 (https://auth0.com/docs)
- Changelog público de Auth0
- OpenAPI Apache-2.0 de https://github.com/aminya/auth0-openapi
- RFCs IETF, especificaciones OpenID Foundation
- SDKs open-source de Auth0 (MIT, Apache-2.0) - solo como test clients y para estudiar código
- Observación firewalled de Management API (bajo condiciones estrictas)
- Behavior testing contra tenant propio del maintainer

**Prohibido**:
- Decompilar, desensamblar software servidor de Auth0
- Probing/scraping tenants live de Auth0 (excepto observación autorizada)
- Reverse engineering de software no open-source
- Capturar dashboard/hosted pages de Auth0
- Copiar UI templates, stylesheets, images, product copy de Auth0
- Usar marcas Auth0 más allá de declaraciones nominativas
- Contribuir código/conocimiento bajo NDA o empleo previo no público

**Provenance**: Cada operación en `api/*.yaml` lleva extensión `x-source` con URLs públicas.

### Licencia

Apache-2.0. Ver `LICENSE` y `NOTICE`.

### Desarrollo

```bash
make test           # unit + contract + storage conformance (memory, SQLite)
make test-sql       # SQL driver tests vs PostgreSQL 17, MySQL 8.4 (podman/docker)
make generate       # regenera código desde api/authentication.yaml y api/management.yaml
make console        # lint, test, rebuild admin console (Node 22+)
make e2e            # Auth0 SDKs contra zeroauthy live en SQLite
make e2e-events     # Event Streams browser, SDK, CLI, SSE, privacy
make e2e-deploy     # Deploy CLI YAML/directory round trips
make check-sources  # verifica cada x-source provenance link
make conformance    # OpenID conformance suite (podman/docker, Linux; ~10-20 min)
```