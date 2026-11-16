# src/hillclimb_adapter/verifiers/proto_co_verifier.py
"""
Phase 0 Proto-CO Validation Verifier (Composite)

Validates HSCSG Phase 0: 10 beta cases, 90 days, FSI>30, ξ>0, servitude reduction.
Composite verifier combining FSI + ξ + realDependencyIndex + servitude reduction.
"""

from typing import Any, Dict
from .base_verifier import BaseVerifier, VerificationResult
from .fsi_verifier import FSIVerifier
from .xi_verifier import XVerifier
from .cac_verifier import CACVerifier
from .servitude_verifier import ServitudeVerifier


class ProtoCOVerifier(BaseVerifier):
    """Master verifier for Phase 0 Proto-CO validation."""
    
    def __init__(self):
        super().__init__()
        # Sub-verifiers (lazy init)
        self._fsi = None
        self._xi = None
        self._cac = None
        self._servitude = None
    
    @property
    def fsi_verifier(self):
        if self._fsi is None:
            self._fsi = FSIVerifier()
        return self._fsi
    
    @property
    def xi_verifier(self):
        if self._xi is None:
            self._xi = XVerifier()
        return self._xi
    
    @property
    def cac_verifier(self):
        if self._cac is None:
            self._cac = CACVerifier()
        return self._cac
    
    @property
    def servitude_verifier(self):
        if self._servitude is None:
            self._servitude = ServitudeVerifier()
        return self._servitude
    
    async def verify(self, candidate: Dict[str, Any]) -> VerificationResult:
        """
        Candidate represents a full beta case deployment config.
        Runs all sub-verifiers and composites results.
        """
        try:
            community_state = candidate.get('community_state', {})
            execution = candidate.get('execution', {})
            config = candidate.get('config', {})
            
            # Prepare sub-candidates
            fsi_candidate = {**candidate, 'community_state': community_state, 'config': config}
            xi_candidate = {**candidate, 'community_state': community_state, 'auditor_params': config.get('auditor', {})}
            cac_candidate = {**candidate, 'community_state': community_state, 'execution_result': candidate.get('execution', {})}
            servitude_candidate = {**candidate, 'community_state': community_state, 'execution': candidate.get('execution', {})}
            
            # Run all sub-verifiers in parallel
            fsi_result = await self.fsi_verifier.verify(fsi_candidate)
            xi_result = await self.xi_verifier.verify(xi_candidate)
            cac_result = await self.cac_verifier.verify(cac_candidate)
            servitude_result = await self.servitude_verifier.verify(servitude_candidate)
            
            # Check hard constraints from all
            all_passed = all(r.passed for r in [fsi_result, xi_result, cac_result, servitude_result])
            
            # Extract key metrics
            fsi = fsi_result.metrics.get('FSI', 0)
            xi = xi_result.metrics.get('xi', 0)
            real_dependency = cac_result.metrics.get('realDependencyIndex', 1.0)
            servitude_reduction = servitude_result.metrics.get('servitudeReduction', 0)
            mortality_reduction = servitude_result.metrics.get('mortalityReduction', 0)
            
            # Phase 0 targets
            targets = candidate.get('targets', {
                'min_fsi': 30,
                'min_xi': 0.1,
                'max_real_dependency': 0.5,
                'min_servitude_reduction': 0.2,
                'min_mortality_reduction': 0.1
            })
            
            # Check targets
            target_checks = {
                'fsi': fsi >= targets.get('min_fsi', 30),
                'xi': xi >= targets.get('min_xi', 0.1),
                'real_dependency': real_dependency <= targets.get('max_real_dependency', 0.5),
                'servitude_reduction': servitude_reduction >= targets.get('min_servitude_reduction', 0.2),
                'mortality_reduction': mortality_reduction >= targets.get('min_mortality_reduction', 0.1)
            }
            
            all_targets_met = all(target_checks.values())
            
            # Composite score (only if all passed)
            if not all_passed or not all_targets_met:
                return VerificationResult(
                    score=0.0,
                    metrics={
                        'fsi': fsi,
                        'xi': xi,
                        'realDependencyIndex': real_dependency,
                        'servitudeReduction': servitude_reduction,
                        'mortalityReduction': mortality_reduction,
                        'targets_met': sum(target_checks.values()),
                        'targets_total': len(target_checks),
                        'all_passed': all_passed
                    },
                    passed=False,
                    details={
                        'target_checks': target_checks,
                        'fsi_result': fsi_result.metrics,
                        'xi_result': xi_result.metrics,
                        'cac_result': cac_result.metrics,
                        'servitude_result': servitude_result.metrics
                    }
                )
            
            # Composite score: weighted by importance
            fsi_score = min(1.0, fsi / 100.0)
            xi_score = min(1.0, xi / 2.0)
            dep_score = 1.0 - real_dependency
            serv_score = servitude_reduction
            mort_score = mortality_reduction
            
            score = (
                fsi_score * 0.25 +
                xi_score * 0.2 +
                dep_score * 0.2 +
                serv_score * 0.2 +
                mort_score * 0.15
            )
            
            return VerificationResult(
                score=min(1.0, max(0.0, score)),
                metrics={
                    'fsi': fsi,
                    'xi': xi,
                    'realDependencyIndex': real_dependency,
                    'servitudeReduction': servitude_reduction,
                    'mortalityReduction': mortality_reduction,
                    'targets_met': sum(target_checks.values()),
                    'targets_total': len(target_checks),
                    'all_targets_met': all_targets_met,
                    'sub_scores': {
                        'fsi': fsi_score,
                        'xi': xi_score,
                        'dependency': 1.0 - real_dependency,
                        'servitude': serv_score,
                        'mortality': mort_score
                    }
                },
                passed=True,
                details={
                    'target_checks': target_checks,
                    'fsi': fsi_result.metrics,
                    'xi': xi_result.metrics,
                    'cac': cac_result.metrics,
                    'servitude': servitude_result.metrics
                }
            )
            
        except Exception as e:
            return VerificationResult(
                score=0.0,
                metrics={},
                passed=False,
                error=f"Proto-CO verification failed: {str(e)}"
            )