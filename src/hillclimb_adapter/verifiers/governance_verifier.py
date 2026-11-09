# src/hillclimb_adapter/verifiers/governance_verifier.py
"""
Governance Policy Search Verifier

Optimizes CDS_Jurados weights (W_i) + Symbiosky parameters.
Simulates 1000 governance decisions and measures quality.
"""

from typing import Any, Dict, List
from .base_verifier import BaseVerifier, VerificationResult
import random


class GovernanceVerifier(BaseVerifier):
    """Verifier for governance policy optimization."""
    
    def __init__(self):
        super().__init__()
        self.ts_module = "src/core/lib/integral.ts"
        self.ts_function = "simulateGovernanceDecisions"
    
    async def verify(self, candidate: Dict[str, Any]) -> VerificationResult:
        """
        Candidate contains:
        - cds_jurados_weights: W_i for 8 BN scales
        - symbiosky_params: conviction_threshold, decay_rate, anti_whale_config
        - governance_scenarios: list of decision scenarios to test
        """
        try:
            weights = candidate.get('cds_jurados_weights', {})
            symbiosky = candidate.get('symbiosky_params', {})
            scenarios = candidate.get('governance_scenarios', self._default_scenarios())
            
            # Merge into community state
            governance_config = {
                'cds_jurados_weights': weights,
                'symbiosky': symbiosky,
                'scenarios': scenarios
            }
            
            result = await self.call_ts(
                self.ts_module,
                self.ts_function,
                [governance_config]
            )
            
            if not result:
                return VerificationResult(
                    score=0.0,
                    metrics={},
                    passed=False,
                    error="No result from simulateGovernanceDecisions"
                )
            
            # Extract simulation metrics
            metrics = result.get('metrics', {})
            
            decision_reversal_rate = metrics.get('decisionReversalRate', 1.0)
            evidence_verified_rate = metrics.get('evidenceVerifiedRate', 0.0)
            capture_events = metrics.get('captureEvents', 0)
            autonomy_growth = metrics.get('autonomyGrowth', 0.0)
            consensus_quality = metrics.get('consensusQuality', 0.0)
            participation_rate = metrics.get('participationRate', 0.0)
            
            # Hard constraints
            if decision_reversal_rate > 0.2:
                return self._hard_constraint_failed('decisionReversalRate', decision_reversal_rate, 0.2)
            if evidence_verified_rate < 0.7:
                return self._hard_constraint_failed('evidenceVerifiedRate', evidence_verified_rate, 0.7)
            if capture_events > 0:
                return self._hard_constraint_failed('captureEvents', capture_events, 0)
            
            # Score: autonomy_growth (30%) + consensus_quality (25%) + 
            #        evidence_verified_rate (20%) + participation_rate (15%) + 
            #        (1 - reversal_rate) (10%)
            score = (
                min(1.0, autonomy_growth) * 0.3 +
                consensus_quality * 0.25 +
                evidence_verified_rate * 0.2 +
                participation_rate * 0.15 +
                (1.0 - decision_reversal_rate) * 0.1
            )
            
            return VerificationResult(
                score=min(1.0, max(0.0, score)),
                metrics={
                    'decisionReversalRate': decision_reversal_rate,
                    'evidenceVerifiedRate': evidence_verified_rate,
                    'captureEvents': capture_events,
                    'autonomyGrowth': autonomy_growth,
                    'consensusQuality': consensus_quality,
                    'participationRate': participation_rate,
                    **metrics
                },
                passed=True,
                details={'scenarios_tested': len(scenarios)}
            )
            
        except Exception as e:
            return VerificationResult(
                score=0.0,
                metrics={},
                passed=False,
                error=f"Governance verification failed: {str(e)}"
            )
    
    def _default_scenarios(self) -> List[Dict]:
        """Default governance scenarios for testing."""
        return [
            {'type': 'resource_allocation', 'controversy': 0.7, 'stakeholders': 12},
            {'type': 'policy_change', 'controversy': 0.5, 'stakeholders': 8},
            {'type': 'budget_distribution', 'controversy': 0.3, 'stakeholders': 15},
            {'type': 'membership', 'controversy': 0.6, 'stakeholders': 20},
            {'type': 'technical_standard', 'controversy': 0.4, 'stakeholders': 10},
        ]