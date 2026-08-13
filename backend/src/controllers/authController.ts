import { Response } from 'express';
import bcrypt from 'bcryptjs';
import User, { IUser } from '../models/User';
import { generateToken } from '../utils/generateToken';
import { AuthRequest } from '../middleware/authMiddleware';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Returns the user object with all sensitive fields removed
const safeUser = (user: IUser) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
});

export const registerUser = async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ success: false, message: 'Name, email and password are required' });
    return;
  }

  if (!EMAIL_REGEX.test(email)) {
    res.status(400).json({ success: false, message: 'Please provide a valid email address' });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    return;
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    res.status(400).json({ success: false, message: 'User already exists with this email' });
    return;
  }

  const user = await User.create({ name, email, password });

  res.status(201).json({
    success: true,
    data: {
      user: safeUser(user),
      token: generateToken(user._id.toString()),
    },
  });
};

export const loginUser = async (req: AuthRequest, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ success: false, message: 'Email and password are required' });
    return;
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    res.status(401).json({ success: false, message: 'Invalid email or password' });
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401).json({ success: false, message: 'Invalid email or password' });
    return;
  }

  res.json({
    success: true,
    data: {
      user: safeUser(user),
      token: generateToken(user._id.toString()),
    },
  });
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  const user = req.user as IUser;
  res.json({ success: true, data: safeUser(user) });
};
