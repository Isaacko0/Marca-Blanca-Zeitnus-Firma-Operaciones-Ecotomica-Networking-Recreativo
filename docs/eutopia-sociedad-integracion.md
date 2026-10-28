# 🔗 Integración: Sociedad Eutopia — Red social para el crecimiento humano
## Fase 1 — Mapeo a capas ALRAC / HSCSG

**Documento fuente:** `docs/eutopia-sociedad-backup.md`  
**URL fuente:** https://eutopiasociety.com/  
**Licencia:** No se encontró LICENSE explícita en el HTML capturado.  
**Tratamiento:** Reimplementación de conceptos funcionales, sin copia de código ni diseño. Atribución a Eutopia Society.

---

## Mapeo de funcionalidades a capas ALRAC/HSCSG

| Funcionalidad (Eutopia) | Capa ALRAC | Mapeo HSCSG | Regla de negocio extraída |
|---|---|---|---|
| Red social privada para crecimiento humano | Capa 2 — CaaS | Comunidad como Servicio (CaaS) con reputación | TQ Ledger como capital social y reputación |
| Discurso protegido, sin vigilancia publicitaria | Capa 0 — Límites | Boundaries.failClosed() + TQ prohibición de extracción | Ningún algoritmo de extracción de atención |
| Privacidad por defecto; contacto oculto hasta consentimiento mutuo | Capa 2 — Soberanía | `mutualConsent()` gate | `blockContactUntilBothAgree()` |
| Sin juegos de atención (scroll infinito, anuncios, venta de perfiles) | Capa 2 — Ética de diseño | `attentionExtractionProhibition()` | Bienestar sobre retención |
| Las máquinas sugieren, las personas deciden | Capa 4 — Soberanía | `userFinalAgency()` | La IA sugiere, nunca decide emparejamientos |
| Matchmaking: ofertas ↔ necesidades, resonancia de visión, complementariedad | Capa 2 — Matchmaking | `matchmakingEngine()` (extiende trueque multilateral) | `match2()`, `cycle3()`, `creditChain()` |
| Datos del usuario son del usuario; eliminación a solicitud | Capa 0 — Soberanía de datos | `userDataOwnership()` + `rightToErasure()` | `deleteUserData(userId)` inmediato |
| Mensajería interna sin intercambio de correos | Capa 2 — Comunicación | `internalMessaging()` | `noExternalEmailLeak()` |
| Herramienta de facilitador con lenguaje natural | Capa 4 — IA asistida | `facilitatorQuery(naturalLanguage)` | Judgment humano previo a acción |
| Rondas en vivo con QR de entrada | Capa 2 — Eventos | `eventCheckIn()` + `qrCode()` | `latecomerToSmallestGroup()` |
| Artefactos personales (perfil, informe de marca, carta del yo futuro) | Capa 4 — Artefactos | `personalArtifactGenerator()` | `generateProfile()`, `generateBrandReport()`, `generateFutureSelfLetter()` |

---

## Reglas de negocio traducidas a interfaces ALRAC

```
1. matchmakingEngine(needs, offers, visionResonance, complementarity) -> MatchResult[]
   - Cada par del grupo se compara.
   - Los mejores matches vienen con razón en lenguaje claro.
   - Reglas: Needs ↔ Offers, Vision Resonance, Complementarity.

2. mutualConsent(userA, userB) -> boolean
   - Contacto solo si ambas partes acuerdan.
   - Datos ocultos hasta mutual yes.

3. attentionExtractionProhibition(feature) -> boolean
   - Bloquea scroll infinito, anuncios, venta de perfiles.
   - Si feature es extractivo, está prohibido.

4. userFinalAgency(aiSuggestion, humanDecision) -> FinalDecision
   - La IA sugiere emparejamientos.
   - La persona decide quién conocer.

5. facilitatorQuery(naturalLanguageQuestion, communityData) -> Answer
   - Ej: "¿quién aquí trabaja en salud del suelo?"
   - Respuesta basada en datos reales de la comunidad.

6. personalArtifactGenerator(userData, type) -> Artifact
   - Tipos: profile, brandReport, futureSelfLetter.
   - Artefactos que el usuario querría conservar.
```

---

## Reglas de verificación (verify triaxial)

| Verificación | Entrada | Salida | Acción si falla |
|---|---|---|---|
| `verifyMutualConsent` | userA, userB | boolean | Bloquear contacto |
| `verifyNoAttentionExtraction` | Feature de UI | boolean | Rechazar feature |
| `verifyDataOwnership` | userId, data | boolean | Permitir eliminación |
| `verifyMatchQuality` | needs, offers | MatchScore | Filtrar matches bajos |
| `verifyFacilitatorJudgment` | IA suggestion, human review | Approved/Rejected | Requerir aprobación humana |

---

### Notas de derechos de autor

Conceptos de red social privada, matchmaking con consentimiento mutuo y prohibición de extracción de atención son reimplementados como especificaciones abiertas. No se copia código HTML/CSS/JS de eutopiasociety.com. Copia de seguridad local únicamente.