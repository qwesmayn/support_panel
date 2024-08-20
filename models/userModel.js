import mongoose from 'mongoose';
import { configServer } from '../configInclude/server-config.js';

const { Schema } = mongoose;

const userSchema = new Schema({
  login: {
    type: String,
    required: [true, 'Имя пользователя обязательно']
  },
  password: {
    type: String,
    required: [true, 'Пароль обязателен']
  },
  country: {
    type: String,
    required: [true, 'Страна обязательна']
  },
  ip: {
    type: String,
    required: [true, 'IP адрес обязателен']
  },
  chromeVersion: {
    type: String,
    required: [true, 'Версия Chrome обязательна']
  },
  avatar: {
    type: String,
    required: false,
    default: null
  }
}, {
  timestamps: true
});

const User = mongoose.model(configServer.collections.user, userSchema);

export default User;
