// Clodds Logic — asimilado de CloddsBot
// Strategy registry + venue adapters + chat interface

import type { CloddsStrategy, CloddsVenue, CloddsState, CloddsChatMessage } from '@core/state/clodds'

// Built-in strategies (118+ from CloddsBot, subset for Zeitnus)
export const BUILTIN_STRATEGIES: CloddsStrategy[] = [
  { id: 'binance_poly_latency', name: 'Binance-Polymarket Latency Arb', category: 'latency', venue: ['Polymarket'], description: 'Exploit price latency between Binance and Polymarket', enabled: true, params: { threshold: 0.02 } },
  { id: 'penny_clipper', name: 'Penny Clipper', category: 'arbitrage', venue: ['Polymarket'], description: 'Clip penny-wide spreads on high-volume markets', enabled: true, params: { minSpread: 0.01 } },
  { id: 'dca_bot', name: 'DCA Bot', category: 'dca', venue: ['Polymarket', 'Kalshi'], description: 'Dollar-cost average into positions', enabled: true, params: { interval: 3600, amount: 10 } },
  { id: 'smart_routing', name: 'Smart Routing', category: 'smart_routing', venue: ['Polymarket', 'Kalshi', 'PredictIt'], description: 'Route orders to best venue', enabled: true, params: { slippage: 0.005 } },
  { id: 'whale_tracker', name: 'Whale Tracker', category: 'whale', venue: ['Polymarket'], description: 'Track large wallet activity', enabled: true, params: { minSize: 10000 } },
  { id: 'copy_trading', name: 'Copy Trading', category: 'copy', venue: ['Polymarket'], description: 'Replicate top trader positions', enabled: true, params: { minWinRate: 0.6 } },
  { id: 'market_maker', name: 'Market Maker', category: 'market_making', venue: ['Polymarket'], description: 'Provide liquidity on both sides', enabled: false, params: { spread: 0.02 } },
]

// Venue adapters
export const BUILTIN_VENUES: CloddsVenue[] = [
  { id: 'polymarket', name: 'Polymarket', type: 'prediction', enabled: true, markets: 1000, adapter: 'PolymarketAdapter' },
  { id: 'kalshi', name: 'Kalshi', type: 'prediction', enabled: true, markets: 200, adapter: 'KalshiAdapter' },
  { id: 'predictit', name: 'PredictIt', type: 'prediction', enabled: false, markets: 50, adapter: 'PredictItAdapter' },
  { id: 'manifold', name: 'Manifold', type: 'prediction', enabled: false, markets: 500, adapter: 'ManifoldAdapter' },
]

let counter = 0
const uid = () => `msg_${Date.now()}_${++counter}`

export const addChatMessage = (state: CloddsState, role: CloddsChatMessage['role'], content: string): CloddsState => ({
  ...state,
  chatHistory: [...state.chatHistory, { id: uid(), role, content, timestamp: Date.now() }]
})

export const setActiveStrategy = (state: CloddsState, strategyId: string): CloddsState => ({
  ...state,
  activeStrategy: strategyId,
  strategies: state.strategies.map(s => ({ ...s, enabled: s.id === strategyId }))
})

export const toggleVenue = (state: CloddsState, venueId: string): CloddsState => ({
  ...state,
  venues: state.venues.map(v => v.id === venueId ? { ...v, enabled: !v.enabled } : v),
  activeVenue: state.activeVenue === venueId ? null : venueId
})

export const toggleDryRun = (state: CloddsState): CloddsState => ({
  ...state,
  dryRun: !state.dryRun
})

export const executeStrategy = (state: CloddsState, strategyId: string): { state: CloddsState; result: string } => {
  const strategy = state.strategies.find(s => s.id === strategyId)
  if (!strategy) return { state, result: 'Strategy not found' }
  
  // Simulate execution (dry-run)
  const result = state.dryRun 
    ? `[DRY-RUN] Would execute ${strategy.name} on ${strategy.venue.join(', ')}`
    : `Executed ${strategy.name}`
  
  return {
    state: addChatMessage(state, 'assistant', result),
    result
  }
}

export const getEnabledStrategies = (state: CloddsState): CloddsStrategy[] => 
  state.strategies.filter(s => s.enabled)

export const getEnabledVenues = (state: CloddsState): CloddsVenue[] =>
  state.venues.filter(v => v.enabled)
