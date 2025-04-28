import { useState } from 'react';
import './trade.css';
import * as api from '../helpers/api';
import * as utils from '../helpers/utils';
import DeleteButton from './DeleteButton';
import Card from './Card';

function setSelected(selectedValue, index, eachSelectedIndex, setEachSelectedIndex) {
  const currentSelected = eachSelectedIndex;
  currentSelected[index] = selectedValue;
  setEachSelectedIndex(currentSelected);
}

function acceptTrade(gameId, tradeId, eachSelectedIndex) {
  const selectedIndexArray = Object.values(eachSelectedIndex);
  if (selectedIndexArray.some((value) => !value)) {
    console.log('All cards must have a selection');
    return;
  }
  const chosenCardsToReceive = { hand: [], turnedCards: [] };
  selectedIndexArray.forEach((selectedValue) => {
    let [source, cardIndex] = selectedValue.split(' ');
    if (source === 'turned') {
      source = 'turnedCards'
    }
    chosenCardsToReceive[source].push(Number(cardIndex));
  });

  if (!chosenCardsToReceive.hand.length) {
    delete chosenCardsToReceive.hand;
  }
  if (!chosenCardsToReceive.turnedCards.length) {
    delete chosenCardsToReceive.turnedCards;
  }

  api.acceptTrade(gameId, tradeId, chosenCardsToReceive)
}

function trade({ trade, gameObject }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [eachSelectedIndex, setEachSelectedIndex] = useState({});

  const tradeePlayer = gameObject.players.find((player) => player.name === trade.tradeeName);
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

  const possibleCardSources = {};
  trade.cardsToReceive.forEach((cardName) => {
    possibleCardSources[cardName] = [];
    tradeePlayer.hand.forEach((card, index) => {
      if (card.name === cardName) {
        possibleCardSources[cardName].push({
          source: 'hand',
          index,
          combined: `hand ${index}`,
        })
      }
    });
    if (utils.isActivePlayer(gameObject, tradeePlayer)) {
      gameObject.turnedCards.forEach((card, index) => {
        if (card.name === cardName) {
          possibleCardSources[cardName].push({
            source: 'turnedCards',
            index,
            combined: `turned ${index}`,
          })
        }
      });
    }
  })

  return (
    <div className="trade">
      <div className="expandable-trade-title" onClick={() => setIsExpanded(!isExpanded)}>
        <span className='tradeId'>{trade.tradeId}</span>
        <span className={`caret ${isExpanded ? 'rotated' : 'non-rotated'}`}>^</span>
        <DeleteButton
          onClick={() => api.deleteTrade(gameObject.gameId, trade.tradeId)}
        />
      </div>
      {isExpanded &&
        <div className="expandable-content trade-content">
          <div className="trader trade-participant">Trader: {trade.traderName}</div>
          <div className="tradee trade-participant">Tradee: {trade.tradeeName}</div>
          <div className="cards-to-give">
            <h2>Cards to give</h2>
            <div className="cards-to-give-content">
              {handToGive?.length &&
                <div className="source-to-give">
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
                <div className="source-to-give">
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
          <div className="cards-to-receive">
            <h2>Cards to receive</h2>
            <div className="cards-to-receive-content">
              <div className="chosen-cards-to-receive">
                {trade.cardsToReceive.map((cardName, index) => (
                  <div className="card-to-receive">
                    <select onChange={(e) => setSelected(e.target.value, index, eachSelectedIndex, setEachSelectedIndex)}>
                      <option></option>
                      {possibleCardSources[cardName].map((card) => (
                        <option value={card.combined}>{card.combined}</option>
                      ))}
                    </select>
                    <Card
                      card={gameObject.uniqueCardsInDeck[cardName]}
                    />
                  </div>
                ))}
              </div>
              <button className="accept-trade-button" onClick={() => acceptTrade(gameObject.gameId, trade.tradeId, eachSelectedIndex)}>Accept Trade</button>
            </div>
          </div>
        </div>}
    </div>
  )
}

export default trade;