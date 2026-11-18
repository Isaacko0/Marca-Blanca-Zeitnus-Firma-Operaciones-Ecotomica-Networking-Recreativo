import React from 'react'
import ReactDOM from 'react-dom/client'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div style={{ 
      padding: '20px', 
      color: 'white', 
      background: '#0A1024', 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h1 style={{ color: '#AFEB00', fontSize: '48px' }}>✅ MINIMAL REACT WORKS</h1>
      <p style={{ fontSize: '20px', marginTop: '20px' }}>Si ves esto, React 18 se monta correctamente</p>
      <p style={{ color: '#888', marginTop: '10px' }}>No hay imports externos, no hay Zustand, no hay Router</p>
    </div>
  </React.StrictMode>
)