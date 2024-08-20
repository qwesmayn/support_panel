import bcrypt from 'bcryptjs';
import User from '../../models/userModel.js';
import { generateToken } from '../../utils/tokenUtil.js';

// Получение всех
const findAll = async () => {
  try {
    return await User.find();
  } catch (error) {
    throw new Error('Error fetching all users: ' + error.message);
  }
};

// Получение одного  по ID
const findById = async (id) => {
    try {
      return await User.findById(id);
    } catch (error) {
      throw new Error('Error finding user: ' + error.message);
    }
  };

// Добавление нового
const add = async (userData) => {
  const hashedPassword = await bcrypt.hash(userData.password, 12);
  userData.password = hashedPassword;
  try {
    const user = new User(userData);
    await user.save();
    
    const token = generateToken({ _id: user._id }, 'user');
    
    return {token };
  } catch (error) {
    throw new Error('Error adding new user: ' + error.message);
  }
};

// Обновление пользователя
const update = async (id, data) => {
  try {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 12);
    }
    return await User.findByIdAndUpdate(id, data, { new: true });
  } catch (error) {
    throw new Error('Error updating user: ' + error.message);
  }
};

// Удаление пользователя
const del = async (id) => {
  try {
    return await User.findByIdAndDelete(id);
  } catch (error) {
    throw new Error('Error deleting user: ' + error.message);
  }
};

const userService = {
    findAll,
    findById,
    add,
    update,
    del
};

export default userService;
