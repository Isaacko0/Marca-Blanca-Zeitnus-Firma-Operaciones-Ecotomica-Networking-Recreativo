# Spec: Samay Permacultura Integration — Nodo Piloto ALRAC Capa 0-3

**Versión:** 0.1.0  
**Fecha:** 2026-10-06  
**Estado:** Draft — Para implementación inmediata  
**Entidad:** Samay Permacultura Online SPO / Fundación Runakawsai  
**Ubicación:** Quito, Ecuador (-0.1807, -78.4678)  
**Contacto:** +593 998 826 142 / runakawsai@hotmail.com

---

## 1. CONTEXTO

### 1.1 Perfil Samay

| Métrica | Valor | Validación ALRAC |
|---------|-------|------------------|
| **Experiencia** | **20+ años** proyectos territorio | Base real, no teórica |
| **Equipo** | +250 bioconstructores, +450 diseñadores permacultura | Pipeline PHI/Mycelium inmediato |
| **Alcance** | Fincas, comunidades, organizaciones, instituciones | Escalabilidad probada |
| **Vinculación internacional** | PRI Australia, Tagari Institute (Bill Mollison) | Estándares globales permacultura |
| **Filosofía central** | "El agua revela la verdad del diseño" | Hidrología = diagnóstico territorial |

### 1.2 5 Pilares Core (Mapeo Directo a Capa 1 ALRAC)

| Pilar | Recursos Físicos Medibles | Métrica TQ Base |
|-------|---------------------------|-----------------|
| **💧 Agua y Paisaje** | Agua infiltrada (L), almacenada (m³), swales (m), keyline (ha) | 1 TQ = 1 L agua infiltrada ≈ 1 Wh |
| **🌱 Sistemas Productivos** | Alimento (kg), semillas (paquetes), árboles, bioinsumos (L) | 1 kg alimento = 2 TQ, 1 árbol = 50 TQ |
| **🏡 Infraestructura Regenerativa** | Superadobe (m²), bambú (m²), enlucido tierra (m²) | 1 m² superadobe = 100 TQ |
| **🏘️ Comunidades y Territorio** | Participación (%), fondos comunes (TQ), mingas (días) | 1 día minga = 100 TQ |
| **🤖 Inteligencia Territorial** | Capas GIS, escenarios, datos campo, conocimiento ancestral | No directamente TQ (servicio transversal) |

### 1.3 Gap Crítico: Falta Capa 0/0.5 + Economía Regenerativa 1-3

Samay tiene **metodología y experiencia real** pero **carece de**:
- Marco epistémico formal (γ-CARMIS, PI, Triaxial) → **HSCSG Capa 0**
- Normativa explícita (7 Principios, 5 Anti-reglas, CEL) → **HSCSG Capa 0.5**
- Contabilidad mutual-credit (TQ ±500, demurrage, rotación) → **ALRAC Capa 1**
- Interoperabilidad federada (CPP pools cross-border) → **ALRAC Capa 2**
- Membrana fiat soberana (Coop, CLT, ZNU credit, Banco) → **ALRAC Capa 3**

---

## 2. ARQUITECTURA TÉCNICA (HSCSG v15 OS / Zeitnus)

### 2.1 Archivos Core Creados/Extender

| Archivo | Estado | Propósito |
|---------|--------|-----------|
| `src/core/lib/samay.ts` | ✅ Nuevo (29KB) | Lógica pura dominio Samay: tipos, equivalencias TQ, pools CPP, factory functions |
| `src/core/lib/tq.ts` | 🔄 Extender | Equivalencias hidrológicas (1 TQ = 1 L agua infiltrada) |
| `src/core/lib/cpp.ts` | 🔄 Extender | Pools Samay: semillas, saberes, mano de obra, biomasa, turismo |
| `src/core/lib/alrac.ts` | 🔄 Extender | Tipos `SamayNode`, `SamayPillar`, factory `createSamayNode()` |
| `src/core/state/samay.ts` | 📋 Pendiente | Tipos estado React/Svelte para UI |
| `src/app/screens/Samay.tsx` | 📋 Pendiente | Pantalla + tabs + nav Aside + i18n |
| `docs/samay_backup.md` | ✅ Creado | Backup local (Principio Anfibio) |
| `docs/samay_integration.md` | ✅ Creado | Triple perspectiva completa |

### 2.2 Configuración Nodo Samay (`alrac.ts: createSamayNode()`)

```typescript
// DID: did:key:samay-ec
// TQ Network: equivalencias hidrológicas (SAMAY_TQ_EQUIVALENCES)
// 5 CPP Pools por defecto: semillas_criollas, saberes_ancestrales, mano_obra, biomasa, turismo
// SAMAY OS: migración planificada Google Sites → HSCSG + MINIAGI + meshProtocol
// Programas: PDC 72h, Permacultura 00, Bioconstrucción Superadobe, Water Design Practicum
// Enlaces internacionales: PRI Australia, Tagari Institute, Fundación Runakawsai
```

### 2.3 Equivalencias TQ Hidrológicas (Core Innovation)

```typescript
// En samay.ts: SAMAY_TQ_EQUIVALENCES
const equivalencias = {
  // Agua - core Samay
  'water_infiltrated_liter': { numerator: 1n, denominator: 1000n },  // 1 L = 0.001 TQ
  'water_stored_m3': { numerator: 1n, denominator: 1n },             // 1 m³ = 1 TQ
  'swale_meter': { numerator: 5n, denominator: 1n },                 // 1 m swale = 5 TQ
  'keyline_ha': { numerator: 100n, denominator: 1n },                // 1 ha keyline = 100 TQ
  
  // Suelo
  'soil_organic_matter_ton': { numerator: 50n, denominator: 1n },
  'compost_ton': { numerator: 20n, denominator: 1n },
  'biochar_ton': { numerator: 100n, denominator: 1n },
  
  // Productivo
  'food_kg': { numerator: 2n, denominator: 1n },
  'seed_packet': { numerator: 10n, denominator: 1n },
  'tree_planted': { numerator: 50n, denominator: 1n },
  'bioinput_liter': { numerator: 5n, denominator: 1n },
  
  // Trabajo
  'facilitation_hour': { numerator: 20n, denominator: 1n },
  'design_hour': { numerator: 30n, denominator: 1n },
  'construction_day': { numerator: 200n, denominator: 1n },
  'community_work_day': { numerator: 100n, denominator: 1n },
  
  // Infraestructura
  'superadobe_m2': { numerator: 100n, denominator: 1n },
  'bamboo_m2': { numerator: 80n, denominator: 1n },
  
  // Educación
  'pdc_course': { numerator: 5000n, denominator: 1n },
  'permaculture_00': { numerator: 1000n, denominator: 1n },
};
```

**Función de conversión proyecto → TQ balance:**
```typescript
function projectToTQBalance(project: SamayProjectMetrics): bigint
// Suma todas las métricas del proyecto convertidas a TQ via equivalencias
```

### 2.4 Pools CPP Específicos Samay

```typescript
// En samay.ts: SAMAY_DEFAULT_CPP_POOLS
const pools = [
  { id: 'pool_semillas_criollas', name: 'Semillas Criollas y Nativas', authority: 'consensus' },
  { id: 'pool_saberes_ancestrales', name: 'Saberes Ancestrales y Técnicos', authority: 'dao' },
  { id: 'pool_mano_obra_regenerativa', name: 'Mano de Obra Regenerativa (Mingas/Cayapas)', authority: 'consensus' },
  { id: 'pool_biomasa_compost', name: 'Biomasa, Compost y Bioinsumos', authority: 'algorithmic' },
  { id: 'pool_turismo_regenerativo', name: 'Turismo Comunitario Regenerativo', authority: 'multi_sig' },
];
```

---

## 3. MAPEO A ARQUITECTURA ALRAC 5 CAPAS

| Capa ALRAC | Samay Aporte | Implementación HSCSG |
|------------|--------------|---------------------|
| **0 Epistémica** | "Observar relaciones invisibles", "Claridad interior", Permacultura 00 | γ-CARMIS formalizado, PI multi-fuente, Triaxial verification |
| **0.5 Normativa** | Sostenibilidad, resiliencia, diversidad, cuidado compartido | 7 Principios Javier + 5 Anti-reglas + CEL (jurados sorteados) |
| **1 Contable-Física** | **Agua, energía, biomasa, suelo = recursos medibles** | TQ ledger fincas, catálogo ICE/Ecoinvent + equivalencias Samay, NFC offline |
| **2 Interoperabilidad** | Red facilitadores, alianzas PRI/Tagari, federación ecoaldeas | CPP pools cross-border, RAO credentials, GNAP federation |
| **3 Membrana Fiat** | Formación pagada, proyectos contratados, Fundación Runakawsai | Coop facilitadores, CLT tierra, ZNU credit 2-3%, priceParity oráculo |

---

## 4. PLAN DE CONVERSIÓN PROGRESIVA (HSCSG v15 OS)

### Fase 0: Contacto y Diagnóstico (Semana 1-2)
```bash
# Contactos clave:
- Fundador/Director Samay SPO (WhatsApp +593 998 826 142)
- Equipo Fundación Runakawsai (facilitadores senior)
- Aliados PRI Australia, Tagari Institute

# Acciones:
- Carta individual ALRAC Master §10 (x4)
- γ-CARMIS Preview gratuito (5 casos)
- RAO Verification Lite Samay SPO / Fundación Runakawsai
```

### Fase 1: Piloto Mínimo Viable (Semana 3-6)

| Piloto | Módulo HSCSG | Entregable | Métrica |
|--------|--------------|------------|---------|
| **TQ Ledger Fincas** | `waterDesign` + `tq.ts` | 20 fincas con TQ account ±500 (equivalencias hidrológicas) | Velocity TQ, AUT, días autonomía hídrica |
| **CPP Intercambio Semillas/Saberes** | `cpp.ts` + `cppBridge` | 50 facilitadores + 30 fincas en 5 pools | Matches, exposure, diversidad genética |
| **Territorial Intelligence Digital Twin** | `territorialIntelligence` + `meshProtocol` | Gemelo digital 3 fincas en Solarpunk mesh | Uptime DTN, precisión hidrológica |
| **Comunidad γ-CARMIS** | `kernelProtocol` + `ev.ts` | 100 facilitadores/estudiantes entrenados | αʰ post-entreno, reducción errores |
| **ZNU Credit Bioconstrucción** | `ZNU` vesting + `ALRAC` Capa 3 | 5 créditos 2-3% indexados canasta | Payback 30d, confort térmico medido |

### Fase 2: Escalamiento y Federación (Semana 7-12)
- Nodo Samay en HSCSG v15 OS → `.gnap` + `RAO` + `DID`
- **Federación Feria Conuquera (VE)** → CPP pools semillas/alimentos/bioinsumos
- **Federación +Colonia (UY)** → CPP pools innovación agroecológica, turismo regenerativo
- **Federación Soulpreneurs (70k LATAM)** → pipeline talento/proyectos
- Constitución cooperativa facilitadores (ALRAC Master §10)
- Despliegue nodos TQ físicos (sensores agua/suelo/energía)

### Fase 3: Autonomía Plena (Mes 4-12)
- ALRAC = vehículo comercial SAMAY (Paso 0)
- **Red nodos TQ Andes**: Samay (EC) ↔ Feria (VE) ↔ +Colonia (UY) ↔ Soulpreneurs
- Gobernanza 1a1v real → GAIA COMMONS
- Economía mixta: TQ interno + ZNU puente fiat + USD internacional
- SAMAY OS = MINIAGI soberano (reemplazar Google Sites → HSCSG app + meshProtocol)

---

## 5. SINERGIAS CRÍTICAS

| Proyecto HSCSG | Sinergia | Mecanismo CPP |
|----------------|----------|---------------|
| **Feria Conuquera** | Agroecología, semillas, trueque, asambleas | `pool_semillas_criollas` ↔ `pool_alimentos` cross-border |
| **+Colonia** | Masterplan regenerativo, turismo, educación | `pool_turismo_regenerativo` ↔ `pool_cultura` + `pool_innovacion` |
| **Soulpreneurs (70k)** | Talento/conciencia para proyectos regenerativos | Cohorte "Soulpreneurs Samay" en PHI/Mycelium |
| **Solarpunk Utopia** | Mesh/DTN/NATS, ValueFlows REA, offline-first | `meshNode` + `dtnBundle` en fincas piloto Ecuador |
| **ALRAC Master** | 5 capas, 7 holones — marco unificador | Samay = nodo piloto completo Capa 0-3 |
| **EV_CORE / MINIAGI** | SAMAY OS → MINIAGI soberano | HSCSG app + meshProtocol reemplaza Google Sites |

---

## 6. RIESGOS Y MITIGACIONES

| Riesgo | Probabilidad | Impacto | Mitigación HSCSG |
|--------|--------------|---------|------------------|
| Plataformas centralizadas (Google Sites, Meta, WhatsApp) | Alta | Crítico | Principio Anfibio: HSCSG app + meshProtocol + MINIAGI + GNAP |
| Falta métricas cuantificables (resiliencia, pertenencia) | Media | Alto | LEF `energyCatalog` + `symmetricLimits` + TQ ledger hidrológico |
| Escalabilidad finca → territorio → bioregión | Media | Alto | CPP pools federados + NDO federation + GNAP cross-repo |
| Financiación dependiente proyectos/formación | Media | Medio | ZNU credit 2-3% + cooperativa facilitadores + turismo regenerativo |
| Extractivismo datos territoriales / conocimiento ancestral | Media | Alto | DATA TRUST + COMMONS: soberanía datos, decisiones 1a1v, RAO procedencia |
| Conectividad rural Ecuador (offline real) | Alta | Crítico | NFC offline (Cergio) + DTN/NATS (Solarpunk) + Principio Anfibio nativo |

---

## 7. MÉTRICAS DE ÉXITO (90 días / 1 año)

| Categoría | KPI | Target 90 días | Target 1 año |
|-----------|-----|----------------|--------------|
| **Técnicos** | Fincas con TQ account activo | 20 | 200 |
| | CPP pools operativos | 5 | 15 |
| | ZNU créditos bioconstrucción | 5 | 50 |
| | Nodo GNAP registrado | 1 | 1 (federado 5+) |
| **Documentales** | `samay_integration.md` triple perspectiva | ✅ Completa | v2 actualizada |
| | `openspec/specs/samay-integration.md` | ✅ Creada | PVL compliant |
| | Cartas individuales (4 decisores) | 4 enviadas | Respuestas documentadas |
| **Operativos** | Agente `samay-node` en GNAP | Registrado | Heartbeat activo |
| | Cohorte PHI "Samay" | 50 inscritos | 200 + facilitadores γ-CARMIS |
| **Estratégicos** | Decisión ALRAC = vehículo SAMAY | Definida (Paso 0) | Ejecutada |
| | Federación 4 nodos TQ Andes/Cono Sur | Piloto CPP | Operativa |
| | SAMAY OS migrado a HSCSG | MVP funcional | Producción |

---

## 8. CRITERIOS DE VALIDACIÓN PVL (OpenSpec)

```bash
# Verificación técnica
cd /c/Users/Isaacko0/Zeitnus-Firma-Operaciones-Ecotomica
npx tsc --noEmit                    # 0 errores (solo pre-existentes)
npm run build                       # Build OK

# Tests unitarios (pendientes crear)
bun test samay.test.ts              # Equivalencias TQ, CPP pools, factory functions
bun test integration.test.ts        # Nodo Samay + GNAP registration

# Health checks
curl http://localhost:3000/api/health/samay   # 200 OK
curl http://localhost:3000/samay              # 200 OK (pantalla)

# OpenSpec validation
spec-validator openspec/specs/samay-integration.md  # PVL compliant
```

---

## 9. REFERENCIAS CRUZADAS

| Documento | Sección | Actualización |
|-----------|---------|---------------|
| `docs/ALRAC_MASTER_INTEGRADO.md` | §12 Colaboraciones | Añadir Samay colaboración explícita |
| `docs/GRANALLIANZA_MAPPING.md` | 7 holones | Samay nodo real: GAIA/MYCELIUM/PHI |
| `docs/ZEITNUS_REGENERATIVE_MODEL.md` | Mapping Samay | **FUENTE ORIGINAL** — validar |
| `openspec/specs/SPEC_INDEXER.md` | Índice specs | Añadir `samay-integration.md` |
| `src/core/lib/alrac.ts` | Tipos core | `SamayNode`, `SamayPillar` extendidos |
| `Soulpreneurs_ALRAC_Mapping.md` | Plan 60 días | Samay hub Andes semana 3-6 |
| `WillRuddick_TQ_CPP_Assimilation.md` | Feria Conuquera | Vincular Samay nodo hermano Capa 1+2 |
| `MasColonia_HSCSG_Assimilation.md` | Sinergias | Samay ↔ +Colonia CPP pools agroecología/turismo |

---

## 10. CITAS ANCLA

> **"El agua revela la verdad del diseño."** — Samay (Principio central: hidrología como diagnóstico)

> **"Tu territorio no tiene un problema de sequía o inundaciones. Tiene un problema de diseño."** — Samay (Reformulación sistémica)

> **"Agua primero. Diseño después. Regeneración como resultado."** — Samay (Secuencia operativa inmutable)

> **"Los lugares bien diseñados generan pertenencia. Y la pertenencia genera resiliencia."** — Samay (Mecanismo comunidad-territorio)

> **"No se trata de acumular información. Se trata de desarrollar criterio, comprensión y capacidad de implementación. El conocimiento cobra valor cuando se convierte en territorio."** — Samay (Filosofía educación)

> **"La regeneración no ocurre únicamente fuera de nosotros. También ocurre en la forma en que aprendemos a observar, comprender y actuar."** — Samay (Dimensión humana / Permacultura 00 ≈ γ-CARMIS)

> **"Las mejores construcciones no dominan el paisaje. Aprenden a formar parte de él."** — Samay (Bioconstrucción / infraestructura regenerativa)

---

## 11. CONCLUSIÓN: SAMAY COMO NODO PILOTO ESTRATÉGICO

**Condiciones únicas cumplidas:**
1. ✅ **20+ años experiencia real** — Proyectos territorio Ecuador + internacional
2. ✅ **5 pilares cubren Capa 1** — Agua, productivo, infra, comunidad, inteligencia = recursos medibles
3. ✅ **Demanda nativa Capa 2** — Red 700+ facilitadores, alianzas PRI/Tagari = federación natural
4. ✅ **Formación masiva validada** — +700 profesionales = pipeline PHI/Mycelium inmediato
5. ✅ **SAMAY OS propio** — Demanda nativa inteligencia territorial → migración natural MINIAGI
6. ✅ **Filosofía alineada HSCSG** — "Diseñar mejor = claridad interior" ≈ γ-CARMIS / Ley III
7. ✅ **Gap crítico exacto** — Falta Capa 0/0.5 + economía 1-3 → **HSCSG/ALRAC aporta esto**

---

> **Nota de spec:** Este documento sigue OpenSpec PVL. La implementación TypeScript en `src/core/lib/samay.ts` es la referencia ejecutable. Los nodos piloto Feria, +Colonia y Samay forman la **triangulación Andina/Cono Sur** para federación TQ/CPP/ZNU.
>
> **La pala y el teclado están en tus manos. E=V.**