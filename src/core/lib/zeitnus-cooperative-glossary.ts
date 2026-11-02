// Glosario de 50 términos fundamentales del cooperativismo financiero
// Basado en Capítulo 18 del documento ZEITNUS 2026

export const GLOSSARY_TERMS = [
  {
    term: 'Asociado',
    category: 'cooperativo',
    definition: 'Persona que integra una cooperativa y participa bajo los derechos y deberes definidos por la ley y los estatutos. Un asociado no es solo un usuario; forma parte de la estructura.',
    examples: ['Juan se asoció a la cooperativa de ahorro y crédito', 'María ejerce su derecho a voto en la asamblea'],
    related: ['Aporte de Capital', 'Capital Social Cooperativo', 'Gobernanza Corporativa'],
    zeitnusApplication: 'En ZEITNUS, el asociado participa en las 10 fases del roadmap, desde la visión hasta el escalamiento responsable.'
  },
  {
    term: 'Aporte de Capital',
    category: 'financiero',
    definition: 'Recursos que una persona entrega a la cooperativa como parte de su participación económica. Este aporte refuerza el patrimonio. No debe confundirse con un depósito de ahorro ni con una acción empresarial tradicional.',
    examples: ['Certificado de aportación de $100', 'Aporte obligatorio inicial de $50'],
    related: ['Capital Social Cooperativo', 'Certificado de Aportación', 'Ahorro'],
    zeitnusApplication: 'En ZEITNUS, los aportes forman el capital base para proyectos productivos y economía circular.'
  },
  {
    term: 'Capital Social Cooperativo',
    category: 'financiero',
    definition: 'Recursos aportados por los asociados que integran el patrimonio de la cooperativa. Sirve como base económica para desarrollar las actividades de la organización.',
    examples: ['Capital social de $50,000 formado por 100 asociados'],
    related: ['Aporte de Capital', 'Patrimonio', 'Certificado de Aportación'],
    zeitnusApplication: 'Base para financiar proyectos de economía circular y economía regenerativa en ZEITNUS.'
  },
  {
    term: 'Certificado de Aportación',
    category: 'legal',
    definition: 'Documento o registro que representa el aporte económico de un asociado en una cooperativa. Su naturaleza depende de la legislación y los estatutos. No equivale de forma automática a una acción de una sociedad anónima.',
    examples: ['Certificado nominativo no negociable', 'Registro digital en blockchain'],
    related: ['Aporte de Capital', 'Capital Social Cooperativo', 'Acción'],
    zeitnusApplication: 'En ZEITNUS, los certificados pueden ser digitales (NFT/blockchain) para trazabilidad y gobernanza.'
  },
  {
    term: 'Cooperativa',
    category: 'cooperativo',
    definition: 'Organización integrada por personas que se unen voluntariamente para atender necesidades comunes mediante una empresa de propiedad conjunta y gestión democrática. Puede realizar diversas actividades económicas según su naturaleza.',
    examples: ['Cooperativa de reciclaje', 'Cooperativa de servicios tecnológicos'],
    related: ['Cooperativa de Ahorro y Crédito', 'Principios Cooperativos', 'Gobernanza Corporativa'],
    zeitnusApplication: 'ZEITNUS promueve ecosistemas de cooperativas especializadas interconectadas.'
  },
  {
    term: 'Cooperativa de Ahorro y Crédito',
    category: 'financiero',
    definition: 'Tipo de cooperativa especializada en servicios financieros para sus miembros, dentro del marco legal. Puede ofrecer productos como ahorro y crédito conforme a las autorizaciones y regulaciones vigentes.',
    examples: ['Coopealianza', 'Coopeande'],
    related: ['Intermediación Financiera', 'Supervisión Financiera', 'SUGEF'],
    zeitnusApplication: 'Fase 9 del roadmap ZEITNUS: evaluar estructura financiera solo si hay condiciones.'
  },
  {
    term: 'Crédito',
    category: 'financiero',
    definition: 'Operación financiera en la que una persona u organización recibe recursos con el compromiso de devolverlos bajo condiciones específicas. Implica una relación de confianza y riesgo de incumplimiento.',
    examples: ['Crédito productivo para maquinaria', 'Crédito de consumo para educación'],
    related: ['Riesgo Crediticio', 'Cartera de Crédito', 'Provisiones'],
    zeitnusApplication: 'En ZEITNUS, créditos orientados a proyectos de economía circular y regenerativa.'
  },
  {
    term: 'Captación',
    category: 'regulatorio',
    definition: 'Actividad mediante la cual una entidad recibe recursos económicos para administrarlos bajo condiciones determinadas. Al ser relevante en el sistema financiero, está sujeta a regulación.',
    examples: ['Captación de ahorro a plazo', 'Captación de aportes de capital'],
    related: ['Intermediación Financiera', 'SUGEF', 'CONASSIF'],
    zeitnusApplication: 'ZEITNUS diferencia captación regulada (SUGEF) de aportes voluntarios no regulados.'
  },
  {
    term: 'Depósito',
    category: 'financiero',
    definition: 'Dinero entregado a una institución financiera bajo condiciones específicas. Puede presentarse en modalidades como ahorro disponible o ahorro a plazo. No todos los depósitos funcionan de la misma manera.',
    examples: ['Ahorro disponible', 'Certificado de depósito a 12 meses'],
    related: ['Ahorro', 'Ahorro a Plazo', 'Certificado de Depósito'],
    zeitnusApplication: 'En ZEITNUS, depósitos = ahorro regulado; aportes = capital cooperativo no regulado igual.'
  },
  {
    term: 'Dividendo',
    category: 'financiero',
    definition: 'Es la distribución de utilidades que suele ocurrir en empresas basadas en acciones. No debe usarse de forma automática para describir beneficios cooperativos, pues su naturaleza jurídica es distinta.',
    examples: ['Dividendo por acción en SA', 'No aplicar a cooperativas'],
    related: ['Excedente Cooperativo', 'Utilidades', 'Aporte de Capital'],
    zeitnusApplication: 'En ZEITNUS, nunca usar "dividendo"; usar "excedente cooperativo" o "retorno cooperativo".'
  },
  {
    term: 'Educación Cooperativa',
    category: 'cooperativo',
    definition: 'Consiste en el proceso por el cual los asociados aprenden sobre principios cooperativos, funcionamiento institucional, derechos, responsabilidades y participación. Es uno de los elementos tradicionales del movimiento cooperativo.',
    examples: ['Taller de principios cooperativos', 'Simulador interés compuesto', 'Checklist verificación'],
    related: ['Principios Cooperativos', 'Alfabetización Financiera', 'Participación Democrática'],
    zeitnusApplication: 'Pilar central de ZEITNUS: educación precede a inversión. Glosario, simulador, checklist, programas.'
  },
  {
    term: 'Excedente Cooperativo',
    category: 'financiero',
    definition: 'Representa el resultado económico positivo que una cooperativa obtiene tras cubrir sus gastos y obligaciones. Su tratamiento depende de la legislación y las decisiones institucionales; no equivale de forma automática a una utilidad empresarial distribuible.',
    examples: ['Excedente destinado a reservas', 'Excedente para educación cooperativa'],
    related: ['Reservas', 'Patrimonio', 'Dividendo (≠)'],
    zeitnusApplication: 'En ZEITNUS, excedentes reinvertidos en educación, proyectos circulares y capital social.'
  },
  {
    term: 'Interés',
    category: 'financiero',
    definition: 'Es la cantidad que se paga o recibe por el uso del dinero durante un periodo determinado. Puede vincularse con préstamos, depósitos u otros productos financieros según corresponda.',
    examples: ['Interés del 5% anual en crédito', 'Interés del 2% en ahorro a plazo'],
    related: ['Tasa de Interés', 'Interés Compuesto', 'Rendimiento'],
    zeitnusApplication: 'Simulador ZEITNUS calcula interés compuesto con inflación, impuestos y comisiones.'
  },
  {
    term: 'Interés Compuesto',
    category: 'financiero',
    definition: 'Es un método matemático en el que los rendimientos se reinvierten y generan nuevos rendimientos sobre el capital acumulado. No implica rentabilidad garantizada.',
    examples: ['$1000 al 5% anual 10 años = $1628 nominal', 'Con inflación 4% = $1040 real'],
    related: ['Interés', 'Rendimiento', 'Inflación', 'Valor Futuro'],
    zeitnusApplication: 'Simulador ZEITNUS incluye inflación, impuestos, comisiones y frecuencia de capitalización.'
  },
  {
    term: 'Inflación',
    category: 'financiero',
    definition: 'Se refiere al aumento general de los precios de bienes y servicios en una economía. Reduce el poder adquisitivo del dinero con el tiempo.',
    examples: ['Inflación 4% anual reduce poder adquisitivo', 'Interés real = nominal - inflación'],
    related: ['Interés Compuesto', 'Rendimiento Real', 'Poder Adquisitivo'],
    zeitnusApplication: 'Simulador ZEITNUS muestra valor real ajustado por inflación.'
  },
  {
    term: 'Inversión',
    category: 'financiero',
    definition: 'Es la asignación de recursos con la expectativa de obtener un beneficio futuro. Toda inversión conlleva cierto nivel de riesgo.',
    examples: ['Inversión en proyecto de reciclaje', 'Inversión en certificado de aportación'],
    related: ['Rendimiento', 'Riesgo Financiero', 'Aporte de Capital'],
    zeitnusApplication: 'ZEITNUS: primero crear valor (proyectos productivos), después administrar capital.'
  },
  {
    term: 'Liquidez',
    category: 'financiero',
    definition: 'Es la capacidad de una persona u organización para disponer de dinero con rapidez cuando lo requiere. Una institución puede poseer muchos activos, pero enfrentar dificultades si carece de liquidez inmediata.',
    examples: ['Ratio liquidez > 1 = saludable', 'Crisis liquidez = incapacidad pagar obligaciones'],
    related: ['Riesgo de Liquidez', 'Activos Líquidos', 'Obligaciones Corto Plazo'],
    zeitnusApplication: 'ZEITNUS monitorea ratio liquidez en dashboard; alerta si < 50%.'
  },
  {
    term: 'Mercado de Valores',
    category: 'regulatorio',
    definition: 'Sistema donde se negocian instrumentos financieros como acciones, bonos u otros valores autorizados. Cuenta con reglas específicas para proteger a los participantes.',
    examples: ['Bolsa de valores', 'Emisión bonos verdes'],
    related: ['SUGEVAL', 'Bono', 'Valor Financiero'],
    zeitnusApplication: 'ZEITNUS evalúa emisión bonos verdes solo si cumple regulación SUGEVAL (Fase 9).'
  },
  {
    term: 'Patrimonio',
    category: 'financiero',
    definition: 'Conjunto de bienes, derechos y recursos económicos que una organización mantiene tras considerar sus obligaciones. En una cooperativa pertenece a la entidad jurídica, no a cada asociado de forma individual.',
    examples: ['Patrimonio neto = Activos - Pasivos', 'Bienes cooperativa = patrimonio entidad'],
    related: ['Capital Social', 'Reservas', 'Excedentes'],
    zeitnusApplication: 'ZEITNUS: patrimonio = base para proyectos productivos y economía circular.'
  },
  {
    term: 'Rendimiento',
    category: 'financiero',
    definition: 'Resultado económico de una inversión o actividad financiera. Puede ser positivo o negativo. No implica una ganancia asegurada.',
    examples: ['Rendimiento 8% anual', 'Rendimiento neto después impuestos/comisiones'],
    related: ['Interés', 'Rendimiento Real', 'Excedente Cooperativo'],
    zeitnusApplication: 'Simulador ZEITNUS muestra nominal, real (inflación) y neto (impuestos/comisiones).'
  },
  {
    term: 'Riesgo Financiero',
    category: 'riesgo',
    definition: 'Posibilidad de que una situación económica genere resultados distintos a los previstos. Puede abarcar pérdidas, falta de liquidez, cambios económicos o fallas administrativas.',
    examples: ['Riesgo crediticio', 'Riesgo de liquidez', 'Riesgo operativo'],
    related: ['Riesgo Crediticio', 'Riesgo de Liquidez', 'Riesgo Operativo', 'Gestión de Riesgos'],
    zeitnusApplication: 'ZEITNUS evalúa 5 riesgos: crediticio, liquidez, tasa interés, operativo, gobierno corporativo, fraude, pérdida capital.'
  },
  {
    term: 'Riesgo Crediticio',
    category: 'riesgo',
    definition: 'Posibilidad de que un deudor no cumpla sus pagos. Es uno de los riesgos principales para las entidades financieras.',
    examples: ['NPL ratio > 8% = alerta', 'Provisiones para préstamos dudosos'],
    related: ['Cartera de Crédito', 'Provisiones', 'NPL Ratio'],
    zeitnusApplication: 'ZEITNUS: diversificar cartera, analizar capacidad pago, provisiones adecuadas.'
  },
  {
    term: 'Riesgo de Liquidez',
    category: 'riesgo',
    definition: 'Posibilidad de que una organización no cumpla sus compromisos inmediatos por falta de recursos disponibles.',
    examples: ['Muchos retiros simultáneos', 'Activos ilíquidos vs obligaciones cortas'],
    related: ['Liquidez', 'Activos Líquidos', 'Gestión de Liquidez'],
    zeitnusApplication: 'ZEITNUS: mantener ratio liquidez > 1, líneas contingencia, diversificar fondeo.'
  },
  {
    term: 'Riesgo Operativo',
    category: 'riesgo',
    definition: 'Posibilidad de pérdidas por errores internos, fallas tecnológicas, problemas administrativos o deficiencias en los procesos.',
    examples: ['Falla sistema pago', 'Error humano en registro', 'Ciberataque'],
    related: ['Ciberseguridad', 'Continuidad Negocio', 'Procesos Automatizados'],
    zeitnusApplication: 'ZEITNUS: madurez tech, automatización, plan continuidad, ciberseguridad.'
  },
  {
    term: 'Riesgo de Gobierno Corporativo',
    category: 'riesgo',
    definition: 'Posibilidad de problemas derivados de una administración deficiente, falta de transparencia o decisiones inadecuadas.',
    examples: ['Concentración poder', 'Falta transparencia', 'Conflictos interés', 'Dirigentes sin preparación'],
    related: ['Gobernanza Corporativa', 'Transparencia', 'Comités', 'Auditoría'],
    zeitnusApplication: 'ZEITNUS: comités (auditoría, riesgos, crédito, gobernanza, educación, tech), transparencia = ventaja competitiva.'
  },
  {
    term: 'Supervisión Financiera',
    category: 'regulatorio',
    definition: 'Actividad realizada por organismos autorizados para vigilar que determinadas entidades cumplan normas y requisitos establecidos. La supervisión reduce riesgos, aunque no elimina por completo la posibilidad de pérdidas.',
    examples: ['SUGEF supervisa coops financieras', 'CONASSIF emite normas'],
    related: ['SUGEF', 'CONASSIF', 'Regulación Financiera'],
    zeitnusApplication: 'ZEITNUS: identificar régimen exacto (INFOCOOP vs SUGEF vs CONASSIF vs SUGEVAL) antes de operar.'
  },
  {
    term: 'Tasa de Interés',
    category: 'financiero',
    definition: 'Porcentaje empleado para calcular el costo o beneficio vinculado al uso del dinero en un periodo determinado.',
    examples: ['Tasa activa (créditos) 12%', 'Tasa pasiva (ahorros) 4%', 'Spread = 8%'],
    related: ['Interés', 'Interés Compuesto', 'Riesgo Tasa Interés'],
    zeitnusApplication: 'ZEITNUS: simulador usa tasa nominal; resultados ajustados por inflación/impuestos.'
  },
  {
    term: 'Usuario Financiero',
    category: 'financiero',
    definition: 'Persona que emplea productos o servicios financieros sin formar parte necesariamente de la propiedad o estructura interna de la institución.',
    examples: ['Cliente banco tradicional', 'Usuario app fintech'],
    related: ['Asociado', 'Cliente', 'Inversionista'],
    zeitnusApplication: 'ZEITNUS: asociado ≠ usuario; asociado = participación + responsabilidad + derechos.'
  },
  {
    term: 'Valor Financiero',
    category: 'financiero',
    definition: 'Instrumento económico que representa un derecho o una obligación financiera y que puede estar regulado en un mercado específico.',
    examples: ['Bono', 'Acción', 'Certificado depósito', 'Derivado'],
    related: ['Mercado de Valores', 'SUGEVAL', 'Bono'],
    zeitnusApplication: 'ZEITNUS: solo emite valores si cumple regulación SUGEVAL (Fase 9).'
  },
  {
    term: 'Gobierno Corporativo',
    category: 'gobernanza',
    definition: 'Conjunto de normas, estructuras y procesos para dirigir, supervisar y controlar una organización. Incluye la forma en que se toman decisiones y se administran responsabilidades.',
    examples: ['Asamblea/Consejo/Gerencia/Comités', 'Política conflictos interés', 'Transparencia'],
    related: ['Asamblea', 'Consejo Administración', 'Comités', 'Transparencia', 'Auditoría'],
    zeitnusApplication: 'ZEITNUS Fase 6: diseñar modelo gobierno; comités especializados (auditoría, riesgos, crédito, gobernanza, educación, tech).'
  },
  {
    term: 'Auditoría',
    category: 'gobernanza',
    definition: 'Proceso de revisión independiente de información financiera, administrativa o de procesos para verificar su confiabilidad y cumplimiento.',
    examples: ['Auditoría externa anual', 'Auditoría interna trimestral', 'Auditoría de sistemas'],
    related: ['Comité Auditoría', 'Transparencia', 'Controles Internos', 'Estados Financieros'],
    zeitnusApplication: 'ZEITNUS: comité auditoría obligatorio; auditoría externa anual; transparencia = ventaja competitiva.'
  },
  {
    term: 'Reservas',
    category: 'financiero',
    definition: 'Recursos que una organización mantiene separados para fortalecer su estabilidad y enfrentar posibles pérdidas.',
    examples: ['Reserva legal 10-20% excedentes', 'Reserva para préstamos dudosos', 'Fondo estabilización'],
    related: ['Excedente Cooperativo', 'Provisiones', 'Capital Adecuado', 'Solvencia'],
    zeitnusApplication: 'ZEITNUS: reservas = salvaguarda institucional; no para distribuir sin control.'
  },
  {
    term: 'Cumplimiento Regulatorio',
    category: 'regulatorio',
    definition: 'Conjunto de procesos orientados a asegurar que una organización opere respetando las leyes, reglamentos y obligaciones aplicables.',
    examples: ['KYC/AML', 'Reportes SUGEF', 'Protección datos', 'Consumer protection'],
    related: ['SUGEF', 'CONASSIF', 'Supervisión Financiera', 'Gobierno Corporativo'],
    zeitnusApplication: 'ZEITNUS: cumplimiento = base confianza; diseñar controles ANTES de recibir recursos.'
  },
  {
    term: 'Intermediación Financiera',
    category: 'regulatorio',
    definition: 'Actividad mediante la cual una entidad recibe recursos de unas personas y los canaliza hacia otras actividades financieras, como préstamos. Debido a su relevancia económica, suele estar regulada.',
    examples: ['Banco: depósitos → créditos', 'Coop ahorro/crédito: aportes/ahorros → créditos'],
    related: ['Captación', 'Crédito', 'SUGEF', 'Supervisión Financiera'],
    zeitnusApplication: 'ZEITNUS: intermediación = supervisión SUGEF; solo Fase 9 si condiciones cumplidas.'
  },
  {
    term: 'Solvencia',
    category: 'financiero',
    definition: 'La capacidad de una organización para cumplir sus compromisos financieros a largo plazo. Una entidad solvente posee una estructura económica capaz de responder por sus obligaciones.',
    examples: ['Ratio solvencia > 10% Basel III', 'Capital / Activos ponderados riesgo'],
    related: ['Capital Adecuado', 'Reservas', 'Riesgo Crediticio', 'Liquidez'],
    zeitnusApplication: 'ZEITNUS: monitorear ratio capital/activos ponderados riesgo en dashboard.'
  },
  {
    term: 'Economía Circular',
    category: 'cooperativo',
    definition: 'Modelo económico que busca transformar la secuencia tradicional (extraer→producir→consumir→desechar) en: reducir residuos, reutilizar materiales, recuperar recursos y crear nuevos ciclos productivos.',
    examples: ['Reciclaje plástico → pellets → nuevos productos', 'Residuos orgánicos → compost → agricultura regenerativa'],
    related: ['Proyectos Circulares', 'Residuos Recuperados', 'Materiales Reutilizados', 'Empleos Verdes'],
    zeitnusApplication: 'ZEITNUS Fase 8: proyectos circulares (reciclaje, agri regenerativa, tech ambientales, construcción ecológica).'
  },
  {
    term: 'Capital Social',
    category: 'cooperativo',
    definition: 'En economía, concepto que abarca elementos como la confianza, las relaciones humanas, la cooperación, el conocimiento compartido y la capacidad de organización. Una comunidad con alto capital social puede desarrollar proyectos más complejos.',
    examples: ['Confianza entre asociados', 'Redes de colaboración', 'Conocimiento compartido'],
    related: ['Confianza', 'Participación Democrática', 'Educación Cooperativa', 'Transparencia'],
    zeitnusApplication: 'ZEITNUS: capital social > capital financiero inicial. Medir confianza, redes, cooperación, conocimiento compartido, capacidad organización.'
  },
  {
    term: 'Alfabetización Financiera',
    category: 'cooperativo',
    definition: 'Capacidad de una persona para comprender conceptos financieros básicos y tomar decisiones informadas sobre ahorro, inversión, crédito y gestión de riesgos.',
    examples: ['Entender interés compuesto', 'Distinguir ahorro vs inversión', 'Evaluar riesgo'],
    related: ['Educación Cooperativa', 'Simulador Interés Compuesto', 'Checklist Verificación'],
    zeitnusApplication: 'ZEITNUS: educación = pilar central; índice alfabetización meta ≥ 80%.'
  },
  {
    term: 'Transparencia Institucional',
    category: 'gobernanza',
    definition: 'Grado en que una organización hace pública su información financiera, decisiones, riesgos y resultados, permitiendo el escrutinio de sus asociados y stakeholders.',
    examples: ['Estados financieros públicos', 'Actas asambleas accesibles', 'Canal denuncias', 'Reporte sostenibilidad'],
    related: ['Gobierno Corporativo', 'Auditoría', 'Participación Asociados', 'Registro Decisiones'],
    zeitnusApplication: 'ZEITNUS: transparencia = ventaja competitiva, no obligación incómoda. Índice meta ≥ 80%.'
  },
  {
    term: 'Participación Democrática',
    category: 'cooperativo',
    definition: 'Mecanismo mediante el cual los asociados ejercen su derecho a participar en la toma de decisiones de la cooperativa, generalmente bajo el principio de un asociado, un voto.',
    examples: ['Voto en asamblea', 'Elección consejo', 'Consultas vinculantes', 'Voto electrónico'],
    related: ['Asamblea', 'Gobierno Corporativo', '1 Asociado = 1 Voto', 'Educación Cooperativa'],
    zeitnusApplication: 'ZEITNUS: participación informada = gobernanza sólida. Educación financiera precede a participación.'
  },
  {
    term: 'SUGEF',
    category: 'regulatorio',
    definition: 'Superintendencia General de Entidades Financieras. Autoridad encargada de supervisar ciertas entidades del sistema financiero nacional. Su propósito principal es contribuir a la estabilidad, solidez y funcionamiento adecuado de las instituciones bajo su control.',
    examples: ['Supervisión prudencial', 'Evaluación riesgos', 'Cumplimiento normativo'],
    related: ['CONASSIF', 'Supervisión Financiera', 'Cooperativa Ahorro/Crédito', 'INFOCOOP (≠)'],
    zeitnusApplication: 'ZEITNUS: SUGEF supervisa SOLO coops con intermediación financiera; INFOCOOP = fomento ≠ supervisión.'
  },
  {
    term: 'CONASSIF',
    category: 'regulatorio',
    definition: 'Consejo Nacional de Supervisión del Sistema Financiero. Órgano encargado de establecer regulaciones generales para diversas áreas del sistema financiero costarricense mediante la emisión de reglamentos y normas para los sectores supervisados.',
    examples: ['Aprueba normas SUGEF', 'Coordina superintendencias', 'Marco regulatorio sistémico'],
    related: ['SUGEF', 'Banco Central', 'Supervisión Financiera', 'Normativa Financiera'],
    zeitnusApplication: 'ZEITNUS: CONASSIF define marco normativo que SUGEF implementa.'
  },
  {
    term: 'INFOCOOP',
    category: 'regulatorio',
    definition: 'Instituto Nacional de Fomento Cooperativo. Entidad pública diseñada para impulsar el desarrollo del cooperativismo en Costa Rica mediante promoción, capacitación, asistencia técnica y financiamiento. NO supervisa actividad financiera.',
    examples: ['Capacitación cooperativa', 'Asistencia técnica', 'Financiamiento desarrollo'],
    related: ['Cooperativa', 'Fomento Cooperativo', 'SUGEF (≠ supervisión)', 'ZEITNUS Fase 2'],
    zeitnusApplication: 'ZEITNUS Fase 2: INFOCOOP para capacitación/educación; NO para supervisión financiera.'
  },
  {
    term: 'Banco Central',
    category: 'regulatorio',
    definition: 'Banco Central de Costa Rica. Encargado de la política monetaria, la estabilidad económica y el funcionamiento general del sistema financiero nacional.',
    examples: ['Política monetaria', 'Tasa interés referencial', 'Reservas internacionales', 'Sistema pagos'],
    related: ['Política Monetaria', 'Inflación', 'Tasa Interés', 'Estabilidad Financiera'],
    zeitnusApplication: 'ZEITNUS: entorno macro regulado por Banco Central afecta tasas, inflación, liquidez.'
  },
  {
    term: 'SUGEVAL',
    category: 'regulatorio',
    definition: 'Superintendencia General de Valores. Interviene en la supervisión del mercado de valores en Costa Rica. Su alcance se vincula con instrumentos financieros negociados en público y con los participantes del mercado de valores.',
    examples: ['Autoriza emisión bonos', 'Supervisa mercado valores', 'Protege inversionistas'],
    related: ['Mercado de Valores', 'Bono', 'Valor Financiero', 'Emisión Valores'],
    zeitnusApplication: 'ZEITNUS: si emite bonos/valores → régimen SUGEVAL (Fase 9).'
  },
];

export type GlossaryTerm = {
  term: string;
  category: 'cooperativo' | 'financiero' | 'legal' | 'regulatorio' | 'riesgo' | 'gobernanza';
  definition: string;
  examples: string[];
  related: string[];
  zeitnusApplication: string;
};