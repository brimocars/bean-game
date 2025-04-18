import './UnauthApp.css'
import { useState, useEffect } from 'react'
import Login from './Login.jsx'
import Signup from './Signup.jsx'
import * as utils from '../helpers/utils.js'


function UnauthApp ({ token, setToken}) {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

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
      <div id='main-button-holder'>
        <button onClick={() => setShowLogin(true)}>Login</button>
        <button onClick={() => setShowSignup(true)}>Signup</button>
      </div>
    )
  }
};

export default UnauthApp;
