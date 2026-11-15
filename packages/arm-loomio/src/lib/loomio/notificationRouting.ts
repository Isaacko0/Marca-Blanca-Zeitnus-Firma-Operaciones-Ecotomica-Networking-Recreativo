// arm-loomio/src/lib/loomio/notificationRouting.ts
// Notification Routing with Volume Preferences
// Ported from Loomio's notification_delivery_routers and Topic volume logic

export type DeliveryChannel = 'email' | 'push' | 'in_app';
export type VolumeLevel = 'quiet' | 'normal' | 'loud';

export interface DeliveryPreferences {
  email: VolumeLevel;
  push: VolumeLevel;
  inApp: VolumeLevel; // Always 'normal' for in-app
}

export interface NotificationEvent {
  id: string;
  type: NotificationType;
  groupId: string;
  threadId?: string;
  proposalId?: string;
  actorId: string;           // Who triggered the event
  recipientIds: string[];    // Who should receive it
  payload: Record<string, any>;
  createdAt: number;
  channels: DeliveryChannel[];
  priority: 'low' | 'normal' | 'high' | 'urgent';
}

export type NotificationType = 
  // Proposal events
  | 'proposal.created'
  | 'proposal.updated'
  | 'proposal.closed'
  | 'proposal.outcome_recorded'
  | 'proposal.reminder'
  // Vote events
  | 'vote.cast'
  | 'vote.updated'
  | 'vote.reminder'
  // Thread events
  | 'thread.comment_added'
  | 'thread.mentioned'
  | 'thread.locked'
  | 'thread.unlocked'
  // Membership events
  | 'member.invited'
  | 'member.joined'
  | 'member.left'
  | 'member.role_changed'
  | 'membership_request.submitted'
  | 'membership_request.approved'
  | 'membership_request.declined'
  // Group events
  | 'group.created'
  | 'group.updated'
  | 'group.archived'
  // System events
  | 'system.announcement'
  | 'system.maintenance';

export interface VolumeConfig {
  // Email volumes
  email: {
    quiet: DeliveryChannel[];      // []
    normal: DeliveryChannel[];     // ['email']
    loud: DeliveryChannel[];       // ['email', 'push']
  };
  // Push volumes  
  push: {
    quiet: DeliveryChannel[];      // []
    normal: DeliveryChannel[];     // ['push']
    loud: DeliveryChannel[];       // ['push', 'email']
  };
}

export const DEFAULT_VOLUME_CONFIG: VolumeConfig = {
  email: {
    quiet: [],
    normal: ['email'],
    loud: ['email', 'push'],
  },
  push: {
    quiet: [],
    normal: ['push'],
    loud: ['push', 'email'],
  },
};

export interface RecipientDeliveryPrefs {
  affiliateId: string;
  groupId: string;
  threadId?: string;
  emailVolume: VolumeLevel;
  pushVolume: VolumeLevel;
  // Thread-specific overrides (from TopicReader)
  threadEmailVolume?: VolumeLevel;
  threadPushVolume?: VolumeLevel;
  // Membership defaults (from Membership)
  membershipEmailVolume?: VolumeLevel;
  membershipPushVolume?: VolumeLevel;
  // Account defaults (from User)
  accountEmailVolume: VolumeLevel;
  accountPushVolume: VolumeLevel;
}

/**
 * Calculate effective delivery channels for a recipient
 */
export function calculateDeliveryChannels(
  event: NotificationEvent,
  prefs: RecipientDeliveryPrefs,
  config: VolumeConfig = DEFAULT_VOLUME_CONFIG
): DeliveryChannel[] {
  const channels = new Set<DeliveryChannel>();
  
  // Always include in-app
  channels.add('in_app');
  
  // Determine email volume
  let emailVolume = prefs.accountEmailVolume;
  if (prefs.membershipEmailVolume) emailVolume = prefs.membershipEmailVolume;
  if (prefs.threadEmailVolume) emailVolume = prefs.threadEmailVolume;
  
  // Determine push volume
  let pushVolume = prefs.accountPushVolume;
  if (prefs.membershipPushVolume) pushVolume = prefs.membershipPushVolume;
  if (prefs.threadPushVolume) pushVolume = prefs.threadPushVolume;
  
  // Apply email volume
  const emailChannels = config.email[emailVolume] ?? [];
  for (const ch of emailChannels) channels.add(ch);
  
  // Apply push volume
  const pushChannels = config.push[pushVolume] ?? [];
  for (const ch of pushChannels) channels.add(ch);
  
  // Event-specific overrides
  if (event.priority === 'urgent') {
    channels.add('email');
    channels.add('push');
  }
  
  // Mentions always notify
  if (event.type === 'thread.mentioned') {
    channels.add('email');
    channels.add('push');
  }
  
  // Proposal reminders respect volume
  if (event.type === 'proposal.reminder' || event.type === 'vote.reminder') {
    if (emailVolume === 'quiet') channels.delete('email');
    if (pushVolume === 'quiet') channels.delete('push');
  }
  
  return Array.from(channels);
}

/**
 * Notification Router - Routes events to delivery services
 */
export interface NotificationDeliveryService {
  sendEmail(recipientId: string, event: NotificationEvent): Promise<void>;
  sendPush(recipientId: string, event: NotificationEvent): Promise<void>;
  sendInApp(recipientId: string, event: NotificationEvent): Promise<void>;
}

export class NotificationRouter {
  constructor(
    private deliveryService: NotificationDeliveryService,
    private getRecipientPrefs: (recipientId: string, groupId: string, threadId?: string) => Promise<RecipientDeliveryPrefs>,
    private config: VolumeConfig = DEFAULT_VOLUME_CONFIG
  ) {}

  async route(event: NotificationEvent): Promise<void> {
    const deliveryPromises = event.recipientIds.map(async (recipientId) => {
      const prefs = await this.getRecipientPrefs(recipientId, event.groupId, event.threadId);
      const channels = calculateDeliveryChannels(event, prefs, this.config);
      
      const sendPromises: Promise<void>[] = [];
      
      if (channels.includes('email')) {
        sendPromises.push(this.deliveryService.sendEmail(recipientId, event));
      }
      if (channels.includes('push')) {
        sendPromises.push(this.deliveryService.sendPush(recipientId, event));
      }
      if (channels.includes('in_app')) {
        sendPromises.push(this.deliveryService.sendInApp(recipientId, event));
      }
      
      await Promise.allSettled(sendPromises);
    });
    
    await Promise.allSettled(deliveryPromises);
  }
}

/**
 * Notification Delivery Routers (per-event-type routing)
 * Ported from Loomio's notification_delivery_routers
 */
export interface DeliveryRouter {
  routes(event: NotificationEvent): DeliveryChannel[];
}

export class ProposalDeliveryRouter implements DeliveryRouter {
  routes(event: NotificationEvent): DeliveryChannel[] {
    const channels: DeliveryChannel[] = ['in_app'];
    
    switch (event.type) {
      case 'proposal.created':
      case 'proposal.reminder':
        channels.push('email', 'push');
        break;
      case 'proposal.closed':
      case 'proposal.outcome_recorded':
        channels.push('email');
        if (event.priority === 'high') channels.push('push');
        break;
      case 'proposal.updated':
        channels.push('in_app');
        break;
    }
    
    return channels;
  }
}

export class VoteDeliveryRouter implements DeliveryRouter {
  routes(event: NotificationEvent): DeliveryChannel[] {
    const channels: DeliveryChannel[] = ['in_app'];
    
    switch (event.type) {
      case 'vote.cast':
        channels.push('email');
        break;
      case 'vote.reminder':
        channels.push('email', 'push');
        break;
      case 'vote.updated':
        channels.push('in_app');
        break;
    }
    
    return channels;
  }
}

export class ThreadDeliveryRouter implements DeliveryRouter {
  routes(event: NotificationEvent): DeliveryChannel[] {
    const channels: DeliveryChannel[] = ['in_app'];
    
    switch (event.type) {
      case 'thread.comment_added':
        channels.push('email');
        break;
      case 'thread.mentioned':
        channels.push('email', 'push');
        break;
      case 'thread.locked':
      case 'thread.unlocked':
        channels.push('email');
        break;
    }
    
    return channels;
  }
}

export class MembershipDeliveryRouter implements DeliveryRouter {
  routes(event: NotificationEvent): DeliveryChannel[] {
    const channels: DeliveryChannel[] = ['in_app'];
    
    switch (event.type) {
      case 'member.invited':
      case 'membership_request.submitted':
        channels.push('email', 'push');
        break;
      case 'member.joined':
      case 'membership_request.approved':
      case 'membership_request.declined':
        channels.push('email');
        break;
      case 'member.left':
      case 'member.role_changed':
        channels.push('in_app');
        break;
    }
    
    return channels;
  }
}

export class SystemDeliveryRouter implements DeliveryRouter {
  routes(event: NotificationEvent): DeliveryChannel[] {
    if (event.priority === 'urgent') {
      return ['in_app', 'email', 'push'];
    }
    return ['in_app', 'email'];
  }
}

/**
 * Composite Router - Combines all routers
 */
export class CompositeDeliveryRouter implements DeliveryRouter {
  private routers: Map<string, DeliveryRouter> = new Map();

  constructor() {
    this.register('proposal', new ProposalDeliveryRouter());
    this.register('vote', new VoteDeliveryRouter());
    this.register('thread', new ThreadDeliveryRouter());
    this.register('member', new MembershipDeliveryRouter());
    this.register('membership_request', new MembershipDeliveryRouter());
    this.register('group', new SystemDeliveryRouter());
    this.register('system', new SystemDeliveryRouter());
  }

  register(prefix: string, router: DeliveryRouter): void {
    this.routers.set(prefix, router);
  }

  routes(event: NotificationEvent): DeliveryChannel[] {
    const prefix = event.type.split('.')[0];
    const router = this.routers.get(prefix);
    if (router) {
      return router.routes(event);
    }
    return ['in_app', 'email'];
  }
}

/**
 * Notification Service - Main entry point
 */
export interface NotificationRepository {
  save(event: NotificationEvent): Promise<void>;
  findByRecipient(recipientId: string, limit?: number): Promise<NotificationEvent[]>;
  markAsRead(eventId: string, recipientId: string): Promise<void>;
  markAllAsRead(recipientId: string, groupId?: string): Promise<void>;
}

export class NotificationService {
  constructor(
    private repository: NotificationRepository,
    private router: NotificationRouter
  ) {}

  async notify(event: NotificationEvent): Promise<void> {
    // Save notification
    await this.repository.save(event);
    
    // Route for delivery
    await this.router.route(event);
  }

  async createAndNotify(
    type: NotificationType,
    groupId: string,
    actorId: string,
    recipientIds: string[],
    payload: Record<string, any>,
    options: {
      threadId?: string;
      proposalId?: string;
      channels?: DeliveryChannel[];
      priority?: 'low' | 'normal' | 'high' | 'urgent';
    } = {}
  ): Promise<void> {
    const event: NotificationEvent = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      groupId,
      threadId: options.threadId,
      proposalId: options.proposalId,
      actorId,
      recipientIds,
      payload,
      createdAt: Date.now(),
      channels: options.channels ?? ['in_app'],
      priority: options.priority ?? 'normal',
    };
    
    await this.notify(event);
  }

  async getNotifications(recipientId: string, limit = 50): Promise<NotificationEvent[]> {
    return this.repository.findByRecipient(recipientId, limit);
  }

  async markAsRead(eventId: string, recipientId: string): Promise<void> {
    await this.repository.markAsRead(eventId, recipientId);
  }

  async markAllAsRead(recipientId: string, groupId?: string): Promise<void> {
    await this.repository.markAllAsRead(recipientId, groupId);
  }
}

/**
 * In-Memory Notification Repository
 */
export class InMemoryNotificationRepository implements NotificationRepository {
  private notifications = new Map<string, NotificationEvent>();
  private recipientIndex = new Map<string, Set<string>>(); // recipientId -> eventIds
  private readStatus = new Map<string, Set<string>>(); // recipientId -> read eventIds

  async save(event: NotificationEvent): Promise<void> {
    this.notifications.set(event.id, event);
    for (const recipientId of event.recipientIds) {
      if (!this.recipientIndex.has(recipientId)) {
        this.recipientIndex.set(recipientId, new Set());
      }
      this.recipientIndex.get(recipientId)!.add(event.id);
    }
  }

  async findByRecipient(recipientId: string, limit = 50): Promise<NotificationEvent[]> {
    const eventIds = this.recipientIndex.get(recipientId);
    if (!eventIds) return [];
    
    const events = Array.from(eventIds)
      .map(id => this.notifications.get(id))
      .filter((e): e is NotificationEvent => e !== undefined)
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit);
    
    return events;
  }

  async markAsRead(eventId: string, recipientId: string): Promise<void> {
    if (!this.readStatus.has(recipientId)) {
      this.readStatus.set(recipientId, new Set());
    }
    this.readStatus.get(recipientId)!.add(eventId);
  }

  async markAllAsRead(recipientId: string, groupId?: string): Promise<void> {
    const eventIds = this.recipientIndex.get(recipientId);
    if (!eventIds) return;
    
    for (const eventId of eventIds) {
      const event = this.notifications.get(eventId);
      if (event && (!groupId || event.groupId === groupId)) {
        await this.markAsRead(eventId, recipientId);
      }
    }
  }
}