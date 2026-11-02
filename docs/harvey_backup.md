# Harvey — Autonomous AI Sales Agent (Backup de Fuente)

**Fecha**: 2026-10-29  
**URLs fuente**:
- GitHub: https://github.com/ethanplusai/harvey
- Blog/Docs: https://blog.digicuratoragency.com/harvey-open-source-sales-agent-claude-code
- Licencia: MIT

---

## 1. Harvey — Qué es

**Harvey** es un **agente de ventas autónomo open-source** que corre sobre **Claude Code** (suscripción Claude Pro/Max) o **Codex** (suscripción ChatGPT). No requiere API keys ni facturación por token: usa la suscripción flat del usuario.

### Funcionalidad Principal
- **Descubre** negocios locales (trades, clínicas, startups, empresas que contratan)
- **Perfilа** sus sitios web (3 HTTP requests, sin modelo, gratis)
- **Escribe** secuencias de 3 emails fríos personalizados (75/75/40 palabras)
- **Envía** vía Gmail, Microsoft 365, SMTP o Instantly
- **Maneja respuestas**: polling, deduplicación, clasificación de intención, draft de respuesta
- **Dashboard web** en `localhost:5555` para aprobar/rechazar/editar
- **SQLite** local para estado, observaciones, cohortes, campañas

### Diferenciadores Clave
| Característica | Harvey | Herramientas Típicas ($250-500/mes) |
|----------------|--------|-------------------------------------|
| Coste modelo | **$0** (suscripción flat) | Por token/API |
| Prospección | Gratis (OpenStreetMap) o ~$0.37/1k | Apollo, ZoomInfo, Clearbit |
| Perfilado web | 3 requests HTTP, gratis | A menudo pagado |
| Contactos micro-negocios | ✅ Fuertes (5-50 empleados) | ❌ Cobertura ~30% |
| Aprobación humana | **Por defecto ON** | A menudo autopilot |
| Código | **Python + Markdown skills** (editable) | Cerrado/SaaS |
| Legal/Deliverability | CAN-SPAM, GDPR, warmup, kill-switch | Básico o none |

---

## 2. Arquitectura Técnica

### Pipeline de 4 Etapas (Determinístico salvo escritura)
```
1. DISCOVER  →  proveedores (OSM gratis, TinyFish gratis, DataForSEO, Serper, Scavio)
2. PROFILE   →  3 HTTP requests (homepage, robots.txt, sitemap, team, careers)
3. ENRICH    →  dueños/decision-makers desde sitio propio
4. VERIFY    →  patrón de email + verificación honesta (verified/risky/guess/invalid)
```

### Sub-agentes (5, cada uno con skills distintas)
| Agente | Skills | Función |
|--------|--------|---------|
| **Scout** | prospecting_tactics, lead_qualification, account_navigation, signal_playbook, product_knowledge | Scoring y personalización de descubiertos |
| **Writer** | signal_playbook, email_frameworks, sales_methodology, offer_strategy, product_knowledge, competitive_intel | 3-email sequences, ban-list AI-tells |
| **Sender** | email_frameworks | Render merge vars, outbox, pacing, daily cap, stop-on-reply |
| **Handler** | sales_methodology, offer_strategy, objection_handling, product_knowledge, competitive_intel | Poll replies, LAARC loop, bounce detection, kill-switch |
| **Analyst** | (idle cycles) | Pipeline stats, campaign performance, intent distribution |

### Skills Library (`skills/`) — Markdown editable, sin fine-tuning
- `email_frameworks.md` — 301 líneas, **regla de oro**: "write like a real person", ban-list AI-tells, 5 frameworks (AIDA, PAS, BAB, QVC, 3Ps)
- `signal_playbook.md` — Cómo convertir señal en primera línea de email
- `objection_handling.md` — Loop **LAARC** (Listen→Acknowledge→Assess→Respond→Confirm)
- `lead_qualification.md` — BANT + ICP scoring 1-10 + MEDDIC
- `sales_methodology.md` — ABC loop, tone calibration, ethical lines
- `offer_strategy.md` — Offer ladder, "never lead with offer"
- `prospecting_tactics.md` — Search operators, website mining, trigger events
- `account_navigation.md` — Multi-threading, qué puerta tocar
- `linkedin_outreach.md` — Connection sequences, ToS warning, disclosure
- **Generados por `harvey train <url>`** (gitignored):
  - `product_knowledge.md` — qué vendes, benefits, pricing, pain points
  - `competitive_intel.md` — battle cards, differentiation

### Configuración (2 archivos plain text)
```yaml
# .env — credentials (mail provider obligatorio)
# harvey.yaml — persona, product, ICP, channels, usage, brain, writer
persona: { name, company, role, email, tone }
product: { name, description, pricing, key_benefits, objection_responses, offer }
icp: { industries, titles, company_size, geography, hiring_signals, geo_coordinates }
channels:
  email: { provider: gmail|microsoft|smtp|instantly, max_daily_sends, require_approval, send_window }
usage: { max_daily_claude_percent, heartbeat_interval_minutes, quiet_hours }
brain: { provider: claude|codex, model, reasoning_effort }
writer: { humanizer }  # opcional: usa ~/.claude/skills/humanizer/SKILL.md
```

### Base de Datos — SQLite (`data/harvey.db`)
**Principio**: "Every fact is a row, never a column"
```sql
observations(company_id, prospect_id, collector, signal_code,
             value_num, value_text, confidence, evidence_url, observed_at, run_id)
```
Ventajas: nueva señal = sin migración, historial gratuito (time series), confidence+provenance viajan con el dato, cohort = query SQL.

### Dashboard — FastAPI + HTML/CSS/JS vanilla (sin build step)
- Token auth (`data/dashboard-token`), Host/Origin checks, loopback-only
- Work (Today, Outbox, Conversations), Pipeline (Signals, Discover, Companies, Campaigns), System (Activity, Usage, Controls, Settings, Help)
- Dark/light/auto, fonts vendored, offline-capable

### Comandos CLI
```
harvey run                   # heartbeat loop (15 min default)
harvey dashboard             # web UI + unlock link
harvey signals               # confirm signal catalog (26 free)
harvey discover              # --providers, --estimate, --preset (yc/accelerator/funding/hiring)
harvey profile               # free HTTP profiler
harvey train <url>           # aprende producto de tu web
harvey status                # pipeline summary
harvey usage                 # quota + per-agent tokens
harvey outbox                # review queue (A/R/E/J/K)
harvey export                # CSV deliverable
harvey sending pause|resume  # kill switch
harvey warmup [domain]       # SPF/DKIM/DMARC, age, blocklists
harvey trulyinbox connect    # TrulyInbox API
harvey retry-writes          # retry writer failures
harvey gmail auth / microsoft auth
```

### Proveedores de Descubrimiento
| Fuente | Coste | Free Tier | Mejor Para |
|--------|-------|-----------|------------|
| **OpenStreetMap** (default) | $0 | Unlimited, no account | Testing pipeline; cobertura thin para service-area biz |
| **TinyFish** | $0 | 30 searches/min, 500/hr | Finding by phrase, startup/hiring presets |
| **DataForSEO Business Listings** | $0.372/1k | $1 credit | Local trades, clínicas, contractors, filter no-website |
| **DataForSEO SERP** | $0.006/search (depth 30) | $1 credit + sandbox | Organic rank + local 3-pack |
| **DataForSEO Google Maps** | $0.002/search (100 results) | $1 credit + sandbox | Map rank, rating, category, claimed |
| **Serper** | ~$0.30-1.00/1k | 2,500 free | Easiest paid to try |
| **Scavio Google Maps** | $0.01/page (20 listings) | 50 credits | Phone, website, category, rating, reviews, no-website |
| **Scavio Google Search** | ~$0.03/depth-30 | 50 credits | Rank signal |

### Presets de Descubrimiento
- `yc` — YC-backed (signal `YC_BACKED` + batch)
- `accelerator` — Techstars, 500 Global, Antler, EF, SPC, Neo, AI Grant, a16z speedrun, Plug and Play, Pioneer
- `funding` — Raises anunciados en su sitio últimos 18 meses (`FUNDING_ROUND`)
- `hiring` — Careers pages con roles en `icp.hiring_signals`

---

## 3. Legal, Deliverability, Compliance

### CAN-SPAM (US)
- Subject line veraz, from-address 정확o
- Opt-out line en **cada** cold email (`compliance.opt_out_line`)
- Cualquier wording de opt-out = inmediato y permanente
- Physical mailing address en footer (`compliance.postal_address`)
- Quoted text = no opt-out

### Do Not Contact
- `compliance.do_not_contact` (address/domain per line, subdomains covered)
- Running Harvey picks up edits instantly
- Send gate checks on every email leave

### GDPR/PECR (EU/UK)
- Legitimate interest defensible: pitch relevant to role, data provenance known, objection effortless
- Harvey qualification rules enforce this

### Precleared (opcional, per-recipient)
- `compliance.precleared.enabled: true` → pregunta a Precleared antes de 1er cold email
- 10 checks/day free, 25 con key
- Cache 30 days, re-check on sender/address source/product/country change

### LinkedIn
- **Off by default** (browser automation viola ToS)
- Requiere `channels.linkedin.enabled: true` + credentials
- Usa cuenta que puedas perder

### Deliverability — Warmup Obligatorio
1. **Dedicated sending domain** (`getacme.com`, no `acme.com`)
2. **SPF, DKIM, DMARC** — sin los 3 Gmail junkea
3. **Warmup 2-4 semanas** antes de volumen real (TrulyInbox recomendado)
4. **Ramp lento** — 10-20/día, +5/día (`max_daily_sends: 50` ceiling)
5. **Bounce rate** > ~3% → kill switch automático

---

## 4. Codex Provider (ChatGPT Subscription)
- **macOS/Linux only** (Windows: usa Claude)
- `npm install -g @openai/codex@0.159.3` (versión exacta verificada)
- `codex login` → "Sign in with ChatGPT" (API key logins refused)
- **Aislamiento total**: private temp home, empty workspace, no tools, no MCP, no hooks, no skills, no project instructions
- Modelo: `gpt-5.5` sugerido, o Luna/Sol/Terra IDs
- Quota: lee rate-limit windows reales de Codex, respeta `max_daily_claude_percent`
- **Never falls back to Claude** — si Codex fails, call fails con log claro

---

## 5. Roadmap y Estado
- **Release actual**: 0.2.1
- **Done**: heartbeat, observation model, signal catalog, cohort builder, discovery menu con precios, profiler gratis, agency detection, pattern-first email finding, native mail providers, outbox approval, pre-send gate, bounce detection + kill switch, reply handling + intent classification, subscription quota tracking, website trainer, web dashboard, CSV export
- **Next**: people enrichment from public registries, consent-gated voice callbacks, calendar integration, scheduled re-observation, multi-product support
- **Voice**: NO fully autonomous cold dialer (FCC 24-17 TCPA penalties $500-1500/call). Solo **consent-gated**: inbound + opt-in callbacks.

---

## 6. Licencia y Derechos de Autor
- **MIT License** — permisiva, permite uso comercial, modificación, distribución
- **TrulyInbox links = affiliate** (maintainer earns commission)
- **Código**: Python 3.11+, 242 tests
- **Skills/Prompts**: Markdown editable — **no copiar texto literal extensivo**, mapear conceptos/arquitectura

---

## 7. Archivos Fuente Guardados (Cache Local)
- `C:\Users\Isaacko0\AppData\Local\hermes\cache\web\github.com-96896625df.md` — GitHub README completo (91,058 chars)
- `C:\Users\Isaacko0\AppData\Local\hermes\cache\web\blog.digicuratoragency.com-*.md` — Blog article

---

## 8. Mapeo Preliminar a HSCSG v15 OS (Isomorfismos)

| Concepto Harvey | Módulo HSCSG | Ley MJ / CaaS |
|-----------------|--------------|---------------|
| Agente autónomo heartbeat | `automaton` / `agentCanvas` | Ley II: AUT×CDS = soberanizar trabajo |
| Signal catalog (29 signals) | `capacidades` / `integral.signals` | Ley III: lucidez, observación verificable |
| Cohort builder (query, not list) | `integral` loop CDS→OAD→COS→ITC→FRS | Ley I: no dañar base (targeting preciso) |
| Skills library (Markdown editable) | `skills/` HSCSG + `caas` tool access | Ley III: transparencia, todo editable |
| Writer + frameworks (AIDA, PAS...) | `content` (ContentCreation-OS) | Ley II: ganarse la vida creando valor |
| Handler + LAARC loop | `symbiosky` / `democracia` | Ley III: escuchar, no engañar |
| Approval queue + pre-send gate | `boundaries` (policy gateway) | Ley I: proteger base material |
| SQLite observations (row-per-fact) | `evidence` model / `integral` | Ley III: append-only, provenance |
| Subscription quota budgeting | `caas` + `znu` + `nodeMode` | CaaS: acceso por contribución real |
| Warmup/deliverability pipeline | `regen` / `vecinal` (infra comunitaria) | Ley I: no dañar reputación/dominio |
| Codex/Claude isolation (safe mode) | `boundaries` + `agentMesh` isolation | Ley III: aislamiento, no herramientas |
| Do-not-contact + opt-out | `boundaries.deny` list | Ley I: respetar límites, no dañar |
| Export CSV (sequencer-ready) | `content` / `agencia` deliverables | Ley III: lucidez, datos portables |

---

## 9. Próximos Pasos (Fases 2-4 HSCSG)
1. **FASE 2** — `docs/harvey_integration.md` con triple perspectiva (Usuario/LLM/HSCSG+CaaS)
2. **FASE 3** — Módulos vivos:
   - `src/core/state/harvey.ts` — tipos + estado inicial
   - `src/core/lib/harvey.ts` — lógica pura (discover, profile, enrich, verify, write, send, handle)
   - `src/core/lib/harvey-skills.ts` — skills loader (Markdown → prompt injection)
   - `src/core/lib/harvey-pipeline.ts` — heartbeat loop + decision logic
   - `src/core/state/store.ts` — integración + actions
   - `src/app/screens/Harvey.tsx` — pantalla con tabs: Descubrir, Perfilar, Escribir, Enviar, Responder, Dashboard, Config
   - Nav en `Aside.tsx` + ruta en `App.tsx`
3. **FASE 4** — Verificar: `tsc --noEmit`, `build`, preview `/harvey` = 200, tests