# src/hillclimb_adapter/problems/governance_policy_search.py
"""
Governance Policy Search Problem

Optimizes CDS_Jurados weights (W_i) + Symbiosky parameters.
Simulates 1000 governance decisions and measures quality.
"""

from typing import Any, Dict
from hillclimb import Problem
from ..verifiers.governance_verifier import GovernanceVerifier


class GovernancePolicySearchProblem(Problem):
    """Optimize CDS_Jurados weights and Symbiosky parameters via simulation."""
    
    def __init__(self, community_state: Dict[str, Any]):
        super().__init__(
            name="hscsg_governance_policy_search",
            verifier=GovernanceVerifier(),
            param_space={
                "cds_jurados_weights": {
                    "w1_needs": (0.05, 0.3),
                    "w2_wellbeing": (0.05, 0.3),
                    "w3_planet": (0.05, 0.3),
                    "w4_knowledge": (0.05, 0.3),
                    "w5_efficiency": (0.05, 0.3),
                    "w6_resilience": (0.05, 0.3),
                    "w7_equity": (0.05, 0.3),
                    "w8_beauty": (0.05, 0.3)
                },
                "symbiosky_params": {
                    "conviction_threshold": (0.1, 0.5),
                    "decay_rate_annual": (0.01, 0.2),
                    "anti_whale_lock_max_years": (1, 10),
                    "min_votes": (10, 100),
                    "min_conviction": (5, 50),
                    "score_threshold": (3, 7),
                    "reward_multiplier": (10, 500),
                    "max_reward_per_proposal": (100, 5000)
                }
            }
        )
        self.community_state = community_state
    
    def get_initial_candidate(self) -> Dict[str, Any]:
        return {
            "cds_jurados_weights": {
                "w1_needs": 0.15,
                "w2_wellbeing": 0.12,
                "w3_planet": 0.15,
                "w4_knowledge": 0.12,
                "w5_efficiency": 0.10,
                "w6_resilience": 0.13,
                "w7_equity": 0.10,
                "w8_beauty": 0.13
            },
            "symbiosky_params": {
                "conviction_threshold": 0.2,
                "decay_rate_annual": 0.05,
                "anti_whale_lock_max_years": 5,
                "min_votes": 50,
                "min_conviction": 10,
                "score_threshold": 5,
                "reward_multiplier": 100,
                "max_reward_per_proposal": 1000
            }
        }