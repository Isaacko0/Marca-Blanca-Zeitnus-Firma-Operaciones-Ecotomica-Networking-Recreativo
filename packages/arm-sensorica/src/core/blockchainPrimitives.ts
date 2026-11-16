// arm-sensorica/src/core/blockchainPrimitives.ts - Cryptographic Primitives (NO tokens)
import { 
  Hash, 
  Signature, 
  Timestamp,
  PublicKey
} from '../types';

import { generateId, now } from '../utils';

// ============================================
// CRYPTOGRAPHIC PRIMITIVES (Sensorica Exploration Phase)
// ============================================

/**
 * Cryptographic primitives for Sensorica OVN
 * Based on Exploration phase: hash functions, hash pointers, digital signatures,
 * public keys as identities, consensus protocols, Byzantine fault tolerance
 * 
 * IMPORTANT: These are CRYPTOGRAPHIC PRIMITIVES ONLY.
 * NO tokens, NO speculation, NO financial instruments.
 * Used for: event chain integrity, governance voting, identity verification.
 */

// ============================================
// HASH FUNCTIONS
// ============================================

export type HashAlgorithm = 'sha256' | 'blake3' | 'sha3-256';

export interface HashFunction {
  algorithm: HashAlgorithm;
  hash(data: Uint8Array | string): Hash;
  hashString(str: string): Hash;
  verify(data: Uint8Array | string, hash: Hash): boolean;
}

export function createHashFunction(algorithm: HashAlgorithm = 'sha256'): HashFunction {
  return {
    algorithm,
    hash(data) {
      const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data;
      // In real impl, would use Web Crypto API or noble-hashes
      const hashValue = simpleHash(bytes);
      return { algorithm, value: hashValue };
    },
    hashString(str) {
      return this.hash(str);
    },
    verify(data, hash) {
      const computed = this.hash(data);
      return computed.value === hash.value;
    }
  };
}

function simpleHash(data: Uint8Array): string {
  // Simplified hash for demonstration - use noble-hashes in production
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    hash = ((hash << 5) - hash) + data[i];
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(64, '0');
}

// ============================================
// HASH POINTERS (Merkle DAG)
// ============================================

export interface HashPointer {
  previousHash: Hash;
  dataHash: Hash;
  timestamp: Timestamp;
}

export interface MerkleNode {
  hash: Hash;
  left?: MerkleNode;
  right?: MerkleNode;
  data?: Uint8Array;
}

export class MerkleDAG {
  private nodes: Map<string, MerkleNode> = new Map();
  private tip: MerkleNode | null = null;

  append(data: Uint8Array): HashPointer {
    const dataHash = createHashFunction().hash(data);
    const previousHash = this.tip?.hash || { algorithm: 'sha256', value: '0'.repeat(64) };
    
    const pointer: HashPointer = {
      previousHash,
      dataHash,
      timestamp: { value: Date.now(), timezone: 'UTC' }
    };

    const newNode: MerkleNode = {
      hash: dataHash,
      data
    };

    if (this.tip) {
      // In real impl, would create proper Merkle tree
      newNode.left = this.tip;
    }
    
    this.tip = newNode;
    this.nodes.set(dataHash.value, newNode);
    
    return pointer;
  }

  getTip(): MerkleNode | null {
    return this.tip;
  }

  verifyChain(): boolean {
    // Verify all pointers link correctly
    return true; // placeholder
  }

  getNode(hash: Hash): MerkleNode | undefined {
    return this.nodes.get(hash.value);
  }
}

// ============================================
// DIGITAL SIGNATURES
// ============================================

export type SignatureAlgorithm = 'ed25519' | 'secp256k1' | 'rsa-pss';

export interface KeyPair {
  publicKey: PublicKey;
  privateKey: Uint8Array;
  algorithm: SignatureAlgorithm;
}

export interface PublicKey {
  algorithm: SignatureAlgorithm;
  key: Uint8Array; // raw public key bytes
  identifier: string; // e.g., "did:key:z6Mk..."
}

export interface SignedData<T> {
  data: T;
  signature: Signature;
  signedAt: Timestamp;
  signer: PublicKey;
}

export interface Signer {
  sign(data: Uint8Array): Promise<Signature>;
  getPublicKey(): PublicKey;
}

export interface Verifier {
  verify(data: Uint8Array, signature: Signature, publicKey: PublicKey): Promise<boolean>;
}

// ============================================
// IDENTITY (Public Keys as Identities)
// ============================================

export interface DecentralizedIdentifier {
  did: string; // did:key:z6Mk... or did:pkh:...
  publicKey: PublicKey;
  controller: string; // DID of controller
  createdAt: Timestamp;
  authentication: PublicKey[];
  assertionMethod: PublicKey[];
  keyAgreement: PublicKey[];
  capabilityInvocation: PublicKey[];
  capabilityDelegation: PublicKey[];
}

export function createDIDFromPublicKey(publicKey: PublicKey): DecentralizedIdentifier {
  const identifier = `did:key:${bytesToBase58(publicKey.key)}`;
  
  return {
    did: identifier,
    publicKey,
    controller: identifier,
    createdAt: { value: Date.now(), timezone: 'UTC' },
    authentication: [publicKey],
    assertionMethod: [publicKey],
    keyAgreement: [publicKey],
    capabilityInvocation: [publicKey],
    capabilityDelegation: [publicKey]
  };
}

function bytesToBase58(bytes: Uint8Array): string {
  // Simplified - use bs58 in production
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

// ============================================
// CONSENSUS PROTOCOLS (Governance)
// ============================================

export type ConsensusAlgorithm = 'raft' | 'paxos' | 'tendermint' | 'threshold-signature';

export interface ConsensusConfig {
  algorithm: ConsensusAlgorithm;
  validators: PublicKey[];
  threshold: number; // e.g., 2/3 for BFT
  blockTime: number; // milliseconds
}

export interface ConsensusProposal<T> {
  id: string;
  proposer: PublicKey;
  payload: T;
  timestamp: Timestamp;
  signatures: Map<string, Signature>; // validator -> signature
}

export interface ConsensusResult<T> {
  accepted: boolean;
  proposal: ConsensusProposal<T>;
  finalizedAt: Timestamp;
  participatingValidators: PublicKey[];
}

export class ConsensusEngine<T> {
  constructor(private config: ConsensusConfig) {}

  async propose(payload: T, proposer: Signer): Promise<ConsensusProposal<T>> {
    const publicKey = await proposer.getPublicKey();
    const proposal: ConsensusProposal<T> = {
      id: generateId('prop'),
      proposer: publicKey,
      payload,
      timestamp: { value: Date.now(), timezone: 'UTC' },
      signatures: new Map()
    };
    return proposal;
  }

  async vote(proposal: ConsensusProposal<T>, voter: Signer, approve: boolean): Promise<void> {
    if (!approve) return; // Only sign if approving
    
    const voterKey = await voter.getPublicKey();
    if (!this.config.validators.some(v => this.keysEqual(v, voterKey))) {
      throw new Error('Not a validator');
    }

    const data = new TextEncoder().encode(JSON.stringify({ id: proposal.id, approve: true }));
    const signature = await proposer.sign(data);
    
    proposal.signatures.set(voterKey.identifier, {
      algorithm: this.config.validators[0].algorithm, // simplified
      value: '',
      publicKey: voterKey.identifier
    });
  }

  async finalize(proposal: ConsensusProposal<T>): Promise<ConsensusResult<T>> {
    const signatures = Array.from(proposal.signatures.values());
    const uniqueValidators = new Set(signatures.map(s => s.publicKey));
    
    if (uniqueValidators.size < this.config.threshold) {
      return {
        accepted: false,
        proposal,
        finalizedAt: { value: Date.now(), timezone: 'UTC' },
        participatingValidators: Array.from(uniqueValidators)
      };
    }

    return {
      accepted: true,
      proposal,
      finalizedAt: { value: Date.now(), timezone: 'UTC' },
      participatingValidators: Array.from(uniqueValidators)
    };
  }

  private keysEqual(a: PublicKey, b: PublicKey): boolean {
    return a.identifier === b.identifier;
  }
}

// ============================================
// BYZANTINE FAULT TOLERANCE
// ============================================

export interface BFTConfig {
  validators: PublicKey[];
  threshold: number; // minimum signatures required
  viewTimeout: number; // milliseconds
}

export interface BFTMessage {
  type: 'pre-prepare' | 'prepare' | 'commit' | 'view-change';
  view: number;
  sequence: number;
  payload: unknown;
  sender: PublicKey;
  signature: Signature;
  timestamp: Timestamp;
}

export class BFT Engine {
  constructor(private config: BFTConfig) {}

  async broadcast(message: Omit<BFTMessage, 'sender' | 'signature' | 'timestamp'>, signer: Signer): Promise<BFTMessage> {
    const publicKey = await signer.getPublicKey();
    const data = new TextEncoder().encode(JSON.stringify({ ...message, sender: publicKey }));
    const signature = await signer.sign(data);
    
    return {
      ...message,
      sender: publicKey,
      signature,
      timestamp: { value: Date.now(), timezone: 'UTC' }
    };
  }

  async verifyMessage(message: BFTMessage): Promise<boolean> {
    // Verify signature
    // Check sender is validator
    // Check view/sequence
    return true; // placeholder
  }

  async checkQuorum(messages: BFTMessage[]): Promise<boolean> {
    const validMessages = messages.filter(m => this.verifyMessage(m));
    const uniqueSenders = new Set(validMessages.map(m => m.sender.identifier));
    return uniqueSenders.size >= this.config.threshold;
  }
}

// ============================================
// EVENT CHAIN INTEGRITY (Sensorica Event Sourcing)
// ============================================

export interface EventChainEntry {
  eventId: string;
  eventType: string;
  payload: unknown;
  author: PublicKey;
  timestamp: Timestamp;
  previousHash: Hash;
  signature: Signature;
  hash: Hash;
}

export class EventChain {
  private entries: EventChainEntry[] = [];
  private hashFunction: HashFunction;

  constructor(hashFunction: HashFunction = createHashFunction()) {
    this.hashFunction = hashFunction;
  }

  append(entry: Omit<EventChainEntry, 'hash' | 'previousHash'>): EventChainEntry {
    const previousHash = this.entries.length > 0 
      ? this.entries[this.entries.length - 1].hash 
      : { algorithm: 'sha256', value: '0'.repeat(64) };
    
    const data = new TextEncoder().encode(JSON.stringify({
      ...entry,
      previousHash
    }));
    
    const hash = this.hashFunction.hash(data);
    
    const newEntry: EventChainEntry = {
      ...entry,
      previousHash,
      hash
    };
    
    this.entries.push(newEntry);
    return newEntry;
  }

  verify(): boolean {
    for (let i = 0; i < this.entries.length; i++) {
      const entry = this.entries[i];
      const expectedPrevious = i === 0 
        ? { algorithm: 'sha256', value: '0'.repeat(64) }
        : this.entries[i - 1].hash;
      
      if (entry.previousHash.value !== expectedPrevious.value) {
        return false;
      }
      
      // Verify hash
      const data = new TextEncoder().encode(JSON.stringify({
        eventId: entry.eventId,
        eventType: entry.eventType,
        payload: entry.payload,
        author: entry.author,
        timestamp: entry.timestamp,
        previousHash: entry.previousHash,
        signature: entry.signature
      }));
      
      // In real impl, would verify hash matches
    }
    return true;
  }

  getEntries(): EventChainEntry[] {
    return [...this.entries];
  }

  getLatest(): EventChainEntry | null {
    return this.entries[this.entries.length - 1] || null;
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

export function createKeyPair(algorithm: SignatureAlgorithm = 'ed25519'): KeyPair {
  // In real impl, would use noble-ed25519 or @noble/secp256k1
  return {
    publicKey: {
      algorithm,
      key: new Uint8Array(32), // placeholder
      identifier: `did:key:z6Mk${generateId('key')}`
    },
    privateKey: new Uint8Array(32), // placeholder
    algorithm
  };
}

export function signData(data: Uint8Array, privateKey: Uint8Array, algorithm: SignatureAlgorithm): Signature {
  // In real impl, would use noble-ed25519.sign or @noble/secp256k1.sign
  return {
    algorithm,
    value: '',
    publicKey: ''
  };
}

export function verifySignature(data: Uint8Array, signature: Signature, publicKey: PublicKey): boolean {
  // In real impl, would use noble-ed25519.verify or @noble/secp256k1.verify
  return true; // placeholder
}

export function createTimestamp(): Timestamp {
  return { value: Date.now(), timezone: 'UTC' };
}

import { generateId } from '../utils';