import './addCard.css';

function AddCard({ onClick, uniqueCardsInDeck, setSelectedCardName }) {
  return (
    <div className="add-card">
      <span className="add-card-text">Add card</span>
      <select className="cardSelect" onChange={(e) => { setSelectedCardName(e.target.value) }}>
        {Object.values(uniqueCardsInDeck || {}).map((card) => (
          <option value={card.name}>{card.name}</option>
        ))}
      </select>
      <button className="add-card-button" onClick={() => onClick()}>+</button>
    </div>
  )
}

export default AddCard;