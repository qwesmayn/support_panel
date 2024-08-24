import errorHandler from '../../middlewares/errorHandler.js';
import Message from '../../models/messageModel.js';
import Ticket from '../../models/ticketModel.js';

const messages = {};

export default function messageHandlers(io, socket) {
  const { ticketId } = socket;

  const updateMessageList = () => {
      io.to(ticketId).emit('message_list:update', messages[ticketId]);
  };
  

  socket.on('message:get', async (ticketId) => {
    try {
      const _messages = await Message.find({ ticketId });
      messages[ticketId] = _messages;
      io.to(ticketId).emit('message_list:update', _messages);
    } catch (error) {
      console.error(error);
    }
  });

  socket.on('message:add', async (message) => {
    try {
      if (typeof message !== 'object' || message === null) {
        throw new Error('Invalid message format. Expected an object.');
      }
  
      message.createdAt = new Date();
      message.isRead = false;
  
      const newMessage = await Message.create(message);
  
      const updateField = message.senderType === 'admin' ? 'unreadMessagesAdminCount' : 'unreadMessagesUserCount';
  
      const updatedTicket = await Ticket.findByIdAndUpdate(
        message.ticketId,
        {
          $push: { messages: newMessage },
          $inc: { [updateField]: 1 },  
        },
        { new: true }
      ).populate("userId messages");
  
      if (!messages[ticketId]) {
        messages[ticketId] = [];
      }
      messages[ticketId].push(newMessage);
  
      updateMessageList();
  
      io.emit('ticket:update', updatedTicket);
    } catch (error) {
      console.error(error);
    }
  });
  
  
  
  socket.on('message:read', async (messageId) => {
    try {
      console.log("Роль - ", socket.role);
      const message = await Message.findById(messageId);
  
      if (message && !message.isRead) {
        message.isRead = true;
        await message.save();
  
        const updateField = socket.role === 'admin' ? 'unreadMessagesUserCount' : 'unreadMessagesAdminCount';
  
        // Обновляем тикет
        const updatedTicket = await Ticket.findByIdAndUpdate(
          message.ticketId,
          { $inc: { [updateField]: -1 } },
          { new: true }
        ).populate("userId messages");
  
        if (updatedTicket) {
          // Отправляем обновленный тикет всем клиентам
          io.emit('ticket:update', updatedTicket);
          console.log("Обновленный тикет: ", updatedTicket);
        }
      }
    } catch (error) {
      console.error("Ошибка при обработке события message:read: ", error);
    }
  });
  
  
  
  

  socket.on('message:remove', async (message) => {
    try {
      const { messageId, messageType, textOrPathToFile } = message;

      const removedMessage = await Message.findByIdAndDelete(messageId);
      if (removedMessage && removedMessage.isRead === false) {
        await Ticket.updateOne(
          { _id: ticketId },
          { $inc: { unreadMessagesCount: -1 } }
        );
      }

      if (messageType !== 'text') {
        removeFile(textOrPathToFile);
      }

      if (messages[ticketId]) {
        messages[ticketId] = messages[ticketId].filter((m) => m._id !== messageId);
      }

      updateMessageList();
    } catch (error) {
      errorHandler(error);
    }
  });
}
