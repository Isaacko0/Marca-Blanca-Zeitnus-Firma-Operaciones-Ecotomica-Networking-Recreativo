/**
 * Gratifieria Karma System - Amphibious Reputation & Rewards
 * 
 * Postmonetario mode: ZNU/CaaS units (default)
 * Conectado mode: USD/USDC via priceParity oracle
 * 
 * Integrates with arm-core valueDual for dual-mode calculations
 */

import type { KarmaAccount, KarmaTransaction, PriceParityOracle, DualValueConfig } from "../types.js";
import { toDualValue, createDualConfig, detectModeFromEnv } from "./valueDual.js";

export interface KarmaRepository {
  getAccount(userId: string): Promise<KarmaAccount | null>;
  createAccount(userId: string): Promise<KarmaAccount>;
  updateAccount(account: KarmaAccount): Promise<void>;
  createTransaction(tx: KarmaTransaction): Promise<void>;
  getTransactions(userId: string, limit?: number): Promise<KarmaTransaction[]>;
}

export interface KarmaSystemConfig {
  /** Initial karma for new users */
  initialKarma?: number;
  /** Karma awarded for fulfilling a match */
  fulfillmentReward?: number;
  /** Karma penalty for cancelling a match */
  cancellationPenalty?: number;
  /** Bonus for anonymous gifts (GAP-61) */
  anonymousGiftBonus?: number;
  /** Maximum karma transfer per transaction */
  maxTransfer?: number;
  /** Oracle for conectado mode */
  oracle?: PriceParityOracle;
}

const DEFAULT_CONFIG: Required<KarmaSystemConfig> = {
  initialKarma: 100,
  fulfillmentReward: 10,
  cancellationPenalty: 5,
  anonymousGiftBonus: 20,
  maxTransfer: 1000,
  oracle: undefined,
};

export class KarmaSystem {
  private repo: KarmaRepository;
  private config: Required<KarmaSystemConfig>;
  private dualConfig: DualValueConfig;

  constructor(repo: KarmaRepository, config: KarmaSystemConfig = {}) {
    this.repo = repo;
    this.config = { ...DEFAULT_CONFIG, ...config };
    
    // Initialize amphibious mode
    const mode = detectModeFromEnv();
    this.dualConfig = createDualConfig(mode, this.config.oracle);
  }

  /** Get or create karma account for user */
  async getOrCreateAccount(userId: string): Promise<KarmaAccount> {
    let account = await this.repo.getAccount(userId);
    if (!account) {
      account = await this.repo.createAccount(userId);
      // Initialize with starting karma
      account.znu_balance = this.config.initialKarma;
      account.trust_score = 0.5;
      account.last_activity = new Date().toISOString();
      await this.repo.updateAccount(account);
    }
    return account;
  }

  /** Get current karma balance in dual representation */
  async getBalance(userId: string) {
    const account = await this.getOrCreateAccount(userId);
    return toDualValue(account.znu_balance, this.dualConfig);
  }

  /** Credit karma to user (positive action) */
  async credit(userId: string, amount: number, note: string, listingId?: string, matchId?: string): Promise<KarmaTransaction> {
    const account = await this.getOrCreateAccount(userId);
    account.znu_balance += amount;
    account.total_given += amount; // "given" as in contributed to community
    account.last_activity = new Date().toISOString();
    await this.repo.updateAccount(account);

    const tx = await this.createTransaction({
      from_user: "system",
      to_user: userId,
      amount_znu: amount,
      listing_id: listingId,
      match_id: matchId,
      type: "gratitude",
      note,
    });

    // Recalculate trust score
    await this.recalculateTrustScore(userId);

    return tx;
  }

  /** Debit karma from user (negative action) */
  async debit(userId: string, amount: number, note: string, listingId?: string, matchId?: string): Promise<KarmaTransaction> {
    const account = await this.getOrCreateAccount(userId);
    account.znu_balance = Math.max(0, account.znu_balance - amount);
    account.last_activity = new Date().toISOString();
    await this.repo.updateAccount(account);

    const tx = await this.createTransaction({
      from_user: userId,
      to_user: "system",
      amount_znu: amount,
      listing_id: listingId,
      match_id: matchId,
      type: "penalty",
      note,
    });

    await this.recalculateTrustScore(userId);

    return tx;
  }

  /** Transfer karma between users (gratitude, mutual aid) */
  async transfer(fromUserId: string, toUserId: string, amount: number, note: string, listingId?: string, matchId?: string): Promise<KarmaTransaction> {
    if (amount > this.config.maxTransfer) {
      throw new Error(`Transfer amount exceeds maximum of ${this.config.maxTransfer} ZNU`);
    }

    const fromAccount = await this.getOrCreateAccount(fromUserId);
    if (fromAccount.znu_balance < amount) {
      throw new Error("Insufficient karma balance");
    }

    fromAccount.znu_balance -= amount;
    fromAccount.total_given += amount;
    fromAccount.last_activity = new Date().toISOString();
    await this.repo.updateAccount(fromAccount);

    const toAccount = await this.getOrCreateAccount(toUserId);
    toAccount.znu_balance += amount;
    toAccount.total_received += amount;
    toAccount.last_activity = new Date().toISOString();
    await this.repo.updateAccount(toAccount);

    const tx = await this.createTransaction({
      from_user: fromUserId,
      to_user: toUserId,
      amount_znu: amount,
      listing_id: listingId,
      match_id: matchId,
      type: "gratitude",
      note,
    });

    await this.recalculateTrustScore(fromUserId);
    await this.recalculateTrustScore(toUserId);

    return tx;
  }

  /** Reward for fulfilling a match */
  async rewardFulfillment(userId: string, matchId: string, listingId?: string): Promise<KarmaTransaction> {
    return this.credit(userId, this.config.fulfillmentReward, `Match fulfilled: ${matchId}`, listingId, matchId);
  }

  /** Penalty for cancelling a match */
  async penalizeCancellation(userId: string, matchId: string, listingId?: string): Promise<KarmaTransaction> {
    return this.debit(userId, this.config.cancellationPenalty, `Match cancelled: ${matchId}`, listingId, matchId);
  }

  /** Bonus for anonymous gift (GAP-61) */
  async rewardAnonymousGift(userId: string, listingId: string): Promise<KarmaTransaction> {
    return this.credit(userId, this.config.anonymousGiftBonus, `Anonymous gift (GAP-61): ${listingId}`, listingId);
  }

  /** Create transaction record */
  private async createTransaction(tx: Omit<KarmaTransaction, "id" | "created_at" | "oracle_snapshot">): Promise<KarmaTransaction> {
    const fullTx: KarmaTransaction = {
      id: `krma_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      created_at: new Date().toISOString(),
      oracle_snapshot: this.config.oracle,
      ...tx,
    };

    await this.repo.createTransaction(fullTx);
    return fullTx;
  }

  /** Recalculate trust score based on activity */
  private async recalculateTrustScore(userId: string): Promise<void> {
    const account = await this.repo.getAccount(userId);
    if (!account) return;

    const transactions = await this.repo.getTransactions(userId, 100);
    
    // Simple trust score: fulfilled matches / total matches * karma ratio
    const fulfilled = transactions.filter(t => t.type === "fulfillment").length;
    const cancelled = transactions.filter(t => t.type === "penalty").length;
    const totalMatches = fulfilled + cancelled;
    
    let trustScore = 0.5; // baseline
    
    if (totalMatches > 0) {
      trustScore = fulfilled / totalMatches;
    }
    
    // Boost for high karma balance
    if (account.znu_balance > 1000) trustScore += 0.1;
    if (account.znu_balance > 5000) trustScore += 0.1;
    
    // Cap at 1.0
    account.trust_score = Math.min(1.0, Math.max(0.0, trustScore));
    await this.repo.updateAccount(account);
  }

  /** Get dual-mode representation of karma for UI */
  async getDualBalance(userId: string) {
    const account = await this.getOrCreateAccount(userId);
    return toDualValue(account.znu_balance, this.dualConfig);
  }

  /** Switch monetary mode (postmonetario <-> conectado) */
  setMode(mode: "postmonetario" | "conectado", oracle?: PriceParityOracle): void {
    this.dualConfig = createDualConfig(mode, oracle);
  }

  /** Get current mode */
  getMode(): "postmonetario" | "conectado" {
    return this.dualConfig.mode;
  }
}

/** Factory function */
export function createKarmaSystem(repo: KarmaRepository, config: KarmaSystemConfig = {}): KarmaSystem {
  return new KarmaSystem(repo, config);
}