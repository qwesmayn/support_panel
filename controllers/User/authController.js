import authUserService from "../../services/User/authUserService.js";
import { verifyTokenUtil } from "../../utils/tokenUtil.js";

const loginUser = async (req, res, next) => {
  try {
    const { login, password } = req.body;
    const token = await authUserService.authUser(login, password);
    res.json({ token });
  } catch (error) {
    next(error);
  }
};

const verifyAndRenewToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = verifyTokenUtil(token);
    const newToken = generateToken({ _id: decoded.id, role : "user" });
    res.json({ token: newToken });
  } catch (err) {
    if (err.message === 'Token expired') {
      return res.status(401).json({ message: 'Token expired - please login again' });
    }
    res.status(401).json({ message: 'Invalid token' });
  }
};

const authUserController = {
  loginUser,
  verifyAndRenewToken,
};

export default authUserController;
