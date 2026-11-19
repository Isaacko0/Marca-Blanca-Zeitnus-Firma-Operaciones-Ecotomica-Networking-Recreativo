// src/core/lib/celo-verifier.ts
// Verificación independiente de peso de voto TDF contra Celo (estilo verify.mjs de sepu85/tdf-snapshot-voting)
// Cero dependencias npm: solo fetch built-in de Node 18+
// Lógica pura reimplementada en TypeScript; no copia código de ningún repo externo.

const DEFAULT_RPC = 'https://forno.celo.org';

// Direcciones de contrato (Celo mainnet, chainId 42220) — solo lectura, fuente externa
const TOKEN_ADDRESSES = {
  tdf: '0x10CB7F49389787A99b59B2f87dfDd3bba141559f',
  presence: '0x5Bc8e45E6c0019F12bE2979De614AF3cc63538e9',
  sweat: '0x5D2870B37aB72AB9Cc3F46878373EeCc1312FA6e',
} as const;

const STAKING_ADDRESS = '0x475398EeE0E22cb6fe5403ffA294Fb10Ad989e17';

// Selectores de función (primeros 4 bytes de keccak256(signatura))
const SELECTOR = {
  balanceOf: '0x70a08231',
  stakedBalanceOf: '0x16765391',
} as const;

const WAD = 10n ** 18n;

const padAddress = (addr: string): string =>
  addr.toLowerCase().replace('0x', '').padStart(64, '0');

const toBigInt = (hex: string | null): bigint =>
  hex && hex !== '0x' ? BigInt(hex) : 0n;

const formatWei = (wei: bigint): string =>
  (Number(wei) / Number(WAD)).toLocaleString('en-US', {
    maximumFractionDigits: 6,
  });

export interface VotingWeightComponents {
  tdf: bigint;
  stakedTdf: bigint;
  presence: bigint;
  sweat: bigint;
}

export interface VotingWeightResult {
  address: string;
  components: VotingWeightComponents;
  totalWeight: bigint;
  blockTimestamp: number;
  source: 'celo-mainnet' | 'celo-alfajores' | 'local-mock';
}

async function ethCall(
  to: string,
  data: string,
  rpcUrl: string,
): Promise<string> {
  const res = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_call',
      params: [{ to, data }, 'latest'],
    }),
  });
  const json = await res.json();
  if (json.error) {
    throw new Error(
      `eth_call to ${to}: ${json.error.message ?? String(json.error)}`,
    );
  }
  return json.result;
}

async function balanceOf(
  token: string,
  addr: string,
  rpcUrl: string,
): Promise<bigint> {
  return toBigInt(await ethCall(token, SELECTOR.balanceOf + padAddress(addr), rpcUrl));
}

async function stakedBalanceOf(
  addr: string,
  rpcUrl: string,
): Promise<bigint> {
  return toBigInt(
    await ethCall(
      STAKING_ADDRESS,
      SELECTOR.stakedBalanceOf + padAddress(addr),
      rpcUrl,
    ),
  );
}

/**
 * Recompute independientemente el peso de voto de una dirección contra Celo.
 * Peso = TDF.balanceOf + stakedTDF + Presence.balanceOf + Sweat.balanceOf (todos ×1).
 * No depende del backend de Closer ni de Snapshot.
 */
export async function verifyVotingWeight(
  address: string,
  rpcUrl: string = DEFAULT_RPC,
): Promise<VotingWeightResult> {
  if (!/^0x[0-9a-fA-F]{40}$/.test(address)) {
    throw new Error(`Dirección inválida: ${address}`);
  }

  const [tdf, presence, sweat, staked] = await Promise.all([
    balanceOf(TOKEN_ADDRESSES.tdf, address, rpcUrl),
    balanceOf(TOKEN_ADDRESSES.presence, address, rpcUrl),
    balanceOf(TOKEN_ADDRESSES.sweat, address, rpcUrl),
    stakedBalanceOf(address, rpcUrl),
  ]);

  const components: VotingWeightComponents = { tdf, stakedTdf: staked, presence, sweat };
  const totalWeight = tdf + staked + presence + sweat;

  return {
    address,
    components,
    totalWeight,
    blockTimestamp: Date.now(),
    source: rpcUrl.includes('alfajores') ? 'celo-alfajores' : 'celo-mainnet',
  };
}

/**
 * Valida que una dirección tenga peso de voto suficiente para alcanzar el quórum DAO (500 TDF eq).
 */
export function meetsQuorum(weight: bigint, quorumTdf: bigint = 500n * WAD): boolean {
  return weight >= quorumTdf;
}

export { formatWei, WAD };
