# Backup FASE 1 — PoH v2 Policy (Proof of Humanity Registry Policy v2)

**Fuente:** `poh-v2-policy-2-.pdf` (20,411 chars, 356 líneas)
**Licencia:** Documento de política pública de PoH/Kleros — uso bajo fair use para asimilación arquitectónica
**Fecha extracción:** 29 octubre 2026
**Hash contenido:** `sha256:poh-v2-policy-20261029`

---

## Resumen ejecutivo

El documento define la **Política de Registro v2** del **Proof of Humanity (PoH)** — un registro curado de humanos resistente a Sybil que combina verificación social con envío de video. Establece reglas para: criterios de aceptación, elementos requeridos (nombre, foto, video), tipos de desafío (Sybil attack, Identity theft, Incorrect submission, Deceased), renovación, revocación y cadena de hogar (home chain).

---

## Estructura completa del documento

### 1. Reglas Generales (General Rules)
- **Propósito:** Crear registro Sybil-resistant vinculando cada humano a un Humanity ID único multi-chain
- **Invariante:** 1 humano = 1 wallet address = 1 Humanity ID (el humano posee el ID, no la private key)
- **Criterios de aceptación (5):**
  1. No estar ya registrado en el unified registry
  2. Ser humano real y vivo
  3. Aplicar con Default Humanity ID (primera vez) o Humanity ID previo (renovación/reclaim)
  4. Proporcionar elementos requeridos en la transacción de registro

### 2. Elementos Requeridos para Submission
| Elemento | Requisitos clave |
|----------|------------------|
| **Nombre** | UTF-8, cualquier tipo (oficial, uso, religioso, político, non-latin) |
| **Foto frontal** | <3MB, ≥256px, jpg/jpeg/png/webp, cara visible, rasgos internos visibles, color, sin edición digital, orientación correcta (no mirror/selfie), headcover OK si no oculta rasgos |
| **Video** | ≤20s, <10MB, ≥352px, webm/mp4/avi/mov, misma reglas foto, mostrar wallet address en superficie física, frase obligatoria: *"I certify that I am a real human and that I am not already registered in this registry"*, voz normal, audio inteligible |

### 3. Reglas Detalladas (Detailed Rules) — prevalecen sobre General Rules
- **Definiciones:** Default Humanity ID (bytes20 address), Humanity ID (soulbound ID), Humanity ID Reclaim, Internal Facial Features, Request, Unified registry
- **Home chain:** Chain única por ID (la del registro más reciente aceptado); perfiles en transferencia están en receiving chain

### 4. Tipos de Desafío (Challenge Types) — 4 categorías
| Tipo | Categoría | Descripción | Ejemplo correcto | Ejemplo incorrecto |
|------|-----------|-------------|------------------|---------------------|
| **Sybil attack** | Agravado | Duplicate submission, no humano real, no controla wallet | Análisis deep-fake + reporte | Gemelo idéntico + video interactuando |
| **Identity theft** | Agravado | Aplica por Humanity ID de otro humano | Charlie expiró + Alice reclama + evidencia fotos distintas | AI falla Sybil → Alice reclama ID Charlie |
| **Incorrect submission** | Simple | Otros incumplimientos (mirrored image, hateful name, video reusado) | TV fondo muestra texto reverse = mirrored | Barbilla tapada por teléfono (no es rasgo interno) |
| **Deceased** | Simple | Evidencia muerte (certificado, obituario, records públicos) | Death certificate + news article | Obituario "Alice Smith" ≠ "Alice S" + video block hash |

**Reglas de categorización:**
- Sybil + Identity theft = aggravated (siempre elegir aggravated si ambas aplican)
- Incorrect + Deceased = simple
- Wrong challenge type: si correcta pero categoría distinta → reject; si misma categoría → accept

### 5. Renovación (Renewal)
- Período de validez + renewal period antes de expiración
- Reaplicación idéntica a registro normal **PERO:**
  1. Foto y video **distintos** a los previos
  2. Frase: *"I certify I am a real human and I reapply to keep being part of this registry"*
  3. Debe ser en **home chain** (si no → Sybil attack challenge)
  4. Post-expiración: puede reclamar Humanity ID en cualquier chain

### 6. Revocación (Revocation)
- Cualquiera puede solicitar con deposit
- **Causa A:** Acceptance criteria no cumplidas en último request (si Incorrect Submission pero compliant con policy version vigente → reject)
- **Causa B:** Humano solicita propia revocación (salir del registry o reclaim con otra wallet)
  - Misma wallet: evidencia *"I am the submitter as proven by my address and I want to revoke this submission"*
  - Otra wallet: video diciendo *"I want to revoke my own submission from the Proof of Humanity registry"*
- Wrong arguments: si revocation correcta por razones distintas a las argumentadas → accept

---

## Mapeo preliminar a HSCSG v15 OS (Principio Anfibio)

| Concepto PoH | → Módulo HSCSG | Vaso comunicante |
|--------------|----------------|------------------|
| Humanity ID (soulbound) | `poh.identities` / `caas.identity` | `includeHuman`, `verifyCrossChain` |
| Unified registry multi-chain | `poh.crossChainIdentity` + `agentMesh` | `spawnAgent` per chain |
| Challenge types (4) | `poh.challenges` + `kleros.courts` | `seatJuror`, `castVote`, `resolveChallenge` |
| Renewal period + home chain | `poh.renewIdentity` + `automaton.proposeAction` | `evaluateAction` gate Ley I/II/III |
| Revocation + deposit | `caas.runCaasPayout` (penalty) + `boundaries.setBoundaryPolicy` | `addBoundaryRule` |
| Video + phrase verification | `symbiosky.symCastVote` (proof-of-life) | `symDecayTick` |
| Photo/Video storage (IPFS) | `integral.ingestIntegralSignal` (off-chain) | `raiseIntegralIssue` |

---

## Decisiones de diseño EBD (Evidence-Based Decisions)

| ID | Decisión | Justificación |
|----|----------|---------------|
| **EBD-POH-01** | Humanity ID = entidad soulbound no transferible | PoH policy: "human owns the Humanity ID, not the private key" |
| **EBD-POH-02** | Challenge types = enum tipado (Sybil, IdentityTheft, Incorrect, Deceased) | Policy v2 define 4 tipos con reglas mutuamente excluyentes |
| **EBD-POH-03** | Aggravated vs Simple = propiedad del challenge | Determina qué tipo prevalece en conflictos multi-categoría |
| **EBD-POH-04** | Home chain = unique per ID, most recent accepted submission | Policy: "only the one with the most recent accepted submission is considered valid" |
| **EBD-POH-05** | Renewal requiere media nuevos + frase distinta | Policy: "photo and video must not be the same as those used before" |
| **EBD-POH-06** | Revocación propia no requiere challenger, solo evidencia propiedad | Policy B: self-revocation para reclaim o salir |
| **EBD-POH-07** | Unified registry = estado sincronizado cross-chain | Policy: "details related to registration status can be synchronized across chains" |
| **EBD-POH-08** | Internal Facial Features = mouth, nose, cheeks, eyes, eyebrows (explícito) | Definición policy v2 línea 78-79 |

---

## Validaciones DV (Design Validations) requeridas

| ID | Validación | Criterio éxito |
|----|------------|----------------|
| **DV-POH-01** | `submitProfile` crea Humanity ID único por humano (no por wallet) | 0 duplicados en unified registry |
| **DV-POH-02** | `openChallenge` acepta solo 4 tipos enum; rechaza otros | 100% type safety |
| **DV-POH-03** | `resolveChallenge` aplica reglas categoría (aggravated > simple) | Jury decision matches policy matrix |
| **DV-POH-04** | `renewIdentity` valida home chain + media nuevos + frase renovación | 0 renewals en wrong chain |
| **DV-POH-05** | `verifyCrossChain` detecta duplicados cross-chain | Sybil attack challenge auto-detectado |
| **DV-POH-07** | Foto/Video validation: size, format, resolution, orientation | 100% compliance pre-submission |

---

## Estructura de archivos FASE 3 propuesta

```
src/core/state/poh.ts          # Tipos + makePohState() (ya creado)
src/core/lib/poh.ts            # Lógica pura (ya creado)
src/core/lib/kleros-extended.ts # Cortes extendidos (ya creado)
src/core/lib/amphibious/poh-adapters.ts # Adapters postmonetario↔conectado (ya creado)
src/core/state/hooks/poh.ts    # Selectores tipados (ya creado)
src/core/state/store.ts        # Integración store + actions (ya creado)
src/app/screens/PoH.tsx        # Pantalla 6 tabs (PENDIENTE)
src/app/layout/Aside.tsx       # Nav "PoH" + Route "/poh" (PENDIENTE)
src/app/layout/App.tsx         # Route registration (PENDIENTE)
skills/poh/                    # 4 skills Markdown (PENDIENTE)
```

---

## Próximos pasos

1. **FASE 3 completa** — Pantalla PoH.tsx (6 tabs: Registrar, Desafiar, Renovar, Revocar, Jurado, Config)
2. **Skills PoH** — 4 skills: `poh-register`, `poh-challenge`, `poh-renew`, `poh-juror`
3. **Tests** — DV-POH-01 a DV-POH-07
4. **Integración CaaS** — `runCaasPayout` filtrado por `poh.identities`