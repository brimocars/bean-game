import Player from "./Player.jsx";

function game({ gameObject }) {
  const { gameId, gameCode, players } = gameObject;
  return (
    <div className="game">
      <p>Game ID: {gameId}</p>
      <p>Game Code: {gameCode}</p>
      {players.map((player) => (
        <Player
          player={player}
        />
      ))}
    </div>
  );
}

export default game;
