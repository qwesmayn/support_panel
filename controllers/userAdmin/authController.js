import authAdminService from "../../services/userAdmin/authAdminService.js";
import { verifyTokenAdmin } from "../../utils/tokenUtil.js";

const loginAdmin = async (req, res, next) => {
  try {
    const { login, password } = req.body;
    const token = await authAdminService.authAdmin(login, password);
    res.json({ token });
  } catch (error) {
    next(error);
  }
};

const verifyAndRenewTokenAdmin = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const decoded = verifyTokenAdmin(token);
    const newToken = verifyTokenAdmin({ _id: decoded.id}, decoded.role);
    res.json({ token: newToken });
  } catch (err) {
    if (err.message === 'Token expired') {
      return res.status(401).json({ message: 'Token expired - please login again' });
    }
    res.status(401).json({ message: 'Invalid token' });
  }
};

const authAdminController = {
  loginAdmin,
  verifyAndRenewTokenAdmin,
};

export default authAdminController;
