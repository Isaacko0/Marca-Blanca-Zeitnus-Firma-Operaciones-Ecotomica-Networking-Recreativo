# Spec: Verificación Triaxial Obligatoria (Alráico Capa 0) — Alineada a Bio-Tesis MAESTRA v2.0

**Versión**: 1.0 | **Estado**: Activa | **Fuente Canónica**: Bio-Tesis MAESTRA v2.0 (E=V §6, §7, §11, §13, §14, §16) + Sistema Alráico (PI, γ-CARMIS, Triaxial) + BT213 (Límite Kernel) + BT214 (Humano Artífice)

---

## ADDED Requirements

### Requirement: Verificación Triaxial = Mental + Simulación + Laboratorio — E=V §6, §11, §13
El sistema SHALL requerir verificación triaxial completa (3 ejes) antes de cualquier mint hr_vital o transducción. "La presencia es la condición de todo lo anterior. Sin presencia, la atención puede ser secuestrada."

#### Scenario: Triaxial obligatoria para mint (presencia verificada)
- **GIVEN** nodo quiere mint hr_vital
- **WHEN** vitalTimeMintLoop()
- **THEN** requiere verifyTriaxial() passing

#### Scenario: Triaxial obligatoria para transducción (resonancia + responsabilidad)
- **GIVEN** nodo quiere transducir TQ↔hr_vital
- **WHEN** transduceTQtoVitalTime() o transduceVitalTimeToTQ()
- **THEN** requiere triaxialVerified = true

---

### Requirement: Eje Mental (Peso 0.4) — Entendimiento Consciente + VIA-27 + VIA-25 — E=V §6, §7, §10
El sistema SHALL verificar mental: firma operador + experiencia directa integrada + rastros compartidos integrados + kernel limits respetados. "La presencia es tener presente que nadie puede conocerte mejor que vos mismo."

#### Scenario: Mental requiere firma operador (responsabilidad §14)
- **GIVEN** operador firma "reconozco esta presencia"
- **WHEN** verifyMental()
- **THEN** mental.passed = true, signature presente

#### Scenario: Mental valida dos dominios Kernel §13 (experiencia directa + rastros compartidos)
- **GIVEN** directExperienceIntegrated=true, sharedTracesIntegrated=true
- **WHEN** verifyMental()
- **THEN** twoDomainsIntegrated = true

#### Scenario: Mental respeta límite kernel (no audita conciencia §13)
- **GIVEN** claim incluye experiencia interna ajena
- **WHEN** verifyMental() detecta attemptsToAuditConsciousness
- **THEN** mental.passed = false, kernelLimitsRespected = false

#### Scenario: Mental detecta hueco justificación VIA-25 (evasión sutil §8)
- **GIVEN** explicación post-retiro sin nueva auditoría
- **WHEN** verifyMental() con VIA-25
- **THEN** alerta justificationGap

---

### Requirement: Eje Simulación (Peso 0.3) — LoopEngine + γ-CARMIS + Resonancia + BT213 — E=V §11, §10
El sistema SHALL verificar simulación: loops activos, γ-CARMIS, resonancias, coherencia operativa, no evasión interna asumida. "El ciclo se reinicia porque la vida no se resuelve, se itera."

#### Scenario: Simulación requiere γ-CARMIS activo (reconfiguración automática §11)
- **GIVEN** gammaCARMISActive = true
- **WHEN** verifySimulation()
- **THEN** gammaCARMISActive = true en proof

#### Scenario: Simulación valida coherencia operativa BT213/Kernel §13
- **GIVEN** coherenceVerified = true, noInternalEvasionAssumed = true
- **WHEN** verifySimulation()
- **THEN** coherenceVerified = true, noInternalEvasionDetected = true

#### Scenario: Simulación detecta resonancias αʰ > umbral (acople sin fusión §26)
- **GIVEN** resonancias detectadas con αʰ > 0.8
- **WHEN** verifySimulation()
- **THEN** resonanceCheck = true

#### Scenario: Simulación rechaza sobrecargas críticas (deuda estructural §2)
- **GIVEN** gammaCARMIS triggers > 0 (overloads ΣPᵢ > κ)
- **WHEN** verifySimulation()
- **THEN** simulation.passed = false si overloads críticos no resueltos

---

### Requirement: Eje Laboratorio (Peso 0.3) — E=V en Cuerpo + Testigo + BT214 Responsabilidad — E=V §6, §14, §16
El sistema SHALL verificar laboratorio: E=V en cuerpo + testigo opcional + responsabilidad indelegable + incertidumbre estructural + firma única + beta perpetua. "El kernel organiza rastros. El humano transforma. El kernel no elige. El humano sí. El kernel no paga costo. El humano sí."

#### Scenario: Lab requiere E=V cuerpo confirmado (autorreporte + testigo §21)
- **GIVEN** eVBodyCheck.confirmed = true
- **WHEN** verifyLaboratory()
- **THEN** laboratory.passed = true

#### Scenario: Lab requiere responsabilidad indelegable BT214 (§14)
- **GIVEN** responsibilityAccepted = true
- **WHEN** verifyLaboratory()
- **THEN** responsibilityAccepted = true en proof

#### Scenario: Lab requiere incertidumbre estructural asumida BT214 (§18)
- **GIVEN** uncertaintyAcknowledged = true
- **WHEN** verifyLaboratory()
- **THEN** uncertaintyAcknowledged = true en proof

#### Scenario: Lab requiere firma única operador BT214 (§20, huella única)
- **GIVEN** translationSignature generada
- **WHEN** verifyLaboratory()
- **THEN** translationSignature presente en proof

#### Scenario: Lab requiere beta perpetua BT214 (§18, vida no se resuelve se itera)
- **GIVEN** betaPerpetuaMode = true
- **WHEN** verifyLaboratory()
- **THEN** betaPerpetuaMode = true en proof

#### Scenario: Testigo opcional mejora score (atestiguación distribuida §20)
- **GIVEN** witnessNodeId presente, witnessVerification.verified = true
- **WHEN** verifyLaboratory()
- **THEN** laboratory.score = 1.0 (vs 0.8 sin testigo)

---

### Requirement: Score Combinado ≥ 0.7 (Ponderado) — Coherencia operativa
El sistema SHALL calcular combinedScore = mental*0.4 + simulation*0.3 + laboratory*0.3 y requerir ≥ 0.7.

#### Scenario: Score ≥ 0.7 pasa (coherencia)
- **GIVEN** mental=0.9, sim=0.7, lab=0.7
- **WHEN** calcula combinedScore = 0.9*0.4 + 0.7*0.3 + 0.7*0.3 = 0.78
- **THEN** passed = true

#### Scenario: Score < 0.7 falla (incoherencia)
- **GIVEN** mental=0.8, sim=0.6, lab=0.5
- **WHEN** calcula combinedScore = 0.65
- **THEN** passed = false

#### Scenario: Pesos ajustables por gobernanza CDS (consenso 100% + triaxial §28)
- **GIVEN** propuesta nuevos pesos
- **WHEN** consenso 100% + triaxial cada votante
- **THEN** pesos actualizados (rangos: mental 0.2-0.6, sim 0.1-0.5, lab 0.1-0.5)

---

### Requirement: Verificación Diaria (Piloto 3 Nodos: YOKA, LAUTARO, ISAAC) — Convergencia §23
El sistema SHALL soportar verificación triaxial diaria para piloto.

#### Scenario: YOKA verifica Mental+Sim+Lab (testigo Lautaro §23)
- **GIVEN** nodo YOKA
- **WHEN** verifyTriaxial() diaria
- **THEN** mental(firma) + sim(loopEngine) + lab(auto) + testigo Lautaro

#### Scenario: LAUTARO verifica Mental+Sim+Lab cuerpo directo (testigo Yoka §23)
- **GIVEN** nodo LAUTARO
- **WHEN** verifyTriaxial() diaria
- **THEN** mental + sim + lab(cuerpo directo) + testigo Yoka

#### Scenario: ISAAC verifica Mental+Sim(Alráico)+Lab (testigo Yoka §23)
- **GIVEN** nodo ISAAC
- **WHEN** verifyTriaxial() diaria
- **THEN** mental + sim(loopEngine+Alráico) + lab + testigo Yoka

---

### Requirement: Integración LoopEngine (Loop 7 VitalTimeMint) — NEXO §26
El LoopEngine SHALL ejecutar Loop 7 que verifica triaxial antes de mint.

#### Scenario: Loop 7 solo minea si triaxial passed
- **GIVEN** nodo con triaxialVerificationCount > 0, 2 dominios integrados
- **WHEN** vitalTimeMintLoop() en runAlraicoTick()
- **THEN** rota exceso, incrementa triaxialVerificationCount

#### Scenario: Loop 7 alerta si sin triaxial
- **GIVEN** nodo sin triaxial verificada
- **WHEN** vitalTimeMintLoop()
- **THEN** pendingVerifications alerta, no minea

---

## Métricas Triaxiales (Bio-Tesis vs SaaS)

| Métrica | Target Gen 3 | Target Gen 7 | Fuente |
|---------|--------------|--------------|--------|
| Verificación triaxial diaria | ≥ 80% días/nodo | ≥ 95% | E=V §6 |
| Triaxial pass rate | ≥ 80% | ≥ 95% | E=V §11 |
| Witness verification rate | ≥ 50% | ≥ 80% | §20, §21 |
| Kernel limits respected | 100% | 100% | Kernel §13 |
| Responsibility accepted | 100% | 100% | Humano §14 |

---

## Archivos Implementación

- `src/core/lib/vitalTimeTriaxial.ts` — verifyTriaxial() + 3 ejes + BT213/BT214
- `src/core/lib/loopEngine.ts` — Loop 7 vitalTimeMintLoop()
- `src/core/lib/vitalTime.ts` — Tipos TriaxialProof con campos BT213/BT214
- `src/governance/vitalTimeInvariants.ts` — Invariantes triaxial blindados