# src/hillclimb_adapter/problems/proto_co_validation.py
"""
Phase 0 Proto-CO Validation Problem (Composite)

Validates HSCSG Phase 0: 10 beta cases, 90 days, FSI>30, ξ>0, servitude reduction.
Composite problem using ProtoCOVerifier.
"""

from typing import Any, Dict
from hillclimb import Problem
from ..verifiers.proto_co_verifier import ProtoCOVerifier


class ProtoCOValidationProblem(Problem):
    """Validate HSCSG Phase 0 Proto-CO across 10 beta cases."""
    
    def __init__(self, beta_cases: int = 10):
        super().__init__(
            name="hscsg_phase0_proto_co_validation",
            verifier=ProtoCOVerifier(),
            param_space={
                "deployment_config": {
                    "case_study_type": ["rural_ecovilla", "urban_collective", "peri_urban_coop", "indigenous_community"],
                    "initial_autonomy_level": (0.1, 0.5),
                    "available_land_hectares": (0.5, 50),
                    "water_access": ["well", "municipal", "rainwater", "river"],
                    "energy_potential": ["solar_high", "solar_medium", "wind", "hydro", "mixed"],
                    "community_size": (5, 50),
                    "technical_capacity": ["low", "medium", "high"]
                },
                "intervention_config": {
                    "fabshep_modules_deploy": [
                        "greenhouse_bioclimatic",
                        "aquaponics", 
                        "bioreactor_spirulina",
                        "solar_dehydrator",
                        "composter_automated",
                        "biogas_digester"
                    ],
                    "nutritional_optimizer_profile": ["balanced", "protein_focus", "micronutrient_focus", "caloric_focus"],
                    "governance_bootstrap": ["cds_only", "cds_plus_jurados", "full_symbiosky"],
                    "onboarding_intensity": ["minimal", "standard", "intensive_colaberry"]
                },
                "monitoring_config": {
                    "svd_sensors_deploy": [True, False],
                    "measurement_frequency_days": (1, 30),
                    "external_audit": [True, False],
                    "data_sharing": ["local_only", "federated", "public_anonymized"]
                }
            }
        )
        self.beta_cases = beta_cases
    
    def get_initial_candidate(self) -> Dict[str, Any]:
        return {
            "deployment_config": {
                "case_study_type": "rural_ecovilla",
                "initial_autonomy_level": 0.2,
                "available_land_hectares": 5,
                "water_access": "well",
                "energy_potential": "solar_high",
                "community_size": 15,
                "technical_capacity": "medium"
            },
            "intervention_config": {
                "fabshep_modules_deploy": [
                    "greenhouse_bioclimatic",
                    "aquaponics",
                    "bioreactor_spirulina",
                    "solar_dehydrator",
                    "composter_automated",
                    "biogas_digester"
                ],
                "nutritional_optimizer_profile": "balanced",
                "governance_bootstrap": "cds_plus_jurados",
                "onboarding_intensity": "standard"
            },
            "monitoring_config": {
                "svd_sensors_deploy": True,
                "measurement_frequency_days": 7,
                "external_audit": True,
                "data_sharing": "federated"
            }
        }