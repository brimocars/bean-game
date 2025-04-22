import { useState } from 'react'
import './hand.css'
import * as api from '../helpers/api'
import DeleteButton from './DeleteButton'
import AddCard from './AddCard'

const deleteCard = (gameId, playerName, handIndex) => {
  api.deleteCardFromHand(gameId, playerName, handIndex)
}

const addCard = (gameId, playerName, cardName) => {
  api.addCardToHand(gameId, playerName, cardName)
}

function hand({ hand, player, gameObject}) {
  const [selectedCardName, setSelectedCardName] = useState(Object.keys(gameObject.uniqueCardsInDeck)[0] || '');
  
  return (
    <div className="hand">
      <h2>Hand</h2>
      <div className="hand-cards">
        {hand?.map((card, index) => (
          <div className="card">
            <DeleteButton
              onClick={() => deleteCard(gameObject.gameId, player.name, index)}
              />
            <div className='card-content'>
              <span className="card-name">{card.name}</span>
              <span className="card-amount-in-deck">{card.amountInDeck}</span>
              <span className="card-amount-to-money">{card.amountToMoney?.join(' ')}</span>
            </div>
          </div>
        ))}
        <AddCard
          onClick={() => addCard(gameObject.gameId, player.name, selectedCardName)}
          uniqueCardsInDeck={gameObject?.uniqueCardsInDeck}
          setSelectedCardName={setSelectedCardName}
        />
      </div>
    </div>
  )
}

export default hand;