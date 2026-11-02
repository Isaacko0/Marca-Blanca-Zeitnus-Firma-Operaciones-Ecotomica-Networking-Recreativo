# Proof of Humanity / Kleros — Backup de Fuente

**Fecha**: 2026-10-29  
**URLs fuente**:
- GitHub Org: https://github.com/orgs/Proof-Of-Humanity/repositories (25 repos)
- Web App: https://proofofhumanity.id/
- Governance: https://gov.proofofhumanity.id/
- Kleros FAQ: https://docs.kleros.io/welcome/faq
- PoH Docs: https://docs.kleros.io/products/proof-of-humanity

---

## 1. Proof of Humanity (PoH) — Qué es

**Proof of Humanity (PoH)** es un registro descentralizado, resistente a Sybil, de humanos verificados. Combina:
- **Verificación por vídeo**: el usuario envía un vídeo sosteniendo su dirección de wallet
- **Vouching comunitario**: un humano ya registrado debe "vouchar" (aval) la presentación
- **Resolución de disputas vía Kleros Court**: periodo de desafío donde cualquiera puede impugnar; Kleros resuelve
- **PoH Soulbound ID**: ID único, no transferible, persistente cross-chain (Ethereum + Gnosis Chain)
- **Renovación periódica**: el registro expira y debe renovarse

### Producto PoH 2.0 (mejoras de UX/costes, NO cambio de protocolo Kleros)
- Desplegado en **Gnosis Chain** → costes de registro drásticamente menores
- **Cross-chain profiles**: perfiles en múltiples cadenas
- **Soulbound IDs** no transferibles, recuperables si se pierde wallet
- UX simplificada, mejor guiado, tracking de estado claro
- **El protocolo de arbitraje sigue siendo Kleros V1** (no V2)

---

## 2. Kleros — Protocolo de Arbitraje Descentralizado

**Kleros** es un protocolo de resolución de disputas en Ethereum (ahora Arbitrum One).  
Mecánica:
- **Jurados**: staking de PNK (Pinakion) en courts; sorteo ponderado por stake
- **Juego teórico**: incentivo a votar como la mayoría (Schelling point)
- **Apelaciones**: rondas crecientes de jurados; coste exponencial para atacar
- **PNK**: token nativo (staking + redistribución incoherentes→coherentes)
- **Gobernanza**: PNK holders vía Snapshot (KIPs) + KlerosGovernor on-chain

### Courts relevantes para PoH
- **General Court** (Arbitrum One, Gnosis Chain)
- **Spanish General Court** (Ethereum + Gnosis) — hiddenVotes enabled
- **PoH usa Kleros V1** para resolución de disputas de registro

---

## 3. Repositorios Proof-Of-Humanity (25 repos en GitHub Org)

| Repo | Descripción | Stack | Último push | Licencia |
|------|-------------|-------|-------------|----------|
| `proof-of-humanity-v2-contracts` | Contratos v2 (Solidity) | TypeScript/Hardhat | May 2026 | MIT |
| `proof-of-humanity-v2-web` | Frontend v2 (Next.js/React) | TypeScript | Sep 2026 | - |
| `proof-of-humanity-v2-subgraph` | Subgraph v2 (The Graph) | TypeScript | Jun 2026 | - |
| `proof-of-humanity-v2-website` | Landing page v2 | TypeScript | May 2026 | - |
| `poh-v2-evidence-display` | Display de evidencias v2 | TypeScript | - | - |
| `POH-dashboard` | Dashboard admin | TypeScript | Oct 2026 | - |
| `poh-referral-admin` | Admin de referidos | TypeScript | Sep 2026 | - |
| `poh-duplicate-finder` | Detector duplicados | TypeScript | Oct 2026 | - |
| `reward-distributor` | Distribuidor recompensas | TypeScript | Jul 2026 | MIT |
| `snapshot-strategies` | Estrategias Snapshot voting | TypeScript | Apr 2022 | MIT |
| `Proof-Of-Humanity.github.io` | Web estática antigua | HTML | Jan 2022 | Unlicense |
| `marketing` | Brand guide, assets | - | Jul 2021 | MIT |
| `telegram-moderator-elections` | Elecciones moderadores | - | Jun 2021 | MIT |

> **Nota**: Los contratos v1 originales están en `kleros/proof-of-humanity` (repo separado en org kleros).

---

## 4. Arquitectura Técnica Clave (para asimilación)

### Interfaz Cross-Chain (para integraciones)
```typescript
interface ICrossChainProofOfHumanity {
  isHuman(address): boolean
  humanityOf(address): bytes20
  boundTo(bytes20): address
  isClaimed(bytes20): boolean
}
```
> **Regla**: NO leer `isHuman` del contrato principal PoH; usar Cross-Chain contract.

### Flujo de Registro (4 pasos)
1. **Submit Profile**: vídeo + foto + nombre + depósito reembolsable
2. **Get Vouched**: humano registrado avala
3. **Challenge Period**: cualquiera puede desafiar → Kleros Court
4. **Included**: si pasa sin desafío o gana disputa → PoH Soulbound ID

### Use Cases Documentados
- Self-Sovereign Identities (login dApps sin registro extra)
- Online Voting & Governance (1 persona = 1 voto, anti-Sybil)
- Fair Airdrops (eliminar bots/duplicados)
- Certifications (credenciales ligadas a humano verificado)
- Credit Scoring (evaluación crediticia equitativa)
- Social Media (eliminar spam/bots/trolls)
- **Human Verification for AI Era** (distinguir humanos de agentes IA)
- UBI (Universal Basic Income)
- Prediction Markets (mercados solo humanos)

---

## 5. Gobernanza PoH (gov.proofofhumanity.id)

Categorías activas:
- **Proof of Humanity** (191 topics): mejoras vouching, economía, etc.
- **DAO** (181 topics): UBI DAO, voting, proposals
- **Universal Basic Income** (65 topics): tokenomics, partnerships
- **Developers** (18 topics): scaling, UX, tech stack
- **Español** (12 topics): comunidad hispanohablante
- **General Chat** (43 topics)

### HIPs (Humanity Improvement Proposals) relevantes
- **HIP-86**: Anonimizar perfiles para integraciones 3rd party (Fase 1)
- **PoH Origin Constitution v2**: constitución del registro origen

---

## 6. Kleros — Detalles Técnicos (de FAQ)

### Tokenomics PNK
- Total supply: 764,626,704 PNK (modificable solo por DAO vote)
- Allocation: Team 18%, Sale 16%, Airdrop 4%, Juror Incentives 50%, Reserve 12%

### Seguridad
- 51% attack requiere ~cientos de millones USD
- Fork de último recurso si ataque exitoso (tipo Augur)
- Crowdfunding de appeal fees evita "rich win"

### Blockchain
- Kleros V2 en **Arbitrum One** (L2 Ethereum)
- Cross-chain via **Vea Bridge** + Gateway system (Ethereum mainnet, Gnosis Chain)

### Jurados
- Auto-selección staking PNK en courts
- Sorteo aleatorio ponderado por stake
- Penalización por no votar (incoherente)
- Anonimato para proteger de soborno/intimidación

---

## 7. Licencia y Derechos de Autor

- **Código PoH v2 contracts**: MIT License (permisiva)
- **Frontend PoH v2**: Sin licencia explícita visible (asumir MIT por convención)
- **Documentación Kleros**: Copyright Kleros Coopérative — **NO copiar texto literal extensivo**
- **Marketing/Brand assets**: MIT License
- **Kleros FAQ/docs**: Propiedad de Kleros — citar y mapear conceptos, NO reproducir

> **Principio Anfibio HSCSG**: Asimilar LÓGICA PURA (patrones, arquitectura, tipos, métricas). Extirpar INFRA AJENA (Solidity/EVM, Next.js, The Graph, APIs centralizadas). Conservar isomorfismo con Leyes MJ I/II/III + CaaS.

---

## 8. Mapeo a HSCSG v15 OS (Isomorfismos Preliminares)

| Concepto PoH/Kleros | Módulo HSCSG | Ley MJ / CaaS |
|---------------------|--------------|---------------|
| Registro humano verificado | `poh` (identidad soberana) | Ley I: no dañar personas; Ley III: lucidez |
| Vouching comunitario | `poh.vouching` → `trustlines` / `solarpunk.vouches` | Ley II: ganarse la vida soberanizando (AUT×CDS) |
| Disputas Kleros Court | `kleros.disputes` → `justicia` / `oraculo` | Ley III: transparencia, verificación append-only |
| Jurados + stake PNK | `kleros.jurors` → `symbiosky` (credibilidad por convicción) | Ley II: stake = skin-in-the-game = AUT |
| Soulbound ID cross-chain | `poh.soulboundId` → `delegation` / `aura` | Ley I: identidad no transferible = no dañar base |
| Challenge period | `poh.challenge` → `integral.issues` + `evidence` | Ley III: challenge = verificación, lucidez |
| UBI distribution | `poh.ubi` → `caas.payouts` + `znu` | CaaS: acceso por contribución real (AUT) |
| Human verification for AI | `poh.aiVerification` → `boundaries` (policy gateway) | Ley I: distinguir humano/bot = proteger base material |

---

## 9. Archivos Fuente Guardados (Cache Local)

- `C:\Users\Isaacko0\AppData\Local\hermes\cache\web\github.com-be785503ce.md` — GitHub Org repos (30,603 chars)
- `C:\Users\Isaacko0\AppData\Local\hermes\cache\web\proofofhumanity.id-*.md` — Web PoH (1,893 tokens)
- `C:\Users\Isaacko0\AppData\Local\hermes\cache\web\gov.proofofhumanity.id-*.md` — Governance (1,833 tokens)
- `C:\Users\Isaacko0\AppData\Local\hermes\cache\web\docs.kleros.io-176211eb40.md` — Kleros FAQ (86,507 chars)
- `C:\Users\Isaacko0\AppData\Local\hermes\cache\web\docs.kleros.io-0ca838b841.md` — PoH Docs (50,488 chars)

---

## 10. Próximos Pasos (Fases 2-4)

1. **FASE 2** — Crear `docs/poh_kleros_integration.md` con triple perspectiva (Usuario/LLM/HSCSG+CaaS)
2. **FASE 3** — Generar módulo vivo:
   - `src/core/state/poh.ts` — tipos + estado inicial
   - `src/core/lib/poh.ts` — lógica pura (makePohState, vouching, challenges, soulbound)
   - `src/core/lib/kleros-extended.ts` — extensión Kleros (price discovery, courts, appeals)
   - Store integration en `store.ts`
   - `src/app/screens/Poh.tsx` — pantalla con tabs: Registro, Vouching, Desafíos, Identidad, Kleros
   - Nav en `Aside.tsx` + ruta en `App.tsx`
3. **FASE 4** — Verificar: `tsc --noEmit`, `build`, preview rutas 200, tests