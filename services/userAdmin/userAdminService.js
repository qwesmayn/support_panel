import UserAdmin from "../../models/userAdminModel.js";
import bcrypt from 'bcryptjs';

// Получение всех администраторов
const findAllAdmins = async () => {
  try {
    return await UserAdmin.find();
  } catch (error) {
    throw new Error('Error fetching all admins: ' + error.message);
  }
};

const findById = async (id) => {
  try {
    return await UserAdmin.findById(id);
  } catch (error) {
    throw new Error('Error fetching admin by id: ' + error.message);
  }
};

// Добавление нового администратора
const addAdmin = async (adminData) => {
  try {
    const hashedPassword = await bcrypt.hash(adminData.password, 12);
    adminData.password = hashedPassword;

    const admin = new UserAdmin(adminData);
    return await admin.save();
  } catch (error) {
    throw new Error('Error adding new admin: ' + error.message);
  }
};

// Обновление администратора
const updateAdmin = async (id, adminData) => {
  try {
    return await UserAdmin.findByIdAndUpdate(id, adminData, { new: true });
  } catch (error) {
    throw new Error('Error updating admin: ' + error.message);
  }
};

// Удаление администратора
const deleteAdmin = async (id) => {
  try {
    return await UserAdmin.findByIdAndDelete(id);
  } catch (error) {
    throw new Error('Error deleting admin: ' + error.message);
  }
};

const userAdminService = {
    findAllAdmins,
    findById,
    addAdmin,
    updateAdmin,
    deleteAdmin,
};

export default userAdminService;