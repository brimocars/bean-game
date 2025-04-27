import './plantNow.css';
import Card from './Card';
import * as api from '../helpers/api';
import AddCard from './AddCard';
import { useState } from 'react'
import game from './Game';

function plantNow({ cardsToPlantNow, player, gameObject}) {
  const [selectedCardName, setSelectedCardName] = useState(Object.keys(gameObject.uniqueCardsInDeck)[0] || '');
  
  return (
    <div className="plant-now">
      <h2>Cards to plant now</h2>
      <div className="plant-now-cards">
        {cardsToPlantNow?.map((card, index) => (
          <Card 
            card={card}
            deleteCard={() => api.deleteCardFromPlantNow(gameObject.gameId, player.name, index)}
            gameId={gameObject.gameId}
            playerName={player.name}
            index={index}
            isDraggable={true}
            source="plantNow"
          />
        ))}
        <AddCard
          onClick={() => api.addCardToPlantNow(gameObject.gameId, player.name, selectedCardName)}
          uniqueCardsInDeck={gameObject?.uniqueCardsInDeck}
          setSelectedCardName={setSelectedCardName}
        />
      </div>
    </div>
  )
}

export default plantNow;
