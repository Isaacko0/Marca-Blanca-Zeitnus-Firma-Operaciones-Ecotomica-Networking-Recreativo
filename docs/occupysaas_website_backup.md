# Backup: OccupySaaS Website (occupysaas.com)

## Información General

- **Repositorio original**: https://github.com/occupysaas/website
- **Sitio web**: https://occupysaas.com/
- **Organización**: occupysaas
- **Licencia**: Apache-2.0
- **Estado**: Static site deployed on GitHub Pages
- **Fecha de clonación**: 2026-11-04
- **Commits**: 6 commits en main

## Qué es el Sitio OccupySaaS

El sitio web oficial de **OccupySaaS** — un movimiento de protesta escrito en código. Desarrolladores despedidos, armados con IA y documentación pública, construyendo **reemplazos clean-room, open-source, drop-in** para las plataformas SaaS gigantes — un seat a la vez.

### Stack Tecnológico

- **HTML/CSS/JS plano**: Sin build step, sin framework
- **Estilos**: CSS custom (black/white/protest red palette)
- **Fuentes**: Archivo (variable), JetBrains Mono, Permanent Marker (Google Fonts)
- **Deploy**: GitHub Pages con custom domain (occupysaas.com)
- **DNS**: A/AAAA records a GitHub Pages IPs + CNAME www

### Estructura del Repo

```
website/
├── index.html              # Página principal (546 líneas)
├── assets/
│   ├── css/site.css        # Estilos completos
│   ├── js/site.js          # Mobile nav + scroll reveal
│   └── img/                # Logo, crowd silhouette, favicon, social card
├── CNAME                   # Custom domain: occupysaas.com
├── .nojekyll               # Disable Jekyll processing
├── LICENSE                 # Apache-2.0
└── README.md               # Documentación del sitio
```

### Contenido de la Página (index.html)

#### Hero Section
- **Tagline**: "Est. October 2026 · Apache-2.0"
- **Headline**: "They laid us off. We're rebuilding their SaaS."
- **Subhead**: OccupySaaS = protest movement in code; laid-off engineers + AI + public docs → clean-room, open-source, drop-in replacements
- **CTAs**: "See the first releases" → #projects, "Join the occupation" → #join
- **Logo**: Raised fist holding laptop with code symbol above protest crowd, SaaS skyscrapers, "OCCUPY" red brush / "SAAS" black
- **Stamp**: "We are the 1,000,000"
- **Marquee**: "Open source Clean room Drop-in compatible Self-hosted No per-seat tax Your data, your servers Fork the 1% Spec, not stolen code" (looping)

#### The Grievances (Why)
1. **Per-seat pricing is a tax on growth** — Every hire/intern/contractor = another line item; infrastructure shouldn't charge rent by the head
2. **Lock-in is not a feature** — Proprietary APIs, export walls, surprise price hikes keep customers captive; compatible open alternatives set them free
3. **They cut us. We commit.** — A million engineers let go while platforms kept growing; we still know how to ship; now we ship in the open

#### The Method (Clean Room → AI Rebuild → Drop-in)
1. **Read the public record** — Public API refs, open standards (OAuth 2.0, OIDC, REST), published SDK behavior → written spec; nothing confidential/leaked/from former employers
2. **Raise the firewall** — Spec writers and builders stay separated; each repo carries `CLEAN_ROOM.md`; provenance recorded for every fixture/reference
3. **Rebuild with AI** — AI agents implement from spec alone — contracts first (`openapi.yaml`), then code, then tests — under human review at every merge
4. **Prove compatibility** — Compatibility laboratory runs vendors' own public client SDKs against our server; if existing code doesn't work unchanged, it isn't done
5. **Release it to everyone** — Apache-2.0, self-hostable, pluggable storage, no telemetry you didn't ask for, no seat counter

**Firewall Diagram**:
- **Allowed in**: Public API docs, Open standards & RFCs, Public SDK behaviour, Black-box test results
- **Never allowed**: Leaked/proprietary source, Decompiled binaries, Former-employer confidential info, Copied UI assets or trademarks

#### First Releases (Two Towers Occupied)

**ZeroAuthy** (Early · in the open · Go)
- Replaces ~~Auth0~~
- Self-hostable identity server speaking Auth0 Authentication API
- OIDC discovery, JWKS, multi-tenant domains
- Hosted login, auth code + PKCE, client_credentials, rotating refresh tokens, revoke & logout
- Verified with auth0-spa-js, auth0-react, nextjs-auth0
- Tags: SQLite, PostgreSQL, MySQL, gRPC plugins, Apache-2.0

**SalesCompel** (Early · in the open · Go · Vue · TypeScript)
- Replaces ~~Salesforce~~
- Free, open-source Salesforce replacement with tenant-isolated Go/PostgreSQL core, Vue record editor, compatibility laboratory
- Persistent Account & Contact CRUD, Object describe, limited queries
- External-ID upsert, bearer authentication
- OpenAPI 3.2 REST contract, offline test lab
- Tags: PostgreSQL, Multi-tenant, REST, i18n, Apache-2.0

#### The Occupation Map (Who's Next?)
- **Occupied**: Identity & Auth (ZeroAuthy), CRM (SalesCompel)
- **Proposed**: Docs & Wikis, Issue Tracking, Feature Flags, Observability, Customer Support
- **+ Your pick**: Propose a target via GitHub issue

#### Lineage (Zuccotti Park to git push)
1. 17 Sep 2011 — Occupy Wall Street begins (Zuccotti Park, NYC)
2. Oct 2011 — Movement spreads globally
3. 15 Nov 2011 — Zuccotti Park cleared; language of 1%/99% persists
4. 2022–2025 — Great tech layoffs; subscription prices keep climbing
5. 14 Oct 2026 — ZeroAuthy goes public (first clean-room rebuild, Apache-2.0)
6. 15 Oct 2026 — SalesCompel joins (second tower; more to come — decided in the open)

#### Join (Occupy Everything)
Four ways:
1. **Write code** — Pick open issue, follow clean-room policy, open PR
2. **Self-host it** — Run release against real SDKs, report breaks
3. **Write specs** — Turn public docs into precise, testable specifications
4. **Make noise** — Star repos, share site, tell CFO per-seat cost

**CTAs**: Join on GitHub, Join on Discord, Donate via Buy Me a Coffee, Propose a target

#### Fair Questions (FAQ)
1. **Is this legal?** — Clean-room reimplementation is long-established; work from public info, write own code; interoperating ≠ copying; each project publishes clean-room policy + provenance; not legal advice
2. **Affiliated with Auth0/Okta/Salesforce?** — No; independent, not endorsed/sponsored; names used only for compatibility
3. **Can former employees contribute?** — Yes, but never with confidential knowledge; work only from public material; inside knowledge → stay on public-spec side of firewall or sit out; read `CLEAN_ROOM.md`
4. **Why use AI?** — Giants had thousands of engineers; we have a movement; AI lets small group turn spec → working code fast; humans write specs, review changes, own result; compatibility tests against real SDKs decide done
5. **Why Go?** — Portability; single self-contained binary; self-host = drop one file on server/Docker/Podman; no installer/runtime/shared libs; cross-compiles Linux/macOS/Windows/x86/ARM; minimal container
6. **Why not Rust?** — Nothing wrong with Rust; Go picked for first projects for simpler one-file container-friendly drop-in; Rust ports welcome — specs/contracts/tests are language-neutral
7. **Is it production-ready?** — Not yet; both early, say so plainly in READMEs with exact working features; try, break, file issues
8. **What does it cost?** — Nothing; Apache-2.0; run, fork, sell services around it; only ask: contribute back what you can

### Assets

- `assets/img/logo.png` — Logo principal (1000x1000)
- `assets/img/favicon.svg` — Favicon SVG
- `assets/img/favicon.ico` — Favicon ICO (multi-size)
- `assets/img/apple-touch-icon.png` — Apple touch icon
- `assets/img/og.jpg` — Open Graph social card
- `assets/css/site.css` — Estilos completos (black/white/red palette, responsive, scroll reveal animations)
- `assets/js/site.js` — Mobile nav toggle + IntersectionObserver scroll reveal

### DNS Configuration (para GitHub Pages)

| Type | Host | Value |
|------|------|-------|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| AAAA | `@` | `2606:50c0:8000::153` |
| AAAA | `@` | `2606:50c0:8001::153` |
| AAAA | `@` | `2606:50c0:8002::153` |
| AAAA | `@` | `2606:50c0:8003::153` |
| CNAME | `www` | `occupysaas.github.io` |

### Licencia

Apache-2.0. Ver `LICENSE`.

### Preview Local

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

### Publicar en GitHub Pages

Settings → Pages → Deploy from a branch → `main` / `/ (root)`, custom domain `occupysaas.com` (CNAME file ya lo hace), Enforce HTTPS once cert issued.