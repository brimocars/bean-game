import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import React from 'react'

import NavBar from './components/Navbar'

const init = () => {

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <NavBar />
      <div>
        HI!
      </div>
    </StrictMode>,
  )
}

window.onload = init