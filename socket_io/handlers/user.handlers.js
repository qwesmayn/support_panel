const users = {};
const messages = {};

export default function userHandlers(io, socket) {
  const { ticketId, userName } = socket;

  if (!users[ticketId]) {
    users[ticketId] = [];
  }

  const updateUserList = () => {
    io.to(ticketId).emit('user_list:update', users[ticketId]);
  };

  // Обработка присоединения пользователя к тикету
  socket.on('join_ticket', (newTicketId) => {
    if (ticketId) {
      socket.leave(ticketId);
    }
    socket.ticketId = newTicketId; // Обновляем ticketId для сокета
    socket.join(newTicketId);
    const existingMessages = messages[newTicketId] || [];
    socket.emit('message_list:update', existingMessages);

    // Обновляем список пользователей
    updateUserList();
  });

  // Добавление нового пользователя
  socket.on('user:add', async (user) => {
    user.socketId = socket.id;
    users[ticketId].push(user);
    socket.join(ticketId);

    socket.to(ticketId).emit('log', `User ${userName} connected`);
    updateUserList();
  });

  socket.on('disconnect', () => {
    if (!users[ticketId]) return;

    users[ticketId] = users[ticketId].filter((u) => u.socketId !== socket.id);
    socket.to(ticketId).emit('log', `User ${userName} disconnected`);
    updateUserList();
  });
}
