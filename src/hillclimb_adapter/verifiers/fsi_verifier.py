# src/hillclimb_adapter/verifiers/fsi_verifier.py
"""
FSI (Food Sovereignty Index) Verifier

Maximize FSI subject to entropic (ξ > 0.1) and circularity (cycleClosure > 0.8) constraints.
Calls: foodSovereigntyIndex.ts + entropicAuditor.ts
"""

from typing import Any, Dict
from .base_verifier import BaseVerifier, VerificationResult


class FSIVerifier(BaseVerifier):
    """Verifier for Food Sovereignty Index optimization."""
    
    def __init__(self):
        super().__init__()
        self.ts_module = "src/core/lib/foodSovereigntyIndex.ts"
        self.ts_function = "calculateFSI"
    
    async def verify(self, candidate: Dict[str, Any]) -> VerificationResult:
        """
        Candidate contains:
        - community_state: HSCSG community state
        - config: nutritional optimizer params + FABSHIP module selection
        """
        try:
            # Extract community state and config
            community_state = candidate.get('community_state', {})
            config = candidate.get('config', {})
            
            # Call TypeScript module
            result = await self.call_ts(
                self.ts_module,
                self.ts_function,
                [community_state, config]
            )
            
            if not result:
                return VerificationResult(
                    score=0.0,
                    metrics={},
                    passed=False,
                    error="No result from calculateFSI"
                )
            
            # Extract metrics
            fsi = result.get('FSI', 0)
            components = result.get('components', {})
            
            # Hard constraints
            xi = components.get('entropicEfficiency', 0) / 100.0  # normalize 0-100 -> 0-1
            cycle_closure = components.get('cycleClosure', 0) / 100.0
            
            if xi < 0.1:
                return self._hard_constraint_failed('xi', xi, 0.1)
            if cycle_closure < 0.8:
                return self._hard_constraint_failed('cycleClosure', cycle_closure, 0.8)
            
            # Score: normalized FSI (0-100 -> 0-1)
            score = fsi / 100.0
            
            # Auxiliary metrics
            metrics = {
                'FSI': fsi,
                'xi': xi,
                'cycleClosure': cycle_closure,
                'autonomyCaloric': components.get('autonomyCaloric', 0),
                'autonomyProtein': components.get('autonomyProtein', 0),
                'autonomyMicronutrient': components.get('autonomyMicronutrient', 0),
                'dietaryDiversity': components.get('dietaryDiversity', 0),
                'laborReduction': components.get('laborReduction', 0),
                'monetaryReduction': components.get('monetaryReduction', 0),
                'governanceQuality': components.get('governanceQuality', 0),
                'duplicability': components.get('duplicability', 0),
            }
            
            return VerificationResult(
                score=min(1.0, max(0.0, score)),
                metrics=metrics,
                passed=True,
                details={
                    'fsi_components': components,
                    'constraints': {'xi': xi, 'cycleClosure': cycle_closure}
                }
            )
            
        except Exception as e:
            return VerificationResult(
                score=0.0,
                metrics={},
                passed=False,
                error=f"FSI verification failed: {str(e)}"
            )