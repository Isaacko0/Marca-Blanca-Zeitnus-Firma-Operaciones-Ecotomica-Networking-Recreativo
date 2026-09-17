import { Palette, Plus, Copy } from 'lucide-react'
import { useAppStore } from '@core/state/store'
import { Card, Stat, Btn } from '@components/ui'

export function Visual() {
  const { visual, addVisualPiece, addVisualPages, setActiveVisual } = useAppStore()
  const activePiece = visual.pieces.find(p => p.id === visual.activePiece)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-jost text-2xl md:text-3xl font-semibold flex items-center gap-2">
          <Palette className="w-6 h-6 text-chispa" />
          Visual Generator · RedInk
        </h1>
        <p className="text-[var(--dim)] mt-1">Generación de piezas visuales · descripción → outline → cover → content</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Piezas" value={String(visual.pieces.length)} sub="Contenido visual" />
        <Stat label="Páginas" value={String(activePiece?.pages.length || 0)} sub={activePiece ? `en ${activePiece.title}` : 'Sin pieza'} />
        <Stat label="Estado" value={activePiece?.status || '—'} sub="Pipeline" />
        <Stat label="Historial" value={String(visual.history.length)} sub="Generaciones pasadas" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card title="Piezas de contenido">
          <div className="space-y-3">
            {visual.pieces.length === 0 && (
              <p className="text-[var(--dim)] text-sm">Crea una pieza visual: poster, carrusel, micro-contenido.</p>
            )}
            {visual.pieces.map(p => (
              <div key={p.id} className="p-3 bg-[var(--surf2)] border border-[var(--line)] rounded-xl cursor-pointer" onClick={() => setActiveVisual(p.id)}>
                <p className="font-medium">{p.title}</p>
                <p className="text-[var(--dim)] text-xs mt-1">{p.description}</p>
                <p className="text-xs text-[var(--muted-foreground)] mt-1">{p.pages.length} páginas · {p.status}</p>
              </div>
            ))}
            <Btn onClick={() => addVisualPiece('Nueva pieza', 'Descripción del contenido visual')}>
              <Plus className="w-4 h-4" /> Crear pieza
            </Btn>
          </div>
        </Card>

        <Card title={activePiece ? `Páginas: ${activePiece.title}` : 'Páginas'}>
          <div className="space-y-2">
            {!activePiece ? (
              <p className="text-[var(--dim)] text-sm">Selecciona una pieza para ver/editar páginas.</p>
            ) : (
              <>
                {activePiece.pages.length === 0 && (
                  <Btn onClick={() => addVisualPages(activePiece.id, 5)}>
                    <Plus className="w-4 h-4" /> Generar 5 páginas
                  </Btn>
                )}
                {activePiece.pages.map(pg => (
                  <div key={pg.id} className="p-2 bg-[var(--surf2)] border border-[var(--line)] rounded-lg">
                    <p className="text-sm font-medium">{pg.title}</p>
                    <p className="text-xs text-[var(--dim)] mt-1">{pg.body || 'Sin contenido'}</p>
                  </div>
                ))}
                <Btn onClick={() => {
                  const copy = { title: activePiece.title, body: activePiece.description, tags: ['#hscsg', '#zeitnus'] }
                  navigator.clipboard.writeText(JSON.stringify(copy))
                }}>
                  <Copy className="w-4 h-4" /> Copiar copy
                </Btn>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
