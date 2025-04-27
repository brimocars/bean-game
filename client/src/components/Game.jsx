import { useState } from 'react';
import Player from "./Player.jsx";
import DeleteButton from './DeleteButton.jsx';
import UnstartedPlayer from "./UnstartedPlayer.jsx";
import Trade from "./Trade.jsx";
import Card from './Card.jsx';
import AddCard from './AddCard.jsx';
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedDrawCardName, setSelectedDrawCardName] = useState(Object.keys(gameObject.uniqueCardsInDeck)[0] || '');
  const [selectedDiscardCardName, setSelectedDiscardCardName] = useState(Object.keys(gameObject.uniqueCardsInDeck)[0] || '');


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
        {gameObject.phase === 'plant' && utils.getActivePlayer(gameObject).plantedThisTurn >= 1 &&
          <button onClick={() => api.turn(gameObject.gameId)}>Turn Cards</button>
        }
        {gameObject.phase === 'trade' &&
          <button onClick={() => api.endTrading(gameObject.gameId)}>End Trading</button>
        }
      </div>
      <div className="global-cards">
        <div className="expandable-global-title" onClick={() => setIsExpanded(!isExpanded)}>
          <span className={'global-card-info'}>Global card info</span>
          <span className={`caret ${isExpanded ? 'rotated' : ''}`}>^</span>
        </div>
        {isExpanded &&
          <div className="expandable-content global-info-content">

            <div className="draw">
              <h2>Draw</h2>
              <div className="info-thing-no-title">
                {gameObject.draw.map((card, index) => (
                  <Card
                    card={card}
                    deleteCard={api.deleteCardFromDraw}
                    gameId={gameObject.gameId}
                    index={index}
                  />
                ))}
                <AddCard
                  onClick={() => api.addCardToDraw(gameObject.gameId, selectedDrawCardName)}
                  uniqueCardsInDeck={gameObject?.uniqueCardsInDeck}
                  setSelectedCardName={setSelectedDrawCardName}
                />
              </div>
            </div>


            <div className="discard">
              <h2>Discard</h2>
              <div className="info-thing-no-title">
                {gameObject.discard.map((card, index) => (
                  <Card
                    card={card}
                    deleteCard={api.deleteCardFromDiscard}
                    gameId={gameObject.gameId}
                    index={index}
                  />
                ))}
                <AddCard
                  onClick={() => api.addCardToDiscard(gameObject.gameId, selectedDiscardCardName)}
                  uniqueCardsInDeck={gameObject?.uniqueCardsInDeck}
                  setSelectedCardName={setSelectedDiscardCardName}
                />
              </div>
            </div>

            {gameObject.turnedCards.length > 0 &&
              <div className="turned-cards">
                <h2>Turned Cards</h2>
                <div className="info-thing-no-title">
                  {gameObject.turnedCards.map((card, index) => (
                    <Card
                      card={card}
                      gameId={gameObject.gameId}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            }

          </div>
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
