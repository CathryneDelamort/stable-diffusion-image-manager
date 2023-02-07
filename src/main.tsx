import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App'
import { DataProvider } from './DataProvider'
import './index.css'
import { themeClass } from './styles.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Router>
      <DataProvider>
        <div className={themeClass} style={{ display: 'flex' }}>
          <App />
        </div>
      </DataProvider>
    </Router>
  </React.StrictMode>,
)
