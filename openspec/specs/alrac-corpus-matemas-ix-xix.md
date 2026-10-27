# Spec OpenSpec: Integración Corpus Matemas IX–XIX → HSCSG/ALRAC

**Estado:** borrador de integración filosófico-arquitectónica  
**Licencia:** MIT (Zeitnus/HSCSG core) + contenido original del vault HSCSG de Isaac Ko (atribución obligatoria, sin licencia de terceros)  
**Fuente:** Corpus_Matemas_IX-XIX ubanika cayapa.md (secciones IX–XIX)  
**Atribución:** Isaac Ko / Isaacko0 — HSCSG v15 OS, vault Obsidian personal  
**Fecha:** 2026-10-25

## 1. ¿Qué es el Corpus de Matemas IX–XIX?

Síntesis filosófica y arquitectónica del sistema HSCSG v15 OS. Fusiona Trueque TQ (ecoaldeas federadas), Canutriciotranshumanismo (CNTH), HSCSG, Proyecto ZEITNUS y el Manifiesto Cósmico de la Salvación Vecinal. Contiene matemas (sabiduría poética), subhashitas (apotegmas), apotegmas y códigas (códigos de conducta) en 11 secciones (IX a XIX).

No es software; es la capa epistémica y normativa del sistema. Se asimilan conceptos y arquitectura, no código fuente.

## 2. Especificaciones OpenSpec sugeridas

### 2.1 Índice de Contribución Civilizatoria (ICC)

```
interface ICCContribution {
  id: string;
  actorId: string;              // DID del actor
  evidence: Evidence[];         // Evidencia verificable de contribución
  regeneration: RegenerationMetric;  // Métrica de regeneración ecológica/social
  memory: MemoryLink[];         // Enlaces a memoria colectiva (ancestros, oficios, semillas)
  timestamp: number;
  raoCredentialId: string;      // Anclaje al RAO del actor
}

interface ICCAggregation {
  communityId: string;
  period: string;               // Ej: "2026-Q4"
  totalEvidence: number;
  totalRegeneration: number;
  totalMemoryLinks: number;
  iccScore: number;             // evidence × regeneration × memory
  verifiedBy: string[];         // Asambleístas con firma criptográfica
}
```

**Reglas:**
- ICC mide lo que dejas, no lo que tienes.
- Sin evidencia, es propaganda; sin regeneración, es vanidad; sin memoria, es ruido.
- No es ranking de vanidad: es espejo de la sociedad.
- Contribución no se hereda ni se acapara: se ejerce o se desvanece.

### 2.2 TQ Ledger con Protocolo de Cayapa

Extiende `src/core/lib/tq.ts` con el concepto de **transacción en gesto** (cayapa):

```
interface CayapaTransaction extends TQTransaction {
  type: 'cayapa';                    // Destrabajo ancestral
  gesture: 'handshake' | 'shared-meal' | 'tool-lending' | 'knowledge-transfer';
  counterpartyIds: string[];         // Participantes en la jornada
  sharedMeal?: boolean;              // La olla de sancocho salda lo que el ledger recuerda
  zeroSum: boolean;                  // Siempre true: saldo cero por diseño
  immaterial: boolean;               // No hay deuda que quedar
}
```

**Regla del saldo cero:** "Suma de saldos: cero. Suma de vínculos: incalculable." El día del cero verifica que nadie acumuló ni se ahogó. Perdonar deuda por sequía o enfermedad restablece el saldo cero por decisión, no por olvido.

### 2.3 Rituales de Autotrofia

```
interface AutotrofiaRitual {
  id: string;
  name: 'amanecer-1kwh' | 'cayapa' | 'asamblea-evidencia' | 'sello-escotilla' | 'resurreccion-mensual' | 'dia-del-cero';
  frequency: 'daily' | 'weekly' | 'monthly' | 'annual';
  produces: 'food' | 'energy' | 'knowledge' | 'vinculo' | 'transparencia';
  participants: string[];            // DIDs
  evidenceHash: string;              // Hash del resultado verificable
  zeroSumVerified: boolean;          // Para día del cero: suma de saldos = 0
}
```

**Reglas:**
- Ritual que no nutre es teatro.
- El ritual perfecto es el que desaparece (la comunidad ya no necesita el manual).
- Día del cero: suma de todos los saldos debe ser cero; si no, hay patología del tejido.

### 2.4 Federación Rizomática y DEX

```
interface RizomaticNode {
  id: string;
  name: string;
  territory: string;                 // Nodo territorial (ecoaldea, conuco)
  center: boolean;                   // Siempre false: no tiene centro
  voteWithFeet: boolean;             // Si el pacto deja de resonar, el territorio espera en otra raíz
  escotillaSealed: boolean;          // Cuando la última boca deja de depender del dinero de afuera
  dexBridge: DexBridgeConfig;        // Traducción, no traición: dólares → paneles solares
  conversionFactor: ConversionFactor; // Canasta básica dice la verdad sobre qué vale sustentar una vida
}
```

## 3. Mapeo a capas ALRAC (resumen ejecutivo)

| Capa ALRAC | Concepto del corpus | Implementación |
|---|---|---|
| Capa 0 (Epistémica/AMID) | Matemas, subhashitas, ICC, rituales, conciencia como ingeniería | `openspec/specs/`, `docs/`, `src/core/lib/alrac.ts` (γ-CARMIS, triaxial) |
| Capa 1 (Contable-física TQ) | 1 TQ = 1 kWh, ±500, prohibición cambiaria, ledger del abrazo | `src/core/lib/tq.ts` (verifyTQProhibition, blockArbitrageAttempt) |
| Capa 2 (Interoperabilidad) | NFC sin internet, mTLS/Gossip/Ed25519, DEX como traducción | `src/core/lib/vasos-comunicantes.ts`, `src/core/lib/boundaries.ts` |
| Capa 3 (Membrana Fiat/ZEITNUS) | Factor de Conversión, canasta 500 TQ, DEX externo | `src/core/lib/tq.ts` (conversionFactor) |
| Capa 4 (Aplicación ZEITNUS) | Cayapa como institución, ecoaldea federada, rituales | `src/app/screens/` (NeuroArchitecture como mapa de nodo) |
| Capa 5 (Gobernanza) | Asamblea con firma criptográfica, CDS, veto Núcleo, subsidiaridad | `src/core/state/store.ts`, `src/core/state/alrac.ts` |

## 4. Derechos de autor y licencia

- **Contenido original:** Vault Obsidian HSCSG de Isaac Ko (Isaacko0). Derechos de autor del autor.
- **No es código de terceros:** No hay conflicto de copyleft (no MPL-2.0, no AGPL-3.0).
- **Atribución obligatoria:** Cualquier obra derivada debe atribuir a Isaac Ko / HSCSG v15 OS.
- **Uso permitido:** Documentar conceptos, mantras, subhashitas, apotegmas y códigas; reimplementar arquitectura filosófica en TypeScript/React sin copia literal de texto extenso sin atribución.

## 5. Verificación (Fase 3)

- [ ] Revisar consistencia con `src/core/lib/tq.ts` (verifyTQProhibition, blockArbitrageAttempt, conversionFactor)
- [ ] Revisar consistencia con `src/core/lib/alrac.ts` (γ-CARMIS, triaxialVerification, credoSet)
- [ ] Verificar que no se copie texto literal del vault sin atribución
- [ ] Confirmar que los specs OpenSpec están bajo MIT y citan al autor original

## 6. Referencias

- Fuente: Vault Obsidian HSCSG — `Corpus_Matemas_IX-XIX ubanika cayapa.md` (secciones IX a XIX)
- Repo Zeitnus: github.com/Isaacko0/Marca-Blanca-Zeitnus-Firma-Operaciones-Ecotomica-Networking-Recreativo (MIT)
- Principio rector: "El código es territorio. La documentación es mapa. La verdad es el territorio." E=V.
