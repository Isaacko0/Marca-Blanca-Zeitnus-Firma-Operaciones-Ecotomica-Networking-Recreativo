// Highlight State — asimilado de AutoClip (AI video clipping/highlights)
// Pipeline: video → AI analysis → clip selection → export

export interface HighlightProject {
  id: string
  title: string
  sourceVideo: string
  duration: number // seconds
  highlights: Highlight[]
  status: 'uploaded' | 'analyzing' | 'ready' | 'exported'
  createdAt: number
}

export interface Highlight {
  id: string
  startSec: number
  endSec: number
  score: number // 0-1 relevance score
  reason: string
  exported: boolean
}

export interface HighlightState {
  projects: HighlightProject[]
  activeProject: string | null
}

export const makeHighlightState = (): HighlightState => ({
  projects: [],
  activeProject: null,
})
