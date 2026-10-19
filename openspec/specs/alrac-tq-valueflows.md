// openspec/specs/alrac-tq-valueflows.md
// OpenSpec: ValueFlows REA Engine Implementation
// Maps: valueflows.org REA Ontology → TypeScript Implementation

# SPEC: alrac-tq-valueflows
**Version:** 1.0.0
**Status:** Implemented
**Source:** valueflows.org (VF Vocabulary, REA Ontology)
**Target:** src/core/lib/tq-valueflows.ts

---

## 1. ValueFlows Architecture (REA Ontology)

### 1.1 Core REA Entities

| Entity | Description | VF Type |
|--------|-------------|---------|
| Economic Agent | Person, Organization, Network, DAO, DisCO, DHO | `VF_EconomicAgent` |
| Economic Resource | Material, Energy, Service, Knowledge, Currency, Time, Land | `VF_EconomicResource` |
| Economic Event | Transfer, Process, Fulfillment, Observation, Claim | `VF_EconomicEvent` |
| Recipe | Production knowledge (inputs→outputs) | `VF_Recipe` |
| Process | Execution of recipe (planned→actual) | `VF_Process` |
| Economic Network | Container for agents, resources, events, governance | `VF_EconomicNetwork` |

### 1.2 Economic Event Types

| Type | Description | REA Equivalent |
|------|-------------|----------------|
| transfer | Resource moves between agents | Exchange |
| process | Transformation via recipe | Conversion |
| fulfillment | Commitment satisfied | Fulfillment |
| observation | Measurement recorded | Observation |
| claim | Right asserted | Claim |

### 1.3 Resource Categories (VF Vocabulary)

| Category | Code | Examples | Standard Units |
|----------|------|----------|----------------|
| material | MAT | food, materials, tools, seeds, compost | kg, tonne, liter, m³, pcs |
| energy | ENE | solar, wind, hydro, biomass, battery, grid | kWh, MWh, MJ |
| service | SVC | design, construction, education, healthcare, maintenance | hour, day |
| knowledge | KNO | documentation, software, research, training, protocols | hour |
| currency | CUR | ZNU, TQ, stablecoin, mutual-credit, timebank | ZNU, TQ |
| time | TIM | labor-hours, care-hours, governance-hours, learning-hours | hour, day |
| land | LND | agricultural, residential, conservation, commons, rewilding | ha, m² |

### 1.4 Standard Units Registry

```typescript
STANDARD_UNITS = {
  // Energy
  kWh: { category: 'energy', symbol: 'kWh', name: 'Kilowatt-hour' },
  MWh: { category: 'energy', symbol: 'MWh', name: 'Megawatt-hour' },
  MJ: { category: 'energy', symbol: 'MJ', name: 'Megajoule' },
  
  // Mass/Volume
  kg: { category: 'material', symbol: 'kg', name: 'Kilogram' },
  tonne: { category: 'material', symbol: 't', name: 'Metric tonne' },
  liter: { category: 'material', symbol: 'L', name: 'Liter' },
  m3: { category: 'material', symbol: 'm³', name: 'Cubic meter' },
  
  // Area
  ha: { category: 'land', symbol: 'ha', name: 'Hectare' },
  m2: { category: 'land', symbol: 'm²', name: 'Square meter' },
  
  // Time
  hour: { category: 'time', symbol: 'h', name: 'Hour' },
  day: { category: 'time', symbol: 'd', name: 'Day' },
  
  // Currency
  ZNU: { category: 'currency', symbol: 'ZNU', name: 'Zeitnus Unit' },
  TQ: { category: 'currency', symbol: 'TQ', name: 'Thermodynamic Quotient' },
  
  // Count
  unit: { category: 'material', symbol: 'pcs', name: 'Piece/Unit' },
  count: { category: 'material', symbol: '#', name: 'Count' },
}
```

---

## 2. CaaS Streams (Contribution as a Service)

### 2.1 Stream Configuration

| Parameter | Type | Description |
|-----------|------|-------------|
| contributorId | string | DID of contributor |
| networkId | string | VF Network ID |
| resourceId | string | Resource being streamed |
| ratePerPeriod | number | Quantity per period |
| period | hourly\|daily\|weekly\|monthly | Frequency |
| startTime | number | Unix timestamp |
| endTime | number? | Optional end |
| recipients | string[] | Agent IDs receiving stream |
| recipeId | string? | If stream follows recipe |
| raoCredentialId | string | RAO anchor |

### 2.2 Period Processing
- Hourly: 3,600,000 ms
- Daily: 86,400,000 ms
- Weekly: 604,800,000 ms
- Monthly: 2,592,000,000 ms

---

## 3. Recipe Templates (Production Knowledge)

### 3.1 Solar Production
```typescript
Inputs:  sunlight (1000 W/m²), panel (1 pc)
Outputs: electricity (200 Wh)  // 20% efficiency
Process: production, duration: 1 hour
```

### 3.2 Food Production (Regenerative)
```typescript
Inputs:  land (ha), seeds (50 kg), compost (5000 kg), water (500000 L), labor (200 h)
Outputs: crop (yield kg), biomass (0.3×yield kg)
Process: production, duration: 120 days
```

### 3.3 Compost Production
```typescript
Inputs:  organic_waste (1000 kg), structure (200 kg), labor (10 h)
Outputs: compost (600 kg), CO2 (200 kg)
Process: transformation, duration: 90 days
```

### 3.4 Water Harvesting
```typescript
Inputs:  rainfall (1000 mm), catchment (1000 m²), storage (100 m³)
Outputs: water (800 m³), recharge (200 m³)
Process: production, duration: 365 days
```

---

## 4. TypeScript Implementation Mapping

### 4.1 Core Engine: `ValueFlowsEngine`

#### Network Management
```typescript
createNetwork(network): VF_EconomicNetwork
getNetwork(id): VF_EconomicNetwork
listNetworks(): VF_EconomicNetwork[]
```

#### Agent Management
```typescript
registerAgent(agent): VF_EconomicAgent
getAgent(id): VF_EconomicAgent
```

#### Resource Management
```typescript
registerResource(resource): VF_EconomicResource
getResource(id): VF_EconomicResource
```

#### Recipe Management
```typescript
createRecipe(recipe): VF_Recipe
getRecipe(id): VF_Recipe
listRecipes(): VF_Recipe[]
```

#### Process Execution
```typescript
startProcess(process): VF_Process
executeProcess(processId, actualInputs, actualOutputs): VF_Process
completeProcess(processId): VF_Process
getProcess(id): VF_Process
```

#### Economic Events (Core Primitive)
```typescript
recordEvent(event): VF_EconomicEvent
getEvents(filters): VF_EconomicEvent[]
// Filters: agentId, resourceId, type, startTime, endTime
```

#### CaaS Streams
```typescript
createCaaSStream(stream): CaaSStream
processCaaSStreams(currentTime): VF_EconomicEvent[]
getCaaSStream(id): CaaSStream
```

#### TQ Ledger Sync
```typescript
syncWithTQLedger(tqTransactions: TQTransaction[]): number
// Maps TQ categories → VF categories, units
// Creates VF resources and events automatically
```

#### Reporting
```typescript
generateNetworkReport(networkId, period): {
  totalEvents, eventsByType, eventsByAgent,
  resourceFlows: { in, out, net },
  agentBalances
}
exportVFData(): { networks, agents, resources, events, recipes, processes, caasStreams }
```

---

## 5. TQ Ledger ↔ ValueFlows Mapping

### 5.1 Category Mapping
```typescript
mapTQCategoryToVF(category):
  food → material
  energy → energy
  materials → material
  services → service
  knowledge → knowledge
  governance → service
  care → service
  compute → service
  data → knowledge
  water → material
  land → land
```

### 5.2 Unit Mapping
```typescript
mapTQUnitToVF(category):
  food → kg
  energy → kWh
  materials → kg
  services → hour
  knowledge → hour
  governance → hour
  care → hour
  compute → hour
  data → GB
  water → liter
  land → m²
```

### 5.3 Sync Process
1. For each TQ transaction:
   - Check if already synced (by raoCredentialId)
   - Map category/unit
   - Create/get VF resource
   - Record VF Economic Event (type: process for production, transfer for consumption)
   - Update agent/resource balances

---

## 6. Integration Points

### 6.1 TQ Ledger (src/core/lib/tq.ts)
- `syncWithTQLedger()` called periodically
- RAO credentials anchor both systems
- Thermodynamic accounting (kWh) → VF energy category

### 6.2 DisCO CAT Engine
- 3 Flows → VF Economic Events
- Contributions → VF transfers
- ValueFlows recorded in CAT Transparency layer

### 6.3 Virginia Network
- N3 TQ production → VF energy events
- Vesting claims → VF currency transfers
- N3 weight computation uses VF resource balances

### 6.4 Snapshot Governance
- Proposal execution → VF process events
- Treasury operations → VF transfers
- Voting participation → VF service events

### 6.5 Closer Platform
- Village resource tracking → VF observations
- Booking revenue → VF transfers
- Ecological monitoring → VF observations

---

## 7. Acceptance Criteria

### 7.1 REA Core
- [ ] Economic Agents with types (person, org, dao, disco, dho)
- [ ] Economic Resources with 7 categories, standard units
- [ ] Economic Events with 5 types, full agent/resource links
- [ ] Recipes with inputs/outputs, process types
- [ ] Processes with planned/actual/variance tracking
- [ ] Networks with governance config

### 7.2 CaaS Streams
- [ ] Stream creation with all parameters
- [ ] Periodic processing generates events
- [ ] Multiple recipients supported
- [ ] Recipe-linked streams
- [ ] RAO anchoring per event

### 7.3 Recipe Templates
- [ ] Solar production (20% efficiency)
- [ ] Food production (configurable crop/yield/area)
- [ ] Compost production (90-day cycle)
- [ ] Water harvesting (80% capture efficiency)

### 7.4 TQ Sync
- [ ] Category mapping complete
- [ ] Unit mapping complete
- [ ] Deduplication by RAO credential
- [ ] Balance updates on both sides

### 7.5 Reporting
- [ ] Network report: events by type/agent, resource flows, agent balances
- [ ] Full data export for interoperability

---

## 8. Test Vectors

### 8.1 Solar Production Event
```typescript
Input: recordEvent({
  type: 'process',
  fromAgent: 'produced',
  toAgent: 'solar-farm-1',
  resource: { id: 'resource_electricity', category: 'energy', unit: 'kWh' },
  quantity: 500,
  unit: 'kWh',
  timestamp: now
})
Expected: VF event created, agent balance +500 kWh, resource available +500 kWh
```

### 8.2 CaaS Stream
```typescript
Input: createCaaSStream({
  contributorId: 'did:key:alice',
  networkId: 'network-main',
  resourceId: 'resource_tq_solar',
  ratePerPeriod: 100,
  period: 'daily',
  recipients: ['did:key:bob', 'did:key:carol']
})
After 2 days: processCaaSStreams()
Expected: 2 events per recipient (200 ZNU each), total 400 ZNU distributed
```

### 8.3 TQ Sync
```typescript
Input: TQTransaction[{ type: 'production', category: 'energy', quantity: 1000, unit: 'kWh', nodeId: 'farm-1' }]
Expected: VF event type='process', resource=energy/kWh, fromAgent='produced', toAgent='farm-1'
```

---

## 9. Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| `tq-types-extended` | 1.0.0 | Core types (VF_EconomicEvent, VF_Resource, etc.) |
| `tq` | 1.0.0 | TQTransaction for sync |
| `tq-disco-cat` | 1.0.0 | DisCO flow integration |

---

## 10. References

- ValueFlows Vocabulary: https://valueflows.org/vocabulary
- REA Ontology: https://github.com/valueflows/valueflows/blob/master/REA.md
- VF Specification: https://github.com/valueflows/valueflows
- BRIEF_EXHAUSTIVO_HSCSG_COSATECA_OS.md (Capa 2 Interoperability)

---

## 11. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-10-18 | Initial implementation: REA engine, CaaS streams, recipe templates, TQ sync, reporting |