# src/hillclimb_adapter/problems/automaton_e2r_params.py
"""
Automaton E²R Parameters Optimization Problem

Optimize E²R tree search parameters for the native HSCSG Autómata Soberano climber.
"""

from typing import Any, Dict
from hillclimb import Problem
from ..verifiers.cac_verifier import CACVerifier  # Uses CAC as proxy for automaton performance


class AutomatonE2RParamsProblem(Problem):
    """Optimize E²R tree search parameters for native Autómata Soberano climber."""
    
    def __init__(self, community_state: Dict[str, Any]):
        super().__init__(
            name="hscsg_automaton_e2r_params",
            verifier=CACVerifier(),  # Proxy: CAC reflects automaton performance
            param_space={
                "e2r_config": {
                    "explore_budget": (5, 50),
                    "explore_depth": (2, 10),
                    "diversity_weight": (0.0, 1.0),
                    "novelty_threshold": (0.0, 0.5),
                    "mj_gate_strictness": (0.5, 1.0)
                },
                "execute_config": {
                    "mj_gate_strictness": (0.5, 1.0),
                    "parallel_execution": [True, False],
                    "max_parallel": (1, 10),
                    "timeout_per_action": (30, 3600)
                },
                "review_config": {
                    "svd_verification": [True, False],
                    "rao_audit_depth": (1, 5),
                    "metric_weight_cac": (0.1, 0.5),
                    "metric_weight_xi": (0.1, 0.5),
                    "metric_weight_fsi": (0.1, 0.5)
                }
            }
        )
        self.community_state = community_state
    
    def get_initial_candidate(self) -> Dict[str, Any]:
        return {
            "e2r_config": {
                "explore_budget": 20,
                "explore_depth": 5,
                "diversity_weight": 0.7,
                "novelty_threshold": 0.1,
                "mj_gate_strictness": 0.85
            },
            "execute_config": {
                "mj_gate_strictness": 0.85,
                "parallel_execution": True,
                "max_parallel": 4,
                "timeout_per_action": 300
            },
            "review_config": {
                "svd_verification": True,
                "rao_audit_depth": 3,
                "metric_weight_cac": 0.35,
                "metric_weight_xi": 0.35,
                "metric_weight_fsi": 0.3
            }
        }