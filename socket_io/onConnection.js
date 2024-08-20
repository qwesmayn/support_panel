import userHandlers from './handlers/user.handlers.js';
import messageHandlers from './handlers/message.handlers.js';
import ticketHandlers from './handlers/ticket.handlers.js';

export default function onConnection(io, socket) {
  const { ticketId, role, userId, login } = socket.handshake.query;

  socket.ticketId = ticketId;
  socket.role = role; 
  socket.userId = userId;
  socket.login = login;

  socket.join(ticketId);

  userHandlers(io, socket);

  messageHandlers(io, socket);
  ticketHandlers(io, socket)

  if (socket.role === 'user') {
    socket.emit('request:tickets');
  }
}
