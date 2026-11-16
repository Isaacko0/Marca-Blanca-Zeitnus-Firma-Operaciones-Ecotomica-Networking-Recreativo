// Brand Collateral — Lógica Pura
// Generación de bundles, RAO signing, exportación, verificación CaaS

import type {
  BrandAsset,
  BrandRAO,
  ExportBundle,
  ExportManifest,
  Ed25519Signature,
  BrandCollateralState,
} from '@core/state/brand-collateral';

/**
 * Genera hash SHA256 simple (para demo - usar crypto.subtle en producción)
 */
async function sha256(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Genera ID único
 */
function generateId(prefix: string = 'asset'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Crea un asset nuevo
 */
export function createAsset(
  state: BrandCollateralState,
  asset: Omit<BrandAsset, 'id' | 'createdAt' | 'updatedAt' | 'version'>
): BrandAsset {
  const now = Date.now();
  return {
    ...asset,
    id: generateId('asset'),
    createdAt: now,
    updatedAt: now,
    version: 1,
  };
}

/**
 * Actualiza un asset existente
 */
export function updateAsset(
  state: BrandCollateralState,
  id: string,
  updates: Partial<BrandAsset>
): BrandAsset | null {
  const asset = state.assets.find(a => a.id === id);
  if (!asset) return null;

  return {
    ...asset,
    ...updates,
    updatedAt: Date.now(),
    version: asset.version + 1,
  };
}

/**
 * Crea un bundle de exportación
 */
export function createExportBundle(
  state: BrandCollateralState,
  name: string,
  assetIds: string[]
): ExportBundle {
  const assets = state.assets.filter(a => assetIds.includes(a.id));
  const now = Date.now();
  const bundleId = generateId('bundle');

  // Calcula hashes de assets
  const assetManifest = assets.map(asset => ({
    id: asset.id,
    name: asset.name,
    type: asset.type,
    hash: '', // Se calcularía con sha256(asset.svg)
    size: new Blob([asset.svg]).size,
  }));

  const manifest: ExportManifest = {
    bundleId,
    bundleName: name,
    version: '1.0',
    createdAt: now,
    brandDNAHash: assets[0]?.brandDNAHash || '',
    voiceHash: assets[0]?.voiceHash || '',
    assetCount: assets.length,
    assets: assetManifest,
    rao: [], // Se llenará al firmar
  };

  return {
    id: bundleId,
    name,
    assets,
    manifest,
    createdAt: now,
    brandDNAHash: assets[0]?.brandDNAHash || '',
    voiceHash: assets[0]?.voiceHash || '',
  };
}

/**
 * Firma un asset (genera RAO)
 */
export async function signAsset(
  state: BrandCollateralState,
  assetId: string,
  signerDid: string,
  signerRole: 'dean' | 'agent' | 'client',
  signerName: string
): Promise<BrandRAO | null> {
  const asset = state.assets.find(a => a.id === assetId);
  if (!asset) return null;

  const timestamp = new Date().toISOString();
  const assetHash = await sha256(asset.svg);

  const rao: BrandRAO = {
    assetId,
    origin: 'wizard',
    author: { did: signerDid, role: 'dean', name: signerName },
    brandDNAHash: asset.brandDNAHash,
    voiceHash: asset.voiceHash,
    campaignMapHash: asset.campaignMapHash,
    timestamp,
    signatures: [{
      signer: signerDid,
      signature: '', // En producción: firma Ed25519 real
      algorithm: 'Ed25519',
      timestamp,
    }],
  };

  // En producción: firma real con noble-ed25519
  // const signature = await signEd25519(assetHash, privateKey);
  // rao.signatures[0].signature = signature;

  state.raoLedger.push(rao);
  return rao;
}

/**
 * Verifica RAO (validación básica)
 */
export function verifyRAO(rao: BrandRAO): boolean {
  if (!rao.assetId || !rao.brandDNAHash || !rao.voiceHash) return false;
  if (!rao.author || !rao.author.did || !rao.author.role) return false;
  if (!rao.signatures || rao.signatures.length === 0) return false;
  if (!rao.timestamp) return false;

  // En producción: verifica firmas Ed25519
  // for (const sig of rao.signatures) {
  //   if (!verifyEd25519(assetHash, sig.signature, sig.signer)) return false;
  // }

  return true;
}

/**
 * Genera manifest de exportación
 */
export function generateManifest(bundle: ExportBundle): ExportManifest {
  return bundle.manifest;
}

/**
 * Exporta bundle a JSON
 */
export function exportBundleToJSON(bundle: ExportBundle): string {
  return JSON.stringify(bundle, null, 2);
}

/**
 * Exporta bundle a ZIP (requiere JSZip)
 */
export async function exportBundleToZip(bundle: ExportBundle): Promise<Blob> {
  // Requiere JSZip
  // const JSZip = (await import('jszip')).default;
  // const zip = new JSZip();
  // bundle.assets.forEach(asset => {
  //   zip.file(`${asset.name}.svg`, asset.svg);
  //   zip.file(`${asset.name}.css`, asset.css);
  //   zip.file(`${asset.name}.md`, asset.markdown);
  // });
  // zip.file('manifest.json', JSON.stringify(bundle.manifest, null, 2));
  // return zip.generateAsync({ type: 'blob' });

  return new Blob(['ZIP export requires JSZip dependency'], { type: 'application/zip' });
}

/**
 * Exporta asset individual
 */
export async function exportAsset(asset: BrandAsset, format: 'svg' | 'png' | 'pdf' | 'json'): Promise<Blob> {
  switch (format) {
    case 'svg':
      return new Blob([asset.svg], { type: 'image/svg+xml' });
    case 'json':
      return new Blob([JSON.stringify({
        id: asset.id,
        name: asset.name,
        type: asset.type,
        params: asset.params,
        brandDNAHash: asset.brandDNAHash,
        voiceHash: asset.voiceHash,
        createdAt: asset.createdAt,
      }, null, 2)], { type: 'application/json' });
    case 'png':
    case 'pdf':
      // Requiere conversión (canvg, puppeteer, etc.)
      return new Blob([`${format.toUpperCase()} export requires conversion library`], { type: 'text/plain' });
    default:
      return new Blob(['Unsupported format'], { type: 'text/plain' });
  }
}

/**
 * Importa bundle desde JSON
 */
export function importBundleFromJSON(json: string): ExportBundle | null {
  try {
    const bundle = JSON.parse(json);
    // Validar estructura mínima
    if (!bundle.id || !bundle.name || !bundle.assets || !bundle.manifest) {
      return null;
    }
    return bundle;
  } catch {
    return null;
  }
}

/**
 * Verifica integridad de bundle
 */
export function verifyBundleIntegrity(bundle: ExportBundle): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!bundle.id) errors.push('Bundle ID requerido');
  if (!bundle.name) errors.push('Bundle name requerido');
  if (!bundle.assets || bundle.assets.length === 0) errors.push('Bundle sin assets');
  if (!bundle.manifest) errors.push('Manifest requerido');
  if (bundle.manifest.assetCount !== bundle.assets.length) {
    errors.push('Asset count mismatch en manifest');
  }

  // Verificar RAOs
  for (const rao of bundle.manifest.rao || []) {
    if (!verifyRAO(rao)) {
      errors.push(`RAO inválido para asset ${rao.assetId}`);
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Genera RAO para CaaS submission
 */
export function generateCaaSRAO(asset: BrandAsset, signerDid: string, signerRole: 'dean' | 'agent' | 'client', signerName: string): BrandRAO {
  return {
    assetId: asset.id,
    origin: 'wizard',
    author: { did: signerDid, role: signerRole, name: signerName },
    brandDNAHash: asset.brandDNAHash,
    voiceHash: asset.voiceHash,
    campaignMapHash: asset.campaignMapHash,
    timestamp: new Date().toISOString(),
    signatures: [{
      signer: signerDid,
      signature: '',
      algorithm: 'Ed25519',
      timestamp: new Date().toISOString(),
    }],
  };
}

/**
 * Filtra assets por tipo
 */
export function getAssetsByType(assets: BrandAsset[], type: BrandAsset['type']): BrandAsset[] {
  return assets.filter(a => a.type === type);
}

/**
 * Busca assets por tag
 */
export function searchAssetsByTag(assets: BrandAsset[], tag: string): BrandAsset[] {
  return assets.filter(a => a.tags.some(t => t.toLowerCase().includes(tag.toLowerCase())));
}

/**
 * Obtiene estadísticas de collateral
 */
export function getCollateralStats(state: BrandCollateralState): {
  totalAssets: number;
  assetsByType: Record<string, number>;
  totalBundles: number;
  totalRAOs: number;
  totalSize: number;
} {
  const assetsByType: Record<string, number> = {};
  let totalSize = 0;

  for (const asset of state.assets) {
    assetsByType[asset.type] = (assetsByType[asset.type] || 0) + 1;
    totalSize += asset.svg.length;
  }

  return {
    totalAssets: state.assets.length,
    assetsByType,
    totalBundles: state.bundles.length,
    totalRAOs: state.raoLedger.length,
    totalSize,
  };
}