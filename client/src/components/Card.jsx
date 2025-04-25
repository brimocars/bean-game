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
      {card &&
        <div className='card-content'>
          <span className="card-name">{card.name}</span>
          <span className="card-amount-in-deck">{card.amountInDeck}</span>
          <span className="card-amount-to-money">{card.amountToMoney?.join(' ')}</span>
        </div>
      }
      {!card &&
        <div className='card-content'>
          <span className="card-name">Empty</span>
        </div>
      }
    </div>
  )
}

export default card;