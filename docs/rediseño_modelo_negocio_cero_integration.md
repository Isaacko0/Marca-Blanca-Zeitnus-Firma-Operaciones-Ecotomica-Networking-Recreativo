# Integración: Rediseño Modelo Negocio Cero → HSCSG Marca Blanca

## Triple Perspectiva

### 1. Usuario: Qué quiere lograr en su nodo

El usuario de HSCSG Marca Blanca quiere:
- **Economía biofísica soberana**: Sistema donde 1 TQ = 1 kWh ancla todo valor a realidad termodinámica, eliminando especulación financiera
- **Infraestructura offline-first**: Nodos que operan autónomamente sin Internet (mesh + gossip + mTLS), resilientes ante desconexiones
- **Autotrofía comunitaria**: Producción local de alimento (Spirulina), energía, herramientas via cosatecas — desacoplamiento supervivencia/trabajo asalariado
- **Destrabajo algorítmico**: Minimización sistemática trabajo alienante via optimización cibernética (H(t) → H_max fuerza automatización)
- **Secesión lucrativa**: Salida de estructuras extractivas con capital bioenergético portátil (TQs), no finiquitos devaluados
- **Fidelidad por abundancia**: Permanencia voluntaria porque la red devuelve más tiempo libre neto que el aislamiento
- **Sucesión armónica**: Mitosis organizacional (Node_Capacity_Load ≥ 0.85) + networking recreativo (gift economy) + traspaso fluido gobernanza
- **Canutriciotranshumanismo integrado**: Nutrición sintrópica + cibernética metabólica + amortalidad — capas 3 umbrales conectadas a TQs
- **Networking recreativo civilizatorio**: Festivales convergencia simbiótica, bancos tiempo lúdico, cocreación — no ferias extractivas

---

### 2. LLM: Qué asimilar (lógica pura) y qué extirpar (infra ajena)

#### ASIMILAR — Lógica Pura (Patrones Isomórficos → TypeScript/Zustand)

| Componente Conceptual | Módulo HSCSG | Lógica a Extraer |
|----------------------|--------------|------------------|
| **Matriz Metabólica** | `metabolic-matrix.ts` | Inventario recursos/flujos por nodo, contabilidad 1 TQ=1 kWh, conversión energía↔valor |
| **Contabilidad Energética** | `energy-accounting.ts` | TQ ledger: crédito/débito TQs, EER calculation, entropía individual H(t), buffer local |
| **Motor Ecotómico** | `ecotomic-engine.ts` | EER evaluation, ciclos cerrados, cosatecas registry, simbiosis industrial/natural mapping |
| **Algoritmo Destrabajo** | `destrabajo-optimizer.ts` | Función optimización min ∑H(t), despacho micro-tareas gossip, umbral automatización E_humano>E_auto, feedback loops |
| **Mesh Networking** | `mesh-network.ts` | Delay-tolerant gossip, mTLS peer discovery, sincronización eventual, store-and-forward |
| **Smart Contracts Governance** | `governance-contracts.ts` | Reglas gobernanza algorítmica, acuerdos reciprocidad, ejecución automática umbrales |
| **Canutriciotranshumanismo** | `canutricio-transhumanism.ts` | 3 umbrales pipeline (autotrofía, cibernética metabólica, amortalidad), métricas por fase |
| **SLO (Secesión Lucrativa)** | `secession-protocol.ts` | Liquidación TQs, cosateca access retention, migración mTLS, incentivo desconexión |
| **FR (Fidelidad Retroalimentativa)** | `fidelity-loop.ts` | Métrica Net_Free_Time_Gain%, EROI threshold, atracción cibernética, retroalimentación sintrópica |
| **MSL-IOI (Sucesión)** | `succession-protocol.ts` | Mitosis trigger (load≥0.85), herencia modular, relevo rotacional, networking gift economy |
| **Networking Recreativo** | `recreative-networking.ts` | Festivales convergencia, bancos tiempo lúdico, cocreación, gift economy protocols |
| **Producción Biológica** | `bio-production.ts` | Spirulina yield tracking, pH/temp monitoring, captura CO2, fotobioreactor control |
| **Cosatecas Registry** | `cosatecas-registry.ts` | Activos compartidos, amortización TQs por uso, inventario auditable malla |

#### EXTIRPAR — Infraestructura Ajena (NO copiar, referenciar como specs)

| Componente | Razón | Alternativa HSCSG |
|------------|-------|-------------------|
| Fotobioreactores hardware | Hardware físico | `bio-production.ts` expone interface `IBioreactorDriver` — drivers externos |
| Sensores metabólicos (mTLS) | IoT especializado | `metabolic-matrix.ts` define `IMetabolicSensor` — implementaciones externas |
| Mesh radio hardware (LoRa, WiFi) | Radio layer | `mesh-network.ts` usa `IMeshTransport` abstraction — drivers por plataforma |
| Smart contracts blockchain | EVM/solana/etc | `governance-contracts.ts` define `IGovernanceVM` — WASM/embedded VM en nodo |
| Servidores centrales | Cloud infrastructure | **Ninguno** — arquitectura fully local-first, mesh-only |
| Moneda fiat / banking | Sistema financiero legacy | **Eliminado** — solo TQ/KWH ledger interno |
| Contratos laborales legales | Jurisdicción estado | `secession-protocol.ts` + `fidelity-loop.ts` — acuerdos cibernéticos auto-ejecutables |

---

### 3. HSCSG + CaaS: Isomorfismo con Leyes I/II/III y CaaS

#### Ley I: No Dañar Base Material / Personas
- **Matriz Metabólica**: 1 TQ=1 kWh → unidad contable = trabajo útil real, no abstracción extractiva
- **Autotrofía**: Producción local alimento/energía → nadie depende de cadenas globales para sobrevivir
- **Secesión SLO**: Salida con capital bioenergético portátil → no abandono a la indigencia
- **Cosatecas**: Acceso herramientas sin propiedad → elimina monopolio medios producción
- **Canutriciotranshumanismo**: Nutrición densa + destrabajo → reduce degradación celular, no daña biología

#### Ley II: Ganarse la Vida Soberanizando = AUT × CDS
| Concepto | AUT (Autonomía) | CDS (Contribución Digital Soberana) | CaaS Credit |
|----------|-----------------|--------------------------------------|-------------|
| **TQ Ledger** | Control total unidad cuenta | Aportar validación flujos energéticos | `ENERGY_CREDITS` |
| **Mesh Network** | Soberanía comunicaciones | Operar nodo relay/gossip | `MESH_CREDITS` |
| **Destrabajo** | Tiempo libre liberado | Automatizar tareas, compartir código | `AUTOMATION_CREDITS` |
| **Bio-producción** | Alimento/energía propio | Compartir cepas, datos optimización | `BIO_CREDITS` |
| **Cosatecas** | Acceso medios producción | Mantener/tools, registrar uso | `ACCESS_CREDITS` |
| **SLO/FR** | Salida sin castigo | Retroalimentar biomassa/código | `RECIPROCITY_CREDITS` |
| **MSL-IOI** | Mitosis autónoma | Expandir biocomún, mentorar nodos | `EXPANSION_CREDITS` |
| **Canutricio** | Salud mitocondrial propia | Compartir protocolos longevidad | `LONGEVITY_CREDITS` |

**priceParity**: 1 TQ = 1 kWh = 1 USD (oráculo CaaS Nivel 3 ReFi) — render decide etiqueta (ZNU offline / USD online)

#### Ley III: Lucidez, Nunca Engañar
- **Contabilidad energética**: TQ ledger append-only, auditable por cualquier nodo
- **Algoritmo destrabajo**: Función optimización pública, umbrales transparentes (H_max, EROI<1.0)
- **SLO liquidación**: Cálculo entropía ahorrada visible, conversión TQs verificable
- **FR métrica**: Net_Free_Time_Gain% medible, no promesas vagas
- **MSL-IOI mitosis**: Trigger Node_Capacity_Load ≥ 0.85 objetivo, no discrecional
- **Canutricio pipeline**: 3 etapas con métricas duras (pH≥8.5, temp=37°C, Cognitive_Maintenance=OPTIMAL)

#### CaaS: Comunidad como Servicio
- **Red federada nodos metabólicos**: Cada nodo = organismo autónomo + mesh interconectado
- **Créditos CaaS unificados**: `CAAS_CREDITS` = suma créditos energéticos/mesh/automatización/bio/acceso/reciprocidad/expansión/longevidad
- **Gobernanza distribuida**: Triadas base-3 (governanceTriad.ts) validan mitosis, secesión, traspaso gobernanza
- **Vasos comunicantes**: 6 primitivos conectan todos los módulos:
  - `caas-credits.ts` — earning/spending unificado
  - `identity-rao.ts` — RAO attribution por nodo/persona/activo
  - `governance-triads.ts` — base-3 verification decisiones críticas
  - `value-dual.ts` — ZNU/USD priceParity, nodeMode
  - `autonomy-guard.ts` — offline-first operation garantizada
  - `consensus-gossip.ts` — mesh sync estado, TQ ledger, bio-métricas

---

## Tabla Mapeo Isomórfico (Concepto → Módulo HSCSG → Leyes + CaaS)

| Concepto Documento | Módulo HSCSG | Ley I | Ley II | Ley III | CaaS Primitive |
|-------------------|--------------|-------|--------|---------|----------------|
| Matriz Metabólica | `metabolic-matrix.ts` | Base biofísica | AUT: soberanía cuenta | Ledger append-only | `caas-credits` (energy) |
| Contabilidad 1 TQ=1kWh | `energy-accounting.ts` | No especulación | CDS: validación flujos | Transparencia total | `value-dual` (ZNU/USD) |
| Motor Ecotómico | `ecotomic-engine.ts` | Ciclos cerrados | AUT×CDS: producción | EER verificable | `consensus-gossip` (sync) |
| Algoritmo Destrabajo | `destrabajo-optimizer.ts` | No dañar biología | AUT: tiempo libre | Optimización pública | `autonomy-guard` (offline) |
| Mesh Networking | `mesh-network.ts` | Soberanía comms | CDS: operar relay | mTLS verificable | `consensus-gossip` |
| Smart Contracts Gov | `governance-contracts.ts` | Reglas transparentes | AUT: auto-gobierno | Código auditable | `governance-triads` |
| Canutriciotranshumanismo | `canutricio-transhumanism.ts` | Salud no dañada | AUT×CDS: longevidad | 3 umbrales métricas | `identity-rao` (biomarcadores) |
| SLO (Secesión) | `secession-protocol.ts` | No abandono | AUT: capital portátil | Liquidación TQ visible | `caas-credits` (reciprocity) |
| FR (Fidelidad) | `fidelity-loop.ts` | Lealtad no coercitiva | CDS: reciprocidad | Métrica % tiempo libre | `value-dual` (time/energy) |
| MSL-IOI (Sucesión) | `succession-protocol.ts` | Mitosis no jerárquica | AUT: herencia limpia | Trigger 0.85 objetivo | `governance-triads` |
| Networking Recreativo | `recreative-networking.ts` | Gift economy | CDS: cohesión cultural | Sin extractivismo | `consensus-gossip` (cultural) |
| Bio-producción Spirulina | `bio-production.ts` | Autotrofía real | AUT×CDS: alimento | Yield/pH/CO2 métricas | `identity-rao` (biomasa) |
| Cosatecas | `cosatecas-registry.ts` | Acceso sin monopolio | CDS: mantenimiento | Amortización TQ real | `caas-credits` (access) |

---

## Qué Asimilar vs Qué Extirpar (Resumen Ejecutivo)

### ✅ ASIMILAR (14 Módulos TypeScript/Zustand — Lógica Pura)

1. `metabolic-matrix.ts` — Inventario recursos/flujos nodo, contabilidad base
2. `energy-accounting.ts` — TQ ledger, EER, entropía individual, buffer local
3. `ecotomic-engine.ts` — EER evaluation, ciclos cerrados, cosatecas, simbiosis mapping
4. `destrabajo-optimizer.ts` — Min ∑H(t), gossip micro-tareas, umbral automatización, feedback loops
5. `mesh-network.ts` — Delay-tolerant gossip, mTLS, peer discovery, sync eventual
6. `governance-contracts.ts` — Reglas algorítmicas, acuerdos reciprocidad, ejecución umbrales
7. `canutricio-transhumanism.ts` — 3 umbrales pipeline, métricas fase, integración TQ
8. `secession-protocol.ts` — Liquidación TQs, cosateca retention, migración mTLS, incentivo desconexión
9. `fidelity-loop.ts` — Net_Free_Time_Gain%, EROI threshold, atracción cibernética, retroalimentación
10. `succession-protocol.ts` — Mitosis trigger, herencia modular, relevo rotacional, gift economy
11. `recreative-networking.ts` — Festivales convergencia, bancos tiempo lúdico, cocreación protocols
12. `bio-production.ts` — Spirulina yield, pH/temp/CO2 monitoring, fotobioreactor interface
13. `cosatecas-registry.ts` — Activos compartidos, amortización TQs, inventario malla
14. `value-dual-energy.ts` — Extensión `value-dual.ts` para TQ↔kWh↔USD priceParity, nodeMode

### ❌ EXTIRPAR (Infra Física/Externa — Solo Interfaces)

- Hardware fotobioreactores, sensores metabólicos, radio mesh, blockchain VMs, servidores cloud, moneda fiat, contratos legales estatales

---

## Isomorfismo Leyes I/II/III + CaaS (Detalle por Módulo)

### metabolic-matrix.ts
- **Ley I**: Inventario recursos reales (no financieros) → base material respetada
- **Ley II**: AUT = soberanía mapear flujos propios; CDS = contribuir datos flujos a red
- **Ley III**: Inventario público, auditable, sin ocultamiento
- **CaaS**: `caas-credits` por reportar flujos; `consensus-gossip` sync inventarios

### energy-accounting.ts
- **Ley I**: 1 TQ=1 kWh = trabajo útil, no deuda/fiat
- **Ley II**: AUT = control ledger propio; CDS = validar transacciones ajenas
- **Ley III**: Ledger append-only, TQ→kWh conversión fija, priceParity oráculo
- **CaaS**: `value-dual` (ZNU=TQ offline / USD online), `caas-credits` energy

### destrabajo-optimizer.ts
- **Ley I**: Minimiza H(t) → protege biología humana (fatiga ≤ H_max)
- **Ley II**: AUT = tiempo libre liberado; CDS = código automatización compartido
- **Ley III**: Función optimización pública, umbrales H_max/EROI transparentes
- **CaaS**: `autonomy-guard` (offline-first), `caas-credits` automation

### secession-protocol.ts / fidelity-loop.ts
- **Ley I**: Secesión = capital bioenergético portátil, no abandono
- **Ley II**: AUT = salida sin castigo; CDS = retroalimentar biomassa/código
- **Ley III**: Liquidación TQ verificable, métrica % tiempo libre medible
- **CaaS**: `caas-credits` reciprocity, `value-dual` time/energy, `governance-triads` valida secesión

### succession-protocol.ts (MSL-IOI)
- **Ley I**: Mitosis = replicación modular, no acumulación burocrática
- **Ley II**: AUT = herencia infraestructura limpia; CDS = mentorar nodos nuevos
- **Ley III**: Trigger 0.85 objetivo, relevo rotacional por contribución metabólica
- **CaaS**: `governance-triads` valida mitosis/traspaso, `caas-credits` expansion

### canutricio-transhumanism.ts
- **Ley I**: Nutrición densa + destrabajo → reduce degradación, no daña
- **Ley II**: AUT = salud mitocondrial propia; CDS = protocolos longevidad compartidos
- **Ley III**: 3 umbrales con métricas duras (pH, temp, Cognitive_Maintenance)
- **CaaS**: `identity-rao` biomarcadores, `caas-credits` longevity, `autonomy-guard` offline health

---

## Vasos Comunicantes Cross-Repo (Tabla Completa)

| Módulo HSCSG | Conexión Documento | Vaso Comunicante (Primitivo CaaS) |
|--------------|-------------------|-----------------------------------|
| `metabolic-matrix.ts` | Inventario flujos | `consensus-gossip` (sync inventarios), `caas-credits` (energy reporting) |
| `energy-accounting.ts` | TQ ledger 1:1 kWh | `value-dual` (TQ/ZNU/USD), `caas-credits` (energy), `identity-rao` (TQ transactions) |
| `ecotomic-engine.ts` | EER, ciclos cerrados | `consensus-gossip` (EER sync), `caas-credits` (bio/access) |
| `destrabajo-optimizer.ts` | Algoritmo destrabajo | `autonomy-guard` (offline), `caas-credits` (automation), `governance-triads` (threshold changes) |
| `mesh-network.ts` | Gossip + mTLS | `consensus-gossip` (core), `identity-rao` (peer auth) |
| `governance-contracts.ts` | Reglas algorítmicas | `governance-triads` (validation), `consensus-gossip` (rule propagation) |
| `canutricio-transhumanism.ts` | 3 umbrales pipeline | `identity-rao` (biomarkers), `caas-credits` (longevity), `autonomy-guard` (offline health) |
| `secession-protocol.ts` | Liquidación TQ, migración | `caas-credits` (reciprocity), `value-dual` (TQ portability), `governance-triads` (approval) |
| `fidelity-loop.ts` | Métricas fidelidad | `value-dual` (time↔energy), `caas-credits` (reciprocity), `consensus-gossip` (metrics sync) |
| `succession-protocol.ts` | Mitosis, relevo, gift economy | `governance-triads` (mitosis validation), `caas-credits` (expansion), `consensus-gossip` (cultural sync) |
| `recreative-networking.ts` | Festivales, bancos tiempo | `consensus-gossip` (cultural), `caas-credits` (cultural contribution) |
| `bio-production.ts` | Spirulina yield, CO2 | `identity-rao` (biomass batches), `caas-credits` (bio), `consensus-gossip` (strain data) |
| `cosatecas-registry.ts` | Activos, amortización TQ | `caas-credits` (access), `identity-rao` (tool provenance), `consensus-gossip` (inventory) |
| `value-dual-energy.ts` | TQ↔kWh↔USD priceParity | `value-dual` (core), all modules (render) |

---

## Decisiones EBD (D1-D8) Aplicadas a Este Rediseño

| D# | Decisión | Evidencia Primaria | Módulos Afectados |
|----|----------|-------------------|-------------------|
| D1 | Economía biofísica nativa (TQ=1kWh) | Documento: "desplazando indicadores financieros abstractos hacia flujos termodinámicos" | `energy-accounting`, `metabolic-matrix`, `value-dual-energy` |
| D2 | ACP por nodo (autonomous controllability) | "Soberanía de datos y malla local... offline-first" | `mesh-network`, `autonomy-guard`, `governance-contracts` |
| D3 | DF replicado (estado metabólico sync) | "Gossip protocols... sincronización eventual" | `consensus-gossip`, `energy-accounting`, `metabolic-matrix` |
| D4 | Content Code semántico (TQ transactions) | "Toda interacción... validada mediante contabilidad basada en energía" | `energy-accounting`, `secession-protocol`, `fidelity-loop` |
| D5 | UV-PKI propia (mesh mTLS) | "mTLS mutuo... garantizan persistencia operativa" | `mesh-network`, `identity-rao`, `governance-contracts` |
| D6 | Folio Structure (transiciones SLO/MSL-IOI) | "Secesión... traslado gobernanza sin fricción ni pérdida memoria" | `secession-protocol`, `succession-protocol`, `fidelity-loop` |
| D7 | Autonomous Guard (offline-first) | "Persistencia operativa... aun sin conexión constante a Internet" | `autonomy-guard`, `mesh-network`, `destrabajo-optimizer` |
| D8 | Coordination Protocol (mitosis + gift economy) | "Mitosis organizacional... networking recreativo civilizatorio" | `succession-protocol`, `recreative-networking`, `governance-triads` |

---

## KPIs y Tests Obligatorios por Módulo

| Módulo | KPIs Mínimos | Test File |
|--------|-------------|-----------|
| `metabolic-matrix` | Inventario completo < 1s; sync gossip < 5s; 100% recursos mapeados | `metabolic-matrix.test.ts` |
| `energy-accounting` | TQ↔kWh conversión exacta; ledger append-only; priceParity ≤1% drift | `energy-accounting.test.ts` |
| `ecotomic-engine` | EER calculation < 10ms; ciclo cerrado detection 100%; cosateca amortización correcta | `ecotomic-engine.test.ts` |
| `destrabajo-optimizer` | Min ∑H(t) convergencia < 100ms; gossip dispatch < 2s; umbral H_max respected | `destrabajo-optimizer.test.ts` |
| `mesh-network` | Peer discovery < 5s; gossip sync < 10s; store-forward delivery 99.9% | `mesh-network.test.ts` |
| `governance-contracts` | Regla evaluación < 5ms; umbral trigger 100% accuracy; auto-execute | `governance-contracts.test.ts` |
| `canutricio-transhumanism` | 3 etapas pipeline; pH≥8.5/temp=37°C/Cognitive=OPTIMAL checks; TQ integration | `canutricio-transhumanism.test.ts` |
| `secession-protocol` | Liquidación TQ exacta; cosateca retention 100%; migración mTLS < 30s | `secession-protocol.test.ts` |
| `fidelity-loop` | Net_Free_Time_Gain% cálculo < 10ms; EROI<1.0 trigger; retroalimentación logged | `fidelity-loop.test.ts` |
| `succession-protocol` | Mitosis trigger load≥0.85; herencia modular complete; relevo rotacional fair | `succession-protocol.test.ts` |
| `recreative-networking` | Festival sync < 30s; gift economy balance; cocreación output tracked | `recreative-networking.test.ts` |
| `bio-production` | Spirulina yield tracking ±5%; pH/temp monitoring real-time; CO2 capture logged | `bio-production.test.ts` |
| `cosatecas-registry` | Amortización TQ por uso exacta; inventory sync < 5s; access retention 100% | `cosatecas-registry.test.ts` |
| `value-dual-energy` | TQ↔kWh↔USD priceParity ≤0.5% drift; nodeMode switch < 1ms | `value-dual-energy.test.ts` |

---

## Plan de Implementación (Archivo por Archivo)

### Fase 3.1: Core Types + State (Nuevos 14 módulos)
```
src/core/state/metabolic-matrix.ts      # MetabolicState, NodeResources, FlowMetrics, TQUnit
src/core/state/energy-accounting.ts     # EnergyLedger, TQTransaction, PriceParity, EntropyMetrics
src/core/state/ecotomic-engine.ts       # EcotomicState, EERMetrics, ClosedLoop, SymbiosisMap
src/core/state/destrabajo-optimizer.ts  # DestrabajoState, OptimizationResult, MicroTask, FatigueThreshold
src/core/state/mesh-network.ts          # MeshState, PeerInfo, GossipMessage, MTLSConfig
src/core/state/governance-contracts.ts  # GovernanceState, Rule, Threshold, AutoExecution
src/core/state/canutricio-transhumanism.ts # CanutricioState, PipelineStage, Biomarker, AmortalityIndex
src/core/state/secession-protocol.ts    # SecessionState, TQLiquidation, CosatecaRetention, MigrationPackage
src/core/state/fidelity-loop.ts         # FidelityState, FreeTimeGain, EROIMetric, ReciprocityLog
src/core/state/succession-protocol.ts   # SuccessionState, MitosisTrigger, ModularInheritance, GiftEconomyEvent
src/core/state/recreative-networking.ts # RecreativeState, Festival, TimeBank, CoCreationProject
src/core/state/bio-production.ts        # BioProductionState, SpirulinaBatch, Photobioreactor, CO2Capture
src/core/state/cosatecas-registry.ts    # CosatecasState, SharedAsset, TQAmortization, InventoryAudit
src/core/state/value-dual-energy.ts     # EnergyValueDual (extiende value-dual.ts para TQ↔kWh↔USD)

# Tests correspondientes en .test.ts cada uno
```

### Fase 3.2: Lógica Pura (lib/)
```
src/core/lib/metabolic-matrix.ts        # inventarioRecursos(), calcularFlujos(), mapearEntradas()
src/core/lib/energy-accounting.ts       # convertTQtoKWH(), ledgerAppend(), calcularEER(), priceParityOracle()
src/core/lib/ecotomic-engine.ts         # evaluarEER(), detectarCiclosCerrados(), registrarCosateca(), mapearSimbiosis()
src/core/lib/destrabajo-optimizer.ts    # optimizarEsfuerzoHumano(), despacharMicroTareas(), evaluarUmbralAutomatizacion(), feedbackLoop()
src/core/lib/mesh-network.ts            # discoverPeers(), gossipSync(), mTLSHandshake(), storeForward()
src/core/lib/governance-contracts.ts    # evaluarRegla(), verificarUmbral(), autoEjecutar(), propagarRegla()
src/core/lib/canutricio-transhumanism.ts # ejecutarPipeline(), validarUmbral1(), validarUmbral2(), validarUmbral3(), integrarTQ()
src/core/lib/secession-protocol.ts      # liquidarCapitalTQ(), retenerAccesoCosatecas(), migrarNodoMTS(), incentivarDesconexion()
src/core/lib/fidelity-loop.ts           # calcularFreeTimeGain%, evaluarEROI(), registrarReciprocidad(), atraerCiberneticamente()
src/core/lib/succession-protocol.ts     # detectarMitosis(), heredarInfraestructuraModular(), relevoRotacional(), activarGiftEconomy()
src/core/lib/recreative-networking.ts   # sincronizarFestival(), bancoTiempoLudico(), cocrearProyecto(), giftEconomyExchange()
src/core/lib/bio-production.ts          # cosecharSpirulina(), monitorearPHtemp(), capturarCO2(), controlarFotobioreactor()
src/core/lib/cosatecas-registry.ts      # registrarActivo(), amortizarTQ(), auditarInventario(), retenerAcceso()
src/core/lib/value-dual-energy.ts       # TQtoKWH(), KWhtoUSD(), priceParityUpdate(), nodeModeSwitch()
```

### Fase 3.3: Store Integration
```
src/core/state/store.ts                 # + 14 nuevos módulos en AppState, actions, resetAll, partialize
# Imports:
import type { MetabolicState } from '@core/state/metabolic-matrix'
import { makeMetabolicState } from '@core/lib/metabolic-matrix'
# ... (14 imports)
# En create(): metabolic: makeMetabolicState(), energy: makeEnergyAccountingState(), ...
# En resetAll(): metabolic: makeMetabolicState(), ...
# En partialize: metabolic: state.metabolic, energy: state.energy, ...
```

### Fase 3.4: Pantallas + Nav
```
src/app/screens/MetabolicDashboard.tsx   # Inventario recursos, flujos, TQ ledger visual
src/app/screens/EnergyAccounting.tsx     # TQ ledger, priceParity, entropía individual, buffer
src/app/screens/EcotomicEngine.tsx       # EER, ciclos cerrados, cosatecas, simbiosis map
src/app/screens/DestrabajoOptimizer.tsx  # Optimización H(t), micro-tareas, umbral automatización
src/app/screens/MeshNetwork.tsx          # Peer map, gossip status, mTLS config, sync
src/app/screens/GovernanceContracts.tsx  # Reglas, umbrales, auto-ejecución, historial
src/app/screens/CanutricioTranshumanism.tsx # 3 umbrales pipeline, biomarcadores, amortalidad index
src/app/screens/SecessionProtocol.tsx    # Liquidación TQ, cosateca retention, migración wizard
src/app/screens/FidelityLoop.tsx         # FreeTimeGain%, EROI, reciprocidad log, atracción
src/app/screens/SuccessionProtocol.tsx   # Mitosis trigger, herencia, relevo, gift economy events
src/app/screens/RecreativeNetworking.tsx # Festivales, time banks, cocreación, gift economy
src/app/screens/BioProduction.tsx        # Spirulina yield, pH/temp/CO2, fotobioreactor control
src/app/screens/CosatecasRegistry.tsx    # Activos compartidos, amortización, inventario malla
src/app/screens/EnergyValueDual.tsx      # TQ↔kWh↔USD converter, nodeMode toggle

src/app/layout/Aside.tsx                 # + 14 items (iconos lucide: Database, Zap, Leaf, Cpu, Network, Scale, FlaskConical, LogOut, Heart, GitBranch, Users, Flower, Package, Currency)
src/app/App.tsx                          # + 14 routes /metabolic, /energy, /ecotomic, /destrabajo, /mesh, /governance, /canutricio, /secession, /fidelity, /succession, /recreative, /bioprod, /cosatecas, /energy-dual
```

### Fase 3.5: i18n (ES/EN/PT — 200+ keys per screen)
```
src/i18n/locales/es/metabolic.json
src/i18n/locales/en/metabolic.json
src/i18n/locales/pt/metabolic.json
# ... (14 módulos × 3 idiomas)
```

### Fase 3.6: OpenSpec Specs (Nuevas)
```
openspec/specs/metabolic-matrix.md
openspec/specs/energy-accounting.md
openspec/specs/ecotomic-engine.md
openspec/specs/destrabajo-optimizer.md
openspec/specs/mesh-network.md
openspec/specs/governance-contracts.md
openspec/specs/canutricio-transhumanism.md  (actualizar v1.0→v2.0 con integración completa)
openspec/specs/secession-protocol.md
openspec/specs/fidelity-loop.md
openspec/specs/succession-protocol.md
openspec/specs/recreative-networking.md
openspec/specs/bio-production.md
openspec/specs/cosatecas-registry.md
openspec/specs/value-dual-energy.md
```

### Fase 3.7: Tests KPI + Verificación
```
npm run test:metabolic      # vitest run src/core/lib/metabolic-matrix.test.ts
npm run test:energy         # energy-accounting.test.ts
npm run test:ecotomic       # ecotomic-engine.test.ts
npm run test:destrabajo     # destrabajo-optimizer.test.ts
npm run test:mesh           # mesh-network.test.ts
npm run test:governance     # governance-contracts.test.ts
npm run test:canutricio     # canutricio-transhumanism.test.ts
npm run test:secession      # secession-protocol.test.ts
npm run test:fidelity       # fidelity-loop.test.ts
npm run test:succession     # succession-protocol.test.ts
npm run test:recreative     # recreative-networking.test.ts
npm run test:bioprod        # bio-production.test.ts
npm run test:cosatecas      # cosatecas-registry.test.ts
npm run test:energydual     # value-dual-energy.test.ts

npx tsc --noEmit            # 0 errores
npm run build               # build OK
npm run preview             # 14 rutas nuevas → HTTP 200
```

---

## Referencias

- **Documento fuente**: Paste 2026-11-06 (arquitectura completa 7 pilares)
- **Canutriciotranshumanismo previo**: `src/core/lib/canutricioTranshumanism.ts`, `openspec/specs/canutriciotranshumanism.md`, `docs/INTEGRACION_FOTOSINTESIS_MAMIFERA_CANUTRICIO.md`
- **PMCRT / Motor Ecotómico**: `src/core/lib/pmcrt.ts`, `docs/PMCRT_OPERATIONAL.md`
- **HSCSG OS Architecture**: `skills/hscsg-repo-assimilation/references/hscsg-architecture.md`
- **Principio Anfibio**: `skills/hscsg-repo-assimilation/references/anfibio-assimilation.md`
- **Value Dual Pattern**: `skills/hscsg-repo-assimilation/references/value-dual-pattern.md`
- **Vasos Comunicantes Primitivos**: `caas-credits.ts`, `identity-rao.ts`, `governance-triads.ts`, `value-dual.ts`, `autonomy-guard.ts`, `consensus-gossip.ts`
- **Skills relacionadas**: `hscsg-repo-assimilation`, `hscsg-unified-assimilation-science`, `economic-research/alrac-*`
- **Zeitnus**: `docs/ZEITNUS_REGENERATIVE_MODEL.md`, `docs/MANIFIESTO_ZEITNUS_ASIMILACION.md`
- **ALRAC / TQ**: `economic-research/alrac-*` skills, `docs/ALRAC_*.md`
- **Autómata Soberano / MJ Gate**: `src/core/lib/automaton.ts`, `src/core/lib/orchestration.ts`