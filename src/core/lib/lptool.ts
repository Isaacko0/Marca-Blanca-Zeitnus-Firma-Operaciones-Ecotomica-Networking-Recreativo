// LPTool Logic — asimilado de Polymarket LP Tool
// Whitelist → filter → pricing (coarse/fine) → execution → monitoring

import type { LPToolState, LPToolWhitelistEntry, LPToolPricingRule, LPToolOrder, LPToolMetrics } from '@core/state/lptool'

export const addWhitelistEntry = (state: LPToolState, tokenId: string, side: 'YES' | 'NO' | 'BOTH'): LPToolState => ({
  ...state,
  whitelist: [...state.whitelist, { tokenId, side, enabled: true, customPricing: false }]
})

export const removeWhitelistEntry = (state: LPToolState, tokenId: string, side: 'YES' | 'NO'): LPToolState => ({
  ...state,
  whitelist: state.whitelist.filter(w => !(w.tokenId === tokenId && (w.side === side || w.side === 'BOTH')))
})

export const setCustomPricing = (state: LPToolState, tokenId: string, side: 'YES' | 'NO', rule: LPToolPricingRule): LPToolState => ({
  ...state,
  pricingRules: [...state.pricingRules.filter(r => !(r.tokenId === tokenId && r.side === side)), rule],
  whitelist: state.whitelist.map(w => w.tokenId === tokenId && (w.side === side || w.side === 'BOTH') ? { ...w, customPricing: true } : w)
})

// Coarse tick pricing (tick ~= 0.01 or ~= 1.0)
export const priceCoarse = (midpoint: number, halfWidth: number, inventory: number): number => {
  // Simple coarse logic: widen spread based on inventory
  const skew = inventory > 0 ? -0.005 : inventory < 0 ? 0.005 : 0
  return midpoint + skew
}

// Fine tick pricing (tick ~= 0.001 or ~= 0.1)
export const priceFine = (midpoint: number, halfWidth: number, inventory: number): number => {
  // Fine logic: tighter spread, inventory-aware
  const skew = inventory > 0 ? -0.001 : inventory < 0 ? 0.001 : 0
  return midpoint + skew
}

export const computePrice = (state: LPToolState, tokenId: string, side: 'YES' | 'NO', midpoint: number, halfWidth: number, inventory: number): number => {
  const rule = state.pricingRules.find(r => r.tokenId === tokenId && r.side === side)
  if (rule && rule.type === 'custom') {
    return rule.params.price || midpoint
  }
  if (rule && rule.type === 'fine') {
    return priceFine(midpoint, halfWidth, inventory)
  }
  return priceCoarse(midpoint, halfWidth, inventory)
}

export const antiSnipingCheck = (state: LPToolState, newMidpoint: number, lastMidpoint: number): boolean => {
  if (!state.antiSniping.midpointJumpPause) return true
  const jump = Math.abs(newMidpoint - lastMidpoint) / lastMidpoint
  return jump < 0.02 // pause if >2% jump
}

export const tick = (state: LPToolState): LPToolState => {
  if (!state.running) return state
  
  // Simulated tick: check orders, update prices, manage fills
  const now = Date.now()
  const updatedOrders = state.orders.map(order => {
    // Simulate fill detection
    if (Math.random() < 0.01) { // 1% chance of fill per tick
      return { ...order, status: 'filled' as const, fills: order.fills + 1, lastUpdate: now }
    }
    // Simulate reprice decision
    if (Math.random() < 0.05) { // 5% chance reprice
      return { ...order, price: order.price * (0.999 + Math.random() * 0.002), lastUpdate: now }
    }
    return order
  })
  
  return { ...state, orders: updatedOrders, lastTick: now }
}

export const toggleRunning = (state: LPToolState): LPToolState => ({
  ...state,
  running: !state.running
})

export const toggleDryRun = (state: LPToolState): LPToolState => ({
  ...state,
  dryRun: !state.dryRun
})

export const updateAntiSniping = (state: LPToolState, config: Partial<LPToolState['antiSniping']>): LPToolState => ({
  ...state,
  antiSniping: { ...state.antiSniping, ...config }
})

export const addOrder = (state: LPToolState, order: Omit<LPToolOrder, 'id' | 'lastUpdate'>): LPToolState => ({
  ...state,
  orders: [...state.orders, { ...order, id: `ord_${Date.now()}`, lastUpdate: Date.now() }]
})

export const getActiveOrders = (state: LPToolState) => state.orders.filter(o => o.status === 'active')
export const getWhitelist = (state: LPToolState) => state.whitelist.filter(w => w.enabled)
