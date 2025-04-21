import './unstartedPlayer.css';
import * as api from '../helpers/api';
import DeleteButton from './DeleteButton';

function UnstartedPlayer({ gameObject, player }) {
  return (
    <div className="player">
      <span className={'name'}>{player.name}</span>
      <DeleteButton
        onClick={() => api.leaveGame(gameObject.gameId, player.name)}
      />
    </div>
  );
}

export default UnstartedPlayer;