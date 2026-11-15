# Loomio - Backup de Asimilación HSCSG v15 OS

## Información del Repositorio Fuente

- **Repositorio**: https://github.com/loomio/loomio
- **Licencia**: GNU Affero General Public License v3.0 (AGPL-3.0)
- **Commit analizado**: master (33,194 commits, última actividad Nov 12, 2026)
- **Lenguajes**: Ruby (Rails 7), JavaScript (Vue 3), SQL (PostgreSQL)
- **Estrellas**: 2.6k | Forks: 709 | Watchers: 83

## Análisis de Copyright (FASE 1 - Legal Safe)

### ✅ ASIMILABLE (Código completo - AGPL-3.0)
- `app/` - Modelos, controladores, servicios, jobs, vistas
- `config/` - Rutas, configuración, locales
- `db/` - Migraciones, schema, seeds
- `lib/` - Código de biblioteca compartida
- `vue/src/` - Frontend Vue 3 (componentes, composables, mixins, plugins)
- `spec/` - Tests RSpec
- `test/` - Tests adicionales
- `docs/agents/` - Instrucciones para agentes AI (AGENTS.md y subdocs)
- `Gemfile`, `package.json`, `mise.toml` - Configuración de dependencias
- `docker_start.sh`, `Dockerfile`, `Procfile.dev` - Deployment

### ❌ NO ASIMILABLE (Brand Assets - Requieren permiso Loomio Cooperative)
- `public/` - Assets estáticos públicos
- Logos, branding visual, nombres comerciales "Loomio"
- `docs/` de usuario final (manual de usuario, capturas de pantalla)
- Cualquier asset en `app/assets/images/` con branding Loomio
- Configuración de deployment específica de loomio.com

### ⚠️ CONDICIONES AGPL-3.0
- **Network use is distribution**: Si se despliega como servicio, el código modificado debe estar disponible
- **Same license**: Cualquier trabajo derivado DEBE usar AGPL-3.0
- **Disclose source**: Código fuente completo debe ser accesible
- **Patent grant**: Contribuyentes otorgan derechos de patente

### Decisión HSCSG: Módulo ANFIBIO
El código se asimila como `@hscsg/arm-loomio` bajo AGPL-3.0. La lógica de decisión colaborativa es agnóstica a la unidad monetaria. El brand "Loomio" NO se asimila - se crea brand propio "ARM Decision Engine" / "HSCSG ARM Decidim".

---

## Inventario de Patrones Arquitectónicos (FASE 2 - Technical)

### 1. Modelo de Dominio Principal

| Entidad | Archivo | Descripción | Patrones Clave |
|---------|---------|-------------|----------------|
| **Group** | `app/models/group.rb` (519 líneas) | Organización principal, soporta jerarquía parent/subgroup, configuración de privacidad, permisos granulares | `Discard::Model`, `HasRichText`, `SelfReferencing`, `GroupPrivacy`, `HasNotifications`, `HasTokens`, `NoSpam`, `PaperTrail` |
| **User** | `app/models/user.rb` (422 líneas) | Participante, auth, membresías, avatares, preferencias, legal acceptance | `HasRichText`, `HasTokens`, `HasDefaults`, `HasExperiences`, `HasAvatar`, `PaperTrail` |
| **Discussion** | `app/models/discussion.rb` (168 líneas) | Hilo de discusión con título, descripción, tags, adjuntos | `HasTopicItems`, `HasNotifications`, `HasMentions`, `Reactable`, `Bookmarkable`, `Searchable`, `PaperTrail` |
| **Poll** | `app/models/poll.rb` (1020 líneas) | **Core decision engine** - 11 tipos de poll, voting rules, STV, weighted voting, anonymous ballots | `HasCustomFields`, `HasTopicItems`, `STV`, `WeightedVoting`, `AnonymousBallots`, `PaperTrail` |
| **Stance** | `app/models/stance.rb` (297 líneas) | Voto/posición de un participante en un poll, con choices y scores | `HasMentions`, `Reactable`, `Bookmarkable`, `WeightHistory`, `PaperTrail` |
| **Membership** | `app/models/membership.rb` (126 líneas) | Relación User-Group con roles (admin, delegate), volumen notificaciones | `HasCountChanges`, `HasVolume`, `HasTimeframe`, `HasTokens`, `PaperTrail` |
| **Topic** | `app/models/topic.rb` (330 líneas) | Contenedor polimórfico (Discussion/Poll), sequence IDs, privacy, locking | `SelfReferencing`, `HasPaperTrail`, `HasTags`, `RangeSet` |

### 2. Tipos de Poll (Decision Patterns) - `AppConfig.poll_types`

| Tipo | Key | Descripción | Voting Method | Use Case |
|------|-----|-------------|---------------|----------|
| **Proposal** | `proposal` | Decisión binaria agree/disagree/block | majority/consensus | Decisiones formales |
| **Check** | `check` | Verificación rápida | simple | Health checks |
| **Advice** | `advice` | Recolectar input sin decisión vinculante | consultative | Request for comments |
| **Consent** | `consent` | Consentimiento (no objeción) | consent | Sociocracy |
| **Consensus** | `consensus` | Consenso graduado | consensus | Holacracy |
| **Poll** | `poll` | Múltiples opciones | plurality/majority | Encuestas |
| **Score** | `score` | Puntuación numérica por opción | scoring | Priorización |
| **Dot Vote** | `dot_vote` | Distribución de puntos limitados | dot_voting | Presupuesto participativo |
| **Ranked Choice** | `ranked_choice` | Preferencias ordenadas | IRV/RCV | Elecciones |
| **STV** | `stv` | **Single Transferable Vote** | STV (Scottish/Meek) | Elecciones proporcionales |
| **Meeting** | `meeting` | Programación de reuniones | scheduling | Agenda |

### 3. Servicios Core (Business Logic)

| Servicio | Archivo | Responsabilidad |
|----------|---------|-----------------|
| **StvCountService** | `app/services/stv_count_service.rb` | Algoritmo STV (Scottish STV + Meek STV) - **Único matemáticamente** |
| **MembershipService** | `app/services/group_service/membership_service.rb` | Gestión de membresías, invitaciones, roles |
| **PollTemplateService** | `app/services/poll_template_service.rb` | Templates predefinidos por tipo |
| **AnonymousBallotService** | `app/services/anonymous_ballot_service.rb` | Votos anónimos con ballots |
| **CollabDocumentAuthService** | `app/services/collab_document_auth_service.rb` | Auth para edición colaborativa (Yjs/Automerge) |
| **NotificationDeliveryRouters** | `app/services/notification_delivery_routers/` | Routing de notificaciones email/push |
| **Subscription Services** | `app/services/subscriptions/` | Billing Chargify/Stripe, planes, trials |

### 4. Sistema de Permisos (Ability)

- **Archivo base**: `app/models/ability/base.rb`
- **Por recurso**: `app/models/ability/{group,discussion,poll,stance,membership,user,topic,comment,attachment}.rb`
- **Patrón**: CanCanCan-like con reglas por recurso y scopes SQL optimizados
- **Roles**: Group admin, Thread admin, Member, Guest, Site admin

### 5. Frontend Vue 3 Architecture

| Capa | Ubicación | Patrones |
|------|-----------|----------|
| **Components** | `vue/src/components/` | SFCs, lazy-loaded, Vuetify 3 |
| **Composables** | `vue/src/composables/` | `useRecords`, `useThread`, `usePoll`, `useGroup`, `useNotification` |
| **Mixins** | `vue/src/mixins/` | `RecordView`, `ThreadView`, `PollView` (legacy, migrando a composables) |
| **Plugins** | `vue/src/plugins/` | Vuetify, i18n, router, marked, Sentry |
| **Shared** | `vue/src/shared/` | Types, utils, constants, API client |
| **Routes** | `vue/src/routes.js` | Lazy-loaded routes, nested routes para groups/threads |

### 6. Background Jobs

- `HourlyTaskJob` - Limpieza, recuentos, session retention
- `InboundEmailDeliveryJob` - Action Mailbox processing
- `ApplicationJob` - Base con retry, discard_on

### 7. Real-time / Collaborative

- **ActionCable** + **Yjs/Automerge** para edición colaborativa
- **CollabServer** mount en `/collab_server`
- **Push Relay** para notificaciones móviles/desktop
- **Web Push** (VAPID) + **Firebase/APNs** para mobile

---

## Decisiones de Asimilación (FASE 2 - Integration Strategy)

### Mapeo Loomio → ARM/HSCSG

| Loomio Concept | ARM Concept | Package Target | Notas |
|----------------|-------------|----------------|-------|
| **Group** | `Affiliate` / `Project` | `arm-core` | Jerarquía parent/subgroup → Project tree |
| **User** | `Affiliate` (profile) | `arm-core` | Extender con karma, trust score |
| **Discussion** | `Investigation` / `Brief` | `arm-core` | Thread model → Investigation thread |
| **Poll** | `Proposal` / `GovernanceAction` | `arm-sensorica` / `arm-core` | 11 tipos → Proposal types |
| **Stance** | `Vote` / `Position` | `arm-sensorica` | Weighted voting → Sensorica value equation |
| **Membership** | `ProjectMembership` / `AffiliateRole` | `arm-sensorica` | Roles + volume → Trust + notification prefs |
| **Topic** | `Thread` / `Context` | `arm-core` | Polymorphic container → Thread context |
| **STV Count** | `STVAlgorithm` | `arm-core/lib` | **Extraer como librería matemática pura** |
| **Poll Types** | `ProposalTemplates` | `arm-cli` / `arm-ui` | Config-driven templates |
| **Anonymous Ballots** | `AnonymousVoting` | `arm-sensorica` | Privacy-preserving voting |
| **Vote Weights** | `WeightedGovernance` | `arm-sensorica` | Integración con trust score |
| **Collab Editing** | `CollabDocument` | `arm-ui` / `arm-api` | Yjs integration |
| **Notifications** | `EventNotification` | `arm-core` / `arm-mcp` | Event-driven |

### Patrones Únicos a Extraer (High Value)

1. **STV Counting Algorithm** - Implementación completa Scottish STV + Meek STV con tests contra elecciones oficiales escocesas
2. **Poll Type System** - 11 tipos configurables via YAML (`config/poll_types.yml`)
3. **Anonymous Ballots** - Ballots criptográficamente separados de identidad
4. **Vote Weighting** - Pesos por miembro (3 decimales), validación estricta
5. **Thread Sequence IDs** - RangeSet para ordering eficiente de contributions
6. **Group Hierarchy** - Parent/subgroups con herencia de permisos y subscription
7. **Collaborative Editing Auth** - Token-based auth para Yjs/Automerge
8. **Notification Routing** - Email/Push/In-app con volume preferences per topic
9. **Legal Acceptance Flow** - Terms acceptance tracking con timestamp
10. **Subscription Limits** - Thread limits per plan, trial/demo handling

### Configuración Clave a Portar

- `config/poll_types.yml` - Definición de 11 poll types con defaults, voting methods, constraints
- `config/locales/` - i18n completo (múltiples idiomas)
- `config/routes.rb` - API versionada (user0, server0, v1, mobile)
- `mise.toml` - Tool version management (Ruby, Node, npm)

---

## Riesgos y Mitigaciones

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| **AGPL-3.0 Network Clause** | Si ARM se despliega como SaaS, debe liberar código | Documentar claramente; ofrecer self-hosted; considerar dual-license para componentes core |
| **Rails Dependency** | Coupling a Rails ecosystem | Extraer lógica de dominio a librerías Ruby puras / TypeScript ports |
| **Vue/Vuetify Coupling** | Frontend tied to Vuetify 3 | Crear ARM UI components agnósticos; usar ARM design tokens |
| **PostgreSQL Specifics** | SQL scopes, CTEs, jsonb queries | Mantener repository pattern; abstractar en ARM repositories |
| **Chargify/Stripe Billing** | Subscription logic tied to providers | Extraer interface `SubscriptionProvider`; mock para tests |
| **Brand Confusion** | Users may confuse ARM Decision Engine con Loomio | Branding claro "HSCSG ARM Decidim"; no usar nombre Loomio |
| **STV Algorithm Complexity** | Edge cases en counting | Portar tests oficiales escoceses; property-based testing |

---

## Próximos Pasos (FASE 3 - Implementation)

1. **Crear `@hscsg/arm-loomio` package** con estructura ARM estándar
2. **Extraer STV Algorithm** → `packages/arm-core/src/lib/stv.ts`
3. **Portar Poll Types** → `packages/arm-core/src/lib/proposalTypes.ts` + config YAML
4. **Portar Domain Models** → `packages/arm-sensorica/src/core/governance/` (extender)
5. **Crear CLI** → `packages/arm-loomio/cli` para decision workflows
6. **Crear MCP Tools** → `packages/arm-loomio/mcp` para AI-assisted decisions
7. **OpenSpec SDD** → `packages/arm-loomio/openspec/specs/arm-loomio.openspec.yml`
8. **Tests** → Portar test suite STV + property-based tests
9. **Documentación** → `docs/asimilacion/loomio/integration.md` (este archivo es borrador)
10. **Integración ARM** → Conectar con `arm-core` valueDual, `arm-sensorica` governance