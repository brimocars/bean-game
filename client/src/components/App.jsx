import './App.css'
import { useState, useEffect } from 'react'
import Login from './Login.jsx'
import * as utils from '../helpers/utils.js'


function App () {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    setToken(utils.getTokenFromSessionStorage());
  }, [showLogin])

  if (!token) {
    if (showLogin) {
      return (
        <Login 
          setShowLogin={setShowLogin}
        />
      )
    }
    if (showSignup) {
      return (
        <Signup 
          setShowSignup={setShowSignup}
        />
      )
    }

    return (
      <div>
        <button onClick={() => setShowLogin(true)}>Login</button>
        <button onClick={() => setShowSignup(true)}>Signup</button>
      </div>
    )
  }
};

export default App;
