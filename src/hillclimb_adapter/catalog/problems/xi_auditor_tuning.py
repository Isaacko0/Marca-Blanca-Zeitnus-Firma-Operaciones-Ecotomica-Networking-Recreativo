# src/hillclimb_adapter/problems/xi_auditor_tuning.py
"""
ξ Auditor Tuning Problem

Minimize false positive/negative rate of ξ auditor via SVD v2 verification.
"""

from typing import Any, Dict
from hillclimb import Problem
from ..verifiers.xi_verifier import XVerifier


class XIAuditorTuningProblem(Problem):
    """Minimize ξ auditor error rate with SVD v2 ground truth."""
    
    def __init__(self, community_state: Dict[str, Any], ground_truth_data: Dict = None):
        super().__init__(
            name="hscsg_xi_auditor_tuning",
            verifier=XVerifier(),
            param_space={
                "auditor_params": {
                    "sensor_weight_magnetometer": (0.1, 1.0),
                    "sensor_weight_qrng": (0.1, 1.0),
                    "sensor_weight_biosensor": (0.1, 1.0),
                    "confidence_threshold": (0.7, 0.99),
                    "xi_min_threshold": (0.05, 0.5),
                    "entropy_weight": (0.1, 1.0),
                    "biomass_weight": (0.1, 1.0),
                    "free_energy_weight": (0.1, 1.0)
                }
            }
        )
        self.community_state = community_state
        self.ground_truth_data = ground_truth_data or {}
    
    def get_initial_candidate(self) -> Dict[str, Any]:
        return {
            "auditor_params": {
                "sensor_weight_magnetometer": 0.3,
                "sensor_weight_qrng": 0.2,
                "sensor_weight_biosensor": 0.5,
                "confidence_threshold": 0.85,
                "xi_min_threshold": 0.1,
                "entropy_weight": 0.3,
                "biomass_weight": 0.4,
                "free_energy_weight": 0.3
            }
        }