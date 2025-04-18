export async function login(username, password) {
  try {
    const res = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password,
      })
    })
    const data = await res.json();
    if (data.redirect) {
      window.location.href = data.redirect;
    }
  } catch (err) {
    console.log(`login: ${err}`)
    return { error: err.message };
  }
}

export async function signup(username, password, accessCode) {
  try {
    await fetch('/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password,
        accessCode
      })
    })
  } catch (err) {
    console.log(`signup: ${err}`)
    return { error: err.message };
  }
}

export async function logout() {
  try {
    const res = await fetch('/logout', {
      method: 'GET',
    })
    const data = await res.json();
    if (data.redirect) {
      window.location.href = data.redirect;
    }
  } catch (err) {
    console.log(`logout: ${err}`)
    return { error: err.message };
  }
}

export async function getAllGames() {

}