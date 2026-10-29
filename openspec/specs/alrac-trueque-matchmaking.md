# Spec OpenSpec: Trueque Descentralizado / Matchmaking Multilateral → HSCSG/ALRAC

**Estado:** borrador de integración  
**Licencia:** MIT (Zeitnus/HSCSG core) + conceptos del documento anexo (atribución a Isaac Flores / Pepe Sevilla)  
**Fuente:** Conversación WhatsApp + documento anexo sobre trueque descentralizado, kibutzim, Red Global de Trueque (27/10/2026)  
**Atribución:** Isaac Flores, Pepe Sevilla — análisis de trueque, kibutzim, RGT, matchmaking  
**Fecha:** 2026-10-28

## 1. ¿Qué es el trueque descentralizado como matchmaking?

El trueque descentralizado no es solo trueque bilateral (A intercambia con B). Es un problema de **matchmaking multilateral**: encontrar ciclos y cadenas en una red de ofertas y necesidades donde el valor circula entre muchos participantes sin requerir coincidencia exacta entre dos personas. Isaac Flores lo denomina técnicamente "Matchmaking o Tinder de productos y servicios".

## 2. Especificaciones OpenSpec sugeridas

### 2.1 Oferta y Necesidad (grafo de intercambio)

```
interface Oferta {
  id: string;
  usuarioId: string;              // DID del oferente
  tipo: 'bien' | 'servicio' | 'conocimiento';
  descripcion: string;
  valorTQ: number;                // Valor en TQ (1 TQ = 1 kWh)
  disponible: boolean;
  ubicacion?: string;             // Para masa crítica local
  fechaCreacion: number;
  raoCredentialId: string;        // Procedencia del ofrecimiento
}

interface Necesidad {
  id: string;
  usuarioId: string;              // DID del necesitante
  tipo: 'bien' | 'servicio' | 'conocimiento';
  descripcion: string;
  valorTQEsperado: number;
  urgente: boolean;
  fechaCreacion: number;
}
```

**Regla:** Una arista existe cuando una oferta satisface una necesidad (tipo compatible, valorTQ >= valorTQEsperado, ubicación compatible).

### 2.2 Algoritmo de matchmaking multilateral

```
interface MatchResult {
  tipo: 'directo-2' | 'ciclo-3' | 'ciclo-n' | 'cadena-credito';
  participantes: string[];        // DIDs en orden de la cadena
  transacciones: TQTransaction[]; // Cada paso de la cadena
  creditoMutuoUsado: boolean;     // Si se usó crédito interno en lugar de ciclo cerrado
  valorTotalTQ: number;
  reputacionPromedio: number;     // CDS de participantes
}
```

**Algoritmo (lenguaje simple del documento):**
1. Buscar match directo de 2 (oferta ↔ necesidad recíproca).
2. Si no existe, buscar ciclos cortos de 3 (A→B, B→C, C→A).
3. Si tampoco, permitir crédito mutuo y buscar la cadena más corta.
4. Priorizar usuarios con buena reputación, cercanía y disponibilidad.

**Regla:** Permitir intercambios de 3 personas y cadenas más largas reduce mucho los tiempos de espera frente a permitir únicamente swaps de dos.

### 2.3 Créditos mutuos y dotación inicial

```
interface CreditoMutuo {
  usuarioId: string;
  saldo: number;                  // -500 a +500 (límite simétrico)
  dotacionInicial: number;        // Ej: 50 créditos al incorporarse
  creditosEmitidosContraValor: number; // Solo contra bien/servicio real
  depreciacionAnual: number;      // Ej: 12% (desincentiva acumulación)
  fechaVencimientoCreditos?: number;
  historialTransacciones: TQTransaction[];
}
```

**Reglas (lecciones de la RGT Argentina):**
- Emitir créditos solo contra valor real entregado (no regalar saldo ilimitado).
- Limitar saldo negativo y positivo de cada usuario (±500 TQ).
- Registrar cada transacción de forma auditable (RAO, identidad verificada, reputación).
- Usar depreciación suave o fechas de vencimiento para evitar acumulación especulativa.
- Separar valor de referencia (peso/canasta) de emisión (no permitir que cualquiera cree créditos sin respaldo).
- Empezar en comunidad pequeña antes de expandir a red nacional.

### 2.4 Reputación y confianza (CDS)

```
interface ReputacionUsuario {
  usuarioId: string;
  puntajeCDS: number;             // Cálculo de Confianza, soberanía
  transaccionesCompletadas: number;
  incumplimientos: number;
  reputacionVecinos: number;      // Confianza de la comunidad local
  fechaUltimaActualizacion: number;
}
```

**Regla:** La confianza se sostiene por proximidad social, vigilancia mutua y reputación (lección del kibutz). El CDS ponderado permite gobernanza sin centro.

## 3. Mapeo a capas ALRAC (resumen ejecutivo)

| Capa ALRAC | Concepto del documento | Implementación |
|---|---|---|
| Capa 0 (Epistémica/AMID) | Matchmaking como ontología, doble coincidencia, matchmaking como Tinder | `openspec/specs/`, `src/core/lib/alrac.ts` (γ-CARMIS, triaxial) |
| Capa 1 (Contable-física TQ) | Créditos mutuos, dotación inicial, depreciación, límite ±500, verificación | `src/core/lib/tq.ts` (verifyTQProhibition, blockArbitrageAttempt, conversionFactor) |
| Capa 2 (Interoperabilidad) | Grafo de ofertas/necesidades, RAO, reputación CDS | `src/core/lib/vasos-comunicantes.ts`, `src/core/lib/boundaries.ts` |
| Capa 3 (Membrana Fiat/ZEITNUS) | Valor de referencia (canasta), ZNU, puente a onchain | `src/core/lib/tq.ts` (conversionFactor, priceParity) |
| Capa 4 (Aplicación ZEITNUS) | Panel de matchmaking, búsqueda en tiempo real, rutas de intercambio | `src/app/screens/` (NeuroArchitecture como mapa de nodo) |
| Capa 5 (Gobernanza) | Asamblea, veto Núcleo, subsidiariedad, nodo piloto | `src/core/state/store.ts`, `src/core/state/alrac.ts` |

## 4. Reglas de negocio traducidas (lecciones del kibutz y la RGT)

| Regla del documento | Traducción técnica HSCSG/ALRAC |
|---|---|
| El kibutz resolvió el trueque con crédito social interno y registro compartido | TQ Ledger + RAO append-only + CDS |
| Doble coincidencia es el problema central | TQ elimina necesidad de coincidencia exacta |
| Créditos se emiten contra valor real | `verifyTQProhibition`, `blockArbitrageAttempt` |
| Depreciación 12% anual (RGT) desincentiva ahorro | `VitalTime` decay, límites de cuenta |
| Colapso RGT por emisión sin control (hiperinflación interna) | Límites de saldo, emisión controlada, no TQ≠fiat |
| Masa crítica local antes de expandir | Nodo piloto, federación progresiva |
| Crédito mutuo resuelve coincidencia exacta | ZNU + CaaS streams + revenue split |
| Registro común auditable | RAO append-only, verificación triaxial |

## 5. Verificación (Fase 3)

- [ ] Consistencia con `src/core/lib/tq.ts` (verifyTQProhibition, blockArbitrageAttempt, conversionFactor, límite ±500)
- [ ] Consistencia con `src/core/lib/alrac.ts` (γ-CARMIS, triaxialVerification, credoSet)
- [ ] Consistencia con `src/core/state/store.ts` (AppState, updateALRAC)
- [ ] No copiar texto literal del documento sin atribución
- [ ] Confirmar specs OpenSpec bajo MIT con atribución a Isaac Flores / Pepe Sevilla

## 6. Referencias

- Conversación WhatsApp Isaac Flores ↔ Pepe Sevilla, 27/10/2026 (contenido pegado)
- Documento anexo: kibutzim, RGT Argentina, double coincidence of wants, matchmaking multilateral, créditos mutuos, depreciación, colapso 1999-2002
- Repo Zeitnus: github.com/Isaacko0/Marca-Blanca-Zeitnus-Firma-Operaciones-Ecotomica-Networking-Recreativo (MIT)
- Principio rector: "El código es territorio. La documentación es mapa. La verdad es el territorio." E=V.
