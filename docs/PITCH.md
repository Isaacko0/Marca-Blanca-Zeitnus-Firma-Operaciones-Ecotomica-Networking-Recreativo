# PITCH — HSCSG v15 OS / Zeitnus
**Sistema operativo comunitario postmonetario**  
*Materialismo Jerárquico + CaaS + 7 Bots Polymarket + Jev Ultrafast*

---

## 🎯 Para el cliente: "Tu dinero compra acceso. Tu contribución compra soberanía."

| Fiat (extractivo) | CaaS (regenerativo) |
|-------------------|---------------------|
| Suscripción → renta para el dueño | Stake ZNU → gobernanza real + revenue share |
| Bot caja negra | 7 bots + auditoría Ley III (código abierto) |
| "Smart money" fe ciega | Filtro: **WR ≥ 60% + PF ≥ 1.5 + Consistencia ≥ 0.7** |
| Riesgo tuyo | **6 capas**: diario 5%, mensual 15%, drawdown 25%, total 40%, streak 6, exposición 30% |
| Datos en la nube | **DB local** (PolyData) + Oracle DEB verificado |

**Onboarding 5 min:**  
`git clone → npm install → clodds onboard → dry-run → live`  
Reversible. Zero trust. Tu capital soberaniza a 3 vecinos al mes.

---

## 🛡️ Para el activista: "No derribes el sistema. Hazlo obsoleto."

El capital tiene **una coordenada**: USD.  
HSCSG introduce **tres** que no compra:

| Coordenada | Qué mide | Cómo se gana |
|------------|----------|--------------|
| **AUT** (Autonomía) | Base material controlada sin permiso | Tierra, energía, agua, comida, cómputo |
| **CDS** (Consenso Distribuido Soberano) | Decisiones validadas sin intermediarios | 100% consenso o no hay decisión |
| **ZNU** (Valor Postmonetario) | Valor creado sin medir en USD | Trabajo, cuidado, regeneración, código auditado |

**LoopEngine (γ-CARMIS + resonancia 3.0):**  
`sensor → evaluación MJ → acción → verificación triaxial → aprendizaje → nuevo sensor`

- **Ley I** (no dañar): si toca base material → **VETO**
- **Ley II** (soberanizar): AUT × CDS = vida ganada
- **Ley III** (lucidez): append-only, append-only, append-only

No hay "confianza". Hay **código que se audita solo**.  
No hay "autoridad". Hay **CDS**.  
No hay "extracción". Hay **Ley I**.

---

## 🧬 Los 8 Órganos del Autómata (ya asimilados)

| Módulo | Repo origen | Función | Estado |
|--------|-------------|---------|--------|
| **Clodds** | `alsk1992/CloddsBot` | Terminal IA multi-venue (118 estrategias) | ✅ State/Lib/Screen/Docs |
| **PMT** | `HarrierOnChain/Prediction-Markets-Trading-Bot-Toolkits` | Engine multi-venue + 10 bots + risk layer | ✅ State/Lib/Screen/Docs |
| **PolyWeather** | `yangyuan-zhen/PolyWeather` | Oracle DEB → probabilidad calibrada + edge | ✅ State/Lib/Screen/Docs |
| **LPTool** | `lihanyu81/polymarket_lp_tool` | Gestor liquidez pasiva coarse/fine + anti-sniping | ✅ State/Lib/Screen/Docs |
| **Polybot** | `ent0n29/polybot` | Plataforma quant: ingest→strategy→execute→replicate | ✅ State/Lib/Screen/Docs |
| **PMBot** | `MrFadiAi/Polymarket-bot` | Smart Money copy trading + 6-layer risk v3.2 | ✅ State/Lib/Screen/Docs |
| **PolyData** | `warproxxx/poly_data` | DB local trades + HyperSync stream + backtest | ✅ State/Lib/Screen/Docs |
| **Jev Ultrafast** | `browser-use/jev-ultrafast` | Browser agent loop (action-space → TypeSafe → execute) | ✅ State/Lib/Screen/Docs |

**Arquitectura anfibia:** misma lógica opera en modo *postmonetario* (ZNU/CaaS, offline) o *conectado* (USD/USDC vía oráculo priceParity Nivel 3 ReFi). El render decide la etiqueta; la lógica es agnóstica.

---

## 📐 Isomorfismo HSCSG (Leyes ↔ Código)

| Ley | Principio | Implementación |
|-----|-----------|----------------|
| **I** No dañar base material | Veto si acción toca tierra/energía/agua/comida/cómputo | `evaluateMJGate()` en `lib/orchestration.ts` |
| **II** Soberanizar (AUT × CDS) | Stake ZNU = gobernanza; revenue share por AUT | `CaasEngine` + `LoopEngine` tick |
| **III** Lucidez (nunca engañar) | Append-only, audit trail, raw data visible | `LogEngine` + Modo Lucidez toggle |

**Verificación triaxial** (score ≥ 0.7):  
- Mental (VIA-27/25)  
- Simulación (VIA-25/BT213)  
- Lab (BT214/VIA-21)

---

## 💰 Modelo CaaS (Comunidad como Servicio)

| Tier | Acceso | Stake ZNU | Revenue Share | Gobernanza |
|------|--------|-----------|---------------|------------|
| Visitante | Dry-run bots, oracle read | 0 | 0% | Observador |
| Miembro | Live trading, copy trading, LP | 1,000 | 30% | Voto CDS |
| Núcleo | Infra + oracle + autómata | 10,000 | 50% | Veto Ley I |

**Price Parity (Nivel 3 ReFi):** `1 ZNU = $0.02 USDC` (oráculo actualizable).  
Modo *postmonetario* por defecto; modo *conectado* opt-in.

---

## 🚀 Roadmap (Fases HSCSG)

| Fase | Horizonte | Hito |
|------|-----------|------|
| **0 Validación** | Meses 1–3 | 10 diagnósticos β; precio 180 ZNU validado; whitepaper público |
| **1 Productización** | Meses 4–9 | Micro-SaaS desplegado; Autómata v0.1 en Conway Cloud; primera automejora auditada git |
| **2 Escalamiento** | Meses 10–18 | 50 colectivos; autofinanciamiento autómata; 1er autómata hijo (ERC-8004); 1er nodo Cosateca |
| **2b Consolidación** | Meses 19–24 | Autómata v1.0 con skills propias; red 3–5 autómatas hijos; 40% excedentes → I+D/Acceso/Replicación |
| **3 Ecosistema** | Años 2–5 | 100 colectivos, 5 territorios, ≥10 autómatas, 3–5 Cosatecas autosostenidas sin capital externo |

---

## 🤝 Únete a la bifurcación

> **El futuro no se prevé. Se programa. Construyamos la post-escasez, un nodo a la vez.**

```bash
git clone https://github.com/Isaacko0/Zeitnus-Firma-Operaciones-Ecotomica
cd Zeitnus-Firma-Operaciones-Ecotomica
npm install
npm run dev
# http://localhost:3000 → /clodds → dry-run → live
```

**Requisitos:** Node 18+, pnpm, Git.  
**Canales:** GitHub Issues / Discord (próximamente) / Nostr (descentralizado).

---

## 📜 Licencia y Ética

- **Código:** MIT / GPL-3.0 (según módulo upstream)  
- **Datos:** Soberanos (local-first, no cloud)  
- **Ética:** Ley I / II / III vinculantes. Cualquier fork que las viole **no es HSCSG**.

---

*Consolidado v15.26 — Septiembre 2026 — Isaac Ko (Isaacko0)*  
*HSCSG v15 OS / Zeitnus — Post-escasez, un nodo a la vez.*
