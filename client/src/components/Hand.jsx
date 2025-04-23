import { useState } from 'react'
import './hand.css'
import * as api from '../helpers/api'
import AddCard from './AddCard'
import Card from './Card'

function hand({ hand, player, gameObject}) {
  const [selectedCardName, setSelectedCardName] = useState(Object.keys(gameObject.uniqueCardsInDeck)[0] || '');
  
  return (
    <div className="hand">
      <h2>Hand</h2>
      <div className="hand-cards">
        {hand?.map((card, index) => (
          <Card 
            card={card}
            deleteCard={api.deleteCardFromHand}
            gameId={gameObject.gameId}
            playerName={player.name}
            index={index}
          />
        ))}
        <AddCard
          onClick={() => api.addCardToHand(gameObject.gameId, player.name, selectedCardName)}
          uniqueCardsInDeck={gameObject?.uniqueCardsInDeck}
          setSelectedCardName={setSelectedCardName}
        />
      </div>
    </div>
  )
}

export default hand;