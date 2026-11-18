import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './app/App'
import './shared/styles/global.css'

class ErrorBoundary extends React.Component<{ children: React.ReactNode; fallback?: React.ReactNode }, { error: Error | null }> {
  state = { error: null }
  static getDerivedStateFromError(error: Error) { return { error } }
  componentDidCatch(error: Error) { console.error('ErrorBoundary caught:', error) }
  render() {
    if (this.state.error) {
      return this.props.fallback ?? (
        <div style={{ padding: '20px', color: 'white', background: '#0A1024', minHeight: '100vh' }}>
          <h1>Error de renderizado</h1>
          <pre style={{ whiteSpace: 'pre-wrap', color: '#AFEB00' }}>{this.state.error.message}</pre>
          <pre style={{ whiteSpace: 'pre-wrap', color: '#888' }}>{this.state.error.stack}</pre>
        </div>
      )
    }
    return this.props.children
  }
}

// Test component to verify React renders
function TestMount() {
  return (
    <div style={{ padding: '20px', color: 'white', background: '#0A1024', minHeight: '100vh' }}>
      <h1 style={{ color: '#AFEB00' }}>✅ React montado correctamente</h1>
      <p>Si ves esto, React funciona. El problema está en App/Store.</p>
    </div>
  )
}

// Outer test to verify React root mounts at all
function OuterTest() {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '40px', background: '#FF0000', color: 'white', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold' }}>
      🔴 OUTER TEST - React root montado
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <OuterTest />
      <ErrorBoundary fallback={<TestMount />}>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
)
