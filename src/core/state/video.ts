// Video State — asimilado de Remotion (programmatic video with React)
// Anfibio: sin render server, solo timeline/state

export interface VideoComposition {
  id: string
  title: string
  duration: number // seconds
  fps: number
  width: number
  height: number
  clips: VideoClip[]
  status: 'draft' | 'preview' | 'render'
  createdAt: number
}

export interface VideoClip {
  id: string
  src: string
  startFrame: number
  duration: number
  layer: number
}

export interface VideoState {
  compositions: VideoComposition[]
  activeComposition: string | null
  playbackFrame: number
  playing: boolean
}

export const makeVideoState = (): VideoState => ({
  compositions: [],
  activeComposition: null,
  playbackFrame: 0,
  playing: false,
})
