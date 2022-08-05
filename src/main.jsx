import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import './tailwind.build.css'

import App from './App'
// import Tw from './tailwind' // dynamic tailwindcss classes

ReactDOM.render(
  <React.StrictMode>
    {/* <Tw /> */}
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
