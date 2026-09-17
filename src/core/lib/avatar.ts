// Avatar Logic — asimilado de PersonaLive
// Simulación de estado sin modelos pesados

import type { AvatarState } from '@core/state/avatar'

export const expressions: AvatarState['expression'][] = ['neutral', 'happy', 'sad', 'surprised', 'thinking']

export const setExpression = (state: AvatarState, expr: AvatarState['expression']): AvatarState => ({
  ...state,
  expression: expr,
})

export const toggleStreaming = (state: AvatarState): AvatarState => ({
  ...state,
  streaming: !state.streaming,
  frame: state.streaming ? state.frame : state.frame + 1,
})

export const grantConsent = (state: AvatarState): AvatarState => ({
  ...state,
  consent: true,
  active: true,
})

export const revokeConsent = (state: AvatarState): AvatarState => ({
  ...state,
  consent: false,
  active: false,
  streaming: false,
  referenceImage: null,
})
