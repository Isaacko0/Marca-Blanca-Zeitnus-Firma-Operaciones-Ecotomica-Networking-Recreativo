// arm-loomio/src/lib/loomio/groupHierarchy.ts
// Group Hierarchy with Parent/Subgroup Permissions Inheritance
// Ported from Loomio's Group model hierarchy logic

import { Affiliate } from '@hscsg/arm-core';

export interface GroupHierarchyNode {
  id: string;
  parentId: string | null;
  name: string;
  handle: string | null;
  isVisibleToPublic: boolean;
  isVisibleToParentMembers: boolean;
  parentMembersCanSeeDiscussions: boolean;
  discussionPrivacyOptions: string[];
  membersCanAddMembers: boolean;
  membersCanAddGuests: boolean;
  membersCanVote: boolean;
  membersCanEditDiscussions: boolean;
  membersCanEditComments: boolean;
  membersCanDeleteComments: boolean;
  membersCanRaiseMotions: boolean;
  membersCanStartDiscussions: boolean;
  nonMembersCanStartDiscussions: boolean;
  membersCanCreateSubgroups: boolean;
  membersCanCreateTags: boolean;
  membersCanAnnounce: boolean;
  membersCanCreateTemplates: boolean;
  adminsCanEditUserContent: boolean;
  listedInExplore: boolean;
  attachmentsAdminOnly: boolean;
  subscriptionId: string | null;
  subscriptionActive: boolean;
  subscriptionMaxThreads: number | null;
}

export interface GroupPermissions {
  // Visibility
  isVisibleToPublic: boolean;
  isVisibleToParentMembers: boolean;
  parentMembersCanSeeDiscussions: boolean;
  
  // Discussion permissions
  discussionPrivacyOptions: string[]; // ['private', 'group', 'public']
  membersCanStartDiscussions: boolean;
  nonMembersCanStartDiscussions: boolean;
  membersCanEditDiscussions: boolean;
  membersCanEditComments: boolean;
  membersCanDeleteComments: boolean;
  membersCanRaiseMotions: boolean;
  membersCanAnnounce: boolean;
  attachmentsAdminOnly: boolean;
  
  // Membership permissions
  membersCanAddMembers: boolean;
  membersCanAddGuests: boolean;
  membersCanCreateSubgroups: boolean;
  membersCanCreateTags: boolean;
  membersCanCreateTemplates: boolean;
  adminsCanEditUserContent: boolean;
  
  // Voting permissions
  membersCanVote: boolean;
  
  // Discovery
  listedInExplore: boolean;
}

export interface EffectivePermissions extends GroupPermissions {
  // Computed effective permissions considering hierarchy
  canStartDiscussions: (affiliate: Affiliate, isMember: boolean) => boolean;
  canSeeDiscussion: (affiliate: Affiliate, discussionPrivacy: string) => boolean;
  canVote: (affiliate: Affiliate, isMember: boolean) => boolean;
  canManageMembers: (affiliate: Affiliate, isAdmin: boolean) => boolean;
}

/**
 * Default permissions for new groups
 */
export const DEFAULT_GROUP_PERMISSIONS: GroupPermissions = {
  isVisibleToPublic: true,
  isVisibleToParentMembers: true,
  parentMembersCanSeeDiscussions: false,
  discussionPrivacyOptions: ['private', 'group', 'public'],
  membersCanStartDiscussions: true,
  nonMembersCanStartDiscussions: false,
  membersCanEditDiscussions: true,
  membersCanEditComments: true,
  membersCanDeleteComments: false,
  membersCanRaiseMotions: true,
  membersCanAnnounce: true,
  attachmentsAdminOnly: false,
  membersCanAddMembers: false,
  membersCanAddGuests: false,
  membersCanCreateSubgroups: false,
  membersCanCreateTags: true,
  membersCanCreateTemplates: false,
  adminsCanEditUserContent: true,
  membersCanVote: true,
  listedInExplore: true,
};

/**
 * Group Hierarchy Service
 */
export class GroupHierarchyService {
  private groups = new Map<string, GroupHierarchyNode>();
  private children = new Map<string, Set<string>>(); // parentId -> Set<childId>

  /**
   * Register a group in the hierarchy
   */
  registerGroup(group: GroupHierarchyNode): void {
    this.groups.set(group.id, group);
    if (group.parentId) {
      if (!this.children.has(group.parentId)) {
        this.children.set(group.parentId, new Set());
      }
      this.children.get(group.parentId)!.add(group.id);
    }
  }

  /**
   * Unregister a group (and its descendants)
   */
  unregisterGroup(groupId: string): void {
    const descendants = this.getAllDescendants(groupId);
    for (const id of descendants) {
      this.groups.delete(id);
      this.children.delete(id);
    }
    this.groups.delete(groupId);
    this.children.delete(groupId);
    
    // Remove from parent's children
    const parent = this.getGroup(groupId);
    if (parent?.parentId) {
      this.children.get(parent.parentId)?.delete(groupId);
    }
  }

  /**
   * Get group by ID
   */
  getGroup(groupId: string): GroupHierarchyNode | null {
    return this.groups.get(groupId) ?? null;
  }

  /**
   * Get parent group
   */
  getParent(groupId: string): GroupHierarchyNode | null {
    const group = this.groups.get(groupId);
    if (!group?.parentId) return null;
    return this.groups.get(group.parentId) ?? null;
  }

  /**
   * Get all ancestors (parent, grandparent, etc.)
   */
  getAncestors(groupId: string): GroupHierarchyNode[] {
    const ancestors: GroupHierarchyNode[] = [];
    let current = this.getParent(groupId);
    while (current) {
      ancestors.push(current);
      current = this.getParent(current.id);
    }
    return ancestors;
  }

  /**
   * Get direct children
   */
  getChildren(groupId: string): GroupHierarchyNode[] {
    const childIds = this.children.get(groupId) ?? new Set();
    return Array.from(childIds)
      .map(id => this.groups.get(id))
      .filter((g): g is GroupHierarchyNode => g !== undefined);
  }

  /**
   * Get all descendants (children, grandchildren, etc.)
   */
  getAllDescendants(groupId: string): string[] {
    const descendants: string[] = [];
    const childIds = this.children.get(groupId) ?? new Set();
    
    for (const childId of childIds) {
      descendants.push(childId);
      descendants.push(...this.getAllDescendants(childId));
    }
    
    return descendants;
  }

  /**
   * Get group and all subgroups IDs
   */
  getGroupAndSubgroupIds(groupId: string): string[] {
    return [groupId, ...this.getAllDescendants(groupId)];
  }

  /**
   * Check if group is a subgroup
   */
  isSubgroup(groupId: string): boolean {
    const group = this.groups.get(groupId);
    return !!group?.parentId;
  }

  /**
   * Check if group is a parent (root) group
   */
  isParentGroup(groupId: string): boolean {
    const group = this.groups.get(groupId);
    return !group?.parentId;
  }

  /**
   * Get root ancestor (top-level parent)
   */
  getRootAncestor(groupId: string): GroupHierarchyNode | null {
    const ancestors = this.getAncestors(groupId);
    return ancestors.length > 0 ? ancestors[ancestors.length - 1] : this.getGroup(groupId);
  }

  /**
   * Calculate effective permissions for a group considering hierarchy
   */
  getEffectivePermissions(groupId: string): EffectivePermissions {
    const group = this.groups.get(groupId);
    if (!group) {
      throw new Error(`Group not found: ${groupId}`);
    }

    // Start with group's own permissions
    let effective: GroupPermissions = { ...DEFAULT_GROUP_PERMISSIONS, ...this.extractPermissions(group) };
    
    // Apply parent inheritance where applicable
    const parent = this.getParent(groupId);
    if (parent) {
      const parentPerms = this.extractPermissions(parent);
      
      // Parent members can see discussions if parent allows
      if (parent.parentMembersCanSeeDiscussions) {
        effective.parentMembersCanSeeDiscussions = true;
      }
      
      // Visibility inheritance
      if (!parent.isVisibleToPublic) {
        effective.isVisibleToPublic = false;
      }
      if (!parent.isVisibleToParentMembers) {
        effective.isVisibleToParentMembers = false;
      }
    }

    // Build effective permission functions
    return {
      ...effective,
      canStartDiscussions: (affiliate: Affiliate, isMember: boolean) => {
        if (!isMember) return effective.nonMembersCanStartDiscussions;
        return effective.membersCanStartDiscussions;
      },
      canSeeDiscussion: (affiliate: Affiliate, discussionPrivacy: string) => {
        if (discussionPrivacy === 'public') return true;
        if (discussionPrivacy === 'group') {
          // Check if affiliate is member of this group or parent (if parentMembersCanSeeDiscussions)
          return true; // Simplified - actual check would verify membership
        }
        return false; // private
      },
      canVote: (affiliate: Affiliate, isMember: boolean) => {
        return isMember && effective.membersCanVote;
      },
      canManageMembers: (affiliate: Affiliate, isAdmin: boolean) => {
        if (isAdmin) return true;
        return effective.membersCanAddMembers;
      },
    };
  }

  private extractPermissions(group: GroupHierarchyNode): Partial<GroupPermissions> {
    return {
      isVisibleToPublic: group.isVisibleToPublic,
      isVisibleToParentMembers: group.isVisibleToParentMembers,
      parentMembersCanSeeDiscussions: group.parentMembersCanSeeDiscussions,
      discussionPrivacyOptions: group.discussionPrivacyOptions,
      membersCanStartDiscussions: group.membersCanStartDiscussions,
      nonMembersCanStartDiscussions: group.nonMembersCanStartDiscussions,
      membersCanEditDiscussions: group.membersCanEditDiscussions,
      membersCanEditComments: group.membersCanEditComments,
      membersCanDeleteComments: group.membersCanDeleteComments,
      membersCanRaiseMotions: group.membersCanRaiseMotions,
      membersCanAnnounce: group.membersCanAnnounce,
      attachmentsAdminOnly: group.attachmentsAdminOnly,
      membersCanAddMembers: group.membersCanAddMembers,
      membersCanAddGuests: group.membersCanAddGuests,
      membersCanCreateSubgroups: group.membersCanCreateSubgroups,
      membersCanCreateTags: group.membersCanCreateTags,
      membersCanCreateTemplates: group.membersCanCreateTemplates,
      adminsCanEditUserContent: group.adminsCanEditUserContent,
      membersCanVote: group.membersCanVote,
      listedInExplore: group.listedInExplore,
    };
  }

  /**
   * Validate group move (prevent setting subgroup as parent of its ancestor)
   */
  validateMove(groupId: string, newParentId: string | null): string | null {
    if (!newParentId) return null; // Moving to root is always valid
    
    if (groupId === newParentId) {
      return 'Cannot set group as its own parent';
    }
    
    // Check if newParent is a descendant of group
    const descendants = this.getAllDescendants(groupId);
    if (descendants.includes(newParentId)) {
      return 'Cannot set a descendant as parent';
    }
    
    // Check if newParent's parent is a descendant (would create cycle)
    const newParent = this.getGroup(newParentId);
    if (newParent?.parentId && descendants.includes(newParent.parentId)) {
      return 'Cannot create circular hierarchy';
    }
    
    return null;
  }

  /**
   * Get subscription for group (inherits from parent if subgroup)
   */
  getEffectiveSubscription(groupId: string): { subscriptionId: string | null; active: boolean; maxThreads: number | null } {
    const group = this.groups.get(groupId);
    if (!group) throw new Error(`Group not found: ${groupId}`);
    
    if (group.subscriptionId) {
      return {
        subscriptionId: group.subscriptionId,
        active: group.subscriptionActive,
        maxThreads: group.subscriptionMaxThreads,
      };
    }
    
    // Subgroup inherits from parent
    const parent = this.getParent(groupId);
    if (parent) {
      return this.getEffectiveSubscription(parent.id);
    }
    
    return { subscriptionId: null, active: false, maxThreads: null };
  }

  /**
   * Check thread limit for group (including subgroups)
   */
  async checkThreadLimit(groupId: string, currentThreadCount: number): Promise<{ allowed: boolean; limit: number | null; remaining: number | null }> {
    const subscription = this.getEffectiveSubscription(groupId);
    
    if (!subscription.active || subscription.maxThreads === null) {
      return { allowed: true, limit: null, remaining: null };
    }
    
    const remaining = subscription.maxThreads - currentThreadCount;
    return {
      allowed: remaining > 0,
      limit: subscription.maxThreads,
      remaining: Math.max(0, remaining),
    };
  }

  /**
   * Get all groups in organization (root + all subgroups)
   */
  getOrganizationGroups(rootGroupId: string): GroupHierarchyNode[] {
    const root = this.getGroup(rootGroupId);
    if (!root) return [];
    
    const allIds = this.getGroupAndSubgroupIds(rootGroupId);
    return allIds.map(id => this.groups.get(id)!).filter(Boolean);
  }

  /**
   * Update organization member counts
   */
  updateOrganizationMemberCounts(groupId: string, getActiveMemberCount: (groupId: string) => number): void {
    const group = this.getGroup(groupId);
    if (!group) return;
    
    const root = this.getRootAncestor(groupId);
    if (!root) return;
    
    const orgGroupIds = this.getGroupAndSubgroupIds(root.id);
    let totalMembers = 0;
    
    for (const id of orgGroupIds) {
      totalMembers += getActiveMemberCount(id);
    }
    
    // Update root group's org_members_count
    // In real implementation, this would persist to database
    console.log(`Organization ${root.id} member count: ${totalMembers}`);
  }
}

/**
 * Group Hierarchy Repository Interface
 */
export interface GroupHierarchyRepository {
  save(group: GroupHierarchyNode): Promise<void>;
  findById(id: string): Promise<GroupHierarchyNode | null>;
  findByParentId(parentId: string): Promise<GroupHierarchyNode[]>;
  findRootGroups(): Promise<GroupHierarchyNode[]>;
  delete(id: string): Promise<void>;
  updatePermissions(id: string, permissions: Partial<GroupPermissions>): Promise<void>;
}

/**
 * In-Memory Group Hierarchy Repository
 */
export class InMemoryGroupHierarchyRepository implements GroupHierarchyRepository {
  private groups = new Map<string, GroupHierarchyNode>();

  async save(group: GroupHierarchyNode): Promise<void> {
    this.groups.set(group.id, group);
  }

  async findById(id: string): Promise<GroupHierarchyNode | null> {
    return this.groups.get(id) ?? null;
  }

  async findByParentId(parentId: string): Promise<GroupHierarchyNode[]> {
    return Array.from(this.groups.values()).filter(g => g.parentId === parentId);
  }

  async findRootGroups(): Promise<GroupHierarchyNode[]> {
    return Array.from(this.groups.values()).filter(g => !g.parentId);
  }

  async delete(id: string): Promise<void> {
    this.groups.delete(id);
  }

  async updatePermissions(id: string, permissions: Partial<GroupPermissions>): Promise<void> {
    const group = this.groups.get(id);
    if (group) {
      Object.assign(group, permissions);
    }
  }
}