// ie-dv-tests.ts — Tests DV (Deterministic Verification) del Protocolo IE
// Calibración exacta vs prototipo WhatMatters ($288,008 → 1 RCE = $1,000.03 en L5)
// Ejecutar: npm run test:ie-dv (sin blockchain, sin red, determinista)

import {
  iePhysicalPersons,
  iePositionsTotal,
  ieCoefficient,
  ieOneRce,
  iePayout,
  ieRCETable,
  ieFeeBps,
  ieSplit,
  ieVerifyConservation,
} from './ie-rce-math';

import {
  ieCalculateWeightClass,
  ieCalculateStakeBonus,
  ieCalculateGiveBonus,
  ieCalculateEffectiveWeight,
  ieCalculateA3,
  ieCalculatePayouts,
  ieVerifyConservation as ieVerifyConservationProto,
  ieSimulateGrowth,
  ieValidateTree,
} from './ie-protocol';

import { IEChallenge, IEPosition, IEWeightClass } from './ie-types';

// ============================================================================
// CONSTANTES DE CALIBRACIÓN (Prototipo WhatMatters)
// ============================================================================

const PROTOTYPE_FUND = 288_008_000_000n; // $288,008 en 6 decimales

// Valores esperados "Valor 1 RCE" en centavos USD (del test Solidity)
const EXPECTED_ONE_RCE_CENTS: Record<number, number> = {
  1: 9600267,   // $96,002.67
  2: 2618255,   // $26,182.55
  3: 872752,    // $8,727.52
  4: 290917,    // $2,909.17
  5: 100003,    // $1,000.03 ← CALIBRACIÓN EXACTA
  6: 33334,     // $333.34
  7: 11228,     // $112.28
  8: 3743,      // $37.43
  9: 1247,      // $12.47
  10: 416,      // $4.16
};

// Pesos nivel 5 en centavos (floor)
const EXPECTED_WEIGHT_L5 = {
  full: 100002,  // $1,000.02
  low: 66668,    // $666.68
  mid: 33334,    // $333.34
};

// ============================================================================
// TESTS DV RCE MATH
// ============================================================================

export function dvTestPhysicalPersons(): { pass: boolean; details: string } {
  const tests = [
    { level: 1, expected: 3n },
    { level: 2, expected: 9n },
    { level: 3, expected: 27n },
    { level: 5, expected: 243n },
    { level: 10, expected: 59049n },
    { level: 21, expected: 10460353203n },
  ];
  
  for (const t of tests) {
    const result = iePhysicalPersons(t.level);
    if (result !== t.expected) {
      return { pass: false, details: `physicalPersons(${t.level}) = ${result}, expected ${t.expected}` };
    }
  }
  return { pass: true, details: 'physicalPersons: all levels match' };
}

export function dvTestPositionsTotal(): { pass: boolean; details: string } {
  const tests = [
    { level: 1, expected: 3n },
    { level: 2, expected: 12n },
    { level: 3, expected: 39n },
    { level: 4, expected: 120n },
    { level: 5, expected: 363n },
    { level: 10, expected: 88572n },
    { level: 21, expected: 15690529803n },
  ];
  
  for (const t of tests) {
    const result = iePositionsTotal(t.level);
    if (result !== t.expected) {
      return { pass: false, details: `positionsTotal(${t.level}) = ${result}, expected ${t.expected}` };
    }
  }
  return { pass: true, details: 'positionsTotal: all levels match' };
}

export function dvTestOneRceMatchesPrototype(): { pass: boolean; details: string } {
  const errors: string[] = [];
  
  for (let level = 1; level <= 10; level++) {
    const oneRce = ieOneRce(PROTOTYPE_FUND, level); // base units (6 decimales)
    const cents = Number(oneRce / 10_000n); // a centavos USD (floor)
    const expected = EXPECTED_ONE_RCE_CENTS[level];
    const diff = cents > expected ? cents - expected : expected - cents;
    
    if (diff > 1) {
      errors.push(`L${level}: got ${cents}¢, expected ${expected}¢ (diff ${diff}¢)`);
    }
  }
  
  if (errors.length > 0) {
    return { pass: false, details: `oneRce prototype mismatch: ${errors.join('; ')}` };
  }
  return { pass: true, details: 'oneRce: matches prototype within 1 cent tolerance' };
}

export function dvTestWeightClassesLevel5(): { pass: boolean; details: string } {
  const full = iePayout(PROTOTYPE_FUND, 5, 3n);
  const low = iePayout(PROTOTYPE_FUND, 5, 2n);
  const mid = iePayout(PROTOTYPE_FUND, 5, 1n);
  
  const fullCents = Number(full / 10_000n);
  const lowCents = Number(low / 10_000n);
  const midCents = Number(mid / 10_000n);
  
  const errors: string[] = [];
  if (fullCents !== EXPECTED_WEIGHT_L5.full) errors.push(`full: ${fullCents}¢ vs ${EXPECTED_WEIGHT_L5.full}¢`);
  if (lowCents !== EXPECTED_WEIGHT_L5.low) errors.push(`low: ${lowCents}¢ vs ${EXPECTED_WEIGHT_L5.low}¢`);
  if (midCents !== EXPECTED_WEIGHT_L5.mid) errors.push(`mid: ${midCents}¢ vs ${EXPECTED_WEIGHT_L5.mid}¢`);
  
  // Verificar proporciones 3:2:1 (con tolerancia floor 1 unidad)
  if (full !== ieOneRce(PROTOTYPE_FUND, 5)) errors.push('full != oneRce');
  if (Math.abs(Number(low - 2n * mid)) > 1) errors.push('low != 2*mid');
  if (Math.abs(Number(full - 3n * mid)) > 1) errors.push('full != 3*mid');
  
  if (errors.length > 0) {
    return { pass: false, details: `weight classes L5: ${errors.join('; ')}` };
  }
  return { pass: true, details: 'weight classes L5: match prototype (floor 1 cent)' };
}

export function dvTestConservation(): { pass: boolean; details: string } {
  // Test con posiciones simuladas
  const positions: IEPosition[] = [
    { id: '1', challengeId: 'ch1', holder: 'a', parentId: '0', depth: 1, childCount: 2, isCoordinator: true, stake: 0n, giveReceived: 0n, weightClass: 'full', effectiveWeight: 3n, createdAt: 0, updatedAt: 0 },
    { id: '2', challengeId: 'ch1', holder: 'b', parentId: '1', depth: 2, childCount: 0, isCoordinator: false, stake: 0n, giveReceived: 0n, weightClass: 'low', effectiveWeight: 2n, createdAt: 0, updatedAt: 0 },
    { id: '3', challengeId: 'ch1', holder: 'c', parentId: '1', depth: 2, childCount: 0, isCoordinator: false, stake: 0n, giveReceived: 0n, weightClass: 'low', effectiveWeight: 2n, createdAt: 0, updatedAt: 0 },
    { id: '4', challengeId: 'ch1', holder: 'd', parentId: '2', depth: 3, childCount: 0, isCoordinator: false, stake: 0n, giveReceived: 0n, weightClass: 'low', effectiveWeight: 2n, createdAt: 0, updatedAt: 0 },
    { id: '5', challengeId: 'ch1', holder: 'e', parentId: '2', depth: 3, childCount: 0, isCoordinator: false, stake: 0n, giveReceived: 0n, weightClass: 'low', effectiveWeight: 2n, createdAt: 0, updatedAt: 0 },
    { id: '6', challengeId: 'ch1', holder: 'f', parentId: '3', depth: 3, childCount: 0, isCoordinator: false, stake: 0n, giveReceived: 0n, weightClass: 'low', effectiveWeight: 2n, createdAt: 0, updatedAt: 0 },
    { id: '7', challengeId: 'ch1', holder: 'g', parentId: '3', depth: 3, childCount: 0, isCoordinator: false, stake: 0n, giveReceived: 0n, weightClass: 'low', effectiveWeight: 2n, createdAt: 0, updatedAt: 0 },
  ];
  
  const tranche = 100_000_000n; // 100 USDC
  const payouts = ieCalculatePayouts(positions, tranche);
  const verification = ieVerifyConservationProto(payouts, tranche);
  
  if (!verification.valid) {
    return { pass: false, details: `Conservation failed: distributed ${verification.distributed}, tranche ${tranche}, dust ${verification.dust}` };
  }
  
  // Verificar que A3 = 3 + 2*6 = 15
  const a3 = ieCalculateA3(positions);
  if (a3 !== 15n) {
    return { pass: false, details: `A3 = ${a3}, expected 15` };
  }
  
  return { pass: true, details: `Conservation OK: distributed ${verification.distributed}/${tranche}, dust ${verification.dust}, A3=${a3}` };
}

export function dvTestRCETable(): { pass: boolean; details: string } {
  const table = ieRCETable(PROTOTYPE_FUND, 5);
  
  if (table.length !== 5) {
    return { pass: false, details: `Table length ${table.length} != 5` };
  }
  
  // Verificar nivel 5
  const l5 = table[4];
  if (l5.level !== 5) return { pass: false, details: 'L5 level mismatch' };
  if (l5.persons !== 243n) return { pass: false, details: `L5 persons ${l5.persons} != 243` };
  if (l5.positions !== 363n) return { pass: false, details: `L5 positions ${l5.positions} != 363` };
  if (l5.coefficient !== 288n) return { pass: false, details: `L5 coefficient ${l5.coefficient} != 288` };
  
  const fullCents = Number(l5.full / 10_000n);
  if (fullCents !== 100002) return { pass: false, details: `L5 full ${fullCents}¢ != 100002¢` };
  
  return { pass: true, details: 'RCETable structure correct, L5 matches prototype' };
}

// ============================================================================
// TESTS DV PROTOCOL FEE
// ============================================================================

export function dvTestFeeSchedule(): { pass: boolean; details: string } {
  const tests = [
    { amount: 1_000_000_000n, expectedBps: 1000n },      // 1 USDC -> 10%
    { amount: 10_000_000_000n, expectedBps: 1000n },    // 10 USDC -> 10%
    { amount: 50_000_000_000n, expectedBps: 700n },     // 50 USDC -> 7%
    { amount: 100_000_000_000n, expectedBps: 700n },    // 100 USDC -> 7%
    { amount: 500_000_000_000n, expectedBps: 400n },    // 500 USDC -> 4%
    { amount: 1_000_000_000_000n, expectedBps: 400n },  // 1M USDC -> 4%
    { amount: 5_000_000_000_000n, expectedBps: 200n },  // 5M USDC -> 2%
    { amount: 10_000_000_000_000n, expectedBps: 200n }, // 10M USDC -> 2%
    { amount: 50_000_000_000_000n, expectedBps: 100n }, // 50M USDC -> 1%
  ];
  
  for (const t of tests) {
    const bps = ieFeeBps(t.amount);
    if (bps !== t.expectedBps) {
      return { pass: false, details: `feeBps(${t.amount}) = ${bps}, expected ${t.expectedBps}` };
    }
  }
  
  // Test split conservation
  for (const t of tests) {
    const { fee, net } = ieSplit(t.amount);
    if (fee + net !== t.amount) {
      return { pass: false, details: `split conservation failed for ${t.amount}: ${fee}+${net} != ${t.amount}` };
    }
  }
  
  return { pass: true, details: 'Fee schedule and split conservation: all tiers match' };
}

// ============================================================================
// TESTS DV PROTOCOL LOGIC
// ============================================================================

export function dvTestWeightClassRules(): { pass: boolean; details: string } {
  const testCases: { pos: Partial<IEPosition>; expected: IEWeightClass }[] = [
    { pos: { depth: 1, isCoordinator: false, childCount: 0 }, expected: 'full' },  // seed
    { pos: { depth: 2, isCoordinator: true, childCount: 0 }, expected: 'full' },   // coordinator
    { pos: { depth: 2, isCoordinator: false, childCount: 0 }, expected: 'low' },   // leaf
    { pos: { depth: 3, isCoordinator: false, childCount: 0 }, expected: 'low' },   // leaf
    { pos: { depth: 2, isCoordinator: false, childCount: 2 }, expected: 'mid' },   // intermediate
    { pos: { depth: 3, isCoordinator: false, childCount: 1 }, expected: 'mid' },   // intermediate
  ];
  
  for (const tc of testCases) {
    const pos = tc.pos as IEPosition;
    const result = ieCalculateWeightClass(pos);
    if (result !== tc.expected) {
      return { pass: false, details: `weightClass(depth=${pos.depth}, coord=${pos.isCoordinator}, children=${pos.childCount}) = ${result}, expected ${tc.expected}` };
    }
  }
  return { pass: true, details: 'Weight class rules: all cases match' };
}

export function dvTestStakeBonus(): { pass: boolean; details: string } {
  const tests = [
    { stake: 0n, expected: 0n },
    { stake: 500_000_000n, expected: 0n },           // < 1000
    { stake: 1_000_000_000n, expected: 1n },         // 1000
    { stake: 5_000_000_000n, expected: 5n },         // 5000
    { stake: 6_000_000_000n, expected: 6n },         // 6000 = MAX
    { stake: 10_000_000_000n, expected: 6n },        // 10000 > MAX → capped
  ];
  
  for (const t of tests) {
    const result = ieCalculateStakeBonus(t.stake);
    if (result !== t.expected) {
      return { pass: false, details: `stakeBonus(${t.stake}) = ${result}, expected ${t.expected}` };
    }
  }
  return { pass: true, details: 'Stake bonus: linear up to cap 6' };
}

export function dvTestGiveBonus(): { pass: boolean; details: string } {
  const tests = [
    { give: 0n, expected: 0n },
    { give: 10n, expected: 0n },          // < 20
    { give: 20n, expected: 1n },          // 20
    { give: 80n, expected: 4n },          // 80
    { give: 100n, expected: 5n },         // 100 = MAX
    { give: 200n, expected: 5n },         // > MAX → capped
  ];
  
  for (const t of tests) {
    const result = ieCalculateGiveBonus(t.give);
    if (result !== t.expected) {
      return { pass: false, details: `giveBonus(${t.give}) = ${result}, expected ${t.expected}` };
    }
  }
  return { pass: true, details: 'Give bonus: linear up to cap 5' };
}

export function dvTestEffectiveWeight(): { pass: boolean; details: string } {
  const position: IEPosition = {
    id: 'test', challengeId: 'ch1', holder: 'a', parentId: '0', depth: 1,
    childCount: 2, isCoordinator: true, stake: 2_000_000_000n, giveReceived: 40n,
    weightClass: 'full', effectiveWeight: 0n, createdAt: 0, updatedAt: 0,
  };
  
  // full=3 + stakeBonus(2) + giveBonus(2) = 7
  const weight = ieCalculateEffectiveWeight(position, position.giveReceived);
  if (weight !== 7n) {
    return { pass: false, details: `effectiveWeight = ${weight}, expected 7 (3+2+2)` };
  }
  return { pass: true, details: 'Effective weight = class + stakeBonus + giveBonus' };
}

export function dvTestCalculateA3(): { pass: boolean; details: string } {
  const positions: IEPosition[] = [
    { id: '1', challengeId: 'ch1', holder: 'a', parentId: '0', depth: 1, childCount: 2, isCoordinator: true, stake: 0n, giveReceived: 0n, weightClass: 'full', effectiveWeight: 3n, createdAt: 0, updatedAt: 0 },
    { id: '2', challengeId: 'ch1', holder: 'b', parentId: '1', depth: 2, childCount: 0, isCoordinator: false, stake: 0n, giveReceived: 0n, weightClass: 'low', effectiveWeight: 2n, createdAt: 0, updatedAt: 0 },
    { id: '3', challengeId: 'ch1', holder: 'c', parentId: '1', depth: 2, childCount: 0, isCoordinator: false, stake: 0n, giveReceived: 0n, weightClass: 'low', effectiveWeight: 2n, createdAt: 0, updatedAt: 0 },
  ];
  
  const a3 = ieCalculateA3(positions);
  if (a3 !== 7n) { // 3 + 2 + 2
    return { pass: false, details: `A3 = ${a3}, expected 7` };
  }
  return { pass: true, details: 'A3 = sum of effective weights' };
}

export function dvTestPayoutDistribution(): { pass: boolean; details: string } {
  const positions: IEPosition[] = [
    { id: '1', challengeId: 'ch1', holder: 'a', parentId: '0', depth: 1, childCount: 2, isCoordinator: true, stake: 0n, giveReceived: 0n, weightClass: 'full', effectiveWeight: 3n, createdAt: 0, updatedAt: 0 },
    { id: '2', challengeId: 'ch1', holder: 'b', parentId: '1', depth: 2, childCount: 0, isCoordinator: false, stake: 0n, giveReceived: 0n, weightClass: 'low', effectiveWeight: 2n, createdAt: 0, updatedAt: 0 },
    { id: '3', challengeId: 'ch1', holder: 'c', parentId: '1', depth: 2, childCount: 0, isCoordinator: false, stake: 0n, giveReceived: 0n, weightClass: 'low', effectiveWeight: 2n, createdAt: 0, updatedAt: 0 },
  ];
  
  const tranche = 70_000_000n; // 70 USDC
  const payouts = ieCalculatePayouts(positions, tranche);
  
  // A3 = 7, pesos: 3, 2, 2
  // payouts: 70*3/7=30, 70*2/7=20, 70*2/7=20
  const p1 = payouts.get('1');
  const p2 = payouts.get('2');
  const p3 = payouts.get('3');
  
  if (p1 !== 30_000_000n || p2 !== 20_000_000n || p3 !== 20_000_000n) {
    return { pass: false, details: `payouts: ${p1}, ${p2}, ${p3} expected 30M, 20M, 20M` };
  }
  
  const verification = ieVerifyConservationProto(payouts, tranche);
  if (!verification.valid) {
    return { pass: false, details: `Conservation failed: ${verification.distributed}/${tranche}` };
  }
  
  return { pass: true, details: 'Payout distribution exact: 30/20/20 for weights 3/2/2' };
}

export function dvTestSimulateGrowth(): { pass: boolean; details: string } {
  const growth = ieSimulateGrowth(1, 5); // 1 seed, 5 levels
  
  // L1: 3, L2: +6=9, L3: +18=27, L4: +54=81, L5: +162=243
  const expected = [3n, 9n, 27n, 81n, 243n];
  
  for (let i = 0; i < 5; i++) {
    if (growth[i].cumulative !== expected[i]) {
      return { pass: false, details: `L${i+1} cumulative ${growth[i].cumulative} != ${expected[i]}` };
    }
  }
  
  if (growth[4].cumulative !== 243n) {
    return { pass: false, details: `L5 cumulative ${growth[4].cumulative} != 243` };
  }
  
  return { pass: true, details: 'Growth simulation: 3^n per level correct' };
}

export function dvTestValidateTree(): { pass: boolean; details: string } {
  // Árbol válido
  const challenge: IEChallenge = {
    id: 'ch1', funder: 'f', token: 'USDC', metaURI: 'test',
    funded: 1000n, released: 0n, level: 3, seedCount: 3,
    milestones: [], status: 'active',
    fundingConfig: { mode: 'postmonetario', token: 'USDC' },
    createdAt: 0, updatedAt: 0,
  };
  
  const positions: IEPosition[] = [
    { id: '1', challengeId: 'ch1', holder: 'a', parentId: '0', depth: 1, childCount: 2, isCoordinator: true, stake: 0n, giveReceived: 0n, weightClass: 'full', effectiveWeight: 3n, createdAt: 0, updatedAt: 0 },
    { id: '2', challengeId: 'ch1', holder: 'b', parentId: '0', depth: 1, childCount: 1, isCoordinator: false, stake: 0n, giveReceived: 0n, weightClass: 'full', effectiveWeight: 3n, createdAt: 0, updatedAt: 0 },
    { id: '3', challengeId: 'ch1', holder: 'c', parentId: '0', depth: 1, childCount: 0, isCoordinator: false, stake: 0n, giveReceived: 0n, weightClass: 'full', effectiveWeight: 3n, createdAt: 0, updatedAt: 0 },
    { id: '4', challengeId: 'ch1', holder: 'd', parentId: '1', depth: 2, childCount: 1, isCoordinator: false, stake: 0n, giveReceived: 0n, weightClass: 'mid', effectiveWeight: 1n, createdAt: 0, updatedAt: 0 },
    { id: '5', challengeId: 'ch1', holder: 'e', parentId: '1', depth: 2, childCount: 0, isCoordinator: false, stake: 0n, giveReceived: 0n, weightClass: 'low', effectiveWeight: 2n, createdAt: 0, updatedAt: 0 },
    { id: '6', challengeId: 'ch1', holder: 'f', parentId: '2', depth: 2, childCount: 0, isCoordinator: false, stake: 0n, giveReceived: 0n, weightClass: 'low', effectiveWeight: 2n, createdAt: 0, updatedAt: 0 },
    { id: '7', challengeId: 'ch1', holder: 'g', parentId: '4', depth: 3, childCount: 0, isCoordinator: false, stake: 0n, giveReceived: 0n, weightClass: 'low', effectiveWeight: 2n, createdAt: 0, updatedAt: 0 },
  ];
  
  const valid = ieValidateTree(challenge, positions);
  if (!valid.valid) {
    return { pass: false, details: `Valid tree rejected: ${valid.errors.join('; ')}` };
  }
  
  // Árbol inválido: hijo huérfano
  const badPositions = [...positions, { 
    id: '8', challengeId: 'ch1', holder: 'h', parentId: '999', depth: 2, childCount: 0, 
    isCoordinator: false, stake: 0n, giveReceived: 0n, weightClass: 'low', effectiveWeight: 2n, 
    createdAt: 0, updatedAt: 0 
  }];
  const invalid = ieValidateTree(challenge, badPositions);
  if (invalid.valid) {
    return { pass: false, details: 'Invalid tree (orphan) accepted' };
  }
  
  return { pass: true, details: 'Tree validation: valid accepted, invalid rejected' };
}

// ============================================================================
// RUNNER
// ============================================================================

export interface DVTestResult {
  name: string;
  pass: boolean;
  details: string;
}

export function runAllDVTests(): { passed: number; failed: number; results: DVTestResult[] } {
  const tests: { name: string; fn: () => { pass: boolean; details: string } }[] = [
    { name: 'Physical Persons (3^n)', fn: dvTestPhysicalPersons },
    { name: 'Positions Total ((3^(n+1)-3)/2)', fn: dvTestPositionsTotal },
    { name: 'OneRCE Matches Prototype (±1¢)', fn: dvTestOneRceMatchesPrototype },
    { name: 'Weight Classes L5 (floor 1¢)', fn: dvTestWeightClassesLevel5 },
    { name: 'Conservation (Σpayouts ≤ tranche)', fn: dvTestConservation },
    { name: 'RCE Table Structure', fn: dvTestRCETable },
    { name: 'Fee Schedule (regressive)', fn: dvTestFeeSchedule },
    { name: 'Weight Class Rules', fn: dvTestWeightClassRules },
    { name: 'Stake Bonus (cap 6)', fn: dvTestStakeBonus },
    { name: 'Give Bonus (cap 5)', fn: dvTestGiveBonus },
    { name: 'Effective Weight Formula', fn: dvTestEffectiveWeight },
    { name: 'A3 Calculation', fn: dvTestCalculateA3 },
    { name: 'Payout Distribution Exact', fn: dvTestPayoutDistribution },
    { name: 'Growth Simulation (3^n)', fn: dvTestSimulateGrowth },
    { name: 'Tree Validation', fn: dvTestValidateTree },
  ];
  
  const results: DVTestResult[] = [];
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    try {
      const result = test.fn();
      results.push({ name: test.name, pass: result.pass, details: result.details });
      if (result.pass) passed++; else failed++;
    } catch (e: any) {
      results.push({ name: test.name, pass: false, details: `Error: ${e.message}` });
      failed++;
    }
  }
  
  return { passed, failed, results };
}

// Auto-run if executed directly
if (typeof require !== 'undefined' && require.main === module) {
  const { passed, failed, results } = runAllDVTests();
  console.log('\n=== IE PROTOCOL DV TESTS ===');
  for (const r of results) {
    console.log(`${r.pass ? '✅' : '❌'} ${r.name}: ${r.details}`);
  }
  console.log(`\nTotal: ${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}