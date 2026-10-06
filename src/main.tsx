import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { applySeo } from './lib/seo'
import './styles/index.css'

applySeo()

const container = document.getElementById('root')
if (!container) throw new Error('Elemento #root nao encontrado em index.html')

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
