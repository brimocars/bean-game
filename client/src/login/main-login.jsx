import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import React from 'react'

import UnauthApp from '../components/UnauthApp'
import NavBar from '../components/Navbar'

const init = () => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <NavBar />
      <UnauthApp />
    </StrictMode>,
  )
}

window.onload = init