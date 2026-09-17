// Story Logic — asimilado de MuMuAINovel
// Pipeline: idea → outline (5 pages) → chapter → review

import type { StoryProject, StoryChapter, StoryOutline } from '@core/state/story'

let counter = 0
const uid = (prefix: string) => `${prefix}_${Date.now()}_${++counter}`

export const createStoryProject = (title: string, genre: string, synopsis: string): StoryProject => ({
  id: uid('story'),
  title,
  genre,
  synopsis,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  status: 'outline',
})

export const createStoryOutline = (projectId: string): StoryOutline => ({
  id: uid('outline'),
  projectId,
  pages: [
    { title: 'I. Planteamiento', summary: '' },
    { title: 'II. Confrontación', summary: '' },
    { title: 'III. Clímax', summary: '' },
    { title: 'IV. Resolución', summary: '' },
    { title: 'V. Desenlace', summary: '' },
  ],
  createdAt: Date.now(),
})

export const createStoryChapter = (projectId: string, order: number, title: string): StoryChapter => ({
  id: uid('ch'),
  projectId,
  order,
  title,
  content: '',
  wordCount: 0,
  status: 'outline',
  createdAt: Date.now(),
})

export const updateChapterContent = (chapter: StoryChapter, content: string): StoryChapter => ({
  ...chapter,
  content,
  wordCount: content.split(/\s+/).filter(Boolean).length,
  status: 'drafted',
})

export const storyProgress = (chapters: StoryChapter[]): number => {
  if (!chapters.length) return 0
  const reviewed = chapters.filter(c => c.status === 'reviewed' || c.status === 'approved')
  return Math.round((reviewed.length / chapters.length) * 100)
}
