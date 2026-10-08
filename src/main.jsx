import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'
import ErrorBoundary from './components/layout/ErrorBoundary.jsx'

const rootEl = document.getElementById('root')
rootEl.setAttribute('data-react-ready', 'true') // tells index.html's crash screen that the app started

createRoot(rootEl).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
