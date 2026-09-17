// Polybot State — asimilado de Polybot (ent0n29)
// Unified quant platform: ingest → strategy → execute → analyze → replicate

export interface PolybotTrade {
  id: string
  timestamp: number
  marketId: string
  side: 'BUY' | 'SELL'
  price: number
  size: number
  tokenId: string
  maker: string
  taker: string
  fee: number
  strategy?: string
}

export interface PolybotStrategy {
  id: string
  name: string
  type: 'market_making' | 'arbitrage' | 'momentum' | 'mean_reversion' | 'copy_trading'
  enabled: boolean
  params: Record<string, unknown>
  performance: { pnl: number; winRate: number; sharpe: number; trades: number; replicationScore: number }
}

export interface PolybotSignal {
  id: string
  timestamp: number
  strategyId: string
  marketId: string
  signal: 'LONG' | 'SHORT' | 'CLOSE'
  strength: number // 0-1
  executed: boolean
  fillPrice?: number
}

export interface PolybotReplication {
  traderAddress: string
  winRate: number
  profitFactor: number
  consistency: number
  totalPnL: number
  tradeCount: number
  score: number // replication score
  flagged: boolean
}

export interface PolybotState {
  trades: PolybotTrade[]
  strategies: PolybotStrategy[]
  signals: PolybotSignal[]
  replications: PolybotReplication[]
  ingestCursor: number // last processed block/event
  running: boolean
  paperMode: boolean
  capital: number
  dailyPnL: number
}

export const makePolybotState = (): PolybotState => ({
  trades: [],
  strategies: [],
  signals: [],
  replications: [],
  ingestCursor: 0,
  running: false,
  paperMode: true,
  capital: 10000,
  dailyPnL: 0,
})
