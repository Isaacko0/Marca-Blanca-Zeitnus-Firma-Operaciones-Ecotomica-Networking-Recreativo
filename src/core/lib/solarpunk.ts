// HSCSG v15 OS — Lógica del módulo Solarpunk (asimilado de lizTheDeveloper + Isaacko0)
// Economía del don offline-first + ValueFlows + Web of Trust. Medios: don | znu.
// EXTENDIDO: PMCRT — validación de recursos reales, prioridad, anti-doble-asignación

import type {
  Offer, Need, Exchange, Vouch, MeshStatus, SanctuaryEvent, ExchangeMedium,
  OfferKind, NeedKind
} from '@core/state/solarpunk'

const uid = () => Math.random().toString(36).slice(2, 9)

// ============================================================================
// TIPOS EXTENDIDOS PARA PMCRT
// ============================================================================

export interface OfferExtended extends Offer {
  quantity: number;              // Cantidad disponible
  unit: string;                  // Unidad (kg, m3, kWh, horas, etc.)
  location: string;              // Ubicación física
  deliveryPossible: boolean;     // ¿Puede entregarse?
  availableFrom: number;         // Timestamp desde cuando está disponible
  availableUntil?: number;       // Timestamp hasta cuando (opcional)
  status: 'available' | 'reserved' | 'completed' | 'cancelled';
  ecologicalFootprint?: number;  // Huella ecológica estimada (0-1, menor = mejor)
  priority?: number;             // Prioridad de la oferta (1 = alta)
}

export interface NeedExtended extends Need {
  quantity: number;              // Cantidad necesitada
  unit: string;                  // Unidad
  location: string;              // Ubicación donde se necesita
  requiredBy: number;            // Timestamp límite
  urgency: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'matched' | 'partially_matched' | 'closed' | 'cancelled';
  acceptableSubstitutes?: string[]; // Recursos sustitutos aceptables
}

export interface MatchResult {
  needId: string;
  offerId: string | null;
  quantity: number;
  unit: string;
  matched: boolean;
  reason?: string;
  priorityScore?: number;
  reservedQuantity?: number;     // Cantidad reservada de la oferta
}

export interface Reservation {
  offerId: string;
  needId: string;
  quantity: number;
  reservedAt: number;
  expiresAt: number;             // Expiración de reserva (ej. 24h)
  status: 'active' | 'confirmed' | 'released' | 'expired';
}

// Almacén de reservas en memoria (en producción: DB persistente)
const reservations: Map<string, Reservation> = new Map()

// ============================================================================
// MATCHMAKING MEJORADO: VALIDACIÓN RECURSOS REALES, PRIORIDAD, ANTI-DOBLE-ASIGNACIÓN
// ============================================================================

/**
 * Matchmaking ofertas↔necesidades con validación completa:
 * - Tipo/kind compatible
 * - Cantidad suficiente
 * - Unidad compatible
 * - Ubicación compatible o entrega posible
 * - Disponibilidad temporal
 * - Estado activo
 * - Prioridad: urgencia necesidad, proximidad, menor huella ecológica
 * - Reserva atómica de cantidad (evita doble asignación)
 */
export function matchOffersNeeds(
  offers: OfferExtended[], 
  needs: NeedExtended[],
  options: MatchOptions = {}
): MatchResult[] {
  const {
    maxDistanceKm = 50,
    reservationTtlMs = 24 * 60 * 60 * 1000, // 24h
    enableEcologicalPriority = true,
    enableProximityPriority = true,
    enableUrgencyPriority = true
  } = options
  
  const matches: MatchResult[] = []
  const usedOffers = new Map<string, number>() // offerId -> cantidad ya asignada
  
  // Ordenar necesidades por prioridad: urgencia > proximidad > huella ecológica
  const sortedNeeds = [...needs].sort((a, b) => {
    const urgencyOrder = { critical: 4, high: 3, medium: 2, low: 1 }
    const urgencyDiff = urgencyOrder[b.urgency] - urgencyOrder[a.urgency]
    if (urgencyDiff !== 0) return urgencyDiff
    
    // Si misma urgencia, priorizar las que tienen menos ofertas compatibles
    const aCompatible = countCompatibleOffers(a, offers, usedOffers)
    const bCompatible = countCompatibleOffers(b, offers, usedOffers)
    return aCompatible - bCompatible
  })
  
  for (const need of sortedNeeds) {
    if (need.status !== 'open') {
      matches.push({ 
        needId: need.id, 
        offerId: null, 
        quantity: 0, 
        unit: need.unit, 
        matched: false, 
        reason: `Necesidad no abierta: ${need.status}` 
      })
      continue
    }
    
    // Filtrar ofertas compatibles
    const compatibleOffers = offers
      .filter(o => o.status === 'available')
      .filter(o => isKindCompatible(o.kind, need.kind))
      .filter(o => o.unit === need.unit || areUnitsCompatible(o.unit, need.unit))
      .filter(o => {
        const availableQty = o.quantity - (usedOffers.get(o.id) || 0)
        return availableQty >= need.quantity
      })
      .filter(o => isLocationCompatible(o.location, need.location, maxDistanceKm, o.deliveryPossible))
      .filter(o => isTimeCompatible(o.availableFrom, o.availableUntil, need.requiredBy))
      .filter(o => !hasActiveReservationConflict(o.id, need.id))
    
    if (compatibleOffers.length === 0) {
      matches.push({ 
        needId: need.id, 
        offerId: null, 
        quantity: 0, 
        unit: need.unit, 
        matched: false, 
        reason: 'No hay oferta compatible' 
      })
      continue
    }
    
    // Seleccionar mejor oferta según criterios de prioridad
    const bestOffer = selectBestOffer(compatibleOffers, need, {
      enableEcologicalPriority,
      enableProximityPriority,
      enableUrgencyPriority
    })
    
    if (!bestOffer) {
      matches.push({ 
        needId: need.id, 
        offerId: null, 
        quantity: 0, 
        unit: need.unit, 
        matched: false, 
        reason: 'No se pudo seleccionar oferta' 
      })
      continue
    }
    
    // Reservar cantidad atómicamente
    const reservationSuccess = reserveQuantity(
      bestOffer.id, 
      need.id, 
      need.quantity, 
      reservationTtlMs
    )
    
    if (!reservationSuccess) {
      matches.push({ 
        needId: need.id, 
        offerId: null, 
        quantity: 0, 
        unit: need.unit, 
        matched: false, 
        reason: 'Falló reserva de cantidad' 
      })
      continue
    }
    
    // Actualizar cantidad usada
    usedOffers.set(bestOffer.id, (usedOffers.get(bestOffer.id) || 0) + need.quantity)
    
    matches.push({ 
      needId: need.id, 
      offerId: bestOffer.id, 
      quantity: need.quantity, 
      unit: need.unit, 
      matched: true,
      priorityScore: calculatePriorityScore(bestOffer, need),
      reservedQuantity: need.quantity
    })
  }
  
  return matches
}

interface MatchOptions {
  maxDistanceKm?: number
  reservationTtlMs?: number
  enableEcologicalPriority?: boolean
  enableProximityPriority?: boolean
  enableUrgencyPriority?: boolean
}

function countCompatibleOffers(need: NeedExtended, offers: OfferExtended[], usedOffers: Map<string, number>): number {
  return offers.filter(o => 
    o.status === 'available' &&
    isKindCompatible(o.kind, need.kind) &&
    (o.unit === need.unit || areUnitsCompatible(o.unit, need.unit)) &&
    (o.quantity - (usedOffers.get(o.id) || 0)) >= need.quantity &&
    isLocationCompatible(o.location, need.location, 50, o.deliveryPossible) &&
    isTimeCompatible(o.availableFrom, o.availableUntil, need.requiredBy)
  ).length
}

function isKindCompatible(offerKind: OfferKind, needKind: NeedKind): boolean {
  // Mapeo de compatibilidad kind
  const compatibility: Record<OfferKind, NeedKind[]> = {
    bien: ['bien'],
    servicio: ['servicio'],
    tiempo: ['tiempo']
  }
  return compatibility[offerKind]?.includes(needKind) ?? false
}

function areUnitsCompatible(unit1: string, unit2: string): boolean {
  if (unit1 === unit2) return true
  // Conversiones conocidas
  const conversions: Record<string, string[]> = {
    'kg': ['g', 'ton'],
    'g': ['kg', 'ton'],
    'ton': ['kg', 'g'],
    'm3': ['l', 'L'],
    'l': ['m3', 'L'],
    'L': ['m3', 'l'],
    'kWh': ['Wh', 'MWh'],
    'Wh': ['kWh', 'MWh'],
    'MWh': ['kWh', 'Wh'],
    'horas': ['min', 'dias'],
    'min': ['horas', 'dias'],
    'dias': ['horas', 'min']
  }
  return conversions[unit1]?.includes(unit2) ?? false
}

function isLocationCompatible(
  offerLocation: string, 
  needLocation: string, 
  maxDistanceKm: number, 
  deliveryPossible: boolean
): boolean {
  if (offerLocation === needLocation) return true
  if (!deliveryPossible) return false
  // En implementación real: calcular distancia geográfica
  // Placeholder: asumir compatible si deliveryPossible = true
  return deliveryPossible
}

function isTimeCompatible(
  availableFrom: number, 
  availableUntil: number | undefined, 
  requiredBy: number
): boolean {
  const now = Date.now()
  if (availableFrom > requiredBy) return false // Disponible después de cuando se necesita
  if (availableUntil && availableUntil < now) return false // Ya no disponible
  return true
}

function hasActiveReservationConflict(offerId: string, needId: string): boolean {
  for (const reservation of reservations.values()) {
    if (reservation.offerId === offerId && reservation.needId !== needId) {
      if (reservation.status === 'active' && reservation.expiresAt > Date.now()) {
        return true
      }
    }
  }
  return false
}

function selectBestOffer(
  offers: OfferExtended[], 
  need: NeedExtended,
  options: { enableEcologicalPriority: boolean; enableProximityPriority: boolean; enableUrgencyPriority: boolean }
): OfferExtended | null {
  if (offers.length === 0) return null
  if (offers.length === 1) return offers[0]
  
  // Scoring multi-criterio
  const scored = offers.map(offer => ({
    offer,
    score: calculatePriorityScore(offer, need, options)
  }))
  
  scored.sort((a, b) => b.score - a.score)
  return scored[0].offer
}

function calculatePriorityScore(
  offer: OfferExtended, 
  need: NeedExtended,
  options: { enableEcologicalPriority: boolean; enableProximityPriority: boolean; enableUrgencyPriority: boolean }
): number {
  let score = 0
  
  // Prioridad por urgencia de la necesidad (0-40 puntos)
  if (options.enableUrgencyPriority) {
    const urgencyScores = { critical: 40, high: 30, medium: 20, low: 10 }
    score += urgencyScores[need.urgency] || 10
  }
  
  // Prioridad por proximidad (0-30 puntos)
  if (options.enableProximityPriority) {
    // Placeholder: en implementación real calcular distancia real
    const sameLocation = offer.location === need.location
    score += sameLocation ? 30 : (offer.deliveryPossible ? 15 : 0)
  }
  
  // Prioridad por huella ecológica menor (0-20 puntos)
  if (options.enableEcologicalPriority && offer.ecologicalFootprint !== undefined) {
    // Menor huella = mejor score
    score += (1 - offer.ecologicalFootprint) * 20
  }
  
  // Prioridad por disponibilidad inmediata (0-10 puntos)
  const availableNow = offer.availableFrom <= Date.now()
  score += availableNow ? 10 : 0
  
  return score
}

/**
 * Reserva cantidad de una oferta para una necesidad (atómico con TTL)
 * Retorna true si la reserva fue exitosa
 */
export function reserveQuantity(
  offerId: string, 
  needId: string, 
  quantity: number, 
  ttlMs: number = 24 * 60 * 60 * 1000
): boolean {
  const reservationKey = `${offerId}:${needId}`
  const existing = reservations.get(reservationKey)
  
  if (existing && existing.status === 'active' && existing.expiresAt > Date.now()) {
    // Ya existe reserva activa para esta combinación
    return false
  }
  
  // Verificar que la oferta tiene cantidad disponible
  // En implementación real: consultar BD
  // Placeholder: asumir disponible
  
  const reservation: Reservation = {
    offerId,
    needId,
    quantity,
    reservedAt: Date.now(),
    expiresAt: Date.now() + ttlMs,
    status: 'active'
  }
  
  reservations.set(reservationKey, reservation)
  
  // Auto-liberar al expirar TTL
  setTimeout(() => {
    const res = reservations.get(reservationKey)
    if (res && res.status === 'active' && res.expiresAt <= Date.now()) {
      res.status = 'expired'
      reservations.set(reservationKey, res)
    }
  }, ttlMs)
  
  return true
}

/**
 * Confirma una reserva (convierte en asignación definitiva)
 */
export function confirmReservation(offerId: string, needId: string): boolean {
  const reservationKey = `${offerId}:${needId}`
  const reservation = reservations.get(reservationKey)
  
  if (!reservation || reservation.status !== 'active') {
    return false
  }
  
  reservation.status = 'confirmed'
  reservations.set(reservationKey, reservation)
  return true
}

/**
 * Libera una reserva (devuelve cantidad a disponible)
 */
export function releaseReservation(offerId: string, needId: string): boolean {
  const reservationKey = `${offerId}:${needId}`
  const reservation = reservations.get(reservationKey)
  
  if (!reservation) {
    return false
  }
  
  reservation.status = 'released'
  reservations.set(reservationKey, reservation)
  return true
}

/**
 * Obtiene reservas activas para una oferta
 */
export function getActiveReservations(offerId: string): Reservation[] {
  const result: Reservation[] = []
  for (const res of reservations.values()) {
    if (res.offerId === offerId && res.status === 'active' && res.expiresAt > Date.now()) {
      result.push(res)
    }
  }
  return result
}

/**
 * Obtiene cantidad disponible real de una oferta (restando reservas activas)
 */
export function getAvailableQuantity(offer: OfferExtended): number {
  const activeReservations = getActiveReservations(offer.id)
  const reserved = activeReservations.reduce((sum, r) => sum + r.quantity, 0)
  return Math.max(0, offer.quantity - reserved)
}

// ============================================================================
// FUNCIONES ORIGINALES (MANTENIDAS PARA COMPATIBILIDAD)
// ============================================================================

// Web of Trust: trustScore de un member = suma de pesos de avales recibidos (normalizado)
export function trustScore(memberId: string, vouches: Vouch[]): number {
  const received = vouches.filter((v) => v.to === memberId)
  if (received.length === 0) return 0
  const sum = received.reduce((acc, v) => acc + v.weight, 0)
  return Math.min(1, sum / Math.max(1, received.length))
}

// Índice post-monetario: % de intercambios resueltos por DON vs total
export function postMonetaryIndex(exchanges: Exchange[]): number {
  if (exchanges.length === 0) return 0
  const don = exchanges.filter((e) => e.medium === 'don').length
  return Math.round((don / exchanges.length) * 100)
}

// Evaluar activación de red santuario (gate Ley I MJ: proteger personas en riesgo)
export function evaluateSanctuary(reason: string, trustOfActor: number): { pass: boolean; note: string } {
  // Ley I: proteger vida/integridad ante riesgo. Requiere confianza mínima para evitar abuso.
  if (trustOfActor < 0.2) return { pass: false, note: 'Confianza insuficiente (Web of Trust < 0.2). Posible abuso.' }
  if (/riesgo|peligro|emergencia|violencia|salud/i.test(reason)) return { pass: true, note: 'Ley I: protección de persona en riesgo autorizada.' }
  return { pass: false, note: 'Sin señal de riesgo. Ley I no aplica a activación rutinaria.' }
}

// Estado de malla (supervivencia de red)
export function meshStatus(online: boolean, peers: number): MeshStatus {
  return { online, peers, lastSync: online ? Date.now() : null }
}

// Constructor de entidades
export const makeOffer = (resource: string, kind: Offer['kind'], from: string): Offer => ({ id: uid(), resource, kind, from, createdAt: Date.now() })
export const makeNeed = (resource: string, kind: Need['kind'], by: string): Need => ({ id: uid(), resource, kind, by, createdAt: Date.now() })
export const makeExchange = (offerId: string, needId: string, medium: ExchangeMedium, znuAmount = 0): Exchange => ({ id: uid(), offerId, needId, medium, znuAmount, ts: Date.now() })
export const makeVouch = (from: string, to: string, weight: number): Vouch => ({ id: uid(), from, to, weight, ts: Date.now() })
export const makeSanctuary = (reason: string, by: string): SanctuaryEvent => ({ id: uid(), reason, activatedAt: Date.now(), by })

// Constructor extendido para PMCRT
export const makeOfferExtended = (
  resource: string, 
  kind: OfferKind, 
  from: string, 
  quantity: number, 
  unit: string, 
  location: string,
  availableFrom: number = Date.now(),
  options: Partial<OfferExtended> = {}
): OfferExtended => ({
  id: uid(),
  resource,
  kind,
  from,
  quantity,
  unit,
  location,
  deliveryPossible: true,
  availableFrom,
  status: 'available',
  createdAt: Date.now(),
  ...options
})

export const makeNeedExtended = (
  resource: string, 
  kind: NeedKind, 
  by: string, 
  quantity: number, 
  unit: string, 
  location: string,
  requiredBy: number,
  urgency: NeedExtended['urgency'] = 'medium',
  options: Partial<NeedExtended> = {}
): NeedExtended => ({
  id: uid(),
  resource,
  kind,
  by,
  quantity,
  unit,
  location,
  requiredBy,
  urgency,
  status: 'open',
  createdAt: Date.now(),
  ...options
})