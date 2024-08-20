import UserAdmin from "../../models/userAdminModel.js";
import { generateToken } from "../../utils/tokenUtil.js";
import {comparePassword, generateNewPassword} from "../../utils/passwordAdminUtil.js"

const authAdmin = async (login, password) => {
  const user = await UserAdmin.findOne({ login });
  if (!user) {
    throw new Error('Неверный логин или пароль');
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new Error('Неверный логин или пароль');
  }

  return generateToken(user._id, 'admin');
};

const resetPassword = async (login) => {
  const newPassword = generateNewPassword();
  return newPassword;
};

const authAdminService = {
  authAdmin,
  resetPassword,
};

export default authAdminService;
