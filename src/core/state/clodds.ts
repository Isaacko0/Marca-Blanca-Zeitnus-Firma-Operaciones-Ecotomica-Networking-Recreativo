// Clodds State — asimilado de CloddsBot (AI trading terminal)
// Anfibio: sin CLI global, sin 21 platforms, solo strategy registry + chat UI

export interface CloddsStrategy {
  id: string
  name: string
  category: 'latency' | 'arbitrage' | 'dca' | 'smart_routing' | 'whale' | 'copy' | 'market_making' | 'other'
  venue: string[]
  description: string
  enabled: boolean
  params: Record<string, unknown>
  performance?: { winRate: number; pnl: number; sharpe: number }
}

export interface CloddsVenue {
  id: string
  name: string
  type: 'prediction' | 'futures' | 'spot' | 'solana' | 'evm'
  enabled: boolean
  markets: number
  adapter: string // adapter name
}

export interface CloddsChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
  artifacts?: { type: 'code' | 'table' | 'chart'; data: unknown }[]
}

export interface CloddsState {
  strategies: CloddsStrategy[]
  venues: CloddsVenue[]
  chatHistory: CloddsChatMessage[]
  activeStrategy: string | null
  activeVenue: string | null
  dryRun: boolean
  connected: boolean
  pnl: { daily: number; weekly: number; total: number }
  positions: { market: string; side: 'YES' | 'NO'; size: number; entryPrice: number; currentPrice: number; pnl: number }[]
}

export const makeCloddsState = (): CloddsState => ({
  strategies: [],
  venues: [],
  chatHistory: [],
  activeStrategy: null,
  activeVenue: null,
  dryRun: true,
  connected: false,
  pnl: { daily: 0, weekly: 0, total: 0 },
  positions: [],
})
