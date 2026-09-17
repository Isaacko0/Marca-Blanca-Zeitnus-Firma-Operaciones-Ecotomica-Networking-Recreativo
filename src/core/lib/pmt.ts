// PMT Logic — asimilado de Prediction Markets Trading Bot Toolkits
// Engine core + risk layer + strategy registry + venue adapters

import type { PMTState, PMTAdapter, PMTStrategy, PMTEngineConfig } from '@core/state/pmt'

export const BUILTIN_ADAPTERS: PMTAdapter[] = [
  { id: 'polymarket', name: 'Polymarket Adapter', venue: 'Polymarket', enabled: true, markets: ['all'], config: { clobApi: true, ws: true } },
  { id: 'kalshi', name: 'Kalshi Adapter', venue: 'Kalshi', enabled: true, markets: ['all'], config: { restApi: true } },
  { id: 'predictit', name: 'PredictIt Adapter', venue: 'PredictIt', enabled: false, markets: ['all'], config: { scraping: true } },
  { id: 'manifold', name: 'Manifold Adapter', venue: 'Manifold', enabled: false, markets: ['all'], config: { graphql: true } },
]

export const BUILTIN_STRATEGIES: PMTStrategy[] = [
  { id: 'copy_trading', name: 'Copy Trading', type: 'copy_trading', enabled: true, adapterIds: ['polymarket'], params: { minWinRate: 0.6, maxFollow: 5 }, performance: { pnl: 0, winRate: 0, sharpe: 0, trades: 0 } },
  { id: 'poly_kalshi_arb', name: 'Polymarket-Kalshi Arbitrage', type: 'arbitrage', enabled: true, adapterIds: ['polymarket', 'kalshi'], params: { minSpread: 0.02 }, performance: { pnl: 0, winRate: 0, sharpe: 0, trades: 0 } },
  { id: 'general_arb', name: 'General Arbitrage', type: 'general_arb', enabled: false, adapterIds: ['polymarket', 'kalshi', 'predictit'], params: { minSpread: 0.015 }, performance: { pnl: 0, winRate: 0, sharpe: 0, trades: 0 } },
  { id: 'whale_tracking', name: 'Whale Tracking', type: 'whale_tracking', enabled: true, adapterIds: ['polymarket'], params: { minSize: 10000 }, performance: { pnl: 0, winRate: 0, sharpe: 0, trades: 0 } },
  { id: 'spread_farming', name: 'Spread Farming', type: 'spread_farming', enabled: false, adapterIds: ['polymarket'], params: { targetSpread: 0.03 }, performance: { pnl: 0, winRate: 0, sharpe: 0, trades: 0 } },
  { id: 'market_making', name: 'Market Making', type: 'market_making', enabled: false, adapterIds: ['polymarket'], params: { spread: 0.02, inventoryTarget: 0 }, performance: { pnl: 0, winRate: 0, sharpe: 0, trades: 0 } },
  { id: 'momentum', name: 'Momentum', type: 'momentum', enabled: false, adapterIds: ['polymarket'], params: { lookback: 3600 }, performance: { pnl: 0, winRate: 0, sharpe: 0, trades: 0 } },
  { id: 'mean_reversion', name: 'Mean Reversion', type: 'mean_reversion', enabled: false, adapterIds: ['polymarket'], params: { window: 1800 }, performance: { pnl: 0, winRate: 0, sharpe: 0, trades: 0 } },
  { id: 'order_flow', name: 'Order Flow Analysis', type: 'order_flow', enabled: false, adapterIds: ['polymarket'], params: { depth: 10 }, performance: { pnl: 0, winRate: 0, sharpe: 0, trades: 0 } },
  { id: 'sports_arb', name: 'Sports Arbitrage', type: 'sports_arb', enabled: false, adapterIds: ['polymarket', 'kalshi'], params: { sport: 'all' }, performance: { pnl: 0, winRate: 0, sharpe: 0, trades: 0 } },
]

let logCounter = 0
const logId = () => `log_${Date.now()}_${++logCounter}`

export const addLog = (state: PMTState, level: 'info' | 'warn' | 'error', message: string, strategy?: string): PMTState => ({
  ...state,
  logs: [...state.logs, { timestamp: Date.now(), level, message, strategy }]
})

export const setEngineConfig = (state: PMTState, config: Partial<PMTEngineConfig>): PMTState => ({
  ...state,
  engineConfig: { ...state.engineConfig, ...config }
})

export const toggleAdapter = (state: PMTState, adapterId: string): PMTState => ({
  ...state,
  adapters: state.adapters.map(a => a.id === adapterId ? { ...a, enabled: !a.enabled } : a)
})

export const toggleStrategy = (state: PMTState, strategyId: string): PMTState => ({
  ...state,
  strategies: state.strategies.map(s => s.id === strategyId ? { ...s, enabled: !s.enabled } : s),
  activeStrategy: state.activeStrategy === strategyId ? null : strategyId
})

export const updateStrategyParams = (state: PMTState, strategyId: string, params: Record<string, unknown>): PMTState => ({
  ...state,
  strategies: state.strategies.map(s => s.id === strategyId ? { ...s, params: { ...s.params, ...params } } : s)
})

export const toggleDryRun = (state: PMTState): PMTState => ({
  ...state,
  dryRun: !state.dryRun,
  engineConfig: { ...state.engineConfig, execution: { ...state.engineConfig.execution, dryRun: !state.dryRun } }
})

export const startEngine = (state: PMTState): PMTState => {
  if (!state.adapters.some(a => a.enabled)) {
    return addLog(state, 'warn', 'No adapters enabled')
  }
  if (!state.strategies.some(s => s.enabled)) {
    return addLog(state, 'warn', 'No strategies enabled')
  }
  return addLog({ ...state, running: true }, 'info', 'Engine started')
}

export const stopEngine = (state: PMTState): PMTState => 
  addLog({ ...state, running: false }, 'info', 'Engine stopped')

export const checkRisk = (state: PMTState, positionSize: number, dailyLoss: number, drawdown: number, exposure: number): boolean => {
  const { riskLayer } = state.engineConfig
  return positionSize <= riskLayer.maxPositionSize &&
         dailyLoss <= riskLayer.maxDailyLoss &&
         drawdown <= riskLayer.maxDrawdown &&
         exposure <= riskLayer.exposureCap
}

export const getEnabledAdapters = (state: PMTState) => state.adapters.filter(a => a.enabled)
export const getEnabledStrategies = (state: PMTState) => state.strategies.filter(s => s.enabled)
