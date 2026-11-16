// arm-sensorica/src/core/resourcePool.ts - Resource Pool & Mutualization
import { 
  ResourcePool, 
  ResourcePoolId, 
  Resource, 
  ResourceType, 
  ResourceMetadata,
  AccessRule, 
  AccessCondition,
  TimeRestriction,
  ResourceAccessRequest,
  PropertyRegime,
  CommonsRules,
  UsageLimit,
  ConflictResolutionProcess,
  AmendmentProcess,
  PropertyRegimeType,
  GovernanceRole,
  AffiliateId,
  Quantity,
  GeoLocation,
  Duration,
  Percentage
} from '../types';

import { generateId, now } from '../utils';

// ============================================
// RESOURCE POOL REPOSITORY
// ============================================

export interface ResourcePoolRepository {
  save(pool: ResourcePool): Promise<ResourcePool>;
  findById(id: ResourcePoolId): Promise<ResourcePool | null>;
  findAll(): Promise<ResourcePool[]>;
  findByLocation(location: GeoLocation): Promise<ResourcePool[]>;
  findByPropertyRegime(regime: PropertyRegimeType): Promise<ResourcePool[]>;
  update(pool: ResourcePool): Promise<ResourcePool>;
  delete(id: ResourcePoolId): Promise<boolean>;
}

export class InMemoryResourcePoolRepository implements ResourcePoolRepository {
  private pools: Map<string, ResourcePool> = new Map();

  async save(pool: ResourcePool): Promise<ResourcePool> {
    this.pools.set(pool.id as string, pool);
    return pool;
  }

  async findById(id: ResourcePoolId): Promise<ResourcePool | null> {
    return this.pools.get(id as string) || null;
  }

  async findAll(): Promise<ResourcePool[]> {
    return Array.from(this.pools.values());
  }

  async findByLocation(location: GeoLocation): Promise<ResourcePool[]> {
    return Array.from(this.pools.values()).filter(p => 
      p.location && 
      Math.abs(p.location.lat - location.lat) < 0.01 &&
      Math.abs(p.location.lng - location.lng) < 0.01
    );
  }

  async findByPropertyRegime(regime: PropertyRegimeType): Promise<ResourcePool[]> {
    return Array.from(this.pools.values()).filter(p => p.propertyRegime.type === regime);
  }

  async update(pool: ResourcePool): Promise<ResourcePool> {
    this.pools.set(pool.id as string, pool);
    return pool;
  }

  async delete(id: ResourcePoolId): Promise<boolean> {
    return this.pools.delete(id as string);
  }
}

// ============================================
// RESOURCE POOL SERVICE
// ============================================

export interface ResourcePoolService {
  createPool(input: CreatePoolInput): Promise<ResourcePool>;
  addResource(poolId: ResourcePoolId, resource: Resource): Promise<ResourcePool>;
  removeResource(poolId: ResourcePoolId, resourceId: string): Promise<ResourcePool>;
  updateResource(poolId: ResourcePoolId, resource: Resource): Promise<ResourcePool>;
  requestAccess(request: ResourceAccessRequest): Promise<ResourceAccessRequest>;
  approveAccess(requestId: string, approverId: string): Promise<ResourceAccessRequest>;
  getAvailableResources(poolId: ResourcePoolId, affiliateId: string, time: Date): Promise<Resource[]>;
}

export interface CreatePoolInput {
  name: string;
  description: string;
  propertyRegime: PropertyRegime;
  location?: GeoLocation;
  stewardId?: string;
  accessRules?: AccessRule[];
}

export class ResourcePoolServiceImpl implements ResourcePoolService {
  constructor(private repo: ResourcePoolRepository) {}

  async createPool(input: CreatePoolInput): Promise<ResourcePool> {
    const pool: ResourcePool = {
      id: generateId('pool') as any,
      resources: [],
      accessRules: input.accessRules || [],
      propertyRegime: input.propertyRegime,
      location: input.location,
      stewardId: input.stewardId as any
    };
    return this.repo.save(pool);
  }

  async addResource(poolId: ResourcePoolId, resource: Resource): Promise<ResourcePool> {
    const pool = await this.repo.findById(poolId);
    if (!pool) throw new Error('Resource pool not found');
    
    const newPool = {
      ...pool,
      resources: [...pool.resources, resource]
    };
    return this.repo.update(newPool);
  }

  async removeResource(poolId: ResourcePoolId, resourceId: string): Promise<ResourcePool> {
    const pool = await this.repo.findById(poolId);
    if (!pool) throw new Error('Resource pool not found');
    
    const newPool = {
      ...pool,
      resources: pool.resources.filter(r => r.id !== resourceId)
    };
    return this.repo.update(newPool);
  }

  async updateResource(poolId: ResourcePoolId, resource: Resource): Promise<ResourcePool> {
    const pool = await this.repo.findById(poolId);
    if (!pool) throw new Error('Resource pool not found');
    
    const newPool = {
      ...pool,
      resources: pool.resources.map(r => r.id === resource.id ? resource : r)
    };
    return this.repo.update(newPool);
  }

  async requestAccess(request: ResourceAccessRequest): Promise<ResourceAccessRequest> {
    // In real implementation, would store request and check rules
    // For now, return request with status based on rules
    return request;
  }

  async approveAccess(requestId: string, approverId: string): Promise<ResourceAccessRequest> {
    // In real implementation, would update request status
    throw new Error('Not implemented - would update request status');
  }

  async getAvailableResources(poolId: ResourcePoolId, affiliateId: string, time: Date): Promise<Resource[]> {
    const pool = await this.repo.findById(poolId);
    if (!pool) return [];
    
    return pool.resources.filter(r => {
      // Check capacity
      if (r.currentUsage.value >= r.capacity.value) return false;
      
      // Check access rules
      const rules = pool.accessRules.filter(r => r.resourceId === r.id);
      if (rules.length === 0) return true; // No rules = open access
      
      // Check if affiliate matches any rule
      return rules.some(rule => 
        rule.allowedAffiliates?.includes(affiliateId as any) ||
        rule.allowedRoles?.includes('affiliate')
      );
    });
  }
}

// ============================================
// RESOURCE FACTORY
// ============================================

export interface CreateResourceInput {
  name: string;
  type: ResourceType;
  description: string;
  location?: GeoLocation;
  capacity: { value: bigint; unit: string };
  currentUsage?: { value: bigint; unit: string };
  ownerId?: string;
  metadata?: ResourceMetadata;
}

export function createResource(input: CreateResourceInput): Resource {
  return {
    id: generateId('res'),
    name: input.name,
    type: input.type,
    description: input.description,
    location: input.location,
    capacity: input.capacity,
    currentUsage: input.currentUsage || { value: 0n, unit: input.capacity.unit },
    ownerId: input.ownerId as any,
    metadata: input.metadata || {}
  };
}

// ============================================
// ACCESS RULE HELPERS
// ============================================

export function createAccessRule(input: {
  resourceId: string;
  allowedRoles: GovernanceRole[];
  allowedAffiliates?: string[];
  conditions?: AccessCondition[];
  timeRestrictions?: TimeRestriction[];
  maxDuration?: Duration;
  requiresApproval: boolean;
  approverRoles?: GovernanceRole[];
}): AccessRule {
  return {
    id: generateId('rule'),
    resourceId: input.resourceId,
    allowedRoles: input.allowedRoles,
    allowedAffiliates: input.allowedAffiliates?.map(a => a as any),
    conditions: input.conditions,
    timeRestrictions: input.timeRestrictions,
    maxDuration: input.maxDuration,
    requiresApproval: input.requiresApproval,
    approverRoles: input.approverRoles
  };
}

export function createTimeRestriction(input: {
  daysOfWeek?: number[];
  startTime?: string;
  endTime?: string;
  timezone: string;
}): TimeRestriction {
  return input;
}

export function createAccessCondition(input: {
  type: 'trust-score' | 'skill' | 'certification' | 'project-membership' | 'custom';
  parameters: Record<string, unknown>;
}): AccessCondition {
  return input;
}

// ============================================
// PROPERTY REGIME HELPERS
// ============================================

export function createPrivateRegime(ownerId: string): PropertyRegime {
  return { type: 'private', owner: ownerId as any };
}

export function createPublicRegime(authorityId: string): PropertyRegime {
  return { type: 'public', authority: authorityId as any };
}

export function createCommonsRegime(
  stewardIds: string[], 
  rules: CommonsRules
): PropertyRegime {
  return { 
    type: 'commons', 
    stewards: stewardIds.map(s => s as any),
    commonsRules: rules
  };
}

export function createNonDominiumRegime(trustId: string, communityIds: string[]): PropertyRegime {
  return { 
    type: 'non-dominium', 
    trust: trustId as any,
    community: communityIds.map(c => c as any)
  };
}

export function createDefaultCommonsRules(): CommonsRules {
  return {
    accessPolicy: 'member-only',
    usageLimits: [],
    maintenanceResponsibility: 'collective',
    conflictResolution: {
      steps: [
        { type: 'mediation', timeout: { value: 7 * 24 * 60 * 60 * 1000 } },
        { type: 'arbitration', timeout: { value: 14 * 24 * 60 * 60 * 1000 } },
        { type: 'vote', timeout: { value: 30 * 24 * 60 * 60 * 1000 } }
      ]
    },
    amendmentProcess: {
      proposalThreshold: { value: 10 }, // 10% of members
      approvalThreshold: { value: 66 }, // 66%
      coolingOffPeriod: { value: 14 * 24 * 60 * 60 * 1000 } // 14 days
    }
  };
}

// ============================================
// RESOURCE AVAILABILITY CHECKING
// ============================================

export interface ResourceAvailability {
  resourceId: string;
  available: boolean;
  availableCapacity: bigint;
  nextAvailableTime?: Date;
  blockingRules?: string[];
}

export function checkResourceAvailability(
  pool: ResourcePool,
  resourceId: string,
  affiliateId: string,
  requestedStart: Date,
  requestedEnd: Date
): ResourceAvailability {
  const resource = pool.resources.find(r => r.id === resourceId);
  if (!resource) {
    return { resourceId, available: false, availableCapacity: 0n, blockingRules: ['Resource not found'] };
  }

  // Check capacity
  const availableCapacity = resource.capacity.value - resource.currentUsage.value;
  if (availableCapacity <= 0n) {
    return { resourceId, available: false, availableCapacity: 0n, blockingRules: ['At capacity'] };
  }

  // Check access rules
  const rules = pool.accessRules.filter(r => r.resourceId === resourceId);
  if (rules.length === 0) {
    return { resourceId, available: true, availableCapacity };
  }

  // Check if affiliate matches any rule
  const matchingRules = rules.filter(rule => 
    rule.allowedAffiliates?.includes(affiliateId as any) ||
    rule.allowedRoles?.includes('affiliate')
  );

  if (matchingRules.length === 0) {
    return { resourceId, available: false, availableCapacity, blockingRules: ['No matching access rule'] };
  }

  // Check time restrictions
  const requestDay = requestedStart.getDay();
  const requestTime = requestedStart.toTimeString().slice(0, 5); // HH:MM

  for (const rule of matchingRules) {
    if (rule.timeRestrictions) {
      for (const tr of rule.timeRestrictions) {
        if (tr.daysOfWeek && !tr.daysOfWeek.includes(requestDay)) {
          return { resourceId, available: false, availableCapacity, blockingRules: ['Day not allowed'] };
        }
        if (tr.startTime && requestTime < tr.startTime) {
          return { resourceId, available: false, availableCapacity, blockingRules: ['Before start time'] };
        }
        if (tr.endTime && requestTime > tr.endTime) {
          return { resourceId, available: false, availableCapacity, blockingRules: ['After end time'] };
        }
      }
    }

    // Check max duration
    if (rule.maxDuration) {
      const duration = requestedEnd.getTime() - requestedStart.getTime();
      if (duration > rule.maxDuration.value) {
        return { resourceId, available: false, availableCapacity, blockingRules: ['Exceeds max duration'] };
      }
    }
  }

  return { resourceId, available: true, availableCapacity };
}

import { generateId } from '../utils';