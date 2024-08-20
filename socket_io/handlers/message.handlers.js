import errorHandler from '../../middlewares/errorHandler.js';
import Message from '../../models/messageModel.js';
import Ticket from '../../models/ticketModel.js';
import { removeFile } from '../../utils/file.js';
import upload from '../../utils/upload.js';

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


  socket.on('message:file', (formData, message) => {
    upload.single('file')(formData, null, async (err) => {
      if (err) {
        console.error('Upload error:', err);
        return;
      }

      console.log('FormData:', formData);
      console.log('File:', formData.file);
  
      try {
        const filePath = `/files/${message.ticketId}/${formData.file.filename}`;
        const newMessage = new Message({
          ...message,
          textOrPathToFile: filePath,
          messageType: 'file',
          createdAt: new Date(),
        });
  
        await newMessage.save();
        messages[message.ticketId].push(newMessage);
  
        await Ticket.updateOne(
          { _id: message.ticketId },
          { $inc: { unreadMessagesCount: 1 } }
        );
        updateMessageList();
      } catch (error) {
        console.error(error);
      }
    });
  });
  


  socket.on('message:add', async (message) => {
    try {
      if (typeof message !== 'object' || message === null) {
        throw new Error('Invalid message format. Expected an object.');
      }
  
      message.createdAt = new Date();
      message.isRead = false;
  
      const newMessage = await Message.create(message);
      console.log('Message saved:', newMessage);

      const updatedTicket = await Ticket.findByIdAndUpdate(
        message.ticketId,
        {
          $push: { messages: newMessage },
          $inc: { unreadMessagesCount: 1 },
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
      const message = await Message.findById(messageId);
      if (message && !message.isRead) {
        message.isRead = true;
        await message.save();

        await Ticket.updateOne(
          { _id: message.ticketId },
          { $inc: { unreadMessagesCount: -1 } }
        );

        updateMessageList();
      }
    } catch (error) {
      errorHandler(error);
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
