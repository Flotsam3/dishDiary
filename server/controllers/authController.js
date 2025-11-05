import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';

// Cookie options
const cookieOptions = () => {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    // default 1 hour
    maxAge: Number(process.env.COOKIE_MAX_AGE_MS || 1000 * 60 * 60)
  };
};

// Register a new user
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password
    });

    await user.save();

    // Generate JWT and set as httpOnly cookie
    const token = generateToken({ userId: user._id });
    res.cookie('token', token, cookieOptions());
    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ msg: "Error registering user", error: error.message });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user and select password (since it's excluded by default)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    // Generate JWT and set cookie
    const token = generateToken({ userId: user._id });
    res.cookie('token', token, cookieOptions());
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ msg: "Error logging in", error: error.message });
  }
};

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ msg: "Error getting user", error: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie('token', cookieOptions());
    return res.json({ msg: 'Logged out' });
  } catch (err) {
    return res.status(500).json({ msg: 'Error logging out', error: err.message });
  }
};