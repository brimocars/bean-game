import { useState } from 'react';
import './trade.css';
import * as api from '../helpers/api';
import DeleteButton from './DeleteButton';
import Card from './Card';

function trade({ trade, gameObject }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const traderPlayer = gameObject.players.find((player) => player.name === trade.traderName);
  const handToGive = trade.cardsToGive.hand?.map((cardIndex) => {
    return {
      index: cardIndex,
      card: traderPlayer.hand[cardIndex],
    }
  })
  const turnedCardsToGive = trade.cardsToGive.turnedCards?.map((cardIndex) => {
    return {
      index: cardIndex,
      card: gameObject.turnedCards[cardIndex],
    }
  })

  return (
    <div className="trade">
      <div className="expandable-trade-title" onClick={() => setIsExpanded(!isExpanded)}>
        <span className='tradeId'>{trade.tradeId}</span>
        <span className={`caret ${isExpanded ? 'rotated' : ''}`}>^</span>
        <DeleteButton
          onClick={() => api.deleteTrade(gameObject.gameId, trade.tradeId)}
        />
      </div>
      {isExpanded &&
        <div className="expandable-content trade-content">
          <div className="trader trade-participant">Trader: {trade.traderName}</div>
          <div className="tradee trade-participant">Tradee: {trade.tradeeName}</div>
          <div className="cards-to-Give">
            <h2>Cards to give</h2>
            <div className="cards-to-give-content">
              {handToGive?.length &&
                <div>
                  {handToGive.map((card) => (
                    <div>
                      <span className="card-source">{`Hand ${card.index}`}</span>
                      <Card
                        card={card.card}
                      />
                    </div>
                  ))}
                </div>
              }
              {turnedCardsToGive?.length &&
                <div>
                  {turnedCardsToGive.map((card) => (
                    <div>
                      <span className="card-source">{`Turned Card ${card.index}`}</span>
                      <Card
                        card={card.card}
                      />
                    </div>
                  ))}
                </div>
              }
            </div>
          </div>
          <div className="cards-to-Receive">
            <h2>Cards to receive</h2>
          </div>
        </div>}
    </div>
  )
}

export default trade;