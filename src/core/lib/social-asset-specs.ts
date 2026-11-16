// Social Asset Specs — Lógica Pura
// Generación de assets, validación, exportación

import type {
  AssetSpec,
  DeckSpec,
  CarouselSpec,
  PostSpec,
  StoriesSpec,
  DiplomaSpec,
  StationerySpec,
  CampaignSpec,
  GeneratedAsset,
  AssetSpec as AssetSpecType,
} from '@core/state/social-asset-specs';
import {
  DECK_SPEC,
  CAROUSEL_SPEC,
  POST_SPEC,
  STORIES_SPEC,
  DIPLOMA_SPEC,
  STATIONERY_SPEC,
  CAMPAIGN_SPEC,
  ASSET_SPECS,
} from '@core/state/social-asset-specs';

/**
 * Obtiene spec por tipo
 */
export function getAssetSpec(type: string): AssetSpecType | undefined {
  return ASSET_SPECS[type];
}

/**
 * Valida parámetros contra spec
 */
export function validateAssetParams(spec: AssetSpecType, params: Record<string, any>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validaciones específicas por tipo
  switch (spec.type) {
    case 'deck':
      if (params.slides && !Array.isArray(params.slides)) {
        errors.push('slides debe ser array');
      }
      break;
    case 'carousel':
      if (params.cards && params.cards !== 5) {
        errors.push('Carrusel debe tener exactamente 5 tarjetas');
      }
      break;
    case 'post':
      if (params.caption && params.caption.length > 2200) {
        errors.push('Caption excede 2200 caracteres');
      }
      break;
    case 'stories':
      if (params.text && params.text.length > 100) {
        errors.push('Texto en story muy largo (máx 100 chars)');
      }
      break;
    case 'diploma':
      if (!params.name?.trim()) {
        errors.push('Nombre del graduado requerido');
      }
      break;
    case 'stationery':
      if (params.name && params.name.length > 30) {
        errors.push('Nombre muy largo para tarjeta (máx 30 chars)');
      }
      break;
    case 'campaign':
      if (params.pieces && (!Array.isArray(params.pieces) || params.pieces.length < 6)) {
        errors.push('Campaña requiere al menos 6 piezas');
      }
      break;
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Genera SVG para Deck (portada)
 */
export function generateDeckCoverSVG(params: { title: string; subtitle?: string; brandHandle: string }): string {
  const { title, subtitle, brandHandle } = params;
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  <rect width="1920" height="1080" fill="#101010"/>
  <text x="960" y="480" text-anchor="middle" font-family="Jost, sans-serif" font-size="72" font-weight="800" fill="#f7faff" letter-spacing="-0.035em">${escapeXML(title)}</text>
  ${subtitle ? `<text x="960" y="570" text-anchor="middle" font-family="Manrope, sans-serif" font-size="24" fill="#afeb00">${escapeXML(subtitle)}</text>` : ''}
  <text x="960" y="1000" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="14" font-weight="500" letter-spacing="0.28em" text-transform="uppercase" fill="#afeb00">${escapeXML(brandHandle)}</text>
</svg>
  `.trim();
}

/**
 * Genera SVG para Carrusel (tarjeta individual)
 */
export function generateCarouselCardSVG(params: {
  index: number; // 0-4
  title: string;
  body: string;
  isLast: boolean;
  brandHandle: string;
}): string {
  const { index, title, body, isLast, brandHandle } = params;
  const colors = ['#101010', '#f7faff', '#101010', '#f7faff', '#101010'];
  const textColors = ['#f7faff', '#101010', '#f7faff', '#101010', '#f7faff'];
  const bg = colors[index];
  const textColor = textColors[index];

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" width="1080" height="1080">
  <rect width="1080" height="1080" fill="${bg}"/>
  <text x="540" y="300" text-anchor="middle" font-family="Jost, sans-serif" font-size="48" font-weight="600" fill="${textColor}" letter-spacing="-0.02em">${escapeXML(title)}</text>
  <text x="540" y="500" text-anchor="middle" font-family="Manrope, sans-serif" font-size="24" line-height="1.5" fill="${textColor}">${escapeXML(body)}</text>
  ${isLast ? `<text x="540" y="950" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="14" font-weight="500" letter-spacing="0.28em" text-transform="uppercase" fill="#afeb00">${escapeXML(brandHandle)}</text>` : ''}
  <!-- Progress dots -->
  <g>
    ${[0,1,2,3,4].map(i => `<circle cx="${490 + i * 20}" cy="1020" r="6" fill="${i <= index ? '#afeb00' : 'rgba(255,255,255,0.3)'}"/>`).join('')}
  </g>
</svg>
  `.trim();
}

/**
 * Genera SVG para Post IG
 */
export function generatePostIGSVG(params: { quote: string; brandHandle: string }): string {
  const { quote, brandHandle } = params;
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" width="1080" height="1080">
  <rect width="1080" height="1080" fill="#101010"/>
  <!-- Triqueta background -->
  <g opacity="0.15">
    <circle cx="540" cy="540" r="300" stroke="#afeb00" stroke-width="2" fill="none"/>
    <circle cx="540" cy="540" r="200" stroke="#afeb00" stroke-width="2" fill="none"/>
    <circle cx="540" cy="540" r="100" stroke="#afeb00" stroke-width="2" fill="none"/>
  </g>
  <text x="540" y="540" text-anchor="middle" font-family="Newsreader, Georgia, serif" font-size="32" font-style="italic" font-weight="400" fill="#f7faff" line-height="1.4" text-anchor="middle" dominant-baseline="middle" width="900">${escapeXML(quote)}</text>
  <text x="540" y="1000" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="14" font-weight="500" letter-spacing="0.28em" text-transform="uppercase" fill="#afeb00">${escapeXML(brandHandle)}</text>
</svg>
  `.trim();
}

/**
 * Genera SVG para Diploma
 */
export function generateDiplomaSVG(params: { name: string; cohort: string; date: string }): string {
  const { name, cohort, date } = params;
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 297 210" width="297mm" height="210mm">
  <rect width="297" height="210" fill="#f7faff"/>
  <g transform="translate(148.5, 105)">
    <!-- Triqueta en tinta -->
    <svg viewBox="22.53 15.61 54.94 54.94" width="80" height="80">
      <g fill="none" stroke="#101010" stroke-width="3" stroke-linejoin="round">
        <path d="M 26.03 63.84 A 24 24 0 0 1 60.98 43.66 A 24 24 0 0 1 26.03 63.84 Z"/>
        <path d="M 50.00 22.32 A 24 24 0 0 1 50.00 62.68 A 24 24 0 0 1 50.00 22.32 Z"/>
        <path d="M 73.97 63.84 A 24 24 0 0 1 39.02 43.66 A 24 24 0 0 1 73.97 63.84 Z"/>
      </g>
    </svg>
    <text x="0" y="20" text-anchor="middle" font-family="Newsreader, Georgia, serif" font-size="19" font-style="italic" font-weight="400" fill="#101010" text-anchor="middle">${escapeXML(name)}</text>
    <line x1="-68" y1="35" x2="68" y2="35" stroke="#afeb00" stroke-width="2"/>
    <text x="0" y="55" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="9.5" font-weight="500" letter-spacing="0.12em" text-transform="uppercase" fill="#3e4a7a">${escapeXML(cohort)}</text>
    <text x="0" y="80" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="9.5" font-weight="500" letter-spacing="0.12em" text-transform="uppercase" fill="#3e4a7a">${escapeXML(date)}</text>
  </g>
</svg>
  `.trim();
}

/**
 * Genera SVG para Tarjeta (cara frontal)
 */
export function generateBusinessCardFrontSVG(params: { name: string; role: string; brandHandle: string }): string {
  const { name, role, brandHandle } = params;
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 550 350" width="550" height="350">
  <rect width="550" height="350" fill="#101010"/>
  <text x="275" y="140" text-anchor="middle" font-family="Jost, sans-serif" font-size="36" font-weight="600" fill="#f7faff">${escapeXML(name)}</text>
  <text x="275" y="190" text-anchor="middle" font-family="Manrope, sans-serif" font-size="18" fill="#afeb00">${escapeXML(role)}</text>
  <text x="275" y="300" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="12" font-weight="500" letter-spacing="0.28em" text-transform="uppercase" fill="#afeb00">${escapeXML(brandHandle)}</text>
</svg>
  `.trim();
}

/**
 * Genera SVG para Tarjeta (dorso)
 */
export function generateBusinessCardBackSVG(params: { brandHandle: string }): string {
  const { brandHandle } = params;
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 550 350" width="550" height="350">
  <rect width="550" height="350" fill="#afeb00"/>
  <circle cx="275" cy="175" r="60" fill="#101010"/>
</svg>
  `.trim();
}

/**
 * Genera SVG para Campaña (mapa visual)
 */
export function generateCampaignMapSVG(pieces: CampaignSpec['pieces']): string {
  const boxWidth = 180;
  const boxHeight = 80;
  const gap = 20;
  const startX = 50;
  const startY = 50;

  const boxes = pieces.map((piece, i) => {
    const x = startX + (i % 4) * (boxWidth + gap);
    const y = startY + Math.floor(i / 4) * (boxHeight + gap);
    const isShadow = piece.register === 'shadow';
    const isConversation = piece.isConversation;

    return `
      <g transform="translate(${x}, ${y})">
        <rect width="${boxWidth}" height="${boxHeight}" rx="8" fill="${isShadow ? '#101010' : '#f7faff'}" stroke="${isShadow ? '#afeb00' : '#13228b'}" stroke-width="2"/>
        <text x="${boxWidth/2}" y="${boxHeight/2 - 10}" text-anchor="middle" font-family="Jost, sans-serif" font-size="14" font-weight="600" fill="${isShadow ? '#afeb00' : '#13228b'}">${escapeXML(piece.name)}</text>
        <text x="${boxWidth/2}" y="${boxHeight/2 + 10}" text-anchor="middle" font-family="Manrope, sans-serif" font-size="11" fill="${isShadow ? 'rgba(247,250,255,0.7)' : '#3e4a7a'}">${piece.register}${isConversation ? ' · conversación' : ''}</text>
        ${piece.isConversation ? `<circle cx="${boxWidth - 15}" cy="15" r="8" fill="none" stroke="#afeb00" stroke-width="2"/>` : ''}
      </g>
    `;
  }).join('');

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" width="800" height="400">
  <rect width="800" height="400" fill="#f4f7ff"/>
  ${boxes}
</svg>
  `.trim();
}

/**
 * Genera asset completo (SVG + CSS + Markdown)
 */
export function generateAsset(
  spec: AssetSpec,
  params: Record<string, any>,
  brandDNAHash: string,
  voiceHash: string
): GeneratedAsset {
  let svg = '';
  let css = '';
  let markdown = '';

  switch (spec.type) {
    case 'deck':
      svg = generateDeckCoverSVG(params);
      break;
    case 'carousel':
      svg = generateCarouselCardSVG({ ...params, index: params.index || 0, isLast: params.isLast });
      break;
    case 'post':
      svg = generatePostIGSVG(params);
      break;
    case 'diploma':
      svg = generateDiplomaSVG(params);
      break;
    case 'stationery':
      svg = params.side === 'back' ? generateBusinessCardBackSVG(params) : generateBusinessCardFrontSVG(params);
      break;
    case 'campaign':
      svg = generateCampaignMapSVG((spec as CampaignSpec).pieces);
      break;
    default:
      svg = '<svg></svg>';
  }

  // CSS variables para el asset
  css = `:root { --asset-bg: var(--ink-0); --asset-text: var(--text-primary); --asset-accent: var(--lime); }`;

  // Markdown documentation
  markdown = `# ${spec.name}\n\n${spec.description}\n\n## Parámetros\n${Object.entries(params).map(([k, v]) => `- **${k}**: ${JSON.stringify(v)}`).join('\n')}\n\n## Specs\n${JSON.stringify(spec, null, 2)}`;

  return {
    id: `asset_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    type: spec.type,
    name: `${spec.name}_${Date.now()}`,
    params,
    svg,
    css,
    markdown,
    createdAt: Date.now(),
    brandDNAHash,
    voiceHash,
  };
}

/**
 * Exporta assets a ZIP (usa JSZip)
 */
export async function exportAssetsToZip(assets: GeneratedAsset[]): Promise<Blob> {
  // Requiere JSZip como dependencia
  // const JSZip = (await import('jszip')).default;
  // const zip = new JSZip();
  // assets.forEach(asset => {
  //   zip.file(`${asset.name}.svg`, asset.svg);
  //   zip.file(`${asset.name}.css`, asset.css);
  //   zip.file(`${asset.name}.md`, asset.markdown);
  // });
  // return zip.generateAsync({ type: 'blob' });
  return new Blob(['ZIP export requires JSZip dependency'], { type: 'application/zip' });
}

/**
 * Escape XML para SVG seguro
 */
function escapeXML(str: string): string {
  return str
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, '&apos;');
}