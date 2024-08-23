import mongoose from 'mongoose';
import { configServer } from '../configInclude/server-config.js';
import User from './userModel.js';

const { Schema } = mongoose;

const ticketSchema = new Schema(
    {
      status: {
        type: String,
        required: true,
        enum: ['open', 'closed'],
        default: 'open'
      },
      isPinned: {
        type: Boolean,
        default: false
      },
      unreadMessagesUserCount: {
        type: Number,
        default: 0
      },
      unreadMessagesAdminCount: {
        type: Number,
        default: 0
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: configServer.collections.user,
        required: true
      },
      messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: configServer.collections.message,
        default : []
      }],
    },
    {
      timestamps: true
    }
  );
  

const Ticket = mongoose.model(configServer.collections.ticket, ticketSchema);

export default Ticket;
