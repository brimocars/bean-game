export async function login(username, password) {
  try {

    const res = await fetch('/login', {
      method: 'POST',
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

export async function signup() {

}

export async function getAllGames() {

}