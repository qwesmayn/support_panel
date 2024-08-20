import mongoose from 'mongoose';
import { configServer } from '../configInclude/server-config.js';

const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    messageId: {
      type: String,
      required: true,
      unique: true
    },
    messageType: {
      type: String,
      required: true
    },
    textOrPathToFile: {
      type: String,
      required: true
    },
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: configServer.collections.ticket,
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'senderType',
      required: true
    },  
    senderType: {
      type: String,
      required: true,
      enum: ['user', 'admin'],
    },
    login: {
      type: String,
      required: true
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);


const Message = mongoose.model(configServer.collections.message, messageSchema);

export default Message;