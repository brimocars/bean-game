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
    return data.token;
  } catch (err) {
    console.log(`login: ${err}`)
    return { error: err.message };
  }
}

export async function signup(username, password, accessCode) {
  try {
    const res = await fetch('/signup', {
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
    if (res.status !== 201) {
      throw new Error('failed')
    }
  } catch (err) {
    console.log(`login: ${err}`)
    return { error: err.message };
  }
}

export async function getAllGames() {

}