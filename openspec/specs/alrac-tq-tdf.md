// openspec/specs/alrac-tq-tdf.md
// OpenSpec: Traditional Dream Factory 3 Verification Tracks
// Maps: TDF verification methodology → TypeScript Implementation

# SPEC: alrac-tq-tdf
**Version:** 1.0.0
**Status:** Implemented
**Source:** Traditional Dream Factory methodology, OASA Constitution, DisCO CAT
**Target:** src/core/lib/tq-tdf.ts

---

## 1. TDF Three-Track Verification Architecture

### 1.1 Track Weights & Thresholds

| Track | Name | Weight | Threshold | Description |
|-------|------|--------|-----------|-------------|
| 1 | Closer Attestation | 35% | 80% | Automated oracle verification of onboarding criteria |
| 2 | On-chain Verification | 35% | 75% | Smart contract verification of tokenomics, vesting, governance |
| 3 | Social Audit Panel | 30% | 70% | Human CDS-weighted panel audit of social/ecological impact |

**Overall Pass:** All 3 tracks must pass their individual thresholds

### 1.2 Track 1: Closer Attestation (5 Criteria)

| Criterion | ID | Weight | Measurement | Required |
|-----------|----|--------|-------------|----------|
| Land Title / Lease | land-title | 25% | Boolean | Yes |
| Regeneration Plan | regeneration-plan | 25% | Score (0-1) | Yes |
| Stewardship Commitment | stewardship-commitment | 20% | Boolean | Yes |
| Open Books | open-books | 15% | Score (0-1) | Yes |
| Closer Platform | closer-platform | 15% | Boolean | Yes |

### 1.3 Track 2: On-chain Verification (5 Criteria)

| Criterion | ID | Weight | Measurement | Required |
|-----------|----|--------|-------------|----------|
| Tokenomics Compliance | tokenomics-compliance | 20% | Boolean | Yes |
| Vesting Schedule | vesting-schedule | 20% | Score | Yes |
| Governance Execution | governance-execution | 20% | Score | Yes |
| Treasury Operations | treasury-operations | 20% | Score | Yes |
| Oracle Feeds | oracle-feeds | 20% | Score | No |

### 1.4 Track 3: Social Audit Panel (4 Criteria)

| Criterion | ID | Weight | Measurement | Required |
|-----------|----|--------|-------------|----------|
| Care Work Recognition | care-work-recognition | 25% | Score | Yes |
| Governance Health | governance-health | 25% | Score | Yes |
| Ecological Impact | ecological-impact | 25% | Score | Yes |
| Federation Alignment | federation-alignment | 25% | Score | No |

---

## 2. TypeScript Implementation Mapping

### 2.1 Core Engine: `TDFEngine`

```typescript
class TDFEngine {
  // Track definitions (initialized in constructor)
  private tracks: Map<TDFTrackType, TDFVerificationTrack>
  private verifiers: Map<string, TDFVerifier>
  private reports: Map<string, TDFVerificationReport>

  // Main verification entry point
  async runVerification(context: TDFVerificationContext): Promise<TDFVerificationReport>

  // Track getters
  getTrack(track: TDFTrackType): TDFVerificationTrack
  getAllTracks(): TDFVerificationTrack[]

  // Report access
  getReport(id): TDFVerificationReport
  getReportsForVillage(villageId): TDFVerificationReport[]

  // Closer Attestation RFC (Track 1 Fix)
  async createCloserAttestation(villageId, data): { attestationId, nonce, signature }
  verifyCloserAttestation(attestationId, signature, villageId, nonce): boolean

  // Social Audit Panel Rotation
  rotateSocialAuditPanel(cdsScores, panelSize): string[]
}
```

### 2.2 Verification Context
```typescript
interface TDFVerificationContext {
  villageId?: string
  proposalId?: string
  agentId?: string
  transactionId?: string
  data: Record<string, any>  // Track-specific data
  timestamp: number
}
```

### 2.3 Verification Report
```typescript
interface TDFVerificationReport {
  id: string
  context: TDFVerificationContext
  trackResults: Map<TDFTrackType, TDFTrackResult>
  overallScore: number
  overallPassed: boolean
  createdAt: number
  expiresAt: number
  raoCredentialId: string
}
```

### 2.4 Track Result
```typescript
interface TDFTrackResult {
  track: TDFTrackType
  passed: boolean
  score: number
  criterionResults: TDFCriterionResult[]
  verifierNotes: string[]
}
```

---

## 3. Closer Attestation RFC (Track 1 Fix)

### 3.1 Attestation Creation
```typescript
async createCloserAttestation(villageId, data):
  // Data includes: landTitle, regenerationPlan, stewardship, openBooks, closerPlatform
  // Returns: { attestationId, nonce, signature }
```

### 3.2 Nonce Management (Replay Prevention)
```typescript
getNextNonce(subjectId, subjectType): number
verifyNonce(subjectId, subjectType, nonce): boolean
// Monotonic nonce per subject, prevents replay attacks
```

### 3.3 Type-Specific Validation
- Village onboarding: 5 criteria all required
- Agent registration: 4 required capabilities
- Fund application: governance-and-use-rights only
- Regeneration milestone: principle 1-7, target/achieved, measurement method
- Governance action: quorum + threshold met
- Treasury operation: multisig threshold, allocations match
- Federation treaty: 2+ signatories
- Emergency action: guardian + ecological risk

---

## 4. Social Audit Panel Rotation

### 4.1 Selection Methods
| Method | Description |
|--------|-------------|
| cds-weighted | Sort by CDS×0.6 + reputation×0.4, ensure domain diversity |
| lottery | Weighted random by CDS score |
| hybrid | 70% CDS-weighted + 30% lottery |

### 4.2 Rotation Config
```typescript
interface RotationSchedule {
  interval: 'monthly' | 'quarterly' | 'semi-annual' | 'annual'
  maxConsecutiveTerms: number
  coolingPeriod: number  // ms
  selectionMethod: 'cds-weighted' | 'lottery' | 'hybrid'
  panelSize: number
  chairRotation: boolean
  nextRotation: number
}
```

### 4.3 Rotation Logic
1. Filter candidates: active 90 days, CDS≥0.4, reputation≥0.3
2. Apply selection method
3. Ensure domain diversity (max 2 per domain)
4. Assign chair (rotates if enabled)
5. Set term dates, cooling period for outgoing

---

## 5. Integration Points

### 5.1 DisCO CAT Engine (Track 3 Data)
- Care flow contributions → care-work-recognition
- Consent decisions → governance-health (participation, stale blocks)
- Transparency score → transparency-score
- Audit trail → audit-trail-current

### 5.2 OASA Constitution Engine (Track 1 & 3)
- Village compliance → oasa-principles-compliance
- Regenerative metrics → ecological-impact
- Guardian veto → emergency-action attestation

### 5.3 Virginia Network (Track 2 & 3)
- N3 dynamic weight → tq-production-verified
- Vesting eligibility → vesting-compliance
- Federation treaty → federation-treaty-active
- RAO sync → rao-sync-active

### 5.4 ValueFlows (Track 3)
- Economic events completeness → valueflows-complete

### 5.5 Snapshot (Track 2)
- Proposal execution → governance-execution
- Treasury operations → treasury-operations

### 5.6 Closer Attestation Engine (Track 1)
- createVillageOnboardingAttestation()
- createRegenerationMilestoneAttestation()
- Nonce management, multi-sig, RFC compliance

---

## 6. Acceptance Criteria

### 6.1 Three Tracks
- [ ] Track 1: 5 criteria, 35% weight, 80% threshold
- [ ] Track 2: 5 criteria, 35% weight, 75% threshold
- [ ] Track 3: 4 criteria, 30% weight, 70% threshold
- [ ] Overall pass = all tracks pass

### 6.2 Track 1 Verifications
- [ ] Land title/lease boolean check
- [ ] Regeneration plan: 7 principles, measurable targets
- [ ] Stewardship: signatures vs required
- [ ] Open books: 3 categories
- [ ] Closer platform: 4 required capabilities

### 6.3 Track 2 Verifications
- [ ] Tokenomics: utility, governance, use rights, no equity, bonding curve
- [ ] Vesting: cliff, tranches, amounts, beneficiaries
- [ ] Governance: voting ended, quorum, executed, timelock
- [ ] Treasury: multisig, allocations, no unauthorized, reserves
- [ ] Oracles: 4 required feeds active

### 6.4 Track 3 Verifications
- [ ] Care flow: recognized, valued, in governance
- [ ] Governance: participation ≥70%, no stale blocks >30d
- [ ] Ecological: 7 principles measured, improvement tracked
- [ ] Federation: treaty, RAO sync, shared treasury, dispute resolution

### 6.5 Closer Attestation RFC
- [ ] 10 attestation types defined
- [ ] Nonce monotonic per subject
- [ ] Required signatures per type (2-3)
- [ ] Type-specific validation
- [ ] Revocation by authorized parties
- [ ] RFC document exportable

### 6.6 Panel Rotation
- [ ] 3 selection methods
- [ ] Domain diversity enforced
- [ ] Chair rotation
- [ ] Cooling period respected

---

## 7. Test Vectors

### 7.1 Full Verification
```typescript
Input: TDFVerificationContext with villageId and all track data
Expected: TDFVerificationReport with trackResults Map, overallScore, overallPassed
```

### 7.2 Track 1 Only
```typescript
Input: village onboarding data (all 5 criteria true)
Expected: track1.passed=true, score=1.0
```

### 7.3 Closer Attestation
```typescript
Input: villageId, onboarding data
Expected: attestationId, nonce=1, signature=0x...
Verification: valid=true, errors=[]
```

### 7.4 Panel Rotation
```typescript
Input: 20 candidates with CDS 0.3-1.0, panelSize=5, hybrid
Expected: 5 members, chair assigned, domain diversity
```

---

## 8. Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| `tq-types-extended` | 1.0.0 | Core types |
| `tq-disco-cat` | 1.0.0 | Track 3 automated criteria |
| `tq-snapshot` | 1.0.0 | Track 2 governance verification |
| `tq-closer-attestation` | 1.0.0 | Track 1 attestation creation |
| `tq-oasa` | 1.0.0 | OASA compliance data |
| `tq-bread` | 1.0.0 | CDS scores for panel selection |

---

## 9. References

- Traditional Dream Factory: ECOSYSTEM_REVENUE_SHARING.md
- OASA Constitution: https://oasa.earth/papers/oasa-constitution-2025
- DisCO Manifesto: https://manifesto.disco.coop
- Closer Platform: https://closer.earth
- BRIEF_EXHAUSTIVO_HSCSG_COSATECA_OS.md (TDF section)

---

## 10. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-10-18 | Initial implementation: 3 tracks, 14 criteria, Closer Attestation RFC, panel rotation, social audit integration |