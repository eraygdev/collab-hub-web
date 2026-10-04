import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initScale } from './hooks/useScale'

// Kullanıcının kayıtlı ölçek tercihini ilk render'dan önce uygula
initScale()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)