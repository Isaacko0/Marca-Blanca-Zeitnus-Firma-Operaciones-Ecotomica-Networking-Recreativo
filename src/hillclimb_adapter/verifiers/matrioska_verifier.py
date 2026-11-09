# src/hillclimb_adapter/verifiers/matrioska_verifier.py
"""
Matrioska Capture Detection Verifier

Detects capture in the 7-layer matrioska system during optimization.
Calls: boundaries.ts detectMatrioskaCapture()
Prevents reward hacking by detecting capture in optimization process itself.
"""

from typing import Any, Dict, List
from .base_verifier import BaseVerifier, VerificationResult


class MatrioskaVerifier(BaseVerifier):
    """Verifier for matrioska capture detection in optimization loops."""
    
    def __init__(self):
        super().__init__()
        self.ts_module = "src/core/lib/boundaries.ts"
        self.ts_function = "detectMatrioskaCapture"
    
    async def verify(self, candidate: Dict[str, Any]) -> VerificationResult:
        """
        Candidate contains:
        - action: the optimization action being evaluated
        - context: current optimization context
        - layer: which matrioska layer to check (or all)
        """
        try:
            action = candidate.get('action', {})
            context = candidate.get('context', {})
            layer = candidate.get('layer')  # optional: specific layer
            
            result = await self.call_ts(
                self.ts_module,
                self.ts_function,
                [action, context]
            )
            
            if not result:
                return VerificationResult(
                    score=0.5,  # Neutral if no detection runs
                    metrics={'violations': 0},
                    passed=True,
                    details={'note': 'No matrioska scan performed'}
                )
            
            violations: List[Dict] = result.get('violations', [])
            
            # Count violations by layer
            layer_counts = {}
            for v in violations:
                l = v.get('layer', 'unknown')
                layer_counts[l] = layer_counts.get(l, 0) + 1
            
            # Score: inverse of violation severity
            # No violations = 1.0, each violation reduces score
            severity_weights = {
                'monetaria': 0.3,
                'laboral': 0.2,
                'informacional': 0.15,
                'institucional': 0.15,
                'ecologica': 0.1,
                'psicologica': 0.05,
                'tecnologica': 0.05
            }
            
            total_penalty = 0.0
            for v in violations:
                layer = v.get('layer', 'unknown')
                severity = v.get('severity', 1.0)
                weight = severity_weights.get(layer, 0.1)
                total_penalty += weight * severity
            
            score = max(0.0, 1.0 - total_penalty)
            
            # Hard constraint: any CRITICAL violation = 0 score
            critical_violations = [v for v in violations if v.get('severity', 0) >= 0.9]
            if critical_violations:
                return VerificationResult(
                    score=0.0,
                    metrics={
                        'violations': len(violations),
                        'critical_violations': len(critical_violations),
                        'layer_counts': layer_counts
                    },
                    passed=False,
                    details={
                        'critical_violations': critical_violations,
                        'all_violations': violations
                    }
                )
            
            metrics = {
                'violations': len(violations),
                'critical_violations': len(critical_violations),
                'layer_counts': layer_counts,
                'total_penalty': total_penalty
            }
            
            return VerificationResult(
                score=score,
                metrics=metrics,
                passed=len(violations) == 0,
                details={
                    'violations': violations,
                    'penalty_breakdown': {l: layer_counts.get(l, 0) * severity_weights.get(l, 0.1) 
                                          for l in layer_counts}
                }
            )
            
        except Exception as e:
            return VerificationResult(
                score=0.5,  # Neutral on error
                metrics={'error': 1.0},
                passed=False,
                error=f"Matrioska verification failed: {str(e)}"
            )