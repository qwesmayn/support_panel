import express from 'express';
import { verifyTokenAdmin, verifyTokenUser } from '../utils/tokenUtil.js';
import authUserController from '../controllers/User/authController.js';
import userController from '../controllers/User/userController.js';

const routerUser = express.Router();

routerUser.get('/', verifyTokenUser, userController.getAllUsers);
routerUser.get('/:id', verifyTokenUser, userController.getUsertById);
routerUser.post('/create', userController.createUser);
routerUser.delete('/:id', verifyTokenAdmin, userController.deleteUser);

routerUser.post('/login', authUserController.loginUser);
routerUser.post('/renew-token', verifyTokenUser);

export default routerUser;
