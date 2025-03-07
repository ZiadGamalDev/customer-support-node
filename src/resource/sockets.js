// import chatSocket from '../modules/chat/chat.socket.js';

const resourceSockets = (socket, io) => {
  console.log('User connected with id:', socket.id);

  // chatSocket(socket, io);

  socket.on('disconnect', () => console.log('User disconnected with id:', socket.id));
};

export default resourceSockets;
