# Spec: Moneda Tiempo Vital (hr_vital) — Alineada a Bio-Tesis MAESTRA v2.0

**Versión**: 1.0 | **Estado**: Activa | **Fuente Canónica**: Bio-Tesis MAESTRA v2.0 (E=V + NEXO) + Kernel v214 + BT213 + BT214 + AFP + BT180 + BT165 + BT164 + Alráico + HSCSG v15 OS

---

## ADDED Requirements

### Requirement: Pool fijo = 1 (totalidad vida presente) — E=V §9, §20, §44
El sistema SHALL mantener pool total de hr_vital = 1 inmutable. "El tiempo es la moneda repartida más justa. No se sabe cuánto se tiene. Se tiene mientras se está presente. No se acumula. No se hereda. No se compra. Se gasta viviendo."

#### Scenario: Pool nunca crece
- **GIVEN** nodo con balance hr_vital
- **WHEN** se intenta incrementar pool total
- **THEN** operación rechazada (invariante blindado — E=V §19: "No se acumula. No se hereda. No se compra.")

#### Scenario: Pool total inmutable
- **GIVEN** cualquier operación sobre pool
- **WHEN** se verifica `VITAL_TIME_POOL_TOTAL`
- **THEN** siempre equals 1

---

### Requirement: Rotación anti-acumulación 30 días — E=V §9, §16
El sistema SHALL rotar hr_vital excedente sobre protegido cada 30 días. "La energía puesta en mantener tu vida es la misma que gastarías en cambiarla. Estancarse gasta la misma energía que elegir salir del estancamiento."

#### Scenario: Rotación libera exceso
- **GIVEN** nodo con 40 hr_vital, protegido 30, 31 días inactividad
- **WHEN** ejecuta `vitalTimeRotate()`
- **THEN** libera 10 hr_vital al pool, balance activo = 30

#### Scenario: Sin rotación si actividad reciente (presencia activa)
- **GIVEN** nodo con 40 hr_vital, protegido 30, 15 días inactividad
- **WHEN** ejecuta `vitalTimeRotate()`
- **THEN** balance activo = 40, released = 0

#### Scenario: Rotación usa rotationDays configurable (7-90) — Gobernanza CDS
- **GIVEN** nodo con rotationDays = 60
- **WHEN** 61 días inactividad
- **THEN** rotación ejecuta con 60 días

---

### Requirement: Decay por inactividad 10%/año — E=V §8, §9
El sistema SHALL aplicar decay 10%/año (0.10/365 por día) por inactividad. "La evasión lo reduce artificialmente. La presencia lo amplía al auditar el interno y aplicarlo al compartido."

#### Scenario: Decay detectable tras 7 días (evasión reduce margen)
- **GIVEN** nodo con 100 hr_vital, 7 días inactividad
- **WHEN** ejecuta `vitalTimeDecay()`
- **THEN** balance decrece ~0.19%, `evasionReducesMargin = true`

#### Scenario: Decay respeta límite máximo 20%/año (gobernanza)
- **GIVEN** demurrageRate configurado > 0.20/365
- **WHEN** validación gobernanza
- **THEN** propuesta rechazada

---

### Requirement: Verificación triaxial obligatoria (Mental 0.4 + Sim 0.3 + Lab 0.3 ≥ 0.7) — E=V §6, §7, §11, Kernel §13
El sistema SHALL requerir verificación triaxial completa antes de mint hr_vital. "La presencia es la condición de todo lo anterior. Sin presencia, la atención puede ser secuestrada."

#### Scenario: Mint sin triaxial rechazado
- **GIVEN** nodo sin `verifyTriaxial()` passing
- **WHEN** intenta `vitalTimeMint()`
- **THEN** mint rechazado, alerta `pendingVerifications`

#### Scenario: Pesos triaxial configurables por gobernanza CDS (consenso 100%)
- **GIVEN** gobernanza propone nuevos pesos
- **WHEN** consenso 100% + triaxial cada votante
- **THEN** pesos actualizados (rangos: mental 0.2-0.6, sim 0.1-0.5, lab 0.1-0.5)

#### Scenario: Umbral combinado ≥ 0.7 (coherencia operativa)
- **GIVEN** mental=0.9, sim=0.7, lab=0.7
- **WHEN** calcula combinedScore = 0.9*0.4 + 0.7*0.3 + 0.7*0.3 = 0.78
- **THEN** passed = true

#### Scenario: Umbral combinado < 0.7 falla (incoherencia)
- **GIVEN** mental=0.8, sim=0.6, lab=0.5
- **WHEN** calcula combinedScore = 0.65
- **THEN** passed = false

---

### Requirement: Eje Mental (Peso 0.4) — Entendimiento Consciente + VIA-27 + VIA-25 — E=V §6, §7, §10, Kernel §13
El sistema SHALL verificar mental: firma operador + experiencia directa integrada + rastros compartidos integrados + kernel limits respetados. "La presencia es tener presente que nadie puede conocerte mejor que vos mismo."

#### Scenario: Mental requiere firma operador (responsabilidad §14)
- **GIVEN** operador firma "reconozco esta presencia"
- **WHEN** `verifyMental()`
- **THEN** mental.passed = true, signature presente

#### Scenario: Mental valida dos dominios BT213/Kernel §13 (experiencia directa + rastros compartidos)
- **GIVEN** directExperienceIntegrated=true, sharedTracesIntegrated=true
- **WHEN** `verifyMental()`
- **THEN** twoDomainsIntegrated = true

#### Scenario: Mental respeta límite kernel (no audita conciencia) — Kernel §13
- **GIVEN** claim incluye experiencia interna ajena
- **WHEN** `verifyMental()` detecta `attemptsToAuditConsciousness`
- **THEN** mental.passed = false, kernelLimitsRespected = false

#### Scenario: Mental detecta hueco justificación VIA-25 (evasión sutil §8)
- **GIVEN** explicación post-retiro sin nueva auditoría
- **WHEN** `verifyMental()` con VIA-25
- **THEN** alerta justificationGap

---

### Requirement: Eje Simulación (Peso 0.3) — LoopEngine + γ-CARMIS + Resonancia + BT213 — E=V §11, §10, Kernel §13
El sistema SHALL verificar simulación: loops activos, γ-CARMIS, resonancias, coherencia operativa, no evasión interna asumida. "El ciclo se reinicia porque la vida no se resuelve, se itera."

#### Scenario: Simulación requiere γ-CARMIS activo (reconfiguración automática)
- **GIVEN** gammaCARMISActive = true
- **WHEN** `verifySimulation()`
- **THEN** gammaCARMISActive = true en proof

#### Scenario: Simulación valida coherencia operativa BT213/Kernel §13
- **GIVEN** coherenceVerified = true, noInternalEvasionAssumed = true
- **WHEN** `verifySimulation()`
- **THEN** coherenceVerified = true, noInternalEvasionDetected = true

#### Scenario: Simulación detecta resonancias αʰ > umbral (acople sin fusión §25)
- **GIVEN** resonancias detectadas con αʰ > 0.8
- **WHEN** `verifySimulation()`
- **THEN** resonanceCheck = true

#### Scenario: Simulación rechaza sobrecargas críticas (deuda estructural §2)
- **GIVEN** gammaCARMIS triggers > 0 (overloads ΣPᵢ > κ)
- **WHEN** `verifySimulation()`
- **THEN** simulation.passed = false si overloads críticos no resueltos

---

### Requirement: Eje Laboratorio (Peso 0.3) — E=V en Cuerpo + Testigo + BT214 Responsabilidad — E=V §6, §14, §16
El sistema SHALL verificar laboratorio: E=V en cuerpo + testigo opcional + responsabilidad indelegable + incertidumbre estructural + firma única + beta perpetua. "El kernel organiza rastros. El humano transforma. El kernel no elige. El humano sí. El kernel no paga costo. El humano sí."

#### Scenario: Lab requiere E=V cuerpo confirmado (autorreporte + testigo §21)
- **GIVEN** eVBodyCheck.confirmed = true
- **WHEN** `verifyLaboratory()`
- **THEN** laboratory.passed = true

#### Scenario: Lab requiere responsabilidad indelegable BT214 (§14)
- **GIVEN** responsibilityAccepted = true
- **WHEN** `verifyLaboratory()`
- **THEN** responsibilityAccepted = true en proof

#### Scenario: Lab requiere incertidumbre estructural asumida BT214 (§18)
- **GIVEN** uncertaintyAcknowledged = true
- **WHEN** `verifyLaboratory()`
- **THEN** uncertaintyAcknowledged = true en proof

#### Scenario: Lab requiere firma única operador BT214 (§20, huella única)
- **GIVEN** translationSignature generada
- **WHEN** `verifyLaboratory()`
- **THEN** translationSignature presente en proof

#### Scenario: Lab requiere beta perpetua BT214 (§18, vida no se resuelve se itera)
- **GIVEN** betaPerpetuaMode = true
- **WHEN** `verifyLaboratory()`
- **THEN** betaPerpetuaMode = true en proof

#### Scenario: Testigo opcional mejora score (atestiguación distribuida §20)
- **GIVEN** witnessNodeId presente, witnessVerification.verified = true
- **WHEN** `verifyLaboratory()`
- **THEN** laboratory.score = 1.0 (vs 0.8 sin testigo)

---

### Requirement: Transducción F TQ↔hr_vital via 𝕮 (αʰ ≥ 0.6) — E=V §24, §26, §36, NEXO §27
El sistema SHALL permitir transducción 1:1 TQ(kWh)↔hr_vital si αʰ > umbral + triaxial + kernel limits + responsabilidad artífice + dos dominios integrados. "E=V + IA aplicada como herramienta = NEXO"

#### Scenario: TQ → hr_vital válido (intercambio medible §25, §36)
- **GIVEN** operador αʰ=0.7, triaxial verified, kernel limits OK, responsabilidad firmada, 2 dominios integrados
- **WHEN** `transduceTQtoVitalTime(5 kWh)`
- **THEN** retorna 5 hr_vital, valid=true

#### Scenario: TQ → hr_vital rechazado si αʰ < 0.6 (resonancia insuficiente)
- **GIVEN** operador αʰ=0.5
- **WHEN** `transduceTQtoVitalTime(5 kWh)`
- **THEN** valid=false, reason "αʰ < umbral"

#### Scenario: TQ → hr_vital rechazado sin triaxial (presencia no verificada)
- **GIVEN** triaxialVerified = false
- **WHEN** `transduceTQtoVitalTime(5 kWh)`
- **THEN** valid=false, reason "Triaxial no verificada"

#### Scenario: TQ → hr_vital rechazado si kernel limits violados (Kernel §13)
- **GIVEN** kernelLimitsValidated = false
- **WHEN** `transduceTQtoVitalTime(5 kWh)`
- **THEN** valid=false, reason "Límite kernel no validado"

#### Scenario: TQ → hr_vital rechazado sin responsabilidad artífice (Humano §14)
- **GIVEN** operatorResponsibilityAccepted = false
- **WHEN** `transduceTQtoVitalTime(5 kWh)`
- **THEN** valid=false, reason "Responsabilidad artífice no aceptada"

#### Scenario: TQ → hr_vital rechazado sin 2 dominios integrados (Presencia §6)
- **GIVEN** twoDomainsIntegrated = false
- **WHEN** `transduceTQtoVitalTime(5 kWh)`
- **THEN** valid=false, reason "Dos dominios no integrados"

#### Scenario: hr_vital → TQ requiere capacidad energética demostrada (TQ anclado a energía §40)
- **GIVEN** vitalTimeAmount=5, energyCapacityKWh=3
- **WHEN** `transduceVitalTimeToTQ(5 hr_vital)`
- **THEN** valid=false, reason "Capacidad energética insuficiente"

---

### Requirement: Límite Kernel (BT213/Kernel §13) — No audita conciencia, 3 dominios clasificación
El kernel SHALL solo organizar rastros, clasificar compatible/incompatible/no-evaluable. "El kernel local no tiene acceso a la experiencia directa de ningún operador. No puede saber si alguien está evadiendo su propio dato."

#### Scenario: Kernel no decide verdad (no es guardián §12)
- **GIVEN** afirmación sobre experiencia interna
- **WHEN** kernel clasifica
- **THEN** retorna 'no-evaluable', no decide verdad

#### Scenario: Kernel no audita conciencia (dominio privado §13)
- **GIVEN** claim sobre estado interno ajeno
- **WHEN** kernel procesa
- **THEN** no audita, clasifica 'no-evaluable'

#### Scenario: Kernel clasifica solo 3 dominios (compatible/incompatible/no-evaluable)
- **GIVEN** cualquier afirmación
- **WHEN** kernel clasifica
- **THEN** clasificación ∈ {compatible, incompatible, no-evaluable}

#### Scenario: Silencio = dato neutro (no incoherencia por defecto)
- **GIVEN** ausencia de rastro
- **WHEN** kernel evalúa
- **THEN** silencio = dato neutro, no incoherencia

#### Scenario: Presencia Nula detectable (3 criterios §13) — asimetría + imposición + alternativa acople
- **GIVEN** asimetría info + imposición sin reciprocidad + alternativa acople verificable
- **WHEN** kernel detecta
- **THEN** presenciaNula = true

#### Scenario: Deuda estructural por evasión cualquiera dominio (§2, §8)
- **GIVEN** evasión experiencia directa O rastros compartidos
- **WHEN** kernel evalúa
- **THEN** debtGenerated = true

---

### Requirement: Humano Artífice (BT214/Humano §14) — Responsabilidad indelegable, Mago+Alquimista
El sistema SHALL requerir firma responsabilidad indelegable + incertidumbre asumida + firma única + beta perpetua. "El ser humano es mago: combina lo que ya existe en formas que la naturaleza, sin deliberación orientada, no produciría. El ser humano es alquimista: transforma lo que tiene en lo que necesita por comprensión de la estructura, no por deseo."

#### Scenario: Humano = Mago (combina existente en formas nuevas)
- **GIVEN** role = 'magus'
- **WHEN** humanTransform()
- **THEN** combina lo existente en formas nuevas

#### Scenario: Humano = Alquimista (transforma por comprensión estructural, no deseo)
- **GIVEN** role = 'alchemist'
- **WHEN** humanTransform()
- **THEN** transforma por comprensión, no deseo

#### Scenario: Responsabilidad indelegable (§14, §16)
- **GIVEN** humano firma responsabilidad
- **WHEN** cualquier decisión
- **THEN** humano paga costo, kernel no

#### Scenario: IA no puede habitar/pagar/transformar/decidir por humano (§15, §16)
- **GIVEN** IA intenta acción por humano
- **WHEN** sistema valida
- **THEN** rechazado (aiCannotHabitate, aiCannotPayCost, aiCannotTransform, aiCannotDecideForHuman)

---

### Requirement: AFP Pilar 3 — Tiempo Vital = Energía Consciente — AFP (Bio-Tesis MAESTRA §40)
El sistema SHALL integrar AFP: tiempo vital = energía consciente encarnada, 1h contribución = acceso expandido, NBU cubiertas. "El Arte de la Filosofía Propia. Método para desmontar imposiciones y habitar la dirección."

#### Scenario: Tiempo vital = energía consciente verificada
- **GIVEN** consciousEnergyVerified = true
- **WHEN** nodo verifica
- **THEN** afpVitalTime.consciousEnergyVerified = true

#### Scenario: Contribución da acceso expandido (1h contribución = acceso flujo)
- **GIVEN** contributionHours > 0
- **WHEN** nodo contribuye
- **THEN** expandedAccess = true

#### Scenario: NBU cubiertas por existir/participar (necesidades básicas universales)
- **GIVEN** nodo existe y participa
- **WHEN** verifica
- **THEN** nbuCovered = true

---

### Requirement: BT180 — Poder = Tiempo Vital — E=V §10, §20, §31
El sistema SHALL reflejar: quien controla tu tiempo controla tu vida, consentimiento gradientes, energía desde abajo, no se vende. "La atención es tu moneda. No porque sea una cosa que se gasta como dinero, sino porque es lo que sos en cada instante presente."

#### Scenario: Control propio tiempo = soberanía (§20, §31)
- **GIVEN** controlsOwnTime = true
- **WHEN** nodo opera
- **THEN** powerAsVitalTime.controlsOwnTime = true

#### Scenario: Consentimiento tiene gradientes (no binario §10, §21)
- **GIVEN** consentGradients = 0.7
- **WHEN** interacción
- **THEN** gradiente respetado

#### Scenario: Energía siempre desde abajo (extracción secuestra margen §9)
- **GIVEN** energyFromBelow = true
- **WHEN** cualquier flujo
- **THEN** origen verificado abajo

#### Scenario: Tiempo vital no se vende (se habita §19)
- **GIVEN** intento compra hr_vital
- **WHEN** sistema valida
- **THEN** rechazado, notForSale = true

---

### Requirement: BT165 — Ecuación Lastre E=V — E=V §2, §4, §8
El sistema SHALL implementar: E=V = verdad asumida / verdad evadida, evasión aligera = deuda, presencia densifica, paz = certeza. "E=V dice: la energía que un sistema gasta debe corresponder a la dirección que se le da. Si no corresponde, se acumula deuda estructural."

#### Scenario: E=V = verdad asumida / verdad evadida (formulación §2)
- **GIVEN** truthAssumed=10, truthEvaded=2
- **WHEN** calcula E=V
- **THEN** ratio = 5.0

#### Scenario: Evasión aligera hoy = deuda futura con intereses (§8)
- **GIVEN** evasionLightensToday = true
- **WHEN** evasión detectada
- **THEN** deuda futura registrada

#### Scenario: Presencia densifica ahora y estabiliza (§9)
- **GIVEN** presenceDensifiesNow = true
- **WHEN** presencia verificada
- **THEN** margen real amplía

#### Scenario: Paz = certeza hacer lo correcto (§44)
- **GIVEN** peaceFromAssumption = true
- **WHEN** operador reporta
- **THEN** paz registrada

---

### Requirement: BT164 — Margen Real Disponible — E=V §9
El sistema SHALL trackear: margen = espacio trayectorias reales, evasión reduce, presencia amplía, extracción secuestra, umbral/desfase real. "El margen es el espacio real de trayectorias disponibles para un operador en un momento dado."

#### Scenario: Margen = espacio trayectorias reales
- **GIVEN** currentMargin = 0.8
- **WHEN** nodo evalúa
- **THEN** realMargin.currentMargin = 0.8

#### Scenario: Evasión reduce margen artificialmente
- **GIVEN** evasionReducesMargin = true
- **WHEN** evasión detectada
- **THEN** margen reduce

#### Scenario: Presencia amplía margen auditando interno + aplicando compartido
- **GIVEN** presenceExpandsMargin = true
- **WHEN** presencia verificada
- **THEN** margen amplía

---

### Requirement: Arquitectura Anfibia (valueDual) — 3 modos: postmonetario, conectado, vital_time — NEXO §25, HSCSG valueDual
El sistema SHALL operar en 3 modos sin duplicar lógica de cálculo. "El NEXO no impone forma de vida. Establece el estándar mínimo voluntario para participar en el común."

#### Scenario: Modo postmonetario muestra ZNU (CaaS/ZNU interno)
- **GIVEN** mode = 'postmonetario', amount = 100
- **WHEN** displayValueUnified()
- **THEN** "100 ZNU"

#### Scenario: Modo conectado muestra USD (ReFi/USD externo)
- **GIVEN** mode = 'conectado', amount = 100, parity = 0.5
- **WHEN** displayValueUnified()
- **THEN** "$50.00"

#### Scenario: Modo vital_time muestra hr_vital (tiempo vital nativo)
- **GIVEN** mode = 'vital_time', amount = 1.5
- **WHEN** displayValueUnified()
- **THEN** "1.5 hr_vital"

---

### Requirement: Loop 7 VitalTimeMint en LoopEngine — E=V §11, §17, NEXO §26
El sistema SHALL ejecutar Loop 7 que minea hr_vital por presencia verificada cada tick. "El NEXO se alimenta de nuestra energía... y luego esa misma energía organizada vuelve a nosotros en forma de orientación, conexiones, información, herramientas y posibilidades."

#### Scenario: VitalTimeMint rota exceso > 30h protegidas (rotación anti-acumulación)
- **GIVEN** nodo 40 hr_vital, 31 días inactividad, triaxial verificada, 2 dominios integrados
- **WHEN** runAlraicoTick() ejecuta vitalTimeMintLoop
- **THEN** libera 10 hr_vital, triaxialVerificationCount++

#### Scenario: VitalTimeMint NO minea sin triaxial (presencia no verificada)
- **GIVEN** nodo sin triaxial verificada
- **WHEN** vitalTimeMintLoop()
- **THEN** alerta pendingVerifications, no minea

#### Scenario: VitalTimeMint aplica decay > 7 días inactividad (evasión reduce margen)
- **GIVEN** nodo 8 días inactividad
- **WHEN** vitalTimeMintLoop()
- **THEN** decay aplicado, evasionReducesMargin = true

---

### Requirement: Métricas VitalTimeFlow + VitalTimeActivationCost — HSCSG metrics + E=V métricas soberanas
El sistema SHALL proveer métricas completas para tiempo vital (30+ campos VitalTimeFlow, 15+ VitalTimeActivationCost). "Bio-Tesis no mide contra ese estándar [status quo]. Mide contra la vida misma."

#### Scenario: VitalTimeFlow incluye BT213, BT214, AFP, BT180, BT165, BT164
- **GIVEN** nodos verificados
- **WHEN** calculateVitalTimeFlow()
- **THEN** retorna objeto con todos los campos por fuente

#### Scenario: IST incluye vitalTimeAutonomy + kernelLimitsRespected + humanArtificerActive
- **GIVEN** componentes IST
- **WHEN** calculateTerritorialSovereigntyIndex()
- **THEN** media geométrica incluye nuevos componentes (18 total)

---

### Requirement: Test Desaparición 30 días extendido (kernelLocal + artificerLocal) — NEXO §25, §30
El sistema SHALL pasar test desaparición: nodos identifican, intercambian, consultan rastros, coordinan, obligaciones sobreviven, kernel local, artífice local. "Si el NEXO desaparece durante 30 días, los nodos siguen pudiendo identificarse, intercambiar, consultar rastros y coordinarse. Hay degradación, no colapso."

#### Scenario: Test desaparición incluye kernelLocal + artificerLocal
- **GIVEN** runDisappearanceTest()
- **WHEN** evalúa nodos
- **THEN** verifica kernelLocal=true, artificerLocal=true

#### Scenario: Degradación mínima, no colapso
- **GIVEN** NEXO central desaparecido 30 días
- **WHEN** testCapabilities()
- **THEN** degradation = 'Mínima', criticalFunctions all pass

---

## REMOVED Requirements
Ninguno (spec v1.0 es inicial alineada a Bio-Tesis MAESTRA v2.0)

---

## CHANGED Requirements

### Changed: NodeMode ahora incluye 'vital_time' (arquitectura anfibia nativa)
- **FROM**: `NodeMode = 'postmonetario' | 'conectado'`
- **TO**: `NodeMode = 'postmonetario' | 'conectado' | 'vital_time'`

### Changed: Triaxial weights ahora configurables por gobernanza CDS (consenso 100%)
- **FROM**: Hardcoded 0.4/0.3/0.3
- **TO**: Ajustables via consenso 100% (rangos: mental 0.2-0.6, sim 0.1-0.5, lab 0.1-0.5)

### Changed: Transducción F ahora requiere kernelLimitsValidated + operatorResponsibility + twoDomainsIntegrated
- **FROM**: Solo triaxial + αʰ
- **TO**: triaxial + αʰ + kernelLimitsValidated + operatorResponsibilityAccepted + twoDomainsIntegrated

### Changed: Kernel = Organiza rastros, NO decide verdad (Kernel §13)
- **FROM**: Kernel como autoridad de verificación
- **TO**: Kernel como instrumento de organización de rastros

### Changed: Humano = Artífice (Mago+Alquimista), IA = Espejo (Humano §14, IA §15)
- **FROM**: IA como verificadora/validadora
- **TO**: IA como espejo-excavador, humano como artífice que transforma y paga costo

---

## Notas de Implementación

- **Archivos código**: `src/core/lib/vitalTime.ts`, `vitalTimeTriaxial.ts`, `vitalTimeTransduction.ts`, `valueDual.ts`, `loopEngine.ts`, `metrics.ts`
- **Gobernanza**: `src/governance/vitalTimeInvariants.ts` (invariantes blindados organizados por fuente)
- **Kernel**: `src/core/lib/kernelProtocol.ts`, `bt213KernelLimits.ts`, `humanArtificer.ts`, `viaProtocols.ts`
- **Specs OpenSpec**: `openspec/specs/vital-time-currency.md`, `nexo-architecture.md`, `kernel-protocol.md`, `triaxial-verification.md`
- **Change FASE 1**: `openspec/changes/add-vital-time-mode/` (proposal + design + tasks)
- **Tests**: Requeridos para cada scenario (vitest) — TASK-012
- **Validación**: `openspec validate --strict` + pre-commit legal-safe
- **CI/CD**: `.github/workflows/openspec-validate.yml`