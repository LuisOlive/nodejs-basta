import React from 'react'
import ReactDOM from 'react-dom'
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom'

// components
import App from './App'
import Game from './pages/Game'

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/:roomId" element={<Game />} />
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
)
