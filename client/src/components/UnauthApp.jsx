import './unauthApp.css'
import { useState, useEffect } from 'react'
import Login from './Login.jsx'
import Signup from './Signup.jsx'
import ChangePassword from './ChangePassword.jsx'

function UnauthApp() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

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
  if (showChangePassword) {
    return (
      <ChangePassword
        setShowChangePassword={setShowChangePassword}
      />
    )
  }

  return (
    <div id='main-button-holder'>
      <button onClick={() => setShowLogin(true)}>Login</button>
      <button onClick={() => setShowSignup(true)}>Signup</button>
      <button onClick={() => setShowChangePassword(true)}>Change Password</button>
    </div>
  )
};

export default UnauthApp;
