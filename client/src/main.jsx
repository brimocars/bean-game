import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import React from 'react'

import NavBar from './components/Navbar'
import Games from './components/Games.jsx'

const init = () => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <NavBar />
      <Games />
    </StrictMode>,
  )
}

window.onload = init