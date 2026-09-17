// Polybot Logic — asimilado de Polybot
// Ingest → Strategy → Execute → Analyze → Replicate

import type { PolybotState, PolybotTrade, PolybotStrategy, PolybotSignal, PolybotReplication } from '@core/state/polybot'

export const ingestTrades = (state: PolybotState, trades: Omit<PolybotTrade, 'id'>[]): PolybotState => {
  const newTrades: PolybotTrade[] = trades.map((t, i) => ({ ...t, id: `trade_${Date.now()}_${i}` }))
  return {
    ...state,
    trades: [...state.trades, ...newTrades].slice(-10000),
    ingestCursor: Date.now()
  }
}

export const addStrategy = (state: PolybotState, strategy: Omit<PolybotStrategy, 'id' | 'performance'>): PolybotState => {
  const newStrategy: PolybotStrategy = {
    ...strategy,
    id: `strat_${Date.now()}`,
    performance: { pnl: 0, winRate: 0, sharpe: 0, trades: 0, replicationScore: 0 }
  }
  return { ...state, strategies: [...state.strategies, newStrategy] }
}

export const toggleStrategy = (state: PolybotState, strategyId: string): PolybotState => ({
  ...state,
  strategies: state.strategies.map(s => s.id === strategyId ? { ...s, enabled: !s.enabled } : s)
})

export const generateSignal = (state: PolybotState, strategyId: string, marketId: string, signal: 'LONG' | 'SHORT' | 'CLOSE', strength: number): PolybotState => {
  const strategy = state.strategies.find(s => s.id === strategyId)
  if (!strategy || !strategy.enabled) return state
  
  const newSignal: PolybotSignal = {
    id: `sig_${Date.now()}`,
    timestamp: Date.now(),
    strategyId,
    marketId,
    signal,
    strength,
    executed: false
  }
  
  return { ...state, signals: [...state.signals, newSignal] }
}

export const executeSignal = (state: PolybotState, signalId: string, fillPrice: number): PolybotState => {
  const signal = state.signals.find(s => s.id === signalId)
  if (!signal || signal.executed) return state
  
  const executedSignal = { ...signal, executed: true, fillPrice }
  const trade: PolybotTrade = {
    id: `trade_${Date.now()}`,
    timestamp: Date.now(),
    marketId: signal.marketId,
    side: signal.signal === 'LONG' ? 'BUY' : signal.signal === 'SHORT' ? 'SELL' : 'BUY',
    price: fillPrice,
    size: signal.strength * 100, // simplified sizing
    tokenId: `token_${signal.marketId}`,
    maker: 'zeitnus_node',
    taker: 'market',
    fee: fillPrice * 0.002 * signal.strength * 100,
    strategy: signal.strategyId
  }
  
  return {
    ...state,
    signals: state.signals.map(s => s.id === signalId ? executedSignal : s),
    trades: [...state.trades, trade],
    dailyPnL: state.dailyPnL + (signal.signal === 'LONG' ? 10 : -10) // simplified
  }
}

export const analyzeReplication = (state: PolybotState, trades: PolybotTrade[]): PolybotReplication[] => {
  // Group by maker, compute metrics
  const byMaker = new Map<string, PolybotTrade[]>()
  for (const trade of trades) {
    if (!byMaker.has(trade.maker)) byMaker.set(trade.maker, [])
    byMaker.get(trade.maker)!.push(trade)
  }
  
  const replications: PolybotReplication[] = []
  for (const [maker, makerTrades] of byMaker) {
    if (makerTrades.length < 10) continue // min trades
    
    const wins = makerTrades.filter(t => t.side === 'BUY').length // simplified
    const winRate = wins / makerTrades.length
    const grossProfit = makerTrades.filter(t => t.side === 'BUY').reduce((s, t) => s + t.size * t.price * 0.01, 0)
    const grossLoss = makerTrades.filter(t => t.side === 'SELL').reduce((s, t) => s + t.size * t.price * 0.01, 0)
    const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : 999
    const consistency = 1 - Math.abs(winRate - 0.5) * 2 // simplified
    
    replications.push({
      traderAddress: maker,
      winRate,
      profitFactor,
      consistency,
      totalPnL: grossProfit - grossLoss,
      tradeCount: makerTrades.length,
      score: (winRate * 0.4 + Math.min(profitFactor, 5) / 5 * 0.3 + consistency * 0.3),
      flagged: winRate < 0.6 || profitFactor < 1.5 || consistency < 0.7
    })
  }
  
  return replications.sort((a, b) => b.score - a.score)
}

export const updateReplications = (state: PolybotState): PolybotState => ({
  ...state,
  replications: analyzeReplication(state, state.trades)
})

export const toggleRunning = (state: PolybotState): PolybotState => ({
  ...state,
  running: !state.running
})

export const togglePaperMode = (state: PolybotState): PolybotState => ({
  ...state,
  paperMode: !state.paperMode
})

export const getEnabledStrategies = (state: PolybotState) => state.strategies.filter(s => s.enabled)
export const getTopReplications = (state: PolybotState, n = 10) => state.replications.slice(0, n)
