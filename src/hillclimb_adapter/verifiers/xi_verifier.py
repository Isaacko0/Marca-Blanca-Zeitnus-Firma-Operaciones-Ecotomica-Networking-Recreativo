# src/hillclimb_adapter/verifiers/xi_verifier.py
"""
ξ (Entropic Efficiency) Verifier

Minimize false positive/negative rate of ξ auditor.
Calls: entropicAuditor.ts + SVD v2 ground truth comparison
"""

from typing import Any, Dict
from .base_verifier import BaseVerifier, VerificationResult


class XVerifier(BaseVerifier):
    """Verifier for Entropic Auditor (ξ) tuning."""
    
    def __init__(self):
        super().__init__()
        self.ts_module = "src/core/lib/entropicAuditor.ts"
        self.ts_function = "performEntropicAudit"
    
    async def verify(self, candidate: Dict[str, Any]) -> VerificationResult:
        """
        Candidate contains:
        - auditor_params: sensor_weights, confidence_thresholds, etc.
        - community_state: HSCSG community state
        - svd_sensors: SVD v2 sensor data (or mock for testing)
        - ground_truth_xi: optional ground truth for comparison
        """
        try:
            auditor_params = candidate.get('auditor_params', {})
            community_state = candidate.get('community_state', {})
            svd_sensors = candidate.get('svd_sensors', {})
            ground_truth_xi = candidate.get('ground_truth_xi')
            
            # Merge auditor params into community state for audit
            audit_state = {**community_state, 'auditor_config': auditor_params}
            
            result = await self.call_ts(
                self.ts_module,
                self.ts_function,
                [audit_state, svd_sensors]
            )
            
            if not result:
                return VerificationResult(
                    score=0.0,
                    metrics={},
                    passed=False,
                    error="No result from performEntropicAudit"
                )
            
            audit = result.get('audit', {})
            xi = audit.get('xi', 0)
            confidence = audit.get('svdVerification', {}).get('xiConfidence', 0)
            passed = audit.get('svdVerification', {}).get('auditPassed', False)
            
            # Hard constraint: audit must pass
            if not passed:
                return VerificationResult(
                    score=0.0,
                    metrics={'xi': xi, 'confidence': confidence, 'passed': False},
                    passed=False,
                    details={'reason': 'SVD verification failed'}
                )
            
            # Compare with ground truth if available
            error = 0.0
            if ground_truth_xi is not None:
                error = abs(xi - ground_truth_xi)
            
            # Score: high xi + high confidence + low error
            # Weighted: xi (50%) + confidence (30%) + (1-error) (20%)
            xi_score = min(1.0, xi / 10.0)  # normalize assuming xi max ~10
            confidence_score = confidence
            error_score = max(0.0, 1.0 - error)
            
            score = (xi_score * 0.5) + (confidence_score * 0.3) + (error_score * 0.2)
            
            metrics = {
                'xi': xi,
                'confidence': confidence,
                'passed': 1.0 if passed else 0.0,
                'error': error,
                'xi_normalized': xi_score,
                'confidence_score': confidence_score,
                'error_score': error_score,
            }
            
            return VerificationResult(
                score=min(1.0, max(0.0, score)),
                metrics=metrics,
                passed=passed,
                details={
                    'audit': audit,
                    'ground_truth': ground_truth_xi
                }
            )
            
        except Exception as e:
            return VerificationResult(
                score=0.0,
                metrics={},
                passed=False,
                error=f"ξ verification failed: {str(e)}"
            )