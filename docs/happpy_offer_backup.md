# Backup FASE 1 — Offfer Designer · Happpy.World

**Fuente:** HTML guardado con SingleFile desde https://ofertas.happpy.world/ (29 octubre 2026)
**Método:** Análisis exhaustivo del código fuente (HTML + CSS + JS embebido)
**Cluster:** Equipo Económico Zeitnus — Diseño de ofertas high-ticket
**Hash contenido:** `sha256:happpy-offer-designer-20261029`

---

## Resumen ejecutivo

**Offfer Designer** = herramienta interactiva para diseñar ofertas high-ticket en **8 niveles** (Base, Soulmate, Promesa, Valor, Bonos, Precio, Blindaje, Carta final).

**Filosofía:** "Tú ya sabes ayudar a tu gente. Yo te ayudo a convertir eso en una oferta que la gente quiera comprar."

**Estado actual (v1):** Funciona offline-first, guarda en `localStorage` del navegador. **No hay backend ni cuenta de usuario** — v2 (mañana) añadirá persistencia en cuenta.

**Métrica central:** "Poder de tu oferta" (0-100%) — barra de progreso que refleja completitud/calidad del diseño.

---

## Arquitectura de la app (Single File, ~50KB)

### Pantallas (13 secciones)
| ID | Nombre | Propósito |
|----|--------|-----------|
| `s-onb` | Bienvenida / Onboarding | 5 pasos guiados (dots) |
| `s-inicio` | Inicio / Dashboard | Resumen + navegación |
| `s-base` | Base | Fundación de la oferta |
| `s-soulmate` | Soulmate | Cliente ideal / avatar |
| `s-promesa` | Promesa | Transformación prometida |
| `s-valor` | Valor | Entregables y valor percibido |
| `s-bonos` | Bonos | Stack de bonos |
| `s-precio` | Precio | Estructura de precios |
| `s-blindaje` | Blindaje | Objeciones y garantías |
| `s-carta` | Tu oferta | Carta de venta final (exportable) |
| `s-validar` | Validación | Checklist de calidad |
| `s-cuenta` | Mi cuenta | (v2: persistencia en nube) |
| `s-evaluar` | Evaluador | IA que puntúa la oferta |

### Flujo de navegación
```
Onboarding (5 pasos) → Inicio → 8 niveles secuenciales → Carta → Validación
                                    ↓
                              Evaluador (IA)
                                    ↓
                              Cuenta (v2)
```

### Estado persistido (localStorage)
```javascript
// Clave: 'happpy_offer_v1'
{
  version: 1,
  power: 21,                    // 0-100
  screens: {                    // datos por pantalla
    base: {...},
    soulmate: {...},
    promesa: {...},
    valor: {...},
    bonos: {...},
    precio: {...},
    blindaje: {...}
  },
  timestamps: {...},
  exportHistory: [...]
}
```

### Métrica "Poder" (power)
- Se calcula en tiempo real según completitud de campos obligatorios + calidad heurística
- Barra visual en header (`#powerBar`, `#powerVal`)
- Umbrales: <30% = borrador, 30-60% = en progreso, 60-85% = sólida, >85% = lista para lanzar

---

## CSS: Design System (Variables root)

```css
:root {
  --genio: #0B58B6;      // Azul marca (CTAs primarios)
  --haiti: #13228B;      // Azul oscuro (fondos header, texto principal)
  --limon: #CCFE2F;      // Amarillo limón (acento, power bar, badges)
  --acero: #B9C6F2;      // Azul claro (textos secundarios, labels)
  --sol: #FFF4AF;        // Amarillo suave (notas v1)
  --bg: #F4F7FF;         // Fondo general (claro)
  --surface: #FFFFFF;    // Tarjetas, modales
  --fg: #13228B;         // Texto principal
  --muted: #3E4A7A;      // Texto secundario
  --link: #0B58B6;       // Enlaces
  --line: #E2E7F4;       // Bordes, divisores
  --soft: rgba(11,88,182,.07);  // Hover/focus suave
  --track: #E7ECF8;      // Tracks de sliders, dots inactivos
  --shadow: 0 1px 2px rgba(19,34,139,.04), 0 6px 18px rgba(19,34,139,.06);
  --fd: "Bricolage Grotesque", "Avenir Next", Arial, sans-serif;  // Display
  --fb: "Instrument Sans", "Helvetica Neue", Arial, sans-serif;   // Body
  --fm: "JetBrains Mono", "SFMono-Regular", Menlo, monospace;     // Mono
  --ease: cubic-bezier(.16,1,.3,1);
}

/* Dark mode automático */
@media (prefers-color-scheme:dark) {
  :root:not([data-theme="light"]) {
    --bg: #070D3A;
    --surface: #0F1A63;
    --fg: #F4F7FF;
    --muted: #B9C6F2;
    --link: #8FC8FF;
    --genio: #8FC8FF;
    --line: #24328C;
    --soft: rgba(0,134,225,.14);
    --track: rgba(244,247,255,.10);
    --shadow: 0 8px 28px rgba(11,22,96,.4);
    color-scheme: dark;
  }
}
```

**Tipografías:** 3 fuentes embebidas como base64 WOFF2 (Bricolage Grotesque variable, Instrument Sans variable, JetBrains Mono)

**Componentes clave:**
- `.btn` / `.btn.go` — Botones primarios (limón) y secundarios
- `.pick` — Tarjetas seleccionables (radio/checkbox visuales)
- `.doc` — Áreas de texto con `overflow-wrap:anywhere`
- `.take` — Contenedor final de "carta de venta"
- `.peek` — `<details>` para previsualizar exportación
- `.toast` — Notificaciones logros (bottom center)

---

## JavaScript: Lógica de la app (embebido al final)

### Estado reactivo simple (sin framework)
```javascript
const state = {
  currentScreen: 's-onb',
  power: 0,
  data: {},
  // ...
};

function showScreen(id) { ... }
function updatePower() { ... }
function saveToLocalStorage() { ... }
function loadFromLocalStorage() { ... }
function exportOffer() { ... }
```

### Funciones principales identificadas
| Función | Propósito |
|---------|-----------|
| `init()` | Inicializa app, carga localStorage, muestra pantalla actual |
| `showScreen(id)` | Navegación entre pantallas (oculta/muestra + animación) |
| `updatePower()` | Recalcula power basado en completitud campos |
| `save()` | Persiste en localStorage |
| `load()` | Restaura de localStorage |
| `exportOffer()` | Genera carta de venta en `#exportPeek` |
| `evaluate()` | Llama a evaluador IA (simulado en v1) |
| `unlockAchievement(id)` | Muestra toast de logro |
| `onbNext()` / `onbPrev()` | Navegación onboarding |

### Onboarding (5 pasos)
1. Bienvenida → "Hola, soy Happpy..."
2. Base → "¿Qué vendes?"
3. Soulmate → "¿A quién ayudas?"
4. Promesa → "¿Qué transformación?"
5. Valor → "¿Qué entregan?"

Cada paso = `.onb-step` con animación `rise` (420ms cubic-bezier)

---

## Mapeo a HSCSG v15 OS (Principio Anfibio)

| Concepto Happpy | → Módulo HSCSG | Vaso comunicante |
|-----------------|----------------|------------------|
| 8 niveles oferta | `agencia.offerDesign` | `reversePlan` (meta → niveles) |
| Poder de oferta (0-100%) | `agencia.offerPower` | `setPlanMeta` + `brandFit` score |
| Base / Soulmate / Promesa / Valor | `agencia.brandDNA` | `setBrandDNA` por nivel |
| Bonos / Precio / Blindaje | `agencia.offerStack` | `addICP` + `setOfferPrice` |
| Carta de venta final | `content.captureIdea` + `scoreIdea` | `decideIdea` (gate humano Ley III) |
| Evaluador IA | `agentCanvas.addCanvasAgent` | `spawnAgent` role=evaluator |
| Guardado local (v1) → Cuenta (v2) | `nodeMode` postmonetario → conectado | `setNodeMode` + `priceParity` |
| Onboarding guiado | `aprender.addLearningChallenge` | `completeChallenge` por nivel |

---

## Decisiones de diseño EBD

| ID | Decisión | Justificación |
|----|----------|---------------|
| **EBD-HAP-01** | 8 niveles fijos (Base → Blindaje) | Estructura probada para ofertas high-ticket; evita parálisis por opciones |
| **EBD-HAP-02** | Poder = métrica única 0-100% | Simplifica decisión "¿está lista?"; gamifica completitud |
| **EBD-HAP-03** | Offline-first v1 (localStorage only) | Cero fricción onboarding; privacidad total; migración suave a v2 |
| **EBD-HAP-04** | Single-file HTML (CSS+JS embebido) | Distribución viral por WhatsApp/email; cero dependencias |
| **EBD-HAP-05** | Dark mode automático (prefers-color-scheme) | Accesibilidad nativa; sin toggle manual |
| **EBD-HAP-06** | 3 fuentes variable WOFF2 embebidas | Identidad visual consistente; cero requests externos |
| **EBD-HAP-07** | Onboarding 5 pasos con dots | Reduce abandono; muestra progreso tangible |
| **EBD-HAP-08** | Evaluador IA como pantalla separada | Separación "crear" vs "juzgar"; evita sesgo durante diseño |
| **EBD-HAP-09** | Exportación = texto plano copiable | Portabilidad total; funciona en cualquier IA/editor |
| **EBD-HAP-10** | v2 = cuentas en nube (mañana) | Migración suave: mismos datos, nuevo backend |

---

## Validaciones DV requeridas

| ID | Validación | Criterio éxito |
|----|------------|----------------|
| **DV-HAP-01** | `calculatePower(data)` → 0-100 | Campos obligatorios completados = +10 c/u; heurísticas calidad = +5 c/u |
| **DV-HAP-02** | `saveToLocalStorage()` → persiste | Recarga página → estado idéntico (power, datos, pantalla) |
| **DV-HAP-03** | `exportOffer()` → texto carta | Incluye: headline, promesa, prueba, bonos, precio, garantía, CTA |
| **DV-HAP-04** | `evaluateOffer(carta)` → score + feedback | 4 dimensiones: claridad, deseo, prueba, urgencia (0-100 c/u) |
| **DV-HAP-05** | `onbFlow(5 steps)` → completion | Cada paso requiere ≥1 campo obligatorio antes de avanzar |
| **DV-HAP-06** | `darkMode()` → variables invertidas | Sin flash; respeta `prefers-color-scheme` |
| **DV-HAP-07** | `responsive(<400px)` → layout funcional | Header colapsa marca; botones full-width; power bar visible |
| **DV-HAP-08** | `migrateV1toV2(data)` → cuenta cloud | Mismos campos; `userId` añadido; `version: 2` |

---

## Estructura de archivos FASE 3 propuesta

```
src/core/lib/happpy-offer.ts           # Lógica pura: calculatePower, validateLevel, generateCarta, evaluateOffer
src/core/lib/happpy-levels.ts          # Definición 8 niveles: campos, validaciones, heurísticas
src/core/lib/happpy-evaluator.ts       # Evaluador IA (prompt template + parser respuesta)
src/core/state/happpy.ts               # Tipos: OfferLevel, OfferData, PowerMetrics, EvaluationResult
src/core/state/hooks/happpy.ts         # Selectores: useOfferData, usePower, useCurrentLevel, useEvaluation
src/core/state/store.ts                # Slice: happpy + actions (nextLevel, prevLevel, save, evaluate)
src/app/screens/HapppyOffer.tsx        # Pantalla principal: stepper lateral + nivel activo + power bar
src/app/screens/HapppyCarta.tsx        # Carta de venta final (editable, exportable)
src/app/screens/HapppyEvaluator.tsx    # Evaluador IA: input carta → output score + feedback
src/app/layout/Aside.tsx               # Nav "Diseñador Ofertas" → "/oferta"
src/core/lib/i18n.ts                   # ES/EN/PT labels
skills/happpy-offer/                   # 4 skills: offer-designer, offer-evaluator, offer-migration, offer-export
openspec/specs/happpy-offer/           # OpenAPI: /offer, /power, /evaluate, /export, /migrate
```

---

## Conexión con Harvey + Agencia + RBE

- **Harvey (sales agent)** → `happpy-offer` = versión visual/interactiva de Harvey.discover/profile/write/send
- **Agencia (DeseOS/Contento.pro)** → `agencia.brandDNA` + `agencia.offerStack` = base teórica de los 8 niveles
- **RBE (dividendo universal)** → `happpy-offer.precio` compatible con `caas.runCaasPayout` + `zeitnus.dividendPolicy`
- **Kit Salto/Espejo** → `happpy-offer.soulmate` ≈ diagnóstico prospección; `happpy-offer.blindaje` ≈ Cierre Espejo

---

## Próximos pasos (FASE 3)

1. **FASE 3 core** — `happpy-offer.ts` (calculatePower + 8 niveles + generateCarta)
2. **FASE 3 evaluator** — `happpy-evaluator.ts` (prompt template + structured output parsing)
3. **FASE 3 state** — types + hooks + store slice + persist
4. **FASE 3 screens** — `HapppyOffer.tsx` (stepper + level editor), `HapppyCarta.tsx`, `HapppyEvaluator.tsx`
5. **FASE 3 skills** — 4 skills auto-ejecutables
6. **Integración Agencia** — reutilizar `agencia.brandDNA` + `agencia.reversePlan`
7. **OpenSpec** — `openspec/specs/happpy-offer/`
8. **Migración v2** — `happpy-migration.ts` (localStorage → cuenta cloud via `nodeMode`)

---

## Notas de propiedad intelectual

- **Código original:** Propiedad de Happpy.World (equipo económico Zeitnus)
- **Asimilación:** Solo lógica, arquitectura y patrones — **NO** copiar CSS/JS textual
- **Uso:** Referencia para construir módulo propio en HSCSG v15 OS
- **Atribución:** "Inspirado en Offfer Designer de Happpy.World" en docs/skills
