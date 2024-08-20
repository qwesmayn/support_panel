import Ticket from "../models/ticketModel.js";


// Получение всех тикетов
const findAllTickets = async () => {
  try {
    return await Ticket.find().populate('userId assignedAdminId messages');
  } catch (error) {
    throw new Error('Error fetching all tickets: ' + error.message);
  }
};

const findAllTicketsUser = async (userId) => {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      return await Ticket.find({ userId })
        .populate('userId assignedAdminId messages');
    } catch (error) {
      throw new Error('Error fetching all tickets: ' + error.message);
    }
  };
  

// Получение тикета по ID
const findTicketById = async (id) => {
  try {
    return await Ticket.findById(id).populate('userId assignedAdminId messages');
  } catch (error) {
    throw new Error('Error fetching ticket by id: ' + error.message);
  }
};

// Создание нового тикета
const addTicket = async (ticketData) => {
  try {
    const ticket = new Ticket(ticketData);
    return await ticket.save();
  } catch (error) {
    throw new Error('Error adding new ticket: ' + error.message);
  }
};


const ticketService = {
    findAllTickets,
    findAllTicketsUser,
    findTicketById,
    addTicket,
};

export default ticketService;
