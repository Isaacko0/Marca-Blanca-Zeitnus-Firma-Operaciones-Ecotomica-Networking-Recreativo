// scripts/validate-uhi-engine.ts
// Quick validation script for tq-uhi-engine.ts

import { 
  simulateUHI, 
  createUHIParams, 
  validateAgainstUHISimulator,
  UHI_PRESETS 
} from '../src/core/lib/tq-uhi-engine';

console.log('🔬 Validating UHI Engine against UHI Simulator documented outputs...\n');

const results = validateAgainstUHISimulator();

let allPassed = true;
for (const r of results) {
  const status = r.passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${status} ${r.preset.toUpperCase()}`);
  console.log(`  Nominal 2060: ${r.median2060Nominal.toLocaleString()} (expected: ${r.expectedNominal.toLocaleString()}) — diff: ${r.nominalDiffPct.toFixed(1)}%`);
  console.log(`  Effective 2060: ${r.median2060Effective.toLocaleString()} (expected: ${r.expectedEffective.toLocaleString()}) — diff: ${r.effectiveDiffPct.toFixed(1)}%`);
  if (!r.passed) allPassed = false;
}

console.log('\n' + '='.repeat(60));
if (allPassed) {
  console.log('🎉 ALL VALIDATIONS PASSED — UHI Engine matches simulator within ±5%');
} else {
  console.log('⚠️  SOME VALIDATIONS FAILED — Review parameters');
}

// Additional quick checks
console.log('\n📊 Additional Checks:');
for (const preset of ['proactive', 'reactive', 'delayed', 'noAction'] as const) {
  const params = createUHIParams(preset);
  const result = simulateUHI(params);
  console.log(`\n${preset.toUpperCase()}:`);
  console.log(`  Years simulated: ${result.yearly.length} (${params.endYear - 2025 + 1} expected)`);
  console.log(`  9 DividendPolicies generated: ${result.summary.tqDividendPolicies.length}`);
  console.log(`  Total TQ Equity (kWh/yr): ${result.summary.totalTQEquityGenerated.toLocaleString()}`);
  console.log(`  SWF Balance 2060: $${(result.summary.swfBalance2060 / 1e12).toFixed(1)}T`);
  
  // Check automation level progression
  const first = result.yearly[0];
  const last = result.yearly[result.yearly.length - 1];
  console.log(`  Automation: ${(first.automationLevel * 100).toFixed(1)}% → ${(last.automationLevel * 100).toFixed(1)}%`);
  console.log(`  Revenue Factor: ${first.revenueFactor.toFixed(2)} → ${last.revenueFactor.toFixed(2)}`);
}

console.log('\n✅ Validation complete.');