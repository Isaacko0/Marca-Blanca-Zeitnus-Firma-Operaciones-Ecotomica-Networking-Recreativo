import { BookOpen, Plus, FileText } from 'lucide-react'
import { useAppStore } from '@core/state/store'
import { Card, Stat, Btn } from '@components/ui'
import { storyProgress } from '@core/lib/story'

export function Story() {
  const { story, addStoryProject, addStoryChapter, updateStoryChapter } = useAppStore()
  const activeProject = story.projects.find(p => p.id === story.activeProject)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-jost text-2xl md:text-3xl font-semibold flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-chispa" />
          Story Engine · MuMuAINovel
        </h1>
        <p className="text-[var(--dim)] mt-1">Creación narrativa asistida · outline → capítulo → revisión humana</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Proyectos" value={String(story.projects.length)} sub="Novelas activas" />
        <Stat label="Capítulos" value={String(story.chapters.length)} sub={activeProject ? `en ${activeProject.title}` : 'Sin proyecto'} />
        <Stat label="Avance" value={`${activeProject ? storyProgress(story.chapters.filter(c => c.projectId === activeProject.id)) : 0}%`} sub="Capítulos aprobados" />
        <Stat label="Outlines" value={String(story.outlines.length)} sub="5 actos default" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card title="Proyectos narrativos">
          <div className="space-y-3">
            {story.projects.length === 0 && (
              <p className="text-[var(--dim)] text-sm">No hay proyectos. Crea una novela, mito fundacional o relato del colectivo.</p>
            )}
            {story.projects.map(p => (
              <div key={p.id} className="p-3 bg-[var(--surf2)] border border-[var(--line)] rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{p.title}</p>
                    <p className="text-[var(--dim)] text-xs">{p.genre} · {p.status}</p>
                  </div>
                </div>
                <p className="text-sm mt-2 text-[var(--muted-foreground)]">{p.synopsis}</p>
              </div>
            ))}
            <Btn onClick={() => addStoryProject('Nueva novela', 'ficción', 'Sinopsis del proyecto')}>
              <Plus className="w-4 h-4" /> Crear proyecto
            </Btn>
          </div>
        </Card>

        <Card title={activeProject ? `Capítulos: ${activeProject.title}` : 'Capítulos'}>
          <div className="space-y-2">
            {(!activeProject || story.chapters.filter(c => c.projectId === activeProject.id).length === 0) && (
              <p className="text-[var(--dim)] text-sm">
                {activeProject ? 'Agrega capítulos al proyecto activo.' : 'Selecciona un proyecto.'}
              </p>
            )}
            {activeProject && story.chapters.filter(c => c.projectId === activeProject.id).map(ch => (
              <div key={ch.id} className="p-2 bg-[var(--surf2)] border border-[var(--line)] rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-chispa" />
                  <span className="text-sm">{ch.title}</span>
                  <span className="text-xs text-[var(--dim)] ml-auto">{ch.status}</span>
                </div>
              </div>
            ))}
            {activeProject && (
              <Btn onClick={() => addStoryChapter(activeProject.id, story.chapters.filter(c => c.projectId === activeProject.id).length + 1, `Capítulo ${story.chapters.filter(c => c.projectId === activeProject.id).length + 1}`)}>
                <Plus className="w-4 h-4" /> Agregar capítulo
              </Btn>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
