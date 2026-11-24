import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { initI18n } from './i18n'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element #root was not found')
}

// Render only after the active locale is available so the first paint is fully
// translated; the other three catalogues are fetched on language switch.
void initI18n().then(() => {
  ReactDOM.createRoot(rootElement!).render(
    <React.StrictMode>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <App />
      </BrowserRouter>
    </React.StrictMode>,
  )
})
