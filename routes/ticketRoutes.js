import express from 'express';
import {verifyToken, verifyTokenAdmin } from '../utils/tokenUtil.js';
import ticketController from '../controllers/ticketController.js';

const routerTicket = express.Router();

routerTicket.get('/', verifyTokenAdmin, ticketController.getAllTickets);
routerTicket.get('/user/:userId', verifyTokenAdmin, ticketController.getAllTicketsByUser);
routerTicket.get('/:ticketId/', verifyTokenAdmin, ticketController.getTicketById);
routerTicket.post('/', ticketController.createTicket);

export default routerTicket;
