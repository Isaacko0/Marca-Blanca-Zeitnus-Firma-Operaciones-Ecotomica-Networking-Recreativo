// arm-loomio/src/core/templateService.ts
// Template Service - Business Logic for Proposal Templates

import { 
  LoomioProposalTemplate,
  ProposalType,
} from '../../types';

import { 
  PROPOSAL_TYPES, 
  getProposalTypeConfig,
} from '../../lib/loomio/proposalTypes';

import { generateId, now } from '../utils';

export class LoomioTemplateService {
  private templates = new Map<string, LoomioProposalTemplate>();

  /**
   * Create a new template
   */
  async create(input: {
    groupId: string;
    name: string;
    description?: string;
    type: ProposalType;
    config: Partial<any>;
    createdBy: string;
  }): Promise<any> {
    const typeConfig = getProposalTypeConfig(input.type);
    if (!typeConfig) throw new Error(`Unknown proposal type: ${input.type}`);

    const templateId = generateId('template');
    const template: any = {
      id: templateId,
      groupId: input.groupId,
      name: input.name,
      description: input.description,
      type: input.type,
      config: input.config,
      createdBy: input.createdBy,
      createdAt: now(),
      updatedAt: now(),
      discarded: false,
      position: 0,
    };

    this.templates.set(templateId, template);
    return template;
  }

  /**
   * Get template by ID
   */
  get(templateId: string): any | null {
    return this.templates.get(templateId) ?? null;
  }

  /**
   * List templates for group
   */
  listByGroup(groupId: string, options: { type?: string; discarded?: boolean } = {}): any[] {
    return Array.from(this.templates.values()).filter(t => {
      if (t.groupId !== groupId) return false;
      if (options.type && t.type !== options.type) return false;
      if (options.discarded !== undefined && t.discarded !== options.discarded) return false;
      return true;
    });
  }

  /**
   * Update template
   */
  update(templateId: string, updates: Partial<any>, updatedBy: string): any {
    const template = this.templates.get(templateId);
    if (!template) throw new Error('Template not found');

    Object.assign(template, updates);
    template.updatedAt = Date.now();
    this.templates.set(templateId, template);
    return template;
  }

  /**
   * Publish template (admin action)
   */
  publish(templateId: string, publishedBy: string): any {
    const template = this.templates.get(templateId);
    if (!template) throw new Error('Template not found');

    template.discarded = false;
    template.publishedBy = publishedBy;
    template.publishedAt = Date.now();
    template.updatedAt = Date.now();
    this.templates.set(templateId, template);
    return template;
  }

  /**
   * Discard template (hide)
   */
  discard(templateId: string, discardedBy: string): any {
    const template = this.templates.get(templateId);
    if (!template) throw new Error('Template not found');

    template.discarded = true;
    template.discardedBy = discardedBy;
    template.discardedAt = Date.now();
    template.updatedAt = Date.now();
    this.templates.set(templateId, template);
    return template;
  }

  /**
   * Get default templates for a proposal type
   */
  getDefaultTemplates(type: ProposalType): any[] {
    const typeConfig = getProposalTypeConfig(type);
    if (!typeConfig) return [];

    return [
      {
        key: `${type}_standard`,
        name: `Standard ${typeConfig.label}`,
        description: typeConfig.description,
        type,
        config: { ...typeConfig.defaults },
        isDefault: true,
      },
    ];
  }

  /**
   * Create template from proposal
   */
  createFromProposal(proposalId: string, name: string, groupId: string, createdBy: string): any {
    // Would fetch proposal and create template
    return null;
  }
}