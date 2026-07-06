import { Router } from 'express';
import {
  getAdminOrders,
  getAdminPayments,
  getAdminDownloads,
  getAdminCustomers,
  getCommerceDashboardStats,
} from '../controllers/adminCommerceController.js';
import { adminAuthMiddleware } from '../middlewares/auth.js';

const router = Router();

router.get('/dashboard/stats', adminAuthMiddleware, getCommerceDashboardStats);
router.get('/orders', adminAuthMiddleware, getAdminOrders);
router.get('/payments', adminAuthMiddleware, getAdminPayments);
router.get('/downloads', adminAuthMiddleware, getAdminDownloads);
router.get('/customers', adminAuthMiddleware, getAdminCustomers);

export default router;
