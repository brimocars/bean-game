import './navbar.css'
import * as api from '../helpers/api'
import { getCurrentUrl } from '../helpers/utils';
import logoUrl from '../assets/logo.jpg'

function NavBar() {
  console.log(`href: ${location.href}`);
  return (
    <nav id='nav-bar'>
      <a href="/">
        <img id="logo" src={logoUrl} alt="logo" />
      </a>
      {getCurrentUrl() !== 'login-page' &&
        <button id='logout' onClick={api.logout}>Log out</button>
      }
    </nav >
  )
}

export default NavBar