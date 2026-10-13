---
name: hscsg-zeitnus-meme-diffusion
description: Genera contenido humorístico afiliativo para difusión de conceptos/objetivos de Zeitnus/ALRAC en TikTok y Facebook. Estilo inspirado en @helenasarda: absurdo técnico, reframing anti-hipocresía, ironía camusiana. El usuario elige conceptos por tanda; la skill produce guiones, copys, storyboards.
version: 0.1.0
author: Isaac Ko (Isaacko0), Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [hscsg, zeitnus, diffusion, memes, tiktok, facebook, humor-afiliativo, divulgacion]
    related_skills:
      - hscsg-zeitnus-anthropology-analyzer
      - hscsg-orquestador-skills
      - hscsg-unified-assimilation-science
      - hscsg-sistema-alraico
---

# HSCSG v15 OS — Difusión Memeética Zeitnus/ALRAC (Humor Afiliativo)

Skill para **convertir conceptos técnicos del repo en contenido viral afiliativo** (TikTok Reels, Facebook Reels/Posts). No es "memes random": cada pieza nace de la epistemología del repo (humor absurdistia, reframing, anti-hipocresía) y **construye comunidad** (no divide).

> **Principio:** *El humor afiliativo une a los que ya entienden y abre la puerta a los que no. No se ríe DE la gente, se ríe CON la contradicción del sistema.*

---

## When to Use

- Usuario dice: *"difunde esto: [concepto/objetivo]"* → la skill genera pack TikTok + FB
- Usuario dice: *"campaña: [tema]"* → serie de 3-5 piezas coherentes
- Usuario dice: *"réplica de [tweet/post externo] con humor ALRAC"* → respuesta afilada
- **Ciclo semanal**: "¿qué difundimos esta semana?" → skill propone basándose en γ-CARMIS, nodos piloto, specs nuevas
- **Reacción rápida**: noticia externa (falafel, Ed Sheeran, ley de vivienda) → respuesta en <30 min

**No usar para:** contenido corporativo serio, white papers, docs técnicas, fundraising directo.

---

## Prerequisites

- Repo `Zeitnus-Firma-Operaciones-Ecotomica` en `main`
- `skills/hscsg-zeitnus-anthropology-analyzer/SKILL.md` cargada (fuente de estilo)
- `docs/CAOS_MODELONEGOCIO_ANALISIS.md` (γ-CARMIS vivo = tensión narrativa)
- `openspec/specs/SPEC_INDEXER.md` (conceptos vigentes)
- Cuentas TikTok/FB accesibles (o usuario publica manualmente)
- Opcional: `ffmpeg`, `imagemagick` para render local

---

## How to Run

```bash
# Pack rápido: 1 concepto → 3 formatos (TikTok 15s, TikTok 60s, FB Post)
node scripts/zeitnus-meme-diffusion.js pack "TQ=1kWh no es especulativo, es termodinámica"

# Campaña: 1 tema → 5 piezas seriadas
node scripts/zeitnus-meme-diffusion.js campaign "Principio Anfibio" --episodes 5

# Réplica rápida a noticia
node scripts/zeitnus-meme-diffusion.js reply "Ed Sheeran se niega a posicionar sobre genocidio" --tone "helenasarda"

# Propuesta semanal (lee γ-CARMIS + specs + nodos)
node scripts/zeitnus-meme-diffusion.js weekly

# Solo copywriting (sin producción)
node scripts/zeitnus-meme-diffusion.js copy "ZNU indexado a canasta básica" --platforms tiktok,facebook
```

---

## Quick Reference

| Comando | Input | Output |
|---------|-------|--------|
| `pack "concepto"` | 1 concepto/objetivo | `diffusion/pack_<slug>/` → 3 guiones + copys + storyboard |
| `campaign "tema" --episodes N` | Tema central + N | `diffusion/campaign_<slug>/` → N guiones conectados + calendar |
| `reply "noticia" --tone X` | Texto externo + tono | `diffusion/reply_<slug>/` → copy + imagen sugerida |
| `weekly` | (auto: γ-CARMIS, specs, nodos) | `diffusion/weekly_YYYYMMDD/` → 3 packs listos |
| `copy "concepto" --platforms` | Concepto + plataformas | JSON con copys, hashtags, CTA por plataforma |

---

## Procedure (Pack Estándar)

### 1. RECIBIR CONCEPTO + CONTEXTO (Usuario elige)

```bash
# Input del usuario (ejemplos reales):
# "Línea A: Diagnóstico Encaje — primer cliente real esta semana"
# "γ-CARMIS activado: αʰ=0.12 → la roca espera tu Palabra"
# "Principio Anfibio: misma lógica, distinta infra (offline ZNU ↔ online USDC)"
# "Nodo Colonia (Uruguay): 515ha urbanas, Ala Este SAS, piloto real"
# "TQ ±500: límite duro, no especulativo, 1 TQ = 1 kWh medido"
# "7 Holones Gran Alianza: GAIA, MYCELIUM, SYNCHROLABS, PROJECT WEAVE, HSCSG, PHI, DATA TRUST, BIOHABITATS"
```

**La skill extrae:** tensión narrativa, absurdo técnico, reframing posible, CTA afiliativo.

---

### 2. APLICAR PLANTILLAS DE HUMOR AFILIATIVO (Estilo ALRAC)

| Plantilla | Estructura | Ejemplo aplicado a "TQ=1kWh" |
|-----------|------------|------------------------------|
| **Absurdo Termodinámico** | "Si X es Y, entonces [consecuencia ridícula]" | "Si 1 TQ = 1 kWh es 'especulativo', tu nevera especula cada vez que enfría tu cerveza" |
| **Reframing de Pureza** | "Critican X por usar Y del sistema" → "El sistema te usa a ti" | "‘No puedes criticar capitalismo si usas iPhone’ → ‘No puedes criticar extractivismo si respiras CO2’" |
| **Anti-Hipocresía Escata** | "Huele a [hipocresía] 💩" + evidencia técnica | "`verifyTQProhibition()` pasa tests 💚 pero 0 kWh medidos en territorio 💩" |
| **Camusiano Operativo** | "El absurdo no es el fin, es el disparador" | "`αʰ=0.12 < κ` → γ-CARMIS dispara. El caos no paraliza, RECONFIGURA" |
| **Kinship Nodal** | "Nodo X hace Y. Nodo Z hace W. Juntos = [poder]" | "Colonia mide kWh. Feria presta sin interés. Samay regenera suelo. Juntos = ALRAC vivo" |
| **Spec vs Realidad** | "Tenemos 19 specs. Tenemos 0 [X real]. γ-CARMIS nos mira." | "25 specs OpenSpec. 0 facturación real. La roca (γ-CARMIS) espera tu Paso II" |

---

### 3. GENERAR 3 FORMATOS POR PACK

#### A. TikTok 15s (Gancho + Punchline + CTA)
```
[0-1s] GANCHO VISUAL: Tú sosteniendo una bombilla / medidor kWh / especificación impresa
[1-3s] PREMISA ABSURDA: "Dicen que 1 TQ = 1 kWh es 'cripto especulativa'"
[3-8s] REFRAMING: Enciendes bombilla → "Mi bombilla no especula. Ilumina. Punto."
[8-12s] EVIDENCIA: Corte a ESP32 midiendo → "Esto mide julios. No promesas."
[12-14s] CTA AFILIATIVO: "¿Tu energía qué mide? Comenta ⚡ #ALRAC #TQesEnergía #SoberaníaEnergética"
[14-15s] LOGO: Zeitnus + "E=V"
```

#### B. TikTok 60s (Storytelling + Contexto + Comunidad)
```
[0-3s] GANCHO: "Escribí 19 specs para que mi nevera no especule"
[3-10s] EL PROBLEMA: "El sistema te vende 'verde' pero mide en dólares. Tu kWh real no existe en su contabilidad."
[10-25s] LA SOLUCIÓN (reframing): "TQ = 1 kWh físico. ±500 límite. No se compra, se GENERA. exchangeGuard() lo prohíbe."
[25-40s] LA PRUEBA: Nodo Colonia (515ha), Feria Conuquera (10 años), Samay (20 años). Miden. Prueban. Viven.
[40-50s] LA INVITACIÓN: "No hace falta creer. Hace falta MEDIR. Únete a un nodo. O monta el tuyo."
[50-55s] CTA: "Link en bio → nodo más cercano. O pregunta cómo. #ALRAC #EnergíaSoberana #ComunidadReal"
[55-60s] OUTRO: Logo + "La pala y el teclado"
```

#### C. Facebook Post (Texto + Imagen + Conversación)
```
**Texto:**
Escribimos 25 especificaciones OpenSpec. Código TypeScript que compila (0 errores en core). Motor Alráico que detecta sobrecargas y se reconfigura solo (γ-CARMIS). 6 nodos piloto midiendo kWh reales en territorio (Uruguay, Venezuela, Ecuador, España, arquitectos globales, memes descentralizados).

Y sin embargo: la contabilidad oficial sigue sin reconocer que 1 kWh = 1 kWh.

`verifyTQProhibition()` devuelve `true` en tests. Pero 0 julios medidos en la red oficial.

El absurdo no es el fin. Es el disparador. γ-CARMIS lo llama "reconfiguración". Nosotros lo llamamos "lunes".

¿Qué mide tu contabilidad? ¿Promesas o julios?

👇 Comenta: ¿has medido tu consumo real esta semana? Te leo.

#ALRAC #Zeitnus #Soenergía #ComunidadTécnica #E=V

**Imagen sugerida:** Split screen — izq: código `verifyTQProhibition()` verde ✅ / der: medidor ESP32 en casa real con kWh acumulados 📊 / centro: logo Zeitnus "E=V"

**CTA comentario:** Pregunta abierta, no venta. Afiliativo.
```

---

### 4. ENTREGABLES POR PACK

```
diffusion/pack_<slug>/
├── tiktok_15s/
│   ├── script.md           # Guión técnico + timestamps
│   ├── copy.md             # Caption + hashtags + CTA
│   ├── storyboard.md       # 6-8 viñetas descripción visual
│   └── assets/             # (opcional) prompts para IA video/imagen
├── tiktok_60s/
│   ├── script.md
│   ├── copy.md
│   ├── storyboard.md
│   └── assets/
├── facebook_post/
│   ├── copy.md
│   ├── image_prompt.md     # Prompt detallado para generar imagen
│   └── first_comment.md    # Comentario semilla para impulsar conversación
└── metadata.json           # {concepto, fecha, plantillas_usadas, tonos, vasos_comunicantes}
```

---

### 5. VASOS COMUNICANTES OBLIGATORIOS

Cada pack **debe citar** su origen trazable:

```markdown
# En metadata.json y en copys (sutil):
- Concepto: [epist:humor] → plantilla "Absurdo Termodinámico"
- Tensión: [doc:CAOS§γ-CARMIS] → αʰ=0.12, deadline 24h
- Nodo real: [repo:colonia] / [repo:feria-conuquera] / [repo:samay]
- Spec: [spec:alrac-tq-exchangeGuard] / [spec:alrac-tq-conversionFactor]
- Motor: [alraico:loopEngine] → detectOverloads → simulateReconfig
- Gobernanza: [aut:CDS] / [mon:ZNU] / [canvas:20limites]
```

---

## Pitfalls

1. **No hacer "chistes de informático"** — El humor nace de la *contradicción sistémica*, no de "los programadores somos raros".
2. **No reírse DE nadie** — Afiliativo = "nosotros contra el absurdo del sistema", no "nosotros contra ellos".
3. **No simplificar hasta mentir** — "TQ=1kWh" es cierto técnicamente. Si dices "TQ=dinero gratis" → skill falla.
4. **No usar plantillas sin adaptar** — Cada concepto tiene su absurdo propio. Forzar plantilla = contenido genérico.
5. **Olvidar el CTA afiliativo** — Siempre: "¿tú qué mides?", "¿qué harías?", "cuéntame tu nodo". Nunca "compra/invierte/suscríbete".
6. **Desactualizar referencias** — Si γ-CARMIS se resolvió (Paso II real), el chiste "la roca espera" caduca. La skill debe leer `CAOS_MODELONEGOCIO_ANALISIS.md` *antes* de generar.

---

## Verification

```bash
# 1. Verificar pack generado
ls -la diffusion/pack_*/
cat diffusion/pack_*/tiktok_15s/script.md | head -30

# 2. Verificar vasos comunicantes en metadata
cat diffusion/pack_*/metadata.json | jq '.vasos_comunicantes'

# 3. Verificar que no hay claims falsos (cross-check con specs)
# Ej: si dice "TQ ilimitado" → FAIL (spec: alrac-tq-exchangeGuard prohíbe TQ↔fiat, ±500 límite)

# 4. Test de tono: leer en voz alta → ¿suena a @helenasarda explicando ALRAC? ¿Une o divide?
```

---

## Crianza Evolutiva

| Evento | Actualización |
|--------|---------------|
| Nueva plantilla de humor descubierta (ej. "Ironía de Spec") | Añadir a §2 tabla + test en `weekly` |
| Nuevo nodo piloto → nuevo kinship | Añadir a plantilla "Kinship Nodal" |
| γ-CARMIS resuelto → nueva tensión | Retirar "la roca espera", añadir "la roca respondió" |
| Métricas de engagement (TikTok/FB) | `weekly` prioriza plantillas con >X% share/comentarios reales |
| Usuario rechaza 2 packs seguidos | `weekly` pregunta: "¿qué tono quieres ahora?" + ajusta |

---

## Referencias Rápidas

| Archivo | Uso en Difusión |
|---------|-----------------|
| `skills/hscsg-zeitnus-anthropology-analyzer/SKILL.md` | Fuente de estilo: humor, antropología, conductual |
| `docs/CAOS_MODELONEGOCIO_ANALISIS.md` | Tensión viva: αʰ, overload, evasiones, Paso II |
| `openspec/specs/SPEC_INDEXER.md` | Conceptos vigentes + specs citables |
| `docs/GRANALLIANZA_MAPPING.md` | 7 holones = kinship narrativo |
| `docs/ALRAC_MASTER_INTEGRADO.md` | 5 líneas A-E = objetivos difundibles |

---

## Commits y Tags

```bash
# Commit pack generado
git commit -m "feat(diffusion): pack <slug> — <concepto>

- Plantillas: [Absurdo Termodinámico, Reframing Pureza]
- Vasos: [epist:humor], [doc:CAOS§γ-CARMIS], [repo:colonia], [spec:alrac-tq-exchangeGuard]
- Formatos: TikTok 15s/60s, FB Post
- CTA: afiliativo (pregunta, no venta)

Evidencia: diffusion/pack_<slug>/"

# Tag campaña
git tag diffusion/v1.0-<slug>
```

---

## Contacto

| Rol | Nombre | Contacto |
|-----|--------|----------|
| **PI / Skill Owner** | Isaac Ko (Isaacko0) | isaacko@protonmail.com / @Isaacko0 |
| **Comunidad / Nodos** | Representantes 7 holones | Según holón |
| **Urgencia Difusión** | PI | 24/7 (noticia reactiva <30 min) |

---

**Document Control:** Version 0.1.0 | 2026-10-12 | Author: Isaac Ko | Classification: PUBLIC — COMMUNITY STANDARD | Status: ACTIVE | **Principio:** *Difundir no es vender. Es invitar a medir julios juntos.* | **Vasos:** `[epist:humor]`, `[epist:antropo]`, `[epist:conduct]`, `[doc:CAOS§γ-CARMIS]`, `[repo:colonia]`, `[repo:feria-conuquera]`, `[repo:samay]`, `[repo:archidiagram]`, `[repo:febhouse]`, `[repo:memegen]`, `[spec:alrac-tq-exchangeGuard]`, `[spec:alrac-tq-conversionFactor]`, `[alraico:loopEngine]`, `[aut:CDS]`, `[mon:ZNU]`, `[canvas:20limites]`