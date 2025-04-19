import io from 'socket.io-client';
import { useEffect, useState, useRef } from 'react';

import './games.css'
import * as api from '../helpers/api'
import Game from './Game.jsx'

const socket = io()

function Games() {
  const [games, setGames] = useState([]);
  const gamesRef = useRef(games);

  console.log(`href: ${location.href}`);

  useEffect(() => {
    gamesRef.current = games;
  }, [games]);

  useEffect(async () => {
    socket.on('gameObjectUpdated', (newGameObject) => {
      console.log('gameObjectUpdated');
      const newGames = [...gamesRef.current];
      const currentGameIndex = newGames.findIndex((game) => game.gameId === newGameObject.gameId);
      if (currentGameIndex === -1) {
        newGames.push(newGameObject);
      } else {
        newGames[currentGameIndex] = newGameObject;
      }
      setGames(newGames);
    });

    socket.on('gameObjectDeleted', (deletedGameId) => {
      console.log('gameObjectDeleted');
      const newGames = [...(gamesRef.current.filter((game) => game.gameId !== deletedGameId))];
      setGames(newGames);
    });
    
    try {
      const response = await api.getAllGames();
      console.log(response);
      setGames(response);
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  }, []);

  return (
    <div>
      {games.map((gameObject) => (
        <Game 
          gameObject={gameObject}
        />
      ))}
    </div>
  )
}

export default Games