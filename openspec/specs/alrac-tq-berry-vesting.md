// openspec/specs/alrac-tq-berry-vesting.md
// OpenSpec: Berry Vesting Schedule (ZNU Gradual Release)
// Maps: Berry vesting methodology → TypeScript Implementation

# SPEC: alrac-tq-berry-vesting
**Version:** 1.0.0
**Status:** Designed (Types in tq-types-extended.ts, Engine implementation pending)
**Source:** Berry vesting methodology, BRIEF_EXHAUSTIVO_HSCSG_COSATECA_OS.md
**Target:** src/core/lib/tq-berry-vesting.ts (to be created)

---

## 1. Berry Vesting Architecture

### 1.1 Vesting Principles

| Principle | Description |
|-----------|-------------|
| Gradual Release | ZNU released in tranches over time, not all at once |
| Milestone-Gated | Each tranche requires verified AUT milestones |
| Peer Verified | Vesting claims require N2 peer consensus (Bread) |
| Reputation Linked | Claims grant Colony reputation |
| Pot Unlocking | Progressive access to Colony pots |

### 1.2 Vesting State

```typescript
interface VestingState {
  schedule: VestingTranche[]    // Ordered tranches
  beneficiary: string | null    // DID of recipient
  claimed: number               // Total ZNU claimed
  beneficiarySetDeadline: number // Deadline to set beneficiary
  ownerRenounced: boolean       // Owner relinquished control
}
```

### 1.3 Vesting Tranche

```typescript
interface VestingTranche {
  id: string
  ts: number              // Unlock timestamp
  amountZNU: number       // Tokens in this tranche
  claimed: boolean        // Whether claimed
}
```

---

## 2. Vesting Schedule Design

### 2.1 Standard Schedule (4 Years)

| Tranche | Timing | Amount | Conditions |
|---------|--------|--------|------------|
| 1 | Month 6 | 10% | AUT Milestone 1 + Peer verification |
| 2 | Month 12 | 15% | AUT Milestone 2 + Peer verification |
| 3 | Month 18 | 15% | AUT Milestone 3 + Peer verification |
| 4 | Month 24 | 20% | AUT Milestone 4 + Peer verification |
| 5 | Month 30 | 15% | AUT Milestone 5 + Peer verification |
| 6 | Month 36 | 15% | AUT Milestone 6 + Peer verification |
| 7 | Month 42 | 10% | AUT Milestone 7 + Peer verification |

**Total:** 100% over 42 months

### 2.2 Claim Conditions (All Required)

1. **Tranche Unlocked**: `currentTime >= tranche.ts`
2. **AUT Milestone Verified**: Corresponding milestone on TQ Ledger
3. **Peer Verification**: ≥3 N2 voters, consensus weight ≥ threshold (Bread)
4. **Beneficiary Set**: `beneficiary !== null` before `beneficiarySetDeadline`
5. **Owner Renounced**: `ownerRenounced === true` (decentralization)

---

## 3. AUT Milestones (Autonomy Verified)

### 3.1 Milestone Structure

```typescript
interface AUTMilestone {
  id: string
  description: string
  targetTQKwh: number       // Target thermodynamic production
  actualTQKwh: number       // Actual verified production
  verified: boolean
  verifiedBy: string[]      // N2 peer DIDs
  verifiedAt: number
  raoCredentialId: string   // RAO anchor
}
```

### 3.2 Standard Milestones

| # | Description | Target TQ kWh/year | Verification |
|---|-------------|-------------------|--------------|
| 1 | Basic infrastructure operational | 5,000 | TQ Ledger + 3 N2 peers |
| 2 | Regenerative systems producing | 15,000 | TQ Ledger + 3 N2 peers |
| 3 | Energy sovereignty achieved | 30,000 | TQ Ledger + 3 N2 peers |
| 4 | Food sovereignty achieved | 50,000 | TQ Ledger + 3 N2 peers |
| 5 | Water sovereignty achieved | 75,000 | TQ Ledger + 3 N2 peers |
| 6 | Full regenerative capacity | 100,000 | TQ Ledger + 3 N2 peers |
| 7 | Intergenerational resilience | 150,000 | TQ Ledger + 3 N2 peers |

---

## 4. Claim Process

### 4.1 Eligibility Check
```typescript
canClaimVesting(): boolean
// Returns true if:
// 1. Next tranche.ts <= now
// 2. Next tranche.claimed === false
// 3. Corresponding AUT milestone verified
// 4. Peer verification available (quorum met)
```

### 4.2 Claim Execution
```typescript
claimVesting(): Promise<ClaimResult>
// 1. Verify all conditions
// 2. Mark tranche.claimed = true
// 3. Update claimed total
// 4. Mint ZNU to beneficiary
// 5. Grant Colony reputation
// 6. Unlock next pot tier
// 7. Return ClaimResult
```

### 4.3 Claim Result
```typescript
interface ClaimResult {
  znuReleased: number
  newWeight: number              // Updated N3 dynamic weight
  colonyReputationGain: number   // Reputation granted
  potAccessUnlocked: string[]    // New pots accessible
  timestamp: number
}
```

---

## 5. N3 Dynamic Weight Integration

### 5.1 Weight Components
```typescript
N3Weight = (
  TQ_Component × 0.60 +           // Verified TQ production
  AUT_Component × 0.20 +          // Milestone completion rate
  Peer_Component × 0.10 +         // Bread consensus weight
  Urbanika_Component × 0.05 +     // CDS × AUT
  Colony_Component × 0.03 +       // Reputation
  Vesting_Component × 0.02        // Schedule progress
)
```

### 5.2 Vesting Component Calculation
```typescript
vestingProgress = claimedZNU / totalVestingZNU
vestingComponent = vestingProgress  // 0-1, max 2% weight
```

---

## 6. TypeScript Implementation Mapping (Design)

### 6.1 Core Engine: `BerryVestingEngine`

```typescript
class BerryVestingEngine {
  // Vesting Management
  createVestingSchedule(config: VestingConfig): VestingState
  getVestingState(nodeId: string): VestingState
  
  // Milestone Management
  addAUTMilestone(nodeId: string, milestone: AUTMilestone): void
  verifyAUTMilestone(nodeId: string, milestoneId: string, verifierDids: string[]): boolean
  getAUTMilestones(nodeId: string): AUTMilestone[]
  
  // Claim Processing
  canClaimVesting(nodeId: string): boolean
  async claimVesting(nodeId: string): Promise<ClaimResult>
  
  // Weight Computation
  computeN3Weight(nodeId: string): N3DynamicWeight
  getVestingProgress(nodeId: string): number  // 0-1
  
  // Integration
  syncWithTQLedger(tqTransactions: TQTransaction[]): number
  syncWithBread(breadEngine: BreadEngine): void
  syncWithVirginia(virginiaGateway: VirginiaVestingGateway): void
}
```

### 6.2 Configuration
```typescript
interface VestingConfig {
  totalZNU: number
  tranches: VestingTrancheConfig[]
  autMilestones: AUTMilestoneConfig[]
  beneficiarySetDeadline: number
}

interface VestingTrancheConfig {
  unlockDelay: number        // ms from start
  amountPercent: number      // % of total
  requiredMilestone: number  // milestone index (1-7)
}

interface AUTMilestoneConfig {
  description: string
  targetTQKwh: number
}
```

---

## 7. Integration Points

### 7.1 TQ Ledger
- AUT milestones verified against TQ production transactions
- `syncWithTQLedger()` updates actualTQKwh

### 7.2 Bread Engine
- `verifyVestingClaim()` → Bread verification request
- PeerVerification output used for claim eligibility
- CDS scores for N2 voter selection

### 7.3 Virginia Network
- VestingState → VirginiaVestingGateway
- ClaimResult → N3 weight update
- Pot access unlocking → Colony integration

### 7.4 Colony Protocol
- Colony reputation gain on claim
- Pot access unlocked progressively
- Reputation contributes to N3 weight (3%)

### 7.5 DisCO CAT
- Contributions → TQ production → AUT milestones
- Transparency score affects peer verification eligibility
- Care flow recognition affects governance weight

---

## 8. Acceptance Criteria

### 8.1 Vesting Schedule
- [ ] 7 tranches over 42 months
- [ ] Each tranche gated by AUT milestone
- [ ] Beneficiary deadline enforced
- [ ] Owner renunciation required

### 8.2 AUT Milestones
- [ ] 7 milestones with increasing TQ targets
- [ ] Verification by 3 N2 peers + TQ Ledger
- [ ] RAO credential anchoring

### 8.3 Claim Process
- [ ] All 5 conditions checked
- [ ] Peer verification via Bread
- [ ] ZNU released to beneficiary
- [ ] Colony reputation granted
- [ ] Pot access unlocked

### 8.4 N3 Weight
- [ ] Vesting component = 2% of weight
- [ ] Progress tracked 0-1
- [ ] Updates on each claim

### 8.5 Integration
- [ ] TQ Ledger sync updates milestones
- [ ] Bread verification for claims
- [ ] Virginia gateway receives ClaimResult
- [ ] Colony reputation synced

---

## 9. Test Vectors

### 9.1 Schedule Creation
```typescript
Input: totalZNU=100000, 7 tranches, startDate=now
Expected: schedule[0].ts = now + 6 months, amount=10000
```

### 9.2 Milestone Verification
```typescript
Input: milestone target=15000, actual=16000, 3 N2 peers verify
Expected: milestone.verified=true, verifiedBy=[3 DIDs]
```

### 9.3 Claim Execution
```typescript
Input: tranche unlocked, milestone verified, peer quorum met
Expected: { znuReleased=15000, newWeight=1.92, colonyReputationGain=50, potAccessUnlocked=['pot-development'] }
```

---

## 10. Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| `tq-types-extended` | 1.0.0 | Core types (VestingState, VestingTranche, etc.) |
| `tq` | 1.0.0 | TQTransaction for sync |
| `tq-disco-cat` | 1.0.0 | Contributions → TQ |
| `tq-bread` | 1.0.0 | Peer verification |
| `tq-virginia` | 1.0.0 | Virginia gateway |
| `tq-colony` | 1.0.0 | Reputation, pots |

---

## 11. References

- Berry Vesting: BRIEF_EXHAUSTIVO_HSCSG_COSATECA_OS.md (Vesting section)
- Virginia Network: BRIEF_EXHAUSTIVO_HSCSG_COSATECA_OS.md (Virginia section)
- DisCO CAT: https://manifesto.disco.coop
- Colony Protocol: https://colony.io

---

## 12. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-10-18 | Spec design: 7-tranche schedule, 7 AUT milestones, peer verification, N3 weight integration, Colony reputation |