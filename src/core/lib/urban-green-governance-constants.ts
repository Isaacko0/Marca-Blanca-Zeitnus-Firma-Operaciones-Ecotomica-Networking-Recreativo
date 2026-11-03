// Constantes para Urban Green Governance
export const SBN_TYPE_LABELS: Record<string, string> = {
  urban_park: 'Parque Urbano',
  botanical_garden: 'Jardín Botánico',
  street_trees: 'Arbolado Vial',
  green_roof: 'Techo Verde',
  rain_garden: 'Jardín de Lluvia',
  wetland: 'Humedal Urbano',
  urban_forest: 'Bosque Urbano',
  green_corridor: 'Corredor Verde',
  industrial_green_buffer: 'Buffer Verde Industrial',
  community_garden: 'Huerto Comunitario',
};

export const SBN_TYPE_ICONS: Record<string, string> = {
  urban_park: 'Trees',
  botanical_garden: 'Flower2',
  street_trees: 'TreePine',
  green_roof: 'Home',
  rain_garden: 'Droplets',
  wetland: 'Waves',
  urban_forest: 'Trees',
  green_corridor: 'Route',
  industrial_green_buffer: 'Factory',
  community_garden: 'Sprout',
};

export const PROJECT_STATUS_LABELS: Record<string, string> = {
  planning: 'Planificación',
  implementation: 'Implementación',
  maintenance: 'Mantenimiento',
  completed: 'Completado',
  monitoring: 'Monitoreo',
};

export const GOVERNANCE_ACTOR_TYPE_LABELS: Record<string, string> = {
  municipality: 'Municipalidad',
  regional_gov: 'Gobierno Regional',
  national_gov: 'Gobierno Nacional',
  property_owner: 'Propietario',
  service_operator: 'Operador Servicios',
  investor: 'Inversionista',
  community_org: 'Org. Comunitaria',
  ngo: 'ONG',
  academic: 'Academia',
  private_company: 'Empresa Privada',
};

export const GOVERNANCE_INSTRUMENT_TYPE_LABELS: Record<string, string> = {
  regulatory: 'Regulatorio',
  economic: 'Económico',
  informational: 'Informacional',
  participatory: 'Participativo',
  land_based: 'Basado en Suelo',
};

export const LAND_VALUE_CAPTURE_INSTRUMENTS: string[] = [
  'betterment_levy',
  'development_charges',
  'tax_increment_financing',
  'land_readjustment',
  'public_land_lease',
  'inclusionary_zoning',
  'density_bonus',
];

export const FUNDING_SOURCE_TYPES: string[] = [
  'public_budget',
  'green_bond',
  'caas_stream',
  'private_investment',
  'international_cooperation',
  'land_value_capture',
  'payment_ecosystem_services',
  'crowdfunding',
  'carbon_credits',
];

export const SBN_TYPES: Array<{ value: string; label: string; icon: string }> = [
  { value: 'urban_park', label: 'Parque Urbano', icon: 'Trees' },
  { value: 'botanical_garden', label: 'Jardín Botánico', icon: 'Flower2' },
  { value: 'street_trees', label: 'Arbolado Vial', icon: 'TreePine' },
  { value: 'green_roof', label: 'Techo Verde', icon: 'Home' },
  { value: 'rain_garden', label: 'Jardín de Lluvia', icon: 'Droplets' },
  { value: 'wetland', label: 'Humedal Urbano', icon: 'Waves' },
  { value: 'urban_forest', label: 'Bosque Urbano', icon: 'Trees' },
  { value: 'green_corridor', label: 'Corredor Verde', icon: 'Route' },
  { value: 'industrial_green_buffer', label: 'Buffer Verde Industrial', icon: 'Factory' },
  { value: 'community_garden', label: 'Huerto Comunitario', icon: 'Sprout' },
];

export const PROJECT_STATUSES: Array<{ value: string; label: string }> = [
  { value: 'planning', label: 'Planificación' },
  { value: 'implementation', label: 'Implementación' },
  { value: 'maintenance', label: 'Mantenimiento' },
  { value: 'completed', label: 'Completado' },
  { value: 'monitoring', label: 'Monitoreo' },
];

export const COORDINATION_MECHANISMS: string[] = [
  'municipal',
  'intermunicipal',
  'public_private',
  'community',
  'mixed',
];

export const DECISION_MAKING_PROCESSES: string[] = [
  'top_down',
  'participatory',
  'co_design',
  'consensus',
];

export const COMMUNITY_PARTICIPATION_LEVELS: string[] = [
  'inform',
  'consult',
  'involve',
  'collaborate',
  'empower',
];

export const LAND_VALUE_CAPTURE_INSTRUMENT_LABELS: Record<string, string> = {
  betterment_levy: 'Tasa de Mejoramiento',
  development_charges: 'Cargos por Desarrollo',
  tax_increment_financing: 'Financiamiento Incremento Tributario',
  land_readjustment: 'Reajuste de Tierras',
  public_land_lease: 'Arrendamiento Tierras Públicas',
  inclusionary_zoning: 'Zonificación Inclusiva',
  density_bonus: 'Bono de Densidad',
};

export const FUNDING_SOURCE_LABELS: Record<string, string> = {
  public_budget: 'Presupuesto Público',
  green_bond: 'Bono Verde',
  caas_stream: 'Stream CaaS',
  private_investment: 'Inversión Privada',
  international_cooperation: 'Cooperación Internacional',
  land_value_capture: 'Captura Plusvalía',
  payment_ecosystem_services: 'Pago Servicios Ecosistémicos',
  crowdfunding: 'Crowdfunding',
  carbon_credits: 'Créditos de Carbono',
};

export const GOVERNANCE_INSTRUMENT_TYPES: Array<{ value: string; label: string }> = [
  { value: 'regulatory', label: 'Regulatorio' },
  { value: 'economic', label: 'Económico' },
  { value: 'informational', label: 'Informacional' },
  { value: 'participatory', label: 'Participativo' },
  { value: 'land_based', label: 'Basado en Suelo' },
];

export const INSTRUMENT_STATUS_LABELS: Record<string, string> = {
  proposed: 'Propuesto',
  approved: 'Aprobado',
  implemented: 'Implementado',
  evaluated: 'Evaluado',
  revised: 'Revisado',
};

export const DISPLACEMENT_RISK_LABELS: Record<string, string> = {
  low: 'Bajo',
  medium: 'Medio',
  high: 'Alto',
  critical: 'Crítico',
};

export const CONTRADICTION_SEVERITY_LABELS: Record<string, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
  critical: 'Crítica',
};

export const CONTRADICTION_DOMAIN_LABELS: Record<string, string> = {
  land_use: 'Uso de Suelo',
  infrastructure: 'Infraestructura',
  services: 'Servicios',
  budget: 'Presupuesto',
  timeline: 'Cronograma',
  environmental: 'Ambiental',
  social: 'Social',
};

export const FUNDING_SOURCE_TYPE_LABELS: Record<string, string> = {
  public_budget: 'Presupuesto Público',
  green_bond: 'Bono Verde',
  caas_stream: 'Stream CaaS',
  private_investment: 'Inversión Privada',
  international_cooperation: 'Cooperación Internacional',
  land_value_capture: 'Captura Plusvalía',
  payment_ecosystem_services: 'Pago Servicios Ecosistémicos',
  crowdfunding: 'Crowdfunding',
  carbon_credits: 'Créditos de Carbono',
};

export const GREEN_BOND_CERTIFICATIONS: string[] = [
  'climate_bonds',
  'green_bond_principles',
  'national',
  'none',
];

export const CAAS_STREAM_KEYS: string[] = [
  'suscripcion',
  'revenue_share',
  'b2b',
  'afiliados_verdes',
  'educacion',
];

export const MONETARY_MODES: Array<{ value: string; label: string }> = [
  { value: 'postmonetario', label: 'Postmonetario (ZNU/CaaS)' },
  { value: 'conectado', label: 'Conectado (USD/USDC via priceParity)' },
];

export const SBN_PROJECT_TYPES = SBN_TYPES;
export const PROJECT_STATUSES_LIST = PROJECT_STATUSES;