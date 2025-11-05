import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export const authenticate = async (req, res, next) => {
  try {
    // Support token from httpOnly cookie first, fall back to Authorization header
    const token = req.cookies?.token || (req.headers['authorization'] && req.headers['authorization'].split(' ').at(-1));

    if (!token) return res.status(401).json({ msg: 'Authentication failed' });

    const decoded = verifyToken(token);
    
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ msg: "User not found!" });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ msg: "Authentication error!" });
  }
};

// Optional authentication: if token present, attach user, otherwise continue anonymously
export const optionalAuthenticate = async (req, res, next) => {
  try {
    const token = req.cookies?.token || (req.headers['authorization'] && req.headers['authorization'].split(' ').at(-1));
    if (!token) return next();
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId);
    if (user) req.user = user;
    return next();
  } catch (err) {
    // On any error, don't block the request; proceed without user
    return next();
  }
};