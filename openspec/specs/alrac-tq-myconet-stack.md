// openspec/specs/alrac-tq-myconet-stack.md
// OpenSpec: Myconet Stack — Modular Internet/Intranet para Barrios Regenerativos
// Mapas: 11 módulos (Community Network, Directory, Resources, Blueprint, Join, Agreements, Operations, Contribution Tracking, Governance, AI Personal Assistant, Hive) → TypeScript puro
// Estado: Propuesta — pendiente implementación
// Capa: 4 (Interoperabilidad) + Capa 5 (Transición Económica)

# SPEC: alrac-tq-myconet-stack
**Version:** 1.0.0 (propuesta)
**Status:** Propuesta — pendiente implementación en TypeScript
**Source:** RegenTribe tech-stack (Myconet), docs/regen-tribe-org_backup.md
**Targets:** `src/core/lib/myconet-*.ts` (11 módulos), `src/core/state/regen-tribe.ts`

---

## 1. Arquitectura del stack Myconet

Myconet es un stack modular de internet e intranet para barrios regenerativos. Cada módulo puede usarse de forma independiente o como parte de la red conectada completa.

| # | Módulo | Función | Destino técnico |
|---|--------|---------|-----------------|
| 01 | Community Network | Discovery y AI matching de miembros, visión holders, service providers, resource holders | `myconet-community-network.ts` |
| 02 | Neighborhood Directory | Directorio en mapa vivo de barrios regenerativos | `myconet-neighborhood-directory.ts` |
| 03 | Resources & Tools | Archivo curado de recursos regenerativos | `myconet-resources-tools.ts` |
| 04 | Blueprint | Regenerative Neighborhood Wizard (guía de diseño y planificación) | `myconet-blueprint.ts` |
| 05 | Join | Aplicaciones y onboarding (screening, orientación) | `myconet-join.ts` |
| 06 | Agreements | Acuerdos digitales, contribuciones recurrentes, pagos | `myconet-agreements.ts` |
| 07 | Operations | Project boards, task assignment, budget tracking, reporting | `myconet-operations.ts` |
| 08 | Contribution Tracking | Points, badges, reputation portable entre comunidades | `myconet-contribution-tracking.ts` |
| 09 | Governance | AI-facilitated governance, conflictos, propuestas, votación | `myconet-governance.ts` |
| 10 | AI Personal Assistant | Guía personal para residentes | `myconet-ai-assistant.ts` |
| 11 | Hive | Capa inter-comunidad: compartir recursos, conocimiento, excedentes, personas | `myconet-hive.ts` |

---

## 2. Especificación técnica

### 2.1 Interfaz: `MyconetModule`

```typescript
interface MyconetModule {
  id: string;
  name: string;
  number: number;              // 01-11
  status: 'building' | 'planned' | 'active';
  raoCredentialId: string;
  isPublic: boolean;
  createdAt: number;
}
```

### 2.2 Interfaz: `CommunityMember`

```typescript
interface CommunityMember {
  id: string;
  profile: Record<string, unknown>;
  archetype: 'vision-holder' | 'community-member' | 'service-provider' | 'resource-holder' | 'land-guardian' | 'collaborator';
  neighborhoodId?: string;
  reputationScore: number;     // 0-1
  contributions: string[];     // IDs de contribuciones
  timestamp: number;
}
```

### 2.3 Interfaz: `ContributionRecord`

```typescript
interface ContributionRecord {
  id: string;
  memberId: string;
  type: 'labor' | 'resource' | 'knowledge' | 'funds' | 'land';
  amount: number;
  unit: string;
  neighborhoodId: string;
  timestamp: number;
  portable: boolean;           // true = portable entre comunidades
}
```

### 2.4 Función: `registerCommunityMember(member: Omit<CommunityMember, 'id' | 'timestamp'>): CommunityMember`

- Registra un miembro con arquetipo y puntuación de reputación inicial.

### 2.5 Función: `aiMatchMembers(memberId: string, neighborhoodId: string, limit: number): CommunityMember[]`

- Encuentra miembros afines para un barrio dado, usando lógica de matching pura (sin dependencia de plataforma externa).

### 2.6 Función: `recordContribution(contribution: Omit<ContributionRecord, 'id' | 'timestamp'>): ContributionRecord`

- Registra una contribución; si `portable = true`, la reputación se transfiere entre comunidades.

### 2.7 Función: `facilitateGovernance(proposal: unknown, voters: string[], threshold: number): { passed; votes; quorumMet }`

- Proceso de gobernanza asistido por IA: recopila votos, verifica quórum, determina si la propuesta pasa.

### 2.8 Función: `shareAcrossHive(resourceId: string, sourceNeighborhood: string, targetNeighborhoods: string[]): { shared; rejected }`

- Comparte un recurso (conocimiento, excedente, persona) entre barrios en la red Hive.

---

## 3. Integración con specs existentes

| Spec existente | Punto de integración |
|----------------|---------------------|
| `alrac-tq-rnmd` (marco modular) | Los módulos Myconet implementan la capa software del RNMD |
| `alrac-tq-governance-verification` (voto) | Myconet Governance usa el mismo peso de voto (TDF + staked + presence + sweat) |
| `alrac-tq-regen-knowledge-graph` | Resources & Tools y Hive comparten nodos del knowledge graph |
| `alrac-tq-mythogen-ame` | Community Network usa affinity scoring de Mythogen AME |
| `registrySystem.ts` | Los 4 registros separados incluyen contribuciones y reputación |
| `boundaries.ts` | DENY: Stripe como motor de pagos, Telegram como motor de ejecución |

---

## 4. Criterios de aceptación

- [ ] 11 módulos Myconet creados y tipados
- [ ] `registerCommunityMember()` asigna arquetipo y reputación inicial
- [ ] `aiMatchMembers()` retorna miembros ordenados por afinidad
- [ ] `recordContribution()` marca contribuciones portables
- [ ] `facilitateGovernance()` verifica quórum y umbral de aprobación
- [ ] `shareAcrossHive()` transfiere recursos entre barrios
- [ ] 0 errores TypeScript nuevos

---

## 5. Vectores de prueba

```typescript
// registerCommunityMember
Input: { profile: { name: 'María', skills: ['permacultura'] }, archetype: 'service-provider', reputationScore: 0.5 }
Expected: miembro creado con id, timestamp, archetype = 'service-provider'
```

```typescript
// facilitateGovernance
Input: proposal={title: 'nuevo sistema de agua'}, voters=['m1','m2','m3'], threshold=0.5
Expected: { passed: boolean, votes: number, quorumMet: boolean }
```

```typescript
// shareAcrossHive
Input: resourceId='rec-001', sourceNeighborhood='barrio-A', targetNeighborhoods=['barrio-B','barrio-C']
Expected: shared = ['barrio-B','barrio-C']; rejected = []
```

---

## 6. Dependencias

| Dependencia | Versión | Propósito |
|-------------|---------|-----------|
| `tq-types-extended` | 1.0.0 | Tipos core |
| `propertyRegimeSystem` | 1.0.0 | Miembros con arquetipos y roles |
| `regen-knowledge-graph` | 1.0.0 | Resources & Tools y Hive como nodos del grafo |
| `mythogen-ame` | 1.0.0 | Community Network usa affinity scoring |
| `tq-tdf` | 1.0.0 | Peso de voto para gobernanza |
| `boundaries` | 1.0.0 | Límites duros (no Stripe como motor, no Telegram autónomo) |

---

## 7. Referencias

- `docs/regen-tribe-org_backup.md` — Tech-Stack: Myconet (11 módulos), Tribes Platform
- `docs/regen-tribe-org_integration.md` (EBD D35-D41, D43)

---

## 8. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-11-20 | Propuesta inicial: 11 módulos Myconet, matching de miembros, contribuciones portables, gobernanza, Hive |
