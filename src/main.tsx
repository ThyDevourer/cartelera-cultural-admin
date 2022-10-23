import React from 'react'
import ReactDOM from 'react-dom/client'
import { HeadProvider } from 'react-head'
import App from './App'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <HeadProvider>
      <App />
    </HeadProvider>
  </React.StrictMode>
)
