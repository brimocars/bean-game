import { useState } from 'react';
import Player from "./Player.jsx";
import UnstartedPlayer from "./UnstartedPlayer.jsx";
import './game.css'
import * as api from '../helpers/api'

function game({ gameObject }) {
  const [name, setName] = useState('')
  
  // if the game hasn't started
  if (!gameObject.phase) {
    return (
      <div className="game">
        <div className="top-info">
          <span className="item-label">gameId: </span><span className="item">{gameObject.gameId}</span>
          <span className="item-label">gameCode: </span><span className="item">{gameObject.gameCode}</span>
        </div>
        <div className="players">
          <h2>Players</h2>
          <div className="players-no-title">
            {gameObject.players.map((player) => (
              <UnstartedPlayer
                gameObject={gameObject}
                player={player}
              />
            ))}
            {gameObject.players.length < 7 &&
              <div className="add-player">
                <span className="add-player-text">Add player: </span>
                <input type='text' name='name' value={name} onInput={(e) => setName(e.target.value)} placeholder='playername..' />
                <button className="add-player-button" onClick={() => api.joinGame(gameObject.gameCode, name)}>+</button>
              </div>}
          </div>
        </div>
      </div>
    )
  }

  const { players, activeTrades } = gameObject;
  return (
    <div className="game">
      <div className="top-info">
        <span className="item-label">gameId: </span><span className="item">{gameObject.gameId}</span>
        <span className="item-label">gameCode: </span><span className="item">{gameObject.gameCode}</span>
        <span className="item-label">phase: </span><span className="item">{gameObject.phase}</span>
      </div>
      <div className="players">
        <h2>Players</h2>
        <div className="players-no-title">
          {players.map((player) => (
            <Player
              player={player}
              gameObject={gameObject}
            />
          ))}
        </div>
      </div>
      {/* <div className="trades">
        <h2>Trades</h2>
        {activeTrades?.map((trade) => (
          <Trade
            trade={trade}
            gameObject={gameObject}
          />
        ))}
      </div> */}
    </div>
  );
}

export default game;
