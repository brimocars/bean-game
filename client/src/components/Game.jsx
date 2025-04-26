import { useState } from 'react';
import Player from "./Player.jsx";
import DeleteButton from './DeleteButton.jsx';
import UnstartedPlayer from "./UnstartedPlayer.jsx";
import Trade from "./Trade.jsx";
import './game.css'
import * as api from '../helpers/api'
import * as utils from '../helpers/utils'

const getRandomName = (players) => {
    // autofill the input with a new name because it's fast and I don't feel like typing every time
    const lowercaseAsciiStart = 97;
    let letterIndex;
    let newName;
    do { 
      letterIndex = Math.floor(Math.random() * 26);
      newName = String.fromCharCode(lowercaseAsciiStart + letterIndex);
    } while (players.some((player) => player.name === newName));
    return newName;
}

const join = async (gameCode, name, setName, players) => {
  await api.joinGame(gameCode, name);

  const newName = getRandomName(players);
  setName(newName);
}

function game({ gameObject }) {
  const [name, setName] = useState(getRandomName(gameObject.players));

  // if the game hasn't started
  if (!gameObject.phase) {
    return (
      <div className="game">
        <div className="top-info">
          <span className="item-label">gameId: </span><span className="item">{gameObject.gameId}</span>
          <span className="item-label">gameCode: </span><span className="item">{gameObject.gameCode}</span>
          <DeleteButton
            onClick={() => api.deleteGame(gameObject.gameId)}
          />
        </div>
        <div className="game-buttons">
          {gameObject.players.length >= 3 &&
            <button onClick={() => api.startGame(gameObject.gameId)}>Start</button>
          }
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
                <button className="add-player-button" onClick={() => join(gameObject.gameCode, name, setName, gameObject.players)}>+</button>
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
        <DeleteButton
          onClick={() => api.deleteGame(gameObject.gameId)}
        />
      </div>
      <div className="game-buttons">
        {gameObject.phase === 'plant' && utils.getActivePlayer(gameObject).plantedThisTurn <= 2 &&
          <button onClick={() => api.turn(gameObject.gameId)}>Turn Cards</button>
        }
        {gameObject.phase === 'trade' &&
          <button onClick={() => api.endTrading(gameObject.gameId)}>End Trading</button>
        }
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
      <div className="trades">
        <h2>Trades</h2>
        <div className="trades-no-title">
          {activeTrades?.map((trade) => (
            <Trade
              trade={trade}
              gameObject={gameObject}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default game;
