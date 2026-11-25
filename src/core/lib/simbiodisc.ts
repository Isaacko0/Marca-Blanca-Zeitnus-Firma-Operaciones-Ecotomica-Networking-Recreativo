// src/core/lib/simbiodisc.ts
// Métrica Simbiodisc — ALRAC/Zeitnus.
// Panel de cuatro ejes: SD-T (destrabajo), SD-N (nutrición), SD-L (longevidad provisional),
// SD-F (fricción de cuidado). Es un panel, no un número único.
// Reglas anti-distorsión (R4.1-R4.3), ciclo de retroalimentación nodo-usuario (R5.1-R5.7),
// dividendo de destrabajo (R6.1-R6.3).
// Borrador v0.1: umbrales y parámetros provisionales, no valores definitivos.

export type EjeSimbiodisc = 'SD-T' | 'SD-N' | 'SD-L' | 'SD-F';

export interface MedicionSDT {
  id: string;
  hTotal: number;                               // horas: cultivo, mantenimiento, cosecha, verificación, calidad
  personas: number;
  diasNutricionBase: number;
  sdt: number;                                  // H_total / (personas × días)
  hCanasta: number;                             // horas asalariado para canasta de un día
  sdtRel: number;                               // SD-T / H_canasta
  alerta: boolean;                              // true si SD-T sube o >= 1
  fecha: number;
}

export interface MedicionSDN {
  id: string;
  gPSEPorDia: number;                           // gramos de peso seco equivalente por día
  diasContinuos: number;                        // desde t₀
  loteOrigen: string;                           // ID del lote con resultado de calidad
  resultadoCalidad: string;
  diversidadDieta: boolean;                     // no medir solo espirulina
  fecha: number;
}

export interface MedicionSDL {
  id: string;
  diasIngesta: number;                          // exposición acumulada desde t₀
  dosisMedia: number;                           // g PSE promedio diario
  calidadLotes: string[];
  fuerzaAgarre?: number;                        // kg
  fcReposo?: number;                            // pulsaciones por minuto
  presionArterial?: string;                     // ej. "120/80"
  perimetroCintura?: number;                    // cm
  horasSueño?: number;
  regularidadSueño?: boolean;                   // true si regular
  lineaBaseIndividual: string;                  // ID de la línea base t₀ de la persona
  esBiomarcador: boolean;                       // false: es exposición, no biomarcador
  fecha: number;
}

export interface ItemCuidadoSDF {
  id: string;
  nombre: string;
  precioTQ?: number;
  precioZNU?: number;
  tiempoPuertaABoca: number;                    // minutos
  distanciaPuntoEntrega: number;                // km o metros
  pasosPreparacion: number;
  tasaAbandono: number;                         // 0-1
  umbralFriccion: number;                       // umbral para graduación
  adopcionEstable: boolean;
  periodoFijado: number;                        // días
  graduado: boolean;                            // true si alcanzó umbral y adopción estable
  fecha: number;
}

export interface CicloRetroalimentacion {
  id: string;
  fase: 'medir' | 'bajar_friccion' | 'liberar_tiempo' | 'reinvertir' | 'medir_ciclo';
  itemCuidadoId?: string;
  apoyoTrasladado: boolean;                     // true si el apoyo se movió a otro ítem
  cuentaAsambleaSumaCero: boolean;              // true si descuento sale de cuenta asamblea
  subsidioAccesoNoConducta: boolean;            // true si rebaja igual para todos
  pisoEquidad: boolean;                         // true si recursos donde fricción es mayor
  fecha: number;
}

export interface PanelSimbiodisc {
  id: string;
  nodoId: string;
  medicionesSDT: MedicionSDT[];
  medicionesSDN: MedicionSDN[];
  medicionesSDL: MedicionSDL[];
  itemsCuidado: ItemCuidadoSDF[];
  ciclosRetroalimentacion: CicloRetroalimentacion[];
  fechaCreacion: number;
}

let panelIdCounter = 0;
let medicionIdCounter = 0;
let itemCuidadoIdCounter = 0;
let cicloIdCounter = 0;

function nextPanelId(): string {
  panelIdCounter += 1;
  return `simbiodisc-${Date.now()}-${panelIdCounter}`;
}

function nextMedicionId(): string {
  medicionIdCounter += 1;
  return `med-${Date.now()}-${medicionIdCounter}`;
}

function nextItemCuidadoId(): string {
  itemCuidadoIdCounter += 1;
  return `item-${Date.now()}-${itemCuidadoIdCounter}`;
}

function nextCicloId(): string {
  cicloIdCounter += 1;
  return `ciclo-${Date.now()}-${cicloIdCounter}`;
}

/**
 * Crea un panel Simbiodisc para un nodo.
 */
export function crearPanelSimbiodisc(nodoId: string): PanelSimbiodisc {
  return {
    id: nextPanelId(),
    nodoId,
    medicionesSDT: [],
    medicionesSDN: [],
    medicionesSDL: [],
    itemsCuidado: [],
    ciclosRetroalimentacion: [],
    fechaCreacion: Date.now(),
  };
}

/**
 * Calcula SD-T: H_total / (personas × días de nutrición base cubiertos).
 * y SD-T_rel = SD-T / H_canasta.
 * Menor es mejor. Alerta si valor >= 1 o si sube respecto a medición previa.
 */
export function calcularSDT(
  panel: PanelSimbiodisc,
  hTotal: number,
  personas: number,
  diasNutricionBase: number,
  hCanasta: number,
): MedicionSDT {
  if (personas <= 0 || diasNutricionBase <= 0 || hCanasta <= 0) {
    throw new Error('simbiodisc: personas, días y hCanasta deben ser > 0');
  }
  if (hTotal < 0) {
    throw new Error('simbiodisc: H_total no puede ser negativo');
  }

  const sdt = hTotal / (personas * diasNutricionBase);
  const sdtRel = sdt / hCanasta;

  // Alerta si SD-T_rel >= 1 (no libera tiempo frente al mercado)
  // o si sube respecto a la medición previa
  const previa = panel.medicionesSDT[panel.medicionesSDT.length - 1];
  const sube = previa ? sdt > previa.sdt : false;
  const alerta = sdtRel >= 1 || sube;

  const medicion: MedicionSDT = {
    id: nextMedicionId(),
    hTotal,
    personas,
    diasNutricionBase,
    sdt,
    hCanasta,
    sdtRel,
    alerta,
    fecha: Date.now(),
  };
  panel.medicionesSDT.push(medicion);
  return medicion;
}

/**
 * Registra una medición de nutrición SD-N (ingesta verificada desde t₀).
 */
export function registrarIngestaSDN(
  panel: PanelSimbiodisc,
  gPSEPorDia: number,
  diasContinuos: number,
  loteOrigen: string,
  resultadoCalidad: string,
  diversidadDieta: boolean,
): MedicionSDN {
  if (gPSEPorDia < 0 || diasContinuos < 0) {
    throw new Error('simbiodisc: gPSEPorDia y diasContinuos no pueden ser negativos');
  }
  const medicion: MedicionSDN = {
    id: nextMedicionId(),
    gPSEPorDia,
    diasContinuos,
    loteOrigen,
    resultadoCalidad,
    diversidadDieta,
    fecha: Date.now(),
  };
  panel.medicionesSDN.push(medicion);
  return medicion;
}

/**
 * Registra una medición de longevidad provisional SD-L.
 * Línea base individual: cada persona vs su propio t₀. Cambio, no ranking.
 * No es biomarcador, es exposición.
 */
export function registrarMedicionSDL(
  panel: PanelSimbiodisc,
  diasIngesta: number,
  dosisMedia: number,
  calidadLotes: string[],
  lineaBaseIndividual: string,
  medicionesFuncionales?: {
    fuerzaAgarre?: number;
    fcReposo?: number;
    presionArterial?: string;
    perimetroCintura?: number;
    horasSueño?: number;
    regularidadSueño?: boolean;
  },
): MedicionSDL {
  if (diasIngesta < 0 || dosisMedia < 0) {
    throw new Error('simbiodisc: diasIngesta y dosisMedia no pueden ser negativos');
  }
  const medicion: MedicionSDL = {
    id: nextMedicionId(),
    diasIngesta,
    dosisMedia,
    calidadLotes,
    fuerzaAgarre: medicionesFuncionales?.fuerzaAgarre,
    fcReposo: medicionesFuncionales?.fcReposo,
    presionArterial: medicionesFuncionales?.presionArterial,
    perimetroCintura: medicionesFuncionales?.perimetroCintura,
    horasSueño: medicionesFuncionales?.horasSueño,
    regularidadSueño: medicionesFuncionales?.regularidadSueño,
    lineaBaseIndividual,
    esBiomarcador: false,
    fecha: Date.now(),
  };
  panel.medicionesSDL.push(medicion);
  return medicion;
}

/**
 * Registra un ítem de cuidado con su fricción SD-F.
 */
export function registrarItemCuidadoSDF(
  panel: PanelSimbiodisc,
  nombre: string,
  precioTQ?: number,
  precioZNU?: number,
  tiempoPuertaABoca: number = 0,
  distanciaPuntoEntrega: number = 0,
  pasosPreparacion: number = 0,
  tasaAbandono: number = 0,
  umbralFriccion: number = 0,
  periodoFijado: number = 0,
): ItemCuidadoSDF {
  if (tasaAbandono < 0 || tasaAbandono > 1) {
    throw new Error('simbiodisc: tasaAbandono debe estar en [0,1]');
  }
  if (umbralFriccion < 0) {
    throw new Error('simbiodisc: umbralFriccion no puede ser negativo');
  }
  const item: ItemCuidadoSDF = {
    id: nextItemCuidadoId(),
    nombre,
    precioTQ,
    precioZNU,
    tiempoPuertaABoca,
    distanciaPuntoEntrega,
    pasosPreparacion,
    tasaAbandono,
    umbralFriccion,
    adopcionEstable: false,
    periodoFijado,
    graduado: false,
    fecha: Date.now(),
  };
  panel.itemsCuidado.push(item);
  return item;
}

/**
 * Marca un ítem de cuidado como graduado (alcanzó umbral de fricción y adopción estable).
 * El apoyo se traslada al siguiente ítem con mayor fricción.
 */
export function graduarItemCuidado(
  panel: PanelSimbiodisc,
  itemId: string,
): { itemGraduado: ItemCuidadoSDF; siguienteItemConMayorFriccion: ItemCuidadoSDF | null } {
  const item = panel.itemsCuidado.find((i) => i.id === itemId);
  if (!item) {
    throw new Error('simbiodisc: ítem de cuidado no encontrado');
  }
  item.graduado = true;
  item.adopcionEstable = true;

  // Buscar el ítem no graduado con mayor fricción (tasa de abandono más alta)
  const noGraduados = panel.itemsCuidado.filter((i) => !i.graduado);
  const siguiente = noGraduados.length > 0
    ? noGraduados.reduce((prev, curr) =>
        curr.tasaAbandono > prev.tasaAbandono ? curr : prev,
      )
    : null;

  return { itemGraduado: item, siguienteItemConMayorFriccion: siguiente ?? null };
}

/**
 * Procesa un ciclo de retroalimentación nodo-usuario (frontera móvil).
 * medir → bajar fricción y trabajo → liberar tiempo → reinvertir → medir
 */
export function procesarCicloRetroalimentacion(
  panel: PanelSimbiodisc,
  fase: CicloRetroalimentacion['fase'],
  itemCuidadoId?: string,
): CicloRetroalimentacion {
  const ciclo: CicloRetroalimentacion = {
    id: nextCicloId(),
    fase,
    itemCuidadoId,
    apoyoTrasladado: false,
    cuentaAsambleaSumaCero: true,
    subsidioAccesoNoConducta: true,
    pisoEquidad: true,
    fecha: Date.now(),
  };

  // Si la fase es bajar fricción y hay un ítem, marcar apoyo trasladado
  if (fase === 'bajar_friccion' && itemCuidadoId) {
    const item = panel.itemsCuidado.find((i) => i.id === itemCuidadoId);
    if (item && item.graduado) {
      ciclo.apoyoTrasladado = true;
    }
  }

  panel.ciclosRetroalimentacion.push(ciclo);
  return ciclo;
}

/**
 * Verifica si una medición SD-T activa una alerta (valor >= 1 o subió respecto a la previa).
 */
export function activaAlertaSDT(sdtRel: number, previaSdtRel?: number): boolean {
  if (sdtRel >= 1) return true;
  if (previaSdtRel !== undefined && sdtRel > previaSdtRel) return true;
  return false;
}

/**
 * Verifica si el destrabajo es ético: ningún nodo lo logra haciendo que otros trabajen más.
 */
export function esDestrabajoEtico(otrasPersonasTrabajanMas: boolean): boolean {
  return !otrasPersonasTrabajanMas;
}
