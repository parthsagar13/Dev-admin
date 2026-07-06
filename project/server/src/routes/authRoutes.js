import { Router } from 'express';
import {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  googleLoginPlaceholder,
  getMe,
} from '../controllers/userAuthController.js';
import { userAuthMiddleware } from '../middlewares/auth.js';
import { authRateLimiter } from '../middlewares/rateLimiter.js';

const router = Router();

router.post('/register', authRateLimiter, register);
router.post('/login', authRateLimiter, login);
router.post('/logout', logout);
router.post('/forgot-password', authRateLimiter, forgotPassword);
router.post('/reset-password', authRateLimiter, resetPassword);
router.post('/google', googleLoginPlaceholder);
router.get('/me', userAuthMiddleware, getMe);

export default router;
