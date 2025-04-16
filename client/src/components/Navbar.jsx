import './navbar.css'
import { clearSessionStorage } from '../helpers/utils'
import logoUrl from '../assets/logo.jpg'

function NavBar() {
  useEffect(() => {
    setToken(utils.getTokenFromSessionStorage());
  }, [showLogin])

  return (
    <nav id='nav-bar'>
      <a href="/">
        <img id="logo" src={logoUrl} alt="logo" />
      </a>
      {token &&
        <button onClick={clearSessionStorage}>Log out</button>
      }
    </nav >
  )
}

export default NavBar