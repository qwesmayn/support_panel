import Message from "../models/messageModel.js";
import Ticket from "../models/ticketModel.js";
import upload from "../utils/uploadUtil.js";
import express from "express";

const routerMessage = express.Router();

routerMessage.post('/send', upload.single('file'), async (req, res) => {
  try {
    const { ticketId, userId, senderType, login } = req.body;
    const file = req.file;
    const textOrPathToFile = file ? `/files/${file.filename}` : req.body.textOrPathToFile;

    const message = new Message({
      messageType : "file",
      textOrPathToFile,
      ticketId,
      userId,
      senderType,
      login
    });

    const savedMessage = await message.save();

    const updateField = senderType === 'admin' ? 'unreadMessagesAdminCount' : 'unreadMessagesUserCount';
    const updatedTicket = await Ticket.findByIdAndUpdate(
      ticketId,
      {
        $push: { messages: savedMessage._id },
        $inc: { [updateField]: 1 }
      },
      { new: true }
    ).populate("userId messages");

    req.io.to(ticketId).emit('message_list:update', updatedTicket.messages);

    req.io.emit('ticket:update', updatedTicket);

    res.status(201).json({ message: 'Message saved successfully', data: message });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default routerMessage;
