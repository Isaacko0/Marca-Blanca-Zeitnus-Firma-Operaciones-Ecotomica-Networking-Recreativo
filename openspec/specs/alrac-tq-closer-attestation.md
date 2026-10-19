// openspec/specs/alrac-tq-closer-attestation.md
// OpenSpec: Closer Attestation RFC (TDF Track 1 Fix)
// Maps: Closer Attestation specification → TypeScript Implementation

# SPEC: alrac-tq-closer-attestation
**Version:** 1.0.0
**Status:** Implemented
**Source:** Closer Platform, OASA Constitution, TDF Methodology
**Target:** src/core/lib/tq-closer-attestation.ts

---

## 1. Closer Attestation Architecture

### 1.1 Attestation Types (10)

| Type | Description | Required Signatures | Required Roles |
|------|-------------|---------------------|----------------|
| village-onboarding | Initial village registration | 3 | oracle, guardian, verifier |
| village-renewal | Annual compliance renewal | 2 | oracle, verifier |
| agent-registration | Closer Agent registration | 2 | oracle, verifier |
| fund-application | Village Fund application | 3 | oracle, guardian, verifier |
| regeneration-milestone | OASA principle milestone | 2 | oracle, verifier |
| governance-action | Major governance decision | 2 | oracle, verifier |
| treasury-operation | Treasury allocation | 3 | oracle, guardian, verifier |
| federation-treaty | Federation treaty signed | 3 | oracle, guardian, verifier |
| dispute-resolution | Dispute resolved | 2 | oracle, verifier |
| emergency-action | Guardian veto action | 2 | guardian, oracle |

### 1.2 Attestation Structure

```typescript
interface CloserAttestation {
  id: string                    // attest_{timestamp}_{random}
  type: AttestationType
  subjectType: 'village' | 'agent' | 'fund' | 'proposal' | 'treaty' | 'dispute'
  subjectId: string
  subjectName: string
  nonce: number                 // Monotonic per subject
  data: CloserAttestationData   // Type-specific payload
  signatures: CloserAttestationSignature[]
  status: 'pending' | 'verified' | 'rejected' | 'revoked' | 'expired'
  createdAt: number
  expiresAt: number             // Default: 1 year
  verifiedAt?: number
  revokedAt?: number
  revocationReason?: string
  raoCredentialId: string       // RAO anchor (ERC-8004)
}
```

### 1.3 Signature Structure

```typescript
interface CloserAttestationSignature {
  signerDid: string
  signerRole: 'oracle' | 'guardian' | 'verifier' | 'subject' | 'witness'
  signature: string             // Ed25519
  algorithm: 'ed25519'
  timestamp: number
  nonce: number                 // Must match attestation.nonce
}
```

### 1.4 Oracle Registry

| Field | Description |
|-------|-------------|
| id | Oracle identifier |
| name | Display name |
| did | DID of oracle |
| publicKey | Ed25519 public key |
| capabilities | ['land-registry', 'document-verification', 'platform-monitoring', 'data-feeds', 'governance-verification'] |
| stake | ZNU staked (slashing) |
| reputation | 0-1 |
| status | active/inactive/slashed |
| lastAttestation | Timestamp |

---

## 2. Nonce Management (RFC: Replay Attack Prevention)

### 2.1 Rules
1. Each subject (village/agent) has monotonically increasing nonce
2. Nonce starts at 1 for first attestation
3. Verification rejects if nonce ≠ current nonce
4. Used nonces stored to detect replay

### 2.2 Implementation
```typescript
getNextNonce(subjectId, subjectType): number
// Increments and returns new nonce

verifyNonce(subjectId, subjectType, nonce): boolean
// Returns true only if nonce == current nonce
```

---

## 3. Type-Specific Data Validation

### 3.1 Village Onboarding / Renewal
| Field | Validation |
|-------|------------|
| landTitle.verified | true OR lease.verified with ≥49 years |
| regenerationPlan.principlesCovered | == 7 |
| regenerationPlan.targetsMeasurable | == 7 |
| stewardshipCommitment.signed | true |
| stewardshipCommitment.signers.length | ≥ requiredSigners |
| openBooks.financial/ecological/governance | all true |
| closerPlatform.agentRegistered | true |
| closerPlatform.activeCapabilities | includes: bookings, governance, tokens, resource-tracking |

### 3.2 Agent Registration
| Field | Validation |
|-------|------------|
| agentCapabilities.length | > 0 |
| Required capabilities present | bookings, governance, tokens, resource-tracking |

### 3.3 Fund Application
| Field | Validation |
|-------|------------|
| fundCohort | ≥ 1 |
| tokenRaiseType | == 'governance-and-use-rights' |

### 3.4 Regeneration Milestone
| Field | Validation |
|-------|------------|
| principle | 1-7 |
| targetValue, achievedValue | both present |
| measurementMethod | not empty |

### 3.5 Governance Action
| Field | Validation |
|-------|------------|
| proposalId, proposalTitle | present |
| quorumMet, thresholdMet | both true |

### 3.6 Treasury Operation
| Field | Validation |
|-------|------------|
| allocationId, amount > 0 | present |
| multisigSigners.length | ≥ 2 |
| thresholdMet | true |

### 3.7 Federation Treaty
| Field | Validation |
|-------|------------|
| treatyId | present |
| signatories.length | ≥ 2 |

### 3.8 Emergency Action
| Field | Validation |
|-------|------------|
| guardianId, vetoedProposalId, ecologicalRisk | all present |

---

## 4. Attestation Request Flow (Multi-party)

### 4.1 States
```
open → collecting → verified
         ↓
      expired
         ↓
      rejected
```

### 4.2 Flow
1. Create request with requiredSignatures, requiredRoles
2. Signers add signatures (role must match requiredRoles)
3. When signatures ≥ requiredSignatures → finalize
4. Finalize creates attestation with collected signatures
5. Attestation status = verified

---

## 5. Revocation

### 5.1 Authorization
- Oracle signers on attestation
- Guardian signers on attestation
- Subject (village/agent DID)

### 5.2 Effect
- Immediate status change to 'revoked'
- revokedAt timestamp
- revocationReason recorded
- Irreversible (new attestation required)

---

## 6. TypeScript Implementation Mapping

### 6.1 Core Engine: `CloserAttestationEngine`

#### Attestation Creation
```typescript
createAttestation(attestation): CloserAttestation
// Auto-generates nonce, RAO credential, 1-year expiry
```

#### Oracle Signing
```typescript
async signAttestation(attestationId, oracleId, signerRole):
  // 1. Verify attestation exists and pending
  // 2. Verify oracle active
  // 3. Verify nonce (replay prevention)
  // 4. Verify type-specific data
  // 5. Create Ed25519 signature (mock in dev)
  // 6. Add signature, update oracle lastAttestation
  // 7. If signatures ≥ required → status=verified
  // Returns: { success, signature?, error? }
```

#### Request Flow
```typescript
createAttestationRequest(request): AttestationRequest
addSignatureToRequest(requestId, signature): boolean
// Auto-finalizes when threshold met
```

#### Revocation
```typescript
revokeAttestation(attestationId, revokerDid, reason): boolean
// Checks authorization (signer or subject)
```

#### Verification
```typescript
verifyAttestation(attestationId): { valid, errors, attestation? }
// Checks: status, expiry, nonce, signatures, signer validity
```

#### Integration: Village Onboarding
```typescript
async createVillageOnboardingAttestation(village, data): CloserAttestation
// Creates + auto-signs with default oracle
```

#### Integration: Regeneration Milestone
```typescript
async createRegenerationMilestoneAttestation(villageId, data): CloserAttestation
// Principle 1-7, metric, target/achieved, evidence
```

#### RFC Export
```typescript
exportAttestationRFC(): string
// Complete markdown specification
```

---

## 7. TDF Track 1 Integration

### 7.1 Track 1 = Closer Attestation
The Closer Attestation Engine **IS** Track 1 of TDF verification.

### 7.2 TDF Engine Usage
```typescript
// TDFEngine calls:
await closerAttestationEngine.createVillageOnboardingAttestation(village, data)
// Verification:
closerAttestationEngine.verifyAttestation(attestationId)
```

### 7.3 Criteria Mapping
| TDF Criterion | Attestation Field |
|---------------|-------------------|
| land-title | data.landTitle.verified / data.lease.verified |
| regeneration-plan | data.regenerationPlan.principlesCovered == 7 |
| stewardship-commitment | data.stewardshipCommitment.signed |
| open-books | data.openBooks.{financial,ecological,governance} |
| closer-platform | data.closerPlatform.agentRegistered + capabilities |

---

## 8. Acceptance Criteria

### 8.1 Attestation Types
- [ ] All 10 types defined with correct signature requirements
- [ ] Type-specific data structures
- [ ] Subject type mapping correct

### 8.2 Nonce Management
- [ ] Monotonic per subject
- [ ] Replay attack prevention (verifyNonce)
- [ ] First attestation nonce = 1

### 8.3 Data Validation
- [ ] All 10 types have validation rules
- [ ] Village onboarding: 5 criteria validated
- [ ] Agent registration: 4 required capabilities
- [ ] Fund application: governance-and-use-rights only
- [ ] Emergency action: 2 signatures (guardian+oracle)

### 8.4 Signing Flow
- [ ] Oracle must be active
- [ ] Nonce verified before signing
- [ ] Data validated before signing
- [ ] Signature includes nonce
- [ ] Auto-verify when threshold met

### 8.5 Request Flow
- [ ] 7-day expiry for signature collection
- [ ] Role requirements enforced
- [ ] Duplicate signer rejected
- [ ] Auto-finalize on threshold

### 8.6 Revocation
- [ ] Authorized: oracle, guardian, subject
- [ ] Immediate effect
- [ ] Reason recorded
- [ ] Irreversible

### 8.7 RFC Compliance
- [ ] Exportable RFC document
- [ ] Format specification complete
- [ ] Verification rules documented
- [ ] Integration with TDF documented

---

## 9. Test Vectors

### 9.1 Village Onboarding
```typescript
Input: village + onboarding data (all valid)
Expected: attestationId, nonce=1, status=verified, 3 signatures
```

### 9.2 Nonce Replay
```typescript
Input: Create attestation (nonce=1), try create again with nonce=1
Expected: verifyNonce returns false, signAttestation rejects
```

### 9.3 Invalid Data
```typescript
Input: Village onboarding without land title
Expected: signAttestation returns error: "Either land title or long-term lease must be verified"
```

### 9.4 Revocation
```typescript
Input: Revoke by oracle signer
Expected: status=revoked, revokedAt set, reason recorded
Second revocation: false
```

---

## 10. Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| `tq-types-extended` | 1.0.0 | Core types (CloserVillage, CloserAgent) |
| `tq-oasa` | 1.0.0 | OASA principles, Guardian role |
| `tq-tdf` | 1.0.0 | TDF Track 1 integration |

---

## 11. References

- Closer Platform: https://closer.earth
- OASA Constitution: https://oasa.earth/papers/oasa-constitution-2025
- TDF Methodology: ECOSYSTEM_REVENUE_SHARING.md
- ERC-8004: https://eips.ethereum.org/EIPS/eip-8004
- BRIEF_EXHAUSTIVO_HSCSG_COSATECA_OS.md (Attestation section)

---

## 12. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-10-18 | Initial implementation: 10 types, nonce management, oracle signing, request flow, revocation, RFC export, TDF Track 1 integration |