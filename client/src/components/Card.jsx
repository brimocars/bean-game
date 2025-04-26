import './card.css'
import DeleteButton from './DeleteButton'

const handleDragStart = (e, index, source, cardName) => {
  e.dataTransfer.setData('application/json', JSON.stringify({ index, source, cardName }));
};

function card({ card, deleteCard, gameId, playerName, index, isDraggable, source }) {
  return (
    <div className="card" draggable={isDraggable} onDragStart={isDraggable ? (e) => handleDragStart(e, index, source, card.name) : undefined}>
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