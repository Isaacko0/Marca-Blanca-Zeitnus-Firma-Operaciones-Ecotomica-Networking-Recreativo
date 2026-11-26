// openspec/specs/alrac-tq-antijerarquia-poder-hereditario.md
// OpenSpec: Origen de la jerarquía, poder hereditario y acumulación sin aporte productivo
// Marco antijerárquico para ALRAC/Zeitnus basado en evidencia antropológica y genética.
// Jerarquía de dominancia inversa, excedente-acumulación, contribución vs acumulación,
// linaje, desigualdad institucionalizada, contabilidad de poder, leyes de clase,
// narrativa de poder, consecuencias de la jerarquía, tecnología social de control.
// Estado: Propuesta — TypeScript puro, límites duros contra acumulación sin contribución.

# SPEC: alrac-tq-antijerarquia-poder-hereditario
**Version:** 1.0.0 (propuesta)
**Status:** Propuesta — pendiente implementación en TypeScript puro
**Source:** Ensayo sobre origen antropológico de jerarquía y poder hereditario (docs/origen-jerarquia-poder-hereditario_backup.md)
**Targets:** `src/core/lib/gobernanza-egalitaria.ts`, `src/core/lib/excedente-acumulacion.ts`, `src/core/lib/contribucion-vs-acumulacion.ts`, `src/core/lib/linaje-poder-hereditario.ts`, `src/core/lib/desigualdad-institucionalizada.ts`, `src/core/lib/contabilidad-poder.ts`, `src/core/lib/leyes-clase-social.ts`, `src/core/lib/narrativa-poder.ts`, `src/core/lib/consecuencias-jerarquia.ts`, `src/core/lib/tecnologia-social-control.ts`, `src/core/lib/boundaries.ts` (DENY)

---

## 1. Principios de diseño

1. **La jerarquía rígida y el poder hereditario no son el estado natural de Homo sapiens.** Son una invención cultural de los últimos ~5.000-6.000 años, ligada al excedente agrícola.
2. **Durante el 95% de la historia humana**, las bandas igualitarias aplicaban "jerarquía de dominancia inversa": el grupo suprimía activamente a quien intentaba acumular poder o recursos sin aportar.
3. **La acumulación de riqueza sin aporte productivo es el problema central:** el excedente permitió que algunos dejaran de trabajar y vivieran del trabajo de otros.
4. **El poder por linaje sanguíneo es una invención cultural**, no biológica (prueba: Cuello de Botella del Cromosoma Y).
5. **El mandato divino es una tecnología ideológica** para naturalizar la desigualdad.
6. **El sistema ALRAC/Zeitnus debe rechazar la acumulación de riqueza sin aporte productivo como principio de diseño.**

---

## 2. Jerarquía de Dominancia Inversa (Boehm)

Mecanismo de gobernanza igualitaria: el grupo actúa activamente para suprimir a cualquier individuo que intente acumular poder o recursos (mediante ridículo, ostracismo o exclusión). No es ausencia de liderazgo, es liderazgo condicionado al aporte.

### 2.1 Interfaz

```typescript
interface MecanismoSupresion {
  id: string;
  objetivo: string;              // persona/entidad que intenta acumular
  tipoAcumulacion: 'poder' | 'recursos' | 'ambos';
  metodoSupresion: 'ridiculo' | 'ostracismo' | 'exclusion' | 'votacion_colectiva';
  aprobadoPorGrupo: boolean;     // 1a1v
  fecha: number;
  activo: boolean;
}

interface DecisionColectiva {
  id: string;
  tema: string;
  votos: Array<{ participanteId: string; voto: 'si' | 'no' | 'abstencion' }>;
  resultado: 'aprobado' | 'rechazado' | 'empate';
  fecha: number;
}
```

### 2.2 Reglas

- Ningún individuo puede acumular poder o recursos sin aporte productivo verificable.
- El grupo puede votar (1a1v) para suprimir la acumulación de un miembro.
- La supresión se registra con mecanismo, método y aprobación del grupo.

---

## 3. Excedente y Acumulación sin Trabajo

La Revolución Neolítica permitió excedente agrícola → almacenamiento → acumulación. Quienes controlaban el excedente dejaron de trabajar y vivieron del trabajo de otros.

### 3.1 Interfaz

```typescript
interface Excedente {
  id: string;
  tipo: 'alimento' | 'recurso' | 'capital';
  cantidad: number;
  unidad: string;
  asociadoATrabajoProductivo: boolean; // false = acumulación sin aporte
  controladoPor: string;               // ID del nodo/persona que controla
  fecha: number;
}

interface AcumulacionSinTrabajo {
  id: string;
  excedenteId: string;
  descripcion: string;
  beneficiarioId: string;
  aporteProductivoVerificado: boolean; // siempre false para esta categoría
  fecha: number;
}
```

### 3.2 Regla

Si `asociadoATrabajoProductivo === false`, el excedente se marca como acumulación sin aporte y se activa `boundaries.ts` DENY.

---

## 4. Contribución vs Acumulación

Separación estricta entre mérito (aporte a la sociedad) y recompensa (acumulación de riqueza).

### 4.1 Interfaz

```typescript
interface AporteProductivo {
  id: string;
  contribuyenteId: string;
  tipo: 'trabajo' | 'conocimiento' | 'cuidado' | 'infraestructura' | 'otro';
  descripcion: string;
  verificable: boolean;
  fecha: number;
}

interface AcumulacionRiqueza {
  id: string;
  beneficiarioId: string;
  cantidad: number;
  unidad: string;
  origen: 'aporte_productivo' | 'herencia' | 'posicion_sanguinea' | 'excedente_controlado' | 'otro';
  esValida: boolean; // true solo si origen === 'aporte_productivo' y verificable
  fecha: number;
}

interface DesconexionMeritoRecompensa {
  id: string;
  caso: string;
  descripcion: string;
  corregido: boolean;
  fecha: number;
}
```

### 4.2 Regla

Una acumulación de riqueza solo es válida si `origen === 'aporte_productivo'` y `verificable === true`. Cualquier otro origen se marca como desconexión mérito-recompensa.

---

## 5. Poder Hereditario por Linaje

Rechazo de transmisión de poder por sangre (Cuello de Botella del Cromosoma Y, Tumba de Varna).

### 5.1 Interfaz

```typescript
interface Linaje {
  id: string;
  personaId: string;
  ancestroPoderoso: string;      // ID del ancestro con poder
  tipoPoder: 'monarquia' | 'patriarcado' | 'clase_elite' | 'otro';
  transmitidoPorSangre: boolean;
  fecha: number;
}

interface PoderHereditario {
  id: string;
  linajeId: string;
  rechazo: boolean;              // siempre true
  motivo: string;                // "invento cultural, no biológico"
  fecha: number;
}
```

### 5.2 Regla

`transmitidoPorSangre === true` → `rechazo === true`. El poder no se transmite por linaje.

---

## 6. Desigualdad Institucionalizada y Hereditaria

Detección de acumulación por estatus, no por mérito (Tumba de Varna, ~4500 a.C.).

### 6.1 Interfaz

```typescript
interface DesigualdadHereditaria {
  id: string;
  caso: string;
  periodo: string;               // ej. "4500 a.C."
  evidencias: string[];          // hallazgos arqueológicos/genéticos
  tipoDesigualdad: 'institucionalizada' | 'hereditaria' | 'ambas';
  rechazada: boolean;            // siempre true
  fecha: number;
}
```

### 6.2 Regla

Cualquier caso de desigualdad hereditaria se marca como `rechazada === true`.

---

## 7. Contabilidad de Poder (quién debe qué a quién)

Trazabilidad de deudas a templos/palacios (Sumeria, Egipto). La escritura se inventó para la contabilidad de poder, no para la poesía.

### 7.1 Interfaz

```typescript
interface DeudaTemploPalacio {
  id: string;
  deudorId: string;
  acreedorId: string;            // templo, palacio, o elite
  cantidad: number;
  unidad: string;
  motivo: string;
  fecha: number;
  pagada: boolean;
}

interface RegistroQuienDebeAQuien {
  id: string;
  deudas: DeudaTemploPalacio[];
  totalPorAcreedor: Map<string, number>;
  fechaActualizacion: number;
}
```

### 7.2 Regla

Toda deuda debe estar registrada con deudor, acreedor, cantidad y motivo. No hay deudas ocultas ni por "estatus".

---

## 8. Leyes de Clase Social

Rechazo de leyes que protegen a una clase elite (Código de Hammurabi: penas según clase social del ofendido/ofensor).

### 8.1 Interfaz

```typescript
interface LeyClase {
  id: string;
  nombre: string;
  protegeA: 'elite' | 'clase_media' | 'clase_baja' | 'todas';
  penalizaA: 'elite' | 'clase_media' | 'clase_baja' | 'todas';
  esIgualitaria: boolean;        // true solo si protegeA === todas && penalizaA === todas
  rechazada: boolean;            // true si !esIgualitaria
  fecha: number;
}
```

### 8.2 Regla

Si `protegeA !== todas` o `penalizaA !== todas`, entonces `rechazada === true`.

---

## 9. Narrativa de Poder (Mandato Divino)

Rechazo de justificaciones ideológicas del poder sin aporte (Faraón como dios, Derecho Divino de los Reyes).

### 9.1 Interfaz

```typescript
interface NarrativaIdeologica {
  id: string;
  nombre: string;
  tipo: 'divino' | 'sangre' | 'tradicion' | 'otro';
  justificaPoderSinAporte: boolean;
  rechazada: boolean;            // true si justificaPoderSinAporte === true
  fecha: number;
}
```

### 9.2 Regla

Si `justificaPoderSinAporte === true`, entonces `rechazada === true`.

---

## 10. Consecuencias de la Jerarquía

Métricas de impacto: salud, desvinculación mérito-recompensa, psicología social.

### 10.1 Interfaz

```typescript
interface ImpactoSalud {
  id: string;
  grupo: 'elite' | 'sudaditos' | 'cazadores_recolectores';
  estaturaPromedio: number;
  desnutricion: boolean;
  enfermedadesInfecciosas: number;
  fecha: number;
}

interface DesvinculacionMeritoRecompensa {
  id: string;
  caso: string;
  recompensaSinAporte: boolean;
  aporteSinRecompensa: boolean;
  corregido: boolean;
  fecha: number;
}

interface PsicologiaSocial {
  id: string;
  sumisionAutoridadArbitraria: boolean;
  desigualdadJustificadaComoNatural: boolean;
  rechazoActivo: boolean;        // true si el grupo rechaza activamente el modelo jerárquico
  fecha: number;
}
```

---

## 11. Tecnología Social de Control de Recursos

El poder monárquico es una tecnología social de control de recursos (~5.000-6.000 años), no el estado natural.

### 11.1 Interfaz

```typescript
interface TecnologiaControlRecursos {
  id: string;
  nombre: string;
  periodo: string;               // ej. "5000-6000 años atrás"
  mecanismo: 'excedente_agricola' | 'almacenamiento' | 'fuerza_militar' | 'narrativa_religiosa' | 'otro';
  controlaRecursos: boolean;
  rechazada: boolean;            // siempre true
  fecha: number;
}
```

---

## 12. Límites Duros (boundaries.ts)

- DENY: acumulación de riqueza sin aporte productivo verificable.
- DENY: poder hereditario por linaje sanguíneo.
- DENY: mandato divino o narrativa ideológica que justifique poder sin aporte.
- DENY: leyes que protejan a una clase elite y penalicen a otra.
- DENY: excedente controlado sin trabajo productivo asociado.
- DENY: normalización de la sumisión a autoridad arbitraria.

---

## 13. Criterios de aceptación

- [ ] `aplicarJerarquiaDominanciaInversa()` suprime acumulación sin aporte con aprobación 1a1v
- [ ] `detectarExcedenteSinTrabajo()` marca excedente no asociado a trabajo productivo
- [ ] `separarMeritoRecompensa()` rechaza acumulación con origen ≠ aporte_productivo
- [ ] `rechazarTransmisionSangre()` rechaza poder transmitido por sangre
- [ ] `detectarAcumulacionEstatus()` marca desigualdad hereditaria como rechazada
- [ ] `registrarDeudaTemploPalacio()` requiere deudor, acreedor, cantidad, motivo
- [ ] `rechazarLeyClase()` rechaza leyes no igualitarias
- [ ] `rechazarMandatoDivino()` rechaza narrativas que justifican poder sin aporte
- [ ] `medirImpactoDesigualdad()` registra impacto en salud, mérito, psicología
- [ ] `esTecnologiaControlRecursos()` rechaza tecnologías de control por excedente/fuerza/narrativa
- [ ] `boundaries.ts` DENY: acumulación sin aporte, poder hereditario, mandato divino, leyes de clase, excedente sin trabajo
- [ ] 0 errores TypeScript nuevos

---

## 14. Vectores de prueba

```typescript
// aplicarJerarquiaDominanciaInversa
Input: { objetivo: "miembro_X", tipoAcumulacion: "recursos", metodoSupresion: "votacion_colectiva", aprobadoPorGrupo: true }
Expected: mecanismo creado con activo=true, aprobadoPorGrupo=true
```

```typescript
// detectarExcedenteSinTrabajo
Input: { tipo: "alimento", cantidad: 1000, asociadoATrabajoProductivo: false, controladoPor: "elite_Y" }
Expected: acumulacionSinTrabajo creada con aporteProductivoVerificado=false
```

```typescript
// separarMeritoRecompensa
Input: { origen: "herencia", verificable: false }
Expected: esValida=false, desconexión detectada
```

```typescript
// rechazarTransmisionSangre
Input: { transmitidoPorSangre: true }
Expected: rechazo=true
```

```typescript
// boundaries DENY
Input: acumulacionSinAporte = true → Expected: error "Acumulación de riqueza sin aporte productivo prohibida"
Input: poderHereditario = true → Expected: error "Poder hereditario por linaje prohibido"
Input: mandatoDivino = true → Expected: error "Mandato divino como justificación de poder prohibido"
Input: leyClaseNoIgualitaria = true → Expected: error "Leyes que protegen a clase elite prohibidas"
```

---

## 15. Dependencias

| Dependencia | Versión | Propósito |
|-------------|---------|-----------|
| `tq-types-extended` | 1.0.0 | Tipos core ALRAC |
| `tq` | 1.0.0 | Unidad contable (1 kWh) para medir aporte vs acumulación |
| `znu` | 1.0.0 | Moneda anfibia para valor económico |
| `caas` | 1.0.0 | Acceso por contribución, no por posición |
| `registrySystem` | 1.0.0 | Registro de mecanismos de supresión, deudas, leyes |
| `rao` | 1.0.0 | Procedencia sin linaje (quién emite, quién recibe) |
| `currentSeeSystem` | 1.0.0 | Trazabilidad y transparencia (Modo Lucidez) |
| `boundaries` | 1.0.0 | Límites duros contra acumulación sin aporte |

---

## 16. Referencias

- `docs/origen-jerarquia-poder-hereditario_backup.md` — Texto completo del ensayo
- Christopher Boehm, "jerarquía de dominancia inversa" (antropología de bandas cazadoras-recolectoras)
- Karmin et al., Nature / Genome Research (Cuello de Botella del Cromosoma Y, 5.000-7.000 años)
- Cultura de Varna (~4500 a.C.), Tumba 43 (desigualdad hereditaria)
- Sumeria y Egipto (~3500-3000 a.C.), escritura como contabilidad, Código de Hammurabi (~1750 a.C.)
- `src/core/lib/tq-types-extended.ts` — Tipos core ALRAC
- `src/core/lib/boundaries.ts` — Límites duros
- `src/core/lib/rao.ts` — RAO: procedencia, emisor, permisos, estado, revocación
- `src/core/lib/currentSeeSystem.ts` — Corrientes unificadas
- `src/core/lib/caas.ts` — Comunidad como Servicio
- `src/core/lib/tq.ts` — TQ 1 kWh
- `src/core/lib/znu.ts` — ZNU moneda anfibia
