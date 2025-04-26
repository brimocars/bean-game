import './fields.css';
import Card from './Card';
import * as api from '../helpers/api';

const handleDrop = async (e, fieldIndex, playerName, gameId) => {
  e.preventDefault();
  const { index, source, cardName } = JSON.parse(e.dataTransfer.getData('application/json'));
  if (source === 'hand') {
    await api.plantFromAnywhereInHand(gameId, playerName, index, fieldIndex)
  } else if (source === 'plantNow') {
    await api.plantFromPlantNow(gameId, playerName, cardName, fieldIndex)
  }
}

function fields({ fields, player, gameObject }) {
  return (
    <div className="fields">
      <h2>Fields</h2>
      <div className="field-cards">
        {fields?.map((card, index) => (
          <div class-name="field-card" onDrop={(e) => handleDrop(e, index, player.name, gameObject.gameId)} onDragOver={(e) => e.preventDefault()}>
            <div className="field-card-amount">
              {card.amount}
              {card.card &&
                <span className="harvest-button" onClick={() => { api.harvest(gameObject.gameId, player.name, index) }}>Harvest</span>
              }
            </div>
            <Card
              card={card.card}
              gameId={gameObject.gameId}
              playerName={player.name}
              index={index}
            />
          </div>
        ))}
        <div className="other-player-info">
          <div className="planted-this-turn">Planted: {player.plantedThisTurn ?? 0}</div>
          <div className="money">Money: {player.money}</div>
        </div>
      </div>
    </div>
  )
}

export default fields;