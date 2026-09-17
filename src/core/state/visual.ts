// Visual State — asimilado de RedInk (content generation)
// Pipeline: descripción → outline → cover → content → historial

export interface VisualPiece {
  id: string
  title: string
  description: string
  pages: VisualPage[]
  coverUrl?: string
  status: 'outline' | 'generating' | 'complete'
  createdAt: number
}

export interface VisualPage {
  id: string
  order: number
  title: string
  body: string
  imagePrompt?: string
  imageUrl?: string
}

export interface VisualState {
  pieces: VisualPiece[]
  activePiece: string | null
  history: { id: string; title: string; ts: number }[]
}

export const makeVisualState = (): VisualState => ({
  pieces: [],
  activePiece: null,
  history: [],
})
