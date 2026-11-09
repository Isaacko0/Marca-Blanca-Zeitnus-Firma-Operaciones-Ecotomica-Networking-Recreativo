# src/hillclimb_adapter/verifiers/cac_verifier.py
"""
CAC (Coefficient of Autonomía Civilizatoria) Verifier

Maximize ΔAUT/cost, minimize realDependencyIndex, maximize autonomyPerMonetaryUnit.
Calls: metrics.ts (CAC, realDependencyIndex, autonomyPerMonetaryUnit)
"""

from typing import Any, Dict
from .base_verifier import BaseVerifier, VerificationResult


class CACVerifier(BaseVerifier):
    """Verifier for CAC optimization."""
    
    def __init__(self):
        super().__init__()
        self.ts_module = "src/core/lib/metrics.ts"
        self.ts_function = "calculateAllMetrics"
    
    async def verify(self, candidate: Dict[str, Any]) -> VerificationResult:
        """
        Candidate contains:
        - community_state: HSCSG community state
        - config: automaton/FABSHIP params
        - execution_result: result of executing candidate plan
        """
        try:
            community_state = candidate.get('community_state', {})
            execution = candidate.get('execution_result', {})
            config = candidate.get('config', {})
            
            # Combine state + execution for metrics calculation
            combined_state = {**community_state, 'last_execution': execution}
            
            result = await self.call_ts(
                self.ts_module,
                self.ts_function,
                [combined_state, config]
            )
            
            if not result:
                return VerificationResult(
                    score=0.0,
                    metrics={},
                    passed=False,
                    error="No result from calculateAllMetrics"
                )
            
            # Extract metrics
            cac = result.get('CAC', 0)
            real_dependency = result.get('realDependencyIndex', 1.0)
            autonomy_per_monetary = result.get('autonomyPerMonetaryUnit', 0)
            xi = result.get('xi', 0)
            fsi = result.get('FSI', 0) / 100.0
            sigma_u = result.get('sigma_u', 1.0)
            
            # Hard constraint: real dependency must be decreasing
            baseline_dependency = candidate.get('baseline_real_dependency', 0.5)
            if real_dependency > baseline_dependency:
                return VerificationResult(
                    score=0.0,
                    metrics={'realDependencyIndex': real_dependency, 'baseline': baseline_dependency},
                    passed=False,
                    details={'violation': 'real_dependency_increased'}
                )
            
            # Multi-objective score
            # CAC (30%) + (1-real_dependency) (30%) + autonomy_per_monetary (20%) + xi (20%)
            cac_score = min(1.0, cac / 5.0)  # normalize CAC max ~5
            dependency_score = 1.0 - real_dependency
            monetary_score = min(1.0, autonomy_per_monetary / 10.0)  # normalize
            xi_score = min(1.0, xi / 5.0)
            
            score = (cac_score * 0.3) + (dependency_score * 0.3) + (monetary_score * 0.2) + (xi_score * 0.2)
            
            metrics = {
                'CAC': cac,
                'realDependencyIndex': real_dependency,
                'autonomyPerMonetaryUnit': autonomy_per_monetary,
                'xi': xi,
                'FSI': fsi,
                'sigma_u': sigma_u,
                'cac_normalized': cac_score,
                'dependency_score': dependency_score,
            }
            
            return VerificationResult(
                score=min(1.0, max(0.0, score)),
                metrics=metrics,
                passed=True,
                details={'config': config}
            )
            
        except Exception as e:
            return VerificationResult(
                score=0.0,
                metrics={},
                passed=False,
                error=f"CAC verification failed: {str(e)}"
            )