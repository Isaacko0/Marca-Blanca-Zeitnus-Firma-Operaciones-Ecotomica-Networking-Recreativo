# Spec: Estructura 12 Departamentos Operativos + Multi-Firma 3/3 (Art 7, 13A)

**Fuente**: Reglamento Fedeco - Art 7 (Organizaciones y Departamentos) + Art 13A (Estructura Operativa)
**Prioridad**: P0 (Crítico - estructura organizativa base)
**Archivos Zeitnus**: `src/core/state/departments.ts`, `src/core/lib/departments.ts`, `src/app/screens/Departamentos.tsx`, `src/core/state/colony.ts` (extensión)

---

## 1. Modelo de Datos

```typescript
// src/core/state/departments.ts

// === 12 DEPARTAMENTOS OFICIALES (Art 13A) ===
type DepartmentKey = 
  | 'agroecologia'              // 1. Agroecología, Conuco y Soberanía Alimentaria
  | 'agua_saneamiento'          // 2. Agua, Saneamiento y Ciclo Hídrico
  | 'energia_renovable'         // 3. Energía Renovable y Microrredes
  | 'habitat_bioconstruccion'   // 4. Hábitat, Bioconstrucción e Infraestructura
  | 'salud_cuidados'            // 5. Salud, Cuidados, Dispensario, Botica Comunitaria
  | 'educacion_cultura'         // 6. Educación Viva, Escuela Comunitaria y Cultura
  | 'informatica_intranet'      // 7. Informática, Intranet Soberana y Red Mesh
  | 'comercio_logistica'        // 8. Comercio Comunal, Logística y Mercado TQ
  | 'acogida_integracion'       // 9. Acogida, Integración y Hospitalidad
  | 'convivencia_mediacion'     // 10. Convivencia, Mediación, Equipo Investigación, Leyes, Justicia Restaurativa
  | 'emergencias_riesgos'       // 11. Emergencias y Gestión de Riesgos
  | 'inhumaciones_cementerio';  // 12. Inhumaciones y Cementerio Ecológico

const DEPARTMENT_METADATA: Record<DepartmentKey, DepartmentMetadata> = {
  agroecologia: {
    key: 'agroecologia',
    name: 'Agroecología, Conuco y Soberanía Alimentaria',
    description: 'Manejo del conuco comunitario, biofábrica de bioinsumos/compost, vivero y resguardo del Banco de Semillas Criollas e Indígenas',
    icon: '🌱',
    type: 'organization',        // Organización de la Asamblea (servicio público esencial)
    category: 'production',
    requiresMultiSig: true,      // maneja fondos/bienes comunitarios
    budgetCategory: 'ALIM'       // vector CAC
  },
  agua_saneamiento: {
    key: 'agua_saneamiento',
    name: 'Agua, Saneamiento y Ciclo Hídrico',
    description: 'Protección y resguardo de nacientes, captación pluvial, instalación de baños secos composteros y plantas de fitodepuración (trampas de grasa y humedales artificiales con enea/totora)',
    icon: '💧',
    type: 'organization',
    category: 'infrastructure',
    requiresMultiSig: true,
    budgetCategory: 'HABI'
  },
  energia_renovable: {
    key: 'energia_renovable',
    name: 'Energía Renovable y Microrredes',
    description: 'Mantenimiento de la generación limpia off-grid (solar, hidroeléctrica, biogás), redes locales y mantenimiento de baterías y cableado comunal',
    icon: '☀️',
    type: 'organization',
    category: 'infrastructure',
    requiresMultiSig: true,
    budgetCategory: 'ENER'
  },
  habitat_bioconstruccion: {
    key: 'habitat_bioconstruccion',
    name: 'Hábitat, Bioconstrucción e Infraestructura',
    description: 'Revisión de memorias técnicas para bioconstrucción (bahareque, tapia, madera, bambú), trazado de vías permeables y coordinación de las cayapas de construcción',
    icon: '🏠',
    type: 'organization',
    category: 'infrastructure',
    requiresMultiSig: true,
    budgetCategory: 'HABI'
  },
  salud_cuidados: {
    key: 'salud_cuidados',
    name: 'Salud, Cuidados, Dispensario, Botica Comunitaria',
    description: 'Botica viva de plantas medicinales, medicina preventiva natural, primeros auxilios, terapias y red intergeneracional de atención a la infancia y adultos mayores',
    icon: '🏥',
    type: 'organization',
    category: 'care',
    requiresMultiSig: true,
    budgetCategory: 'SALU'
  },
  educacion_cultura: {
    key: 'educacion_cultura',
    name: 'Educación Viva, Escuela Comunitaria y Cultura',
    description: 'Escuela de la ecoaldea, formación agroecológica, alfabetización técnica, biblioteca digital (Kiwix) y eventos culturales o celebraciones estacionales',
    icon: '📚',
    type: 'organization',
    category: 'education',
    requiresMultiSig: true,
    budgetCategory: 'TRANSVERSAL'
  },
  informatica_intranet: {
    key: 'informatica_intranet',
    name: 'Informática, Intranet Soberana y Red Mesh',
    description: 'Mantenimiento del servidor local del nodo (Intranet/LAN), terminales de pago NFC/ESP32, red Mesh comunitaria, respaldos criptográficos y pasarelas federadas',
    icon: '💻',
    type: 'organization',
    category: 'technology',
    requiresMultiSig: true,
    budgetCategory: 'REDES'
  },
  comercio_logistica: {
    key: 'comercio_logistica',
    name: 'Comercio Comunal, Logística y Mercado TQ',
    description: 'Gestión del Mercado Comunal, acopio, pesaje, catálogo de precios energéticos en TQ, transporte y administración de herramientas y maquinarias compartidas (motocultor, tractores)',
    icon: '🏪',
    type: 'organization',
    category: 'economy',
    requiresMultiSig: true,
    budgetCategory: 'PROD'
  },
  acogida_integracion: {
    key: 'acogida_integracion',
    name: 'Acogida, Integración y Hospitalidad',
    description: 'Registro y atención a visitantes, voluntarios internacionales, ecoestudiantes y el acompañamiento inicial a nuevos aspirantes',
    icon: '🤝',
    type: 'department',          // Departamento operativo
    category: 'social',
    requiresMultiSig: false,     // no maneja fondos directamente
    budgetCategory: 'TRANSVERSAL'
  },
  convivencia_mediacion: {
    key: 'convivencia_mediacion',
    name: 'Convivencia, Mediación, Equipo de Investigación y Leyes, Justicia Restaurativa',
    description: 'Círculos de escucha (Comunicación No Violenta), resolución pacífica de desacuerdos cotidianos y aplicación del procedimiento de faltas',
    icon: '⚖️',
    type: 'department',
    category: 'governance',
    requiresMultiSig: false,
    budgetCategory: 'TRANSVERSAL'
  },
  emergencias_riesgos: {
    key: 'emergencias_riesgos',
    name: 'Emergencias y Gestión de Riesgos',
    description: 'Protocolos ante incendios forestales, limpieza de cortafuegos perimetrales, primeros auxilios y contingencias naturales',
    icon: '🚨',
    type: 'department',
    category: 'security',
    requiresMultiSig: false,
    budgetCategory: 'TRANSVERSAL'
  },
  inhumaciones_cementerio: {
    key: 'inhumaciones_cementerio',
    name: 'Inhumaciones y Cementerio Ecológico',
    description: 'Gestión, resguardo y mantenimiento del espacio destinado para el descanso final. Entierro natural sin químicos. Registro Digital + Libro Físico obligatorio',
    icon: '🪦',
    type: 'department',
    category: 'care',
    requiresMultiSig: true,      // maneja fondos cementerio
    budgetCategory: 'HABI'
  }
};

interface DepartmentMetadata {
  key: DepartmentKey;
  name: string;
  description: string;
  icon: string;
  type: 'organization' | 'department';  // Art 7.1: Organizaciones Asamblea vs Departamentos
  category: 'production' | 'infrastructure' | 'care' | 'education' | 'technology' | 'economy' | 'social' | 'governance' | 'security';
  requiresMultiSig: boolean;            // Art 7.3: multi-firma obligatorio para fondos
  budgetCategory: keyof CACVectors;     // vector CAC al que aporta
}

// === INSTANCIA DE DEPARTAMENTO ===
interface Department {
  key: DepartmentKey;
  metadata: DepartmentMetadata;
  
  // Liderazgo (Art 7.1: "autoridades ratificadas en Asamblea General")
  leadId: string;                       // responsable principal (elegido por asamblea)
  coLeads: string[];                    // co-responsables (para multi-sig 3/3)
  
  // Miembros asignados
  members: string[];                    // ecoaldeanos asignados al dept
  
  // Presupuesto (Art 7.1: "distribuir excedentes y fijar precios según catálogo energético")
  budgetTQ: number;                     // asignación fondo comunitario (Art 17)
  spentTQ: number;                      // gastado en periodo actual
  budgetPeriod: 'monthly' | 'quarterly' | 'yearly';
  lastBudgetApproval: number;           // timestamp última aprobación asamblea
  
  // Multi-firma 3/3 (Art 7.3: "firma criptográfica conjunta de al menos 3 delegados")
  multiSigConfig: MultiSigConfig;
  
  // Asamblea interna (Art 7.1-2: "asamblea interna autónoma" / "asamblea interna de trabajo")
  internalAssembly: InternalAssemblyConfig;
  
  // Jerarquía (Art 7.2: "todo departamento debe depender jerárquicamente de una Organización o de la Asamblea")
  parentOrgKey?: DepartmentKey;         // si es departamento, su organización padre
  childDeptKeys: DepartmentKey[];       // departamentos subordinados
  
  // Estado operativo
  status: 'active' | 'inactive' | 'restructuring';
  createdAt: number;
  updatedAt: number;
}

interface MultiSigConfig {
  required: 3;                          // FIJO: Art 7.3 "al menos tres (3) delegados"
  authorizedBy: 'assembly';             // autorizados por Asamblea
  signers: string[];                    // IDs de los 3+ firmantes autorizados (lead + coLeads + 1 más)
  threshold: 3;                         // 3 de 3 obligatorio
  lastUsed: number;
}

interface InternalAssemblyConfig {
  enabled: boolean;
  members: string[];                    // todos los miembros del dept (auto si org)
  meetingFrequency: 'weekly' | 'biweekly' | 'monthly';
  lastMeeting: number;
  canDecideBudget: boolean;             // true para Organizaciones, false para Departamentos (Art 7.2)
  canDecideInternalPolicy: boolean;     // true para ambos
  decisions: InternalDecision[];
}

interface InternalDecision {
  id: string;
  title: string;
  description: string;
  type: 'budget' | 'policy' | 'operational' | 'personnel';
  proposedBy: string;
  votedAt: number;
  result: 'approved' | 'rejected' | 'pending';
  votes: VoteRecord[];
}

interface VoteRecord {
  memberId: string;
  vote: 'for' | 'against' | 'abstain';
  signature: string;                    // Ed25519
  timestamp: number;
}
```

---

## 2. Jerarquía Organizacional (Art 7.1-2)

```
ASAMBLEA GENERAL (Órgano Supremo - Art 4)
│
├── JUNTA DIRECTIVA (Órgano Ejecutivo - Art 6)
│
├── ORGANIZACIONES DE LA ASAMBLEA (Servicios públicos esenciales - TODOS son miembros)
│   ├── Agroecología (Org) → budgetCategory: ALIM
│   ├── Agua y Saneamiento (Org) → budgetCategory: HABI
│   ├── Energía Renovable (Org) → budgetCategory: ENER
│   ├── Hábitat y Bioconstrucción (Org) → budgetCategory: HABI
│   ├── Salud y Cuidados (Org) → budgetCategory: SALU
│   ├── Educación y Cultura (Org) → budgetCategory: TRANSVERSAL
│   ├── Informática e Intranet (Org) → budgetCategory: REDES
│   └── Comercio y Logística (Org) → budgetCategory: PROD
│
└── DEPARTAMENTOS OPERATIVOS (Equipos de trabajo específicos - dependen de Org o Asamblea)
    ├── Acogida e Integración (Dept) → parent: Asamblea directa
    ├── Convivencia y Mediación (Dept) → parent: Asamblea directa
    ├── Emergencias y Riesgos (Dept) → parent: Asamblea directa
    └── Inhumaciones y Cementerio (Dept) → parent: Asamblea directa
    
    // Futuro: departamentos bajo organizaciones
    // ej: Vivero Semillas (Dept) → parent: Agroecología (Org)
    // ej: Mantenimiento Paneles (Dept) → parent: Energía Renovable (Org)
```

---

## 3. Lógica de Negocio (DepartmentsLib)

```typescript
// src/core/lib/departments.ts

import { DEPARTMENT_METADATA } from './departmentMetadata';
import type { Department, DepartmentKey, MultiSigConfig, InternalAssemblyConfig } from '@core/state/departments';
import type { Member } from '@core/state/types';

export class DepartmentsManager {
  private departments: Map<DepartmentKey, Department> = new Map();
  private members: Map<string, Member> = new Map();

  constructor() {
    this.initializeDepartments();
  }

  private initializeDepartments(): void {
    // Crear las 8 Organizaciones de la Asamblea
    const orgKeys: DepartmentKey[] = [
      'agroecologia', 'agua_saneamiento', 'energia_renovable', 
      'habitat_bioconstruccion', 'salud_cuidados', 'educacion_cultura',
      'informatica_intranet', 'comercio_logistica'
    ];

    // Crear los 4 Departamentos Operativos
    const deptKeys: DepartmentKey[] = [
      'acogida_integracion', 'convivencia_mediacion', 
      'emergencias_riesgos', 'inhumaciones_cementerio'
    ];

    [...orgKeys, ...deptKeys].forEach(key => {
      const metadata = DEPARTMENT_METADATA[key];
      this.departments.set(key, this.createEmptyDepartment(key, metadata));
    });
  }

  private createEmptyDepartment(key: DepartmentKey, metadata: DepartmentMetadata): Department {
    return {
      key,
      metadata,
      leadId: '',
      coLeads: [],
      members: [],
      budgetTQ: 0,
      spentTQ: 0,
      budgetPeriod: 'quarterly',
      lastBudgetApproval: 0,
      multiSigConfig: {
        required: 3,
        authorizedBy: 'assembly',
        signers: [],
        threshold: 3,
        lastUsed: 0
      },
      internalAssembly: {
        enabled: true,
        members: [],
        meetingFrequency: 'monthly',
        lastMeeting: 0,
        canDecideBudget: metadata.type === 'organization',
        canDecideInternalPolicy: true,
        decisions: []
      },
      parentOrgKey: metadata.type === 'department' ? undefined : undefined,
      childDeptKeys: [],
      status: 'active',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
  }

  // === GESTIÓN LIDERAZGO (Elección en Asamblea) ===
  
  async electLead(deptKey: DepartmentKey, memberId: string, electedBy: 'assembly' | 'internal'): Promise<void> {
    const dept = this.departments.get(deptKey);
    if (!dept) throw new Error('Departamento no encontrado');
    
    const member = this.members.get(memberId);
    if (!member) throw new Error('Miembro no encontrado');
    if (!member.signedSocialDNA) throw new Error('Miembro debe tener ADN Social firmado');

    dept.leadId = memberId;
    dept.updatedAt = Date.now();
    
    // Actualizar multi-sig signers (lead + 2 co-leads minimum)
    await this.updateMultiSigSigners(deptKey);
  }

  async addCoLead(deptKey: DepartmentKey, memberId: string): Promise<void> {
    const dept = this.departments.get(deptKey);
    if (!dept) throw new Error('Departamento no encontrado');
    if (dept.coLeads.length >= 2) throw new Error('Máximo 2 co-líderes');
    
    dept.coLeads.push(memberId);
    dept.updatedAt = Date.now();
    await this.updateMultiSigSigners(deptKey);
  }

  private async updateMultiSigSigners(deptKey: DepartmentKey): Promise<void> {
    const dept = this.departments.get(deptKey);
    if (!dept) return;
    
    const signers = [dept.leadId, ...dept.coLeads].filter(Boolean);
    // Necesario 1 más para llegar a 3 (puede ser tesorero dept o miembro asamblea)
    if (signers.length < 3) {
      // Buscar miembro elegible (firmado ADN, no en otro multi-sig activo)
      const additional = this.findAdditionalSigner(deptKey);
      if (additional) signers.push(additional);
    }
    
    dept.multiSigConfig.signers = signers.slice(0, 3); // exacto 3
  }

  private findAdditionalSigner(excludeDeptKey: DepartmentKey): string | null {
    // Buscar miembro pleno con ADN firmado, no lead/co-lead en otro dept con multi-sig
    for (const [id, member] of this.members) {
      if (!member.signedSocialDNA) continue;
      if (this.isActiveMultiSigSigner(id, excludeDeptKey)) continue;
      return id;
    }
    return null;
  }

  private isActiveMultiSigSigner(memberId: string, excludeDeptKey: DepartmentKey): boolean {
    for (const [key, dept] of this.departments) {
      if (key === excludeDeptKey) continue;
      if (dept.multiSigConfig.signers.includes(memberId)) return true;
    }
    return false;
  }

  // === ASIGNACIÓN MIEMBROS ===
  
  assignMember(deptKey: DepartmentKey, memberId: string): void {
    const dept = this.departments.get(deptKey);
    const member = this.members.get(memberId);
    if (!dept || !member) throw new Error('Departamento o miembro no encontrado');
    
    // Remover de dept anterior si estaba asignado
    this.removeMemberFromAll(memberId);
    
    dept.members.push(memberId);
    dept.internalAssembly.members = [...dept.members]; // auto-sync para Organizaciones
    dept.updatedAt = Date.now();
  }

  removeMemberFromAll(memberId: string): void {
    for (const dept of this.departments.values()) {
      dept.members = dept.members.filter(id => id !== memberId);
      dept.internalAssembly.members = dept.members;
      dept.coLeads = dept.coLeads.filter(id => id !== memberId);
      if (dept.leadId === memberId) dept.leadId = '';
      dept.updatedAt = Date.now();
    }
  }

  // === PRESUPUESTO Y MULTI-FIRMA ===
  
  // Art 17: "Asignaciones del Fondo Comunitario se destinan exclusivamente a cuentas de Organizaciones"
  allocateBudget(deptKey: DepartmentKey, amountTQ: number, approvedByAssembly: boolean): void {
    const dept = this.departments.get(deptKey);
    if (!dept) throw new Error('Departamento no encontrado');
    if (dept.metadata.type !== 'organization') throw new Error('Solo Organizaciones reciben presupuesto directo del Fondo');
    if (!approvedByAssembly) throw new Error('Presupuesto requiere aprobación en Asamblea General (Art 4.d, 17)');
    
    dept.budgetTQ = amountTQ;
    dept.spentTQ = 0;
    dept.lastBudgetApproval = Date.now();
    dept.updatedAt = Date.now();
  }

  // Art 7.3: "Ningún directivo puede transferir fondos de forma individual. Requiere firma conjunta de al menos 3 delegados"
  async requestTransfer(deptKey: DepartmentKey, request: TransferRequest): Promise<TransferResult> {
    const dept = this.departments.get(deptKey);
    if (!dept) throw new Error('Departamento no encontrado');
    if (!dept.multiSigConfig.requiresMultiSig) throw new Error('Departamento no requiere multi-firma');
    
    // Verificar firmas (3/3)
    const validSignatures = request.signatures.filter(sig => 
      dept.multiSigConfig.signers.includes(sig.signerId) && 
      this.verifyEd25519(sig.signature, sig.payload, sig.signerId)
    );
    
    if (validSignatures.length < dept.multiSigConfig.threshold) {
      return { 
        success: false, 
        reason: `Firmas insuficientes: ${validSignatures.length}/${dept.multiSigConfig.threshold}`,
        requiredSigners: dept.multiSigConfig.signers
      };
    }
    
    // Verificar presupuesto disponible
    if (dept.spentTQ + request.amount > dept.budgetTQ) {
      return { success: false, reason: 'Presupuesto insuficiente' };
    }
    
    // Ejecutar transferencia (integrar con caas.ts / trustlines.ts)
    const txResult = await this.executeTransfer(request);
    
    if (txResult.success) {
      dept.spentTQ += request.amount;
      dept.multiSigConfig.lastUsed = Date.now();
      dept.updatedAt = Date.now();
    }
    
    return txResult;
  }

  // === ASAMBLEA INTERNA ===
  
  proposeInternalDecision(deptKey: DepartmentKey, proposal: Omit<InternalDecision, 'id' | 'votedAt' | 'result' | 'votes'>): string {
    const dept = this.departments.get(deptKey);
    if (!dept) throw new Error('Departamento no encontrado');
    if (!dept.internalAssembly.enabled) throw new Error('Asamblea interna no habilitada');
    
    // Verificar potestad (Art 7.2: Departamentos "sin potestad sobre asuntos privativos de la ecoaldea")
    if (proposal.type === 'budget' && !dept.internalAssembly.canDecideBudget) {
      throw new Error('Departamentos no pueden decidir presupuesto (solo Organizaciones)');
    }
    
    const decision: InternalDecision = {
      ...proposal,
      id: `dec_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
      votedAt: 0,
      result: 'pending',
      votes: []
    };
    
    dept.internalAssembly.decisions.push(decision);
    dept.updatedAt = Date.now();
    return decision.id;
  }

  voteInternalDecision(deptKey: DecisionKey, decisionId: string, vote: VoteRecord): void {
    const dept = this.departments.get(deptKey);
    if (!dept) throw new Error('Departamento no encontrado');
    
    const decision = dept.internalAssembly.decisions.find(d => d.id === decisionId);
    if (!decision) throw new Error('Decisión no encontrada');
    if (decision.result !== 'pending') throw new Error('Votación ya cerrada');
    if (!dept.internalAssembly.members.includes(vote.memberId)) throw new Error('No es miembro de esta asamblea');
    
    decision.votes.push(vote);
    dept.updatedAt = Date.now();
  }

  closeInternalVote(deptKey: DepartmentKey, decisionId: string): void {
    const dept = this.departments.get(deptKey);
    if (!dept) throw new Error('Departamento no encontrado');
    
    const decision = dept.internalAssembly.decisions.find(d => d.id === decisionId);
    if (!decision) throw new Error('Decisión no encontrada');
    
    const forVotes = decision.votes.filter(v => v.vote === 'for').length;
    const againstVotes = decision.votes.filter(v => v.vote === 'against').length;
    const totalEligible = dept.internalAssembly.members.length;
    const quorum = Math.ceil(totalEligible * 0.5); // 50% quórum interno
    
    if (forVotes + againstVotes < quorum) {
      decision.result = 'rejected';
      decision.votedAt = Date.now();
      return;
    }
    
    decision.result = forVotes > againstVotes ? 'approved' : 'rejected';
    decision.votedAt = Date.now();
    dept.updatedAt = Date.now();
  }

  // === CONSULTAS ===
  
  getDepartment(key: DepartmentKey): Department | undefined {
    return this.departments.get(key);
  }

  getAllDepartments(): Department[] {
    return Array.from(this.departments.values());
  }

  getOrganizations(): Department[] {
    return Array.from(this.departments.values()).filter(d => d.metadata.type === 'organization');
  }

  getDepartments(): Department[] {
    return Array.from(this.departments.values()).filter(d => d.metadata.type === 'department');
  }

  getMemberDepartments(memberId: string): Department[] {
    return Array.from(this.departments.values()).filter(d => d.members.includes(memberId));
  }

  getDepartmentBudgetStatus(deptKey: DepartmentKey): { 
    allocated: number; 
    spent: number; 
    remaining: number; 
    percentage: number 
  } {
    const dept = this.departments.get(deptKey);
    if (!dept) throw new Error('Departamento no encontrado');
    
    return {
      allocated: dept.budgetTQ,
      spent: dept.spentTQ,
      remaining: dept.budgetTQ - dept.spentTQ,
      percentage: dept.budgetTQ > 0 ? (dept.spentTQ / dept.budgetTQ) * 100 : 0
    };
  }

  // Stubs
  private verifyEd25519(signature: string, payload: string, signerId: string): boolean { return true; }
  private async executeTransfer(request: TransferRequest): Promise<TransferResult> { return { success: true }; }
}

interface TransferRequest {
  fromAccount: string;        // cuenta organización/dept
  toAccount: string;          // cuenta proveedor/miembro
  amount: number;             // TQ
  purpose: string;
  signatures: SignatureRecord[];
}

interface SignatureRecord {
  signerId: string;
  signature: string;          // Ed25519
  payload: string;            // hash de la transacción
  timestamp: number;
}

interface TransferResult {
  success: boolean;
  reason?: string;
  requiredSigners?: string[];
  transactionId?: string;
}
```

---

## 4. Integración con Colony (Dominios) y CaaS (Streams)

```typescript
// Extensión de colony.ts para mapear Departamentos ↔ Dominios

interface DepartmentDomainMapping {
  departmentKey: DepartmentKey;
  colonyDomainId: string;           // ID en Colony (dominio gobernanza)
  domainKind: 'organization' | 'department' | 'team';
  potId: string;                    // Pot Colony para presupuesto
  reputationToken: string;          // Token reputación específico dept
}

// Streams CaaS por departamento (Art 17: servicios obligatorios/voluntarios)
interface DepartmentRevenueStream {
  departmentKey: DepartmentKey;
  streamKey: string;                // ej: 'agua_servicio', 'energia_servicio'
  name: string;
  type: 'obligatory' | 'voluntary' | 'benefit';
  taxRate: number;                  // % sobre transacciones (Art 17.2)
  recipients: string[];             // miembros dept que reciben payout
  cdsWeight: number;                // peso en CDS (Coeficiente Desarrollo Soberano)
}
```

---

## 5. Pantalla Departamentos.tsx

```tsx
// src/app/screens/Departamentos.tsx

export function DepartamentosScreen() {
  const { 
    departments, 
    electLead, 
    addCoLead, 
    assignMember,
    allocateBudget,
    requestTransfer,
    proposeInternalDecision,
    voteInternalDecision,
    getOrganizations,
    getDepartments,
    getDepartmentBudgetStatus 
  } = useAppStore();

  const orgs = getOrganizations();
  const depts = getDepartments();

  return (
    <div className="p-6 space-y-6">
      <Header title="Departamentos y Organizaciones" subtitle="Art 7, 13A - 8 Organizaciones + 4 Departamentos + Multi-firma 3/3" />
      
      {/* Resumen jerárquico */}
      <OrgChart orgs={orgs} depts={depts} />
      
      {/* Grid Organizaciones */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Organizaciones de la Asamblea (Servicios Públicos)</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {orgs.map(org => (
            <DepartmentCard 
              key={org.key}
              dept={org}
              budgetStatus={getDepartmentBudgetStatus(org.key)}
              onElectLead={electLead}
              onAddCoLead={addCoLead}
              onAllocateBudget={allocateBudget}
              onRequestTransfer={requestTransfer}
              onProposeDecision={proposeInternalDecision}
            />
          ))}
        </div>
      </section>

      {/* Grid Departamentos */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Departamentos Operativos</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {depts.map(dept => (
            <DepartmentCard 
              key={dept.key}
              dept={dept}
              budgetStatus={getDepartmentBudgetStatus(dept.key)}
              onAssignMember={assignMember}
              onProposeDecision={proposeInternalDecision}
            />
          ))}
        </div>
      </section>

      {/* Multi-firma status */}
      <MultiSigStatusPanel departments={Array.from(departments.values())} />
    </div>
  );
}
```

---

## 6. Criterios de Aceptación (Definition of Done)

- [ ] 8 Organizaciones de la Asamblea creadas (todos son miembros auto)
- [ ] 4 Departamentos Operativos creados (dependen jerárquicamente)
- [ ] Liderazgo: lead + 2 co-leads elegidos en asamblea
- [ ] Multi-firma 3/3 obligatorio para transferencias de fondos (Art 7.3)
- [ ] Firmantes autorizados por asamblea, Ed25519 verified
- [ ] Presupuesto: solo Organizaciones reciben del Fondo Comunitario (Art 17)
- [ ] Asamblea interna: Organizaciones deciden presupuesto + política; Departamentos solo política interna
- [ ] Jerarquía: Dept → Org → Asamblea (sin dept aislado a persona individual)
- [ ] Integración Colony: cada dept = dominio + pot + reputation token
- [ ] Integración CaaS: streams de ingreso por dept (obligatorio/voluntario/beneficio)
- [ ] Tests: elección leads, multi-sig 3/3, presupuesto, asambleas internas, jerarquía

---

## 7. Referencias Normativas

- **Art 7.1**: Organizaciones de la Asamblea (servicios públicos, todos miembros auto, asamblea interna autónoma, junta directiva propia)
- **Art 7.2**: Departamentos (células trabajo, dependen Org o Asamblea, asamblea interna trabajo, sin potestad asuntos privativos)
- **Art 7.3**: Esquema Multi-Firma Obligatorio (mínimo 3 delegados autorizados por Asamblea, firma conjunta)
- **Art 13A**: 12 Departamentos/Comisiones oficiales con descripciones detalladas
- **Art 4.d**: Asamblea fija límites crediticios, tasas, presupuestos Fondo Comunitario
- **Art 17**: Impuestos automáticos, servicios obligatorios/voluntarios, fondo comunitario
- **Art 6**: Junta Directiva (meeting_type=board, quórum sobre directivos)