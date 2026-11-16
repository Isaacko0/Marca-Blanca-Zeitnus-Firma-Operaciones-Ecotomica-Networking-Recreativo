# src/hillclimb_adapter/problems/kit72h_optimization.py
"""
Kit 72H v2.0 Optimization Problem (Zeitnus v15.1)

Optimizes handshake validation experiment: container, LED, sensor, Spirulina strain, protocol.
Uses GEPA (prompt optimization) + OpenEvolve (hardware config).
"""

from typing import Any, Dict
from hillclimb import Problem
from ..verifiers.xi_verifier import XVerifier  # ξ as primary metric for handshake


class Kit72HOptimizationProblem(Problem):
    """Optimize Kit 72H v2.0 for Spirulina handshake validation."""
    
    def __init__(self):
        super().__init__(
            name="zeitnus_kit72h_optimization",
            verifier=XVerifier(),  # ξ is the success metric for handshake
            param_space={
                "hardware_config": {
                    "container_volume_liters": (5, 50),
                    "container_material": ["glass", "food_grade_plastic", "stainless_steel"],
                    "led_spectrum": ["full_spectrum", "red_blue", "white", "custom"],
                    "led_watts": (5, 50),
                    "sensor_type": ["optical_density", "fluorescence", "weight", "multi"],
                    "spirulina_strain": ["platensis", "maxima", "local_wild", "lab_optimized"],
                    "media_type": ["zarrouk", "bg11", "custom_organic", "waste_based"],
                    "temperature_control": ["passive", "active_heating", "active_cooling", "none"],
                    "mixing_method": ["air_lift", "paddle", "magnetic", "none"]
                },
                "protocol_steps": {
                    "inoculation_density": (0.1, 1.0),  # OD750
                    "measurement_interval_hours": (1, 12),
                    "duration_hours": (48, 120),
                    "data_logging": ["manual", "automated_iot", "both"],
                    "success_criterion": ["verbalized_kwh_biomass", "biomass_doubling", "xi_threshold"]
                }
            }
        )
    
    def get_initial_candidate(self) -> Dict[str, Any]:
        return {
            "hardware_config": {
                "container_volume_liters": 10,
                "container_material": "glass",
                "led_spectrum": "red_blue",
                "led_watts": 20,
                "sensor_type": "optical_density",
                "spirulina_strain": "platensis",
                "media_type": "zarrouk",
                "temperature_control": "passive",
                "mixing_method": "air_lift"
            },
            "protocol_steps": {
                "inoculation_density": 0.3,
                "measurement_interval_hours": 4,
                "duration_hours": 72,
                "data_logging": "automated_iot",
                "success_criterion": "verbalized_kwh_biomass"
            }
        }