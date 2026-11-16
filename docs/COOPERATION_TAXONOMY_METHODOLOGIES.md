# Recopilatorio e Indagatorio: Formas de Cooperación entre Individuos y Figuras Jurídicas en el Repositorio HSCSG / Zeitnus / ALRAC

> **Versión**: 15.0 | **Fecha**: 2026-11-06 | **Autor**: Isaac Ko (Isaacko0)
> **Repositorio**: https://github.com/Isaacko0/Marca-Blanca-Zeitnus-Firma-Operaciones-Ecotomica-Networking-Recreativo
> **Licencia**: Apache-2.0 (con secciones MPL-2.0 / CC0 según componente)

---

## Índice

1. [Marco Conceptual: La Taxonomía de la Cooperación en HSCSG/Zeitnus/ALRAC](#1-marco-conceptual-la-taxonomía-de-la-cooperación-en-hscsgzeitnusalrac)
2. [Catálogo Exhaustivo de Formas de Cooperación Identificadas](#2-catálogo-exhaustivo-de-formas-de-cooperación-identificadas)
3. [Indagación Profunda por Cada Forma](#3-indagación-profunda-por-cada-forma)
4. [Metodologías Generadas para Cada Forma](#4-metodologías-generadas-para-cada-forma)
5. [Arquitectura de Composición: Cómo Combinan Estas Formas](#5-arquitectura-de-composición-cómo-combinan-estas-formas)
6. [Riesgos, Límites y Contraindicaciones](#6-riesgos-límites-y-contraindicaciones)
7. [Próximos Pasos: Validación Empírica](#7-próximos-pasos-validación-empírica)

---

## 1. Marco Conceptual: La Taxonomía de la Cooperación en HSCSG/Zeitnus/ALRAC

### 1.1 Principio Organizador: Transducción, No Absorción

> **ALRAC**: *"La salida alráica no es acordar, es transducir: un funtor que traslada estructuras entre dominios sin que ninguno se convierta en el otro."*

Esta es la **regla meta** que rige todas las formas de cooperación en el repositorio:

| Enfoque Tradicional | Enfoque HSCSG/Zeitnus/ALRAC |
|---------------------|----------------------------|
| **Absorción**: Una entidad absorbe a otra, impone su moneda/plataforma/vocabulario | **Transducción**: Funtor que traduce entre dominios sin que ninguno se convierta en el otro |
| **Jerarquía**: Una capa gobierna a las demás | **Anti-absorción**: Contrato de no absorción — ninguna capa exige a otra adoptar su unidad de cuenta, licencia o vocabulario |
| **Uniformidad**: Un modelo para todos | **Encaje contextual**: El 𝕮-Atlas mapea 7 modelos económicos con su αʰ típico; la respuesta honesta puede ser "no necesitan nodo TQ, necesitan cooperativa normal" |
| **Contrato único** | **Capas separadas, dueños separados**: 5 capas, 5 dueños, cero absorción |

### 1.2 Las Tres Leyes del Materialismo Jerárquico (Filtro de Isomorfismo)

Toda forma de cooperación debe pasar el filtro de las **Tres Leyes**:

| Ley | Enunciado | Aplicación a Cooperación |
|-----|-----------|--------------------------|
| **Ley I** | No dañar base material / personas | La cooperación no extrae, no crea dependencia, no monopoliza medios de producción |
| **Ley II** | Ganarse la vida soberanizando = AUT × CDS | Autonomía (soberanía sobre medios) × Contribución Digital Soberana (aportar al común) |
| **Ley III** | Lucidez, nunca engañar | Transparencia total: ledger append-only, reglas como código, métricas verificables |

### 1.3 Los Seis Primitivos CaaS (Vasos Comunicantes Obligatorios)

Toda forma de cooperación debe conectar a estos **seis primitivos** — no se inventan nuevos por cada caso:

| Primitivo | Archivo | Función en Cooperación |
|-----------|---------|------------------------|
| `caas-credits.ts` | Créditos CaaS | Earning/spending unificado (energía, automatización, bio, acceso, reciprocidad, expansión, longevidad) |
| `identity-rao.ts` | RAO Attribution | Procedencia, emisor, permisos, estado, revocación — atribución inmutable |
| `governance-triads.ts` | Triadas base-3 | Verificación triaxial (mental/simulación/laboratorio) como árbitro de disputas |
| `value-dual.ts` | Value Dual | ZNU/USD priceParity, nodeMode — render decide etiqueta, lógica agnóstica a unidad |
| `autonomy-guard.ts` | Autonomous Guard | Offline-first garantizado — operación continua pese a fallos/desconexión |
| `consensus-gossip.ts` | Consensus Gossip | Mesh sync: TQ ledger, bio-métricas, cultural sync, inventory, rule propagation |

---

## 2. Catálogo Exhaustivo de Formas de Cooperación Identificadas

### 2.1 Mapa General (17 Formas Identificadas)

| # | Forma de Cooperación | Tipo | Entidades Involucradas | Documento Fuente | Estado |
|---|----------------------|------|------------------------|------------------|--------|
| **1** | **Crédito Mutuo Bilateral (Trustlines)** | Económica/Financiera | Individuo ↔ Individuo / Nodo ↔ Nodo | `trustlines_integration.md`, `alrac-tq-exchangeGuard.md` | ✅ Implementado (lib/trustlines.ts) |
| **2** | **Cinta Métrica de Reciprocidad (TQ Ledger)** | Contable/Metabólica | Nodo ↔ Nodo / Individuo ↔ Colectivo | `alrac-tq-exchangeGuard.md`, `alrac-architecture.md` | ✅ Implementado (lib/energy-accounting.ts) |
| **3** | **Cosatecas / Economía de Acceso** | Productiva/Logística | Individuo ↔ Colectivo / Nodo ↔ Nodo | `ZEITNUS_UMBRAL_72H...`, `BRIEF_EXHAUSTIVO...` | 🔄 Diseño (lib/cosatecas-registry.ts planificado) |
| **4** | **Mesh Offline-First / Gossip Protocol** | Técnica/Comunicativa | Nodo ↔ Nodo (mesh tolerante a desconexión) | `mesh-network.ts`, `consensus-gossip.ts` | 🔄 Diseño (lib/mesh-network.ts planificado) |
| **5** | **Gobernanza por Triadas Base-3 (Triaxial)** | Política/Decisoria | 3 agentes (mental/simulación/lab) | `governance-triads.ts`, `alrac-architecture.md` | 🔄 Diseño (lib/governance-triads.ts planificado) |
| **6** | **Secesión Lucrativa Organizacional (SLO)** | Jurídica/Económica | Individuo ↔ Organización / Nodo ↔ Red | `ZEITNUS_UMBRAL_72H...`, `secession-protocol.ts` | 🔄 Diseño (lib/secession-protocol.ts planificado) |
| **7** | **Fidelidad Retroalimentativa (FR)** | Relacional/Comportamental | Individuo ↔ Red / Nodo ↔ Nodo | `fidelity-loop.ts`, `ZEITNUS_UMBRAL_72H...` | 🔄 Diseño (lib/fidelity-loop.ts planificado) |
| **8** | **Sucesión por Mitosis Organizacional (MSL-IOI)** | Estructural/Generacional | Nodo Maduro → Nodo Hijo | `succession-protocol.ts`, `ZEITNUS_UMBRAL_72H...` | 🔄 Diseño (lib/succession-protocol.ts planificado) |
| **9** | **Handshake Universal (Kit 72H)** | Protocolar/Experiencial | Isla A ↔ Isla B (experiencia compartida 72h) | `ZEITNUS_UMBRAL_72H...` | 🔄 Diseño (Kit 72H PMV) |
| **10** | **Crédito Mutuo + Asamblea (Trustlines + Gov)** | Híbrida Económica-Política | Nodo (crédito mutuo bilateral + asamblea) | `alrac-tq-exchangeGuard.md`, `ALRAC_consortium_model.md` | ✅ Diseño |
| **11** | **Cooperativa de Trabajo Asociado (Membrana Fiat)** | Jurídica/Laboral | Individuos → Cooperativa (1 asociado = 1 voto) | `ALRAC_consortium_model.md`, `ALRAC_consortium_model_complete.md` | 🔄 Diseño (Capa 3 ALRAC) |
| **12** | **Fideicomiso Comunitario Indivisible + Cooperativa** | Propiedad/Tierra | Comunidad → Fideicomiso + Coop | `ALRAC_consortium_model.md`, `ALRAC_consortium_model_complete.md` | 🔄 Diseño |
| **13** | **Convenio de No Absorción / Transducción** | Meta-jurídica/Ética | Capa A ↔ Capa B (cero absorción) | `ALRAC_consortium_model.md`, `ALRAC_consortium_model_complete.md` | ✅ Principio |
| **14** | **Verificación Triaxial (Mental/Sim/Lab)** | Epistémica/Técnica | 3 árbitros independientes | `governance-triads.ts`, `ALRAC_consortium_model.md` | 🔄 Diseño |
| **15** | **γ-CARMIS (Reconfiguración vs Ruptura)** | Resolución Conflictos | ΣPᵢ > κ → reconfigurar antes de salir | `ALRAC_consortium_model.md` | ✅ Principio |
| **16** | **Economía del Regalo / Gift Economy** | Cultural/Relacional | Festival convergencia, bancos tiempo lúdico | `recreative-networking.ts`, `ZEITNUS_UMBRAL_72H...` | 🔄 Diseño |
| **17** | **Autotrofía Territorial (7 Generaciones)** | Productiva/Ecológica | Territorio → Comunidad → Bioregión | `bio-production.ts`, `ecotomic-engine.ts` | 🔄 Diseño |

---

## 3. Indagación Profunda por Cada Forma

### 3.1 Crédito Mutuo Bilateral (Trustlines) — Forma Base Económica

**¿Qué es?**  
Red de líneas de crédito bilaterales donde los pares se otorgan crédito mutuo sin emisor central. La deuda es simétrica (`getDebt(a,b) = -getDebt(b,a)`) y las transferencias se enrutan por la red de confianza (`debitTransfer`).

**Origen**: Trustlines Protocol (Solidity/EVM) → Asimilado como lógica pura en `lib/trustlines.ts` sin EVM.

**Entidades**: Individuo ↔ Individuo, Nodo ↔ Nodo, Colectivo ↔ Colectivo.

**Reglas de Cooperación**:
- Crédito nace de **confianza mutua** (Web of Trust del Solarpunk), no de colateral especulativo
- **Sin emisor central** → soberanía monetaria distribuida (Ley II)
- Interés **regenerativo**, no extractivo (Ley I)
- Transferencias enrutadas por red → **resiliencia** (si un par cae, ruta encuentra otro)

**Mecanismo Técnico** (`lib/trustlines.ts`):
```typescript
// Estado
trustlines: Map<pair, {creditGiven, creditReceived, interestRate}>
debts: Map<pair, value>  // bilateral, simétrico
transfers: DebitTransfer[]  // historial enrutado

// Operaciones
getDebt(a,b)  // simétrico
increaseDebt/reduceDebt
openTrustline(a,b,given,received,rate)
debitTransfer(path, value, maxFee)  // acreedor inicia, enruta por red
```

**Isomorfismo con Leyes MJ**:
| Trustlines | HSCSG (MJ) |
|------------|------------|
| Creditline por confianza | Ley III: Lucidez + Web of Trust |
| Deuda bilateral, sin emisor central | Ley II: Soberanía, nadie extrae por intermediación |
| Interés no usura / equilibrio | Ley I: No dañar; regenerar, no extraer |

**Figuras Jurídicas Compatibles**:
- Acuerdo privado entre partes (civil law)
- Contrato de crédito mutuo (código civil)
- DAO off-chain / gobernanza algorítmica
- **No requiere**: Entidad financiera regulada, banco central, stablecoin

---

### 3.2 Cinta Métrica de Reciprocidad (TQ Ledger) — Forma Base Contable

**¿Qué es?**  
Libro contable biofísico donde **1 TQ = 1 kWh**. Unidad de cuenta = trabajo útil verificable. No acumulable (techo ±500), decay obligatorio (Postulado 4).

**Entidades**: Nodo ↔ Nodo, Individuo ↔ Colectivo, Colectivo ↔ Federación.

**Reglas de Cooperación**:
- **Prohibición cambiaria**: TQ jamás toca fiat ni cripto (Capa 1 ALRAC)
- **No acumulable**: Techo simétrico ±500, decay obligatorio → anti-acaparamiento
- **Cinta métrica, no reserva**: Mide reciprocidad, no almacena valor
- **Tipos de transacción permitidos**: `reciprocity`, `production`, `regeneration` — **nunca** `exchange`

**Mecanismo Técnico** (`lib/energy-accounting.ts`, `alrac-tq-exchangeGuard.md`):
```typescript
// Tipos de transacción VÁLIDOS
type TQTxType = 'reciprocity' | 'production' | 'regeneration'

// Verificación
verifyTQProhibition(tx) = tx.type ∈ ['reciprocity','production','regeneration']

// Límites
account.balance ∈ [-500, +500]  // TQ
decayRate = obligatorio  // Postulado 4
```

**Figuras Jurídicas Compatibles**:
- Libro contable interno (no regulado como entidad financiera)
- Registro de trueque / reciprocidad (ley de trueque en algunas jurisdicciones)
- **No es**: Moneda, valor almacenado, instrumento financiero regulado

---

### 3.3 Cosatecas / Economía de Acceso — Forma Productivo-Logística

**¿Qué es?**  
Bibliotecas de objetos y herramientas de uso compartido. Sustituye **propiedad privada por acceso distribuido**. Activos registrados en red offline-first, contabilidad energética (TQs), amortización por uso real.

**Entidades**: Individuo ↔ Colectivo, Nodo ↔ Nodo, Cosateca ↔ Cosateca (federadas).

**Reglas de Cooperación**:
- **Acceso distribuido**: Nadie monopoliza herramientas; uso compartido con registro TQ
- **Amortización por uso real**: Activos se deprecian en TQs según uso real, no tiempo
- **Inventarios auditables por malla**: Registro en red offline-first, sincronización gossip
- **Amortización TQ por uso**: `amortization = usage_hours * TQ_per_hour`

**Mecanismo Técnico** (`lib/cosatecas-registry.ts` planificado):
```typescript
interface SharedAsset {
  id, name, category, location, condition
  tqAmortizationRate, totalTQAmortized
  currentHolder, usageLog[]
}

interface CosatecasRegistry {
  assets: SharedAsset[]
  amortizeTQ(assetId, usageHours)
  auditInventory()  // sync via gossip
  retainAccess(secedingMember)  // SLO: 100% retention
}
```

**Figuras Jurídicas Compatibles**:
- Asociación civil / asociación de hecho
- Cooperativa de consumo (acceso a bienes)
- Asociación de trueque / banco de tiempo
- Contrato de comodato / préstamo de uso (civil code)
- **No requiere**: Propiedad privada exclusiva, registro mercantil complejo

---

### 3.4 Mesh Offline-First / Gossip Protocol — Forma Técnico-Comunicativa

**¿Qué es?**  
Red tolerante a desconexión (delay-tolerant) con **gossip protocols** y **mTLS mutuo**. Persistencia operativa sin internet constante. Sincronización eventual, store-and-forward.

**Entidades**: Nodo ↔ Nodo (pares), Nodo ↔ Federación.

**Reglas de Cooperación**:
- **Soberanía de comunicaciones**: Nadie controla la infraestructura (Ley II)
- **Resiliencia**: Si un nodo cae, la red continúa (Ley I)
- **Privacidad por diseño**: mTLS mutuo, sin metadatos centrales
- **Sincronización eventual**: Consenso eventual, no consenso fuerte

**Mecanismo Técnico** (`lib/mesh-network.ts`, `lib/consensus-gossip.ts`):
```typescript
interface MeshNode {
  id, publicKey, location, capabilities
  peers: MeshPeer[]
  gossipState: CRDTState
}

interface GossipMessage {
  type: 'state' | 'tq-ledger' | 'bio-metrics' | 'cultural' | 'rules'
  payload: any
  signature: Ed25519
  timestamp, ttl
}

// Validación de paso
meshSync <10s, mTLS handshake <5s, store-forward delivery 99.9%
```

**Figuras Jurídicas Compatibles**:
- Red punto a punto (p2p) — sin proveedor de servicios de telecom
- Asociación de operadores de red comunitaria
- **No requiere**: ISP, licencia de telecom, infraestructura centralizada

---

### 3.5 Gobernanza por Triadas Base-3 (Verificación Triaxial) — Forma Político-Decisoria

**¿Qué es?**  
Mecanismo de verificación donde **3 agentes independientes** (mental / simulación / laboratorio) contrastan una proposición. No se vota, se **contrasta**. Es el árbitro técnico de disputas.

**Entidades**: 3 agentes independientes (pueden ser humanos, IA, o híbridos) → Dictamen vinculante.

**Reglas de Cooperación**:
- **No votación**: No mayoría, no consenso — **contraste triaxial**
- **Independencia estricta**: Los 3 agentes no se comunican entre sí durante el proceso
- **Ámbito**: Disputas técnicas, validación de umbrales, auditoría de código, validación de métricas
- **Resultado**: Dictamen técnico, no opinión política

**Mecanismo Técnico** (`lib/governance-triads.ts`):
```typescript
interface TriadAgent {
  id, type: 'mental' | 'simulation' | 'laboratory'
  credentials, independenceProof
}

interface TriadVerdict {
  proposition: string
  mental: {analysis, confidence}
  simulation: {model, result, confidence}
  laboratory: {experiment, data, confidence}
  consensus: boolean  // los 3 coinciden en dirección
  dissent: string[]   // disensos registrados
}
```

**Aplicaciones en Repo**:
- Validación de umbrales (mitosis ≥0.85, canutricio pH≥8.5, temp=37°C)
- Auditoría de código / seguridad
- Resolución de disputas técnicas entre nodos
- Validación de métricas de federación

**Figuras Jurídicas Compatibles**:
- Peritaje técnico / dictamen pericial (código procesal)
- Arbitraje técnico (ley de arbitraje)
- **No es**: Votación, consenso, junta directiva, asamblea

---

### 3.6 Secesión Lucrativa Organizacional (SLO) — Forma Jurídico-Económica de Salida

**¿Qué es?**  
Mecanismo que permite a un individuo/nodo **salir de una organización/red** **ganando** capital bioenergético (TQs), no perdiéndolo. Invierte la inercia extractiva: la salida **libera y capitaliza** entropía ahorrada.

**Entidades**: Individuo ↔ Organización / Nodo ↔ Red Federación.

**Fases del Protocolo** (`lib/secession-protocol.ts`):
1. **Liquidación de Capital Metabólico (TQs)**: Conversión valor acumulado → TQs soberanos + reclamación cuota-parte cosatecas
2. **Transfusión de Infraestructura Modular**: Migración nodo personal (mTLS/mesh) + portabilidad activos técnicos y semillas
3. **Incentivo por Desconexión Eficiente**: Red **recompensa** secesión que crea sub-nodo más eficiente

**Reglas de Cooperación**:
- **Liquidación en TQs**, no fiat: Retorno entropía ahorrada = búfer energético garantizado (1 TQ=1 kWh)
- **Derecho de Malla en Cosatecas**: 100% retención de acceso a herramientas/maquinaria común
- **Migración Sovereign-First**: Portabilidad informática (mTLS, local-first, historial, modelos IA, grafos conocimiento)
- **Incentivo por Eficiencia**: Separarse para descentralizar = salto de rendimiento, no traición

**Contrato Cibernético SLO** (`secession-protocol.ts`):
```json
{
  "protocol": "SECESION_LUCRATIVA_ORGANIZACIONAL",
  "version": "15.0",
  "parameters": {
    "settlement_currency": "TQ_KWH",
    "cosateca_access_retention": "100%",
    "node_portability": "mTLS_LocalFirst",
    "fidelity_metric": "Net_Free_Time_Gain_Percentage",
    "auto_decouple_threshold": "Energy_Return_On_Investment < 1.0"
  }
}
```

**Figuras Jurídicas Compatibles**:
- Derecho de retracto / separación (ley cooperativa, ley asociaciones)
- Derecho de portabilidad de datos (GDPR Art. 20)
- Acuerdo de separación amistosa (civil code)
- **Innovación**: Liquidación en **unidad biofísica (TQ)**, no moneda fiat

---

### 3.7 Fidelidad Retroalimentativa (FR) — Forma Relacional de Permanencia

**¿Qué es?**  
Bucle de atracción cibernética: la permanencia en la red **no es obligatoria**, es **consecuencia de que la red devuelve más tiempo libre neto** que el aislamiento.

**Entidades**: Individuo ↔ Red, Nodo ↔ Federación.

**Bucle FR** (`lib/fidelity-loop.ts`):
```
[SOPORTE METABÓLICO CONTINUO] → [LEALTAD POR ABUNDANCIA BASE] → [RE-INYECCIÓN CÓDIGO/BIOMASA]
   (Nutrición + Energía + Infra)      (Sin Coerción Salarial)       (Mejora fotobioreactores,
                                                                    firmware, cosatecas)
```

**Métricas de Fidelidad** (`lib/fidelity-loop.ts`):
```typescript
interface FidelityMetrics {
  netFreeTimeGainPercentage: number  // tiempo libre neto vs aislamiento
  energyReturnOnInvestment: number   // EROI
  reciprocityContribution: TQ        // aporte código/biomasa/datos
}
```

**Reglas de Cooperación**:
- **Lealtad no coercitiva**: Si red deja de reducir trabajo alienante → algoritmo libera amarras automáticamente (EROI < 1.0)
- **Retroalimentación sintrópica**: Nodos secesionados aportan biomasa, código, datos
- **Red tolerante a fallos**: Gossip comparte descubrimientos/excedentes automáticamente

**Métrica de Auto-Decouple**:
```typescript
autoDecoupleThreshold = "Energy_Return_On_Investment < 1.0"
```

**Figuras Jurídicas Compatibles**:
- Acuerdo de permanencia voluntaria (no contrato de permanencia obligatoria)
- Acuerdo de nivel de servicio (SLA) mutualista
- **No es**: Contrato de permanencia obligatoria, cláusula de no competencia, penalización por salida

---

### 3.8 Sucesión por Mitosis Organizacional (MSL-IOI) — Forma Estructural-Generacional

**¿Qué es?**  
Redefinición de sucesión corporativa: no herencia jerárquica, sino **mitosis celular programada**. Cuando un nodo satura (load ≥ 0.85), se divide generando nodo hijo autónomo.

**Entidades**: Nodo Maduro (Padre) → Nodo Hijo (Autónomo) → Federación.

**Fases MSL-IOI** (`lib/succession-protocol.ts`):
1. **Mitosis Organizacional**: Umbral `Node_Capacity_Load ≥ 0.85` → división programada
2. **Integración Recreativa Civilizatoria**: Festivales convergencia, bancos tiempo lúdico, cocreación
3. **Sucesión Lucrativa**: Traspaso gobernanza sin fricción + expansión biocomún

**Reglas de Cooperación**:
- **Herencia limpia**: Infraestructura autosuficiente (fotobioreactores, mesh, cosatecas) — no deuda, no pasivos
- **Relevo rotacional**: Por contribución metabólica, no antigüedad ni capital
- **Gobernanza transferida**: Triadas rotacionales por contribución metabólica
- **Networking gift economy**: Festivales convergencia, bancos tiempo lúdico, cocreación

**Protocolo MSL-IOI** (`lib/succession-protocol.ts`):
```json
{
  "protocol": "MSL_IOI_SUCESSION",
  "version": "15.0",
  "rules": {
    "mitosis_trigger": "Node_Capacity_Load >= 0.85",
    "inheritance_type": "Modular_Infrastructure_Access",
    "governance_transfer": "Rotational_By_Metabolic_Contribution",
    "networking_mode": "Gift_Economy_And_Recreative_Symbiosis"
  }
}
```

**Figuras Jurídicas Compatibles**:
- Escisión societaria / spin-off (ley mercantil)
- Federación de cooperativas / confederación
- **Innovación**: Trigger **termodinámico** (load ≥ 0.85), no decisión política

---

### 3.9 Handshake Universal (Kit 72H) — Forma Protocolar-Experiencial

**¿Qué es?**  
Protocolo de federación donde **dos islas hacen la misma experiencia de 72h** y, al completarla, **hablan el mismo idioma metabólico**. No explica el paradigma; lo **hace necesario**.

**Entidades**: Isla A (ej. Zamora mesh+gov) ↔ Isla B (ej. Oaxaca bio+canutricio).

**Mecanismo**:
```
NODO A (Kit 72H A: mesh+gov)     NODO B (Kit 72H B: bio+canutricio)
       │                                  │
       ├── KIT 72H A                    ├── KIT 72H B
       │                                  │
       │     HANDSHAKE:                   │
       │     1. Intercambian Kit 72H      │
       │     2. Cada uno opera 72h del otro│
       │     3. Sincronizan TQ ledger     │
       │     4. Federan cosatecas mesh    │
       │     5. Crean NODO C híbrido      │
       ▼                                  ▼
[ZEITNUS FEDERADO: Capa 1+2+3+4+5+6+7]
```

**Regla de Oro**: **El Kit 72H no es un producto — es un protocolo de handshake.** No explica Zeitnus; **hace que Zeitnus sea necesario**.

**Primer Nodo Federado Objetivo**:
- **Zamora** (Mesh + Gov = Capa 2+6) + **Oaxaca/CDMX** (Bio + Canutricio = Capa 4+5)
- → Nodo Zeitnus completo (7 capas) en **<30 días** con hardware ya existente

---

### 3.10 Crédito Mutuo + Asamblea — Forma Híbrida Económico-Política

**¿Qué es?**  
Gobernanza dual: **crédito mutuo bilateral** (económico) + **asamblea de nodo 1 persona = 1 voto** (político).

**Entidades**: Nodo (miembros) ↔ Federación.

**Estructura** (`alrac-tq-exchangeGuard.md`, `ALRAC_consortium_model.md`):
- **Capa Económica**: Crédito mutuo bilateral (Trustlines) — bilateral, simétrico, sin emisor central
- **Capa Política**: Asamblea nodo — 1 asociado = 1 voto, cooperativa de trabajo asociado

**Regla de Separación**: **La prohibición cambiaria protege la asamblea**. El TQ nunca se cambia por fiat porque hay membrana jurídica entera (Cooperativa ZEITNUS, Capa 3) entre ambos.

---

### 3.11 Cooperativa de Trabajo Asociado (Membrana Fiat) — Figura Jurídica Puente

**¿Qué es?**  
Capa 3 del modelo ALRAC: **Cooperativa ZEITNUS** — personalidad jurídica, nómina, tierra, puente bancario. Un asociado = un voto. Valor respaldado por producción real.

**Función**: **Membrana fiat** — única capa que toca dinero convencional. Protege la prohibición cambiaria del TQ (Capa 1) por diseño jurídico, no por buena voluntad.

**Reglas**:
- **No captar ahorro** hasta año 2-3 con balance auditado (evita colapso clubes trueque argentinos)
- **Factura A-E** (Monotributo/IVA) — cooperativa trabajo asociado
- **Fideicomiso tierra** separado de operación
- **Puente bancario regulado** — cuenta corriente, nómina, facturación

**Figura Jurídica**: **Cooperativa de Trabajo Asociado** (Ley 27/1999 España / LGCT México / Ley 20.180 Chile / Ley 26.772 Argentina / etc.)

---

### 3.12 Fideicomiso Comunitario Indivisible + Cooperativa — Forma de Propiedad Colectiva

**¿Qué es?**  
Separación radical: **Tierra/Infraestructura** → Fideicomiso Comunitario Indivisible (no vendible, no hipotecable) + **Operación** → Cooperativa.

**Estructura** (`ALRAC_consortium_model.md`):
| Activo | Titularidad | Régimen |
|--------|-------------|---------|
| Tierra / Infraestructura base | Fideicomiso Comunitario Indivisible | Indivisible, inembargable, intransferible |
| Operación / Producción | Cooperativa de Trabajo Asociado | 1 asociado = 1 voto, reparto LDFV |
| Crédito / Reciprocidad | TQ Ledger / Trustlines | No acumulable, techo ±500 |

**Regla de Oro**: **La tierra no se vende, se stewarda**. El fideicomiso asegura que la base material nunca se convierte en activo financiero.

**Figuras Jurídicas**:
- **Fideicomiso civil / fiducia** (código civil) — patrimonio autónomo, finalidad comunitaria
- **Fundación / Asociación de utilidad pública** (si requiere personalidad jurídica separada)
- **Community Land Trust (CLT)** — modelo anglo adaptado a derecho civil
- **Cooperativa de vivienda / uso** (para infraestructura habitacional)

---

### 3.13 Convenio de No Absorción / Transducción — Meta-Contrato Ético-Jurídico

**¿Qué es?**  
Contrato marco que **prohíbe la absorción** entre capas/entidades. Ninguna capa puede exigir a otra adoptar su unidad de cuenta, licencia, vocabulario o gobernanza.

**Cláusulas Nucleares** (`ALRAC_consortium_model.md`):
```markdown
- **Contrato de no absorción**: ninguna capa puede exigir a otra que adopte su unidad de cuenta, su licencia o su vocabulario.
- **Verificación Triaxial como árbitro**: las disputas técnicas no se votan, se contrastan (mental / simulación / laboratorio).
- **γ-CARMIS en lugar de divorcio**: cuando ΣPᵢ > κ, el protocolo obliga a reconfigurar antes de permitir la salida.
- **Auditoría de licencias como primer entregable**: el vacío abierto se cierra *antes* de invitar a nadie.
```

**Principio**: **Transducción, no absorción**. Funtor que traduce entre dominios sin que ninguno se convierta en el otro.

---

### 3.14 Verificación Triaxial (Mental/Sim/Lab) — Forma Epistémica de Arbitraje

**¿Qué es?**  
3 agentes independientes (mental / simulación / laboratorio) contrastan una proposición técnica. **No se vota, se contrasta**.

**Aplicaciones**:
- Validación de umbrales (mitosis ≥0.85, canutricio pH≥8.5)
- Auditoría de código / seguridad
- Resolución disputas técnicas entre nodos
- Validación métricas de federación

**Protocolo** (`lib/governance-triads.ts`):
```typescript
interface TriadVerdict {
  mental: {analysis, confidence}
  simulation: {model, result, confidence}
  laboratory: {experiment, data, confidence}
  consensus: boolean  // los 3 coinciden en dirección
  dissent: string[]   // disensos registrados (no silenciados)
}
```

---

### 3.15 γ-CARMIS (Reconfiguración vs Ruptura) — Forma de Resolución de Conflictos Sistémicos

**¿Qué es?**  
Protocolo que **obliga a reconfigurar antes de permitir la salida** cuando la tensión sistémica supera el umbral crítico (ΣPᵢ > κ).

**Mecanismo** (`ALRAC_consortium_model.md`):
```
γ-CARMIS en lugar de divorcio:
  cuando ΣPᵢ > κ → 
    1. Diagnóstico AEI + 20 Límites
    2. Protocolo Escalonado (comunicación escalonada)
    3. γ-CARMIS: reorganización interna (reconfigurar roles, flujos, límites)
    4. Solo si falla → salida ordenada con SLO
```

**Principio**: **Reconfiguración antes que ruptura**. La salida (SLO) es último recurso, no primera opción.

---

### 3.16 Economía del Regalo / Gift Economy — Forma Cultural-Relacional

**¿Qué es?**  
Red de reciprocidad **no transaccional**. Festivales de convergencia, bancos de tiempo lúdico, cocreación. El "pago" es **contribución al metabolismo compartido**.

**Manifestaciones** (`recreative-networking.ts`, `ZEITNUS_UMBRAL_72H...`):
- **Festivales de convergencia simbiótica**: Robótica libre, cultivo algal, arquitectura bioclimática, creación artística
- **Bancos de tiempo lúdico**: Intercambio de horas de juego/experimentación
- **Cocreación**: Diseño conjunto de hardware, protocolos, biomarcadores
- **Festivales de handshake**: Cada isla opera 72h del kit de la otra

**Regla**: **No contabilidad contractual** — contabilidad metabólica (TQs, tiempo libre, biomarcadores).

---

### 3.17 Autotrofía Territorial (7 Generaciones) — Forma Productiva-Ecológica

**¿Qué es?**  
Capacidad de un territorio/comunidad para **sostener su metabolismo básico** (alimento, energía, agua, salud, herramientas) **sin inputs externos extractivos** durante **7 generaciones (175 años)**.

**Métricas** (`bio-production.ts`, `ecotomic-engine.ts`, `metabolic-matrix.ts`):
| Vector AUT | Métrica | Target 7 Gen |
|------------|---------|--------------|
| **ALIM** (Alimento) | Spirulina yield ≥15g/día/persona | 100% local |
| **ENER** (Energía) | Solar + biogás ≥需求 | 100% renovable local |
| **HABI** (Hábitat) | Materiales locales / bioconstrucción | ≥80% local |
| **AGUA** (Agua) | Ciclo cerrado + captación lluvia | 100% autónomo |
| **SALU** (Salud) | Canutriciotranshumanismo (3 umbrales) | Autónomo preventivo |

**Regla**: **No es autosuficiencia aislada** — es **autotrofía federada**: nodos autotróficos que se federan para resiliencia, no dependencia.

---

## 4. Metodologías Generadas para Cada Forma

### 4.1 Metodología Trustlines: "De Confianza a Crédito Mutuo"

**Objetivo**: Establecer red de crédito mutuo bilateral sin emisor central.

**Pasos**:
1. **Mapeo Web of Trust**: Cada miembro identifica 3-5 pares de confianza inicial
2. **Apertura de Trustlines**: `openTrustline(a,b,given,received,rate)` — límites simétricos
3. **Validación de Rutas**: `debitTransfer(path,value,maxFee)` — test de enrutamiento
4. **Monitoreo de Equilibrio**: `creditUsed(a,b) = deuda/creditline` — alertas >80%
5. **Reequilibrio Periódico**: Ajuste de `creditGiven/Received` según flujo real

**Métricas de Validación**:
- % transacciones enrutadas con éxito >95%
- Deuda media por trustline <30% límite
- 0 trustlines en default >90 días

---

### 4.2 Metodología TQ Ledger: "Contabilidad que Mide, No Acumula"

**Objetivo**: Operar libro contable biofísico donde 1 TQ = 1 kWh.

**Pasos**:
1. **Configuración de Cuentas**: Cada nodo/individuo → cuenta TQ con límites ±500
2. **Clasificación de Transacciones**: Solo `reciprocity`, `production`, `regeneration`
3. **Aplicación de Decay**: `decayRate` obligatorio (Postulado 4)
4. **Verificación de Prohibición**: `verifyTQProhibition(tx)` en cada escritura
5. **Auditoría Termodinámica**: `verifyTQtoKWH(ledger)` — conversión exacta 1:1

**Métricas de Validación**:
- 0 transacciones `exchange` en ledger
- 100% cuentas dentro de límites ±500
- Conversión TQ↔kWh exacta (drift <0.1%)

---

### 4.3 Metodología Cosatecas: "Acceso Distribuido, Registro Energético"

**Objetivo**: Operar biblioteca de herramientas con amortización en TQs por uso real.

**Pasos**:
1. **Inventario Inicial**: Registro de activos → `SharedAsset` con `tqAmortizationRate`
2. **Registro de Uso**: `usageLog` por préstamo → `amortizeTQ(assetId, usageHours)`
3. **Sincronización Malla**: `auditInventory()` via gossip protocol
4. **Retención en Secesión**: `retainAccess(secedingMember)` → 100% acceso retenido
5. **Federación Cosatecas**: `mergeCosatecas(registryA, registryB)` → inventario unificado

**Métricas de Validación**:
- % activos con uso registrado >80%
- Amortización TQ por uso real vs teórico <15% desviación
- 0 activos en desuso >180 días sin registro

---

### 4.4 Metodología Mesh/Gossip: "Comunicación que No Muere"

**Objetivo**: Red tolerante a desconexión con sincronización eventual garantizada.

**Pasos**:
1. **Bootstrap Nodo**: `MeshNode` + mTLS cert + peer discovery (DHT/local)
2. **Gossip Inicial**: `gossipState` CRDT + peer exchange
3. **Validación de Sync**: `meshSync <10s`, `mTLS handshake <5s`
4. **Store-and-Forward**: Cola de mensajes offline → reenvío al reconectar
5. **Federación Cross-Red**: `federationBridge` + `priceParity` TQ↔ZNU 1:1

**Métricas de Validación**:
- Mesh sync <10s en condiciones normales
- Store-and-forward delivery 99.9%
- 0 mensajes perdidos en partición de red <24h

---

### 4.5 Metodología Triadas: "Contraste, No Voto"

**Objetivo**: Resolver disputas técnicas y validar umbrales sin política.

**Pasos**:
1. **Selección de Triada**: 3 agentes independientes (mental/sim/lab) + prueba de independencia
2. **Planteamiento**: Proposición técnica clara + criterios de validación
3. **Análisis Independiente**: Cada agente produce análisis + confidence (0-1)
4. **Contraste**: Comparar direcciones → `consensus = all_same_direction`
5. **Registro de Disensos**: `dissent[]` — disensos registrados, no silenciados

**Métricas de Validación**:
- 100% disputas técnicas resueltas sin votación
- Tiempo medio resolución <72h
- 0 decisiones técnicas revertidas por presión política

---

### 4.6 Metodología SLO/FR: "Salida que Libera, Permanencia que Nutre"

**Objetivo**: Hacer que la salida libere capital y la permanencia sea consecuencia de abundancia.

**Pasos SLO**:
1. **Cálculo de Capital Metabólico**: `accumulatedTQ - consumedTQ = metabolicCapital`
2. **Liquidación en TQs**: `settlementTQ = metabolicCapital` (no fiat)
3. **Retención Cosatecas**: `cosatecaAccessRetention = 100%`
4. **Migración Nodo**: `migrateNode(mTLS, localFirst, dataPackage)`
5. **Incentivo Eficiencia**: `if newNodeEROI > oldNodeEROI → reward`

**Pasos FR**:
1. **Cálculo Continuo**: `netFreeTimeGain% = (freeTimeInNet - freeTimeIsolated) / freeTimeIsolated`
2. **Cálculo EROI**: `energyReturnOnInvestment = metabolicOutput / metabolicInput`
3. **Auto-Decouple**: `if EROI < 1.0 → autoDecouple()`
4. **Retroalimentación**: `contributeBack(biomass, code, data)`

**Métricas de Validación**:
- 100% secesiones con liquidación TQ exacta
- `netFreeTimeGain% > 0` para >80% miembros activos
- `autoDecouple` activado <5% casos/año

---

### 4.7 Metodología MSL-IOI: "Mitosis, No Herencia"

**Objetivo**: Sucesión organizacional por mitosis celular, no herencia jerárquica.

**Pasos**:
1. **Monitoreo de Carga**: `Node_Capacity_Load` continuo
2. **Trigger Mitosis**: `if load ≥ 0.85 → triggerMitosis()`
3. **Preparación Nodo Hijo**: Infraestructura modular + documentación + semillas
4. **Relevo Rotacional**: `governanceTransfer = Rotational_By_Metabolic_Contribution`
5. **Integración Recreativa**: `festivalConvergence()` + `timeBankLudic()` + `coCreation()`

**Métricas de Validación**:
- `mitosisRate ≥ 0.5 nodos/nodo/mes`
- `TQs_produced ≥ 15 TQ/nodo/mes`
- 0 sucesiones con pérdida de memoria operativa

---

### 4.8 Metodología Handshake 72H: "Experiencia Compartida = Protocolo Común"

**Objetivo**: Convertir islas aisladas en nodos federados vía experiencia compartida.

**Pasos**:
1. **Intercambio de Kits**: Isla A envía Kit 72H a Isla B y viceversa
2. **Operación Cruzada 72h**: Cada isla opera el kit de la otra durante 72h
3. **Sincronización TQ**: `syncTQLedger(nodeA, nodeB)` → ledger consistente
5. **Federación Cosatecas**: `mergeCosatecasMesh(nodeA, nodeB)`
6. **Creación Nodo Híbrido**: `createHybridNode(nodeA, nodeB)`

**Validación de Handshake**:
- Ambas islas completan 72h del kit ajeno con métricas ≥80/90/60%
- TQ ledger consistente cross-nodo
- Cosatecas mesh merge operativo
- Gobernanza unificada funcional

---

### 4.9 Metodología Cooperativa + Fideicomiso: "Tierra que No Se Vende, Operación que Sí"

**Objetivo**: Separar base material (indivisible) de operación (democrática).

**Pasos**:
1. **Constitución Fideicomiso**: Patrimonio autónomo, finalidad comunitaria, indivisible
2. **Constitución Cooperativa**: Trabajo asociado, 1 asociado=1 voto, LDFV
3. **Separación Patrimonial**: Tierra/infra → Fideicomiso; Operación → Coop
4. **Puente Bancario**: Cuenta corriente, nómina, facturación A-E
5. **Regla de No Captación**: 2-3 años operación + balance auditado antes de captar ahorro

**Validación Legal**:
- Fideicomiso inscrito en registro civil / notarial
- Cooperativa inscrita en registro cooperativo
- Estatutos con cláusula de indivisibilidad + no captación temprana
- Puente bancario con entidad ética / cooperativa de crédito

---

### 4.10 Metodología No Absorción / Transducción: "Traducir, No Convertir"

**Objetivo**: Federar sin que nadie absorba a nadie.

**Pasos**:
1. **Declaración de Capas**: Cada entidad declara sus 5 capas (epistémica, normativa, contable, interop, fiat)
5. **Mapeo de Anti-Reglas**: Cada capa declara sus 5 anti-reglas innegociables
6. **Contrato de No Absorción**: Firma mutua de cláusula de no absorción
7. **Protocolo de Transducción**: Definir funtor de traducción entre dominios
8. **Verificación Triaxial**: Disputas técnicas → triada mental/sim/lab
9. **γ-CARMIS**: Tensión sistémica > κ → reconfigurar antes de salir

**Validación**:
- 0 capas absorbiendo a otras en 12 meses
- 100% disputas técnicas resueltas por triada
- 0 salidas sin intento de γ-CARMIS

---

## 5. Arquitectura de Composición: Cómo Combinan Estas Formas

### 5.1 La Pila de Cooperación (Stack de 7 Capas)

```
┌─────────────────────────────────────────────────────────────┐
│ CAPA 7: CULTURA / GIFT ECONOMY                              │
│   Festivales convergencia, bancos tiempo lúdico, cocreación │
├─────────────────────────────────────────────────────────────┤
│ CAPA 6: SUCESIÓN / GOBERNANZA (MSL-IOI + SLO/FR + Triadas)  │
│   Mitosis, secesión lucrativa, fidelidad retroalimentativa  │
├─────────────────────────────────────────────────────────────┤
│ CAPA 5: LONGEVIDAD / SALUD (Canutriciotranshumanismo)       │
│   3 umbrales: autotrofía → cibernética metabólica → amortalidad│
├─────────────────────────────────────────────────────────────┤
│ CAPA 4: PRODUCCIÓN / CICLOS (Ecotomic Engine + Bio/Cosatecas)│
│   Spirulina, ciclos cerrados, simbiosis, cosatecas TQ       │
├─────────────────────────────────────────────────────────────┤
│ CAPA 3: DESTRABAJO / OPTIMIZACIÓN (Algoritmia Cibernética)  │
│   Min ∑H(t), gossip micro-tareas, umbral E_humano>E_auto    │
├─────────────────────────────────────────────────────────────┤
│ CAPA 2: INFRAESTRUCTURA / COMUNICACIÓN (Mesh + Gossip)      │
│   mTLS, gossip, store-forward, sync eventual                │
├─────────────────────────────────────────────────────────────┤
│ CAPA 1: CONTABILIDAD / MÉTRICA (TQ = 1 kWh + Trustlines)    │
│   Ledger biofísico, crédito mutuo bilateral, cinta métrica  │
└─────────────────────────────────────────────────────────────┘
```

**Regla de Composición**: Cada capa **valida a la inferior** y **habilita a la superior**. No hay capa 7 sin capa 1.

---

### 5.2 Los Dos Encajes Que Hacen Que Funcione (Modelo ALRAC)

| Encaje | Descripción | Capas Envolucradas |
|--------|-------------|-------------------|
| **Membrana Fiat** | ZEITNUS (Coop) es la **única capa que toca fiat**. Prohíbe que TQ toque fiat por diseño jurídico, no buena voluntad. | Capa 3 (Coop ZEITNUS) protege Capa 1 (TQ Ledger) |
| **Separación TQ/ZNU** | **TQ = cinta métrica** (no acumulable, Postulado 4). **ZNU = reserva/puente fiat** dentro de la coop. Dos instrumentos, dos funciones. | Capa 1 (TQ) ↔ Capa 3 (ZNU/Coop) |

---

### 5.3 Matriz de Composición: Qué Formas Requieren a Qué Otras

| Forma | Requiere (Hard Dependency) | Mejora Con (Soft Dependency) |
|-------|----------------------------|------------------------------|
| Trustlines | TQ Ledger, Mesh | Cosatecas, Triadas |
| TQ Ledger | Mesh, Autonomía | Trustlines, Cosatecas |
| Cosatecas | Mesh, TQ Ledger | Trustlines, FR |
| Mesh/Gossip | Autonomía, Identidad | Trustlines, TQ Ledger |
| Triadas | Autonomía, Identidad | Mesh, γ-CARMIS |
| SLO | TQ Ledger, Mesh, Cosatecas | FR, Trustlines |
| FR | SLO, Mesh, TQ Ledger | SLO, Cosatecas |
| MSL-IOI | Mesh, TQ Ledger, Triadas | FR, Gift Economy |
| Handshake 72H | Kit 72H (todas capas) | Mesh, TQ, Cosatecas |
| Trustlines+Asamblea | Trustlines, Cooperativa | Membrana Fiat, Fideicomiso |
| Cooperativa+Fideicomiso | Personalidad jurídica | Membrana Fiat, TQ Ledger |
| No Absorción | Contrato marco, Triadas | γ-CARMIS, Transducción |
| Triadas | Autonomía, Identidad | Mesh, γ-CARMIS |
| γ-CARMIS | Triadas, Mesh | No Absorción, SLO |
| Gift Economy | Mesh, FR, MSL-IOI | Cosatecas, Handshake |
| Autotrofía 7G | Bio-producción, Mesh | TQ Ledger, Cosatecas, Canutricio |

---

## 6. Riesgos, Límites y Contraindicaciones

### 6.1 Por Forma

| Forma | Riesgo Principal | Contraindicación | Mitigación |
|-------|------------------|------------------|------------|
| **Trustlines** | Cascada de defaults si nodo central falla | Redes sin confianza previa mínima | Web of Trust inicial + límites ±500 TQ |
| **TQ Ledger** | Techo ±500 limita transacciones grandes | Economías de escala que requieren acumulación | ZNU como puente fiat (Capa 3) |
| **Cosatecas** | Tragedia de los comunes (abuso/descuido) | Activos de alto valor/riesgo sin stewardship | Amortización TQ por uso + stewards designados |
| **Mesh/Gossip** | Partición de red prolongada = fork de estado | Aplicaciones que requieren consistencia fuerte | CRDTs + eventual consistency + validación triaxial |
| **Triadas** | Sesgo de selección de agentes | Disputas políticas/no técnicas | Criterios estrictos de independencia + disensos registrados |
| **SLO** | Fuga de capital si muchos se van a la vez | Organizaciones que dependen de retención forzosa | FR fuerte + incentivo por eficiencia |
| **FR** | Free-rider problem (beneficio sin aporte) | Contextos de alta asimetría de poder | Métricas EROI + auto-decouple threshold |
| **MSL-IOI** | Fragmentación excesiva (demasiados nodos micro) | Contextos que requieren economías de escala | Umbral mitosis ≥0.85 + federación obligatoria |
| **Handshake 72H** | Falsa equivalencia (experiencia ≠ competencia) | Islas con asimetría extrema de recursos | Validación métricas 72h (≥80/90/60%) |
| **Cooperativa+Fideicomiso** | Complejidad legal / coste setup | Proyectos <3 personas / <6 meses | Fase 3 ALRAC: solo tras 2-3 años operación |

---

### 6.2 Riesgos Sistémicos (Cross-Cutting)

| Riesgo | Descripción | Detección | Respuesta |
|--------|-------------|-----------|-----------|
| **Elaboración Prematura** | Arquitectura completa sin nodo piloto validado | Cronograma avanzado sin experimento 72h real | **Pivote**: Todo en pausa hasta experimento 72h real (€30, 1 persona) |
| **Falsa Federación** | Handshake sin stack completo en ambas islas | Handshake antes de Fase 1 validada | Secuencia estricta: Fase 0 → 1 → 2 → 3 |
| **Absorción Encubierta** | Una capa imponiendo su vocabulario/unidad a otra | Auditoría de no-absorción trimestral | Contrato marco + auditoría triaxial |
| **Captura Regulatoria** | Cooperativa/Capa 3 captura a Capa 1/2 | Auditoría de licencias + prohibición cambiaria | Membrana fiat + prohibición cambiaria dura |
| **Fatiga de Gobernanza** | Demasiadas triadas / decisiones técnicas | Métrica: decisiones técnicas/mes > umbral | Delegación a triadas + automatización umbrales |

---

## 7. Próximos Pasos: Validación Empírica

### 7.1 El Experimento Mínimo (Esta Semana)

> **Hipótesis Central**: *"Una persona real, sin contexto previo de Zeitnus, completa las 72 horas y al final entiende 1 TQ = 1 kWh sin que nadie se lo explique."*

**Setup Mínimo (€30, ferretería hoy)**:
- Recipiente 10L transparente
- Lámpara LED orientada al cultivo
- Medidor consumo eléctrico enchufable (PZEM/INA260 ~€12)
- Spirulina viva (ya disponible)
- 1 persona sin contexto Zeitnus
- Hoja papel 3 columnas: `Hora | Qué pasó | Qué dijo/conectó`

**Criterio de Éxito (Umbral Mínimo)**:
> La persona verbaliza *alguna* equivalencia energía↔output **sin que se le pregunte**.
> Ej: "esto me costó 0.5 kWh y saqué 15g" o "el medidor marca 1.2 y produje esto"
> Si a hora 72 no hubo ninguna → **hipótesis rechazada, rediseñar Kit**

**Rol del Experimentador**: **Observador pasivo**. No explicar nada que no se pregunte. Anotar cuándo pregunta, qué pregunta, qué conecta solo.

---

### 7.2 Secuencia de Validación Post-Experimento

| Fase | Validación | Decisión |
|------|------------|----------|
| **0. Experimento 72h (1 persona)** | ¿Conexión kWh↔biomasa sin explicación? | SÍ → continuar / NO → rediseñar Kit |
| **1. Experimento 72h (5 personas)** | Métricas ≥80/90/60% (completitud/TQ/secesión) | SÍ → extraer Kit v1.0 / NO → iterar |
| **2. Piloto Zamora↔Oaxaca (7 capas)** | 7 capas funcionales + handshake real | SÍ → extraer Kit v1.0 / NO → debug |
| **3. Handshake islas (Cosatecas→Mesh→Canutricio→Biohackers)** | Cada isla federada vía Kit | SÍ → red viva / NO → aislar fallo |
| **4. Mitosis (10 nodos)** | Tasa mitosis ≥0.5, TQs ≥15/nodo/mes | SÍ → Kit v2.0 "Hello World" |

---

### 7.3 Pregunta Que Ordena Todo Ahora

> **¿Quién es la primera persona, y cuándo empieza?**

Todo lo demás —BOM €127, firmware ESP32, cronograma 13 semanas, federación, handshake, mitosis, métricas— **escribe su propia justificación o se descarta** basándose en la respuesta de ese experimento de 72 horas.

---

## Apéndice A: Glosario de Términos Clave

| Término | Definición |
|---------|------------|
| **TQ** | Time-Quantum: Unidad de cuenta biofísica = 1 kWh trabajo útil. No acumulable, techo ±500, decay obligatorio. |
| **ZNU** | Zeitnus Unit: Reserva y puente fiat dentro de cooperativa. Acumulable, indexada a canasta, crédito 2-3%. |
| **AUT** | Autonomía: Capacidad de sostener metabolismo propio sin input externo coercitivo. |
| **CDS** | Contribución Digital Soberana: Aporte verificable al metabolismo compartido (código, biomasa, datos, mantenimiento). |
| **EROI** | Energy Return On Investment: Salida energética / entrada energética. Umbral auto-decouple < 1.0. |
| **RAO** | Registro de Atribución y Origen: Procedencia, emisor, permisos, estado, revocación — inmutable. |
| **γ-CARMIS** | Protocolo de reconfiguración sistémica obligatoria antes de permitir salida (ΣPᵢ > κ). |
| **Mitosis** | División programada de nodo al alcanzar `Node_Capacity_Load ≥ 0.85`. Herencia limpia de infraestructura. |
| **Handshake 72H** | Protocolo de federación: dos islas intercambian Kit 72H, operan 72h cada una, sincronizan TQ ledger. |
| **SLO** | Secesión Lucrativa Organizacional: Salida con liquidación en TQs, retención cosatecas, migración soberana. |
| **FR** | Fidelidad Retroalimentativa: Permanencia voluntaria porque red devuelve más tiempo libre neto que aislamiento. |
| **Transducción** | Funtor que traduce entre dominios sin que ninguno se convierta en el otro (vs absorción). |

---

## Apéndice B: Referencias Cruzadas en Repo

| Concepto | Archivo(s) Principales | Estado |
|----------|------------------------|--------|
| Trustlines / Crédito Mutuo | `docs/trustlines_integration.md`, `lib/trustlines.ts`, `openspec/specs/alrac-tq-exchangeGuard.md` | ✅ Implementado |
| TQ Ledger | `openspec/specs/alrac-tq-exchangeGuard.md`, `lib/energy-accounting.ts` | ✅ Implementado |
| Cosatecas | `ZEITNUS_UMBRAL_72H...md`, `lib/cosatecas-registry.ts` (plan) | 🔄 Diseño |
| Mesh/Gossip | `lib/mesh-network.ts`, `lib/consensus-gossip.ts` (plan) | 🔄 Diseño |
| Triadas / Gov | `lib/governance-triads.ts`, `ALRAC_consortium_model.md` | 🔄 Diseño |
| SLO / FR | `ZEITNUS_UMBRAL_72H...md`, `lib/secession-protocol.ts`, `lib/fidelity-loop.ts` (plan) | 🔄 Diseño |
| MSL-IOI / Mitosis | `lib/succession-protocol.ts`, `ZEITNUS_UMBRAL_72H...md` | 🔄 Diseño |
| Handshake 72H / Kit | `ZEITNUS_UMBRAL_72H...md`, Kit 72H PMV spec | 🔄 Diseño |
| Cooperativa + Fideicomiso | `ALRAC_consortium_model.md`, `ALRAC_consortium_model_complete.md` | 🔄 Diseño |
| No Absorción / Transducción | `ALRAC_consortium_model.md`, `ALRAC_consortium_model_complete.md` | ✅ Principio |
| γ-CARMIS | `ALRAC_consortium_model.md` | ✅ Principio |
| Canutriciotranshumanismo | `src/core/lib/canutricioTranshumanism.ts`, `openspec/specs/canutriciotranshumanism.md` | ✅ Parcial (v1.0) |

---

*Fin del documento. Este es un artefacto vivo: cada forma de cooperación debe validarse empíricamente antes de escalar. El documento se actualiza con cada experimento real.*

**RAO**: `RAO:cooperation_taxonomy:20261106:001`