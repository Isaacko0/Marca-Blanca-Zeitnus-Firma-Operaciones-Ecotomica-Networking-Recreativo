// arm-loomio/src/core/groupService.ts
// Group Service - Business Logic for Groups

import { 
  LoomioGroup, 
  CreateGroupInput,
} from '../../types';

import { 
  GroupHierarchyService, 
  InMemoryGroupHierarchyRepository,
} from '../../lib/loomio/groupHierarchy';

import { 
  LoomioGroup as LoomioGroupType,
} from '../../types';

import { generateId, now } from '../utils';

export class LoomioGroupService {
  private groups = new Map<string, LoomioGroup>();
  private groupHierarchyService = new GroupHierarchyService();

  /**
   * Create a new group
   */
  async create(input: CreateGroupInput): Promise<any> {
    // Validate hierarchy
    if (input.parentId) {
      const error = this.groupHierarchyService.validateMove(input.name, input.parentId);
      if (error) throw new Error(error);
    }

    const groupId = `group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const group: any = {
      id: groupId,
      name: input.name,
      description: input.description,
      parentId: input.parentId,
      handle: input.handle,
      isVisibleToPublic: input.isVisibleToPublic ?? true,
      isVisibleToParentMembers: input.isVisibleToParentMembers ?? true,
      parentMembersCanSeeDiscussions: input.parentMembersCanSeeDiscussions ?? false,
      discussionPrivacyOptions: ['private', 'group', 'public'],
      membersCanAddMembers: false,
      membersCanAddGuests: false,
      membersCanVote: true,
      membersCanEditDiscussions: true,
      membersCanEditComments: true,
      membersCanDeleteComments: false,
      membersCanRaiseMotions: true,
      membersCanStartDiscussions: true,
      nonMembersCanStartDiscussions: false,
      membersCanCreateSubgroups: false,
      membersCanCreateTags: true,
      membersCanAnnounce: true,
      membersCanCreateTemplates: false,
      adminsCanEditUserContent: true,
      listedInExplore: true,
      attachmentsAdminOnly: false,
      subscriptionId: null,
      subscriptionActive: false,
      subscriptionMaxThreads: null,
      permissions: { ...input.permissions },
      effectivePermissions: { ...input.permissions },
      proposalTemplates: [],
      pollTemplatePositions: {},
      categorizePollTemplates: true,
      hiddenPollTemplates: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      creatorId: input.creatorId,
    };

    this.groups.set(groupId, group);
    this.groupHierarchyService.registerGroup(group);

    return group;
  }

  /**
   * Get group by ID
   */
  get(groupId: string): any | null {
    return this.groups.get(groupId) ?? null;
  }

  /**
   * Update group
   */
  update(groupId: string, updates: Partial<any>, updatedBy: string): any {
    const group = this.groups.get(groupId);
    if (!group) throw new Error('Group not found');

    Object.assign(group, updates);
    group.updatedAt = Date.now();
    this.groups.set(groupId, group);
    return group;
  }

  /**
   * Update group permissions
   */
  updatePermissions(groupId: string, permissions: any, updatedBy: string): any {
    const group = this.groups.get(groupId);
    if (!group) throw new Error('Group not found');

    group.permissions = { ...group.permissions, ...permissions };
    group.effectivePermissions = { ...group.effectivePermissions, ...permissions };
    group.updatedAt = Date.now();
    this.groups.set(groupId, group);
    return group;
  }

  /**
   * Archive group (soft delete)
   */
  archive(groupId: string, archivedBy: string): any {
    const group = this.groups.get(groupId);
    if (!group) throw new Error('Group not found');

    group.discardedAt = Date.now();
    group.discardedBy = archivedBy;
    group.updatedAt = Date.now();
    this.groups.set(groupId, group);
    return group;
  }

  /**
   * Get group by ID
   */
  get(groupId: string): any | null {
    return this.groups.get(groupId) ?? null;
  }

  /**
   * Get group hierarchy
   */
  getHierarchy(groupId: string): any {
    return {
      group: this.get(groupId),
      parent: this.get(groupId)?.parentId ? this.get(groupId)?.parentId : null,
      children: Array.from(this.groups.values()).filter(g => g.parentId === groupId),
    };
  }

  /**
   * List groups
   */
  list(options: { parentId?: string; rootOnly?: boolean } = {}): any[] {
    let groups = Array.from(this.groups.values());
    
    if (options.rootOnly) {
      groups = groups.filter(g => !g.parentId);
    } else if (options.parentId) {
      groups = groups.filter(g => g.parentId === options.parentId);
    }
    
    return groups;
  }

  /**
   * Get organization groups (root + all subgroups)
   */
  getOrganizationGroups(rootGroupId: string): any[] {
    return this.groupHierarchyService.getOrganizationGroups(rootGroupId);
  }

  /**
   * Check thread limit
   */
  async checkThreadLimit(groupId: string, currentThreadCount: number): Promise<any> {
    return this.groupHierarchyService.checkThreadLimit(groupId, currentThreadCount);
  }
}