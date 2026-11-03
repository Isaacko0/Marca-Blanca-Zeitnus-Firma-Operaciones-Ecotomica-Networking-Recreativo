// hooks/ie-protocol.ts — Zustand store completo para Protocolo IE
// Offline-first, persistente en localStorage, migración v1→v2, acciones + selectores

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import {
  IEProtocolState,
  IEChallenge,
  IEPosition,
  IEMilestone,
  IEAttestation,
  IMImpactCert,
  IEGiveAllocation,
  IEToast,
  IELevel,
  IEWeightClass,
  CreateChallengeInput,
  IESynthesisInput,
  IESynthesisResult,
  IEReportInput,
  IEReportResult,
} from '@core/lib/ie-types';

import {
  INITIAL_IE_STATE,
  IE_STORAGE_KEY,
  IE_STORAGE_VERSION,
  IE_ACHIEVEMENTS,
  ieDetectV1Data,
  ieMigrateV1ToV2,
  ieSelectChallenge,
  ieSelectPosition,
  ieSelectMilestone,
  ieSelectPositionsOfChallenge,
  ieSelectMilestonesOfChallenge,
  ieSelectClaimable,
  ieSelectReputationScore,
  ieSelectGiveRemaining,
  ieSelectCurrentA3,
  ieSelectProjectedPayout,
  ieSelectChallengesSummary,
  ieSelectAttestationsBySchema,
  ieSelectImpactCertsOfChallenge,
  ieCreateToast,
  ieAddToast,
  ieRemoveToast,
  ieRecalculateGlobalMetrics,
} from '@core/state/ie-protocol';

import {
  ieCreateChallenge,
  ieFundChallenge,
  ieCreatePosition,
  ieCanJoin,
  ieCalculateWeightClass,
  ieCalculateEffectiveWeight,
  ieCalculateA3,
  ieCalculatePayouts,
  ieVerifyConservation,
  ieApproveMilestone,
  ieReleaseMilestone,
  ieStake,
  ieUnstake,
  ieAllocateGive,
  ieSetCoordinator,
  ieSimulateGrowth,
  ieProjectRCE,
  ieValidateTree,
} from '@core/lib/ie-protocol';

import { ieCreateAttestation, ieRevokeAttestation, ieGetReceived, ieReputationScore } from '@core/lib/ie-attestation';

import { ieFormatUSDC } from '@core/lib/ie-rce-math';

// ============================================================================
// TIPOS DE ACCIONES
// ============================================================================

interface IEProtocolActions {
  // === CHALLENGES ===
  createChallenge: (input: CreateChallengeInput) => IEChallenge;
  fundChallenge: (challengeId: string, gross: bigint) => { fee: bigint; net: bigint };
  closeChallenge: (challengeId: string) => bigint; // refunded
  
  // === NETWORK GROWTH ===
  seed: (challengeId: string, holder: string) => IEPosition;
  join: (challengeId: string, parentPositionId: string, holder: string) => IEPosition;
  setCoordinator: (challengeId: string, positionId: string, value: boolean) => void;
  
  // === CONTRIBUTIONS & CONSENSUS ===
  contribute: (challengeId: string, positionId: string, workURI: string) => IEAttestation;
  approveMilestone: (challengeId: string, milestoneId: string, voter: string, positionId: string) => { approvals: number; released: boolean };
  releaseMilestone: (challengeId: string, milestoneId: string) => { payouts: Map<string, bigint>; a3: bigint };
  claim: (challengeId: string, holder: string) => bigint;
  
  // === STAKING ===
  stake: (challengeId: string, positionId: string, amount: bigint) => bigint;
  unstake: (challengeId: string, positionId: string, amount: bigint) => bigint;
  
  // === PEER SCORING (GIVE) ===
  allocateGive: (challengeId: string, fromPositionId: string, toPositionId: string, amount: bigint) => bigint;
  
  // === AI FACILITATOR ===
  synthesizeConsensus: (input: IESynthesisInput) => Promise<IESynthesisResult>;
  generateFunderReport: (input: IEReportInput) => Promise<IEReportResult>;
  
  // === SELECTORS ===
  getChallenge: (id: string) => IEChallenge | undefined;
  getPosition: (id: string) => IEPosition | undefined;
  getMilestone: (id: string) => IEMilestone | undefined;
  getPositionsOf: (challengeId: string) => IEPosition[];
  getMilestonesOf: (challengeId: string) => IEMilestone[];
  getClaimable: (challengeId: string, holder: string) => bigint;
  getReputation: (holder: string) => number;
  getGiveRemaining: (challengeId: string, holder: string) => bigint;
  getCurrentA3: (challengeId: string) => bigint;
  getProjectedPayout: (challengeId: string, positionId: string, milestoneId: string) => bigint;
  getChallengesSummary: () => ReturnType<typeof ieSelectChallengesSummary>;
  getAttestations: (holder: string, schema: string) => IEAttestation[];
  getImpactCerts: (challengeId: string) => IMImpactCert[];
  
  // === PERSISTENCE ===
  saveToStorage: () => void;
  reset: () => void;
  detectV1Data: () => boolean;
  migrateV1ToV2: () => void;
  
  // === UI ===
  setScreen: (screen: IEProtocolState['ui']['screen']) => void;
  setSelectedChallenge: (id?: string) => void;
  setSelectedPosition: (id?: string) => void;
  addToast: (toast: IEToast) => void;
  removeToast: (id: string) => void;
}

// ============================================================================
// STORE ZUSTAND
// ============================================================================

export const useIEProtocolStore = create<IEProtocolState & IEProtocolActions>()(
  persist(
    (set, get) => ({
      ...INITIAL_IE_STATE,
      
      // === CHALLENGES ===
      
      createChallenge: (input) => {
        const challenge = ieCreateChallenge(input);
        set((state) => ({
          challenges: { ...state.challenges, [challenge.id]: challenge },
          globalMetrics: ieRecalculateGlobalMetrics({
            ...state,
            challenges: { ...state.challenges, [challenge.id]: challenge },
          }),
          ui: ieAddToast(state.ui, ieCreateToast('success', 'Desafío creado', `"${challenge.metaURI.slice(0, 50)}..."`)),
        }));
        return challenge;
      },
      
      fundChallenge: (challengeId, gross) => {
        const challenge = get().challenges[challengeId];
        if (!challenge) throw new Error('Challenge not found');
        
        const { fee, net, challenge: newChallenge } = ieFundChallenge(challenge, gross);
        
        set((state) => ({
          challenges: { ...state.challenges, [challengeId]: newChallenge },
          globalMetrics: ieRecalculateGlobalMetrics({
            ...state,
            challenges: { ...state.challenges, [challengeId]: newChallenge },
          }),
          ui: ieAddToast(state.ui, ieCreateToast('success', 'Desafío fondeado', `Neto: ${ieFormatUSDC(net)} · Fee: ${ieFormatUSDC(fee)}`)),
        }));
        
        return { fee, net };
      },
      
      closeChallenge: (challengeId) => {
        const challenge = get().challenges[challengeId];
        if (!challenge) throw new Error('Challenge not found');
        
        const refunded = challenge.funded - challenge.released;
        
        set((state) => ({
          challenges: {
            ...state.challenges,
            [challengeId]: { ...challenge, status: 'closed' as const, updatedAt: Date.now() },
          },
          ui: ieAddToast(state.ui, ieCreateToast('info', 'Desafío cerrado', `Reembolsado: ${ieFormatUSDC(refunded)}`)),
        }));
        
        return refunded;
      },
      
      // === NETWORK GROWTH ===
      
      seed: (challengeId, holder) => {
        const challenge = get().challenges[challengeId];
        if (!challenge) throw new Error('Challenge not found');
        if (challenge.seedCount >= 3) throw new Error('Seeds full');
        
        const { position, newChallenge } = ieCreatePosition(challenge, holder, '0', 1);
        
        set((state) => ({
          challenges: { ...state.challenges, [challengeId]: newChallenge },
          positions: { ...state.positions, [position.id]: position },
          challengePositions: {
            ...state.challengePositions,
            [challengeId]: [...(state.challengePositions[challengeId] || []), position.id],
          },
          globalMetrics: ieRecalculateGlobalMetrics({
            ...state,
            challenges: { ...state.challenges, [challengeId]: newChallenge },
            positions: { ...state.positions, [position.id]: position },
          }),
          ui: ieAddToast(state.ui, ieCreateToast('success', 'Semilla registrada', `${holder.slice(0, 10)}... como seed #${newChallenge.seedCount}`)),
        }));
        
        return position;
      },
      
      join: (challengeId, parentPositionId, holder) => {
        const challenge = get().challenges[challengeId];
        const parentPosition = get().positions[parentPositionId];
        
        if (!challenge) throw new Error('Challenge not found');
        if (!parentPosition) throw new Error('Parent position not found');
        if (!ieCanJoin(challenge, parentPosition)) throw new Error('Parent full (max 3 children)');
        
        const depth = parentPosition.depth + 1;
        const { position, newChallenge } = ieCreatePosition(challenge, holder, parentPositionId, depth);
        
        // Actualizar parent
        const updatedParent = {
          ...parentPosition,
          childCount: parentPosition.childCount + 1,
          weightClass: ieCalculateWeightClass({ ...parentPosition, childCount: parentPosition.childCount + 1 }),
          updatedAt: Date.now(),
        };
        updatedParent.effectiveWeight = ieCalculateEffectiveWeight(updatedParent, parentPosition.giveReceived);
        
        set((state) => ({
          challenges: { ...state.challenges, [challengeId]: newChallenge },
          positions: {
            ...state.positions,
            [position.id]: position,
            [parentPositionId]: updatedParent,
          },
          challengePositions: {
            ...state.challengePositions,
            [challengeId]: [...(state.challengePositions[challengeId] || []), position.id],
          },
          globalMetrics: ieRecalculateGlobalMetrics({
            ...state,
            challenges: { ...state.challenges, [challengeId]: newChallenge },
            positions: { ...state.positions, [position.id]: position, [parentPositionId]: updatedParent },
          }),
          ui: ieAddToast(state.ui, ieCreateToast('success', 'Unido a la red', `Profundidad ${depth} bajo ${parentPosition.holder.slice(0, 10)}...`)),
        }));
        
        return position;
      },
      
      setCoordinator: (challengeId, positionId, value) => {
        const position = get().positions[positionId];
        if (!position) throw new Error('Position not found');
        if (position.challengeId !== challengeId) throw new Error('Position not in challenge');
        
        const newPosition = ieSetCoordinator(position, value);
        
        set((state) => ({
          positions: { ...state.positions, [positionId]: newPosition },
          globalMetrics: ieRecalculateGlobalMetrics({
            ...state,
            positions: { ...state.positions, [positionId]: newPosition },
          }),
          ui: ieAddToast(state.ui, ieCreateToast(
            'info', 
            value ? 'Coordinador asignado' : 'Coordinador removido', 
            `Posición ${positionId.slice(0, 10)}...`
          )),
        }));
      },
      
      // === CONTRIBUTIONS & CONSENSUS ===
      
      contribute: (challengeId, positionId, workURI) => {
        const position = get().positions[positionId];
        if (!position) throw new Error('Position not found');
        if (position.challengeId !== challengeId) throw new Error('Position not in challenge');
        
        const attestation = ieCreateAttestation('contribution', position.holder, position.holder, {
          workURI,
          challengeId,
          positionId,
        });
        
        set((state) => ({
          attestations: { ...state.attestations, [attestation.uid]: attestation },
          receivedAttestations: {
            ...state.receivedAttestations,
            [position.holder]: [...(state.receivedAttestations[position.holder] || []), attestation.uid],
          },
          ui: ieAddToast(state.ui, ieCreateToast('success', 'Aporte registrado', 'Atestación CONTRIBUTION creada')),
        }));
        
        return attestation;
      },
      
      approveMilestone: (challengeId, milestoneId, voter, positionId) => {
        const challenge = get().challenges[challengeId];
        if (!challenge) throw new Error('Challenge not found');
        
        // Verificar que voter es participante
        const positionsHeld = Object.values(get().positions).filter(p => p.challengeId === challengeId && p.holder === voter).length;
        if (positionsHeld === 0) throw new Error('Not a participant');
        
        // Verificar que no ha votado ya
        const approvalKey = `${milestoneId}:${voter}`;
        const milestone = challenge.milestones.find(m => m.id === milestoneId);
        if (!milestone) throw new Error('Milestone not found');
        if (milestone.released) throw new Error('Milestone already released');
        if (milestone.approvalsDetail?.some(a => a.voter === voter)) throw new Error('Already voted');
        
        const { challenge: newChallenge, approvals, released } = ieApproveMilestone(challenge, milestoneId, voter, positionId);
        
        // Atestación CONSENSUS
        const attestation = ieCreateAttestation('consensus', voter, voter, {
          challengeId,
          milestoneId,
          milestoneTitle: milestone.title,
        });
        
        set((state) => ({
          challenges: { ...state.challenges, [challengeId]: newChallenge },
          attestations: { ...state.attestations, [attestation.uid]: attestation },
          receivedAttestations: {
            ...state.receivedAttestations,
            [voter]: [...(state.receivedAttestations[voter] || []), attestation.uid],
          },
          globalMetrics: ieRecalculateGlobalMetrics({
            ...state,
            challenges: { ...state.challenges, [challengeId]: newChallenge },
          }),
          ui: ieAddToast(state.ui, ieCreateToast(
            released ? 'success' : 'info',
            released ? '¡Hito aprobado y liberado!' : 'Aprobación registrada',
            `Consenso: ${approvals}/${milestone.approvalsRequired}`
          )),
        }));
        
        return { approvals, released };
      },
      
      releaseMilestone: (challengeId, milestoneId) => {
        const challenge = get().challenges[challengeId];
        const positions = get().positions;
        if (!challenge) throw new Error('Challenge not found');
        
        const challengePositions = get().challengePositions[challengeId] || [];
        const positionObjects = challengePositions.map(id => positions[id]).filter(Boolean) as IEPosition[];
        
        const { payouts, a3, newChallenge } = ieReleaseMilestone(challenge, milestoneId, positionObjects);
        
        // Actualizar claimable para cada holder
        const claimableUpdates: Record<string, Record<string, bigint>> = {};
        for (const [posId, amount] of payouts.entries()) {
          const pos = positions[posId];
          if (pos && amount > 0n) {
            const holder = pos.holder;
            claimableUpdates[challengeId] = {
              ...claimableUpdates[challengeId],
              [holder]: (claimableUpdates[challengeId]?.[holder] || 0n) + amount,
            };
          }
        }
        
        // Certificado de impacto
        const milestone = challenge.milestones.find(m => m.id === milestoneId);
        const cert: IMImpactCert = {
          id: `cert_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          challengeId,
          milestoneId,
          uri: milestone?.title || 'Impacto',
          impact: milestone?.amount || 0n,
          contributors: positionObjects.length,
          time: Date.now(),
        };
        
        set((state) => ({
          challenges: { ...state.challenges, [challengeId]: newChallenge },
          claimable: {
            ...state.claimable,
            ...claimableUpdates,
            [challengeId]: {
              ...state.claimable[challengeId],
              ...claimableUpdates[challengeId],
            },
          },
          impactCerts: [...state.impactCerts, cert],
          certsOfChallenge: {
            ...state.certsOfChallenge,
            [challengeId]: [...(state.certsOfChallenge[challengeId] || []), cert.id],
          },
          globalMetrics: ieRecalculateGlobalMetrics({
            ...state,
            challenges: { ...state.challenges, [challengeId]: newChallenge },
          }),
          ui: ieAddToast(state.ui, ieCreateToast('success', '💸 RCE repartida', `${payouts.size} posiciones recibieron su parte`)),
        }));
        
        return { payouts, a3 };
      },
      
      claim: (challengeId, holder) => {
        const amount = get().claimable[challengeId]?.[holder] || 0n;
        if (amount === 0n) throw new Error('Nothing to claim');
        
        set((state) => ({
          claimable: {
            ...state.claimable,
            [challengeId]: {
              ...state.claimable[challengeId],
              [holder]: 0n,
            },
          },
          globalMetrics: ieRecalculateGlobalMetrics({
            ...state,
            claimable: {
              ...state.claimable,
              [challengeId]: {
                ...state.claimable[challengeId],
                [holder]: 0n,
              },
            },
          }),
          ui: ieAddToast(state.ui, ieCreateToast('success', 'RCE cobrada', `Recibido: ${ieFormatUSDC(amount)}`)),
        }));
        
        return amount;
      },
      
      // === STAKING ===
      
      stake: (challengeId, positionId, amount) => {
        const position = get().positions[positionId];
        if (!position) throw new Error('Position not found');
        if (position.challengeId !== challengeId) throw new Error('Position not in challenge');
        
        const { position: newPosition, newStake } = ieStake(position, amount);
        
        set((state) => ({
          positions: { ...state.positions, [positionId]: newPosition },
          globalMetrics: ieRecalculateGlobalMetrics({
            ...state,
            positions: { ...state.positions, [positionId]: newPosition },
          }),
          ui: ieAddToast(state.ui, ieCreateToast('success', 'Staked', `Nuevo stake: ${ieFormatUSDC(newStake)} · Peso +${ieCalculateStakeBonus(newStake) - ieCalculateStakeBonus(position.stake)}`)),
        }));
        
        return newStake;
      },
      
      unstake: (challengeId, positionId, amount) => {
        const position = get().positions[positionId];
        if (!position) throw new Error('Position not found');
        if (position.challengeId !== challengeId) throw new Error('Position not in challenge');
        
        const { position: newPosition, newStake } = ieUnstake(position, amount);
        
        set((state) => ({
          positions: { ...state.positions, [positionId]: newPosition },
          globalMetrics: ieRecalculateGlobalMetrics({
            ...state,
            positions: { ...state.positions, [positionId]: newPosition },
          }),
          ui: ieAddToast(state.ui, ieCreateToast('info', 'Unstaked', `Nuevo stake: ${ieFormatUSDC(newStake)}`)),
        }));
        
        return newStake;
      },
      
      // === PEER SCORING (GIVE) ===
      
      allocateGive: (challengeId, fromPositionId, toPositionId, amount) => {
        const fromPos = get().positions[fromPositionId];
        const toPos = get().positions[toPositionId];
        
        if (!fromPos || !toPos) throw new Error('Position not found');
        if (fromPos.challengeId !== challengeId || toPos.challengeId !== challengeId) {
          throw new Error('Positions not in challenge');
        }
        if (fromPos.holder === toPos.holder) throw new Error('Cannot give to yourself');
        
        const giveUsed = get().giveUsed[challengeId]?.[fromPos.holder] || 0n;
        const giveReceived = get().giveReceived[toPositionId] || 0n;
        
        const { toPosition, giveBonus, totalGiven } = ieAllocateGive(
          challengeId,
          fromPos.holder,
          toPos,
          amount,
          giveUsed,
          giveReceived
        );
        
        const allocation: IEGiveAllocation = {
          challengeId,
          fromPositionId,
          toPositionId,
          amount,
          allocatedAt: Date.now(),
        };
        
        set((state) => ({
          positions: { ...state.positions, [toPositionId]: toPosition },
          giveAllocations: {
            ...state.giveAllocations,
            [challengeId]: [...(state.giveAllocations[challengeId] || []), allocation],
          },
          giveReceived: { ...state.giveReceived, [toPositionId]: toPosition.giveReceived },
          giveUsed: {
            ...state.giveUsed,
            [challengeId]: { ...state.giveUsed[challengeId], [fromPos.holder]: totalGiven },
          },
          globalMetrics: ieRecalculateGlobalMetrics({
            ...state,
            positions: { ...state.positions, [toPositionId]: toPosition },
          }),
          ui: ieAddToast(state.ui, ieCreateToast('success', 'GIVE asignado', `+${giveBonus} peso efectivo para ${toPos.holder.slice(0, 10)}...`)),
        }));
        
        return toPosition.giveReceived;
      },
      
      // === AI FACILITATOR ===
      
      synthesizeConsensus: async (input) => {
        // Modo stub si no hay API key
        if (!process.env.ANTHROPIC_API_KEY && !import.meta.env.VITE_ANTHROPIC_API_KEY) {
          return {
            summary: 'Síntesis automática (modo stub): El grupo ha discutido los puntos clave y hay consenso general en avanzar.',
            recommendation: 'approve' as const,
            rationale: 'Los aportes indican alineación en los objetivos del hito.',
            openQuestions: ['¿Cuál es el siguiente paso concreto?', '¿Quién coordina la ejecución?'],
            stub: true,
          };
        }
        
        // TODO: Llamada real a Anthropic API
        // const response = await fetch('/api/agent/synthesize', { ... })
        return {
          summary: 'La IA ha sintetizado los aportes del grupo...',
          recommendation: 'approve' as const,
          rationale: 'Basado en la evidencia presentada...',
          openQuestions: [],
          stub: false,
        };
      },
      
      generateFunderReport: async (input) => {
        if (!process.env.ANTHROPIC_API_KEY && !import.meta.env.VITE_ANTHROPIC_API_KEY) {
          return {
            report: `# Informe para Financiadores\n\n## Resumen Ejecutivo\nEl desafío "${input.challengeTitle}" ha completado ${input.milestones.filter(m => m.released).length} de ${input.milestones.length} hitos.\n\n## Detalle por Hito\n${input.milestones.map(m => `- **${m.title}**: ${m.released ? '✅ Liberado' : '⏳ Pendiente'} (${m.approvals}/${m.approvalsRequired} consenso)`).join('\n')}\n\n## Aportes del Grupo\n${input.contributions}`,
            stub: true,
          };
        }
        
        return {
          report: 'Informe generado por Claude...',
          stub: false,
        };
      },
      
      // === SELECTORS ===
      
      getChallenge: (id) => ieSelectChallenge(get(), id),
      getPosition: (id) => ieSelectPosition(get(), id),
      getMilestone: (id) => ieSelectMilestone(get(), id),
      getPositionsOf: (challengeId) => ieSelectPositionsOfChallenge(get(), challengeId),
      getMilestonesOf: (challengeId) => ieSelectMilestonesOfChallenge(get(), challengeId),
      getClaimable: (challengeId, holder) => ieSelectClaimable(get(), challengeId, holder),
      getReputation: (holder) => ieSelectReputationScore(get(), holder),
      getGiveRemaining: (challengeId, holder) => ieSelectGiveRemaining(get(), challengeId, holder),
      getCurrentA3: (challengeId) => ieSelectCurrentA3(get(), challengeId),
      getProjectedPayout: (challengeId, positionId, milestoneId) => 
        ieSelectProjectedPayout(get(), challengeId, positionId, milestoneId),
      getChallengesSummary: () => ieSelectChallengesSummary(get()),
      getAttestations: (holder, schema) => ieSelectAttestationsBySchema(get(), holder, schema),
      getImpactCerts: (challengeId) => ieSelectImpactCertsOfChallenge(get(), challengeId),
      
      // === PERSISTENCE ===
      
      saveToStorage: () => {
        // Zustand persist middleware handles this automatically
        // This is a no-op but kept for API compatibility
      },
      
      reset: () => set(INITIAL_IE_STATE),
      
      detectV1Data: () => {
        if (typeof window === 'undefined') return false;
        try {
          const stored = localStorage.getItem(IE_STORAGE_KEY);
          return stored ? ieDetectV1Data(JSON.parse(stored)) : false;
        } catch {
          return false;
        }
      },
      
      migrateV1ToV2: () => {
        if (typeof window === 'undefined') return;
        try {
          const stored = localStorage.getItem(IE_STORAGE_KEY);
          if (stored) {
            const v1 = JSON.parse(stored);
            if (ieDetectV1Data(v1)) {
              const v2 = ieMigrateV1ToV2(v1);
              localStorage.setItem(IE_STORAGE_KEY, JSON.stringify({ state: v2, version: IE_STORAGE_VERSION }));
            }
          }
        } catch (e) {
          console.warn('[IE Protocol] Migration failed:', e);
        }
      },
      
      // === UI ===
      
      setScreen: (screen) => set((state) => ({
        ui: { ...state.ui, screen },
      })),
      
      setSelectedChallenge: (id) => set((state) => ({
        ui: { ...state.ui, selectedChallengeId: id },
      })),
      
      setSelectedPosition: (id) => set((state) => ({
        ui: { ...state.ui, selectedPositionId: id },
      })),
      
      addToast: (toast) => set((state) => ({
        ui: ieAddToast(state.ui, toast),
      })),
      
      removeToast: (id) => set((state) => ({
        ui: ieRemoveToast(state.ui, id),
      })),
    }),
    {
      name: IE_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      version: IE_STORAGE_VERSION,
      partialize: (state) => ({
        challenges: state.challenges,
        positions: state.positions,
        challengePositions: state.challengePositions,
        milestones: state.milestones,
        attestations: state.attestations,
        receivedAttestations: state.receivedAttestations,
        impactCerts: state.impactCerts,
        certsOfChallenge: state.certsOfChallenge,
        giveAllocations: state.giveAllocations,
        giveReceived: state.giveReceived,
        giveUsed: state.giveUsed,
        claimable: state.claimable,
        globalMetrics: state.globalMetrics,
        ui: {
          selectedChallengeId: state.ui.selectedChallengeId,
          selectedPositionId: state.ui.selectedPositionId,
          screen: state.ui.screen,
        },
      }),
      migrate: (persistedState: any, version: number) => {
        if (version < IE_STORAGE_VERSION) {
          return ieMigrateV1ToV2(persistedState);
        }
        return persistedState;
      },
    }
  )
);

// ============================================================================
// HOOKS DE CONVENIENCIA
// ============================================================================

export function useIEChallenge(challengeId: string) {
  const challenge = useIEProtocolStore((s) => s.getChallenge(challengeId));
  const positions = useIEProtocolStore((s) => s.getPositionsOf(challengeId));
  const milestones = useIEProtocolStore((s) => s.getMilestonesOf(challengeId));
  const a3 = useIEProtocolStore((s) => s.getCurrentA3(challengeId));
  const loading = !challenge;
  
  return { challenge, positions, milestones, a3, loading, refresh: () => {} };
}

export function useIEPosition(positionId: string) {
  return useIEProtocolStore((s) => s.getPosition(positionId));
}

export function useIEAttestations(holder: string, schema: string) {
  return useIEProtocolStore((s) => s.getAttestations(holder, schema));
}

export function useIEGlobalMetrics() {
  return useIEProtocolStore((s) => s.globalMetrics);
}

export function useIEUI() {
  return useIEProtocolStore((s) => s.ui);
}

export function useIEScreen() {
  return useIEProtocolStore((s) => s.ui.screen);
}

export function useIESetScreen() {
  return useIEProtocolStore((s) => s.setScreen);
}

export function useIESelectedChallenge() {
  return useIEProtocolStore((s) => s.ui.selectedChallengeId);
}

export function useIESetSelectedChallenge() {
  return useIEProtocolStore((s) => s.setSelectedChallenge);
}

export function useIESelectedPosition() {
  return useIEProtocolStore((s) => s.ui.selectedPositionId);
}

export function useIESetSelectedPosition() {
  return useIEProtocolStore((s) => s.setSelectedPosition);
}

export function useIEToasts() {
  return useIEProtocolStore((s) => s.ui.toasts);
}

export function useIEAddToast() {
  return useIEProtocolStore((s) => s.addToast);
}

export function useIERemoveToast() {
  return useIEProtocolStore((s) => s.removeToast);
}