import { useEffect } from 'react'

import './navbar.css'
import * as utils from '../helpers/utils'
import logoUrl from '../assets/logo.jpg'

function NavBar({ token, setToken}) {

  useEffect(() => {
    setToken(utils.getTokenFromSessionStorage());
  }, [])

  return (
    <nav id='nav-bar'>
      <a href="/">
        <img id="logo" src={logoUrl} alt="logo" />
      </a>
      {token &&
        <button onClick={utils.clearSessionStorage}>Log out</button>
      }
    </nav >
  )
}

export default NavBar