// HSCSG v15 OS — Integración/Análisis: Gaia Economy Layer (Commonomics & Tokenomics)
// Mapeo arquitectónico a HSCSG/Zeitnus 5 Capas + Análisis de incompatibilidades con TQ
// Principio Anfibio: valueDual.ts + nodeMode/priceParity — postmonetario (ZNU/CaaS) o conectado (USD/USDC via oracle ReFi Nivel 3)

import type { PurposeBasedOrganization } from '@core/lib/purposeBasedOrg'
import type { NetworkOpennessConfig, AccessTier } from '@core/lib/networkOpenness'
import type { DigitalEnvironment, AgentPresence } from '@core/lib/digitalEnvironment'
import type { PropagationModel, InitiationRitual, GenerativeHandshake, MitosisProtocol } from '@core/lib/propagationModels'
import type { TQState, TQCatalogEntry, TQTransaction } from '@core/state/tq'
import type { ZNUState } from '@core/state/znu'

// ============================================
// RESUMEN EJECUTIVO
// ============================================

export const RESUMEN_EJECUTIVO = `
ASIMILACIÓN: Gaia Economy Layer (Commonomics & Tokenomics) - Documento completo 71K tokens
CONTENIDO: Principios manifiesto, 5 dimensiones económicas, 20+ tokens, CoRe tokenomics, Treasury architecture,
Gaia Impact Fund/Hub, Civilization Stack, Gaia Hub/Market, Credit Clearing, HSOCIAL tokenomics,
Comparative analysis Gaia vs TQ (2 análisis independientes confirmando incompatibilidad radical)

VEREDICTO ARQUITECTÓNICO: 
- Gaia = Arquitectura ReFi multi-token, cloud-based, investor-friendly, export-oriented
- TQ = Protocolo civilizatorio soberano, off-grid, mutual credit zero-balance, daily barter
- HSCSG/Zeitnus = Arquitectura 5 Capas anfibia (Capa 1 TQ, Capa 5 ZNU, Capa 2+5 Gaia/GI3CF separadas)

INCOMPATIBILIDADES CONFIRMADAS (5 fundamentales + 1 operacional):
1. Métrica Valor: Gaia tokens elásticos/mercado vs TQ 1 TQ = 1 kWh fijo inmutable
2. Transacciones: Gaia Market comisiones 2-5% + platform fee vs TQ Reglamento Art.10e 0% comisión
3. Monedas: Gaia GAIAUSD fiat-backed + ORIGEN resource-backed + SPIRALS investment vs TQ sin tasa cambio, no fiat/cripto
4. Gobernanza: Gaia CORE-G token-weighted + reputation vs TQ 1 persona = 1 voto (Manual 13.3)
5. Capital: Gaia capital inversores/impact investors/philanthropy vs TQ cuentas empiezan en 0 (Libro 8.1)
6. Operacional: Gaia emite tokens en almacén (riesgo merma) vs TQ asientos solo en entrega mano-a-mano

PUENTES PERMITIDOS (interoperabilidad referencias/datos, NO fusión valor):
- Catálogo TQ visible en Gaia GPS/Mapa: tq://catalog/{id} (solo lectura)
- Datos abiertos yields/costos TQ → GI3CF indicadores (interoperabilidad DATOS)
- Usuario dual wallet TQ + ZNU/USDC (elige red por transacción)
- Invitaciones mutuas eventos → signalType "free" estigmergica
- Credit Clearing Gaia ↔ ZNU mutual credit (capas separadas)
`;

// ============================================
// MAPEO CAPAS: GAIA ECONOMY LAYER → ARQUITECTURA 5 CAPAS ZEITNUS
// ============================================

/**
 * MAPEO DE CAPAS: Gaia Economy Layer → Zeitnus 5 Capas
 * 
 * Gaia Component                    → Zeitnus Capa
 * ────────────────────────────────────────────────────────────────────────
 * Gaia Union Commons (Constitución) → Capa 2: Gobernanza/Conocimiento (principios/custodia)
 * CoRe (Capa coordinación económica) → Capa 5: Economía Transicional (ZNU/CoRe paralelos)
 * Gaia Hub (Digital Nervous System) → Capa 4: Infraestructura Metabólica (p2p + digital environment)
 * Gaia GPS (AI Matchmaking)         → Capa 4: digitalEnvironment.ts (stigmergicCoordination + signalTypes)
 * Gaia Market (Circulatory System)  → Capa 5: Economía Transicional (Market propio, NO clearing TQ)
 * Gaia Impact Fund (Mother Fund)    → Capa 5: whatmatters.ts + caas.ts + valueEquation.ts (paralelo)
 * Gaia Impact Hub (Orchestrators)   → Capa 3: propagationModels.ts (Initiation Ritual) + digitalEnvironment.ts (venture_space)
 * BioHabitats/EcoHabitats           → Capa 1: samay.ts + feria.ts + virginia.ts (territorio) + propagationModels.ts (Mitosis)
 * Land Tokens (TERRA/BIO token)     → Capa 1: propertyRegimeSystem.ts (Non-Dominium) + custodian (legalFramework.ts)
 * Production Tokens (ORIGEN/SPIRALS) → Capa 5: ZNU + CaaS + incentiveModels.ts (paralelos, no fusión)
 * Labor Tokens (KHRONOS/HSOCIAL/HREGEN) → Capa 2: contributionLogs.ts + learningLayers.ts + symbiosky.ts (reputación)
 * Mutual Credit (SOCIAL/AYNI/OURS)  → Capa 5: trustlines.ts + znu.ts (mutual credit ZNU) + networkOpenness.ts
 * Philanthropy Tokens (Thematic)    → Capa 5: whatmatters.ts (multilateral clearing) + caas.ts
 * Monitoring Tokens (COMMONS/DONATION) → Capa 2: brandCollateral.ts (badges) + governanceTriad.ts (validation)
 * GAIAUSD Stablecoin                → Capa 5: usdglo.ts (oráculo USDGLO ReFi Nivel 3 anfibio) + priceParity oracle
 * Credit Clearing System            → Capa 5: whatmatters.ts (multilateral clearing) + ZNU mutual credit
 * Treasury Architecture (4 layers)  → Capa 5: caasTreasury + whatmatters + alrac.ts (distributed)
 * Governance Tokens (CORE-G)        → Capa 2: governanceTriad.ts + democracia.ts + symbiosky.trust
 * Utility Tokens (CORE-U)           → Capa 5: ZNU (anfibia) + currentSeeSystem.ts (TQ/ZNU/CARE/REP_*)
 * Impact Tokens (CORE-I)            → Capa 1: samay.ts (regeneración ecológica) + integral.ts (OAD ecological)
 * Contribution Tokens (CORE-C)      → Capa 2: contributionLogs.ts + credentialSystem.ts (auto-constructed)
 * 
 * PRINCIPIO CLAVE: Gaia opera en Capa 2+5 (Gobernanza + Economía Transicional)
 * TQ opera en Capa 1 (Autonomía/Regeneración/Continuidad) - SOBERANO, AISLADO
 * ZNU opera en Capa 5 (Economía Transicional) - ANFIBIA, CONECTABLE
 * CoRe/Gaia Market = PARALELO a ZNU/CaaS, NO fusión
 */

export const CAPA_MAPPING_GAIA_TO_ZEITNUS: Array<{
  gaiaComponent: string
  zeitnusCapa: number
  zeitnusModule: string
  notes: string
  compatibility: 'PARALELO' | 'INCOMPATIBLE' | 'PUENTE_REFERENCIA'
}> = [
  // Capa 1: Autonomía/Regeneración/Continuidad (TQ - SOBERANO)
  { gaiaComponent: 'BioHabitats / EcoHabitats (territorio físico)', zeitnusCapa: 1, zeitnusModule: 'samay.ts + feria.ts + virginia.ts + propagationModels.ts (Mitosis)', notes: 'Gaia BioHabitats = materialización territorial; Mitosis replica protocolo reconocimiento', compatibility: 'PARALELO' },
  { gaiaComponent: 'Land Tokens TERRA/BIO token', zeitnusCapa: 1, zeitnusModule: 'propertyRegimeSystem.ts (Non-Dominium) + legalFramework.ts (custodian fiduciario/temporal/auditable/recall)', notes: 'Gaia tokeniza tierra; Zeitnus usa regímenes propiedad + custodian soberano', compatibility: 'PARALELO' },
  { gaiaComponent: 'Impact Tokens CORE-I (hectáreas restauradas, carbono)', zeitnusCapa: 1, zeitnusModule: 'samay.ts (permacultura regeneración) + integral.ts (OAD ecological indicators)', notes: 'Gaia financia restauración; Zeitnus mide regeneración via OAD loop', compatibility: 'PARALELO' },
  
  // Capa 2: Gobernanza/Conocimiento (Integral Loop, Sovereignty, Trust)
  { gaiaComponent: 'Gaia Union Commons (Constitución/Principios)', zeitnusCapa: 2, zeitnusModule: 'purposeBasedOrg.ts (propósito inmutable) + legalFramework.ts (nova legal theory)', notes: 'Gaia = principios voluntarios; Zeitnus = propósito inmutable 90% consenso + immune rights', compatibility: 'PARALELO' },
  { gaiaComponent: 'Governance Tokens CORE-G', zeitnusCapa: 2, zeitnusModule: 'governanceTriad.ts (Base-3) + democracia.ts (DPoS expertise) + symbiosky.ts (conviction voting)', notes: 'Gaia token-weighted + reputation; Zeitnus Base-3 triad + DPoS expertise + conviction', compatibility: 'INCOMPATIBLE' },
  { gaiaComponent: 'Contribution Tokens CORE-C', zeitnusCapa: 2, zeitnusModule: 'contributionLogs.ts + credentialSystem.ts (auto-constructed from contributions)', notes: 'Gaia emite tokens por contribución; Zeitnus registra ValueFlows + credenciales auto-generadas', compatibility: 'PARALELO' },
  { gaiaComponent: 'Labor Tokens KHRONOS/HSOCIAL/HREGEN', zeitnusCapa: 2, zeitnusModule: 'learningLayers.ts (requisite variety) + contributionLogs.ts (labor hours) + symbiosky.ts (reputación)', notes: 'Gaia tokens separados por tipo trabajo; Zeitnus currentSeeSystem unificado (TQ/ZNU/CARE/REP_*)', compatibility: 'PARALELO' },
  { gaiaComponent: 'Monitoring Tokens COMMONS/DONATION', zeitnusCapa: 2, zeitnusModule: 'brandCollateral.ts (badges/RAO) + governanceTriad.ts (validation)', notes: 'Gaia macro indicators + reputacional; Zeitnus RAO credentials + triad validation', compatibility: 'PARALELO' },
  { gaiaComponent: 'Gaia Hub (Directory, GPS, Matchmaking)', zeitnusCapa: 2, zeitnusModule: 'digitalEnvironment.ts (5 layers) + stigmergicCoordination.ts + signalTypes.ts (priming/tracing)', notes: 'Gaia Hub = MetaPlataforma cloud; Zeitnus digitalEnvironment = p2p off-grid + stigmergic signals', compatibility: 'INCOMPATIBLE' },
  { gaiaComponent: 'Gaia GPS (AI Matchmaking)', zeitnusCapa: 2, zeitnusModule: 'stigmergicCoordination.ts (signal discovery) + convergenceMechanisms.ts + credentialSystem.ts', notes: 'Gaia GPS = embeddings cloud + RAG; Zeitnus stigmergic signals + credential-based matching', compatibility: 'INCOMPATIBLE' },
  
  // Capa 3: Operación Productiva (OVN - Bloques 1-2)
  { gaiaComponent: 'Gaia Impact Hub (Incubación/Orquestación)', zeitnusCapa: 3, zeitnusModule: 'propagationModels.ts (Initiation Ritual) + digitalEnvironment.ts (venture_space layer)', notes: 'Gaia Impact Hub = orquestación centralizada; Zeitnus Initiation Ritual = recipe distribuida cualquiera puede iniciar', compatibility: 'PARALELO' },
  { gaiaComponent: 'Regenerative Production (ORIGEN/SPIRALS)', zeitnusCapa: 3, zeitnusModule: 'incentiveModels.ts (5 models paralelos) + valueFlowsIntegration.ts (ExchangeFlow)', notes: 'Gaia tokens producción; Zeitnus 5 incentive models user-chosen per contribution', compatibility: 'PARALELO' },
  
  // Capa 4: Infraestructura Metabólica (p2p, DTN, Mesh)
  { gaiaComponent: 'Gaia Hub (Digital Nervous System)', zeitnusCapa: 4, zeitnusModule: 'p2pInfrastructureStack.ts (Holochain/DHT) + digitalEnvironment.ts (agent presence)', notes: 'Gaia Hub = cloud meta-platform; Zeitnus p2p stack = off-grid DTN mesh LoRa/WiFi/BLE + bridge DTN', compatibility: 'INCOMPATIBLE' },
  { gaiaComponent: 'Gaia OS / Digital Layer', zeitnusCapa: 4, zeitnusModule: 'p2pInfrastructureStack.ts + pluggableArchitecture.ts + holochainIntegration.ts', notes: 'Gaia OS = cloud orchestration; Zeitnus = substrate-agnostic agent-centric p2p', compatibility: 'INCOMPATIBLE' },
  
  // Capa 5: Economía Transicional (ZNU + CaaS + WhatMatters + Gaia Market PARALELO)
  { gaiaComponent: 'CoRe (Commons Regenerative Economy)', zeitnusCapa: 5, zeitnusModule: 'znu.ts (anfibia) + caas.ts + whatmatters.ts (multilateral clearing) + valueEquation.ts', notes: 'CoRe = Capa 5 Gaia; ZNU = Capa 5 Zeitnus; PARALELOS con puentes referencia', compatibility: 'PARALELO' },
  { gaiaComponent: 'Gaia Market (Circulatory System)', zeitnusCapa: 5, zeitnusModule: 'valueFlowsIntegration.ts (ExchangeFlow) + incentiveModels.ts + networkOpenness.ts (credential access)', notes: 'Gaia Market = platform fee 2-5% + comisiones; Zeitnus ExchangeFlow = 0% fee, credential-based access', compatibility: 'INCOMPATIBLE' },
  { gaiaComponent: 'Gaia Impact Fund (Mother Fund)', zeitnusCapa: 5, zeitnusModule: 'whatmatters.ts (multilateral clearing) + caas.ts (revenue streams) + alrac.ts (consorcio transducción)', notes: 'Gaia Impact Fund = fund-of-funds cloud; Zeitnus WhatMatters = multilateral clearing P2P + CaaS anfibio', compatibility: 'PARALELO' },
  { gaiaComponent: 'Production Tokens ORIGEN/SPIRALS/SPIRALL NFTs', zeitnusCapa: 5, zeitnusModule: 'znu.ts (anfibia) + caas.ts + incentiveModels.ts + brandCollateral.ts (RAO assets)', notes: 'Gaia tokens producción/inversión; Zeitnus ZNU + CaaS revenue streams + RAO assets', compatibility: 'PARALELO' },
  { gaiaComponent: 'Mutual Credit SOCIAL/AYNI/OURS', zeitnusCapa: 5, zeitnusModule: 'trustlines.ts (mutual credit ZNU) + znu.ts (demurrage) + networkOpenness.ts (permissionless)', notes: 'Gaia mutual credit cloud; Zeitnus trustlines = bilateral symmetric debt P2P off-grid', compatibility: 'INCOMPATIBLE' },
  { gaiaComponent: 'Philanthropy Thematic Tokens', zeitnusCapa: 5, zeitnusModule: 'whatmatters.ts (obligations multilateral) + caas.ts (revenue streams)', notes: 'Gaia thematic donation pools; Zeitnus WhatMatters obligations + CaaS streams', compatibility: 'PARALELO' },
  { gaiaComponent: 'GAIAUSD Stablecoin', zeitnusCapa: 5, zeitnusModule: 'usdglo.ts (oráculo USDGLO ReFi Nivel 3) + priceParity oracle (ZNU→USDC)', notes: 'GaiaUSD = fiat-backed 1:1; Zeitnus priceParity = ZNU→USDC via ReFi oracle Nivel 3 anfibio', compatibility: 'PUENTE_REFERENCIA' },
  { gaiaComponent: 'Credit Clearing System', zeitnusCapa: 5, zeitnusModule: 'whatmatters.ts (multilateral clearing) + znu.ts (mutual credit) + trustlines.ts', notes: 'Gaia Bank centralized clearing; Zeitnus WhatMatters = multilateral clearing P2P + trustlines bilateral', compatibility: 'PUENTE_REFERENCIA' },
  { gaiaComponent: 'Treasury Architecture (4 layers)', zeitnusCapa: 5, zeitnusModule: 'caas.ts (treasury) + whatmatters.ts + alrac.ts (distributed) + sovereignty.ts', notes: 'Gaia 4-layer treasury; Zeitnus distributed CaaS + WhatMatters + ALRAC + Sovereignty', compatibility: 'PARALELO' },
  { gaiaComponent: 'Utility Tokens CORE-U', zeitnusCapa: 5, zeitnusModule: 'znu.ts (anfibia postmonetario/conectado) + currentSeeSystem.ts (TQ/ZNU/USDC/CARE/REP_*/CERT_*)', notes: 'Gaia CORE-U = marketplace currency; Zeitnus ZNU anfibia + current-sees multidimensionales', compatibility: 'PUENTE_REFERENCIA' },
];

// ============================================
// ANÁLISIS DE INCOMPATIBILIDADES TQ-GAIA (CONFIRMADO POR 2 FUENTES INDEPENDIENTES)
// ============================================

export const INCOMPATIBILIDADES_TQ_GAIA_CONFIRMADAS = [
  {
    id: 'INC-001',
    titulo: 'Métrica de Valor: Elástica/Market vs Fija/Termodinámica',
    gaia: 'Tokens con oferta elástica (CORE-U), acuñados según actividad mercado, NFTs con distribución rendimiento, GAIAUSD respaldada fiat (7.4). Precios variables por proyecto (Panel 2).',
    tq: '1 TQ = 1 kWh FIJO (Libro 7.4). Precio = energía incorporada + materiales + horas (Manual 2.2 C). Queda fijo en catálogo, JAMÁS se negocia al vender.',
    evidencia: 'Ambos análisis independientes (Felipe + revisión web/manual) confirman: Gaia = especulación/mercado; TQ = anti-especulación termodinámica',
    boundaryRule: 'gaia_variable_pricing, gaia_elastic_supply, tq_price_negotiation',
    severidad: 'CRITICAL'
  },
  {
    id: 'INC-002',
    titulo: 'Transacciones: Comisiones Gaia Market vs Prohibición TQ Art.10e',
    gaia: 'Platform fee 2-5% per transaction → Commons Treasury. Marketplace revenue: Project Revenue + Platform Fee → Treasury. Distribución: 50% desarrollo, 30% marketing, 10% referidos (7.2).',
    tq: 'Reglamento Art. 10e: Prohíbe tajantemente cobro comisiones no autorizadas sobre trueques comunitarios. commission = 0 HARD CODED en executeTransaction().',
    evidencia: 'Procesar trueque TQ en Gaia Market violaría normas inquebrantables TQ. Gaia Market fees = extracción; TQ = trueque puro.',
    boundaryRule: 'gaia_platform_commission, transaction_fee && page.host contains "gaia", tq_commission',
    severidad: 'CRITICAL'
  },
  {
    id: 'INC-003',
    titulo: 'Monedas: Fiat/Cripto/Elastic vs Sin Tasa Cambio / No Fiat',
    gaia: 'GAIAUSD 1:1 fiat reserves. CORE-U oferta elástica. ORIGEN resource-backed. SPIRALS investment tokens. NFTs. Tokens se compran/venden por fiat/cripto. Conversión GAIAUSD ↔ fiat seamless.',
    tq: 'Libro 7.4: 1 TQ = 1 kWh, no se compra ni vende por dinero fiduciario ni criptomonedas, no tiene tasa de cambio con ninguna. noBuySellForFiatOrCrypto: true, noExchangeRate: true.',
    evidencia: 'Felipe 23 oct grupo TQ: "tokens Gaia no van a variar su valor" → pero oferta elástica + rendimiento repartido ≠ valores fijos. TQ = medida energía, no activo financiero.',
    boundaryRule: 'gaia_fiat_exchange, gaia_token_exchange, gaia_elastic_supply, tq_buy_sell_fiat, tq_buy_sell_crypto, tq_buy_sell_fiat',
    severidad: 'CRITICAL'
  },
  {
    id: 'INC-004',
    titulo: 'Gobernanza: Token-Weighted (CORE-G) vs 1 Persona = 1 Voto',
    gaia: 'CORE-G holders participan en governance. Voting Power = (Token Holdings × 0.4) + (Reputation Score × 0.4) + (Role Multiplier × 0.2). Decide quien tiene tokens.',
    tq: 'Manual 13.3: Una persona un voto, sin importar lo que aporte cada quien. voteWeight = 1 FIJO hardcoded. Gobernanza TQ decidida por asamblea, no por tokens.',
    evidencia: 'Documento Maestro: "titulares de tokens CORE-G (4.5), o sea q decide quien tiene tokens". TQ: asamblea soberana.',
    boundaryRule: 'gaia_token_governance, token_weighted_vote, gaia_external_capital',
    severidad: 'CRITICAL'
  },
  {
    id: 'INC-005',
    titulo: 'Capital: Dependencia Inversores/Subvenciones vs Arranque Saldo Cero',
    gaia: 'Documento Maestro: "capital de inversores de impacto y subvenciones (4.4)". "Dependencia inicial de capital de subvenciones". Capital sources: impact investors, philanthropic foundations, Gaia Market revenue.',
    tq: 'Libro 8.1: Todas las cuentas empiezan en CERO, sin capital externo. TQ no requiere capital externo para arrancar; empieza con fuerza trabajo comunitaria. noExternalCapital: true.',
    evidencia: 'Uno arranca cuando consigue capital (Gaia). El otro arranca SIN él (TQ).',
    boundaryRule: 'gaia_external_capital, external_funding && page.host contains "gaia"',
    severidad: 'CRITICAL'
  },
  {
    id: 'INC-006',
    titulo: 'Operacional: Emisión en Almacén (Riesgo Merma) vs Asiento en Entrega (Riesgo Impago)',
    gaia: 'Registro nace ANTES del intercambio comercial. Productor cosecha 100kg → emiten 100 tokens → +100 masa circulante SIN comprador -100. Si cacao sufre mermas (humedad, plagas) → tokens circulando con respaldo degradado. Depende verificador humano (oracle problem).',
    tq: 'Crédito Mutuo Saldo Cero: Producir/guardar cacao = 0 TQ. Asiento contable (+/-) SOLO nace en milisegundo exacto entrega mano-a-mano: productor +X, comprador -X (suma total red = 0). No tokens viajando wallet-to-wallet; asientos deuda/crédito bilateral.',
    evidencia: 'Análisis contable independiente confirma: Gaia = tokenización inventario (RWA) con riesgo almacén; TQ = contabilidad bilateral entrega con riesgo impago. Incompatibles si se mezclan motor contable.',
    boundaryRule: 'gaia_inventory_tokenization, tq_zero_balance_delivery',
    severidad: 'CRITICAL'
  }
];

// ============================================
// PUENTES PERMITIDOS (YA IMPLEMENTADOS EN REPO)
// ============================================

export const PUENTES_PERMITIDOS_IMPLEMENTADOS = [
  {
    id: 'BRIDGE-001',
    nombre: 'Catálogo TQ visible en Gaia GPS/Mapa (Solo Lectura)',
    codigo: 'tqEngine.generateVisibleLink(catalogEntryId) → "tq://catalog/{id}"',
    ubicacion: 'src/core/state/tq.ts ~línea 400 + boundaries.ts ALLOW: tq_catalog_reference, tq_visible_link',
    descripcion: 'Gaia puede MOSTRAR costos de producción TQ en su mapa (ej. "Cacao: 600 TQ/ton"). Usuario ve referencia. NO hay transacción, NO hay comisión, NO hay conversión.',
    gaiaBenefit: 'Visibilidad de costos termodinámicos reales para GI3CF indicadores',
    tqBenefit: 'Soberanía intacta, trueque no toca Gaia Market',
    tipo: 'REFERENCIA'
  },
  {
    id: 'BRIDGE-002',
    nombre: 'Datos abiertos yields/costos TQ → GI3CF indicadores',
    codigo: 'Interfaz: { yield_kwh: number; yield_tq: number; location: string; timestamp: number } → digitalEnvironment.ts + stigmergicCoordination.ts',
    ubicacion: 'src/core/lib/digitalEnvironment.ts + src/core/lib/stigmergicCoordination.ts',
    descripcion: 'Nodo TQ publica yields solares, rendimientos cacao, costos TQ como datos públicos. Gaia GI3CF los usa para indicadores T13/T14. SIN clearing conjunto.',
    gaiaBenefit: 'Datos duros para matriz 16×5 indicadores (T13 Agriculture, T14 Nature)',
    tqBeneficio: 'Soberanía datos intacta, solo lectura pública',
    tipo: 'INTEROPERABILIDAD_DATOS'
  },
  {
    id: 'BRIDGE-003',
    nombre: 'Usuario Dual Wallet TQ + ZNU/USDC',
    codigo: 'Wallet TQ (balance TQ) + Wallet ZNU/USDC (balance anfibio) → networkOpenness.ts (universal access) + znu.ts (anfibia)',
    ubicacion: 'src/core/lib/networkOpenness.ts + src/core/state/znu.ts + src/core/state/tq.ts',
    descripcion: 'Usuario paga electricidad/comida en nodo TQ (TQ). Usuario paga curso Gaia Academy / servicio externo en ZNU/USDC (modo conectado). Cada red soberana.',
    gaiaBenefit: 'Usuario Gaia puede acceder a bienes TQ via enlace visible',
    tqBeneficio: 'Usuario TQ puede acceder a servicios Gaia via ZNU conectado',
    tipo: 'USUARIO_SOBERANO_ELIGE'
  },
  {
    id: 'BRIDGE-004',
    nombre: 'Invitaciones Mutuas Eventos/Formaciones',
    codigo: 'stigmergicCoordination.ts: signalType "free" (invitación/celebración) + digitalEnvironment.ts (social_space layer)',
    ubicacion: 'src/core/lib/stigmergicCoordination.ts + src/core/lib/digitalEnvironment.ts',
    descripcion: 'Nodo TQ invita a comunidad Gaia a fiesta cosecha. Gaia invita a nodo TQ a curso Academy. Libre asociación, sin obligación.',
    gaiaBenefit: 'Conexión social cross-red',
    tqBeneficio: 'Conexión social cross-red',
    tipo: 'COORDINACION_ESTIGMERGICA'
  },
  {
    id: 'BRIDGE-005',
    nombre: 'Credit Clearing Gaia ↔ ZNU Mutual Credit (Capas Separadas)',
    codigo: 'whatmatters.ts (multilateral clearing) + znu.ts (demurrage mutual credit) + trustlines.ts (bilateral)',
    ubicacion: 'src/core/lib/whatmatters.ts + src/core/state/znu.ts + src/core/lib/trustlines.ts',
    descripcion: 'Gaia Bank centralized clearing vs Zeitnus WhatMatters multilateral P2P + trustlines bilateral. Cada sistema su clearing. Usuario elige.',
    gaiaBenefit: 'Liquidez para negocios Gaia',
    tqBeneficio: 'Liquidez para trueque TQ/ZNU',
    tipo: 'CLEARING_PARALELO'
  }
];

// ============================================
// RECOMENDACIONES ARQUITECTÓNICAS FINALES
// ============================================

export const RECOMENDACIONES_FINALES = `
1. NO IMPLEMENTAR FUSIÓN TQ + GAIA TOKENS
   - Los 6 límites duros en boundaries.ts + tqEngine.checkBoundaryViolation() ya bloquean la fusión
   - Cada paradigma en su capa: TQ (Capa 1), ZNU (Capa 5), Gaia/CoRe (Capa 2+5 paralela)

2. MANTENER ARQUITECTURA 5 CAPAS ZEITNUS CON GAIA COMO CAPA 2+5 PARALELA
   Capa 1: TQ (Autonomía/Regeneración/Continuidad) - SOBERANO, OFF-GRID
   Capa 2: Integral Loop + Sovereignty + Trust + Gaia Principles (Gobernanza/Conocimiento)
   Capa 3: OVN Bloques 1-2 (Operación Productiva)
   Capa 4: p2p/DTN + Digital Environment (Infraestructura Metabólica)
   Capa 5: ZNU Anfibia + CaaS + WhatMatters + Gaia Market PARALELO (Economía Transicional)

3. PUENTES ÚNICOS PERMITIDOS (YA CODIFICADOS):
   - tq://catalog/{id} → Gaia GPS muestra costos TQ (solo lectura)
   - Datos abiertos yields/costos TQ → GI3CF indicadores (interoperabilidad DATOS)
   - Usuario dual wallet TQ + ZNU/USDC (elige red por transacción)
   - Invitaciones mutuas → signalType "free" estigmergica
   - Credit Clearing paralelo: Gaia Bank vs WhatMatters/trustlines

4. DOCUMENTACIÓN EN REPO:
   - docs/gaia_economy_layer_backup.ts = Backup documento original completo
   - docs/gaia_economy_layer_integration.ts = ESTE archivo (mapeo + incompatibilidades + puentes)
   - boundaries.ts DENY rules = Muros duros (19 reglas)
   - tqEngine.checkBoundaryViolation() = Detector automático (6 tipos)
   - tqEngine.generateVisibleLink() = Único puente valor (referencia catálogo)

5. PRINCIPIO ANFIBIO APLICADO:
   - valueDual.ts + nodeMode/priceParity en store.ts
   - Modo postmonetario (ZNU/CaaS, default offline) ↔ Modo conectado (USD/USDC via oracle ReFi Nivel 3)
   - Gaia Market opera en modo conectado; TQ opera en modo postmonetario
   - ZNU es la unidad anfibia nativa de Zeitnus; Gaia tokens son unidad conectada de Gaia

CONCLUSIÓN: "Vecinos con valla, no compañeros de piso". Cada paradigma en su capa, 
interoperabilidad de referencias/datos/invitaciones, NUNCA fusión de valor/gobernanza/clearing.
`;

export default {
  RESUMEN_EJECUTIVO,
  CAPA_MAPPING_GAIA_TO_ZEITNUS,
  INCOMPATIBILIDADES_TQ_GAIA_CONFIRMADAS,
  PUENTES_PERMITIDOS_IMPLEMENTADOS,
  RECOMENDACIONES_FINALES
};