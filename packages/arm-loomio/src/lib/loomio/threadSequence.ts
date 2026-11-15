// arm-loomio/src/lib/loomio/threadSequence.ts
// Thread Sequence ID Management with RangeSet
// Ported from Loomio's Topic model sequence_id and RangeSet logic

export interface ThreadItem {
  id: string;
  threadId: string;
  sequenceId: number;
  kind: ThreadItemKind;
  authorId: string;
  createdAt: number;
  itemableId: string;
  itemableType: string;
}

export type ThreadItemKind = 
  | 'discussion_created'
  | 'discussion_updated'
  | 'proposal_created'
  | 'proposal_updated'
  | 'vote_cast'
  | 'vote_updated'
  | 'outcome_recorded'
  | 'comment_created'
  | 'comment_updated'
  | 'attachment_added'
  | 'tag_added'
  | 'tag_removed';

export interface ThreadSequenceState {
  threadId: string;
  items: ThreadItem[];
  rangesString: string;
  itemsCount: number;
  lastActivityAt: number;
  firstSequenceId: number;
  lastSequenceId: number;
}

/**
 * RangeSet implementation for efficient sequence ID management
 * Ported from Loomio's RangeSet class
 */
export class RangeSet {
  private ranges: [number, number][] = []; // [start, end] inclusive

  constructor(rangesString?: string) {
    if (rangesString) {
      this.parse(rangesString);
    }
  }

  static serialize(ranges: [number, number][]): string {
    return ranges.map(([start, end]) => 
      start === end ? `${start}` : `${start}-${end}`
    ).join(',');
  }

  static reduce(ranges: [number, number][]): [number, number][] {
    if (ranges.length <= 1) return ranges;
    
    // Sort by start
    const sorted = [...ranges].sort((a, b) => a[0] - b[0]);
    const merged: [number, number][] = [sorted[0]];
    
    for (let i = 1; i < sorted.length; i++) {
      const last = merged[merged.length - 1];
      const current = sorted[i];
      
      // If overlapping or adjacent, merge
      if (current[0] <= last[1] + 1) {
        last[1] = Math.max(last[1], current[1]);
      } else {
        merged.push(current);
      }
    }
    
    return merged;
  }

  static rangesFromList(sequenceIds: number[]): [number, number][] {
    if (sequenceIds.length === 0) return [];
    
    const sorted = [...sequenceIds].sort((a, b) => a - b);
    const ranges: [number, number][] = [];
    let start = sorted[0];
    let end = sorted[0];
    
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i] === end + 1) {
        end = sorted[i];
      } else {
        ranges.push([start, end]);
        start = sorted[i];
        end = sorted[i];
      }
    }
    ranges.push([start, end]);
    
    return ranges;
  }

  parse(rangesString: string): void {
    if (!rangesString) {
      this.ranges = [];
      return;
    }
    
    this.ranges = rangesString.split(',').map(part => {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(Number);
        return [start, end] as [number, number];
      } else {
        const num = Number(part);
        return [num, num] as [number, number];
      }
    });
  }

  serialize(): string {
    return RangeSet.serialize(this.ranges);
  }

  add(sequenceId: number): void {
    this.ranges = RangeSet.reduce([[sequenceId, sequenceId], ...this.ranges]);
  }

  remove(sequenceId: number): void {
    const newRanges: [number, number][] = [];
    
    for (const [start, end] of this.ranges) {
      if (sequenceId < start || sequenceId > end) {
        newRanges.push([start, end]);
      } else if (start === end && start === sequenceId) {
        // Remove single-item range
      } else if (sequenceId === start) {
        newRanges.push([start + 1, end]);
      } else if (sequenceId === end) {
        newRanges.push([start, end - 1]);
      } else {
        // Split range
        newRanges.push([start, sequenceId - 1]);
        newRanges.push([sequenceId + 1, end]);
      }
    }
    
    this.ranges = RangeSet.reduce(newRanges);
  }

  has(sequenceId: number): boolean {
    return this.ranges.some(([start, end]) => sequenceId >= start && sequenceId <= end);
  }

  getAll(): number[] {
    const result: number[] = [];
    for (const [start, end] of this.ranges) {
      for (let i = start; i <= end; i++) {
        result.push(i);
      }
    }
    return result;
  }

  getFirst(): number | null {
    return this.ranges.length > 0 ? this.ranges[0][0] : null;
  }

  getLast(): number | null {
    return this.ranges.length > 0 ? this.ranges[this.ranges.length - 1][1] : null;
  }

  getCount(): number {
    return this.ranges.reduce((sum, [start, end]) => sum + (end - start + 1), 0);
  }

  getRanges(): [number, number][] {
    return [...this.ranges];
  }
}

/**
 * Thread Sequence Manager
 */
export class ThreadSequenceManager {
  private sequences = new Map<string, RangeSet>();
  private items = new Map<string, ThreadItem[]>(); // threadId -> items[]
  private lastActivity = new Map<string, number>(); // threadId -> timestamp

  /**
   * Get or create RangeSet for thread
   */
  getRangeSet(threadId: string): RangeSet {
    if (!this.sequences.has(threadId)) {
      this.sequences.set(threadId, new RangeSet());
    }
    return this.sequences.get(threadId)!;
  }

  /**
   * Get items for thread (sorted by sequenceId)
   */
  getItems(threadId: string): ThreadItem[] {
    const items = this.items.get(threadId) ?? [];
    return [...items].sort((a, b) => a.sequenceId - b.sequenceId);
  }

  /**
   * Add item to thread with atomic sequence assignment
   */
  addItem(item: Omit<ThreadItem, 'sequenceId'>): ThreadItem {
    const rangeSet = this.getRangeSet(item.threadId);
    const nextSequenceId = (rangeSet.getLast() ?? 0) + 1;
    
    const newItem: ThreadItem = {
      ...item,
      sequenceId: nextSequenceId,
    };
    
    // Add to range set
    rangeSet.add(nextSequenceId);
    
    // Store item
    if (!this.items.has(item.threadId)) {
      this.items.set(item.threadId, []);
    }
    this.items.get(item.threadId)!.push(newItem);
    
    // Update last activity
    this.lastActivity.set(item.threadId, item.createdAt);
    
    return newItem;
  }

  /**
   * Remove item from thread
   */
  removeItem(threadId: string, sequenceId: number): boolean {
    const rangeSet = this.getRangeSet(threadId);
    if (!rangeSet.has(sequenceId)) return false;
    
    rangeSet.remove(sequenceId);
    
    const items = this.items.get(threadId) ?? [];
    const index = items.findIndex(i => i.sequenceId === sequenceId);
    if (index >= 0) {
      items.splice(index, 1);
    }
    
    return true;
  }

  /**
   * Reorder items (for drag-drop, moderation)
   */
  reorderItems(threadId: string, newOrder: number[]): void {
    const rangeSet = this.getRangeSet(threadId);
    const items = this.getItems(threadId);
    const itemMap = new Map(items.map(i => [i.sequenceId, i]));
    
    // Clear and rebuild
    rangeSet.ranges = [];
    this.items.set(threadId, []);
    
    newOrder.forEach((seqId, index) => {
      const item = itemMap.get(seqId);
      if (item) {
        const newSeqId = index + 1;
        item.sequenceId = newSeqId;
        rangeSet.add(newSeqId);
        this.items.get(threadId)!.push(item);
      }
    });
  }

  /**
   * Get thread sequence state snapshot
   */
  getState(threadId: string): ThreadSequenceState {
    const rangeSet = this.getRangeSet(threadId);
    const items = this.getItems(threadId);
    
    return {
      threadId,
      items,
      rangesString: rangeSet.serialize(),
      itemsCount: rangeSet.getCount(),
      lastActivityAt: this.lastActivity.get(threadId) ?? 0,
      firstSequenceId: rangeSet.getFirst() ?? 0,
      lastSequenceId: rangeSet.getLast() ?? 0,
    };
  }

  /**
   * Update sequence info (rebuild from items)
   */
  updateSequenceInfo(threadId: string): ThreadSequenceState {
    const items = this.getItems(threadId);
    const sequenceIds = items.map(i => i.sequenceId);
    
    const rangeSet = new RangeSet();
    rangeSet.ranges = RangeSet.rangesFromList(sequenceIds);
    this.sequences.set(threadId, rangeSet);
    
    return this.getState(threadId);
  }

  /**
   * Get items after a sequence ID (for pagination/sync)
   */
  getItemsAfter(threadId: string, afterSequenceId: number): ThreadItem[] {
    const items = this.getItems(threadId);
    return items.filter(i => i.sequenceId > afterSequenceId);
  }

  /**
   * Get items in range
   */
  getItemsInRange(threadId: string, start: number, end: number): ThreadItem[] {
    const items = this.getItems(threadId);
    return items.filter(i => i.sequenceId >= start && i.sequenceId <= end);
  }

  /**
   * Compact sequence IDs (remove gaps)
   * Use with caution - changes all sequence IDs!
   */
  compact(threadId: string): void {
    const items = this.getItems(threadId);
    const rangeSet = this.getRangeSet(threadId);
    
    rangeSet.ranges = [];
    items.forEach((item, index) => {
      item.sequenceId = index + 1;
      rangeSet.add(item.sequenceId);
    });
  }
}

/**
 * Thread Sequence Repository Interface
 */
export interface ThreadSequenceRepository {
  getState(threadId: string): Promise<ThreadSequenceState | null>;
  saveState(state: ThreadSequenceState): Promise<void>;
  addItem(item: ThreadItem): Promise<void>;
  removeItem(threadId: string, sequenceId: number): Promise<void>;
  reorderItems(threadId: string, newOrder: number[]): Promise<void>;
  getItemsAfter(threadId: string, afterSequenceId: number): Promise<ThreadItem[]>;
}

/**
 * In-Memory Thread Sequence Repository
 */
export class InMemoryThreadSequenceRepository implements ThreadSequenceRepository {
  private manager = new ThreadSequenceManager();

  async getState(threadId: string): Promise<ThreadSequenceState | null> {
    const state = this.manager.getState(threadId);
    return state.itemsCount > 0 ? state : null;
  }

  async saveState(state: ThreadSequenceState): Promise<void> {
    // Rebuild from state
    const manager = this.manager;
    manager.sequences.set(state.threadId, new RangeSet(state.rangesString));
    manager.items.set(state.threadId, state.items);
    manager.lastActivity.set(state.threadId, state.lastActivityAt);
  }

  async addItem(item: ThreadItem): Promise<void> {
    this.manager.addItem(item);
  }

  async removeItem(threadId: string, sequenceId: number): Promise<void> {
    this.manager.removeItem(threadId, sequenceId);
  }

  async reorderItems(threadId: string, newOrder: number[]): Promise<void> {
    this.manager.reorderItems(threadId, newOrder);
  }

  async getItemsAfter(threadId: string, afterSequenceId: number): Promise<ThreadItem[]> {
    return this.manager.getItemsAfter(threadId, afterSequenceId);
  }
}

/**
 * Thread Sequence Service
 */
export class ThreadSequenceService {
  constructor(private repository: ThreadSequenceRepository) {}

  async addItem(
    threadId: string,
    kind: ThreadItemKind,
    authorId: string,
    itemableId: string,
    itemableType: string
  ): Promise<ThreadItem> {
    const item: Omit<ThreadItem, 'sequenceId'> = {
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      threadId,
      kind,
      authorId,
      createdAt: Date.now(),
      itemableId,
      itemableType,
    };
    
    await this.repository.addItem({ ...item, sequenceId: 0 }); // sequenceId assigned by manager
    
    // Get the actual item with sequenceId
    const state = await this.repository.getState(threadId);
    const addedItem = state?.items.find(i => i.id === item.id);
    if (!addedItem) throw new Error('Failed to add thread item');
    
    return addedItem;
  }

  async removeItem(threadId: string, sequenceId: number): Promise<void> {
    await this.repository.removeItem(threadId, sequenceId);
  }

  async reorderItems(threadId: string, newOrder: number[]): Promise<void> {
    await this.repository.reorderItems(threadId, newOrder);
  }

  async getItemsAfter(threadId: string, afterSequenceId: number): Promise<ThreadItem[]> {
    return this.repository.getItemsAfter(threadId, afterSequenceId);
  }

  async getThreadState(threadId: string): Promise<ThreadSequenceState | null> {
    return this.repository.getState(threadId);
  }

  async syncThreadSequence(threadId: string): Promise<ThreadSequenceState> {
    // Rebuild sequence from items
    const state = await this.repository.getState(threadId);
    if (!state) throw new Error('Thread not found');
    
    const sequenceIds = state.items.map(i => i.sequenceId).sort((a, b) => a - b);
    const ranges = RangeSet.rangesFromList(sequenceIds);
    const rangesString = RangeSet.serialize(ranges);
    
    const updatedState: ThreadSequenceState = {
      ...state,
      rangesString,
      itemsCount: sequenceIds.length,
      firstSequenceId: sequenceIds[0] ?? 0,
      lastSequenceId: sequenceIds[sequenceIds.length - 1] ?? 0,
    };
    
    await this.repository.saveState(updatedState);
    return updatedState;
  }
}