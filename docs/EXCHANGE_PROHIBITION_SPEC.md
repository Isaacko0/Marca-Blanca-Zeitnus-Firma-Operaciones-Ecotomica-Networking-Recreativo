# Spec: Exchange Guard - Prohibición Cambiaria Estricta (Art 3c, 10e, 17A.2)

**Fuente**: Reglamento Fedeco - Art 3c (Reglas Esenciales de Intercambio), Art 10e (Prohibiciones: Especulación y Usura), Art 17A.2 (Mercado Comunal: Prohibición Dinero Fiduciario) + Libro Ecoaldeas Federadas Cap 7
**Prioridad**: P0 (Crítico - invariante económica: TQ ≠ Fiat directo)
**Archivos Zeitnus**: `src/core/lib/exchangeGuard.ts`, `src/core/state/exchangeGuard.ts`, `src/core/lib/valueDual.ts` (extensión), `src/app/screens/ExchangeGuard.tsx`

---

## 1. Invariante Central

```typescript
// INVARIANTE INQUEBRANTABLE (Art 3c + Libro Cap 7)
// "Queda terminantemente vetado convertir o transar créditos TQ directamente por dinero fiduciario exterior 
// (dólares, moneda nacional) o criptomonedas especulativas."

// ÚNICOS CAMINOS PERMITIDOS:
// 1. Fiat → Bienes Tangibles → TQ (INGRESO de valor a la comunidad)
// 2. TQ → Bienes Tangibles → Fiat (EXTRACCIÓN de valor de la comunidad)
// 
// NUNCA: TQ ↔ Fiat directo
// NUNCA: TQ ↔ Crypto directo
```

---

## 2. Modelo de Datos

```typescript
// src/core/state/exchangeGuard.ts

type CurrencyType = 'TQ' | 'Fiat' | 'Crypto';
type FiatCurrency = 'USD' | 'EUR' | 'VES' | 'COP' | 'MXN' | 'ARS' | 'BRL' | 'PEN';
type CryptoCurrency = 'BTC' | 'ETH' | 'USDC' | 'USDT' | 'DAI';

interface ExchangePath {
  from: CurrencyType;
  to: CurrencyType;
  viaTangibleGood: boolean;        // OBLIGATORIO: true para cualquier conversión cross-currency
  tangibleGoodId?: string;         // ID del bien tangible intermediario
  fiatCurrency?: FiatCurrency;     // si from/to = Fiat
  cryptoCurrency?: CryptoCurrency; // si from/to = Crypto
}

interface ExchangeValidationResult {
  allowed: boolean;
  reason: string;
  path: ExchangePath;
  auditTrail: ExchangeAuditEntry;
  requiresHumanApproval: boolean;  // true para extracciones grandes
}

interface ExchangeAuditEntry {
  id: string;
  timestamp: number;
  memberId: string;
  path: ExchangePath;
  amount: number;                  // en unidad origen
  tangibleGood: TangibleGoodRef;   // bien intermediario
  fiatAmount?: number;             // monto fiat si aplica
  cryptoAmount?: number;           // monto crypto si aplica
  fcUsed?: number;                 // Factor Conversión usado
  approvedBy?: string;             // humano si required
  status: 'allowed' | 'blocked' | 'pending_approval' | 'violation';
}

interface TangibleGoodRef {
  id: string;
  name: string;
  category: 'food' | 'tools' | 'construction' | 'energy' | 'seeds' | 'crafts' | 'services' | 'other';
  energyCostTQ: number;            // del catálogo energético (ICE/Ecoinvent)
  marketValueFiat: { [currency: string]: number }; // valor mercado fiat actual
  unit: string;
  quantity: number;
  producerId: string;              // quién lo produce/aporta
  qualityVerified: boolean;        // validado por dept correspondiente
}

interface ViolationRecord {
  id: string;
  memberId: string;
  timestamp: number;
  attemptedPath: ExchangePath;
  amount: number;
  detectionMethod: 'automatic' | 'manual_report' | 'audit';
  evidence: string[];
  sanction: 'warning' | 'credit_suspension' | 'machinery_restriction' | 'expulsion';
  status: 'open' | 'investigating' | 'sanctioned' | 'appealed';
}

// Configuración del guard
interface ExchangeGuardConfig {
  // Rutas permitidas (hardcoded - inmutables)
  allowedPaths: ExchangePath[];
  
  // Rutas bloqueadas (hardcoded - inmutables)
  blockedPaths: ExchangePath[];
  
  // Umbral para aprobación humana en extracciones
  humanApprovalThresholdTQ: number;    // ej: 1000 TQ
  humanApprovalThresholdFiat: number;  // ej: $500 USD equivalente
  
  // Auditoría
  auditRetentionDays: number;          // 365 días mínimo
  autoExpulsionOnDirectViolation: boolean; // Art 34e: "expulsión permanente si violación"
}
```

---

## 3. Configuración Hardcoded (Inmutable)

```typescript
// src/core/lib/exchangeGuardConfig.ts

export const EXCHANGE_GUARD_CONFIG: ExchangeGuardConfig = {
  // === RUTAS PERMITIDAS (ÚNICAS VÁLIDAS) ===
  allowedPaths: [
    // INGRESO: Fiat → Bien Tangible → TQ
    {
      from: 'Fiat',
      to: 'TQ',
      viaTangibleGood: true,
      description: 'Aporte dinero fiat → compra bienes tangibles → recibe TQ por valor energético'
    },
    // EXTRACCIÓN: TQ → Bien Tangible → Fiat
    {
      from: 'TQ',
      to: 'Fiat',
      viaTangibleGood: true,
      description: 'Gasta TQ → adquiere bienes tangibles → vende bienes por fiat exterior'
    },
    // INGRESO: Crypto → Bien Tangible → TQ (solo stablecoins auditadas, Art 3c: "criptomonedas especulativas" vetadas)
    {
      from: 'Crypto',
      to: 'TQ',
      viaTangibleGood: true,
      description: 'Solo stablecoins ReFi Nivel 3 (USDC auditado) → bienes → TQ'
    },
    // EXTRACCIÓN: TQ → Bien Tangible → Crypto (stablecoins)
    {
      from: 'TQ',
      to: 'Crypto',
      viaTangibleGood: true,
      description: 'TQ → bienes → stablecoins ReFi Nivel 3'
    },
    // INTERNO: TQ ↔ TQ (transferencias normales)
    {
      from: 'TQ',
      to: 'TQ',
      viaTangibleGood: false,
      description: 'Intercambios internos comunidad (caas, trustlines, solarpunk, vesting)'
    },
    // INTERNO: Trueque directo Bien ↔ Bien (sin TQ)
    {
      from: 'TangibleGood',
      to: 'TangibleGood',
      viaTangibleGood: false,
      description: 'Trueque directo producto por producto (Art 17A.1)'
    }
  ],

  // === RUTAS BLOQUEADAS (TERMINANTEMENTE VETADAS) ===
  blockedPaths: [
    { from: 'TQ', to: 'Fiat', viaTangibleGood: false, reason: 'Conversión directa TQ→Fiat prohibida (Art 3c)' },
    { from: 'Fiat', to: 'TQ', viaTangibleGood: false, reason: 'Conversión directa Fiat→TQ prohibida (Art 3c)' },
    { from: 'TQ', to: 'Crypto', viaTangibleGood: false, reason: 'Conversión directa TQ→Crypto prohibida (Art 3c)' },
    { from: 'Crypto', to: 'TQ', viaTangibleGood: false, reason: 'Conversión directa Crypto→TQ prohibida (Art 3c)' },
    { from: 'Fiat', to: 'Crypto', viaTangibleGood: false, reason: 'Fiat→Crypto fuera DEX comunitario' },
    { from: 'Crypto', to: 'Fiat', viaTangibleGood: false, reason: 'Crypto→Fiat fuera DEX comunitario' }
  ],

  // Umbrales aprobación humana
  humanApprovalThresholdTQ: 1000,      // TQ
  humanApprovalThresholdFiat: 500,     // USD equivalente
  
  // Auditoría
  auditRetentionDays: 365,
  autoExpulsionOnDirectViolation: true  // Art 34e
};
```

---

## 4. Lógica de Negocio (ExchangeGuard)

```typescript
// src/core/lib/exchangeGuard.ts

import { EXCHANGE_GUARD_CONFIG } from './exchangeGuardConfig';
import type { ExchangePath, ExchangeValidationResult, ExchangeAuditEntry, ViolationRecord, TangibleGoodRef } from '@core/state/exchangeGuard';
import { getFC } from './conversionFactor'; // Factor Conversión FC

export class ExchangeGuard {
  private auditLog: ExchangeAuditEntry[] = [];
  private violations: ViolationRecord[] = [];
  private tangibleGoods: Map<string, TangibleGoodRef> = new Map(); // catálogo bienes válidos

  // === VALIDACIÓN PRINCIPAL ===
  
  // Se llama ANTES de cualquier operación cross-currency
  validateExchange(path: ExchangePath, amount: number, memberId: string): ExchangeValidationResult {
    // 1. Verificar si ruta está explícitamente permitida
    const allowedPath = EXCHANGE_GUARD_CONFIG.allowedPaths.find(p => 
      p.from === path.from && p.to === path.to && p.viaTangibleGood === path.viaTangibleGood
    );
    
    if (!allowedPath) {
      // 2. Verificar si está explícitamente bloqueada
      const blockedPath = EXCHANGE_GUARD_CONFIG.blockedPaths.find(p => 
        p.from === path.from && p.to === path.to && p.viaTangibleGood === path.viaTangibleGood
      );
      
      if (blockedPath) {
        return this.blockAndAudit(path, amount, memberId, blockedPath.reason);
      }
      
      // 3. Ruta no contemplada = bloqueada por defecto (fail-closed)
      return this.blockAndAudit(path, amount, memberId, 'Ruta de intercambio no autorizada por configuración');
    }
    
    // 4. Ruta permitida: validar requisitos adicionales
    if (path.viaTangibleGood) {
      const goodValidation = this.validateTangibleGood(path, amount);
      if (!goodValidation.valid) {
        return this.blockAndAudit(path, amount, memberId, goodValidation.reason);
      }
    }
    
    // 5. Verificar umbral aprobación humana
    const requiresHuman = this.requiresHumanApproval(path, amount);
    
    // 6. Registrar auditoría
    const auditEntry = this.createAuditEntry(path, amount, memberId, 'allowed', requiresHuman);
    this.auditLog.push(auditEntry);
    
    return {
      allowed: true,
      reason: `Ruta permitida: ${allowedPath.description}`,
      path,
      auditTrail: auditEntry,
      requiresHumanApproval: requiresHuman
    };
  }

  // === VALIDACIÓN BIEN TANGIBLE ===
  
  private validateTangibleGood(path: ExchangePath, amount: number): { valid: boolean; reason: string } {
    if (!path.tangibleGoodId) {
      return { valid: false, reason: 'Bien tangible intermediario requerido (viaTangibleGood=true)' };
    }
    
    const good = this.tangibleGoods.get(path.tangibleGoodId);
    if (!good) {
      return { valid: false, reason: 'Bien tangible no registrado en catálogo comunitario' };
    }
    
    if (!good.qualityVerified) {
      return { valid: false, reason: 'Bien tangible no verificado por dept correspondiente' };
    }
    
    // Verificar coherencia valor energético vs monto
    const expectedTQ = good.energyCostTQ * path.quantity; // cantidad * costo energético unitario
    const tolerance = 0.1; // 10% tolerancia
    
    if (path.from === 'Fiat' && path.to === 'TQ') {
      // Fiat → Bien → TQ: monto TQ debe coincidir con valor energético del bien
      if (Math.abs(amount - expectedTQ) > expectedTQ * tolerance) {
        return { valid: false, reason: `Monto TQ (${amount}) no coincide con valor energético bien (${expectedTQ} TQ ±10%)` };
      }
    }
    
    if (path.from === 'TQ' && path.to === 'Fiat') {
      // TQ → Bien → Fiat: monto TQ gastado = valor energético bien
      if (Math.abs(amount - expectedTQ) > expectedTQ * tolerance) {
        return { valid: false, reason: `TQ gastados (${amount}) no coinciden con valor energético bien (${expectedTQ} TQ ±10%)` };
      }
    }
    
    return { valid: true, reason: 'Bien tangible validado' };
  }

  // === UMBRAL APROBACIÓN HUMANA ===
  
  private requiresHumanApproval(path: ExchangePath, amount: number): boolean {
    if (path.from === 'TQ' && (path.to === 'Fiat' || path.to === 'Crypto')) {
      // Extracción: TQ → exterior
      if (amount >= EXCHANGE_GUARD_CONFIG.humanApprovalThresholdTQ) return true;
      
      // También verificar equivalencia fiat via FC
      if (path.fiatCurrency) {
        const fc = getFC(path.fiatCurrency);
        const fiatEquiv = amount * fc;
        if (fiatEquiv >= EXCHANGE_GUARD_CONFIG.humanApprovalThresholdFiat) return true;
      }
    }
    return false;
  }

  // === BLOQUEO Y AUDITORÍA VIOLACIÓN ===
  
  private blockAndAudit(path: ExchangePath, amount: number, memberId: string, reason: string): ExchangeValidationResult {
    const auditEntry = this.createAuditEntry(path, amount, memberId, 'blocked', false);
    auditEntry.status = 'violation';
    this.auditLog.push(auditEntry);
    
    // Registrar violación
    const violation: ViolationRecord = {
      id: `viol_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
      memberId,
      timestamp: Date.now(),
      attemptedPath: path,
      amount,
      detectionMethod: 'automatic',
      evidence: [reason, `Path: ${path.from}→${path.to} viaTangible=${path.viaTangibleGood}`],
      sanction: 'expulsion', // Art 34e: expulsión permanente
      status: 'open'
    };
    this.violations.push(violation);
    
    // Auto-expulsión si configurado (Art 34e)
    if (EXCHANGE_GUARD_CONFIG.autoExpulsionOnDirectViolation) {
      this.triggerExpulsionProcess(memberId, violation.id);
    }
    
    return {
      allowed: false,
      reason: `VIOLACIÓN: ${reason}`,
      path,
      auditTrail: auditEntry,
      requiresHumanApproval: false
    };
  }

  private createAuditEntry(path: ExchangePath, amount: number, memberId: string, 
                           status: ExchangeAuditEntry['status'], requiresHuman: boolean): ExchangeAuditEntry {
    return {
      id: `audit_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
      timestamp: Date.now(),
      memberId,
      path,
      amount,
      tangibleGood: path.tangibleGoodId ? this.tangibleGoods.get(path.tangibleGoodId)! : null as any,
      status,
      requiresHumanApproval: requiresHuman
    };
  }

  // === REGISTRO BIENES TANGIBLES VÁLIDOS ===
  
  registerTangibleGood(good: TangibleGoodRef): void {
    // Validar que tiene costo energético del catálogo (ICE/Ecoinvent)
    if (good.energyCostTQ <= 0) {
      throw new Error('Bien tangible debe tener costo energético > 0 (catálogo ICE/Ecoinvent)');
    }
    this.tangibleGoods.set(good.id, good);
  }

  // === PROCESO EXPULSIÓN (Art 34e, 35) ===
  
  private async triggerExpulsionProcess(memberId: string, violationId: string): Promise<void> {
    // Integrar con justice.ts / democracy.ts
    // 1. Notificar Comité Convivencia/Ética
    // 2. Garantizar derecho a ser escuchado
    // 3. Votación módulo digital supermayoría 85% (Art 13.2)
    // 4. Desactivación cuentas + tarjetas cripto
    // 5. Traslado vivienda transitoria fuera perímetro
    // 6. Denuncia penal obligatoria (Art 35.2)
    console.log(`[EXCHANGE_GUARD] EXPULSIÓN AUTOMÁTICA TRIGGERED para ${memberId} - Violación ${violationId}`);
  }

  // === CONSULTAS ===
  
  getAuditLog(memberId?: string, limit = 100): ExchangeAuditEntry[] {
    let log = this.auditLog;
    if (memberId) log = log.filter(e => e.memberId === memberId);
    return log.slice(-limit).reverse();
  }

  getViolations(status?: ViolationRecord['status']): ViolationRecord[] {
    let viol = this.violations;
    if (status) viol = viol.filter(v => v.status === status);
    return viol;
  }

  getTangibleGood(id: string): TangibleGoodRef | undefined {
    return this.tangibleGoods.get(id);
  }

  getAllTangibleGoods(): TangibleGoodRef[] {
    return Array.from(this.tangibleGoods.values());
  }
}
```

---

## 5. Integración con valueDual.ts (Modo Anfibio)

```typescript
// Extensión de valueDual.ts (ya existe nodeMode + priceParity)

interface ValueDualConfig {
  // Modos de operación del nodo (ya implementado)
  nodeMode: 'postmonetario' | 'conectado';
  priceParity: number;              // ZNU/TQ → USDC (oráculo ReFi Nivel 3)
  
  // NUEVO: Exchange Guard integrado
  exchangeGuard: ExchangeGuard;
  
  // DEX Puente Externo (Art 21 Libro, Art 18A Reglamento)
  dexEnabled: boolean;              // solo modo 'conectado'
  dexConfig: DEXConfig;
}

interface DEXConfig {
  // Solo activo en modo 'conectado'
  allowedFiatCurrencies: FiatCurrency[];
  allowedStablecoins: CryptoCurrency[]; // solo USDC/USDT auditados ReFi Nivel 3
  maxDailyVolumeFiat: number;       // límite diario extracción
  requiredApprovals: number;        // multi-firma para operar DEX
  auditTrail: boolean;              // siempre true
}

// En valueDual.ts - métodos de conversión protegidos por ExchangeGuard

async function convertWithGuard(
  from: CurrencyType, 
  to: CurrencyType, 
  amount: number, 
  memberId: string,
  tangibleGoodId: string
): Promise<ConversionResult> {
  const path: ExchangePath = { from, to, viaTangibleGood: true, tangibleGoodId };
  
  const validation = exchangeGuard.validateExchange(path, amount, memberId);
  if (!validation.allowed) {
    throw new Error(`Conversión bloqueada: ${validation.reason}`);
  }
  
  if (validation.requiresHumanApproval) {
    // Esperar aprobación multi-firma (3/3)
    const approval = await requestMultiSigApproval(validation.auditTrail.id);
    if (!approval) throw new Error('Aprobación multi-firma denegada');
  }
  
  // Ejecutar conversión real (integra con caas.ts, trustlines.ts, DEX externo)
  return await executeConversion(path, amount, memberId);
}
```

---

## 6. Integración con Módulos Existentes

```typescript
// Puntos de integración obligatorios - TODAS las salidas/entradas de valor:

// 1. caas.ts - revenue share payouts (pueden ser en TQ o fiat via DEX)
async function runCaasPayout(baseZNU: number): Promise<void> {
  const payouts = calculatePayouts(baseZNU);
  for (const payout of payouts) {
    if (payout.currency === 'Fiat' && valueDual.nodeMode === 'conectado') {
      // TQ → Bien Tangible → Fiat via DEX
      const goodId = await selectTangibleGoodForPayout(payout.memberId, payout.amount);
      await convertWithGuard('TQ', 'Fiat', payout.amount, payout.memberId, goodId);
    } else {
      // Payout en TQ (modo postmonetario o preferencia miembro)
      symmetricLimits.applyTransaction(payout.memberId, payout.amount);
    }
  }
}

// 2. admissionWorkflow.ts - aporte inicial fiat → TQ (Art 18A)
async function processInitialContribution(memberId: string, fiatAmount: number, currency: FiatCurrency, goodId: string): Promise<void> {
  // Fiat → Bien Tangible → TQ
  await convertWithGuard('Fiat', 'TQ', fiatAmount, memberId, goodId);
  // El bien tangible queda en inventario comunitario
}

// 3. marketplace.ts - ventas mercado comunal (Art 17A.2: prohibición fiat)
function processMarketSale(sellerId: string, buyerId: string, amountTQ: number): boolean {
  // Solo TQ ↔ TQ permitido en mercado interno
  return symmetricLimits.applyTransaction(buyerId, -amountTQ) && 
         symmetricLimits.applyTransaction(sellerId, amountTQ);
}

// 4. federatedExchange.ts - intercambio cultural (Art 32A: sin fiat)
function processFederatedExchange(sendingNode: string, receivingNode: string, members: string[]): void {
  // Solo crédito local TQ, sin dinero fiduciario
  // Hospedaje/alimentación = cayapas + crédito local
}

// 5. trustlines.ts - apertura líneas crédito
function openTrustline(a: string, b: string, creditGiven: number, creditReceived: number): boolean {
  // Validar que no excede límites simétricos (ya en symmetricLimits)
  // NO permite conversión fiat/crypto
  return symmetricLimits.validateTransaction(a, creditGiven).allowed &&
         symmetricLimits.validateTransaction(b, -creditReceived).allowed;
}
```

---

## 7. Pantalla ExchangeGuard.tsx

```tsx
// src/app/screens/ExchangeGuard.tsx

export function ExchangeGuardScreen() {
  const { 
    auditLog, 
    violations, 
    tangibleGoods,
    validateExchange,
    registerTangibleGood,
    getAuditLog,
    getViolations 
  } = useAppStore();

  return (
    <div className="p-6 space-y-6">
      <Header title="Exchange Guard - Prohibición Cambiaria" subtitle="Art 3c, 10e, 17A.2 - TQ ≠ Fiat/Crypto directo | Solo vía bienes tangibles" />
      
      {/* Estado del guard */}
      <GuardStatusCard 
        config={EXCHANGE_GUARD_CONFIG}
        nodeMode={valueDual.nodeMode}
      />
      
      {/* Rutas permitidas vs bloqueadas */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader title="✅ Rutas Permitidas" />
          <CardContent>
            <AllowedPathsList paths={EXCHANGE_GUARD_CONFIG.allowedPaths} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader title="🚫 Rutas Bloqueadas (Inmutables)" />
          <CardContent>
            <BlockedPathsList paths={EXCHANGE_GUARD_CONFIG.blockedPaths} />
          </CardContent>
        </Card>
      </div>

      {/* Catálogo bienes tangibles válidos */}
      <Card>
        <CardHeader title="Catálogo Bienes Tangibles Intermediarios" />
        <CardContent>
          <TangibleGoodsRegistry 
            goods={Array.from(tangibleGoods.values())}
            onRegister={registerTangibleGood}
            energyCatalog={energyCatalog} // link a energyCatalog.ts
          />
        </CardContent>
      </Card>

      {/* Auditoría */}
      <Card>
        <CardHeader title="Log de Auditoría" />
        <CardContent>
          <AuditLogTable 
            entries={getAuditLog(undefined, 50)}
            onViewDetails={viewAuditDetail}
          />
        </CardContent>
      </Card>

      {/* Violaciones */}
      <Card>
        <CardHeader title="Violaciones Detectadas" />
        <CardContent>
          <ViolationsTable 
            violations={getViolations()}
            onInvestigate={investigateViolation}
          />
        </CardContent>
      </Card>

      {/* Test manual */}
      <Card>
        <CardHeader title="Test de Validación (Simulador)" />
        <CardContent>
          <ExchangeValidatorForm onValidate={validateExchange} />
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 8. Criterios de Aceptación (Definition of Done)

- [ ] Rutas permitidas hardcoded e inmutables (solo 6 rutas válidas)
- [ ] Rutas bloqueadas hardcoded e inmutables (6+ rutas vetadas)
- [ ] Validación PRE-venta en TODOS los módulos (caas, trustlines, solarpunk, admission, marketplace, DEX)
- [ ] Bien tangible intermediario OBLIGATORIO para cualquier cross-currency
- [ ] Bien tangible debe estar en catálogo + verificado + costo energético ICE/Ecoinvent
- [ ] Coherencia valor: monto TQ = valor energético bien ±10%
- [ ] Aprobación humana multi-firma 3/3 para extracciones >1000 TQ / $500 USD
- [ ] Auto-expulsión en violación directa TQ↔Fiat/Crypto (Art 34e)
- [ ] Auditoría completa inmutable (365 días retención)
- [ ] Integración valueDual.ts: nodeMode 'postmonetario' bloquea DEX, 'conectado' permite con guard
- [ ] Tests: todas las rutas permitidas/bloqueadas, bienes tangibles, umbrales, expulsión auto

---

## 9. Referencias Normativas

- **Art 3c**: "Prohibición Cambiaria Estricta: vetado convertir o transar créditos TQ directamente por dinero fiduciario exterior o criptomonedas especulativas. Todo intercambio con el exterior se efectúa mediante productos o servicios tangibles."
- **Art 10e**: "Especulación y Usura: El cobro de intereses, comisiones no autorizadas o intermediación parasitaria sobre transacciones TQ o bienes comunitarios."
- **Art 17A.2**: "Prohibición de Dinero Fiduciario: Se ratifica la prohibición absoluta de utilizar dinero fiduciario en estos espacios de intercambio interno."
- **Art 34e**: "Narcotráfico y tráfico de drogas químicas sintéticas" + "expulsión permanente si violación" (aplicable por analogía a violación cambiaria)
- **Art 18A**: "Retorno Inmediato del Aporte en Unidades TQ: Todo recurso financiero (dinero fiat) que una persona aporte... será reconocido y acreditado de forma inmediata e íntegra en su cuenta del sistema TQ"
- **Libro Ecoaldeas Federadas Cap 7**: La Prohibición Cambiaria - regla estricta que impide intercambiar TQ directamente por dinero fiat
- **vitalTimeInvariants.ts**: 1 TQ = 1 kWh = invariante termodinámica que fundamenta por qué TQ no es convertible a fiat