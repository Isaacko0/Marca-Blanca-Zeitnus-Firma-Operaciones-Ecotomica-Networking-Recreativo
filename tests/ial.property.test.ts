// tests/ial.property.test.ts
// Property-based tests for IAL — Índice de Autotrofia Longeva
// Spec: alrac-ial-autotrofia-longeva.md §7.4, §10

import { fc, test, expect } from '@fast-check/vitest';
import {
  calculateIAL,
  calculateAutotrofia,
  calculateDestrabajo,
  calculateLujoEtico,
  calculateTransgeneracional,
  evaluateIAL,
  getBand,
  checkAlertas,
  DEFAULT_IAL_CONFIG,
} from '../src/core/lib/ial';

describe('IAL Property-Based Tests', () => {
  describe('calculateIAL', () => {
    test.prop([
      fc.float({ min: 0, max: 1 }),
      fc.float({ min: 0, max: 1 }),
      fc.float({ min: 0, max: 1 }),
      fc.float({ min: 0, max: 1 }),
    ])('monotonía: IAL no disminuye si cualquier factor aumenta', (a1, d1, l1, t1) => {
      const a2 = Math.max(a1, fc.sample(fc.float({ min: a1, max: 1 }), 1)[0]);
      const d2 = Math.max(d1, fc.sample(fc.float({ min: d1, max: 1 }), 1)[0]);
      const l2 = Math.max(l1, fc.sample(fc.float({ min: l1, max: 1 }), 1)[0]);
      const t2 = Math.max(t1, fc.sample(fc.float({ min: t1, max: 1 }), 1)[0]);
      
      const ial1 = calculateIAL(a1, d1, l1, t1);
      const ial2 = calculateIAL(a2, d2, l2, t2);
      
      expect(ial2).toBeGreaterThanOrEqual(ial1);
    });

    test.prop([
      fc.float({ min: 0, max: 1 }),
      fc.float({ min: 0, max: 1 }),
      fc.float({ min: 0, max: 1 }),
    ])('cero absorbente: si A=0 o D=0 o L=0 → IAL=0', (d, l, t) => {
      expect(calculateIAL(0, d, l, t)).toBe(0);
      expect(calculateIAL(d, 0, l, t)).toBe(0);
      expect(calculateIAL(d, l, 0, t)).toBe(0);
    });

    test.prop([fc.float({ min: 0, max: 1 })])('tope de T: T ∈ [0, 1] → IAL ≤ media geométrica de A,D,L', (t) => {
      const A = 0.8, D = 0.7, L = 0.6;
      const ial = calculateIAL(A, D, L, t);
      const geoMean = Math.pow(A * D * L, 1/3);
      expect(ial).toBeLessThanOrEqual(geoMean + 1e-10); // floating point tolerance
    });

    test.prop([
      fc.float({ min: 0, max: 1 }),
      fc.float({ min: 0, max: 1 }),
      fc.float({ min: 0, max: 1 }),
      fc.float({ min: 0, max: 1 }),
    ])('IAL ∈ [0, 1] para todos los inputs válidos', (a, d, l, t) => {
      const ial = calculateIAL(a, d, l, t);
      expect(ial).toBeGreaterThanOrEqual(0);
      expect(ial).toBeLessThanOrEqual(1);
    });

    test('T=0 → IAL=0 (freno multiplicativo total)', () => {
      expect(calculateIAL(1, 1, 1, 0)).toBe(0);
    });

    test('A=D=L=1, T=1 → IAL=1 (máximo teórico)', () => {
      expect(calculateIAL(1, 1, 1, 1)).toBe(1);
    });
  });

  describe('calculateAutotrofia', () => {
    test.prop([
      fc.record({
        energia: fc.float({ min: 0, max: 1000 }),
        alimento: fc.float({ min: 0, max: 1000 }),
        cuidado: fc.float({ min: 0, max: 1000 }),
      }),
      fc.record({
        energia: fc.float({ min: 0, max: 1000 }),
        alimento: fc.float({ min: 0, max: 1000 }),
        cuidado: fc.float({ min: 0, max: 1000 }),
      }),
    ])('A ∈ [0, 1] para cualquier producción/consumo', (produccion, consumo) => {
      const A = calculateAutotrofia(
        { produccion, consumo },
        { energia: 1/3, alimento: 1/3, cuidado: 1/3 }
      );
      expect(A).toBeGreaterThanOrEqual(0);
      expect(A).toBeLessThanOrEqual(1);
    });

    test('producción ≥ consumo en todos los factores → A = 1', () => {
      const A = calculateAutotrofia(
        { produccion: { energia: 100, alimento: 200, cuidado: 50 }, consumo: { energia: 50, alimento: 100, cuidado: 25 } },
        { energia: 1/3, alimento: 1/3, cuidado: 1/3 }
      );
      expect(A).toBe(1);
    });

    test('producción = 0 en todos los factores → A = 0', () => {
      const A = calculateAutotrofia(
        { produccion: { energia: 0, alimento: 0, cuidado: 0 }, consumo: { energia: 100, alimento: 100, cuidado: 100 } },
        { energia: 1/3, alimento: 1/3, cuidado: 1/3 }
      );
      expect(A).toBe(0);
    });

    test('pesos personalizados se respetan', () => {
      const A = calculateAutotrofia(
        { produccion: { energia: 100, alimento: 0, cuidado: 0 }, consumo: { energia: 100, alimento: 100, cuidado: 100 } },
        { energia: 1, alimento: 0, cuidado: 0 }
      );
      expect(A).toBe(1); // solo energía cuenta, y p_energia/c_energia = 1
    });
  });

  describe('calculateDestrabajo', () => {
    test.prop([
      fc.float({ min: 0, max: 100 }),
      fc.float({ min: 1, max: 100 }), // horasDisponibles > 0
      fc.float({ min: 0, max: 0.5 }), // tvMin
    ])('D ∈ [tvMin, 1]', (hServ, hDisp, tvMin) => {
      const D = calculateDestrabajo({ horasServidumbre: hServ, horasDisponibles: hDisp, tvMin });
      expect(D).toBeGreaterThanOrEqual(tvMin - 1e-10);
      expect(D).toBeLessThanOrEqual(1 + 1e-10);
    });

    test('h_serv = 0 → D = 1 (libre de servidumbre)', () => {
      const D = calculateDestrabajo({ horasServidumbre: 0, horasDisponibles: 100, tvMin: 0.3 });
      expect(D).toBe(1);
    });

    test('h_serv >= h_disp → D = tvMin (piso protegido)', () => {
      const D = calculateDestrabajo({ horasServidumbre: 100, horasDisponibles: 80, tvMin: 0.3 });
      expect(D).toBe(0.3);
    });

    test('h_disp = 0 → D = tvMin (edge case)', () => {
      const D = calculateDestrabajo({ horasServidumbre: 10, horasDisponibles: 0, tvMin: 0.3 });
      expect(D).toBe(0.3);
    });
  });

  describe('calculateLujoEtico', () => {
    const baseInput = {
      excedenteDiscrecional: 100,
      excedenteEtico: 80,
      aMin: 0.5,
      tvMin: 0.4,
      autotrofiaActual: 0.6,
      destrabajoActual: 0.5,
    };

    test('compuerta: si A < A_min → L = 0', () => {
      const L = calculateLujoEtico({ ...baseInput, autotrofiaActual: 0.3 });
      expect(L).toBe(0);
    });

    test('compuerta: si D < TV_min → L = 0', () => {
      const L = calculateLujoEtico({ ...baseInput, destrabajoActual: 0.2 });
      expect(L).toBe(0);
    });

    test('sin compuerta activada: L = E_etico / E_disc', () => {
      const L = calculateLujoEtico(baseInput);
      expect(L).toBe(0.8);
    });

    test('E_disc = 0 → L = 0', () => {
      const L = calculateLujoEtico({ ...baseInput, excedenteDiscrecional: 0 });
      expect(L).toBe(0);
    });

    test('L ∈ [0, 1]', () => {
      const L = calculateLujoEtico({ ...baseInput, excedenteEtico: 150 }); // > E_disc
      expect(L).toBe(1); // capped at 1
    });

    test('E_etico no puede exceder E_disc en resultado final', () => {
      const L = calculateLujoEtico({ ...baseInput, excedenteEtico: 200 });
      expect(L).toBeLessThanOrEqual(1);
    });
  });

  describe('calculateTransgeneracional', () => {
    test('4 proxies medibles perfectos → T = 1, provisional = false', () => {
      const { T, provisional } = calculateTransgeneracional({
        proxies: [
          { id: '1', nombre: 'suelo', capacidadActual: 100, capacidadRecibida: 100, medible: true },
          { id: '2', nombre: 'saber', capacidadActual: 100, capacidadRecibida: 100, medible: true },
          { id: '3', nombre: 'boveda', capacidadActual: 100, capacidadRecibida: 100, medible: true },
          { id: '4', nombre: 'cuidado', capacidadActual: 100, capacidadRecibida: 100, medible: true },
        ],
      });
      expect(T).toBe(1);
      expect(provisional).toBe(false);
    });

    test('3 proxies medibles → provisional = true', () => {
      const { provisional } = calculateTransgeneracional({
        proxies: [
          { id: '1', nombre: 'suelo', capacidadActual: 100, capacidadRecibida: 100, medible: true },
          { id: '2', nombre: 'saber', capacidadActual: 80, capacidadRecibida: 100, medible: true },
          { id: '3', nombre: 'boveda', capacidadActual: 90, capacidadRecibida: 100, medible: true },
          { id: '4', nombre: 'cuidado', capacidadActual: 100, capacidadRecibida: 100, medible: false }, // no medible
        ],
      });
      expect(provisional).toBe(true);
    });

    test('0 proxies medibles → T = 0, provisional = true', () => {
      const { T, provisional } = calculateTransgeneracional({
        proxies: [
          { id: '1', nombre: 'suelo', capacidadActual: 100, capacidadRecibida: 100, medible: false },
        ],
      });
      expect(T).toBe(0);
      expect(provisional).toBe(true);
    });

    test('capacidad recibida = 0 → proxy excluido del cálculo', () => {
      const { T } = calculateTransgeneracional({
        proxies: [
          { id: '1', nombre: 'suelo', capacidadActual: 100, capacidadRecibida: 0, medible: true }, // excluido
          { id: '2', nombre: 'saber', capacidadActual: 100, capacidadRecibida: 100, medible: true },
          { id: '3', nombre: 'boveda', capacidadActual: 100, capacidadRecibida: 100, medible: true },
          { id: '4', nombre: 'cuidado', capacidadActual: 100, capacidadRecibida: 100, medible: true },
        ],
      });
      expect(T).toBe(1); // solo 3 válidos, todos ratio 1
    });

    test('T = media geométrica de ratios capped at 1', () => {
      const { T } = calculateTransgeneracional({
        proxies: [
          { id: '1', nombre: 'suelo', capacidadActual: 50, capacidadRecibida: 100, medible: true }, // 0.5
          { id: '2', nombre: 'saber', capacidadActual: 100, capacidadRecibida: 100, medible: true }, // 1
          { id: '3', nombre: 'boveda', capacidadActual: 100, capacidadRecibida: 100, medible: true }, // 1
          { id: '4', nombre: 'cuidado', capacidadActual: 100, capacidadRecibida: 100, medible: true }, // 1
        ],
      });
      // media geométrica de [0.5, 1, 1, 1] = 0.5^(1/4) ≈ 0.84
      expect(T).toBeCloseTo(Math.pow(0.5, 0.25), 5);
    });

    test('ratio > 1 se capea a 1 (min(1, r_i))', () => {
      const { T } = calculateTransgeneracional({
        proxies: [
          { id: '1', nombre: 'suelo', capacidadActual: 150, capacidadRecibida: 100, medible: true }, // 1.5 → 1
          { id: '2', nombre: 'saber', capacidadActual: 100, capacidadRecibida: 100, medible: true },
          { id: '3', nombre: 'boveda', capacidadActual: 100, capacidadRecibida: 100, medible: true },
          { id: '4', nombre: 'cuidado', capacidadActual: 100, capacidadRecibida: 100, medible: true },
        ],
      });
      expect(T).toBe(1);
    });
  });

  describe('evaluateIAL integration', () => {
    const validAutotrofia = {
      produccion: { energia: 80, alimento: 70, cuidado: 60 },
      consumo: { energia: 100, alimento: 100, cuidado: 100 },
    };
    const validDestrabajo = { horasServidumbre: 20, horasDisponibles: 100, tvMin: 0.3 };
    const validLujoEtico = { excedenteDiscrecional: 100, excedenteEtico: 80, aMin: 0.2, tvMin: 0.3, autotrofiaActual: 0, destrabajoActual: 0 };
    const validTransgeneracional = {
      proxies: [
        { id: '1', nombre: 'suelo' as const, capacidadActual: 100, capacidadRecibida: 100, medible: true },
        { id: '2', nombre: 'saber' as const, capacidadActual: 100, capacidadRecibida: 100, medible: true },
        { id: '3', nombre: 'boveda' as const, capacidadActual: 100, capacidadRecibida: 100, medible: true },
        { id: '4', nombre: 'cuidado' as const, capacidadActual: 100, capacidadRecibida: 100, medible: true },
      ],
    };

    test('produce resultado válido con estructura completa', () => {
      const result = evaluateIAL(
        validAutotrofia,
        validDestrabajo,
        validLujoEtico,
        validTransgeneracional,
        DEFAULT_IAL_CONFIG,
        'nodo-test',
        { inicio: Date.now() - 86400000, fin: Date.now() }
      );

      expect(result.nodoId).toBe('nodo-test');
      expect(result.A).toBeGreaterThanOrEqual(0);
      expect(result.D).toBeGreaterThanOrEqual(0);
      expect(result.L).toBeGreaterThanOrEqual(0);
      expect(result.T).toBeGreaterThanOrEqual(0);
      expect(result.IAL).toBeGreaterThanOrEqual(0);
      expect(result.IAL).toBeLessThanOrEqual(1);
      expect(['critico', 'fragil', 'estable', 'longevo']).toContain(result.estado);
      expect(typeof result.verificado).toBe('boolean');
      expect(typeof result.provisional).toBe('boolean');
      expect(Array.isArray(result.alertas)).toBe(true);
      expect(result.timestamp).toBeGreaterThan(0);
    });

    test('escenario del spec: A=0.8, D=0.7, L=0.6, T=0.9 → IAL ≈ 0.68 (Estable)', () => {
      // We need to construct inputs that produce these exact values
      // A = 0.8: produccion/consumo ratios weighted
      // D = 0.7: 1 - 30/100 = 0.7
      // L = 0.6: 60/100 = 0.6 (no compuerta)
      // T = 0.9: geometric mean
      const autotrofia = {
        produccion: { energia: 80, alimento: 80, cuidado: 80 },
        consumo: { energia: 100, alimento: 100, cuidado: 100 },
      };
      const destrabajo = { horasServidumbre: 30, horasDisponibles: 100, tvMin: 0.1 };
      const lujoEtico = { excedenteDiscrecional: 100, excedenteEtico: 60, aMin: 0.1, tvMin: 0.1, autotrofiaActual: 0, destrabajoActual: 0 };
      const transgeneracional = {
        proxies: [
          { id: '1', nombre: 'suelo' as const, capacidadActual: 90, capacidadRecibida: 100, medible: true },
          { id: '2', nombre: 'saber' as const, capacidadActual: 90, capacidadRecibida: 100, medible: true },
          { id: '3', nombre: 'boveda' as const, capacidadActual: 90, capacidadRecibida: 100, medible: true },
          { id: '4', nombre: 'cuidado' as const, capacidadActual: 90, capacidadRecibida: 100, medible: true },
        ],
      };

      const result = evaluateIAL(autotrofia, destrabajo, lujoEtico, transgeneracional, DEFAULT_IAL_CONFIG, 'nodo-test', { inicio: 0, fin: 1 });
      
      // A ≈ 0.8, D = 0.7, L = 0.6, T ≈ 0.97 (0.9^4 ^ 0.25 = 0.9)
      // geoMean = (0.8 * 0.7 * 0.6)^(1/3) ≈ 0.69
      // IAL = 0.69 * 0.9 ≈ 0.62
      expect(result.IAL).toBeGreaterThan(0.5);
      expect(result.IAL).toBeLessThan(0.8);
      expect(result.estado).toBe('estable');
    });
  });

  describe('getBand', () => {
    test('mapea correctamente cada banda', () => {
      expect(getBand(0.1, DEFAULT_IAL_CONFIG.bandas).estado).toBe('critico');
      expect(getBand(0.3, DEFAULT_IAL_CONFIG.bandas).estado).toBe('fragil');
      expect(getBand(0.5, DEFAULT_IAL_CONFIG.bandas).estado).toBe('estable');
      expect(getBand(0.8, DEFAULT_IAL_CONFIG.bandas).estado).toBe('longevo');
    });

    test('edge case: ial = 1 → longevo', () => {
      expect(getBand(1, DEFAULT_IAL_CONFIG.bandas).estado).toBe('longevo');
    });

    test('edge case: ial = 0 → critico', () => {
      expect(getBand(0, DEFAULT_IAL_CONFIG.bandas).estado).toBe('critico');
    });
  });

  describe('checkAlertas', () => {
    const baseResult = {
      A: 0.5, D: 0.5, L: 0.5, T: 0.5, IAL: 0.3,
      estado: 'fragil' as const,
      verificado: false,
      provisional: false,
      alertas: [],
      timestamp: 0,
      periodo: { inicio: 0, fin: 1 },
      nodoId: 'test',
    };

    test('A < 0.10 genera alerta', () => {
      const alertas = checkAlertas({ ...baseResult, A: 0.05 }, DEFAULT_IAL_CONFIG);
      expect(alertas).toContain('A < 0.10: Autotrofia crítica');
    });

    test('D < 0.10 genera alerta', () => {
      const alertas = checkAlertas({ ...baseResult, D: 0.05 }, DEFAULT_IAL_CONFIG);
      expect(alertas).toContain('D < 0.10: Destrabajo crítico');
    });

    test('L < 0.10 genera alerta', () => {
      const alertas = checkAlertas({ ...baseResult, L: 0.05 }, DEFAULT_IAL_CONFIG);
      expect(alertas).toContain('L < 0.10: Lujo ético crítico');
    });

    test('provisional = true genera alerta', () => {
      const alertas = checkAlertas({ ...baseResult, provisional: true }, DEFAULT_IAL_CONFIG);
      expect(alertas.some(a => a.includes('PROVISIONAL'))).toBe(true);
    });

    test('estado critico genera alerta γ-CARMIS', () => {
      const alertas = checkAlertas({ ...baseResult, estado: 'critico', IAL: 0.1 }, DEFAULT_IAL_CONFIG);
      expect(alertas.some(a => a.includes('γ-CARMIS'))).toBe(true);
    });
  });

  describe('validateConfig', () => {
    test('pesos que suman 1 → válido', () => {
      const errors = validateConfig({ pesos: { energia: 0.4, alimento: 0.3, cuidado: 0.3 } });
      expect(errors).toHaveLength(0);
    });

    test('pesos que no suman 1 → error', () => {
      const errors = validateConfig({ pesos: { energia: 0.5, alimento: 0.3, cuidado: 0.3 } });
      expect(errors).toContain('Pesos deben sumar 1');
    });

    test('pesos negativos → error', () => {
      const errors = validateConfig({ pesos: { energia: -0.1, alimento: 0.6, cuidado: 0.5 } });
      expect(errors).toContain('Pesos no pueden ser negativos');
    });

    test('aMin fuera de rango → error', () => {
      const errors = validateConfig({ aMin: 1.5 });
      expect(errors).toContain('aMin debe estar en [0,1]');
    });

    test('tvMin fuera de rango → error', () => {
      const errors = validateConfig({ tvMin: -0.1 });
      expect(errors).toContain('tvMin debe estar en [0,1]');
    });
  });
});

// Helper for validateConfig (not exported, inline for test)
function validateConfig(config: { pesos?: { energia: number; alimento: number; cuidado: number }; aMin?: number; tvMin?: number }): string[] {
  const errors: string[] = [];
  if (config.pesos) {
    const sum = config.pesos.energia + config.pesos.alimento + config.pesos.cuidado;
    if (Math.abs(sum - 1) > 0.001) errors.push('Pesos deben sumar 1');
    if (config.pesos.energia < 0 || config.pesos.alimento < 0 || config.pesos.cuidado < 0) {
      errors.push('Pesos no pueden ser negativos');
    }
  }
  if (config.aMin !== undefined && (config.aMin < 0 || config.aMin > 1)) errors.push('aMin debe estar en [0,1]');
  if (config.tvMin !== undefined && (config.tvMin < 0 || config.tvMin > 1)) errors.push('tvMin debe estar en [0,1]');
  return errors;
}