export function getTokenFromSessionStorage() {
  return sessionStorage.getItem('token');
}

export function saveTokenInSessionStorage(token) {
  sessionStorage.setItem('token', token);
}

export function clearSessionStorage() {
  sessionStorage.clear();
}