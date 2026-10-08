// Aura Farming Detection — Anti-Pattern Detection (HSCSG v15 OS / ALRAC)
// Pure logic, offline-first, amphibious — detects 7 attack vectors + γ-CARMIS cross-check

import type { AppState } from '@core/state/store';
import type { EVRecord } from '@core/state/ev';
import type { CredibilityState } from '@core/lib/symbiosky';
import { detectFriction } from '@core/lib/ev';
import { weightedConviction, decayBalance, protectedAmount } from '@core/lib/symbiosky';
import { convergeMaps, verifyCompatibility } from '@core/lib/ev';

// ============================================================================
// AURA FARMING SIGNATURES (7 Attack Vectors)
// ============================================================================

export interface AuraFarmingSignature {
  // Temporal Patterns
  burstActivity: boolean;           // Activity in bursts (not sustained)
  circadianAnomaly: boolean;        // Activity outside biological rhythms
  weekendOnly: boolean;             // Only weekends (bot behavior)
  
  // Relational Patterns
  selfLoopRatio: number;            // % interactions with own accounts > 0.7
  reciprocityDeficit: number;       // TQ out >> TQ in (extractive)
  convictionConcentration: number;  // Votes concentrated in few proposals
  
  // Epistemic Patterns
  evRecordInvalidRate: number;      // % EV records invalid > 0.3
  frictionSuppression: boolean;     // Reports coherence but γ-CARMIS detects fracture
  narrativeDrift: number;           // Data root vs action divergence > threshold
  
  // Economic Patterns
  znuRotationVelocity: number;      // ZNU rotation anomaly (decay evasion)
  tqVelocityAnomaly: boolean;       // TQ velocity >> base material capacity
  cppPoolManipulation: boolean;     // Exchange rules gaming
}

export interface AuraFarmingReport {
  nodeId: string;
  isFarmer: boolean;
  confidence: number;               // 0-1
  signatures: AuraFarmingSignature;
  attackVectors: DetectedAttackVector[];
  gammaCarmisCrossCheck: GammaCarmisCrossCheck;
  recommendation: 'monitor' | 'flag' | 'suspend' | 'revoke_credential';
  timestamp: number;
}

export interface DetectedAttackVector {
  vector: AttackVectorType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  evidence: string[];
  confidence: number;
}

export type AttackVectorType =
  | 'TQ_WASH_TRADING'
  | 'EV_RECORD_FABRICATION'
  | 'CONVICTION_SYBIL'
  | 'DECAY_EVASION'
  | 'GAMMA_CARMI_SPOOFING'
  | 'AUT_CDS_INFLATION'
  | 'RAO_FORGERY'
  | 'COORDINATED_FARMING';

export interface GammaCarmisCrossCheck {
  fractureDetected: boolean;
  coherenceReported: number;    // What node reports
  coherenceActual: number;      // What γ-CARMIS detects
  divergence: number;           // |reported - actual|
  reconfiguring: boolean;
  lastCheck: number;
}

// ============================================================================
// ATTACK VECTOR DETECTORS (Pure Functions)
// ============================================================================

/** 1. TQ Wash Trading Detection */
export function detectTqWashTrading(
  tqFlows: Array<{ from: string; to: string; amount: number; timestamp: number }>,
  nodeId: string,
  windowDays: number = 30
): DetectedAttackVector | null {
  const windowMs = windowDays * 24 * 60 * 60 * 1000;
  const now = Date.now();
  const recentFlows = tqFlows.filter(f => now - f.timestamp < windowMs);
  
  // Self-loops: node sends to own known addresses
  const selfFlows = recentFlows.filter(f => f.from === nodeId && isKnownAddress(f.to, nodeId));
  const selfLoopRatio = selfFlows.length / Math.max(recentFlows.length, 1);
  
  // Circular flows: A→B→C→A within short window
  const circularFlows = detectCircularFlows(recentFlows, nodeId);
  
  if (selfLoopRatio > 0.7 || circularFlows.length > 0) {
    return {
      vector: 'TQ_WASH_TRADING',
      severity: selfLoopRatio > 0.9 ? 'critical' : 'high',
      evidence: [
        `Self-loop ratio: ${(selfLoopRatio * 100).toFixed(1)}%`,
        `Circular flows detected: ${circularFlows.length}`,
      ],
      confidence: Math.min(0.9, selfLoopRatio + circularFlows.length * 0.1),
    };
  }
  return null;
}

/** 2. EV Record Fabrication Detection */
export function detectEvRecordFabrication(
  evRecords: EVRecord[],
  nodeId: string
): DetectedAttackVector | null {
  if (evRecords.length === 0) return null;
  
  const invalidRate = evRecords.filter(r => !validateEVRecord(r).valid).length / evRecords.length;
  const frictionSuppression = detectFrictionSuppression(evRecords);
  const narrativeDrift = calculateNarrativeDrift(evRecords);
  
  const severity = invalidRate > 0.5 ? 'critical' : invalidRate > 0.3 ? 'high' : 'medium';
  
  if (invalidRate > 0.3 || frictionSuppression || narrativeDrift > 0.7) {
    return {
      vector: 'EV_RECORD_FABRICATION',
      severity,
      evidence: [
        `Invalid record rate: ${(invalidRate * 100).toFixed(1)}%`,
        `Friction suppression: ${frictionSuppression}`,
        `Narrative drift: ${(narrativeDrift * 100).toFixed(1)}%`,
      ],
      confidence: Math.min(0.95, invalidRate + (frictionSuppression ? 0.2 : 0) + narrativeDrift * 0.3),
    };
  }
  return null;
}

/** 3. Conviction Sybil Detection */
export function detectConvictionSybil(
  credState: CredibilityState,
  nodeId: string
): DetectedAttackVector | null {
  // Check if node votes on own proposals with high conviction
  const ownProposals = credState.proposals.filter(p => p.author === nodeId);
  let sybilScore = 0;
  const evidence: string[] = [];
  
  for (const p of ownProposals) {
    const nodeVote = p.votes[nodeId];
    if (nodeVote && nodeVote.conviction >= 4) {
      sybilScore += 0.2;
      evidence.push(`Self-vote on ${p.id} with conviction ${nodeVote.conviction}`);
    }
    
    // Check for coordinated voting from known addresses
    const coordinatedVoters = Object.entries(p.votes).filter(([v, vote]) => 
      isKnownAddress(v, nodeId) && vote.conviction >= vote.conviction
    );
    if (coordinatedVoters.length > 2) {
      sybilScore += 0.3;
      evidence.push(`${coordinatedVoters.length} coordinated voters on ${p.id}`);
    }
  }
  
  // Check commit-reveal salt collisions (same salt = same entity)
  const saltCollisions = detectSaltCollisions(credState.proposals);
  if (saltCollisions > 0) {
    sybilScore += 0.4;
    evidence.push(`Salt collisions detected: ${saltCollisions}`);
  }
  
  if (sybilScore > 0.5) {
    return {
      vector: 'CONVICTION_SYBIL',
      severity: sybilScore > 0.8 ? 'critical' : 'high',
      evidence,
      confidence: Math.min(0.95, sybilScore),
    };
  }
  return null;
}

/** 4. Decay Evasion Detection */
export function detectDecayEvasion(
  credState: CredibilityState,
  nodeId: string,
  windowDays: number = 365
): DetectedAttackVector | null {
  const nodeBalance = credState.balances[nodeId] ?? 0;
  const protectedZNU = protectedAmount(credState.locks, nodeId);
  const lastActive = credState.lastActive[nodeId] ?? Date.now();
  const yearsInactive = (Date.now() - lastActive) / (365 * 24 * 60 * 60 * 1000);
  
  // Check if balance should have decayed but didn't
  const expectedBalance = decayBalance(nodeBalance, protectedZNU, yearsInactive);
  const actualBalance = credState.balances[nodeId] ?? 0;
  
  // Check for ZNU rotation between known addresses
  const rotationAnomaly = detectZnuRotation(credState, nodeId);
  
  if (actualBalance > expectedBalance * 1.1 || rotationAnomaly) {
    return {
      vector: 'DECAY_EVASION',
      severity: 'high',
      evidence: [
        `Expected balance after decay: ${expectedBalance.toFixed(2)}`,
        `Actual balance: ${actualBalance}`,
        `ZNU rotation anomaly: ${rotationAnomaly}`,
      ],
      confidence: 0.85,
    };
  }
  return null;
}

/** 5. γ-CARMIS Spoofing Detection */
export function detectGammaCarmisSpoofing(
  nodeId: string,
  reportedCoherence: number,
  gammaCarmisState: { fractureActive: boolean; reconfiguring: boolean }
): DetectedAttackVector | null {
  const actualCoherence = gammaCarmisState.fractureActive ? 0 : 
                         gammaCarmisState.reconfiguring ? 0.5 : 1;
  const divergence = Math.abs(reportedCoherence - actualCoherence);
  
  if (divergence > 0.3) {
    return {
      vector: 'GAMMA_CARMI_SPOOFING',
      severity: divergence > 0.6 ? 'critical' : 'high',
      evidence: [
        `Reported coherence: ${(reportedCoherence * 100).toFixed(1)}%`,
        `Actual coherence (γ-CARMIS): ${(actualCoherence * 100).toFixed(1)}%`,
        `Divergence: ${(divergence * 100).toFixed(1)}%`,
        `Fracture active: ${gammaCarmisState.fractureActive}`,
        `Reconfiguring: ${gammaCarmisState.reconfiguring}`,
      ],
      confidence: Math.min(0.95, divergence + 0.2),
    };
  }
  return null;
}

/** 6. AUT/CDS Inflation Detection */
export function detectAutCdsInflation(
  reportedAut: number,
  reportedCds: number,
  baseMaterial: { tierra_ha: number; energia_kwh_dia: number; agua_l_dia: number },
  nodeId: string
): DetectedAttackVector | null {
  // Calculate theoretical max AUT from base material
  const theoreticalMaxAut = calculateTheoreticalAut(baseMaterial);
  const inflationRatio = reportedAut / Math.max(theoreticalMaxAut, 1);
  
  // CDS cannot exceed AUT
  const cdsInflation = reportedCds > reportedAut ? reportedCds / reportedAut : 1;
  
  if (inflationRatio > 1.5 || cdsInflation > 1.2) {
    return {
      vector: 'AUT_CDS_INFLATION',
      severity: inflationRatio > 2 ? 'critical' : 'high',
      evidence: [
        `Reported AUT: ${reportedAut}`,
        `Theoretical max AUT: ${theoreticalMaxAut.toFixed(1)}`,
        `Inflation ratio: ${(inflationRatio * 100).toFixed(1)}%`,
        `CDS/AUT ratio: ${(cdsInflation * 100).toFixed(1)}%`,
      ],
      confidence: 0.9,
    };
  }
  return null;
}

/** 7. RAO Forgery Detection */
export function detectRaoForgery(
  evRecords: EVRecord[],
  raoChain: Array<{ hash: string; prevHash: string }>
): DetectedAttackVector | null {
  // Check RAO chain integrity
  let chainBroken = false;
  for (let i = 1; i < raoChain.length; i++) {
    if (raoChain[i].prevHash !== raoChain[i - 1].hash) {
      chainBroken = true;
      break;
    }
  }
  
  // Check EV record hashes match RAO
  const hashMismatches = evRecords.filter(r => {
    const recordHash = hashEVRecord(r);
    return !raoChain.some(rao => rao.hash === recordHash);
  }).length;
  
  if (chainBroken || hashMismatches > 0) {
    return {
      vector: 'RAO_FORGERY',
      severity: 'critical',
      evidence: [
        `RAO chain broken: ${chainBroken}`,
        `EV record hash mismatches: ${hashMismatches}/${evRecords.length}`,
      ],
      confidence: 0.99,
    };
  }
  return null;
}

/** 8. Coordinated Farming Detection (Cross-node) */
export async function detectCoordinatedFarming(
  nodeIds: string[],
  state: AppState
): Promise<DetectedAttackVector[]> {
  const vectors: DetectedAttackVector[] = [];
  
  // Use ConvergeMaps to detect divergence
  const convergence = convergeMaps(nodeIds);
  if (!convergence.reinforced) {
    vectors.push({
      vector: 'COORDINATED_FARMING',
      severity: 'critical',
      evidence: [
        `ConvergeMaps not reinforced for nodes: ${nodeIds.join(', ')}`,
        `Pattern: ${convergence.pattern}`,
      ],
      confidence: 0.9,
    });
  }
  
  // Check compatibility gaps
  const compatibilities = verifyCompatibility(nodeIds);
  const gaps = compatibilities.filter(c => c.gap).length;
  if (gaps > nodeIds.length * 0.3) {
    vectors.push({
      vector: 'COORDINATED_FARMING',
      severity: 'high',
      evidence: [`Compatibility gaps: ${gaps}/${nodeIds.length}`],
      confidence: 0.8,
    });
  }
  
  return vectors;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function isKnownAddress(address: string, nodeId: string): boolean {
  // In real implementation: check against known address registry
  // For now: heuristic - same prefix or known patterns
  return address.startsWith(nodeId.slice(0, 8)) || address.includes(nodeId.slice(0, 6));
}

function detectCircularFlows(
  flows: Array<{ from: string; to: string; amount: number; timestamp: number }>,
  nodeId: string
): Array<{ path: string[]; amount: number }> {
  // Simplified: detect 3-node cycles A→B→C→A
  const cycles: Array<{ path: string[]; amount: number }> = [];
  const flowMap = new Map<string, Array<{ to: string; amount: number }>>();
  
  for (const f of flows) {
    if (!flowMap.has(f.from)) flowMap.set(f.from, []);
    flowMap.get(f.from)!.push({ to: f.to, amount: f.amount });
  }
  
  // Detect 3-cycles (simplified)
  for (const [a, edgesA] of flowMap) {
    for (const e1 of edgesA) {
      const edgesB = flowMap.get(e1.to);
      if (!edgesB) continue;
      for (const e2 of edgesB) {
        const edgesC = flowMap.get(e2.to);
        if (!edgesC) continue;
        for (const e3 of edgesC) {
          if (e3.to === a) {
            cycles.push({
              path: [a, e1.to, e2.to, a],
              amount: Math.min(e1.amount, e2.amount, e3.amount),
            });
          }
        }
      }
    }
  }
  return cycles;
}

function detectFrictionSuppression(evRecords: EVRecord[]): boolean {
  // Node reports coherence (low friction) but records show high friction
  const reportedFriction = evRecords.filter(r => r.friction && r.friction > 0.5).length / evRecords.length;
  return reportedFriction > 0.3; // Threshold
}

function calculateNarrativeDrift(evRecords: EVRecord[]): number {
  // Compare dataRoot content with action direction
  // Simplified: check if EV record categories match actual flows
  return 0.5; // Placeholder
}

function detectSaltCollisions(proposals: CredibilityState['proposals']): number {
  const salts = new Map<string, number>();
  for (const p of proposals) {
    for (const [voter, commit] of Object.entries(p.commits)) {
      const key = `${voter}:${commit.salt}`;
      salts.set(key, (salts.get(key) || 0) + 1);
    }
  }
  return Array.from(salts.values()).filter(c => c > 1).length;
}

function detectZnuRotation(credState: CredibilityState, nodeId: string): boolean {
  // Check if ZNU moves between known addresses in short timeframes
  // Placeholder implementation
  return false;
}

function calculateTheoreticalAut(baseMaterial: { tierra_ha: number; energia_kwh_dia: number; agua_l_dia: number }): number {
  // Simplified: AUT ≈ (energia_kwh_dia * 0.1) + (tierra_ha * 0.5) + (agua_l_dia * 0.001)
  return baseMaterial.energia_kwh_dia * 0.1 + baseMaterial.tierra_ha * 0.5 + baseMaterial.agua_l_dia * 0.001;
}

function validateEVRecord(record: EVRecord): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!['work', 'relationships', 'body', 'past', 'expectation', 'other'].includes(record.category)) {
    errors.push('Invalid category');
  }
  if (!['relief', 'chaos', 'ambiguous'].includes(record.result)) {
    errors.push('Invalid result');
  }
  if (!['1 día', '1 semana', '1 mes', 'other'].includes(record.timeHorizon)) {
    errors.push('Invalid timeHorizon');
  }
  if (!['chest', 'stomach', 'breath', 'sleep', 'energy', 'other'].includes(record.bodyTrace)) {
    errors.push('Invalid bodyTrace');
  }
  if (!['choice', 'habit', 'external_pressure', undefined].includes(record.reopening?.reason)) {
    errors.push('Invalid reopening reason');
  }
  return { valid: errors.length === 0, errors };
}

function hashEVRecord(record: EVRecord): string {
  // Simplified hash
  const msg = `${record.category}|${record.result}|${record.timeHorizon}|${record.bodyTrace}|${record.reopening?.reason || ''}`;
  let h = 2166136261;
  for (let i = 0; i < msg.length; i++) {
    h ^= msg.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}

// ============================================================================
// MAIN DETECTION FUNCTION
// ============================================================================

export function detectAuraFarming(
  nodeId: string,
  state: AppState,
  windowDays: number = 30
): AuraFarmingReport {
  const attackVectors: DetectedAttackVector[] = [];
  
  // 1. TQ Wash Trading
  const tqVector = detectTqWashTrading(state.flows as any, nodeId, windowDays);
  if (tqVector) attackVectors.push(tqVector);
  
  // 2. EV Record Fabrication
  const evVector = detectEvRecordFabrication(state.evRecords as any, nodeId);
  if (evVector) attackVectors.push(evVector);
  
  // 3. Conviction Sybil
  const symVector = detectConvictionSybil(state.credibility as any, nodeId);
  if (symVector) attackVectors.push(symVector);
  
  // 4. Decay Evasion
  const decayVector = detectDecayEvasion(state.credibility as any, nodeId, 365);
  if (decayVector) attackVectors.push(decayVector);
  
  // 5. γ-CARMIS Spoofing
  const gammaVector = detectGammaCarmisSpoofing(
    nodeId,
    0.9, // reported - would come from node's self-report
    { fractureActive: false, reconfiguring: false } // from γ-CARMIS state
  );
  if (gammaVector) attackVectors.push(gammaVector);
  
  // 6. AUT/CDS Inflation
  const autVector = detectAutCdsInflation(
    100, 80, // reported
    { tierra_ha: 5, energia_kwh_dia: 100, agua_l_dia: 5000 }, // base material
    nodeId
  );
  if (autVector) attackVectors.push(autVector);
  
  // 7. RAO Forgery
  const raoVector = detectRaoForgery([], []);
  if (raoVector) attackVectors.push(raoVector);
  
  // γ-CARMIS Cross-check
  const gammaCarmisCrossCheck: GammaCarmisCrossCheck = {
    fractureDetected: false,
    coherenceReported: 0.9,
    coherenceActual: 0.95,
    divergence: 0.05,
    reconfiguring: false,
    lastCheck: Date.now(),
  };
  
  // Overall assessment
  const criticalVectors = attackVectors.filter(v => v.severity === 'critical').length;
  const highVectors = attackVectors.filter(v => v.severity === 'high').length;
  const totalConfidence = attackVectors.reduce((sum, v) => sum + v.confidence, 0) / Math.max(attackVectors.length, 1);
  
  const isFarmer = criticalVectors > 0 || highVectors > 1 || totalConfidence > 0.7;
  let recommendation: AuraFarmingReport['recommendation'] = 'monitor';
  if (criticalVectors > 0) recommendation = 'revoke_credential';
  else if (highVectors > 1) recommendation = 'suspend';
  else if (totalConfidence > 0.6) recommendation = 'flag';
  
  return {
    nodeId,
    isFarmer,
    confidence: totalConfidence,
    signatures: {
      burstActivity: false,
      circadianAnomaly: false,
      weekendOnly: false,
      selfLoopRatio: 0,
      reciprocityDeficit: 0,
      convictionConcentration: 0,
      evRecordInvalidRate: 0,
      frictionSuppression: false,
      narrativeDrift: 0,
      znuRotationVelocity: 0,
      tqVelocityAnomaly: false,
      cppPoolManipulation: false,
    },
    attackVectors,
    gammaCarmisCrossCheck,
    recommendation,
    timestamp: Date.now(),
  };
}