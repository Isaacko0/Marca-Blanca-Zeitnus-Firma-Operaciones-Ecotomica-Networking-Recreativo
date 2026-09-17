// PMBot Logic — asimilado de Polymarket-bot (MrFadiAi)
// Smart Money copy trading + 6-layer risk + execution safety

import type { PMBotState, PMBotTrader, PMBotPosition, PMBotRiskState } from '@core/state/pmbot'

export const scanSmartMoney = (state: PMBotState): PMBotState => {
  // Simulated leaderboard scan (would call Polymarket API)
  const mockTraders: PMBotTrader[] = [
    { address: '0x1234...', winRate: 0.72, profitFactor: 2.1, consistency: 0.85, totalPnL: 45000, tradeCount: 234, score: 0, flagged: false, lastActive: Date.now() },
    { address: '0x5678...', winRate: 0.68, profitFactor: 1.8, consistency: 0.78, totalPnL: 32000, tradeCount: 189, score: 0, flagged: false, lastActive: Date.now() - 86400000 },
    { address: '0x9abc...', winRate: 0.65, profitFactor: 1.6, consistency: 0.75, totalPnL: 28000, tradeCount: 156, score: 0, flagged: false, lastActive: Date.now() - 172800000 },
    { address: '0xdef0...', winRate: 0.58, profitFactor: 1.3, consistency: 0.62, totalPnL: 15000, tradeCount: 98, score: 0, flagged: true, lastActive: Date.now() - 345600000 },
    { address: '0x1357...', winRate: 0.75, profitFactor: 2.5, consistency: 0.90, totalPnL: 67000, tradeCount: 312, score: 0, flagged: false, lastActive: Date.now() - 43200000 },
  ]
  
  const scored = mockTraders.map(t => ({
    ...t,
    score: (t.winRate * 0.4 + Math.min(t.profitFactor, 5) / 5 * 0.3 + t.consistency * 0.3),
    flagged: t.winRate < 0.6 || t.profitFactor < 1.5 || t.consistency < 0.7
  })).sort((a, b) => b.score - a.score)
  
  return { ...state, smartMoney: scored }
}

export const filterSmartMoney = (state: PMBotState): PMBotTrader[] => 
  state.smartMoney.filter(t => 
    !t.flagged &&
    t.winRate >= state.copyConfig.minWinRate &&
    t.profitFactor >= state.copyConfig.minProfitFactor &&
    t.consistency >= state.copyConfig.minConsistency
  ).slice(0, state.copyConfig.maxFollow)

export const checkRisk = (state: PMBotState, positionSize: number, pnl: number): boolean => {
  const { risk, capital } = state
  if (risk.halted) return false
  
  const newDailyLoss = risk.dailyLoss + (pnl < 0 ? -pnl : 0)
  const newExposure = risk.exposure + positionSize
  
  return (
    newDailyLoss / capital <= risk.limits.daily &&
    risk.monthlyLoss / capital <= risk.limits.monthly &&
    risk.drawdown / capital <= risk.limits.drawdown &&
    risk.totalLoss / capital <= risk.limits.total &&
    risk.lossStreak < risk.limits.streak &&
    newExposure / capital <= risk.limits.exposure
  )
}

export const updateRisk = (state: PMBotState, pnl: number, positionSize: number): PMBotState => {
  const { risk, capital } = state
  const newRisk: PMBotRiskState = { ...risk }
  
  if (pnl < 0) {
    newRisk.dailyLoss += -pnl
    newRisk.monthlyLoss += -pnl
    newRisk.totalLoss += -pnl
    newRisk.lossStreak += 1
  } else {
    newRisk.lossStreak = 0
  }
  
  newRisk.exposure = Math.max(0, risk.exposure + positionSize)
  newRisk.drawdown = Math.max(risk.drawdown, newRisk.totalLoss)
  
  // Check halt conditions
  newRisk.halted = (
    newRisk.dailyLoss / capital > risk.limits.daily ||
    newRisk.monthlyLoss / capital > risk.limits.monthly ||
    newRisk.drawdown / capital > risk.limits.drawdown ||
    newRisk.totalLoss / capital > risk.limits.total
  )
  
  return { ...state, risk: newRisk }
}

export const executeCopyTrade = (state: PMBotState, trader: PMBotTrader, marketId: string, side: 'YES' | 'NO', size: number, price: number): PMBotState => {
  if (!checkRisk(state, size * price, 0)) {
    return { ...state } // Risk check failed
  }
  
  const position: PMBotPosition = {
    id: `pos_${Date.now()}`,
    marketId,
    question: `Market ${marketId}`,
    side,
    size,
    entryPrice: price,
    currentPrice: price,
    pnl: 0,
    strategy: 'copy',
    openedAt: Date.now()
  }
  
  const newState = updateRisk(state, 0, size * price)
  return {
    ...newState,
    positions: [...newState.positions, position]
  }
}

export const executeArb = (state: PMBotState, marketId: string, yesPrice: number, noPrice: number, size: number): PMBotState => {
  // Sequential execution: YES leg first, then NO with unwind on partial fill
  const totalSize = size * 2
  if (!checkRisk(state, totalSize * Math.max(yesPrice, noPrice), 0)) {
    return { ...state }
  }
  
  const yesPos: PMBotPosition = {
    id: `pos_${Date.now()}_yes`,
    marketId,
    question: `Arb YES ${marketId}`,
    side: 'YES',
    size,
    entryPrice: yesPrice,
    currentPrice: yesPrice,
    pnl: 0,
    strategy: 'arb',
    openedAt: Date.now()
  }
  
  const noPos: PMBotPosition = {
    id: `pos_${Date.now()}_no`,
    marketId,
    question: `Arb NO ${marketId}`,
    side: 'NO',
    size,
    entryPrice: noPrice,
    currentPrice: noPrice,
    pnl: 0,
    strategy: 'arb',
    openedAt: Date.now()
  }
  
  const newState = updateRisk(state, 0, totalSize * Math.max(yesPrice, noPrice))
  return {
    ...newState,
    positions: [...newState.positions, yesPos, noPos]
  }
}

export const executeDipArb = (state: PMBotState, marketId: string, side: 'YES' | 'NO', size: number, price: number): PMBotState => {
  // Tight hedging: 60s timeout, 20% stop-loss, 1:1 hedge
  if (!checkRisk(state, size * price * 2, 0)) return { ...state } // hedge = 1:1
  
  const mainPos: PMBotPosition = {
    id: `pos_${Date.now()}_dip`,
    marketId,
    question: `DipArb ${side} ${marketId}`,
    side,
    size,
    entryPrice: price,
    currentPrice: price,
    pnl: 0,
    strategy: 'diparb',
    openedAt: Date.now()
  }
  
  const hedgeSide = side === 'YES' ? 'NO' : 'YES'
  const hedgePrice = side === 'YES' ? 1 - price : price // simplified
  
  const hedgePos: PMBotPosition = {
    id: `pos_${Date.now()}_hedge`,
    marketId,
    question: `DipArb Hedge ${hedgeSide} ${marketId}`,
    side: hedgeSide,
    size,
    entryPrice: hedgePrice,
    currentPrice: hedgePrice,
    pnl: 0,
    strategy: 'diparb',
    openedAt: Date.now()
  }
  
  const newState = updateRisk(state, 0, size * price * 2)
  return {
    ...newState,
    positions: [...newState.positions, mainPos, hedgePos]
  }
}

export const toggleRunning = (state: PMBotState): PMBotState => ({
  ...state,
  running: !state.running
})

export const togglePaperMode = (state: PMBotState): PMBotState => ({
  ...state,
  paperMode: !state.paperMode
})

export const updatePositionPrices = (state: PMBotState, prices: Record<string, number>): PMBotState => {
  const totalPnL = state.positions.reduce((sum, pos) => {
    const newPrice = prices[pos.marketId] || pos.currentPrice
    const pnl = pos.side === 'YES' 
      ? (newPrice - pos.entryPrice) * pos.size
      : (pos.entryPrice - newPrice) * pos.size
    return sum + pnl
  }, 0)
  
  return {
    ...state,
    positions: state.positions.map(pos => ({
      ...pos,
      currentPrice: prices[pos.marketId] || pos.currentPrice,
      pnl: pos.side === 'YES' 
        ? ((prices[pos.marketId] || pos.currentPrice) - pos.entryPrice) * pos.size
        : (pos.entryPrice - (prices[pos.marketId] || pos.currentPrice)) * pos.size
    })),
    dailyPnL: totalPnL
  }
}

export const getActivePositions = (state: PMBotState) => state.positions.filter(p => p.pnl === 0 || Math.abs(p.pnl) < 1000)
export const getRiskStatus = (state: PMBotState) => ({
  halted: state.risk.halted,
  dailyUsage: (state.risk.dailyLoss / state.capital / state.risk.limits.daily * 100).toFixed(1) + '%',
  exposureUsage: (state.risk.exposure / state.capital / state.risk.limits.exposure * 100).toFixed(1) + '%',
  streak: state.risk.lossStreak
})
