import { useState } from 'react'

import * as api from '../helpers/api'
import './Signup.css'

async function handleSignup(username, password, accessCode, setShowSignup) {
  await api.signup(username, password, accessCode);
  setShowSignup(false);
}

function Signup({ setShowSignup }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [accessCode, setAccessCode] = useState('');

  return (
    <>
      <div className='column'>
        <div className='row'>
          <label htmlFor="username">Username:</label>
          <input type='text' name='username' value={username} onInput={(e) => setUsername(e.target.value)} placeholder='username' />
        </div>
        <div className='row'>
          <label htmlFor="password">Password:</label>
          <input type='text' name='password' value={password} onInput={(e) => setPassword(e.target.value)} placeholder='password' />
        </div>
        <div className='row'>
          <label htmlFor="accessCode">Access Code:</label>
          <input type='text' name='accessCode' value={accessCode} onInput={(e) => setAccessCode(e.target.value)} placeholder='access code' />
        </div>
        <button id='signup' onClick={() => handleSignup(username, password, accessCode, setShowSignup)}>Signup</button>
      </div>
    </>
  )
}

export default Signup;
