import jwt from 'jsonwebtoken';
import { secureConfig } from '../configInclude/secure-config.js';

export const generateToken = (user, role) => {
  return jwt.sign({ id: user._id, role }, secureConfig.tokenSecret, {
    expiresIn: secureConfig.expToken
  });
};

export const verifyToken = (allowedRoles = []) => {
  return (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      console.log('Error token');
      return res.status(401).json({ message: 'A token is required for authentication' });
    }

    console.log('Verify token ....');
    try {
      const decoded = jwt.verify(token, secureConfig.tokenSecret);
      req.user = decoded;

      if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Access denied: insufficient role' });
      }

      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired, please log in again' });
      }
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
};

export const verifyTokenAdmin = verifyToken(['admin']);

export const verifyTokenUser = verifyToken();

export const verifyTokenUniversal = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'A token is required for authentication' });
  }

  try {
    const decoded = jwt.verify(token, secureConfig.tokenSecret);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired, please log in again' });
    }
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const verifyTokenUtil = (token) => {
  try {
    return jwt.verify(token, secureConfig.tokenSecret);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new Error('Token expired');
    }
    throw new Error('Invalid token');
  }
};
