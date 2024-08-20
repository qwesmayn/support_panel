import ticketService from "../services/ticketService.js";

// Получение всех тикетов
const getAllTickets = async (req, res, next) => {
  try {
    const tickets = await ticketService.findAllTickets();
    res.json(tickets);
  } catch (error) {
    next(error); 
  }
};

// Получение всех тикетов юзера
const getAllTicketsByUser = async (req, res, next) => {
    try {
      const tickets = await ticketService.findAllTicketsUser(req.params.userId);
      res.json(tickets);
    } catch (error) {
      next(error); 
    }
  };

// Получение тикета по ID
const getTicketById = async (req, res, next) => {
  try {
    const ticket = await ticketService.findTicketById(req.params.ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found." });
    }
    res.json(ticket);
  } catch (error) {
    next(error);
  }
};

// Создание нового тикета
const createTicket = async (req, res, next) => {
  try {
    const ticket = await ticketService.addTicket(req.body);
    res.status(201).json(ticket);
  } catch (error) {
    next(error); 
  }
};

const ticketController = {
    getAllTickets,
    getAllTicketsByUser,
    getTicketById,
    createTicket,
};

export default ticketController;
