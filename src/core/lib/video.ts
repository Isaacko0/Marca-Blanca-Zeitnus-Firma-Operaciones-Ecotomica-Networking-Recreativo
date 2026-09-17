// Video Logic — asimilado de Remotion

import type { VideoComposition, VideoClip, VideoState } from '@core/state/video'

let counter = 0
const uid = (prefix: string) => `${prefix}_${Date.now()}_${++counter}`

export const createComposition = (title: string, duration: number = 30, fps: number = 30): VideoComposition => ({
  id: uid('vid'),
  title,
  duration,
  fps,
  width: 1920,
  height: 1080,
  clips: [],
  status: 'draft',
  createdAt: Date.now(),
})

export const addClip = (composition: VideoComposition, src: string, startFrame: number, duration: number, layer: number = 0): VideoComposition => ({
  ...composition,
  clips: [...composition.clips, {
    id: uid('clip'),
    src,
    startFrame,
    duration,
    layer,
  }],
})

export const togglePlayback = (state: VideoState): VideoState => ({
  ...state,
  playing: !state.playing,
})

export const seekFrame = (state: VideoState, frame: number): VideoState => ({
  ...state,
  playbackFrame: Math.max(0, frame),
})
