// PolyWeather Logic — asimilado de PolyWeather
// Multi-source ingestion → DEB consensus → calibrated probability → market diff

import type { PolyWeatherState, WeatherObservation, ForecastPoint, DEBConsensus, ProbabilityBucket, MarketSignal } from '@core/state/polyweather'

// Simulated data sources
const SOURCES = ['METAR', 'TAF', 'Open-Meteo', 'JMA', 'HKO', 'IMGW', 'settlement'] as const
const MODELS = ['ECMWF', 'GFS', 'ICON', 'UKMO', 'JMA', 'DEB'] as const

export const ingestObservations = (state: PolyWeatherState, city: string): PolyWeatherState => {
  const now = Date.now()
  const newObs: WeatherObservation[] = []
  
  for (const source of SOURCES) {
    // Simulate observation
    newObs.push({
      city,
      timestamp: now,
      temperature: 25 + Math.random() * 15, // 25-40°C
      source,
      quality: source === 'settlement' ? 'high' : source === 'METAR' ? 'high' : 'medium'
    })
  }
  
  return {
    ...state,
    observations: [...state.observations, ...newObs].slice(-1000),
    lastUpdate: now
  }
}

export const generateForecasts = (state: PolyWeatherState, city: string): PolyWeatherState => {
  const now = Date.now()
  const newForecasts: ForecastPoint[] = []
  
  for (let lead = 0; lead < 24; lead++) {
    for (const model of MODELS) {
      newForecasts.push({
        city,
        timestamp: now + lead * 3600000,
        temperature: 25 + Math.random() * 15,
        model,
        leadHours: lead
      })
    }
  }
  
  return {
    ...state,
    forecasts: [...state.forecasts, ...newForecasts].slice(-5000)
  }
}

export const computeDEBConsensus = (state: PolyWeatherState, city: string): PolyWeatherState => {
  // Simplified DEB: weighted average of models with error balancing
  const cityForecasts = state.forecasts.filter(f => f.city === city)
  const hourlyPath = []
  
  for (let hour = 0; hour < 24; hour++) {
    const hourForecasts = cityForecasts.filter(f => f.leadHours === hour)
    if (hourForecasts.length === 0) continue
    
    // DEB weighting: inverse of historical error (simulated)
    const weights = hourForecasts.map(() => 0.5 + Math.random() * 0.5)
    const totalWeight = weights.reduce((a, b) => a + b, 0)
    const weightedTemp = hourForecasts.reduce((sum, f, i) => sum + f.temperature * weights[i], 0) / totalWeight
    const sigma = Math.max(0.5, 1.5 - hour * 0.05) // decreasing uncertainty
    
    hourlyPath.push({ hour, temp: weightedTemp, sigma })
  }
  
  const peakHour = hourlyPath.reduce((max, h) => h.temp > max.temp ? h : max, hourlyPath[0])
  
  const consensus: DEBConsensus = {
    city,
    timestamp: Date.now(),
    hourlyPath,
    peakWindow: { start: Math.max(0, peakHour.hour - 2), end: Math.min(23, peakHour.hour + 2), maxTemp: peakHour.temp },
    confidence: 0.85
  }
  
  return {
    ...state,
    debConsensus: [...state.debConsensus.filter(c => c.city !== city), consensus]
  }
}

export const computeProbabilityBuckets = (state: PolyWeatherState, city: string, date: string): PolyWeatherState => {
  const consensus = state.debConsensus.find(c => c.city === city)
  if (!consensus) return state
  
  // DEB Normal engine: P(T==τ) = Φ((τ+0.5-μ)/σ) - Φ((τ-0.5-μ)/σ)
  const buckets = []
  const peakTemp = consensus.peakWindow.maxTemp
  const sigma = consensus.hourlyPath[consensus.peakWindow.start]?.sigma || 2.0
  
  for (let temp = Math.floor(peakTemp) - 5; temp <= Math.ceil(peakTemp) + 5; temp++) {
    // Simplified normal CDF approximation
    const z1 = (temp + 0.5 - peakTemp) / sigma
    const z2 = (temp - 0.5 - peakTemp) / sigma
    const prob = normalCDF(z1) - normalCDF(z2)
    buckets.push({ temp, probability: Math.max(0, prob) })
  }
  
  // Normalize
  const total = buckets.reduce((sum, b) => sum + b.probability, 0)
  const normalized = buckets.map(b => ({ ...b, probability: b.probability / total }))
  
  const probBucket: ProbabilityBucket = {
    city,
    date,
    buckets: normalized,
    model: 'deb_normal',
    calibrated: true
  }
  
  return {
    ...state,
    probabilities: [...state.probabilities.filter(p => !(p.city === city && p.date === date)), probBucket]
  }
}

export const scanMarkets = (state: PolyWeatherState, city: string): PolyWeatherState => {
  const prob = state.probabilities.find(p => p.city === city)
  if (!prob) return state
  
  // Simulate market implied probabilities (would come from Polymarket CLOB)
  const marketSignal: MarketSignal = {
    city,
    marketId: `market_${city.toLowerCase()}_${Date.now()}`,
    question: `Will ${city} reach ${prob.buckets[Math.floor(prob.buckets.length/2)].temp}°C on ${prob.date}?`,
    modelProb: prob.buckets.reduce((max, b) => Math.max(max, b.probability), 0),
    marketProb: 0.4 + Math.random() * 0.3, // simulated market
    edge: 0,
    buckets: prob.buckets.map(b => ({
      temp: b.temp,
      modelProb: b.probability,
      marketProb: b.probability * (0.8 + Math.random() * 0.4),
      edge: 0
    }))
  }
  
  marketSignal.edge = marketSignal.modelProb - marketSignal.marketProb
  marketSignal.buckets = marketSignal.buckets.map(b => ({ ...b, edge: b.modelProb - b.marketProb }))
  
  return {
    ...state,
    marketSignals: [...state.marketSignals.filter(m => m.city !== city), marketSignal]
  }
}

function normalCDF(z: number): number {
  // Approximation
  return 0.5 * (1 + Math.sign(z) * Math.sqrt(1 - Math.exp(-2 * z * z / Math.PI)))
}

export const refreshAll = (state: PolyWeatherState): PolyWeatherState => {
  let newState = state
  for (const city of state.cities) {
    newState = ingestObservations(newState, city)
    newState = generateForecasts(newState, city)
    newState = computeDEBConsensus(newState, city)
    newState = computeProbabilityBuckets(newState, city, new Date().toISOString().split('T')[0])
    newState = scanMarkets(newState, city)
  }
  return { ...newState, lastUpdate: Date.now() }
}

export const toggleAutoRefresh = (state: PolyWeatherState): PolyWeatherState => ({
  ...state,
  autoRefresh: !state.autoRefresh
})

export const setRefreshInterval = (state: PolyWeatherState, minutes: number): PolyWeatherState => ({
  ...state,
  refreshInterval: minutes
})
