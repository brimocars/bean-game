import { useState } from 'react';

import { isActivePlayer } from '../helpers/utils';
import './player.css';
import Hand from './Hand.jsx';
import Field from './Field.jsx';
import PlantNow from './PlantNow.jsx';

function Player({ player, gameObject }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const isActive = isActivePlayer(gameObject, player);

  return (
    <div className="player">
      <div className="expandable-player-title" onClick={() => setIsExpanded(!isExpanded)}>
        <span className={`name ${isActive ? 'active' : 'inactive'}`}>{player.name}{isActive ? ' (their turn)' : ''}</span>
        <span className={`caret ${isExpanded ? 'rotated' : ''}`}>^</span>
      </div>
      {isExpanded &&
        <div className="expandable-content player-content">
          <Hand
            hand={player.hand}
            player={player}
            gameObject={gameObject}
          />
          <Field
            field={player.field}
            player={player}
            gameObject={gameObject}
          />
          <PlantNow
            cardsToPlantNow={player.cardsToPlantNow}
            player={player}
            gameObject={gameObject}
          />

        </div>}
    </div>
  );
}

export default Player;