// LPTool State — asimilado de Polymarket LP Tool
// Passive LP manager: whitelist → filter → pricing → execution → monitoring

export interface LPToolWhitelistEntry {
  tokenId: string
  side: 'YES' | 'NO' | 'BOTH'
  enabled: boolean
  customPricing: boolean
}

export interface LPToolPricingRule {
  tokenId: string
  side: 'YES' | 'NO'
  type: 'coarse' | 'fine' | 'custom'
  params: Record<string, number>
  source: 'default' | 'telegram' | 'web' | 'json'
}

export interface LPToolOrder {
  id: string
  tokenId: string
  side: 'YES' | 'NO'
  price: number
  size: number
  originalPrice: number
  status: 'active' | 'cancelled' | 'replaced' | 'filled'
  lastUpdate: number
  fills: number
}

export interface LPToolMetrics {
  tokenId: string
  side: 'YES' | 'NO'
  rewardRate: number
  halfWidthDelta: number
  midpoint: number
  spread: number
  depth: number
  inventory: number
  pnl: number
}

export interface LPToolState {
  whitelist: LPToolWhitelistEntry[]
  pricingRules: LPToolPricingRule[]
  orders: LPToolOrder[]
  metrics: LPToolMetrics[]
  antiSniping: {
    midpointJumpPause: boolean
    emaFilter: boolean
    medianFilter: boolean
    postFillCooldown: number // seconds
    maxChaseDistance: number // price distance
  }
  running: boolean
  dryRun: boolean
  lastTick: number
}

export const makeLPToolState = (): LPToolState => ({
  whitelist: [],
  pricingRules: [],
  orders: [],
  metrics: [],
  antiSniping: {
    midpointJumpPause: true,
    emaFilter: true,
    medianFilter: true,
    postFillCooldown: 30,
    maxChaseDistance: 0.01
  },
  running: false,
  dryRun: true,
  lastTick: 0,
})
