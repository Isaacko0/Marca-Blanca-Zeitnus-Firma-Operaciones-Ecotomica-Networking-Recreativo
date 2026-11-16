// Brand Color System — Lógica Pura
// Funciones puras para sistema de color trifásico + semáforo + crepúsculo
// Modo anfibio: renderColor() soporta postmonetario (ZNU) / conectado (USD)

import type { ColorPalette, ColorToken, SemanticColors, ColorMode, BrandColorState } from '@core/state/brand-color-system';
import { DEFAULT_PALETTE, LIGHT_SEMANTIC, DARK_SEMANTIC } from '@core/state/brand-color-system';

/**
 * Obtiene un token de color por clave
 */
export function getColorToken(state: BrandColorState, key: keyof typeof DEFAULT_PALETTE): typeof DEFAULT_PALETTE[keyof typeof DEFAULT_PALETTE] {
  return state.palette[key];
}

/**
 * Renderiza un color en modo anfibio
 * - postmonetario: retorna ZNU (unidad nativa)
 * - conectado: retorna USD vía priceParity
 */
export function renderColor(
  state: BrandColorState,
  tokenKey: keyof typeof DEFAULT_PALETTE,
  amount?: number
): string {
  const token = state.palette[tokenKey];
  if (!token) return '';

  if (amount !== undefined && amount > 0) {
    if (state.nodeMode === 'conectado' && state.semantic.priceParity > 0) {
      const usd = amount * state.semantic.priceParity;
      return `$${usd.toFixed(2)} USD`;
    }
    return `${amount.toLocaleString()} ZNU`;
  }

  // Modo anfibio para colores: retorna hex con etiqueta de modo si es Chispa
  if (tokenKey === 'chispa' || tokenKey === 'chispaHover') {
    const modeLabel = state.nodeMode === 'conectado' ? ' (USD)' : ' (ZNU)';
    return `${token.hex}${modeLabel}`;
  }

  return token.hex;
}

/**
 * Obtiene colores semánticos según modo actual
 */
export function getSemanticColors(state: BrandColorState): SemanticColors {
  return state.mode === 'dark' ? DARK_SEMANTIC : LIGHT_SEMANTIC;
}

/**
 * Construye paleta completa desde override parcial
 */
export function buildPalette(override: Partial<typeof DEFAULT_PALETTE> = {}): typeof DEFAULT_PALETTE {
  return { ...DEFAULT_PALETTE, ...override };
}

/**
 * Valida que un token existe en la paleta
 */
export function validateToken(key: string, palette: typeof DEFAULT_PALETTE = DEFAULT_PALETTE): boolean {
  return key in palette;
}

/**
 * Obtiene colores del semáforo como array ordenado
 */
export function getSemaphoreColors(palette: typeof DEFAULT_PALETTE = DEFAULT_PALETTE): typeof DEFAULT_PALETTE[keyof typeof DEFAULT_PALETTE][] {
  return [
    palette.sprout,
    palette.lime,
    palette.amber,
    palette.ember,
    palette.red,
  ];
}

/**
 * Obtiene colores crepúsculo
 */
export function getDuskColors(palette: typeof DEFAULT_PALETTE = DEFAULT_PALETTE): typeof DEFAULT_PALETTE[keyof typeof DEFAULT_PALETTE][] {
  return [
    palette.dusk700,
    palette.dusk400,
    palette.dusk100,
    palette.duskPeach,
    palette.duskInk,
  ];
}

/**
 * Convierte hex a RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return null;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return { r, g, b };
}

/**
 * Convierte RGB a hex
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

/**
 * Aclara un color (para hover)
 */
export function lightenHex(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const factor = 1 + percent / 100;
  return rgbToHex(
    Math.min(255, Math.round(rgb.r * factor)),
    Math.min(255, Math.round(rgb.g * factor)),
    Math.min(255, Math.round(rgb.b * factor))
  );
}

/**
 * Oscurece un color
 */
export function darkenHex(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const factor = 1 - percent / 100;
  return rgbToHex(
    Math.max(0, Math.round(rgb.r * factor)),
    Math.max(0, Math.round(rgb.g * factor)),
    Math.max(0, Math.round(rgb.b * factor))
  );
}

/**
 * Genera CSS variables para la paleta actual
 */
export function generateCSSVariables(palette: typeof DEFAULT_PALETTE = DEFAULT_PALETTE, mode: ColorMode = 'light'): string {
  const semantic = mode === 'dark' ? DARK_SEMANTIC : LIGHT_SEMANTIC;
  let css = ':root {\n';

  // Paleta principal
  for (const [key, token] of Object.entries(palette)) {
    css += `  ${token.cssVar}: ${token.hex};\n`;
  }

  // Semánticos
  for (const [key, value] of Object.entries(semantic)) {
    const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
    css += `  ${cssVar}: ${value};\n`;
  }

  css += '}';
  return css;
}

/**
 * Obtiene token por nombre legible (para UI)
 */
export function getTokenByName(name: string, palette: typeof DEFAULT_PALETTE = DEFAULT_PALETTE): typeof DEFAULT_PALETTE[keyof typeof DEFAULT_PALETTE] | null {
  for (const token of Object.values(palette)) {
    if (token.name.toLowerCase() === name.toLowerCase()) {
      return token;
    }
  }
  return null;
}

/**
 * Filtra tokens por categoría de uso
 */
export function filterTokensByUsage(usage: string, palette: typeof DEFAULT_PALETTE = DEFAULT_PALETTE): typeof DEFAULT_PALETTE[keyof typeof DEFAULT_PALETTE][] {
  return Object.values(palette).filter(t => t.usage.toLowerCase().includes(usage.toLowerCase()));
}