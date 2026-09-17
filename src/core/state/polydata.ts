// PolyData State — asimilado de Poly Data (warproxxx)
// Local trade database: sync → decode → enrich → store → query → backtest

export interface PolyDataOrderFilled {
  id: string
  transactionHash: string
  logIndex: number
  blockNumber: number
  timestamp: number
  maker: string
  taker: string
  tokenId: string
  price: number
  size: number
  side: 'BUY' | 'SELL'
  fee: number
}

export interface PolyDataTrade {
  id: string
  transactionHash: string
  blockNumber: number
  timestamp: number
  maker: string
  taker: string
  tokenId: string
  price: number
  size: number
  side: 'BUY' | 'SELL'
  fee: number
  usdAmount: number
  tokenAmount: number
  token1: string
  token2: string
  question: string
  outcome: string
}

export interface PolyDataMarket {
  id: string
  question: string
  outcomes: string[]
  clobTokenIds: string
  token1: string
  token2: string
  endDate: number
  active: boolean
  volume: number
  liquidity: number
}

export interface PolyDataSyncState {
  lastBlock: number
  lastTimestamp: number
  totalEvents: number
  status: 'idle' | 'syncing' | 'processing' | 'complete' | 'error'
  error?: string
}

export interface PolyDataState {
  orderFilled: PolyDataOrderFilled[]
  trades: PolyDataTrade[]
  markets: PolyDataMarket[]
  sync: PolyDataSyncState
  backtestResults: { strategy: string; pnl: number; winRate: number; sharpe: number; trades: number }[]
  queryCache: Record<string, unknown>
}

export const makePolyDataState = (): PolyDataState => ({
  orderFilled: [],
  trades: [],
  markets: [],
  sync: { lastBlock: 0, lastTimestamp: 0, totalEvents: 0, status: 'idle' },
  backtestResults: [],
  queryCache: {},
})
