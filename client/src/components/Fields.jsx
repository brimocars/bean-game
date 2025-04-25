import './fields.css';
import Card from './Card';

function fields({ field, player, gameObject}) {
  return (
    <div className="fields">
      <h2>Fields</h2>
      <div className="field-cards">
        {field?.map((card, index) => (
          <div class-name="field-card">
            <Card 
              card={card}
              gameId={gameObject.gameId}
              playerName={player.name}
              index={index}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default fields;