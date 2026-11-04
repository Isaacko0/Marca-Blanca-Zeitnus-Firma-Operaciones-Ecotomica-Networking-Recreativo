// Brand Typography — Lógica Pura
// Funciones puras para tipografía dual + roles + acentos

import type { FontScale, TypographyRoles, TypographyRole, FontSpec, FontFamily, BrandTypographyState } from '@core/state/brand-typography';
import { FONT_SPECS, TYPOGRAPHY_ROLES } from '@core/state/brand-typography';

/**
 * Obtiene un rol tipográfico por clave
 */
export function getFontRole(state: BrandTypographyState, role: keyof TypographyRoles): TypographyRole {
  return state.roles[role];
}

/**
 * Obtiene especificación de familia por categoría
 */
export function getFontSpec(state: BrandTypographyState, family: FontFamily): FontSpec {
  return state.scale[family];
}

/**
 * Renderiza un rol tipográfico (para componente React)
 */
export function renderFontRole(
  state: BrandTypographyState,
  role: keyof TypographyRoles,
  text: string
): React.ReactNode {
  const roleSpec = state.roles[role];
  const fontSpec = state.scale[roleSpec.family];

  return (
    <span
      style={{
        fontFamily: `"${fontSpec.family}", ${fontSpec.fallback}`,
        fontSize: roleSpec.size,
        lineHeight: roleSpec.lineHeight,
        letterSpacing: roleSpec.letterSpacing,
        fontWeight: roleSpec.weight,
        fontStyle: roleSpec.family === 'serif' ? 'italic' : 'normal',
      } as React.CSSProperties}
    >
      {text}
    </span>
  );
}

/**
 * Obtiene CSS font-family string para un rol
 */
export function getFontFamilyString(role: TypographyRole, scale: FontScale): string {
  const spec = scale[role.family];
  return `"${spec.family}", ${spec.fallback}`;
}

/**
 * Genera CSS variables para tipografía completa
 */
export function generateTypographyCSS(scale: FontScale = FONT_SPECS, roles: TypographyRoles = TYPOGRAPHY_ROLES): string {
  let css = ':root {\n';

  // Font families
  for (const [key, spec] of Object.entries(scale)) {
    css += `  ${spec.cssVar}: "${spec.family}", ${spec.fallback};\n`;
  }

  // Roles
  for (const [key, role] of Object.entries(roles)) {
    const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
    const spec = scale[role.family];
    css += `  ${cssVar}-family: "${spec.family}", ${spec.fallback};\n`;
    css += `  ${cssVar}-size: ${role.size};\n`;
    css += `  ${cssVar}-line: ${role.lineHeight};\n`;
    css += `  ${cssVar}-tracking: ${role.letterSpacing};\n`;
    css += `  ${cssVar}-weight: ${role.weight};\n`;
  }

  css += '}';
  return css;
}

/**
 * Obtiene estilo CSS completo para un rol
 */
export function getRoleStyle(role: TypographyRole, scale: FontScale = FONT_SPECS): React.CSSProperties {
  const spec = scale[role.family];
  return {
    fontFamily: `"${spec.family}", ${spec.fallback}`,
    fontSize: role.size,
    lineHeight: role.lineHeight,
    letterSpacing: role.letterSpacing,
    fontWeight: role.weight,
    fontStyle: role.family === 'serif' ? 'italic' : 'normal',
  };
}

/**
 * Valida que una familia existe en la escala
 */
export function validateFontFamily(family: string, scale: FontScale = FONT_SPECS): boolean {
  return family in scale;
}

/**
 * Obtiene todos los roles que usan una familia específica
 */
export function getRolesByFamily(family: FontFamily, roles: TypographyRoles = TYPOGRAPHY_ROLES): TypographyRole[] {
  return Object.values(roles).filter(r => r.family === family);
}

/**
 * Obtiene el peso por defecto de una familia
 */
export function getDefaultWeight(family: FontFamily, scale: FontScale = FONT_SPECS): number {
  return scale[family].weightDefault;
}

/**
 * Genera estilos CSS para una etiqueta de versalitas (Plus Jakarta Sans)
 */
export function getSmallCapsStyle(text: string, scale: FontScale = FONT_SPECS): React.ReactNode {
  const spec = scale.label;
  return (
    <span
      style={{
        fontFamily: `"${spec.family}", ${spec.fallback}`,
        fontSize: '10px',
        lineHeight: '1.2',
        letterSpacing: '0.28em',
        fontWeight: 500,
        textTransform: 'uppercase',
      } as React.CSSProperties}
    >
      {text}
    </span>
  );
}

/**
 * Genera CSS para carga de fuentes (preload/preconnect)
 */
export function generateFontPreloads(): string {
  const fonts = [
    { family: 'Jost', weights: '400,500,600,700,800', display: 'swap' },
    { family: 'Manrope', weights: '400,500,600', display: 'swap' },
    { family: 'Newsreader', weights: '400', display: 'swap', style: 'italic' },
    { family: 'Plus Jakarta Sans', weights: '400,500,600', display: 'swap' },
  ];

  return fonts.map(f =>
    `<link rel="preload" as="font" type="font/woff2" crossorigin href="https://fonts.gstatic.com/s/${f.family.replace(/\s+/g, '+')}/v${f.weights.split(',')[0]}/${f.family.replace(/\s+/g, '-')}-${f.weights}.woff2" />`
  ).join('\n');
}

/**
 * Valida que un rol existe
 */
export function validateRole(role: string, roles: TypographyRoles = TYPOGRAPHY_ROLES): boolean {
  return role in roles;
}

/**
 * Obtiene roles ordenados por jerarquía visual (mayor a menor)
 */
export function getRolesByHierarchy(roles: TypographyRoles = TYPOGRAPHY_ROLES): Array<{ key: keyof TypographyRoles; role: TypographyRole }> {
  const hierarchy: (keyof TypographyRoles)[] = [
    'display', 'cifra', 'titular', 'manifiesto', 'cita',
    'subtitulo', 'cuerpo', 'enfasis', 'etiqueta'
  ];
  return hierarchy.map(key => ({ key, role: roles[key] }));
}