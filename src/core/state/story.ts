// Story State — asimilado de MuMuAINovel (novel creation assistant)
// Stack: Zustand + TypeScript (anfibio: sin APIs externas, sin vector DB)

export interface StoryProject {
  id: string
  title: string
  genre: string
  synopsis: string
  createdAt: number
  updatedAt: number
  status: 'outline' | 'drafting' | 'review' | 'complete'
}

export interface StoryChapter {
  id: string
  projectId: string
  order: number
  title: string
  content: string
  wordCount: number
  status: 'outline' | 'drafted' | 'reviewed' | 'approved'
  createdAt: number
}

export interface StoryOutline {
  id: string
  projectId: string
  pages: { title: string; summary: string }[]
  createdAt: number
}

export interface StoryState {
  projects: StoryProject[]
  chapters: StoryChapter[]
  outlines: StoryOutline[]
  activeProject: string | null
}

export const makeStoryState = (): StoryState => ({
  projects: [],
  chapters: [],
  outlines: [],
  activeProject: null,
})
