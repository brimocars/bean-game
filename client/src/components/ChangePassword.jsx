import { useState } from 'react'

import * as api from '../helpers/api'
import './changePassword.css'

async function handleChangePassword(username, oldPassword, newPassword, setShowChangePassword) {
  await api.changePassword(username, oldPassword, newPassword);
  setShowChangePassword(false);
}

function changePassword({ setShowChangePassword }) {
  const [username, setUsername] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  return (
    <>
      <div className='column'>
        <div className='row'>
          <label htmlFor="username">Username:</label>
          <input type='text' name='username' value={username} onInput={(e) => setUsername(e.target.value)} placeholder='username' />
        </div>
        <div className='row'>
          <label htmlFor="old-password">Password:</label>
          <input type='password' name='old-password' value={oldPassword} onInput={(e) => setOldPassword(e.target.value)} placeholder='current password' />
        </div>
        <div className='row'>
          <label htmlFor="new-password">Access Code:</label>
          <input type='password' name='new-password' value={newPassword} onInput={(e) => setNewPassword(e.target.value)} placeholder='new password' />
        </div>
        <button id='change-password' onClick={() => handleChangePassword(username, oldPassword, newPassword, setShowChangePassword)}>Change password</button>
      </div>
    </>
  )
}

export default changePassword;
