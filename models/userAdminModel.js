import mongoose from 'mongoose';
import { configServer } from '../configInclude/server-config.js';

const { Schema } = mongoose;

const userAdminSchema = new Schema({
  login: {
    type: String,
    required: [true, 'Имя пользователя обязательно']
  },
  password: {
    type: String,
    required: [true, 'Пароль обязателен'],
  },
  avatar: {
    type: String,
    required: false,
    default: null
  }
}, {
  timestamps: true
});

const UserAdmin = mongoose.model(configServer.collections.userAdmin, userAdminSchema);

export default UserAdmin;
