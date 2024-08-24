import { nanoid } from "nanoid";
import Message from "../../models/messageModel.js";
import Ticket from "../../models/ticketModel.js";

export default function ticketHandlers(io, socket) {
  // Обработка события запроса тикетов
  socket.on("request:tickets", async () => {
    try {
      if (socket.user.role === 'admin') {
        // Админ получает все тикеты
        const tickets = await Ticket.find().populate("userId messages");
        socket.emit("ticket:all", tickets);
      } else {
        // Пользователь получает только свои тикеты
        const userId = socket.user.id; 
  
        if (!userId) {
          socket.emit("ticket:all", []);
          return;
        }
  
        const tickets = await Ticket.find({ userId: userId }).populate("userId messages");
        socket.emit("ticket:all", tickets);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  });

  socket.on("ticket:add", async (data) => {
    try {
      const newTicket = await Ticket.create({
        userId: socket.user.id,
        unreadMessagesUserCount : 1
      });

        const newMessage = {
          textOrPathToFile: data.description,
          messageId : nanoid(),
          messageType: "text",
          ticketId: newTicket._id,
          userId: socket.user.id,
          senderType: socket.user.role,
          login: socket.login,
      };

      const createdMessage = await Message.create(newMessage);
      newTicket.messages.push(createdMessage._id);
      await newTicket.save();
  
      const populatedTicket = await newTicket.populate("userId messages");
  
      io.emit("ticket:update", populatedTicket);
    } catch (error) {
      console.error("Error creating ticket:", error);
    }
  });
  

  // Обработка других событий, связанных с тикетами
  socket.on("ticket:pin", async (ticketId) => {
    try {
      const ticket = await Ticket.findByIdAndUpdate(
        ticketId,
        { isPinned: true },
        { new: true }
      ).populate("userId messages");
      io.emit("ticket:update", ticket);
    } catch (error) {
      console.error("Error pinning ticket:", error);
    }
  });

  socket.on("ticket:unpin", async (ticketId) => {
    try {
      const ticket = await Ticket.findByIdAndUpdate(
        ticketId,
        { isPinned: false },
        { new: true }
      ).populate("userId messages");
      io.emit("ticket:update", ticket);
    } catch (error) {
      console.error("Error unpinning ticket:", error);
    }
  });
  

  socket.on("ticket:close", async (ticketId) => {
    try {
      const ticket = await Ticket.findByIdAndUpdate(
        ticketId,
        { status: "closed" },
        { new: true }
      ).populate("userId messages");
      io.emit("ticket:update", ticket); // Уведомляем всех клиентов об изменении тикета
    } catch (error) {
      console.error("Error closing ticket:", error);
    }
  });
}
