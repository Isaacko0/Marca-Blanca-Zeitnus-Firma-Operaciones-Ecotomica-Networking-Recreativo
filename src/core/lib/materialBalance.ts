// HSCSG v15 OS — Contabilidad Metabólica y Límites Ecológicos
// Identidad de balance material, validación de recetas, cuentas separadas

import type { TerritorialStateVector } from './pmcrt';

// ============================================================================
// IDENTIDAD DE BALANCE MATERIAL (Apotegma 21.2)
// Entradas = Productos útiles + Residuos + Emisiones + ΔStocks + Diferencia no explicada
// ============================================================================

export interface MaterialFlow {
  resource: string;
  quantity: number;
  unit: string;
  type: 'input' | 'product' | 'waste' | 'emission' | 'stock_change';
  category?: string;           // 'energy' | 'water' | 'biomass' | 'carbon' | 'soil' | 'other'
  carbon_kg_co2e?: number;     // Para flujos con huella de carbono
  methodology?: string;        // Metodología de cálculo (IPCC, GHG Protocol, local, etc.)
}

export interface ProductionProcess {
  id: string;
  name: string;
  recipe_id: string;
  inputs: MaterialFlow[];
  outputs: MaterialFlow[];
  location: string;
  responsible: string;         // DID
  started_at: number;
  completed_at?: number;
  status: 'planned' | 'running' | 'completed' | 'failed' | 'audited';
  actual_quantities?: boolean; // true = cantidades observadas, false = planificadas
  rao_credential_id?: string;
}

export interface MaterialBalance {
  process_id: string;
  resource: string;
  unit: string;
  inputs: number;
  useful_outputs: number;      // type === 'product'
  waste: number;               // type === 'waste'
  emissions: number;           // type === 'emission'
  stock_change: number;        // type === 'stock_change'
  unexplained_difference: number;
  tolerance: number;           // tolerancia relativa (ej. 0.05 = 5%)
  tolerance_exceeded: boolean;
  carbon_footprint_kg_co2e?: number;
  carbon_methodology?: string;
  measured_at: number;
  measured_by: string;         // DID
  rao_credential_id?: string;
}

export interface MaterialAccount {
  resource: string;
  unit: string;
  category: 'energy' | 'water' | 'biomass' | 'carbon' | 'soil' | 'other';
  balance: number;             // stock actual
  inflows_period: number;      // período actual
  outflows_period: number;
  net_change_period: number;
  methodology: string;         // Metodología declarada para esta cuenta
  last_measured: number;
  measured_by: string;
}

// ============================================================================
// CUENTAS SEPARADAS (No intercambiables)
// Categoría → Unidad principal → Qué registra
// ============================================================================

export type AccountCategory = 'energy' | 'water' | 'biomass' | 'carbon' | 'soil' | 'economy';

export interface SeparatedAccounts {
  energy: EnergyAccount;
  water: WaterAccount;
  biomass: BiomassAccount;
  carbon: CarbonAccount;
  soil: SoilAccount;
  economy: EconomyAccount;
}

export interface EnergyAccount {
  category: 'energy';
  unit: 'kWh';
  consumption_kwh: number;
  generation_kwh: number;
  savings_kwh: number;           // Eficiencia, ahorro
  net_balance_kwh: number;
  renewable_share: number;       // 0-1
  autonomy_hours: number;
  last_measured: number;
}

export interface WaterAccount {
  category: 'water';
  unit: 'm3';
  capture_m3: number;
  availability_m3: number;
  consumption_m3: number;
  infiltration_m3: number;
  recharge_m3: number;
  quality_index: number;         // 0-1
  last_measured: number;
}

export interface BiomassAccount {
  category: 'biomass';
  unit: 'kg';
  production_kg: number;
  consumption_kg: number;
  stocks_kg: number;
  losses_kg: number;
  diversity_index: number;       // 0-1
  last_measured: number;
}

export interface CarbonAccount {
  category: 'carbon';
  unit: 'kg_CO2e';
  emissions_kg_co2e: number;
  removals_kg_co2e: number;
  net_kg_co2e: number;           // removals - emissions (positivo = remoción neta)
  methodology: string;           // IPCC, GHG Protocol, local, etc.
  verification_level: 'estimated' | 'measured' | 'verified_third_party';
  last_measured: number;
}

export interface SoilAccount {
  category: 'soil';
  unit: 'index';
  organic_carbon_percent: number;
  biodiversity_index: number;    // 0-1
  erosion_tons_per_ha_year: number;
  regeneration_net: boolean;     // true = regeneración neta
  bioindicator_score: number;    // 0-1
  last_measured: number;
}

export interface EconomyAccount {
  category: 'economy';
  // Registros separados por unidad
  fiat_usd: { balance: number; inflows: number; outflows: number; };
  fiat_mxn: { balance: number; inflows: number; outflows: number; };
  znu: { balance: number; velocity: number; };     // ZNU transacciones/año
  tq: { balance: number; };                        // TQ límites ±500
  time_hours: { contributed: number; };            // Horas aportadas
  last_measured: number;
}

// ============================================================================
// VALIDACIÓN DE RECETAS PRODUCTIVAS
// ============================================================================

export interface RecipeValidationResult {
  valid: boolean;
  balance: MaterialBalance;
  errors: string[];
  warnings: string[];
}

export function validateRecipeMassBalance(
  process: ProductionProcess,
  default_tolerance: number = 0.05
): RecipeValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Agregar por recurso
  const by_resource: Record<string, { 
    inputs: number; 
    products: number; 
    waste: number; 
    emissions: number; 
    stock_change: number;
    unit: string;
    tolerance: number;
    carbon_kg_co2e: number;
  }> = {};
  
  // Procesar entradas
  for (const flow of process.inputs) {
    if (!by_resource[flow.resource]) {
      by_resource[flow.resource] = {
        inputs: 0, products: 0, waste: 0, emissions: 0, stock_change: 0,
        unit: flow.unit, tolerance: 0.05, carbon_kg_co2e: 0
      };
    }
    by_resource[flow.resource].inputs += flow.quantity;
    if (flow.carbon_kg_co2e) {
      by_resource[flow.resource].carbon_kg_co2e += flow.carbon_kg_co2e;
    }
  }
  
  // Procesar salidas
  for (const flow of process.outputs) {
    if (!by_resource[flow.resource]) {
      by_resource[flow.resource] = {
        inputs: 0, products: 0, waste: 0, emissions: 0, stock_change: 0,
        unit: flow.unit, tolerance: 0.05, carbon_kg_co2e: 0
      };
    }
    
    switch (flow.type) {
      case 'product':
        by_resource[flow.resource].products += flow.quantity;
        break;
      case 'waste':
        by_resource[flow.resource].waste += flow.quantity;
        break;
      case 'emission':
        by_resource[flow.resource].emissions += flow.quantity;
        break;
      case 'stock_change':
        by_resource[flow.resource].stock_change += flow.quantity;
        break;
    }
    
    if (flow.carbon_kg_co2e) {
      by_resource[flow.resource].carbon_kg_co2e += flow.carbon_kg_co2e;
    }
  }
  
  // Validar balance por recurso
  for (const [resource, balance] of Object.entries(by_resource)) {
    const explained = balance.products + balance.waste + balance.emissions + balance.stock_change;
    const unexplained = balance.inputs - explained;
    const relative_diff = balance.inputs > 0 ? Math.abs(unexplained) / balance.inputs : 0;
    
    const tolerance = default_tolerance;
    
    if (relative_diff > tolerance) {
      errors.push(
        `Recurso '${resource}': Diferencia no explicada ${unexplained.toFixed(2)} ${balance.unit} ` +
        `(${relative_diff.toFixed(1)}% de entradas). Tolerancia: ${(tolerance*100).toFixed(1)}%. ` +
        `Entradas: ${balance.inputs}, Explicado: ${explained.toFixed(2)}`
      );
    }
    
    // Advertencias por residuos sin destino
    if (balance.waste > 0) {
      warnings.push(
        `Recurso '${resource}': ${balance.waste} ${balance.unit} de residuos generados. ` +
        `Verificar que tengan destino previsto (compostaje, reciclaje, disposición segura).`
      );
    }
    
    // Advertencia por emisiones sin metodología
    if (balance.emissions > 0 && !process.inputs.some(f => f.carbon_kg_co2e)) {
      warnings.push(
        `Recurso '${resource}': Emisiones sin metodología de carbono declarada. ` +
        `Requerir metodología (IPCC, GHG Protocol, local).`
      );
    }
  }
  
  // Construir balance consolidado para el primer recurso principal
  const main_resource = Object.keys(by_resource)[0] || 'unknown';
  const main_balance = by_resource[main_resource];
  const explained = main_balance.products + main_balance.waste + main_balance.emissions + main_balance.stock_change;
  const unexplained = main_balance.inputs - explained;
  
  const material_balance: MaterialBalance = {
    process_id: process.id,
    resource: main_resource,
    unit: main_balance.unit,
    inputs: main_balance.inputs,
    useful_outputs: main_balance.products,
    waste: main_balance.waste,
    emissions: main_balance.emissions,
    stock_change: main_balance.stock_change,
    unexplained_difference: unexplained,
    tolerance: default_tolerance,
    tolerance_exceeded: Math.abs(unexplained) > default_tolerance * main_balance.inputs,
    carbon_footprint_kg_co2e: main_balance.carbon_kg_co2e,
    measured_at: Date.now(),
    measured_by: process.responsible
  };
  
  return {
    valid: errors.length === 0,
    balance: material_balance,
    errors,
    warnings
  };
}

// ============================================================================
// AGREGACIÓN DE BALANCES PARA NODO TERRITORIAL
// ============================================================================

export function aggregateNodeMaterialBalances(
  processes: ProductionProcess[],
  state: TerritorialStateVector
): { accounts: SeparatedAccounts; balances: MaterialBalance[]; alerts: string[] } {
  const balances: MaterialBalance[] = [];
  const alerts: string[] = [];
  
  // Inicializar cuentas separadas
  const accounts: SeparatedAccounts = {
    energy: { category: 'energy', unit: 'kWh', consumption_kwh: 0, generation_kwh: 0, savings_kwh: 0, net_balance_kwh: 0, renewable_share: 0, autonomy_hours: 0, last_measured: Date.now() },
    water: { category: 'water', unit: 'm3', capture_m3: 0, availability_m3: 0, consumption_m3: 0, infiltration_m3: 0, recharge_m3: 0, quality_index: 0, last_measured: Date.now() },
    biomass: { category: 'biomass', unit: 'kg', production_kg: 0, consumption_kg: 0, stocks_kg: 0, losses_kg: 0, diversity_index: 0, last_measured: Date.now() },
    carbon: { category: 'carbon', unit: 'kg_CO2e', emissions_kg_co2e: 0, removals_kg_co2e: 0, net_kg_co2e: 0, methodology: 'mixed', verification_level: 'estimated', last_measured: Date.now() },
    soil: { category: 'soil', unit: 'index', organic_carbon_percent: state.biosphere.soil_organic_carbon_percent, biodiversity_index: state.biosphere.biodiversity_index, erosion_tons_per_ha_year: state.biosphere.erosion_rate_tons_per_ha_year, regeneration_net: state.biosphere.regeneration_net, bioindicator_score: state.biosphere.bioindicator_score, last_measured: Date.now() },
    economy: { category: 'economy', fiat_usd: { balance: 0, inflows: 0, outflows: 0 }, fiat_mxn: { balance: 0, inflows: 0, outflows: 0 }, znu: { balance: 0, velocity: 0 }, tq: { balance: 0 }, time_hours: { contributed: 0 }, last_measured: Date.now() }
  };
  
  // Procesar cada proceso productivo
  for (const process of processes) {
    const validation = validateRecipeMassBalance(process);
    balances.push(validation.balance);
    
    if (!validation.valid) {
      alerts.push(`Proceso ${process.id} (${process.name}): ${validation.errors.join('; ')}`);
    }
    alerts.push(...validation.warnings);
    
    // Agregar a cuentas separadas
    for (const input of process.inputs) {
      addToAccount(accounts, input, 'input');
    }
    for (const output of process.outputs) {
      addToAccount(accounts, output, 'output');
    }
  }
  
  return { accounts, balances, alerts };
}

function addToAccount(accounts: SeparatedAccounts, flow: MaterialFlow, direction: 'input' | 'output'): void {
  const multiplier = direction === 'input' ? 1 : -1;
  
  switch (flow.category) {
    case 'energy':
      if (flow.type === 'input' || flow.type === 'product') {
        accounts.energy.consumption_kwh += flow.quantity * multiplier;
      } else if (flow.type === 'product') {
        accounts.energy.generation_kwh += flow.quantity * multiplier;
      }
      break;
    case 'water':
      accounts.water.consumption_m3 += flow.quantity * multiplier;
      if (flow.type === 'input') accounts.water.capture_m3 += flow.quantity;
      if (flow.type === 'product' && flow.resource.includes('infiltrat')) accounts.water.infiltration_m3 += flow.quantity;
      break;
    case 'biomass':
      if (flow.type === 'input') accounts.biomass.consumption_kg += flow.quantity;
      if (flow.type === 'product') accounts.biomass.production_kg += flow.quantity;
      if (flow.type === 'waste') accounts.biomass.losses_kg += flow.quantity;
      break;
    case 'carbon':
      if (flow.carbon_kg_co2e) {
        accounts.carbon.emissions_kg_co2e += flow.carbon_kg_co2e * (flow.type === 'emission' ? 1 : -1);
      }
      break;
  }
}

// ============================================================================
// VERIFICACIÓN DE LÍMITES PLANETARIOS Y LOCALES
// ============================================================================

export interface LimitCheck {
  category: AccountCategory;
  metric: string;
  current_value: number;
  planetary_limit: number;
  local_limit?: number;
  status: 'safe' | 'warning' | 'critical' | 'transgressed';
  trend: 'improving' | 'stable' | 'worsening';
  years_to_limit?: number;
}

export function checkPlanetaryLimits(
  accounts: SeparatedAccounts,
  previous_accounts?: SeparatedAccounts
): LimitCheck[] {
  const checks: LimitCheck[] = [];
  
  // Cambio climático (Carbono)
  checks.push({
    category: 'carbon',
    metric: 'CO2e net emissions',
    current_value: accounts.carbon.net_kg_co2e,
    planetary_limit: 0, // Net zero target
    status: accounts.carbon.net_kg_co2e > 0 ? 'safe' : accounts.carbon.net_kg_co2e < -1000000 ? 'critical' : 'warning',
    trend: previous_accounts ? (accounts.carbon.net_kg_co2e > previous_accounts.carbon.net_kg_co2e ? 'improving' : 'worsening') : 'stable',
    years_to_limit: accounts.carbon.net_kg_co2e <= 0 ? undefined : Math.max(1, Math.ceil(-accounts.carbon.net_kg_co2e / Math.max(1, (accounts.carbon.emissions_kg_co2e / 12))))
  });
  
  // Integridad biosfera (Suelo/Biodiversidad)
  checks.push({
    category: 'soil',
    metric: 'Soil organic carbon %',
    current_value: accounts.soil.organic_carbon_percent,
    planetary_limit: 3.0, // Objetivo regenerativo
    local_limit: 4.0,
    status: accounts.soil.organic_carbon_percent >= 4.0 ? 'safe' : accounts.soil.organic_carbon_percent >= 2.0 ? 'warning' : 'critical',
    trend: previous_accounts ? (accounts.soil.organic_carbon_percent > previous_accounts.soil.organic_carbon_percent ? 'improving' : 'worsening') : 'stable'
  });
  
  // Agua dulce
  checks.push({
    category: 'water',
    metric: 'Water consumption vs recharge',
    current_value: accounts.water.consumption_m3,
    planetary_limit: accounts.water.recharge_m3,
    status: accounts.water.consumption_m3 <= accounts.water.recharge_m3 * 0.5 ? 'safe' : 
            accounts.water.consumption_m3 <= accounts.water.recharge_m3 ? 'warning' : 'critical',
    trend: previous_accounts ? (accounts.water.consumption_m3 < previous_accounts.water.consumption_m3 ? 'improving' : 'worsening') : 'stable'
  });
  
  // Flujos biogeoquímicos (N, P) - simplificado via biomasa/suelo
  checks.push({
    category: 'soil',
    metric: 'Erosion rate (t/ha/year)',
    current_value: accounts.soil.erosion_tons_per_ha_year || 0,
    planetary_limit: 1.0, // Tolerable
    local_limit: 5.0,
    status: (accounts.soil.erosion_tons_per_ha_year || 0) <= 1.0 ? 'safe' :
            (accounts.soil.erosion_tons_per_ha_year || 0) <= 5.0 ? 'warning' : 'critical',
    trend: previous_accounts ? ((accounts.soil.erosion_tons_per_ha_year || 0) < (previous_accounts.soil.erosion_tons_per_ha_year || 0) ? 'improving' : 'worsening') : 'stable'
  });
  
  // Uso de suelo
  checks.push({
    category: 'biomass',
    metric: 'Land use intensity',
    current_value: 1 - (accounts.biomass.diversity_index || 0),
    planetary_limit: 0.25, // 75% natural
    status: (accounts.biomass.diversity_index || 0) >= 0.75 ? 'safe' :
            (accounts.biomass.diversity_index || 0) >= 0.5 ? 'warning' : 'critical',
    trend: previous_accounts ? (accounts.biomass.diversity_index > previous_accounts.biomass.diversity_index ? 'improving' : 'worsening') : 'stable'
  });
  
  return checks;
}