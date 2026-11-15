// arm-loomio/src/core/membershipService.ts
// Membership Service - Business Logic for Memberships

import { 
  LoomioMembership,
  InviteMemberInput,
} from '../../types';

import { generateId, now } from '../utils';

export class LoomioMembershipService {
  private memberships = new Map<string, LoomioMembership>();

  /**
   * Invite a member
   */
  async invite(input: InviteMemberInput): Promise<any> {
    const membershipId = generateId('membership');
    const membership: any = {
      id: membershipId,
      groupId: input.groupId,
      affiliateId: null, // Will be set when user accepts
      email: input.email,
      role: input.role || 'member',
      status: 'pending',
      voteWeight: input.voteWeight ?? 1,
      emailVolume: 'normal',
      pushVolume: 'normal',
      invitedBy: input.invitedBy,
      message: input.message,
      createdAt: now(),
      updatedAt: now(),
    };

    this.memberships.set(membershipId, membership);
    return membership;
  }

  /**
   * Accept invitation
   */
  async accept(invitationId: string, affiliateId: string): Promise<any> {
    const membership = this.memberships.get(invitationId);
    if (!membership) throw new Error('Invitation not found');
    if (membership.status !== 'pending') throw new Error('Invitation already processed');

    membership.affiliateId = affiliateId;
    membership.status = 'accepted';
    membership.acceptedAt = Date.now();
    membership.updatedAt = Date.now();

    this.memberships.set(invitationId, membership);
    return membership;
  }

  /**
   * Revoke membership
   */
  revoke(membershipId: string, revokedBy: string, reason?: string): any {
    const membership = this.memberships.get(membershipId);
    if (!membership) throw new Error('Membership not found');

    membership.status = 'revoked';
    membership.revokedAt = Date.now();
    membership.revokedBy = revokedBy;
    membership.revokedReason = reason;
    membership.updatedAt = Date.now();

    this.memberships.set(membershipId, membership);
    return membership;
  }

  /**
   * Update member role
   */
  updateRole(membershipId: string, role: 'member' | 'admin' | 'delegate' | 'guest', updatedBy: string): any {
    const membership = this.memberships.get(membershipId);
    if (!membership) throw new Error('Membership not found');

    membership.role = role;
    membership.updatedAt = Date.now();
    this.memberships.set(membershipId, membership);
    return membership;
  }

  /**
   * Update vote weight
   */
  updateVoteWeight(membershipId: string, weight: number, updatedBy: string): any {
    const membership = this.memberships.get(membershipId);
    if (!membership) throw new Error('Membership not found');

    if (weight < 0 || weight > 999.999) {
      throw new Error('Weight must be between 0 and 999.999');
    }

    membership.voteWeight = weight;
    membership.updatedAt = Date.now();
    this.memberships.set(membershipId, membership);
    return membership;
  }

  /**
   * Get membership by ID
   */
  get(membershipId: string): any | null {
    return this.memberships.get(membershipId) ?? null;
  }

  /**
   * Get membership by affiliate and group
   */
  getByAffiliateAndGroup(affiliateId: string, groupId: string): any | null {
    for (const membership of this.memberships.values()) {
      if (membership.affiliateId === affiliateId && membership.groupId === groupId) {
        return membership;
      }
    }
    return null;
  }

  /**
   * List memberships for group
   */
  listByGroup(groupId: string, options: { status?: string; role?: string } = {}): any[] {
    return Array.from(this.memberships.values()).filter(m => {
      if (m.groupId !== groupId) return false;
      if (options.status && m.status !== options.status) return false;
      if (options.role && m.role !== options.role) return false;
      return true;
    });
  }

  /**
   * List memberships for affiliate
   */
  listByAffiliate(affiliateId: string): any[] {
    return Array.from(this.memberships.values()).filter(m => m.affiliateId === affiliateId);
  }
}