import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  BrowserRouter as Router
} from "react-router-dom"
import App from './App'
import './index.css'
import { SearchProvider } from './ListView/Search'
import { themeClass } from './styles.css'


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Router>
      <SearchProvider>
        <div className={themeClass}>
          <App />
        </div>
      </SearchProvider>
    </Router>
  </React.StrictMode>,
)
