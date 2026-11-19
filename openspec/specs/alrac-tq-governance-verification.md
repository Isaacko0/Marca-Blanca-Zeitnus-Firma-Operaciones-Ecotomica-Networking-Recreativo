// openspec/specs/alrac-tq-governance-verification.md
// OpenSpec: Verificación de Gobernanza y Peso de Voto (TDF / Closer / Snapshot)
// Mapas: fórmula de voto TDF, verificación on-chain (Celo), config Snapshot → TypeScript
// Estado: Propuesta — pendiente implementación
// Capa: 5 (Transición Económica) + Capa 4 (Interoperabilidad)

# SPEC: alrac-tq-governance-verification
**Version:** 1.0.0 (propuesta)
**Status:** Propuesta — pendiente implementación en TypeScript
**Source:** sepu85/tdf-snapshot-voting (FORMULA.md, snapshot-space-config.md, verify.mjs); closerdao/tdf-game-guide (03_governance/dao.md, 05_token-economy/voting_weight.md)
**Targets:** `src/core/lib/celo-verifier.ts`, `src/core/lib/tq-tdf.ts` (extensión), `src/core/lib/tq-closer-attestation.ts` (extensión)

---

## 1. Arquitectura de verificación de gobernanza

TDF necesita que su gobernanza sea independientemente verificable. Tres mecanismos se asimilan:

| Mecanismo | Descripción | Destino técnico |
|-----------|-------------|-----------------|
| Fórmula de peso de voto | `weight = TDF.balanceOf + Staking.stakedBalanceOf + Presence.balanceOf + Sweat.balanceOf` (todos ×1) | `tq-tdf.ts` `calculateVotingWeight()` |
| Verificación on-chain independiente | Script `verify.mjs` recompute contra Celo via eth_call JSON-RPC, cero dependencias | `celo-verifier.ts` `verifyVotingWeight()` |
| Configuración Snapshot | 4 estrategias ×1 en Celo chainId 42220; reactivar espacio `traditionaldreamfactory.eth` | Nueva spec + `tq-closer-attestation.ts` |
| Auditoría social rotativa | Panel de 3-5 testigos humanos que recompute y firman wallet-signed statements | `governanceTriad.ts` (base-3) |

---

## 2. Especificación técnica

### 2.1 Contratos Celo (chainId 42220) — direcciones de origen, NO código

| Contrato | Dirección | Función de lectura | Rol |
|----------|-----------|-------------------|-----|
| TDF | `0x10CB7F49389787A99b59B2f87dfDd3bba141559f` | `balanceOf(address)` | Token base de gobernanza |
| Staking (Diamond DAO) | `0x475398EeE0E22cb6fe5403ffA294Fb10Ad989e17` | `stakedBalanceOf(address)` | TDF staked |
| Presence | `0x5Bc8e45E6c0019F12bE2979De614AF3cc63538e9` | `balanceOf(address)` | Presencia (no transferible, decay) |
| Sweat | `0x5D2870B37aB72AB9Cc3F46878373EeCc1312FA6e` | `balanceOf(address)` | Contribución (no transferible, decay) |
| Membersheep NFT | `0x6b4121DE536c7B31352D1044963c28f6f543e10a` | `balanceOf(address) > 0` | Membresía (validación, no peso) |

**Regla dura:** Solo lectura externa. No se importa web3/ethers; se usa `fetch` JSON-RPC puro (estilo verify.mjs).

### 2.2 Interfaz: `VotingWeightResult`

```typescript
interface VotingWeightResult {
  address: string
  tdf: bigint
  stakedTdf: bigint
  presence: bigint
  sweat: bigint
  totalWeight: bigint   // tdf + stakedTdf + presence + sweat (todos ×1)
  blockTimestamp: number
  source: 'celo-mainnet' | 'celo-alfajores' | 'local-mock'
}
```

### 2.3 Función: `verifyVotingWeight(address: string, rpcUrl?: string): Promise<VotingWeightResult>`

- Llama `eth_call` a cada contrato con selector `balanceOf` (0x70a08231) y `stakedBalanceOf` (0x16765391).
- Suma los cuatro con peso ×1.
- Retorna resultado con bloque y fuente.
- Cero dependencias npm (Node built-in fetch).

### 2.4 Interfaz: `SnapshotStrategyConfig`

```typescript
interface SnapshotStrategy {
  name: 'erc20-balance-of' | 'contract-call'
  params: Record<string, unknown>
}

interface SnapshotSpaceConfig {
  network: 'celo-mainnet'   // chainId 42220
  strategies: SnapshotStrategy[]  // 4 estrategias ×1
  validation?: { strategy: string; params: Record<string, unknown> }  // Membersheep NFT gating (pendiente)
}
```

### 2.5 Función: `buildSnapshotConfig(): SnapshotSpaceConfig`

Genera el JSON literal de las 4 estrategias (TDF erc20, staked TDF contract-call, Presence erc20, Sweat erc20), tal como documenta `snapshot-space-config.md`.

### 2.6 Función: `validateSnapshotConfig(config: SnapshotSpaceConfig): { valid; errors }`

- Red = Celo mainnet (chainId 42220)
- Máximo 8 estrategias
- Todas ×1 (sin multiplicador)
- Direcciones de contrato coinciden con las de §2.1

---

## 3. Integración con specs existentes

| Spec existente | Punto de integración |
|----------------|---------------------|
| `alrac-tq-tdf` (3 pistas de verificación) | Pista 2 (on-chain): `verifyVotingWeight` como oracle de peso; Pista 3 (social): auditoría rotativa |
| `alrac-tq-oasa` (Constitución, Guardians) | Veto de Guardians sobre propuestas; `tq-tdf.ts` respeta el veto |
| `alrac-tq-economia-comunes` (capa económica) | El peso de voto usa los mismos tokens del común (no extracción) |
| `alrac-tq-land` (registro tierra) | La presencia está ligada a nights de estancia en la tierra registrada |

---

## 4. Criterios de aceptación

- [ ] `verifyVotingWeight()` retorna total = tdf + staked + presence + sweat
- [ ] Cero dependencias npm en `celo-verifier.ts`
- [ ] `buildSnapshotConfig()` genera 4 estrategias ×1, red Celo 42220
- [ ] `validateSnapshotConfig()` rechaza red distinta a Celo o multiplicadores ≠1
- [ ] 0 errores TypeScript nuevos

---

## 5. Vectores de prueba

```typescript
// verifyVotingWeight
Input: address con TDF=100, staked=50, presence=30, sweat=20
Expected: totalWeight = 200; source = 'celo-mainnet'
```

```typescript
// buildSnapshotConfig
Input: none
Expected: strategies.length === 4; network === 'celo-mainnet'; todas ×1
```

---

## 6. Dependencias

| Dependencia | Versión | Propósito |
|-------------|---------|-----------|
| `tq-types-extended` | 1.0.0 | Tipos core |
| `tq-tdf` | 1.0.0 | Lógica TDF |
| `tq-closer-attestation` | 1.0.0 | Closer Attestation RFC |
| `tq-oasa` | 1.0.0 | Constitución OASA / veto Guardians |

---

## 7. Referencias

- `sepu85/tdf-snapshot-voting/FORMULA.md`: https://github.com/sepu85/tdf-snapshot-voting/blob/master/FORMULA.md
- `sepu85/tdf-snapshot-voting/snapshot-space-config.md`: https://github.com/sepu85/tdf-snapshot-voting/blob/master/snapshot-space-config.md
- `sepu85/tdf-snapshot-voting/verify.mjs`: https://github.com/sepu85/tdf-snapshot-voting/blob/master/verify.mjs
- `closerdao/tdf-game-guide/05_token-economy/voting_weight.md`: https://github.com/closerdao/tdf-game-guide/blob/main/05_token-economy/voting_weight.md
- `closerdao/tdf-game-guide/03_governance/dao.md`: https://github.com/closerdao/tdf-game-guide/blob/main/03_governance/dao.md
- `docs/oasa-tdf-governance-stack_integration.md` (EBD D9, D10)

---

## 8. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-11-19 | Propuesta inicial: peso de voto, verify on-chain, config Snapshot, auditoría social |
