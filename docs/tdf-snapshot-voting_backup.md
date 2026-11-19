# RESPALDO DE FUENTE — TDF Snapshot Voting

## Identificación de la fuente

- **Título:** TDF Snapshot Voting — an interim, independently-verifiable voting option
- **Autor:** sepu85 (Gus), con co-autoría de Claude (Anthropic)
- **Repo:** https://github.com/sepu85/tdf-snapshot-voting
- **Rama:** master
- **Tipo:** Documentación + propuesta de gobernanza + script de verificación (JavaScript)
- **Licencia:** MIT (ver LICENSE en el repo)

## ⚖️ Aviso de derechos de autor

Este respaldo se conserva únicamente como material de referencia para análisis e integración arquitectónica en este repositorio. Todos los derechos de autor permanecen con sepu85 y los co-autores correspondientes. El contenido se cita y analiza; no se reclama autoría sobre la obra original. Para reuso externo, consultar la licencia del repositorio origen.

## Qué es el repositorio

Conjunto de tres pistas independientes y combinables para hacer la gobernanza DAO de TDF (Traditional Dream Factory) independientemente verificable:

| Track | Qué hace | Archivos clave |
|-------|----------|----------------|
| **1 — Fix Closer** | RFC/PR para hacer el voto de Closer criptográficamente verificable (recibos firmados por wallet publicados a IPFS) | `RFC-DRAFT.md`, `ipfs-design.md`, `phase1-closer-ui-patch.md` |
| **2 — Vote on Snapshot** | Reactivar y configurar el espacio Snapshot existente de TDF (`traditionaldreamfactory.eth`, 19 propuestas 2022–2024) con la fórmula de peso de voto completa | `EXISTING-SNAPSHOT-SPACE.md`, `FORMULA.md`, `snapshot-space-config.md`, `SETUP.md`, `verify.mjs` |
| **3 — Receipt** | Recibo posterior al voto para que cualquier ciudadano verifique su propio voto | `PROPOSAL.md`, `SOCIAL-AUDIT.md` |

## Archivos clave y su contenido

| Archivo | Qué contiene |
|---------|-------------|
| `README.md` | Vista general de las 3 pistas, notas de alcance y honestidad, estado |
| `PROPOSAL.md` | Propuesta formal "Making Our Votes Checkable" para votación comunitaria |
| `FORMULA.md` | Fórmula de peso de voto: `weight = TDF.balanceOf + Staking.stakedBalanceOf + Presence.balanceOf + Sweat.balanceOf` (todos ×1). Contratos en Celo mainnet (chainId 42220) |
| `snapshot-space-config.md` | Configuración literal de estrategias Snapshot (4 estrategias ×1: TDF erc20-balance-of, staked TDF contract-call, Presence erc20-balance-of, Sweat erc20-balance-of) |
| `verify.mjs` | Script Node.js (sin dependencias npm) que recompute el peso de voto de una dirección directamente contra Celo via eth_call JSON-RPC |
| `SOCIAL-AUDIT.md` | Proceso de auditoría social rotativa sin código (panel de testigos humanos) |
| `EXISTING-SNAPSHOT-SPACE.md` | Análisis del espacio Snapshot existente y pasos para reactivarlo |
| `SETUP.md` | Instrucciones de configururación |
| `RFC-DRAFT.md` | RFC para closer-ui #1178 / PR #1179 |
| `ipfs-design.md` | Diseño de publicación de recibos a IPFS |
| `LICENSE` | MIT |

## Contratos referenciados (Celo mainnet, chainId 42220)

| Contrato | Dirección | Función de lectura | Rol |
|----------|-----------|-------------------|-----|
| TDF | `0x10CB7F49389787A99b59B2f87dfDd3bba141559f` | `balanceOf(address)` | Token base de gobernanza |
| Staking (Diamond DAO) | `0x475398EeE0E22cb6fe5403ffA294Fb10Ad989e17` | `stakedBalanceOf(address)` | TDF staked en el DAO |
| Presence | `0x5Bc8e45E6c0019F12bE2979De614AF3cc63538e9` | `balanceOf(address)` | Token de presencia (no transferible, decay) |
| Sweat | `0x5D2870B37aB72AB9Cc3F46878373EeCc1312FA6e` | `balanceOf(address)` | Token de contribución (no transferible, decay) |
| Membersheep NFT | `0x6b4121DE536c7B31352D1044963c28f6f543e10a` | `balanceOf(address) > 0` | Marcador de membresía (no peso) |

## Estado

- Track 1 Fase 1: PR abierto `closerdao/closer-ui#1179`, en revisión por mantenedores de Closer
- Track 2 (Snapshot): borrador, espacio existente dormido desde Dec 2024
- Track 3 (receipt): borrador
- Nada adoptado como proceso oficial de TDF aún
