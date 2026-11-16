# Sensorica OVN + "Una Nueva Economía" - Backup de Asimilación

**Fecha**: 2026-11-12
**Repo fuente**: Sensorica blog (Tiberius Brastaviceanu), YouTube "Una Nueva Economía" (Moconomy), Exploration phase.md (Sensorica OVN)
**Licencia**: Documentos públicos, conceptos extraídos (no código propietario)
**Principio HSCSG**: Anfibio - lógica monetaria agnóstica, brand assets NO asimilados

---

## 1. Inventario de Fuentes

| Fuente | Tipo | Tamaño | Contenido Clave |
|--------|------|--------|-----------------|
| Sensorica blog post | Texto | ~3KB | Distinción economías: compartida vs colaborativa vs participativa |
| YouTube "Una Nueva Economía" | Transcript | 54KB | 7 orgs canadienses: Sensorica, Sole Food, London Brewing, Red Victorian, Knockdown, Vancity, Tradeworks |
| Exploration phase.md | Markdown | 83KB | Technical specs: blockchain, access mgmt, value accounting, governance, property regimes |

---

## 2. Análisis de Copyright

| Elemento | Tratamiento | Justificación |
|----------|-------------|---------------|
| Conceptos/definiciones (economía colaborativa, participativa) | **ASIMILAR** | Ideas abstractas, dominio público |
| Value Equation algorithm | **ASIMILAR** | Algoritmo matemático descrito públicamente |
| OVN governance patterns | **ASIMILAR** | Patrones organizacionales documentados |
| Exploration phase technical specs | **ASIMILAR** | Especificaciones técnicas abiertas |
| Brand "Sensorica", logos, nombres propios | **NO ASIMILAR** | Trademarks Sensorica |
| Video frames, thumbnails | **NO ASIMILAR** | Copyright Moconomy GmbH |
| Nombres personas (Tiberius, Michael Ableman, etc.) | **REFERENCIAR ONLY** | Datos personales públicos |

---

## 3. Decisiones Fase 2 - Qué Asimilar

### SÍ asimilar (conceptos → código/patrones):
1. **Value Equation** → `arm-sensorica/core/valueEquation.ts`
2. **Contribution Accounting** → `arm-sensorica/core/contributionAccounting.ts`
3. **OVN Governance** → `arm-sensorica/core/governance.ts`
4. **Resource Mutualization** → `arm-sensorica/core/resourcePool.ts`
5. **Access Management Primitives** → `arm-sensorica/core/accessControl.ts`
6. **Property Regimes** → `arm-sensorica/core/propertyRegime.ts`
7. **Trust/Reputation Local** → `arm-sensorica/core/trustLocal.ts`
8. **Exchange Firm Pattern** → `arm-sensorica/core/exchangeFirm.ts`
9. **Affiliate/Contributor Model** → `arm-sensorica/core/affiliate.ts`
10. **Blockchain Primitives** → `arm-sensorica/core/blockchainPrimitives.ts`

### NO asimilar:
- Brand Sensorica, logos, identities
- Video content, thumbnails
- Nombres reales de personas (referenciar como "fundador Sensorica", etc.)

---

## 4. Mapeo a Paquetes HSCSG ARM Existentes

| Sensorica Primitive | Paquete ARM Target | Archivo Nuevo/Extendido |
|---------------------|-------------------|------------------------|
| Value Equation | `arm-core` (extend) | `lib/valueEquation.ts` |
| Contribution Accounting | `arm-sensorica` (new) | `core/contributionAccounting.ts` |
| OVN Governance | `arm-sensorica` (new) | `core/governance.ts` |
| Resource Pool | `arm-sensorica` (new) | `core/resourcePool.ts` |
| Access Control | `arm-sensorica` (new) | `core/accessControl.ts` |
| Property Regimes | `arm-sensorica` (new) | `core/propertyRegime.ts` |
| Trust Local | `arm-sensorica` (new) | `core/trustLocal.ts` |
| Exchange Firm | `arm-sensorica` (new) | `core/exchangeFirm.ts` |
| Affiliate Model | `arm-gratiferia` (extend) | `core/affiliate.ts` |
| Blockchain Primitives | `arm-sensorica` (new) | `core/blockchainPrimitives.ts` |

---

## 5. Principio Anfibio Aplicado

```typescript
// En arm-core/lib/valueEquation.ts (EXTEND existing valueDual.ts)
interface ValueEquationConfig {
  mode: 'postmonetario' | 'conectado';  // ZNU/CaaS vs USD/USDC via priceParity
  contributionTypes: ContributionType[]; // time, materials, capital, knowledge
  distributionRules: DistributionRule[];
  exchangeFirmInterface?: ExchangeFirmConfig; // para modo conectado
}
```

---

## 6. Riesgos Identificados

| Riesgo | Mitigación |
|--------|------------|
| Value Equation puede parecer "tokenomics" | Documentar como contabilidad contributiva, no especulativa |
| Exchange Firm = cascarón legal | Documentar pattern, NO implementar entidad legal |
| Blockchain primitives → especulación | Mantener como primitives criptográficas, no tokens |
| Nombres personas en código | Usar roles genéricos: "founder", "affiliate", "placeKeeper" |