// arm-loomio/src/core/threadService.ts
// Thread Service - Business Logic for Threads

import { 
  LoomioThread, 
  LoomioThreadItem,
  ThreadItemKind,
  AddThreadItemInput,
} from '../../types';

import { 
  ThreadSequenceManager, 
  InMemoryThreadSequenceRepository,
} from '../../lib/loomio/threadSequence';

import { generateId, now } from '../utils';

export class LoomioThreadService {
  private threads = new Map<string, LoomioThread>();
  private threadItems = new Map<string, LoomioThreadItem[]>();
  
  private threadSequenceManager = new ThreadSequenceManager();

  /**
   * Create a new thread
   */
  async create(input: {
    groupId: string;
    title: string;
    description?: string;
    private?: boolean;
    allowComments?: boolean;
    allowReactions?: boolean;
    attachmentsAdminOnly?: boolean;
    tags?: string[];
    authorId: string;
  }): Promise<any> {
    const threadId = generateId('thread');
    const thread: LoomioThread = {
      id: threadId,
      groupId: input.groupId,
      title: input.title,
      description: input.description,
      private: input.private ?? false,
      pinned: false,
      locked: false,
      allowComments: input.allowComments ?? true,
      allowReactions: input.allowReactions ?? true,
      attachmentsAdminOnly: input.attachmentsAdminOnly ?? false,
      tags: input.tags ?? [],
      itemsCount: 0,
      rangesString: '',
      lastActivityAt: now(),
      createdAt: now(),
      updatedAt: now(),
    };

    this.threads.set(threadId, thread);
    this.threadItems.set(threadId, []);

    return thread;
  }

  /**
   * Get thread by ID
   */
  get(threadId: string): any | null {
    return this.threads.get(threadId) ?? null;
  }

  /**
   * List threads for group
   */
  listByGroup(groupId: string): any[] {
    return Array.from(this.threads.values()).filter(t => t.groupId === groupId);
  }

  /**
   * Add item to thread
   */
  async addItem(input: AddThreadItemInput): Promise<any> {
    const thread = this.threads.get(input.threadId);
    if (!thread) throw new Error('Thread not found');
    if (thread.lockedAt) throw new Error('Thread is locked');

    // Create thread item
    const item: any = {
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      threadId: input.threadId,
      sequenceId: 0, // Will be set by sequence manager
      kind: input.kind,
      authorId: input.authorId,
      createdAt: input.createdAt || Date.now(),
      itemableId: input.itemableId,
      itemableType: input.itemableType,
      content: input.content,
      contentFormat: input.contentFormat,
      metadata: input.metadata,
    };

    // Add to sequence
    const rangeSet = this.threadSequenceManager.addItem({
      threadId: input.threadId,
      sequenceId: item.sequenceId,
      kind: input.kind,
      authorId: input.authorId,
      createdAt: item.createdAt,
      itemableId: input.itemableId,
      itemableType: input.itemableType,
    });

    // Update thread metadata
    const thread = this.threads.get(input.threadId);
    if (thread) {
      thread.itemsCount = rangeSet.getCount();
      thread.rangesString = rangeSet.serialize();
      thread.lastActivityAt = item.createdAt;
      thread.updatedAt = Date.now();
    }

    // Store item
    const items = this.threadItems.get(input.threadId) ?? [];
    items.push(item);
    this.threadItems.set(input.threadId, items);

    return item;
  }

  /**
   * Get thread items
   */
  getItems(threadId: string, options: { afterSequenceId?: number; limit?: number } = {}): any[] {
    const items = this.threadItems.get(threadId) ?? [];
    let filtered = [...items].sort((a, b) => a.sequenceId - b.sequenceId);
    
    if (options.afterSequenceId) {
      filtered = filtered.filter(i => i.sequenceId > options.afterSequenceId!);
    }
    
    if (options.limit) {
      filtered = filtered.slice(0, options.limit);
    }
    
    return filtered;
  }

  /**
   * Lock thread
   */
  lock(threadId: string, lockedBy: string, reason?: string): any {
    const thread = this.threads.get(threadId);
    if (!thread) throw new Error('Thread not found');
    if (thread.lockedAt) throw new Error('Thread already locked');

    thread.lockedAt = Date.now();
    thread.lockedBy = lockedBy;
    thread.lockReason = reason;
    thread.updatedAt = Date.now();

    this.threads.set(threadId, thread);
    return thread;
  }

  /**
   * Unlock thread
   */
  unlock(threadId: string, unlockedBy: string): any {
    const thread = this.threads.get(threadId);
    if (!thread) throw new Error('Thread not found');
    if (!thread.lockedAt) throw new Error('Thread not locked');

    thread.lockedAt = undefined;
    thread.lockedBy = undefined;
    thread.lockReason = undefined;
    thread.updatedAt = Date.now();

    this.threads.set(threadId, thread);
    return thread;
  }

  /**
   * Get thread
   */
  get(threadId: string): any | null {
    return this.threads.get(threadId) ?? null;
  }

  /**
   * List threads by group
   */
  listByGroup(groupId: string): any[] {
    return Array.from(this.threads.values()).filter(t => t.groupId === groupId);
  }
}