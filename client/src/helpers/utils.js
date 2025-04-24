export function getCurrentUrl() {
  const url = location.href.slice(0, -1).split('/').pop();
  console.log(url);
  return url;
}

export function isActivePlayer(gameObject, player) {
  return gameObject.activePlayerIndex === player.index;
}

export function getActivePlayer(gameObject) {
  return gameObject.players.find((player) => gameObject.activePlayerIndex === player.index);
}
