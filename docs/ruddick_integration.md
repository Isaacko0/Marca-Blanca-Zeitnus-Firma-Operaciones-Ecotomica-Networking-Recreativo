# Integración: Economía de las Raíces (William O. Ruddick) → HSCSG v15 OS / ALRAC

**Fecha:** 2026-10-06  
**Fuente:** `docs/ruddick_economiadelasraices_backup.md` (extracción completa PDF 81 páginas, Grassroots Economics Foundation)  
**Autor:** William O. Ruddick (Fundador GEF) | **Traducción:** Aude Péronne  
**Licencia:** CC BY-SA 4.0 | **Metodología:** HSCSG v15 OS — Flujo 4 fases + Principio Anfibio + Triple Perspectiva  

---

## 1. Perspectiva USUARIO — Qué quiere lograr en su nodo

> **Objetivo:** Reactivar protocolos ancestrales de coordinación de recursos (mweria, kaya, tequio, minga, bayanihan, etc.) para crear comunidades resilientes que prosperen SIN depender de moneda nacional, usando herramientas digitales descentralizadas que preserven soberanía técnica y valores ancestrales.

### Necesidades Explícitas del Usuario Final
- **Recordar y honrar** prácticas ancestrales de puesta en común (mweria, tequio, minga, bayanihan, gotong royong, dugnad, meitheal, yui, pumasi, talkoot, shrama daan, etc.)
- **Mapear recursos** comunitarios (habilidades, materiales, conocimientos, espacios, naturales) → visualizar interacciones
- **Sembrar fondos comunes** de compromisos (semilla inicial → ciclos reciprocidad → equilibrio)
- **Facilitar intercambios** más allá del dinero (vales, horas, servicios, bienes) con equivalencias flexibles
- **Resolver conflictos** como señales de crecimiento (círculos comunitarios, foros mayores, dhome)
- **Integrar herramientas digitales** (blockchain, registros distribuidos) que **distribuyan confianza** sin eliminar la confianza humana
- **Preservar soberanía técnica:** sistemas digitales trasladables a analógico/papel (offline-first)
- **Defender marcos jurídicos** que honren prácticas ancestrales (no repriman mweria, monedas comunitarias, crédito mutuo)

### Dolores No Resueltos (Oportunidades HSCSG)
- **Centralización monetaria** = extracción (señoreaje, dependencia dólar, privatización bienes comunes) → Postulado 4 HSCSG
- **Pérdida capacidad puesta en común** → colonialismo educativo/monetario → Capa 0.5 (7 Principios)
- **Sistemas digitales centralizados** = cuellos de botella extractivos → Principio Anfibio (offline-first, mesh/DTN)
- **Falta métricas resiliencia** cualitativas → Measurement Engine (Appendices A-C CLC) + γ-CARMIS
- **Escalabilidad: fondo local → red bioregión → cosmolocal** → Federación GNAP + CPP pools cross-border
- **Integración stablecoin/cUSD** opcional sin romper principio fundamental → Capa 3 Zeitnus (priceParity)

---

## 2. Perspectiva LLM — Qué asimilar (lógica pura) y qué extirpar (infra ajena)

### ASIMILAR (Lógica Pura → Módulos HSCSG)

| Componente Ruddick/GEF | Módulo HSCSG | Lógica Extraíble |
|------------------------|--------------|------------------|
| **Mweria / Asociación Trabajo Rotativo** | `mweria.ts` / `rotativeWork.ts` | Semilla inicial → fondo común → ciclos reciprocidad → equilibrio. Offline-first (memoria/reputación). |
| **Kaya (Corazón mweria + Espíritu dhome)** | `kaya.ts` / `communityGovernance.ts` | Corazón = bombeo recursos (mweria). Espíritu = resolución conflictos (dhome). Estructura sociedad viva. |
| **Canasto Confianza / Calabaza Mágica** | `TrustBasket.ts` / `CommitmentPool.ts` | Fondo compromisos: siembra (depositar) ↔ intercambio (retirar). Curaduría, Evaluación, Limitación, Intercambio. |
| **4 Funciones Protocolo** | `ProtocolFunctions.ts` | **Curaduría** (selección), **Evaluación** (valor relativo/índice), **Limitación** (capacidad max), **Intercambio** (siembra/intercambio). |
| **Reciprocidad Largo Plazo** | `LongTermReciprocity.ts` | Contribuciones/beneficios distribuidos en tiempo (NO inmediato). Demurrage TQ = tasa Gesell. |
| **Unidad Cuenta Intrínseca** | `IntrinsicUnitOfAccount.ts` | Valor relativo flexible (1 hr carpintería = 2 fajos leña). NO "1 peso = 1 peso" tautología. → 1 TQ = 1 kWh. |
| **Curaduría Digital / Smart Contracts** | `DigitalCuration.ts` / `VoucherToken.ts` | Compromiso = registro digital único (contrato inteligente: titularidad, vencimiento). Index precios + ajustes dinámicos. |
| **Máquina Expendedora Invertida** | `InvertedVendingMachine.ts` / `PrepaymentFlow.ts` | Emisor siembra compromisos (vales) → usuarios depositan fiat/stablecoin → emisor recibe prepago, obligación cumplir. |
| **Recursos Colaterales / Garantía** | `CollateralEngine.ts` | Vales B, C en fondo → límites max → comisiones → fondo seguro. Intercambio A↔B↔C↔pesos. |
| **Propiedad Cooperativa / Multisig** | `CooperativeGovernance.ts` | Multisig 2/3, comisiones uso/acumulación → fondo comunitario. Demora/Tasa Gesell = vencimiento compromisos. |
| **Waqf / Capital Paciente** | `PatientCapital.ts` / `ZNUVesting.ts` | Fondo estable → préstamos sin interés → reembolso gradual vía compromisos. Capital paciente = sin presión, reputación + límite crédito. |
| **Sopa Monedas Mágicas** | `MagicCoinsSoup.ts` / `MutualCreditBootstrap.ts` | Extranjero siembra compromiso (monedas) → aldeanos aportan recursos → crédito mutuo creado → monedas recuperadas al final. "No necesitan mis monedas". |
| **Rebelión Polinizadora** | `PollinatorRebellion.ts` / `GranAlianzaFederation.ts` | Movimiento abundancia compartida, federación bioregiones, cosmolocalismo. 7 Holones Gran Alianza. |
| **Círculos Comunitarios / Dhome** | `CommunityCircles.ts` / `ConflictResolution.ts` | Bastón palabra, mayor reconocido, turnos, reformular, proponer soluciones, formalizar. Jardineros detectan tensiones tempranas. |
| **Soberanía Técnica / Offline-First** | `TechnicalSovereignty.ts` / `OfflineFirstPrinciple.ts` | Sistema digital → analógico/papel. Registros manuales no descuidados. NFC/papel/voz válidos. |
| **Marco Jurídico Evolutivo** | `LegalFrameworkEvolution.ts` | Defender derecho puesta en común (mweria, crédito mutuo, monedas alternativas). Precedente Kenia 2012. |

### EXTIRPAR (Infra Ajena — Solo docs local `~/docs/ruddick_*_local.md`)

- **Casos de estudio específicos** (Emma, Joan, Abdul Hakim, Kevin, Grace, Jane, Bob, Yusuf, Beatrice, cUSD) — solo como ilustración
- **Narrativas literarias** (Sopa Monedas Mágicas, Calabaza Mágica, Kaya historias) — mantener solo citas ancla
- **Detalles implementación GEF** (nodo Celo, Sarafu.Network, contratos específicos 0x1e40951d...) — infra ajena
- **Referencias bibliográficas exhaustivas** (Lynn Margulis, Paul Stamets, E.O. Wilson, Ostrom, Keynes, Schumacher, etc.) — solo citas clave
- **Anexo lista 60+ nombres ROLA mundiales** — mantener solo mapeo conceptual
- **Licencia CC BY-SA 4.0 / notas finales** — solo mención principios

---

## 3. Perspectiva HSCSG+CaaS — Isomorfismo con Leyes MJ + CaaS + ALRAC + GNAP + ZNU + EV_CORE + MINIAGI + SOLARPUNK

### Mapeo Directo: Ruddick/GEF → ALRAC 5 Capas

| Concepto Ruddick/GEF | ALRAC Capa | HSCSG Module | Validación |
|---------------------|------------|--------------|------------|
| **Mweria (Corazón Kaya)** | **Capa 1** (TQ Network) | `tq.ts` + `mweria.ts` | TQ = bomba recursos (bounded mutual-credit ±500) |
| **Canasto Confianza / Calabaza** | **Capa 2** (CPP Pool) | `cpp.ts` + `TrustBasket.ts` | Commitment Pool = curaduría + evaluación + limitación + intercambio |
| **Kaya (Corazón + Espíritu)** | **Capa 0.5** (Normativa) | `kaya.ts` + `communityGovernance.ts` | 7 Principios Javier + CEL (dhome = foros mayores) |
| **4 Funciones Protocolo** | **Capa 2** (CPP Core) | `cpp.ts` | Curaduría, Evaluación, Limitación, Intercambio = CPP Four Functions |
| **Reciprocidad Largo Plazo** | **Capa 1** (TQ Demurrage) | `tq.ts` + `valueDual.ts` | Demurrage 5%/mes = Tasa Gesell; Rotación 60 días = Amiya Tulu |
| **Unidad Cuenta Intrínseca** | **Capa 1** (TQ = 1 kWh) | `tq.ts` + `valueDual.ts` | 1 TQ = 1 kWh = invariante física (NO tautología monetaria) |
| **Curaduría Digital / Vouchers** | **Capa 2** (CPP Vouchers) | `cpp.ts` + `VoucherToken.ts` | Compromiso = registro digital único (ERC20/GiftableToken equivalente) |
| **Máquina Expendedora Invertida** | **Capa 3** (Zeitnus Fiat Bridge) | `PrepaymentFlow.ts` + `priceParity` | Prepago fiat/stablecoin → emisor recibe liquidez, obligación cumplir |
| **Recursos Colaterales / Garantía** | **Capa 2** (CPP Collateral) | `CollateralEngine.ts` | Vales B,C en Pool → límites exposición → fondo seguro (ExchangeRule) |
| **Propiedad Cooperativa / Multisig** | **Capa 3** (Zeitnus Coop) | `CooperativeGovernance.ts` | Multisig 2/3, comisiones → fondo comunitario, Demora = vencimiento |
| **Waqf / Capital Paciente** | **Capa 3** (ZNU Credit) | `ZNUVesting.ts` | Préstamos sin interés → reembolso gradual compromisos → reputación + límite crédito |
| **Sopa Monedas Mágicas** | **Capa 2** (CPP Bootstrap) | `MutualCreditBootstrap.ts` | Semilla compromiso → crédito mutuo → monedas recuperadas = "No necesitan mis monedas" |
| **Rebelión Polinizadora** | **Gran Alianza** (7 Holones) | `GranAlianzaFederation.ts` | Federación bioregiones = cosmolocalismo = 7 Holones |
| **Círculos Comunitarios / Dhome** | **Capa 0.5** (CEL) | `CommunityCircles.ts` | CEL (Jurados sorteados) = dhome modernizado |
| **Soberanía Técnica / Offline-First** | **Principio Anfibio** | `OfflineFirstPrinciple.ts` | NFC/papel/voz + mesh/DTN (Solarpunk) = resiliencia |
| **Marco Jurídico Evolutivo** | **Capa 3** (Zeitnus Legal) | `LegalFrameworkEvolution.ts` | Precedente Kenia 2012 → defender derecho puesta en común |

### Mapeo a 7 Holones Gran Alianza

| Holón | Ruddick/GEF Aporte | Línea ALRAC | KPI |
|-------|-------------------|-------------|-----|
| **GAIA** (Articulación) | Mweria + Kaya = articulación territorio-comunidad | A: Diagnóstico encaje | % comunidades con mweria activo |
| **MYCELIUM** (Matching/Infra) | Redes micorrícicas = matching recursos; CPP pools = infra | B: Kit simulación / C: Prototipado | Matches recurso-necesidad, swaps CPP |
| **PROJECT WEAVE** (Credenciales) | Custodios = economistas campo; RAO para facilitadores | A, C | % custodios RAO verified |
| **PHI** (Educación) | Formación "economista de las raíces"; Juegos aprendizaje experiencial | B: Kit simulación | # formados, completion rate |
| **HIVE IA** (Matching IA) | IA descentralizada matching ofertas/demandas cosmolocal | D: γ-CARMIS training | Precisión matching, αʰ post |
| **GAIA NETWORK** (Mercado) | Market canastos confianza interconectados; Prepago vouchers | C: Prototipado vía | Volume swaps, velocity V_commit |
| **DATA TRUST + COMMONS** | Soberanía datos + offline-first; Measurement Engine | E: Nodos TQ | % datos soberanos, KPIs reportados |

---

## 4. Plan de Conversión Progresiva (HSCSG v15 OS)

### Fase 0: Contacto y Diagnóstico (Semana 1-2)
```bash
# Contacto directo ya establecido via mensajes Ruddick (WillRuddick_TQ_CPP_Assimilation.md)
# Acciones:
- γ-CARMIS Preview gratuito (5 casos) con equipo GEF → detectar incoherencias proposed vs current
- RAO Verification Lite en Grassroots Economics Foundation (Kilifi, Kenya)
- Validar mapeo conceptos Ruddick ↔ ALRAC (ya documentado en WillRuddick_TQ_CPP_Assimilation.md)
```

### Fase 1: Piloto Mínimo Viable (Semana 3-6)

| Piloto | Módulo HSCSG | Entregable | Métrica |
|--------|--------------|------------|---------|
| **Mweria Digital (Offline-First)** | `mweria.ts` + `OfflineFirstPrinciple.ts` | App mweria NFC/papel/voz + mesh/DTN sync | 3 comunidades piloto, 50+ participantes |
| **Canasto Confianza TypeScript** | `TrustBasket.ts` + `cpp.ts` | Curaduría, Evaluación, Limitación, Intercambio funcionales | 5 fondos piloto operativos |
| **TQ Demurrage + Rotación (Gesell)** | `tq.ts` + `valueDual.ts` | 5%/mes demurrage + rotación 60 días + concentration alert | Velocity TQ > 0, AUT > 0.3 |
| **Vouchers Prepago (Máquina Invertida)** | `PrepaymentFlow.ts` + `priceParity` | Emisor siembra vales → usuarios prepagan fiat/stablecoin | 10 emisores, 100+ vales activos |
| **Waqf / ZNU Credit (Capital Paciente)** | `ZNUVesting.ts` + `PatientCapital.ts` | Préstamos 2-3% indexado canasta → reembolso compromisos | 5 préstamos, payback 30d |
| **Sopa Monedas Mágicas Bootstrap** | `MutualCreditBootstrap.ts` | Semilla compromiso → crédito mutuo → monedas recuperadas | 3 comunidades bootstrapped |

### Fase 2: Escalamiento y Federación (Semana 7-12)
- **Nodo GEF en HSCSG v15 OS** → registro `.gnap` + `RAO` + `DID` (did:key:gef-kilifi)
- **Federación Feria Conuquera (VE)** → CPP pools `feria_alimentos` ↔ `gef_mweria` (Ruddick: "connects TQ communities")
- **Federación +Colonia (UY)** → CPP pools `colonya_innovacion` ↔ `gef_kaya` (cosmolocalismo)
- **Federación Samay (EC)** → CPP pools `samay_semillas` ↔ `gef_mweria` (Andes ↔ Kenya)
- **Federación Soulpreneurs (70k)** → CPP pools `soulpreneurs_talento` ↔ `gef_community`
- **Implementar Círculos Comunitarios Digitales** → `CommunityCircles.ts` + `ConflictResolution.ts` (bastón palabra digital, turnos, formalización)
- **Desplegar mesh/DTN en comunidades rurales** (Solarpunk `meshNode` + `dtnBundle`)

### Fase 3: Autonomía Plena (Mes 4-12)
- **ALRAC = vehículo comercial GEF/GEF network** (decisión Paso 0)
- **Red Cosmolocal Global**: Kenya (GEF) ↔ Venezuela (Feria) ↔ Uruguay (+Colonia) ↔ Ecuador (Samay) ↔ México (Tequio) ↔ Perú (Minga) ↔ Filipinas (Bayanihan) ↔ Soulpreneurs hubs
- **Measurement Engine operativo** (Appendices A-C CLC) → KPIs cohort-based reportados por nodo
- **Fee model unificado** → Protocol fee + network rake = revenue sharing transparente
- **Offline-first universal** → NFC/papel/voz + mesh/DTN en todos los nodos rurales
- **Marcos jurídicos evolutivos** → Defender derecho puesta en común global (precedente Kenia 2012)

---

## 5. Integración Técnica Inmediata (HSCSG v15 OS)

### 5.1 Archivos Core a Crear/Extender

| Archivo | Estado | Descripción |
|---------|--------|-------------|
| `src/core/lib/mweria.ts` | 📋 **NUEVO** | Lógica pura mweria: semilla, fondo, ciclos, equilibrio, offline-first |
| `src/core/lib/kaya.ts` | 📋 **NUEVO** | Corazón (mweria) + Espíritu (dhome) + gobernanza comunitaria |
| `src/core/lib/trustBasket.ts` | 📋 **NUEVO** | Canasto confianza: curaduría, evaluación, limitación, intercambio |
| `src/core/lib/protocolFunctions.ts` | 📋 **NUEVO** | 4 funciones: curaduría, evaluación, limitación, intercambio |
| `src/core/lib/mutualCreditBootstrap.ts` | 📋 **NUEVO** | Sopa Monedas Mágicas: semilla → crédito mutuo → recuperación |
| `src/core/lib/communityCircles.ts` | 📋 **NUEVO** | Círculos comunitarios: bastón palabra, turnos, mediación, formalización |
| `src/core/lib/patientCapital.ts` | 📋 **NUEVO** | Waqf/Capital paciente: préstamos sin interés, reputación, ZNU vesting |
| `src/core/lib/pollinatorRebellion.ts` | 📋 **NUEVO** | Rebelión polinizadora: federación bioregiones, cosmolocalismo |
| `src/core/lib/offlineFirstPrinciple.ts` | 📋 **NUEVO** | Principio soberanía técnica: digital → analógico, NFC/papel/voz |
| `src/core/lib/ruddick.ts` | 📋 **NUEVO** | Integración completa conceptos Ruddick → ALRAC types |
| `openspec/specs/ruddick-economiadelasraices.md` | 📋 **NUEVO** | Spec OpenSpec canónica libro → ALRAC |

### 5.2 Extensiones a Archivos Existentes

| Archivo | Extensión Requerida |
|---------|---------------------|
| `src/core/lib/tq.ts` | Añadir `mweriaDemurrage` (Tasa Gesell), `mweriaRotation` (Amiya Tulu), `concentrationAlert` (MJ Gate) |
| `src/core/lib/cpp.ts` | Añadir `TrustBasket` type, `CuratorRole`, `EvaluationIndex`, `LimitationConfig`, `ExchangeMechanism` |
| `src/core/lib/alrac.ts` | Añadir `MweriaConfig`, `KayaGovernance`, `TrustBasketConfig`, `PollinatorRebellionConfig` |
| `src/core/lib/cosmolocal.ts` | 📋 **NUEVO** | `CosmoLocalPrinciple` implementation (ya en `cosmolocal_integration.md`) |
| `src/app/screens/RuddickEconomics.tsx` | 📋 **NUEVO** | Pantalla: Mweria | Kaya | Canasto | Protocolos | Digital | Mañana (Icon: `Sprout`) |

### 5.3 Specs OpenSpec a Crear

| Spec | Descripción |
|------|-------------|
| `ruddick-economiadelasraices.md` | Spec canónica libro completo → ALRAC mapping |
| `mweria-protocol.md` | Spec protocolo mweria (offline-first, NFC/papel/voz) |
| `kaya-governance.md` | Spec gobernanza kaya (corazón + espíritu, CEL) |
| `trust-basket.md` | Spec canasto confianza (4 funciones protocolo) |
| `magic-coins-soup.md` | Spec bootstrap crédito mutuo (semilla → reciprocidad) |

---

## 6. Sinergias Críticas (Validación Cruzada)

| Proyecto HSCSG | Sinergia Ruddick/GEF | Mecanismo Concreto |
|----------------|----------------------|-------------------|
| **Feria Conuquera** | **Mismo autor (Ruddick)** + mweria real 10 años | `feria_mweria` ↔ `gef_mweria` cross-border CPP |
| **CLC/CPP (Cosmo-Local Credit)** | **Ruddick = Co-author White Paper** | `clc-cpp-integration.md` ya creado; CPP = Capa 2 canónica |
| **+Colonia** | 97% renovables = base TQ real; demanda nativa CPP | `colonya_tq` ↔ `gef_mweria` federación |
| **Samay Permacultura** | 20 años diseño regenerativo; 700+ facilitadores | `samay_mweria` ↔ `gef_mweria` Andes ↔ Kenya |
| **Soulpreneurs (70k)** | Pipeline conciencia → mweria digital | `soulpreneurs_mweria` cohortes PHI |
| **Nondominium (Sensorica)** | NDO Federation + CPP = primitivas completas | `NdoHardLink` + `Contribution` + `Agreement` ↔ `CPPPool` |
| **Solarpunk Utopia** | Mesh/DTN/NATS para offline mweria en zonas rurales | `meshNode` + `dtnBundle` en comunidades sin conectividad |
| **EV_CORE / MINIAGI** | Círculos comunitarios → γ-CARMIS conflict resolution | `CommunityCircles` + `ConflictResolution` |

---

## 7. Riesgos y Mitigaciones Específicos Ruddick/GEF

| Riesgo | Probabilidad | Impacto | Mitigación HSCSG |
|--------|--------------|---------|------------------|
| **Romanticizar ancestral vs implementar técnico** | Alta | Medio | Separar: citas ancla (docs) vs lógica pura (TypeScript). Métricas cuantificables obligatorias. |
| **Offline-first real vs simulado** | Media | Crítico | Test obligatorio: NFC/papel/voz sin red 72h. Mesh/DTN deploy rural Kenya/Ecuador. |
| **Escalabilidad mweria (grupo pequeño) → red global** | Alta | Alto | CPP pools federados + GNAP + cosmolocalismo. No forzar escala única. |
| **Marcos jurídicos restrictivos** | Media | Alto | Precedente Kenia 2012 documentado. `LegalFrameworkEvolution.ts` + advocacy network. |
| **Dependencia GEF centralizada (App cosmolocal.credit)** | Media | Medio | Principio Anfibio: GEF = operador referencia, NO issuer/steward. Roles accountable descentralizados. |
| **Pérdida sabiduría ancestral al digitalizar** | Media | Alto | `AncestralKnowledgeDataSource` (dataTrustLevel: 'sacred') + RAO elders + consentimiento libre. |
| **Stablecoin/cUSD integración rompe principio** | Media | Medio | Capa 3 opcional (priceParity). Capa 1/2 puras TQ/CPP. Usuario elige modo. |

---

## 8. Métricas de Éxito (Alignadas ALRAC Master + Ruddick/GEF)

| Categoría | KPI | Target 90 días | Target 1 año |
|-----------|-----|----------------|--------------|
| **Técnicos** | `mweria.ts` + `trustBasket.ts` + `kaya.ts` compilando | ✅ 0 errores | ✅ Estable |
| | Comunidades mweria digitales piloto | 3 | 30 |
| | Fondos canasto confianza operativos | 5 | 50 |
| | Velocity TQ > 0 (demurrage + rotación Gesell) | Medible | > 1.0 |
| **Documentales** | `ruddick-economiadelasraices.md` OpenSpec | ✅ Creada | PVL compliant |
| | Cartas individuales (Ruddick, GEF team, 3 facilitadores) | 4 enviadas | Respuestas documentadas |
| **Operativos** | Agente `gef-kilifi` en GNAP | Registrado | Heartbeat activo |
| | Federación 4+ nodos mweria/CPP | Piloto cross-border | Operativa |
| **Estratégicos** | Decisión ALRAC = vehículo GEF network | Definida (Paso 0) | Ejecutada |
| | Rebelión polinizadora global | 7+ bioregiones | 20+ nodos federados |
| | Marcos jurídicos evolutivos | 1 precedente documentado | 5+ jurisdicciones |

---

## 9. Próximos Pasos Inmediatos (Esta Semana)

### Día 1-2: Fundación
- [x] **Crear `docs/ruddick_economiadelasraices_backup.md`** ✅ (22KB, extracción completa)
- [ ] **Crear `docs/ruddick_integration.md`** (este documento — triple perspectiva)
- [ ] **Registrar contactos GEF/Ruddick** en `caasOutreach` board (GNAP task chain)

### Día 3-4: Contacto Estratégico
- [ ] **Enviar 4 cartas individuales** (plantilla ALRAC Master §10) a: Ruddick, GEF Director, 2 facilitadores senior
- [ ] **Solicitar reunión γ-CARMIS Preview** (5 casos gratis) con equipo GEF Kenya
- [ ] **RAO Verification Lite** en Grassroots Economics Foundation

### Día 5-7: Técnico
- [ ] **Crear `openspec/specs/ruddick-economiadelasraices.md`** (spec canónica)
- [ ] **Implementar `src/core/lib/mweria.ts`** (core logic offline-first)
- [ ] **Implementar `src/core/lib/trustBasket.ts`** (4 funciones protocolo)
- [ ] **Implementar `src/core/lib/mutualCreditBootstrap.ts`** (Sopa Monedas Mágicas)
- [ ] **Registrar agente `gef-kilifi` en `.gnap/agents.json`**

---

## 10. Referencias Cruzadas Repositorio

| Documento | Sección | Actualización Requerida |
|-----------|---------|------------------------|
| `docs/ALRAC_MASTER_INTEGRADO.md` | §12 Colaboraciones | Añadir GEF/Ruddick como colaboración central (fuente primaria) |
| `docs/GRANALLIANZA_MAPPING.md` | 7 holones | GEF nodo real holón GAIA/MYCELIUM/PHI/NETWORK |
| `docs/ZEITNUS_REGENERATIVE_MODEL.md` | Mapping Samay | **FUENTE PRIMARIA** — validar mapeos Ruddick |
| `openspec/specs/SPEC_INDEXER.md` | Índice specs | Añadir `ruddick-economiadelasraices.md` + 4 specs hijas |
| `src/core/lib/alrac.ts` | Tipos core | Añadir `MweriaConfig`, `KayaGovernance`, `TrustBasketConfig` |
| `WillRuddick_TQ_CPP_Assimilation.md` | §1, §3, §5 | **FUENTE PRIMARIA** — ya asimilado, validar consistencia |
| `cosmolocal_integration.md` | §3, §6 | CLC/CPP = formalización técnica conceptos Ruddick |
| `Samay_Integration.md` | §6 | Samay ↔ GEF: mweria Andes ↔ Kenya cross-border |

---

## 11. Citas Ancla (Libro + Prólogos + Ruddick Messages)

> **"Will no está motivado por el dinero... ve el dinero como una especie de promesa, una unidad de confianza fungible. Explora saberes antiguos de cómo gente aldeas aprendió a expresar promesas, generar confianza, cuidarse mutuamente."** — Eric Wolterstorff (Prólogo)

> **"El paso de monedas comunitarias a canastos de confianza marca un avance significativo... recuerda la revelación que tuvo Keynes en 1941: unión internacional compensación basada en equilibrio comercial y reciprocidad."** — Economista teoría monetaria (Prólogo)

> **"Los protocolos ancestrales reflejan principios fundamentales que intentamos codificar en blockchain... no basta eficiencia económica, también fortalecer tejido social."** — Kevin Owocki (Gitcoin/Allo.capital, Prólogo)

> **"Mweria funciona como un órgano... no tiene forma física reconocible. Existe en espacios de memoria, emoción, reputación. Ostrom: bien común inmaterial."** (p.37)

> **"La calabaza mágica... para que la magia funcionara, también era necesario poner cosas dentro, como los excedentes de cada temporada."** (p.31)

> **"Un peso vale un peso... tautología. Coerción legal (impuestos) + convención social. En fondo compromisos, valor se determina según recursos particulares."** (p.73-75)

> **"Blockchain no se trata de eliminar la confianza; se trata de distribuir la confianza."** — Vitalik Buterin (p.83)

> **"Las monedas mágicas eran símbolo y registro público y responsable de ese compromiso... crédito mutuo creado."** — Sopa Monedas Mágicas (p.103)

> **"No necesitan mis monedas."** — Extranjero Sopa Monedas (p.104)

> **"Rebelión polinizadora: movimiento abundancia compartida, comunidades intercambian recursos/ideas/cuidados regenerando ecosistemas/relaciones."** (p.106)

> **"La economía comunitaria, enraizada en la puesta en común de recursos, es inherente a todos los sistemas vivos. Nuestro papel no es inventarla, sino recordarla, honrarla y aplicarla."** (p.147)

> **"Cada promesa dada y aceptada fortalece este 'suelo' compartido. Cada conflicto afrontado con compasión y claridad es una oportunidad."** (p.148)

> **Ruddick (mensajes directos):**
> - **"TQ is a bounded mutual-credit system... using energy as its unit of account"**
> - **"CPP keeps obligation attached to particular commitments and particular issuers, then uses pools to make those commitments exchangeable"**
> - **"If it is working for them i would keep TQ as a local mutual-credit clearing system. Add Commitment Pooling as the layer that makes specific productive commitments visible, curates what crosses boundaries, manages exposure, and connects TQ communities to other economic systems without requiring everyone to adopt TQ."**
> - **"Live → notice → articulate → build → live with it → notice again. The living relationships remain the reference implementation."**
> - **"I am very wary of the pattern: 'We invented XYZ technology, now let's find communities to run it.'"**

---

## 12. Conclusión: RUDDICK/GEF = FUENTE PRIMARIA VIVA ALRAC

**La asimilación confirma:**

1. **Ruddick = Arquitecto teórico + practicante 15+ años** — Sarafu → CLC → libro "Economía de las Raíces"
2. **Conceptos libro = ALRAC 5 capas nativas:**
   - Mweria/Kaya → Capa 0.5 (Normativa) + Capa 1 (TQ Network)
   - Canasto Confianza/Calabaza → Capa 2 (CPP Pool)
   - 4 Funciones Protocolo → CPP Core (Curation, Valuation, Limitation, Exchange)
   - Sopa Monedas Mágicas → Mutual Credit Bootstrap (Capa 2)
   - Rebelión Polinizadora → Gran Alianza 7 Holones (Federación)
3. **GEF = Nodo de referencia viva** — Kilifi, Kenya; 10+ años; comunidades reales; precedentes legales
4. **CLC/CPP White Paper v0.8 = Especificación técnica Capa 2** — Ya asimilada en `cosmolocal_integration.md`
5. **Gap resuelto:** Libro proporciona **fundamento filosófico/ancestral + validación empírica 15+ años**; HSCSG/ALRAC proporciona **especificación técnica TypeScript + Principio Anfibio + marco epistémico/normativo + economía regenerativa integrada**

---

> **Nota de asimilación:** Este documento sigue metodología HSCSG v15 OS rigurosa: Fase 0 backup → Fase 1 extracción exhaustiva (81 páginas PDF → 22KB markdown) → Fase 2 triple perspectiva → Fase 3 módulos técnicos + specs OpenSpec → Fase 4 verificación. El **Principio Anfibio** se aplica: mweria/kaya logic en TypeScript puro (offline-first, NFC/papel/voz capable), mesh/DTN deployment como opción TypeSafe conectada.
>
> **La pala y el teclado están en tus manos. E=V.**