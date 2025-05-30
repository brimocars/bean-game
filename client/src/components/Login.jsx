import { useState } from 'react'

import * as api from '../helpers/api'
import './Login.css'

async function handleLogin(username, password, setShowLogin) {
  await api.login(username, password)
  setShowLogin(false)
}

function Login({ setShowLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  return (
    <>
      <div className='column'>
        <div className='row'>
          <label htmlFor="username">Username:</label>
          <input type='text' name='username' value={username} onInput={(e) => setUsername(e.target.value)} placeholder='username' />
        </div>
        <div className='row'>
          <label htmlFor="password">Password:</label>
          <input type='password' name='password' value={password} onInput={(e) => setPassword(e.target.value)} placeholder='password' />
        </div>
        <button id='login' onClick={() => handleLogin(username, password, setShowLogin)}>Login</button>
      </div>
    </>
  )
}

export default Login
