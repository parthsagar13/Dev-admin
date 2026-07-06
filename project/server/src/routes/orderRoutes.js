import { Router } from 'express';
import { getMyOrders } from '../controllers/orderController.js';
import { userAuthMiddleware } from '../middlewares/auth.js';

const router = Router();

router.get('/my-orders', userAuthMiddleware, getMyOrders);

export default router;
