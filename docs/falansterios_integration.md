# INTEGRACIÓN: FALANSTERIOS → HSCSG v15 OS (Decisiones EBD + Mapeo Técnico)

**Fecha:** 2026-11-08  
**Fuente:** `docs/falansterios_backup.md` (158+ integraciones previas + esta = 159)  
**Metodología:** EBD (Evidence-Based Design) — Cada decisión trazable a fuente primaria/académica  
**Vasos comunicantes:** 8 activados (Copiosis, Colony, Gaia, Symbiosky, AuroraGov, Pipeline, FABSHIP, RMR)

---

## 1. DECISIONES EBD (Evidence-Based Design) — FALANSTERIOS

| ID | Decisión | Justificación (Fuente) | Módulo Afectado | Prioridad |
|----|----------|------------------------|-----------------|-----------|
| **FAL-D1** | **Serie Fourier (7-18 pers) = Célula HSCSG / DomainNode Colony** | Tesis U.Porto 2022 §3.2 + TFG UPM 2026 Tabla 4 + Fourier Œuvres Vol.1 | `lib/colony.ts` `DomainNode` + `/colectivo` | **P0** |
| **FAL-D2** | **Grupo Fourier (3-4 series) = Círculo Gaia Tier 2 (BioHábitat 13-150)** | Gaia Confederation White Paper + Cahiers Ch. Fourier Num. 12 (2005) | `lib/gaia.ts` `CircleTier` + `/circulos` | **P0** |
| **FAL-D3** | **Falansterio 1620 pers ≠ Nodo Cosateca (150 pers). Nodo = Sub-falansterio federado** | TFG UPM 2026 Conclusión 5.3 + Gaia Union 9 Sistemas Vitales | Arquitectura 5 capas §17 | **P0** |
| **FAL-D4** | **Trabajo atractivo → Stigmergic signals "free" + ValueFlows goodType:need/luxury/capital** | Fos 2009 (teatralidad) + Copiosis 3 tipos bienes + OVNi 3.0 D39 Current-sees | `lib/stigmergicCoordination.ts` `signalTypes.ts` + `lib/copiosis.ts` | **P0** |
| **FAL-D5** | **Bolsa Comunal → Benefit Redistribution 4 Registros (no Fluid Equity monolítico)** | Fourier Vol.1 Libro 3 + OVNi 3.0 D3 Fluid Equity→4 Registros + Sensorica praxis | `lib/benefitRedistribution.ts` | **P0** |
| **FAL-D6** | **Arquitectura monolítica → FABSHIP distribuido + Mesh DTN + Earthship 6 vectores** | Le nouveau monde industriel Parte 2 (plano) + FABSHIP/HUMANIA + OVNi 3.0 Capa 4 | `/base` + `lib/p2pInfrastructureStack.ts` + `lib/tekitl.ts` | **P0** |
| **FAL-D7** | **Passionnement (afecto+interés+deber) → AUT × CDS + Conviction Voting (lock ZNU)** | Fourier Vol.1 + Symbiosky whitepaper + OVNi 3.0 D38 Value Sovereignty | `lib/symbiosky.ts` + `lib/integral.ts` | **P0** |
| **FAL-D8** | **Distribución 4/3/3/5 (Capital/Trabajo/Talento/Común) → Value Equation coeficientes calibrados por CDS_Jurados** | Fourier Vol.1 + Copiosis 8 escalas BN + CDS_Jurados W_i | `lib/valueEquation.ts` + `lib/cds_jurados.ts` | **P0** |
| **FAL-D9** | **Igualdad mujeres + maternidad socializada → AUT_SALU + AUT_SOCI + CaaS Tier 1 (necesidades gratis)** | Fourier Vol.1 (mujeres) + Copiosis goodType:need + CaaS-BM | `/base` + `/caas` + `lib/copiosis.ts` | **P1** |
| **FAL-D10** | **Educación integral niños → `/aprender` (P2) + goodType:capital herramientas gratis creadores** | Fourier Vol.1 (niños) + iambrainstorming + OVNi 3.0 Learning Layers | `lib/learning.ts` (P2) | **P2** |
| **FAL-D11** | **Patrones fracaso histórico → Validación Fase 0 Proto-CO: base material ANTES, bootstrap soberano, CDS distribuido** | Tempul 1841 (financiación especulativa) + La Réunion Texas (suelo) + Guise (paternalismo) | Hoja de Ruta §10 Fase 0 | **P0** |
| **FAL-D12** | **RMR (Registro Metabólico Regenerativo) inspirado en "salud del falansterio" fourieriana → 7 indicadores autonomía** | Fourier salud integral + OVNi 3.0 análisis comparativo D2 RMR + Sensorica 4 órganos | `docs/ovn_hscsg_comparative_analysis_integration.md` | **P0** |

---

## 2. MAPEO TÉCNICO ACCIONABLE: FALANSTERIO → MÓDULOS HSCSG

### 2.1 Gobernanza: Series/Grupos → Colony Domains + Gaia Circles

```typescript
// lib/colony.ts — DomainNode extendido con metadatos Fourier
interface FourierDomainMeta {
  seriesCount: number;           // 3-4 series por grupo (FAL-D2)
  passionTags: string[];         // "serie" = pasión compartida (FAL-D1)
  workRotationSchedule: CronExpr; // Rotación trabajo atractivo (FAL-D4)
  passionnementScore: number;    // Afecto+Interés+Deber 0-1 (FAL-D7)
}

// lib/gaia.ts — CircleTier mapeo
enum CircleTier {
  ATOM = 1,           // Persona = Célula
  CELL = 3,           // 3-13 = Serie Fourier (FAL-D1)
  HOLON = 13,         // 13-150 = Grupo Fourier / BioHábitat (FAL-D2)
  COMMUNITY = 150,    // Falansterio completo ≈ Nodo Fase C
  BIOREGION = 144,    // Federación nodos
  CONFEDERATION = 10000
}
```

### 2.2 Economía: Bolsa Comunal → 4 Registros + Value Equation

```typescript
// lib/benefitRedistribution.ts — 4 Registros (FAL-D5 + OVNi D3)
interface FourRegistries {
  contribution: ContributionRegistry;    // Trabajo → Aportación (Capital Fourier 4/15)
  responsibility: ResponsibilityRegistry; // Cuidado/Reproducción → Responsabilidad (Trabajo 3/15)
  resourceUse: ResourceUseRegistry;       // Uso infraestructura → Uso Recursos (Talento 3/15)
  economicBenefit: EconomicBenefitRegistry; // Distribución excedentes → Común (5/15)
}

// lib/valueEquation.ts — Coeficientes calibrados por CDS_Jurados (FAL-D8)
interface ValueEquationParams {
  cl: number;  // Labor (Trabajo) → Fourier 3/15 ≈ 0.20
  cm: number;  // Care (Responsabilidad) → Fourier 3/15 ≈ 0.20  
  ce: number;  // EcoRegen (Capital natural) → Fourier 4/15 ≈ 0.27
  ca: number;  // CapitalEnable (Infra) → Fourier 3/15 ≈ 0.20
  cξ: number;  // Extropy (Innovación/Común) → Fourier 5/15 ≈ 0.33
  cδ: number;  // Damage (Externalidades negativas) — NUEVO HSCSG (Copiosis)
}
```

### 2.3 Trabajo: Trabajo Atractivo → Stigmergia + Current-sees

```typescript
// lib/stigmergicCoordination.ts — SignalTypes extendido (FAL-D4)
enum SignalType {
  TRACING = 'tracing',     // Rastros trabajo (Fourier: "señales de necesidad")
  ALARM = 'alarm',         // Alertas escasez/riesgo
  PRIMING = 'priming',     // Preparación estacional/cíclica
  FREE = 'free'            // NUEVO: Invitaciones juego/arte/teatro (Fos 2009 passionnement)
}

// lib/currentSeeSystem.ts — Current-sees lenguaje universal flujos (OVNi D39 + FAL-D4)
interface CurrentSee {
  type: 'TQ' | 'ZNU' | 'USDC' | 'CARE' | 'REP_*' | 'CAAS' | 'CERT_*' | 'PASSION'; // NUEVO
  amount: number;
  passionTag?: string;     // Serie Fourier asociada
  signalType?: SignalType; // Stigmergic coordination
}
```

### 2.4 Arquitectura: Monolito → FABSHIP Distribuido + Earthship

```typescript
// /base screen + lib/tekitl.ts — FABSHIP modules (FAL-D6)
interface FabshipModule {
  type: 'cnc' | 'biofab' | 'textile' | 'energy' | 'food' | 'water' | 'habitat';
  location: GeoCoordinate;           // Distribuido por células (no centralizado)
  cellId: string;                    // Colony DomainNode al que sirve
  autonomyVector: keyof AUT;         // AUT_PROD, AUT_ENER, AUT_ALIM, etc.
  meshConnected: boolean;            // DTN + p2p stack
}

// lib/p2pInfrastructureStack.ts — Mesh DTN reemplaza edificio único
interface MeshNode {
  nodeId: string;
  capabilities: FabshipModule[];
  dtnGateway: boolean;               // Nodo puente para sync oportunista
  lifeRadiusKm: 15;                  // Life Radius HSCSG vs 2km Fourier
}
```

### 2.5 RMR: 7 Indicadores Autonomía (FAL-D12)

```typescript
// docs/ovn_hscsg_comparative_analysis_integration.md → RMR spec
interface RMRIndicators {
  alimentaria: number;    // AUT_ALIM — Soberanía alimentaria (huertas + conservación)
  energetica: number;     // AUT_ENER — Microgrid solar/H2 + almacenamiento
  habitacional: number;   // AUT_HABI — Earthship 6 vectores + bioconstrucción
  hidrica: number;        // AUT_AGUA — Captación + tratamiento + ciclo cerrado
  salud: number;          // AUT_SALU — Medicina integrativa + prevención + cuidado
  productiva: number;     // AUT_PROD — FABSHIP + fabricación distribuida
  gobernanza: number;     // AUT_GOBE — CDS + CDS_Jurados + RAO + Symbiosky
}

// Target: Cada indicador ≥ 2.0 (Fase B) → ≥ 3.5 (Fase C)
// Validación: SVD v2 sensores + RAO append-only + CDS_Jurados auditoría
```

---

## 3. ACTUALIZACIONES BRIEF EXHAUSTIVO (Secciones Afectadas)

### 3.1 Sección 1.3 Genealogía — Nueva fila
| Fase | Nombre | Descripción | Estado |
|------|--------|-------------|--------|
| 2026-11-08 | **Asimilación Falansterios** | Fourier + 4 tesis/artículos + Cahiers → 12 decisiones EBD + mapeo técnico completo | **Completado** |

### 3.2 Sección 2.3 Frameworks Integrados — Nueva fila
| Framework | Sección HSCSG | Aporte Operativo |
|-----------|---------------|------------------|
| **Falansterios (Fourier)** | §16, §17, §18, §20 | Serie→Célula, Grupo→Círculo, Trabajo atractivo→Stigmergia, Bolsa Comunal→4 Registros, Arquitectura monolítica→FABSHIP distribuido, Passionnement→Conviction Voting, Distribución 4/3/3/5→Value Equation, Patrones fracaso→Validación Fase 0 |

### 3.3 Sección 16 (NUEVA) — FALANSTERIOS: ANTECEDENTE HISTÓRICO VALIDADO
[Ver `docs/falansterios_integration.md` sección 3.3 completa]

### 3.4 Sección 17 — Arquitectura 5 Capas: Capa 3 OVN + Capa 4 Infraestructura
- **Capa 3:** Serie/Grupo Fourier → OVN Org Model (Custodian + Exchange Firms)
- **Capa 4:** Plano falansterio → FABSHIP distribuido + Mesh DTN (no edificio único)

### 3.5 Sección 20.1 — Resumen Ejecutivo Nov 2026: Nueva fila
| Hito | Documentos | Decisiones EBD |
|------|------------|----------------|
| **Falansterios (Fourier)** | 1 backup + 1 integration | 12 (FAL-D1 a FAL-D12) |

### 3.6 Sección 20.2 — Arquitectura Resultante: Capa 3 + Capa 4 actualizadas
```
CAPA 3: OPERACIÓN PRODUCTIVA (OVN)
├── Serie Fourier (7-18) → DomainNode Colony / Célula HSCSG
├── Grupo Fourier (3-4 series) → CircleTier Gaia / BioHábitat
├── Trabajo atractivo → Stigmergic Coordination (signalType FREE)
├── Bolsa Comunal → Benefit Redistribution 4 Registros
└── Passionnement → Symbiosky Conviction Voting

CAPA 4: INFRAESTRUCTURA METABÓLICA
├── Edificio monolítico 180×60m → FABSHIP módulos distribuidos por células
├── Cocina/comedor central → CaaS Tier 1 comedores distribuidos (cocinas solares)
├── Biblioteca/teatro → Hylo-Cosateca + /aprender + /circulos
├── Habitaciones → Earthship 6 vectores (AUT_HABI)
├── Talleres → FABSHIP (CNC, biofab, textil, energía, comida, agua, hábitat)
├── Patios/jardines → AUT_ALIM/AGUA huertas regenerativas por célula
└── Anexo agrícola 2km → Life Radius 15km + RMR 7 indicadores
```

---

## 4. ENTREGABLES ACCIONABLES GENERADOS

| Entregable | Tipo | Prioridad | Estado |
|------------|------|-----------|--------|
| `docs/falansterios_backup.md` | Backup fuentes + análisis | **P0** | ✅ Creado |
| `docs/falansterios_integration.md` | Integración EBD + mapeo técnico | **P0** | ✅ Creado (este archivo) |
| `lib/colony.ts` extend: `FourierDomainMeta` | Código | **P0** | 🔄 Pendiente |
| `lib/gaia.ts` extend: `CircleTier` mapeo Fourier | Código | **P0** | 🔄 Pendiente |
| `lib/benefitRedistribution.ts` extend: 4 Registros pesos Fourier | Código | **P0** | 🔄 Pendiente |
| `lib/valueEquation.ts` extend: coeficientes calibrados CDS_Jurados | Código | **P0** | 🔄 Pendiente |
| `lib/stigmergicCoordination.ts` extend: `SignalType.FREE` | Código | **P0** | 🔄 Pendiente |
| `lib/currentSeeSystem.ts` extend: `PASSION` current-see | Código | **P0** | 🔄 Pendiente |
| `/base` screen: RMR 7 indicadores UI | UI | **P1** | 🔄 Pendiente |
| `docs/ovn_hscsg_comparative_analysis_integration.md` patch: RMR spec | Docs | **P0** | 🔄 Pendiente |

---

## 5. VERIFICACIÓN CIENTÍFICA (TRAZABILIDAD)

| Decisión | Fuente Primaria | Fuente Secundaria/Académica | Validación Cruzada |
|----------|----------------|----------------------------|-------------------|
| FAL-D1 | Fourier Œuvres Vol.1 (serie) | Tesis U.Porto 2022 §3.2 | TFG UPM 2026 Tabla 4 |
| FAL-D2 | Fourier Vol.1 (grupo) | Gaia Confederation White Paper | Cahiers Num.12 2005 |
| FAL-D3 | Le nouveau monde industriel (1620 pers) | TFG UPM 2026 Conclusión 5.3 | Gaia Union 9 Sistemas |
| FAL-D4 | Fos 2009 (teatralidad) | Copiosis 3 tipos + OVNi D39 | Symbiosky signal FREE |
| FAL-D5 | Fourier Vol.1 Libro 3 (bolsa) | OVNi D3 + Sensorica praxis | 4 Registros vs Fluid Equity |
| FAL-D6 | Le nouveau monde industriel Parte 2 (plano) | FABSHIP/HUMANIA + OVNi Capa 4 | Descentralización validada |
| FAL-D7 | Fourier Vol.1 (passionnement) | Symbiosky whitepaper + OVNi D38 | lock ZNU ∝ confianza |
| FAL-D8 | Fourier Vol.1 (distribución 4/3/3/5) | Copiosis 8 escalas + CDS_Jurados | Value Equation coeficientes |
| FAL-D9 | Fourier Vol.1 (mujeres) | Copiosis goodType:need + CaaS-BM | Necesidades gratis Tier 1 |
| FAL-D10 | Fourier Vol.1 (niños) | iambrainstorming + OVNi Learning | goodType:capital herramientas |
| FAL-D11 | Tempul 1841 + La Réunion + Guise + Cecilia | Análisis comparativo 4 casos | Fase 0 Proto-CO diseño |
| FAL-D12 | Fourier salud integral | OVNi análisis comparativo D2 + Sensorica | RMR 7 indicadores |

---

## 6. PRÓXIMOS PASOS (SECUENCIA ESTRICTA)

1. **Implementar extensiones código P0** (9 módulos listados en §4) — Bloque 4 parcial
2. **Patch `docs/ovn_hscsg_comparative_analysis_integration.md`** — Añadir RMR spec completo
3. **Actualizar BRIEF_EXHAUSTIVO v2.1** — Integrar sección 16 Falansterios + filas genealogía/frameworks/arquitectura
4. **Validar Fase 0 Proto-CO** — 10 casos beta usan lecciones FAL-D11 (base material ANTES)
5. **Commit + Push** — Mensaje: "feat(falansterios): 12 decisiones EBD + mapeo técnico Fourier→HSCSG"

---

**Nota derechos de autor:** Esta integración contiene **solo análisis propio, mapeos técnicos y referencias bibliográficas**. No reproduce textos completos de fuentes con copyright (Lineasdesaparecidas 2014, Godot 2008). Las citas son breves y con atribución (uso legítimo investigación). Para texto completo Fourier en español: comprar edición Lineasdesaparecidas o usar Obras Completas dominio público (francés) + traducción propia.