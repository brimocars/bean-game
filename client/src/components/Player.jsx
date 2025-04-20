import { useState } from 'react';

import { isActivePlayer } from '../helpers/utils';
import './player.css';
import Hand from './Hand.jsx';
import Field from './Field.jsx';
import PlantNow from './PlantNow.jsx';

function Player({ player, gameObject }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const isActive = isActivePlayer(gameObject, player);

  return (
    <div className="player">
      <div className="expandable-title" onClick={toggleExpand}>
        <span className={`name ${isActive ? 'active' : ''}`}>{player.name}{isActive ? ' (their turn)' : ''}</span>
        <span className={`caret ${isExpanded ? 'rotated' : ''}`}>^</span>
      </div>
      {isExpanded && 
      <div className="expandable-content player-content">
        <Hand />
        <Field />
        <PlantNow />
        
      </div>}
    </div>
  );
}

export default Player;