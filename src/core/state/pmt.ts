// PMT State — asimilado de Prediction Markets Trading Bot Toolkits
// Venue-agnostic engine + risk layer + strategy bots + adapters

export interface PMTAdapter {
  id: string
  name: string
  venue: string
  enabled: boolean
  markets: string[]
  config: Record<string, unknown>
}

export interface PMTEngineConfig {
  riskLayer: {
    maxPositionSize: number
    maxDailyLoss: number
    maxDrawdown: number
    exposureCap: number
  }
  execution: {
    dryRun: boolean
    slippageTolerance: number
    gasLimit: number
  }
}

export interface PMTStrategy {
  id: string
  name: string
  type: 'copy_trading' | 'arbitrage' | 'whale_tracking' | 'spread_farming' | 'market_making' | 'momentum' | 'mean_reversion' | 'order_flow' | 'sports_arb' | 'general_arb'
  enabled: boolean
  adapterIds: string[]
  params: Record<string, unknown>
  performance: { pnl: number; winRate: number; sharpe: number; trades: number }
}

export interface PMTState {
  adapters: PMTAdapter[]
  engineConfig: PMTEngineConfig
  strategies: PMTStrategy[]
  activeStrategy: string | null
  logs: { timestamp: number; level: 'info' | 'warn' | 'error'; message: string; strategy?: string }[]
  running: boolean
  dryRun: boolean
}

export const makePMTState = (): PMTState => ({
  adapters: [],
  engineConfig: {
    riskLayer: { maxPositionSize: 1000, maxDailyLoss: 0.05, maxDrawdown: 0.25, exposureCap: 0.3 },
    execution: { dryRun: true, slippageTolerance: 0.005, gasLimit: 500000 }
  },
  strategies: [],
  activeStrategy: null,
  logs: [],
  running: false,
  dryRun: true,
})
