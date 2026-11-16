// HSCSG v15 OS — Resource Registry (OVNi 3.0: Inventory sync NRP-CAS)
// Material & Digital resources, metadata (location, dimensions, quality), scheduling, maintenance
// Capa 3: Operación Productiva — integra con Property Regime + NRP-CAS Core

import type { NRPResource, NRPEvent, NRPAffiliate, VFType } from '@core/lib/nrpCasCore'
import type { PropertyRegimeAssignment, PropertyRegime, CustodianAssignment } from '@core/lib/propertyRegimeSystem'
import { uid, now } from '@core/lib/utils'

// ============================================
// RESOURCE REGISTRY TYPES
// ============================================

export interface ResourceMetadata {
  // Physical metadata
  location?: ResourceLocation
  dimensions?: ResourceDimensions
  weight?: number // kg
  condition: 'new' | 'good' | 'fair' | 'poor' | 'needs_repair' | 'decommissioned'
  qualityScore: number // 0-1
  certifications: Certification[]
  // Digital metadata
  digitalFingerprint?: string // hash for integrity
  version?: string
  dependencies?: string[] // other resource IDs
  // Provenance
  provenance: ProvenanceEntry[]
  // Ecological (Ley I MJ)
  ecologicalFootprint?: EcologicalFootprint
  regenerationStatus?: RegenerationStatus
}

export interface ResourceLocation {
  type: 'fixed' | 'mobile' | 'distributed' | 'virtual'
  coordinates?: GeoCoordinates
  address?: string
  facilityId?: string
  zone?: string
  // FOAM/Open Geolocation Standard (OVNi IT)
  foamLocationId?: string
  trustlessVerified: boolean
  lastVerifiedAt?: number
}

export interface GeoCoordinates {
  latitude: number
  longitude: number
  altitude?: number
  accuracy?: number // meters
  source: 'gps' | 'foam' | 'manual' | 'sensor'
  timestamp: number
}

export interface ResourceDimensions {
  length: number // mm
  width: number
  height: number
  unit: 'mm' | 'cm' | 'm'
}

export interface Certification {
  id: string
  name: string
  issuer: string
  issuedAt: number
  expiresAt?: number
  verified: boolean
  standard: string // ISO, CE, UL, etc.
}

export interface ProvenanceEntry {
  id: string
  eventType: 'created' | 'transferred' | 'modified' | 'maintained' | 'forked' | 'repaired'
  actorId: string
  timestamp: number
  description: string
  previousState?: any
  newState?: any
  // Immutable audit trail
  hash: string
}

export interface EcologicalFootprint {
  carbonKgCO2e: number
  waterLiters: number
  landM2: number
  biodiversityImpact: number // 0-1
  circularityIndex: number // 0-1
  lastCalculated: number
}

export interface RegenerationStatus {
  indicators: EcologicalIndicator[]
  lastAssessment: number
  nextAssessmentDue: number
  trend: 'improving' | 'stable' | 'degrading'
  responsibleCustodians: string[]
}

export interface EcologicalIndicator {
  indicator: 'soil_health' | 'water_quality' | 'biodiversity' | 'carbon_sequestration' | 'circularity' | 'energy_efficiency'
  target: number
  current: number
  unit: string
  trend: 'improving' | 'stable' | 'degrading'
}

export interface SchedulingState {
  available: boolean
  currentBooking?: Booking
  bookings: Booking[]
  maintenanceWindows: MaintenanceWindow[]
  utilizationRate: number // 0-1 over period
  averageBookingDuration: number // hours
}

export interface Booking {
  id: string
  agentId: string
  agentName: string
  startTime: number
  endTime: number
  purpose: string
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed'
  recurrence?: RecurrenceRule
  createdAt: number
}

export interface RecurrenceRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom'
  interval: number
  daysOfWeek?: number[] // 0-6
  endDate?: number
  maxOccurrences?: number
}

export interface MaintenanceWindow {
  id: string
  startTime: number
  endTime: number
  type: 'preventive' | 'corrective' | 'calibration' | 'upgrade' | 'inspection'
  assignedTo: string[]
  description: string
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  recurrence?: RecurrenceRule
}

export interface MaintenanceRecord {
  id: string
  date: number
  performedBy: string[]
  type: 'preventive' | 'corrective' | 'calibration' | 'upgrade' | 'inspection'
  description: string
  cost?: number
  currency?: string
  partsReplaced: string[]
  downtimeHours: number
  nextMaintenanceDue?: number
  certification?: string
  // Quality verification
  verifiedBy?: string
  verifiedAt?: number
  passed: boolean
}

export interface ResourceUsageMetrics {
  totalHoursUsed: number
  totalBookings: number
  averageUtilization: number
  peakUtilization: number
  downtimeHours: number
  maintenanceHours: number
  revenueGenerated: number // TQ/ZNU/USDC
  contributionFlowsGenerated: number
  lastUsedAt?: number
}

// ============================================
// RESOURCE REGISTRY ENGINE
// ============================================

export class ResourceRegistryEngine {
  private resources: Map<string, NRPResource> = new Map()
  private metadata: Map<string, ResourceMetadata> = new Map()
  private scheduling: Map<string, SchedulingState> = new Map()
  private maintenanceRecords: Map<string, MaintenanceRecord[]> = new Map()
  private usageMetrics: Map<string, ResourceUsageMetrics> = new Map()
  private propertyRegimeEngine: any // PropertyRegimeEngine (circular dep avoided)

  constructor(propertyRegimeEngine?: any) {
    this.propertyRegimeEngine = propertyRegimeEngine
    this.initializeDefaultMetrics()
  }

  private initializeDefaultMetrics(): void {
    // Initialize empty metrics for new resources
  }

  setPropertyRegimeEngine(engine: any): void {
    this.propertyRegimeEngine = engine
  }

  // ============================================
  // RESOURCE CRUD
  // ============================================

  registerResource(resource: NRPResource, metadata: ResourceMetadata): NRPResource {
    // Validate property regime
    if (!this.isValidPropertyRegime(resource.propertyRegime)) {
      throw new Error(`Invalid property regime: ${resource.propertyRegime}`)
    }

    // Initialize scheduling
    this.scheduling.set(resource.id, {
      available: true,
      bookings: [],
      maintenanceWindows: [],
      utilizationRate: 0,
      averageBookingDuration: 0,
    })

    // Initialize metadata
    this.metadata.set(resource.id, {
      ...metadata,
      condition: metadata.condition || 'new',
      qualityScore: metadata.qualityScore || 1.0,
      certifications: metadata.certifications || [],
      provenance: [{
        id: uid(),
        eventType: 'created',
        actorId: resource.custodians[0] || 'system',
        timestamp: now(),
        description: `Resource ${resource.name} registered`,
        hash: this.computeHash({ resource, metadata }),
      }],
      ecologicalFootprint: metadata.ecologicalFootprint,
      regenerationStatus: metadata.regenerationStatus,
    } as ResourceMetadata)

    // Initialize maintenance records
    this.maintenanceRecords.set(resource.id, [])
    this.usageMetrics.set(resource.id, this.createEmptyMetrics())

    this.resources.set(resource.id, resource)
    return resource
  }

  private isValidPropertyRegime(regime: string): regime is PropertyRegime {
    return ['private', 'shared', 'commons', 'nondominium'].includes(regime)
  }

  private createEmptyMetrics(): ResourceUsageMetrics {
    return {
      totalHoursUsed: 0,
      totalBookings: 0,
      averageUtilization: 0,
      peakUtilization: 0,
      downtimeHours: 0,
      maintenanceHours: 0,
      revenueGenerated: 0,
      contributionFlowsGenerated: 0,
    }
  }

  private computeHash(data: any): string {
    // Simplified hash for provenance
    return uid()
  }

  getResource(id: string): NRPResource | undefined {
    return this.resources.get(id)
  }

  getResourceMetadata(id: string): ResourceMetadata | undefined {
    return this.metadata.get(id)
  }

  getAllResources(): NRPResource[] {
    return Array.from(this.resources.values())
  }

  getResourcesByVenture(ventureId: string): NRPResource[] {
    return Array.from(this.resources.values()).filter(r => r.ventureIds.includes(ventureId))
  }

  getResourcesByPropertyRegime(regime: PropertyRegime): NRPResource[] {
    return Array.from(this.resources.values()).filter(r => r.propertyRegime === regime)
  }

  getResourcesByCustodian(custodianId: string): NRPResource[] {
    return Array.from(this.resources.values()).filter(r => r.custodians.includes(custodianId))
  }

  // ============================================
  // SYNC WITH NRP-CAS CORE
  // ============================================

  syncFromNRPCAS(nrpResources: Map<string, NRPResource>): void {
    for (const [id, resource] of nrpResources) {
      const existing = this.resources.get(id)
      if (existing) {
        // Update existing
        this.resources.set(id, resource)
        // Preserve local metadata, scheduling, maintenance
      } else {
        // New resource from NRP-CAS
        this.resources.set(id, resource)
        this.metadata.set(id, this.createDefaultMetadata(resource))
        this.scheduling.set(id, { available: true, bookings: [], maintenanceWindows: [], utilizationRate: 0, averageBookingDuration: 0 })
        this.maintenanceRecords.set(id, [])
        this.usageMetrics.set(id, this.createEmptyMetrics())
      }
    }
  }

  syncToNRPCAS(): Map<string, NRPResource> {
    return new Map(this.resources)
  }

  private createDefaultMetadata(resource: NRPResource): ResourceMetadata {
    return {
      condition: 'good',
      qualityScore: 0.8,
      certifications: [],
      provenance: [{
        id: uid(),
        eventType: 'created',
        actorId: 'sync',
        timestamp: now(),
        description: `Synced from NRP-CAS: ${resource.name}`,
        hash: uid(),
      }],
    }
  }

  // ============================================
  // SCHEDULING & BOOKING
  // ============================================

  bookResource(resourceId: string, agentId: string, agentName: string, startTime: number, endTime: number, purpose: string, recurrence?: RecurrenceRule): Booking | null {
    const sched = this.scheduling.get(resourceId)
    if (!sched || !sched.available) return null

    // Check conflicts
    const conflict = sched.bookings.find(b =>
      b.status !== 'cancelled' &&
      startTime < b.endTime &&
      endTime > b.startTime
    )
    if (conflict) return null

    // Check maintenance windows
    const maintenanceConflict = sched.maintenanceWindows.find(w =>
      w.status !== 'cancelled' &&
      startTime < w.endTime &&
      endTime > w.startTime
    )
    if (maintenanceConflict) return null

    // Check property regime access
    if (this.propertyRegimeEngine) {
      const canAccess = this.propertyRegimeEngine.canAccess(resourceId, agentId, 'use')
      if (!canAccess) return null
    }

    const booking: Booking = {
      id: uid(),
      agentId,
      agentName,
      startTime,
      endTime,
      purpose,
      status: 'confirmed',
      recurrence,
      createdAt: now(),
    }

    sched.bookings.push(booking)
    sched.currentBooking = booking
    this.updateUtilization(resourceId)
    return booking
  }

  cancelBooking(resourceId: string, bookingId: string, agentId: string): boolean {
    const sched = this.scheduling.get(resourceId)
    if (!sched) return false

    const booking = sched.bookings.find(b => b.id === bookingId)
    if (!booking || booking.agentId !== agentId) return false

    booking.status = 'cancelled'
    if (sched.currentBooking?.id === bookingId) {
      sched.currentBooking = undefined
    }
    this.updateUtilization(resourceId)
    return true
  }

  completeBooking(resourceId: string, bookingId: string): boolean {
    const sched = this.scheduling.get(resourceId)
    if (!sched) return false

    const booking = sched.bookings.find(b => b.id === bookingId)
    if (!booking) return false

    booking.status = 'completed'
    if (sched.currentBooking?.id === bookingId) {
      sched.currentBooking = undefined
    }

    // Update usage metrics
    const duration = (booking.endTime - booking.startTime) / (1000 * 60 * 60)
    const metrics = this.usageMetrics.get(resourceId)!
    metrics.totalHoursUsed += duration
    metrics.totalBookings += 1
    metrics.lastUsedAt = now()
    this.updateUtilization(resourceId)

    // Generate contribution flow (LaborFlow)
    // Would integrate with NRP-CAS Core

    return true
  }

  getSchedule(resourceId: string, startTime: number, endTime: number): Booking[] {
    const sched = this.scheduling.get(resourceId)
    if (!sched) return []
    return sched.bookings.filter(b =>
      b.status !== 'cancelled' &&
      b.startTime < endTime &&
      b.endTime > startTime
    )
  }

  getAvailability(resourceId: string, startTime: number, endTime: number): boolean {
    const sched = this.scheduling.get(resourceId)
    if (!sched || !sched.available) return false

    return !sched.bookings.some(b =>
      b.status !== 'cancelled' &&
      b.startTime < endTime &&
      b.endTime > startTime
    ) && !sched.maintenanceWindows.some(w =>
      w.status !== 'cancelled' &&
      w.startTime < endTime &&
      w.endTime > startTime
    )
  }

  private updateUtilization(resourceId: string): void {
    const sched = this.scheduling.get(resourceId)
    const metrics = this.usageMetrics.get(resourceId)
    if (!sched || !metrics) return

    const now_ts = now()
    const periodStart = now_ts - 30 * 24 * 60 * 60 * 1000 // last 30 days

    const recentBookings = sched.bookings.filter(b =>
      b.status === 'completed' && b.endTime > periodStart
    )

    metrics.totalBookings = recentBookings.length
    metrics.totalHoursUsed = recentBookings.reduce((sum, b) => sum + (b.endTime - b.startTime) / (1000 * 60 * 60), 0)
    metrics.averageUtilization = metrics.totalHoursUsed / (30 * 24) // assuming 24h availability
    metrics.peakUtilization = Math.max(metrics.peakUtilization, metrics.averageUtilization)
  }

  // ============================================
  // MAINTENANCE MANAGEMENT
  // ============================================

  scheduleMaintenance(
    resourceId: string,
    startTime: number,
    endTime: number,
    type: MaintenanceWindow['type'],
    assignedTo: string[],
    description: string,
    recurrence?: RecurrenceRule
  ): MaintenanceWindow | null {
    const sched = this.scheduling.get(resourceId)
    if (!sched) return null

    const window: MaintenanceWindow = {
      id: uid(),
      startTime,
      endTime,
      type,
      assignedTo,
      description,
      status: 'scheduled',
      recurrence,
    }

    sched.maintenanceWindows.push(window)
    sched.available = false // during maintenance
    return window
  }

  completeMaintenance(
    resourceId: string,
    windowId: string,
    performedBy: string[],
    description: string,
    cost?: number,
    currency?: string,
    partsReplaced: string[] = [],
    downtimeHours: number = 0,
    nextMaintenanceDue?: number,
    passed: boolean = true
  ): MaintenanceRecord | null {
    const sched = this.scheduling.get(resourceId)
    if (!sched) return null

    const window = sched.maintenanceWindows.find(w => w.id === windowId)
    if (!window) return null

    window.status = 'completed'

    const record: MaintenanceRecord = {
      id: uid(),
      date: now(),
      performedBy,
      type: window.type,
      description,
      cost,
      currency,
      partsReplaced,
      downtimeHours,
      nextMaintenanceDue,
      passed,
      verifiedAt: now(),
    }

    const records = this.maintenanceRecords.get(resourceId) || []
    records.push(record)
    this.maintenanceRecords.set(resourceId, records)

    // Update metrics
    const metrics = this.usageMetrics.get(resourceId)!
    metrics.maintenanceHours += downtimeHours
    metrics.downtimeHours += downtimeHours

    // Update resource condition
    const metadata = this.metadata.get(resourceId)
    if (metadata) {
      if (!passed) {
        metadata.condition = 'needs_repair'
      } else if (metadata.condition === 'needs_repair') {
        metadata.condition = 'good'
      }
    }

    // Check if resource available again (no more pending maintenance)
    const pendingMaintenance = sched.maintenanceWindows.filter(w => w.status === 'scheduled' || w.status === 'in_progress')
    if (pendingMaintenance.length === 0) {
      sched.available = true
    }

    return record
  }

  getMaintenanceHistory(resourceId: string): MaintenanceRecord[] {
    return this.maintenanceRecords.get(resourceId) || []
  }

  getUpcomingMaintenance(resourceId: string): MaintenanceWindow[] {
    const sched = this.scheduling.get(resourceId)
    if (!sched) return []
    const now_ts = now()
    return sched.maintenanceWindows.filter(w =>
      w.status === 'scheduled' && w.startTime > now_ts
    ).sort((a, b) => a.startTime - b.startTime)
  }

  // ============================================
  // PROVENANCE & FORK/REMIX (D68)
  // ============================================

  recordProvenance(
    resourceId: string,
    eventType: ProvenanceEntry['eventType'],
    actorId: string,
    description: string,
    previousState?: any,
    newState?: any
  ): ProvenanceEntry {
    const metadata = this.metadata.get(resourceId)
    if (!metadata) throw new Error('Resource not found')

    const entry: ProvenanceEntry = {
      id: uid(),
      eventType,
      actorId,
      timestamp: now(),
      description,
      previousState,
      newState,
      hash: this.computeHash({ eventType, actorId, timestamp: now(), previousState, newState }),
    }

    metadata.provenance.push(entry)
    return entry
  }

  /**
   * Fork resource (creates derivative with remixed provenance)
   * D68: drag resources into category → auto-create process with remixed history
   */
  forkResource(
    resourceId: string,
    forkedBy: string,
    modifications: Partial<NRPResource>,
    newName: string
  ): NRPResource | null {
    const resource = this.resources.get(resourceId)
    if (!resource) return null

    // Check if regime allows forking
    const regimeDef = ['commons', 'nondominium', 'shared'].includes(resource.propertyRegime)
    if (!regimeDef) return null

    // Create forked resource
    const forkedResource: NRPResource = {
      ...resource,
      id: uid(),
      name: newName,
      ventureIds: [],
      processIds: [],
      accessRules: [],
      scheduling: { available: true, bookings: [], maintenanceWindows: [] },
      maintenanceLog: [],
      ...modifications,
    }

    // Register with inherited property regime
    this.registerResource(forkedResource, {
      ...this.metadata.get(resourceId)!,
      provenance: [
        ...(this.metadata.get(resourceId)?.provenance || []),
        {
          id: uid(),
          eventType: 'forked',
          actorId: forkedBy,
          timestamp: now(),
          description: `Forked from ${resource.name} (${resourceId})`,
          previousState: { id: resource.id, name: resource.name },
          newState: { id: forkedResource.id, name: forkedResource.name },
          hash: uid(),
        },
      ],
    })

    // Record fork in original resource provenance
    this.recordProvenance(resourceId, 'forked', forkedBy, `Forked to ${forkedResource.name} (${forkedResource.id})`, undefined, { forkedTo: forkedResource.id })

    return forkedResource
  }

  /**
   * Remix multiple resources into new one
   */
  remixResources(
    resourceIds: string[],
    remixedBy: string,
    newName: string,
    newPropertyRegime: PropertyRegime = 'nondominium'
  ): NRPResource | null {
    if (resourceIds.length < 2) return null

    const resources = resourceIds.map(id => this.resources.get(id)).filter(Boolean) as NRPResource[]
    if (resources.length !== resourceIds.length) return null

    // Combine metadata
    const combinedMetadata: ResourceMetadata = {
      condition: 'new',
      qualityScore: resources.reduce((sum, r) => sum + this.metadata.get(r.id)?.qualityScore || 0, 0) / resources.length,
      certifications: [...new Set(resources.flatMap(r => this.metadata.get(r.id)?.certifications || []))],
      provenance: [{
        id: uid(),
        eventType: 'modified',
        actorId: remixedBy,
        timestamp: now(),
        description: `Remixed from ${resources.map(r => r.name).join(', ')}`,
        previousState: { resources: resourceIds },
        newState: { name: newName },
        hash: uid(),
      }],
    }

    const remixedResource: NRPResource = {
      id: uid(),
      name: newName,
      resourceType: resources[0].resourceType, // take first as base
      unit: resources[0].unit,
      quantity: 1,
      location: resources[0].location,
      tags: [...new Set(resources.flatMap(r => r.tags))],
      createdAt: now(),
      updatedAt: now(),
      propertyRegime: newPropertyRegime,
      ventureIds: [],
      processIds: [],
      accessRules: [],
      scheduling: { available: true, bookings: [], maintenanceWindows: [] },
      maintenanceLog: [],
      custodians: [...new Set(resources.flatMap(r => r.custodians))],
    }

    this.registerResource(remixedResource, combinedMetadata)

    // Record remix in all source resources
    for (const resource of resources) {
      this.recordProvenance(resource.id, 'modified', remixedBy, `Remixed into ${newName} (${remixedResource.id})`, undefined, { remixedTo: remixedResource.id })
    }

    return remixedResource
  }

  // ============================================
  // QUERIES & ANALYTICS
  // ============================================

  getResourceAnalytics(resourceId: string): ResourceAnalytics | null {
    const resource = this.resources.get(resourceId)
    const metadata = this.metadata.get(resourceId)
    const metrics = this.usageMetrics.get(resourceId)
    const sched = this.scheduling.get(resourceId)
    const maintenance = this.maintenanceRecords.get(resourceId)

    if (!resource || !metadata || !metrics || !sched) return null

    return {
      resourceId,
      name: resource.name,
      propertyRegime: resource.propertyRegime,
      condition: metadata.condition,
      qualityScore: metadata.qualityScore,
      utilizationRate: sched.utilizationRate,
      totalHoursUsed: metrics.totalHoursUsed,
      totalBookings: metrics.totalBookings,
      averageBookingDuration: sched.averageBookingDuration,
      maintenanceCount: maintenance?.length || 0,
      totalDowntimeHours: metrics.downtimeHours,
      totalMaintenanceHours: metrics.maintenanceHours,
      revenueGenerated: metrics.revenueGenerated,
      contributionFlowsGenerated: metrics.contributionFlowsGenerated,
      ecologicalFootprint: metadata.ecologicalFootprint,
      regenerationStatus: metadata.regenerationStatus,
      lastUsedAt: metrics.lastUsedAt,
    }
  }

  getRegistrySummary(): RegistrySummary {
    const resources = Array.from(this.resources.values())
    const byRegime = {
      private: resources.filter(r => r.propertyRegime === 'private').length,
      shared: resources.filter(r => r.propertyRegime === 'shared').length,
      commons: resources.filter(r => r.propertyRegime === 'commons').length,
      nondominium: resources.filter(r => r.propertyRegime === 'nondominium').length,
    }

    const byType = resources.reduce((acc, r) => {
      acc[r.resourceType] = (acc[r.resourceType] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const totalUtilization = resources.reduce((sum, r) => sum + (this.scheduling.get(r.id)?.utilizationRate || 0), 0)

    return {
      totalResources: resources.length,
      byRegime,
      byType,
      averageUtilization: resources.length > 0 ? totalUtilization / resources.length : 0,
      resourcesNeedingMaintenance: resources.filter(r => this.metadata.get(r.id)?.condition === 'needs_repair').length,
      resourcesInMaintenance: resources.filter(r => this.scheduling.get(r.id)?.maintenanceWindows.some(w => w.status === 'in_progress')).length,
      availableResources: resources.filter(r => this.scheduling.get(r.id)?.available && !this.scheduling.get(r.id)?.maintenanceWindows.some(w => w.status === 'in_progress')).length,
    }
  }

  // ============================================
  // PERSISTENCE
  // ============================================

  toJSON(): string {
    return JSON.stringify({
      resources: Array.from(this.resources.entries()),
      metadata: Array.from(this.metadata.entries()),
      scheduling: Array.from(this.scheduling.entries()),
      maintenanceRecords: Array.from(this.maintenanceRecords.entries()),
      usageMetrics: Array.from(this.usageMetrics.entries()),
    }, null, 2)
  }

  static fromJSON(json: string, propertyRegimeEngine?: any): ResourceRegistryEngine {
    const data = JSON.parse(json)
    const engine = new ResourceRegistryEngine(propertyRegimeEngine)
    engine.resources = new Map(data.resources)
    engine.metadata = new Map(data.metadata)
    engine.scheduling = new Map(data.scheduling)
    engine.maintenanceRecords = new Map(data.maintenanceRecords)
    engine.usageMetrics = new Map(data.usageMetrics)
    return engine
  }
}

export interface ResourceAnalytics {
  resourceId: string
  name: string
  propertyRegime: PropertyRegime
  condition: string
  qualityScore: number
  utilizationRate: number
  totalHoursUsed: number
  totalBookings: number
  averageBookingDuration: number
  maintenanceCount: number
  totalDowntimeHours: number
  totalMaintenanceHours: number
  revenueGenerated: number
  contributionFlowsGenerated: number
  ecologicalFootprint?: EcologicalFootprint
  regenerationStatus?: RegenerationStatus
  lastUsedAt?: number
}

export interface RegistrySummary {
  totalResources: number
  byRegime: Record<PropertyRegime, number>
  byType: Record<string, number>
  averageUtilization: number
  resourcesNeedingMaintenance: number
  resourcesInMaintenance: number
  availableResources: number
}

export const resourceRegistryEngine = new ResourceRegistryEngine()