# OpenSpec: ALRAC — Sociedad Eutopia (Red social para el crecimiento humano)
## Fase 2 — Especificación OpenSpec (TypeScript)

**Especificación:** `alrac-eutopia-red-social`  
**Versión:** 1.0.0  
**Fuente:** https://eutopiasociety.com/ (captura SingleFile 28/10/2026)  
**Licencia:** MIT para specs propias; conceptos de Eutopia Society atribuidos, sin copia de código bajo licencia cerrada  
**Capas ALRAC:** 0 (Soberanía de datos), 2 (CaaS / Matchmaking / Comunidad), 4 (IA asistida / Soberanía)

---

## 1. Interfaces TypeScript

```typescript
// ============================================================================
// ALRAC — Sociedad Eutopia: Red social para el crecimiento humano
// Capas: 0 (Soberanía de datos), 2 (CaaS / Matchmaking), 4 (IA asistida / Soberanía)
// ============================================================================

export type MatchMode = 'needsOffers' | 'visionResonance' | 'complementarity';
export type GroupMode = 'conversation' | 'conversationStarters' | 'oneClickPublish';
export type ConsentState = 'none' | 'requested' | 'granted' | 'revoked';
export type ArtifactType = 'profile' | 'brandReport' | 'futureSelfLetter';
export type FeedbackType = 'podReflection' | 'starRating' | 'narrativeCard';

export interface UserProfile {
  userId: string;
  name: string;
  offerings: string[];      // lo que puede ofrecer
  needs: string[];          // lo que necesita
  vision: string;           // visión personal / dirección
  dataOwnership: boolean;   // true = el usuario posee sus datos
  contactVisible: boolean;  // false por defecto (privacidad por defecto)
  createdAt: string;
  updatedAt: string;
}

export interface MatchResult {
  matchId: string;
  userA: string;
  userB: string;
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
  userId: string;
  type: ArtifactType;
  content: string;
  generatedAt: string;
  ownedByUser: boolean; // siempre true
}

export interface SessionReflection {
  reflectionId: string;
  eventId: string;
  groupId: string;
  userId: string;
  feedbackType: FeedbackType;
  content: string;
  aiSynthesis?: string; // síntesis generada por IA, revisada por humano
  submittedAt: string;
}

export interface ThemeCluster {
  clusterId: string;
  eventId: string;
  theme: string;
  participantCount: number;
  needsExpressed: string[];
  offeringsExpressed: string[];
  gapDetected: boolean; // donde necesidades y ofertas no se encuentran
}

export interface FacilitatorQuery {
  queryId: string;
  facilitatorId: string;
  naturalLanguageQuery: string;
  answer: string;
  dataSources: string[]; // qué datos de la comunidad se usaron
  humanReviewed: boolean; // judgment humano previo
  createdAt: string;
}

export interface InternalMessage {
  messageId: string;
  fromUser: string;
  toUser: string;
  content: string;
  mutualConsent: boolean; // true solo si mutual yes
  read: boolean;
  createdAt: string;
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
// ALRAC Interface — Sociedad Eutopia
// ============================================================================

export interface AlracEutopiaSocial {
  // Capa 0 — Soberanía de datos
  verifyDataOwnership: (userId: string) => Promise<boolean>;
  deleteUserData: (userId: string) => Promise<boolean>;
  rightToErasure: (userId: string) => Promise<{ deleted: boolean; timestamp: string }>;

  // Capa 2 — CaaS / Matchmaking / Comunidad
  matchmakingEngine: (needs: string[], offers: string[], visionResonance: boolean, complementarity: boolean) => Promise<MatchEngineResult>;
  mutualConsentGate: (userA: string, userB: string) => Promise<ConsentResult>;
  eventCheckIn: (eventId: string, participantId: string, qrCode: string) => Promise<EventCheckIn>;
  smallGroupFormation: (participants: string[], mode: GroupMode, size: number) => Promise<SmallGroup[]>;
  internalMessaging: (from: string, to: string, content: string) => Promise<InternalMessage>;
  verifyNoAttentionExtraction: (feature: string) => Promise<AttentionExtractionResult>;

  // Capa 4 — IA asistida / Soberanía
  userFinalAgency: (aiSuggestion: string, humanDecision: string) => Promise<{ final: string; aiOverruled: boolean }>;
  facilitatorQuery: (query: string, communityData: any[]) => Promise<FacilitatorQuery>;
  personalArtifactGenerator: (userId: string, type: ArtifactType) => Promise<PersonalArtifact>;
  sessionReflection: (reflection: SessionReflection) => Promise<void>;
  themeClusters: (eventId: string) => Promise<ThemeCluster[]>;
  naturalLanguageQuery: (query: string, communityData: any[]) => Promise<string>;

  // Promesas éticas
  verifyNoInfiniteScroll: () => Promise<boolean>;
  verifyNoAds: () => Promise<boolean>;
  verifyNoProfileSelling: () => Promise<boolean>;
  verifyMachinesSuggestHumansDecide: (aiSuggestion: string, humanChoice: string) => Promise<boolean>;
}
```

---

## 2. Reglas de negocio (traducidas de Eutopia)

| # | Regla | Capa | Implementación sugerida |
|---|-------|------|------------------------|
| EU-01 | Datos del usuario son del usuario; eliminación a solicitud | 0 | `deleteUserData` borra todo; `rightToErasure` confirma |
| EU-02 | Privacidad por defecto: contacto oculto hasta consentimiento mutuo | 2 | `mutualConsentGate` requiere `granted` para `contactVisible` |
| EU-03 | Matchmaking: ofertas ↔ necesidades con razones en lenguaje claro | 2 | `matchmakingEngine` devuelve `reasons[]` por match |
| EU-04 | Las máquinas sugieren, las personas deciden | 4 | `userFinalAgency` exige `humanDecision` prevalezca |
| EU-05 | Sin juegos de atención (scroll infinito, anuncios, venta de perfiles) | 2 | `verifyNoAttentionExtraction` rechaza features extractivos |
| EU-06 | Mensajería interna sin intercambio de correos | 2 | `internalMessaging` no expone emails externos |
| EU-07 | Herramienta de facilitador con lenguaje natural | 4 | `facilitatorQuery` requiere `humanReviewed` |
| EU-08 | Artefactos personales que el usuario querría conservar | 4 | `personalArtifactGenerator` genera profile/brandReport/futureSelfLetter |
| EU-09 | Reflexiones post-sesión sintetizadas por IA | 4 | `sessionReflection` con `aiSynthesis` opcional |
| EU-10 | Clústeres temáticos y patrones de la sala | 4 | `themeClusters` detecta gaps entre necesidades y ofertas |
| EU-11 | Preguntas personalizables por facilitador | 4 | `customQuestions` con audio, texto, multilingüe, IA signals |
| EU-12 | Check-in con QR; tardíos al grupo más pequeño | 2 | `eventCheckIn` asigna `assignedToSmallestGroup` si latecomer |

---

## 3. Mapeo a capas ALRAC (resumen)

```
Capa 0 (Soberanía de datos / Origen):
  ├── verifyDataOwnership
  ├── deleteUserData
  └── rightToErasure

Capa 2 (CaaS / Matchmaking / Comunidad):
  ├── matchmakingEngine
  ├── mutualConsentGate
  ├── eventCheckIn
  ├── smallGroupFormation
  ├── internalMessaging
  ├── verifyNoAttentionExtraction
  └── verifyNoInfiniteScroll / verifyNoAds / verifyNoProfileSelling

Capa 4 (IA asistida / Soberanía / Artefactos):
  ├── userFinalAgency
  ├── facilitatorQuery
  ├── personalArtifactGenerator
  ├── sessionReflection
  ├── themeClusters
  └── naturalLanguageQuery
```

---

## 4. Verificación (checklist)

- [ ] `matchmakingEngine` implementado y probado con reglas Needs ↔ Offers, Vision Resonance, Complementarity
- [ ] `mutualConsentGate` implementado y probado (chat privado solo si ambos)
- [ ] `deleteUserData` y `rightToErasure` implementados y probados
- [ ] `verifyNoAttentionExtraction` implementado y probado
- [ ] `userFinalAgency` implementado y probado
- [ ] `facilitatorQuery` implementado y probado (con humanReviewed)
- [ ] `personalArtifactGenerator` implementado para los 3 tipos
- [ ] `eventCheckIn` con QR implementado y probado
- [ ] `smallGroupFormation` con 3 modos implementado
- [ ] `themeClusters` implementado y probado

---

### Notas de derechos de autor

Esta especificación es una reimplementación de conceptos funcionales de eutopiasociety.com. No copia código HTML/CSS/JS ni diseño visual. Los conceptos se atribuyen a Eutopia Society. La especificación OpenSpec se publica bajo MIT como parte del repo Zeitnus.