// Visual Logic — asimilado de RedInk

import type { VisualPiece, VisualPage } from '@core/state/visual'

let counter = 0
const uid = (prefix: string) => `${prefix}_${Date.now()}_${++counter}`

export const createVisualPiece = (title: string, description: string): VisualPiece => ({
  id: uid('vis'),
  title,
  description,
  pages: [],
  status: 'outline',
  createdAt: Date.now(),
})

export const createVisualPages = (pieceId: string, count: number = 5): VisualPage[] =>
  Array.from({ length: count }, (_, i) => ({
    id: uid('vp'),
    order: i + 1,
    title: `Página ${i + 1}`,
    body: '',
  }))

export const generateVisualCopy = (piece: VisualPiece): { title: string; body: string; tags: string[] } => ({
  title: piece.title,
  body: piece.description,
  tags: ['#hscsg', '#zeitnus'],
})
