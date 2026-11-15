// arm-loomio/src/lib/loomio/legalAcceptance.ts
// Legal Terms Acceptance Tracking
// Ported from Loomio's User model legal_accepted flow

export interface LegalTermsVersion {
  version: string;           // e.g., "2024.1"
  content: string;           // Full terms text
  contentHash: string;       // SHA256 of content
  effectiveAt: number;       // When this version becomes effective
  requiredAt?: number;       // When acceptance becomes mandatory (optional)
  retirementAt?: number;     // When this version is retired (optional)
}

export interface LegalAcceptance {
  id: string;
  affiliateId: string;
  version: string;
  acceptedAt: number;
  acceptedVersion: string;   // Version that was accepted
  ipAddress?: string;
  userAgent?: string;
  method: 'explicit' | 'implicit' | 'admin_action';
}

export interface LegalAcceptanceStatus {
  affiliateId: string;
  currentVersion: string;
  acceptedVersion: string | null;
  acceptedAt: number | null;
  isCurrent: boolean;
  required: boolean;
  requiredAt?: number;
}

export interface LegalTermsConfig {
  versions: LegalTermsVersion[];
  currentVersion: string;
  requireAcceptanceForParticipation: boolean;
  autoAcceptForExistingUsers: boolean;
  gracePeriodDays: number;   // Days after requiredAt before blocking
}

/**
 * Legal Terms Service
 */
export class LegalTermsService {
  private config: LegalTermsConfig;
  private acceptances = new Map<string, LegalAcceptance[]>(); // affiliateId -> acceptances[]

  constructor(config: LegalTermsConfig) {
    this.config = config;
  }

  /**
   * Get current legal terms version
   */
  getCurrentVersion(): LegalTermsVersion {
    const version = this.config.versions.find(v => v.version === this.config.currentVersion);
    if (!version) {
      throw new Error(`Current version ${this.config.currentVersion} not found in versions`);
    }
    return version;
  }

  /**
   * Get legal terms version by version string
   */
  getVersion(version: string): LegalTermsVersion | null {
    return this.config.versions.find(v => v.version === version) ?? null;
  }

  /**
   * Check if affiliate has accepted current terms
   */
  hasAcceptedCurrent(affiliateId: string): boolean {
    const acceptance = this.getLatestAcceptance(affiliateId);
    return acceptance?.acceptedVersion === this.config.currentVersion;
  }

  /**
   * Get latest acceptance for affiliate
   */
  getLatestAcceptance(affiliateId: string): LegalAcceptance | null {
    const acceptances = this.acceptances.get(affiliateId);
    if (!acceptances || acceptances.length === 0) return null;
    return acceptances[acceptances.length - 1];
  }

  /**
   * Get all acceptances for affiliate
   */
  getAllAcceptances(affiliateId: string): LegalAcceptance[] {
    return this.acceptances.get(affiliateId) ?? [];
  }

  /**
   * Get acceptance status for affiliate
   */
  getStatus(affiliateId: string): LegalAcceptanceStatus {
    const currentVersion = this.getCurrentVersion();
    const latest = this.getLatestAcceptance(affiliateId);
    
    return {
      affiliateId,
      currentVersion: this.config.currentVersion,
      acceptedVersion: latest?.acceptedVersion ?? null,
      acceptedAt: latest?.acceptedAt ?? null,
      isCurrent: latest?.acceptedVersion === this.config.currentVersion,
      required: this.config.requireAcceptanceForParticipation,
      requiredAt: currentVersion.requiredAt,
    };
  }

  /**
   * Record legal acceptance
   */
  accept(
    affiliateId: string,
    version: string,
    options: {
      ipAddress?: string;
      userAgent?: string;
      method?: 'explicit' | 'implicit' | 'admin_action';
    } = {}
  ): LegalAcceptance {
    const termsVersion = this.getVersion(version);
    if (!termsVersion) {
      throw new Error(`Legal terms version not found: ${version}`);
    }
    
    // Check if version is retired
    if (termsVersion.retirementAt && Date.now() > termsVersion.retirementAt) {
      throw new Error(`Legal terms version ${version} has been retired`);
    }
    
    // Check if version is not yet effective
    if (Date.now() < termsVersion.effectiveAt) {
      throw new Error(`Legal terms version ${version} is not yet effective`);
    }

    const acceptance: LegalAcceptance = {
      id: `legal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      affiliateId,
      version: termsVersion.version,
      acceptedAt: Date.now(),
      acceptedVersion: termsVersion.version,
      ipAddress: options.ipAddress,
      userAgent: options.userAgent,
      method: options.method ?? 'explicit',
    };

    if (!this.acceptances.has(affiliateId)) {
      this.acceptances.set(affiliateId, []);
    }
    this.acceptances.get(affiliateId)!.push(acceptance);

    return acceptance;
  }

  /**
   * Accept current terms (convenience method)
   */
  acceptCurrent(
    affiliateId: string,
    options: {
      ipAddress?: string;
      userAgent?: string;
      method?: 'explicit' | 'implicit' | 'admin_action';
    } = {}
  ): LegalAcceptance {
    return this.accept(affiliateId, this.config.currentVersion, options);
  }

  /**
   * Check if affiliate can participate (has accepted required terms)
   */
  canParticipate(affiliateId: string): { allowed: boolean; reason?: string } {
    if (!this.config.requireAcceptanceForParticipation) {
      return { allowed: true };
    }
    
    const status = this.getStatus(affiliateId);
    if (status.isCurrent) {
      return { allowed: true };
    }
    
    const currentVersion = this.getCurrentVersion();
    if (currentVersion.requiredAt) {
      const gracePeriodEnd = currentVersion.requiredAt + (this.config.gracePeriodDays * 24 * 60 * 60 * 1000);
      if (Date.now() < gracePeriodEnd) {
        return { 
          allowed: true, 
          reason: `Grace period until ${new Date(gracePeriodEnd).toISOString()}` 
        };
      }
    }
    
    return { 
      allowed: false, 
      reason: 'Legal terms acceptance required' 
    };
  }

  /**
   * Get affiliates who need to accept terms
   */
  getAffiliatesNeedingAcceptance(affiliateIds: string[]): string[] {
    return affiliateIds.filter(id => {
      const status = this.getStatus(id);
      return !status.isCurrent && this.config.requireAcceptanceForParticipation;
    });
  }

  /**
   * Bulk accept for existing users (migration)
   */
  bulkAcceptCurrent(affiliateIds: string[], method: 'admin_action' = 'admin_action'): LegalAcceptance[] {
    const results: LegalAcceptance[] = [];
    for (const affiliateId of affiliateIds) {
      if (!this.hasAcceptedCurrent(affiliateId)) {
        results.push(this.acceptCurrent(affiliateId, { method }));
      }
    }
    return results;
  }

  /**
   * Update current version (with migration)
   */
  setCurrentVersion(newVersion: string, options: { requireAt?: number; gracePeriodDays?: number } = {}): void {
    const version = this.getVersion(newVersion);
    if (!version) {
      throw new Error(`Version not found: ${newVersion}`);
    }
    
    if (Date.now() < version.effectiveAt) {
      throw new Error(`Version ${newVersion} is not yet effective`);
    }
    
    this.config.currentVersion = newVersion;
    
    if (options.requireAt) {
      version.requiredAt = options.requireAt;
    }
    
    if (options.gracePeriodDays !== undefined) {
      this.config.gracePeriodDays = options.gracePeriodDays;
    }
  }

  /**
   * Add new version
   */
  addVersion(version: LegalTermsVersion): void {
    if (this.config.versions.some(v => v.version === version.version)) {
      throw new Error(`Version already exists: ${version.version}`);
    }
    
    // Verify content hash
    const computedHash = this.computeContentHash(version.content);
    if (computedHash !== version.contentHash) {
      throw new Error('Content hash mismatch');
    }
    
    this.config.versions.push(version);
    // Sort by effectiveAt
    this.config.versions.sort((a, b) => a.effectiveAt - b.effectiveAt);
  }

  /**
   * Retire a version
   */
  retireVersion(version: string, retirementAt: number = Date.now()): void {
    const v = this.getVersion(version);
    if (!v) {
      throw new Error(`Version not found: ${version}`);
    }
    
    if (v.version === this.config.currentVersion) {
      throw new Error('Cannot retire current version');
    }
    
    v.retirementAt = retirementAt;
  }

  private computeContentHash(content: string): string {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(content).digest('hex');
  }
}

/**
 * Legal Acceptance Repository Interface
 */
export interface LegalAcceptanceRepository {
  save(acceptance: LegalAcceptance): Promise<void>;
  findLatest(affiliateId: string): Promise<LegalAcceptance | null>;
  findAll(affiliateId: string): Promise<LegalAcceptance[]>;
  findByVersion(version: string): Promise<LegalAcceptance[]>;
}

/**
 * In-Memory Legal Acceptance Repository
 */
export class InMemoryLegalAcceptanceRepository implements LegalAcceptanceRepository {
  private acceptances = new Map<string, LegalAcceptance[]>(); // affiliateId -> acceptances[]

  async save(acceptance: LegalAcceptance): Promise<void> {
    if (!this.acceptances.has(acceptance.affiliateId)) {
      this.acceptances.set(acceptance.affiliateId, []);
    }
    this.acceptances.get(acceptance.affiliateId)!.push(acceptance);
  }

  async findLatest(affiliateId: string): Promise<LegalAcceptance | null> {
    const list = this.acceptances.get(affiliateId);
    if (!list || list.length === 0) return null;
    return list[list.length - 1];
  }

  async findAll(affiliateId: string): Promise<LegalAcceptance[]> {
    return this.acceptances.get(affiliateId) ?? [];
  }

  async findByVersion(version: string): Promise<LegalAcceptance[]> {
    const results: LegalAcceptance[] = [];
    for (const list of this.acceptances.values()) {
      for (const acceptance of list) {
        if (acceptance.version === version) {
          results.push(acceptance);
        }
      }
    }
    return results;
  }
}

/**
 * Legal Terms Configuration - Default for ARM
 */
export function createDefaultLegalConfig(): LegalTermsConfig {
  const now = Date.now();
  const version1 = '2024.1';
  
  return {
    versions: [
      {
        version: version1,
        content: `# Terms of Service - HSCSG ARM Decision Engine

## 1. Acceptance of Terms
By using the ARM Decision Engine ("Service"), you agree to these Terms of Service ("Terms").

## 2. Collaborative Decision Making
The Service enables groups to make decisions together through proposals, voting, and consensus building.

## 3. Data Sovereignty
You retain ownership of your data. The Service operates under the principle: "Your Data, Your Rules".

## 4. Privacy
Anonymous voting options are available. Your identity is separated from your vote when using anonymous ballots.

## 5. Governance
Decisions made through the Service are binding according to your group's governance rules.

## 6. Disclaimer
The Service is provided "as is" without warranties.`,
        contentHash: '', // Will be computed
        effectiveAt: now,
        requiredAt: now + (30 * 24 * 60 * 60 * 1000), // 30 days grace period
      },
    ],
    currentVersion: version1,
    requireAcceptanceForParticipation: true,
    autoAcceptForExistingUsers: false,
    gracePeriodDays: 30,
  };
}

// Initialize content hash for default config
const defaultConfig = createDefaultLegalConfig();
const crypto = require('crypto');
defaultConfig.versions[0].contentHash = crypto.createHash('sha256').update(defaultConfig.versions[0].content).digest('hex');

export const DEFAULT_LEGAL_CONFIG = defaultConfig;