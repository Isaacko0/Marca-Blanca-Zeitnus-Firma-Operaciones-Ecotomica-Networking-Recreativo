# OpenSpec: ALRAC — WeField — Matchmaking para Comunidades y Eventos
## Fase 2 — Especificación OpenSpec (TypeScript)

**Especificación:** `alrac-wefield-matchmaking`  
**Versión:** 1.0.0  
**Fuente:** https://wefield.app/  
**Licencia:** MIT para specs propias; conceptos de WeField atribuidos, sin copia de código bajo licencia cerrada  
**Capas ALRAC:** 0 (Soberanía de datos), 2 (CaaS / Matchmaking / Comunidad), 4 (IA asistida / Soberanía), 5 (Federación de comunidades)

---

## 1. Interfaces TypeScript

```typescript
// ============================================================================
// ALRAC — WeField: Matchmaking para Comunidades y Eventos
// Capas: 0 (Soberanía de datos), 2 (CaaS / Matchmaking), 4 (IA asistida), 5 (Federación)
// ============================================================================

export type MatchMode = 'needsOffers' | 'visionResonance' | 'complementarity';
export type GroupMode = 'conversation' | 'conversationStarters' | 'oneClickPublish';
export type ConsentState = 'none' | 'requested' | 'granted' | 'revoked';
export type ArtifactType = 'profile' | 'brandReport' | 'futureSelfLetter';
export type FeedbackType = 'podReflection' | 'starRating' | 'narrativeCard';
export type PromptScope = 'global' | 'perProgram';

export interface Participant {
  participantId: string;
  name: string;
  offerings: string[]; // lo que puede ofrecer
  needs: string[];     // lo que necesita
  vision: string;      // visión personal / dirección futura
  dataOwnership: boolean; // true = el usuario posee sus datos
  contactVisible: boolean; // false por defecto
  preferredLanguage: string;
  createdAt: string;
}

export interface MatchResult {
  matchId: string;
  participantA: string;
  participantB: string;
  score: number; // 0-100
  reasons: string[]; // razones en lenguaje claro
  matchModes: MatchMode[];
  mutualConsent: ConsentState;
  chatOpened: boolean;
  createdAt: string;
}

export interface EventCheckIn {
  eventId: string;
  participantId: string;
  qrCode: string;
  checkedInAt: string;
  groupId?: string;
  isLatecomer: boolean;
  assignedToSmallestGroup: boolean;
  platform: 'inPerson' | 'zoom' | 'hybrid';
}

export interface SmallGroup {
  groupId: string;
  eventId: string;
  mode: GroupMode;
  members: string[];
  size: number;
  conversationStarter?: string;
  createdAt: string;
}

export interface PersonalArtifact {
  artifactId: string;
  participantId: string;
  type: ArtifactType;
  content: string;
  generatedAt: string;
  ownedByParticipant: boolean; // siempre true
}

export interface SessionReflection {
  reflectionId: string;
  eventId: string;
  groupId: string;
  participantId: string;
  feedbackType: FeedbackType;
  content: string;
  aiSynthesis?: string; // síntesis IA, revisada por humano
  submittedAt: string;
}

export interface ThemeCluster {
  clusterId: string;
  eventId: string;
  theme: string;
  participantCount: number;
  needsExpressed: string[];
  offeringsExpressed: string[];
  gapDetected: boolean; // necesidades y ofertas no se encuentran
}

export interface FacilitatorQuery {
  queryId: string;
  facilitatorId: string;
  naturalLanguageQuery: string;
  answer: string;
  dataSources: string[];
  humanReviewed: boolean; // judgment humano previo
  createdAt: string;
}

export interface InternalMessage {
  messageId: string;
  fromParticipant: string;
  toParticipant: string;
  content: string;
  mutualConsent: boolean; // true solo si mutual yes
  read: boolean;
  createdAt: string;
}

export interface PromptConfig {
  promptId: string;
  programId: string;
  scope: PromptScope;
  promptText: string;
  aiInstruction: string;
  editableByFacilitator: boolean;
  version: string;
}

// ============================================================================
// Result types
// ============================================================================

export interface MatchEngineResult {
  matches: MatchResult[];
  totalCompared: number;
  rulesApplied: MatchMode[];
}

export interface ConsentResult {
  granted: boolean;
  reason?: string;
  contactRevealed: boolean;
}

export interface AttentionExtractionResult {
  prohibited: boolean;
  feature: string;
  reason: string;
}

// ============================================================================
// ALRAC Interface — WeField
// ============================================================================

export interface AlracWeField {
  // Capa 0 — Soberanía de datos
  verifyDataOwnership: (participantId: string) => Promise<boolean>;
  deleteParticipantData: (participantId: string) => Promise<boolean>;
  rightToErasure: (participantId: string) => Promise<{ deleted: boolean; timestamp: string }>;

  // Capa 2 — CaaS / Matchmaking / Comunidad
  matchmakingEngine: (needs: string[], offers: string[], visionResonance: boolean, complementarity: boolean) => Promise<MatchEngineResult>;
  mutualConsentGate: (participantA: string, participantB: string) => Promise<ConsentResult>;
  eventCheckIn: (eventId: string, participantId: string, qrCode: string, platform?: 'inPerson' | 'zoom' | 'hybrid') => Promise<EventCheckIn>;
  smallGroupFormation: (participants: string[], mode: GroupMode, size: number) => Promise<SmallGroup[]>;
  internalMessaging: (from: string, to: string, content: string) => Promise<InternalMessage>;
  verifyNoAttentionExtraction: (feature: string) => Promise<AttentionExtractionResult>;
  verifyNoInfiniteScroll: () => Promise<boolean>;
  verifyNoAds: () => Promise<boolean>;
  verifyNoProfileSelling: () => Promise<boolean>;

  // Capa 4 — IA asistida / Soberanía
  userFinalAgency: (aiSuggestion: string, humanDecision: string) => Promise<{ final: string; aiOverruled: boolean }>;
  facilitatorQuery: (query: string, communityData: any[]) => Promise<FacilitatorQuery>;
  personalArtifactGenerator: (participantId: string, type: ArtifactType) => Promise<PersonalArtifact>;
  sessionReflection: (reflection: SessionReflection) => Promise<void>;
  themeClusters: (eventId: string) => Promise<ThemeCluster[]>;
  naturalLanguageQuery: (query: string, communityData: any[]) => Promise<string>;
  promptManager: (programId: string, promptText: string, scope: PromptScope) => Promise<PromptConfig>;

  // Capa 5 — Federación de comunidades
  federateCommunity: (communityId: string, targetCommunities: string[]) => Promise<boolean>;
  shareMatchPatterns: (patterns: ThemeCluster[], targetCommunities: string[]) => Promise<boolean>;
}
```

---

## 2. Reglas de negocio (traducidas de WeField)

| # | Regla | Capa | Implementación sugerida |
|---|-------|------|------------------------|
| WF-01 | Datos del participante son del participante; eliminación a solicitud | 0 | `deleteParticipantData` borra todo; `rightToErasure` confirma |
| WF-02 | Privacidad por defecto: contacto oculto hasta consentimiento mutuo | 2 | `mutualConsentGate` requiere `granted` para `contactVisible` |
| WF-03 | Matchmaking: cada par comparado, mejores vienen con razón en lenguaje claro | 2 | `matchmakingEngine` devuelve `reasons[]` por match |
| WF-04 | Máquinas sugieren, las personas deciden | 4 | `userFinalAgency` exige que la persona decida quién conocer |
| WF-05 | Sin juegos de atención (scroll infinito, anuncios, venta de perfiles) | 2 | `verifyNoAttentionExtraction` rechaza features extractivos |
| WF-06 | Mensajería interna sin intercambio de correos externos | 2 | `internalMessaging` no expone emails |
| WF-07 | Herramienta de facilitador con lenguaje natural | 4 | `facilitatorQuery` requiere `humanReviewed` |
| WF-08 | Artefactos personales (perfil, informe de marca, carta del yo futuro) | 4 | `personalArtifactGenerator` para los 3 tipos |
| WF-09 | Reflexiones post-sesión con síntesis IA | 4 | `sessionReflection` con `aiSynthesis` opcional |
| WF-10 | Clústeres temáticos y patrones de la sala | 4 | `themeClusters` detecta gaps necesidades ↔ ofertas |
| WF-11 | Preguntas personalizables por facilitador (audio, texto, multilingüe, IA signals) | 4 | `customQuestions` con audio + text + multilingual |
| WF-12 | Check-in con QR en la puerta; tardíos al grupo más pequeño | 2 | `eventCheckIn` asigna `assignedToSmallestGroup` |
| WF-13 | Wording ajustable por programa (instrucciones de IA reescribibles) | 4 | `promptManager` con `scope: perProgram` |
| WF-14 | Mutuo sí: chat privado solo si ambas partes dicen que sí | 2 | `mutualConsentGate` requiere `granted` de ambas |
| WF-15 | Federación de comunidades y patrones de match | 5 | `federateCommunity` y `shareMatchPatterns` |

---

## 3. Mapeo a capas ALRAC (resumen)

```
Capa 0 (Soberanía de datos / Origen):
  ├── verifyDataOwnership
  ├── deleteParticipantData
  └── rightToErasure

Capa 2 (CaaS / Matchmaking / Comunidad):
  ├── matchmakingEngine (needs ↔ offers, visionResonance, complementarity)
  ├── mutualConsentGate (chat privado solo si ambos)
  ├── eventCheckIn (QR, tardíos al grupo más pequeño)
  ├── smallGroupFormation (3 modos de conversación)
  ├── internalMessaging (sin correos externos)
  ├── verifyNoAttentionExtraction (no scroll infinito, no anuncios, no venta de perfiles)
  └── verifyNoInfiniteScroll / verifyNoAds / verifyNoProfileSelling

Capa 4 (IA asistida / Soberanía / Artefactos):
  ├── userFinalAgency (IA sugiere, persona decide)
  ├── facilitatorQuery (lenguaje natural, humanReviewed)
  ├── personalArtifactGenerator (3 tipos de artefactos)
  ├── sessionReflection (reflexiones post-sesión)
  ├── themeClusters (patrones de la sala)
  ├── naturalLanguageQuery ("pregúntale a tus datos")
  └── promptManager (wording ajustable por programa)

Capa 5 (Federación de comunidades):
  ├── federateCommunity (compartir entre comunidades)
  └── shareMatchPatterns (patrones de matchmaking federados)
```

---

## 4. Verificación (checklist)

- [ ] `matchmakingEngine` implementado con reglas Needs ↔ Offers, Vision Resonance, Complementarity
- [ ] `mutualConsentGate` implementado (chat privado solo si ambas partes)
- [ ] `deleteParticipantData` y `rightToErasure` implementados y probados
- [ ] `verifyNoAttentionExtraction` implementado y probado
- [ ] `userFinalAgency` implementado y probado
- [ ] `facilitatorQuery` implementado con `humanReviewed`
- [ ] `personalArtifactGenerator` implementado para los 3 tipos
- [ ] `eventCheckIn` con QR implementado (inPerson, zoom, hybrid)
- [ ] `smallGroupFormation` con 3 modos implementado
- [ ] `themeClusters` implementado y probado
- [ ] `promptManager` implementado con `scope: perProgram`
- [ ] `federateCommunity` implementado (Capa 5)

---

### Notas de derechos de autor

Esta especificación es una reimplementación de reglas de matchmaking con consentimiento mutuo, prohibición de juegos de atención y soberanía de datos de wefield.app. No copia código de la plataforma. Los conceptos se atribuyen a WeField. La especificación OpenSpec se publica bajo MIT como parte del repo Zeitnus.