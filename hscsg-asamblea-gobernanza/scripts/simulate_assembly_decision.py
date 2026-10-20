#!/usr/bin/env python3
"""
Simula impacto de cambio de parámetros asamblearios sobre métricas clave.
Uso: python simulate_assembly_decision.py --param tresFondos.porcentajeFijoExcedenteFiat --value 0.15
"""
import json
import sys
import argparse
from copy import deepcopy
from pathlib import Path

def load_config(config_path: str = None):
    if config_path is None:
        config_path = Path(__file__).parent.parent / "templates" / "asamblea-parametros.json"
    with open(config_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def set_nested(obj: dict, path: str, value):
    """Set nested dictionary value using dot notation path."""
    keys = path.split('.')
    for k in keys[:-1]:
        obj = obj.setdefault(k, {})
    obj[keys[-1]] = value

def get_nested(obj: dict, path: str):
    """Get nested dictionary value using dot notation path."""
    keys = path.split('.')
    for k in keys:
        if isinstance(obj, dict) and k in obj:
            obj = obj[k]
        else:
            return None
    return obj

def simulate(config: dict, param_path: str, new_value):
    """Simulate parameter change and return projected metrics."""
    sim = deepcopy(config)
    set_nested(sim, param_path, new_value)
    
    # Calculate derived metrics (simplified estimation)
    metrics = {
        "excedente_anual_fondos_znu": estimate_annual_fund_excess(sim),
        "cobertura_cuidado_pct": estimate_care_coverage(sim),
        "brecha_equidad_gini": estimate_equity_gap(sim),
        "consentimiento_memoria_pct": estimate_memory_consent(sim),
        "excedente_autotrofia_znu": estimate_autotrofia_excess(sim)
    }
    return metrics, sim

def estimate_annual_fund_excess(cfg: dict) -> float:
    """Estimate annual ZNU flowing to three funds."""
    base_excess_fiat = 100000  # ZNU/año estimado desde excedente fiat neto
    pct = cfg['tresFondos']['porcentajeFijoExcedenteFiat']
    return round(base_excess_fiat * pct, 2)

def estimate_care_coverage(cfg: dict) -> float:
    """Estimate preventive care coverage percentage."""
    # Base coverage depends on fondo cuidado allocation + member thresholds
    fondo_cuidado = cfg['tresFondos']['pesosInternos']['cuidado']
    total_fondos = cfg['tresFondos']['porcentajeFijoExcedenteFiat']
    miembro_aut = cfg['miembro']['autMinimo']
    miembro_cds = cfg['miembro']['cdsMinimo']
    
    # Simplified: coverage = fondo_cuidado * total_fondos * (AUT+CDS)/2 * 1000
    base = fondo_cuidado * total_fondos * ((miembro_aut + miembro_cds) / 2) * 1000
    return round(min(base, 100.0), 1)

def estimate_equity_gap(cfg: dict) -> float:
    """Estimate Gini coefficient for equity (lower = better)."""
    # Simplified: equity improves with higher demurrage, lower thresholds
    demurrage = cfg['metodosReparticion']['caasRevenueShare']['demurrageRate']
    threshold = cfg['metodosReparticion']['caasRevenueShare']['demurrageThreshold']
    aut_weight = cfg['metodosReparticion']['caasRevenueShare']['autWeight']
    cds_weight = cfg['metodosReparticion']['caasRevenueShare']['cdsWeight']
    
    # Base Gini ~0.4, improves with demurrage and balanced weights
    base_gini = 0.40
    improvement = (demurrage * 0.5) + (0.1 if abs(aut_weight - cds_weight) < 0.1 else 0)
    penalty = (threshold / 1000) * 0.05
    return round(max(base_gini - improvement + penalty, 0.15), 3)

def estimate_memory_consent(cfg: dict) -> float:
    """Estimate active consent percentage for memory fund."""
    consent_revocable = cfg['datosSensibles']['consentimientoRevocable']
    off_ledger = cfg['datosSensibles']['datosPersonalesOffLedger']
    hashes_only = cfg['datosSensibles']['soloHashesEnRAO']
    
    base = 50.0  # Base 50%
    if consent_revocable: base += 20
    if off_ledger: base += 15
    if hashes_only: base += 10
    return round(min(base, 95.0), 1)

def estimate_autotrofia_excess(cfg: dict) -> float:
    """Estimate ZNU flowing to autotrofia fund."""
    base_excess = 100000
    pct = cfg['tresFondos']['porcentajeFijoExcedenteFiat']
    peso_auto = cfg['tresFondos']['pesosInternos']['autotrofia']
    return round(base_excess * pct * peso_auto, 2)

def print_metrics(metrics: dict, param_path: str, new_value, old_value):
    print(f"\n=== SIMULACIÓN: {param_path} = {old_value} → {new_value} ===\n")
    print("MÉTRICAS PROYECTADAS:")
    print(f"  💰 Excedente anual a tres fondos:     {metrics['excedente_anual_fondos_znu']:>10,.0f} ZNU/año")
    print(f"  🏥 Cobertura cuidado preventivo:      {metrics['cobertura_cuidado_pct']:>10.1f}%")
    print(f"  ⚖️  Brecha equidad (Gini):             {metrics['brecha_equidad_gini']:>10.3f}")
    print(f"  🧠 Consentimiento memoria activo:     {metrics['consentimiento_memoria_pct']:>10.1f}%")
    print(f"  🌱 Excedente autotrofia:              {metrics['excedente_autotrofia_znu']:>10,.0f} ZNU/año")
    
    # Alertas
    alerts = []
    if metrics['cobertura_cuidado_pct'] < 50:
        alerts.append("⚠️ Cobertura cuidado < 50% - Revisar D1/D8")
    if metrics['brecha_equidad_gini'] > 0.35:
        alerts.append("⚠️ Gini > 0.35 - Desigualdad alta - Revisar demurrage/pesos")
    if metrics['consentimiento_memoria_pct'] < 70:
        alerts.append("⚠️ Consentimiento memoria < 70% - Revisar D5")
    
    if alerts:
        print("\n🚨 ALERTAS:")
        for a in alerts:
            print(f"  {a}")
    else:
        print("\n✅ Todas las métricas en rangos saludables")

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Simula impacto de decisión asamblearia')
    parser.add_argument('--param', required=True, help='Ruta parámetro (dot notation), ej: tresFondos.porcentajeFijoExcedenteFiat')
    parser.add_argument('--value', required=True, type=float, help='Nuevo valor numérico')
    parser.add_argument('--config', help='Ruta a asamblea-parametros.json (opcional)')
    parser.add_argument('--output', help='Guardar config simulada como JSON')
    args = parser.parse_args()

    config = load_config(args.config)
    old_value = get_nested(config, args.param)
    
    if old_value is None:
        print(f"❌ Parámetro '{args.param}' no encontrado en config")
        sys.exit(1)
    
    if not isinstance(old_value, (int, float)):
        print(f"❌ Parámetro '{args.param}' no es numérico (tipo: {type(old_value).__name__})")
        sys.exit(1)

    metrics, sim_config = simulate(config, args.param, args.value)
    print_metrics(metrics, args.param, args.value, old_value)
    
    if args.output:
        with open(args.output, 'w', encoding='utf-8') as f:
            json.dump(sim_config, f, indent=2, ensure_ascii=False)
        print(f"\n💾 Config simulada guardada en: {args.output}")