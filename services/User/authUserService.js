import bcrypt from 'bcryptjs';
import User from '../../models/userModel.js';
import { generateToken } from '../../utils/tokenUtil.js';

const authUser = async (login, password) => {
  const user = await User.findOne({ login });
  if (!user) {
    throw new Error('Invalid login or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid login or password');
  }

  const token = generateToken({ _id: user._id }, 'user'); 
  return token;
};

const authUserService = {
  authUser,
};

export default authUserService;

