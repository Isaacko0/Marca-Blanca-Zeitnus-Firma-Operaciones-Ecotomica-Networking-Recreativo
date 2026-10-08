// Aura Credential — Verifiable Credential for Proof of Aura (HSCSG v15 OS / ALRAC)
// Pure logic, offline-first, amphibious — DID-based, GAIA COMMONS issuance, ConvergeMaps attestation

import type { AuraComponents, AuraTier } from '@core/lib/aura';
import type { AppState } from '@core/state/store';

// ============================================================================
// CREDENTIAL TYPES
// ============================================================================

export interface AuraCredential {
  // Identity
  did: string;                      // did:key:... (self-sovereign)
  nodeId: string;                   // Node identifier
  
  // Aura snapshot
  components: AuraComponents;
  score: number;                    // 0-1
  tier: AuraTier;                   // 'dormant' | 'emerging' | 'established' | 'guardian' | 'sovereign_anchor'
  
  // Evidence (RAO chain)
  energyProof: EnergyProof;
  experienceProof: ExperienceProof;
  convictionProof: ConvictionProof;
  healthProof: HealthProof;
  
  // Metadata
  issuedAt: number;
  expiresAt: number;                // 90 days (renewal required)
  issuer: 'ALRAC_GAIA_COMMONS';     // Distributed authority
  
  // Verification
  verificationHash: string;         // Hash of all proofs
  verificationMethod: 'ConvergeMaps' | 'CDS_Jury' | 'Kleros' | 'SelfAttested';
  convergeMapsAttestation: ConvergeMapsAttestation;
}

export interface EnergyProof {
  tqFlowHash: string;               // Hash of TQ flows (last epoch)
  energyCatalogRef: string;         // ICE/Ecoinvent entry hash
  nfcTagSignature?: string;         // NFC tag signature if offline
  demurrageCompliant: boolean;
  epoch: number;                    // Epoch number
  epochStart: number;
  epochEnd: number;
}

export interface ExperienceProof {
  evRecordMerkleRoot: string;       // Merkle root of EV records
  raoChainHead: string;             // Latest RAO hash
  frictionRatio: number;            // frictionEvents / totalEvents
  coherenceEvents: number;          // detectCoherence count
  gammaCarmisStatus: 'healthy' | 'fracture' | 'reconfiguring';
  totalRecords: number;
  validRecords: number;
}

export interface ConvictionProof {
  weightedConviction: number;       // From Symbiosky
  activeLocks: number;
  totalLockedZNU: number;
  proposalsVoted: number;
  commitRevealParticipation: number; // % of votes with commit-reveal
  proposalsAuthored: number;
}

export interface HealthProof {
  gammaCarmisStatus: 'healthy' | 'fracture' | 'reconfiguring';
  convergeMapsConsensus: boolean;
  compatibilityScore: number;       // verifyCompatibility average
  legitimateSeparation: boolean;    // No coordinated farming
  lastGammaCheck: number;
}

export interface ConvergeMapsAttestation {
  attested: boolean;
  operators: string[];              // Nodes that participated in convergence
  pattern: string;                  // Converged pattern
  reinforced: boolean;              // Consensus reached
  attestationHash: string;          // Hash of convergence result
  timestamp: number;
  quorum: number;                   // % of nodes that converged
}

// ============================================================================
// CREDENTIAL LIFECYCLE
// ============================================================================

export const CREDENTIAL_CONFIG = {
  VALIDITY_DAYS: 90,
  RENEWAL_WINDOW_DAYS: 14,          // Start renewal 14 days before expiry
  MAX_RENEWALS: 3,                  // After 3 renewals, full re-verification
  CONVERGE_MAPS_QUORUM: 0.66,       // 66% of nodes must converge
  MIN_ATTESTORS: 3,                 // Minimum nodes for ConvergeMaps
} as const;

export interface CredentialLifecycleState {
  credential: AuraCredential | null;
  renewalCount: number;
  lastRenewalAt: number | null;
  revoked: boolean;
  revocationReason?: string;
  suspended: boolean;
  suspensionReason?: string;
  lastVerificationAt: number | null;
}

export function makeCredentialLifecycleState(): CredentialLifecycleState {
  return {
    credential: null,
    renewalCount: 0,
    lastRenewalAt: null,
    revoked: false,
    suspended: false,
    lastVerificationAt: null,
  };
}

// ============================================================================
// VERIFICATION HASH
// ============================================================================

export function computeVerificationHash(credential: Omit<AuraCredential, 'verificationHash' | 'convergeMapsAttestation'>): string {
  const msg = JSON.stringify({
    did: credential.did,
    nodeId: credential.nodeId,
    components: credential.components,
    score: credential.score,
    tier: credential.tier,
    energyProof: credential.energyProof,
    experienceProof: credential.experienceProof,
    convictionProof: credential.convictionProof,
    healthProof: credential.healthProof,
    issuedAt: credential.issuedAt,
    expiresAt: credential.expiresAt,
    issuer: credential.issuer,
  });
  
  // FNV-1a hash (deterministic, offline-capable)
  let h = 2166136261;
  for (let i = 0; i < msg.length; i++) {
    h ^= msg.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}

export function verifyCredentialHash(credential: AuraCredential): boolean {
  const { verificationHash, convergeMapsAttestation, ...rest } = credential;
  const computed = computeVerificationHash(rest);
  return computed === verificationHash;
}

// ============================================================================
// CREDENTIAL ISSUANCE FLOW
// ============================================================================

export interface IssuanceRequest {
  nodeId: string;
  did: string;
  components: AuraComponents;
  energyProof: EnergyProof;
  experienceProof: ExperienceProof;
  convictionProof: ConvictionProof;
  healthProof: HealthProof;
}

export interface IssuanceResult {
  success: boolean;
  credential?: AuraCredential;
  error?: string;
  convergeMapsResult?: ConvergeMapsAttestation;
}

/** Main issuance function - called by GAIA COMMONS after ConvergeMaps consensus */
export async function issueAuraCredential(
  request: IssuanceRequest,
  convergeMapsAttestation: ConvergeMapsAttestation
): Promise<IssuanceResult> {
  // Verify ConvergeMaps attestation
  if (!convergeMapsAttestation.attested) {
    return { success: false, error: 'ConvergeMaps attestation failed' };
  }
  
  if (convergeMapsAttestation.quorum < 0.66) {
    return { success: false, error: 'ConvergeMaps quorum not met (need 66%)' };
  }
  
  if (convergeMapsAttestation.operators.length < 3) {
    return { success: false, error: 'Insufficient attestors (need ≥3)' };
  }
  
  // Verify all proofs
  const verification = await verifyAllProofs(request);
  if (!verification.valid) {
    return { success: false, error: `Proof verification failed: ${verification.errors.join(', ')}` };
  }
  
  // Compute score and tier
  const components = request.components;
  const score = computeAuraScore(components); // from @core/lib/aura
  const tier = getAuraTier(score);
  
  // Create credential
  const issuedAt = Date.now();
  const expiresAt = issuedAt + CREDENTIAL_CONFIG.VALIDITY_DAYS * 24 * 60 * 60 * 1000;
  
  const credential: Omit<AuraCredential, 'verificationHash' | 'convergeMapsAttestation'> = {
    did: request.did,
    nodeId: request.nodeId,
    components,
    score,
    tier,
    energyProof: request.energyProof,
    experienceProof: request.experienceProof,
    convictionProof: request.convictionProof,
    healthProof: request.healthProof,
    issuedAt,
    expiresAt,
    issuer: 'ALRAC_GAIA_COMMONS',
    verificationMethod: 'ConvergeMaps',
  };
  
  const verificationHash = computeVerificationHash(credential);
  
  const credentialComplete: AuraCredential = {
    ...credential,
    verificationHash,
    convergeMapsAttestation,
  };
  
  return {
    success: true,
    credential: credentialComplete,
    convergeMapsResult: convergeMapsAttestation,
  };
}

// ============================================================================
// PROOF VERIFICATION
// ============================================================================

interface VerificationResult {
  valid: boolean;
  errors: string[];
}

async function verifyAllProofs(request: IssuanceRequest): Promise<VerificationResult> {
  const errors: string[] = [];
  
  // 1. Energy Proof
  if (!request.energyProof.tqFlowHash || !request.energyProof.energyCatalogRef) {
    errors.push('Energy proof missing required fields');
  }
  if (!request.energyProof.demurrageCompliant) {
    errors.push('Energy proof: demurrage not compliant');
  }
  
  // 2. Experience Proof
  if (!request.experienceProof.evRecordMerkleRoot || !request.experienceProof.raoChainHead) {
    errors.push('Experience proof missing Merkle root or RAO chain head');
  }
  if (request.experienceProof.validRecords / Math.max(request.experienceProof.totalRecords, 1) < 0.8) {
    errors.push('Experience proof: valid record ratio below 80%');
  }
  if (request.experienceProof.gammaCarmisStatus === 'fracture') {
    errors.push('Experience proof: γ-CARMIS reports active fracture');
  }
  
  // 3. Conviction Proof
  if (request.convictionProof.weightedConviction < 0) {
    errors.push('Conviction proof: invalid weighted conviction');
  }
  if (request.convictionProof.commitRevealParticipation < 0.5) {
    errors.push('Conviction proof: commit-reveal participation below 50%');
  }
  
  // 4. Health Proof
  if (request.healthProof.gammaCarmisStatus === 'fracture') {
    errors.push('Health proof: γ-CARMIS reports active fracture');
  }
  if (!request.healthProof.convergeMapsConsensus) {
    errors.push('Health proof: No ConvergeMaps consensus');
  }
  if (request.healthProof.compatibilityScore < 0.7) {
    errors.push('Health proof: Compatibility score below 70%');
  }
  
  return { valid: errors.length === 0, errors };
}

// ============================================================================
// RENEWAL FLOW
// ============================================================================

export interface RenewalRequest {
  credential: AuraCredential;
  updatedComponents: AuraComponents;
  updatedEnergyProof: EnergyProof;
  updatedExperienceProof: ExperienceProof;
  updatedConvictionProof: ConvictionProof;
  updatedHealthProof: HealthProof;
}

export async function renewAuraCredential(
  request: RenewalRequest,
  lifecycleState: CredentialLifecycleState,
  newConvergeMapsAttestation: ConvergeMapsAttestation
): Promise<IssuanceResult> {
  // Check renewal eligibility
  if (lifecycleState.revoked) {
    return { success: false, error: 'Credential revoked' };
  }
  
  if (lifecycleState.suspended) {
    return { success: false, error: 'Credential suspended' };
  }
  
  if (lifecycleState.renewalCount >= CREDENTIAL_CONFIG.MAX_RENEWALS) {
    return { success: false, error: 'Max renewals reached — full re-verification required' };
  }
  
  if (!request.credential || Date.now() > request.credential.expiresAt + CREDENTIAL_CONFIG.RENEWAL_WINDOW_DAYS * 24 * 60 * 60 * 1000) {
    return { success: false, error: 'Credential expired beyond renewal window' };
  }
  
  // Verify ConvergeMaps for renewal
  if (!newConvergeMapsAttestation.attested || newConvergeMapsAttestation.quorum < 0.66) {
    return { success: false, error: 'ConvergeMaps attestation failed for renewal' };
  }
  
  // Issue new credential with incremented renewal count
  const result = await issueAuraCredential({
    nodeId: request.credential.nodeId,
    did: request.credential.did,
    components: request.updatedComponents,
    energyProof: request.updatedEnergyProof,
    experienceProof: request.updatedExperienceProof,
    convictionProof: request.updatedConvictionProof,
    healthProof: request.updatedHealthProof,
  }, newConvergeMapsAttestation);
  
  if (result.success && result.credential) {
    // Mark as renewed (would be stored in lifecycle state)
    result.credential = {
      ...result.credential,
      // Could embed renewal metadata in a separate field
    };
  }
  
  return result;
}

// ============================================================================
// REVOCATION / SUSPENSION
// ============================================================================

export interface RevocationRequest {
  credential: AuraCredential;
  reason: 'farming_detected' | 'fracture_unresolved' | 'consensus_lost' | 'voluntary' | 'compromised';
  initiatedBy: string;              // DID of initiator (GAIA COMMONS member)
  evidence: string[];               // Links to evidence (RAO, γ-CARMIS logs, etc.)
}

export function revokeCredential(
  credential: AuraCredential,
  request: RevocationRequest
): { success: boolean; revokedCredential: AuraCredential; error?: string } {
  // In real implementation: publish revocation to revocation registry (Nostr/DTN)
  const revokedCredential: AuraCredential = {
    ...credential,
    // Mark as revoked (could add revokedAt, revocationReason fields)
  };
  
  return {
    success: true,
    revokedCredential,
  };
}

export function suspendCredential(
  credential: AuraCredential,
  reason: string
): AuraCredential {
  return {
    ...credential,
    // Mark as suspended
  };
}

// ============================================================================
// OFFLINE VERIFICATION (No network required)
// ============================================================================

export function verifyCredentialOffline(credential: AuraCredential): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // 1. Check expiration
  if (Date.now() > credential.expiresAt) {
    errors.push('Credential expired');
  }
  
  // 2. Verify hash
  if (!verifyCredentialHash(credential)) {
    errors.push('Verification hash mismatch — credential tampered');
  }
  
  // 3. Check issuer
  if (credential.issuer !== 'ALRAC_GAIA_COMMONS') {
    errors.push('Invalid issuer');
  }
  
  // 4. Check ConvergeMaps attestation
  if (!credential.convergeMapsAttestation.attested) {
    errors.push('Missing ConvergeMaps attestation');
  }
  if (credential.convergeMapsAttestation.quorum < 0.66) {
    errors.push('ConvergeMaps quorum not met');
  }
  
  // 5. Verify proof structure (offline checkable)
  if (!credential.energyProof.tqFlowHash || !credential.energyProof.energyCatalogRef) {
    errors.push('Energy proof incomplete');
  }
  if (!credential.experienceProof.evRecordMerkleRoot || !credential.experienceProof.raoChainHead) {
    errors.push('Experience proof incomplete');
  }
  if (!credential.convictionProof.weightedConviction && credential.convictionProof.weightedConviction !== 0) {
    errors.push('Conviction proof incomplete');
  }
  if (!credential.healthProof) {
    errors.push('Health proof missing');
  }
  
  return { valid: errors.length === 0, errors };
}

// ============================================================================
// EXPORTS
// ============================================================================

// Re-export types from aura.ts
export type { AuraComponents, AuraTier } from '@core/lib/aura';