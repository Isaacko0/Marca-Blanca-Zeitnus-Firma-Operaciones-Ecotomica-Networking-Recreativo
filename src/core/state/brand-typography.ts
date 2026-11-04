// Brand Typography — Types & State
// Tipografía dual (Jost + Manrope) + 8 roles + 4 fuentes (Newsreader, Plus Jakarta Sans como acentos)
// Isomorfo a Soul.MBA specs exactas

export type FontFamily = 'display' | 'body' | 'serif' | 'label' | 'mono';

export interface FontSpec {
  family: string;
  cssVar: string;
  weights: number[];
  weightDefault: number;
  fallback: string;
  category: FontFamily;
}

export interface TypographyRole {
  name: string;
  cssVar: string;
  family: FontFamily;
  size: string;
  lineHeight: string;
  letterSpacing: string;
  weight: number;
  fallback?: string;
  usage: string;
}

export interface FontScale {
  // Jost — El grito (Display, Cifra, Titular, Botones, Nav)
  display: FontSpec;
  cifra: FontSpec;
  titular: FontSpec;
  button: FontSpec;
  nav: FontSpec;

  // Manrope — El susurro (Cuerpo, Listas, Formularios, Correo)
  body: FontSpec;
  list: FontSpec;
  form: FontSpec;
  email: FontSpec;

  // Newsreader — El acento (Manifiesto, Citas largas)
  manifesto: FontSpec;
  quote: FontSpec;

  // Plus Jakarta Sans — La señal (Etiquetas, Citas cortas)
  label: FontSpec;
  caption: FontSpec;
}

export interface TypographyRoles {
  // 8 roles tipográficos exactos (Soul.MBA)
  display: TypographyRole;       // 96px / 1.02 — "Primero el alma"
  cifra: TypographyRole;         // 72px / 0.86 — "1 111"
  titular: TypographyRole;       // 44px / 1.06 — "La oferta se defiende sola"
  manifiesto: TypographyRole;    // 40px / 1.08 — "Nadie construye desde afuera" (Newsreader)
  cita: TypographyRole;          // 24px / 1.14 — "El orden aguanta sin ti" (Plus Jakarta Sans)
  subtitulo: TypographyRole;     // 19px — "Cómo se construye la estructura"
  cuerpo: TypographyRole;        // 16px / 1.7 — "Manrope. La medida se queda entre 62 y 72 caracteres."
  enfasis: TypographyRole;       // 16px / 600 — "Manrope 600, la única forma de enfatizar"
  etiqueta: TypographyRole;      // 10px / +.28 — "COHORTE 04 · ABRIL" (Plus Jakarta Sans)
}

export interface BrandTypographyState {
  scale: TypographyScale;
  roles: TypographyRoles;
  currentMode: 'light' | 'dark';
  // Acciones
  getFont: (role: keyof TypographyRoles) => TypographyRole;
  getFontSpec: (family: FontFamily) => FontSpec;
  renderFont: (role: keyof TypographyRoles, text: string) => React.ReactNode;
  setMode: (mode: 'light' | 'dark') => void;
}

export const FONT_SPECS: TypographyScale = {
  // Jost — El grito
  display: {
    family: 'Jost',
    cssVar: '--font-display',
    weights: [400, 500, 600, 700, 800],
    weightDefault: 800,
    fallback: 'system-ui, sans-serif',
    category: 'display',
  },
  cifra: {
    family: 'Jost',
    cssVar: '--font-display',
    weights: [400, 500, 600, 700, 800],
    weightDefault: 500,
    fallback: 'system-ui, sans-serif',
    category: 'display',
  },
  titular: {
    family: 'Jost',
    cssVar: '--font-display',
    weights: [400, 500, 600, 700, 800],
    weightDefault: 500,
    fallback: 'system-ui, sans-serif',
    category: 'display',
  },
  button: {
    family: 'Jost',
    cssVar: '--font-display',
    weights: [400, 500, 600, 700, 800],
    weightDefault: 600,
    fallback: 'system-ui, sans-serif',
    category: 'display',
  },
  nav: {
    family: 'Jost',
    cssVar: '--font-display',
    weights: [400, 500, 600, 700, 800],
    weightDefault: 500,
    fallback: 'system-ui, sans-serif',
    category: 'display',
  },

  // Manrope — El susurro
  body: {
    family: 'Manrope',
    cssVar: '--font-body',
    weights: [400, 500, 600],
    weightDefault: 400,
    fallback: 'system-ui, sans-serif',
    category: 'body',
  },
  list: {
    family: 'Manrope',
    cssVar: '--font-body',
    weights: [400, 500, 600],
    weightDefault: 400,
    fallback: 'system-ui, sans-serif',
    category: 'body',
  },
  form: {
    family: 'Manrope',
    cssVar: '--font-body',
    weights: [400, 500, 600],
    weightDefault: 400,
    fallback: 'system-ui, sans-serif',
    category: 'body',
  },
  email: {
    family: 'Manrope',
    cssVar: '--font-body',
    weights: [400, 500, 600],
    weightDefault: 400,
    fallback: 'system-ui, sans-serif',
    category: 'body',
  },

  // Newsreader — El acento
  manifesto: {
    family: 'Newsreader',
    cssVar: '--font-serif',
    weights: [400],
    weightDefault: 400,
    fallback: 'Georgia, serif',
    category: 'serif',
  },
  quote: {
    family: 'Newsreader',
    cssVar: '--font-serif',
    weights: [400],
    weightDefault: 400,
    fallback: 'Georgia, serif',
    category: 'serif',
  },

  // Plus Jakarta Sans — La señal
  label: {
    family: 'Plus Jakarta Sans',
    cssVar: '--font-label',
    weights: [400, 500, 600],
    weightDefault: 500,
    fallback: 'system-ui, sans-serif',
    category: 'label',
  },
  caption: {
    family: 'Plus Jakarta Sans',
    cssVar: '--font-label',
    weights: [400, 500, 600],
    weightDefault: 500,
    fallback: 'system-ui, sans-serif',
    category: 'label',
  },
};

export const TYPOGRAPHY_ROLES: TypographyRoles = {
  display: {
    name: 'Display',
    cssVar: '--font-display',
    family: 'display',
    size: 'clamp(28px, 3.4vw, 42px)',
    lineHeight: '1.02',
    letterSpacing: '-0.035em',
    weight: 800,
    usage: 'North Star, Hero headlines',
  },
  cifra: {
    name: 'Cifra',
    cssVar: '--font-cifra',
    family: 'cifra',
    size: 'clamp(24px, 2.8vw, 36px)',
    lineHeight: '0.86',
    letterSpacing: '-0.04em',
    weight: 500,
    usage: 'Big numbers, metrics, KPIs',
  },
  titular: {
    name: 'Titular',
    cssVar: '--font-titular',
    family: 'titular',
    size: 'clamp(22px, 2.4vw, 32px)',
    lineHeight: '1.06',
    letterSpacing: '-0.03em',
    weight: 500,
    usage: 'Section headlines, offer names',
  },
  manifiesto: {
    name: 'Manifiesto',
    cssVar: '--font-manifiesto',
    family: 'manifiesto',
    size: 'clamp(20px, 2.2vw, 28px)',
    lineHeight: '1.08',
    letterSpacing: '-0.02em',
    weight: 400,
    usage: 'Manifestos, long-form copy (Newsreader italic)',
  },
  cita: {
    name: 'Cita',
    cssVar: '--font-cita',
    family: 'cita',
    size: '24px',
    lineHeight: '1.14',
    letterSpacing: '-0.03em',
    weight: 400,
    usage: 'Pull quotes, testimonials (Plus Jakarta Sans)',
  },
  subtitulo: {
    name: 'Subtítulo',
    cssVar: '--font-subtitulo',
    family: 'label',
    size: '19px',
    lineHeight: '1.2',
    letterSpacing: '0.01em',
    weight: 600,
    usage: 'Section subtitles, card headers',
  },
  cuerpo: {
    name: 'Cuerpo',
    cssVar: '--font-cuerpo',
    family: 'body',
    size: '16px',
    lineHeight: '1.7',
    letterSpacing: '0',
    weight: 400,
    usage: 'Body copy, paragraphs, lists (Manrope 400)',
  },
  enfasis: {
    name: 'Énfasis',
    cssVar: '--font-enfasis',
    family: 'body',
    size: '16px',
    lineHeight: '1.7',
    letterSpacing: '0',
    weight: 600,
    usage: 'Bold inline, key phrases (Manrope 600 only)',
  },
  etiqueta: {
    name: 'Etiqueta',
    cssVar: '--font-etiqueta',
    family: 'label',
    size: '10px',
    lineHeight: '1.2',
    letterSpacing: '0.28em',
    weight: 500,
    usage: 'Tags, badges, cohort labels (Plus Jakarta Sans)',
  },
};

export interface BrandTypographyState {
  scale: TypographyScale;
  roles: TypographyRoles;
  currentMode: 'light' | 'dark';
  getFont: (role: keyof TypographyRoles) => TypographyRole;
  getFontSpec: (family: FontFamily) => FontSpec;
  renderFont: (role: keyof TypographyRoles, text: string) => React.ReactNode;
  setMode: (mode: 'light' | 'dark') => void;
}

export function makeBrandTypographyState(): BrandTypographyState {
  return {
    scale: FONT_SPECS,
    roles: TYPOGRAPHY_ROLES,
    currentMode: 'light',
    getFont: (role) => TYPOGRAPHY_ROLES[role],
    getFontSpec: (family) => FONT_SPECS[family],
    renderFont: (role, text) => null as any, // Se implementa en componente
    setMode: (mode) => {}, // Se implementa en store
  };
}