import { Film, Play, Pause, Plus, SkipForward } from 'lucide-react'
import { useAppStore } from '@core/state/store'
import { Card, Stat, Btn } from '@components/ui'

export function Video() {
  const { video, addVideoComposition, addVideoClip, toggleVideoPlayback, seekVideo } = useAppStore()
  const activeComp = video.compositions.find(c => c.id === video.activeComposition)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-jost text-2xl md:text-3xl font-semibold flex items-center gap-2">
          <Film className="w-6 h-6 text-chispa" />
          Video Studio · Remotion
        </h1>
        <p className="text-[var(--dim)] mt-1">Composición de video programable · timeline → clips → playback</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Composiciones" value={String(video.compositions.length)} sub="Videos" />
        <Stat label="Clips" value={String(activeComp?.clips.length || 0)} sub={activeComp ? `en ${activeComp.title}` : 'Sin comp'} />
        <Stat label="Frame" value={String(video.playbackFrame)} sub={`de ${activeComp ? Math.floor(activeComp.duration * activeComp.fps) : 0}`} />
        <Stat label="Estado" value={video.playing ? 'PLAY' : 'STOP'} color={video.playing ? 'text-emerald-400' : 'text-orange-400'} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card title="Composiciones">
          <div className="space-y-3">
            {video.compositions.length === 0 && (
              <p className="text-[var(--dim)] text-sm">Crea una composición de video. Sin render server — estado lógico anfibio.</p>
            )}
            {video.compositions.map(c => (
              <div key={c.id} className="p-3 bg-[var(--surf2)] border border-[var(--line)] rounded-xl">
                <p className="font-medium">{c.title}</p>
                <p className="text-[var(--dim)] text-xs">{c.duration}s · {c.fps}fps · {c.clips.length} clips</p>
              </div>
            ))}
            <Btn onClick={() => addVideoComposition('Nueva composición', 30, 30)}>
              <Plus className="w-4 h-4" /> Crear composición
            </Btn>
          </div>
        </Card>

        <Card title={activeComp ? `Timeline: ${activeComp.title}` : 'Timeline'}>
          <div className="space-y-3">
            {!activeComp ? (
              <p className="text-[var(--dim)] text-sm">Selecciona una composición.</p>
            ) : (
              <>
                <div className="flex gap-2">
                  <Btn onClick={toggleVideoPlayback}>
                    {video.playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {video.playing ? 'Pausar' : 'Play'}
                  </Btn>
                  <Btn onClick={() => seekVideo(video.playbackFrame + 30)}>
                    <SkipForward className="w-4 h-4" /> +1s
                  </Btn>
                  <Btn onClick={() => addVideoClip(activeComp.id, 'clip-placeholder.mp4', video.playbackFrame, 90)}>
                    <Plus className="w-4 h-4" /> Clip
                  </Btn>
                </div>
                <div className="relative h-32 bg-[var(--surf2)] border border-[var(--line)] rounded-xl overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[var(--dim)] text-sm">Frame {video.playbackFrame}</span>
                  </div>
                  {activeComp.clips.map(clip => (
                    <div
                      key={clip.id}
                      className="absolute top-2 bottom-2 bg-chispa/30 border border-chispa rounded"
                      style={{
                        left: `${(clip.startFrame / Math.max(1, activeComp.duration * activeComp.fps)) * 100}%`,
                        width: `${(clip.duration / Math.max(1, activeComp.duration * activeComp.fps)) * 100}%`,
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
