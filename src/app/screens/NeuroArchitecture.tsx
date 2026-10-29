// src/app/screens/NeuroArchitecture.tsx
// HSCSG v15 OS — Mapa Cerebral Interactivo (Neuroarquitectura)
// Hace visible el isomorfismo Cerebro ↔ HSCSG

import { useState } from 'react';
import { Brain, Shield, GitBranch, Eye, Network, Activity, Heart, DNA, Sparkles, Info, X } from 'lucide-react';
import { Stat, Badge } from '@components/ui';
import { 
  mapBrainCircuit, 
  verifyTriaxialRetina, 
  runVestibularTick, 
  reprogramBelief, 
  triggerRelearningExtinction, 
  activatePlaceboOptimism,
  getBrainHSCSGMapping,
  type CircuitMapping,
  type BrainHSCSGMapping
} from '@core/lib/neuroarchitecture';

// CONFIGURACIÓN MAPA CEREBRAL (Coordenadas SVG normalizadas 0-1000)

interface BrainRegion {
  id: string;
  name: string;
  nameES: string;
  circuit: string;
  color: string;
  x: number; y: number;
  r: number;
  description: string;
  descriptionES: string;
  papers: string[];
  hscsgModule: string;
  lawMJ: 'I' | 'II' | 'III';
}

const BRAIN_REGIONS: BrainRegion[] = [
  {
    id: 'vestibular',
    name: 'Vestibular System',
    nameES: 'Sistema Vestibular',
    circuit: 'vestibular_system',
    color: '#ef4444',
    x: 500, y: 850,
    r: 45,
    description: '6 DOF inertial navigation (3-axis gyro + 3-axis accelerometer). Same sensor used in Space Shuttle guidance.',
    descriptionES: 'Navegación inercial 6 DOF (giroscopio 3 ejes + acelerómetro 3 ejes). Mismo sensor que Transbordador Espacial.',
    papers: ['HAINS (NASA 19920004869)', 'Brain\'s Inertial Navigation System Pinpointed (Cell Press 2007)'],
    hscsgModule: 'LoopEngine γ-CARMIS + Automaton tick central',
    lawMJ: 'I',
  },
  {
    id: 'retina',
    name: 'Retina (3 Layers)',
    nameES: 'Retina (3 Capas)',
    circuit: 'retinal_circuit',
    color: '#3b82f6',
    x: 200, y: 150,
    r: 40,
    description: '125M rods + 7M cones → 1M optic nerve axons (130:1 compression). 3-layer motion detection.',
    descriptionES: '125M bastones + 7M conos → 1M axones nervio óptico (compresión 130:1). Detección movimiento 3 capas.',
    papers: ['Eye Smarter than Scientists Believed (Harvard/Plank 2009)', 'Eye\'s Motion Detection Sensors (WashU 2015)'],
    hscsgModule: 'Verificación Triaxial + Boundaries.failClosed()',
    lawMJ: 'III',
  },
  {
    id: 'superior_colliculus',
    name: 'Superior Colliculus',
    nameES: 'Colículo Superior',
    circuit: 'retinal_circuit',
    color: '#f97316',
    x: 350, y: 280,
    r: 30,
    description: 'Direct eye muscle control. Visual reflexes: saccades, smooth pursuit, looming avoidance.',
    descriptionES: 'Control directo músculos oculares. Reflejos visuales: sacádicas, persecución suave, evasión looming.',
    papers: ['Superior Colliculus visual reflexes (Nature Neuroscience)'],
    hscsgModule: 'MJGate + Boundaries.failClosed() (reflejo inmediato)',
    lawMJ: 'I',
  },
  {
    id: 'lgn_v1',
    name: 'LGN → V1',
    nameES: 'LGN → V1',
    circuit: 'retinal_circuit',
    color: '#22c55e',
    x: 500, y: 280,
    r: 35,
    description: 'LGN (1M neurons) → Calcarine fissure (V1). Split to Dorsal + Ventral streams.',
    descriptionES: 'LGN (1M neuronas) → Fisura calcarina (V1). División a corrientes Dorsal + Ventral.',
    papers: ['LGN to V1 connectivity (J Neurosci)', 'Visual cortical hierarchy'],
    hscsgModule: 'Verificación Triaxial (punto de división)',
    lawMJ: 'III',
  },
  {
    id: 'mt',
    name: 'Area MT (V5)',
    nameES: 'Área MT (V5)',
    circuit: 'dorsal_stream',
    color: '#22c55e',
    x: 700, y: 200,
    r: 35,
    description: 'Motion processing → Cerebellum for smooth pursuit. Velocity/direction calculation.',
    descriptionES: 'Procesamiento movimiento → Cerebelo para persecución suave. Cálculo velocidad/dirección.',
    papers: ['MT motion processing (J Neurosci)', 'Smooth pursuit circuitry (Visuomotor Cerebellum)'],
    hscsgModule: 'LoopEngine ticks + AgentMesh (velocidad/dirección)',
    lawMJ: 'II',
  },
  {
    id: 'lip',
    name: 'LIP (Parietal Eye Field)',
    nameES: 'LIP (Campo Ocular Parietal)',
    circuit: 'dorsal_stream',
    color: '#22c55e',
    x: 750, y: 320,
    r: 30,
    description: 'Visual attention + saccade planning. Works with FEF for limb guidance.',
    descriptionES: 'Atención visual + planificación sacádicas. Trabaja con FEF para guiar extremidades.',
    papers: ['LIP visual attention (Nature)', 'Parietal Eye Field (PEF)'],
    hscsgModule: 'LoopEngine ticks (atención visual)',
    lawMJ: 'II',
  },
  {
    id: 'mip',
    name: 'MIP (Reaching)',
    nameES: 'MIP (Alcance)',
    circuit: 'dorsal_stream',
    color: '#22c55e',
    x: 780, y: 420,
    r: 30,
    description: 'Hand-eye coordination. Guides limbs to visual targets via cerebellum.',
    descriptionES: 'Coordinación mano-ojo. Guía extremidades a objetivos visuales vía cerebelo.',
    papers: ['MIP reach planning (J Neurophysiol)', 'Cerebellar Inputs to MIP'],
    hscsgModule: 'AgentMesh compute (coordinación mano-ojo)',
    lawMJ: 'II',
  },
  {
    id: 'fef',
    name: 'FEF (Frontal Eye Fields)',
    nameES: 'FEF (Campos Oculares Frontales)',
    circuit: 'dorsal_stream',
    color: '#22c55e',
    x: 650, y: 320,
    r: 35,
    description: 'Visual attention control. Saccade generation. Top-down attention.',
    descriptionES: 'Control atención visual. Generación sacádicas. Atención top-down.',
    papers: ['FEF visual attention (Annu Rev Neurosci)', 'FEF microstimulation'],
    hscsgModule: 'LoopEngine ticks (control atención)',
    lawMJ: 'II',
  },
  {
    id: 'sts',
    name: 'STS (Facial Expressions)',
    nameES: 'STS (Expresiones Faciales)',
    circuit: 'face_recognition',
    color: '#a855f7',
    x: 300, y: 400,
    r: 35,
    description: 'Facial expression analysis → VTA (dopamine "want") / RMT (punishment). Trust circuit required.',
    descriptionES: 'Análisis expresiones faciales → VTA (dopamina "querer") / RMT (castigo). Circuito confianza requerido.',
    papers: ['STS facial expressions (NeuroImage)', 'STS→VTA/RMT pathways'],
    hscsgModule: 'Symbiosky (commit-reveal) + CaaS revenueShare',
    lawMJ: 'III',
  },
  {
    id: 'ffa',
    name: 'FFA (Face Identity)',
    nameES: 'FFA (Identidad Facial)',
    circuit: 'face_recognition',
    color: '#a855f7',
    x: 380, y: 480,
    r: 30,
    description: 'Face identity recognition. NOT relearnable in adulthood (Kanwisher & Yovel 2006). Right-lateralized.',
    descriptionES: 'Reconocimiento identidad facial. NO reaprendible en adultez. Lateralizado derecha.',
    papers: ['FFA: Kanwisher & Yovel 2006', 'Fusiform Face Area (MIT)'],
    hscsgModule: 'Verificación + Soberanía Identity (inmutable)',
    lawMJ: 'III',
  },
  {
    id: 'prc',
    name: 'PRC (Stored Patterns)',
    nameES: 'PRC (Patrones Almacenados)',
    circuit: 'face_recognition',
    color: '#a855f7',
    x: 460, y: 480,
    r: 30,
    description: 'Stored patterns for recognition. Match threshold → Uncinate Fasciculus → OFC.',
    descriptionES: 'Patrones almacenados para reconocimiento. Umbral coincidencia → Fascículo Uncinado → OFC.',
    papers: ['PRC pattern storage (Neuron)', 'PRC-OFC via Uncinate (DTI)'],
    hscsgModule: 'RAO append-only (patrones inmutables)',
    lawMJ: 'III',
  },
  {
    id: 'uncinate',
    name: 'Uncinate Fasciculus',
    nameES: 'Fascículo Uncinado',
    circuit: 'face_recognition',
    color: '#ec4899',
    x: 420, y: 550,
    r: 25,
    description: 'White matter tract: PRC ↔ OFC. Emotional/reward value transfer. Integrity 0-1.',
    descriptionES: 'Tracto materia blanca: PRC ↔ OFC. Transferencia valor emocional/recompensa. Integridad 0-1.',
    papers: ['Uncinate Fasciculus PRC-OFC (DTI)', 'White matter emotional valuation'],
    hscsgModule: 'VasosComunicantes.flowBetween(PRC, OFC)',
    lawMJ: 'III',
  },
  {
    id: 'ofc',
    name: 'OFC (Reward Value)',
    nameES: 'OFC (Valor Recompensa)',
    circuit: 'face_recognition',
    color: '#eab308',
    x: 500, y: 550,
    r: 35,
    description: 'Stored emotional/reward value. Stake ZNU = belief bet. Output to Amygdala → Hypothalamus.',
    descriptionES: 'Valor emocional/recompensa almacenado. Stake ZNU = apuesta creencia. Salida Amígdala → Hipotálamo.',
    papers: ['OFC reward valuation (Nat Rev Neurosci)', 'OFC→Amygdala pathway'],
    hscsgModule: 'CaaS stake ZNU + Symbiosky conviction',
    lawMJ: 'II',
  },
  {
    id: 'amygdala_hypothalamus',
    name: 'Amygdala → Hypothalamus',
    nameES: 'Amígdala → Hipotálamo',
    circuit: 'face_recognition',
    color: '#ef4444',
    x: 580, y: 620,
    r: 40,
    description: 'Emotion → Body control (hormones). Pituitary control: ACTH, oxytocin, cortisol. LC (stress center).',
    descriptionES: 'Emoción → Control corporal (hormonas). Control hipófisis: ACTH, oxitocina, cortisol. LC (centro estrés).',
    papers: ['Amygdala-Hypothalamus pathway', 'HPA axis control'],
    hscsgModule: 'Boundaries.failClosed() + LoopEngine γ-CARMIS (regulación fisiológica)',
    lawMJ: 'I',
  },
  {
    id: 'bst_mpoa',
    name: 'BST/MPOA (Sexual Dimorphism)',
    nameES: 'BST/MPOA (Dimorfismo Sexual)',
    circuit: 'nudity_sexuality',
    color: '#ec4899',
    x: 500, y: 700,
    r: 35,
    description: 'Occipito-temporal → Insular → BST/MPOA (2x males) → PVN → Oxytocin (6h half-life). N170 nude > faces.',
    descriptionES: 'Occipito-temporal → Insular → BST/MPOA (2x machos) → PVN → Oxitocina (6h vida media). N170 desnudos > rostros.',
    papers: ['N170 nude bodies > faces (Hietanen)', 'BST/MPOA dimorphism (2x males)', 'Oxytocin 6h CSF half-life'],
    hscsgModule: 'Boundaries.failClosed() + Trustlines + VitalTime decay (6h)',
    lawMJ: 'I',
  },
  {
    id: 'prefrontal',
    name: 'Prefrontal Cortex (Beliefs)',
    nameES: 'Corteza Prefrontal (Creencias)',
    circuit: 'prefrontal_cortex',
    color: '#6366f1',
    x: 500, y: 100,
    r: 60,
    description: 'Belief network (good/bad) programmable. Matures ~25 years. Animals cannot do this. Risk behavior if immature.',
    descriptionES: 'Red creencias (bien/mal) programable. Madura ~25 años. Animales no pueden. Conducta riesgo si inmadura.',
    papers: ['9 functions middle PFC (Siegel)', 'Experience and Developing PFC (PMC3477383)'],
    hscsgModule: 'Automaton SOUL + Delegación líquida (stake ZNU)',
    lawMJ: 'II',
  },
  {
    id: 'cerebellum',
    name: 'Cerebellum (Inertial Nav)',
    nameES: 'Cerebelo (Nav. Inercial)',
    circuit: 'cerebellar_system',
    color: '#14b8a6',
    x: 500, y: 900,
    r: 50,
    description: 'Inertial navigation computer (grid/place cells) + Visuomotor control (LIP/MIP/FEF/MT/floccular/vermis). γ-CARMIS reconfiguration.',
    descriptionES: 'Computadora navegación inercial (grid/place cells) + Control visuomotor (LIP/MIP/FEF/MT/floccular/vermis). γ-CARMIS reconfiguración.',
    papers: ['Brain\'s Inertial Navigation (Cell Press 2007)', 'Visuomotor Cerebellum (LIP/MIP/FEF/MT/floccular/vermis)'],
    hscsgModule: 'LoopEngine γ-CARMIS + Automaton E²R',
    lawMJ: 'II',
  },
  {
    id: 'relearning',
    name: 'Relearning Extinction',
    nameES: 'Reaprendizaje Extinción',
    circuit: 'relearning_extinction',
    color: '#f59e0b',
    x: 300, y: 100,
    r: 35,
    description: 'Directed neuroplasticity = γ-CARMIS preventative reconfiguration. No drugs/surgery. Changes emotional reflex.',
    descriptionES: 'Neuroplasticidad dirigida = γ-CARMIS reconfiguración preventiva. Sin fármacos/cirugía. Cambia reflejo emocional.',
    papers: ['Relearning Extinction (CSHL)', 'Directed Neuroplasticity = γ-CARMIS'],
    hscsgModule: 'LoopEngine γ-CARMIS (neuroplasticidad dirigida)',
    lawMJ: 'II',
  },
  {
    id: 'placebo',
    name: 'Placebo / Optimism',
    nameES: 'Placebo / Optimismo',
    circuit: 'placebo_optimism',
    color: '#22c55e',
    x: 700, y: 100,
    r: 35,
    description: 'Belief activates endogenous networks (dopamine, oxytocin, serotonin, endorphins). Optimists live longer (Reuters). No drugs needed.',
    descriptionES: 'Creencia activa redes endógenas (dopamina, oxitocina, serotonina, endorfinas). Optimistas viven más (Reuters). Sin fármacos.',
    papers: ['Optimists live longer (Reuters)', 'Placebo = endogenous networks (IL-6, HPA)'],
    hscsgModule: 'CaaS stake ZNU + Vesting decay + VitalTime',
    lawMJ: 'II',
  },
  {
    id: 'dna',
    name: 'DNA (96% Assembly Code)',
    nameES: 'ADN (96% Código Ensamblaje)',
    circuit: 'dna_storage',
    color: '#8b5cf6',
    x: 500, y: 50,
    r: 30,
    description: '96% "junk" DNA = wiring instructions (80B neurons) + body assembly. 215M GB/g, 16x binary. 75k enzymes/receptors.',
    descriptionES: '96% ADN "basura" = instrucciones cableado (80B neuronas) + montaje corporal. 215M GB/g, 16x binario. 75k enzimas/receptores.',
    papers: ['DNA Storage Harvard (215M GB/g)', '96% non-coding = assembly code (Engineering Laws)'],
    hscsgModule: 'RAO append-only + VitalTime (transducción)',
    lawMJ: 'I',
  },
  {
    id: 'hippocampus',
    name: 'Hippocampus (Place Cells)',
    nameES: 'Hipocampo (Células Lugar)',
    circuit: 'cerebellar_system',
    color: '#06b6d4',
    x: 500, y: 950,
    r: 35,
    description: 'Place cells + grid cells → spatial memory + path integration. Hippocampal-cerebellar loop for navigation memory.',
    descriptionES: 'Células lugar + grid → memoria espacial + integración de camino. Bucle hipocampal-cerebeloso para memoria navegación.',
    papers: ["Place cells hippocampus (O'Keefe 1971 Nobel)", 'Grid cells entorhinal cortex (Hafting 2005)'],
    hscsgModule: 'RAO append-only (espacial) + VitalTime (memoria navegación)',
    lawMJ: 'III',
  },
];

// COMPONENTE PRINCIPAL

export function NeuroArchitecture() {
  const [selectedRegion, setSelectedRegion] = useState<BrainRegion | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'laws' | 'mapping'>('map');
  const [searchTerm, setSearchTerm] = useState('');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const mapping = getBrainHSCSGMapping();

  const filteredRegions = BRAIN_REGIONS.filter(r => 
    r.nameES.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.hscsgModule.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom(prev => Math.min(Math.max(prev - e.deltaY * 0.001, 0.3), 3));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const startX = e.clientX - pan.x;
    const startY = e.clientY - pan.y;
    const move = (ev: MouseEvent) => setPan({ x: ev.clientX - startX, y: ev.clientY - startY });
    const up = () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  const getLawColor = (law: 'I' | 'II' | 'III') => ({
    'I': '#ef4444',
    'II': '#22c55e',
    'III': '#3b82f6',
  }[law]);

  const getLawLabel = (law: 'I' | 'II' | 'III') => ({
    'I': 'Ley I: No Dañar',
    'II': 'Ley II: Soberanizar',
    'III': 'Ley III: Lucidez',
  }[law]);

  return (
    <div className="h-full flex flex-col bg-[var(--surf)]">
      <div className="flex items-center justify-between p-4 border-b border-[var(--line)]">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 text-emerald-400" />
          <div>
            <h1 className="text-xl font-semibold text-white">Neuroarquitectura HSCSG</h1>
            <p className="text-sm text-[var(--dim)]">Mapa cerebral interactivo ↔ Isomorfismo HSCSG ({BRAIN_REGIONS.length} regiones mapeadas)</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Buscar región, módulo, ley..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="bg-[var(--surf2)] border border-[var(--line)] rounded px-3 py-1.5 text-sm text-white placeholder-[var(--dim)] w-64"
          />
          <div className="flex gap-1 bg-[var(--surf2)] rounded p-1">
            {(['map', 'laws', 'mapping'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => { setViewMode(mode); setSelectedRegion(null); }}
                className={`px-3 py-1.5 text-sm rounded transition ${viewMode === mode ? 'bg-emerald-500 text-black' : 'text-[var(--mut)] hover:text-white'}`}
              >
                {mode === 'map' && <><Brain className="w-4 h-4 inline mr-1" /> Mapa</>}
                {mode === 'laws' && <><Shield className="w-4 h-4 inline mr-1" /> Leyes MJ</>}
                {mode === 'mapping' && <><GitBranch className="w-4 h-4 inline mr-1" /> Mapeo</>}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-4 p-4 border-b border-[var(--line)] bg-[var(--surf2)]/50 flex-wrap">
        <Stat label="Circuitos Mapeados" value={String(BRAIN_REGIONS.length)} />
        <Stat label="Verificados" value={String(mapping.verification.verified)} color="text-emerald-400" />
        <Stat label="Ley I (No Dañar)" value={String(mapping.lawsMJ.lawI.length)} color="text-red-400" />
        <Stat label="Ley II (Soberanizar)" value={String(mapping.lawsMJ.lawII.length)} color="text-emerald-400" />
        <Stat label="Ley III (Lucidez)" value={String(mapping.lawsMJ.lawIII.length)} color="text-blue-400" />
        <Stat label="Papers Referenciados" value="200+" color="text-violet-400" />
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className={`w-96 flex-shrink-0 border-l border-[var(--line)] bg-[var(--surf2)]/30 flex flex-col transition-all duration-300 ${selectedRegion ? '' : 'hidden md:flex'}`}>
          {selectedRegion ? (
            <RegionDetailPanel 
              region={selectedRegion} 
              onClose={() => setSelectedRegion(null)}
              mapping={mapBrainCircuit(selectedRegion.circuit, '')}
            />
          ) : (
            <RegionList 
              regions={filteredRegions} 
              onSelect={setSelectedRegion}
              viewMode={viewMode}
              mapping={mapping}
            />
          )}
        </div>

        <div className="flex-1 relative overflow-hidden" onWheel={handleWheel} onMouseDown={handleMouseDown}>
          <svg
            className="absolute inset-0"
            viewBox="0 0 1000 1000"
            style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: '0 0' }}
          >
            <g stroke="white" strokeWidth="0.5" opacity="0.15" strokeDasharray="4,4">
              <line x1="500" y1="850" x2="500" y2="900" />
              <line x1="200" y1="150" x2="350" y2="280" />
              <line x1="350" y1="280" x2="500" y2="280" />
              <line x1="500" y1="280" x2="700" y2="200" />
              <line x1="500" y1="280" x2="300" y2="400" />
              <line x1="500" y1="280" x2="380" y2="480" />
              <line x1="300" y1="400" x2="380" y2="480" />
              <line x1="380" y1="480" x2="460" y2="480" />
              <line x1="460" y1="480" x2="420" y2="550" />
              <line x1="420" y1="550" x2="500" y2="550" />
              <line x1="500" y1="550" x2="580" y2="620" />
              <line x1="500" y1="100" x2="300" y2="100" />
              <line x1="500" y1="100" x2="700" y2="100" />
              <line x1="500" y1="100" x2="500" y2="900" />
              <line x1="500" y1="900" x2="700" y2="200" />
              <line x1="500" y1="900" x2="750" y2="320" />
              <line x1="500" y1="900" x2="780" y2="420" />
              <line x1="500" y1="900" x2="650" y2="320" />
              <line x1="500" y1="900" x2="500" y2="950" />
            </g>

            <g>
              {BRAIN_REGIONS.map(region => {
                const isSelected = selectedRegion?.id === region.id;
                const matchesSearch = filteredRegions.includes(region);
                return (
                  <g
                    key={region.id}
                    onClick={() => setSelectedRegion(region)}
                    style={{ cursor: 'pointer', filter: matchesSearch ? 'none' : 'grayscale(0.7) opacity(0.4)' }}
                  >
                    <circle
                      cx={region.x}
                      cy={region.y}
                      r={region.r}
                      fill={region.color}
                      fillOpacity={isSelected ? 1 : 0.85}
                      stroke={isSelected ? '#fff' : 'transparent'}
                      strokeWidth={isSelected ? 3 : 0}
                      style={{ filter: 'drop-shadow(0 0 8px currentColor)' }}
                    />
                    {isSelected && (
                      <circle
                        cx={region.x}
                        cy={region.y}
                        r={region.r + 6}
                        fill="none"
                        stroke={region.color}
                        strokeWidth={2}
                        strokeDasharray="8,4"
                        className="animate-pulse"
                      />
                    )}
                    <text
                      x={region.x}
                      y={region.y + region.r + 14}
                      textAnchor="middle"
                      fontSize="9"
                      fill="white"
                      fontWeight="600"
                      pointerEvents="none"
                    >
                      {region.id.length > 12 ? region.id.slice(0,10)+'…' : region.id}
                    </text>
                  </g>
                )
              })}
            </g>

            <g transform="translate(20, 20)">
              {(['I', 'II', 'III'] as const).map((law, i) => (
                <g key={law} transform={`translate(0, ${i * 28})`}>
                  <rect x={0} y={0} width={16} height={16} rx={3} fill={getLawColor(law)} opacity={0.9} />
                  <text x={22} y={12} fontSize="11" fill="white" fontWeight="500">
                    {getLawLabel(law)}
                  </text>
                </g>
              ))}
            </g>

            <g transform="translate(20, 940)" className="pointer-events-auto">
              <rect x={0} y={0} width={100} height={70} rx={6} fill="rgba(0,0,0,0.7)" />
              <text x={50} y={16} textAnchor="middle" fontSize="11" fill="white">Zoom: {Math.round(zoom * 100)}%</text>
              <g transform="translate(10, 30)">
                <rect x={0} y={0} width={36} height={36} rx={4} fill="white" fillOpacity={0.1} onClick={() => setZoom(Math.min(zoom + 0.2, 3))} />
                <text x={18} y={24} textAnchor="middle" fontSize="18" fill="white" pointerEvents="none">+</text>
              </g>
              <g transform="translate(54, 30)">
                <rect x={0} y={0} width={36} height={36} rx={4} fill="white" fillOpacity={0.1} onClick={() => setZoom(Math.max(zoom - 0.2, 0.3))} />
                <text x={18} y={24} textAnchor="middle" fontSize="18" fill="white" pointerEvents="none">−</text>
              </g>
            </g>
          </svg>

          {selectedRegion && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 md:hidden">
              <RegionDetailPanel 
                region={selectedRegion} 
                onClose={() => setSelectedRegion(null)}
                mapping={mapBrainCircuit(selectedRegion.circuit, '')}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// PANEL DETALLE REGIÓN

interface RegionDetailPanelProps {
  region: BrainRegion;
  onClose: () => void;
  mapping: CircuitMapping;
}

function RegionDetailPanel({ region, onClose, mapping }: RegionDetailPanelProps) {
  const retinalCheck = region.circuit === 'retinal_circuit' ? verifyTriaxialRetina('motion') : null;
  const vestibularDemo = region.circuit === 'vestibular_system' ? runVestibularTick({ x: 1, y: 0.5, z: -0.2 }) : null;
  const beliefDemo = region.circuit === 'prefrontal_cortex' ? reprogramBelief('demo', 'gratitude and healing') : null;
  const extinctionDemo = region.circuit === 'relearning_extinction' ? triggerRelearningExtinction('fear of failure') : null;
  const placeboDemo = region.circuit === 'placebo_optimism' ? activatePlaceboOptimism('healing and health') : null;

  return (
    <div className="flex flex-col h-full bg-[var(--surf)] border-l border-[var(--line)] overflow-y-auto">
      <div className="flex items-start justify-between p-4 border-b border-[var(--line)]">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: region.color }}
          >
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">{region.nameES}</h2>
            <p className="text-xs text-[var(--dim)]">{region.name}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition">
          <X className="w-5 h-5 text-[var(--mut)]" />
        </button>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge 
            color={`bg-${region.lawMJ === 'I' ? 'red' : region.lawMJ === 'II' ? 'emerald' : 'blue'}-500/20 text-${region.lawMJ === 'I' ? 'red' : region.lawMJ === 'II' ? 'emerald' : 'blue'}-300 border-${region.lawMJ === 'I' ? 'red' : region.lawMJ === 'II' ? 'emerald' : 'blue'}-500/30`}
          >
            {({ 'I': 'Ley I: No Dañar', 'II': 'Ley II: Soberanizar', 'III': 'Ley III: Lucidez' }[region.lawMJ])}
          </Badge>
          <Badge color="bg-violet-500/20 text-violet-300 border-violet-500/30">
            Módulo HSCSG
          </Badge>
          <Badge color="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
            {mapping.verificationStatus}
          </Badge>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium text-white">Descripción</h3>
          <p className="text-sm text-[var(--mut)] leading-relaxed">{region.descriptionES}</p>
          <p className="text-xs text-[var(--dim)] font-mono">{region.description}</p>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium text-white flex items-center gap-2">
            <Brain className="w-4 h-4 text-emerald-400" />
            Módulo HSCSG
          </h3>
          <div className="bg-[var(--surf2)] rounded-lg p-3 text-sm">
            <p className="font-medium text-emerald-300">{region.hscsgModule}</p>
            <p className="text-[var(--mut)] mt-1">Integración CaaS: {mapping.caasIntegration}</p>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium text-white flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-400" />
            Papers de Referencia ({region.papers.length})
          </h3>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {region.papers.map((paper, i) => (
              <div key={i} className="text-xs text-[var(--mut)] bg-[var(--surf2)] rounded p-2 border-l-2 border-emerald-500/50">
                {paper}
              </div>
            ))}
          </div>
        </div>

        {(retinalCheck || vestibularDemo || beliefDemo || extinctionDemo || placeboDemo) && (
          <div className="space-y-3 border-t border-[var(--line)] pt-4">
            <h3 className="font-medium text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Demostración en Vivo
            </h3>
            <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
              {retinalCheck && (
                <DemoCard 
                  title="Verificación Triaxial Retina"
                  icon={<Eye className="w-4 h-4" />}
                  data={{
                    'Capa Fotoreceptores': retinalCheck.mental ? '✅ Mental' : '❌',
                    'Capa Movimiento': retinalCheck.simulation ? '✅ Simulación' : '❌',
                    'Capa Looming': retinalCheck.laboratory ? '✅ Laboratorio' : '❌',
                    'Estado': retinalCheck.passed ? '✅ PASSED' : '❌ FAILED',
                  }}
                />
              )}
              {vestibularDemo && (
                <DemoCard 
                  title="Tick Vestibular (LoopEngine)"
                  icon={<Activity className="w-4 h-4" />}
                  data={{
                    'Giroscopio (xyz)': `${vestibularDemo.gyroscope.x}, ${vestibularDemo.gyroscope.y}, ${vestibularDemo.gyroscope.z}`,
                    'Acelerómetro (xyz)': `${vestibularDemo.accelerometer.x}, ${vestibularDemo.accelerometer.y}, ${vestibularDemo.accelerometer.z}`,
                    'Estabilización VOR': `${Math.round(vestibularDemo.visionStabilization.gazeStabilization * 100)}%`,
                    'Navegación Cerebelosa': vestibularDemo.navigation.cerebellarCompute ? '✅ Activa' : '⚠️ γ-CARMIS Triggered',
                  }}
                />
              )}
              {beliefDemo && (
                <DemoCard 
                  title="Reprogramar Creencia (Prefrontal)"
                  icon={<Network className="w-4 h-4" />}
                  data={{
                    'Creencia': beliefDemo.content,
                    'Valencia': beliefDemo.valence,
                    'Fuerza': `${Math.round(beliefDemo.strength * 100)}%`,
                    'Stake ZNU': `${beliefDemo.znuStake}`,
                    'Asoc. Recompensa': `${Math.round(beliefDemo.rewardAssociation * 100)}%`,
                    'Impacto Salud': `${Math.round(beliefDemo.healthImpact * 100)}%`,
                  }}
                />
              )}
              {extinctionDemo && (
                <DemoCard 
                  title="Reaprendizaje Extinción (γ-CARMIS)"
                  icon={<Shield className="w-4 h-4" />}
                  data={{
                    'Gatillo': extinctionDemo.protocol.identifyTrigger(),
                    'Nueva Asociación': extinctionDemo.protocol.newAssociation(),
                    'Fuerza Nueva': `${Math.round(extinctionDemo.neuroplasticity.newConnectionStrength * 100)}%`,
                    'Decaimiento Antigua': `${Math.round(extinctionDemo.neuroplasticity.oldConnectionDecay * 100)}%`,
                    'γ-CARMIS': extinctionDemo.gammaCARMISIntegration ? '✅ Triggered' : '❌',
                    'Verificación': extinctionDemo.neuroplasticity.verification.passed ? '✅ Triaxial' : '❌',
                  }}
                />
              )}
              {placeboDemo && (
                <DemoCard 
                  title="Placebo/Optimismo (Redes Endógenas)"
                  icon={<Heart className="w-4 h-4" />}
                  data={
                    Object.fromEntries(
                      placeboDemo.map(n => [n.name.toUpperCase(), `${Math.round(n.healthImpact.stressReduction * 100)}% reducción estrés`])
                    )
                  }
                />
              )}
            </div>
          </div>
        )}

        <div className="border-t border-[var(--line)] pt-4">
          <h3 className="font-medium text-white mb-2 flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-emerald-400" />
            Conexiones HSCSG (Vasos Comunicantes)
          </h3>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2 text-[var(--mut)]">
              <Shield className="w-3 h-3" /> Boundaries.failClosed() — Retina compresión 130:1 / Vestíbulo límites
            </div>
            <div className="flex items-center gap-2 text-[var(--mut)]">
              <Zap className="w-3 h-3" /> LoopEngine γ-CARMIS — Cerebelo reconfiguración / Reaprendizaje
            </div>
            <div className="flex items-center gap-2 text-[var(--mut)]">
              <Shield className="w-3 h-3" /> Verificación Triaxial — Retina 3 capas = Mental/Sim/Lab
            </div>
            <div className="flex items-center gap-2 text-[var(--mut)]">
              <GitBranch className="w-3 h-3" /> Vasos Comunicantes — PRC↔OFC (Fascículo Uncinado)
            </div>
            <div className="flex items-center gap-2 text-[var(--mut)]">
              <Heart className="w-3 h-3" /> Trustlines — Oxitocina 6h decay = VitalTime
            </div>
            <div className="flex items-center gap-2 text-[var(--mut)]">
              <Network className="w-3 h-3" /> Automaton SOUL — Prefrontal red creencias programable
            </div>
            <div className="flex items-center gap-2 text-[var(--mut)]">
              <DNA className="w-3 h-3" /> RAO + VitalTime — ADN 96% = código ensamblaje
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// LISTA DE REGIONES (Vista lateral)

interface RegionListProps {
  regions: BrainRegion[];
  onSelect: (r: BrainRegion) => void;
  viewMode: 'map' | 'laws' | 'mapping';
  mapping: BrainHSCSGMapping;
}

function RegionList({ regions, onSelect, viewMode, mapping }: RegionListProps) {
  if (viewMode === 'laws') {
    return (
      <div className="p-4 space-y-4 h-full overflow-y-auto">
        {(['I', 'II', 'III'] as const).map(law => (
          <div key={law} className="space-y-2">
            <h3 className="font-medium text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold" style={{ backgroundColor: LAW_COLOR[law] }}>
                {law}
              </span>
              Ley {law}: {LAW_LABEL[law]}
              <span className="text-xs text-[var(--dim)] ml-2">({mapping.lawsMJ[`law${law}`].length})</span>
            </h3>
            <div className="ml-4 space-y-1">
              {mapping.lawsMJ[`law${law}`].map(m => (
                <button
                  key={m.brainMechanism}
                  onClick={() => {
                    const region = BRAIN_REGIONS.find(r => 
                      r.circuit === m.brainMechanism || 
                      m.brainMechanism.includes(r.circuit) ||
                      r.circuit.includes(m.brainMechanism)
                    );
                    if (region) onSelect(region);
                  }}
                  className="w-full text-left p-2 text-xs text-[var(--mut)] hover:bg-emerald-500/10 rounded transition flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: LAW_COLOR[law] }} />
                  {m.brainMechanism} → {m.hscsgImplementation}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (viewMode === 'mapping') {
    return (
      <div className="p-4 space-y-3 h-full overflow-y-auto">
        <h3 className="font-medium text-white">Mapeo Completo Cerebro → HSCSG</h3>
        <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
          {mapping.mappings.map(m => (
            <button
              key={m.brainCircuit}
              onClick={() => {
                const region = BRAIN_REGIONS.find(r => r.circuit === m.brainCircuit);
                if (region) onSelect(region);
              }}
              className="w-full text-left p-3 rounded-lg border border-[var(--line)] bg-[var(--surf2)]/50 hover:border-emerald-500/50 transition flex flex-col gap-1"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: LAW_COLOR[m.lawMJ] }} />
                <span className="font-medium text-white text-sm">{m.brainCircuit.replace(/_/g, ' ')}</span>
                <Badge color={LAW_BADGE_CLASS(m.lawMJ)} className="ml-auto text-xs">
                  Ley {m.lawMJ}
                </Badge>
              </div>
              <p className="text-xs text-[var(--mut)] ml-6">{m.hscsgModule}</p>
              <p className="text-xs text-[var(--dim)] ml-6 font-mono">{m.hscsgFunction}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const grouped = {
    'Sistema Vestibular': regions.filter(r => ['vestibular_system', 'cerebellar_system'].includes(r.circuit)),
    'Sistema Visual (Retina + Vías)': regions.filter(r => ['retinal_circuit', 'dorsal_stream', 'ventral_stream'].includes(r.circuit)),
    'Reconocimiento Facial/Emocional': regions.filter(r => ['face_recognition', 'facial_expression_reward', 'nudity_sexuality'].includes(r.circuit)),
    'Cognición Superior': regions.filter(r => ['prefrontal_cortex', 'relearning_extinction', 'placebo_optimism'].includes(r.circuit)),
    'ADN / Fundamentos': regions.filter(r => ['dna_storage'].includes(r.circuit)),
  };

  return (
    <div className="p-4 space-y-4 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-white">{regions.length} regiones</h3>
        <div className="flex gap-1">
          {(['map', 'laws', 'mapping'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => {} }
              className={`px-2 py-1 text-xs rounded ${viewMode === mode ? 'bg-emerald-500 text-black' : 'text-[var(--mut)] hover:text-white'}`}
            >
              {mode === 'map' && 'Mapa'}
              {mode === 'laws' && 'Leyes'}
              {mode === 'mapping' && 'Tabla'}
            </button>
          ))}
      </div>
      {Object.entries(grouped)
        .filter(([key, items]) => items.length > 0)
        .map(([group, items]) => (
          <div key={group} className="space-y-1">
            <h4 className="text-xs font-medium text-[var(--dim)] uppercase tracking-wider mb-2">{group}</h4>
            {items.map(region => (
              <button
                key={region.id}
                onClick={() => onSelect(region)}
                className="w-full text-left p-2.5 rounded-lg hover:bg-emerald-500/10 transition flex items-center gap-2 group"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: region.color }}>
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{region.nameES}</p>
                  <p className="text-xs text-[var(--dim)] truncate">{region.hscsgModule}</p>
                </div>
                <span className={`px-1.5 py-0.5 text-xs rounded font-medium ${LAW_BADGE_CLASS(region.lawMJ)}`}>
                  Ley {region.lawMJ}
                </span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// TARJETA DEMO

interface DemoCardProps {
  title: string;
  icon: React.ReactNode;
  data: { [key: string]: string };
}

function DemoCard({ title, icon, data }: DemoCardProps) {
  return (
    <div className="bg-[var(--surf2)] border border-[var(--line)] rounded-lg p-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-6 h-6 rounded bg-emerald-500/20 flex items-center justify-center text-emerald-400">
          {icon}
        </span>
        <span className="font-medium text-white text-sm">{title}</span>
      </div>
      <div className="space-y-1 text-xs">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex justify-between py-0.5 border-b border-[var(--line)]/50 last:border-0">
            <span className="text-[var(--mut)]">{key}</span>
            <span className="text-white font-mono text-[10px]">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}