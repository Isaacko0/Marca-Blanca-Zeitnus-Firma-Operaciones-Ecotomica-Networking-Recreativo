// Highlight Logic — asimilado de AutoClip

import type { HighlightProject, Highlight, HighlightState } from '@core/state/highlight'

let counter = 0
const uid = (prefix: string) => `${prefix}_${Date.now()}_${++counter}`

export const createHighlightProject = (title: string, sourceVideo: string, duration: number): HighlightProject => ({
  id: uid('hl'),
  title,
  sourceVideo,
  duration,
  highlights: [],
  status: 'uploaded',
  createdAt: Date.now(),
})

export const addHighlight = (project: HighlightProject, startSec: number, endSec: number, score: number, reason: string): HighlightProject => ({
  ...project,
  highlights: [...project.highlights, {
    id: uid('h'),
    startSec,
    endSec,
    score,
    reason,
    exported: false,
  }],
})

export const exportHighlight = (project: HighlightProject, highlightId: string): HighlightProject => ({
  ...project,
  highlights: project.highlights.map(h =>
    h.id === highlightId ? { ...h, exported: true } : h
  ),
})

export const highlightCount = (project: HighlightProject): number => project.highlights.length

export const totalHighlightDuration = (project: HighlightProject): number =>
  project.highlights.reduce((sum, h) => sum + (h.endSec - h.startSec), 0)
