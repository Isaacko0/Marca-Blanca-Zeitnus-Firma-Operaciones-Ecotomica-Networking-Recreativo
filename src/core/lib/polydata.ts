// PolyData Logic — asimilado de Poly Data
// HyperSync stream → decode → CLOB join → enrich → query → backtest

import type { PolyDataState, PolyDataOrderFilled, PolyDataTrade, PolyDataMarket, PolyDataSyncState } from '@core/state/polydata'

// Simulated HyperSync stream (in real: Envio HyperSync API)
export const streamOrderFilled = async (state: PolyDataState, fromBlock: number): Promise<PolyDataState> => {
  const newEvents: PolyDataOrderFilled[] = []
  const toBlock = fromBlock + 10000 // simulate chunk
  
  // Generate mock events
  for (let block = fromBlock; block < toBlock; block += 100) {
    if (Math.random() > 0.3) continue
    newEvents.push({
      id: `evt_${block}`,
      transactionHash: `0x${block.toString(16).padStart(64, '0')}`,
      logIndex: Math.floor(Math.random() * 10),
      blockNumber: block,
      timestamp: Date.now() - (toBlock - block) * 12000, // ~12s per block
      maker: `0x${Math.floor(Math.random() * 1e40).toString(16).padStart(40, '0')}`,
      taker: `0x${Math.floor(Math.random() * 1e40).toString(16).padStart(40, '0')}`,
      tokenId: `token_${Math.floor(Math.random() * 1000)}`,
      price: 0.1 + Math.random() * 0.8,
      size: 10 + Math.random() * 1000,
      side: Math.random() > 0.5 ? 'BUY' : 'SELL',
      fee: 0.002 * (10 + Math.random() * 1000) * (0.1 + Math.random() * 0.8)
    })
  }
  
  const newSync: PolyDataSyncState = {
    lastBlock: toBlock,
    lastTimestamp: Date.now(),
    totalEvents: state.sync.totalEvents + newEvents.length,
    status: 'complete'
  }
  
  return {
    ...state,
    orderFilled: [...state.orderFilled, ...newEvents].slice(-50000),
    sync: newSync
  }
}

// Decode OrderFilled + CLOB join (simplified)
export const processTrades = (state: PolyDataState): PolyDataState => {
  const newTrades: PolyDataTrade[] = state.orderFilled
    .filter(e => !state.trades.some(t => t.transactionHash === e.transactionHash && t.logIndex === e.logIndex))
    .map(e => {
      // Find market metadata
      const market = state.markets.find(m => m.clobTokenIds.includes(e.tokenId))
      const token1 = market ? market.token1 : 'YES'
      const token2 = market ? market.token2 : 'NO'
      const question = market ? market.question : `Market ${e.tokenId}`
      const outcome = e.side === 'BUY' ? token1 : token2
      
      const usdAmount = e.price * e.size
      const tokenAmount = e.size
      
      return {
        id: `trade_${e.id}`,
        transactionHash: e.transactionHash,
        blockNumber: e.blockNumber,
        timestamp: e.timestamp,
        maker: e.maker,
        taker: e.taker,
        tokenId: e.tokenId,
        price: e.price,
        size: e.size,
        side: e.side,
        fee: e.fee,
        usdAmount,
        tokenAmount,
        token1,
        token2,
        question,
        outcome
      }
    })
  
  return {
    ...state,
    trades: [...state.trades, ...newTrades].slice(-50000)
  }
}

// Fetch markets from CLOB API (simulated)
export const fetchMarkets = (state: PolyDataState): PolyDataState => {
  const mockMarkets: PolyDataMarket[] = [
    { id: '1', question: 'Will BTC reach $100k by 2026?', outcomes: ['Yes', 'No'], clobTokenIds: 'token_1,token_2', token1: 'Yes', token2: 'No', endDate: Date.now() + 86400000 * 30, active: true, volume: 1000000, liquidity: 500000 },
    { id: '2', question: 'Will ETH reach $5k by 2026?', outcomes: ['Yes', 'No'], clobTokenIds: 'token_3,token_4', token1: 'Yes', token2: 'No', endDate: Date.now() + 86400000 * 60, active: true, volume: 500000, liquidity: 250000 },
    { id: '3', question: 'Will Trump win 2024?', outcomes: ['Yes', 'No'], clobTokenIds: 'token_5,token_6', token1: 'Yes', token2: 'No', endDate: Date.now() + 86400000 * 90, active: true, volume: 2000000, liquidity: 1000000 },
  ]
  
  return { ...state, markets: mockMarkets }
}

// Query trades by maker (Smart Money analysis)
export const queryTradesByMaker = (state: PolyDataState, maker: string): PolyDataTrade[] => 
  state.trades.filter(t => t.maker.toLowerCase() === maker.toLowerCase())

// Query trades by market
export const queryTradesByMarket = (state: PolyDataState, marketId: string): PolyDataTrade[] =>
  state.trades.filter(t => t.tokenId === marketId || t.question.includes(marketId))

// Backtest framework (simplified)
export const runBacktest = (state: PolyDataState, strategy: 'copy' | 'arb' | 'momentum'): PolyDataState => {
  // Simulate backtest on historical trades
  const results = {
    strategy,
    pnl: (Math.random() - 0.3) * 10000,
    winRate: 0.5 + Math.random() * 0.3,
    sharpe: 0.5 + Math.random() * 2,
    trades: Math.floor(100 + Math.random() * 500)
  }
  
  return {
    ...state,
    backtestResults: [...state.backtestResults.filter(r => r.strategy !== strategy), results]
  }
}

// Incremental sync (resumable)
export const incrementalSync = async (state: PolyDataState): Promise<PolyDataState> => {
  let current = { ...state, sync: { ...state.sync, status: 'syncing' } }
  current = await streamOrderFilled(current, state.sync.lastBlock)
  current = processTrades(current)
  return { ...current, sync: { ...current.sync, status: 'complete' } }
}

export const getSyncStatus = (state: PolyDataState) => state.sync
export const getTradeStats = (state: PolyDataState) => ({
  totalTrades: state.trades.length,
  uniqueMakers: new Set(state.trades.map(t => t.maker)).size,
  uniqueMarkets: new Set(state.trades.map(t => t.tokenId)).size,
  totalVolume: state.trades.reduce((s, t) => s + t.usdAmount, 0),
  lastBlock: state.sync.lastBlock
})
