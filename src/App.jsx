import { Provider } from 'react-redux'
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom'

// redux
import useStore from './redux/store'

// components
import Game from './pages/Game'
import Home from './pages/Home'

export default function App() {
  return (
    <Provider store={useStore()}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:roomId" element={<Game />} />
        </Routes>
      </Router>
    </Provider>
  )
}
