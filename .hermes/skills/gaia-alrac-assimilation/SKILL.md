---
name: gaia-alrac-assimilation
description: Use when asimilando documentos Gaia al repo ALRAC/HSCSG.
category: integration
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags:
      - gaia
      - alrac
      - hscsg
      - assimilation
      - arquitectura
      - licencias
    related_skills:
      - hscsg-repo-assimilation
      - hscsg-openspec-integration
---

# Gaia → ALRAC/HSCSG Assimilation Skill

## When to Use

Use esta skill cuando necesites asimilar un documento maestro de plataforma regenerativa (ej. Gaia AI-MarketPlace, Mycelium One) al repo ALRAC/HSCSG (github.com/Isaacko0/Marca-Blanca-Zeitnus-Firma-Operaciones-Ecotomica-Networking-Recreativo). Extrae mapping arquitectónico por capas ALRAC, auditoría de licencias, roadmap de integración y detecta bloqueos γ-CARMIS que impidan facturación real.

Procedimiento repetible para asimilar un documento maestro de plataforma regenerativa en la arquitectura ALRAC de 5 capas + capa 0, consumiendo HSCSG como infraestructura soberana sin fusión organizacional, respetando derechos de autor y detectando bloqueos de producción.

---

## Paso 0 — Levantamiento de fuentes

1. Leer el documento maestro completo (toc, executive summary, todos los capítulos, tablas, DOFA).
2. Leer transcripciones/reuniones relacionadas (ej. Mycelium One & Moodle) si existen.
3. Extraer URLs del repo GitHub objetivo y clonar metadata pública (README, docs/, openspec/specs/).
4. Identificar licencias de cada fuente (MIT/GPL/CC-BY-NC-ND/ninguna).

**Regla de derechos de autor:** análisis y síntesis de texto siempre permitido. Código GPL/AGPL → aislar en microservicio. Contenido CC BY-NC-ND (Yoka/Fabio) → bloquea retorno financiero; mover a `docs/_licencia_incompatible/` o negociar. Backups vault Obsidian → solo local, nunca GitHub público.

---

## Paso 1 — Mapa de capas ALRAC

Ubicar cada componente en la arquitectura ALRAC (ADR-001):

| Capa | Qué consume | Adaptador HSCSG |
|---|---|---|
| 0 Epistémica | Verificación triaxial, γ-CARMIS, 𝕮 | Kernel HSCSG (sesgos expuestos)
| 0.5 Normativa | Licencias, Responsible Use | LICENSE_AUDIT_ASIMILACIONES
| 1 Contable-física | TQ = 1 kWh, ±500, prohibición TQ↔fiat | tq.ts, exchangeGuard
| 2 Interoperabilidad | DTN, ValueFlows, CaaS, discovery | Data/Trust, ValueFlows, Coordination adapters
| 3 Membrana fiat | ZNU canasta, crédito 2-3%, puente USDC | znu-indexing-credit, fiat-layer
| 4 Aplicación ZEITNUS | Marketplace, Educación, AI Matching | Gaia como ecosistema/territorio
| 5 Gobernanza | 1a1v, CDS, subsidiaridad | Governance holonic

---

## Paso 2 — Mapping de subsistemas Gaia

Aplicar este checklist a cada documento nuevo:

- **AI-Matching Engine** → Capa 4 + HSCSG Kernel (claims legibles por agente). Requiere verificación triaxial antes de automatizar.
- **OriGen Traceability (QR, 5 eslabones)** → Capa 2 Data/Trust Adapter (merkle proofs, RAO, procedencia). Sin medición física de kWh = afirmación no verificada.
- **Pasaportes/Visas** → Capa 0/2 Identity Adapter (DID, VC/VP, Project Weave, sCoRe).
- **Niveles L1/L2/L3** → `alrac-caas-membership.md` (3 niveles, horizontes H1/H2/H3).
- **Commonomics (30/70)** → unificar con reparto Amid 35/35/30 vía ValueFlows Adapter (split atómico).
- **University of Life + Semilla Spirall** → Línea B (PHI + MYCELIUM).
- **Tokens Gaia (Seeds, AYNI, SPIRAL, KHRONOS, HSOCIAL, HREGEN, NFTs)** → Capa 3 ZNU + Capa 1 TQ; decidir anclaje o capa conectada (ADR-002 Anfibio).
- **Gaia Commons Bank** → ValueFlows + ZNU crédito mutuo 2-3%, Postulado 4.

---

## Paso 3 — Integración Mycelium (si aplica)

- Orquestador de bioregión: crear bioregión grande → subcomunidades (ej. Andes → Bogotá → Usaquén).
- Marketplace externo: exigir API-first desde el inicio, SSO bidireccional, mapeo de endpoints.
- Eventos: requerir RSVP público, asistencia QR, calendario para activar badges pasaporte.
- Verificación T4: manual hoy; roadmap de automatización.
- Regeneración forestal: solo CR/EEUU/Alaska; faltan datos Andes/Colombia.

---

## Paso 4 — Auditoría de licencias (aplicar LICENSE_AUDIT_ASIMILACIONES)

| Hallazgo | Acción |
|---|---|
| Fuente MIT/Apache/CC0 | Usar directo, mantener atribución |
| GPL/AGPL | Aislar en microservicio, nunca linkear core |
| CC BY-NC-ND | Mover a `_licencia_incompatible/` o negociar comercial |
| Sin licencia detectable | Auditar antes de usar (latente) |
| Backups locales | Solo local, nunca GitHub público |

---

## Paso 5 — Estado γ-CARMIS y Paso II

Verificar estado del repo:

```
αʰ = Ω × s
κ = 1.0 (producción) / 0.5 (simulación)
Si αʰ < κ → γ-CARMIS TRIGGERED → hard stop
```

Si γ-CARMIS activo, **no hay facturación real** hasta Paso II — Orden de la Palabra: definir cliente real de Línea A (nombre, monto, fecha, TQ/ZNU), triaxial (mental/sim/lab), registrar RAO.

---

## Paso 6 — Roadmap de entrega

| Fase | Semanas | Entregable |
|---|---|---|
| 1 Identidad y trazabilidad | 1–2 | Passport → Identity Adapter; OriGen QR → Data/Trust Adapter; Paso II resuelto |
| 2 Economía y pagos | 3–4 | Niveles L1/L2/L3; Commonomics ↔ Amid split; decisión anclaje tokens Gaia |
| 3 Educación y matching | 5–8 | University of Life → Línea B; AI-Matching → HSCSG Kernel |
| 4 Marketplace Mycelium↔Gaia | 9–12 | Reunión dev externo (API-first); bioregión Andes + Usaquén activada |
| 5 Eventos y pasaporte | Post-4 | RSVP/QR/calendario; automatización T4 |

---

## Criterios de éxito

- `tsc --noEmit` = 0 errores en core ALRAC
- `LICENSE_AUDIT_ASIMILACIONES.md` cerrado (NC-ND movidos, GPL aislados)
- Paso II ejecutado (αʰ > κ)
- Mapping documento→capa ALRAC documentado en openspec/
- Backups solo local; nada sensible subido a GitHub

---

## Referencias del repo

- `docs/ALRAC_MASTER_INTEGRADO.md` — arquitectura 5 capas, 12 colaboraciones
- `docs/HSCSG_INTEGRATION_ARCHITECTURE.md` — 4 adaptadores técnicos
- `docs/GRANALLIANZA_MAPPING.md` — 5 líneas × 7 holones
- `docs/LICENSE_AUDIT_ASIMILACIONES.md` — matriz de compatibilidad licencias
- `docs/ARCHITECTURE_DECISIONS.md` — ADR-001 a ADR-012
- `openspec/specs/SPEC_INDEXER.md` — catálogo 44 specs
- `docs/CAOS_MODELONEGOCIO_ANALISIS.md` — γ-CARMIS, Paso II, 5 evasiones

---

> **Principio anfitrión:** misma lógica, distinta infraestructura. Postmonetario (ZNU/CaaS offline) ↔ Conectado (USDC/ReFi Nivel 3). El render decide la etiqueta; la lógica es agnóstica a la unidad monetaria.

---

*Nota: guardar esta skill solo tras confirmación explícita del usuario (hecha).*