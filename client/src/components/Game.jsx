import Player from "./Player.jsx";
import './game.css'


function game({ gameObject }) {
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
