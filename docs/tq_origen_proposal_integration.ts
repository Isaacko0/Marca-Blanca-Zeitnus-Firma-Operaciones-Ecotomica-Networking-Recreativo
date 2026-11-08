// HSCSG v15 OS — Integración/Análisis: Propuesta TQ + ORIGEN (Gaia)
// Análisis arquitectónico de incompatibilidades con límites duros TQ ya codificados
// Principio: Respeto a soberanía TQ (Capa 1) + Soberanía Gaia (Capa 2+5) = Vecinos con valla

import type { TQState, TQCatalogEntry } from '@core/state/tq'

// ============================================
// ANÁLISIS ARQUITECTÓNICO: TQ + ORIGEN
// ============================================

/**
 * ESTE DOCUMENTO NO IMPLEMENTA LA FUSIÓN.
 * Documenta POR QUÉ la propuesta viola los límites duros del TQ ya codificados en el repo
 * y define los únicos puentes permitidos (interoperabilidad de datos/referencias, no valor).
 */

// ============================================
// RESUMEN EJECUTIVO
// ============================================

export const RESUMEN_EJECUTIVO = `
PROPUESTA ANALIZADA: "Integración Modelo TQ + Token ORIGEN (Gaia)" - Puente perfecto entre 
economía subsistencia física e intercambio global.

VEREDICTO ARQUITECTÓNICO: **INCOMPATIBLE POR DISEÑO** - La propuesta funde dos paradigmas 
opuestos que el Reglamento TQ, el Libro TQ, el Manual TQ y Felipe declaran irreconciliables.

CONFLICTOS FUNDAMENTALES (5):
1. Métrica Valor vs Especulación: TQ = 1 kWh fijo, inmutable vs ORIGEN elástico, mercado
2. Prohibición Cambiaria vs Comisiones: TQ Art.10e 0% comisión vs Gaia Market 50/30/10%
3. Crédito Mutuo Saldo Cero vs Dinero Fiat/Crypto: TQ no se compra/vende vs ORIGEN fiat-backed
4. Democracia Ensamblaje vs Gobernanza Capital: TQ 1p=1v vs Gaia CORE-G token-weighted
5. Arranque Saldo Cero vs Dependencia Inversores: TQ balance=0 vs Gaia capital externo

EL REPO YA TIENE LOS MUROS CODIFICADOS:
- src/core/lib/boundaries.ts: DEFAULT_BOUNDARY_POLICY.deny (19 reglas)
- src/core/state/tq.ts: HARD CODED constraints + checkBoundaryViolation() 6 tipos
- src/core/state/store.ts: tqEngine.generateVisibleLink() = ÚNICO puente permitido

COLABORACIÓN REAL = INTEROPERABILIDAD DE REFERENCIAS, NO FUSIÓN DE VALOR
`;

// ============================================
// MATRIZ DE VIOLACIONES PASO A PASO
// ============================================

export interface ViolationAnalysis {
  paso: string
  descripcionPropuesta: string
  violacionTQ: string
  reglaRelevante: string
  boundaryRule: string
  severidad: 'CRITICAL' | 'HIGH'
  bloqueadoPor: string
}

export const VIOLACIONES_PASO_A_PASO: ViolationAnalysis[] = [
  {
    paso: 'PASO A: Costeo Termodinámico (600 TQ/ton cacao)',
    descripcionPropuesta: 'Cooperativa calcula costo real producción usando métrica TQ. Campesinos reciben créditos TQ por horas.',
    violacionTQ: 'NINGUNA - Este paso es 100% compatible con TQ. Es el uso correcto de TQ: contabilidad energética intra-comunitaria, saldo cero, remuneración trabajo.',
    reglaRelevante: 'TQ Manual 2.2 C: Precio = energía incorporada + materiales + horas',
    boundaryRule: 'N/A - PERMITIDO',
    severidad: 'HIGH',
    bloqueadoPor: 'N/A - USO CORRECTO DE TQ'
  },
  {
    paso: 'PASO B: Puente Financiación - Comprometer inventario a Pool B1 Gaia Commons',
    descripcionPropuesta: 'Cooperativa compromete tonelada futura cacao a inventario Pool B1 Gaia Commons. Sistema Gaia usa 600 TQ como base para precio ORIGEN. Se acuñan ORIGEN y entregan a tesorería cooperativa.',
    violacionTQ: 'MÚLTIPLES VIOLACIONES CRÍTICAS: (1) Gaia Commons recibe inventario TQ como garantía → capital externo en sistema saldo cero. (2) Costo TQ (600) usado como "base para precio ORIGEN" → precio TQ inmutable se vuelve variable. (3) Acuñación ORIGEN basada en TQ → conversión implícita TQ→ORIGEN (tasa cambio). (4) Pool B1 = vehículo financiero externo con gobernanza token (CORE-G).',
    reglaRelevante: 'TQ Libro 8.1: Cuentas empiezan en 0, sin capital externo. Manual 2.2 C: Precio fijo catálogo, nunca negociable. Libro 7.4: Sin tasa cambio. Reglamento Art.10e: Sin comisiones.',
    boundaryRule: 'gaia_external_capital, gaia_price_negotiation, gaia_variable_pricing, gaia_fiat_exchange, gaia_token_exchange, gaia_elastic_supply, gaia_token_governance',
    severidad: 'CRITICAL',
    bloqueadoPor: 'tqEngine.checkBoundaryViolation({type: "gaia_external_capital"}) + boundaries.ts DENY rules'
  },
  {
    paso: 'PASO C: Adquisición Insumos - Usar ORIGEN en Gaia Market para comprar máquina tostadora (20% descuento)',
    descripcionPropuesta: 'Tesorería usa ORIGEN en Gaia Market para comprar máquina externa. Máquina ingresa como capital físico, "compensa esfuerzo TQ".',
    violacionTQ: '(1) Transacción en Gaia Market = comisiones Gaia (50/30/10% o fondos tesoro) → viola Art.10e. (2) ORIGEN = token fiat-backed/GAIAUSD → TQ no se compra/vende por fiat/cripto. (3) Descuento 20% = precio variable vs TQ fijo. (4) Compra externa con valor derivado de TQ = capital externo entrando.',
    reglaRelevante: 'TQ Reglamento Art.10e: Prohíbe comisiones no autorizadas. Libro 7.4: 1 TQ = 1 kWh, no se compra/vende por fiat/cripto. Libro 8.1: Sin capital externo.',
    boundaryRule: 'gaia_platform_commission, transaction_fee && page.host contains "gaia", tq_buy_sell_fiat, tq_buy_sell_crypto, gaia_fiat_exchange, gaia_external_capital',
    severidad: 'CRITICAL',
    bloqueadoPor: 'boundaries.ts DENY: gaia_platform_commission + tq_buy_sell_fiat + tqEngine.checkBoundaryViolation()'
  },
  {
    paso: 'PASO D: Liquidación - Consumidor final compra cacao con ORIGEN en Gaia Market',
    descripcionPropuesta: 'Cosecha entregada a mercado Gaia. Consumidores compran con ORIGEN. Saca bienes del inventario, "mantiene respaldo moneda 100% íntegro".',
    violacionTQ: '(1) Trueque comunitario (bienes producidos con TQ) procesado en plataforma Gaia con comisiones. (2) Precio en ORIGEN variable vs costo TQ fijo. (3) Bienes salen de soberanía TQ a soberanía Gaia. (4) "Respaldo moneda íntegro" usa métrica TQ para legitimar token especulativo.',
    reglaRelevante: 'TQ Manual 2.2 C: Precio fijo catálogo. Reglamento Art.10e: Sin comisiones. Libro 7.4: Sin tasa cambio.',
    boundaryRule: 'gaia_platform_commission, gaia_price_negotiation, gaia_variable_pricing, gaia_token_exchange',
    severidad: 'CRITICAL',
    bloqueadoPor: 'boundaries.ts DENY + tqEngine.checkBoundaryViolation()'
  }
]

// ============================================
// ANÁLISIS DE "VENTAJAS" CLAIMADAS VS REALIDAD TQ
// ============================================

export interface VentajaAnalysis {
  ventajaClaimada: string
  realidadTQ: string
  compatibilidad: 'COMPATIBLE' | 'INCOMPATIBLE' | 'FALSA DICOTOMÍA'
}

export const VENTAJAS_CLAIMADAS_ANALISIS: VentajaAnalysis[] = [
  {
    ventajaClaimada: '"Evita la Explotación Laboral en el Respaldo de ORIGEN: TQ da límite biofísico claro y garantiza cada hora sudor campesino protegida antes de exportar"',
    realidadTQ: 'TQ YA HACE ESTO SOLO. La contabilidad TQ intra-comunitaria (Paso A) ya protege cada hora de trabajo con saldo cero, precios fijos, sin especulación. No necesita ORIGEN para esto. La "integración" lo que hace es EXPORTAR esa protección a un sistema que NO la respeta (comisiones, gobernanza por tokens, capital externo).',
    compatibilidad: 'FALSA DICOTOMÍA - TQ ya resuelve esto sin Gaia'
  },
  {
    ventajaClaimada: '"Protección contra Inflación de Insumos: Medir en TQ (energía física) permite negociar valor ORIGEN basado en costo físico real, no vaivenes bolsa"',
    realidadTQ: 'TQ YA ES LA PROTECCIÓN. 1 TQ = 1 kWh fijo, inmune a inflación fiduciaria. "Negociar valor ORIGEN basado en TQ" = usar TQ como ancla para dar legitimidad a token elástico. El riesgo: si ORIGEN se devalúa, la comunidad ya comprometió su producción (Paso B) y pierde soberanía.',
    compatibilidad: 'INCOMPATIBLE - TQ no necesita anclar token externo'
  },
  {
    ventajaClaimada: '"Alineación con Propósito Gaia: ORIGEN busca ser moneda producción regenerativa. Requerir TQ interno asegura producción equitativa, local, libre de extracción capitalista"',
    realidadTQ: 'GAIA USA TQ COMO "SELLO DE CALIDAD" PARA LEGITIMAR ORIGEN. Pero Gaia Market cobra comisiones, usa gobernanza por tokens, depende de capital inversores. El "requisito TQ interno" se vuelve marketing: "producido con TQ" pero vendido en plataforma extractiva. TQ no avala ni certifica sistemas externos.',
    compatibilidad: 'INCOMPATIBLE - TQ no certifica ni audita sistemas ajenos'
  }
]

// ============================================
// LO QUE SÍ FUNCIONA: PUENTES PERMITIDOS (CÓDIGO YA EN REPO)
// ============================================

export const PUENTES_PERMITIDOS_IMPLEMENTADOS = [
  {
    nombre: 'Catálogo TQ visible en Gaia GPS/Mapa (Solo Lectura)',
    codigo: 'tqEngine.generateVisibleLink(catalogEntryId) → "tq://catalog/{id}"',
    ubicacion: 'src/core/state/tq.ts línea ~400',
    descripcion: 'Gaia puede MOSTRAR costos de producción TQ en su mapa (ej. "Cacao: 600 TQ/ton"). Usuario ve referencia. NO hay transacción, NO hay comisión, NO hay conversión.',
    boundaryAllow: 'tq_catalog_reference, tq_visible_link'
  },
  {
    nombre: 'Datos abiertos de producción (Interoperabilidad datos, no valor)',
    codigo: 'Interfaz: { yield_kwh: number; yield_tq: number; location: string; timestamp: number }',
    ubicacion: 'src/core/lib/digitalEnvironment.ts + stigmergicCoordination.ts',
    descripcion: 'Nodo TQ publica yields solares, rendimientos cacao, costos TQ como datos públicos. Gaia GI3CF los usa para indicadores T13/T14. SIN clearing conjunto.',
    boundaryAllow: 'Datos ≠ transacciones. Sin Gaia Market involucrado.'
  },
  {
    nombre: 'Usuario decide en qué red transacciona (Dual wallet)',
    codigo: 'Wallet TQ (balance TQ) + Wallet ZNU/USDC (balance anfibio)',
    ubicacion: 'src/core/state/tq.ts + znu.ts + networkOpenness.ts',
    descripcion: 'Usuario paga electricidad/comida en nodo TQ (TQ). Usuario paga curso Gaia Academy / servicio externo en ZNU/USDC (modo conectado). Cada red soberana.',
    boundaryAllow: 'networkOpenness.ts: universal access incondicional + permissionless entry'
  },
  {
    nombre: 'Invitaciones mutuas a eventos/formaciones',
    codigo: 'stigmergicCoordination.ts: signalType "free" (invitación/celebración)',
    ubicacion: 'src/core/lib/stigmergicCoordination.ts + digitalEnvironment.ts',
    descripcion: 'Nodo TQ invita a comunidad Gaia a fiesta cosecha. Gaia invita a nodo TQ a curso Academy. Libre asociación, sin obligación.',
    boundaryAllow: 'signalType "free" = coordinación estigmergica pura, sin valor económico'
  }
]

// ============================================
// CÓMO PROBAR QUE LA PROPUESTA ES BLOQUEADA
// ============================================

export const TESTS_BLOQUEO = `
// TEST 1: Intentar comprometer inventario TQ a Pool B1 Gaia
const attempt1 = tqEngine.checkBoundaryViolation({
  type: 'gaia_external_capital',
  actorId: 'gaia_commons_pool_b1',
  details: { inventory: 'cacao_1ton', tqCost: 600, purpose: 'origen_minting' }
})
// RESULTADO ESPERADO: { blocked: true, reason: 'VIOLACIÓN LIBRO 8.1...', severity: 'critical' }

// TEST 2: Intentar usar costo TQ (600) como base precio ORIGEN variable
const attempt2 = tqEngine.checkBoundaryViolation({
  type: 'gaia_price_negotiation',
  actorId: 'gaia_market_pricing',
  details: { tqCost: 600, proposedOrigenPrice: 'variable', reasoning: 'base_fundamental' }
})
// RESULTADO: { blocked: true, reason: 'VIOLACIÓN MANUAL 2.2 C...', severity: 'critical' }

// TEST 3: Intentar transacción TQ en Gaia Market (comisión)
const attempt3 = tqEngine.checkBoundaryViolation({
  type: 'gaia_platform_commission',
  actorId: 'gaia_market',
  details: { transactionType: 'cacao_sale', commission: '50/30/10%' }
})
// RESULTADO: { blocked: true, reason: 'VIOLACIÓN REGLAMENTO ART. 10e...', severity: 'critical' }

// TEST 4: Intentar comprar máquina externa con ORIGEN (fiat-backed)
const attempt4 = tqEngine.checkBoundaryViolation({
  type: 'tq_buy_sell_fiat',
  actorId: 'cooperativa_tesoreria',
  details: { token: 'ORIGEN', purpose: 'buy_roaster', discount: '20%' }
})
// RESULTADO: { blocked: true, reason: 'VIOLACIÓN LIBRO 7.4...', severity: 'critical' }

// TEST 5: Intentar gobernanza Gaia (CORE-G) sobre nodos TQ
const attempt5 = tqEngine.checkBoundaryViolation({
  type: 'gaia_token_governance',
  actorId: 'gaia_governance',
  details: { token: 'CORE-G', scope: 'tq_node_oversight' }
})
// RESULTADO: { blocked: true, reason: 'VIOLACIÓN MANUAL 13.3...', severity: 'critical' }

// TEST 6: Lo que SÍ pasa (enlace visible simple)
const link = tqEngine.generateVisibleLink('cacao_600tq')
// RESULTADO: { url: 'tq://catalog/cacao_600tq', type: 'tq_catalog_reference', entryId: 'cacao_600tq' }
// Gaia puede MOSTRAR este enlace en su GPS/Mapa. SOLO LECTURA.
`

// ============================================
// RECOMENDACIÓN ARQUITECTÓNICA FINAL
// ============================================

export const RECOMENDACION_FINAL = `
NO IMPLEMENTAR LA FUSIÓN TQ + ORIGEN.

MANTENER:
1. TQ en Capa 1: Soberano, off-grid, 1 TQ = 1 kWh, 0% comisión, 1p=1v, saldo cero
2. ZNU en Capa 5: Anfibio (postmonetario/conectado), priceParity ReFi Nivel 3, demurrage
3. Gaia/GI3CF en Capa 2+5: Alianza impacto/innovación, Market propio, gobernanza propia
4. PUENTES ÚNICOS PERMITIDOS (ya codificados):
   - tq://catalog/{id} → Gaia GPS muestra costos TQ (solo lectura)
   - Datos abiertos yields/costos → GI3CF indicadores (interoperabilidad datos)
   - Usuario dual wallet → elige red por transacción
   - Invitaciones mutuas → signalType "free" estigmergica

DOCUMENTAR EN REPO:
- docs/tq_origen_proposal_backup.ts = Backup propuesta original
- docs/tq_origen_proposal_integration.ts = ESTE archivo (análisis incompatibilidades)
- boundaries.ts DENY rules = Muros duros que la bloquean
- tqEngine.checkBoundaryViolation() = Detector automático de intentos

CONCLUSIÓN: "Vecinos con valla, no compañeros de piso". Cada paradigma en su capa, 
interoperabilidad de referencias/datos, NUNCA fusión de valor/gobernanza/clearing.
`;

export default {
  RESUMEN_EJECUTIVO,
  VIOLACIONES_PASO_A_PASO,
  VENTAJAS_CLAIMADAS_ANALISIS,
  PUENTES_PERMITIDOS_IMPLEMENTADOS,
  TESTS_BLOQUEO,
  RECOMENDACION_FINAL
};