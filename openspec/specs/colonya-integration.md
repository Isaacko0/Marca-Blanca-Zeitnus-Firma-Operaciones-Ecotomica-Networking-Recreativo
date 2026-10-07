# Spec: +Colonia Integration — Nodo Piloto ALRAC Capa 1-3

**Versión:** 0.1.0  
**Fecha:** 2026-10-06  
**Estado:** Draft — Para implementación inmediata  
**Contexto:** Proyecto urbano regenerativo 515ha, Uruguay. Entidad legal: Ala Este SAS. US$500M comprometidos.

---

## 1. CONTEXTO

### 1.1 Perfil +Colonia

| Métrica | Valor | Validación ALRAC |
|---------|-------|------------------|
| Superficie | 515 hectáreas | Tamaño nodo ALRAC Línea E (Nodos TQ) |
| Costa | 7+ km playas arena blanca | Recurso `Space` + `Physical` |
| Matriz energética | **97% renovables** | **Base real TQ ledger** (Capa 1) |
| Espacios verdes | 50%+ superficie | `ResourceNature::Space` + gobernanza `Commons` |
| Conectividad | 1Gbps/5G, WiFi6 toda superficie | Infra `meshProtocol`/`dtnBundle` (Solarpunk) |
| Ubicación | 800m puerto, 1h BsAs, 2h MVD, aeropuerto 500m | Hub Cono Sur estratégico |
| Inversión | US$ 500 millones | Entidad Capa 3 real (Ala Este SAS) |
| Masterplan | Estudio Gómez Platero (entramado celular flexible) | `territorialIntelligence` / `urbanDesign` |

### 1.2 Gap Crítico: Falta Capa 0/0.5

+Colonia **no tiene marco epistémico/normativo explícito** → **HSCSG/ALRAC aporta exactamente esto**:
- γ-CARMIS para detectar incoherencias ("ciudad abierta" vs "barrio cerrado")
- 7 Principios Javier (democracia económica, límites concentración, planificación ecológica)
- Consentimiento Total (αʰ triaxial) para decisiones residentes

---

## 2. MAPEO A ARQUITECTURA ALRAC 5 CAPAS

| Capa ALRAC | +Colonia Manifestación | Implementación Requerida |
|------------|------------------------|--------------------------|
| **0 Epistémica** | *Ausente* | γ-CARMIS + PI + 𝕮 + Triaxial + Buzhou Shan |
| **0.5 Normativa** | Parcial (sostenibilidad, proximidad) | 7 Principios + 5 Anti-reglas + CEL (jurados sorteados) |
| **1 Contable-Física** | **97% renovables = base TQ real** | TQ accounts hogares, energyCatalog ICE, NFC offline |
| **2 Interoperabilidad** | **Ecosistema innovación = demanda nativa CPP** | 4 CPP pools: innovación, energía, cultura, alimentos |
| **3 Membrana Fiat** | **Ala Este SAS + US$500M = entidad Capa 3 real** | Coop trabajo asociado + CLT/fideicomiso + ZNU credit 2-3% |

---

## 3. IMPLEMENTACIÓN TÉCNICA (HSCSG v15 OS / Zeitnus)

### 3.1 Archivos Core a Crear/Extender

| Archivo | Propósito |
|---------|-----------|
| `src/core/lib/colonya.ts` | Lógica pura dominio +Colonia (tipos, funciones) |
| `src/core/lib/tq.ts` | Ya extendido con `cppBridge` para pools +Colonia |
| `src/core/lib/cpp.ts` | Ya creado - pools innovación/energía/cultura/alimentos |
| `src/core/lib/alrac.ts` | Ya extendido con `ALRACNode` + factory `createColoniaNode()` |
| `src/core/state/colonya.ts` | Tipos estado React/Svelte para UI |
| `src/app/screens/Colonia.tsx` | Pantalla + tabs + nav Aside + i18n |
| `docs/colonya_backup.md` | Backup local (Principio Anfibio) |
| `docs/colonya_integration.md` | Triple perspectiva completa |

### 3.2 Tipos Dominio +Colonia (`colonya.ts`)

```typescript
// ============ +COLONIA DOMAIN TYPES ============

interface ColoniaNode {
  did: DID;                           // did:key:colonya-uy
  name: '+Colonia';
  location: GeoCoord;                 // -34.47, -57.85 (aprox)
  areaHa: 515;
  coastKm: 7;
  energyMatrix: EnergyMatrix;         // 97% renovables
  greenSpaceRatio: 0.50;
  connectivity: ConnectivitySpec;     // 1Gbps, 5G, WiFi6
  masterplan: MasterplanSpec;         // Gómez Platero, células modulares
  districts: District[];              // Génesis, outdoors, reserva, playas, wellness, deportes, muelle, vial costero
  governance: GovernanceModel;        // Comisiones, asambleas trimestrales, cayapas
  education: EducationSpec;           // Lifelong, coding, campus, business schools
  culture: CultureSpec;               // Arte, gastronomía, música, puente BsAs-MVD
  legalEntity: 'Ala Este SAS';
  investmentUSD: 500_000_000;
  stage: 'construction' | 'operational' | 'expansion';
}

interface ColoniaResident {
  did: DID;
  tqAccount: TQAccount;               // ±500 TQ, 1 TQ = 1 kWh
  znuVesting: ZNUVesting;             // Crédito vivienda 2-3%
  cppPools: PoolId[];                 // Pools innovación, cultura, energía, alimentos
  skillCredentials: SkillCredential[]; // RAO verified
  proximityScore: number;             // 15-min city compliance
}

// Distritos del Masterplan
type District = 
  | 'genesis'           // Distrito Génesis (entrada principal)
  | 'outdoors'          // Actividades outdoors
  | 'reserva'           // Reserva natural
  | 'playas'            // Playas
  | 'wellness'          // Wellness
  | 'deportes'          // Deportes
  | 'centro_calabres'   // Centro El Calabrés
  | 'muelle_calabres'   // Muelle El Calabrés
  | 'vial_costero'      // Vial costero
  | 'conexion_mvd';     // Conexión Montevideo (acceso principal)
```

### 3.3 Configuración TQ + CPP para +Colonia

```typescript
// En alrac.ts: createColoniaNode() ya define:
// - TQ Network con priceParity 1 TQ = $0.12 USD
// - EnergyCatalog ICE (solar/wind/grid)
// - 4 CPP Pools: innovación, energía, cultura, alimentos
// - Cooperative: Ala Este SAS, governance hybrid, quorum 0.6
// - LandTrust: hybrid (CLT + fideicomiso + coop), 515ha
// - Bank: ZNU credit 2.5%, indexado canasta 5 items, max LTV 0.7
// - PriceParity: Chainlink + Pyth + HSCSG custom, consensus 2/3
```

### 3.4 Pantalla UI (`Colonia.tsx`)

```tsx
// Tabs: Masterplan | Energía/TQ | Innovación/CPP | Comunidad | Gobernanza | Inversión/ZNU
// Icono Lucide: Map (válido) o Building2
// i18n keys: nav.colonia, tabs.masterplan, tabs.energy, tabs.innovation...
```

---

## 4. PLAN DE CONVERSIÓN PROGRESIVA (HSCSG v15 OS)

### Fase 0: Contacto y Diagnóstico (Semana 1-2)
```bash
# 1. Identificar decisores clave
- Eduardo Bastitta (CEO) — visión comercial
- Francisco Tezanos (CMO) — narrativa/marketing
- Nicolás Mieres (Urbanismo) — técnico/masterplan
- Marcos Amadeo (Innovación) — ecosistema tech
- René Boettcher (Inversores) — capital

# 2. Carta individual ALRAC Master §10 (plantilla)
# 3. γ-CARMIS Preview gratuito (5 casos) → detectar incoherencias
# 4. RAO Verification Lite en Ala Este SAS
```

### Fase 1: Piloto Mínimo Viable (Semana 3-6)

| Piloto | Módulo HSCSG | Entregable | Métrica |
|--------|--------------|------------|---------|
| **TQ Ledger Hogares** | `energyAccounting` + `tq.ts` | 50 hogares piloto con TQ account ±500 | Velocity TQ, AUT |
| **CPP Ecosistema Innovación** | `cpp.ts` + `cppBridge` | 20 startups + 5 univ + 3 inversores en pools | Matches, exposure |
| **Masterplan Digital Twin** | `territorialIntelligence` + `meshProtocol` | Gemelo digital 515ha en Solarpunk mesh | Uptime DTN, TQ accuracy |
| **Comunidad γ-CARMIS** | `kernelProtocol` + `ev.ts` | 100 residentes entrenados protocolo | αʰ post-entreno |
| **ZNU Credit Vivienda** | `ZNU` vesting + `ALRAC` Capa 3 | Financiación 2-3% indexada canasta | Payback 30d, LTV/CAC 3:1 |

### Fase 2: Escalamiento y Federación (Semana 7-12)
- Nodo +Colonia en HSCSG v15 OS → registro `.gnap` + `RAO` + `DID`
- **Federación con Feria Conuquera (Caracas)** → CPP pools cross-border alimentos/energía/cultura
- Federación con Soulpreneurs (70k LATAM) → marketplace talento/proyectos
- Constitución legal cooperativa trabajo asociado (ALRAC Master §10 semana 8-12)
- Despliegue primer nodo TQ físico (infra energía/agua/conectividad)

### Fase 3: Autonomía Plena (Mes 4-12)
- ALRAC = vehículo comercial NEXO (decisión Paso 0 con Yoka)
- **Red nodos TQ Cono Sur**: +Colonia (UY) ↔ Feria Conuquera (VE) ↔ Soulpreneurs hubs (MX/CO/PE/CL/AR)
- Gobernanza 1a1v real → asambleas residentes + GAIA COMMONS
- Economía mixta operativa: TQ interno + ZNU puente fiat + USD inversores

---

## 5. SINERGIAS CRÍTICAS CON PROYECTOS ASIMILADOS

| Proyecto HSCSG | Sinergia con +Colonia | Acción Concreta |
|----------------|----------------------|-----------------|
| **Feria Conuquera** | Ambos: economía regenerativa real, 1 TQ = 1 kWh, gobernanza asamblearia | CPP pool cross-border: alimentos/energía/cultura |
| **Soulpreneurs (70k)** | Pipeline talento/proyectos para ecosistema innovación | Cohorte "Soulpreneurs +Colonia" en PHI/Mycelium |
| **Samay Permacultura** | 9 módulos core aplicables: agua, productivo, bioconstrucción | Reutilizar `waterDesign`, `productiveSystems`, `bioConstruction` |
| **LEF (Ecoaldeas)** | 13 specs P0/P1 directamente aplicables a masterplan | `energyCatalog`, `symmetricLimits`, `productFederation`, `land` |
| **Solarpunk Utopia** | Mesh/DTN/NATS federation, ValueFlows REA, offline-first | Desplegar infra `meshNode` + `dtnBundle` en 515ha |
| **ALRAC Master** | 5 capas, 5 líneas A-E, 7 holones — marco unificador | +Colonia = nodo piloto completo Capa 1-3 |
| **EV_CORE / MINIAGI** | "Colo" AI concierge → migrar a MINIAGI soberano + EV | Reemplazar chat widget propietario |

---

## 6. RIESGOS Y MITIGACIONES ESPECÍFICOS

| Riesgo | Probabilidad | Impacto | Mitigación HSCSG |
|--------|--------------|---------|------------------|
| Desarrollo inmobiliario convencional disfrazado | Alta | Crítico | γ-CARMIS audit: detectar incoherencias "ciudad abierta" vs "barrio cerrado" |
| Greenwashing (97% renovables sin auditoría) | Media | Alto | LEF `energyCatalog` + `exchangeGuard` + verificación triaxial |
| Dependencia capital externo (US$500M) | Alta | Alto | ZNU credit 2-3% + cooperativa trabajo asociado = soberanía financiera |
| Tecnología propietaria (Webflow, Colo AI, WhatsApp) | Media | Medio | Principio Anfibio: migrar a Solarpunk mesh + MINIAGI + GNAP |
| Gentrificación / exclusión | Alta | Crítico | `land.ts` (CLT/usufructo/coop) + `taxEngine` progresivo + fondo comunitario |
| Falta gobernanza residentes real | Media | Alto | `governance.ts` (3 niveles, voto Ed25519) + `ALRAC` γ-CARMIS consentimiento total |

---

## 7. MÉTRICAS DE ÉXITO (ALINEADAS ALRAC MASTER)

| Categoría | KPI | Target 90 días | Target 1 año |
|-----------|-----|----------------|--------------|
| **Técnicos** | Hogares con TQ account activo | 50 | 500 |
| | CPP pools operativos | 4 | 12 |
| | ZNU créditos vivienda desembolsados | 10 | 100 |
| | Nodo GNAP registrado | 1 | 1 (federado 4+) |
| **Documentales** | `colonya_integration.md` triple perspectiva | Completa | Actualizada v2 |
| | `openspec/specs/colonya-integration.md` | Creada | Compliant PVL |
| | Cartas individuales (5 decisores) | 5 enviadas | Respuestas documentadas |
| **Operativos** | Agente `colonya-node` en GNAP | Registrado | Heartbeat activo |
| | Cohorte PHI "+Colonia" | 50 inscritos | 200 + facilitadores γ-CARMIS |
| | Facilitadores γ-CARMIS certificados | 10 | 50 |
| **Estratégicos** | Decisión ALRAC = vehículo NEXO | Definida (Paso 0) | Ejecutada |
| | Federación Feria + Soulpreneurs | Piloto CPP | 3 nodos TQ Cono Sur |
| | Velocity ZNU > 0 | Medible | Autosustentable |

---

## 8. PRÓXIMOS PASOS INMEDIATOS (ESTA SEMANA)

### Día 1-2: Fundación
- [ ] **Ejecutar backup Fase 0** HSCSG_v15_OS
- [ ] **Crear `docs/colonya_backup.md`** (contenido extraído + metadata)
- [ ] **Crear `docs/colonya_integration.md`** (triple perspectiva completa)
- [ ] **Registrar contactos clave** en `caasOutreach` board (GNAP task chain)

### Día 3-4: Contacto Estratégico
- [ ] **Enviar 5 cartas individuales** (plantilla ALRAC Master §10) a: Bastitta, Tezanos, Mieres, Amadeo, Boettcher
- [ ] **Solicitar reunión γ-CARMIS Preview** (5 casos gratis) con equipo directivo
- [ ] **RAO Verification Lite** en Ala Este SAS (procedencia, emisor, permisos, estado, revocación)

### Día 5-7: Técnico
- [ ] **Crear `openspec/specs/colonya-integration.md`** (este archivo)
- [ ] **Implementar `src/core/lib/colonya.ts`** + tipos estado
- [ ] **Extender `tq.ts` con `cppBridge` para pools +Colonia** (ya hecho)
- [ ] **Registrar agente `colonya-node` en `.gnap/agents.json`** (Zeitnus + HSCSG)

---

## 9. REFERENCIAS CRUZADAS REPOSITORIO

| Documento | Sección | Actualización Requerida |
|-----------|---------|------------------------|
| `docs/ALRAC_MASTER_INTEGRADO.md` | §12 Colaboraciones, §10 Secuencia | Añadir +Colonia como colaboración explícita |
| `docs/GRANALLIANZA_MAPPING.md` | Línea E (Nodos TQ) | Añadir +Colonia nodo real holón GAIA/COMMONS/NETWORK |
| `docs/ZEITNUS_REGENERATIVE_MODEL.md` | Mapping Samay | Añadir +Colonia como validación empírica urbana |
| `openspec/specs/SPEC_INDEXER.md` | Índice specs | Añadir `colonya-integration.md` |
| `src/core/lib/alrac.ts` | Tipos core | Ya extendido con `ColoniaNode`, `ColoniaResident` |
| `Soulpreneurs_ALRAC_Mapping.md` | Plan 60 días | Añadir +Colonia como hub Cono Sur semana 5-8 |
| `WillRuddick_TQ_CPP_Assimilation.md` | Feria Conuquera | Vincular +Colonia como nodo hermano Capa 1+3 |

---

## 10. CITAS CLAVE

> **+Colonia: "Una ciudad donde emprendedores, start ups, universidades, empresas e inversores se conecten para co-crear juntos un ecosistema basado en la economía del conocimiento, el bienestar y el respeto por la naturaleza."** — Web oficial

> **"+Colonia eCiudad de los 15 minutos: está pensada como una ciudad abierta, un proyecto urbanístico de cercanía... que integra lo natural y lo urbano, mediante áreas flexibles de entramado celular."** — Web oficial

> **"Matriz energética de energías renovables. Gestión eficiente de energía, agua y residuos. Materiales verdes y amigables con el medio ambiente. Estándares más altos de sustentabilidad."** — Web oficial

> **"Long life learning. Sede académica internacional. Enseñanza inicial y campus universitario. Escuelas de codificación y alianzas con escuelas de negocios."** — Web oficial

> **"Arte, cultura y entretenimiento son el corazón del proyecto. Gastronomía, música, conexión y puente cultural con Buenos Aires y Montevideo."** — Web oficial

---

## 11. CONCLUSIÓN: +COLONIA COMO NODO PILOTO IDEAL ALRAC

**+Colonia cumple condiciones únicas:**

1. **Base física real** — 515ha, 7km costa, 97% renovables, 50% verde (no render, obra en curso)
2. **Escala adecuada** — 515ha = tamaño nodo ALRAC Línea E (Nodos TQ)
3. **Entidad legal operativa** — Ala Este SAS, US$500M comprometidos, equipo 10+ personas
4. **Validación política** — Visita presidente Yamandú Orsi, FutureCitiesGlobal 2025
5. **Demanda nativa Capa 2** — Ecosistema innovación (startups, univ, inversores) = CPP natural
6. **Ubicación estratégica** — Hub Cono Sur (1h BsAs, 2h Montevideo, aeropuerto 500m)
7. **Cultura regenerativa** — Manual especies nativas, limpieza comunitaria, arte/cultura central

**Gap crítico:** Falta marco epistémico/normativo (Capa 0/0.5) → **HSCSG/ALRAC aporta exactamente esto**.

**Conversión progresiva:** No "vender" HSCSG, sino **demostrar valor operativo** via pilotos TQ/CPP/ZNU que resuelvan dolores reales (+Colonia): financiación soberana, gobernanza real, métricas sostenibilidad auditables, federación regional.

---

> **Nota de asimilación:** Este documento sigue metodología HSCSG v15 OS rigurosa: Fase 0 backup → Fase 1 extracción exhaustiva → Fase 2 triple perspectiva → Fase 3 módulo técnico + spec OpenSpec → Fase 4 verificación. El **Principio Anfibio** se aplica desde diseño: misma lógica opera en modo **Triaxial** (offline, postmonetario, TQ/ZNU) y **TypeSafe** (conectado, USD/USDC via priceParity, Nivel 3 ReFi).
>
> **La pala y el teclado están en tus manos. E=V.**