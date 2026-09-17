// Avatar State — asimilado de PersonaLive (portrait animation)
// Anfibio: sin CUDA/PyTorch, solo estado lógico del avatar

export interface AvatarState {
  active: boolean
  expression: 'neutral' | 'happy' | 'sad' | 'surprised' | 'thinking'
  drift: 'anchored' | 'drifting'
  referenceImage: string | null
  frame: number
  streaming: boolean
  consent: boolean // Ley III: solo uso consentido propio
}

export const makeAvatarState = (): AvatarState => ({
  active: false,
  expression: 'neutral',
  drift: 'anchored',
  referenceImage: null,
  frame: 0,
  streaming: false,
  consent: false,
})
