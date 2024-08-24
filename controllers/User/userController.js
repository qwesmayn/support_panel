import userService from "../../services/User/userService.js";

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.findAll();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const getUsertById = async (req, res, next) => {
  try {
    const user = await userService.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "user not found." });
    }

    const userObject = user.toObject();
    delete userObject.password;

    res.json(userObject);
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || "00.00.00.000";
    const user = await userService.add({ ...req.body, ip });
  
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};


const updateUser = async (req, res, next) => {
  try {
    const user = await userService.update(req.params.id, req.body);
    if (!user) {
      return res.status(404).json({ message: "user not found." });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await userService.del(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found or already deleted." });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const userController = {
  getAllUsers,
  getUsertById,
  createUser,
  updateUser,
  deleteUser
};

export default userController;
