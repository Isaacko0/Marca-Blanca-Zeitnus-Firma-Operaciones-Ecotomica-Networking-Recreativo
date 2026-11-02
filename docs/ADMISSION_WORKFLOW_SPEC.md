# Spec: Workflow Admisión 3 Fases + Filtros Cualitativos (Art 14, 14A)

**Fuente**: Reglamento Fedeco - Título V: Proceso de Admisión y Salida
**Prioridad**: P0 (Crítico - puerta de entrada a la comunidad)
**Archivos Zeitnus**: `src/core/lib/admissionWorkflow.ts`, `src/app/screens/Admision.tsx`, `src/core/state/admission.ts`

---

## 1. Modelo de Datos

```typescript
// src/core/state/admission.ts

type AdmissionPhase = 'aspirante' | 'provisional' | 'pleno';

interface AdmissionPhaseConfig {
  phase: AdmissionPhase;
  minDurationDays: number;
  maxDurationDays: number;
  requirements: string[];
  evaluationCriteria: EvaluationCriteria;
  mentorRequired: boolean;
  voteRequired: boolean;
  voteThreshold: number; // 0.51 para regular, 0.85 para estructural
}

interface EvaluationCriteria {
  laborPerformance: number;      // cayapas cumplidas / esperadas (0-1)
  communityAdaptation: number;   // CNV, convivencia, asambleas (0-1)
  learningLevel: number;         // agroecología, bioconstrucción, TQ, energía (0-1)
  qualitativeFilter: boolean;    // Art 14A: antidoping si "Libre de Sustancias"
  signedSocialDNA: boolean;      // firma ADN Social (Ley III HSCSG)
}

interface AdmissionCandidate {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  currentPhase: AdmissionPhase;
  entryDate: number;              // timestamp ingreso fase aspirante
  phaseStartDate: number;         // timestamp inicio fase actual
  sponsorId: string;              // miembro que avala (Art 14.1)
  mentorId?: string;              // asignado en fase provisional (Art 14.2)
  phaseHistory: PhaseRecord[];
  toxicologyTest?: ToxicologyTest; // Art 14A
  evaluationScores: EvaluationScores;
  status: 'active' | 'paused' | 'rejected' | 'approved' | 'withdrawn';
  notes: string;
}

interface PhaseRecord {
  phase: AdmissionPhase;
  startDate: number;
  endDate?: number;
  evaluation?: EvaluationScores;
  mentorNotes?: string;
  assemblyVote?: AssemblyVoteResult;
}

interface EvaluationScores {
  laborPerformance: number;
  communityAdaptation: number;
  learningLevel: number;
  qualitativeFilter: boolean;
  overall: number;                // promedio ponderado
  evaluatedBy: string[];
  evaluatedAt: number;
}

interface ToxicologyTest {
  passed: boolean;
  date: number;
  lab: string;
  certificateHash: string;        // hash IPFS/Arweave del certificado
}

interface AssemblyVoteResult {
  proposalId: string;
  phase: AdmissionPhase;
  votesFor: number;
  votesAgainst: number;
  votesAbstain: number;
  threshold: number;
  approved: boolean;
  votedAt: number;
}
```

---

## 2. Configuración de Fases (Parametrizable por Asamblea)

```typescript
// src/core/lib/admissionConfig.ts

export const ADMISSION_PHASES: Record<AdmissionPhase, AdmissionPhaseConfig> = {
  aspirante: {
    phase: 'aspirante',
    minDurationDays: 7,           // "duración definida por la Asamblea"
    maxDurationDays: 30,
    requirements: [
      'Estancia temporal voluntaria',
      'Conocimiento mutuo',
      'Adaptación al trabajo de campo',
      'Asimilación del reglamento',
      'Familiarización con sistema TQ',
      'Firma ADN Social (Ley III)'
    ],
    evaluationCriteria: {
      laborPerformance: 0.3,
      communityAdaptation: 0.3,
      learningLevel: 0.2,
      qualitativeFilter: false,   // se evalúa al pasar a provisional
      signedSocialDNA: true       // obligatorio para avanzar
    },
    mentorRequired: false,
    voteRequired: false,          // no hay voto, solo evaluación dept acogida
    voteThreshold: 0
  },
  provisional: {
    phase: 'provisional',
    minDurationDays: 180,         // "típicamente 6-12 meses"
    maxDurationDays: 365,
    requirements: [
      'Incorporación a cayapas obligatorias',
      'Límite simétrico inicial parametrizado',
      'Participación con voz (sin voto estructural)',
      'Persona de acompañamiento/mentoría asignada',
      'Evaluación formal rendimiento laboral',
      'Adaptación comunitaria',
      'Nivel aprendizaje (mentor + dept respectivo)'
    ],
    evaluationCriteria: {
      laborPerformance: 0.35,
      communityAdaptation: 0.25,
      learningLevel: 0.25,
      qualitativeFilter: true,    // Art 14A: filtro cualitativo local
      signedSocialDNA: true
    },
    mentorRequired: true,
    voteRequired: false,          // informe favorable depts → voto final
    voteThreshold: 0
  },
  pleno: {
    phase: 'pleno',
    minDurationDays: 0,           // inmediato tras aprobación
    maxDurationDays: 0,
    requirements: [
      'Periodo prueba culminado',
      'Informe favorable depts convivencia y trabajo',
      'Votación digital asamblea general',
      'Supermayoría según estatutos'
    ],
    evaluationCriteria: {
      laborPerformance: 0,
      communityAdaptation: 0,
      learningLevel: 0,
      qualitativeFilter: true,
      signedSocialDNA: true
    },
    mentorRequired: false,
    voteRequired: true,           // Art 14.3: votación digital
    voteThreshold: 0.75           // mayoría calificada estatutaria
  }
};
```

---

## 3. Lógica de Negocio (AdmissionWorkflow)

```typescript
// src/core/lib/admissionWorkflow.ts

import { ADMISSION_PHASES } from './admissionConfig';
import type { AdmissionCandidate, AdmissionPhase, EvaluationScores, AssemblyVoteResult } from '@core/state/admission';

export class AdmissionWorkflow {
  private candidates: Map<string, AdmissionCandidate> = new Map();
  private members: Map<string, Member> = new Map(); // referencia a store

  // === FASE 1: ASPIRANTE ===
  
  async registerAspirant(data: {
    name: string;
    sponsorId: string;
    email?: string;
    phone?: string;
  }): Promise<AdmissionCandidate> {
    const sponsor = this.members.get(data.sponsorId);
    if (!sponsor) throw new Error('Patrocinador no encontrado');
    if (!sponsor.signedSocialDNA) throw new Error('Patrocinador debe tener ADN Social firmado');

    const candidate: AdmissionCandidate = {
      id: `cand_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      currentPhase: 'aspirante',
      entryDate: Date.now(),
      phaseStartDate: Date.now(),
      sponsorId: data.sponsorId,
      phaseHistory: [{
        phase: 'aspirante',
        startDate: Date.now()
      }],
      evaluationScores: this.emptyScores(),
      status: 'active',
      notes: ''
    };

    this.candidates.set(candidate.id, candidate);
    return candidate;
  }

  // Evaluación continua durante fase aspirante
  async evaluateAspirant(candidateId: string, evaluatorId: string, scores: Partial<EvaluationScores>): Promise<void> {
    const candidate = this.candidates.get(candidateId);
    if (!candidate || candidate.currentPhase !== 'aspirante') throw new Error('Candidato no válido');

    // Actualizar scores
    candidate.evaluationScores = { ...candidate.evaluationScores, ...scores };
    candidate.evaluationScores.evaluatedBy = [...new Set([...candidate.evaluationScores.evaluatedBy, evaluatorId])];
    candidate.evaluationScores.evaluatedAt = Date.now();
    candidate.evaluationScores.overall = this.calculateOverall(candidate.evaluationScores, 'aspirante');

    // Verificar si cumple para avanzar
    const config = ADMISSION_PHASES.aspirante;
    const daysInPhase = (Date.now() - candidate.phaseStartDate) / (1000 * 60 * 60 * 24);
    
    if (daysInPhase >= config.minDurationDays && candidate.evaluationScores.signedSocialDNA) {
      await this.advanceToProvisional(candidateId);
    }
  }

  // === FASE 2: PROVISIONAL ===
  
  private async advanceToProvisional(candidateId: string): Promise<void> {
    const candidate = this.candidates.get(candidateId);
    if (!candidate) throw new Error('Candidato no encontrado');

    // Asignar mentor (dept acogida)
    const mentorId = await this.assignMentor(candidateId);
    
    candidate.currentPhase = 'provisional';
    candidate.phaseStartDate = Date.now();
    candidate.mentorId = mentorId;
    candidate.phaseHistory.push({
      phase: 'provisional',
      startDate: Date.now(),
      evaluation: { ...candidate.evaluationScores }
    });

    // Crear cuenta TQ con límite simétrico inicial (Art 14.2 + Art 16)
    await this.createInitialTQAccount(candidateId);
  }

  async assignMentor(candidateId: string): Promise<string> {
    // Buscar mentor disponible (ecoaldeano pleno con experiencia)
    const mentors = Array.from(this.members.values())
      .filter(m => m.role !== 'generalista' && m.signedSocialDNA && m.committedMonths >= 12);
    
    if (mentors.length === 0) throw new Error('No hay mentores disponibles');
    
    // Asignar por carga de trabajo (menor cantidad de mentorados)
    return mentors.reduce((min, m) => 
      this.countMentees(m.id) < this.countMentees(min.id) ? m : min
    ).id;
  }

  async createInitialTQAccount(candidateId: string): Promise<void> {
    // Art 16: límite simétrico inicial parametrizado por asamblea
    // Típicamente ±100 TQ para aspirante/provisional inicial
    const initialLimit = 100; // configurable via assembly
    
    // Integrar con store.ts → caas.ts → symmetricLimits.ts
    // store.addCaasMember({ candidateId, tier: 'provisional', limit: initialLimit })
  }

  // Evaluación mensual durante fase provisional
  async monthlyEvaluation(candidateId: string, evaluatorId: string, scores: Partial<EvaluationScores>): Promise<void> {
    const candidate = this.candidates.get(candidateId);
    if (!candidate || candidate.currentPhase !== 'provisional') throw new Error('Candidato no en fase provisional');

    candidate.evaluationScores = { ...candidate.evaluationScores, ...scores };
    candidate.evaluationScores.evaluatedBy = [...new Set([...candidate.evaluationScores.evaluatedBy, evaluatorId])];
    candidate.evaluationScores.evaluatedAt = Date.now();
    candidate.evaluationScores.overall = this.calculateOverall(candidate.evaluationScores, 'provisional');

    // Verificar filtro cualitativo (Art 14A)
    if (candidate.evaluationScores.qualitativeFilter === undefined) {
      await this.runQualitativeFilter(candidateId);
    }
  }

  // Art 14A: Filtros de Admisión Cualitativa
  async runQualitativeFilter(candidateId: string): Promise<void> {
    const candidate = this.candidates.get(candidateId);
    if (!candidate) throw new Error('Candidato no encontrado');

    // Verificar perfil ecoaldea local: "Libre de Sustancias" vs "Tolerancia Regulada"
    const nodeProfile = await this.getNodeQualitativeProfile(); // 'libre_sustancias' | 'tolerancia_regulada'
    
    if (nodeProfile === 'libre_sustancias') {
      // "Exigen exámenes toxicológicos (antidoping) con resultados negativos como requisito excluyente"
      if (!candidate.toxicologyTest || !candidate.toxicologyTest.passed) {
        candidate.evaluationScores.qualitativeFilter = false;
        candidate.status = 'rejected';
        candidate.notes = 'No cumple filtro cualitativo: ecoaldea Libre de Sustancias requiere antidoping negativo';
        return;
      }
    }
    
    candidate.evaluationScores.qualitativeFilter = true;
  }

  async submitToxicologyTest(candidateId: string, test: ToxicologyTest): Promise<void> {
    const candidate = this.candidates.get(candidateId);
    if (!candidate) throw new Error('Candidato no encontrado');
    candidate.toxicologyTest = test;
  }

  // === FASE 3: PLENO ===
  
  async requestFullMembershipVote(candidateId: string): Promise<string> {
    const candidate = this.candidates.get(candidateId);
    if (!candidate || candidate.currentPhase !== 'provisional') throw new Error('Candidato no elegible');

    const config = ADMISSION_PHASES.provisional;
    const daysInPhase = (Date.now() - candidate.phaseStartDate) / (1000 * 60 * 60 * 24);
    
    if (daysInPhase < config.minDurationDays) {
      throw new Error(`Mínimo ${config.minDurationDays} días en fase provisional requeridos`);
    }

    // Verificar informe favorable depts convivencia y trabajo
    const convivenciaReport = await this.getDeptReport('convivencia_mediacion', candidateId);
    const trabajoReport = await this.getDeptReport('agroecologia', candidateId); // o dept correspondiente
    
    if (!convivenciaReport.favorable || !trabajoReport.favorable) {
      throw new Error('Informes de departamentes no favorables');
    }

    // Crear propuesta de votación en módulo digital (Art 5, 14.3)
    const proposalId = await this.createAssemblyProposal({
      type: 'admission_full_membership',
      candidateId,
      candidateName: candidate.name,
      phaseHistory: candidate.phaseHistory,
      evaluationScores: candidate.evaluationScores,
      threshold: ADMISSION_PHASES.pleno.voteThreshold
    });

    return proposalId;
  }

  async processAssemblyVote(proposalId: string, vote: AssemblyVoteResult): Promise<void> {
    const candidate = Array.from(this.candidates.values())
      .find(c => c.phaseHistory.some(h => h.assemblyVote?.proposalId === proposalId));
    
    if (!candidate) throw new Error('Candidato no encontrado para propuesta');

    candidate.phaseHistory[candidate.phaseHistory.length - 1].assemblyVote = vote;

    if (vote.approved) {
      await this.grantFullMembership(candidate.id);
    } else {
      candidate.status = 'rejected';
      candidate.notes = 'No aprobado por Asamblea General';
    }
  }

  private async grantFullMembership(candidateId: string): Promise<void> {
    const candidate = this.candidates.get(candidateId);
    if (!candidate) throw new Error('Candidato no encontrado');

    candidate.currentPhase = 'pleno';
    candidate.phaseStartDate = Date.now();
    candidate.status = 'approved';
    candidate.phaseHistory.push({
      phase: 'pleno',
      startDate: Date.now(),
      assemblyVote: candidate.phaseHistory[candidate.phaseHistory.length - 1].assemblyVote
    });

    // Actualizar cuenta TQ a límites miembro pleno (Art 16.3)
    await this.upgradeTQLimits(candidateId, 'pleno');

    // Crear miembro en store
    await this.createMemberRecord(candidate);
  }

  // === UTILIDADES ===
  
  private calculateOverall(scores: EvaluationScores, phase: AdmissionPhase): number {
    const config = ADMISSION_PHASES[phase];
    const weights = config.evaluationCriteria;
    let sum = 0;
    let totalWeight = 0;
    
    if (weights.laborPerformance > 0) { sum += scores.laborPerformance * weights.laborPerformance; totalWeight += weights.laborPerformance; }
    if (weights.communityAdaptation > 0) { sum += scores.communityAdaptation * weights.communityAdaptation; totalWeight += weights.communityAdaptation; }
    if (weights.learningLevel > 0) { sum += scores.learningLevel * weights.learningLevel; totalWeight += weights.learningLevel; }
    
    return totalWeight > 0 ? sum / totalWeight : 0;
  }

  private emptyScores(): EvaluationScores {
    return {
      laborPerformance: 0,
      communityAdaptation: 0,
      learningLevel: 0,
      qualitativeFilter: false,
      overall: 0,
      evaluatedBy: [],
      evaluatedAt: 0
    };
  }

  private countMentees(mentorId: string): number {
    return Array.from(this.candidates.values()).filter(c => c.mentorId === mentorId).length;
  }

  // Stubs para integración con store/modules
  private async getNodeQualitativeProfile(): Promise<'libre_sustancias' | 'tolerancia_regulada'> { return 'libre_sustancias'; }
  private async getDeptReport(dept: string, candidateId: string): Promise<{favorable: boolean}> { return {favorable: true}; }
  private async createAssemblyProposal(data: any): Promise<string> { return `prop_${Date.now()}`; }
  private async upgradeTQLimits(candidateId: string, tier: string): Promise<void> {}
  private async createMemberRecord(candidate: AdmissionCandidate): Promise<void> {}
}
```

---

## 4. Integración con Store (Zustand)

```typescript
// En store.ts - agregar slice admission

interface AdmissionState {
  candidates: AdmissionCandidate[];
  workflow: AdmissionWorkflow;
  
  // Acciones
  registerAspirant: (data: {name: string; sponsorId: string; email?: string; phone?: string}) => Promise<AdmissionCandidate>;
  evaluateAspirant: (candidateId: string, scores: Partial<EvaluationScores>) => Promise<void>;
  monthlyEvaluation: (candidateId: string, scores: Partial<EvaluationScores>) => Promise<void>;
  submitToxicologyTest: (candidateId: string, test: ToxicologyTest) => Promise<void>;
  requestFullMembershipVote: (candidateId: string) => Promise<string>;
  processAssemblyVote: (proposalId: string, vote: AssemblyVoteResult) => Promise<void>;
  getCandidate: (id: string) => AdmissionCandidate | undefined;
  getCandidatesByPhase: (phase: AdmissionPhase) => AdmissionCandidate[];
  getCandidatesByMentor: (mentorId: string) => AdmissionCandidate[];
}
```

---

## 5. Pantalla Admision.tsx

```tsx
// src/app/screens/Admision.tsx

export function AdmisionScreen() {
  const { 
    candidates, 
    registerAspirant, 
    evaluateAspirant, 
    monthlyEvaluation,
    submitToxicologyTest,
    requestFullMembershipVote,
    getCandidatesByPhase 
  } = useAppStore();

  const aspirantes = getCandidatesByPhase('aspirante');
  const provisionales = getCandidatesByPhase('provisional');
  const plenitos = getCandidatesByPhase('pleno'); // recién aprobados

  return (
    <div className="p-6 space-y-6">
      <Header title="Admisión Comunitaria" subtitle="Workflow 3 fases + filtros cualitativos (Art 14, 14A)" />
      
      {/* Registrar nuevo aspirante */}
      <Card>
        <CardHeader title="Nuevo Aspirante" />
        <CardContent>
          <AspirantForm onSubmit={registerAspirant} />
        </CardContent>
      </Card>

      {/* FASE 1: Aspirantes */}
      <PhasePanel 
        title="Fase 1: Aspirantes (Acogida)"
        candidates={aspirantes}
        config={ADMISSION_PHASES.aspirante}
        onEvaluate={evaluateAspirant}
        showToxicology={false}
      />

      {/* FASE 2: Provisionales */}
      <PhasePanel 
        title="Fase 2: Residencia Provisional"
        candidates={provisionales}
        config={ADMISSION_PHASES.provisional}
        onEvaluate={monthlyEvaluation}
        showToxicology={true}
        onRequestVote={requestFullMembershipVote}
      />

      {/* FASE 3: Recién aprobados */}
      <PhasePanel 
        title="Fase 3: Membresía Plena (Recién aprobados)"
        candidates={plenitos}
        config={ADMISSION_PHASES.pleno}
        readOnly
      />
    </div>
  );
}
```

---

## 6. Criterios de Aceptación (Definition of Done)

- [ ] Candidato se registra con patrocinador válido (ADN Social firmado)
- [ ] Fase aspirante: min 7 días, evaluación continua, firma ADN Social → avanza a provisional
- [ ] Fase provisional: 6-12 meses, mentor asignado, evaluación mensual, cayapas obligatorias
- [ ] Filtro cualitativo Art 14A: si ecoaldea "Libre de Sustancias" → antidoping obligatorio negativo
- [ ] Informe favorable depts convivencia + trabajo → propuesta voto asamblea
- [ ] Votación digital Ed25519, threshold 75% (configurable), excluye candidato/acusador
- [ ] Aprobado → miembro pleno: límites TQ plenos, usufructo habitacional, voto criptográfico
- [ ] Rechazado en cualquier fase → salida regulada (Art 15)
- [ ] Tests unitarios: workflow completo, filtros, edge cases (mentor no disponible, votos, etc.)
- [ ] Integración store.ts + democracy.ts (votación) + caas.ts (límites TQ) + boundaries.ts (filtros)

---

## 7. Referencias Normativas

- **Art 14**: Las Tres Fases de Admisión (Aspirante → Provisional → Pleno)
- **Art 14A**: Requisitos y Filtros de Admisión Cualitativa (antidoping, perfil local)
- **Art 5**: Módulo Digital de Gobernanza y Voto Criptográfico (Ed25519, quórum, umbrales)
- **Art 16**: Límite Simétrico y Confianza Progresiva (límites por fase)
- **Art 9**: Deberes Fundamentales (cayapa obligatoria durante provisional)
- **Ley III HSCSG**: Firma ADN Social (transparencia radical, no engañar)