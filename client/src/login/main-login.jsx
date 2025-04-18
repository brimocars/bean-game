import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { useState } from 'react'

import UnauthApp from '../components/UnauthApp'
import NavBar from '../components/Navbar'


function Top() {
  const [token, setToken] = useState('');
  
  return (
    <div>
      <NavBar
        token={token}
        setToken={setToken}
      />
      <UnauthApp 
        token={token}
        setToken={setToken}
      />
    </div>
  )
}


const init = () => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <Top />
    </StrictMode>,
  )
}

window.onload = init