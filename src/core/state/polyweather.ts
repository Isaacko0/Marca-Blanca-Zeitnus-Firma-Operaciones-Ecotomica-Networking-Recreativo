// PolyWeather State — asimilado de PolyWeather
// Weather oracle: multi-source ingestion → DEB consensus → calibrated probability → market diff

export interface WeatherObservation {
  city: string
  timestamp: number
  temperature: number
  source: 'METAR' | 'TAF' | 'Open-Meteo' | 'JMA' | 'HKO' | 'IMGW' | 'settlement'
  quality: 'high' | 'medium' | 'low'
}

export interface ForecastPoint {
  city: string
  timestamp: number
  temperature: number
  model: string
  leadHours: number
}

export interface DEBConsensus {
  city: string
  timestamp: number
  hourlyPath: { hour: number; temp: number; sigma: number }[]
  peakWindow: { start: number; end: number; maxTemp: number }
  confidence: number
}

export interface ProbabilityBucket {
  city: string
  date: string
  buckets: { temp: number; probability: number }[]
  model: 'deb_normal' | 'gaussian'
  calibrated: boolean
}

export interface MarketSignal {
  city: string
  marketId: string
  question: string
  modelProb: number
  marketProb: number
  edge: number // model - market
  buckets: { temp: number; modelProb: number; marketProb: number; edge: number }[]
}

export interface PolyWeatherState {
  observations: WeatherObservation[]
  forecasts: ForecastPoint[]
  debConsensus: DEBConsensus[]
  probabilities: ProbabilityBucket[]
  marketSignals: MarketSignal[]
  cities: string[]
  lastUpdate: number
  autoRefresh: boolean
  refreshInterval: number // minutes
}

export const makePolyWeatherState = (): PolyWeatherState => ({
  observations: [],
  forecasts: [],
  debConsensus: [],
  probabilities: [],
  marketSignals: [],
  cities: ['Hong Kong', 'Tokyo', 'Shenzhen', 'Singapore', 'New York', 'London', 'Berlin', 'Paris', 'Sydney', 'Dubai'],
  lastUpdate: 0,
  autoRefresh: false,
  refreshInterval: 5,
})
