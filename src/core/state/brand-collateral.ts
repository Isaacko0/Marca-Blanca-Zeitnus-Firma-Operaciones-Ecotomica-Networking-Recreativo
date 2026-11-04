// Brand Collateral — Types & State
// Assets generados + RAO + Export Bundle
// Isomorfo a Soul.MBA Descargas + CaaS RAO

export interface BrandAsset {
  id: string;
  type: 'deck' | 'carousel' | 'post' | 'stories' | 'diploma' | 'stationery' | 'campaign' | 'logo' | 'triqueta' | 'font';
  name: string;
  svg: string;
  css: string;
  markdown: string;
  params: Record<string, any>;
  brandDNAHash: string;
  voiceHash: string;
  campaignMapHash?: string;
  createdAt: number;
  updatedAt: number;
  version: number;
  tags: string[];
}

export interface BrandRAO {
  assetId: string;
  origin: 'wizard' | 'manual' | 'import';
  author: {
    did: string;
    role: 'dean' | 'agent' | 'client';
    name: string;
  };
  brandDNAHash: string;
  voiceHash: string;
  campaignMapHash?: string;
  timestamp: string; // ISO8601
  signatures: Ed25519Signature[];
}

export interface Ed25519Signature {
  signer: string; // DID
  signature: string; // base64
  algorithm: 'Ed25519';
  timestamp: string;
}

export interface ExportBundle {
  id: string;
  name: string;
  assets: BrandAsset[];
  manifest: ExportManifest;
  createdAt: number;
  brandDNAHash: string;
  voiceHash: string;
}

export interface ExportManifest {
  bundleId: string;
  bundleName: string;
  version: string;
  createdAt: number;
  brandDNAHash: string;
  voiceHash: string;
  assetCount: number;
  assets: Array<{
    id: string;
    name: string;
    type: string;
    hash: string; // SHA256 del SVG
    size: number; // bytes
  }>;
  rao: BrandRAO[];
}

export interface BrandCollateralState {
  assets: BrandAsset[];
  bundles: ExportBundle[];
  raoLedger: BrandRAO[];
  currentBundle: ExportBundle | null;

  // Acciones
  addAsset: (asset: Omit<BrandAsset, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => void;
  updateAsset: (id: string, updates: Partial<BrandAsset>) => void;
  removeAsset: (id: string) => void;
  getAsset: (id: string) => BrandAsset | undefined;
  getAssetsByType: (type: BrandAsset['type']) => BrandAsset[];

  createBundle: (name: string, assetIds: string[]) => ExportBundle;
  updateBundle: (id: string, updates: Partial<ExportBundle>) => void;
  removeBundle: (id: string) => void;
  getBundle: (id: string) => ExportBundle | undefined;

  signAsset: (assetId: string, signerDid: string, signerRole: 'dean' | 'agent' | 'client', signerName: string) => void;
  verifyRAO: (rao: BrandRAO) => boolean;

  exportBundle: (bundleId: string, format: 'zip' | 'json') => Promise<Blob>;
  exportAsset: (assetId: string, format: 'svg' | 'png' | 'pdf' | 'json') => Promise<Blob>;
  importBundle: (blob: Blob) => Promise<ExportBundle>;

  // CaaS Integration
  submitToCaaS: (assetId: string) => Promise<{ accepted: boolean; caasId: string }>;
  verifyCaaS: (caasId: string) => Promise<boolean>;
}

export function makeBrandCollateralState() {
  return {
    assets: [],
    bundles: [],
    raoLedger: [],
    currentBundle: null,

    addAsset: (asset) => {},
    updateAsset: (id, updates) => {},
    removeAsset: (id) => {},
    getAsset: (id) => undefined,
    getAssetsByType: (type) => [],

    createBundle: (name, assetIds) => ({} as any),
    updateBundle: (id, updates) => {},
    removeBundle: (id) => {},
    getBundle: (id) => undefined,

    signAsset: (assetId, signerDid, signerRole, signerName) => {},
    verifyRAO: (rao) => false,

    exportBundle: async () => new Blob(),
    exportAsset: async () => new Blob(),
    importBundle: async () => ({} as any),

    submitToCaaS: async () => ({ accepted: false, caasId: '' }),
    verifyCaaS: async () => false,
  };
}