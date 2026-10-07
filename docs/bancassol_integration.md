# Integración: Bancassol → HSCSG v15 OS / ALRAC (Preliminar)

**Fecha:** 2026-10-06  
**Fuente:** `docs/bancassol_backup.md` (extracción web limitada — solo landing page)  
**Entidad:** Bancassol — Banca Comunitaria Social Solidaria  
**Metodología:** HSCSG v15 OS — Flujo 4 fases + Principio Anfibio + Triple Perspectiva  
**Estado:** **PRELIMINAR — Requiere contacto directo para asimilación completa**

---

## ⚠️ ADVERTENCIA METODOLÓGICA

Esta asimilación es **incompleta por limitación de fuente**. El sitio web `bkssol.com` solo expone una landing page minimalista sin navegación accesible via extracción estática. **La asimilación rigurosa HSCSG requiere contacto directo con fundadores/equipo** para obtener: modelo de negocio, gobernanza, tecnología, métricas, roadmap.

---

## 1. Perspectiva USUARIO — Qué quiere lograr en su nodo (Hipótesis)

> **Objetivo hipótetico:** Acceder a servicios financieros comunitarios, solidarios y soberanos — crédito mutuo, ahorro colectivo, pagos locales — sin dependencia de banca comercial extractiva.

### Necesidades Explícitas (Inferidas del Branding)
- **Banca Comunitaria:** Servicios financieros gobernados por la comunidad
- **Social:** Enfoque en inclusión, equidad, impacto social
- **Solidaria:** Principios de ayuda mutua, reciprocidad, no lucro
- **Soberanía:** Control comunitario sobre datos, reglas, excedentes

### Dolores No Resueltos (Oportunidades HSCSG — Hipótesis)
- **Exclusión financiera:** Comunidades sin acceso a banca tradicional
- **Extractivismo bancario:** Intereses usureros, comisiones ocultas, decisiones externas
- **Falta soberanía monetaria:** Dependencia fiat, devaluación, políticas ajenas
- **Gobernanza opaca:** Sin voz ni voto en reglas que afectan a la comunidad
- **Tecnología propietaria:** Vendor lock-in, datos centralizados, no interoperable

---

## 2. Perspectiva LLM — Qué asimilar (lógica pura) y qué extirpar (infra ajena)

### ASIMILAR (Lógica Pura — Hipótesis a Validar)

| Componente Hipotético | Módulo HSCSG | Lógica Extraíble (Pendiente Validación) |
|----------------------|--------------|----------------------------------------|
| **Modelo crédito mutuo** | `mutualCreditEngine.ts` | Clearing multilateral, límites exposición, ciclos compensación |
| **Gobernanza asamblearia** | `communityGovernance.ts` | 1a1v, CEL, jurados sorteados, mandatos rotativos |
| **Unidad de cuenta local** | `localUnitOfAccount.ts` | TQ-equivalente, anclaje kWh/bienes/horas, paridad precio |
| **Federación bancas** | `bankingFederation.ts` | CPP pools cross-banca, clearing inter-banca, estándares |
| **Registro socios/identidad** | `socialIdentityRegistry.ts` | RAO para miembros, credenciales verificables, reputación |
| **Contabilidad triple entrada** | `tripleEntryAccounting.ts` | Contabilidad distribuida, auditoría social, transparencia |

### EXTIRPAR (Infra Ajena — Solo tras Validación)

- Sitio web actual (landing page minimalista, probable reconstrucción)
- Cualquier backend propietario centralizado
- Dependencia cloud/SaaS no soberana
- Branding visual propietario (logo, colores, UI)
- Cualquier tracker/analytics externo

---

## 3. Perspectiva HSCSG+CaaS — Isomorfismo con Leyes MJ + ALRAC + GNAP + ZNU

### Mapeo Hipotético a Arquitectura ALRAC 5 Capas

| Capa ALRAC | Bancassol Hipotético | Gap / Oportunidad HSCSG |
|------------|---------------------|-------------------------|
| **0 Epistémica** | *Desconocido* | **Oportunidad:** γ-CARMIS para diagnosticar coherencia modelo vs realidad |
| **0.5 Normativa** | "Social Solidaria" = principios declarados | **Gap:** Falta formalización 7 Principios Javier + CEL operativos |
| **1 Contable-Física** | *Desconocido* (¿TQ? ¿Moneda local? ¿Fiat?) | **Implementar:** TQ ledger 1 TQ = 1 kWh = anclaje físico |
| **2 Interoperabilidad** | *Desconocido* (¿API? ¿Estándares?) | **Implementar:** CPP pools federados + GNAP + NDO federation |
| **3 Membrana Fiat** | *Desconocido* (¿Cooperativa? ¿Fintech?) | **Estructurar:** Coop/ZNU credit 2-3% + priceParity oráculo |

### Mapeo a 7 Holones Gran Alianza (Hipotético)

| Holón | Rol Hipotético Bancassol | Línea ALRAC | KPI (Pendiente) |
|-------|-------------------------|-------------|-----------------|
| **GAIA** | Articulación red bancas comunitarias | A: Diagnóstico | % nodos federados |
| **MYCELIUM** | Infra clearing/liquidez compartida | B: Kit simulación | Matches liquidez-necesidad |
| **PROJECT WEAVE** | Credenciales socios/entidades | A, C | % RAO verificadas |
| **PHI** | Educación financiera comunitaria | B: Kit simulación | # formados, αʰ post |
| **HIVE IA** | Matching crédito-ahorro IA | D: γ-CARMIS | Eficiencia asignación |
| **GAIA NETWORK** | Mercado servicios financieros | C: Prototipado | Volumen TQ/ZNU |
| **DATA TRUST** | Gobernanza datos soberana | E: Nodos TQ | % decisiones 1a1v |

---

## 4. Plan de Conversión (Condicionado a Contacto Directo)

### Fase 0: Contacto y Diagnóstico (URGENTE — Semana 1)
```bash
# ACCIONES REQUERIDAS ANTES DE CUALQUIER DESARROLLO:

# 1. Identificar contactos clave
- Buscar: "Bancassol" + "fundador" / "director" / "presidente" en LinkedIn
- Buscar registro mercantil / cooperativas (país desconocido — .com sugiere global/latam)
- Buscar en Twitter/X: @bancassol, #bancassol, "banca comunitaria solidaria"
- Verificar WHOIS dominio bkssol.com

# 2. Canales contacto
- Email: buscar en página (no visible en extracción) / whois / redes
- Teléfono: buscar en registros públicos
- Oficinas: dirección física si existe

# 3. Preguntas clave para primera reunión
1. ¿Cuál es su modelo legal? (Cooperativa, Fundación, SAS, Asociación, Otra)
2. ¿Gobernanza? (Asambleas 1a1v, consejo, directiva, mixta)
3. ¿Tecnología core? (Ledger propio, blockchain, Holochain, DB central, Excel)
4. ¿Unidad de cuenta? (Moneda propia, USD, BTC, TQ/kWh, canasta bienes)
5. ¿Crédito mutuo / clearing? (Multilateral, bilateral, pools, LETS-style)
6. ¿Federación? (Redes existentes: RIPESS, RIPESS-LAC, Fiare, Coop57, otras)
7. ¿Métricas? (Socios, volumen, cartera, morosidad, impacto, años operación)
8. ¿Roadmap? (Lanzamiento, expansión, tech stack, gobernanza)
9. ¿Dolores actuales? (Escalabilidad, regulación, liquidez, adopción, tech)
10. ¿Interés en HSCSG/ALRAC? (Soberanía, federación, ZNU, mesh, γ-CARMIS)
```

### Fase 1: Piloto Mínimo Viable (SOLO TRAS FASE 0 EXITOSA)
| Piloto | Módulo HSCSG | Condición Previa |
|--------|--------------|------------------|
| **Diagnóstico γ-CARMIS** | `kernelProtocol` + `ev.ts` | Acceso datos reales + equipo |
| **TQ Ledger Bancario** | `tq.ts` + `mutualCreditEngine.ts` | Confirmación unidad cuenta TQ-compatible |
| **CPP Pool Liquidez** | `cpp.ts` + `bankingFederation.ts` | Mínimo 2 bancas federadas |
| **Gobernanza 1a1v Real** | `communityGovernance.ts` + CEL | Estatutos + asambleas documentadas |
| **ZNU Credit 2-3%** | `znu.ts` + `alrac.ts` Capa 3 | Constitucional cooperativa + priceParity |

---

## 5. Integración Técnica (Boceto — Pendiente Validación)

### `src/core/lib/bancassol.ts` (Esqueleto)
```typescript
// Tipos dominio Bancassol — PENDIENTE VALIDACIÓN CON EQUIPO REAL

interface BancassolNode {
  did: DID;                           // did:key:bancassol-core
  name: 'Bancassol';
  legalForm: 'cooperative' | 'foundation' | 'association' | 'other';
  jurisdiction: string;               // País/región regulador
  governance: GovernanceModel;
  unitOfAccount: UnitOfAccountConfig;
  creditSystem: CreditSystemConfig;
  federation: FederationConfig;
  metrics: BancassolMetrics;
  communitySize: number;              // socios/usuarios
  pillars: BancassolPillar[];
}

interface GovernanceModel {
  type: 'assembly_1a1v' | 'council' | 'hybrid' | 'unknown';
  assemblyFrequency: 'monthly' | 'quarterly' | 'annual' | 'unknown';
  celImplemented: boolean;            // CEL / jurados sorteados
  rotationPolicy: RotationPolicy;
  vetoMechanism: boolean;
}

interface UnitOfAccountConfig {
  name: string;                       // ej: "SOL", "TQ", "COMUN", "USD"
  anchor: 'kwh' | 'basket_goods' | 'labor_hours' | 'fiat' | 'crypto' | 'unknown';
  parity: PriceParityConfig;          // si fiat/crypto
  demurrage: DemurrageConfig;         // si TQ-style
  rotation: RotationConfig;
}

interface CreditSystemConfig {
  type: 'mutual_credit_clearing' | 'pool_based' | 'peer_to_peer' | 'traditional' | 'unknown';
  clearingFrequency: 'realtime' | 'daily' | 'weekly' | 'monthly';
  exposureLimits: ExposureLimitConfig;
  commitmentPooling: boolean;         // CPP-style
  interestRate: InterestRateConfig;   // 0% mutual credit / >0% traditional
}
```

---

## 6. Sinergias Potenciales (Hipótesis)

| Proyecto HSCSG | Sinergia Hipotética | Mecanismo |
|----------------|---------------------|-----------|
| **Feria Conuquera** | Banca para 45 colectivos + TQ 10 años | `feria.ts` + `bancassol.ts` crédito mutuo |
| **+Colonia** | Servicios financieros 515ha + ZNU | `colonya.ts` + `bancassol.ts` |
| **Samay Permacultura** | Financiamiento proyectos regenerativos | `samay.ts` + `bancassol.ts` patient capital |
| **Ruddick/GEF** | Modelo mweria/kaya bancario | `mweria.ts` + `bancassol.ts` |
| **Solarpunk Utopia** | Mesh/DTN para banca offline rural | `meshProtocol` + `bancassol.ts` |
| **Nondominium** | NDO para activos financieros comunitarios | `NdoHardLink` créditos ↔ tierras ↔ equipos |

---

## 7. Riesgos Críticos (Requieren Validación)

| Riesgo | Probabilidad | Impacto | Mitigación (Pendiente Info) |
|--------|--------------|---------|----------------------------|
| **No es banca comunitaria real** (marketing only) | Media | Crítico | Verificar: estatutos, asambleas, registro cooperativo |
| **Tech stack centralizado/propietario** | Alta | Alto | Principio Anfibio: exigir WASM + mesh + open source |
| **Regulación hostil** (CNBV, Superfinanciera, etc.) | Media | Alto | Estructura legal cooperativa + ZNU credit (no "banco") |
| **Sin federación real** (aislado) | Media | Medio | CPP pools + GNAP obligatorios en roadmap |
| **Unidad cuenta fiat-only** | Media | Alto | Transición a TQ/kWh + ZNU bridge obligatoria |

---

## 8. Próximos Pasos INMEDIATOS (Esta Semana)

### Día 1-2: Investigación de Contacto
- [ ] **WHOIS bkssol.com** → registrant, emails, teléfono
- [ ] **LinkedIn search**: "Bancassol" + cargo directivo
- [ ] **Twitter/X search**: @bancassol, #bancassol, menciones
- [ ] **Registro cooperativas** (México: CNBV/INCOOP; Colombia: Supersolidaria; Perú: SBS; Argentina: INAES; etc.)
- [ ] **Google search**: "Bancassol banca comunitaria" + noticias + PDF

### Día 3-4: Contacto Directo
- [ ] **Email formal** (plantilla ALRAC Master §10) a contactos encontrados
- [ ] **LinkedIn InMail** a decisores identificados
- [ ] **Llamada telefónica** si número disponible
- [ ] **Solicitar reunión γ-CARMIS Preview** (5 casos gratis)

### Día 5-7: Decisión Go/No-Go
- [ ] **Si respuesta positiva** → Fase 1 completa (backup real, integration real, spec real)
- [ ] **Si sin respuesta** → Documentar como "contacto fallido" en `docs/archived/contact-attempts/`
- [ ] **Si negativo** → Archivar, no consumir más recursos HSCSG

---

## 9. Referencias Cruzadas (Pendientes)

| Documento | Sección | Actualización Condicionada |
|-----------|---------|---------------------------|
| `docs/ALRAC_MASTER_INTEGRADO.md` | §12 Colaboraciones | Añadir Bancassol SI contacto exitoso |
| `docs/GRANALLIANZA_MAPPING.md` | 7 holones | Añadir nodo bancario GAIA/MYCELIUM |
| `openspec/specs/SPEC_INDEXER.md` | Índice specs | Añadir `bancassol-integration.md` SI asimilación completa |
| `src/core/lib/alrac.ts` | Tipos core | Extender con `BancassolNode` SI validado |

---

## 10. Conclusión: Bancassol — **OPORTUNIDAD DE ALTO VALOR, ALTA INCERTIDUMBRE**

**Señales prometedoras:**
- ✅ Branding "Banca Comunitaria Social Solidaria" = alineación filosófica exacta
- ✅ Contador lanzamiento = ventana oportunidad entrada temprana
- ✅ Dominio .com + branding profesional = entidad seria, no hobby

**Gaps críticos (blockers para asimilación):**
- ❌ **Cero información técnica/gobernanza/modelo** en web pública
- ❌ **Contacto directo obligatorio** — sin esto, asimilación = especulación
- ❌ **Jurisdicción desconocida** — regulación bancaria varía radicalmente por país

**Recomendación HSCSG:** **Prioridad ALTA para contacto directo** (Fase 0 esta semana). Si Bancassol es una banca comunitaria real con gobernanza asamblearia, tecnología abierta o migrable, y voluntad de federación → **Nodo piloto estratégico Capa 1+3 ALRAC** (finanzas soberanas + membrana fiat).

> **Nota de asimilación:** Este documento sigue metodología HSCSG v15 OS pero se marca **PRELIMINAR** por insuficiencia de fuente primaria. El Principio Anfibio exige: **no inventar datos, contactar a la fuente, documentar gaps honestamente**. Solo tras Fase 0 exitosa proceder a Fase 1-4.
>
> **La pala y el teclado están en tus manos. E=V.**