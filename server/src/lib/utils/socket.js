let theSocket;
const setupSocket = (io) => {
  theSocket = io;
  theSocket.on('connection', (socket) => {
    console.log('Socket connected');
    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
  });
};

const getSocket = () => {
  if (!theSocket) {
    throw new Error('Socket not initialized');
  }
  return theSocket;
};

module.exports = {
  setupSocket,
  getSocket,
};
