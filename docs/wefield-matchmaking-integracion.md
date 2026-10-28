# 🔗 Integración: WeField — Matchmaking para comunidades y eventos
## Fase 1 — Mapeo a capas ALRAC / HSCSG

**Documento fuente:** `docs/wefield-matchmaking-backup.md`  
**URL fuente:** https://wefield.app/  
**Licencia:** No se encontró LICENSE explícita. Producto comercial.  
**Tratamiento:** Reimplementación de reglas de matchmaking y privacidad. Atribución a WeField.

---

## Mapeo a capas ALRAC/HSCSG

| Funcionalidad (WeField) | Capa ALRAC | Mapeo HSCSG | Regla de negocio extraída |
|---|---|---|---|
| Matchmaking: ofertas ↔ necesidades | Capa 2 — Matchmaking | `matchmakingEngine()` (extiende trueque multilateral de ALRAC) | `match2()`, `cycle3()`, `creditChain()` |
| Resonancia de visión y complementariedad | Capa 4 — Semántica | `visionResonanceScore()`, `complementarityScore()` | Pondera alineación de propósito |
| Rondas en vivo con QR de entrada | Capa 2 — Eventos | `eventCheckIn()`, `qrCode()` | `latecomerToSmallestGroup()` |
| Check-in en la puerta | Capa 2 — Acceso | `realTimeCheckIn()` | Funciona en Zoom también |
| Grupos pequeños (3 modos) | Capa 2 — Grupos | `smallGroupFormation()` (3 modos: conversación, iniciadores, publish) | `groupByComplementarity()` |
| Artefactos personales | Capa 4 — Artefactos | `personalArtifactGenerator()` | `profile()`, `brandReport()`, `futureSelfLetter()` |
| Reflexiones post-sesión + síntesis IA | Capa 4 — Síntesis | `sessionReflection()` + `aiSynthesis()` | `podReflection()`, `starRatings()` |
| Clústeres temáticos | Capa 4 — Análisis | `themeClusters()` | `snapshots()`, `narrativeCards()` |
| Preguntas personalizables | Capa 4 — Configuración | `customQuestions()` | `audioText()`, `multilingual()`, `aiSignals()` |
| Mutual yes (chat privado solo si ambos) | Capa 2 — Consentimiento | `mutualConsentGate()` | `topMatches()`, `mutualInterest()` |
| Mensajería interna (sin correos externos) | Capa 2 — Comunicación | `internalMessaging()` | `mutualOnly()`, `emailNotifications()` |
| "Pregúntale a tus datos" (lenguaje natural) | Capa 4 — IA asistida | `naturalLanguageQuery()` | `dataQA()`, `facilitatorTool()` |
| Wording ajustable por programa | Capa 4 — Configuración | `promptManager()` | `perProgramCustomization()` |
| Datos del usuario son del usuario | Capa 0 — Soberanía | `userDataOwnership()`, `rightToErasure()` | `deleteOnRequest()` |
| No juegos de atención | Capa 2 — Ética | `noAttentionGames()` | `noInfiniteScroll()`, `noAds()` |
| Las máquinas sugieren, las personas deciden | Capa 4 — Soberanía | `userFinalAgency()` | `aiWritesIntroductions()`, `humansDecideSeating()` |

---

## Reglas de negocio traducidas a interfaces ALRAC

```
1. matchmakingEngine(participants[], rules) -> MatchResult[]
   - Cada par se compara.
   - Reglas: Needs ↔ Offers, Vision Resonance, Complementarity.
   - Cada match tiene razón en lenguaje claro.

2. eventCheckIn(participantId, eventId, qrCode) -> GroupAssignment
   - Check-in con QR. Tardíos van al grupo más pequeño.
   - Funciona en Zoom y presencial.

3. smallGroupFormation(participants[], mode, size) -> Group[]
   - Modos: conversation, conversationStarters, oneClickPublish.
   - Tamaño configurable por facilitador.

4. mutualConsentGate(userA, userB) -> boolean
   - Chat privado solo si ambos dicen que sí.
   - Datos de contacto ocultos hasta mutual yes.

5. naturalLanguageQuery(query, communityData) -> Answer
   - Ej: "¿quién aquí trabaja en salud del suelo?"
   - Respuesta basada en datos reales.

6. personalArtifactGenerator(userData, type) -> Artifact
   - Tipos: profile, brandReport, futureSelfLetter.
   - Artefactos que el usuario querría conservar.

7. attentionExtractionProhibition(feature) -> boolean
   - Bloquea scroll infinito, anuncios, venta de perfiles.
   - Sin juegos de atención.

8. promptManager(programId, promptText) -> PromptConfig
   - Cada instrucción de IA puede leerse y reescribirse.
   - Personalización por programa.
```

---

## Reglas de verificación (verify triaxial)

| Verificación | Entrada | Salida | Acción si falla |
|---|---|---|---|
| `verifyMutualConsent` | userA, userB | boolean | Bloquear chat privado |
| `verifyMatchQuality` | match, threshold | boolean | Filtrar matches bajos |
| `verifyNoAttentionGames` | feature | boolean | Rechazar feature extractivo |
| `verifyHumanDecidesSeating` | aiSuggestion, humanChoice | Final seating | IA no decide quién se sienta con quién |
| `verifyDataErasure` | userId | boolean | Borrar datos a solicitud |

---

### Notas de derechos de autor

Las reglas de matchmaking con consentimiento mutuo, prohibición de juegos de atención y soberanía de datos son reimplementadas como especificaciones abiertas. No se copia código de wefield.app. Copia de seguridad local únicamente.