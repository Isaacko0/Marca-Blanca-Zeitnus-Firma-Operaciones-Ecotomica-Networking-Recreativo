# Reglamento Fedeco — Integración Zeitnus (HSCSG v15 OS)

**Fuente**: `Downloads/Desktop/HSCSG dinero flores/Comunidad HSCSG v15 OS/Fedeco tq Reglamento Interno y Normas de Convivencia Comunitaria.md`  
**Autor/Colectivo**: Ecoaldea Comunitaria Agroecológica (Fedeco TQ)  
**Caracteres**: ~70K | **Artículos**: 44 + Disposiciones Transitorias  
**Fecha asimilación**: Octubre 2026

---

## Resumen Ejecutivo

Este reglamento es la **constitución operativa completa** de una ecoaldea federada real. No es teoría: es un documento vivo para debate, votación y entrada en vigor en asamblea. Define:

- **Gobernanza**: Asamblea suprema, Junta Directiva ejecutiva, Organizaciones/Departamentos, voto criptográfico Ed25519
- **Economía**: TQ = 1 kWh, límite simétrico, crédito mutuo saldo cero, prohibición cambiaria estricta, impuestos automáticos, fondo comunitario
- **Tenencia tierra**: Fideicomiso colectivo indivisible, usufructo habitacional familiar, 50-70% reserva ecológica
- **Convivencia**: 3 fases admisión, perfil cualitativo local (libre de sustancias / tolerancia regulada), justicia restaurativa + tolerancia cero violencia
- **Infraestructura**: Bioconstrucción obligatoria, energía renovable off-grid, intranet soberana, movilidad restringida
- **Servicios**: Salud, educación, cuidados, cementerio ecológico, mercado comunal TQ

**Relación con repos existentes:**
- `red-de-intercambio-federada-isaacko` = Implementación técnica Go/ESP32/YugabyteDB (nodo soberano real)
- `Zeitnus-Firma-Operaciones-Ecotomica` = Adaptación React/TypeScript/Zustand (HSCSG v15 OS) — **ESTE REPO**
- Este reglamento = **Fuente de verdad jurídico-operativa** para validar que el código implementa lo que la asamblea aprueba

---

## Mapeo Artículo → Código (Isomorfismo Reglamento ↔ Zeitnus ↔ Red Federada)

| Artículo | Concepto Reglamento | Red Federada (Go) | Zeitnus (TS/React) | Estado en Zeitnus |
|---|---|---|---|---|
| **Art 1-3** | Objeto, principios, articulación federada | `governance.md` + `federation.md` | `democracy.ts` + `symbiosky.ts` + `caas.ts` | ✅ Parcial |
| **Art 3A** | Autonomía Cualitativa (perfil local) | `federation.md` (Cap 12) | `nodeMode` + `boundaries.ts` | ✅ Parcial |
| **Art 3B** | Solidaridad inter-ecoaldeas (cayapa federada) | `federation.md` (Cap 19) | `crossNode.ts` + `trustlines.ts` | ❌ Falta |
| **Art 4-6** | Asamblea, Módulo Digital, Junta Directiva | `governance.md` (3 niveles) | `democracy.ts` + `symbiosky.ts` | ✅ Parcial (falta Board separation) |
| **Art 7** | Organizaciones/Depts + Multi-firma 3/3 | `governance.md` (Org/Dept) | `integral.ts` (CDS/OAD/ITC) + `colony.ts` | ❌ Falta multi-sig 3/3 |
| **Art 8-8D** | Derechos, visitantes, ruido, alcohol, tabaco | `governance.md` (Cap 13) | `vecinal.ts` + `boundaries.ts` | ✅ Parcial |
| **Art 9** | Deberes: cayapa 1 día, descanso 1 día, 5 días trabajo | `currency_exchange.md` (LaborFlow) | `life.ts` + `integral.ts` (labor logging) | ❌ Falta enforcement cayapa |
| **Art 10** | Prohibiciones: violencia, armas, químicos, especulación, venta suelo, ruido, mascotas, plásticos, fuego, luz | `governance.md` (Cap 13) | `boundaries.ts` (deny/allow lists) | ✅ Parcial |
| **Art 11-13** | Justicia restaurativa, clasificación faltas, expulsión debido proceso | `governance.md` + `kleros.md` | `kleros.ts` + `vecinal.ts` + `symbiosky.ts` | ✅ Parcial (falta vivienda transitoria) |
| **Art 13A** | Estructura departamentos operativos (12 depts) | `governance.md` (Cap 13) | `colony.ts` (dominios) + `integral.ts` | ❌ Falta mapeo 1:1 depts |
| **Art 14-14A** | 3 fases admisión + filtros cualitativos (antidoping) | `governance.md` (Cap 12) | `democracy.ts` (admisión) + `boundaries.ts` | ❌ Falta workflow 3 fases |
| **Art 15** | Salida voluntaria + finiquito TQ | `currency_exchange.md` (Cap 15) | `caas.ts` (payouts) + `vesting.ts` | ❌ Falta liquidación salida |
| **Art 16** | Límite simétrico + confianza progresiva | `currency_exchange.md` (Cap 8-10) | `store.ts` (ZNU limits) + `caas.ts` (tiers) | ✅ Parcial (falta simetría estricta floor=ceiling) |
| **Art 17** | Impuestos automáticos + tasa cero vulnerables | `currency_exchange.md` (Cap 15) | `caas.ts` (tax_rate per tier) | ✅ Parcial |
| **Art 17A** | Mercado comunal TQ + trueque físico | `federation.md` (Cap 20) | `solarpunk.ts` (offers/needs) | ❌ Falta espacio físico mercado |
| **Art 18** | Fideicomiso colectivo indivisible | `governance.md` (Cap 14) | `base.ts` (BaseMaterial.tierra_ha) | ❌ Falta CLT/Usufructo types |
| **Art 18A** | Retorno aporte inicial en TQ (1 TQ = 1 kWh) | `currency_exchange.md` (Cap 7) | `valueDual.ts` (nodeMode + priceParity) | ✅ Parcial (anfibio) |
| **Art 19** | Usufructo habitacional + sucesión familiar | `governance.md` (Cap 14) | `base.ts` + `types.ts` (Member) | ❌ Falta sucesión cabeza familia |
| **Art 20** | Reservas 50-70% predio | `governance.md` (Cap 14) | `base.ts` (tierra_ha tracking) | ❌ Falta enforcement % |
| **Art 21** | Bioconstrucción obligatoria + materiales prohibidos | `governance.md` (Cap 14) | `sovereignty.ts` (pilar Habitat) | ❌ Falta validación materiales |
| **Art 21A** | Carácter familiar vivienda + reversión | `governance.md` (Cap 14) | `base.ts` + `vesting.ts` | ❌ Falta |
| **Art 22-23** | Modelo regenerativo + tipos unidades productivas | `currency_exchange.md` (Cap 11) | `caas.ts` (streams) + `solarpunk.ts` | ❌ Falta bioinsumos/banco semillas |
| **Art 24-27** | Perfil ecoaldeano + jerarquías 4 niveles | `governance.md` (Cap 12) | `democracy.ts` + `learning.ts` | ❌ Falta niveles integración |
| **Art 28-30** | Cuidados intergeneracionales, agua/residuos, animales | `governance.md` (Cap 14) | `regen.ts` + `vecinal.ts` | ❌ Falta baños secos/biofiltros |
| **Art 30A-30B** | Comité emergencias + deber auxilio | `governance.md` (Cap 18) | `boundaries.ts` + `agentMesh.ts` | ❌ Falta |
| **Art 31-32** | Escuela comunitaria + vida cultural | `governance.md` (Cap 13) | `education.ts` + `learning.ts` | ✅ Parcial |
| **Art 32A-32D** | Intercambio cultural federado, ecoturismo, estudiantes, ecoestudiantes | `federation.md` (Cap 19) | `crossNode.ts` + `education.ts` | ❌ Falta |
| **Art 33-37** | Tolerancia cero violencia + expulsión inmediata + denuncia penal | `governance.md` + `kleros.md` | `kleros.ts` + `boundaries.ts` | ✅ Parcial (falta vivienda transitoria) |
| **Art 38-39** | Salud integral + entierro ecológico | `governance.md` (Cap 14) | `regen.ts` (SALU vector) | ❌ Falta dispensario/cementerio |
| **Art 40** | Educación gratuita obligatoria (kínder a superior) | `governance.md` (Cap 13) | `education.ts` | ❌ Falta niveles obligatorios |
| **Art 41** | Energía renovable + límites consumo por vivienda | `currency_exchange.md` (ENER vector) | `sovereignty.ts` (pilar Energy) | ❌ Falta medición kWh/vivienda |
| **Art 42** | Movilidad restringida vehículos combustión | `governance.md` (Cap 18) | `boundaries.ts` + `vecinal.ts` | ❌ Falta |
| **Art 43** | Intranet soberana + internet opcional personal | `federation.md` (Cap 18) | `nostrRelay.ts` + `agentMesh.ts` | ✅ Parcial |
| **Art 44** | Excepciones emergencia vehículos | `governance.md` (Cap 18) | `boundaries.ts` (allow emergency) | ❌ Falta |

---

## Contenido Crítico NO Implementado en Zeitnus (Gaps Prioritarios)

### 1. Workflow Admisión 3 Fases + Filtros Cualitativos
```typescript
// FALTA: src/core/lib/admissionWorkflow.ts
interface AdmissionPhase {
  phase: 'aspirante' | 'provisional' | 'pleno';
  durationDays: number;
  requirements: string[];
  mentorId?: string;
  evaluationCriteria: {
    laborPerformance: number;    // cayapas cumplidas
    communityAdaptation: number; // CNV, convivencia
    learningLevel: number;       // agroecología, bioconstrucción, TQ
    qualitativeFilter: boolean;  // antidoping si "Libre de Sustancias"
  };
}

interface AdmissionCandidate {
  id: string;
  name: string;
  currentPhase: AdmissionPhase;
  entryDate: number;
  sponsorId: string; // miembro que avala
  phaseHistory: AdmissionPhase[];
  toxicologyTest?: { passed: boolean; date: number }; // Art 14A
}
```

### 2. Estructura Departamentos Operativos (12 Depts - Art 13A)
```typescript
// FALTA: src/core/state/departments.ts
type DepartmentKey = 
  | 'agroecologia'           // 1. Conuco, biofábrica, banco semillas
  | 'agua_saneamiento'       // 2. Nacientes, baños secos, fitodepuración
  | 'energia_renovable'      // 3. Solar, hidro, biogás, baterías
  | 'habitat_bioconstruccion'// 4. Bahareque, bambú, vías permeables
  | 'salud_cuidados'         // 5. Botica viva, primeros auxilios, intergeneracional
  | 'educacion_cultura'      // 6. Escuela, Kiwix, celebraciones estacionales
  | 'informatica_intranet'   // 7. Servidor LAN, NFC/ESP32, Mesh, respaldos cripto
  | 'comercio_logistica'     // 8. Mercado comunal, catálogo TQ, maquinaria compartida
  | 'acogida_integracion'    // 9. Visitantes, voluntarios, aspirantes
  | 'convivencia_mediacion'  // 10. CNV, faltas, investigación, justicia restaurativa
  | 'emergencias_riesgos'    // 11. Incendios, cortafuegos, contingencias
  | 'inhumaciones_cementerio'; // 12. Entierro ecológico, registro digital + físico

interface Department {
  key: DepartmentKey;
  name: string;
  leadId: string;           // responsable (multi-sig 3/3 para fondos)
  members: string[];        // ecoaldeanos asignados
  budgetTQ: number;         // asignación fondo comunitario
  assemblyType: 'org' | 'dept'; // Organización Asamblea vs Departamento
  parentOrg?: DepartmentKey;    // jerarquía: Dept → Org → Asamblea
}
```

### 3. Cayapa Obligatorio (Art 9) — Enforcement Semanal
```typescript
// FALTA: src/core/lib/cayapaEnforcement.ts
interface CayapaSchedule {
  memberId: string;
  assignedDay: 0..6;           // día semana (0=domingo)
  completedWeeks: number[];    // semanas completadas (timestamp)
  missedWeeks: number[];       // semanas incumplidas → falta leve
  compensationHours: number;   // horas pendientes compensación
  exemption?: { reason: string; approvedBy: string; until: number };
}

interface CayapaEnforcement {
  // Art 9: "El día de cayapa puede ser consensuado y coordinado"
  assignDay: (memberId: string, day: 0..6) => void;
  // "Compensación de las horas de labor comunitaria no cumplidas"
  logCompletion: (memberId: string, week: number, hours: number) => void;
  // "Más de 3 amonestaciones en un trimestre = falta grave"
  checkCompliance: (memberId: string) => { 
    status: 'ok' | 'warning' | 'grave' | 'muy_grave';
    missedCount: number;
    compensationRequired: number;
  };
  // Art 9: "Empleador obligado a conceder 2 días libres: descanso + cayapa"
  validateEmployerCompliance: (employerId: string) => boolean;
}
```

### 4. Límite Simétrico Estricto (Art 16) — Floor === Ceiling SIEMPRE
```typescript
// FALTA en store.ts / symmetricLimits.ts
interface SymmetricLimits {
  // Art 16.1: "piso negativo y techo positivo tienen idéntico valor absoluto"
  floor: number;    // ej: -500 TQ (capacidad compra ética inicial)
  ceiling: number;  // ej: +500 TQ (límite anti-acaparamiento)
  // INVARIANTE: floor === -ceiling SIEMPRE
  
  // Art 16.2: "Parametrización por Asamblea"
  tiers: {
    aspirante:    { floor: -100,  ceiling: 100  };  // entrada
    provisional:  { floor: -500,  ceiling: 500  };  // integración
    pleno:        { floor: -1000, ceiling: 1000 };  // base
    proyecto:     { floor: -5000, ceiling: 5000 };  // aprobación asamblea
    organizacion: { floor: -100000, ceiling: 100000 }; // multi-firma
  };
  
  // Art 16.3: "Escalamiento requiere evaluación méritos + votación"
  requestLimitIncrease: (memberId: string, projectDescription: string) => 
    Promise<{ approved: boolean; newLimits: { floor: number; ceiling: number } }>;
}
```

### 5. Prohibición Cambiaria Estricta (Art 3c, 10e, 17A.2)
```typescript
// FALTA: src/core/lib/exchangeGuard.ts
// "Queda terminantemente vetado convertir o transar créditos TQ directamente por dinero fiduciario"

interface ExchangeGuard {
  // ÚNICOS caminos permitidos:
  // Fiat → Bienes Tangibles → TQ (ingreso)
  // TQ → Bienes Tangibles → Fiat (extracción)
  
  validateExchange: (from: 'TQ' | 'Fiat' | 'Crypto', to: 'TQ' | 'Fiat' | 'Crypto', 
                     viaTangibleGood: boolean) => { 
    allowed: boolean; 
    reason: string; 
    auditTrail: AuditEntry; 
  };
  
  // "Auditoría: expulsión permanente si violación" (Art 34e)
  logViolation: (memberId: string, details: string) => 
    Promise<{ expulsionTriggered: boolean }>;
}
```

### 6. Factor Conversión FC + DEX Puente Externo (Art 21, 18A)
```typescript
// FALTA: src/core/lib/conversionFactor.ts
// "Factor de Conversión (FC) basado en la canasta básica para comerciar con mercado fiat por extrema necesidad"

interface ConversionFactor {
  // Canasta básica federada (constante, solo cambia por consenso)
  basicBasketTQ: 500;        // TQ fijos
  basicBasketFiat: {         // configurable por nodo
    USD: 300;
    EUR: 280;
    VES: 12000000;           // ejemplo Venezuela
  };
  
  // FC = basicBasketTQ / basicBasketFiat[moneda]
  getFC: (fiatCurrency: string) => number;
  
  // DEX: Exportar bienes por fiat / Importar bienes por TQ
  exportGoodsForFiat: (goods: TangibleGood[], fiatCurrency: string) => 
    { fiatAmount: number; tqDeducted: number; fcUsed: number };
  importGoodsForTQ: (goods: TangibleGood[], fiatCurrency: string) => 
    { tqCredited: number; fiatCost: number; fcUsed: number };
  
  // Auditoría precio real vs FC
  auditExternalPrice: (good: string, marketPriceFiat: number, fiatCurrency: string) => 
    { deviation: number; alert: boolean };
}
```

### 7. Federación Productos + Filtro Soberano (Art 20, 13A.8)
```typescript
// FALTA: src/core/lib/productFederation.ts
// "Cada comunidad debe aprobar productos foráneos antes de venderse en su mercado local"

interface ProductFederation {
  // ProductProposal broadcast via Gossip
  proposeProduct: (product: ProductProposal) => void;
  
  // Asamblea local aprueba/rechaza
  localAssemblyVote: (productId: string, vote: 'approve' | 'reject') => void;
  
  // Verificación compuesto: TODOS ingredientes deben estar aprobados
  verifyCompositeProduct: (product: CompositeProduct) => 
    { approved: boolean; rejectedIngredients: string[] };
  
  // Filtros automáticos vegano/higienista
  autoFilters: {
    vegan: boolean;
    hygienist: boolean;  // sin químicos sintéticos
    gmoFree: boolean;
  };
  
  // Catálogo local resultante
  localCatalog: ApprovedProduct[];
}

interface ProductProposal {
  id: string;
  originNode: string;
  name: string;
  ingredients: Ingredient[];  // cada uno con su approval status
  energyCostTQ: number;       // del catálogo energético (ICE/Ecoinvent)
  certifications: string[];   // orgánico, biodinámico, etc.
  proposedBy: string;
  ts: number;
}
```

### 8. Piscinas Separadas Cross-Node (Art 3B, 19 Cap Libro)
```typescript
// FALTA: src/core/lib/crossNodePools.ts
// "Límites globales del nodo, límites bilaterales y piscinas separadas de deuda"

interface CrossNodePools {
  // Piscina global: multilateral, sin filtro counterpart_node
  globalPool: {
    creditLimit: number;      // límite global nodo
    currentDebit: number;
    currentCredit: number;
    members: string[];        // nodos federados en pool global
  };
  
  // Piscinas bilaterales: Map<nodePair, {credit, debit, limit}>
  bilateralPools: Map<string, {  // key: "nodeA:nodeB" (ordenado alfabéticamente)
    creditLimit: number;
    currentDebit: number;   // nodeA debe a nodeB
    currentCredit: number;  // nodeB debe a nodeA
    lastSettlement: number;
  }>;
  
  // Routing: si bilateral activa → bilateral, sino → global
  routeTransaction: (fromNode: string, toNode: string, amount: number) => 
    'bilateral' | 'global' | 'blocked';
  
  // Aislamiento: deuda en NodeA pool ≠ afecta NodeB pool
  isolateRisk: (nodeId: string) => void;  // cerrar piscinas con nodo problemático
}
```

### 9. Gobernanza 3 Niveles + Voto Criptográfico (Art 4, 5, 6)
```typescript
// PARCIAL en democracy.ts / symbiosky.ts — FALTA:
interface Governance3Levels {
  // Nivel 1: Asamblea General (estructural) - Art 4
  generalAssembly: {
    quorum: number;           // % miembros plenos requeridos
    thresholds: {
      regular: 0.51;          // mayoría simple gestión regular
      statutory: 0.75;        // modificaciones estatutarias
      expulsion: 0.85;        // Art 13.2: supermayoría 85%+
      federation: 0.90;       // convenios federados
    };
    // Voto criptográfico Ed25519 - Art 5.2
    vote: (proposalId: string, memberId: string, signature: Ed25519Signature) => void;
    // NO consentimiento pasivo - Art 5.2
  };
  
  // Nivel 2: Asambleas Organización (presupuesto) - Art 7.1
  orgAssemblies: Map<DepartmentKey, {
    members: string[];        // todos son miembros auto
    budgetAuthority: boolean;
    approveBudget: (budget: Budget) => void;
  }>;
  
  // Nivel 3: Asambleas Departamento (técnico) - Art 7.2
  deptAssemblies: Map<DepartmentKey, {
    members: string[];        // solo asignados al dept
    internalPolicy: boolean;  // sin potestad sobre asuntos privativos ecoaldea
  }>;
  
  // Junta Directiva (Art 6) - meeting_type = board
  board: {
    members: string[];        // directivos activos
    quorum: number;           // calculado SOBRE directivos (no toda comunidad)
    meetingType: 'board';
    executeBudget: (approvedBudget: Budget) => void;
  };
  
  // Multi-firma obligatorio 3/3 - Art 7.3
  multiSig: {
    requiredSigners: 3;
    authorizedBy: 'assembly';
    signTransfer: (fromAccount: string, toAccount: string, amount: number, 
                   signatures: Ed25519Signature[]) => boolean;
  };
}
```

### 10. Tenencia Tierra CLT/Usufructo + Sucesión Familiar (Art 18, 19, 21A)
```typescript
// FALTA: src/core/state/land.ts
type LandTenureType = 'CLT' | 'Usufruct' | 'Coop' | 'Family';

interface LandParcel {
  id: string;
  hectares: number;
  tenureType: LandTenureType;
  // CLT: indivisible, inalienable, 99yr hereditary lease
  // Usufruct: reverts to community on exit (Art 19.2)
  // Coop: share = parcela, buyback at TQ effort value (no speculation)
  // Family: private property on FRUITS OF LABOR (house, tools, harvest, animals)
  
  assignedFamily: string[];   // miembros núcleo familiar
  headOfFamily: string;       // representante formal asamblea/sistema
  
  // Art 21A: Sucesión cabeza familia
  succession: {
    spouse?: string;          // cónyuge/pareja supérstite (prioridad a)
    children: string[];       // hijos convivientes (prioridad b)
    newHeadDuties: string[];  // compromisos ratificados ante asamblea
  };
  
  // Art 21A.3: Supuestos exclusivos reversión
  reversionTriggers: {
    soleResidentDeceased: boolean;     // a) habitante único fallece sin familia
    voluntaryAbandonment: boolean;     // b) familia decide no integrarse/marcharse
  };
  
  // Art 21A.4: Bienes muebles en reversión
  movableAssets: MovableAsset[];  // retirables/tasables por herederos
  
  // Bioconstrucción: memoria técnica + aprobación asamblea + cayapa colectiva (Art 21.4)
  construction: {
    technicalMemo: string;
    approvedByAssembly: boolean;
    builtByCayapa: boolean;     // trabajo colectivo no remunerado TQ
    materials: Material[];      // validados Art 21.2-3
  };
}
```

### 11. Justicia Restaurativa + Tolerancia Cero + Vivienda Transitoria (Art 11-13, 33-37)
```typescript
// PARCIAL en kleros.ts / vecinal.ts / boundaries.ts — FALTA:

interface JusticeSystem {
  // Art 11: Enfoque restaurativo prioritario (CNV, mediación)
  restorative: {
    mediationCommittee: string[];  // Dept Convivencia
    cnyProcess: (conflict: Conflict) => 
      { agreement: string; repairPlan: RepairAction[]; followUpDate: number };
    circles: ListeningCircle[];    // Comunicación No Violenta
  };
  
  // Art 12: Clasificación faltas
  offenses: {
    leve: {
      examples: ['inasistencia cayapa/asamblea', 'descuido herramientas', 'horarios mascotas'];
      measure: 'conversación reflexiva + amonestación verbal + compensación horas';
    };
    grave: {
      examples: ['reincidencia 3+ leves/trimestre', 'daño infraestructura vital negligencia', 
                 'químicos no autorizados', 'intimidación/difamación', 'débitos TQ sin intención aporte'];
      measure: 'amonestación escrita + suspensión crédito + restricción maquinaria + plan reparación';
    };
    muy_grave: {  // Art 12.3 = Art 34 causales expulsión inmediata
      examples: ['agresión física grave', 'violencia género', 'abuso sexual/menores', 
                 'crueldad animal', 'narcotráfico', 'hurto/malversación', 
                 'sabotaje agua/energía/comms', 'extracción recursos especulativa',
                 'negativa persistente mediación'];
      measure: 'EXPULSIÓN DEFINITIVA (Art 35)';
    };
  };
  
  // Art 13: Procedimiento expulsión debido proceso
  expulsionProcess: {
    instruction: (accusedId: string, evidence: Evidence[]) => 
      { commission: string[]; accusedRights: ['access_evidence', 'formal_defense', 'community_hearing'] };
    vote: (proposalId: string) => 
      { threshold: 0.85; exclude: [accusedId, accuserId]; method: 'Ed25519' };
    effects: {
      deactivateAccounts: boolean;      // cuentas + tarjetas cripto
      revokeUsufruct: boolean;          // derecho habitacional
      immediateEviction: boolean;       // desalojo vivienda predio
      // "NO lanzado a vía pública" - Art 13.3
      transitionalHousing: {
        location: 'outside_perimeter';
        collective: true;
        maxStayDays: number;            // "plazo prudencial perentorio fijado por Asamblea"
        noIndefiniteStay: boolean;      // prohibido establecerse indefinidamente
        noReentry: boolean;             // prohibido reingresar espacios internos
      };
    };
    // Art 35.2: Denuncia penal OBLIGATORIA
    mandatoryCriminalReport: (crime: string) => 
      { filed: boolean; authorities: string[]; evidenceTransferred: boolean };
  };
  
  // Art 36: Revocatoria usufructo + compensación
  liquidation: {
    transferToCommunity: boolean;
    deductPriorities: ['repair_damages', 'legal_costs', 'victim_compensation'];
    remainderToExpelled: boolean;
  };
}
```

### 12. Mercado Comunal Físico + Trueque (Art 17A)
```typescript
// FALTA: src/app/screens/Marketplace.tsx + src/core/lib/marketplace.ts
interface CommunalMarket {
  // "Espacio físico central acondicionado"
  physicalLocation: string;
  marketDays: string[];           // ej: ['sábado', 'miércoles']
  
  // "Transacciones estrictamente TQ o trueque directo producto por producto"
  exchangeMechanisms: ('TQ' | 'direct_barter')[];
  
  // "Prohibición absoluta dinero fiduciario"
  fiatProhibited: true;
  
  // "Coordinación días, orden puestos, evitar chatarra"
  coordinator: string;            // Dept Comercio/Logística
  stallAssignment: Map<string, string>;  // memberId → stallId
  qualityControl: (item: SecondHandItem) => 
    { useful: boolean; operational: boolean; notScrap: boolean };
  
  // Catálogo precios energéticos TQ (Art 17A + Art 11 libro)
  energyCatalog: EnergyCatalogEntry[];
}
```

### 13. Bioconstrucción + Validación Materiales (Art 21)
```typescript
// FALTA: src/core/lib/bioconstructionValidator.ts
interface BioconstructionValidator {
  // Art 21.1: Estándares bioclimáticos obligatorios
  validateBioclimatic: (design: BuildingDesign) => 
    { passiveVentilation: boolean; solarOrientation: boolean; minTerrainImpact: boolean };
  
  // Art 21.2: Materiales permitidos/fomentados
  allowedMaterials: {
    earth: ['bahareque', 'adobe', 'tapia_pisada', 'BTC'];
    wood: ['certified_sustainable'];
    bamboo: ['guadua', 'bambú'];
    stone: ['local'];
    lime: ['viva_revoques', 'pinturas_minerales'];
    insulation: ['vegetable_fibers'];
    finishes: ['vegetable_oils'];
    // Pragmático: polímeros reciclables larga vida (PEAD, PVC rígido calidad)
    // SOLO infraestructuras hidráulicas/sanitarias esenciales
    pragmatic: {
      PEAD: 'hydraulic_sanitary_only';
      PVC_rigid: 'hydraulic_sanitary_only';
      PE_irrigation: 'agricultural_preferred';  // PEAD negro UV
    };
  };
  
  // Art 21.3: Materiales ESTRICTAMENTE PROHIBIDOS
  prohibitedMaterials: {
    asbestos: true;
    synthetic_paints_COV_heavy_metals: true;
    non_biodegradable_foams: true;      // poliuretano expandido aerosol
    polystyrene_contact_living: true;
    burn_PVC_plastics: true;            // prohibida quema restos
    bare_zinc_roof_no_insulation: true;
    portland_cement: 'structural_foundations_only';  // restrictivo
  };
  
  // Art 21.4: Proyecto → Memoria técnica → Dept Hábitat → Asamblea → Cayapa colectiva
  approveProject: (project: ConstructionProject) => 
    { requiresAssemblyApproval: boolean; cayapaLabor: boolean; noTQPayment: boolean };
}
```

### 14. Energía: Límites Consumo por Vivienda (Art 41)
```typescript
// FALTA: src/core/lib/energyLimits.ts
// "TQ = 1 kWh → límites máximos consumo eléctrico por vivienda para proteger baterías/red"

interface EnergyLimits {
  // Por vivienda (configurable por asamblea)
  maxKwhPerDwellingPerDay: number;    // ej: 5 kWh/día
  maxKwhPerDwellingPerMonth: number;  // ej: 150 kWh/mes
  
  // Prohibidos sin evaluación/autorización dept energía
  prohibitedHighConsumption: [
    'conventional_AC',
    'electric_ovens',
    'high_voltage_thermal_resistance'
  ];
  
  // Medición real (smart meter ESP32 por vivienda)
  measureConsumption: (dwellingId: string) => 
    { currentKwh: number; limit: number; percentage: number; alert: boolean };
  
  // Protección bancos baterías + red común
  gridProtection: {
    batteryReserveThreshold: number;  // % mínimo reserva
    loadShedding: (priority: 'essential' | 'comfort' | 'luxury') => void;
  };
}
```

### 15. Intranet Soberana + Internet Opcional Personal (Art 43)
```typescript
// PARCIAL en nostrRelay.ts / agentMesh.ts — FALTA:
interface SovereignIntranet {
  // Art 43.1: "No ofrece internet comercial público abierto de manera general"
  // "Intranet Comunitaria Soberana privada: educación, gobernanza, comunicación local"
  services: {
    kiwixLibrary: boolean;           // bibliotecas offline
    governanceModule: boolean;       // votación, actas
    tqExchange: boolean;             // sistema intercambio
    federatedSocial: boolean;        // protocolos federados (Nostr/Matrix/XMPP)
    meshNetwork: boolean;            // LoRa/WiFi/BLE comunidad
  };
  
  // Art 43.3: Sostenimiento intranet
  maintenanceFee: {
    type: 'free' | 'fixed_monthly_TQ';  // cuota módica en TQ
    amount: number;
    purpose: 'routers_servers_mesh_only';
  };
  
  // Art 43.4: Internet externo = opcional + personal
  externalInternet: {
    optional: true;
    personalCost: true;              // costeado por interesado/a título personal
    noCommunitySubsidy: true;
  };
  
  // Art 43.5: Salud electromagnética
  emfProtection: {
    antennaMinDistanceFromDwellings: number;  // metros prudenciales
    wifiPowerLimit: number;                   // dBm máximo habitacional
    wiredPreference: true;                    // cableado preferido en dormitorios
  };
}
```

### 16. Intercambio Cultural Federado Simétrico (Art 32A)
```typescript
// FALTA: src/core/lib/federatedExchange.ts
// "Reciprocidad Simétrica: uno por uno (10 personas Venezuela → 10 personas España simultáneo)"

interface FederatedCulturalExchange {
  // Exclusivo ecoaldeanos PLENOS (no ecoturismo, no voluntariado, no admisión)
  participants: {
    sendingNode: string;
    receivingNode: string;
    count: number;              // idéntico en ambos sentidos
    members: string[];          // ecoaldeanos plenos
  };
  
  // Propósito: inmersión cultura local, siembra, bioconstrucción, gobernanza, oficios
  learningObjectives: string[];
  
  // Duración: 1-3 meses, fecha retorno fija
  duration: {
    months: 1..3;
    fixedReturnDate: number;
  };
  
  // Integración: cumplir normas locales + cayapas aldea anfitriona
  // A cambio: hospedaje + alimentación + necesidades básicas (crédito local, sin fiat)
  hostObligations: {
    housing: true;
    food: true;
    basicNeeds: true;
    paymentMethod: 'local_credit_only';
  };
}
```

---

## Plan de Integración (Orden de Prioridad)

| Fase | Tarea | Archivos Zeitnus | Esfuerzo | Valor | Artículos Reglamento |
|------|-------|------------------|----------|-------|---------------------|
| **P0** | Workflow Admisión 3 Fases + Filtros | `admissionWorkflow.ts`, `Democracy.tsx` | 3 | 95 | 14, 14A |
| **P0** | Estructura 12 Departamentos + Multi-sig 3/3 | `departments.ts`, `colony.ts`, `Governance.tsx` | 3 | 95 | 7, 13A |
| **P0** | Cayapa Enforcement Semanal | `cayapaEnforcement.ts`, `Life.tsx` | 2 | 90 | 9 |
| **P0** | Límite Simétrico Estricto (floor=-ceiling) | `symmetricLimits.ts`, `store.ts` | 2 | 95 | 16 |
| **P0** | Exchange Guard (Prohibición Cambiaria) | `exchangeGuard.ts`, `valueDual.ts` | 2 | 95 | 3c, 10e, 17A.2 |
| **P1** | Factor Conversión FC + DEX | `conversionFactor.ts`, `SoberaniaCredito.tsx` | 3 | 90 | 18A, 21 |
| **P1** | Federación Productos + Filtro Soberano | `productFederation.ts`, `ProductFederation.tsx` | 2 | 90 | 20, 13A.8 |
| **P1** | Piscinas Cross-Node Separadas | `crossNodePools.ts`, `CrossNode.tsx` | 2 | 90 | 3B, 19 |
| **P1** | Gobernanza 3 Niveles + Voto Crypto + Board | `governance.ts`, `Governance.tsx` | 3 | 90 | 4, 5, 6, 7 |
| **P2** | Tenencia Tierra CLT/Usufructo + Sucesión | `land.ts`, `BaseMaterial.tsx` | 3 | 85 | 18, 19, 21A |
| **P2** | Justicia Restaurativa + Vivienda Transitoria | `justice.ts`, `Kleros.tsx` + `Vecinal.tsx` | 3 | 85 | 11-13, 33-37 |
| **P2** | Bioconstrucción Validator + Materiales | `bioconstructionValidator.ts`, `Sovereignty.tsx` | 2 | 85 | 21 |
| **P2** | Energía Límites kWh/Vivienda + Medición | `energyLimits.ts`, `Sovereignty.tsx` (Energy) | 2 | 85 | 41 |
| **P2** | Mercado Comunal Físico + Trueque | `marketplace.ts`, `Marketplace.tsx` | 2 | 80 | 17A |
| **P2** | Intercambio Cultural Federado Simétrico | `federatedExchange.ts`, `GaiaUnion.tsx` | 2 | 80 | 32A |
| **P2** | Intranet Soberana Completa + EMF | `nostrRelay.ts`, `agentMesh.ts`, `NodeInfra.tsx` | 3 | 80 | 43 |
| **P3** | Educación Gratuita Niveles Obligatorios | `education.ts`, `Educacion.tsx` | 2 | 75 | 40 |
| **P3** | Salud/Dispensario + Cementerio Ecológico | `regen.ts` (SALU), `Vecinal.tsx` | 2 | 75 | 38, 39 |
| **P3** | Movilidad Restringida + Excepciones Emergencia | `boundaries.ts`, `Vecinal.tsx` | 1 | 70 | 42, 44 |
| **P3** | Animales + Fauna Silvestre | `regen.ts`, `Vecinal.tsx` | 1 | 70 | 30 |

---

## Archivos de Documentación a Crear/Actualizar

1. `docs/fedeco_reglamento_integration.md` (este documento)
2. `docs/ADMISSION_WORKFLOW_SPEC.md` (3 fases + filtros cualitativos + antidoping)
3. `docs/DEPARTMENTS_STRUCTURE_SPEC.md` (12 depts + multi-sig 3/3 + jerarquía)
4. `docs/CAYAPA_ENFORCEMENT_SPEC.md` (obligatorio semanal + empleadores + compensación)
5. `docs/SYMMETRIC_LIMITS_SPEC.md` (floor=-ceiling + confianza progresiva + escalamiento)
6. `docs/EXCHANGE_PROHIBITION_SPEC.md` (guard + auditoría + expulsión violación)
7. `docs/CONVERSION_FACTOR_DEX_SPEC.md` (FC canasta + DEX bienes tangibles)
8. `docs/PRODUCT_FEDERATION_SPEC.md` (propuesta + asamblea local + filtro soberano + compuesto)
9. `docs/CROSS_NODE_POOLS_SPEC.md` (global/bilateral + routing + aislamiento riesgo)
10. `docs/GOVERNANCE_3LEVELS_SPEC.md` (asamblea general/org/dept + board + multi-sig + voto Ed25519)
11. `docs/LAND_TENURE_SPEC.md` (CLT/Usufructo/Coop/Family + sucesión familiar + reversión)
12. `docs/BIOCONSTRUCTION_VALIDATOR_SPEC.md` (materiales permitidos/prohibidos + memoria técnica)
13. `docs/ENERGY_LIMITS_SPEC.md` (kWh/vivienda + medición ESP32 + protección baterías)
14. `docs/JUSTICE_RESTORATIVE_SPEC.md` (CNV + clasificación faltas + expulsión + vivienda transitoria + denuncia penal)
15. `docs/MARKETPLACE_COMMUNAL_SPEC.md` (espacio físico + TQ/trueque + prohibición fiat + control calidad)
16. `docs/FEDERATED_EXCHANGE_SPEC.md` (simétrico 1:1 + inmersión + cayapa anfitriona)
17. `docs/SOVEREIGN_INTRANET_SPEC.md` (servicios locales + cuota TQ + internet personal + EMF)
18. `docs/MOVILITY_EMERGENCY_SPEC.md` (restricción combustión + excepciones vitales)

---

## Próximos Pasos Inmediatos

1. **Crear specs** (documentos arriba) en `docs/`
2. **Implementar P0** (admissionWorkflow + departments + cayapaEnforcement + symmetricLimits + exchangeGuard)
3. **Wire en store.ts** (imports, state slices, actions, partialize)
4. **Crear screens** para cada módulo nuevo (`Admission.tsx`, `Departments.tsx`, `Cayapa.tsx`, `Governance.tsx`, `Land.tsx`, `Justice.tsx`, `Marketplace.tsx`, `Bioconstruction.tsx`, `EnergyLimits.tsx`, `CrossNode.tsx`, `FederatedExchange.tsx`, `NodeInfra.tsx`)
5. **Actualizar App.tsx + Aside.tsx + i18n.ts** (nuevas rutas + navegación + español)
6. **Verificar**: `npx tsc --noEmit` + `npm run build` + `curl 200` en nuevas rutas
7. **Commit + push** con mensaje referenciando reglamento Fedeco como fuente

---

## Nota Final

> **Este reglamento no es documentación de apoyo. ES LA CONSTITUCIÓN OPERATIVA VINCULANTE.**
> 
> Cada artículo = una invariante o módulo en código. Cada prohibición = una regla en `boundaries.ts` (deny list). Cada derecho = una acción en store. Cada procedimiento = un workflow en lib.
> 
> La "única regla inquebrantable" del Libro Ecoaldeas Federadas (1 TQ = 1 kWh + prohibición cambiaria + límite simétrico) = invariantes blindadas en `vitalTimeInvariants.ts` / `exchangeGuard.ts` / `symmetricLimits.ts`.
> 
> **La implementación incompleta no es deuda técnica. Es incumplimiento del pacto soberano de convivencia que la asamblea aprobó.**

---

*Integración creada: Octubre 2026*  
*Fuente: Reglamento Interno y Estatutos de Convivencia Comunitaria - Ecoaldea Comunitaria Agroecológica (Fedeco TQ)*  
*Repo destino: Zeitnus-Firma-Operaciones-Ecotomica (HSCSG v15 OS)*