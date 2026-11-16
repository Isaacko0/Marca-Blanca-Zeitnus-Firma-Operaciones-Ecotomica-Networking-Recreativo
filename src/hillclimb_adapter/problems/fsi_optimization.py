# src/hillclimb_adapter/problems/fsi_optimization.py
"""
FSI (Food Sovereignty Index) Optimization Problem

Maximize FSI subject to entropic (ξ > 0.1) and circularity (cycleClosure > 0.8) constraints.
"""

from typing import Any, Dict
from hillclimb import Problem
from ..verifiers.fsi_verifier import FSIVerifier


class FSIOptimizationProblem(Problem):
    """Maximize Food Sovereignty Index subject to entropic & circularity constraints."""
    
    def __init__(self, community_state: Dict[str, Any]):
        super().__init__(
            name="hscsg_fsi_optimization",
            verifier=FSIVerifier(),
            param_space={
                "nutritional_optimizer": {
                    "caloric_weight": (0.1, 1.0),
                    "protein_weight": (0.1, 1.0),
                    "micronutrient_weight": (0.1, 1.0),
                    "diversity_weight": (0.0, 0.5),
                    "entropy_weight": (0.1, 1.0),
                    "labor_weight": (0.0, 0.5),
                    "monetary_weight": (0.0, 0.5)
                },
                "fabshep_modules": {
                    "greenhouse_bioclimatic": [True, False],
                    "aquaponics": [True, False],
                    "bioreactor_spirulina": [True, False],
                    "bioreactor_mycoprotein": [True, False],
                    "solar_dehydrator": [True, False],
                    "fermentation_chamber": [True, False],
                    "composter_automated": [True, False],
                    "biogas_digester": [True, False]
                }
            }
        )
        self.community_state = community_state
    
    def get_initial_candidate(self) -> Dict[str, Any]:
        """Baseline: current HSCSG defaults."""
        return {
            "nutritional_optimizer": {
                "caloric_weight": 0.3,
                "protein_weight": 0.25,
                "micronutrient_weight": 0.2,
                "diversity_weight": 0.1,
                "entropy_weight": 0.1,
                "labor_weight": 0.05,
                "monetary_weight": 0.0
            },
            "fabshep_modules": {
                "greenhouse_bioclimatic": True,
                "aquaponics": True,
                "bioreactor_spirulina": True,
                "bioreactor_mycoprotein": False,
                "solar_dehydrator": True,
                "fermentation_chamber": True,
                "composter_automated": True,
                "biogas_digester": True
            }
        }