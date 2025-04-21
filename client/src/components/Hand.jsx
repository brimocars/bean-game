import './hand.css'
import * as api from '../helpers/api'

function hand({ hand, player, gameObject}) {
  const deleteCard = (handIndex) => {
    api.deleteCardFromHand(gameObject.gameId, player.name, handIndex)
  }

  const addCard = (cardName) => {
    api.addCardToHand(gameObject.gameId, player.name, cardName)
  }

  return (
    <div className="hand">
      <h2>Hand</h2>
      <div className="hand-cards">
        {hand.map((card, index) => (
          <div className="card">
            <span className="delete" onClick={() => deleteCard(index)}>X</span>
            <div className='card-content'>
              <span className="card-name">{card.name}</span>
              <span className="card-amount-in-deck">{card.amountInDeck}</span>
              <span className="card-amount-to-money">{card.amountToMoney.join(' ')}</span>
            </div>
          </div>
        ))}
        <div className="add-card">
          <span className="add-card-text">Add card</span>
          <select className="cardSelect">
            {Object.values(gameObject.uniqueCardsInDeck).map((card) => (
              <option value={card.name}>{card.name}</option>
            ))}
          </select>
          <button className="add-card-button" onClick={addCard}>+</button>
        </div>
      </div>
    </div>
  )
}

export default hand;