import { Scissors, Plus, Download } from 'lucide-react'
import { useAppStore } from '@core/state/store'
import { Card, Stat, Btn } from '@components/ui'
import { highlightCount, totalHighlightDuration } from '@core/lib/highlight'

export function Highlight() {
  const { highlight, addHighlightProject, addHighlight, exportHighlight } = useAppStore()
  const activeProject = highlight.projects.find(p => p.id === highlight.activeProject)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-jost text-2xl md:text-3xl font-semibold flex items-center gap-2">
          <Scissors className="w-6 h-6 text-chispa" />
          AutoClip · Highlight Engine
        </h1>
        <p className="text-[var(--dim)] mt-1">Extracción de highlights · video → análisis → clips → export</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Proyectos" value={String(highlight.projects.length)} sub="Videos analizados" />
        <Stat label="Highlights" value={String(activeProject ? highlightCount(activeProject) : 0)} sub={activeProject ? `en ${activeProject.title}` : 'Sin proyecto'} />
        <Stat label="Duración" value={`${Math.round(activeProject ? totalHighlightDuration(activeProject) : 0)}s`} sub="Total highlights" />
        <Stat label="Estado" value={activeProject?.status || '—'} sub="Pipeline" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card title="Proyectos de video">
          <div className="space-y-3">
            {highlight.projects.length === 0 && (
              <p className="text-[var(--dim)] text-sm">Agrega un proyecto de video. Análisis local sin APIs externas.</p>
            )}
            {highlight.projects.map(p => (
              <div key={p.id} className="p-3 bg-[var(--surf2)] border border-[var(--line)] rounded-xl">
                <p className="font-medium">{p.title}</p>
                <p className="text-[var(--dim)] text-xs">{p.duration}s · {highlightCount(p)} highlights · {p.status}</p>
              </div>
            ))}
            <Btn onClick={() => addHighlightProject('Video analysis', 'video-source.mp4', 300)}>
              <Plus className="w-4 h-4" /> Nuevo proyecto
            </Btn>
          </div>
        </Card>

        <Card title={activeProject ? `Highlights: ${activeProject.title}` : 'Highlights'}>
          <div className="space-y-2">
            {!activeProject ? (
              <p className="text-[var(--dim)] text-sm">Selecciona un proyecto para ver highlights.</p>
            ) : (
              <>
                {activeProject.highlights.length === 0 && (
                  <p className="text-[var(--dim)] text-sm">
                    Simula highlights: agrega segmentos de video relevantes.
                  </p>
                )}
                {activeProject.highlights.map(h => (
                  <div key={h.id} className="p-2 bg-[var(--surf2)] border border-[var(--line)] rounded-lg flex items-center gap-2">
                    <span className="text-xs text-[var(--dim)]">{h.startSec}s-{h.endSec}s</span>
                    <span className="text-sm flex-1">{h.reason}</span>
                    <span className="text-xs text-chispa">{(h.score * 100).toFixed(0)}%</span>
                    <Btn onClick={() => exportHighlight(activeProject.id, h.id)}>
                      <Download className="w-3 h-3" />
                    </Btn>
                  </div>
                ))}
                <Btn onClick={() => addHighlight(activeProject.id, 10, 45, 0.85, 'Momento clave detectado')}>
                  <Plus className="w-4 h-4" /> Agregar highlight
                </Btn>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
