import { Router } from 'express';
import { registerUser, loginUser, getMe } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Public endpoints: register & login issue a JWT
router.post('/register', registerUser);
router.post('/login', loginUser);
// Protected endpoint: returns the profile of the currently authenticated user
router.get('/me', protect, getMe);

export default router;
