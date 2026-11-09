# src/hillclimb_adapter/verifiers/servitude_verifier.py
"""
Servitude & Death Reduction Verifier (Composite)

Composite verifier for "reducción verificable de servidumbre y muerte".
Combines: CAC + ξ + FSI + mortality proxy + realDependencyIndex.
This is the master verifier for the core HSCSG mission.
"""

from typing import Any, Dict
from .base_verifier import BaseVerifier, VerificationResult


class ServitudeVerifier(BaseVerifier):
    """Master verifier: reduction of servitude and death."""
    
    def __init__(self):
        super().__init__()
        self.ts_module = "src/core/lib/metrics.ts"
        self.ts_function = "calculateServitudeMetrics"
    
    async def verify(self, candidate: Dict[str, Any]) -> VerificationResult:
        """
        Candidate contains:
        - community_state: HSCSG community state
        - execution: result of candidate execution
        - baseline_servitude: baseline servitude index
        - baseline_mortality: baseline mortality proxy
        """
        try:
            community_state = candidate.get('community_state', {})
            execution = candidate.get('execution', {})
            baseline_servitude = candidate.get('baseline_servitude', 0.5)
            baseline_mortality = candidate.get('baseline_mortality', 0.5)
            
            combined_state = {**community_state, 'last_execution': execution}
            
            result = await self.call_ts(
                self.ts_module,
                self.ts_function,
                [combined_state]
            )
            
            if not result:
                return VerificationResult(
                    score=0.0,
                    metrics={},
                    passed=False,
                    error="No result from calculateServitudeMetrics"
                )
            
            # Extract servitude and mortality metrics
            servitude_index = result.get('servitudeIndex', 1.0)  # 0-1, lower = better
            mortality_proxy = result.get('mortalityProxy', 1.0)  # 0-1, lower = better
            real_dependency = result.get('realDependencyIndex', 1.0)
            xi = result.get('xi', 0)
            fsi = result.get('FSI', 0) / 100.0
            
            # Hard constraints
            if servitude_index >= baseline_servitude:
                return self._hard_constraint_failed('servitudeIndex', servitude_index, baseline_servitude)
            if mortality_proxy >= baseline_mortality:
                return self._hard_constraint_failed('mortalityProxy', mortality_proxy, baseline_mortality)
            
            # Reductions achieved
            servitude_reduction = (baseline_servitude - servitude_index) / baseline_servitude
            mortality_reduction = (baseline_mortality - mortality_proxy) / baseline_mortality
            
            # Composite score: servitude reduction (40%) + mortality reduction (30%) + xi (15%) + FSI (15%)
            score = (
                servitude_reduction * 0.4 +
                mortality_reduction * 0.3 +
                min(1.0, xi / 5.0) * 0.15 +
                fsi * 0.15
            )
            
            metrics = {
                'servitudeIndex': servitude_index,
                'mortalityProxy': mortality_proxy,
                'servitudeReduction': servitude_reduction,
                'mortalityReduction': mortality_reduction,
                'realDependencyIndex': real_dependency,
                'xi': xi,
                'FSI': fsi * 100,
                'baseline_servitude': baseline_servitude,
                'baseline_mortality': baseline_mortality,
            }
            
            return VerificationResult(
                score=min(1.0, max(0.0, score)),
                metrics=metrics,
                passed=True,
                details={
                    'reductions': {
                        'servitude': servitude_reduction,
                        'mortality': mortality_reduction
                    }
                }
            )
            
        except Exception as e:
            return VerificationResult(
                score=0.0,
                metrics={},
                passed=False,
                error=f"Servitude verification failed: {str(e)}"
            )