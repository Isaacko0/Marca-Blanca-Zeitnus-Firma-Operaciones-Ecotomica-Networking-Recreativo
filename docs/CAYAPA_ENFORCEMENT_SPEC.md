# Spec: Cayapa Enforcement Semanal Obligatorio (Art 9)

**Fuente**: Reglamento Fedeco - Art 9 (Deberes Fundamentales) - Jornada Laboral, Descanso y Trabajo Comunitario
**Prioridad**: P0 (Crítico - motor de reciprocidad laboral)
**Archivos Zeitnus**: `src/core/lib/cayapaEnforcement.ts`, `src/core/state/cayapa.ts`, `src/app/screens/Cayapa.tsx`, `src/core/state/life.ts` (extensión)

---

## 1. Modelo de Datos

```typescript
// src/core/state/cayapa.ts

interface CayapaSchedule {
  memberId: string;
  assignedDay: WeekDay;              // 0=domingo ... 6=sábado (consensuado Art 9)
  weekStart: number;                 // timestamp inicio semana (lunes 00:00)
  status: CayapaStatus;
  hoursCompleted: number;            // horas reales trabajadas (mín 8h/día)
  hoursRequired: number;             // 8 horas obligatorias
  compensationHours: number;         // horas pendientes compensación
  exemption?: CayapaExemption;
  history: CayapaWeekRecord[];
}

type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;
type CayapaStatus = 'pending' | 'in_progress' | 'completed' | 'missed' | 'compensating' | 'exempt';

interface CayapaWeekRecord {
  weekStart: number;
  assignedDay: WeekDay;
  actualDay?: WeekDay;               // día real trabajado (puede diferir si compensación)
  hoursWorked: number;
  status: CayapaStatus;
  taskDescription: string;           // qué se hizo: caminos, agua, biofiltros, siembra, bioconstrucción
  supervisedBy: string;              // lead dept correspondiente
  validatedAt?: number;
  compensationForWeek?: number;      // si es compensación, semana original
}

interface CayapaExemption {
  reason: 'medical' | 'travel' | 'family_emergency' | 'approved_leave' | 'employer_conflict';
  description: string;
  approvedBy: string;                // asamblea o junta directa
  approvedAt: number;
  validUntil: number;                // timestamp fin exención
  compensationRequired: boolean;     // Art 9: debe compensar después
}

// === EMPLEADORES (Art 9: "Obligación para Empleadores") ===
interface EmployerCayapaCompliance {
  employerId: string;
  employees: string[];               // miembros que emplea
  compliance: EmployeeCayapaCompliance[];
  lastAudit: number;
  status: 'compliant' | 'warning' | 'non_compliant';
}

interface EmployeeCayapaCompliance {
  employeeId: string;
  restDayGranted: boolean;           // 1 día descanso personal
  cayapaDayGranted: boolean;         // 1 día labor comunitaria
  restDayDate?: number;
  cayapaDayDate?: number;
  violations: string[];
}
```

---

## 2. Configuración (Parametrizable por Asamblea)

```typescript
// src/core/lib/cayapaConfig.ts

export const CAYAPA_CONFIG = {
  // Art 9: "Un (1) día semanal de Trabajo Comunitario Obligatorio"
  hoursPerCayapa: 8,                 // jornada completa
  minHoursPerCayapa: 6,              // mínimo para considerar cumplido
  
  // "Un (1) día semanal de Recreación y Descanso" - inalienable
  restDayRequired: true,
  
  // "Cinco (5) días de Trabajo Laboral Ordinario"
  workDaysPerWeek: 5,
  
  // "El día de cayapa puede ser consensuado y coordinado entre el integrante y la Asamblea"
  assignmentMethod: 'consensus',     // 'consensus' | 'rotation' | 'fixed'
  
  // Compensación por inasistencia (Art 12.1 falta leve)
  compensationMultiplier: 1.5,       // 1.5x horas perdidas
  maxMissedBeforeGrave: 3,           // "más de tres amonestaciones en un trimestre = falta grave"
  trimestreDays: 90,
  
  // Tareas válidas cayapa (Art 9: "mantenimiento de caminos, obras de agua, biofiltros, siembras colectivas, apoyo en bioconstrucciones aprobadas")
  validTasks: [
    'caminos_mantenimiento',
    'obras_agua',
    'biofiltros',
    'siembras_colectivas',
    'bioconstruccion_aprobada',
    'mantenimiento_infraestructura_comun',
    'limpieza_areas_comunes',
    'cosecha_colectiva',
    'preparacion_compost',
    'vivero_semillas'
  ],
  
  // Departamentos que supervisan cayapas (Art 13A)
  supervisingDepartments: [
    'habitat_bioconstruccion',      // bioconstrucción, caminos
    'agua_saneamiento',             // obras agua, biofiltros
    'agroecologia',                 // siembras, compost, vivero
    'energia_renovable',            // mantenimiento paneles, cableado
    'informatica_intranet'          // servidores, mesh (ocasional)
  ],
  
  // Empleadores: deben conceder 2 días libres (descanso + cayapa)
  employerRequirements: {
    restDayPerWeek: 1,
    cayapaDayPerWeek: 1,
    auditFrequency: 'monthly'
  }
};
```

---

## 3. Lógica de Negocio (CayapaEnforcement)

```typescript
// src/core/lib/cayapaEnforcement.ts

import { CAYAPA_CONFIG } from './cayapaConfig';
import type { CayapaSchedule, CayapaWeekRecord, CayapaStatus, WeekDay, EmployerCayapaCompliance } from '@core/state/cayapa';
import type { Member } from '@core/state/types';

export class CayapaEnforcement {
  private schedules: Map<string, CayapaSchedule> = new Map();  // memberId -> schedule
  private employerCompliance: Map<string, EmployerCayapaCompliance> = new Map();
  private members: Map<string, Member> = new Map();

  // === ASIGNACIÓN DÍA CAYAPA ===
  
  // Art 9: "El día de cayapa puede ser consensuado y coordinado entre el integrante y la Asamblea"
  async assignCayapaDay(memberId: string, preferredDay: WeekDay, approvedByAssembly: boolean): Promise<CayapaSchedule> {
    const member = this.members.get(memberId);
    if (!member) throw new Error('Miembro no encontrado');
    
    let schedule = this.schedules.get(memberId);
    if (!schedule) {
      schedule = this.createEmptySchedule(memberId);
    }
    
    // Validar día preferido (no conflicto con día descanso)
    if (schedule.exemption?.validUntil && schedule.exemption.validUntil > Date.now()) {
      throw new Error('Miembro tiene exención vigente');
    }
    
    schedule.assignedDay = preferredDay;
    schedule.updatedAt = Date.now();
    this.schedules.set(memberId, schedule);
    
    // Notificar dept supervisor correspondiente
    await this.notifySupervisingDept(memberId, preferredDay);
    
    return schedule;
  }

  // Asignación por rotación (fallback si no hay consenso)
  async autoAssignByRotation(): Promise<void> {
    const activeMembers = Array.from(this.members.values())
      .filter(m => m.signedSocialDNA && m.committedMonths > 0);
    
    for (const member of activeMembers) {
      const schedule = this.schedules.get(member.id) || this.createEmptySchedule(member.id);
      // Rotar día semana basado en hash del ID para distribución equitativa
      const dayIndex = this.hashToDay(member.id);
      schedule.assignedDay = dayIndex;
      this.schedules.set(member.id, schedule);
    }
  }

  private hashToDay(memberId: string): WeekDay {
    let hash = 0;
    for (let i = 0; i < memberId.length; i++) {
      hash = ((hash << 5) - hash) + memberId.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash) % 7 as WeekDay;
  }

  // === REGISTRO CUMPLIMIENTO ===
  
  async logCayapaCompletion(data: {
    memberId: string;
    weekStart: number;
    actualDay: WeekDay;
    hoursWorked: number;
    taskDescription: string;
    supervisedBy: string;
  }): Promise<CayapaWeekRecord> {
    const schedule = this.schedules.get(data.memberId);
    if (!schedule) throw new Error('Horario cayapa no encontrado');
    
    const weekRecord: CayapaWeekRecord = {
      weekStart: data.weekStart,
      assignedDay: schedule.assignedDay,
      actualDay: data.actualDay,
      hoursWorked: data.hoursWorked,
      status: data.hoursWorked >= CAYAPA_CONFIG.minHoursPerCayapa ? 'completed' : 'compensating',
      taskDescription: data.taskDescription,
      supervisedBy: data.supervisedBy,
      validatedAt: Date.now()
    };
    
    // Validar tarea permitida
    if (!CAYAPA_CONFIG.validTasks.some(t => data.taskDescription.includes(t))) {
      console.warn(`Tarea cayapa no estándar: ${data.taskDescription}`);
    }
    
    // Actualizar schedule
    schedule.history.push(weekRecord);
    schedule.hoursCompleted += data.hoursWorked;
    
    if (weekRecord.status === 'completed') {
      schedule.status = 'completed';
      schedule.compensationHours = Math.max(0, schedule.compensationHours - data.hoursWorked);
    } else {
      schedule.status = 'compensating';
      schedule.compensationHours += CAYAPA_CONFIG.hoursPerCayapa - data.hoursWorked;
    }
    
    schedule.updatedAt = Date.now();
    this.schedules.set(data.memberId, schedule);
    
    // Verificar si.trigger falta leve (inasistencia injustificada)
    await this.checkMissedCayapa(data.memberId, data.weekStart);
    
    return weekRecord;
  }

  // === COMPENSACIÓN HORAS PENDIENTES ===
  
  // Art 12.1: "Compensación de las horas de labor comunitaria no cumplidas"
  async logCompensation(data: {
    memberId: string;
    weekStart: number;              // semana que se compensa
    hoursWorked: number;
    taskDescription: string;
    supervisedBy: string;
  }): Promise<CayapaWeekRecord> {
    const schedule = this.schedules.get(data.memberId);
    if (!schedule) throw new Error('Horario cayapa no encontrado');
    
    const originalWeek = schedule.history.find(w => w.weekStart === data.weekStart);
    if (!originalWeek) throw new Error('Semana original no encontrada');
    if (originalWeek.status === 'completed') throw new Error('Semana ya completada');
    
    const compensationRecord: CayapaWeekRecord = {
      weekStart: data.weekStart,
      assignedDay: schedule.assignedDay,
      actualDay: new Date().getDay() as WeekDay,
      hoursWorked: data.hoursWorked,
      status: data.hoursWorked >= CAYAPA_CONFIG.minHoursPerCayapa ? 'completed' : 'compensating',
      taskDescription: data.taskDescription,
      supervisedBy: data.supervisedBy,
      validatedAt: Date.now(),
      compensationForWeek: data.weekStart
    };
    
    schedule.history.push(compensationRecord);
    schedule.compensationHours = Math.max(0, schedule.compensationHours - data.hoursWorked);
    
    if (compensationRecord.status === 'completed') {
      originalWeek.status = 'completed';
      schedule.status = 'completed';
    }
    
    schedule.updatedAt = Date.now();
    this.schedules.set(data.memberId, schedule);
    
    return compensationRecord;
  }

  // === VERIFICACIÓN FALTAS (Art 12) ===
  
  // "Inasistencia injustificada a una jornada de trabajo comunitario (cayapa) = Falta Leve"
  // "Reincidencia reiterada en faltas leves (más de tres amonestaciones en un trimestre) = Falta Grave"
  private async checkMissedCayapa(memberId: string, weekStart: number): Promise<void> {
    const schedule = this.schedules.get(memberId);
    if (!schedule) return;
    
    const weekRecord = schedule.history.find(w => w.weekStart === weekStart);
    if (!weekRecord || weekRecord.status !== 'missed') return;
    
    // Contar faltas en último trimestre
    const trimestreStart = Date.now() - CAYAPA_CONFIG.trimestreDays * 24 * 60 * 60 * 1000;
    const recentMissed = schedule.history.filter(w => 
      w.weekStart >= trimestreStart && 
      (w.status === 'missed' || w.status === 'compensating')
    ).length;
    
    if (recentMissed >= CAYAPA_CONFIG.maxMissedBeforeGrave) {
      // TRIGGER: Falta Grave → notificar Dept Convivencia + Asamblea
      await this.triggerGraveOffense(memberId, recentMissed);
    } else {
      // Falta Leve → amonestación verbal + compensación
      await this.triggerLeveOffense(memberId, recentMissed);
    }
  }

  private async triggerLeveOffense(memberId: string, count: number): Promise<void> {
    // Integrar con boundaries.ts / vecinal.ts / justice.ts
    // "Conversación reflexiva, amonestación verbal fraternal y compensación de horas"
    console.log(`[CAYAPA] Falta leve #${count} para ${memberId} - Amonestación verbal + compensación`);
  }

  private async triggerGraveOffense(memberId: string, count: number): Promise<void> {
    // "Amonestación escrita con registro en acta, suspensión temporal del derecho a solicitar incrementos de crédito, 
    // restricción transitoria del uso de maquinaria común y plan obligatorio de reparación del daño"
    console.log(`[CAYAPA] FALTA GRAVE para ${memberId} - ${count} amonestaciones en trimestre`);
    // Integrar con: caas.ts (suspend credit increase), boundaries.ts (restrict machinery), justice.ts (repair plan)
  }

  // === EXENCIONES ===
  
  async requestExemption(data: {
    memberId: string;
    reason: CayapaExemption['reason'];
    description: string;
    validUntil: number;
    compensationRequired: boolean;
  }): Promise<CayapaExemption> {
    const schedule = this.schedules.get(data.memberId);
    if (!schedule) throw new Error('Horario cayapa no encontrado');
    
    const exemption: CayapaExemption = {
      reason: data.reason,
      description: data.description,
      approvedBy: 'assembly', // o 'junta_directiva' para emergencias
      approvedAt: Date.now(),
      validUntil: data.validUntil,
      compensationRequired: data.compensationRequired
    };
    
    schedule.exemption = exemption;
    schedule.status = 'exempt';
    schedule.updatedAt = Date.now();
    this.schedules.set(data.memberId, schedule);
    
    return exemption;
  }

  // === EMPLEADORES (Art 9: "Obligación para Empleadores") ===
  
  registerEmployer(employerId: string, employeeIds: string[]): void {
    const compliance: EmployerCayapaCompliance = {
      employerId,
      employees: employeeIds,
      compliance: employeeIds.map(eid => ({
        employeeId: eid,
        restDayGranted: false,
        cayapaDayGranted: false,
        violations: []
      })),
      lastAudit: Date.now(),
      status: 'compliant'
    };
    
    this.employerCompliance.set(employerId, compliance);
  }

  async auditEmployerCompliance(employerId: string): Promise<EmployerCayapaCompliance> {
    const compliance = this.employerCompliance.get(employerId);
    if (!compliance) throw new Error('Empleador no registrado');
    
    let hasViolations = false;
    
    for (const emp of compliance.compliance) {
      const schedule = this.schedules.get(emp.employeeId);
      if (!schedule) continue;
      
      // Verificar semana actual
      const weekStart = this.getWeekStart(Date.now());
      const weekRecord = schedule.history.find(w => w.weekStart === weekStart);
      
      if (weekRecord) {
        emp.restDayGranted = true; // asumimos que tuvo descanso si trabajó cayapa
        emp.cayapaDayGranted = weekRecord.status === 'completed';
      } else {
        emp.violations.push(`Semana ${weekStart}: sin registro cayapa ni descanso`);
        hasViolations = true;
      }
    }
    
    compliance.status = hasViolations ? 'non_compliant' : 'compliant';
    compliance.lastAudit = Date.now();
    this.employerCompliance.set(employerId, compliance);
    
    return compliance;
  }

  // === CONSULTAS ===
  
  getSchedule(memberId: string): CayapaSchedule | undefined {
    return this.schedules.get(memberId);
  }

  getAllSchedules(): CayapaSchedule[] {
    return Array.from(this.schedules.values());
  }

  getWeeklyCompliance(weekStart: number): { 
    total: number; 
    completed: number; 
    missed: number; 
    compensating: number; 
    exempt: number;
    percentage: number;
  } {
    let total = 0, completed = 0, missed = 0, compensating = 0, exempt = 0;
    
    for (const schedule of this.schedules.values()) {
      if (schedule.exemption?.validUntil && schedule.exemption.validUntil > Date.now()) {
        exempt++;
        continue;
      }
      total++;
      
      const weekRecord = schedule.history.find(w => w.weekStart === weekStart);
      if (!weekRecord) {
        missed++;
      } else if (weekRecord.status === 'completed') {
        completed++;
      } else if (weekRecord.status === 'compensating') {
        compensating++;
      } else {
        missed++;
      }
    }
    
    return {
      total,
      completed,
      missed,
      compensating,
      exempt,
      percentage: total > 0 ? (completed / total) * 100 : 0
    };
  }

  getMemberComplianceReport(memberId: string): {
    schedule: CayapaSchedule;
    weeksCompleted: number;
    weeksMissed: number;
    compensationHours: number;
    currentStatus: CayapaStatus;
    trimesterViolations: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
  } {
    const schedule = this.schedules.get(memberId);
    if (!schedule) throw new Error('Horario no encontrado');
    
    const weeksCompleted = schedule.history.filter(w => w.status === 'completed').length;
    const weeksMissed = schedule.history.filter(w => w.status === 'missed').length;
    
    const trimestreStart = Date.now() - CAYAPA_CONFIG.trimestreDays * 24 * 60 * 60 * 1000;
    const trimesterViolations = schedule.history.filter(w => 
      w.weekStart >= trimestreStart && 
      (w.status === 'missed' || w.status === 'compensating')
    ).length;
    
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (trimesterViolations >= 3) riskLevel = 'critical';
    else if (trimesterViolations >= 2) riskLevel = 'high';
    else if (trimesterViolations >= 1) riskLevel = 'medium';
    
    return {
      schedule,
      weeksCompleted,
      weeksMissed,
      compensationHours: schedule.compensationHours,
      currentStatus: schedule.status,
      trimesterViolations,
      riskLevel
    };
  }

  // === UTILIDADES ===
  
  private createEmptySchedule(memberId: string): CayapaSchedule {
    return {
      memberId,
      assignedDay: 0,
      weekStart: this.getWeekStart(Date.now()),
      status: 'pending',
      hoursCompleted: 0,
      hoursRequired: CAYAPA_CONFIG.hoursPerCayapa,
      compensationHours: 0,
      history: [],
      updatedAt: Date.now()
    };
  }

  private getWeekStart(date: number): number {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - d.getDay()); // lunes inicio semana
    return d.getTime();
  }

  private async notifySupervisingDept(memberId: string, day: WeekDay): Promise<void> {
    // Integrar con notifications system
  }
}
```

---

## 4. Integración con Store (Zustand)

```typescript
// En store.ts - agregar slice cayapa

interface CayapaState {
  schedules: Map<string, CayapaSchedule>;
  employerCompliance: Map<string, EmployerCayapaCompliance>;
  
  // Acciones
  assignCayapaDay: (memberId: string, day: WeekDay, approvedByAssembly: boolean) => Promise<CayapaSchedule>;
  logCayapaCompletion: (data: LogCayapaData) => Promise<CayapaWeekRecord>;
  logCompensation: (data: LogCompensationData) => Promise<CayapaWeekRecord>;
  requestExemption: (data: ExemptionData) => Promise<CayapaExemption>;
  registerEmployer: (employerId: string, employees: string[]) => void;
  auditEmployerCompliance: (employerId: string) => Promise<EmployerCayapaCompliance>;
  getSchedule: (memberId: string) => CayapaSchedule | undefined;
  getWeeklyCompliance: (weekStart: number) => WeeklyComplianceReport;
  getMemberReport: (memberId: string) => MemberComplianceReport;
  autoAssignRotation: () => Promise<void>;
}

interface LogCayapaData {
  memberId: string;
  weekStart: number;
  actualDay: WeekDay;
  hoursWorked: number;
  taskDescription: string;
  supervisedBy: string;
}

interface LogCompensationData {
  memberId: string;
  weekStart: number;
  hoursWorked: number;
  taskDescription: string;
  supervisedBy: string;
}

interface ExemptionData {
  memberId: string;
  reason: CayapaExemption['reason'];
  description: string;
  validUntil: number;
  compensationRequired: boolean;
}
```

---

## 5. Pantalla Cayapa.tsx

```tsx
// src/app/screens/Cayapa.tsx

export function CayapaScreen() {
  const { 
    schedules, 
    assignCayapaDay, 
    logCayapaCompletion, 
    logCompensation,
    requestExemption,
    getWeeklyCompliance,
    getMemberReport,
    autoAssignRotation 
  } = useAppStore();

  const currentWeek = getWeekStart(Date.now());
  const weeklyReport = getWeeklyCompliance(currentWeek);
  const allReports = Array.from(schedules.values()).map(s => getMemberReport(s.memberId));

  return (
    <div className="p-6 space-y-6">
      <Header title="Cayapa Semanal Obligatoria" subtitle="Art 9 - 1 día/semana trabajo comunitario + 1 día descanso inalienable" />
      
      {/* Resumen semanal */}
      <WeeklyComplianceCard report={weeklyReport} />
      
      {/* Asignación días (consenso asamblea) */}
      <Card>
        <CardHeader title="Asignación Días Cayapa" />
        <CardContent>
          <DayAssignmentGrid 
            schedules={Array.from(schedules.values())}
            onAssign={assignCayapaDay}
            onAutoAssign={autoAssignRotation}
          />
        </CardContent>
      </Card>

      {/* Registro cumplimiento */}
      <Card>
        <CardHeader title="Registro Jornada Cayapa" />
        <CardContent>
          <CayapaLogForm 
            onComplete={logCayapaCompletion}
            onCompensate={logCompensation}
            validTasks={CAYAPA_CONFIG.validTasks}
          />
        </CardContent>
      </Card>

      {/* Reportes individuales */}
      <Card>
        <CardHeader title="Estado por Miembro" />
        <CardContent>
          <MemberComplianceTable 
            reports={allReports}
            onRequestExemption={requestExemption}
            onViewHistory={viewHistory}
          />
        </CardContent>
      </Card>

      {/* Empleadores */}
      <EmployerCompliancePanel />
    </div>
  );
}
```

---

## 6. Criterios de Aceptación (Definition of Done)

- [ ] Cada miembro tiene día cayapa asignado (consenso o rotación)
- [ ] Registro cumplimiento: horas, tarea, supervisor, validación
- [ ] Compensación horas pendientes (1.5x multiplicador)
- [ ] Falta leve: inasistencia → amonestación verbal + compensación
- [ ] Falta grave: 3+ amonestaciones/trimestre → suspensión crédito + restricción maquinaria + plan reparación
- [ ] Exenciones: médicas, viaje, emergencia, licencia aprobada → requieren compensación posterior
- [ ] Empleadores: auditoría mensual 2 días libres (descanso + cayapa)
- [ ] Integración: caas.ts (límites crédito), boundaries.ts (restricción maquinaria), justice.ts (plan reparación)
- [ ] Tests: asignación, cumplimiento, compensación, faltas leve/grave, exenciones, empleadores

---

## 7. Referencias Normativas

- **Art 9.a**: Jornada Laboral - 1 día cayapa obligatorio + 1 día descanso inalienable + 5 días trabajo ordinario
- **Art 9.a**: "El día de cayapa puede ser consensuado y coordinado entre el integrante y la Asamblea"
- **Art 9.a**: "Obligación para Empleadores: conceder 2 días libres (descanso + cayapa)"
- **Art 12.1**: Faltas Leves - inasistencia cayapa/asamblea → conversación reflexiva + amonestación verbal + compensación horas
- **Art 12.2**: Faltas Graves - reincidencia 3+ leves/trimestre → amonestación escrita + suspensión crédito + restricción maquinaria + plan reparación
- **Art 13A**: Departamentos supervisores (Hábitat, Agua, Agroecología, Energía, Informática)