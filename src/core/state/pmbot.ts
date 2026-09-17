// PMBot State — asimilado de Polymarket-bot (MrFadiAi)
// Smart Money copy trading + 6-layer risk management + execution safety

export interface PMBotTrader {
  address: string
  winRate: number
  profitFactor: number
  consistency: number
  totalPnL: number
  tradeCount: number
  score: number
  flagged: boolean
  lastActive: number
}

export interface PMBotPosition {
  id: string
  marketId: string
  question: string
  side: 'YES' | 'NO'
  size: number
  entryPrice: number
  currentPrice: number
  pnl: number
  strategy: 'copy' | 'arb' | 'diparb' | 'market_making'
  openedAt: number
}

export interface PMBotRiskState {
  dailyLoss: number
  monthlyLoss: number
  drawdown: number
  totalLoss: number
  lossStreak: number
  exposure: number
  limits: {
    daily: number // 5%
    monthly: number // 15%
    drawdown: number // 25%
    total: number // 40%
    streak: number // 6
    exposure: number // 30%
  }
  halted: boolean
}

export interface PMBotCopyConfig {
  minWinRate: number
  minProfitFactor: number
  minConsistency: number
  maxFollow: number
  refreshInterval: number // minutes
}

export interface PMBotState {
  smartMoney: PMBotTrader[]
  positions: PMBotPosition[]
  risk: PMBotRiskState
  copyConfig: PMBotCopyConfig
  executionSafety: {
    feeAware: boolean
    priceProtected: boolean
    sequentialArb: boolean
    tightHedging: boolean
    freshQuotes: boolean
    walletGating: boolean
    exposureCaps: boolean
    configurableRpc: boolean
    circuitBreaker: boolean
    backtestHarness: boolean
    maticMonitoring: boolean
    sizingFloor: boolean
  }
  running: boolean
  paperMode: boolean
  capital: number
  dailyPnL: number
}

export const makePMBotState = (): PMBotState => ({
  smartMoney: [],
  positions: [],
  risk: {
    dailyLoss: 0,
    monthlyLoss: 0,
    drawdown: 0,
    totalLoss: 0,
    lossStreak: 0,
    exposure: 0,
    limits: { daily: 0.05, monthly: 0.15, drawdown: 0.25, total: 0.40, streak: 6, exposure: 0.30 },
    halted: false
  },
  copyConfig: { minWinRate: 0.60, minProfitFactor: 1.5, minConsistency: 0.7, maxFollow: 5, refreshInterval: 60 },
  executionSafety: {
    feeAware: true,
    priceProtected: true,
    sequentialArb: true,
    tightHedging: true,
    freshQuotes: true,
    walletGating: true,
    exposureCaps: true,
    configurableRpc: true,
    circuitBreaker: true,
    backtestHarness: true,
    maticMonitoring: true,
    sizingFloor: true
  },
  running: false,
  paperMode: true,
  capital: 10000,
  dailyPnL: 0,
})
