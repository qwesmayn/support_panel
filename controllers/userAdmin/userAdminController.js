import userAdminService from '../../services/userAdmin/userAdminService.js';

// Получение всех администраторов
const getAllAdmins = async (req, res, next) => {
  try {
    const admins = await userAdminService.findAllAdmins();
    res.json(admins);
  } catch (error) {
    next(error); 
  }
};

// Получение одного админа по ID
const getAdminById = async (req, res, next) => {
  try {
    const admin = await userAdminService.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }
    
    const adminObject = admin.toObject();
    delete adminObject.password;
    
    res.json(adminObject);
  } catch (error) {
    next(error);
  }
};


// Добавление нового администратора
const createAdmin = async (req, res, next) => {
  try {
    // создание хеш пароля!
    const admin = await userAdminService.addAdmin(req.body);
    res.status(201).json(admin);
  } catch (error) {
    next(error); 
  }
};

// Обновление администратора
const updateAdmin = async (req, res, next) => {
  try {
    const admin = await userAdminService.updateAdmin(req.params.id, req.body);
    if (!admin) {
      const error = new Error('Администратор не найден');
      error.statusCode = 404;
      throw error;
    }
    // тут надо подумать что передать на фронт - но точно не всего админа )) 
    res.json(admin);
  } catch (error) {
    next(error); 
  }
};

// Удаление администратора
const deleteAdmin = async (req, res, next) => {
  try {
    // тут вы еще валидацию айди
    const admin = await userAdminService.deleteAdmin(req.params.id);
    if (!admin) {
      const error = new Error('Администратор не найден');
      error.statusCode = 404;
      throw error;
    }
    res.status(204).json({message:'Успешно удалили'});
  } catch (error) {
    next(error); 
  }
};

const userAdminController = {
    getAllAdmins,
    getAdminById,
    createAdmin,
    updateAdmin,
    deleteAdmin,
};

export default userAdminController;
