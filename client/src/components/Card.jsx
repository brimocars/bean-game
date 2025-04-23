import './card.css'
import DeleteButton from './DeleteButton'

function card({ card, deleteCard, gameId, playerName, index }) {
  return (
    <div className="card">
      {deleteCard &&
        <DeleteButton
          onClick={() => deleteCard(gameId, playerName, index)}
        />
      }
      <div className='card-content'>
        <span className="card-name">{card.name}</span>
        <span className="card-amount-in-deck">{card.amountInDeck}</span>
        <span className="card-amount-to-money">{card.amountToMoney?.join(' ')}</span>
      </div>
    </div>
  )
}

export default card;