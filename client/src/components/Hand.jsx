import './hand.css'
import * as api from '../helpers/api'
import DeleteButton from './DeleteButton'
import AddCard from './AddCard'

const deleteCard = (handIndex) => {
  api.deleteCardFromHand(gameObject.gameId, player.name, handIndex)
}

const addCard = (gameObject, player, cardName) => {
  api.addCardToHand(gameObject.gameId, player.name, cardName)
}

function hand({ hand, player, gameObject}) {
  return (
    <div className="hand">
      <h2>Hand</h2>
      <div className="hand-cards">
        {hand?.map((card, index) => (
          <div className="card">
            <DeleteButton
              onClick={() => deleteCard(index)}
            />
            <div className='card-content'>
              <span className="card-name">{card.name}</span>
              <span className="card-amount-in-deck">{card.amountInDeck}</span>
              <span className="card-amount-to-money">{card.amountToMoney.join(' ')}</span>
            </div>
          </div>
        ))}
        <AddCard
          onClick={() => addCard(gameObject, player, card.name)}
        />
      </div>
    </div>
  )
}

export default hand;