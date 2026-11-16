/**
 * ARM Brand - Single source of truth for product identity
 * 
 * HSCSG principle: rename = this file + package/repository/schema identifiers.
 * Schema identifiers should NOT change (they are formats, not branding).
 */

export const brand = {
  /** Short product name used in UI */
  name: "ARM",
  /** Full product name */
  fullName: "HSCSG ARM",
  /** Descriptor for taglines */
  descriptor: "Agent Relationship Management",
  /** Maker/organization */
  maker: "HSCSG",
  /** Version (synced from package.json at build) */
  version: "0.1.0",
  /** Product work URL (for signals handoff) */
  productWorkUrl: "https://hscsg.org/product-work",
} as const;

/** Type for the brand object */
export type Brand = typeof brand;

/** Helper to get product name for display */
export function productName(short = false): string {
  return short ? brand.name : brand.fullName;
}

/** Helper for taglines */
export function tagline(): string {
  return `${brand.name} — ${brand.descriptor}`;
}