// src/core/lib/tq-closer-attestation.ts
// Closer Attestation RFC (TDF Track 1 Fix)
// Implements: Attestation creation, verification, nonce management, oracle signatures, revocation

import type { CloserVillage, CloserAgent } from './tq-oasa';
import type { TQTransaction } from './tq';

// ============================================================================
// CLOSER ATTESTATION TYPES
// ============================================================================

export type AttestationType = 
  | 'village-onboarding'      // Initial village registration
  | 'village-renewal'         // Annual compliance renewal
  | 'agent-registration'      // Closer Agent registration
  | 'fund-application'        // Village Fund application
  | 'regeneration-milestone'  // OASA principle milestone achieved
  | 'governance-action'       // Major governance decision executed
  | 'treasury-operation'      // Treasury allocation executed
  | 'federation-treaty'       // Federation treaty signed
  | 'dispute-resolution'      // Dispute resolved
  | 'emergency-action';       // Emergency guardian action

export interface CloserAttestation {
  id: string;
  type: AttestationType;
  subjectType: 'village' | 'agent' | 'fund' | 'proposal' | 'treaty' | 'dispute';
  subjectId: string;
  subjectName: string;
  nonce: number;
  data: CloserAttestationData;
  signatures: CloserAttestationSignature[];
  status: 'pending' | 'verified' | 'rejected' | 'revoked' | 'expired';
  createdAt: number;
  expiresAt: number;
  verifiedAt?: number;
  revokedAt?: number;
  revocationReason?: string;
  raoCredentialId: string;
}

export interface CloserAttestationData {
  // Village onboarding/renewal
  landTitle?: {
    verified: boolean;
    uri: string;
    hash: string;
    registrar: string;
    expiryDate?: number;
  };
  lease?: {
    verified: boolean;
    yearsRemaining: number;
    uri: string;
    hash: string;
  };
  regenerationPlan?: {
    uri: string;
    hash: string;
    principlesCovered: number; // 0-7
    targetsMeasurable: number; // 0-7
    version: number;
  };
  stewardshipCommitment?: {
    signed: boolean;
    signers: string[];
    requiredSigners: number;
    uri: string;
    hash: string;
  };
  openBooks?: {
    financial: boolean;
    ecological: boolean;
    governance: boolean;
    uris: { financial?: string; ecological?: string; governance?: string };
    hashes: { financial?: string; ecological?: string; governance?: string };
  };
  closerPlatform?: {
    agentRegistered: boolean;
    agentId: string;
    activeCapabilities: string[];
    domain: string;
  };

  // Agent registration
  agentCapabilities?: string[];
  agentInfrastructure?: 'local' | 'cloud' | 'hybrid';
  agentSovereignty?: 'full' | 'shared' | 'hosted';

  // Fund application
  fundCohort?: number;
  matchingPool?: number;
  endowmentPrizes?: number;
  tokenRaiseType?: 'governance-and-use-rights';
  followOnCapital?: number;

  // Regeneration milestone
  principle?: number; // 1-7
  metricName?: string;
  targetValue?: number;
  achievedValue?: number;
  measurementMethod?: string;
  evidenceUris?: string[];
  evidenceHashes?: string[];

  // Governance action
  proposalId?: string;
  proposalTitle?: string;
  votesFor?: number;
  votesAgainst?: number;
  quorumMet?: boolean;
  thresholdMet?: boolean;
  executionPayloads?: string[];

  // Treasury operation
  allocationId?: string;
  amount?: number;
  currency?: string;
  purpose?: string;
  multisigSigners?: string[];
  thresholdMet?: boolean;

  // Federation treaty
  treatyId?: string;
  signatories?: string[];
  terms?: {
    resourceSharing: boolean;
    governanceAlignment: boolean;
    mutualAid: boolean;
    disputeResolution: string;
  };

  // Dispute resolution
  disputeId?: string;
  resolution?: string;
  parties?: string[];
  mediator?: string;

  // Emergency action
  guardianId?: string;
  vetoedProposalId?: string;
  ecologicalRisk?: string;
}

export interface CloserAttestationSignature {
  signerDid: string;
  signerRole: 'oracle' | 'guardian' | 'verifier' | 'subject' | 'witness';
  signature: string;
  algorithm: 'ed25519' | 'secp256k1' | 'bls';
  timestamp: number;
  nonce: number;
}

export interface CloserOracle {
  id: string;
  name: string;
  did: string;
  publicKey: string;
  capabilities: string[];
  stake: number;
  reputation: number;
  status: 'active' | 'inactive' | 'slashed';
  lastAttestation: number;
}

export interface AttestationRequest {
  id: string;
  requesterDid: string;
  type: AttestationType;
  subjectType: CloserAttestation['subjectType'];
  subjectId: string;
  subjectName: string;
  data: CloserAttestationData;
  requiredSignatures: number;
  requiredRoles: CloserAttestationSignature['signerRole'][];
  oracleId?: string;
  status: 'open' | 'collecting' | 'verified' | 'rejected' | 'expired';
  signatures: CloserAttestationSignature[];
  createdAt: number;
  expiresAt: number;
}

export interface NonceState {
  subjectId: string;
  subjectType: string;
  currentNonce: number;
  usedNonces: number[];
  lastUpdated: number;
}

// ============================================================================
// CLOSER ATTESTATION ENGINE
// ============================================================================

export class CloserAttestationEngine {
  private attestations: Map<string, CloserAttestation> = new Map();
  private requests: Map<string, AttestationRequest> = new Map();
  private oracles: Map<string, CloserOracle> = new Map();
  private nonces: Map<string, NonceState> = new Map();

  // Default oracle (in production: multiple oracles with different specializations)
  private defaultOracle: CloserOracle = {
    id: 'closer-oracle-main',
    name: 'Closer Main Oracle',
    did: 'did:closer:oracle:main',
    publicKey: '0x...', // Would be actual public key
    capabilities: ['land-registry', 'document-verification', 'platform-monitoring', 'data-feeds', 'governance-verification'],
    stake: 1_000_000, // ZNU staked
    reputation: 0.98,
    status: 'active',
    lastAttestation: 0,
  };

  constructor() {
    this.oracles.set(this.defaultOracle.id, this.defaultOracle);
  }

  // ---------------------------------------------------------------------------
  // NONCE MANAGEMENT (RFC: prevent replay attacks)
  // ---------------------------------------------------------------------------

  getNextNonce(subjectId: string, subjectType: string): number {
    const key = `${subjectType}:${subjectId}`;
    const state = this.nonces.get(key) || { subjectId, subjectType, currentNonce: 0, usedNonces: [], lastUpdated: 0 };
    state.currentNonce++;
    state.usedNonces.push(state.currentNonce);
    state.lastUpdated = Date.now();
    this.nonces.set(key, state);
    return state.currentNonce;
  }

  verifyNonce(subjectId: string, subjectType: string, nonce: number): boolean {
    const key = `${subjectType}:${subjectId}`;
    const state = this.nonces.get(key);
    if (!state) return nonce === 1; // First attestation
    return nonce === state.currentNonce && !state.usedNonces.slice(0, -1).includes(nonce);
  }

  getNonceState(subjectId: string, subjectType: string): NonceState | undefined {
    return this.nonces.get(`${subjectType}:${subjectId}`);
  }

  // ---------------------------------------------------------------------------
  // ORACLE MANAGEMENT
  // ---------------------------------------------------------------------------

  registerOracle(oracle: Omit<CloserOracle, 'lastAttestation'>): boolean {
    if (this.oracles.has(oracle.id)) return false;
    this.oracles.set(oracle.id, { ...oracle, lastAttestation: 0 });
    return true;
  }

  getOracle(id: string): CloserOracle | undefined {
    return this.oracles.get(id);
  }

  listActiveOracles(): CloserOracle[] {
    return Array.from(this.oracles.values()).filter(o => o.status === 'active');
  }

  // ---------------------------------------------------------------------------
  // ATTESTATION CREATION
  // ---------------------------------------------------------------------------

  createAttestation(attestation: Omit<CloserAttestation, 'id' | 'nonce' | 'signatures' | 'status' | 'createdAt' | 'expiresAt' | 'raoCredentialId'> & { id?: string }): CloserAttestation {
    const nonce = this.getNextNonce(attestation.subjectId, attestation.subjectType);
    
    const newAttestation: CloserAttestation = {
      ...attestation,
      id: attestation.id || `attest_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      nonce,
      signatures: [],
      status: 'pending',
      createdAt: Date.now(),
      expiresAt: Date.now() + 86400000 * 365, // 1 year default
      raoCredentialId: `rao_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    };

    this.attestations.set(newAttestation.id, newAttestation);
    return newAttestation;
  }

  // ---------------------------------------------------------------------------
  // ATTESTATION VERIFICATION (Oracle Signing)
  // ---------------------------------------------------------------------------

  async signAttestation(
    attestationId: string,
    oracleId: string,
    signerRole: CloserAttestationSignature['signerRole'] = 'oracle'
  ): Promise<{ success: boolean; signature?: CloserAttestationSignature; error?: string }> {
    const attestation = this.attestations.get(attestationId);
    if (!attestation) return { success: false, error: 'Attestation not found' };
    if (attestation.status !== 'pending') return { success: false, error: `Invalid status: ${attestation.status}` };

    const oracle = this.oracles.get(oracleId);
    if (!oracle) return { success: false, error: 'Oracle not found' };
    if (oracle.status !== 'active') return { success: false, error: 'Oracle not active' };

    // Verify nonce
    if (!this.verifyNonce(attestation.subjectId, attestation.subjectType, attestation.nonce)) {
      return { success: false, error: 'Invalid nonce (replay attack detected)' };
    }

    // Verify attestation data based on type
    const verification = await this.verifyAttestationData(attestation);
    if (!verification.valid) {
      return { success: false, error: `Data verification failed: ${verification.errors.join(', ')}` };
    }

    // Create signature (in production: actual cryptographic signing)
    const message = this.createSigningMessage(attestation);
    const signature = this.mockSign(oracle.id, message, oracle.publicKey);

    const sig: CloserAttestationSignature = {
      signerDid: oracle.did,
      signerRole,
      signature,
      algorithm: 'ed25519',
      timestamp: Date.now(),
      nonce: attestation.nonce,
    };

    attestation.signatures.push(sig);
    oracle.lastAttestation = Date.now();

    // Check if we have enough signatures
    const requiredSigs = this.getRequiredSignatures(attestation.type);
    if (attestation.signatures.length >= requiredSigs) {
      attestation.status = 'verified';
      attestation.verifiedAt = Date.now();
    }

    return { success: true, signature: sig };
  }

  private getRequiredSignatures(type: AttestationType): number {
    const requirements: Record<AttestationType, number> = {
      'village-onboarding': 3,      // Oracle + Guardian + Verifier
      'village-renewal': 2,         // Oracle + Verifier
      'agent-registration': 2,      // Oracle + Verifier
      'fund-application': 3,        // Oracle + Guardian + Verifier
      'regeneration-milestone': 2,  // Oracle + Verifier
      'governance-action': 2,       // Oracle + Verifier
      'treasury-operation': 3,      // Oracle + Guardian + Verifier
      'federation-treaty': 3,       // Oracle + Guardian + Verifier
      'dispute-resolution': 2,      // Oracle + Verifier
      'emergency-action': 2,        // Guardian + Oracle
    };
    return requirements[type] || 2;
  }

  private async verifyAttestationData(attestation: CloserAttestation): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];
    const data = attestation.data;

    switch (attestation.type) {
      case 'village-onboarding':
      case 'village-renewal':
        if (!data.landTitle?.verified && !data.lease?.verified) {
          errors.push('Either land title or long-term lease must be verified');
        }
        if (!data.regenerationPlan || data.regenerationPlan.principlesCovered < 7) {
          errors.push('Regeneration plan must cover all 7 OASA principles');
        }
        if (!data.stewardshipCommitment?.signed) {
          errors.push('Stewardship commitment must be signed');
        }
        if (!data.openBooks?.financial || !data.openBooks?.ecological || !data.openBooks?.governance) {
          errors.push('All three book categories (financial, ecological, governance) must be open');
        }
        if (!data.closerPlatform?.agentRegistered) {
          errors.push('Closer Agent must be registered and active');
        }
        break;

      case 'agent-registration':
        if (!data.agentCapabilities || data.agentCapabilities.length === 0) {
          errors.push('Agent must have at least one capability');
        }
        const requiredCaps = ['bookings', 'governance', 'tokens', 'resource-tracking'];
        const missing = requiredCaps.filter(c => !data.agentCapabilities?.includes(c));
        if (missing.length > 0) {
          errors.push(`Missing required capabilities: ${missing.join(', ')}`);
        }
        break;

      case 'fund-application':
        if (!data.fundCohort || data.fundCohort < 1) {
          errors.push('Valid fund cohort required');
        }
        if (data.tokenRaiseType !== 'governance-and-use-rights') {
          errors.push('Token raise must be governance-and-use-rights only');
        }
        break;

      case 'regeneration-milestone':
        if (!data.principle || data.principle < 1 || data.principle > 7) {
          errors.push('Valid OASA principle number (1-7) required');
        }
        if (data.achievedValue === undefined || data.targetValue === undefined) {
          errors.push('Both target and achieved values required');
        }
        if (!data.measurementMethod) {
          errors.push('Measurement method required');
        }
        break;

      case 'governance-action':
        if (!data.proposalId || !data.proposalTitle) {
          errors.push('Proposal ID and title required');
        }
        if (!data.quorumMet || !data.thresholdMet) {
          errors.push('Both quorum and threshold must be met');
        }
        break;

      case 'treasury-operation':
        if (!data.allocationId || !data.amount || data.amount <= 0) {
          errors.push('Valid allocation ID and positive amount required');
        }
        if (!data.multisigSigners || data.multisigSigners.length < 2) {
          errors.push('At least 2 multisig signers required');
        }
        if (!data.thresholdMet) {
          errors.push('Multisig threshold not met');
        }
        break;

      case 'federation-treaty':
        if (!data.treatyId || !data.signatories || data.signatories.length < 2) {
          errors.push('Treaty ID and at least 2 signatories required');
        }
        break;

      case 'emergency-action':
        if (!data.guardianId || !data.vetoedProposalId || !data.ecologicalRisk) {
          errors.push('Guardian ID, vetoed proposal ID, and ecological risk required');
        }
        break;
    }

    return { valid: errors.length === 0, errors };
  }

  private createSigningMessage(attestation: CloserAttestation): string {
    // Deterministic message for signing
    const parts = [
      attestation.id,
      attestation.type,
      attestation.subjectType,
      attestation.subjectId,
      attestation.nonce.toString(),
      JSON.stringify(attestation.data),
      attestation.raoCredentialId,
    ];
    return parts.join('|');
  }

  private mockSign(signerId: string, message: string, publicKey: string): string {
    // In production: actual Ed25519 signing
    // This is a deterministic mock for development
    const hash = this.simpleHash(message + signerId + publicKey);
    return `0x${hash}`;
  }

  private simpleHash(input: string): string {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(64, '0');
  }

  // ---------------------------------------------------------------------------
  // ATTESTATION REQUEST FLOW (Multi-party)
  // ---------------------------------------------------------------------------

  createAttestationRequest(request: Omit<AttestationRequest, 'id' | 'signatures' | 'status' | 'createdAt' | 'expiresAt'> & { id?: string }): AttestationRequest {
    const newRequest: AttestationRequest = {
      ...request,
      id: request.id || `req_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      signatures: [],
      status: 'open',
      createdAt: Date.now(),
      expiresAt: Date.now() + 86400000 * 7, // 7 days to collect signatures
    };

    this.requests.set(newRequest.id, newRequest);
    return newRequest;
  }

  addSignatureToRequest(requestId: string, signature: CloserAttestationSignature): boolean {
    const request = this.requests.get(requestId);
    if (!request || request.status !== 'open' && request.status !== 'collecting') return false;
    if (Date.now() > request.expiresAt) {
      request.status = 'expired';
      return false;
    }

    // Check role requirements
    if (!request.requiredRoles.includes(signature.signerRole)) return false;

    // Check duplicate
    if (request.signatures.some(s => s.signerDid === signature.signerDid)) return false;

    request.signatures.push(signature);
    request.status = 'collecting';

    // Check if complete
    if (request.signatures.length >= request.requiredSignatures) {
      this.finalizeRequest(requestId);
    }

    return true;
  }

  private finalizeRequest(requestId: string): void {
    const request = this.requests.get(requestId);
    if (!request) return;

    // Create final attestation
    const attestation = this.createAttestation({
      type: request.type,
      subjectType: request.subjectType,
      subjectId: request.subjectId,
      subjectName: request.subjectName,
      data: request.data,
    });

    // Copy signatures
    attestation.signatures = request.signatures;
    attestation.status = 'verified';
    attestation.verifiedAt = Date.now();

    request.status = 'verified';
  }

  // ---------------------------------------------------------------------------
  // REVOCATION
  // ---------------------------------------------------------------------------

  revokeAttestation(attestationId: string, revokerDid: string, reason: string): boolean {
    const attestation = this.attestations.get(attestationId);
    if (!attestation) return false;
    if (attestation.status === 'revoked') return false;

    // Only oracle, guardian, or subject can revoke
    const subjectProfile = this.getSubjectProfile(attestation.subjectType, attestation.subjectId);
    const isAuthorized = attestation.signatures.some(s => s.signerDid === revokerDid) ||
                        subjectProfile?.did === revokerDid;

    if (!isAuthorized) return false;

    attestation.status = 'revoked';
    attestation.revokedAt = Date.now();
    attestation.revocationReason = reason;
    return true;
  }

  private getSubjectProfile(subjectType: string, subjectId: string): { did: string } | null {
    // Would fetch from appropriate engine
    return { did: subjectId };
  }

  // ---------------------------------------------------------------------------
  // VERIFICATION HELPERS
  // ---------------------------------------------------------------------------

  verifyAttestation(attestationId: string): { valid: boolean; errors: string[]; attestation?: CloserAttestation } {
    const attestation = this.attestations.get(attestationId);
    if (!attestation) return { valid: false, errors: ['Attestation not found'] };

    const errors: string[] = [];

    // Check status
    if (attestation.status === 'revoked') errors.push('Attestation revoked');
    if (attestation.status === 'expired') errors.push('Attestation expired');
    if (attestation.status === 'rejected') errors.push('Attestation rejected');
    if (attestation.status === 'pending') errors.push('Attestation not yet verified');

    // Check expiration
    if (Date.now() > attestation.expiresAt) errors.push('Attestation expired');

    // Check nonce
    if (!this.verifyNonce(attestation.subjectId, attestation.subjectType, attestation.nonce)) {
      errors.push('Invalid nonce');
    }

    // Check signatures
    const requiredSigs = this.getRequiredSignatures(attestation.type);
    if (attestation.signatures.length < requiredSigs) {
      errors.push(`Insufficient signatures: ${attestation.signatures.length}/${requiredSigs}`);
    }

    // Verify each signature (mock)
    for (const sig of attestation.signatures) {
      const oracle = this.oracles.get(sig.signerDid) || Array.from(this.oracles.values()).find(o => o.did === sig.signerDid);
      if (!oracle) {
        errors.push(`Unknown signer: ${sig.signerDid}`);
      } else if (oracle.status !== 'active') {
        errors.push(`Signer not active: ${sig.signerDid}`);
      }
      // In production: verify cryptographic signature
    }

    return { valid: errors.length === 0, errors, attestation };
  }

  // ---------------------------------------------------------------------------
  // QUERY METHODS
  // ---------------------------------------------------------------------------

  getAttestation(id: string): CloserAttestation | undefined {
    return this.attestations.get(id);
  }

  getAttestationsForSubject(subjectType: string, subjectId: string): CloserAttestation[] {
    return Array.from(this.attestations.values()).filter(
      a => a.subjectType === subjectType && a.subjectId === subjectId
    );
  }

  getAttestationsByType(type: AttestationType): CloserAttestation[] {
    return Array.from(this.attestations.values()).filter(a => a.type === type);
  }

  getPendingRequests(): AttestationRequest[] {
    return Array.from(this.requests.values()).filter(r => r.status === 'open' || r.status === 'collecting');
  }

  getRequest(id: string): AttestationRequest | undefined {
    return this.requests.get(id);
  }

  // ---------------------------------------------------------------------------
  // INTEGRATION: VILLAGE ONBOARDING FLOW
  // ---------------------------------------------------------------------------

  async createVillageOnboardingAttestation(village: CloserVillage, data: {
    landTitleVerified: boolean;
    landTitleUri: string;
    landTitleHash: string;
    regenerationPlanUri: string;
    planHash: string;
    principlesCovered: number;
    targetsMeasurable: number;
    stewardshipSigned: boolean;
    signers: string[];
    requiredSigners: number;
    commitmentUri: string;
    commitmentHash: string;
    financialOpen: boolean;
    financialUri: string;
    financialHash: string;
    ecologicalOpen: boolean;
    ecologicalUri: string;
    ecologicalHash: string;
    governanceOpen: boolean;
    governanceUri: string;
    governanceHash: string;
    agentRegistered: boolean;
    agentId: string;
    activeCapabilities: string[];
    domain: string;
  }): Promise<CloserAttestation> {
    const attestation = this.createAttestation({
      type: 'village-onboarding',
      subjectType: 'village',
      subjectId: village.id,
      subjectName: village.name,
      data: {
        landTitle: {
          verified: data.landTitleVerified,
          uri: data.landTitleUri,
          hash: data.landTitleHash,
          registrar: 'on-chain-registry',
        },
        regenerationPlan: {
          uri: data.regenerationPlanUri,
          hash: data.planHash,
          principlesCovered: data.principlesCovered,
          targetsMeasurable: data.targetsMeasurable,
          version: 1,
        },
        stewardshipCommitment: {
          signed: data.stewardshipSigned,
          signers: data.signers,
          requiredSigners: data.requiredSigners,
          uri: data.commitmentUri,
          hash: data.commitmentHash,
        },
        openBooks: {
          financial: data.financialOpen,
          ecological: data.ecologicalOpen,
          governance: data.governanceOpen,
          uris: { financial: data.financialUri, ecological: data.ecologicalUri, governance: data.governanceUri },
          hashes: { financial: data.financialHash, ecological: data.ecologicalHash, governance: data.governanceHash },
        },
        closerPlatform: {
          agentRegistered: data.agentRegistered,
          agentId: data.agentId,
          activeCapabilities: data.activeCapabilities,
          domain: data.domain,
        },
      },
    });

    // Auto-sign with oracle
    await this.signAttestation(attestation.id, this.defaultOracle.id, 'oracle');

    return attestation;
  }

  // ---------------------------------------------------------------------------
  // INTEGRATION: REGENERATION MILESTONE
  // ---------------------------------------------------------------------------

  async createRegenerationMilestoneAttestation(villageId: string, data: {
    principle: number;
    metricName: string;
    targetValue: number;
    achievedValue: number;
    measurementMethod: string;
    evidenceUris: string[];
    evidenceHashes: string[];
  }): Promise<CloserAttestation> {
    const village = this.getVillageProfile(villageId);
    if (!village) throw new Error('Village not found');

    const attestation = this.createAttestation({
      type: 'regeneration-milestone',
      subjectType: 'village',
      subjectId: villageId,
      subjectName: village.name,
      data: {
        principle: data.principle,
        metricName: data.metricName,
        targetValue: data.targetValue,
        achievedValue: data.achievedValue,
        measurementMethod: data.measurementMethod,
        evidenceUris: data.evidenceUris,
        evidenceHashes: data.evidenceHashes,
      },
    });

    await this.signAttestation(attestation.id, this.defaultOracle.id, 'oracle');
    return attestation;
  }

  private getVillageProfile(villageId: string): { name: string } | null {
    // Would integrate with OASA engine
    return { name: `Village ${villageId}` };
  }

  // ---------------------------------------------------------------------------
  // RFC COMPLIANCE: ATTESTATION FORMAT
  // ---------------------------------------------------------------------------

  // RFC: Closer Attestation Format v1.0
  // 
  // Header:
  //   id: string (attest_{timestamp}_{random})
  //   type: AttestationType (enum)
  //   subjectType: enum
  //   subjectId: string
  //   subjectName: string
  //   nonce: number (monotonic per subject)
  //   raoCredentialId: string (RAO anchor)
  //
  // Data: CloserAttestationData (type-specific)
  //
  // Signatures: CloserAttestationSignature[]
  //   signerDid: string
  //   signerRole: enum
  //   signature: string (Ed25519)
  //   algorithm: 'ed25519'
  //   timestamp: number
  //   nonce: number (must match attestation.nonce)
  //
  // Status: enum
  // Timestamps: createdAt, expiresAt, verifiedAt?, revokedAt?
  //
  // Verification Rules:
  // 1. Nonce must be current (prevents replay)
  // 2. Required signatures per type met
  // 3. All signers active and not slashed
  // 4. Data passes type-specific validation
  // 5. Not expired (1 year default)
  // 6. Not revoked
  //
  // Revocation:
  // - Authorized: oracle, guardian, subject
  // - Immediate effect
  // - Reason recorded
  // - Cannot be un-revoked (new attestation required)

  exportAttestationRFC(): string {
    return `# Closer Attestation RFC v1.0

## Format
\`\`\`typescript
interface CloserAttestation {
  id: string;                    // attest_{timestamp}_{random}
  type: AttestationType;         // village-onboarding | village-renewal | agent-registration | fund-application | regeneration-milestone | governance-action | treasury-operation | federation-treaty | dispute-resolution | emergency-action
  subjectType: 'village' | 'agent' | 'fund' | 'proposal' | 'treaty' | 'dispute';
  subjectId: string;
  subjectName: string;
  nonce: number;                 // Monotonic per subject
  data: CloserAttestationData;   // Type-specific payload
  signatures: CloserAttestationSignature[];
  status: 'pending' | 'verified' | 'rejected' | 'revoked' | 'expired';
  createdAt: number;
  expiresAt: number;             // Default: 1 year
  verifiedAt?: number;
  revokedAt?: number;
  revocationReason?: string;
  raoCredentialId: string;       // RAO anchor
}

interface CloserAttestationSignature {
  signerDid: string;
  signerRole: 'oracle' | 'guardian' | 'verifier' | 'subject' | 'witness';
  signature: string;             // Ed25519
  algorithm: 'ed25519';
  timestamp: number;
  nonce: number;                 // Must match attestation.nonce
}
\`\`\`

## Required Signatures by Type
| Type | Required | Roles |
|------|----------|-------|
| village-onboarding | 3 | oracle, guardian, verifier |
| village-renewal | 2 | oracle, verifier |
| agent-registration | 2 | oracle, verifier |
| fund-application | 3 | oracle, guardian, verifier |
| regeneration-milestone | 2 | oracle, verifier |
| governance-action | 2 | oracle, verifier |
| treasury-operation | 3 | oracle, guardian, verifier |
| federation-treaty | 3 | oracle, guardian, verifier |
| dispute-resolution | 2 | oracle, verifier |
| emergency-action | 2 | guardian, oracle |

## Verification Rules
1. **Nonce Monotonicity**: Each subject (village/agent) has a monotonically increasing nonce. Replay attacks prevented.
2. **Signature Threshold**: Minimum signatures per type must be met.
3. **Signer Validity**: All signers must be active oracles/guardians/verifiers (not slashed).
4. **Data Validation**: Type-specific validation (land title, regeneration plan, etc.)
5. **Expiration**: Default 1 year, configurable per type.
6. **Revocation**: Authorized parties can revoke with reason. Irreversible.

## Integration with TDF Track 1
Closer Attestation IS Track 1 of Traditional Dream Factory verification.
- Automated oracle verification
- Land title/lease on-chain registry
- Regeneration plan document hashes
- Stewardship commitment signatures
- Open books transparency check
- Closer platform agent registration

## RAO Anchoring
Every attestation includes \`raoCredentialId\` linking to ERC-8004 credential with:
- Provenance (issuer)
- Emitter (oracle/guardian)
- Permissions (attestation scope)
- State (valid/revoked)
- Revocation (if applicable)

## Emergency Actions (Guardian Veto)
Per OASA Constitution Article 4.4 and 10.4:
- Guardians of Nature can veto proposals threatening ecological integrity
- Emergency attestation created with guardian + oracle signatures
- 2 signatures required (fast-track)
- Auto-expires in 30 days unless ratified by General Meeting
`;
  }
}

// ============================================================================
// FACTORY
// ============================================================================

export function createCloserAttestationEngine(): CloserAttestationEngine {
  return new CloserAttestationEngine();
}

// ============================================================================
// EXPORTS
// ============================================================================

export const closerAttestationEngine = new CloserAttestationEngine();
export default closerAttestationEngine;