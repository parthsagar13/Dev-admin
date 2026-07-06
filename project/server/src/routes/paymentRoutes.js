import { Router } from 'express';
import { createOrder, verifyPayment } from '../controllers/paymentController.js';
import { userAuthMiddleware } from '../middlewares/auth.js';
import { paymentRateLimiter } from '../middlewares/rateLimiter.js';

const router = Router();

router.post('/create-order', paymentRateLimiter, userAuthMiddleware, createOrder);
router.post('/verify', paymentRateLimiter, userAuthMiddleware, verifyPayment);

export default router;
