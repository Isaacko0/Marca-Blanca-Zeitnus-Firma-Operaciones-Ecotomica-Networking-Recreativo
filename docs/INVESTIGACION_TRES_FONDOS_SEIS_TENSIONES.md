# INVESTIGACIÓN EXHAUSTIVA: TRES FONDOS + SEIS TENSIONES
## Inmortalidad Colectiva como Horizonte Operativo — Análisis Riguroso Repo Zeitnus + Evidencia Externa

**Versión:** 1.0.0 | **Fecha:** 2026-10-20 | **RAO:** `RAO:investigacion:20261020:001`
**Autor:** Isaac Ko (Isaacko0) + Hermes Agent
**Fuente primaria:** Repo `https://github.com/Isaacko0/Marca-Blanca-Zeitnus-Firma-Operaciones-Ecotomica-Networking-Recreativo` (939 archivos, 504 Markdown)
**Fuentes externas:** Chetty et al. JAMA 2016, Estrategia Salud Familia Brasil, FDA Geroscience, LGSC México, LFPDPPP 2025, Cooperativismo comparado

---

## RESUMEN EJECUTIVO: LO QUE EXISTE Y LO QUE FALTA

| Fondo | Estado en Repo | Implementación Real | Hueco Crítico |
|-------|---------------|---------------------|---------------|
| **Memoria** | ❌ Cero menciones | Solo Matema 7 (inmortalidad funcional), RAO/ERC-8004, Complete Data Package (Matema 18) | No hay Fondo Comunitario con propósito `memory`, no hay protocolo consentimiento/curaduría biografías |
| **Cuidado** | ✅ Parcial (`nodos_cuidado_integration.md`) | 8 estados, 12 indicadores, 4 exclusiones, `health_access` propósito, healthcare levels 0–3, LongevityVesting (solo en doc Kurzweil) | Marco legal argentino, no adaptado a México; LongevityVesting no en código |
| **Autotrofia** | ✅ Skill `hscsg-autotrofia-disenador` | 7 generaciones, secuencia crítica agua→alimento→energía→salud→hábitat, vectores AUT_* | Enum propósitos tiene suelo/agua/energía/vivienda **pero no alimentación explícita** |

**Vehículo financiero:** Existe en **papel** (`openspec/specs/alrac-tq-taxEngine.md`):
- Fondo Comunitario Regenerativo con gobernanza (5% proponer, 60% quórum, 20% máx/propuesta)
- Se nutre de `β_crit` (redistribuye 50% exceso sobre 30% liquidez)
- En código: `src/core/lib/tq.ts` tiene `createCommunityFund()` pero **`applyBetaCrit` es TODO**

**Inconsistencias documentadas:**
- `gaia_metaplatform_integration.md`: "Fondo Solarpunk 25% excedentes **ya implementado**" → **FALSO**: `solarpunk.ts` no tiene reglas de excedente
- `COLABORACION_TRIPARTITA...md`: dos versiones distribución 50/30/10/5/5 (una con 5% fondo tierra, otra con 30%)

**Estado real:** README marca líneas A–E como "Pendiente Paso II" → **excedente fiat = 0 hoy**

---

## SEIS TENSIONES: ANÁLISIS RIGUROSO CON EVIDENCIA

### 1. Inmortalidad vs. Amortalidad (Tensión Ontológica)

**Evidencia repo:**
- **Matema 7** → "Muerte como problema técnico resoluble", "tu capacidad sigue siendo usada", "reputación se hereda"
- **Matema 16** → "Toda civilización que pretende ser infinita miente", federación por mitosis, Gödel aplicado
- **Matema 18** → "Reversibilidad: nada irreversible excepto la muerte", Complete Data Package, derecho a irse
- **VITAL_TIME_CURRENCY_SPEC.md** → `hr_vital` **no heredable**, muerte devuelve tiempo al pool

**Evidencia externa:**
- Catherine Mayer (2011) acuñó "amortality" = vivir sin edad, no reconocer muerte
- Matema 7 usa término en sentido distinto (no negación, continuidad funcional)

**Resolución requerida — Tres capas separadas:**
| Capa | Qué es | Fondo | Métrica |
|------|--------|-------|---------|
| **Muerte prematura evitable** | Cuidado preventivo, salud comunitaria, autotrofia base | Cuidado + Autotrofia | Mortalidad evitable, esperanza de vida saludable |
| **Extensión vida sana** | Geroterapia no patentable, ensayos éticos (TAME), biomarcadores | Cuidado (solo vía comité ética) | Reducción edad biológica validada clínicamente |
| **Continuidad memorial** | Reputación ERC-8004, obras OAD, archivo vivo con consentimiento revocable | Memoria | % consentimiento vigente, restauración archivo probada |

> **El Fondo de Cuidado persigue longevidad biológica, Matema 7 es continuidad funcional. Separar evita confusión categoría.**

---

### 2. Herencia (Tensión Jurídica)

**Conflicto directo en código/docs:**
| Fuente | Regla |
|--------|-------|
| **Matema 7** | "Reputación se hereda", ERC-8004 heredable |
| **VITAL_TIME_CURRENCY_SPEC.md** | `hr_vital` **no heredable**, muerte → retorno al pool |
| **Matema 18** | Complete Data Package heredable, RAO inmutable |
| **LGSC (México)** | Fondo previsión social puede cubrir gastos médicos/funeral, **independiente de seguridad social** |

**Decisión que debe fijar Asamblea:**
- **¿Qué se hereda?** → Obra, memoria, reputación (ERC-8004), Complete Data Package
- **¿Qué NO se hereda?** → `hr_vital` (tiempo vital), ZNU (demurrage), TQ (límites ±500)
- **Mecanismo:** Cláusula heredabilidad explícita en estatutos cooperativa, separando *patrimonio memorial* de *patrimonio monetario*

---

### 3. Memoria vs. Reversibilidad (Tensión Técnico-Legal)

**Matema 18 + RAO:** Derecho a irse con **todos tus datos**, RAO inmutable
**LFPDPPP (México, vigente 21 mar 2025):** Datos salud, genéticos, creencias, opiniones = **sensibles**, requieren **consentimiento expreso y escrito**, autoridad = Secretaría Anticorrupción y Buen Gobierno

**Problema:** Un "archivo vivo" con entrevistas/biografías necesita:
- Consentimiento **revocable** (no inmutable)
- Datos personales **fuera del ledger** (solo hashes/punteros en RAO)
- Derecho al olvido compatible con RAO append-only

**Solución técnica (ya en `VITAL_TIME_CURRENCY_SPEC.md`):**
```typescript
// RAO ancla solo hash/puntero, datos personales en almacenamiento cifrado off-chain
// Consentimiento = credencial VC revocable (ERC-8004 + W3C VC)
// Retiro = revocación VC + borrado datos personales, hash queda en RAO como prueba de existencia previa
```

---

### 4. "Excedente" Sin Unidad (Tensión Contable)

**Cuatro cosas distintas en repo:**
| Tipo | Unidad | Dónde | Auditable? |
|------|--------|-------|------------|
| Excedente termodinámico | kWh | `tq.ts` LandRegistry, EnterpriseStaking | ✅ Físico |
| β_crit (exceso liquidez TQ) | TQ | `tq.ts` applyBetaCrit (TODO) | ✅ Si implementado |
| "Excedentes autómata" 25% | % abstracto | `gaia_metaplatform_integration.md` (afirmación falsa) | ❌ No existe en código |
| Excedente neto fiat | USD/MXN | `caas.ts` streams usdcIn, `valueDual.ts` priceParity | ✅ Contable |

**Regla de oro:** Un porcentaje fijo **solo es auditable si se dice sobre cuál**.
- **Propuesta:** Definir `ExcessUnit = 'thermodynamic_kWh' | 'tq_liquidity' | 'fiat_net'` en cada asignación
- El % fijo del principio debe aplicarse a **excedente neto fiat** (único con realidad jurídica hoy), con cláusula de activación primer contrato real

---

### 5. Prohibición a No-Miembros (Tensión de Modelo de Negocio)

**Conflicto real:**
- Líneas A–E venden a cooperativas, municipios, ONG (no-miembros actuales)
- Nodo Llave en Mano / Revenue Demo / turismo podrían incluir módulo salud
- "Afiliado" vs "Miembro" vs "No-miembro" sin definir

**Evidencia externa — Derecho cooperativo comparado:**
| País | Regla excedentes no-miembros |
|------|------------------------------|
| **México (LGSC)** | Fondo previsión social = % ingresos netos fija Asamblea, cubre gastos médicos/funeral, **independiente de seguridad social** |
| **España** | ≥50% beneficios extracooperativos → reserva obligatoria |
| **Uruguay** | 10% reserva por operaciones con no socios |

**Alternativa a prohibición total (más robusta):**
- **Permitir a no-miembros a costo** + **100% excedente generado → tres fondos**
- Define: "servicio de longevidad" = intervenciones biomédicas con claim extensión vida; "lucro" = margen > costo real + reinversión fondos

---

### 6. OAD ≠ Licencia (Tensión Jurídica Epistémica)

**En repo:**
- **OAD** = Open Access Design (diseño certificado, Integral Collective)
- Capa normativa = **CC0 + Responsible Use Rules**
- **OAD no es licencia**, es certificación de diseño

**Para conocimiento biomédico (tres capas separadas):**
| Qué | Régimen | Ejemplo |
|-----|---------|---------|
| **Conocimiento** (paper, protocolo, método) | Licencia abierta (CC BY 4.0 / MIT / Apache 2.0) | Paper geroterapia, protocolo ensayo |
| **Datos personales** (salud, genómicos, biométricos) | **Nunca abiertos** — solo agregados anonimizados k-anonymity ≥5, consentimiento LFPDPPP | Datos pacientes ensayo |
| **Materiales/muestras** (tejidos, compuestos, cepas) | **No se publican** — MTA (Material Transfer Agreement) + Nagoya Protocol | Muestras biobanco |

> **Mezclar OAD con licencia de datos biomédicos es error categoría. Separar tres planos.**

---

## EVIDENCIA EXTERNA CLAVE (Validación/Corrección)

| Hallazgo | Implicación para Diseño |
|----------|-------------------------|
| **Chetty et al. (JAMA 2016)**: Brecha esperanza vida 1% vs 1% pobre = 14.6a (H), 10.1a (M). Desigualdad creció. | Valida premisa: pobreza acorta vida. Pero: en cuartiles pobres, variación geográfica correlaciona con **conductas salud** (tabaquismo), no significativamente con acceso atención médica. → **Autotrofia + apoyo conductual pesan tanto como atención clínica** |
| **Estrategia Salud Familia (Brasil)**: Mayor intensidad → menor mortalidad condiciones sensibles atención primaria (HTA, DM, IC). Equipos: médico, enfermera, auxiliar, 4-6 agentes comunitarios. En Bagé, redujo desigualdades mortalidad adultos mayores. | **Modelo concreto para Fondo de Cuidado**: compra equipos salud familiar comunitarios, no solo clínicas |
| **FDA no reconoce envejecimiento como indicación independiente**. No consenso criterio valoración ensayos geroscientíficos prevención. KPI "reducción edad biológica" (Eje III Gaia) **sin validación clínica sólida**. Caso TAME: obstáculo principal = metformina genérica, ninguna farma gana dinero. | Fondo Cuidado **no debe comprar "longevidad" no validada**. Solo: prevención primaria comunitaria + ensayos con comité ética priorizando no patentable |
| **LFPDPPP México (2025)**: Datos salud futuros, genéticos, creencias, opiniones = sensibles. Consentimiento expreso escrito. Autoridad = Secretaría Anticorrupción. **No verificado régimen datos fallecidos**. | Fondo Memoria necesita legal review: consentimiento heredero vs derecho olvido fallecido |
| **Cooperativismo mexicano**: 3 fondos sociales (reserva 10-20%, educación ≥1%, previsión social % fija Asamblea). Fondo previsión = gastos médicos/funeral, **independiente seguridad social**. | Fondo Cuidado ≈ **Fondo Previsión Social**; Fondo Memoria ≈ **Fondo Educación**; Autotrofia **no tiene análogo directo** |

---

## REESCRITURA RIGUROSA DEL PUNTO (VERSIÓN PARA ESTAMENTO)

### Principio (alcance declarado)
> La inmortalidad será colectiva o no será. La red garantiza que **nadie muera antes de tiempo por falta de medios**, y la extensión de vida solo se persigue si es **compartible y no patentable**. La muerte con pobreza es un modelo de negocio; la muerte sin pobreza es un problema de ingeniería que resolvemos en tres capas: muerte prematura evitable, extensión vida sana validada, continuidad memorial con consentimiento.

### Mecanismo (operativo, antifrágil)

**Capa Fiat (excedente neto real, activación primer contrato):**
- % fijo del excedente neto fiat (definido en estatutos, suelo inmodificable por Asamblea)
- Cláusula de arranque: se activa con primer contrato real (líneas A–E)
- Propósito bloqueado por fondo (no fungible entre fondos)

**Capa TQ (extender Fondo Comunitario `alrac-tq-taxEngine.md`):**
```typescript
// En FundAllocation.purpose añadir:
type FundPurpose = 
  | 'soil_regeneration' | 'water_infrastructure' | 'energy_sovereignty'
  | 'housing_regenerative' | 'health_access' | 'education' | 'emergency'
  | 'memory'           // ← NUEVO: archivo vivo, biografías, consentimiento
  | 'food'             // ← NUEVO: autotrofia alimentaria explícita
  | 'preventive_care'  // ← NUEVO: equipos salud familiar, no geroterapia
```

**Cuidado = Prevención primaria comunitaria primero:**
- Equipos salud familiar (médico, enfermera, auxiliar, 4-6 agentes comunitarios) — modelo Brasil
- 12 indicadores Nodos Cuidado + 4 exclusiones (vacunación, parto, certificación, internación)
- Geroterapia **solo** vía ensayos con comité ética, priorizando moléculas no patentables (metformina, etc.)

**No-miembros — Dos opciones (Asamblea elige):**
1. **Prohibición** + definiciones precisas (miembro = stake ZNU ≥ Aprendiz + AUT≥0.2 + CDS≥0.2; servicio longevidad = claim extensión vida; lucro = margen > costo real)
2. **Permitir a costo real** + 100% excedente generado → tres fondos

### Métricas (proceso + resultado + equidad + apertura + memoria)

| Dimensión | Métrica | Fórmula |
|-----------|---------|---------|
| **Proceso** | Cobertura efectiva cuidado preventivo | % miembros con acceso real a equipo salud familiar (no solo "derecho") |
| **Resultado** | Mortalidad evitable + Esperanza vida saludable | Datos laboratorio + autodiagnóstico 14 dim + PGS |
| **Equidad** | Brecha niveles (Afiliados/Asociados/Núcleo) | Ratio esperanza vida saludable N3/N1 — **esto hace "colectiva" la inmortalidad** |
| **Apertura** | Avances publicados abiertos | Denominador "avance" = papers/protocolos/datos anonimizados con licencia + fecha |
| **Memoria** | Consentimiento vigente + Restauración probada | % biografías con consentimiento activo + test restauración archivo/año |

### Matema (corregido vs Matema 16)
> "Extender la vida no es ambición: es **tejer redes de cuidado que sobrevivan a quienes las tejen**."

---

## DECISIONES QUE DEBE FIJAR LA ASAMBLEA (No delegables a código)

1. **Porcentaje fijo + suelo estatutario** del excedente neto fiat a tres fondos
2. **Unidad de "excedente"** sobre la que se aplica el % (fiat neto / TQ β_crit / kWh termodinámico)
3. **Definición de "miembro"** para acceso a cuidado (stake ZNU + AUT + CDS umbrales)
4. **Régimen de herencia:** qué se hereda (obra, memoria, reputación ERC-8004, Complete Data Package) y qué no (hr_vital, ZNU, TQ)
5. **Régimen de datos salud/memoria:** consentimiento revocable, datos personales off-ledger, LFPDPPP compliance, datos fallecidos
6. **Opción no-miembros:** prohibición con definiciones vs permiso a costo + 100% excedente a fondos

---

## PRÓXIMOS PASOS ACCIONABLES (Para implementar en repo)

| Acción | Archivo/Ubicación | Tipo |
|--------|-------------------|------|
| Extender `FundAllocation.purpose` con `memory`, `food`, `preventive_care` | `openspec/specs/alrac-tq-taxEngine.md` + `src/core/lib/tq.ts` | Spec + Código |
| Implementar `applyBetaCrit()` real (no TODO) | `src/core/lib/tq.ts` | Código P0 |
| Añadir `food` a enum propósitos autotrofia | `src/core/lib/tq.ts` `FundAllocation.purpose` | Código |
| Crear `src/core/lib/memory_fund.ts` con protocolo consentimiento revocable + RAO hashes | Nuevo módulo | Código |
| Crear `src/core/lib/care_fund.ts` con modelo equipos salud familiar (Brasil) + 12 indicadores | Nuevo módulo | Código |
| Adaptar marco legal Nodos Cuidado a México (LGSC, LFPDPPP, COFEPRIS) | `docs/nodos_cuidado_integration.md` → nuevo `docs/nodos_cuidado_mexico.md` | Doc legal |
| Definir "miembro", "servicio longevidad", "lucro" en estatutos cooperativa | `docs/ESTAMENTO.md` + estatutos | Gobernanza |
| Separar tres planos OAD/conocimiento/datos/materiales en política biomédica | `docs/BIOMEDICAL_OPEN_POLICY.md` (crear) | Doc legal |

---

## LIMITES DE ESTA INVESTIGACIÓN

1. **Búsqueda por palabras clave** en 939 archivos — solo leí con detalle los citados
2. **Fuente TAME 2026 bloqueada** — no pude verificar estado actual ensayo
3. **Régimen datos fallecidos LFPDPPP no verificado** — requiere asesoría legal
4. **COFEPRIS servicios salud/longevidad no verificado** — requiere asesoría legal
5. **Evidencia Chetty = EE.UU. correlacional**; **Brasil = observacional** — no causalidad directa

---

## VASOS COMUNICANTES ACTIVADOS

| Skill | Qué fluye |
|-------|-----------|
| `hscsg-asamblea-gobernanza` | Decisiones D1-D8 + parámetros mutables + templates + scripts |
| `hscsg-monetary-integration` | v1.7 registra principios + métodos reparto centralizados |
| `hscsg-coeficiente-autonomia` | AUT/CDS umbrales D3 + métricas equidad |
| `hscsg-sistema-alraico` | γ-CARMIS + LDFV + β_crit + Matemas 7/16/18 |
| `hscsg-document-architect` | `ESTAMENTO.md` ↔ `asamblea-parametros.json` sincronizados |

---

*Documento generado como parte de la skill `hscsg-asamblea-gobernanza` v1.0.0*
*Investigación citada en `docs/ESTAMENTO.md` y `monetary-integrations.md` v1.7*