# Gran Alianza Mapping - ALRAC Lines to 7 Holones

**Versión:** 1.0  
**Fecha:** 2026-09-19  
**Estado:** Draft  
**Autor:** ALRAC Coordinator (simulación autónoma)

---

## 1. Propósito

Mapeo línea por línea entre las **5 líneas de negocio ALRAC** (A-E) y los **7 holones de la Gran Alianza**, mostrando cómo cada línea alimenta, consume, y coordina con los holones especializados.

---

## 2. Matriz de Mapeo Principal

| Línea ALRAC | Nombre | Holón Principal | Holones Secundarios | Flujo de Valor |
|-------------|--------|-----------------|---------------------|----------------|
| **A** | Diagnóstico Encaje | **GAIA** (Ecosistema/Articulación) | MYCELIUM (matching), PROJECT WEAVE (credenciales) | GAIA articula diagnóstico → MYCELIUM matchea necesidades → PROJECT WEAVE certifica |
| **B** | Kit Simulación | **PHI** (Educación Holística) | MYCELIUM (infraestructura educativa), HSCSG (datos/procedencia) | PHI diseña currículo → MYCELIUM entrega plataforma → HSCSG rastrea procedencia |
| **C** | Prototipado Vía | **GAIA NETWORK** (Market/Economy) | SYNCHROLABS (interop), HSCSG (ValueFlows) | GAIA NETWORK conecta oferta/demanda → SYNCHROLABS interopera → HSCSG contabiliza |
| **D** | Entrenamiento γ-CARMIS | **GAIA HUB + HIVE IA** (AI/Matching) | MYCELIUM (grafos/búsqueda), HSCSG (Kernel IA) | HIVE IA matchea entrenadores → MYCELIUM grafos comunidad → HSCSG Kernel valida |
| **E** | Nodos TQ | **HSCSG** (Infraestructura Confianza/Datos) | DATA TRUST (gobernanza datos), GAIA COMMONS (gobernanza) | HSCSG provee infra → DATA TRUST gobierna datos → GAIA COMMONS gobierna commons |

---

## 3. Detalle por Línea

### Línea A: Diagnóstico Encaje → GAIA (Articulador)

**Descripción:** Evaluación de encaje de proyectos/territorios en el ecosistema regenerativo.

| Componente | GAIA | MYCELIUM | PROJECT WEAVE | HSCSG |
|------------|------|----------|---------------|-------|
| **Input** | Proyecto/territorio candidato | Perfil necesidades/capacidades | Credenciales existentes | RAO verificadas |
| **Proceso** | Articulación diagnóstico | Matching semántico necesidades | Verificación credenciales | Procedencia + confianza |
| **Output** | Informe encaje + recomendación | Matches calificados | Credenciales validadas | CDS score inicial |
| **Métrica** | % proyectos diagnosticados | Precisión matching | % credenciales verificadas | αʰ diagnóstico |

**Integración técnica:**
```typescript
// GAIA orquesta, delega a holones especializados
async function runDiagnosticoEncaje(project: Project): Promise<DiagnosticoResult> {
  const [matching, credentials, trust] = await Promise.all([
    mycelium.matchNeeds(project.needs),
    projectWeave.verifyCredentials(project.credentials),
    hscsg.getTrustHistory(project.did)
  ]);
  
  return gaia.synthesizeDiagnostico({ matching, credentials, trust });
}
```

---

### Línea B: Kit Simulación → PHI (Educación) + MYCELIUM (Infra)

**Descripción:** Kit de simulación regenerativa para comunidades/proyectos (escenarios, modelos, herramientas).

| Componente | PHI | MYCELIUM | HSCSG | GAIA |
|------------|-----|----------|-------|------|
| **Input** | Contexto territorial, objetivos | Requisitos plataforma | Datos base (suelo, agua, energía) | Contexto ecosistémico |
| **Proceso** | Diseño currículo + simuladores | Entrega LMS + matching facilitadores | Rastrea procedencia datos + modelos | Articula demanda territorial |
| **Output** | Kit simulado + ruta aprendizaje | Plataforma operativa | Datos con procedencia verificada | Proyecto listo para Línea C |
| **Métrica** | # kits entregados, completion rate | Uptime plataforma, satisfacción | % datos con procedencia | Proyectos → Línea C |

**Integración técnica:**
```typescript
// PHI diseña, MYCELIUM entrega, HSCSG rastrea
async function deliverKitSimulacion(territory: Territory): Promise<KitResult> {
  const curriculum = await phi.designCurriculum(territory.context);
  const platform = await mycelium.deployPlatform({
    curriculum,
    facilitators: await mycelium.matchFacilitators(territory.needs),
    dataProvenance: await hscsg.registerData(territory.baselineData)
  });
  
  return { curriculum, platform, provenance: platform.dataProvenance };
}
```

---

### Línea C: Prototipado Vía → GAIA NETWORK (Market) + SYNCHROLABS (Interop)

**Descripción:** Prototipado rápido de vías productivas/regenerativas con validación de mercado.

| Componente | GAIA NETWORK | SYNCHROLABS | HSCSG | DATA TRUST |
|------------|--------------|-------------|-------|------------|
| **Input** | Proyecto validado (Línea A/B) | Especs técnicas | ValueFlows config | Datos mercado |
| **Proceso** | Conecta productores/compradores | Interopera protocolos (VF, IPFS, etc) | Contabiliza TQ/ZNU | Gobierna datos sensibles |
| **Output** | Órdenes/revenue real | Stack interoperable | Balances TQ/ZNU | Datos auditables |
| **Métrica** | Revenue generado, TQ medido | # protocolos interoperados | Velocity ZNU, AUT | Compliance rate |

**Integración técnica:**
```typescript
// GAIA NETWORK mercado, SYNCHROLABS interop, HSCSG contabilidad
async function runPrototipadoVia(prototipo: Prototipo): Promise<PrototipoResult> {
  const marketAccess = await gaiaNetwork.connectMarket(prototipo.offer);
  const interopStack = await synchroLabs.buildInteropStack(prototipo.specs);
  const accounting = await hscsg.setupValueFlows({
    streams: prototipo.revenueStreams,
    amidSplit: { amid: 0.35, yoka: 0.35, nodes: 0.30 }
  });
  
  return { marketAccess, interopStack, accounting };
}
```

---

### Línea D: Entrenamiento γ-CARMIS → GAIA HUB + HIVE IA + MYCELIUM

**Descripción:** Entrenamiento en protocolo γ-CARMIS (detección incoherencia, recuperación 11 pasos).

| Componente | GAIA HUB + HIVE IA | MYCELIUM | HSCSG (Kernel) | PROJECT WEAVE |
|------------|-------------------|----------|----------------|---------------|
| **Input** | Candidatos a entrenar | Grafos comunidad | Sesgos IA conocidos | Credenciales trainer |
| **Proceso** | Matching entrenador-alumno | Búsqueda semántica comunidad | Kernel: transparencia, introspección | Verifica credenciales trainer |
| **Output** | Entrenadores certificados | Red de práctica | Modelos IA auditados | Credenciales γ-CARMIS |
| **Métrica** | # certificados, αʰ post-entreno | Conexiones comunidad | Sesgos detectados/corregidos | Tasa verificación |

**Integración técnica:**
```typescript
// HIVE IA matchea, MYCELIUM grafos, HSCSG Kernel valida
async function runEntrenamientoGammaCarmis(cohort: Cohort): Promise<TrainingResult> {
  const matches = await hiveAI.matchTrainers(cohort.participants);
  const communityGraph = await mycelium.buildCommunityGraph(cohort.region);
  const kernelAudits = await hscsg.kernel.auditTransparency(matches.sessions);
  
  return { matches, communityGraph, kernelAudits, certifications: [] };
}
```

---

### Línea E: Nodos TQ → HSCSG (Infra) + DATA TRUST + GAIA COMMONS

**Descripción:** Despliegue y operación de nodos TQ (infraestructura física + digital regenerativa).

| Componente | HSCSG | DATA TRUST | GAIA COMMONS | GAIA NETWORK |
|------------|-------|------------|--------------|--------------|
| **Input** | Tierra, energía, comunidad | Datos sensores, uso tierra | Propuesta gobernanza | Demanda mercado |
| **Proceso** | Infra: DTN, VF, bridge, discovery | Soberanía datos, consentimiento | Gobernanza commons, 1a1v | Conecta nodo a mercado |
| **Output** | Nodo operativo TQ | Datos gobernados | Estatutos commons | Revenue streams activos |
| **Métrica** | Nodos desplegados, TQ/kWh | % datos soberanos | Decisiones 1a1v | Revenue/ZNU generado |

**Integración técnica:**
```typescript
// HSCSG infra core, DATA TRUST gobierna, GAIA COMMONS gobierna commons
async function deployTQNode(proposal: NodeProposal): Promise<NodeResult> {
  const infra = await hscsg.deployNodeInfra({
    dtn: true,
    valueflows: true,
    bridgeNodes: true,
    discovery: true
  });
  
  const dataGov = await dataTrust.establishGovernance({
    nodeId: proposal.id,
    sensors: proposal.sensors,
    consentModel: 'dynamic'
  });
  
  const commons = await gaiaCommons.constituteCommons({
    nodeId: proposal.id,
    land: proposal.land,
    members: proposal.foundingMembers
  });
  
  return { infra, dataGov, commons };
}
```

---

## 4. Flujo Transversal: Sprint 60 Días (7 Holones)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SPRINT 60 DÍAS - 7 HOLONES                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  HOLÓN 1: VISIÓN & GOVERNANCE          ← GAIA + GAIA COMMONS               │
│  ├── Principios E=V/NEXO                    ├── Commons governance          │
│  ├── Commons licensing                      ├── Commonomics                │
│  └── Data sovereignty                       └── IP ownership               │
│                                                                             │
│  HOLÓN 2: TRUST, IDENTITY & DATA       ← HSCSG + PROJECT WEAVE            │
│  ├── Gaia Passport / sCoRe                ├── Consent & revocation        │
│  ├── Data Trust                            └── Provenance                 │
│                                                                             │
│  HOLÓN 3: TECH & INTEROPERABILITY      ← MYCELIUM + SYNCHROLABS + HSCSG   │
│  ├── APIs/standards/protocols             ├── MCP                          │
│  ├── Distributed architecture              └── Graph sync                  │
│                                                                             │
│  HOLÓN 4: PRODUCT & UX                 ← GAIA NETWORK + PHI + HIVE IA     │
│  ├── Portal/onboarding                    ├── Market                       │
│  ├── Education                             └── AI Matching                │
│                                                                             │
│  HOLÓN 5: AI & ECOSYSTEM INTELLIGENCE  ← HIVE IA + HSCSG KERNEL + MYCELIUM│
│  ├── Agent-readable trusted claims        ├── Semantic search             │
│  ├── Knowledge graph                       └── Recommendations            │
│                                                                             │
│  HOLÓN 6: COMMUNITY & ACTIVATION       ← GAIA + MYCELIUM + PHI            │
│  ├── Stories/embassadors                  ├── Courses                      │
│  ├── Drip campaign                         └── Google Ad Grant            │
│                                                                             │
│  HOLÓN 7: FUNDING & VENTURE            ← GAIA + ALL HOLONES               │
│  ├── Unified portfolio                     ├── Verticals                   │
│  ├── RegenTrips                            └── Financial alliances        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. KPIs de Integración por Línea

| Línea | KPI Principal | Holón Responsable | Frecuencia |
|-------|---------------|-------------------|------------|
| A | % proyectos diagnosticados con match válido | GAIA + MYCELIUM | Mensual |
| B | # kits entregados + completion rate | PHI + MYCELIUM | Por cohorte |
| C | Revenue real + TQ medido + velocity ZNU | GAIA NETWORK + HSCSG | Mensual |
| D | # entrenadores certificados + αʰ post | HIVE IA + HSCSG Kernel | Por cohorte |
| E | Nodos operativos + TQ/kWh + gobernanza | HSCSG + DATA TRUST + COMMONS | Trimestral |

---

## 6. Referencias

- `GRAN_ALIANZA_POR_LA_VIDA.md` — Documento fuente
- `alrac-caas-revenue-streams.md` — Streams por línea
- `alrac-caas-membership.md` — Niveles membresía por horizonte
- `HSCSG_INTEGRATION_ARCHITECTURE.md` — Adaptadores técnicos
- `ZEITNUS_REGENERATIVE_MODEL.md` — Mapping video Samay