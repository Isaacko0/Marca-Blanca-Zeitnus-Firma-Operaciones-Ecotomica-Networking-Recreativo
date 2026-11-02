// Proof of Humanity — Adaptadores Anfibios (Postmonetario ↔ Conectado)
import type {
  PohState,
  PoHProfile,
  VouchRecord,
  PohChallenge,
  PoHIdentity,
  CrossChainProof,
  SubmitProfileInput,
  VouchInput,
  OpenChallengeInput,
  SeatJurorInput,
} from '@core/state/poh'
import type { EvidenceRecord } from '@core/lib/evidence'
import type { JurorVerdict } from '@core/state/kleros'
import {
  submitProfile as submitProfileLocal,
  vouch as vouchLocal,
  openChallenge as openChallengeLocal,
  addChallengeEvidence as addEvidenceLocal,
  seatJuror as seatJurorLocal,
  castVote as castVoteLocal,
  resolveChallenge as resolveChallengeLocal,
  appealChallenge as appealChallengeLocal,
  includeHuman as includeHumanLocal,
  renewIdentity as renewIdentityLocal,
  verifyCrossChain as verifyCrossChainLocal,
  getProfile,
  getVouchesFor,
  getActiveChallenges,
  getChallenge,
  getIdentity,
  getExpiringIdentities,
  selectJurorsBySortition,
  updateJurorReputation,
} from '@core/lib/poh'
import { calculateAppealCost, canAppeal, processAppeal } from '@core/lib/kleros-extended'

// ===== Tipos de Modo =====
export type PohMode = 'postmonetario' | 'conectado'

export interface PohAdapter {
  // Modo postmonetario (local, ZNU, offline-first)
  submitProfile(input: SubmitProfileInput): PoHProfile
  vouch(input: VouchInput): VouchRecord
  openChallenge(input: OpenChallengeInput): PohChallenge
  addChallengeEvidence(challengeId: string, evidence: EvidenceRecord): void
  seatJuror(input: SeatJurorInput): { juror: any; txHash?: string }
  castVote(challengeId: string, jurorId: string, verdict: JurorVerdict): void
  resolveChallenge(challengeId: string, resolution: string): void
  appealChallenge(challengeId: string, appellant: string): void
  includeHuman(profileId: string): PoHIdentity
  renewIdentity(identityId: string): PoHIdentity
  verifyCrossChain(humanityId: string, chain: 'gnosis' | 'ethereum' | 'arbitrum'): Promise<CrossChainProof>

  // Getters (read-only, mismos en ambos modos)
  getProfile(id: string): PoHProfile | undefined
  getVouchesFor(profileId: string): VouchRecord[]
  getActiveChallenges(): PohChallenge[]
  getChallenge(id: string): PohChallenge | undefined
  getIdentity(humanName: string): PoHIdentity | undefined
  getIdentityById(id: string): PoHIdentity | undefined
  getExpiringIdentities(days: number): PoHIdentity[]
  selectJurors(courtId: string, count: number): any[]
  updateJurorReputation(challengeId: string, resolution: JurorVerdict): void
  canAppeal(challengeId: string, appellant: string): { ok: boolean; reason?: string; cost?: number }
  calculateAppealCost(round: number): number
}

// ===== Adapter Postmonetario (Local-First, ZNU, Sin Blockchain) =====
export function createPostmonetarioAdapter(getState: () => PohState, setState: (fn: (s: PohState) => PohState) => void): PohAdapter {
  return {
    submitProfile: (input) => {
      let result: PoHProfile
      setState(st => {
        const newState = submitProfileLocal(st, input)
        result = newState.profiles.find(p => p.id === newState.profiles[newState.profiles.length - 1]?.id)!
        return newState
      })
      return result!
    },

    vouch: (input) => {
      let result: VouchRecord
      setState(st => {
        const { state, vouch } = vouchLocal(st, input)
        result = vouch
        return state
      })
      return result!
    },

    openChallenge: (input) => {
      let result: PohChallenge
      setState(st => {
        const { state, challenge } = openChallengeLocal(st, input)
        result = challenge
        return state
      })
      return result!
    },

    addChallengeEvidence: (challengeId, evidence) => {
      setState(st => addEvidenceLocal(st, challengeId, evidence))
    },

    seatJuror: (input) => {
      let juror: any
      setState(st => {
        const res = seatJurorLocal(st, input)
        juror = res.juror
        return res.state
      })
      return { juror }
    },

    castVote: (challengeId, jurorId, verdict) => {
      setState(st => castVoteLocal(st, challengeId, jurorId, verdict))
    },

    resolveChallenge: (challengeId, resolution) => {
      setState(st => {
        const newState = resolveChallengeLocal(st, challengeId, resolution)
        // Actualizar reputación jurados
        return updateJurorReputation(newState, challengeId, 'a_favor') // simplificado
      })
    },

    appealChallenge: (challengeId, appellant) => {
      setState(st => processAppeal(st, challengeId, appellant))
    },

    includeHuman: (profileId) => {
      let identity: PoHIdentity
      setState(st => {
        const { state, identity: id } = includeHumanLocal(st, profileId)
        identity = id
        return state
      })
      return identity!
    },

    renewIdentity: (identityId) => {
      let identity: PoHIdentity
      setState(st => {
        identity = renewIdentityLocal(st, identityId)
        return st // renewIdentityLocal no modifica estado directamente en esta versión
      })
      return identity!
    },

    verifyCrossChain: async (humanityId, chain) => {
      return verifyCrossChainLocal(humanityId, chain)
    },

    // Getters (read-only, acceso directo al estado)
    getProfile: (id) => getProfile(getState(), id),
    getVouchesFor: (profileId) => getVouchesFor(getState(), profileId),
    getActiveChallenges: () => getActiveChallenges(getState()),
    getChallenge: (id) => getChallenge(getState(), id),
    getIdentity: (humanName) => getIdentity(getState(), humanName),
    getIdentityById: (id) => getIdentityById(getState(), id),
    getExpiringIdentities: (days) => getExpiringIdentities(getState(), days),
    selectJurors: (courtId, count) => selectJurorsBySortition(getState(), courtId, count),
    updateJurorReputation: (challengeId, resolution) => {
      setState(st => updateJurorReputation(st, challengeId, resolution))
    },
    canAppeal: (challengeId, appellant) => canAppeal(
      getState().challenges.find(c => c.id === challengeId)!,
      appellant
    ),
    calculateAppealCost: (round) => calculateAppealCost(round),
  }
}

// ===== Adapter Conectado (Blockchain: Gnosis/Ethereum/Arbitrum) =====
// Requiere: viem/ethers, RPC URLs, wallet connection, contratos desplegados
export interface ConnectedAdapterConfig {
  rpcUrls: {
    gnosis: string
    ethereum: string
    arbitrum: string
  }
  contracts: {
    pohV2: string                    // ProofOfHumanityV2 contract
    crossChainPoh: string            // ICrossChainProofOfHumanity
    klerosArbitrator: string         // Kleros Arbitrator V1
    pnkToken: string                 // PNK token (para staking jurados)
  }
  wallet: {
    address: string
    signMessage: (msg: string) => Promise<string>
    sendTransaction: (tx: any) => Promise<string>
  }
  priceParity: number                // ZNU → USDC (oráculo ReFi Nivel 3)
}

export function createConectadoAdapter(
  getState: () => PohState,
  setState: (fn: (s: PohState) => PohState) => void,
  config: ConnectedAdapterConfig
): PohAdapter {
  // TODO: Implementar con viem/ethers
  // Por ahora, delega al adapter postmonetario y añade funcionalidad blockchain
  const localAdapter = createPostmonetarioAdapter(getState, setState)

  return {
    ...localAdapter,

    // Override: submitProfile envía tx a PoH v2 contract en Gnosis
    submitProfile: async (input) => {
      // 1. Crear perfil local
      const localProfile = localAdapter.submitProfile(input)

      // 2. Subir vídeo/foto a IPFS (Pinata/nativo)
      // const videoCid = await uploadToIPFS(input.videoHash)
      // const photoCid = await uploadToIPFS(input.photoHash)

      // 3. Enviar tx a PoH v2 contract (Gnosis Chain)
      // const tx = await config.wallet.sendTransaction({
      //   to: config.contracts.pohV2,
      //   data: encodeFunctionData({
      //     abi: POH_V2_ABI,
      //     functionName: 'submitProfile',
      //     args: [input.name, videoCid, photoCid, input.walletAddress]
      //   }),
      //   value: parseEther('0.01') // depósito reembolsable en Gnosis (muy barato)
      // })

      // 4. Actualizar perfil local con txHash y crossChainProof
      // setState(st => ({
      //   ...st,
      //   profiles: st.profiles.map(p =>
      //     p.id === localProfile.id
      //       ? { ...p, crossChainProof: { chain: 'gnosis', contractAddress: config.contracts.pohV2, humanityId: '...', isClaimed: true, claimedAt: now(), txHash: tx } }
      //       : p
      //   )
      // }))

      console.log('[PoH Conectado] submitProfile en Gnosis Chain - PENDIENTE IMPLEMENTACIÓN viem/ethers')
      return localProfile
    },

    // Override: vouch envía tx a contrato
    vouch: async (input) => {
      const localVouch = localAdapter.vouch(input)
      // TODO: tx a contrato PoH vouch(profileId)
      console.log('[PoH Conectado] vouch on-chain - PENDIENTE')
      return localVouch
    },

    // Override: seatJuror staking PNK en Kleros court
    seatJuror: async (input) => {
      const localResult = localAdapter.seatJuror(input)
      // TODO: Stake PNK en Kleros court (Arbitrum)
      // const tx = await config.wallet.sendTransaction({
      //   to: config.contracts.klerosArbitrator,
      //   data: encodeFunctionData({ abi: ARBITRATOR_ABI, functionName: 'stake', args: [courtId, parseEther(input.stake.toString())] })
      // })
      console.log('[PoH Conectado] seatJuror staking PNK - PENDIENTE')
      return localResult
    },

    // Override: castVote en Kleros (commit-reveal si hiddenVotes)
    castVote: async (challengeId, jurorId, verdict) => {
      localAdapter.castVote(challengeId, jurorId, verdict)
      // TODO: Commit-reveal en Kleros Arbitrator
      console.log('[PoH Conectado] castVote on-chain - PENDIENTE')
    },

    // Override: resolveChallenge llama a Kleros arbitrator
    resolveChallenge: async (challengeId, resolution) => {
      localAdapter.resolveChallenge(challengeId, resolution)
      // TODO: Ejecutar resolución en Kleros
      console.log('[PoH Conectado] resolveChallenge on-chain - PENDIENTE')
    },

    // Override: appealChallenge paga fee en Kleros
    appealChallenge: async (challengeId, appellant) => {
      localAdapter.appealChallenge(challengeId, appellant)
      // TODO: Pagar appeal fee en Kleros
      console.log('[PoH Conectado] appealChallenge on-chain - PENDIENTE')
    },

    // Override: verifyCrossChain usa ICrossChainProofOfHumanity
    verifyCrossChain: async (humanityId, chain) => {
      // TODO: Llamada read-only a ICrossChainProofOfHumanity
      // const result = await publicClient.readContract({
      //   address: config.contracts.crossChainPoh,
      //   abi: CROSS_CHAIN_POH_ABI,
      //   functionName: 'isHuman',
      //   args: [humanityId]
      // })
      console.log('[PoH Conectado] verifyCrossChain - PENDIENTE')
      return localAdapter.verifyCrossChain(humanityId, chain)
    },
  }
}

// ===== Factory Principal =====
export function createPohAdapter(
  mode: PohMode,
  getState: () => PohState,
  setState: (fn: (s: PohState) => PohState) => void,
  config?: ConnectedAdapterConfig
): PohAdapter {
  switch (mode) {
    case 'postmonetario':
      return createPostmonetarioAdapter(getState, setState)
    case 'conectado':
      if (!config) throw new Error('Conectado mode requires config')
      return createConectadoAdapter(getState, setState, config)
    default:
      throw new Error(`Unknown PoH mode: ${mode}`)
  }
}

// ===== Hooks para uso en componentes =====
export function usePohAdapter(mode: PohMode = 'postmonetario') {
  // En componente real: usar useAppStore para getState/setState
  // const { poh, ...actions } = useAppStore()
  // return createPohAdapter(mode, () => poh, (fn) => { /* set via actions */ })
  return null as unknown as PohAdapter
}

// ===== Constantes de Configuración =====
export const POH_CHAINS = {
  gnosis: { id: 100, name: 'Gnosis Chain', nativeCurrency: { name: 'xDAI', symbol: 'xDAI', decimals: 18 } },
  ethereum: { id: 1, name: 'Ethereum', nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 } },
  arbitrum: { id: 42161, name: 'Arbitrum One', nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 } },
} as const

export const POH_CONTRACT_ADDRESSES = {
  // Mainnet addresses (actualizar según deployment)
  gnosis: {
    pohV2: '0x...', // ProofOfHumanityV2 en Gnosis
    crossChainPoh: '0x...',
    klerosArbitrator: '0x...',
  },
  ethereum: {
    pohV2: '0x...',
    crossChainPoh: '0x...',
    klerosArbitrator: '0x...',
  },
  arbitrum: {
    klerosArbitrator: '0x...', // Kleros V2 en Arbitrum
  },
} as const

const now = () => Date.now()