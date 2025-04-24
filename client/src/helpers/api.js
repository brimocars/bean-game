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
  try {
    const res = await fetch('/game', {
      method: 'GET',
    })
    const data = await res.json();
    return data.gameObject;
  } catch (err) {
    console.log(`get all games: ${err}`)
    return { error: err.message };
  }
}

// Note: For any of these /admin endpoints that return the modified gameObject, the returned gameObject isn't actually
// used. The socket is setup to automatically update the gameObject whenever it changes in the database. I'm mostly
// returning it out of habit and because it might be useful in the future and to catch any errors if data is undefinded

export async function deleteCardFromHand(gameId, playerName, handIndex) {
  try {
    const res = await fetch(`/admin/hand?gameId=${gameId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        playerName,
        handIndex,
      })
    })
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(`delete card from hand: ${err}`)
    return { error: err.message };
  }
}

export async function addCardToHand(gameId, playerName, cardName) {
  try {
    const res = await fetch(`/admin/hand?gameId=${gameId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        playerName,
        cardName,
      })
    })
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(`add card to hand: ${err}`)
    return { error: err.message };
  }
}


// Normal endpoints that are part of the actual game logic - no admin required

export async function joinGame(gameCode, playerName) {
  try {
    const res = await fetch(`/setup/join?gameCode=${gameCode}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        playerName,
      })
    })
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(`join game: ${err}`)
    return { error: err.message };
  }
}

export async function leaveGame(gameId, playerName) {
  try {
    const res = await fetch(`/setup/leave?gameId=${gameId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        playerName,
      })
    })
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(`leave game: ${err}`)
    return { error: err.message };
  }
}

export async function deleteGame(gameId) {
  try {
    const res = await fetch(`/setup/?gameId=${gameId}`, {
      method: 'DELETE',
    })
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(`delete game: ${err}`)
    return { error: err.message };
  }
}

export async function deleteTrade(gameId, tradeId) {
  try {
    const res = await fetch(`/play/trade?gameId=${gameId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tradeId,
      })
    })
  } catch (err) {
    console.log(`delete trade: ${err}`)
    return { error: err.message };
  }
}

export async function turn(gameId) {
  try {
    const res = await fetch(`/play/turn?gameId=${gameId}`, {
      method: 'POST',
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(`turn: ${err}`)
    return { error: err.message };
  }
}

export async function endTrading(gameId) {
  try {
    const res = await fetch(`/play/trade/end?gameId=${gameId}`, {
      method: 'POST',
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(`end trading: ${err}`)
    return { error: err.message };
  }
}

export async function acceptTrade(gameId, tradeId, chosenCardsToReceive) {
  try {
    const res = await fetch(`/play/trade/accept?gameId=${gameId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tradeId,
        chosenCardsToReceive
      })
    })
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(`accept trade: ${err}`)
    return { error: err.message };
  }
}