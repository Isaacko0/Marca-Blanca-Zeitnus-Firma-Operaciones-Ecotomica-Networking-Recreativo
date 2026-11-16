// HSCSG v15 OS — GI3CF Backup: Marco de Alianza Global de Impacto, Innovación y Abundancia v1.2
// Fuente: Downloads/documentos HSCSG/Marco de Alianza Global de Impacto, Innovación y Abundancia.md
// Asimilación exhaustiva respetando derechos de autor - Solo respaldo del documento original

// ============================================
// DOCUMENTO ORIGINAL - BACKUP COMPLETO
// ============================================

/**
 * MARCO GLOBAL DE IMPACTO, INNOVACIÓN Y ABUNDANCIA v1.2 (2026)
 * Alianza Global por el Impacto, la Innovación y la Abundancia
 * Alianza Global de Interdependencias y Autonomías
 * Global Alliance of Interdependent Autonomies (G-Local / DHE)
 * 
 * Documento marco integrado y propuesta metodológica
 * Taxonomía • Impacto • Evidencia • Reconocimiento • Retribuciones
 * 
 * FUENTES INTEGRADAS:
 * 1. Marco Integrado Gaia ConFederación GAIA-GEN v1.4 (6 nov 2026)
 * 2. Master Strategic Organizational and Development Plan for the Global Alliance for Impact, Innovation & ReGeneration
 * 3. Desarrollo previo del GI3CF, taxonomía 7×16, GI3, bandas de trayectoria, formularios y evaluación
 */

// ============================================
// 1. MARCO COMÚN Y PROPÓSITO
// ============================================

export const MARCO_COMUN_PROPOSITO = `
El Gaia Impact & Innovation Contribution Framework (GI3CF) es el marco común de lenguaje, articulación y aprendizaje de la Alianza Global de Interdependencias y Autonomías (Global Alliance of Interdependent Autonomies). Permite comprender, organizar y hacer visibles las contribuciones de personas, proyectos, organizaciones, Nodos, comunidades y territorios dentro de un Distributed Holonic Ecosystem (DHE).

CINCO FUNCIONES CONECTADAS PERO METODOLÓGICAMENTE DIFERENCIADAS:
1. TAXONOMÍA: Clasificar personas, proyectos, organizaciones, Nodos, capacidades, ofertas, necesidades y resultados mediante 7 categorías principales, 16 subcategorías, especialidades abiertas y relaciones territoriales.
2. IMPACTO: Comprender y evaluar cambios, resultados, calidad de procesos, contribuciones y efectos sistémicos mediante el Gaia Impact & Innovation Index (GI3), dentro de alcance explícito y contextualizado.
3. EVIDENCIA: Documentar fuentes, registros, trazabilidad y mecanismos de verificación, distinguiendo profundidad de evidencia E0–E4 de los 4 Trust Tiers que identifican quién y cómo valida.
4. RECONOCIMIENTO: Representar identidad, competencias, credenciales, endorsements, verificaciones, trayectoria y contribuciones en Gaia Dashboards y Gaia Passport, sin convertirlos automáticamente en certificaciones generales.
5. RETRIBUCIONES: Reconocer, registrar y acordar compensaciones monetarias y no monetarias por tiempo, conocimientos, trabajo, recursos e infraestructura mediante CoRe y mecanismos Commonomics aplicables.

PRINCIPIO RECTOR:
Gaia no necesita desarrollar ni controlar todas las iniciativas. Su función es facilitar que personas, proyectos, organizaciones, comunidades, territorios, recursos, conocimientos e infraestructuras puedan reconocerse, conectarse, colaborar y contribuir a la regeneración de la vida. El GI3CF no crea autoridad central ni supone fusión jurídica. Funciona como protocolo común de articulación, confianza, contribución, reconocimiento y aprendizaje, respetando la autonomía de los Nodos y acuerdos recíprocos.

HORIZONTE ORIENTADOR TRANSVERSAL: Eutopía y Best Possible Now & Future
- Contribuir al "mejor presente y futuro posible" para personas, comunidades y sistemas vivos
- Eutopía (eu = bueno/bien) = construcción realista y continua del mejor mundo posible
- Ir más allá de reducir daños → positividad neta (Net Positivity) demostrable
- Mini-Eutopías y Netpositive Villages como experiencias concretas
- Principio inspirador voluntario, NO condición obligatoria de pertenencia
- Pluralidad: cada participante puede adoptarlo, adaptarlo o expresarlo según su propósito, contexto y autonomía
`;

// ============================================
// 2. ALCANCE, NODOS Y PRINCIPIOS DE DISEÑO
// ============================================

export const TIPOS_NODO = [
  { tipo: 'Persona', descripcion: 'Perfil individual con identidad, capacidades, conocimientos, trayectoria, aprendizaje, necesidades y contribuciones. NO constituye automáticamente un Nodo.' },
  { tipo: 'Nodo-Proyecto', descripcion: 'Iniciativa individual, familiar, asociativa, organizacional o colaborativa que desarrolla actividades, productos, servicios, investigación o soluciones. Puede vincularse a varios Nodos territoriales o temáticos. Unidad fractal básica.' },
  { tipo: 'Nodo-Comunitario', descripcion: 'Grupo de personas vinculadas por convivencia, propósito, cultura, cuidado, cooperación o intereses compartidos. Presencial, virtual o híbrido.' },
  { tipo: 'Nodo Local-Territorial / BioHabitat', descripcion: 'Ecosistema vivo situado que articula comunidades, proyectos, recursos, espacios y relaciones ecológicas y culturales. Puede integrar uno o varios BioHubs.' },
  { tipo: 'BioHub', descripcion: 'Centro de conexión comunitaria (físico, virtual o híbrido). Punto de encuentro, coordinación y provisión de recursos. NO equivale al territorio completo del BioHabitat.' },
  { tipo: 'Nodo Bioregional / Nodo de Bioma', descripcion: 'Articula BioHabitats conectados por cuencas, ecosistemas, corredores biológicos, culturas, economías o relaciones territoriales compartidas.' },
  { tipo: 'Nodo Nacional / Red Nacional', descripcion: 'Conecta acuerdos, redes y capacidades entre Nodos dentro de un país, sin sustituir la autonomía comunitaria, local o territorial.' },
  { tipo: 'Nodo Continental', descripcion: 'Facilita cooperación entre países de una región o continente por proximidad geográfica, relaciones ecológicas, culturales, históricas o estratégicas. Escala geográfica.' },
  { tipo: 'Nodo Lingüístico', descripcion: 'Conecta personas, comunidades y organizaciones que comparten una lengua de trabajo o intercambio. Red transversal y transfronteriza, NO escala geográfica equivalente al Continental.' },
  { tipo: 'Nodo Global / Red Global', descripcion: 'Articula relaciones, conocimientos, capacidades y acuerdos entre Nodos de distintas regiones, respetando la autonomía de sus participantes.' },
  { tipo: 'Intervenciones e innovaciones delimitadas', descripcion: 'Programas, productos, servicios, soluciones, investigaciones, prototipos y pilotos evaluables como unidades específicas dentro de un Nodo-Proyecto u organización.' }
];

export const ESCALAS_NODO = [
  { escala: 'Proyecto', denominacion: 'Nodo-Proyecto', relacion: 'Unidad fractal básica. Individual o colectiva, una o varias categorías temáticas.' },
  { escala: 'Comunitaria', denominacion: 'Nodo-Comunitario', relacion: 'Unidad de convivencia, propósito, cultura, cuidado, cooperación o interés compartido; presencial, virtual o híbrida.' },
  { escala: 'Local / Territorial', denominacion: 'Nodo Local-Territorial / BioHabitat', relacion: 'Ecosistema vivo situado que articula proyectos, comunidades, recursos y relaciones ecológicas y culturales. Puede integrar varios BioHubs.' },
  { escala: 'Centro conexión', denominacion: 'BioHub', relacion: 'Punto de encuentro, coordinación y provisión de recursos; físico, virtual o híbrido. No equivale al territorio completo del BioHabitat.' },
  { escala: 'Bioregional / Bioma', denominacion: 'Nodo Bioregional / Nodo de Bioma', relacion: 'Articula BioHabitats conectados por relaciones ecológicas, hidrológicas, culturales o productivas.' },
  { escala: 'Nacional', denominacion: 'Nodo Nacional / Red Nacional', relacion: 'Conecta acuerdos y capacidades entre Nodos dentro de un país, respetando su autonomía.' },
  { escala: 'Continental', denominacion: 'Nodo Continental', relacion: 'Facilita cooperación entre países de una región o continente por cercanía, afinidad o estrategia; escala geográfica.' },
  { escala: 'Lingüística', denominacion: 'Nodo Lingüístico', relacion: 'Conecta redes y participantes por lengua compartida, independientemente de fronteras continentales o nacionales. Dimensión transversal separada.' },
  { escala: 'Global', denominacion: 'Nodo Global / Red Global', relacion: 'Articula el conjunto de Nodos y redes sin sustituir su autonomía ni imponer autoridad central.' }
];

export const PRINCIPIOS_DISENO = [
  'Subsidiariedad: decisiones en el ámbito más cercano a sus consecuencias, donde existan competencia, legitimidad y capacidad.',
  'Gobernanza policéntrica y holónica: cada Nodo actúa como un todo con responsabilidades delimitadas y participa en sistemas más amplios.',
  'Autonomía e interdependencia: cada Nodo conserva identidad, cultura y decisiones locales mientras acuerda protocolos de colaboración.',
  'Transparencia y trazabilidad: acuerdos, decisiones, recursos, contribuciones y evidencias deben poder comprenderse y revisarse por las partes autorizadas.',
  'Pluralidad e inclusión: no se exige uniformidad cultural, política, espiritual, tecnológica o jurídica, siempre que se respeten acuerdos y salvaguardas comunes.',
  'Integridad y Net Positive: se busca contribución netamente positiva para personas y naturaleza; daños materiales deben hacerse visibles y no se compensan automáticamente con resultados positivos en otras áreas.',
  'Eutopía y Best Possible Now & Future: principio orientador voluntario para contribuir al mejor presente y futuro posible, traduciendo Net Positivity en resultados y decisiones progresivamente mejores. Puede inspirar Mini-Eutopías y Netpositive Villages demostrativos, sin constituir requisito uniforme de pertenencia ni reemplazar autonomía de cada Nodo.',
  'Consentimiento y soberanía de datos: cada participante controla qué información comparte, con qué finalidad y bajo qué permisos.'
];

export const LO_QUE_PUEDE_Y_NO_PUEDE_AFIRMAR = `
El GI3CF PUEDE:
- Describir contribuciones, resultados, prácticas, evidencia y madurez de una innovación dentro de un alcance definido.

El GI3CF NO PUEDE:
- Convertir automáticamente una declaración en un hecho verificado
- Sustituir licencias profesionales, certificaciones sectoriales, permisos estatales o auditorías exigidas por ley
- Demostrar por sí solo causalidad
- Garantizar que un proyecto sea adecuado para toda alianza o inversión
`;

// ============================================
// 3. ARQUITECTURA DE LA GLOBAL ALLIANCE
// ============================================

export const COMPONENTES_GLOBAL_ALLIANCE = [
  {
    numero: 1,
    nombre: 'Global Alliance of Interdependent Autonomies — G-Local / Alliance Initiative — DHE',
    funcion: 'Marco común de convergencia, articulación y cooperación entre autonomías interdependientes. DHE = arquitectura holónica distribuida: personas, comunidades, organizaciones, proyectos, territorios y sistemas participan como unidades con identidad y responsabilidades propias, conectadas mediante acuerdos, principios y protocolos compartidos. NO es entidad central que absorbe participantes ni presupone estructura jurídica única.'
  },
  {
    numero: 2,
    nombre: 'Gaia Network — The Relational Fabric',
    funcion: 'Tejido social y relacional mediante el cual circulan información, oportunidades, conocimiento, colaboración y confianza. Formado por personas, comunidades, organizaciones, proyectos, regiones, empresas, cooperativas, fundaciones, startups, iniciativas de investigación, grupos culturales, fincas regenerativas, plataformas y las relaciones que dan vida al ecosistema.'
  },
  {
    numero: 3,
    nombre: 'Gaia Alliance Network Agency — The Active Professional Capacity',
    funcion: 'Capacidades profesionales y operativas para transformar oportunidades, conocimientos y relaciones en proyectos, servicios, alianzas y resultados concretos. Puede trabajar para la Alianza y con organizaciones externas y mercados. En analogía del cuerpo: musculatura activa y capacidad metabólica que convierte intención y potencial en acción.'
  },
  {
    numero: 4,
    nombre: 'Gaia OS / Digital Layer — The Connective Infrastructure',
    funcion: 'Infraestructura digital conectiva mediante la cual personas, proyectos, información, oportunidades y recursos pueden interactuar. Sistemas nervioso e informacional del ecosistema. Gaia Hub = MetaPlataforma y capa de orquestación; NO confundir con Gaia Impact & Innovation Hub(s) que acompañan desarrollo de iniciativas.'
  },
  {
    numero: 5,
    nombre: 'Gaia Commons — The Commons Stewardship System',
    funcion: 'Custodia, administración, coordinación y distribución de recursos pertenecientes a bienes comunes. Puede desarrollar mecanismos propios de economía, gobernanza, reconocimiento e intercambio. Parte de sistemas que custodian y distribuyen recursos compartidos. Componente de la Alianza, NO sinónimo del conjunto.'
  },
  {
    numero: 6,
    nombre: 'Gaia Global Alliance Fund — The Resource Circulation System',
    funcion: 'Mecanismos para recibir, agregar, coordinar y dirigir recursos financieros y otras formas de apoyo hacia actividades del ecosistema. Arquitectura puede incluir ventanas/vehículos diferenciados: Gaia Impact & Innovation Fund (iniciativas impacto/innovación), fondos específicos para bienes comunes bajo reglas Gaia Commons. Fondo paraguas, ventanas y Fondo de los Comunes deben conservar mandatos, contabilidad, criterios y gobernanza diferenciados. GI3 = insumo de evaluación, NO asignador automático de financiación.'
  },
  {
    numero: 7,
    nombre: 'Gaia Impact & Innovation Hub — The Development System',
    funcion: 'Incuba, acelera, asesora, conecta y fortalece iniciativas con potencial de impacto positivo. Acompaña diagnóstico, diseño de modelos, estructuración, validación, desarrollo organizacional, alianzas y preparación para escalar. Sistema de desarrollo de iniciativas, NO confundir con Gaia Hub digital ni con Gaia Impact & Innovation Fund (financiación).'
  },
  {
    numero: 8,
    nombre: 'Gaia Market — The Exchange System',
    funcion: 'Entorno abierto donde personas descubren e intercambian productos, servicios, programas de educación en línea, experiencias y otras oportunidades y formas de valor. Facilita circulación e intercambio; NO regulador general del ecosistema ni sustituye responsabilidades legales de comerciantes y proveedores.'
  },
  {
    numero: 9,
    nombre: 'Gaia Academy — Universidad Gaia / UniDiversidad y Escuela de la Vida — The Online Learning Ecosystem',
    funcion: 'Facilita educación, intercambio de conocimientos, investigación, sabiduría ancestral y aprendizaje a lo largo de la vida. Contribuye a memoria, capacidad de aprendizaje e inteligencia adaptativa del ecosistema. 16 Facultades organizan trayectorias formativas e investigación conectadas con necesidades reales de los Nodos.'
  },
  {
    numero: 10,
    nombre: 'Gaia EcoHabitats Network — The Living Environments (ConFederación GAIA-GEN)',
    funcion: 'Conecta entornos físicos y ecosistemas donde se despliegan actividades de la Alianza. EcoHabitats NO son simplemente edificios: son entornos vivos donde coexisten vivienda, producción, aprendizaje, encuentro, creación, conservación de biodiversidad y regeneración. ConFederación GAIA-GEN articula BioHabitats y redes territoriales sin sustituir su autonomía.'
  },
  {
    numero: 11,
    nombre: 'Gaia BioHubs — The Centers of CommUnity Connection',
    funcion: 'Centros físicos de conexión comunitaria donde convergen funciones de la Alianza: salud, arte, educación, economía, gobernanza, cultura, comunidad, investigación, producción e intercambio. Nodos locales donde varios sistemas se encuentran y coordinan.'
  },
  {
    numero: 12,
    nombre: 'Gaia BioSchools / BioStudios / BioLabs — Living Labs: The Learning & Experimentation Physical Ecosystem',
    funcion: 'Entornos físicos para aprendizaje, investigación, experimentación, prototipado, emprendimiento e innovación colaborativa. Se articulan con Laboratorios Vivos en contextos reales y contribuyen a capacidad adaptativa y evolutiva de la Alianza.'
  },
  {
    numero: 13,
    nombre: 'Gaia Dashboards & Passport — Identity, Contribution and Trajectory',
    funcion: 'Dashboards hacen visible información contextualizada sobre perfiles, indicadores, evidencias, resultados, contribuciones y evolución. Gaia Passport = identidad digital soberana y registro de perfiles, credenciales, verificaciones, insignias, endorsements y trayectoria. GI3CF = lenguaje común de taxonomía, objetivos, indicadores, evidencias, confianza, impacto, reconocimiento y contribución. GI3 = instrumento multidimensional de evaluación derivado. Gaia Passport NO constituye por sí solo certificación general ni asignador de financiación.'
  }
];

export const COMPONENTES_DIGITALES_GAIA_OS = [
  { nombre: 'QCORE and BeHolder Navigation', definicion: 'QCORE = capacidad distribuida de coordinación, NO intermediario central obligatorio. BeHolder Navigation = centrada en la persona, su propósito y perspectiva para organizar experiencia, ayudar a comprender opciones, conservar registros y controlar información que autoriza compartir.' },
  { nombre: 'EVA — Privacy-focused AI Chief of Staff', definicion: 'Asistente IA enfocado en privacidad, apoya gestión de agenda, correos y tareas directamente mediante WhatsApp o Telegram, sistema de créditos pago por acción (pay-per-action). Integraciones, permisos, datos accesibles y automatizaciones explícitos y controlados por la persona usuaria.' },
  { nombre: 'Holopedia Knowledge Infrastructure', definicion: 'Infraestructura viva de conocimiento que conserva registros de fuentes, notas de evidencia, síntesis, historial de conceptos y bitácoras de decisiones. Propósito: preservar historia de las ideas, proteger autoría, mantener trazabilidad y habilitar aprendizaje y rendición de cuentas.' },
  { nombre: 'Gaia GPS & AI Matching', definicion: 'Capacidad de búsqueda y matchmaking que relaciona habilidades, necesidades, proyectos, investigación, oportunidades, recursos y cuellos de botella operativos para sugerir conexiones. Recomendaciones automatizadas deben poder explicarse, mostrar fuentes y respetar permisos de datos.' }
];

export const RELACION_FUNDAMENTAL = `
La Gaia Network constituye el tejido relacional; la Gaia Alliance Network Agency aporta capacidad profesional y operativa; Gaia OS / Digital Layer conecta información y capacidades; Gaia Commons custodia recursos comunes; Gaia Global Alliance Fund organiza la circulación de recursos; los Gaia Impact & Innovation Hub(s) desarrollan iniciativas; Gaia Market facilita intercambio; Gaia Academy desarrolla aprendizaje; Gaia EcoHabitats Network, BioHubs y Living Labs materializan y experimentan soluciones en territorio; y Gaia Dashboards & Passport hacen visibles identidad, evidencias y trayectoria. El GI3CF aporta el lenguaje común para relacionar estas funciones sin confundir sus mandatos.
`;

export const ARTICULACION_CINCO_PROGRAMAS = [
  { programa: '1. MetaPlataforma y coordinación digital Gaia', funcion: 'Perfiles, directorio, mapa, grupos, mensajería, foros, calendario, repositorio, video, academia, mercado, conectores y Gaia GPS para registrar y conectar datos, capacidades y oportunidades.' },
  { programa: '2. Regeneración Integral: Aprendizaje + Emprendimiento', funcion: 'Universidad Gaia / Escuela de la Vida aporta formación e investigación; los Gaia Impact & Innovation Hub(s) diagnostican, incuban, aceleran y acompañan iniciativas. Ambas vías avanzan en paralelo.' },
  { programa: '3. Certificación de Confianza y Red de Confianza', funcion: 'Permite declarar, documentar, contrastar y verificar identidad, competencias, trayectoria, procesos, acuerdos y resultados mediante cuatro Trust Tiers.' },
  { programa: '4. CoRe: Colaboración, Contribución y Compensación / Commonomics', funcion: 'Reconoce tiempo, conocimiento, trabajo, recursos e infraestructura; registra aportes y acuerdos de compensación con enfoque multicapital.' },
  { programa: '5. Gaia Passport y Visas Descentralizadas', funcion: 'Reúne identidad soberana, credenciales, verificaciones, badges, endorsements, contribuciones y derechos de participación o acceso acordados localmente.' }
];

// ============================================
// 4. DISTINCIONES QUE PROTEGEN LA COHERENCIA
// ============================================

export const DISTINCIONES_SISTEMAS = [
  { sistemas: 'Taxonomía Gaia vs. 16 Facultades', diferencia: 'Taxonomía de 7 categorías y 16 subcategorías clasifica perfiles, proyectos, capacidades, ofertas, necesidades y resultados. Las 16 Facultades organizan itinerarios de aprendizaje, investigación y práctica.' },
  { sistemas: '7 categorías vs. 7 dimensiones transversales', diferencia: 'Categorías organizan el campo temático. Dimensiones transversales describen tipos de transformación que pueden aparecer en cualquiera de las categorías.' },
  { sistemas: 'GI3 vs. Trust Tiers', diferencia: 'GI3 evalúa impacto, calidad, evidencia y contribución. Trust Tiers indican quién y cómo valida una identidad, credencial, proceso o afirmación específica.' },
  { sistemas: 'Trust Tiers vs. E0–E4', diferencia: 'Trust Tiers (4) describen origen y mecanismo de validación. E0–E4 es escala técnica de madurez de evidencia utilizada en componente V del GI3.' },
  { sistemas: 'GI3 vs. madurez académica', diferencia: 'Niveles Introductorio, Intermedio, Avanzado, Maestría/Doctorado describen profundidad formativa; NO son escalones de confianza ni de impacto.' },
  { sistemas: 'GI3 vs. profundidad de participación', diferencia: 'Participar poco o mucho en Gaia no determina por sí solo confianza ni impacto. Son dimensiones independientes.' },
  { sistemas: 'Gaia Hub vs. Gaia Impact & Innovation Hub(s)', diferencia: 'Gaia Hub = MetaPlataforma digital. Impact & Innovation Hubs = unidades de diagnóstico, incubación, aceleración y acompañamiento.' },
  { sistemas: '9 capitales operativos vs. 7 capitales principales de reporte', diferencia: 'Nueve capitales = matriz operativa completa. Vista sintética = 7 capitales principales, mantiene Material/Manufacturado y Ético como divulgaciones complementarias explícitas. Incidencia/Advocacy reemplaza Social; confianza se registra en Ético.' },
  { sistemas: 'Trust Tiers vs. capital Ético', diferencia: 'Trust Tiers indican quién y cómo valida una identidad, credencial, proceso o afirmación. Capital Ético registra integridad, confianza, transparencia, responsabilidad y salvaguardas. Se relacionan, pero no son equivalentes ni se sustituyen.' }
];

// ============================================
// 5. TAXONOMÍA GAIA: 7 CATEGORÍAS × 16 SUBCATEGORÍAS
// ============================================

export const TAXONOMIA_GAIA = [
  { codigo: 'D1', categoria: 'Salud y Bienestar', subcategorias: ['1.1 Medicine & Nutrition', '1.2 Sports, Exercise & Manual Therapy', '1.3 Psycho-Emotional Health & Self development'] },
  { codigo: 'D2', categoria: 'Artes y Actividades Recreativas', subcategorias: ['2.1 Art & Crafts', '2.2 Recreational Activities & Tourism'] },
  { codigo: 'D3', categoria: 'Sistemas Productivos y Finanzas', subcategorias: ['3.1 Production & Logistics', '3.2 Exchange & Financial Systems'] },
  { codigo: 'D4', categoria: 'Gobernanza y Relaciones Humanas', subcategorias: ['4.1 Governance, Political Advocacy & Justice', '4.2 Social Care & Welfare'] },
  { codigo: 'D5', categoria: 'Información y Educación', subcategorias: ['5.1 Education, Learning & Research', '5.2 Media & Communications, ICT'] },
  { codigo: 'D6', categoria: 'Planificación y Gestión del Hábitat', subcategorias: ['6.1 Infrastructure & Housing', '6.2 Agriculture & Natural Resources', '6.3 Nature Restoration & Conservation'] },
  { codigo: 'D7', categoria: 'Espiritualidad y Autorrealización', subcategorias: ['7.1 Self-Realisation', '7.2 Subtle Realms & Cosmic/Universal Laws'] }
];

export const ESPECIALIDADES_EJEMPLOS = [
  'medicina preventiva', 'nutrición', 'yoga', 'psicoterapia', 'artesanía', 'ecoturismo',
  'agroecología', 'comercio justo', 'finanzas regenerativas', 'sociocracia', 'justicia restaurativa',
  'educación alternativa', 'IA aplicada', 'arquitectura bioclimática', 'restauración de cuencas',
  'meditación', 'cosmología'
];

export const REGLA_CLASIFICACION = `
- Cada perfil, proyecto u oferta declara una categoría principal cuando exista foco predominante.
- Puede asociar varias subcategorías pertinentes; clasificación múltiple no implica resultados en todas.
- Especialidades se registran con etiquetas controladas y texto libre revisable.
- Targets se seleccionan según actividades y resultados reales, no solo por afinidad temática.
- Un proyecto puede tener relaciones temáticas y territoriales múltiples; taxonomía no limita vinculación a un único Nodo.
`;

// ============================================
// 6. TARGETS E INDICADORES: MATRIZ 16 × 5 (80 INDICADORES)
// ============================================

export const TARGETS_INDICADORES = [
  {
    id: 'T01',
    categoria: 'D1',
    subcategoria: 'Medicine & Nutrition',
    objetivo: 'Mejorar el acceso, la prevención, la nutrición y el bienestar mediante prácticas y servicios responsables.',
    indicadores: [
      'Personas que acceden a servicios, atención o programas (personas/año).',
      'Proporción de participantes con acceso a prevención, educación o seguimiento pertinente (%).',
      'Cambio en conocimiento o hábitos de salud reportado antes y después (% o escala definida).',
      'Resultados de bienestar o salud documentados dentro del alcance profesional y con salvaguardas (indicador aplicable).',
      'Servicios, becas o productos con condiciones de acceso solidario (%).'
    ]
  },
  {
    id: 'T02',
    categoria: 'D1',
    subcategoria: 'Sports, Exercise & Manual Therapy',
    objetivo: 'Ampliar el acceso a movimiento, actividad física, rehabilitación y terapias manuales seguras.',
    indicadores: [
      'Personas participantes en actividades o sesiones (personas/año).',
      'Sesiones u horas de actividad facilitadas (número/horas).',
      'Continuidad o adherencia de participantes durante el período (%).',
      'Cambio funcional o de movilidad evaluado con método apropiado (escala o prueba).',
      'Programas o cupos accesibles para grupos con barreras de acceso (%).'
    ]
  },
  {
    id: 'T03',
    categoria: 'D1',
    subcategoria: 'Psycho-Emotional Health & Self-development',
    objetivo: 'Fortalecer salud psicoemocional, autoconocimiento y capacidades de desarrollo personal con prácticas éticas.',
    indicadores: [
      'Personas acompañadas o participantes (personas/año).',
      'Horas de acompañamiento, formación o práctica (horas).',
      'Participantes que completan el itinerario acordado (%).',
      'Cambio en bienestar autopercibido con instrumento y condiciones definidos (escala pre/post).',
      'Casos con protocolo de consentimiento, límites, derivación y protección aplicable (%).'
    ]
  },
  {
    id: 'T04',
    categoria: 'D2',
    subcategoria: 'Art & Crafts',
    objetivo: 'Fortalecer la creación artística, los oficios, la diversidad cultural y los medios de vida creativos.',
    indicadores: [
      'Creadores, artesanos o colectivos vinculados (número).',
      'Obras, productos o experiencias creativas realizadas (número).',
      'Personas que participan o acceden a las actividades (personas/año).',
      'Ingresos o compensaciones destinados a creadores y oficios locales (monto o %).',
      'Producción que incorpora materiales, prácticas o procesos responsables (% o descripción verificable).'
    ]
  },
  {
    id: 'T05',
    categoria: 'D2',
    subcategoria: 'Recreational Activities & Tourism',
    objetivo: 'Desarrollar recreación y turismo que fortalezcan comunidades, culturas y territorios anfitriones.',
    indicadores: [
      'Participantes o visitantes atendidos (personas/visitas).',
      'Experiencias, actividades o jornadas realizadas (número).',
      'Proveedores, guías y emprendimientos locales vinculados (número).',
      'Compras y contratación local sobre el gasto operativo pertinente (%).',
      'Intensidad de uso de recursos o manejo responsable de residuos por visitante (unidad definida).'
    ]
  },
  {
    id: 'T06',
    categoria: 'D3',
    subcategoria: 'Production & Logistics',
    objetivo: 'Fortalecer sistemas de producción y logística responsables, trazables, resilientes y regenerativos.',
    indicadores: [
      'Productores, proveedores o unidades productivas vinculadas (número).',
      'Volumen de producción o servicios entregados (unidad sectorial).',
      'Proporción de insumos, lotes o cadena con trazabilidad documentada (%).',
      'Personas empleadas o proveedoras con condiciones y pagos acordados (% o número).',
      'Intensidad de energía, transporte, residuos o emisiones por unidad producida (unidad definida).'
    ]
  },
  {
    id: 'T07',
    categoria: 'D3',
    subcategoria: 'Exchange & Financial Systems',
    objetivo: 'Ampliar intercambios justos y mecanismos financieros solidarios, circulares y multicapital.',
    indicadores: [
      'Volumen y número de transacciones o intercambios registrados (monto y número).',
      'Participantes activos en mecanismos de intercambio o financiación (número).',
      'Proporción de intercambios bajo acuerdos solidarios, mutuales o alternativos (%).',
      'Recursos movilizados y destinados a iniciativas, productores o necesidades definidas (monto).',
      'Aportes, excedentes o recursos reinvertidos en bienes comunes y fondos acordados (% o monto).'
    ]
  },
  {
    id: 'T08',
    categoria: 'D4',
    subcategoria: 'Governance, Political Advocacy & Justice',
    objetivo: 'Fortalecer gobernanza participativa, transparencia, justicia y resolución legítima de asuntos colectivos.',
    indicadores: [
      'Procesos, asambleas o mecanismos participativos activados (número).',
      'Decisiones relevantes documentadas y accesibles a las partes autorizadas (%).',
      'Participación de grupos relevantes en deliberación y decisión (número o diversidad definida).',
      'Acuerdos, compromisos o procesos de mediación implementados dentro del período (%).',
      'Iniciativas de incidencia, justicia o mejora normativa con resultados documentados (número/estado).'
    ]
  },
  {
    id: 'T09',
    categoria: 'D4',
    subcategoria: 'Social Care & Welfare',
    objetivo: 'Ampliar redes de apoyo, cuidado, inclusión y bienestar social de manera digna y corresponsable.',
    indicadores: [
      'Personas que reciben apoyo o se benefician de servicios de cuidado (personas/año).',
      'Horas de cuidado, acompañamiento o apoyo comunitario registradas (horas).',
      'Personas con necesidades identificadas que acceden a apoyos pertinentes (%).',
      'Cuidadores y facilitadores con condiciones, formación o compensación acordadas (%).',
      'Cambio en seguridad, inclusión o bienestar reportado con método contextual (escala/resultado).'
    ]
  },
  {
    id: 'T10',
    categoria: 'D5',
    subcategoria: 'Education, Learning & Research',
    objetivo: 'Ampliar aprendizaje, investigación aplicada, acceso al conocimiento y desarrollo de capacidades.',
    indicadores: [
      'Personas inscritas o participantes en procesos de aprendizaje e investigación (personas/año).',
      'Horas de formación, mentoría, práctica o investigación realizadas (horas).',
      'Participantes que completan el proceso o demuestran competencias definidas (%).',
      'Becas, cupos gratuitos o condiciones de acceso solidario (%).',
      'Recursos de conocimiento, publicaciones, datos o metodologías compartidas (número y licencia).'
    ]
  },
  {
    id: 'T11',
    categoria: 'D5',
    subcategoria: 'Media & Communications, ICT',
    objetivo: 'Fortalecer comunicación útil, acceso a información, tecnologías apropiadas e infraestructura interoperable.',
    indicadores: [
      'Contenidos, recursos o productos de comunicación publicados (número).',
      'Audiencia o usuarios alcanzados y usuarios activos (personas/mes).',
      'Recursos digitales abiertos, accesibles o reutilizables publicados (número o %).',
      'Herramientas, plataformas o servicios tecnológicos desplegados y utilizados (número/uso).',
      'Cumplimiento de prácticas de privacidad, accesibilidad, interoperabilidad y soberanía de datos (criterios verificados).'
    ]
  },
  {
    id: 'T12',
    categoria: 'D6',
    subcategoria: 'Infrastructure & Housing',
    objetivo: 'Desarrollar infraestructura y hábitat construidos saludables, accesibles, resilientes y de bajo impacto.',
    indicadores: [
      'Personas u hogares beneficiados por infraestructura o vivienda (número).',
      'Superficie construida, rehabilitada o mejorada (m²).',
      'Proporción de materiales y procesos con criterios sostenibles documentados (%).',
      'Desempeño de agua, energía, confort o residuos frente a línea base (unidad pertinente).',
      'Accesibilidad, asequibilidad, seguridad y resiliencia de las soluciones (criterios y cobertura).'
    ]
  },
  {
    id: 'T13',
    categoria: 'D6',
    subcategoria: 'Agriculture & Natural Resources',
    objetivo: 'Regenerar sistemas agroalimentarios y gestionar responsablemente suelos, agua, biodiversidad y recursos.',
    indicadores: [
      'Hectáreas bajo manejo agroecológico o regenerativo (ha).',
      'Cambio en indicadores de suelo, agua o biodiversidad seleccionados (unidad y línea base).',
      'Producción de alimentos o materias primas bajo prácticas documentadas (volumen).',
      'Diversidad de cultivos, especies, semillas o sistemas agroforestales (número/índice).',
      'Eficiencia y gestión del agua, nutrientes y otros recursos por unidad de producción (unidad definida).'
    ]
  },
  {
    id: 'T14',
    categoria: 'D6',
    subcategoria: 'Nature Restoration & Conservation',
    objetivo: 'Proteger y restaurar ecosistemas, hábitats, especies y funciones ecológicas.',
    indicadores: [
      'Hectáreas protegidas, conservadas o en restauración (ha).',
      'Supervivencia de especies nativas o recuperación de cobertura/hábitat (% o unidad).',
      'Cambio en indicadores de biodiversidad o condición ecológica seleccionados (unidad).',
      'Presiones o amenazas mitigadas (número, área o intensidad).',
      'Participación y acuerdos de custodia comunitaria o territorial (personas/acuerdos).'
    ]
  },
  {
    id: 'T15',
    categoria: 'D7',
    subcategoria: 'Self-Realisation',
    objetivo: 'Facilitar autoconocimiento, conciencia, prácticas contemplativas y desarrollo integral voluntario.',
    indicadores: [
      'Personas participantes en procesos o comunidades de práctica (personas/año).',
      'Horas de práctica, acompañamiento, estudio o encuentro (horas).',
      'Participantes que sostienen o completan procesos acordados (%).',
      'Cambio en bienestar, autoconocimiento o capacidades autopercibidas con método definido (escala).',
      'Acceso voluntario, diversidad, consentimiento y protocolos de cuidado documentados (criterios).'
    ]
  },
  {
    id: 'T16',
    categoria: 'D7',
    subcategoria: 'Subtle Realms & Cosmic/Universal Laws',
    objetivo: 'Documentar, explorar y transmitir conocimientos sobre cosmologías, tradiciones y realidades sutiles con pluralidad y transparencia.',
    indicadores: [
      'Investigaciones, estudios, registros o documentos producidos (número).',
      'Recursos educativos o experiencias de aprendizaje desarrollados (número).',
      'Participantes que acceden a actividades, contenidos o comunidades de práctica (personas).',
      'Fuentes, métodos, tradiciones y límites de las afirmaciones documentados (% o criterios).',
      'Protocolos de consentimiento, pluralidad, cuidado y distinción entre creencia, interpretación y evidencia (criterios).'
    ]
  }
];

export const REGLA_USO_INDICADORES = `
- Los indicadores describen resultados y contribuciones posibles; no todos aplican a todos los proyectos.
- Deben adaptarse al propósito, tamaño, territorio, etapa, capacidad de medición y riesgo de cada iniciativa.
- No se debe recopilar información sensible si no es necesaria para el fin declarado.
- Indicadores no aplicables se excluyen con justificación; falta de datos no se interpreta automáticamente como cero.
`;

// ============================================
// 7. DIMENSIONES TRANSVERSALES DE IMPACTO SISTÉMICO
// ============================================

export const DIMENSIONES_TRANVERSALES = [
  { dimension: 'Impacto Regenerativo', pregunta: '¿Restaura o mejora condiciones ecológicas, sociales y de bienestar, más allá de reducir daños?' },
  { dimension: 'Impacto en la Transición Económica', pregunta: '¿Transforma relaciones de producción, intercambio, financiación, propiedad o distribución hacia modelos justos, circulares y comunes?' },
  { dimension: 'Impacto Cultural y Educativo', pregunta: '¿Fortalece aprendizaje, transmisión de saberes, creatividad, diversidad cultural y capacidad colectiva?' },
  { dimension: 'Impacto en Innovación de Gobernanza', pregunta: '¿Desarrolla formas participativas, policéntricas, transparentes y responsables de tomar decisiones?' },
  { dimension: 'Impacto en Infraestructura Tecnológica', pregunta: '¿Aporta herramientas, datos, interoperabilidad o infraestructuras digitales de utilidad compartida y soberanía?' },
  { dimension: 'Impacto en Evolución de Conciencia y Espiritualidad', pregunta: '¿Fortalece autoconocimiento, sentido, conciencia, integridad y prácticas respetuosas de la pluralidad?' },
  { dimension: 'Impacto Territorial y Bioregional', pregunta: '¿Fortalece resiliencia, relaciones ecológicas, cultura y capacidades de un territorio o bioregión?' }
];

export const SISTEMAS_INTEGRALES = [
  { sistema: 'Cultura y Significado', funcion: 'Identidad, valores, sentido, diversidad cultural y marcos de significado.' },
  { sistema: 'Información y Conocimiento', funcion: 'Producción, circulación, custodia, acceso y aplicación del conocimiento.' },
  { sistema: 'Gobernanza y Relaciones Humanas', funcion: 'Decisión, coordinación, justicia, cuidado y relaciones entre actores.' },
  { sistema: 'Bienestar Social', funcion: 'Condiciones de vida, salud, inclusión, cuidado y protección social.' },
  { sistema: 'Diseño Económico e Intercambio', funcion: 'Reglas de intercambio, financiación, distribución y economía de los comunes.' },
  { sistema: 'Producción y Circularidad', funcion: 'Sistemas productivos, logística, materiales, residuos y ciclos de recursos.' },
  { sistema: 'Diseño de Hábitat e Infraestructura', funcion: 'Territorio, vivienda, infraestructura, sistemas ecológicos y configuración espacial.' }
];

export const CUATRO_MARCOS_SIETE = `
Las 7 categorías clasifican el tema.
Las 7 dimensiones transversales describen el tipo de impacto.
Los 7 Sistemas Integrales sirven para leer prioridades del Fondo y la transformación civilizatoria.
Los 7 capitales son una vista sintética de valor.
NO deben mezclarse ni sustituirse entre sí.
`;

// ============================================
// 8. GAIA IMPACT & INNOVATION INDEX (GI3): MODELO MATEMÁTICO
// ============================================

export const GI3_MODELO = `
FÓRMULA GENERAL:
GI3 = 0,50 × I + 0,25 × Q + 0,15 × V + 0,10 × C

I, Q, V, C se expresan en escala 0-100.
Los pesos constituyen propuesta de diseño presente en Marco Integrado v1.4 y deben pilotearse antes de institucionalizarse.

COMPONENTES:
I – Impacto y resultados (50%): Resultados de los Targets aplicables y sus indicadores normalizados.
Q – Calidad, coherencia e integridad (25%): Coherencia principios, transparencia, inclusión, ética, sostenibilidad.
V – Verificación y evidencia (15%): Profundidad evidencia E0-E4.
C – Contribución y colaboración en red (10%): Colaboración, intercambio conocimiento, alianzas, participación Gaia, aportes a comunes.
`;

export const GI3_I_IMPACTO = `
CÁLCULO I:
I = Σ (wⱼ × Sⱼ)
Sⱼ = Σ (aₖ × Nₖ)

Donde:
- Sⱼ = puntaje del Target j
- Nₖ = indicador normalizado
- aₖ = pesos de indicadores (suman 1 dentro de cada Target)
- wⱼ = pesos de Targets (suman 1 entre Targets aplicables)

REGLAS:
- Metas y benchmarks deben fijarse antes del período de evaluación con línea base, período, escala, contexto y fuente.
- Para evitar selección oportunista: proyecto debe justificar qué indicadores son aplicables y documentar excluidos.
- Ponderación debe reflejar materialidad, no conveniencia del resultado.
`;

export const GI3_NORMALIZACION = `
TIPOS DE NORMALIZACIÓN:

1. MÁS ES MEJOR (x = resultado observado, T = meta/benchmark):
   N = max(0; min(100; 100 × x/T))
   Puntuación limitada a 100.

2. MENOS ES MEJOR (T = umbral máximo deseado):
   Si x ≤ T: N = 100
   Si x > T: N = max(0; 100 × T/x)
   Para x = 0, se asigna 100 cuando cero es resultado deseable.

3. PROPORCIÓN CON LÍMITES NATURALES (L = límite inferior, U = límite superior):
   N = 100 × min(1; max(0; (x - L)/(U - L)))

4. CUALITATIVO CON RÚBRICA:
   Escala anclada 0, 25, 50, 75, 100
   Cada nivel requiere descripción, evidencia esperada y criterio público.

NO aplicar misma fórmula mecánicamente a porcentajes, conteos, tiempos, calidad ecológica y resultados sociales.
Cuando no exista meta/benchmark fiable: definir rúbrica contextual o reportar dato sin incorporar a puntaje comparativo.
`;

export const GI3_Q_CALIDAD = `
Q – CALIDAD, COHERENCIA E INTEGRIDAD (25%)

Dimensiones y pesos propuestos:
- Coherencia con principios Gaia (20%): Propósito, prácticas y decisiones alineadas con autonomía, reciprocidad, regeneración y cuidado.
- Transparencia y trazabilidad (20%): Registros, acuerdos, cuentas, responsables, decisiones y comunicación de resultados.
- Inclusión y accesibilidad (20%): Condiciones de acceso, participación, no discriminación y atención a barreras.
- Ética y responsabilidad (20%): Consentimiento, prevención de daño, debida diligencia, protección y gestión de conflictos.
- Sostenibilidad / regeneratividad (20%): Gestión de externalidades, ciclos de recursos, restauración y mejora continua.

Cada dimensión debe evaluarse mediante criterios observables y rúbrica común.
Puntaje NO deriva solo de existencia de políticas escritas: se requiere evidencia de implementación proporcional al tamaño, etapa y riesgo.
`;

export const GI3_V_VERIFICACION = `
V – VERIFICACIÓN Y EVIDENCIA (15%)

NIVELES E0-E4:
E0: Declaración propia sin evidencia adjunta → 20 pts
E1: Evidencia básica disponible: registros, fotografías, documentos o enlaces → 40 pts
E2: Registros sistemáticos, consistentes y trazables → 60 pts
E3: Validación de pares, beneficiarios, comunidad o terceros competentes → 80 pts
E4: Auditoría o certificación independiente pertinente al alcance → 100 pts

La puntuación V debe corresponder a la evidencia que respalda los indicadores y afirmaciones evaluadas.
Una certificación en una materia NO valida automáticamente todos los resultados del proyecto.
Metodología de agregación debe ponderar materialidad de cada indicador y registrar qué documento/verificación respalda cada dato.
`;

export const GI3_C_CONTRIBUCION = `
C – CONTRIBUCIÓN Y COLABORACIÓN EN RED (10%)

Dimensiones y pesos:
- Colaboración y promoción colectiva (25%)
- Intercambio de conocimientos y recursos (20%)
- Generación de alianzas y conexiones (20%)
- Participación en iniciativas Gaia (20%)
- Aportes a bienes o recursos comunes (15%)

C reconoce aportaciones relacionales y sistémicas que no siempre aparecen en métricas de resultados del proyecto: abrir redes, compartir conocimiento, apoyar a otros Nodos, co-crear y aportar recursos comunes. Registros operativos pueden apoyarse en CoRe. Participación en campaña específica de promoción colectiva se regula por acuerdo correspondiente y no debe imponerse de forma indiferenciada a todos los perfiles.
`;

export const GI3_COBERTURA = `
COBERTURA DE DATOS:
Cobertura (%) = [Σ(wⱼ × aₖ de indicadores aplicables con datos válidos) ÷ Σ(wⱼ × aₖ de todos los indicadores aplicables)] × 100

- No aplicable (NA): se excluye del denominador con justificación.
- Dato faltante: permanece como indicador aplicable no reportado; reduce cobertura y no se convierte automáticamente en cero.
- Puntuación publicada debe acompañarse siempre de: unidad evaluada, período, cobertura, alcance, composición de evidencia y limitaciones.
- Umbral mínimo de cobertura para emitir puntuación pública debe definirse durante pilotaje; antes mostrar cobertura explícitamente y etiquetar resultados incompletos como provisionales.
- Proyectos nuevos sin historial suficiente se identifican como "En evaluación"; no se penaliza falta de trayectoria.
`;

export const GI3_EJEMPLO = `
EJEMPLO ILUSTRATIVO:
Si iniciativa obtiene I = 80, Q = 90, V = 60, C = 75:
GI3 = (0,50 × 80) + (0,25 × 90) + (0,15 × 60) + (0,10 × 75) = 79,0 / 100

Este resultado solo publicable con período, cobertura, evidencia y salvaguardas visibles; no equivale por sí mismo a certificación ni recomendación de financiación.
`;

export const GI3_SALVAGUARDAS = [
  'Puntaje alto no neutraliza daños graves, vulneraciones de derechos o riesgos no mitigados. Estos pueden activar revisión, suspensión o exclusión, con debido proceso.',
  'GI3 no asigna financiación automáticamente. Es un insumo junto con necesidades, viabilidad, equidad territorial, riesgos y gobernanza.',
  'Indicadores y umbrales deben pilotearse con diversidad de sectores, escalas y contextos para detectar sesgos.',
  'No se recomienda ranking absoluto entre proyectos de naturaleza, tamaño o contexto distintos. Preferible mostrar perfil de impacto, cobertura, evidencia y evolución.',
  'No se debe agregar varias veces el mismo resultado cuando un proyecto forma parte de un Nodo, un programa y un BioHabitat. La atribución y la contribución deben distinguirse.'
];

// ============================================
// 9. PANELES DE REGENERACIÓN
// ============================================

export const PANEL_REGENERACION_INDIVIDUAL = [
  { area: 'Salud y Bienestar', aspectos: 'Nutrición, fuerza y habilidades físicas, prevención y autocuidado; necesidades de apoyo bajo privacidad y sin diagnóstico clínico no autorizado.' },
  { area: 'Artes y Actividades Recreativas', aspectos: 'Expresión artística, creatividad, diversión, recreación y disfrute.' },
  { area: 'Sistemas Productivos y Finanzas', aspectos: 'Estabilidad económica, pagos, ahorro, inversión, compensación justa y relación entre necesidades, ingresos y aportes.' },
  { area: 'Gobernanza y Relaciones Humanas', aspectos: 'Inclusión, participación, equidad, justicia, protección, relaciones, redes de apoyo y cuidado comunitario.' },
  { area: 'Información y Educación', aspectos: 'Formación, capacidades, acceso a información, transparencia, investigación, innovación y aprendizaje.' },
  { area: 'Planificación y Gestión del Hábitat', aspectos: 'Cuidado de agua, aire, suelo y espacios; restauración, residuos, infraestructura saludable, flora, fauna y biodiversidad.' },
  { area: 'Espiritualidad y Autorrealización', aspectos: 'Libertad de creencias y prácticas, desarrollo interior, ética, integridad, conciencia y autoconocimiento.' }
];

export const PROGRAMA_REGENERACION_ORGANIZACIONAL = `
PANEL 1. REGENERACIÓN INTEGRAL DE MIEMBROS
Revisa condiciones que la organización facilita para bienestar y desarrollo integral de trabajadores, contratistas, voluntarios, asociados y otros miembros pertinentes. Considera: alimentación, ejercicio, salud, recreación, condiciones económicas dignas, participación, inclusión, aprendizaje, calidad del entorno, libertad de creencias y apoyos psicoemocionales pertinentes.

PANEL 2. CALIDAD E IMPACTO DE LOS PROCESOS PRODUCTIVOS
Dimensiones:
- Transparencia financiera: Ingresos logrados vs necesarios; ingreso total y excedente; trazabilidad y claridad financiera.
- Personas involucradas e impactadas: Trabajadores, contratistas, productores, comercializadores, clientes, compradores, beneficiarios y otras partes interesadas.
- Impacto económico: Precios, pagos, remuneración, distribución de utilidades o excedentes y circulación territorial del valor.
- Impacto energético y logístico: Energía de transformación, empaque, almacenamiento y transporte; distancias, eficiencia y alternativas.
- Acceso a información y conocimiento: Conocimiento compartido, documentación abierta o licenciada, transferencia de capacidades, formación e innovación.
- Impacto cultural y espiritual: Aportes a identidad, cultura, diversidad, prácticas comunitarias y significado, respetando pluralidad.
- Impacto ecológico y de salud: Efectos en suelo, agua, aire, flora, fauna, biodiversidad y salud humana; restauración y prevención de daños.
- Transición extractiva / StopMining: Reducción o cese de actividades mineras y extractivas dañinas, sustitución de insumos y transición productiva justa.
- Impacto en información y tecnología: Acceso, apropiación, soberanía, interoperabilidad y aportes a infraestructuras tecnológicas comunes.

Los paneles alimentan diagnóstico y mejora continua. GI3 evalúa impactos y contribuciones con alcance explícito. No toda información del bienestar individual debe hacerse pública ni integrarse a índice agregado.
`;

// ============================================
// 10. TRUST TIERS, EVIDENCIA Y CERTIFICACIONES
// ============================================

export const TRUST_TIERS = [
  {
    tier: 1,
    nombre: 'Auto-atestiguado (Self-Attested)',
    queSignifica: 'La persona u organización declara identidad, perfil, capacidades, objetivos, actividades, necesidades, ofertas y resultados.',
    evidenciaValidacion: 'Declaración propia, aceptación de principios de uso y autorización de publicación según configuración. No equivale a verificación independiente.'
  },
  {
    tier: 2,
    nombre: 'Atestiguado por la Comunidad (Community Attested)',
    queSignifica: 'Pares, colaboradores, beneficiarios o miembros de comunidad respaldan información o experiencias de conocimiento directo.',
    evidenciaValidacion: 'Referencias identificables, testimonios autorizados, registros de colaboración y, cuando corresponda, horas compartidas y retroalimentación estructurada.'
  },
  {
    tier: 3,
    nombre: 'Verificado por Embajador/a de Confianza Gaia (Ambassador Verified)',
    queSignifica: 'Persona reconocida y formada para verificar en nombre de la Red, dentro de un mandato definido.',
    evidenciaValidacion: 'Revisión documental, entrevistas, comprobación de actividad, coherencia, referencias, ética, transparencia y, cuando corresponda, visita o constatación en campo.'
  },
  {
    tier: 4,
    nombre: 'Certificado por Terceros (Third-Party Certified)',
    queSignifica: 'Entidad externa competente e independiente verifica o certifica un estándar, proceso, credencial o resultado específico.',
    evidenciaValidacion: 'Certificado o informe externo, entidad emisora, alcance, norma, fecha, vigencia, limitaciones y renovación o auditoría.'
  }
];

export const REGLAS_VERIFICACION = [
  'Toda credencial declara qué verifica: identidad, competencia, trayectoria, proceso, producto, servicio, resultado, impacto o cumplimiento de un acuerdo.',
  'Registra quién verificó, con qué evidencia, bajo qué criterio, en qué fecha y por cuánto tiempo es válida.',
  'La falta de datos no se convierte automáticamente en una evaluación negativa, pero tampoco permite presentar una afirmación como verificada.',
  'Los niveles no se obtienen automáticamente por antigüedad ni por pago; dependen de evidencia y procedimientos transparentes.',
  'Una persona u organización puede tener distintos niveles para distintas credenciales o afirmaciones.',
  'La certificación debe tener alcance acotado; un sello específico no cubre automáticamente todas las dimensiones de una entidad.'
];

export const RELACION_TRUST_TIERS_E0_E4 = `
Los Trust Tiers responden QUIÉN y CÓMO valida. E0–E4 responde CUÁL es la profundidad de la evidencia utilizada en una evaluación cuantitativa. NO hay equivalencia automática entre ambos:
- Una afirmación comunitariamente atestiguada (Tier 2) puede disponer de registros E2 o verificación E3.
- Un tercero puede certificar (Tier 4) un alcance específico sin validar todos los datos del GI3.
`;

export const INTEGRIDAD_APELACION = [
  'Consentimiento informado, minimización de datos y control del participante sobre la información compartida.',
  'Confidencialidad para testimonios y datos personales que no deban ser públicos.',
  'Declaración y gestión de conflictos de interés de pares, Embajadores y certificadores.',
  'Mecanismos de revisión, apelación, corrección y retiro de credenciales cuando cambie la evidencia o se detecte información falsa.',
  'Auditoría periódica y retroalimentación comunitaria para organizaciones certificadas.'
];

// ============================================
// 11. GAIA DASHBOARDS, PASSPORT Y BADGES
// ============================================

export const GAIA_PASSPORT = `
Gaia Passport = contenedor de identidad digital soberana que reúne:
- Perfiles, credenciales, competencias, verificaciones, insignias, endorsements, contribuciones y trayectoria
- Puede incorporar derechos de participación o acceso denominados Visas, definidos por cada Nodo conforme a su gobernanza y capacidad
- Visas descentralizadas = derechos comunitarios o de acceso acordados localmente; NO sustituyen documentos de identidad ni permisos migratorios estatales

FAMILIAS DE RECONOCIMIENTO:
1. Identidad y clasificación: Domain Badge, Subdomain Badge, Specialization Badge, Systemic Impact Badge
2. Confianza y evidencia: Self-Attested, Community Attested, Ambassador Verified, Third-Party Certified
3. Contribución: Knowledge Contributor, Network Builder, Collective Promoter, Commons Contributor, Regeneration Contributor
4. Trayectoria de impacto: Semilla, Germinación, Brote/Plántula, Arbusto, Árbol Grande, Bosque, Ecosistema, Mundo
5. Reconocimientos especiales: Pioneer, Innovator, Ecosystem Partner, Bioregional Leader, Knowledge Guardian, Commons Steward (requieren criterios propios)
`;

export const BANDAS_DESARROLLO_REPLICABILIDAD = [
  { banda: 'Semilla (Seed)', criterio: 'Propósito, necesidad u oportunidad identificada. Existe intención o idea inicial y se empieza a reconocer el potencial de contribución.' },
  { banda: 'Germinación (Germination)', criterio: 'La idea empieza a tomar forma: se define concepto, se identifican personas aliadas, recursos iniciales, hipótesis de cambio y primeros pasos.' },
  { banda: 'Brote / Plántula (Sprout / Seedling)', criterio: 'Surge primera experiencia, prototipo o piloto. Se realizan actividades iniciales y se recogen evidencias tempranas de funcionamiento y aprendizaje.' },
  { banda: 'Arbusto / Árbol pequeño (Shrub / Small Tree)', criterio: 'El modelo empieza a consolidar procesos, equipo, capacidades y resultados. Puede sostener operación inicial y realizar adaptaciones, aunque todavía no alcanza la escala de Bosque.' },
  { banda: 'Árbol Grande (Large Tree)', criterio: 'El modelo demuestra estabilidad, resultados y capacidad organizativa. Cuenta con metodología suficientemente documentada para compartirla o replicarla, pero aún no supera el umbral de más de 10 lugares.' },
  { banda: 'Bosque (Forest)', criterio: 'El modelo de impacto positivo se ha replicado de manera documentada en más de 10 lugares distintos. Se evidencia adaptación a diferentes contextos y continuidad de las implementaciones.' },
  { banda: 'Ecosistema (Ecosystem)', criterio: 'El modelo se ha replicado de manera documentada en más de 100 lugares distintos, formando una red de implementaciones relacionadas y aprendizaje distribuido.' },
  { banda: 'Mundo (World)', criterio: 'El modelo se ha replicado en más de 10.000 lugares en más de 10 países y/o en más de 1.000 lugares en más de 100 países. Representa difusión global demostrable, no solo alcance digital o reconocimiento de marca.' }
];

export const REGLAS_BANDAS = [
  'Estas bandas describen la evolución y replicabilidad del modelo de impacto de un proyecto; NO son rangos de puntuación del GI3, Trust Tiers, niveles académicos ni niveles de participación.',
  'Para Bosque, Ecosistema y Mundo se contabilizan lugares distintos donde el modelo está efectivamente implementado, activo y documentado; no basta con contar seguidores, visualizaciones, contactos, licencias sin uso o sedes nominales.',
  'Cada réplica debe demostrar aplicación del modelo, adaptación contextual y evidencia mínima.',
  'La banda se asigna al modelo o solución delimitada, NO automáticamente a toda la organización que lo impulsa.',
  'Los umbrales indicados son criterios propuestos para pilotaje y deberán contar con reglas de verificación y prevención de doble conteo.',
  'La insignia de trayectoria solo debe emitirse cuando exista cobertura, evidencia y revisión suficientes; debe mostrarse junto al modelo evaluado, el alcance geográfico, el período de referencia y el número de implementaciones verificadas.',
  'Nunca debe interpretarse como una jerarquía de valor entre personas, comunidades u organizaciones.',
  'Cuando un modelo cumple varios umbrales, se asigna la banda más alta cuyo criterio haya sido demostrado y verificado.'
];

export const PROGRESIONES_SEPARADAS = [
  { progresion: 'Confianza', niveles: 'Tier 1 a Tier 4', queRepresenta: 'Origen y profundidad de verificación.' },
  { progresion: 'Evidencia del GI3', niveles: 'E0 a E4', queRepresenta: 'Madurez técnica de evidencia para medir resultados.' },
  { progresion: 'Aprendizaje', niveles: 'Introductorio, Intermedio, Avanzado, Maestría/Doctorado', queRepresenta: 'Profundidad formativa y de investigación.' },
  { progresion: 'Participación', niveles: 'Gradientes PASEO y derechos/Visas acordados', queRepresenta: 'Forma y profundidad de vinculación con Nodos y recursos; reglas aún por formalizar.' }
];

// ============================================
// 12. CORE, COMMONOMICS Y MATRIZ DE NUEVE CAPITALES
// ============================================

export const CORE_DEFINICION = `
CoRe (Colaboración, Contribución y Compensación) reconoce y organiza el tiempo, conocimientos, habilidades, trabajo, recursos e infraestructuras aportados por los participantes. Complementa el GI3: el índice evalúa impacto y contribución; CoRe registra aportes y acuerdos de intercambio o compensación.

MECANISMOS CORE:
- Registros de tiempo y tareas, con acuerdos de alcance, responsabilidad y calidad.
- Reconocimiento de aportes de conocimiento, mentoría, investigación, difusión y apoyo mutuo.
- Intercambios de bienes, servicios, infraestructura, espacios, herramientas y recursos bajo reglas claras.
- Mecanismos de compensación monetaria y no monetaria conforme a acuerdos específicos y normativa aplicable.
- Libros de registro multicapital que hagan visibles contribuciones, compensaciones y beneficios distribuidos.
`;

export const NUEVE_CAPITALES_OPERATIVOS = [
  { capital: 'Financiero', ejemplos: 'Dinero, financiación, crédito, inversión, donaciones, ingresos, excedentes y mecanismos de provisión.' },
  { capital: 'Material / Manufacturado', ejemplos: 'Infraestructura, maquinaria, herramientas, equipos, instalaciones, bienes producidos, tecnología física y activos productivos.' },
  { capital: 'Natural', ejemplos: 'Tierra, agua, biodiversidad, biomasa, suelos, servicios ecosistémicos, conservación y restauración.' },
  { capital: 'Humano', ejemplos: 'Tiempo, trabajo, capacidades, experiencia, conocimientos tácitos, salud ocupacional, cuidado y desarrollo de las personas.' },
  { capital: 'Intelectual', ejemplos: 'Investigación, metodologías, software, diseños, datos, conocimiento documentado, innovación y propiedad intelectual.' },
  { capital: 'Incidencia / Advocacy (reemplaza Social)', ejemplos: 'Participación, representación, movilización, articulación de redes, incidencia pública, advocacy, capacidad de convocar, influir en decisiones colectivas y promover cambios institucionales. NO se utiliza para registrar confianza o integridad, que pertenecen al capital Ético.' },
  { capital: 'Cultural', ejemplos: 'Lenguas, prácticas, patrimonio, creatividad, memoria, identidad, expresiones artísticas y transmisión de saberes.' },
  { capital: 'Ético (incluye confianza)', ejemplos: 'Integridad, confianza, transparencia, responsabilidad, cumplimiento, rendición de cuentas, consentimiento, coherencia, salvaguardas y gestión de conflictos de interés. La confianza se registra aquí como cualidad ética y relacional verificable, NO como un capital Social separado.' },
  { capital: 'Energético / Espiritual', ejemplos: 'Energía y dedicación vital, motivación, propósito, conciencia, prácticas contemplativas y contribuciones espirituales cuando el participante decide registrarlas. Se desglosa en Energético y Espiritual cuando existan indicadores diferenciados y pertinentes.' }
];

export const VISTA_SINTETICA_SIETE_CAPITALES = `
VISTA EJECUTIVA (7 capitales principales):
1. Financiero: Recursos monetarios, financiación, crédito, ingresos, donaciones y excedentes.
2. Natural: Tierra, agua, suelo, biodiversidad, biomasa y servicios ecosistémicos.
3. Humano: Trabajo, tiempo, capacidades, experiencia, cuidado y desarrollo de las personas.
4. Intelectual: Conocimiento, investigación, datos, metodologías, tecnología e innovación.
5. Incidencia / Advocacy: Participación, representación, acción pública, articulación e influencia en decisiones colectivas; reemplaza Social en la vista Gaia.
6. Cultural: Identidad, lenguas, memoria, patrimonio, creatividad y saberes.
7. Energético / Espiritual: Energía, propósito, conciencia y contribuciones espirituales, desglosadas cuando el indicador lo requiera.

DIVULGACIONES COMPLEMENTARIAS EXPLÍCITAS (siempre visibles):
- Material / Manufacturado
- Ético (incluida la confianza)

NO se ocultan dentro de otras categorías. La matriz operativa completa usa 9 capitales; la vista sintética usa 7 para facilitar lectura y comparación. Los datos base permanecen desagregados y no deben sumarse entre unidades incompatibles.
`;

export const COMMONOMICS = `
Commonomics busca que el intercambio económico fortalezca infraestructura común, investigación, becas, capacidades, proyectos y redes territoriales.
- Una porción acordada de las transacciones del Gaia Market puede dirigirse al Tesoro de los Comunes para apoyar la plataforma, la Escuela de la Vida y el Fondo de Impacto.
- Los excedentes operativos, una vez cubiertas necesidades y compromisos, pueden transferirse al Fondo Principal Gaia conforme a reglas aprobadas y transparentes.

PRECAUCIÓN SOBRE PORCENTAJES:
El documento maestro contiene esquema orientativo de distribución (desarrollo de plataforma y proyectos, marketing, referidos, contingencias y facilitación). El Marco Integrado v1.4 señala que esos porcentajes NO constituyen fórmula lista para aplicar: deben recalcularse sobre base común, sumar 100% y validarse comercial, financiera y jurídicamente antes de usarse en contratos.
`;

// ============================================
// 13. INNOVACIÓN: APRENDIZAJE, INCUBACIÓN, INVESTIGACIÓN, DESPLIEGUE
// ============================================

export const DOS_VIAS_PARALELAS = [
  {
    via: 'APRENDIZAJE',
    componentes: 'Universidad Gaia / UniDiversidad y Escuela de la Vida',
    funcion: 'Formación, investigación, desarrollo de capacidades y aprendizaje aplicado.'
  },
  {
    via: 'EMPRENDIMIENTO',
    componentes: 'Gaia Impact & Innovation Hub(s)',
    funcion: 'Diagnóstico, incubación, aceleración, asesoría y fortalecimiento de proyectos y organizaciones.'
  }
];

export const DIEZYSEIS_FACULTADES = [
  { facultad: 'Gobernanza y Justicia Comunitaria', enfoque: 'Sociocracia, holocracia, mediación, derechos ambientales y participación.', alineacion: 'Gobernanza y Relaciones Humanas' },
  { facultad: 'Bio-Educación y Pedagogías Alternativas', enfoque: 'Waldorf, Montessori, Reggio Emilia y aprendizaje regenerativo basado en proyectos.', alineacion: 'Información y Educación' },
  { facultad: 'Infraestructura y Energía Regenerativa', enfoque: 'Construcción natural, arquitectura sostenible, energías renovables y planificación ecológica.', alineacion: 'Planificación y Gestión del Hábitat' },
  { facultad: 'Producción y Gestión de Recursos', enfoque: 'Economía circular, biomímesis, tecnologías limpias y reducción de residuos.', alineacion: 'Sistemas Productivos y Finanzas' },
  { facultad: 'Economía y Comercio Regenerativo', enfoque: 'Economía solidaria, finanzas circulares, banca ética, tokenómica y comercio justo.', alineacion: 'Sistemas Productivos y Finanzas' },
  { facultad: 'Desarrollo Personal y Psicología Transpersonal', enfoque: 'Psicología humanista, liderazgo consciente, inteligencia emocional y acompañamiento.', alineacion: 'Salud y Bienestar / Espiritualidad' },
  { facultad: 'Comunicación, Medios y Tecnología', enfoque: 'Medios regenerativos, tecnologías digitales, descentralización y comunicación.', alineacion: 'Información y Educación' },
  { facultad: 'Turismo y Experiencias Holísticas', enfoque: 'Ecoturismo regenerativo, conexión con la naturaleza y experiencias de bienestar.', alineacion: 'Artes y Actividades Recreativas' },
  { facultad: 'Deportes y Prácticas de Movimiento', enfoque: 'Entrenamiento funcional, yoga, Tai Chi, Qigong, danza y biomecánica.', alineacion: 'Salud y Bienestar' },
  { facultad: 'Salud y Bienestar Integral', enfoque: 'Medicina, terapias, nutrición, prevención y bienestar, según evidencia y alcance profesional.', alineacion: 'Salud y Bienestar' },
  { facultad: 'Medio Ambiente, Ecología y Recursos Sostenibles', enfoque: 'Conservación, regeneración de suelo y agua, biodiversidad y adaptación climática.', alineacion: 'Planificación y Gestión del Hábitat' },
  { facultad: 'Artes y Expresión Cultural', enfoque: 'Música, artes visuales, escénicas y expresiones culturales y ancestrales.', alineacion: 'Artes y Actividades Recreativas' },
  { facultad: 'Ciencias Espirituales y Ancestralidad', enfoque: 'Cosmovisiones, saberes ancestrales, meditación y prácticas contemplativas y ceremoniales.', alineacion: 'Espiritualidad y Autorrealización' },
  { facultad: 'Desarrollo Psicoemocional, Familia y Relaciones Humanas', enfoque: 'Desarrollo infantil, familia, maternidad, relaciones, cuidado y autodesarrollo.', alineacion: 'Salud y Bienestar / Gobernanza' },
  { facultad: 'Agricultura, Materias Primas y Soberanía Alimentaria', enfoque: 'Agroecología, sistemas alimentarios, bosques comestibles y semillas nativas.', alineacion: 'Planificación y Gestión del Hábitat' },
  { facultad: 'Innovación Planetaria Sistémica / Facultad de Síntesis', enfoque: 'Ciencia de datos, IA, seguimiento de salud planetaria y síntesis transdisciplinaria.', alineacion: 'Transversal a las siete categorías' }
];

export const CUATRO_EJES_TRANSDISCIPLINARIOS = [
  { eje: 'Agua, infraestructura y diseño cocreativo de hábitat', trabajo: 'Ingeniería del agua, tecnologías apropiadas, construcción cocreativa y soluciones descentralizadas adaptadas a necesidades locales.' },
  { eje: 'Agrotecnología, IA profunda y biorremediación', trabajo: 'Agroecología, salud del suelo, bioinsumos, sensores, análisis de datos, tecnologías para productividad y restauración.' },
  { eje: 'Longevidad molecular y sanación holística', trabajo: 'Investigación y validación de prácticas preventivas, salud integral y relaciones entre paisaje, comunidad y bienestar; afirmaciones clínicas requieren evidencia y supervisión profesional.' },
  { eje: 'Economía regenerativa y entorno construido', trabajo: 'Economía circular, materiales, energía, oficios, construcción, manufactura y aprendizaje vocacional.' }
];

export const EJE_INNOVACION_MADUREZ = [
  { etapa: 'M0 – Reto identificado', descripcion: 'Necesidad o cuello de botella definido con actores afectados.', evidencia: 'Diagnóstico, contexto y partes interesadas.' },
  { etapa: 'M1 – Concepto y diseño', descripcion: 'Hipótesis de solución, teoría de cambio y diseño inicial.', evidencia: 'Concepto, modelo, riesgos y plan de validación.' },
  { etapa: 'M2 – Prototipo', descripcion: 'Solución o metodología construida y probada a pequeña escala.', evidencia: 'Prototipo, pruebas y registros.' },
  { etapa: 'M3 – Piloto / Living Lab', descripcion: 'Prueba en condiciones reales con usuarios, comunidad o territorio.', evidencia: 'Resultados, datos, retroalimentación y ajustes.' },
  { etapa: 'M4 – Validación operativa', descripcion: 'Evaluación técnica, de proceso, economía y mantenimiento evaluados para un uso definido.', evidencia: 'Desempeño, viabilidad, seguridad y salvaguardas.' },
  { etapa: 'M5 – Replicación y adaptación', descripcion: 'Solución replicada o adaptada a otros contextos sin perder ajuste territorial.', evidencia: 'Casos comparables, acuerdos y aprendizaje de replicación.' }
];

// ============================================
// 14. DATOS, TECNOLOGÍA, SOBERANÍA E IA AUDITABLE
// ============================================

export const GAIA_HUB_METAPLATAFORMA = `
Gaia Hub = federación abierta de aplicaciones, herramientas y plataformas desarrolladas por grupos independientes, colectivos y redes aliadas. NO es sistema monolítico que deba reemplazar toda tecnología existente; es capa de orquestación que permite descubrir, conectar y utilizar servicios diversos con experiencia integrada.

Puede incluir: perfiles, mapa y directorio, video, mensajería, repositorio, foro, calendario, academia, grupos, acceso único, conectores API-first, herramientas de mercado y Gaia GPS.
Sistemas interoperables podrán compartir datos, APIs, credenciales verificables o registros de confianza; no interoperables podrán incorporarse mediante listados, puentes manuales o integraciones parciales.
`;

export const COMPONENTES_DIGITALES_RELACIONADOS = [
  { componente: 'Gaia GPS & AI Matching', relacion: 'Cruza perfiles, habilidades, necesidades, proyectos, investigación, afinidades y recursos para sugerir conexiones y resolver cuellos de botella.' },
  { componente: 'Eva / asistente virtual', relacion: 'Apoya comunicaciones, seguimiento y recordatorios coordinados, sujeto a permisos y controles del usuario.' },
  { componente: 'Holopedia', relacion: 'Conserva fuentes, notas de evidencia, síntesis, historial de conceptos y registros de decisiones.' },
  { componente: 'QCORE', relacion: 'Capacidad distribuida de coordinación, no un intermediario central obligatorio.' },
  { componente: 'BeHolder Navigation', relacion: 'Navegación centrada en la persona y su propósito, preservando agencia individual, control de información y registro de decisiones.' },
  { componente: 'OriGen / trazabilidad', relacion: 'Posibles componentes de trazabilidad, registro e integración de datos y contratos inteligentes, sujetos a diseño y validación.' },
  { componente: 'LMS / Academy', relacion: 'Integra sistemas de aprendizaje, contenidos, cursos, credenciales y seguimiento formativo.' }
];

export const FIDEICOMISO_DATOS_SOBERANIA = `
La infraestructura de datos común debe ser neutral y gobernada por la comunidad, permitiendo usar información estructurada entre plataformas sin obligarlas a compartir sus sistemas internos. Deben distinguirse:
(1) Datos de usuario o tenant bajo control de su titular
(2) Propiedad intelectual de quienes construyen tecnología, conforme a sus licencias
(3) Software, datos o infraestructura común aportados al bien compartido bajo reglas explícitas

REGLAS:
- Definir finalidad, base de autorización, permisos y roles de acceso.
- Establecer retención, portabilidad, interoperabilidad, seguridad, corrección y retiro.
- No asumir que contribuir a un bien común implica renunciar a privacidad o propiedad intelectual.
- Aplicar consentimiento informado y minimizar datos sensibles, especialmente en bienestar, salud, menores de edad y testimonios.
`;

export const PASEO_OPAL_IA_AUDITABLE = `
PASEO = matriz flexible de participación (definiciones operativas, siglas, reglas y documentos jurídicos deben formalizarse antes de despliegue).
OPAL = envoltura o gradiente para gestionar propiedad intelectual y licenciamiento, compartir conocimientos e innovaciones con consentimiento y prevenir apropiación comercial predatoria.

REGLA DE IA AUDITABLE:
Datos verificables → procesos auditables → protocolos explícitos → IA
La IA puede encontrar, relacionar y sintetizar evidencia; NO debe inventarla ni sustituir la validación humana o comunitaria que corresponda.
Toda recomendación automatizada debe indicar: qué fuentes o atributos originaron una coincidencia, los criterios utilizados y sus limitaciones.
La información personal solo se utiliza conforme a permisos y finalidades autorizadas.
`;

// ============================================
// 15. GOBERNANZA, SALVAGUARDAS Y RENDICIÓN DE CUENTAS
// ============================================

export const QUIEN_HACE_QUE = [
  { actor: 'Participante / proyecto evaluado', responsabilidad: 'Declara información, define alcance, establece metas, registra resultados y aporta evidencias.' },
  { actor: 'Equipo GI3CF / custodia metodológica', responsabilidad: 'Mantiene definiciones, taxonomía, diccionario de indicadores, fórmulas, versiones y reglas de calidad.' },
  { actor: 'Comunidad y pares', responsabilidad: 'Aportan referencias y contrastan experiencias directas, declarando conflictos de interés.' },
  { actor: 'Embajadores de Confianza', responsabilidad: 'Verifican afirmaciones dentro de un mandato, formación y alcance documentados.' },
  { actor: 'Certificadores independientes', responsabilidad: 'Certifican o verifican un estándar, proceso o resultado específico dentro de su competencia.' },
  { actor: 'Gaia Impact & Innovation Hub(s)', responsabilidad: 'Utilizan diagnóstico y medición para acompañar mejoras, incubación y aceleración.' },
  { actor: 'Agencia Glocal / BioLabs / Laboratorios Vivos', responsabilidad: 'Articulan alianzas, investigación, validación e implementación en territorio.' },
  { actor: 'Gaia Hub / Gaia OS', responsabilidad: 'Provee infraestructura para perfiles, datos, indicadores, evidencias, conexiones y visualización.' },
  { actor: 'Gaia Commons / Gaia Global Alliance Fund / Gaia Impact & Innovation Fund', responsabilidad: 'Usan la información relevante en sus procesos propios de custodia, asignación o provisión según sus reglas de gobernanza.' }
];

export const SALVAGUARDAS_MINIMAS = [
  'No hacer daño: identificar daños, externalidades y riesgos materiales, incluso cuando existan resultados positivos en otras dimensiones.',
  'Derechos y dignidad: consentimiento, privacidad, no discriminación, protección de participantes y mecanismos de queja.',
  'Conflictos de interés: declaración, recusación y separación entre quien promueve, financia, evalúa y certifica cuando sea necesario.',
  'Verificación proporcional: rigor proporcional a impacto, riesgo, escala, afirmaciones y uso previsto del resultado.',
  'Protección de menores: protocolos específicos de salvaguarda, consentimiento de representantes cuando corresponda, seguridad, acompañamiento y protección de datos.',
  'Salud y bienestar: afirmaciones clínicas o terapéuticas requieren alcance profesional, evidencia, supervisión y derivación pertinente.',
  'Conocimientos ancestrales y culturales: respeto a consentimiento, atribución, contexto, custodia y condiciones de uso definidas por sus comunidades.',
  'Apelación y corrección: procedimientos transparentes para revisar puntuaciones, evidencias, credenciales y decisiones.'
];

// ============================================
// 16. CICLO OPERATIVO DE EVALUACIÓN Y MEJORA (10 PASOS)
// ============================================

export const CICLO_EVALUACION = [
  { paso: 1, accion: 'Registro', resultado: 'Crear perfil de persona, organización, Nodo o intervención; definir titular y permisos.', esperado: 'Identidad y alcance del registro.' },
  { paso: 2, accion: 'Clasificación', resultado: 'Seleccionar categoría, subcategorías, especialidades y relaciones territoriales.', esperado: 'Perfil taxonómico.' },
  { paso: 3, accion: 'Diagnóstico', resultado: 'Aplicar panel individual u organizacional; identificar necesidades, riesgos y capacidades.', esperado: 'Línea base y prioridades.' },
  { paso: 4, accion: 'Objetivos y plan', resultado: 'Seleccionar Targets, indicadores, metas, responsables, salvaguardas y cronograma.', esperado: 'Plan de regeneración e innovación.' },
  { paso: 5, accion: 'Aprendizaje y emprendimiento', resultado: 'Conectar con Escuela de la Vida / UniDiversidad y, cuando corresponda, con Gaia Impact & Innovation Hub(s).', esperado: 'Desarrollo de capacidades y fortalecimiento del proyecto.' },
  { paso: 6, accion: 'Experimentación y validación', resultado: 'Vincular BioLabs, Laboratorios Vivos, comunidad, academia y aliados pertinentes.', esperado: 'Resultados y evidencia de campo.' },
  { paso: 7, accion: 'Registro CoRe', resultado: 'Registrar tiempo, trabajo, conocimiento, recursos, intercambios y compensaciones.', esperado: 'Libro multicapital de contribuciones.' },
  { paso: 8, accion: 'Evaluación', resultado: 'Calcular I, Q, V y C; determinar cobertura, riesgos y limitaciones.', esperado: 'Perfil GI3 contextualizado.' },
  { paso: 9, accion: 'Confianza y Passport', resultado: 'Emitir credenciales o badges dentro de su alcance y Trust Tier pertinente.', esperado: 'Trayectoria verificable y portable.' },
  { paso: 10, accion: 'Conexión y mejora', resultado: 'Usar Gaia GPS / matchmaking para conectar capacidades y necesidades; actualizar metas y evidencias.', esperado: 'Nuevas colaboraciones y ciclo de mejora.' }
];

// ============================================
// 17. IMPLEMENTACIÓN, PILOTAJE Y ASUNTOS POR FORMALIZAR
// ============================================

export const SECUENCIA_IMPLEMENTACION = [
  { fase: 1, enfoque: 'Protocolo y unificación', entregables: 'Diccionario de datos; 7 categorías; 16 subcategorías; Targets e indicadores; permisos; roles y versiones.' },
  { fase: 2, enfoque: 'Registro y diagnóstico', entregables: 'Fichas de proyecto/persona; paneles individuales y organizacionales; líneas base.' },
  { fase: 3, enfoque: 'Pilotos de impacto e innovación', entregables: 'Muestras sectoriales; resultados de normalización; evaluación de sesgos; revisión de pesos.' },
  { fase: 4, enfoque: 'Confianza y Passport', entregables: 'Protocolos de pares y Embajadores; registro de certificados; apelación y renovación.' },
  { fase: 5, enfoque: 'Integración territorial y de capital', entregables: 'Trazabilidad de aportes; intercambios; evidencias de campo; reportes para provisión y gobernanza.' },
  { fase: 6, enfoque: 'Interoperabilidad y expansión', entregables: 'Conectores; datos portables; Gaia GPS; analítica agregada; expansión glocal.' }
];

export const PILOTAJE_GI3 = [
  'Seleccionar proyectos de distinta categoría, tamaño, etapa y territorio, incluyendo iniciativas nuevas y consolidadas.',
  'Probar que los 80 indicadores sean comprensibles, medibles y pertinentes; documentar indicadores no aplicables y dificultades.',
  'Revisar normalizaciones, benchmarks, pesos y riesgo de doble conteo con datos reales.',
  'Comparar puntuaciones con perfiles cualitativos y revisiones independientes para detectar incentivos perversos o sesgos.',
  'Definir el umbral mínimo de cobertura, reglas de publicación, criterios de las ocho bandas de desarrollo y replicabilidad y renovación de reconocimientos después del piloto.',
  'Publicar la metodología, limitaciones, cambios de versión y mecanismos de apelación.'
];

export const ASUNTOS_POR_FORMALIZAR = [
  'Gobernanza y custodio formal de la taxonomía, indicadores, GI3 y versiones metodológicas.',
  'Definiciones técnicas completas de cada indicador: unidad, fórmula, fuente, frecuencia, inclusiones, exclusiones y desagregación.',
  'Pesos por Target e indicador, materialidad y reglas de normalización para cada tipo de variable.',
  'Umbral de cobertura y criterios de publicación de puntuaciones.',
  'Procedimiento, formación, mandato y supervisión de Embajadores de Confianza Gaia.',
  'Reconocimiento mutuo de verificaciones de otras redes, si se acuerda expresamente.',
  'Criterios de emisión, vigencia, suspensión y retiro de Certificación Gaia y badges especiales.',
  'Política de datos, consentimiento, retención, portabilidad, seguridad y privacidad.',
  'Definiciones operativas, siglas, reglas y documentos jurídicos de PASEO y OPAL.',
  'Matriz de participación, derechos de acceso / Visas y su relación con los Trust Tiers.',
  'Reglas de CoRe, valoración multicapital, compensación y distribución de excedentes.',
  'Validación legal, financiera, fiscal y regulatoria de instrumentos, fondos, tokens, servicios y mecanismos en cada jurisdicción.'
];

export const ESTATUS_MARCO = `
Este documento consolida la arquitectura conceptual de la Alianza Global de Interdependencias y Autonomías y propone una metodología operativa. Los componentes, pesos, indicadores, umbrales y protocolos identificados como propuestas de pilotaje NO deben presentarse como estándares ya certificados, emitidos o plenamente implementados. La adopción final corresponde a los mecanismos de gobernanza competentes de la Alianza Global y de los Nodos que adopten el marco. Eutopía / Best Possible Now & Future es un principio inspirador voluntario, NO una condición obligatoria de pertenencia.
`;

// ============================================
// 18. GLOSARIO Y FUENTES
// ============================================

export const GLOSARIO_CLAVE = [
  { termino: 'Alianza Global de Interdependencias y Autonomías / Global Alliance of Interdependent Autonomities', uso: 'Marco común de convergencia y cooperación entre autonomías interdependientes; se articula como iniciativa G-Local y Distributed Holonic Ecosystem (DHE).' },
  { termino: 'Global Alliance / G-Local / Alliance Initiative', uso: 'Denominación y orientación de la Alianza Global como movimiento e infraestructura de colaboración glocal, distribuida y no centralizada.' },
  { termino: 'DHE — Distributed Holonic Ecosystem', uso: 'Ecosistema Holónico Distribuido: arquitectura en la que cada Nodo mantiene identidad, autonomía y responsabilidades propias mientras participa en sistemas más amplios.' },
  { termino: 'Gaia Network', uso: 'Tejido relacional de personas, comunidades, organizaciones, proyectos, regiones, empresas, plataformas y vínculos a través del cual circulan información, oportunidades, conocimiento, colaboración y confianza.' },
  { termino: 'Gaia Alliance Network Agency', uso: 'Capacidad profesional y operativa que convierte oportunidades, conocimientos y relaciones en proyectos, servicios, alianzas y resultados.' },
  { termino: 'Gaia OS / Digital Layer', uso: 'Infraestructura digital conectiva de la Alianza; incluye la MetaPlataforma Gaia Hub y otras herramientas interoperables.' },
  { termino: 'Gaia Hub', uso: 'MetaPlataforma digital y capa de orquestación de perfiles, mapa, directorio, contenidos, datos, conexiones, servicios y matchmaking. No equivale a los Gaia Impact & Innovation Hub(s).' },
  { termino: 'QCORE', uso: 'Capacidad distribuida de coordinación que no requiere un intermediario central obligatorio.' },
  { termino: 'BeHolder Navigation', uso: 'Navegación centrada en la persona y su propósito, que preserva agencia individual, registros y control de información autorizada.' },
  { termino: 'EVA', uso: 'Asistente de IA enfocado en privacidad, concebido como Chief of Staff para agenda, correos y tareas mediante WhatsApp o Telegram, con sistema de créditos por acción, sujeto a permisos e integraciones.' },
  { termino: 'Holopedia', uso: 'Infraestructura viva de conocimiento que conserva fuentes, notas de evidencia, síntesis, historial de conceptos y bitácoras de decisiones para proteger autoría y aprendizaje responsable.' },
  { termino: 'Gaia Commons', uso: 'Sistema de custodia, administración, coordinación y distribución de recursos pertenecientes a bienes comunes, con gobernanza propia.' },
  { termino: 'Gaia Global Alliance Fund', uso: 'Sistema general de circulación, agregación y coordinación de recursos financieros y otras formas de apoyo de la Alianza Global.' },
  { termino: 'Gaia Impact & Innovation Fund', uso: 'Fondo o ventana de financiación dedicada a iniciativas de impacto e innovación, diferenciada del Gaia Impact & Innovation Hub y con reglas de gobernanza y asignación propias.' },
  { termino: 'Gaia Impact & Innovation Hub(s)', uso: 'Unidades de diagnóstico, incubación, aceleración, asesoría, conexión y fortalecimiento de proyectos y organizaciones. Constituyen la vía de desarrollo y no son un fondo ni la MetaPlataforma Gaia Hub.' },
  { termino: 'Gaia Market', uso: 'Entorno abierto de descubrimiento e intercambio de productos, servicios, programas educativos y otras formas de valor.' },
  { termino: 'Gaia Academy / Universidad Gaia / UniDiversidad y Escuela de la Vida', uso: 'Ecosistema de aprendizaje en línea, educación, investigación, sabiduría ancestral y desarrollo continuo de capacidades.' },
  { termino: 'Gaia EcoHabitats Network / ConFederación GAIA-GEN', uso: 'Red y estructura de articulación territorial que conecta BioHabitats, BioHubs y Nodos autónomos.' },
  { termino: 'BioHabitat', uso: 'Ecosistema territorial vivo y regenerativo; puede alojar varios BioHubs, comunidades y Nodos-Proyecto.' },
  { termino: 'BioHub', uso: 'Centro físico, virtual o híbrido de conexión comunitaria y convergencia de funciones de la Alianza.' },
  { termino: 'BioSchool / BioStudio / BioLab', uso: 'Entorno físico de aprendizaje, investigación, experimentación, prototipado y emprendimiento; puede operar como Living Lab.' },
  { termino: 'Nodo', uso: 'Unidad neutral de articulación en cualquier escala geográfica, comunitaria o funcional; no implica por sí misma jerarquía de autoridad.' },
  { termino: 'Nodo-Proyecto', uso: 'Proyecto personal o colectivo que funciona como unidad fractal básica de actividad y contribución.' },
  { termino: 'Nodo-Comunitario', uso: 'Comunidad organizada por convivencia, propósito, cultura, cuidado, cooperación o intereses compartidos, presencial, virtual o híbrida.' },
  { termino: 'Nodo Local-Territorial', uso: 'Unidad de articulación situada y vinculada a un territorio; puede expresarse como BioHabitat y conectar uno o varios BioHubs.' },
  { termino: 'Nodo Continental', uso: 'Nodo de articulación geográfica que facilita cooperación entre países de una región o continente.' },
  { termino: 'Nodo Lingüístico', uso: 'Nodo transversal y transfronterizo que conecta participantes por una lengua compartida; es distinto y separable del Nodo Continental.' },
  { termino: 'Nodo Bioregional / Nodo de Bioma', uso: 'Articulación de BioHabitats conectados por relaciones ecológicas, hidrológicas, culturales o productivas.' },
  { termino: 'GI3CF — Gaia Impact & Innovation Contribution Framework', uso: 'Marco común de lenguaje y metodología para taxonomía, objetivos, indicadores, evidencias, confianza, impacto, reconocimiento y contribución.' },
  { termino: 'GI3 — Gaia Impact & Innovation Index', uso: 'Instrumento multidimensional de evaluación derivado del GI3CF; no es por sí solo una certificación ni un asignador automático de financiación.' },
  { termino: 'Gaia Dashboards', uso: 'Paneles de visualización de perfiles, indicadores, evidencias, impactos, contribuciones y trayectorias, con alcance y permisos configurables.' },
  { termino: 'Gaia Passport', uso: 'Identidad digital soberana y registro de perfiles, credenciales, verificaciones, insignias, endorsements, contribuciones y trayectoria; no constituye por sí solo una certificación general.' },
  { termino: 'Trust Tier', uso: 'Nivel de verificación de una persona, organización, Nodo, credencial o afirmación; indica quién y cómo valida.' },
  { termino: 'E0–E4', uso: 'Niveles técnicos de profundidad de evidencia utilizados en evaluación; no son equivalentes automáticos a los Trust Tiers.' },
  { termino: 'CoRe', uso: 'Colaboración, Contribución y Compensación: sistema para reconocer, registrar y acordar retribuciones monetarias y no monetarias mediante una matriz multicapital.' },
  { termino: 'Capital Material / Manufacturado', uso: 'Infraestructura, maquinaria, herramientas, equipos, instalaciones, bienes producidos y activos productivos.' },
  { termino: 'Capital de Incidencia / Advocacy', uso: 'Capital que reemplaza al capital Social dentro de la matriz operativa Gaia; registra participación, representación, movilización, articulación e influencia colectiva.' },
  { termino: 'Capital Ético', uso: 'Capital que incluye integridad, confianza, transparencia, responsabilidad, cumplimiento, consentimiento y salvaguardas.' },
  { termino: 'Capital Energético / Espiritual', uso: 'Capital que registra energía y dedicación vital, propósito, conciencia y aportes espirituales; puede desglosarse cuando los indicadores lo requieran.' },
  { termino: 'Eutopía', uso: 'Principio orientador voluntario que busca el mejor presente y futuro posible mediante decisiones realistas, mejora continua y contribución netamente positiva. No es requisito obligatorio de pertenencia.' },
  { termino: 'Best Possible Now & Future', uso: 'Horizonte de construcción del mejor presente y futuro posible para personas, comunidades y sistemas vivos, de forma individual y colectiva.' },
  { termino: 'Net Positivity / Positividad Neta', uso: 'Orientación a producir un impacto positivo neto, demostrable y cuantificable, y no limitarse a reducir impactos negativos. Los daños materiales deben hacerse visibles.' },
  { termino: 'Mini-Eutopia', uso: 'Comunidad, iniciativa o territorio que demuestra en la práctica formas de vida, cooperación y organización que contribuyen al mejor presente y futuro posible.' },
  { termino: 'Netpositive Village', uso: 'Aldea o comunidad entendida como unidad demostrativa donde se prueba la viabilidad de un modelo netamente positivo.' },
  { termino: 'Bandas de desarrollo y replicabilidad', uso: 'Semilla (Seed), Germinación (Germination), Brote/Plántula (Sprout/Seedling), Arbusto/Árbol pequeño (Shrub/Small Tree), Árbol Grande (Large Tree), Bosque (Forest), Ecosistema (Ecosystem) y Mundo (World). Describen madurez y replicabilidad del modelo, no el puntaje GI3.' },
  { termino: 'Eutopia Society', uso: 'Referencia conceptual al movimiento de construcción del Best Possible Now & Future; en este marco se integra como inspiración voluntaria y no como condición de afiliación.' },
  { termino: 'Laboratorio Vivo / Living Lab', uso: 'Entorno real de investigación, experimentación, aprendizaje y validación de soluciones junto a comunidades y territorios.' },
  { termino: 'Vía de Aprendizaje', uso: 'Gaia Academy / Universidad Gaia / UniDiversidad y Escuela de la Vida: formación, investigación, aprendizaje aplicado y desarrollo de capacidades.' },
  { termino: 'Vía de Emprendimiento', uso: 'Gaia Impact & Innovation Hub(s): diagnóstico, incubación, aceleración, asesoría y fortalecimiento de proyectos y organizaciones; opera en paralelo con la vía de aprendizaje.' }
];

export const FUENTES_DOCUMENTALES = [
  'Marco Integrado Gaia ConFederación GAIA-GEN v1.4. Documento de integración y adaptación estratégica, 6 de noviembre de 2026.',
  'Master Strategic Organizational and Development Plan for the Global Alliance for Impact, Innovation & ReGeneration. Documento maestro estratégico y de desarrollo.',
  'Desarrollo previo del Gaia Impact & Innovation Contribution Framework, la taxonomía de siete categorías y dieciséis subcategorías, el Gaia Impact & Innovation Index, las bandas de trayectoria y las propuestas de formulario y evaluación desarrolladas en esta conversación y ajustadas a los documentos fuente.'
];

// ============================================
// PRINCIPIOS FUNDAMENTALES GAIA (del final del documento)
// ============================================

export const PRINCIPIOS_FUNDAMENTALES_GAIA = [
  {
    titulo: 'Simbiosis entre el Servicio a la Vida y al Ser y la Unicidad Indivisible',
    descripcion: 'El bienestar individual y colectivo son expresiones interdependientes de una misma dinámica vital. En un organismo sano, cada parte nutre al todo y el todo sostiene a cada parte. Así, cuidar y potenciar al individuo fortalece al conjunto, mientras que servir a otros beneficia también al propio ser. El servicio deja de ser sacrificio y se convierte en una expresión natural de unicidad, reciprocidad y beneficio mutuo.'
  },
  {
    titulo: 'Inteligencia Descentralizada y Distribuida',
    descripcion: 'La naturaleza florece a través de redes diversas, interconectadas y autoorganizadas. Gaia adopta esta arquitectura, distribuyendo el poder, la gobernanza y la creación de valor en un ecosistema global resiliente, sin puntos únicos de control o fallo. El conocimiento pertenece a toda la vida. Nos comprometemos con protocolos abiertos, colaboración transparente y la síntesis de tecnología de vanguardia con sabiduría ecológica probada por el tiempo.'
  },
  {
    titulo: 'Inteligencia Cósmica y Colectiva',
    descripcion: 'Creemos que las mejores decisiones se toman cuando integramos el conocimiento y la experiencia colectiva con la eterna sabiduría ancestral. Uniendo a científicos, artistas, constructores, investigadores, guardianes y visionarios en una red multidisciplinaria global sincronizada para la acción localizada.'
  },
  {
    titulo: 'Autonomía, Interdependencia y Propósito Compartido',
    descripcion: 'El organismo no obedece a un nodo central, sino que opera mediante un consenso que emerge desde las bases. Al igual que una bandada de pájaros o una red neuronal, el sistema se mantiene unido por una visión común (su "ADN" o propósito de evolución). Esto permite que millones de partes autónomas procesen información localmente y tomen decisiones conjuntas para actuar en perfecta sincronía.'
  },
  {
    titulo: 'Eutopía: el mejor presente y futuro posibles',
    descripcion: 'Derivado del griego eu, que significa "bueno" o "bien", Eutopía representa una sociedad viva que evoluciona continuamente hacia el mejor resultado posible para todos los seres sintientes. Surge mediante la alineación de personas, sistemas con propósito y la elección consciente y cotidiana de crear el mundo que debería existir.'
  },
  {
    titulo: 'Valor Anclado en la Vitalidad',
    descripcion: 'Los valores económicos deben crear abundancia, justicia y ecosistemas saludables. Cada acción, algoritmo y modelo económico dentro del Ecosistema Gaia debe dejar el tejido ecológico y social circundante más sano de lo que lo encontró. Medimos el progreso no solo por la producción, sino por la vitalidad restaurada: agua limpia, suelo próspero, biodiversidad, energía limpia, personas sanas y relaciones armónicas.'
  },
  {
    titulo: 'Economía Regenerativa',
    descripcion: 'Creación de modelos económicos que recompensan la restauración ecológica, la reducción de carbono, la resiliencia comunitaria y el bienestar integral.'
  },
  {
    titulo: 'Eficiencia Orgánica y Plenitud',
    descripcion: 'La búsqueda del menor esfuerzo no es pereza, sino la ley fundamental de economía de energía en la naturaleza. El organismo siempre busca el camino de menor resistencia para que la vitalidad no se desperdicie en fricciones internas. Ese ahorro de energía es precisamente lo que permite que el sistema pase de la mera supervivencia al florecimiento, garantizando el disfrute y la expansión vital de cada uno de sus miembros.'
  },
  {
    titulo: 'Cuidado de la Vida a través de las Generaciones',
    descripcion: 'Diseñamos para el tiempo profundo. Nuestras decisiones se guían por su impacto en las generaciones que heredarán este planeta mucho después de nosotros.'
  },
  {
    titulo: 'Infraestructura y Comunidades Resilientes',
    descripcion: 'Construcción de sistemas físicos y digitales modulares, de cero residuos y listos para operar fuera de la red para la soberanía energética, alimentaria y del agua.'
  },
  {
    titulo: 'Flujo Abierto, Inclusividad y Renovación Continua',
    descripcion: 'La vida es un sistema abierto que rechaza el estancamiento. Permitir el ingreso de nuevas células, miembros y perspectivas no es solo una actitud de bienvenida, sino un imperativo biológico para evitar la entropía. Esta asimilación de nueva energía y diversidad es lo que permite al organismo regenerarse, adaptarse a los cambios y garantizar la resiliencia el mayor bien común a largo plazo.'
  }
];

// ============================================
// EXPORT DEFAULT
// ============================================

export default {
  MARCO_COMUN_PROPOSITO,
  TIPOS_NODO,
  ESCALAS_NODO,
  PRINCIPIOS_DISENO,
  LO_QUE_PUEDE_Y_NO_PUEDE_AFIRMAR,
  COMPONENTES_GLOBAL_ALLIANCE,
  COMPONENTES_DIGITALES_GAIA_OS,
  RELACION_FUNDAMENTAL,
  ARTICULACION_CINCO_PROGRAMAS,
  DISTINCIONES_SISTEMAS,
  TAXONOMIA_GAIA,
  ESPECIALIDADES_EJEMPLOS,
  REGLA_CLASIFICACION,
  TARGETS_INDICADORES,
  REGLA_USO_INDICADORES,
  DIMENSIONES_TRANVERSALES,
  SISTEMAS_INTEGRALES,
  CUATRO_MARCOS_SIETE,
  GI3_MODELO,
  GI3_I_IMPACTO,
  GI3_NORMALIZACION,
  GI3_Q_CALIDAD,
  GI3_V_VERIFICACION,
  GI3_C_CONTRIBUCION,
  GI3_COBERTURA,
  GI3_EJEMPLO,
  GI3_SALVAGUARDAS,
  PANEL_REGENERACION_INDIVIDUAL,
  PROGRAMA_REGENERACION_ORGANIZACIONAL,
  TRUST_TIERS,
  REGLAS_VERIFICACION,
  RELACION_TRUST_TIERS_E0_E4,
  INTEGRIDAD_APELACION,
  GAIA_PASSPORT,
  BANDAS_DESARROLLO_REPLICABILIDAD,
  REGLAS_BANDAS,
  PROGRESIONES_SEPARADAS,
  CORE_DEFINICION,
  NUEVE_CAPITALES_OPERATIVOS,
  VISTA_SINTETICA_SIETE_CAPITALES,
  COMMONOMICS,
  DOS_VIAS_PARALELAS,
  DIEZYSEIS_FACULTADES,
  CUATRO_EJES_TRANSDISCIPLINARIOS,
  EJE_INNOVACION_MADUREZ,
  GAIA_HUB_METAPLATAFORMA,
  COMPONENTES_DIGITALES_RELACIONADOS,
  FIDEICOMISO_DATOS_SOBERANIA,
  PASEO_OPAL_IA_AUDITABLE,
  QUIEN_HACE_QUE,
  SALVAGUARDAS_MINIMAS,
  CICLO_EVALUACION,
  SECUENCIA_IMPLEMENTACION,
  PILOTAJE_GI3,
  ASUNTOS_POR_FORMALIZAR,
  ESTATUS_MARCO,
  GLOSARIO_CLAVE,
  FUENTES_DOCUMENTALES,
  PRINCIPIOS_FUNDAMENTALES_GAIA
};