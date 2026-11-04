// WhatMatters — Tipos de Estado y Estado Inicial
// Compensación Multilateral de Liquidez Comercial (Trade Credit Netting)

export interface Obligation {
  id: string
  debtorId: string        // Quien debe (deudor)
  creditorId: string      // A quien se debe (acreedor)
  amount: number          // Monto en unidad de cuenta (ZNU/USD)
  currency: 'ZNU' | 'USD' | 'LOCAL'
  invoiceRef: string      // Número de factura o concepto
  status: 'DRAFT' | 'PENDING_CONFIRMATION' | 'ACTIVE' | 'IN_CYCLE' | 'CANCELLED' | 'EXTINGUISHED'
  createdAt: number       // timestamp
  confirmedAt?: number    // cuando ambas partes validaron
  extinguishedAt?: number // cuando se ejecutó compensación
  // Para personas físicas: tipo de pasivo
  obligationType?: 'commercial' | 'personal_rent' | 'personal_service' | 'personal_medical' | 'personal_education' | 'personal_maintenance'
}

export interface ClearingCycle {
  id: string
  path: string[]          // Array de obligationIds que forman el ciclo A→B→C→A
  clearingAmount: number  // Cuello de botella = min(monto de cada arista)
  status: 'PROPOSED' | 'CONFIRMED' | 'EXPIRED' | 'CANCELLED' | 'EXTINGUISHED'
  expiresAt: number       // Ventana de confirmación (48-72h)
  createdAt: number
  confirmedAt?: number
  extinguishedAt?: number
  rejectedBy?: string     // participantId que rechazó
  rejectionReason?: string
}

export interface Participant {
  id: string
  taxId: string           // RFC/CUIT/NIF
  legalName: string
  email: string
  // Para triadas de gobernanza base-3
  triadId?: string        // ID de la triada a la que pertenece (3 miembros)
  triadRole?: 'anchor' | 'validator' | 'synthesizer'
  // Métricas de participación
  obligationsRegistered: number
  cyclesParticipated: number
  cyclesConfirmed: number
  liquidityFreed: number  // Total clearingAmount en ciclos extinguidos
  trustScore: number      // 0-100, basado en historial confirmaciones
  createdAt: number
  status: 'ACTIVE' | 'SUSPENDED' | 'UNVERIFIED'
}

export interface ShadowMappingResult {
  cycleId: string
  path: string[]          // obligationIds del ciclo potencial
  clearingAmount: number
  participants: string[]  // participantIds involucrados
  estimatedLiquidityFreed: number
  detectionTs: number
  // Para notificación: "Ya tienes $X compensables esperando"
}

export interface HyperbolicGrowthMetrics {
  totalParticipants: number
  totalObligations: number
  potentialTriads: number      // C(N,3) = N*(N-1)*(N-2)/6
  activeCycles: number
  percolationThreshold: number // N donde componente gigante emerge
  viralCoefficient: number     // K = promedio acreedores invitados por deudor
  compensationRate: number     // % obligaciones extinguidas / totales
  avgCycleLength: number       // 3-5 nodos típicos
  liquidityVelocity: number    // clearingAmount / tiempo promedio
}

export interface WhatMattersState {
  participants: Participant[]
  obligations: Obligation[]
  clearingCycles: ClearingCycle[]
  shadowMappings: ShadowMappingResult[]
  growthMetrics: HyperbolicGrowthMetrics
  // Configuración
  confirmationWindowHours: number  // 48-72h
  maxCycleDepth: number            // 3-5 nodos
  minClearingAmount: number        // Umbral mínimo para proponer ciclo
}

export function makeWhatMattersState(): WhatMattersState {
  return {
    participants: [],
    obligations: [],
    clearingCycles: [],
    shadowMappings: [],
    growthMetrics: {
      totalParticipants: 0,
      totalObligations: 0,
      potentialTriads: 0,
      activeCycles: 0,
      percolationThreshold: 0,
      viralCoefficient: 0,
      compensationRate: 0,
      avgCycleLength: 0,
      liquidityVelocity: 0,
    },
    confirmationWindowHours: 48,
    maxCycleDepth: 5,
    minClearingAmount: 1,
  }
}