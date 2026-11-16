# src/hillclimb_adapter/climbers/custom_automaton.py
"""
Custom Climber: Native HSCSG Autómata Soberano (E²R) as a hillclimb climber.

Implements EXPLORE → EXECUTE (MJ Gate) → REVIEW (SVD+RAO) → retroalimentar.
"""

import asyncio
from typing import Any, Dict, List
from hillclimb import Climber, Candidate
from ..bridge import callTypeScriptModule


class AutomatonE2RClimber(Climber):
    """Native HSCSG Autómata Soberano as a hillclimb climber.
    
    Implements EXPLORE → EXECUTE (MJ Gate) → REVIEW (SVD+RAO) → retroalimentar.
    """
    
    def __init__(self, community_state: Dict[str, Any]):
        super().__init__()
        self.community_state = community_state
        self.automaton = None
    
    async def initialize(self):
        """Load Autómata Soberano from HSCSG."""
        try:
            self.automaton = await callTypeScriptModule(
                "src/core/lib/automaton.ts",
                "createAutomaton",
                [self.community_state]
            )
        except Exception as e:
            print(f"Warning: Could not load Autómata: {e}")
            self.automaton = None
    
    async def propose(self, problem_state: Dict[str, Any]) -> List[Candidate]:
        """EXPLORE phase: generate candidates via E²R tree search."""
        if not self.automaton:
            await self.initialize()
        
        if not self.automaton:
            # Fallback: generate random candidates
            return self._fallback_propose(problem_state)
        
        try:
            # Use Autómata's E²R search to generate diverse candidates
            candidates = await callTypeScriptModule(
                "src/core/lib/automaton.ts",
                "e2rSearch",
                [problem_state, {"budget": 20, "diversity": True}]
            )
            return [Candidate(params=c, metadata={"source": "e2r_search"}) for c in candidates]
        except Exception as e:
            print(f"E²R search failed: {e}")
            return self._fallback_propose(problem_state)
    
    def _fallback_propose(self, problem_state: Dict[str, Any]) -> List[Candidate]:
        """Fallback candidate generation when Autómata unavailable."""
        import random
        candidates = []
        for _ in range(5):
            params = {
                "e2r_config": {
                    "explore_budget": random.randint(10, 30),
                    "explore_depth": random.randint(3, 8),
                    "diversity_weight": random.uniform(0.3, 0.9),
                    "novelty_threshold": random.uniform(0.05, 0.3),
                    "mj_gate_strictness": random.uniform(0.7, 0.95)
                }
            }
            candidates.append(Candidate(params=params, metadata={"source": "fallback_random"}))
        return candidates
    
    async def evaluate(self, candidate: Candidate) -> float:
        """EXECUTE (MJ Gate) + REVIEW (SVD+RAO) → score."""
        # MJ Gate check
        try:
            mj_result = await callTypeScriptModule(
                "src/core/lib/automaton.ts",
                "evaluateMJGate",
                [candidate.params, self.community_state]
            )
            if not mj_result.get("passed", False):
                return 0.0  # Hard constraint: MJ Gate failure = 0 score
        except Exception:
            pass  # If MJ Gate unavailable, continue
        
        # Execute candidate → get metrics
        try:
            execution = await callTypeScriptModule(
                "src/core/lib/automaton.ts",
                "executePlan",
                [candidate.params, self.community_state]
            )
        except Exception:
            return 0.0
        
        # REVIEW: SVD + RAO → metrics
        try:
            metrics = await callTypeScriptModule(
                "src/core/lib/metrics.ts",
                "calculateAllMetrics",
                [execution, self.community_state]
            )
        except Exception:
            return 0.0
        
        # Multi-objective score: CAC + ξ + FSI - σᵤ
        cac = metrics.get("CAC", 0)
        xi = metrics.get("xi", 0)
        fsi = metrics.get("FSI", 0) / 100.0
        sigma_u = metrics.get("sigma_u", 1.0)
        
        score = (
            min(1.0, cac / 5.0) * 0.3 +
            min(1.0, xi / 5.0) * 0.3 +
            fsi * 0.2 +
            (1 - sigma_u) * 0.2
        )
        return max(0.0, min(1.0, score))
    
    async def update(self, candidate: Candidate, score: float):
        """Retroalimentar: update Autómata memory + RAO."""
        try:
            await callTypeScriptModule(
                "src/core/lib/automaton.ts",
                "retroalimentar",
                [candidate.params, score, self.community_state]
            )
        except Exception:
            pass  # Silent failure for retroalimentar