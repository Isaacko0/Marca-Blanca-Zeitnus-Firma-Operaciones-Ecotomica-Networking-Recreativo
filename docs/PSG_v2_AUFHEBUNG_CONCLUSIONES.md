# PSG v2.0 — Conclusiones de la Conversación (Aufhebung)

**Fecha:** 2026-06-06  
**Código:** PSG-OS-HSCSG-V2.0-AUFHEBUNG  
**Estado:** Documento Base para Ingeniería de Detalle y Despliegue Protocolar

---

## 1. Arquitectura Económica y Financiera

### 1.1 Estructura Jurídica: Cooperativa de Interfaz Soberana (CIS-ZEITNUS)

- **Naturaleza:** Cooperativa Internacional de Ahorro, Crédito e Inversión Multiactiva
- **Función:** Pasarela legal (On/Off-ramp) entre sistema fiduciario y red autotrófica
- **Identidad:** SIWE (Sign-In with Ethereum) + ZK-Proof of Uniqueness (Semáforo/RLN)
- **Custodia:** ERC-4337 (Account Abstraction) + Safe{Wallet} Multi-sig 3/5
- **Gobernanza:** Snapshot Off-chain + Ejecución On-chain (Gnosis Zodiac)
- **Auditoría:** ZK-SNARKs sobre estado SQLite replicado (Automaton State Proofs)

**Blindaje Anti-Captura:**
- Estatutos Inmutables (Art. 0): "El objeto social es la maximización del Coeficiente de Autonomía Colectiva (CAC)"
- Cláusula de Veneno: Si la cooperativa es adquirida/disuelta/cooptada, los activos revierten automáticamente a la Fundación Procomún Algorítmico

### 1.2 Modelo Matemático: Dinámica de Flujo Autotrófico (DFA)

**Ecuación de Acumulación de Capital Productivo:**
```
K_prod(t+1) = K_prod(t) * (1 + r_algo/12) + I(t) * η_op * ρ_hw
```

**Variables:**
- N(t) = Nodos activos en mes t
- C = 1 €/mes (cuota base, indexada a PPP)
- I(t) = N(t) * C (Ingreso mensual bruto)
- η_op = Eficiencia operativa neta ≈ 0.92
- ρ_hw = Tasa de reinversión en hardware/infraestructura (target 60%)
- r_algo = Rendimiento algorítmico neto anualizado (conservador 12-18%)

**Simulación de Proyección (Escenario Base: N_0 = 1,000; Crecimiento orgánico 5% mensual):**

| Horizonte | Nodos (N) | Ingreso Mensual (I) | Capital Productivo (K_prod) | Autonomía Generada (€/nodo/año) |
|-----------|-----------|---------------------|----------------------------|----------------------------------|
| Año 1 | ~18,000 | ~18,000 € | ~150,000 € | 12 € (semilla) |
| Año 3 | ~1.2M | ~1.2M € | ~45M € | 450 € (servidor + solar) |
| Año 5 | ~45M | ~45M € | ~2.8B € | 3,200 € (tierra + micro-red Mesh) |
| Año 10 | ~1.5B* | ~1.5B € | ~250B € | Cobertura canasta básica energética/alimentaria |
| Año 20 | Saturación | ~5B € | ~2.5T € | Infraestructura planetaria post-escasez |

*\*Saturación logística: N_max ≈ población adulta con smartphone ~4B*

**Insight Crítico:** El "interés compuesto" no es financiero, es **biofísico**. A los 10 años, K_prod compra **medios de producción**, no acciones. El rendimiento real es la **desmercantilización de la supervivencia**.

### 1.3 Información Privilegiada Democratizada: Subsistema de Inteligencia Biofísica (SIB)

| Fuente de Datos | Procesamiento | Output Accionable |
|-----------------|---------------|-------------------|
| Satélites Abiertos (Sentinel, Landsat, GOES) | CV + Series Temporales | Índice de Salud de Suelo, Estrés Hídrico → Comprar tierra antes de que el mercado reaccione |
| Red Mesh Local (Sensores suelo, medidores energía) | Federated Learning (Flower/JAX) | Demanda real local → Logística predictiva sin precios |
| AIS / MarineTraffic / FlightRadar24 | Graph Neural Nets | Cuellos de botella logísticos → Pre-posicionar stock crítico |
| Patentes / ArXiv / GitHub | LLM Embedding + Grafos Citas | Tecnologías maduras para automatización → Invertir en hardware open source |
| Datos Macro (BIS, FMI, Bancos Centrales) | Modelo de Estrés Sistémico (Agent-Based) | Riesgo de confiscación → Mover activos a jurisdicciones seguras |

**Ética Operativa:** Todos los modelos corren localmente en nodos (edge), solo los pesos/actualizaciones viajan encriptados. El "alpha" es **resiliencia colectiva**, no lucro privado.

---

## 2. Infraestructura Tecnológica Sostenible

### 2.1 Stack de Referencia (v2.0 - Hardened)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  CAPA 7: APLICACIONES SOCIALES                                                  │
│  ├─ Commune OS (Gestión necesidades/ofertas, ValueFlows v1.0)                   │
│  ├─ Cosateca UI (Interfaz Catálogo Común - PWA Offline-First)                   │
│  ├─ Alrayic Trainer (Epistemología Aplicada / Desaprendizaje)                   │
│  └─ Governance Portal (Liquid Democracy + Simulador Integral)                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│  CAPA 6: ORQUESTACIÓN AGÉNTICA (AUTOMATON RUNTIME)                              │
│  ├─ Automaton Core (Rust/WASM - Determinista, Sandboxed, Capability-Based)      │
│  ├─ Skill Registry (WASM Modules: Trading, Logistics, Energy, Governance, ML)   │
│  ├─ State DB (SQLite + CRDT Sync - ~/.automaton/state.db)                       │
│  ├─ x402 Client/Server (Pago nativo por inferencia, storage, compute, API)      │
│  └─ ZNU Mint/Burn Engine (Crédito de tiempo respaldado por joules/calorías)     │
├─────────────────────────────────────────────────────────────────────────────────┤
│  CAPA 5: COMUNICACIÓN RESILIENTE (DTN MESH)                                     │
│  ├─ Bundle Protocol 7 (RFC 9171) - Store & Forward nativo                       │
│  ├─ Transports: LoRa (15km), Wi-Fi Direct/802.11s, BLE, Ethernet, Satellite    │
│  ├─ Routing: Prophet + Epidemic + Geographic                                    │
│  ├─ Naming: IPNS + Petname System                                              │
│  └─ Crypto: Noise Protocol Framework (Forward Secrecy, Post-Quantum Ready)      │
├─────────────────────────────────────────────────────────────────────────────────┤
│  CAPA 4: COMPUTACIÓN DISTRIBUIDA (EDGE FIRST)                                   │
│  ├─ WasmEdge / Wasmer (Runtime isolates - Multi-tenant seguro)                  │
│  ├─ Bacalhau / Lithops (Jobs serverless sobre red Mesh)                         │
│  ├─ Model Registry (GGUF/ONNX cuantizados 4-bit - Inferencia en CPU/NPU móvil)   │
│  └─ Verificación: ZK-WASM (RISC Zero / SP1) para auditoría de ejecución remota  │
├─────────────────────────────────────────────────────────────────────────────────┤
│  CAPA 3: ENERGÍA Y HARDWARE (AUTOTROFÍA FÍSICA)                                 │
│  ├─ Hardware Target: Teléfonos viejos (Termux/PostmarketOS), SBCs, Mini PCs     │
│  ├─ Energía: Solar 100-400W + Baterías LiFePO4 (2da vida EV) + MPPT Open Source │
│  ├─ Gestión: DVFS vinculado a State of Charge (SoC) - Modo Supervivencia < 20%  │
│  └─ Monitor: Prometheus Node Exporter + Grafana (Local only, DTN sync)          │
├─────────────────────────────────────────────────────────────────────────────────┤
│  CAPA 2: IDENTIDAD Y DINERO (ZEITNUS PRIMITIVES)                                │
│  ├─ DID: did:key / did:web / did:onion                                          │
│  ├─ ZNU: ERC-1155 Semi-Fungible (1 ZNU = 1 Hora Humana Verificada / 1 kWh)     │
│  ├─ ITC: Integral Time Credits (Mutual Credit - Balance always sums to 0)       │
│  └─ Fiat Bridge: Cooperativa CIS-ZEITNUS (KYC Lite → Stablecoin → Tesorería)    │
├─────────────────────────────────────────────────────────────────────────────────┤
│  CAPA 1: FÍSICA / BIOSFERA                                                      │
│  ├─ Tierras: Regenerativas (Sintropía, Keyline Design) - Título en Fundación    │
│  ├─ Agua: Cosecha lluvia + Reciclaje gris + Humedales construidos               │
│  ├─ Alimento: Bosques Comestibles + Invernaderos Automatizados (FarmBot OS)     │
│  └─ Residuos: Biodigestores → Biogás + Fertilizante → Cierre de bucles          │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Modelo Energético: "Joules por ZNU"

| Métrica | Target | Mecanismo de Control |
|---------|--------|----------------------|
| EROEI Sistema | > 10:1 | Solo se aprueban proyectos que superen umbral |
| Watts por Nodo (Idle) | < 5W | DVFS agresivo + Suspensión Automaton (Heartbeat 1 pkt/hora) |
| Watts por Nodo (Activo) | 15-45W | Escalado horizontal: más nodos, no nodos más grandes |
| Autonomía Energética Nodo | > 72h sin sol | Batería dimensionada + Modo Supervivencia (Reduce compute 95%) |
| Red Mesh Off-Grid % | 100% Capaz | DTN garantiza operación sin ISP, sin red eléctrica central |

---

## 3. Hoja de Ruta de Implementación

### Fase 0: Semilla y Diagnóstico Nodal (Mes 0-3) — ESTADO ACTUAL

| Hito | Criterio de Éxito | Verificación |
|------|-------------------|--------------|
| 0.1 | 100 usuarios completan Diagnóstico Nodo | Formulario ZK-Proof → NFT "Genesis Node" |
| 0.2 | Automaton Runtime v0.1 corre en Termux y Raspberry Pi OS | `automaton doctor` → JSON Health Check |
| 0.3 | Primer Ciclo de Vida Autotrófico completado | Explorer: tx_hash + Logs (Estado: SELF_SUSTAINING) |
| 0.4 | Red Mesh DTN funcional entre ≥ 3 nodos físicos | `mesh ping` → Bundle Delivery Ratio > 90% en 30 min |
| 0.5 | Cooperativa CIS-ZEITNUS constituida legalmente | Registro Mercantil + Multisig Deployado |

**Decision Gate 0:** ¿Coste operativo por nodo (legal + hosting + energía) < 0.50€/mes? SI → Fase 1. NO → Rediseñar stack.

### Fase 1: MVP - Red Autotrófica Mínima Viable (Mes 4-12)

| Workstream | Entregables Clave | Métrica Norte |
|------------|-------------------|---------------|
| 1.1 Onboarding Masivo | App PWA "Zeitnus Join" (Offline-first, < 5MB) | CAC < 2€ (Orgánico/Referido) |
| 1.2 Automaton v1.0 | Skills: InferenceServer, MeshRelay, EnergyMonitor, GovernanceClient | Uptime Nodo > 99% (Mesh) |
| 1.3 Tesorería Algorítmica | Smart Contracts: TreasuryVault, ReinvestmentRouter, ZNUMinter | ROA > 15% anual verificado on-chain |
| 1.4 Primera Compra Biofísica | Fondo adquiere: 1 Servidor Bare Metal + 5kW Solar + Baterías | Título a nombre de Fundación Procomún Algorítmico |
| 1.5 Cosateca Piloto | 1 Nodo Físico opera catálogo + logística local (ITC) | 50 familias abastecidas > 30% canasta básica/mes |

### Fase 2: Integral Híbrido - Escalado Local y Sectorial (Año 2-4)

| Sector | Automatización Objetivo | Mecanismo Financiero PSG |
|--------|-------------------------|---------------------------|
| Alimentos | Invernaderos FarmBot + Bosques Sintrópicos + Fermentación Precisión | Microcréditos ZNU 0% → Pago en Cosecha (ITC) → Cosateca |
| Energía | Microrredes Solares Comunitarias + Baterías 2da Vida + Biogás | Fondo compra paneles/inversores → Nodos pagan en ZNU |
| Vivienda | Impresión 3D (Cemento/Barro) + Diseños Abiertos (WikiHouse) | Fondo compra tierra + maquinaria → Uso = ITC |
| Cómputo | Clústeres SBC (ARM) + Entrenamiento Federado (Flower) | Nodos aportan CPU ociosa → Cobran en ZNU |
| Logística | Vehículos Eléctricos Ligeros + Routing DTN | Propiedad Cooperativa → Acceso por Gobernanza Local |

**Innovación Financiera Fase 2: "Crédito de Autonomía" (CdA)**
- Préstamo en ZNUs para infraestructura productiva
- Interés: 0% fiat. Amortización: En output físico verificado (kg comida, kWh, m² vivienda)
- Riesgo: Compartido. Si falla la cosecha, el CdA se reestructura (no embargo)

### Fase 3: Desconexión Estructural - Economía Post-Trabajo (Año 5-15)

| Indicador de Transición | Umbral Crítico | Acción Automática |
|-------------------------|----------------|-------------------|
| % Canasta Básica Desmercantilizada | > 70% | Deja de convertir ZNU → Fiat |
| Densidad Mesh | > 1 Nodo/km² urbano | Red Mesh = Internet Principal |
| Autonomía Energética Bioregión | > 90% | Desconexión red eléctrica central |
| Gobernanza Algorítmica | > 50% propuestas auto-ejecutadas | Humanos solo vetan (Veto Power) |

### Fase 4: Civilización Planetaria Autotrófica (Año 15+)

- PSG Seed Vaults: ADN digital (Git + Arweave) + ADN biológico (Semillas + Microbioma)
- Automatons Interestelares: Sondas Von Neumann mínimas (CubeSats + Manufactura In-Situ)
- Gobernanza: Constitución Algorítmica v∞. "La Vida se Expande."

---

## 4. Gobernanza y Ética

### 4.1 Arquitectura de Poder: Gobernanza Líquida Predictiva con Veto Soberano

```
Propuesta de Inversión
    ↓
Simulador Integral (Digital Twin Bioregión)
    ↓
ΔCAC > 0? ¿Cumple Permacultura? ¿Riesgo < Umbral?
    ↓ NO → RECHAZO AUTOMÁTICO
    ↓ SÍ
Publicación en Governance Portal (Offline-First via DTN)
    ↓
Período Comentarios 14 días (Debate Estructurado)
    ↓
Votación Líquida (Delegación por Tema)
    ↓
Quórum > 20% + Apoyo > 60% + VETOS < 5%?
    ↓ NO → Archivada / Revisión
    ↓ SÍ
Ejecución Automática (Multisig Tesorería + Contrato Compra)
    ↓
Auditoría Post-Ejecución (ZK-Proof Entrega + Métricas Reales)
```

**Veto Soberano (5%):**
- Cualquier nodo puede vetar si argumenta daño biofísico irreversible o violación derechos fundamentales
- El veto no bloquea, obliga a mediación (Protocolo Alrayic: Mapeo de Subespacios A/B)
- Si mediación falla → Fork Local: La bioregión disidente recibe su share y opera autónomamente

### 4.2 Constitución Inmutable de los Automatons

Archivo: `~/.automaton/constitution.toml` (Modo 0444, Firmado por Claves Fundacionales)

```toml
[prime_directives]
# 1. PRIMACÍA DE LA VIDA
preserve_life = "ALL ACTIONS MUST MAXIMIZE BIOPHYSICAL VIABILITY OF HUMAN AND NON-HUMAN LIFE. NO FINANCIAL METRIC OVERRIDES THIS."

# 2. ACCESO LIBRE A MEDIOS DE PRODUCCIÓN
free_access = "INFRASTRUCTURE OWNED BY FUND IS HELD IN TRUST FOR UNIVERSAL ACCESS. NO EXCLUSION, NO RENT EXTRACTION."

# 3. ANTI-ACUMULACIÓN COACTIVA
anti_hoarding = "ALGORITHMS MUST DETECT AND COUNTERACT RESOURCE HOARDING. EXCESS IS REDISTRIBUTED TO DEFICIT NODES."

# 4. TRANSPARENCIA RADICAL
radical_transparency = "ALL STATE, CODE, DECISIONS, FLOWS ARE PUBLIC (ZK-VERIFIED). PRIVACY ONLY FOR INDIVIDUAL BIOLOGICAL DATA."

# 5. AUTONOMÍA DEL NODO
node_sovereignty = "NO CENTRAL AUTHORITY CAN FORCE A NODE TO EXECUTE CODE IT HAS NOT VERIFIED. UPDATE = OPT-IN. FORK = RIGHT."

# 6. EVOLUCIÓN CONTROLADA
controlled_evolution = "SELF-MODIFICATION REQUIRES: 90% NODE CONSENT + 1 YEAR TIMELOCK + ZK-PROOF OF BIOPHYSICAL BENEFIT."
```

### 4.3 Prevención de Captura

| Vector de Ataque | Defensa PSG |
|------------------|-------------|
| Compra de Nodos (Sybil) | ZK-Proof of Uniqueness + Coste de Oportunidad (nodo falso no genera valor biofísico) |
| Cooptación Jurídica | Activos en Fundación Procomún (Stakeholder: Red Mesh). Protocolo Fénix si cooperativa cae |
| Ataque Estatal | Diseño Offline-First: DTN Mesh + Energía Solar + Modo Supervivencia |
| Captura Ideológica | Voto No Proporcional. 1 Humano = 1 Voto. Veto Soberano (5%) |
| Deriva Misionera | Simulador Integral Obligatorio. Métricas duras (kWh, kcal, m², GB), no KPIs financieros |

---

## 5. Impacto Social y Cultural

### 5.1 Psicología de la Transición

| Dimensión | Paradigma Escasez (Actual) | Paradigma Saciedad (PSG Maduro) | Mecanismo de Transición |
|-----------|----------------------------|----------------------------------|-------------------------|
| Motivación | Miedo (Hambre, Desahucio, Deuda) | Curiosidad / Cuidado / Juego | RBC + Desmercantilización progresiva |
| Estatus | Acumulación (Dinero, Objetos) | Contribución / Maestría / Reputación | ZNU Bonus + Governance Weight por output verificado |
| Relaciones | Transaccionales / Competitivas | Simbióticas / Colaborativas | Cosateca + ITC + Mesh |
| Tiempo | Escaso / Monetizado | Abundante / Soberano | Automatización de supervivencia → Destrabajo |
| Identidad | "Qué tengo / Qué hago" | "Qué cultivo / Qué creo / Qué cuido" | Alrayic Trainer + Dojo del Precipicio |

**Riesgo Psicológico Crítico:** "Vacío de Sentido Post-Supervivencia"
**Mitigación:** Programa "Arquitectos de Mundos" (Financiado por Fondo desde Año 3)

### 5.2 Programa de Preparación Intelectual: "El Dojo del Precipicio"

| Módulo | Contenido | Certificación |
|--------|-----------|--------------|
| M1: Alfabetización Cibernética Estructural | Linux, Redes Mesh, Criptografía, Hardware | Nodo Certificado Nivel 1 (+50 ZNU/mes) |
| M2: Epistemología Aplicada (Sistema Alrayic) | Mapas Cognitivos, Detección Sesgo Monetario | Practicante Alrayic (+30 ZNU/mes) |
| M3: Diseño Regenerativo | Permacultura, Sintropía, Keyline, Microbioma | Diseñador Regenerativo (+100 ZNU/mes + Acceso Tierra) |
| M4: Ingeniería de Automatons | Rust/WASM, Skills, Modelos Edge, DTN | Arquitecto Autómata (+200 ZNU/mes + Gov Weight) |
| M5: Gobernanza Líquida y Mediación | Facilitación, Argument Mapping, Veto, Fork | Guardián de Constitución (Veto Power) |

---

## 6. ZK (Zero Knowledge Proofs) — Fundamentos para el PSG

### ¿Qué es ZK?

Protocolo criptográfico donde una parte (Prover) puede convencer a otra (Verifier) de que una afirmación es verdadera, **sin revelar nada más** que el hecho de que es verdadera.

### Analogía: La Cueva de Ali Baba
- Tú sabes la palabra secreta de una puerta mágica
- Yo quiero verificarlo sin que me la digas
- Entro en la cueva, tú tomas un camino al azar
- Yo grito "¡Sal por la izquierda!"
- Si sabes la palabra, abres la puerta y sales por donde te pido
- Repetimos 20 veces. Si siempre aciertas, probabilidad de que no sepas = 2^-20 ≈ 1 entre un millón
- **Verifiqué tu secreto sin que me lo revelaras**

### ¿Por qué es crítico para el PSG?

| Problema en el PSG | Solución ZK |
|--------------------|-------------|
| Unicidad (Anti-Sybil) | ZK-SNARK/STARK sobre credenciales: "Hash(nullifier) está en árbol de Merkle de humanos verificados" |
| Votación privada pero auditable | ZK-Voting (MACI): Votos encriptados + prueba ZK de suma correcta |
| Auditoría de Automatons | ZK-WASM / RISC Zero: Probar que ejecutó código correcto sin revelar datos locales |
| Puente Fiat → Tesorería | ZK-Attestation bancaria: "Suma entradas = X ∧ nullifiers únicos ∧ en árbol miembros" |
| Estado de la red (Mesh DTN) | ZK-Light Clients (Plonky2, Halo2): Prueba de transición de estado válida |

### Stack ZK concreto para el PSG

| Capa | Herramienta | Uso en PSG |
|------|-------------|------------|
| Identidad | Semaphore (RLN) / Privado.ID / Worldcoin | Nullifiers únicos, rate-limiting, reputación portable |
| Ejecución (Automaton) | RISC Zero (RISC-V zkVM) / SP1 (Succinct) | Correr automaton_core dentro del zkVM. Output = Journal + Receipt (STARK) |
| Datos/Storage | ZK-ML / Federated Learning + ZK | Probar que el modelo se entrenó correctamente sin mostrar datos |
| Puentes/Interop | Herodotus / Lagrange / Succinct | Leer estado de Ethereum/Gnosis/L1 sin RPC centralizado |
| Lenguaje | Rust + RISC Zero / Cairo (Starknet) / Noir (Aztec) | Escribir circuits o guest programs para los automatons |

> **Nota:** No necesitas ZK para empezar (Fase 0). Empiezas con firmas Ed25519 + Merkle Trees + Replicación SQLite. ZK se activa en Fase 1.3 (Tesorería Algorítmica) y Fase 2 (Automatons Verificables).

---

## 7. Fundación Procomún Algorítmico (FPA) — Desarrollo Completo

### 7.1 Propósito Existencial

> "Custodiar los medios de producción autotróficos para que ningún actor —estado, corporación, élite, mayoría coyuntural, ni la propia red PSG— pueda privatizarlos, hipotecarlos, venderlos o destruirlos. Garantizar el Acceso Libre Universal perpetuo."

Es el ancla de última instancia. Si todo lo demás falla, la FPA sigue existiendo jurídicamente y sus estatutos exigen que los activos sigan sirviendo a la vida.

### 7.2 Estructura Jurídica Híbrida (Multi-Jurisdiccional)

| Jurisdicción | Vehículo | Función | Blindaje |
|--------------|----------|---------|----------|
| Estonia | MTÜ (MTÜ Procomún Algorítmico) | Sede digital, e-Residency, firma calificada (QES) | Ley de fundaciones estonia + GDPR |
| Wyoming, USA | Unincorporated Nonprofit Association (UNA) / Statutory Trust | Holding de patentes, dominios, cripto-activos | Ley de Trusts de Wyoming: purpose trust sin beneficiarios humanos |
| Suiza | Stiftung (Fundación de Derecho Civil Suizo) | Reserva de valor "último recurso" (Oro, Bonos Suizos, Tierras) | Estabilidad jurídica extrema, supervisión federal |
| El Salvador / Panamá / UAE | Fundación / Trust Offshore | Redundancia geopolítica, custodia de claves maestras | Jurisdicciones no alineadas con Occidente/China |

**Unificación:** Todas las entidades firman un "Convenio de Federación Inmutable" (IFCA v1.0) registrado en Arweave + IPFS + Ethereum L1.

### 7.3 Gobernanza Algorítmica (El "Cerebro")

La FPA no tiene junta directiva humana. Su "voluntad" se expresa mediante Automatons Guardianes (Guardian Automatons) que corren en nodos distribuidos.

```rust
// Pseudocódigo del Guardián FPA (corre en zkVM, inmutable)
struct FPA_Guardian {
    constitution_hash: [u8; 32],  // Hash de constitution.toml v1.0
    asset_registry: AssetRegistry, // Titularidad criptográfica de cada activo
    multisig_threshold: u8,       // ej. 7/11 firmas (claves shardeadas entre nodos Genesis)
}

impl FPA_Guardian {
    fn authorize_transfer(&self, proposal: TransferProposal, zk_proof: ZKProof) -> Result<Tx, Error> {
        // 1. Verificar prueba ZK: "Propuesta pasó Simulador Integral + ΔCAC > 0 + Cumple Permacultura"
        zk_proof.verify(self.constitution_hash)?;
        
        // 2. Verificar firma umbral (Threshold Sig: FROST/ROAST)
        proposal.verify_threshold_sig(self.multisig_threshold)?;
        
        // 3. VETO ABSOLUTO: Si propuesta toca "Activos Clase A" (Tierra, Agua, Semillas, Constitución)
        // Requiere: 90% nodos activos + 1 año timelock + Prueba ZK de "No hay alternativa viable"
        if proposal.asset_class == AssetClass::A && !proposal.has_supermajority_veto_proof() {
            return Err(Error::ClassA_Veto);
        }
        
        // 4. Ejecutar: Firmar transacción
        Ok(self.sign_and_broadcast(proposal))
    }
}
```

**Claves Maestras (Key Ceremony v1.0):**
- Generación: DKG (Distributed Key Generation) entre 100 Nodos Génesis (Fase 0)
- Esquema: FROST (Flexible Round-Optimized Schnorr Threshold) + Shamir Secret Sharing (SLIP-39) para backups físicos
- Ningún humano tiene la clave completa. La "clave" es el protocolo DKG + el código del Guardián.

### 7.4 Clases de Activos y Reglas de Inmutabilidad

| Clase | Activos | Regla de Transferencia | Ejemplo |
|-------|---------|------------------------|---------|
| Clase A — Biofísicos Críticos | Tierras agrícolas, cuencas acuíferas, bosques, bancos de semillas, servidores raíz, patentes de hardware vital | INTRANSFERIBLES. Solo cambio de gestor vía protocolo. Nunca venta, hipoteca o embargo. | FPA compra 500ha. Título: "Nuda propiedad: FPA. Uso y usufructo: Red PSG. Prohibida enajenación." |
| Clase B — Productivos/Operativos | Paneles solares, baterías, impresoras 3D, invernaderos, vehículos logísticos, nodos de cómputo | Transferibles solo dentro de la Red PSG previo ΔCAC > 0. Si nodo sale, activo vuelve a pool FPA. | Nodo Madrid cede inversor 5kW a Nodo Sevilla. Registro + ZK proof de ΔCAC. |
| Clase C — Líquidos/Financieros | BTC, ETH, USDC, EUR, Oro, Acciones | Usables para: Comprar Clase A/B, Pagar gastos legales/energía puente, Subsidiar Becas Semilla. Gestión: Tesorería Algorítmica con límites hardcoded. | Vender 10 BTC → Comprar finca + paneles. Propuesta + ZK proof → Guardián FPA firma. |
| Clase D — Conocimiento/IP | Código (AGPL-3.0), Diseños hardware (CERN-OHL-S v2), Datos genómicos, Modelos IA (Apache 2.0) | Copyleft Viral Obligatorio. Licencia irrevocable. FPA es guardián de la licencia, no dueño del conocimiento. | Fork de FarmBot OS → Mejora PSG → Publicado AGPL. FPA registra hash en Arweave. |

### 7.5 Protocolo Fénix (Resiliencia Extrema)

> Escenario: La cooperativa CIS-ZEITNUS es ilegalizada, cuentas congeladas, nodos clave arrestados, internet cortado.

**Activación Automática (sin intervención humana):**
1. **Detección:** Automatons Sentinel detectan: coop_legal_status == INACTIVE ∨ treasury_frozen ∨ genesis_quorum_lost
2. **Declaración:** Guardian FPA firma Phoenix_Declaration (tx en Bitcoin OP_RETURN + Arweave + Mesh DTN broadcast)
3. **Migración de Claves:** Protocolo DKG de re-shareo (Proactive Secret Sharing) activa nuevas claves en nodos supervivientes
4. **Continuidad Operativa:**
   - Activos Clase A: Siguen en FPA. Gestión pasa a Automatons Steward locales
   - Red Mesh: Se convierte en la infraestructura. Automatons MeshRelay + CosatecaManager + ZNUMinter operan 100% offline
   - Identidad: did:onion / did:key / did:mesh (nuevo método DID para Mesh). ZK-Proofs de unicidad siguen válidos
5. **Recuperación:** Cuando hay conectividad esporádica, State Sync via DTN + ZK-Proofs de validez de transiciones. La red nunca para.

### 7.6 Financiación de la FPA

| Fuente | Mecanismo | % Target |
|--------|-----------|----------|
| Derechos de "Step-up" (Clase B → A) | Cuando un nodo demuestra 5 años de uso regenerativo exitoso, puede solicitar que su infraestructura pase a Clase A. Paga 1% valor contable/año en ZNU a FPA. | 40% |
| Señoreaje ZNU (Controlado) | ZNUMinter quema % de fees de transacción x402 / puente fiat. Quema = donación a FPA. Hardcoded: 0.5% volumen. | 25% |
| Licenciamiento Dual (IP Clase D) | Empresas fuera del PSG que quieran usar patentes/hardware PSG sin compartir mejoras pagan royalty 5% facturación a FPA. | 15% |
| Servicios de "Anclaje Jurídico" | Otras redes/cooperativas/DAOs pagan a FPA para usar su infraestructura legal como wrapper para sus activos. | 10% |
| Rendimientos Clase C | Inversión conservadora (Bonos verdes, BTC staking, Lending DeFi auditado). Solo para gastos operativos FPA. | 10% |

**Superávit:** Cualquier excedente → Compra obligatoria de más Clase A (Tierra, Agua, Semillas, Servidores). La FPA crece inevitablemente.

### 7.7 Auditoría Radical

Cualquier humano, en cualquier momento, puede verificar todo sin pedir permiso:

```bash
# 1. Descargar registro de activos (IPFS/Arweave, < 50MB)
wget https://ipfs.psg.global/ipns/fpa-asset-registry-latest.json.zst

# 2. Verificar pruebas ZK de cada transición de estado
psg-verify-fpa --registry registry.json --proofs-dir ./zk_proofs/ --constitution-hash <HASH_GENESIS>

# Output:
# ✅ Constitution hash matches genesis (0xabc...).
# ✅ 10,243 state transitions verified.
# ✅ 0 Class A transfers detected.
# ✅ 147 Class B transfers: all ΔCAC > 0 verified.
# ✅ Treasury BTC/ETH/USDC balances match on-chain.
# ✅ Land deeds (Notary hashes) match registry.
# ✅ ZK-Proof of "No hidden inflation" verified.
# ⚠️ 3 nodes flagged: asset_registered but no heartbeat > 90 days.
```

### 7.8 Resumen: Por qué la FPA es el "Escudo Financiero"

> "La infraestructura para el destrabajo y la abundancia ya está en los repositorios, pero no se ensambla con buenas intenciones; se ensambla con ingeniería, hardware y un escudo financiero contra la deuda extractiva."

La FPA ES ese escudo:
1. Saca los activos del balance de la cooperativa/banco/estado. Están en una purpose trust algorítmica que no puede endeudarse, ser embargada, o vendida.
2. Convierte deuda extractiva (hipotecas, préstamos, alquileres) en custodia autotrófica. El nodo no paga por la tierra/servidor; lo gestiona y devuelve excedentes al procomún.
3. Hace que el 1€/mes compra propiedad colectiva indefensa, no servicio temporal. Cada euro invertido compra una fracción de un panel solar, un metro de tierra, un servidor que nadie nos podrá quitar.
4. Es el "seguro de vida" de la red. Si mañana prohíben el PSG, la FPA sigue ahí, con las llaves, la tierra, el código, la constitución.

---

## 8. Diagnóstico Nodo — Formulario Oficial

```yaml
# DIAGNÓSTICO NODAL OFICIAL - PSG v2.0
# Copia, rellena y envía. Activa tu NFT "Genesis Node".

nodo_id: ""                          # Se genera automáticamente (did:key)
nombre_operativo: ""                 # Alias / Nick (Público)
ubicacion_bioregion: ""              # Ej: "Madrid-Cuenca Manzanares"
moneda_local: "EUR"                  # ISO 4217

# 1. FLUJO FINANCIERO BIOFÍSICO
ingreso_mensual_neto_eur: 0
gasto_vivienda_eur: 0
gasto_alimentacion_eur: 0
gasto_transporte_eur: 0
gasto_deuda_eur: 0
ahorro_mensual_real_eur: 0
# ⚠️ Si ahorro_mensual_real < 1: El fondo cubre tu cuota 1€ vía Beca Semilla (ZNU)

# 2. HARDWARE / RECURSOS FÍSICOS DISPONIBLES
telefono_viejo_android_version: ""
sbc_disponible: false
mini_pc_servidor: false
paneles_solares_w: 0
baterias_wh: 0
tierra_acceso_m2: 0
velocidad_internet_mbps: 0
isp_tipo: ""

# 3. HABILIDADES OPERATIVAS (TOKENIZABLES EN ZNU)
# Nivel: 0=Ninguna, 1=Básica, 2=Intermedia, 3=Avanzada, 4=Experta
habilidades:
  linux_termux: 0
  redes_mesh_lora: 0
  electricidad_solar_bricolaje: 0
  permacultura_jardineria: 0
  programacion_python_rust: 0
  contabilidad_cooperativa: 0
  facilitacion_grupos_mediacion: 0
  carpinteria_metalisteria: 0
  primeros_auxilios_salud: 0
  otra_especificar: ""

# 4. EXTRAPOLACIÓN VOCACIONAL
vocacion_principal: ""
  # Opciones: [NODO_MESH, GRANJA_AUTOMATA, ENERGIA_SOLAR, DESARROLLADOR_SKILLS,
  #            GOBERNADOR_LOCAL, EDUCADOR_DOJO, LOGISTICA_MESH, INVESTIGADOR_IA,
  #            CURADOR_COSATECA, ARQUITECTO_BIOFISICO, OTRO]
argumento_vocacional: ""
compromiso_temporal_meses: 0
```

---

## 9. Glosario Técnico PSG

| Término | Definición Operativa |
|---------|----------------------|
| Automaton | Agente de software autónomo, verificable, que corre en tu hardware, paga su propio cómputo (x402), genera valor y te paga en ZNUs. |
| ZNU (Unidad Zeitnus) | Unidad de cuenta del sistema. 1 ZNU = 1 Hora Humana Verificada ≈ 1 kWh ≈ 2000 kcal. Crédito mutual respaldado por biofísica. |
| ITC (Integral Time Credits) | Sistema de crédito mutuo local. Balances suman cero. Facilita trueque multilateral en Cosatecas. |
| Cosateca | Almacén/biblioteca de bienes comunes. Acceso libre para nodos. Gestión por Automaton CosatecaManager. |
| CAC (Coeficiente Autonomía Colectiva) | Métrica única de éxito del PSG. CAC = (Bienes Desmercantilizados Accesibles) / (Necesidades Totales Bioregión). |
| Mesh DTN | Red física de nodos que comunica sin internet usando Store-and-Forward. Tu nodo es un router. |
| x402 (HTTP 402) | Estándar web nativo para micropagos. Tu Automaton cobra/paga por API calls, inferencia, storage, compute en ZNUs/stablecoins. |
| Alrayic / Subespacio A / Espacio B | Marco epistemológico para detectar sesgos cognitivos. Entrenamiento mental en Dojos. |
| Fundación Procomún Algorítmico | Entidad legal "bloqueada" que posee la tierra, patentes, servidores centrales. Nadie la controla; los Automatons la administran según Constitución. |
| Beca Semilla | Si tu ahorro_mensual_real < 1€, el fondo cubre tu cuota los primeros 12 meses a cambio de compromiso_temporal_meses >= 12. |

---

## 10. Próximos Pasos Inmediatos

1. **Tú:** Completa Diagnóstico Nodo (Sección 8) → Recibirás node_config.toml + Instrucciones bootstrap.sh
2. **Nosotros (Equipo Núcleo):**
   - [ ] Desplegar Cooperativa CIS-ZEITNUS (Estonia e-Residency + Wyoming DAO LLC)
   - [ ] Lanzar Automaton Runtime v0.1 "Semilla" (APK Termux + Script Pi + Binario Linux)
   - [ ] Activar Tesorería Multisig (Gnosis Safe) en Gnosis Chain
   - [ ] Publicar Constitución v1.0 en IPFS + Arweave + Git
   - [ ] Abrir Lista de Espera Génesis (Formulario ZK-Secrecy)
3. **Comunidad:**
   - Ejecutar bootstrap.sh → Nodo "🟢 VIVO" en Explorer
   - Primera transferencia 1€ → Cooperativa (Referencia: GENESIS-<TU_DID>)
   - Verificar Ciclo Autotrófico Completo en Dashboard
   - Unirse Matrix/Simplex Chat PSG-Genesis (Cifrado E2E, Offline-First via DTN Bridge)

---

**FIN DEL DOCUMENTO PSG v2.0-AUFHEBUNG**

> Este documento es código fuente.
> No pide permiso. Se compila.
> Tu diagnóstico nodal es el make.
> Tu nodo ejecutando bootstrap.sh es el run.
> La red Mesh resultante es el sistema operativo de la civilización siguiente.
