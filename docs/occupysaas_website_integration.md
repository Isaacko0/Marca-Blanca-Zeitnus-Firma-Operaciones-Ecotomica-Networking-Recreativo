# Integración: OccupySaaS Website → HSCSG Marca Blanca

## Triple Perspectiva

### 1. Usuario: Qué quiere lograr en su nodo

El usuario de HSCSG Marca Blanca quiere:
- **Landing page del movimiento**: Una página de entrada que explique la filosofía OccupySaaS, los proyectos activos, y cómo unirse
- **Portal de proyectos**: Navegación clara a ZeroAuthy, SalesCompel, y futuros proyectos "occupied"
- **Manifiesto vivo**: Los agravios, el método clean-room, la lineage histórica — todo editable y versionado en el nodo
- **Llamado a la acción**: Join GitHub, Discord, Donate, Propose target — integrados con CaaS identity
- **Multi-idioma**: ES/EN/PT nativo (el sitio original es solo EN)
- **Offline-first**: Funciona sin red desde localStorage/IndexedDB (PWA)

### 2. LLM: Qué asimilar (lógica pura) y qué extirpar (infra ajena)

#### ASIMILAR - Lógica Pura (patrones isomórficos)

| Componente Website | Módulo HSCSG | Lógica a Extraer |
|-------------------|--------------|------------------|
| **Content Structure** | `occupy-content.ts` | Sections: Hero, Grievances, Method, Projects, Map, Lineage, Join, FAQ — cada uno con heading, body, CTAs |
| **Project Registry** | `occupy-projects.ts` | Array de proyectos: name, tagline, replaces, status, tech stack, tags, repo URL, clean-room URL, features |
| **Timeline/Lineage** | `occupy-lineage.ts` | Eventos cronológicos: date, title, description, isCurrent |
| **FAQ System** | `occupy-faq.ts` | Preguntas/respuestas con categories, expandible, searchable |
| **Join Actions** | `occupy-join.ts` | CTAs con tracking: GitHub, Discord, Donate, Propose Issue |
| **Scroll Reveal** | `occupy-reveal.ts` | IntersectionObserver-based animation trigger (portable a React) |
| **Mobile Nav** | `occupy-nav.ts` | Hamburger menu toggle, aria attributes, focus management |
| **Marquee Loop** | `occupy-marquee.ts` | Infinite scrolling text loop (CSS animation) |
| **Theme Tokens** | `occupy-theme.ts` | Color palette (black/white/protest red), typography (Archivo/JetBrains/Permanent Marker), spacing scale |

#### EXTIRPAR - Infraestructura Ajena (NO copiar)

| Componente | Razón | Alternativa HSCSG |
|------------|-------|-------------------|
| Static HTML file | Single file, no components | React components + MDX content |
| GitHub Pages deploy | Platform-specific | Static export (Vite) + IPFS/CaaS hosting |
| Google Fonts (external) | External dependency, privacy | Self-hosted fonts / system font stack |
| Raw CSS (no design system) | Hard to theme/extend | Tailwind + design tokens en `occupy-theme.ts` |
| Vanilla JS (no framework) | No reactive state | React hooks + Zustand para UI state |
| English only | No i18n | i18n ES/EN/PT obligatorio (150+ keys) |
| No PWA | No offline support | Service Worker + IndexedDB cache |
| No analytics | No tracking | CaaS privacy-respecting analytics (opt-in) |

### 3. HSCSG + CaaS: Isomorfismo con Leyes I/II/III y CaaS

#### Ley I: No dañar base material / personas
- **Website**: Contenido estático, sin tracking, sin cookies
- **HSCSG**: `OccupyPortal` = contenido versionado en nodo usuario; zero telemetry por defecto
- **Mapeo**: Cada sección = `OccupySection` con `contentHash` (RAO-attributed); usuario posee su copy del manifiesto

#### Ley II: Ganarse la vida soberanizando = AUT × CDS
- **Website**: "Join the occupation" → contribute code/specs/noise
- **HSCSG**: `OccupyPortal` integra con CaaS: contribuciones → `OCCUPY_CREDITS`
- **Mapeo**:
  - `AUT` = usuario controla su copia del contenido, puede forkar, editar, self-host
  - `CDS` = traducir contenido, agregar FAQ, proponer targets, reportar bugs = créditos
  - `priceParity`: 1 OCCUPY_CREDIT ≈ 1 USD via oráculo CaaS

#### Ley III: Lucidez, nunca engañar
- **Website**: Clean-room policy visible, provenance links, "not legal advice" disclaimer
- **HSCSG**: `OccupyEventLog` = cada edit/translation/proposal → evento append-only con provenance
- **Mapeo**: `LucidezMode` muestra: raw content, git history, contributor RAOs, decision trail

#### CaaS: Comunidad como Servicio
- **Website**: Centralizado en occupysaas.com (GitHub Pages)
- **HSCSG**: `OccupyMesh` = red federada de portales; cada nodo tiene su copia; sync via gossip
- **Crédito CaaS**: Operar nodo portal = gana créditos; traducir/mantener contenido = gana créditos
- **Fallback**: Modo offline (IndexedDB + Service Worker) siempre funcional

## Tabla de Mapeo Isomórfico

| Website Concept | HSCSG Module | Ley I | Ley II | Ley III | CaaS |
|-----------------|--------------|-------|--------|---------|------|
| Hero Section | `OccupyHero` | Soberano | AUT | Transparente | Nodo en mesh |
| Grievances | `OccupyGrievances` | Manifiesto | CDS | Lucidez | Versiones firmadas |
| Method (5 steps) | `OccupyMethod` | Proceso | AUT×CDS | Auditable | Replicable |
| Project Cards | `OccupyProjectCard` | Proyectos | CDS | Verificable | Registry distribuido |
| Occupation Map | `OccupyMap` | Roadmap | AUT | Participativo | Propuestas on-chain |
| Lineage/Timeline | `OccupyLineage` | Historia | CDS | Inmutable | Append-only log |
| Join CTAs | `OccupyJoin` | Acción | AUT | Rastreable | CaaS identity |
| FAQ | `OccupyFAQ` | Conocimiento | CDS | Actualizable | Wiki distribuida |
| Marquee | `OccupyMarquee` | Slogan | AUT | Viral | Meme protocol |
| Theme/Design | `OccupyTheme` | Identidad | AUT | Consistente | Design tokens mesh |

## Qué Asimilar vs Qué Extirpar (Resumen)

### ✅ ASIMILAR (Lógica Pura → TypeScript/React/Zustand)
1. **Content architecture**: 8 sections con jerarquía semántica (Hero → Grievances → Method → Projects → Map → Lineage → Join → FAQ)
2. **Project registry**: Estructura de datos para proyectos "occupied" y "proposed" con metadatos completos
3. **Timeline events**: Array tipado de eventos históricos con fecha, título, descripción, flag `isCurrent`
4. **FAQ system**: Preguntas categorizadas, expandibles, buscables, con respuestas ricas (markdown)
5. **Join actions**: CTAs tipados con tracking de conversión (GitHub stars, Discord joins, donations, issue proposals)
6. **Scroll reveal pattern**: IntersectionObserver threshold/rootMargin configurables; classes CSS para animaciones
7. **Mobile nav pattern**: Hamburger toggle, aria-expanded, focus trap, ESC to close
8. **Marquee animation**: CSS-only infinite loop con pause-on-hover, reduced-motion support
9. **Design tokens**: Paleta (--black, --white, --protest-red), tipografía (display/mono/handwritten), spacing scale, border radius
10. **Accessibility**: Skip link, semantic HTML, ARIA labels, focus management, reduced motion, color contrast

### ❌ EXTIRPAR (Infra estática/hosting → No copiar)
1. Archivo HTML único monolítico
2. GitHub Pages deployment config (CNAME, .nojekyll, Actions workflow)
3. Google Fonts CDN links (privacy leak)
4. CSS raw sin design system / variables
5. Vanilla JS sin reactive state management
6. Inglés hardcodeado (sin i18n)
7. Sin Service Worker / PWA manifest
8. Sin analytics / privacy controls
9. Favicon/apple-touch-icon como archivos separados (unificar en assets)

## Isomorfismo Leyes I/II/III + CaaS (Detalle)

### Ley I: No Dañar → Portal como Bien Público, No Propiedad
```
Website: Static site on GitHub Pages → HSCSG: OccupyPortal en cada nodo
- Usuario no depende de occupysaas.com → Usuario tiene copia local completa (offline-first)
- Contenido no puede ser censurado/borrado → ContentHash + RAO = provenance inmutable
- No tracking/analytics obligatorio → Zero telemetry por defecto; opt-in CaaS analytics
- Fuentes externas (Google Fonts) → Self-hosted fonts / system stack
```

### Ley II: AUT × CDS → Occupation Economy
```
Website: "Join" = external links → HSCSG: Join = CaaS actions con créditos
- AUT: Usuario controla su portal; puede editar manifesto, agregar proyectos, traducir
- CDS: Traducir ES/EN/PT = OCCUPY_CREDITS; proponer target = créditos; reportar bug = créditos
- priceParity: 1 OCCUPY_CREDIT ≈ 1 USD (oráculo CaaS Nivel 3 ReFi)
- Modo anfibio: Contenido idéntico; render muestra ZNU (offline) o USD (online) para donaciones
- Mesh sync: Traducciones/ediciones se propagan via gossip; conflictos = triadas governance
```

### Ley III: Lucidez → Transparencia Radical del Movimiento
```
Website: FAQ con disclaimers → HSCSG: OccupyEventLog + LucidezMode
- Cada edit/translation/proposal → evento con: actor (RAO), content diff, rationale, timestamp
- LucidezMode en UI: muestra git-style diff, contributor chain, decision provenance
- Clean-room policy: embebida en portal; verificación de compliance por nodo
- Auditoría: Cualquiera puede verificar que ZeroAuthy/SalesCompel cumplen clean-room policy
```

### CaaS: Red Federada de Portales Occupy
```
Website: Single origin (occupysaas.com) → HSCSG: OccupyMesh P2P
- Nodos comparten: Content hashes, translations, project registry, FAQ entries
- Consenso: Gossip para content sync; CRDT para FAQ translations; triadas para new projects
- Incentivos: Hostear nodo = créditos; mantener traducciones = créditos; moderar proposals = créditos
- Data gravity: Content stays local; mesh = hashes + diffs, NO full replication por defecto
- Fallback: Portal 100% funcional offline (IndexedDB + SW cache)
```

## Vasos Comunicantes Cross-Repo

| Módulo HSCSG | Conexión Website | Vaso Comunicante |
|--------------|------------------|------------------|
| `caas-credits.ts` | Occupy credits | `OccupyContribution` emite `CreditEarned` al traducir/proponer |
| `identity-rao.ts` | Contributor attribution | Cada edit/proposal crea RAO; `OccupyContributor` = RAO holder |
| `governance-triads.ts` | Target proposals | `OccupyProposal` usa triadas para aprobar nuevo proyecto |
| `value-dual.ts` | Donation display | `OccupyDonate` usa `valueDual(ZNU, USD)` para amount display |
| `autonomy-guard.ts` | Offline portal | `OccupyPortal` funciona sin red (SW + IndexedDB) |
| `consensus-gossip.ts` | Content sync | `OccupyMesh` propaga translations/edits via gossip |
| `auth-module.ts` | Join actions | `OccupyJoin` integra con `AuthModule` para GitHub/Discord OAuth |

## Decisiones EBD (D1-D8) Aplicadas a OccupyPortal

| D# | Decisión | Evidencia Primaria | Módulo Afectado |
|----|----------|-------------------|-----------------|
| D1 | Portal nativo CaaS (no redirect) | OccupySaaS ethos = self-host | `occupy-core.ts` |
| D2 | ACP por contributor (content autonomous) | ADSOA: "autonomous controllability" | `occupy-acp.ts` |
| D3 | DF replicado (content sync) | ADSOA: "several processes intercommunicated" | `occupy-sync.ts` |
| D4 | Content Code semántico (portal events) | IEICE 2016: "identifies message with content" | `occupy-events.ts` |
| D5 | UV-PKI propia (content signing) | ADSOA: "root-CA partitioned, uniqueness verified" | `occupy-sign.ts` |
| D6 | Folio Structure (content transactions) | ADSOA: "identifies the transaction" | `occupy-folio.ts` |
| D7 | Autonomous Guard (offline portal) | ADS: "continue operating despite failure" | `occupy-guard.ts` |
| D8 | Coordination Protocol (mesh sync) | ADSOA: "autonomous coordinability" | `occupy-mesh.ts` |

## KPIs y Tests Obligatorios

| Módulo | KPIs Mínimos | Test File |
|--------|-------------|-----------|
| `occupy-content` | All sections render < 100ms; i18n keys 100% coverage ES/EN/PT | `occupy-content.test.ts` |
| `occupy-projects` | Project registry CRUD < 10ms; mesh sync < 5s | `occupy-projects.test.ts` |
| `occupy-lineage` | Timeline render < 50ms; new event append < 5ms | `occupy-lineage.test.ts` |
| `occupy-faq` | Search < 20ms; expand/collapse 60fps | `occupy-faq.test.ts` |
| `occupy-join` | CTA click tracking < 5ms; CaaS identity integration | `occupy-join.test.ts` |
| `occupy-reveal` | IntersectionObserver trigger < 16ms; no layout shift | `occupy-reveal.test.ts` |
| `occupy-nav` | Mobile toggle < 50ms; focus trap correct; a11y pass | `occupy-nav.test.ts` |
| `occupy-marquee` | CSS animation smooth; pause-on-hover; reduced-motion | `occupy-marquee.test.ts` |
| `occupy-theme` | Token consistency 100%; dark/light switch < 100ms | `occupy-theme.test.ts` |
| `occupy-mesh` | Content gossip < 5s; partition tolerance; CRDT merge | `occupy-mesh.test.ts` |

## Plan de Implementación (Archivo por Archivo)

### Fase 3.1: Core Types + State
```
src/core/state/occupy.ts           # OccupyState, OccupySection, OccupyProject, OccupyEvent, OccupyFAQ, OccupyTheme
src/core/state/occupy.test.ts      # Type tests, makeOccupyState() seed
```

### Fase 3.2: Lógica Pura (lib)
```
src/core/lib/occupy-content.ts     # Sections data structure, i18n keys, markdown processing
src/core/lib/occupy-projects.ts    # Project registry: CRUD, validation, mesh sync
src/core/lib/occupy-lineage.ts     # Timeline events: append, query, mesh gossip
src/core/lib/occupy-faq.ts         # FAQ: categories, search, expand, i18n
src/core/lib/occupy-join.ts        # CTAs: GitHub, Discord, Donate, Propose; CaaS identity
src/core/lib/occupy-reveal.ts      # Scroll reveal: IntersectionObserver wrapper, thresholds
src/core/lib/occupy-nav.ts         # Mobile nav: toggle, focus trap, a11y
src/core/lib/occupy-marquee.ts     # Marquee: CSS animation controller, reduced-motion
src/core/lib/occupy-theme.ts       # Design tokens: colors, typography, spacing, dark/light
src/core/lib/occupy-mesh.ts        # Gossip sync: content hashes, CRDT for translations
src/core/lib/occupy-value.ts       # valueDual integration, priceParity, nodeMode
```

### Fase 3.3: Store Integration
```
src/core/state/store.ts            # + occupy: OccupyState, actions, resetAll, partialize
```

### Fase 3.4: Pantallas + Nav
```
src/app/screens/OccupyPortal.tsx   # Landing page completa (Hero → FAQ)
src/app/screens/OccupyProjects.tsx # Project registry browser + detail
src/app/screens/OccupyGovernance.tsx # Propose target, triada voting, mesh status
src/app/screens/OccupyTranslate.tsx  # Translation interface (ES/EN/PT) con CaaS credits
src/app/layout/Aside.tsx           # + OccupyPortal, OccupyProjects, OccupyGovernance, OccupyTranslate (icons: Users, Briefcase, Gavel, Languages)
src/app/App.tsx                    # + routes /occupy, /occupy/projects, /occupy/governance, /occupy/translate
```

### Fase 3.5: i18n (ES/EN/PT - 200+ keys per screen)
```
src/i18n/locales/es/occupy.json
src/i18n/locales/en/occupy.json
src/i18n/locales/pt/occupy.json
```

### Fase 3.6: PWA + Service Worker
```
public/manifest.json               # PWA manifest (name, icons, start_url, display: standalone)
public/sw.js                       # Service Worker: cache-first static, network-first API, offline fallback
vite.config.ts                     # + PWA plugin (vite-plugin-pwa)
```

### Fase 3.7: Tests KPI + Verificación
```
npm run test:occupy                # vitest run src/core/lib/occupy-*.test.ts
npx tsc --noEmit                   # 0 errores
npm run build                      # build OK (genera dist/ con SW)
npm run preview                    # rutas /occupy/* → HTTP 200; SW registered; offline works
```

## Referencias

- Website Repo: https://github.com/occupysaas/website
- Live Site: https://occupysaas.com/
- Website README: https://github.com/occupysaas/website/blob/main/README.md
- Index.html: https://github.com/occupysaas/website/blob/main/index.html
- HSCSG Architecture: `skills/hscsg-repo-assimilation/references/hscsg-architecture.md`
- Principio Anfibio: `skills/hscsg-repo-assimilation/references/anfibio-assimilation.md`
- Value Dual Pattern: `skills/hscsg-repo-assimilation/references/value-dual-pattern.md`
- PWA Pattern: `skills/hscsg-repo-assimilation/references/vite-windows-gotchas.md`