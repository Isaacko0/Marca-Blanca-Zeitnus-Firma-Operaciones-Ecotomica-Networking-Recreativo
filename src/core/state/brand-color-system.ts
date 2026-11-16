// Brand Color System — Types & State
// Sistema de color trifásico (Vacío/Aliento/Chispa) + Semáforo + Secundarios + Crepúsculo
// Isomorfo a Soul.MBA specs exactas

export type ColorMode = 'light' | 'dark';

export interface ColorToken {
  name: string;
  cssVar: string;
  hex: string;
  rgb: string;
  usage: string;
}

export interface ColorPalette {
  // Trío cerrado
  vacio: ColorToken;
  aliento: ColorToken;
  chispa: ColorToken;
  chispaHover: ColorToken;
  chispaDeep: ColorToken;
  onChispa: ColorToken;

  // Semáforo — 5 estados de avance
  sprout: ColorToken;      // Acelera
  lime: ColorToken;        // En curso
  amber: ColorToken;       // Se estanca
  ember: ColorToken;       // Se atrasa
  red: ColorToken;         // Detenido

  // Secundarios reservados
  deepBlue: ColorToken;    // Azul profundo
  auraSprout: ColorToken;  // Aura verde
  auraCyan: ColorToken;    // Aura cian
  alert: ColorToken;       // Alerta
  slate2: ColorToken;      // Secundario luz
  gray2: ColorToken;       // Secundario sombra

  // Campo crepúsculo (welcome/retiro/cierre, <1/20)
  dusk700: ColorToken;     // Fondo
  dusk400: ColorToken;     // Campo
  dusk100: ColorToken;     // Terciario
  duskPeach: ColorToken;   // Acento durazno
  duskInk: ColorToken;     // Tinta
}

export interface SemanticColors {
  // Fondos
  bgPage: string;
  bgField: string;
  bgFieldAlt: string;
  bgChrome: string;
  bgCard: string;

  // Texto
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textAccent: string;
  textOnChispa: string;

  // Líneas
  hairline: string;
  hairlineFaint: string;
  borderDefault: string;
  borderFocus: string;

  // Sombras
  shadowWeak: string;
  shadowCard: string;
  shadowHover: string;
  shadowSolid: string;

  // Estados
  hoverWash: string;
  focusRing: string;
  selectionBg: string;
  selectionColor: string;

  // Modo anfibio
  priceParity: number;
  nodeMode: 'postmonetario' | 'conectado';
}

export interface BrandColorState {
  mode: ColorMode;
  palette: ColorPalette;
  semantic: SemanticColors;
  // Acciones
  setMode: (mode: ColorMode) => void;
  toggleMode: () => void;
  getToken: (key: keyof ColorPalette) => ColorToken;
  renderColor: (tokenKey: keyof ColorPalette, amount?: number) => string; // Modo anfibio
  setPriceParity: (parity: number) => void;
  setNodeMode: (mode: 'postmonetario' | 'conectado') => void;
}

export const DEFAULT_PALETTE: ColorPalette = {
  // Trío cerrado
  vacio: { name: 'Vacío', cssVar: '--ink-900', hex: '#101010', rgb: '16, 16, 16', usage: 'Texto principal, fondo oscuro' },
  aliento: { name: 'Aliento', cssVar: '--breath', hex: '#f7faff', rgb: '247, 250, 255', usage: 'Fondo claro, papel' },
  chispa: { name: 'Chispa', cssVar: '--lime', hex: '#afeb00', rgb: '175, 235, 0', usage: 'Acento principal, CTAs' },
  chispaHover: { name: 'Chispa hover', cssVar: '--lime-bright', hex: '#cdf22b', rgb: '205, 242, 43', usage: 'Hover sobre Chispa' },
  chispaDeep: { name: 'Chispa (texto en luz)', cssVar: '--lime-deep', hex: '#4e6b00', rgb: '78, 107, 0', usage: 'Texto sobre fondo Chispa' },
  onChispa: { name: 'Texto sobre lime', cssVar: '--on-lime', hex: '#12200a', rgb: '18, 32, 10', usage: 'Texto sobre fondo Chispa' },

  // Semáforo — 5 estados
  sprout: { name: 'Acelera', cssVar: '--sprout', hex: '#2fb56a', rgb: '47, 181, 106', usage: 'Estado: Acelera / Verde' },
  lime: { name: 'En curso', cssVar: '--lime', hex: '#afeb00', rgb: '175, 235, 0', usage: 'Estado: En curso / Amarillo' },
  amber: { name: 'Se estanca', cssVar: '--amber', hex: '#ffc400', rgb: '255, 196, 0', usage: 'Estado: Se estanca / Ámbar' },
  ember: { name: 'Se atrasa', cssVar: '--ember', hex: '#ff7a1a', rgb: '255, 122, 26', usage: 'Estado: Se atrasa / Naranja' },
  red: { name: 'Detenido', cssVar: '--red', hex: '#e01438', rgb: '224, 20, 56', usage: 'Estado: Detenido / Rojo' },

  // Secundarios reservados
  deepBlue: { name: 'Azul profundo', cssVar: '--deep-blue', hex: '#030534', rgb: '3, 5, 52', usage: 'Azul profundo reservado' },
  auraSprout: { name: 'Aura verde', cssVar: '--aura-sprout', hex: '#7ef2a8', rgb: '126, 242, 168', usage: 'Aura verde / éxito' },
  auraCyan: { name: 'Aura cian', cssVar: '--aura-cyan', hex: '#35d6f5', rgb: '53, 214, 245', usage: 'Aura cian / info' },
  alert: { name: 'Alerta', cssVar: '--alert', hex: '#ff5c7a', rgb: '255, 92, 122', usage: 'Alerta / error' },
  gray2: { name: 'Secundario sombra', cssVar: '--gray-2', hex: '#9aa8ce', rgb: '154, 168, 206', usage: 'Texto secundario sombra' },
  slate2: { name: 'Secundario luz', cssVar: '--slate-2', hex: '#4a5470', rgb: '74, 84, 112', usage: 'Texto secundario luz' },

  // Campo crepúsculo
  dusk700: { name: 'Fondo', cssVar: '--dusk-700', hex: '#3b2f7a', rgb: '59, 47, 122', usage: 'Fondo crepúsculo' },
  dusk400: { name: 'Campo', cssVar: '--dusk-400', hex: '#7d6bcf', rgb: '125, 107, 207', usage: 'Campo crepúsculo' },
  dusk100: { name: 'Terciario', cssVar: '--dusk-100', hex: '#cbb9f0', rgb: '203, 185, 240', usage: 'Terciario crepúsculo' },
  duskPeach: { name: 'Acento durazno', cssVar: '--dusk-peach', hex: '#f7c9b4', rgb: '247, 201, 180', usage: 'Acento durazno' },
  duskInk: { name: 'Tinta', cssVar: '--dusk-ink', hex: '#241c47', rgb: '36, 28, 71', usage: 'Tinta crepúsculo' },
};

export const LIGHT_SEMANTIC: SemanticColors = {
  bgPage: '#f4f7ff',
  bgField: '#ffffff',
  bgFieldAlt: '#f8faff',
  bgChrome: '#ffffff',
  bgCard: '#ffffff',
  textPrimary: '#13228b',
  textSecondary: '#3e4a7a',
  textTertiary: '#5e6790',
  textAccent: '#4e6b00',
  textOnChispa: '#12200a',
  hairline: 'rgba(19, 34, 139, 0.20)',
  hairlineFaint: 'rgba(19, 34, 139, 0.08)',
  borderDefault: 'rgba(19, 34, 139, 0.22)',
  borderFocus: 'rgba(11, 88, 182, 0.5)',
  shadowWeak: 'rgba(3, 5, 52, 0.10)',
  shadowCard: '0 20px 40px -24px rgba(3, 5, 52, 0.18), 0 4px 10px -4px rgba(3, 5, 52, 0.08)',
  shadowHover: '0 2px 8px rgba(19, 34, 139, 0.06), 0 18px 40px rgba(19, 34, 139, 0.10)',
  shadowSolid: '0 8px 28px rgba(11, 22, 96, 0.28)',
  hoverWash: 'rgba(19, 34, 139, 0.04)',
  focusRing: 'rgba(11, 88, 182, 0.5)',
  selectionBg: 'rgba(175, 235, 0, 0.3)',
  selectionColor: '#101010',
  priceParity: 0.02,
  nodeMode: 'postmonetario',
};

export const DARK_SEMANTIC: SemanticColors = {
  bgPage: '#070d3a',
  bgField: '#0f1a63',
  bgFieldAlt: '#121e6c',
  bgChrome: '#0f1a63',
  bgCard: '#0f1a63',
  textPrimary: '#f4f7ff',
  textSecondary: '#c9d1f2',
  textTertiary: '#94a0d6',
  textAccent: '#afeb00',
  textOnChispa: '#12200a',
  hairline: 'rgba(244, 247, 255, 0.22)',
  hairlineFaint: 'rgba(244, 247, 255, 0.10)',
  borderDefault: 'rgba(244, 247, 255, 0.22)',
  borderFocus: 'rgba(143, 200, 255, 0.5)',
  shadowWeak: 'rgba(0, 0, 0, 0.2)',
  shadowCard: '0 24px 48px -20px rgba(0, 0, 0, 0.65), 0 6px 14px -6px rgba(0, 0, 0, 0.5)',
  shadowHover: '0 2px 8px rgba(0, 0, 0, 0.25), 0 18px 40px rgba(0, 0, 0, 0.3)',
  shadowSolid: '0 8px 28px rgba(0, 0, 0, 0.5)',
  hoverWash: 'rgba(244, 247, 255, 0.04)',
  focusRing: 'rgba(143, 200, 255, 0.5)',
  selectionBg: 'rgba(175, 235, 0, 0.3)',
  selectionColor: '#070d3a',
  priceParity: 0.02,
  nodeMode: 'postmonetario',
};

export function makeBrandColorState(): BrandColorState {
  return {
    mode: 'light',
    palette: DEFAULT_PALETTE,
    semantic: LIGHT_SEMANTIC,
  };
}