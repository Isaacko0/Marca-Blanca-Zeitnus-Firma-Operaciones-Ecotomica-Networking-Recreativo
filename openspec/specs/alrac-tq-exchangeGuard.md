# TQ Exchange Guard Specification
## openspec/specs/alrac-tq-exchangeGuard.md

---

## Overview
**Status**: Draft v1.0  
**Capa**: 1 (Contable-Física) — TQ Ledger  
**Función**: Prevenir arbitraje TQ ↔ Fiat/Cripto

---

## 1. Regla Innegociable (Cergio Monasterio)
> **PROHIBICIÓN CAMBIARIA: TQ ≠ fiat/cripto NUNCA** — por arquitectura, no buena voluntad.

---

## 2. Especificación Técnica

### 2.1 Función: `verifyTQProhibition(transaction: TQTransaction): boolean`
```typescript
export function verifyTQProhibition(tx: TQTransaction): boolean {
  // Reglas que SIEMPRE deben ser true:
  // 1. tx.fromCurrency === 'TQ' && tx.toCurrency === 'TQ' (solo TQ↔TQ)
  // 2. tx.type ∈ ['reciprocity', 'production', 'regeneration'] (no 'exchange')
  // 3. No hay campo 'exchangeRate' ni 'fiatValue' en la transacción
  // 4. Origen y destino son cuentas TQ válidas (saldo ±500)
  
  return (
    tx.fromCurrency === 'TQ' &&
    tx.toCurrency === 'TQ' &&
    ['reciprocity', 'production', 'regeneration'].includes(tx.type) &&
    !tx.exchangeRate &&
    !tx.fiatValue &&
    isValidTQAccount(tx.from) &&
    isValidTQAccount(tx.to)
  );
}
```

### 2.2 Función: `blockArbitrajeAttempt(attempt: ArbitrageAttempt): BlockResult`
```typescript
interface ArbitrageAttempt {
  from: TQAccount;
  to: FiatAccount | CryptoAccount;
  amount: number;
  proposedRate: number;
}

export function blockArbitrajeAttempt(attempt: ArbitrageAttempt): BlockResult {
  return {
    blocked: true,
    reason: 'TQ_PROHIBITION: Transducción Quántica no es intercambiable por fiat/cripto',
    code: 'TQ_EXCHANGE_GUARD_BLOCKED',
    timestamp: Date.now(),
    attempt: {
      from: attempt.from.id,
      to: attempt.to.id,
      amount: attempt.amount,
      proposedRate: attempt.proposedRate
    }
  };
}
```

---

## 3. Validaciones Obligatorias

| Validación | Test | Esperado |
|------------|------|----------|
| TQ → TQ reciprocidad | `verifyTQProhibition({type:'reciprocity', fromCurrency:'TQ', toCurrency:'TQ'})` | `true` |
| TQ → TQ producción | `verifyTQProhibition({type:'production', fromCurrency:'TQ', toCurrency:'TQ'})` | `true` |
| TQ → TQ regeneración | `verifyTQProhibition({type:'regeneration', fromCurrency:'TQ', toCurrency:'TQ'})` | `true` |
| TQ → USD | `verifyTQProhibition({type:'exchange', fromCurrency:'TQ', toCurrency:'USD'})` | `false` |
| TQ → BTC | `verifyTQProhibition({type:'exchange', fromCurrency:'TQ', toCurrency:'BTC'})` | `false` |
| TQ → ZNU | `verifyTQProhibition({type:'exchange', fromCurrency:'TQ', toCurrency:'ZNU'})` | `false` |
| Campo exchangeRate presente | `verifyTQProhibition({exchangeRate: 0.05})` | `false` |
| Campo fiatValue presente | `verifyTQProhibition({fiatValue: 100})` | `false` |

---

## 4. Integración Capa 3 (Zeitnus)

La **Capa 3 (Zeitnus)** es la **ÚNICA** que toca fiat. El exchangeGuard garantiza que:

```
Capa 1 (TQ) ←→ Capa 2 (CaaS/AUT) ←→ Capa 3 (ZNU) ←→ Fiat
     ↑                                              ↑
     │           PROHIBIDO                          │ PERMITIDO
     └────────────── exchangeGuard ─────────────────┘
```

- ZNU ↔ Fiat: Permitido (oráculo `priceParity`, 1 ZNU ≈ 1 USD)
- TQ ↔ ZNU: **PROHIBIDO** (funciones distintas: cinta métrica vs reserva)
- TQ ↔ Fiat: **PROHIBIDO** (arquitectura)

---

## 5. Archivos Implementación

| Archivo | Función |
|---------|---------|
| `src/core/lib/tq.ts` | `verifyTQProhibition()`, `blockArbitrajeAttempt()` |
| `src/core/lib/alrac.ts` | Integración con `simulateNode()` |
| `openspec/specs/alrac-architecture.md` | Capa 1 specs |

---

## 6. Criterios de Aceptación

- [ ] `verifyTQProhibition()` bloquea 100% intentos TQ→Fiat
- [ ] `verifyTQProhibition()` permite 100% transacciones TQ válidas (reciprocidad, producción, regeneración)
- [ ] `blockArbitrajeAttempt()` registra intento con timestamp y detalles
- [ ] 0 errores TypeScript en `tq.ts`
- [ ] Tests unitarios cubren 6 casos de validación