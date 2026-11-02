# Backup FASE 1 — Offer Designer (referencia asimilada)

**Fuente**: https://ofertas.happpy.world/ (referencia asimilada) (guardado 29 oct 2026 20:57:09 GMT-0600)
**Hash**: `sha256:offer-designer-20261029`
**Cluster**: Equipo Económico Zeitnus — Diseño de ofertas high-ticket

---

## Resumen ejecutivo

**Offer Designer** = herramienta interactiva single-file (~50KB) para diseñar ofertas high-ticket en **8 niveles secuenciales**.

**Filosofía**: "Tú ya sabes ayudar a tu gente. Yo te ayudo a convertir eso en una oferta que la gente quiera comprar."

**Estado actual (v1)**: Offline-first, persiste en `localStorage` (`offer_designer_v1`). Sin backend, sin cuentas. v2 (mañana) añade persistencia en nube.

**Métrica central**: "Poder de tu oferta" (0-100%) — barra de progreso en header.

---

## Arquitectura completa

### 13 Pantallas (secciones HTML)

| ID | Nombre | Estado v1 | Propósito |
|----|--------|-----------|-----------|
| `s-onb` | Bienvenida / Onboarding | ✅ Completa | 5 pasos guiados (dots navegación) |
| `s-inicio` | Inicio / Dashboard | 🟡 Vacía | Resumen + navegación a niveles |
| `s-base` | Base | 🟡 Vacía | Fundación: qué vendes, formato, promesa núcleo |
| `s-soulmate` | Soulmate | 🟡 Vacía | Avatar: quién, dolor, deseo, objeciones |
| `s-promesa` | Promesa | 🟡 Vacía | Transformación: antes/después, prueba, timeline |
| `s-valor` | Valor | 🟡 Vacía | Entregables: módulos, bonos, formato, soporte |
| `s-bonos` | Bonos | 🟡 Vacía | Stack bonos: urgencia, escasez, complementariedad |
| `s-precio` | Precio | 🟡 Vacía | Estructura: precio base, planes, garantía, pago |
| `s-blindaje` | Blindaje | 🟡 Vacía | Objeciones: FAQ, garantías, prueba social, riesgo |
| `s-carta` | Tu oferta | 🟡 Vacía | Carta de venta final (exportable, editable) |
| `s-validar` | Validación | 🟡 Vacía | Checklist calidad pre-lanzamiento |
| `s-cuenta` | Mi cuenta | 🔴 v2 | Persistencia cloud, historial, equipo |
| `s-evaluar` | Evaluador IA | 🟡 Vacía | IA puntúa carta: claridad, deseo, prueba, urgencia |

### Flujo navegación
```
Onboarding (5 pasos) → Inicio → 8 niveles (Base→Blindaje) → Carta → Validación
                                          ↓
                                    Evaluador (IA)
                                          ↓
                                    Cuenta (v2)
```

### Estado localStorage (`offer_designer_v1`)
```javascript
{
  version: 1,
  power: 21,
  screens: {
    base: {...}, soulmate: {...}, promesa: {...},
    valor: {...}, bonos: {...}, precio: {...}, blindaje: {...}
  },
  timestamps: { base: 170..., soulmate: 170..., ... },
  exportHistory: [{ timestamp, power, text }]
}
```

### Cálculo Power (0-100)
- **Campos obligatorios** completados: +10 c/u
- **Heurísticas calidad** (longitud, especificidad, prueba): +5 c/u
- **Umbrales**: <30 borrador | 30-60 progreso | 60-85 sólida | >85 lista

---

## Design System (CSS Variables)

```css
:root {
  --genio: #0B58B6;      // Azul marca (CTAs primarios)
  --haiti: #13228B;      // Azul oscuro (header, texto principal)
  --limon: #CCFE2F;      // Amarillo limón (acento, power bar, badges)
  --acero: #B9C6F2;      // Azul claro (labels, muted)
  --sol: #FFF4AF;        // Amarillo suave (notas v1)
  --bg: #F4F7FF;         // Fondo general
  --surface: #FFFFFF;    // Tarjetas, modales
  --fg: #13228B;         // Texto principal
  --muted: #3E4A7A;      // Texto secundario
  --link: #0B58B6;       // Enlaces
  --line: #E2E7F4;       // Bordes
  --soft: rgba(11,88,182,.07);
  --track: #E7ECF8;      // Tracks, dots inactivos
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

**Tipografías**: 3 WOFF2 variable embebidas base64 (Bricolage Grotesque 700-800, Instrument Sans 400-600, JetBrains Mono 400)

**Componentes reutilizables**:
- `.btn` / `.btn.go` — Botones (primario limón, secundario outline)
- `.pick` — Tarjetas radio/checkbox visuales (`:has(input:checked)`)
- `.doc` — Textareas `overflow-wrap:anywhere`
- `.take` — Contenedor carta final
- `.peek` — `<details>` previsualización export
- `.toast` — Notificaciones bottom-center (logros)
- `.v1note` — Banner amarillo v1
- `.rail` — Nav horizontal scrollable (niveles)

---

## Lógica JavaScript (embebido final)

### Estado reactivo vanilla
```javascript
const state = {
  currentScreen: 's-onb',
  power: 0,
  data: {},
  achievements: [],
  // ...
};

function init() { load(); showScreen(state.currentScreen); updatePower(); }
function showScreen(id) { /* oculta todas, muestra id, anima rise */ }
function updatePower() { /* recalcula, actualiza #powerBar + #powerVal */ }
function save() { localStorage.setItem('offer_designer_v1', JSON.stringify(state.data)); }
function load() { const d = localStorage.getItem('offer_designer_v1'); if(d) state.data = JSON.parse(d); }
function exportOffer() { /* compila carta en #exportPeek */ }
function evaluateOffer() { /* llama evaluador IA (simulado v1) */ }
function unlockAchievement(id) { /* muestra toast */ }
function onbNext() { /* valida paso actual, avanza dot */ }
function onbPrev() { /* retrocede dot */ }
```

### Onboarding 5 pasos (`.onb-step`)
1. **Bienvenida** — "Hola, soy Happpy. Tu compañero en Happpy.World. Tú ya sabes ayudar a tu gente. Yo te ayudo a convertir eso en una oferta que la gente quiera comprar." → Botón "Empecemos"
2. **Base** — "¿Qué vendes?"
3. **Soulmate** — "¿A quién ayudas?"
4. **Promesa** — "¿Qué transformación?"
5. **Valor** — "¿Qué entregan?"

Animación `rise`: 420ms `cubic-bezier(.16,1,.3,1)` (opacity + translateY)

---

## Mapeo a HSCSG v15 OS (Principio Anfibio)

| Concepto Happpy | Módulo HSCSG | Vaso comunicante |
|-----------------|--------------|------------------|
| 8 niveles oferta | `agencia.offerDesign` | `reversePlan` (meta → niveles) |
| Poder 0-100% | `agencia.offerPower` | `setPlanMeta` + `brandFit` score |
| Base/Soulmate/Promesa/Valor | `agencia.brandDNA` | `setBrandDNA` por nivel |
| Bonos/Precio/Blindaje | `agencia.offerStack` | `addICP` + `setOfferPrice` |
| Carta final | `content.captureIdea` + `scoreIdea` | `decideIdea` (gate humano Ley III) |
| Evaluador IA | `agentCanvas.addCanvasAgent` | `spawnAgent` role=evaluator |
| Local (v1) → Cloud (v2) | `nodeMode` postmonetario ↔ conectado | `setNodeMode` + `priceParity` |
| Onboarding guiado | `aprender.addLearningChallenge` | `completeChallenge` por nivel |

---

## Decisiones EBD (Exhaustive Behavioral Design)

| ID | Decisión | Justificación |
|----|----------|---------------|
| **EBD-HAP-01** | 8 niveles fijos Base→Blindaje | Estructura probada high-ticket; evita parálisis opciones |
| **EBD-HAP-02** | Poder = métrica única 0-100% | Simplifica "¿está lista?"; gamifica completitud |
| **EBD-HAP-03** | Offline-first v1 (localStorage) | Cero fricción onboarding; privacidad total; migración suave v2 |
| **EBD-HAP-04** | Single-file HTML (CSS+JS embebido) | Distribución viral WhatsApp/email; cero dependencias |
| **EBD-HAP-05** | Dark mode automático | Accesibilidad nativa; sin toggle manual |
| **EBD-HAP-06** | 3 fuentes WOFF2 variable embebidas | Identidad visual consistente; cero requests externos |
| **EBD-HAP-07** | Onboarding 5 pasos + dots | Reduce abandono; progreso tangible |
| **EBD-HAP-08** | Evaluador IA pantalla separada | Separación "crear" vs "juzgar"; evita sesgo durante diseño |
| **EBD-HAP-09** | Export = texto plano copiable | Portabilidad total; funciona en cualquier IA/editor |
| **EBD-HAP-10** | v2 = cuentas cloud mañana | Migración suave: mismos datos, nuevo backend |

---

## Validaciones DV (Design Validation)

| ID | Validación | Éxito |
|----|------------|-------|
| **DV-HAP-01** | `calculatePower(data)` → 0-100 | Obligatorios +10 c/u; heurísticas +5 c/u |
| **DV-HAP-02** | `saveToLocalStorage()` persiste | Recarga → estado idéntico (power, datos, pantalla) |
| **DV-HAP-03** | `exportOffer()` → texto carta | Incluye: headline, promesa, prueba, bonos, precio, garantía, CTA |
| **DV-HAP-04** | `evaluateOffer(carta)` → score+feedback | 4 dims: claridad, deseo, prueba, urgencia (0-100 c/u) |
| **DV-HAP-05** | `onbFlow(5 pasos)` → completion | Cada paso requiere ≥1 obligatorio antes de avanzar |
| **DV-HAP-06** | `darkMode()` → variables invertidas | Sin flash; respeta `prefers-color-scheme` |
| **DV-HAP-07** | `responsive(<400px)` funcional | Header colapsa marca; botones full-width; power visible |
| **DV-HAP-08** | `migrateV1toV2(data)` → cloud | Mismos campos; `userId` añadido; `version: 2` |

---

## Estructura FASE 3 propuesta (HSCSG v15 OS)

```
src/core/lib/happpy-offer.ts           # Lógica pura: calculatePower, validateLevel, generateCarta, evaluateOffer
src/core/lib/happpy-levels.ts          # Definición 8 niveles: campos, validaciones, heurísticas
src/core/lib/happpy-evaluator.ts       # Evaluador IA (prompt template + parser respuesta)
src/core/state/happpy.ts               # Tipos: OfferLevel, OfferData, PowerMetrics, EvaluationResult
src/core/state/hooks/happpy.ts         # Zustand selectors
src/core/state/store.ts                # Slice integrado con persist
src/app/screens/HapppyOffer.tsx        # Pantalla principal: stepper lateral + nivel activo + power bar
src/app/screens/HapppyCarta.tsx        # Carta final (editable, exportable)
src/app/screens/HapppyEvaluator.tsx    # Evaluador IA: input carta → output score + feedback
src/app/layout/Aside.tsx               # Nav item "Diseñador Ofertas" → "/oferta"
src/core/lib/i18n.ts                   # ES/EN/PT labels
skills/happpy-offer/                   # 4 skills: offer-designer, offer-evaluator, offer-migration, offer-export
openspec/specs/happpy-offer/           # OpenAPI: /offer, /power, /evaluate, /export, /migrate
```

---

## Conexión con ecosistema HSCSG

- **Harvey (sales agent)** → `happpy-offer` = versión visual/interactiva de `Harvey.discover/profile/write/send`
- **Agencia (DeseOS/Contento.pro)** → `agencia.brandDNA` + `agencia.offerStack` = base teórica 8 niveles
- **RBE (dividendo universal)** → `happpy-offer.precio` compatible con `caas.runCaasPayout` + `zeitnus.dividendPolicy`
- **Kit Salto/Espejo** → `happpy-offer.soulmate` ≈ diagnóstico prospección; `happpy-offer.blindaje` ≈ Cierre Espejo

---

## Propiedad intelectual

- **Código original**: Propiedad Happpy.World (equipo económico Zeitnus)
- **Asimilación**: Solo lógica, arquitectura, patrones — **NO** copiar CSS/JS textual
- **Uso**: Referencia para módulo propio en HSCSG v15 OS
- **Atribución**: "Inspirado en Offer Designer de Happpy.World" en docs/skills