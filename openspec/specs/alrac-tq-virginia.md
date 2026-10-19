// openspec/specs/alrac-tq-virginia.md
// OpenSpec: Virginia Network Gateway Integration
// Maps: Virginia Network (N1/N2/N3) → TypeScript Implementation
// Solarpunk Utopia Integration: Solar mesh, regenerative infrastructure, community autonomy

# SPEC: alrac-tq-virginia
**Version:** 1.0.0
**Status:** Implemented
**Source:** BRIEF_EXHAUSTIVO_HSCSG_COSATECA_OS.md, Virginia Network docs
**Target:** src/core/lib/tq-virginia.ts
**Solarpunk Utopia Context:** Solar mesh networks, energy sovereignty, regenerative villages

---

## 1. Virginia Network Architecture

### 1.1 Three-Layer Hierarchy

| Layer | Name | Purpose | Weight Source | Solarpunk Utopia Mapping |
|-------|------|---------|---------------|--------------------------|
| N1 | Root Domain | Network governance, constitution | Fixed (1.0) | Solar Commons Charter |
| N2 | Sub Domains | Coordination, CDS, reputation | Peer verification | Bioregional Councils |
| N3 | Project Domains | TQ/ZNU generation, vesting | Dynamic (6 factors) | Solar Villages / Mesh Nodes |

### 1.2 N3 Dynamic Weight Formula

```typescript
N3Weight = f(
  TQ_Generated_kWh (verified),      // 60% - thermodynamic production
  AUT_Milestones (verified),        // 20% - autonomy milestones
  Peer_Verification (Bread),        // 10% - N2 peer consensus
  Urbanika_Factor (CDS×AUT),        // 5% - social cohesion × autonomy
  Colony_Reputation,                // 3% - on-chain reputation
  Vesting_Progress                  // 2% - Berry schedule completion
)
```

### 1.3 Solarpunk Utopia Integration Points

| Virginia Component | Solarpunk Utopia Equivalent | Integration |
|-------------------|----------------------------|-------------|
| N1 Root Domain | Solar Commons Charter | Constitutional governance of solar mesh |
| N2 Bioregional Councils | Bioregional Assemblies | CDS-weighted coordination |
| N3 Solar Villages | Regenerative Settlements | TQ production = solar kWh |
| TQ Ledger | Energy Accounting | Thermodynamic kWh tracking |
| Berry Vesting | Community Investment | Gradual ZNU release for infrastructure |
| DHO Federation | Mesh Network Federation | Inter-village resource sharing |

---

## 2. Berry Vesting Schedule (ZNU Gradual Release)

### 2.1 Schedule Structure
```typescript
interface VestingState {
  schedule: VestingTranche[]
  beneficiary: string | null
  claimed: number
  beneficiarySetDeadline: number
  ownerRenounced: boolean
}

interface VestingTranche {
  id: string
  ts: number              // Unlock timestamp
  amountZNU: number       // Tokens in this tranche
  claimed: boolean
}
```

### 2.2 Standard Schedule (7 Tranches, 42 Months)

| Tranche | Months | % | AUT Milestone | Solarpunk Utopia Use Case | Pot Unlocked |
|---------|--------|---|---------------|---------------------------|--------------|
| 1 | 6 | 10% | 1: Basic infra (5k kWh) | Solar array + battery | Emergency, Operations |
| 2 | 12 | 15% | 2: Regenerative systems (15k) | Water harvesting + compost | Development |
| 3 | 18 | 15% | 3: Energy sovereignty (30k) | Microgrid + storage | Ecosystem |
| 4 | 24 | 20% | 4: Food sovereignty (50k) | Agroforestry + cold storage | Governance |
| 5 | 30 | 15% | 5: Water sovereignty (75k) | Aquifer recharge + wetlands | Strategic |
| 6 | 36 | 15% | 6: Full regenerative (100k) | Bioregional export | Sovereign |
| 7 | 42 | 10% | 7: Intergenerational (150k) | 7-generation trust | Legacy |

---

## 3. DisCO + DHO Integration

### 3.1 DisCO 3 Flows → Virginia Layers
```typescript
DISCO_FLOW_TO_VIRGINIA = {
  livelihood: 'N3',  // TQ/ZNU generation → Solar production
  love: 'N2',        // Coordination/CDS → Bioregional governance
  care: 'N1'         // Autogestión/Urbanika → Community care
}
```

### 3.2 DHO Node Structure (Solarpunk Village)
```typescript
interface DHO_Node {
  id: string                          // DID (ERC-8004)
  name: string                        // Village name
  dhoPhase: 'emergent' | 'consolidated' | 'mature' | 'federated'
  flows: { livelihood, love, care }   // DisCO contributions
  cat: DisCO_CAT                      // Trust/Assembly/Transparency
  federation: {
    parentDHOId?: string
    childDHOIds: string[]
    federationTreaty?: FederationTreaty
    sharedTreasury?: SharedTreasury
    raoSync: boolean
  }
  virginiaMapping: VirginiaColonyMapping
  metrics: { members, flows, decisions, transparency, federationHealth }
  solarMetrics: {                    // Solarpunk Utopia extension
    solarCapacityKw: number
    batteryStorageKwh: number
    energyExportedKwh: number
    waterTableDepthM: number
    biodiversityIndex: number
  }
}
```

### 3.3 Federation Treaty (Solarpunk Mesh)
```typescript
interface FederationTreaty {
  signatories: string[]               // DIDs
  terms: {
    resourceSharing: boolean          // Energy, water, food
    governanceAlignment: boolean      // CDS/RAO
    mutualAid: boolean                // Disaster response
    disputeResolution: 'consent' | 'mediation' | 'arbitration'
    energyTrading: boolean            // P2P solar trading
    seedSharing: boolean              // Genetic diversity
  }
  raoCredentialIds: string[]
}
```

---

## 4. Virginia Gateway Interface

### 4.1 Base Gateway (Vesting + Weight)
```typescript
interface VirginiaVestingGateway {
  n3NodeId: string
  vestingState: VestingState
  vestingSchedule: VestingTranche[]
  claimedZNU: number
  autMilestones: AUTMilestone[]
  peerVerification: PeerVerification
  urbanikaFactor: UrbanikaFactor

  // DisCO integration
  recordContribution(flow, value, desc): Promise<void>
  processConsentDecision(decision): Promise<void>
  syncTransparency(): Promise<void>

  // Federation
  federateWith(otherDHO, treaty): Promise<void>
  syncRAO(): Promise<void>
  shareTreasury(potId, amount): Promise<void>

  // Core methods
  canClaimVesting(): boolean
  claimVesting(): Promise<ClaimResult>
  computeN3Weight(): number
}
```

### 4.2 Extended Gateway (DisCO + DHO + Solarpunk)
```typescript
interface VirginiaDisCOGateway extends VirginiaVestingGateway {
  discoCAT: DisCO_CAT
  discoFlows: Map<DisCOFlowType, DisCOContribution[]>
  dhoNode: DHO_Node
  dhoPhase: 'emergent' | 'consolidated' | 'mature' | 'federated'
  solarMetrics: {
    solarCapacityKw: number
    batteryStorageKwh: number
    energyExportedKwh: number
    waterTableDepthM: number
    biodiversityIndex: number
  }
}
```

---

## 5. Supporting Types

### 5.1 AUT Milestone
```typescript
interface AUTMilestone {
  id: string
  description: string
  targetTQKwh: number
  actualTQKwh: number
  verified: boolean
  verifiedBy: string[]              // N2 peer DIDs
  verifiedAt: number
  raoCredentialId: string
}
```

### 5.2 Peer Verification (Bread Output)
```typescript
interface PeerVerification {
  votingN2Nodes: string[]
  positiveVotes: number
  totalVotes: number
  consensusWeight: number           // 0-1
  quorumMet: boolean                // ≥3 N2 voters
}
```

### 5.3 Urbanika Factor
```typescript
interface UrbanikaFactor {
  cds: number       // Social cohesion (0-1+)
  aut: number       // Productive autonomy (0-1+)
  composite: number // CDS × AUT
}
```

### 5.4 Claim Result
```typescript
interface ClaimResult {
  znuReleased: number
  newWeight: number
  colonyReputationGain: number
  potAccessUnlocked: string[]
  timestamp: number
}
```

---

## 6. N3 Dynamic Weight Tracking

```typescript
interface N3DynamicWeight {
  nodeId: string
  period: { start: number; end: number }
  tqGeneratedKwh: number
  tqGeneratedVerified: boolean
  autMilestones: AUTMilestone[]
  peerVerification: PeerVerification
  urbanikaFactor: UrbanikaFactor
  colonyReputation: number
  vestingProgress: number
  finalWeight: number
  previousWeight: number
  updatedAt: number
}
```

---

## 7. Solarpunk Utopia Extensions

### 7.1 Solar Mesh Network Integration
```typescript
interface SolarMeshNode {
  nodeId: string
  location: { lat: number; lng: number }
  solarCapacityKw: number
  batteryStorageKwh: number
  meshConnections: string[]           // Neighbor node IDs
  energyPricePerKwh: number           // Dynamic pricing
  uptime: number                      // %
  lastHeartbeat: number
}

interface SolarMeshNetwork {
  nodes: Map<string, SolarMeshNode>
  totalCapacityKw: number
  totalStorageKwh: number
  energyTradedKwh: number
  pricingAlgorithm: 'dynamic' | 'fixed' | 'gift-economy'
}
```

### 7.2 Regenerative Infrastructure Metrics
```typescript
interface RegenerativeMetrics {
  // Energy
  solarGenerationKwh: number
  energyAutonomyPercent: number
  gridExportKwh: number
  
  // Water
  waterTableDepthM: number
  rainwaterHarvestedKwh: number
  aquiferRechargeKwh: number
  
  // Soil & Biodiversity
  soilCarbonTcha: number
  biodiversityIndex: number
  treeCount: number
  rewildedHectares: number
  
  // Circular Economy
  wasteDiversionPercent: number
  compostProducedTons: number
  circularMaterialRate: number
  
  // Social
  communitySize: number
  careHoursPerCapita: number
  governanceParticipationPercent: number
}
```

---

## 8. Acceptance Criteria

### 8.1 N3 Dynamic Weight
- [ ] 6 factors with correct weights (60/20/10/5/3/2)
- [ ] TQ verified on-ledger (ValueFlows sync)
- [ ] AUT milestones tracked (7 milestones)
- [ ] Peer verification from Bread (quorum ≥3 N2)
- [ ] Urbanika CDS×AUT composite
- [ ] Colony reputation integrated
- [ ] Vesting progress tracked

### 8.2 Vesting Claims
- [ ] All 5 conditions enforced
- [ ] PeerVerification output for Virginia
- [ ] ZNU release recorded in ValueFlows
- [ ] Colony reputation gain
- [ ] Pot access unlocked progressively

### 8.3 DisCO Integration
- [ ] 3 flows → N3/N2/N1 mapping
- [ ] DHO node with CAT
- [ ] Federation treaty support
- [ ] Shared treasury with multisig

### 8.4 Solarpunk Utopia
- [ ] Solar mesh node registration
- [ ] Energy trading P2P
- [ ] Regenerative metrics tracking
- [ ] Bioregional federation support

---

## 9. Test Vectors

### 9.1 N3 Weight Calculation
```typescript
Input: 
  tqGeneratedKwh=10000 (verified)
  autMilestones: 3/3 verified
  peerVerification: {consensusWeight:0.8, quorumMet:true}
  urbanikaFactor: {composite:0.7}
  colonyReputation: 500
  vestingProgress: 0.6
Expected: weight ≈ 1.85
```

### 9.2 Vesting Claim
```typescript
Input: N3 node with all conditions met
Expected: { eligible: true, peerVerification: {quorumMet:true}, znuReleased: 1250 }
```

### 9.3 Solar Mesh Registration
```typescript
Input: { solarCapacityKw: 50, batteryStorageKwh: 100, location: {lat, lng} }
Expected: nodeId, meshConnections[], energyPricePerKwh
```

---

## 10. Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| `tq-types-extended` | 1.0.0 | Core types (VirginiaVestingGateway, DHO_Node, etc.) |
| `tq-disco-cat` | 1.0.0 | DisCO CAT integration |
| `tq-bread` | 1.0.0 | Peer verification |
| `tq-colony` | 1.0.0 | Colony reputation, domains |
| `tq-berry-vesting` | 1.0.0 | Vesting schedule |
| `tq-oasa` | 1.0.0 | OASA principles for Urbanika |
| `tq-solarpunk` | 1.0.0 | Solar mesh, regenerative metrics (Fase 4) |

---

## 11. References

- Virginia Network: BRIEF_EXHAUSTIVO_HSCSG_COSATECA_OS.md
- DisCO Manifesto: https://manifesto.disco.coop
- Urbanika: docs/urbanika/Autogestion_Vecinal_backup.md
- Colony Protocol: https://colony.io
- Berry Vesting: BRIEF_EXHAUSTIVO_HSCSG_COSATECA_OS.md (Vesting section)
- Solarpunk Utopia: Project docs (solar mesh, regenerative villages)

---

## 12. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-10-18 | Initial implementation with Solarpunk Utopia extensions |