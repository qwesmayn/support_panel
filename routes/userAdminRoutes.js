import express from 'express';
import { verifyTokenAdmin } from '../utils/tokenUtil.js';
import authAdminController from '../controllers/userAdmin/authController.js';
import userAdminController from '../controllers/userAdmin/userAdminController.js';

const routerUserAdmin = express.Router();

routerUserAdmin.get('/', verifyTokenAdmin, userAdminController.getAllAdmins);
routerUserAdmin.get('/:id', verifyTokenAdmin, userAdminController.getAdminById);
routerUserAdmin.post('/', verifyTokenAdmin, userAdminController.createAdmin);
routerUserAdmin.put('/:id', verifyTokenAdmin, userAdminController.updateAdmin);
routerUserAdmin.delete('/:id', verifyTokenAdmin, userAdminController.deleteAdmin);

routerUserAdmin.post('/login', authAdminController.loginAdmin);
routerUserAdmin.post('/renew-token', verifyTokenAdmin,);

export default routerUserAdmin;
