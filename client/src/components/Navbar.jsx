import './navbar.css'
import { clearSessionStorage } from '../helpers/utils'
import logoUrl from '../assets/logo.jpg'

function NavBar() {
  return (
    <nav id='nav-bar'>
    <a href="/">
      <img id="logo" src={logoUrl} alt="logo" />
    </a>
    <div className="navlink">
      <button onClick={clearSessionStorage}>Log out</button>
    </div>
  </nav>
  )
}

export default NavBar