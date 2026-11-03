// ie-attestation.ts — Registro de atestaciones soulbound offline-first (EAS-compatible)
// Basado en contracts/src/AttestationRegistry.sol adaptado a HSCSG (localStorage + sync opcional)

import { IEAttestation, IESchemaKey, AttestationPayloads } from './ie-types';

const STORAGE_KEY = 'ie_attestations_v1';

// Nonce global para unicidad (en producción: blockchain)
let _nonce = 0;

/**
 * Genera UID único para atestación (keccak256 compatible)
 * Formato: keccak256(schema + attester + recipient + chainId + nonce)
 */
function _generateUID(schema: string, attester: string, recipient: string): string {
  const chainId = '31337'; // Anvil local default
  const nonce = _nonce++;
  const input = `${schema}:${attester}:${recipient}:${chainId}:${nonce}`;
  // Simulación keccak256 (en producción: ethers.keccak256)
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) - hash) + input.charCodeAt(i);
    hash |= 0;
  }
  return '0x' + Math.abs(hash).toString(16).padStart(64, '0') + Date.now().toString(16).padStart(16, '0');
}

/**
 * Crea una atestación soulbound no transferible
 * @param schema Tipo de atestación
 * @param attester DID del atestador
 * @param recipient DID del sujeto (dueño de la reputación)
 * @param data Payload tipado según schema
 * @returns Atestación creada
 */
export function ieCreateAttestation<T extends IESchemaKey>(
  schema: T,
  attester: string,
  recipient: string,
  data: AttestationPayloads[T]
): IEAttestation {
  const uid = _generateUID(schema, attester, recipient);
  const attestation: IEAttestation = {
    uid,
    schema,
    attester,
    recipient,
    time: Date.now(),
    revoked: false,
    data: JSON.stringify(data),
  };
  
  // Persistir en localStorage
  _saveAttestation(attestation);
  
  return attestation;
}

/**
 * Revoca una atestación (solo el atestador original puede)
 * @param uid UID de la atestación
 * @param attester DID del atestador
 * @returns true si se revocó
 */
export function ieRevokeAttestation(uid: string, attester: string): boolean {
  const attestations = _loadAllAttestations();
  const attestation = attestations[uid];
  
  if (!attestation) return false;
  if (attestation.attester !== attester) return false;
  if (attestation.revoked) return false;
  
  attestation.revoked = true;
  _saveAttestation(attestation);
  return true;
}

/**
 * Obtiene una atestación por UID
 */
export function ieGetAttestation(uid: string): IEAttestation | undefined {
  const attestations = _loadAllAttestations();
  return attestations[uid];
}

/**
 * Obtiene todas las atestaciones recibidas por un recipient (su reputación soulbound)
 * @param recipient DID del sujeto
 * @returns Array de atestaciones no revocadas
 */
export function ieGetReceived(recipient: string): IEAttestation[] {
  const attestations = _loadAllAttestations();
  return Object.values(attestations)
    .filter(a => a.recipient === recipient && !a.revoked)
    .sort((a, b) => b.time - a.time);
}

/**
 * Obtiene atestaciones por schema y recipient
 */
export function ieGetReceivedBySchema(recipient: string, schema: IESchemaKey): IEAttestation[] {
  return ieGetReceived(recipient).filter(a => a.schema === schema);
}

/**
 * Calcula score de reputación simple: cuenta atestaciones no revocadas
 * @param recipient DID del sujeto
 * @returns Número de atestaciones válidas
 */
export function ieReputationScore(recipient: string): number {
  return ieGetReceived(recipient).length;
}

/**
 * Calcula score de reputación por schema
 */
export function ieReputationScoreBySchema(recipient: string): Record<IESchemaKey, number> {
  const received = ieGetReceived(recipient);
  const scores: Record<IESchemaKey, number> = {
    contribution: 0,
    consensus: 0,
    role: 0,
    impact: 0,
  };
  for (const a of received) {
    scores[a.schema]++;
  }
  return scores;
}

/**
 * Verifica si un usuario tiene atestación de un tipo específico para un desafío
 */
export function ieHasAttestationFor(
  recipient: string,
  schema: IESchemaKey,
  challengeId: string
): boolean {
  const received = ieGetReceivedBySchema(recipient, schema);
  for (const a of received) {
    try {
      const data = JSON.parse(a.data);
      if (data.challengeId === challengeId) return true;
    } catch {
      continue;
    }
  }
  return false;
}

/**
 * Obtiene todas las atestaciones (para admin/debug)
 */
export function ieGetAllAttestations(): IEAttestation[] {
  return Object.values(_loadAllAttestations());
}

// ============================================================================
// Persistence (localStorage)
// ============================================================================

function _loadAllAttestations(): Record<string, IEAttestation> {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function _saveAttestation(attestation: IEAttestation): void {
  if (typeof window === 'undefined') return;
  try {
    const attestations = _loadAllAttestations();
    attestations[attestation.uid] = attestation;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(attestations));
  } catch (e) {
    console.warn('[ie-attestation] Failed to save:', e);
  }
}

/**
 * Migra atestaciones de v1 a v2 (si cambia schema)
 */
export function ieMigrateAttestations(): void {
  if (typeof window === 'undefined') return;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    const attestations = JSON.parse(stored);
    // Migración futura aquí
    localStorage.setItem(STORAGE_KEY, JSON.stringify(attestations));
  } catch (e) {
    console.warn('[ie-attestation] Migration failed:', e);
  }
}

/**
 * Limpia todas las atestaciones (para testing/reset)
 */
export function ieClearAllAttestations(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  _nonce = 0;
}

/**
 * Exporta atestaciones para backup/sync
 */
export function ieExportAttestations(): string {
  return JSON.stringify(_loadAllAttestations(), null, 2);
}

/**
 * Importa atestaciones (sync desde blockchain/backup)
 */
export function ieImportAttestations(json: string): number {
  try {
    const attestations = JSON.parse(json);
    let count = 0;
    for (const [uid, attestation] of Object.entries(attestations)) {
      if (attestation && typeof attestation === 'object' && 'uid' in attestation) {
        _saveAttestation(attestation as IEAttestation);
        count++;
      }
    }
    return count;
  } catch {
    return 0;
  }
}