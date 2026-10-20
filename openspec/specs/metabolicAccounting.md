// openspec/specs/metabolicAccounting.md
// OpenSpec: Contabilidad Metabólica y Límites Ecológicos

# SPEC: metabolicAccounting
**Version:** 1.0.0
**Status:** Draft
**Capa:** 1 (Contable-Física) — TQ Ledger + Material Flows

---

## 1. RESUMEN EJECUTIVO

La **Contabilidad Metabólica** extiende la contabilidad energética TQ (1 TQ = 1 kWh) a un sistema de cuentas separadas por categoría biofísica, con identidad de balance material obligatoria por proceso productivo.

Resuelve la brecha entre:
- Contabilidad financiera (fiat, ZNU) — unidades monetarias
- Contabilidad energética TQ — kWh
- **Contabilidad metabólica** — cuentas físicas separadas por categoría biofísica

---

## 2. IDENTIDAD DE BALANCE MATERIAL (Obligatoria)

Para **cada proceso productivo** registrado en ValueFlows/TQ:

```
Entradas = Productos útiles + Residuos + Emisiones + ΔStocks + Diferencia no explicada
```

### Requisitos por receta/recurso:

| Requisito | Descripción |
|-----------|-------------|
| **Unidades compatibles** | Entradas y salidas en mismas unidades físicas (kg, m³, kWh, mol) |
| **Residuos con destino** | Cada flujo `type: 'waste'` debe tener destino previsto (compostaje, reciclaje, disposición segura) |
| **Emisiones con metodología** | Cada flujo `type: 'emission'` requiere `carbon_kg_co2e` + `methodology` (IPCC/GHG Protocol/local) |
| **Observado vs Planificado** | Flag `actual_quantities` separa cantidades medidas de planificadas |
| **Diferencia no explicada** | `Entradas - (Productos + Residuos + Emisiones + ΔStocks)` — investigar si > tolerancia (default 5%) |
| **Metodología carbono** | Declarada por flujo: IPCC 2006, GHG Protocol, local, measured |

### Ejemplo: Compostaje (balance cerrado)

```
Entradas: 1000 kg residuos orgánicos + 200 kg material estructural = 1200 kg
Salidas: 
  - 600 kg compost (producto útil)
  - 200 kg CO₂ (emisión, metodología IPCC)
  - 350 kg agua evaporada (emisión tipo agua)
  - 50 kg otros gases/lixiviados (emisión/residuo)
Diferencia no explicada: 0 kg ✓
```

---

## 3. CUENTAS SEPARADAS (NO INTERCAMBIABLES)

Seis categorías biofísicas con unidad principal propia:

| Categoría | Unidad principal | Qué registra | Ejemplo métricas |
|-----------|------------------|--------------|------------------|
| **Energía** | kWh | Consumo, generación, ahorro, balance neto, % renovable, autonomía horas | `net_balance_kwh`, `renewable_share`, `autonomy_hours` |
| **Agua** | m³ | Captación, disponibilidad, consumo, infiltración, recarga, calidad | `capture_m3`, `recharge_m3`, `quality_index` |
| **Biomasa/Alimentos** | kg, ton | Producción, consumo, existencias, pérdidas, índice diversidad | `production_kg`, `self_sufficiency_ratio`, `diversity_index` |
| **Carbono** | kg/ton CO₂e | Emisiones, remociones, neto (metodología declarada), verificación | `net_kg_co2e`, `methodology`, `verification_level` |
| **Suelo/Biodiversidad** | Índices | Carbono orgánico %, biodiversidad, erosión, regeneración neta, bioindicadores | `organic_carbon_%`, `biodiversity_index`, `regeneration_net` |
| **Economía** | Fiat/ZNU/TQ/tiempo | Saldos separados por unidad con reglas propias | `fiat_usd`, `fiat_mxn`, `znu`, `tq`, `time_hours` |

### Regla fundamental: NO INTERCAMBIABILIDAD

> **Los indicadores físicos alimentan un diagnóstico común, pero NO se intercambian por conveniencia.**

- Un sistema que premia ahorro energético **no** atribuye créditos por el mismo efecto registrado como eficiencia de producción
- Un beneficio futuro de carbono **no** se contabiliza como energía presente
- El agua infiltrada **no** se convierte en kWh equivalentes sin metodología explícita declarada
- Cada cuenta tiene su metodología declarada y su verificación independiente

---

## 4. VERIFICACIÓN DE LÍMITES PLANETARIOS Y LOCALES

### 4.1 Límites Planetarios 2026 (Potsdam Institute)

| Límite | Valor 2026 | Estado | Métrica contable |
|--------|-----------|--------|------------------|
| Cambio climático | 450 ppm CO₂ | Transgredido | Carbono: `net_kg_co2e` ≤ 0 (net zero) |
| Integridad biosfera | 10% especies amenazadas | Transgredido | Suelo: `organic_carbon_%` ≥ 3%, `biodiversity_index` ≥ 0.7 |
| Agua dulce | 4000 km³/año | Transgredido | Agua: `consumption_m3` ≤ `recharge_m3` × 0.5 |
| Flujos biogeoquímicos (N/P) | 62/6.2 Mt | Transgredido | Suelo: `erosion_tons_per_ha_year` ≤ 1 |
| Entidades novedosas | Sin umbral seguro | Transgredido | Registro sustancias sintéticas |
| Acidificación oceánica | pH 8.05 | Transgredido | Carbono oceánico (proxy) |
| Uso de suelo | 75% boscoso | Transgredido | Biomasa: `diversity_index` ≥ 0.75 |
| Aerosoles atmosféricos | Sin umbral | Límite | Registro emisiones particulados |
| Ozono estratosférico | 275 DU | Seguro | Registro sustancias ozono |

### 4.2 Checks operativos por cuenta

```typescript
interface LimitCheck {
  category: AccountCategory;
  metric: string;
  current_value: number;
  planetary_limit: number;
  local_limit?: number;
  status: 'safe' | 'warning' | 'critical' | 'transgressed';
  trend: 'improving' | 'stable' | 'worsening';
  years_to_limit?: number;
}
```

**Ejemplos de umbrales operativos:**

| Cuenta | Métrica | Safe | Warning | Critical |
|--------|---------|------|---------|----------|
| Carbono | `net_kg_co2e` | > 0 (remoción neta) | -1M a 0 | < -1M |
| Suelo | `organic_carbon_%` | ≥ 4% | 2-4% | < 2% |
| Agua | `consumption / recharge` | ≤ 0.5 | 0.5-1.0 | > 1.0 |
| Suelo | `erosion_t/ha/año` | ≤ 1 | 1-5 | > 5 |
| Biomasa | `diversity_index` | ≥ 0.75 | 0.5-0.75 | < 0.5 |

### 4.3 Tendencias y años al límite

Cada check incluye:
- `trend`: improving / stable / worsening (comparado período anterior)
- `years_to_limit`: estimación lineal simple si `current > limit`

---

## 5. ABUNDANCIA Y ESCASEZ: PROTEGER ACCESO BÁSICO

### 5.1 Definiciones operativas

| Concepto | Definición |
|----------|------------|
| **Abundancia** | Capacidad de satisfacer necesidades suficiente, equitativa, compatible con límites biofísicos |
| **Escasez** | Insuficiencia de recursos para necesidades — con diagnóstico diferencial |

### 5.2 Tipos de escasez y respuestas

| Tipo | Causa | Respuesta |
|------|-------|-----------|
| **Física** | Límite biofísico real | Priorizar necesidades, reducir demanda, regenerar base |
| **Estacional** | Ciclo natural | Almacenamiento, diversificación, federación |
| **Distributiva** | Desigualdad acceso | Reglas prioridad transparentes, **no mercado** |
| **Logística** | Infraestructura insuficiente | Inversión distribución, almacenamiento |
| **Creada por reglas** | Acceso restringido | Reformar reglas, no castigar necesidad |

### 5.3 Bienes esenciales: Protección absoluta

Para **alimento, agua, cuidado básico**:

1. **Asignación básica**: Priorizar necesidades + disponibilidad + límites uso, transparente. **La capacidad de pago, contribución laboral o reputación NO son condición de supervivencia.**

2. **Reparto de riesgo productivo**: Participantes comparten variaciones por reglas acordadas, **siempre** protegiendo a quienes necesitan lo básico.

### 5.4 Mecanismo CSA (Community Supported Agriculture) — Revisión normativa

En `calculateCSAMemberPrice()`:
- Factor abundancia puede **aumentar** precio si cosecha > umbral
- Factor escasez puede **reducir** precio si cosecha < umbral

**Revisión requerida:** El mecanismo no demuestra que todos cubran necesidades cuando cosecha es insuficiente.

**Separación recomendada:**
- **Asignación recursos básicos** → Reglas de prioridad por necesidad
- **Reparto riesgo** → Compartir variaciones precio/costo, **con piso de protección** para necesidades básicas

---

## 6. INTEGRACIÓN CON TQ Y VALUEFLOWS

### 6.1 Extensión ValueFlows para flujos materiales

```typescript
interface MaterialFlow extends VF_EconomicEvent {
  // Hereda: type, fromAgent, toAgent, resource, quantity, unit, timestamp
  material_category: 'energy' | 'water' | 'biomass' | 'carbon' | 'soil' | 'other';
  carbon_kg_co2e?: number;
  methodology?: string;
  actual_quantities: boolean;
  process_id?: string;           // Enlace a ProductionProcess
}
```

### 6.2 Proceso productivo con balance material

```typescript
interface ProductionProcess {
  id: string;
  recipe_id: string;
  inputs: MaterialFlow[];      // type: 'input'
  outputs: MaterialFlow[];     // type: 'product' | 'waste' | 'emission' | 'stock_change'
  balance: MaterialBalance;    // Validado: Entradas = Productos + Residuos + Emisiones + ΔStocks + Diff
  validation: RecipeValidationResult;
}
```

### 6.3 Agregación nodo territorial

```typescript
interface NodeMaterialAccounts {
  energy: EnergyAccount;
  water: WaterAccount;
  biomass: BiomassAccount;
  carbon: CarbonAccount;
  soil: SoilAccount;
  economy: EconomyAccount;
  balances: MaterialBalance[];
  limit_checks: LimitCheck[];
  alerts: string[];
}
```

---

## 7. VALIDACIÓN AUTOMÁTICA (Tests + Runtime)

### 7.1 Tests obligatorios

| Test | Qué verifica |
|------|--------------|
| `materialBalance.test.ts` | Identidad balance se cumple, diff > tolerancia lanza alerta |
| `recipeValidation.test.ts` | Receta compostaje cierra balance con agua evaporada |
| `separatedAccounts.test.ts` | Cuentas no intercambiables por conveniencia |
| `limitChecks.test.ts` | Checks límites planetarios con tendencias |
| `scarcityTypes.test.ts` | Diagnóstico diferencial escasez |
| `essentialGoodsProtection.test.ts` | Acceso básico no condicionado a pago/contribución |

### 7.2 Validación en runtime

```typescript
// En cada proceso productivo completado:
const validation = validateRecipeMassBalance(process);
if (!validation.valid) {
  // Bloquear confirmación, requerir corrección
  throw new Error(`Balance material inválido: ${validation.errors.join('; ')}`);
}

// Al agregar a cuentas nodo:
const { accounts, alerts } = aggregateNodeMaterialBalances(processes, state);
if (alerts.length > 0) {
  // Log alertas, notificar responsables
  notifyMaterialAlerts(alerts);
}
```

---

## 8. MÉTRICAS DE ÉXITO

| Métrica | Target Fase 3 (Piloto) | Target Fase 4 (Réplica) |
|---------|------------------------|-------------------------|
| % procesos con balance válido | 100% | 100% |
| Diferencia no explicada promedio | < 2% entradas | < 1% entradas |
| Cuentas separadas implementadas | 6/6 | 6/6 |
| Límites planetarios monitoreados | 9/9 | 9/9 + locales |
| Alertas resueltas / totales | > 80% | > 95% |
| Metodología carbono declarada | 100% flujos emisión | 100% + verificación 3ra parte |

---

## 9. SECUENCIA IMPLEMENTACIÓN

| Paso | Entregable | Validación |
|------|------------|------------|
| 1 | `materialBalance.ts` + `validateRecipeMassBalance()` | Tests balance material pasan |
| 2 | `SeparatedAccounts` + agregación nodo | 6 cuentas operativas |
| 3 | `checkPlanetaryLimits()` + tendencias | 9 checks + tendencias |
| 4 | Integración ValueFlows → `MaterialFlow` | Flujos materiales registrados |
| 4 | Protección bienes esenciales en CSA | Tests acceso básico pasan |
| 5 | Documentación metodologías carbono | 100% flujos con metodología |

---

## 10. REFERENCIAS

- Planetary Health Check 2026 (Potsdam Institute)
- UNEP Global Resource Outlook 2024
- OMS Atención Primaria / Determinantes Sociales
- LFPDPPP 2025 (México), LGSC, COFEPRIS
- IPCC 2006 Guidelines / GHG Protocol
- Material Flow Analysis (Eurostat, OECD)
- Matema 21: Humildad Metabólica
- BT213: Límites epistemológicos del kernel

---

*OpenSpec viva — Sujeta a revisión asamblearia y validación en piloto*
*Versión 1.0.0 | 2026-10-20 | RAO: `RAO:metabolic:20261020:001`*