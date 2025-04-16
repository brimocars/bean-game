import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import React from 'react'

import App from './components/App'
import NavBar from './components/Navbar'

const init = () => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <NavBar />
      <App />
    </StrictMode>,
  )
}

window.onload = init