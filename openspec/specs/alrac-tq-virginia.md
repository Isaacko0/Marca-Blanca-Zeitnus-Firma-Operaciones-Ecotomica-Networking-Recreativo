// openspec/specs/alrac-tq-virginia.md
// OpenSpec: Virginia Network Gateway Integration
// Maps: Virginia Network (N1/N2/N3) → TypeScript Implementation

# SPEC: alrac-tq-virginia
**Version:** 1.0.0
**Status:** Designed (Types in tq-types-extended.ts, Gateway integration pending)
**Source:** BRIEF_EXHAUSTIVO_HSCSG_COSATECA_OS.md, Virginia Network docs
**Target:** src/core/lib/tq-virginia.ts (to be created)

---

## 1. Virginia Network Architecture

### 1.1 Three-Layer Hierarchy

| Layer | Name | Purpose | Weight Source |
|-------|------|---------|---------------|
| N1 | Root Domain | Network governance, constitution | Fixed (1.0) |
| N2 | Sub Domains | Coordination, CDS, reputation | Peer verification |
| N3 | Project Domains | TQ/ZNU generation, vesting | Dynamic (TQ+AUT+Peer+Urbanika+Colony+Vesting) |

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

### 1.3 Domain Mapping

```typescript
interface VirginiaColonyMapping {
  n1RootDomainId: string
  n2SubDomainIds: string[]          // governance, ecosystem, tech
  n3ProjectDomainIds: string[]      // regeneration, education, infrastructure
  n3FundDomainIds: string[]         // ecosystem, development, emergency
  reputationToWeightMultiplier: number
  minReputationForPotAccess: number
}
```

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

### 2.2 Claim Conditions (All Required)
1. **AUT Milestones**: Verified on TQ Ledger
2. **Peer Verification**: ≥3 N2 voters, consensus weight ≥ threshold
3. **Urbanika Factor**: CDS × AUT composite score
3. **Colony Reputation**: Minimum threshold for pot access
4. **Vesting Progress**: Tranche unlocked by timestamp

---

## 3. DisCO + DHO Integration

### 3.1 DisCO 3 Flows → Virginia Layers
```typescript
DISCO_FLOW_TO_VIRGINIA = {
  livelihood: 'N3',  // TQ/ZNU generation
  love: 'N2',        // Coordination/CDS
  care: 'N1'         // Autogestión/Urbanika
}
```

### 3.2 DHO Node Structure
```typescript
interface DHO_Node {
  id: string                          // DID (ERC-8004)
  name: string
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
}
```

### 3.3 Federation Treaty
```typescript
interface FederationTreaty {
  signatories: string[]               // DIDs
  terms: {
    resourceSharing: boolean
    governanceAlignment: boolean      // CDS/RAO
    mutualAid: boolean
    disputeResolution: 'consent' | 'mediation' | 'arbitration'
  }
  raoCredentialIds: string[]
}
```

---

## 4. Virginia Gateway Interface

### 4.1 Base Gateway (Vesting)
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

### 4.2 Extended Gateway (DisCO + DHO)
```typescript
interface VirginiaDisCOGateway extends VirginiaVestingGateway {
  discoCAT: DisCO_CAT
  discoFlows: Map<DisCOFlowType, DisCOContribution[]>
  dhoNode: DHO_Node
  dhoPhase: 'emergent' | 'consolidated' | 'mature' | 'federated'
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

## 7. Integration Points

### 7.1 TQ Ledger
- TQ production → N3 weight (60%)
- AUT milestones verified on-ledger

### 7.2 DisCO CAT
- 3 Flows mapped to N3/N2/N1
- CAT transparency → vesting eligibility
- Consent decisions → governance weight

### 7.3 Bread Engine
- Peer verification for vesting claims
- CDS scores for N2 voter eligibility
- Endorsement network for reputation

### 7.4 Urbanika
- CDS × AUT = Urbanika Factor (5% weight)
- Autogestión metrics feed N1

### 7.5 Colony
- Reputation → N3 weight (3%)
- Pot access gated by reputation
- Domain mapping N1→N3

### 7.6 Berry Vesting
- Gradual ZNU release schedule
- Claim conditions enforced
- Colony reputation gain on claim

---

## 8. Acceptance Criteria

### 8.1 N3 Dynamic Weight
- [ ] 6 factors with correct weights (60/20/10/5/3/2)
- [ ] TQ verified on-ledger
- [ ] AUT milestones tracked
- [ ] Peer verification from Bread
- [ ] Urbanika CDS×AUT composite
- [ ] Colony reputation integrated
- [ ] Vesting progress tracked

### 8.2 Vesting Claims
- [ ] All 4 conditions enforced
- [ ] PeerVerification output for Virginia
- [ ] ZNU release recorded
- [ ] Colony reputation gain
- [ ] Pot access unlocked

### 8.3 DisCO Integration
- [ ] 3 flows → N3/N2/N1 mapping
- [ ] DHO node with CAT
- [ ] Federation treaty support
- [ ] Shared treasury with multisig

### 8.4 Federation
- [ ] Parent/child DHO hierarchy
- [ ] RAO sync across federation
- [ ] Treaty terms enforced

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

---

## 11. References

- Virginia Network: BRIEF_EXHAUSTIVO_HSCSG_COSATECA_OS.md
- DisCO Manifesto: https://manifesto.disco.coop
- Urbanika: docs/urbanika/Autogestion_Vecinal_backup.md
- Colony Protocol: https://colony.io
- Berry Vesting: BRIEF_EXHAUSTIVO_HSCSG_COSATECA_OS.md (Vesting section)

---

## 12. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-10-18 | Spec design: N3 dynamic weight, Berry vesting, DisCO/DHO integration, federation, gateway interface |