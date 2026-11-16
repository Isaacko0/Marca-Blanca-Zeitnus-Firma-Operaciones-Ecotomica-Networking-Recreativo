# src/hillclimb_adapter/problems/cac_optimization.py
"""
CAC (Coefficient of Autonomía Civilizatoria) Optimization Problem

Maximize ΔAUT/cost, minimize realDependencyIndex, maximize autonomyPerMonetaryUnit.
"""

from typing import Any, Dict
from hillclimb import Problem
from ..verifiers.cac_verifier import CACVerifier


class CACOptimizationProblem(Problem):
    """Maximize CAC efficiency and autonomy per monetary unit."""
    
    def __init__(self, community_state: Dict[str, Any]):
        super().__init__(
            name="hscsg_cac_optimization",
            verifier=CACVerifier(),
            param_space={
                "automaton_config": {
                    "e2r_budget": (10, 100),
                    "e2r_diversity": (0.1, 1.0),
                    "mj_gate_strictness": (0.5, 1.0),
                    "retroalimentar_weight": (0.1, 1.0)
                },
                "fabshep_allocation": {
                    "production_ratio": (0.1, 0.8),
                    "processing_ratio": (0.05, 0.5),
                    "conservation_ratio": (0.05, 0.5),
                    "distribution_ratio": (0.05, 0.3)
                },
                "resource_allocation": {
                    "energy_to_food": (0.1, 0.5),
                    "energy_to_water": (0.05, 0.3),
                    "energy_to_habitat": (0.05, 0.3),
                    "labor_to_automation": (0.1, 0.9)
                }
            }
        )
        self.community_state = community_state
    
    def get_initial_candidate(self) -> Dict[str, Any]:
        return {
            "automaton_config": {
                "e2r_budget": 30,
                "e2r_diversity": 0.7,
                "mj_gate_strictness": 0.85,
                "retroalimentar_weight": 0.5
            },
            "fabshep_allocation": {
                "production_ratio": 0.4,
                "processing_ratio": 0.2,
                "conservation_ratio": 0.2,
                "distribution_ratio": 0.15
            },
            "resource_allocation": {
                "energy_to_food": 0.3,
                "energy_to_water": 0.15,
                "energy_to_habitat": 0.15,
                "labor_to_automation": 0.6
            }
        }